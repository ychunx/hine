<template>
  <div class="contacts">
    <div class="contacts-main">
      <TopBar />
      <div class="contacts-main-content">
        <ul class="contacts-menu">
          <li @click="intoNew">
            <img src="../../assets/images/add.png" />
            <span>好友请求</span>
            <div class="tip" v-show="applyNum != 0">
              <div>{{ applyNum }}</div>
            </div>
          </li>
          <li @click="intoBuild">
            <img src="../../assets/images/hint.png" />
            <span>新建加密对话</span>
          </li>
          <li @click="intoBuildGroup">
            <img src="../../assets/images/group.png" />
            <span>新建群组</span>
          </li>
        </ul>
        <ul class="contacts-main-box">
          <li
            v-for="item in friends"
            :key="item._id"
            @click="intoDetails(item._id)"
          >
            <img :src="item.imgUrl" />
            <span>{{ item.nickname ? item.nickname : item.name }}</span>
          </li>
        </ul>
        <h1>共 {{ friendsNum }} 位</h1>
      </div>
    </div>
    <div class="new-box" :class="{ newShow }">
      <New></New>
    </div>
    <div class="build-box" :class="{ buildShow }">
      <Build></Build>
    </div>
    <div class="build-group-box" :class="{ buildGroupShow }">
      <BuildGroup></BuildGroup>
    </div>
  </div>
</template>

<script>
import TopBar from "../../components/TopBar";
import New from "./New";
import Build from "./Build";
import BuildGroup from "./BuildGroup";
import { mapState } from "vuex";
export default {
  name: "Contacts",
  components: { TopBar, New, Build, BuildGroup },
  data() {
    return {
      newShow: false, // 是否显示好友申请页面
      buildShow: false, // 是否显示新建加密消息页面
      buildGroupShow: false, // 是否显示新建群组页面
    };
  },
  methods: {
    // 进入/退出好友申请页面
    intoNew() {
      this.newShow = true;
    },
    hideNew() {
      this.newShow = false;
    },

    // 进入/退出新建加密消息页面
    intoBuild() {
      this.buildShow = true;
    },
    hideBuild() {
      this.buildShow = false;
    },

    // 进入/退出新建群组页面
    intoBuildGroup() {
      this.buildGroupShow = true;
    },
    hideBuildGroup() {
      this.buildGroupShow = false;
    },

    // 进入用户详情页
    intoDetails(id) {
      this.$router.push({
        path: "/detail",
        query: { id },
      });
    },
  },
  computed: {
    ...mapState({
      friends: (state) => state.Friend.friends, // 好友列表
      friendsNum: (state) => state.Friend.friends.length, // 好友数量
      applyNum: (state) => state.Friend.friendApplys.length, // 好友申请未处理数量
    }),
  },
  mounted() {
    // 确保底栏显示
    this.$bus.$emit("activeTabBar");

    // 绑定隐藏页面供子组件使用
    this.$bus.$on("hideNew", this.hideNew);
    this.$bus.$on("hideBuild", this.hideBuild);
    this.$bus.$on("hideBuildGroup", this.hideBuildGroup);
  },
  beforeDestroy() {
    // 确保底栏隐藏
    this.$bus.$emit("deactiveTabBar");
  },
};
</script>

<style lang="less" scoped>
.contacts {
  position: relative;
  .contacts-main {
    background: #f9f9f9;
    .contacts-main-content {
      padding-top: 60px;
      height: calc(100vh - 60px);
      box-sizing: border-box;
      overflow: scroll;
      li:active {
        background: #f9f9f9;
      }
      .contacts-menu {
        width: 100%;
        margin-bottom: 10px;
        background: #fff;
        li {
          display: flex;
          align-items: center;
          padding: 15px 30px;
          img {
            width: 20px;
            height: 20px;
            margin-right: 30px;
          }
          span {
            font-weight: bold;
          }
          .tip {
            flex: 1;
            div {
              width: 30px;
              height: 20px;
              border-radius: 10px;
              background: #fa5252;
              float: right;
              text-align: center;
              color: #ffffff;
              font-size: 14px;
              line-height: 20px;
            }
          }
        }
      }
      .contacts-main-box {
        width: 100%;
        background: #fff;
        li {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 1px solid #ededed;
          img {
            width: 35px;
            height: 35px;
            border-radius: 20%;
            margin-right: 25px;
          }
          span {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
      h1 {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 16px;
        font-weight: normal;
      }
    }
  }
  .new-box,
  .build-box,
  .build-group-box {
    border-radius: 20px;
    position: absolute;
    z-index: -1;

    width: calc(100% - 60px);
    height: 50px;
    top: 60px;
    left: 30px;

    transition: all 0.3s ease-out;
    overflow: hidden;
    &.newShow,
    &.buildShow,
    &.buildGroupShow {
      width: 100%;
      height: 100vh;
      z-index: 999;
      top: 0;
      left: 0;
      border-radius: 0;
    }
  }
  .build-box {
    top: 110px;
  }
  .build-group-box {
    top: 160px;
  }
}
</style>