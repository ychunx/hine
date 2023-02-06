<template>
  <div class="more">
    <div class="more-top">
      <div class="more-top-box">
        <div class="portrait">
          <img :src="userInfo.imgUrl" @click="$refs.portraitFile.click()" />
        </div>
        <input
          type="file"
          ref="portraitFile"
          style="display: none"
          @change="modifyPortrait($event)"
        />
        <p class="name">{{ userInfo.name }}</p>
        <p class="email">{{ userInfo.email }}</p>
        <div class="signature" ref="userSignature">
          {{ userInfo.signature }}
          <img
            src="../../assets/images/modify.png"
            v-show="!modifySignature"
            @click="toggleSignature(true)"
          />
          <img
            src="../../assets/images/finish.png"
            v-show="modifySignature"
            @click="toggleSignature(false)"
          />
        </div>
      </div>
    </div>
    <ul class="more-main">
      <li @click="toggleSex">
        <div class="more-main-left">性别</div>
        <div class="more-main-center">{{ userInfo.sex }}</div>
        <div class="more-main-right">
          <img src="../../assets/images/right.png" :class="{ showSex }" />
        </div>
      </li>
      <li class="modify-box" :class="{ showSex }">
        <div class="btn-group">
          <div class="modify-btn">
            <span :class="{ 'btn-selected': sex === '男' }" @click="sex = '男'"
              >男</span
            >
            <span
              :class="{ 'btn-selected': sex === '你猜猜~' }"
              @click="sex = '你猜猜~'"
              >不公开</span
            >
            <span :class="{ 'btn-selected': sex === '女' }" @click="sex = '女'"
              >女</span
            >
          </div>
          <div class="finish-btn" @click="finishSex">完成</div>
        </div>
      </li>
      <li @click="toggleBirth">
        <div class="more-main-left">生日</div>
        <div class="more-main-center">{{ formatDateTime(userInfo.birth) }}</div>
        <div class="more-main-right">
          <img src="../../assets/images/right.png" :class="{ showBirth }" />
        </div>
      </li>
      <li class="modify-box modify-birth" :class="{ showBirth }">
        <div class="btn-group">
          <div class="modify-input">
            <span>修改为：</span><input type="text" v-model="birth" />
          </div>
          <div class="finish-btn" @click="finishBirth">完成</div>
        </div>
      </li>
      <li>
        <div class="more-main-left">注册</div>
        <div class="more-main-center">
          {{ formatDateTime(userInfo.registerTime) }}
        </div>
        <div class="more-main-right"></div>
      </li>
    </ul>
    <ul class="more-main second">
      <li @click="toggleModify">
        <div class="more-main-left">
          <img src="../../assets/images/change.png" />
        </div>
        <div class="more-main-center">修改密码、用户名、邮箱</div>
        <div class="more-main-right">
          <img src="../../assets/images/right.png" :class="{ showModify }" />
        </div>
      </li>
      <li class="modify-box" :class="{ showModify }">
        <div class="btn-group">
          <div class="modify-btn">
            <span
              :class="{ 'btn-selected': modifySelect === 'name' }"
              @click="modifyType('name')"
              >用户名</span
            >
            <span
              :class="{ 'btn-selected': modifySelect === 'email' }"
              @click="modifyType('email')"
              >邮箱</span
            >
            <span
              :class="{ 'btn-selected': modifySelect === 'pwd' }"
              @click="modifyType('pwd')"
              >密码</span
            >
          </div>
          <div class="finish-btn" :class="{ grey }" @click="finishModify">
            完成
          </div>
        </div>
        <div class="modify-input">
          <span>当前密码：</span><input type="password" v-model="pwd" />
        </div>
        <div class="modify-input">
          <span>修改为：</span><input type="text" v-model="newData" />
        </div>
        <p class="tips">{{ tips }}</p>
      </li>
      <li @click="logout">
        <div class="more-main-left">
          <img src="../../assets/images/out.png" />
        </div>
        <div class="more-main-center">退出登录</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "More",
  data() {
    return {
      showModify: false,
      showSex: false,
      showBirth: false,
      modifySignature: false,
      modifySelect: "name",
      pwd: "",
      newData: "",
      tips: "",
      sex: "你猜猜~",
      birth: "",
    };
  },
  methods: {
    intoSearch() {
      this.$router.push("/search");
    },

    toggleModify() {
      this.pwd = "";
      this.newData = "";
      this.tips = "";
      this.showModify = !this.showModify;
    },
    toggleSex() {
      this.showSex = !this.showSex;
    },
    toggleBirth() {
      this.showBirth = !this.showBirth;
    },
    async toggleSignature(bool) {
      this.modifySignature = bool;
      if (bool) {
        // 改成输入
        this.$refs.userSignature.setAttribute("contenteditable", true);
        this.$refs.userSignature.focus();
      } else {
        // 调用接口
        let res = await this.$API.modifySignature({
          newSignature: this.$refs.userSignature.innerText,
        });
        if (res.status == 200) {
          this.$store.dispatch("User/getUserInfo");
          this.$refs.userSignature.setAttribute("contenteditable", false);
        }
      }
    },

    modifyType(type) {
      this.modifySelect = type;
    },
    async finishModify() {
      if (this.grey) {
        return;
      }

      let data = {};
      data.pwd = this.pwd;
      let res = {};
      if (this.modifySelect == "name") {
        data.newName = this.newData;
        res = await this.$API.modifyName(data);
      } else if (this.modifySelect == "email") {
        data.newEmail = this.newData;
        res = await this.$API.modifyEmail(data);
      } else {
        data.newPwd = this.newData;
        res = await this.$API.modifyPwd(data);
      }
      if (res.status == 200) {
        this.$store.dispatch("User/getUserInfo");
        this.pwd = "";
        this.newData = "";
        this.tips = "";
        this.showModify = false;
      } else {
        this.tips = res.msg;
      }
    },
    async finishSex() {
      let res = await this.$API.modifySex({ newSex: this.sex });
      if (res.status == 200) {
        this.$store.dispatch("User/getUserInfo");
        this.showSex = false;
      }
    },
    async finishBirth() {
      if (this.birth == "") {
        return;
      }
      let res = await this.$API.modifyBirth({ newBirth: this.birth });
      if (res.status == 200) {
        this.$store.dispatch("User/getUserInfo");
        this.birth = "";
        this.showBirth = false;
      }
    },
    async modifyPortrait(e) {
      e.preventDefault();

      let formData = new FormData();
      let file = this.$refs.portraitFile.files[0];
      let name = file.name;

      formData.append("portraitFile", file, name);

      let res1 = await this.$API.uploadPortrait(formData);
      if (res1.status == 200) {
        let res2 = await this.$API.modifymodifyPortraitUrl({
          newPortraitUrl: res1.msg,
        });
        if (res2.status == 200) {
          this.$store.dispatch("User/getUserInfo");
        }
      }
    },

    logout() {
      this.$socket.emit("offline", this.userInfo._id);
      this.$store.dispatch("User/logout");
      this.$router.go(0);
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
      // let h = newDate.getHours()
      // h = h < 10 ? ('0' + h) : h
      // let minute = newDate.getMinutes()
      // minute = minute < 10 ? ('0' + minute) : minute
      // let second = newDate.getSeconds()
      // second = second < 10 ? ('0' + second) : second

      return `${y}-${m}-${d}`;
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.User.userInfo;
    },
    grey() {
      return !this.pwd || !this.newData;
    },
  },
  mounted() {
    this.$bus.$emit("activeTabBar");
  },
  beforeDestroy() {
    this.$bus.$emit("deactiveTabBar");
  },
};
</script>

