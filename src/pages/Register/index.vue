<template>
  <div class="register">
    <div class="logo">Hine</div>
    <p>注册</p>
    <div class="inputs">
        <input type="text" required v-model="name">
        <span>用户名</span>
    </div>
    <div class="inputs">
        <input type="text" required v-model="email">
        <span>电子邮件地址</span>
    </div>
    <div class="inputs">
        <input type="password" required v-model="psw">
        <span>密码</span>
    </div>
    <div class="tips">{{tips}}</div>
    <div class="button">
        <div class="button-to-login" @click="intoLogin">已有账号</div>
        <div class="button-register" :class="isComplete ? '' : 'grey'" @click="register">注册</div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Register',
    data(){
        return {
            tips: '',
            name: '',
            email: '',
            psw: ''
        }
    },
    methods: {
        intoLogin() {
            this.$router.push('/login')
        },
        async register() {
            if (this.isComplete) {
                let { name, email, psw } = this

                // 根据返回数量判断是否已被占用
                let nameinuse = await this.$API.nameinuse({ name })
                if (nameinuse.msg != 0) {
                    this.tips = '用户名已被占用'
                    return
                }

                let emailinuse = await this.$API.emailinuse({ email })
                if (emailinuse.msg != 0) {
                    this.tips = '电子邮件地址已被占用'
                    return
                }

                try {
                    await this.$store.dispatch('User/register', { name, email, psw })
                    this.$router.push('/login')
                } catch (error) {
                    alert(error.message)
                }
            } else if (!this.name) {
                this.tips = '请输入用户名'
            } else if (!this.psw){
                this.tips = '请输入密码'
            } else {
                this.tips = '请输入正确的电子邮件地址'
            }
        }
    },
    computed: {
        isComplete() {
            let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (this.name && this.email && this.psw && regEmail.test(this.email)) {
                this.tips = ''
                return true
            } else {
                this.tips = ''
                if (this.email && !regEmail.test(this.email)) {
                    this.tips = '请输入正确的电子邮件地址！'
                }
                return false
            }
        }
    },
    mounted() {
        this.$bus.$emit('closeTabBar')
    },
}
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
            color: #607D8B;
        }

        p {
            text-align: center;
            font-size: 26px;
            margin-bottom: 70px;
            color: #607D8B;
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
                color: #607D8B;
                &:focus {
                    border: 2px solid #607D8B;

                    &+span {
                        color: #607D8B;
                    }
                }

                &:valid,
                &:focus {
                    &+span {
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
                transition: all .3s;
            }
        }
        .tips{
            float: left;
            width: 100%;
            padding-top: 10px;
            color: #FF5D5B;
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
                    background: #D7E4F5;
                }
            }

            .button-register {
                width: 100px;
                height: 50px;
                background: #607D8B;
                text-align: center;
                font-size: 18px;
                color: #fff;
                border-radius: 6px;
                &:active{
                    background: #34495E;
                }
                &.grey{
                    background: #999;
                }
            }
        }
    }
</style>