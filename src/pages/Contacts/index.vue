<template>
    <div class="contacts">
        <div class="contacts-main">
            <TopBar />
            <div class="contacts-main-content">
                <ul class="contacts-menu">
                    <li @click="intoNew">
                        <img src="../../assets/images/add.png">
                        <span>好友请求</span>
                        <div class="tip" v-show="applyNum != 0">
                            <div>{{ applyNum }}</div>
                        </div>
                    </li>
                    <li>
                        <img src="../../assets/images/hint.png">
                        <span>新建加密对话</span>
                    </li>
                    <li>
                        <img src="../../assets/images/group.png">
                        <span>新建群组</span>
                    </li>
                </ul>
                <ul class="contacts-main-box">
                    <li v-for="item in friends" :key="item._id" @click="intoDetails(item._id)">
                        <img :src="item.imgUrl">
                        <span>{{ item.nickname ? item.nickname : item.name }}</span>
                    </li>
                </ul>
                <h1>共 {{ friendsNum }} 位</h1>
            </div>
        </div>
        <div class="new-box" :class="{newShow}">
            <New></New>
        </div>
    </div>
</template>

<script>
import TopBar from '../../components/TopBar'
import New from './New'
import { mapState } from 'vuex'
export default {
    name: 'Contacts',
    components: { TopBar, New },
    data() {
        return {
            newShow: false
        }
    },
    methods: {
        intoNew() {
            this.newShow = true
        },
        hideNew() {
            this.newShow = false
        },

        // 进入用户详情页
        intoDetails(id) {
            this.$router.push({
                path: '/detail',
                query: { id }
            })
        }
    },
    computed: {
        ...mapState({
            friends: state => state.Friend.friends,
            friendsNum: state => state.Friend.friends.length,
            applyNum: state => state.Friend.friendApplys.length
        })
    },
    mounted() {
        this.$bus.$emit('activeTabBar')

        this.$bus.$on('hideNew', this.hideNew)
    },
    beforeDestroy() {
        this.$bus.$emit('deactiveTabBar')
    }
}
</script>

<style lang="less" scoped>
.contacts{
        position: relative;
        .contacts-main {
            background: #F9F9F9;
            .contacts-main-content {
                padding-top: 60px;
                height: calc(100vh - 60px);
                box-sizing: border-box;
                overflow: scroll;
                .contacts-menu {
                    width: 100%;
                    margin-bottom: 10px;
                    background: #fff;
                    li {
                        display: flex;
                        align-items: center;
                        padding: 15px 30px;
                        img {
                            width: 20px;
                            height: 20px;
                            margin-right: 30px;
                        }
                        span {
                            font-weight: bold;
                        }
                        .tip {
                            flex: 1;
                            div {
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
                .contacts-main-box {
                    width: 100%;
                    background: #fff;

                    li {
                        display: flex;
                        align-items: center;
                        padding: 10px 20px;
                        border-bottom: 1px solid #EDEDED;

                        img {
                            width: 35px;
                            height: 35px;
                            border-radius: 20%;
                            margin-right: 25px;
                        }

                        span {
                            font-size: 16px;
                            font-weight: bold;
                        }
                    }
                }
                h1 {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: normal;
                }
            }
        }
        .new-box{
            width: 20px;
            height: 20px;
            border-radius: 25px;
            position: absolute;
            z-index: -1;
            top: 75px;
            left: 30px;
            transition: all .3s ease-out;
            overflow: hidden;
            &.newShow{
                width: 100%;
                height: 100vh;
                z-index: 999;
                top: 0;
                left: 0;
                border-radius: 0;
            }
        }
    }
</style>