<style lang="less" scoped>
.more {
  height: calc(100vh - 60px);
  background: #f9f9f9;
  overflow: scroll;
  .more-top {
    height: 160px;
    background: #607d8b;
    position: relative;
    .more-top-box {
      width: 90%;
      height: 200px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      background: #ffffff;
      position: absolute;
      top: 130px;
      left: 50%;
      transform: translateX(-50%);
      padding-top: 60px;
      box-sizing: border-box;
      .portrait {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
        overflow: hidden;
        img {
          width: 100px;
        }
      }
      .name {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
      }
      .email {
        text-align: center;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
      }
      .signature {
        height: 75px;
        padding: 10px 10px;
        margin: 5px 10px 0;
        box-sizing: border-box;
        overflow: scroll;
        background: #f9f9f9;
        border-radius: 10px;
        position: relative;
        img {
          width: 20px;
          height: 20px;
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
      }
    }
  }
  .more-main {
    width: 100%;
    margin-top: 180px;
    li {
      width: 90%;
      height: 55px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      background: #ffffff;
      border-bottom: 1px solid #ededed;
      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      .more-main-left {
        width: 70px;
        padding-left: 20px;
        box-sizing: border-box;
        color: #607d8b;
        font-weight: bold;
      }
      .more-main-center {
        flex: 1;
      }
      .more-main-right {
        padding-right: 10px;
        img {
          transition: all 0.3s ease;
        }
        img.showModify,
        img.showSex,
        img.showBirth {
          transform: rotate(90deg);
        }
      }
      &.showSex,
      &.showBirth {
        height: 50px;
      }
      &.showModify {
        height: 170px;
      }
      &:active {
        background: #f9f9f9;
      }
    }
    .modify-box {
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
        .modify-btn {
          flex: 1;
          border: 1px solid #607d8b;
          border-radius: 8px;
          display: flex;
          overflow: hidden;
          span {
            line-height: 30px;
            display: inline-block;
            flex: 1;
            text-align: center;
            transition: all 0.3s;
            &:not(:last-child) {
              border-right: 1px solid #607d8b;
            }
            &.btn-selected {
              background: #607d8b;
              color: #ffffff;
            }
          }
        }
        .finish-btn {
          width: 60px;
          color: #ffffff;
          background: #607d8b;
          border-radius: 8px;
          line-height: 30px;
          text-align: center;
          margin-left: 60px;
          &.grey {
            background: #999;
          }
        }
      }
      .modify-input {
        height: 50px;
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
      .tips {
        font-size: 12px;
        text-align: end;
        color: #ff5d5b;
      }
      &.modify-birth {
        .btn-group {
          .finish-btn {
            margin-left: 0;
          }
        }
        .modify-input {
          height: 30px;
          span {
            width: 70px;
          }
        }
      }
    }
    &.second {
      margin-top: 10px;
    }
  }
}
</style>