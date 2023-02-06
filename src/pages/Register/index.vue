<template>
  <div class="register">
    <div class="logo">Hine</div>
    <p>注册</p>
    <div class="inputs">
      <input type="text" required v-model.trim="name" @blur="nameQuery" />
      <span>用户名</span>
    </div>
    <div class="inputs">
      <input type="text" required v-model.trim="email" @blur="emailQuery" />
      <span>电子邮件地址</span>
    </div>
    <div class="inputs">
      <input
        type="password"
        required
        v-model.trim="pwd"
        @keyup.enter="register"
      />
      <span>密码</span>
    </div>
    <div class="tips">{{ tips }}</div>
    <div class="button">
      <div class="button-to-login" @click="intoLogin">已有账号</div>
      <div
        class="button-register"
        :class="isComplete ? '' : 'grey'"
        @click="register"
        ref="registerBtn"
      >
        注册
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      tips: "",
      name: "",
      email: "",
      pwd: "",
      nameInUse: false,
      emailInUse: false,
    };
  },
  methods: {
    // 跳转登录页
    intoLogin() {
      this.$router.push("/login");
    },

    // 检查用户名占用
    async nameQuery() {
      if (!this.name) {
        return;
      }
      // 根据返回数量判断是否已被占用
      let res = await this.$API.nameInUse(this.name);
      if (res.status == 200) {
        if (res.msg > 0) {
          this.tips = "用户名已被占用";
          this.nameInUse = true;
        } else {
          this.nameInUse = false;
          // 防止覆盖提示信息
          if (this.emailInUse || this.tips == "请输入正确的电子邮件地址") {
            return;
          }
          this.tips = "";
        }
      }
    },

    // 检查邮箱占用
    async emailQuery() {
      let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (!this.email || !regEmail.test(this.email)) {
        return;
      }
      // 根据返回数量判断是否已被占用
      let res = await this.$API.emailInUse(this.email);
      if (res.status == 200) {
        if (res.msg > 0) {
          this.tips = "电子邮件地址已被占用";
          this.emailInUse = true;
        } else {
          this.emailInUse = false;
          // 防止覆盖提示信息
          if (this.nameInUse) {
            return;
          }
          this.tips = "";
        }
      }
    },

    // 注册
    async register() {
      // 提交注册前再次检查占用
      await this.nameQuery();
      await this.emailQuery();

      if (this.isComplete) {
        this.$refs.registerBtn.innerText = "请稍后";

        try {
          let { name, email, pwd } = this;
          await this.$store.dispatch("User/register", { name, email, pwd });
          this.intoLogin();
        } catch (error) {
          this.$refs.registerBtn.innerText = "注册";
          this.tips = error.message;
        }
      } else if (!this.name) {
        this.tips = "请输入用户名";
      } else if (!this.pwd) {
        this.tips = "请输入密码";
      } else {
        // 电子邮件地址为空
        this.tips = "请输入正确的电子邮件地址";
      }
    },
  },
  computed: {
    // 判断是否全部正确填写
    isComplete() {
      if (this.nameInUse || this.emailInUse) {
        return false;
      }

      let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (this.name && this.email && this.pwd && regEmail.test(this.email)) {
        this.tips = "";
        return true;
      } else {
        this.tips = "";
        if (this.email && !regEmail.test(this.email)) {
          this.tips = "请输入正确的电子邮件地址";
        }
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register {
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
  }
  .button {
    height: 50px;
    margin-top: 80px;
    display: flex;
    justify-content: space-between;
    line-height: 50px;

    .button-to-login {
      width: 100px;
      height: 50px;
      text-align: center;
      font-size: 16px;
      border-radius: 6px;
      &:active {
        background: #d7e4f5;
      }
    }

    .button-register {
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