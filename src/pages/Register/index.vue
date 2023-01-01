<template>
  <div class="register">
    <div class="logo">Hine</div>
    <p>注册</p>
    <div class="inputs">
        <input type="text" required v-model.trim="name" @blur="nameQuery">
        <span>用户名</span>
    </div>
    <div class="inputs">
        <input type="text" required v-model.trim="email" @blur="emailQuery">
        <span>电子邮件地址</span>
    </div>
    <div class="inputs">
        <input type="password" required v-model.trim="psw">
        <span>密码</span>
    </div>
    <div class="tips">{{tips}}</div>
    <div class="button">
        <div class="button-to-login" @click="intoLogin">已有账号</div>
        <div class="button-register" :class="isComplete ? '' : 'grey'" @click="register" ref="registerBtn">注册</div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import jsrsasign from 'jsrsasign'
export default {
    name: 'Register',
    data(){
        return {
            tips: '',
            name: '',
            email: '',
            psw: '',
            nameInUse: false,
            emailInUse: false
        }
    },
    methods: {
        intoLogin() {
            this.$router.push('/login')
        },
        async nameQuery() {
            if (!this.name) {
                return
            }
            // 根据返回数量判断是否已被占用
            let res = await this.$API.nameinuse(this.name)
            if (res.msg != 0) {
                this.tips = '用户名已被占用'
                this.nameInUse = true
            } else {
                this.nameInUse = false
                // 防止覆盖提示信息
                if (this.emailInUse || this.tips == '请输入正确的电子邮件地址') {
                    return
                }
                this.tips = ''
            }
        },
        async emailQuery() {
            let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (!this.email || !regEmail.test(this.email)) {
                return
            }
            // 根据返回数量判断是否已被占用
            let res = await this.$API.emailinuse(this.email)
            if (res.msg != 0) {
                this.tips = '电子邮件地址已被占用'
                this.emailInUse = true
            } else {
                this.emailInUse = false
                // 防止覆盖提示信息
                if (this.nameInUse) {
                    return
                }
                this.tips = ''
            }
        }
        ,
        register() {
            let { nameQuery, emailQuery } = this

            // 提交注册前再次检查占用
            nameQuery()
            emailQuery()

            if (this.isComplete) {
                this.$refs.registerBtn.innerText = '请稍后'
                this.addUser()
            } else if (!this.name) {
                this.tips = '请输入用户名'
            } else if (!this.psw){
                this.tips = '请输入密码'
            } else {
                // 电子邮件地址为空
                this.tips = '请输入正确的电子邮件地址'
            }
        },
        addUser() {
            // 由于 jsrsasign 库生成 RSA 密钥对过于缓慢，故使其为异步
            // 没有深究为什么直接在addUser()设置async不能实现异步
            setTimeout(async () => {
                try {
                    let { name, email, psw } = this

                    // 服务器不存储用户密码
                    psw = CryptoJS.AES.encrypt(psw, psw).toString()

                    // 生成 RSA 密钥对
                    var rsaKeypair = jsrsasign.KEYUTIL.generateKeypair('RSA', 1024);
                    let publicKey = jsrsasign.KEYUTIL.getPEM(rsaKeypair.prvKeyObj);
                    let privateKey = jsrsasign.KEYUTIL.getPEM(rsaKeypair.prvKeyObj, 'PKCS8PRV');

                    await this.$store.dispatch('User/register', { name, email, psw, publicKey, privateKey })
                    this.intoLogin()
                } catch (error) {
                    this.$refs.registerBtn.innerText = '注册'
                    alert(error.message)
                }
            }, 0)
        }
    },
    computed: {
        isComplete() {
            if (this.nameInUse || this.emailInUse) {
                return false
            }

            let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (this.name && this.email && this.psw && regEmail.test(this.email)) {
                this.tips = ''
                return true
            } else {
                this.tips = ''
                if (this.email && !regEmail.test(this.email)) {
                    this.tips = '请输入正确的电子邮件地址'
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