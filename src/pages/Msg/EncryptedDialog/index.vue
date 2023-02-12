<template>
  <div class="encrypted-dialog">
    <div class="encrypted-dialog-top">
      <div class="back" @click="back">
        <img src="../../../assets/images/left.png" v-show="!dialogShow" />
      </div>
      <div class="encrypted-dialog-top-portraits" :class="{ dialogShow }">
        <div
          class="portrait-boxs"
          v-for="item in allEncryptedMsgs"
          :key="item.friendId"
        >
          <img
            :src="item.imgUrl"
            @click="changeFriend(item.friendId)"
            :class="{
              portaitBoder: msgItem && msgItem.friendId == item.friendId,
            }"
          />
        </div>
      </div>
    </div>
    <ul class="encrypted-dialog-ul">
      <li
        class="encrypted-dialog-li"
        v-for="item in allEncryptedMsgs"
        :key="item.friendId"
        @click="intoDialog(item.friendId)"
      >
        <div class="li-tip" v-show="item.unReadNum > 0">
          {{ item.unReadNum }}
        </div>
        <img :src="item.imgUrl" />
        <div class="li-main">
          <div class="li-title">
            <span>{{ item.nickname ? item.nickname : item.name }}</span>
            <span>{{ formatDateTime(item.lastTime) }}</span>
          </div>
          <div class="li-content">
            {{ item.lastMsg }}
          </div>
        </div>
      </li>
    </ul>
    <div class="dialog" :class="{ dialogShow }">
      <div class="dialog-top">
        <span></span>
        <div class="dialog-top-title">
          {{ (msgItem && msgItem.nickname) || (msgItem && msgItem.name) }}
        </div>
        <img src="../../../assets/images/x.png" @click="toggleMsg" />
      </div>
      <div class="dialog-main" ref="dialogMain">
        <ul class="msg-ul">
          <li
            v-for="item in msgItem && msgItem.allMsgs"
            :key="item._id"
            :class="item.friendId == friendId ? 'msg-ul-right' : 'msg-ul-left'"
          >
            <div class="msg-li-content">{{ item.content }}</div>
            <div class="msg-li-time">{{ formatDateTime(item.time) }}</div>
          </li>
        </ul>
      </div>
      <div class="dialog-input">
        <div class="dialog-input-content">
          <div
            contenteditable="true"
            ref="dialogInputContent"
            @input="moveToBottom"
            @focus="moveToBottom"
          ></div>
          <img
            src="../../../assets/images/keyboard.png"
            @click="toggleType"
            v-if="isEmoji"
          />
          <img
            src="../../../assets/images/emoji.png"
            @click="toggleType"
            v-else
          />
        </div>
        <div class="dialog-input-send">
          <img src="../../../assets/images/send.png" @click="send" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JSEncrypt from "jsencrypt";
