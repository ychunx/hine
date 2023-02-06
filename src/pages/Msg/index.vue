<template>
  <div class="msg">
    <div class="msg-main" :class="{ hide }">
      <TopBar />
      <ul class="msg-ul">
        <li class="msg-encrypted" @click="intoEncryptedDialog">
          <img src="../../assets/images/hint.png" />
          <div class="msg-encrypted-title">加密对话</div>
        </li>
        <li
          class="msg-item"
          v-for="item in allMsgs"
          :key="item.friendId"
          @click="intoDialog(item.friendId)"
        >
          <div class="msg-item-tip" v-show="item.unReadNum > 0">
            {{ item.unReadNum }}
          </div>
          <img :src="item.imgUrl" />
          <div class="msg-item-main">
            <div class="msg-item-title">
              <span>{{ item.nickname ? item.nickname : item.name }}</span>
              <span>{{ formatDateTime(item.lastTime) }}</span>
            </div>
            <div class="msg-item-content">
              {{ item.lastMsg }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="dialog" :class="{ dialogShow: hide }">
      <Dialog :friendId="friendId"></Dialog>
    </div>
  </div>
</template>

<script>
import TopBar from "../../components/TopBar";
import Dialog from "./Dialog";
export default {
  name: "Msg",
  components: { TopBar, Dialog },
  data() {
    return {
      hide: false,
      friendId: "",
    };
  },
  methods: {
    intoDialog(friendId) {
      this.friendId = friendId;

      this.$bus.$emit("hideTabBar");
      this.toggleMsg();

      this.$nextTick(() => {
        this.$bus.$emit("moveToBottom");
        this.$bus.$emit("readMsg");
      });
    },

    intoEncryptedDialog() {
      this.$router.push('/dialog')
    },

    // 切换显示隐藏对话窗
    toggleMsg() {
      this.hide = !this.hide;
      if (!this.hide) {
        this.friendId = "";
      }
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
  },
  computed: {
    allMsgs() {
      return this.$store.state.Chat.allMsgs;
    },
  },
  mounted() {
    // 显示底栏
    this.$bus.$emit("activeTabBar");

    // 显示/隐藏对话页
    this.$bus.$on("intoDialog", this.intoDialog);
    this.$bus.$on("toggleMsg", this.toggleMsg);

    // 在聊天页中，新收到的消息自动设为已读
    this.$bus.$on("autoReadMsg", () => {
      if (this.friendId) {
        this.$bus.$emit("moveToBottom");
        this.$bus.$emit("readMsg");
      }
    });
  },
  beforeDestroy() {
    this.$bus.$emit("deactiveTabBar");
  },
};
</script>

<style lang="less" scoped>
.msg {
  position: relative;
  .msg-main {
    background: #f9f9f9;
    transition: all 0.3s;
    &.hide {
      transform: translateX(-20%);
    }
    .msg-ul {
      width: 100%;
      height: calc(100vh - 60px);
      padding-top: 60px;
      overflow: scroll;
      box-sizing: border-box;
      li:active {
        background: #f9f9f9;
      }
      .msg-encrypted {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #ededed;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20%;
          margin: 0 10px 0 2px;
          border: 3px solid #607d8b;
        }
        .msg-encrypted-title {
          font-size: 18px;
          color: #607d8b;
        }
      }
      .msg-item {
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

        .msg-item-tip {
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

        .msg-item-main {
          flex: 1;
          height: 80px;
          padding: 15px 0;
          overflow: hidden;
          box-sizing: border-box;

          .msg-item-title {
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

          .msg-item-content {
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
  }
  .dialog {
    width: 100%;
    position: fixed;
    top: 0;
    left: 100%;
    transition: all 0.3s;
    z-index: 999;
    &.dialogShow {
      left: 0;
    }
  }
}
</style>