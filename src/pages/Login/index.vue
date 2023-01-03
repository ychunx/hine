<template>
  <div class="login">
    <div class="logo">Hine</div>
    <p>登录</p>
    <div class="inputs">
        <input type="text" required v-model.trim="acct">
        <span>电子邮件地址或用户名</span>
    </div>
    <div class="inputs">
        <input type="password" required v-model.trim="psw" @keyup.enter="login">
        <span>密码</span>
    </div>
    <div class="tips">
        {{tips}}
        <div class="tips-right">忘记密码</div>
    </div>
    <div class="button">
        <div class="button-to-register" @click="intoRegister">创建账号</div>
        <div class="button-login" :class="isComplete ? '' : 'grey'" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Login',
    data(){
        return {
            tips: '',
            acct: '',
            psw: '',
            cipherRes: {}
        }
    },
    methods:{
        intoRegister(){
            this.$router.push('/register')
        },
        async login(){
            if(this.isComplete){
                try {
                    let { acct, psw } = this
                    await this.$store.dispatch('User/signIn', { acct, psw })
                    this.$router.push('/msg')
                } catch (error) {
                    this.tips = error.message
                }
            }else if(this.name){
                this.tips = '请输入密码'
            }else{
                this.tips = '请输入账号'
            }
        }
    },
    computed:{
        isComplete() {
            if (this.acct && this.psw) {
                return true
            } else {
                this.tips = ''
                return false
            }
        }
    },
    mounted() {
        this.$bus.$emit('closeTabBar')
    },
    beforeDestroy() {
        this.$bus.$emit('showTabBar')
    }
}
</script>

<style lang="less" scoped>
.login{
        padding: 0 25px;
        .logo{
            margin-top: calc(100vh * 0.08);
            height: 150px;
            font-size: 64px;
            font-weight: bold;
            text-align: center;
            line-height: 150px;
            color: #607D8B;
        }
        p{
            text-align: center;
            font-size: 26px;
            margin-bottom: 70px;
            color: #607D8B;
        }
        .inputs{
            margin-top: 20px;
            height: 60px;
            position: relative;
            input{
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
                &:focus{
                    border: 2px solid #607D8B;
                    transition: all .2s ease-in;
                    &+span{
                        color: #607D8B;
                    }
                }
                &:valid,
                &:focus{
                    &+span {
                        left: 10px;
                        top: -12px;
                        z-index: 99;
                    }
                }
            }
            span{
                position: absolute;
                left: 16px;
                top: 16px;
                font-size: 18px;
                color: #999;
                background: #fff;
                transition: all .3s;
                display: inline-block;
                padding: 0 5px;
            }
        }
        .tips{
            float: left;
            width: 100%;
            padding-top: 10px;
            color: #FF5D5B;
            .tips-right{
                float: right;
                color: #000;
            }
        }
        .button{
            height: 50px;
            margin-top: 160px;
            display: flex;
            justify-content: space-between;
            line-height: 50px;
            .button-to-register{
                width: 100px;
                height: 50px;
                text-align: center;
                font-size: 16px;
                border-radius: 6px;
                &:active{
                    background: #D7E4F5;
                }
            }
            .button-login{
                width: 100px;
                height: 50px;
                background: #607D8B;
                text-align: center;
                font-size: 18px;
                color: #fff;
                border-radius: 6px;
                &:active {
                    background: #34495E;
                }
                &.grey{
                    background: #999;
                }
            }
        }
    }
</style>