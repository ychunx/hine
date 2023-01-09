<template>
    <div class="contacts">
        <TopBar />
        <div class="contacts-main">
            <ul class="contacts-menu">
                <li @click="intoNew">
                    <img src="../../assets/images/add.png">
                    <span>好友请求</span>
                    <div class="tip" v-show="applyNum != 0">
                        <div>{{ applyNum }}</div>
                    </div>
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
            <ul class="contacts-main-box">
                <li v-for="item in this.$store.state.Friend.friends" :key="item._id">
                    <img :src="item.imgUrl">
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <h1>共 {{ this.$store.state.Friend.friends.length }} 位</h1>
        </div>
    </div>
</template>

<script>
import TopBar from '../../components/TopBar'

export default {
    name: 'Contacts',
    components: { TopBar },
    data() {
        return {

        }
    },
    methods: {
        intoNew() {
            this.$router.push('/new')
        }
    },
    computed: {
        applyNum() {
            return this.$store.state.Friend.friendApplys.length
        }
    },
    mounted() {
        this.$bus.$emit('showTabBar')

        // if (this.$store.state.Friend.friends.length == 0) {
        //     this.$store.dispatch('Friend/reqFriends')
        // }

        this.$store.dispatch('Friend/reqFriendApplys')
    },
    beforeDestroy() {
        this.$bus.$emit('closeTabBar')
    }
}
</script>

<style lang="less" scoped>
.contacts{
        background: #F9F9F9;
        .contacts-main{
            padding-top: 60px;
            height: calc(100vh - 60px);
            box-sizing: border-box;
            overflow: scroll;
            .contacts-menu{
                width: 100%;
                margin-bottom: 10px;
                background: #fff;
                li{
                    display: flex;
                    align-items: center;
                    padding: 15px 30px;
                    img{
                        width: 20px;
                        height: 20px;
                        margin-right: 30px;
                    }
                    span{
                        font-weight: bold;
                    }
                    .tip{
                        flex: 1;
                        div{
                            width: 30px;
                            height: 20px;
                            border-radius: 10px;
                            background: #FA5252;
                            float: right;
                            text-align: center;
                            color: #ffffff;
                            font-size: 14px;
                            line-height: 20px;
                        }
                    }
                }
            }
            .contacts-main-box{
                width: 100%;
                background: #fff;
                li{
                    display: flex;
                    align-items: center;
                    padding: 10px 20px;
                    border-bottom: 1px solid #EDEDED;
                    img{
                        width: 35px;
                        height: 35px;
                        border-radius: 20%;
                        margin-right: 25px;
                    }
                    span{
                        font-size: 18px;
                        font-weight: bold;
                    }
                }
            }
            h1{
                width: 100%;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 16px;
                font-weight: normal;
            }
        }
    }
</style>