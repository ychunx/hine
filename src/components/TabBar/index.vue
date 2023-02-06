<template>
  <div class="bar-box" :class="{ deactive, hide }">
    <div
      class="bar-button"
      :class="getScene == 'msg' ? 'active' : ''"
      @click="changeScene('msg')"
    >
      <div>
        <img src="../../assets/images/msg.png" />
        <img src="../../assets/images/msg-fill.png" />
      </div>
      <span>消息</span>
    </div>
    <div
      class="bar-button"
      :class="getScene == 'contacts' ? 'active' : ''"
      @click="changeScene('contacts')"
    >
      <div>
        <img src="../../assets/images/contacts.png" />
        <img src="../../assets/images/contacts-fill.png" />
      </div>
      <span>通讯录</span>
    </div>
    <div
      class="bar-button"
      :class="getScene == 'more' ? 'active' : ''"
      @click="changeScene('more')"
    >
      <div>
        <img src="../../assets/images/more.png" />
        <img src="../../assets/images/more-fill.png" />
      </div>
      <span>发现</span>
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
    deactiveTabBar() {
      this.deactive = true;
    },
    activeTabBar() {
      this.deactive = false;
    },
    hideTabBar() {
      this.hide = true;
    },
    showTabBar() {
      this.hide = false;
    },
    changeScene(scene) {
      let curScene = this.getScene;
      if (scene != curScene) {
        this.$router.push(`/${scene}`);
      }
    },
  },
  mounted() {
    this.$bus.$on("deactiveTabBar", this.deactiveTabBar);
    this.$bus.$on("activeTabBar", this.activeTabBar);
    this.$bus.$on("hideTabBar", this.hideTabBar);
    this.$bus.$on("showTabBar", this.showTabBar);
  },
  computed: {
    getScene() {
      return this.$route.path.slice(1);
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
      div {
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
    div {
      height: 30px;
      width: 25px;
      box-sizing: border-box;
      margin: 0 auto;
      text-align: center;
      border-radius: 50%;
      background: #e7f0f7;
      transition: all 0.2s ease-out;
      img {
        width: 25px;
        height: 25px;
      }
      img:nth-child(2) {
        display: none;
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