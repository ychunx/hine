<template>
    <div class="more">
        <div class="more-top">
            <div class="more-top-box">
                <img :src="userInfo.imgUrl">
                <p>{{ userInfo.name }}</p>
                <div>
                    {{ userInfo.signature }}
                </div>
            </div>
        </div>
        <ul class="more-main">
            <li>
                <div class="more-main-left">邮箱</div>
                <div class="more-main-center">{{ userInfo.email }}</div>
                <div class="more-main-right"><img src="../../assets/images/right.png"></div>
            </li>
            <li>
                <div class="more-main-left">性别</div>
                <div class="more-main-center">{{ userInfo.sex }}</div>
                <div class="more-main-right"><img src="../../assets/images/right.png"></div>
            </li>
            <li>
                <div class="more-main-left">生日</div>
                <div class="more-main-center">{{ formatDateTime(userInfo.birth) }}</div>
                <div class="more-main-right"><img src="../../assets/images/right.png"></div>
            </li>
            <li>
                <div class="more-main-left">注册</div>
                <div class="more-main-center">{{ formatDateTime(userInfo.registerTime) }}</div>
                <div class="more-main-right"></div>
            </li>
        </ul>
        <ul class="more-main logout">
            <li>
                <div class="more-main-left"><img src="../../assets/images/change.png"></div>
                <div class="more-main-center">修改密码</div>
                <div class="more-main-right"><img src="../../assets/images/right.png"></div>
            </li>
            <li @click="logout">
                <div class="more-main-left"><img src="../../assets/images/out.png"></div>
                <div class="more-main-center">退出登录</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'More',
    methods:{
        intoSearch() {
            this.$router.push('/search')
        },
        logout() {
            this.$socket.emit('offline', this.userInfo._id)
            this.$store.dispatch('User/logout')
            this.$router.go(0)
        },
        // 格式化时间
        formatDateTime(date) {
            if (date == "" || !date) {
                return ""
            }
            let newDate = new Date(date)
            let y = newDate.getFullYear()
            let m = newDate.getMonth() + 1
            m = m < 10 ? ('0' + m) : m
            let d = newDate.getDate()
            d = d < 10 ? ('0' + d) : d
            // let h = newDate.getHours()
            // h = h < 10 ? ('0' + h) : h
            // let minute = newDate.getMinutes()
            // minute = minute < 10 ? ('0' + minute) : minute
            // let second = newDate.getSeconds()
            // second = second < 10 ? ('0' + second) : second

            return `${y}-${m}-${d}`
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.User.userInfo
        }
    },
    mounted() {
        this.$bus.$emit('activeTabBar')
    },
    beforeDestroy() {
        this.$bus.$emit('deactiveTabBar')
    }
}
</script>

<style lang="less" scoped>
.more{
        height: calc(100vh - 60px);
        background: #f9f9f9;
        overflow: scroll;
        .more-top{
            height: 120px;
            background: #607D8B;
            position: relative;
            .more-top-box{
                width: 90%;
                height: 175px;
                border-top-left-radius: 15px;
                border-top-right-radius: 15px;
                background: #ffffff;
                position: absolute;
                top: 90px;
                left: 50%;
                transform: translateX(-50%);
                padding-top: 60px;
                box-sizing: border-box;
                img{
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    position: absolute;
                    top: -50px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
                }
                p {
                    text-align: center;
                    font-size: 22px;
                    font-weight: bold;
                    height: 30px;
                    line-height: 30px;
                }
                div{
                    height: 75px;
                    padding: 10px 10px;
                    margin: 0 10px;
                    box-sizing: border-box;
                    overflow: scroll;
                    background: #f9f9f9;
                    border-radius: 10px;
                }
            }
        }
        .more-main{
            width: 100%;
            margin-top: 155px;
            li{
                width: 90%;
                height: 55px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                background: #ffffff;
                border-bottom: 1px solid #EDEDED;
                img{
                    width: 20px;
                    height: 20px;
                    vertical-align: middle;
                }
                .more-main-left{
                    width: 70px;
                    padding-left: 20px;
                    box-sizing: border-box;
                    color: #607D8B;
                    font-weight: bold;
                }
                .more-main-center{
                    flex: 1;
                }
                .more-main-right{
                    padding-right: 10px;
                }
            }
            &.logout{
                margin-top: 10px;
            }
        }
    }
</style>