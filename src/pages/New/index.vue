<template>
  <div class="new">
    <div class="new-top">
        <div class="back" @click="back">
            <img src="../../assets/images/left.png">
        </div>
    </div>
    <ul class="new-ul">
        <li class="new-li" v-for="item in friendApplys" :key="item.friendId"
            :class="{ 'reqError': errorId == item.friendId, 'reqSuccess': successId == item.friendId }">
            <div class="li-left">
                <img :src="item.imgUrl">
                <p>{{ item.name }}</p>
            </div>
            <div class="li-center">
                <p>验证信息</p>
                <div>
                    {{ item.msgs[item.msgs.length-1].content }}
                </div>
            </div>
            <div class="li-right">
                <div class="li-right-btn agree" @click="agree(item.friendId)">同意</div>
                <div class="li-right-btn reject" @click="reject(item.friendId)">拒绝</div>
            </div>
        </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'new',
    data() {
        return {
            errorId: '',
            successId: ''
        }
    },
    methods: {
        back() {
            this.$router.back()
        },
        reqData() {
            this.$store.dispatch('Friend/reqFriendApplys')
        }
        ,
        async agree(friendId) {
            let res = await this.$API.agreeApply({friendId, userId: this.userId})
            if (res.status == 0) {
                this.successId = friendId
            } else {
                this.errorId = friendId
            }
            setTimeout(() => {
                this.reqData()
            }, 300);
        },
        async reject(friendId) {
            let res = await this.$API.rejectApply({ friendId, userId: this.userId })
            if (res.status == 0) {
                this.successId = friendId
            } else {
                this.errorId = friendId
            }
            setTimeout(() => {
                this.reqData()
            }, 300);
        }
    },
    computed: {
        ...mapState({
            friendApplys: state => state.Friend.friendApplys,
            userId: state => state.User.userInfo._id
        })
    },
    mounted() {
        this.reqData()
    },
    beforeDestroy() {
        this.$store.dispatch('Friend/reqFriends')
    }
}
</script>

<style lang="less" scoped>
.new{
        background: #E7F0F7;
        height: 100vh;
        .new-top{
            height: 60px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            .back {
                width: 60px;
                text-align: center;
                img {
                    width: 25px;
                    height: 25px;
                }
            }
        }
        .new-ul{
            list-style: none;
            .new-li{
                width: 90%;
                height: 125px;
                margin: 0 auto 20px;
                border-radius: 10px;
                background: #fff;
                box-shadow: 0 18px 40px 0 rgba(39, 40, 50, 0.1);
                display: flex;
                &.reqError{
                    background: rgba(255, 182, 193, 0.5);
                }
                &.reqSuccess{
                    transition: all .3s;
                    transform: translateX(-120%);
                }
                .li-left{
                    width: 100px;
                    text-align: center;
                    padding-top: 10px;
                    box-sizing: border-box;
                    p{
                        font-size: 18px;
                        font-weight: bold;
                    }
                    img{
                        width: 80px;
                        height: 80px;
                        border-radius: 10px;
                        box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
                    }
                }
                .li-center{
                    flex: 1;
                    margin: 10px 0;
                    background: #f9f9f9;
                    border-radius: 5px;
                    p{
                        display: block;
                        height: 20px;
                        text-align: center;
                        border-bottom: 1px dashed #ffffff;
                    }
                    div{
                        height: 85px;
                        text-indent: 16px;
                        box-sizing: border-box;
                        padding: 5px;
                        overflow: scroll;
                    }
                }
                .li-right{
                    width: 80px;
                    .li-right-btn{
                        width: 60px;
                        height: 30px;
                        margin: 22.5px auto;
                        text-align: center;
                        line-height: 30px;
                        border-radius: 5px;
                        box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
                        &.agree{
                            background: #607D8B;
                            color: #ffffff;
                        }
                        &.reject{
                            background: rgba(255, 182, 193, 0.5);
                            color: #DC143C;
                        }
                    }
                }
            }
        }
    }
</style>