export default {
  name: "EncryptedDialog",
  data() {
    return {
      dialogShow: false,
      friendId: "",
      isEmoji: false,
    };
  },
  methods: {
    back() {
      this.$router.back();
      this.$bus.$emit("showTabBar");
    },

    // 进入对话
    intoDialog(friendId) {
      this.friendId = friendId;

      this.toggleMsg();

      this.$nextTick(() => {
        this.moveToBottom();
        this.readMsg(friendId);
      });
    },

    // 切换显示隐藏对话窗
    toggleMsg() {
      this.dialogShow = !this.dialogShow;
      if (!this.dialogShow) {
        this.friendId = "";
      }
    },

    // 切换键盘
    toggleType() {
      this.isEmoji = !this.isEmoji;
      if (this.isEmoji) {
        this.$refs.dialogInputContent.blur();
      } else {
        this.$refs.dialogInputContent.focus();
      }
    },

    // 发送消息
    send() {
      let content = this.$refs.dialogInputContent.innerText.trim();
      if (content == "") {
        return;
      }
      let userId = this.$store.state.User.userInfo._id;
      let friendId = this.friendId;
      let time = new Date();
      let msg = {
        userId,
        friendId,
        content,
        types: "0",
        time,
        encrypted: true,
      };

      if (this.msgItem) {
        // 添加进数组并更改最后消息和时间，socket 发送消息
        this.msgItem.allMsgs.push(msg);
        this.msgItem.lastMsg = content;
        this.msgItem.lastTime = time;
      } else {
        // 如果没有当前会话则新建消息项
        let data = {};
        data.allMsgs = [msg];
        data.friendId = msg.friendId;
        data.lastMsg = msg.content;
        data.lastTime = msg.time;
        data.unReadNum = 0;

        let friendInfo = this.$store.state.Friend.friends.find(
          (item) => item._id == msg.friendId
        );
        data.imgUrl = friendInfo.imgUrl;
        data.name = friendInfo.name;
        data.nickname = friendInfo.nickname;

        this.$store.state.Chat.allEncryptedMsgs.unshift(data);
      }

      // 加密后发送
      // 重新打开软件后看不到自己发的消息，原因是自己发的消息是由对方公钥加密的，故需要同时使用自己的公钥加密一次存储，用|分隔
      let newMsg = { ...msg };
      let friendPublicKey = this.friends.find(
        (item) => item._id == this.friendId
      ).publicKey;

      let jsEncrypt = new JSEncrypt();

      // 对方公钥加密
      jsEncrypt.setPublicKey(friendPublicKey);
      let oppositeEncrypted = jsEncrypt.encrypt(newMsg.content);
      // 自己公钥加密
      jsEncrypt.setPublicKey(this.$store.state.User.userInfo.publicKey);
      let ownEncrypted = jsEncrypt.encrypt(newMsg.content);

      newMsg.content = `${oppositeEncrypted}|${ownEncrypted}`;

      this.$socket.emit("sendMsg", newMsg);

      this.$refs.dialogInputContent.innerText = "";
      this.$nextTick(() => {
        this.moveToBottom();
      });

      this.$refs.dialogInputContent.focus();
    },

    // 消息盒子滚至底部
    moveToBottom() {
      // this.$refs.dialogMain.scrollHeight - this.$refs.dialogInput.offsetTop
      setTimeout(() => {
        this.$refs.dialogMain &&
          this.$refs.dialogMain.scrollTo(0, this.$refs.dialogMain.scrollHeight);
      }, 100);
    },

    // 格式化时间
    formatDateTime(date) {
      if (date == "" || !date) {
        return "";
      }
      let newDate = new Date(date);
      let y = newDate.getFullYear();
      let m = newDate.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = newDate.getDate();
      d = d < 10 ? "0" + d : d;
      let h = newDate.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = newDate.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      // let second = newDate.getSeconds()
      // second = second < 10 ? ('0' + second) : second

      let nowDate = new Date();
      let differDays = new Date(nowDate - newDate).getDate();
      if (nowDate.getFullYear - y > 0) {
        return `${y}-${m}-${d} ${h}:${minute}`;
      } else if (differDays > 7) {
        return `${m}-${d} ${h}:${minute}`;
      } else if (differDays > 3 && differDays <= 7) {
        let weeks = newDate.getDay();
        switch (weeks) {
          case 0:
            return `星期日 ${h}:${minute}`;
          case 1:
            return `星期一 ${h}:${minute}`;
          case 2:
            return `星期二 ${h}:${minute}`;
          case 3:
            return `星期三 ${h}:${minute}`;
          case 4:
            return `星期四 ${h}:${minute}`;
          case 5:
            return `星期五 ${h}:${minute}`;
          case 6:
            return `星期六 ${h}:${minute}`;
          default:
            return `${m}-${d} ${h}:${minute}`;
        }
      } else if (differDays > 2) {
        return `前天 ${h}:${minute}`;
      } else if (differDays > 1) {
        return `昨天 ${h}:${minute}`;
      } else {
        return `${h}:${minute}`;
      }
    },

    // 点击头像更换聊天对象
    changeFriend(id) {
      this.friendId = id;
    },

    // 已读消息
    readMsg(friendId) {
      if (this.msgItem) {
        this.msgItem.unReadNum = 0;
        this.$API.readFriendEncryptedMsgs({ friendId });
      }
    },
  },
  computed: {
    allEncryptedMsgs() {
      return this.$store.state.Chat.allEncryptedMsgs;
    },
    msgItem() {
      return this.$store.state.Chat.allEncryptedMsgs.find(
        (item) => item.friendId == this.friendId
      );
    },
    friends() {
      return this.$store.state.Friend.friends;
    },
  },
  mounted() {
    // 在聊天页中，新收到的消息自动设为已读
    this.$bus.$on("autoReadEncryptedMsg", () => {
      if (this.friendId) {
        this.moveToBottom();
        this.readMsg(this.friendId);
      }
    });

    this.$bus.$on("intoDialog", this.intoDialog);
  },
};
</script>

