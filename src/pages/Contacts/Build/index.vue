<template>
  <div class="build">
    <div class="build-top">
      <div class="back" @click="back">
        <img src="../../../assets/images/left.png" />
      </div>
      <div class="build-select" @click="select">选择</div>
    </div>
    <ul class="build-main-box">
      <li
        v-for="item in friends"
        :key="item._id"
        @click="changeFriend(item._id)"
      >
        <img :src="item.imgUrl" />
        <span>{{ item.nickname ? item.nickname : item.name }}</span>
        <input type="radio" :value="item._id" v-model="friendId" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Build",
  data() {
    return {
      // 此组件供新建加密对话和邀请好友加入群组使用
      friendId: "",
      groupId: "",
      isInvite: false, // 是否用于邀请
    };
  },
  methods: {
    // 根据实际情况判断如何返回
    back() {
      if (this.isInvite) {
        this.$router.back();
      } else {
        this.$bus.$emit("hideBuild");
      }
    },

    // 选择好友
    changeFriend(id) {
      this.friendId = id;
    },

    // 确认选择，发送请求
    async select() {
      if (this.isInvite) {
        // 邀请好友进入群组
        let res = await this.$API.groupInvite({
          groupId: this.groupId,
          userId: this.friendId,
        });

        if (res.status == 200) {
          this.$bus.$emit("refreshGroupMsgs");
          this.$router.back();
        } else {
          this.$router.back();
        }
      } else {
        // 新建好友加密对话
        if (this.$bus.pwdCorrect) {
          // 判断用户当前能否进入加密对话页面（是否已验证密码）
          this.$router.push("/dialog");
          this.$nextTick(() => {
            this.$bus.$emit("intoDialog", this.friendId);
          });
        } else {
          this.$router.push("/msg");
          this.$nextTick(() => {
            this.$bus.$emit("intoEncryptedDialog");
          });
        }
      }
    },
  },
  computed: {
    // 获取好友列表
    friends() {
      return this.$store.state.Friend.friends;
    },
  },
  mounted() {
    // 判断组件是否用于邀请
    if (this.$route.path == "/invite") {
      this.isInvite = true;
      this.groupId = this.$route.query.id;
    }
  },
};
</script>

<style lang="less" scoped>
.build {
  background: #e7f0f7;
  height: 100vh;
  .build-top {
    height: 60px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back {
      width: 60px;
      text-align: center;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .build-select {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background: #fff;
      border-radius: 10px;
      margin-right: 20px;
      font-weight: bold;
      box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
      &:active {
        background: #f9f9f9;
      }
    }
  }
  .build-main-box {
    width: 90%;
    max-height: calc(100vh - 130px);
    background: #fff;
    margin: 0 auto;
    border-radius: 15px;
    box-shadow: 0 18px 20px 0 rgba(39, 40, 50, 0.1);
    overflow: scroll;
    li {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      border-bottom: 1px solid #ededed;
      &:active {
        background: #f9f9f9;
      }
      img {
        width: 35px;
        height: 35px;
        border-radius: 20%;
        margin-right: 25px;
      }
      span {
        font-size: 16px;
        font-weight: bold;
        flex: 1;
      }
      input {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>