<template>
  <div class="group-dialog">
    <div class="group-dialog-top">
      <div class="back" @click="back">
        <img src="../../../assets/images/left.png" v-show="!dialogShow" />
      </div>
      <div class="group-dialog-top-portraits" :class="{ dialogShow }">
        <div
          class="portrait-boxs"
          v-for="item in allGroupMsgs"
          :key="item.groupId"
        >
          <img
            :src="item.imgUrl"
            @click="changeGroup(item.groupId)"
            :class="{
              portaitBoder: msgItem && msgItem.groupId == item.groupId,
            }"
          />
        </div>
      </div>
    </div>
    <ul class="group-dialog-ul">
      <li
        class="group-dialog-li"
        v-for="item in allGroupMsgs"
        :key="item.groupId"
        @click="intoDialog(item.groupId)"
      >
        <div class="li-tip" v-show="item.unReadNum > 0">
          {{ item.unReadNum }}
        </div>
        <img :src="item.imgUrl" />
        <div class="li-main">
          <div class="li-title">
            <span>{{ item.name }}</span>
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
          {{ msgItem && msgItem.name }}
        </div>
        <img src="../../../assets/images/x.png" @click="toggleMsg" />
      </div>
      <div class="dialog-main" ref="dialogMain">
        <ul class="msg-ul">
          <li
            v-for="item in msgItem && msgItem.allMsgs"
            :key="item._id"
            :class="item.userId == userId ? 'msg-ul-right' : 'msg-ul-left'"
          >
            <img :src="userImgUrl(item.userId)" class="user-portrait" @click="intoDetails(item.userId)"/>
            <span>{{ userName(item.userId) }}</span>
            <!-- <div class="msg-li-content">{{ item.content }}</div> -->
            <div class="msg-li-content" v-if="item.types == '0'">
              {{ item.content }}
            </div>
            <div class="msg-li-content" v-else><img :src="item.content" /></div>
            <div class="msg-li-time">{{ formatDateTime(item.time) }}</div>
          </li>
        </ul>
      </div>
      <div class="dialog-input">
        <div class="dialog-input-box">
          <div class="dialog-input-plus" @click="toggleInputMore">
            <img src="../../../assets/images/plus.png" />
          </div>
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
            <img src="../../../assets/images/send.png" @click="send(null)" />
          </div>
        </div>
        <div class="dialog-input-more" :class="{ showInputMore }">
          <div @click="$refs.uploadImgFile.click()">
            <img src="../../../assets/images/image.png" />
            <p>图片</p>
            <input
              type="file"
              ref="uploadImgFile"
              style="display: none"
              @change="uploadImg($event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupDialog",
  data() {
    return {
      groupId: "",
      dialogShow: false,
      isEmoji: false,
      showInputMore: false,
    };
  },
  methods: {
    back() {
      this.$router.back();
    },

    // 切换显示隐藏对话窗
    toggleMsg() {
      this.dialogShow = !this.dialogShow;
      if (!this.dialogShow) {
        this.groupId = "";
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

    // 消息盒子滚至底部
    moveToBottom() {
      // this.$refs.dialogMain.scrollHeight - this.$refs.dialogInput.offsetTop
      setTimeout(() => {
        this.$refs.dialogMain &&
          this.$refs.dialogMain.scrollTo(0, this.$refs.dialogMain.scrollHeight);
      }, 100);
    },

    // 进入对话
    intoDialog(groupId) {
      this.groupId = groupId;

      this.toggleMsg();

      this.$nextTick(() => {
        this.moveToBottom();
        this.readGroupMsg(groupId);
      });
    },

    // 已读群组消息
    readGroupMsg(groupId) {
      if (this.msgItem) {
        this.msgItem.unReadNum = 0;
        this.$API.readGroupMsgs({ groupId });
      }
    },

    // 发送消息
    send(content) {
      let types = "1";
      let text = this.$refs.dialogInputContent.innerText.trim();

      if (!content) {
        if (text == "") {
          return;
        } else {
          content = text;
          types = "0";
        }
      }

      let userId = this.$store.state.User.userInfo._id;
      let groupId = this.groupId;
      let time = new Date();
      let msg = {
        userId,
        groupId,
        content,
        types,
        time,
      };

      this.msgItem.allMsgs.push(msg);
      this.msgItem.lastMsg = content;
      if (types == "1") {
        this.msgItem.lastMsg = "[图片]";
      }
      this.msgItem.lastTime = time;

      this.$socket.emit("sendGroupMsg", msg);

      this.$refs.dialogInputContent.innerText = "";
      this.$nextTick(() => {
        this.moveToBottom();
      });

      this.$refs.dialogInputContent.focus();
    },

    changeGroup(id) {
      this.groupId = id;
    },

    // 返回群成员的头像
    userImgUrl(userId) {
      let groupMemberInfos = this.$store.state.Chat.allGroupMsgs.userInfos.find(
        (item) => {
          return item.groupId == this.groupId;
        }
      );
      let info = groupMemberInfos.memberInfos.find((item) => {
        return item._id == userId;
      });
      return info.imgUrl;
    },

    // 返回群成员的群内昵称或用户名
    userName(userId) {
      let groupMemberInfos = this.$store.state.Chat.allGroupMsgs.userInfos.find(
        (item) => {
          return item.groupId == this.groupId;
        }
      );
      let info = groupMemberInfos.memberInfos.find((item) => {
        return item._id == userId;
      });
      return info.nickName || info.name;
    },

    toggleInputMore() {
      this.showInputMore = !this.showInputMore;
      this.moveToBottom();
    },

    // 发送图片
    async uploadImg(e) {
      e.preventDefault();

      let formData = new FormData();
      let file = this.$refs.uploadImgFile.files[0];
      let name = file.name;

      formData.append("uploadGroupImgFile", file, name);

      let res = await this.$API.uploadGroupImage(formData);
      if (res.status == 200) {
        this.send(res.msg);
        this.toggleInputMore();
      }
    },

    // 进入用户详情页
    intoDetails(id) {
      this.$router.push({
        path: "/detail",
        query: { id },
      });
    },

    // ★进入群组详情页

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
  },
  computed: {
    allGroupMsgs() {
      return this.$store.state.Chat.allGroupMsgs.groupMsgs;
    },
    msgItem() {
      return (
        this.$store.state.Chat.allGroupMsgs.groupMsgs &&
        this.$store.state.Chat.allGroupMsgs.groupMsgs.find(
          (item) => item.groupId == this.groupId
        )
      );
    },
    userId() {
      return this.$store.state.User.userInfo._id;
    },
  },
  mounted() {
    // 在聊天页中，新收到的消息自动设为已读
    this.$bus.$on("autoReadGroupMsg", () => {
      if (this.groupId) {
        this.moveToBottom();
        this.readGroupMsg(this.groupId);
      }
    });
  },
};
</script>

<style lang="less" scoped>
.group-dialog {
  background: #f0f3f8;
  height: 100vh;
  .group-dialog-top {
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
    .group-dialog-top-portraits {
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

  .group-dialog-ul {
    width: 100%;
    height: calc(100vh - 60px);
    overflow: scroll;
    box-sizing: border-box;
    .group-dialog-li {
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
          .user-portrait {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            position: absolute;
            left: -10px;
            top: 5px;
          }
          span {
            width: 40px;
            text-align: center;
            font-size: 12px;
            overflow: hidden;
            position: absolute;
            left: -10px;
            top: 45px;
          }
          img {
            max-width: 100%;
            border-radius: 15px;
          }
        }
        .msg-ul-left {
          padding-left: 35px;
          box-sizing: border-box;
          position: relative;
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
          .user-portrait,
          span {
            display: none;
          }
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
      background: #e7f0f7;
      border-radius: 15px;
      transition: all 0.1s ease-out;
      overflow: hidden;
      .dialog-input-box {
        width: 100%;
        min-height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .dialog-input-plus {
          width: 50px;
          text-align: center;
          margin-bottom: 8px;
          img {
            width: 28px;
            height: 28px;
          }
        }
        .dialog-input-content {
          flex: 1;
          font-size: 20px;
          margin-bottom: 5px;
          display: flex;
          align-items: flex-end;
          div {
            flex: 1;
            outline: none;
            padding: 5px 0;
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
      .dialog-input-more {
        width: 100%;
        height: 0;
        background: #f0f3f8;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
        transition: all 0.1s ease-out;
        &.showInputMore {
          height: 100px;
        }
        div {
          margin: 0 25px;
          img {
            width: 50px;
            height: 50px;
          }
          p {
            text-align: center;
            color: #607d8b;
          }
        }
      }
    }
  }
}
</style>