<style lang="less" scoped>
.encrypted-dialog {
  background: #F0F3F8;
  height: 100vh;
  position: relative;
  .encrypted-dialog-top {
    height: 60px;
    display: flex;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #ededed;
    position: relative;
    overflow: hidden;
    .back {
      width: 60px;
      text-align: center;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .encrypted-dialog-top-portraits {
      position: absolute;
      top: 100vh;
      left: 60px;
      flex: 1;
      max-width: calc(100% - 60px);
      height: 60px;
      transition: all 0.4s ease-out;
      overflow-x: scroll;
      white-space: nowrap;
      display: flex;
      align-items: center;
      .portrait-boxs {
        width: 50px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s;
          &.portaitBoder {
            border: 3px solid #607d8b;
          }
        }
      }
      &.dialogShow {
        top: 0;
      }
    }
  }
  .encrypted-dialog-ul {
    width: 100%;
    height: calc(100vh - 60px);
    overflow: scroll;
    box-sizing: border-box;
    .encrypted-dialog-li {
      width: 100%;
      height: 80px;
      padding: 0 20px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #ededed;
      &:active {
        background: #f9f9f9;
      }
      .li-tip {
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        border-radius: 10px;
        color: #fff;
        background: #fa5252;
        position: absolute;
        bottom: 15px;
        right: 20px;
        text-align: center;
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 20%;
        margin-right: 8px;
      }
      .li-main {
        flex: 1;
        height: 80px;
        padding: 15px 0;
        overflow: hidden;
        box-sizing: border-box;
        .li-title {
          width: 100%;
          height: 25px;
          box-sizing: border-box;
          span:nth-child(1) {
            font-size: 18px;
          }
          span:nth-child(2) {
            float: right;
            color: #999;
            font-size: 12px;
          }
        }
        .li-content {
          width: 80%;
          height: 25px;
          color: #999;
          font-weight: bold;
          line-height: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          letter-spacing: 1.5px;
        }
      }
    }
  }
  .dialog {
    width: 100%;
    height: calc(100vh - 60px);
    position: fixed;
    top: 100%;
    left: 0;
    transition: all 0.3s;
    z-index: 999;
    background: #f9f9f9;
    box-sizing: border-box;
    &.dialogShow {
      top: 60px;
    }
    .dialog-top {
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #ededed;
      span {
        width: 15px;
      }
      .dialog-top-title {
        flex: 1;
        font-size: 18px;
        text-align: center;
      }
      img {
        width: 15px;
        height: 15px;
      }
    }
    .dialog-main {
      padding: 0 20px;
      height: calc(100vh - 180px);
      overflow: scroll;
      .msg-ul {
        list-style: none;
        li {
          padding: 5px 0;
          max-width: 80%;
          // 使得盒子宽度和文本宽度一样
          width: fit-content;
          width: -webkit-fit-content;
          width: -moz-fit-content;
          .msg-li-time {
            font-size: 12px;
          }
        }
        .msg-ul-left {
          .msg-li-content {
            background: #e7f0f7;
            border-radius: 20px;
            border-bottom-left-radius: 10px;
            padding: 10px;
          }
          .msg-li-time {
            padding-left: 5px;
          }
        }
        .msg-ul-right {
          margin-left: auto;
          .msg-li-content {
            background: #607d8b;
            border-radius: 20px;
            border-bottom-right-radius: 10px;
            padding: 10px;
            color: #ffffff;
          }
          .msg-li-time {
            text-align: end;
            padding-right: 5px;
          }
        }
      }
    }
    .dialog-input {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      width: 90%;
      min-height: 50px;
      background: #e7f0f7;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-radius: 15px;
      padding-left: 10px;
      .dialog-input-content {
        flex: 1;
        font-size: 20px;
        margin-bottom: 5px;
        display: flex;
        align-items: flex-end;
        div {
          flex: 1;
          outline: none;
          padding: 5px 0 5px 10px;
          max-height: 200px;
          overflow: scroll;
        }
        img {
          width: 30px;
          height: 30px;
          margin: 5px;
        }
      }
      .dialog-input-send {
        width: 50px;
        margin-bottom: 8px;
        text-align: center;
        box-sizing: border-box;
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>