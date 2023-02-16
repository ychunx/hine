<template>
  <div class="bar-box" :class="{ deactive, hide }">
    <div
      class="bar-button"
      :class="getScene == 'msg' ? 'active' : ''"
      @click="changeScene('msg')"
    >
      <div class="bar-button-img">
        <img src="../../assets/images/msg.png" />
        <img src="../../assets/images/msg-fill.png" />
        <div class="tip" v-show="unReadNum != 0">
          <div>{{ unReadNum }}</div>
        </div>
      </div>
      <span>消息</span>
    </div>
    <div
      class="bar-button"
      :class="getScene == 'contacts' ? 'active' : ''"
      @click="changeScene('contacts')"
    >
      <div class="bar-button-img">
        <img src="../../assets/images/contacts.png" />
        <img src="../../assets/images/contacts-fill.png" />
        <div class="tip" v-show="applyNum != 0">
          <div>{{ applyNum }}</div>
        </div>
      </div>
      <span>通讯录</span>
    </div>
    <div
      class="bar-button"
      :class="getScene == 'more' ? 'active' : ''"
      @click="changeScene('more')"
    >
      <div class="bar-button-img">
        <img src="../../assets/images/more.png" />
        <img src="../../assets/images/more-fill.png" />
      </div>
      <span>我</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  data() {
    return {
      deactive: false,
      hide: false,
    };
  },
  methods: {
    // 完全显示/隐藏底栏
    deactiveTabBar() {
      this.deactive = true;
    },
    activeTabBar() {
      this.deactive = false;
    },

    // 进入对话时的底栏过渡动画
    hideTabBar() {
      this.hide = true;
    },
    showTabBar() {
      this.hide = false;
    },

    // 点击切换底栏场景
    changeScene(scene) {
      let curScene = this.getScene;
      if (scene != curScene) {
        this.$router.push(`/${scene}`);
      }
    },
  },
  mounted() {
    // 完全显示/隐藏底栏
    this.$bus.$on("deactiveTabBar", this.deactiveTabBar);
    this.$bus.$on("activeTabBar", this.activeTabBar);
    // 进入对话时的底栏过渡动画
    this.$bus.$on("hideTabBar", this.hideTabBar);
    this.$bus.$on("showTabBar", this.showTabBar);
  },
  computed: {
    // 根据路由获取当前场景
    getScene() {
      return this.$route.path.slice(1);
    },
    // 获取未处理好友请求数量
    applyNum() {
      return this.$store.state.Friend.friendApplys.length;
    },
    // 计算非加密、加密和群组未读消息总和
    unReadNum() {
      let num = 0;
      this.$store.state.Chat.allMsgs.forEach((item) => {
        num += item.unReadNum;
      });
      this.$store.state.Chat.allEncryptedMsgs.forEach((item) => {
        num += item.unReadNum;
      });
      this.$store.state.Chat.allGroupMsgs.groupMsgs &&
        this.$store.state.Chat.allGroupMsgs.groupMsgs.forEach((item) => {
          num += item.unReadNum;
        });
      return num;
    },
  },
};
</script>

<style lang="less" scoped>
.bar-box {
  width: 100%;
  height: 60px;
  background: #e7f0f7;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  transition: all 0.3s;
  &.deactive {
    display: none;
  }
  &.hide {
    transform: translateX(-20%);
  }
  .bar-button {
    width: 60px;
    height: 60px;
    padding-top: 15px;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    &.active {
      padding-top: 7px;
      .bar-button-img {
        background: #d7e4f5;
        width: 60px;
        border-radius: 30px;
        padding-top: 2.5px;
        img:nth-child(1) {
          display: none;
        }
        img:nth-child(2) {
          display: inline-block;
        }
      }
      span {
        opacity: 1;
      }
    }
    .bar-button-img {
      height: 30px;
      width: 25px;
      box-sizing: border-box;
      margin: 0 auto;
      text-align: center;
      border-radius: 50%;
      background: #e7f0f7;
      transition: all 0.2s ease-out;
      position: relative;
      img {
        width: 25px;
        height: 25px;
      }
      img:nth-child(2) {
        display: none;
      }
      .tip {
        position: absolute;
        top: -5px;
        left: 60%;
        background: #fa5252;
        font-size: 12px;
        font-weight: bold;
        padding: 0 5px;
        border-radius: 15px;
        color: #fff;
      }
    }
    span {
      font-size: 12px;
      transition: all 0.3s ease-out;
      opacity: 0;
      color: #607d8b;
      display: block;
      text-align: center;
      line-height: 14px;
      height: 14px;
      margin-top: 2px;
    }
  }
}
</style>