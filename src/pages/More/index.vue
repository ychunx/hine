<template>
    <div class="more">
        <div class="more-top">
            <div class="more-top-box">
                <img src="../../assets/images/1.jpg">
                <div>
                    <p>{{this.$store.state.User.userInfo.name}}</p>
                </div>
            </div>
        </div>
        <ul class="more-main">
            <li @click="intoSearch">
                <img src="../../assets/images/search.png">
                <span>搜索</span>
            </li>
            <li>
                <img src="../../assets/images/add.png">
                <span>好友请求</span>
            </li>
            <li>
                <img src="../../assets/images/group.png">
                <span>新建群组</span>
            </li>
            <li>
                <img src="../../assets/images/hint.png">
                <span>新建加密对话</span>
            </li>
        </ul>
        <ul class="more-main logout">
            <li @click="logout">
                <img src="../../assets/images/out.png">
                <span>退出登录</span>
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
            this.$store.dispatch('User/logout')
            this.$router.push('/login')
        }
    },
    mounted() {
        this.$bus.$emit('showTabBar')
    },
    beforeDestroy() {
        this.$bus.$emit('closeTabBar')
    }
}
</script>

<style lang="less" scoped>
.more{
        width: 100%;
        height: calc(100vh - 60px);
        background: #f9f9f9;
        .more-top{
            width: 100%;
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
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
                }
                div{
                    p{
                        text-align: center;
                        font-size: 22px;
                        font-weight: bold;
                    }
                }
            }
        }
        .more-main{
            width: 100%;
            margin-top: 155px;
            li{
                width: 90%;
                display: flex;
                align-items: center;
                padding: 15px;
                margin: 0 auto;
                background: #ffffff;
                box-sizing: border-box;
                img{
                    width: 20px;
                    height: 20px;
                    margin-right: 30px;
                }
                span{
                    font-weight: bold;
                }
            }
            &.logout{
                margin-top: 10px;
            }
        }
    }
</style>