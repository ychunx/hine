<template>
  <div class="login">
    <div class="logo">Hine</div>
    <p>登录</p>
    <div class="inputs">
      <input type="text" required v-model.trim="acct" />
      <span>电子邮件地址或用户名</span>
    </div>
    <div class="inputs">
      <input type="password" required v-model.trim="pwd" @keyup.enter="login" />
      <span>密码</span>
    </div>
    <div class="tips">
      {{ tips }}
      <div class="tips-right">忘记密码</div>
    </div>
    <div class="button">
      <div class="button-to-register" @click="intoRegister">创建账号</div>
      <div
        class="button-login"
        :class="isComplete ? '' : 'grey'"
        @click="login"
        ref="loginBtn"
      >
        登录
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      tips: "",
      acct: "", // 账号
      pwd: "", // 密码
    };
  },
  methods: {
    // 跳转注册页
    intoRegister() {
      this.$router.push("/register");
    },

    // 登录
    async login() {
      if (this.isComplete) {
        // 用户已完成合法输入
        try {
          this.$refs.loginBtn.innerText = "登录中";
          let { acct, pwd } = this;
          await this.$store.dispatch("User/signIn", { acct, pwd });

          // 登录成功则请求用户信息及跳转至消息页
          await this.$store.dispatch("User/getUserInfo");
          this.$router.push("/msg");
        } catch (error) {
          this.tips = "账号或密码错误";
          this.$refs.loginBtn.innerText = "登录";
        }
      } else if (this.name) {
        this.tips = "请输入密码";
      } else {
        this.tips = "请输入账号";
      }
    },
  },
  computed: {
    // 判断是否全部合法输入
    isComplete() {
      if (this.acct && this.pwd) {
        return true;
      } else {
        this.tips = "";
        return false;
      }
    },
  },
  mounted() {
    // 确保底栏隐藏
    this.$bus.$emit("deactiveTabBar");
  },
};
</script>

<style lang="less" scoped>
.login {
  padding: 0 25px;
  .logo {
    margin-top: calc(100vh * 0.08);
    height: 150px;
    font-size: 64px;
    font-weight: bold;
    text-align: center;
    line-height: 150px;
    color: #607d8b;
  }
  p {
    text-align: center;
    font-size: 26px;
    margin-bottom: 70px;
    color: #607d8b;
  }
  .inputs {
    margin-top: 20px;
    height: 60px;
    position: relative;
    input {
      width: 100%;
      height: 100%;
      outline: none;
      padding: 0 15px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 20px;
      position: relative;
      z-index: 99;
      background: none;
      color: #607d8b;
      &:focus {
        border: 2px solid #607d8b;
        transition: all 0.2s ease-in;
        & + span {
          color: #607d8b;
        }
      }
      &:valid,
      &:focus {
        & + span {
          left: 10px;
          top: -12px;
          z-index: 99;
        }
      }
    }
    span {
      position: absolute;
      left: 16px;
      top: 16px;
      font-size: 18px;
      color: #999;
      background: #fff;
      transition: all 0.3s;
      display: inline-block;
      padding: 0 5px;
    }
  }
  .tips {
    float: left;
    width: 100%;
    padding-top: 10px;
    color: #ff5d5b;
    .tips-right {
      float: right;
      color: #000;
    }
  }
  .button {
    height: 50px;
    margin-top: 160px;
    display: flex;
    justify-content: space-between;
    line-height: 50px;
    .button-to-register {
      width: 100px;
      height: 50px;
      text-align: center;
      font-size: 16px;
      border-radius: 6px;
      &:active {
        background: #d7e4f5;
      }
    }
    .button-login {
      width: 100px;
      height: 50px;
      background: #607d8b;
      text-align: center;
      font-size: 18px;
      color: #fff;
      border-radius: 6px;
      &:active {
        background: #34495e;
      }
      &.grey {
        background: #999;
      }
    }
  }
}
</style>