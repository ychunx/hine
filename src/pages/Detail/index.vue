<template>
  <div class="detail">
    <div class="detail-top">
      <img
        src="../../assets/images/left-white.png"
        class="back"
        @click="back"
      />
      <img :src="info && info.imgUrl" class="userImg" />
    </div>
    <ul class="detail-main">
      <li>
        <p>{{ info && info.name }}</p>
      </li>
      <li @click="toggleNickname" v-show="isFriend">
        <div class="detail-main-left">备注</div>
        <div class="detail-main-center">{{ info && info.nickname }}</div>
        <div class="detail-main-right">
          <img src="../../assets/images/right.png" :class="{ showNickname }" />
        </div>
      </li>
      <li class="modify-nickname" :class="{ showNickname }">
        <div class="btn-group">
          <div class="modify-input">
            <span>修改为：</span><input type="text" v-model="nickname" />
          </div>
          <div class="finish-btn" @click="finishNickname">完成</div>
        </div>
      </li>
      <li>
        <div class="detail-main-left">邮箱</div>
        <div class="detail-main-center">{{ info && info.email }}</div>
      </li>
      <li>
        <div class="detail-main-left">性别</div>
        <div class="detail-main-center">{{ info && info.sex }}</div>
      </li>
      <li>
        <div class="detail-main-left">生日</div>
        <div class="detail-main-center">
          {{ info && info.birth | formatDateTime }}
        </div>
      </li>
      <li>
        <div class="detail-main-left">注册</div>
        <div class="detail-main-center">
          {{ info && info.registerTime | formatDateTime }}
        </div>
      </li>
      <li class="signature">
        <div class="detail-main-left">个性签名</div>
        <div class="detail-main-center">{{ info && info.signature }}</div>
      </li>
    </ul>
    <div class="detail-bottom" v-if="isFriend">
      <div class="detail-delete" @click="deleteFriend">删除</div>
      <div class="detail-dialog" @click="intoDialog">发信息</div>
    </div>
    <div class="detail-bottom" v-else>
      <div class="detail-apply" @click="intoApply">添加好友</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "detail",
  data() {
    return {
      id: "", // 用户 id
      showNickname: false,
      nickname: "", // 新昵称
      info: {}, // 用户资料
      isFriend: true, // 是否为好友关系
    };
  },
  methods: {
    // 根据进入路径不同判断如何返回
    back() {
      if (this.$route.query.from) {
        this.intoDialog();
      } else {
        this.$router.back();
      }
    },

    // 进入好友对话
    intoDialog() {
      this.$router.push("/msg");
      this.$nextTick(() => {
        this.$bus.$emit("intoDialog", this.id);
      });
    },

    // 删除好友，(★没有使用socket刷新对方数据)
    async deleteFriend() {
      let data = {
        friendId: this.id,
      };

      let res = await this.$API.deleteFriend(data);
      if (res.status == 200) {
        if (this.$route.query.from) {
          // 根据进入路径不同判断如何返回
          this.$router.replace("/msg");
          this.$bus.$emit("showTabBar");
        } else {
          this.$router.replace("/contacts");
        }
        this.$bus.$emit("refreshData");
      }
    },

    // 显示/隐藏修改昵称
    toggleNickname() {
      this.showNickname = !this.showNickname;
    },

    // 提交修改昵称
    async finishNickname() {
      let data = {};
      data.userId = this.$store.state.User.userInfo._id;
      data.friendId = this.id;
      data.newNickname = this.nickname;

      let res = await this.$API.modifyNickname(data);
      if (res.status == 200) {
        this.nickname = "";
        this.showNickname = false;
        this.$bus.$emit("refreshData");
      }
    },

    // 通过用户 id 获取资料（非好友）
    async getUserInfoById() {
      let res = await this.$API.getUserInfoById({ userId: this.id });
      if (res.status == 200) {
        this.info = res.msg;
      } else {
        this.info = {};
      }
    },

    // 申请添加好友
    intoApply() {
      this.$router.push({
        path: "/apply",
        query: {
          id: this.id,
          name: this.info.name,
          imgUrl: this.info.imgUrl,
          type: "friend",
        },
      });
    },
  },
  filters: {
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
      // let h = newDate.getHours()
      // h = h < 10 ? ('0' + h) : h
      // let minute = newDate.getMinutes()
      // minute = minute < 10 ? ('0' + minute) : minute
      // let second = newDate.getSeconds()
      // second = second < 10 ? ('0' + second) : second

      return `${y}-${m}-${d}`;
    },
  },
  mounted() {
    let query = this.$route.query;
    this.id = query.id;
    this.info = this.$store.state.Friend.friends.find(
      (item) => item._id == this.id
    );

    // 如果此用户不在好友列表，则说明非好友需通过用户 id 获取资料
    if (!this.info) {
      this.isFriend = false;
      this.getUserInfoById();
    }
  },
};
</script>

<style lang="less" scoped>
.detail {
  height: 100vh;
  .detail-top {
    height: 20vh;
    background: #607d8b;
    position: relative;
    padding: 15px 0 0 10px;
    box-sizing: border-box;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    .back {
      width: 25px;
      height: 25px;
    }
    .userImg {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: absolute;
      bottom: -50px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
    }
  }
  .detail-main {
    height: calc(80vh - 100px);
    list-style: none;
    padding: 60px 20px 0;
    overflow: scroll;
    box-sizing: border-box;
    li {
      width: 100%;
      height: 55px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      background: #ffffff;
      border-bottom: 1px solid #ededed;
      p {
        width: 100%;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
      }
      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      .detail-main-left {
        width: 100px;
        padding-left: 20px;
        box-sizing: border-box;
        color: #607d8b;
        font-weight: bold;
      }
      .detail-main-center {
        flex: 1;
      }
      .detail-main-right {
        padding-right: 10px;
        img {
          transition: all 0.3s ease;
        }
        img.showNickname {
          transform: rotate(90deg);
        }
      }
      &.signature {
        padding: 20px 20px 20px 0;
        height: auto;
        align-items: flex-start;
      }
      &.showNickname {
        height: 50px;
      }
    }
    .modify-nickname {
      height: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      display: block;
      padding: 0 20px;
      .btn-group {
        height: 30px;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        .finish-btn {
          width: 60px;
          color: #ffffff;
          background: #607d8b;
          border-radius: 8px;
          line-height: 30px;
          text-align: center;
        }
      }
      .modify-input {
        height: 30px;
        display: flex;
        align-items: center;

        span {
          width: 80px;
          color: #607d8b;
        }

        input {
          flex: 1;
          height: 30px;
          border-radius: 8px;
          outline: none;
          border: 1px solid #607d8b;
          padding-left: 10px;
          box-sizing: border-box;
        }
      }
    }
  }
  .detail-bottom {
    width: 100%;
    height: 100px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #ffffff;
    .detail-delete {
      width: 25%;
      height: 50px;
      font-size: 20px;
      text-align: center;
      line-height: 50px;
      border-radius: 10px;
      background: rgba(255, 182, 193, 0.5);
      color: #dc143c;
    }

    .detail-dialog,
    .detail-apply {
      width: 55%;
      height: 50px;
      background: #607d8b;
      color: #ffffff;
      font-size: 20px;
      text-align: center;
      line-height: 50px;
      border-radius: 10px;
    }
    .detail-apply {
      width: 80%;
    }
  }
}
</style>