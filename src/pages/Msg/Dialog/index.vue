<template>
  <div>
    <div class="mask"></div>
    <div class="dialog">
        <div class="dialog-top">
            <div class="dialog-back"><img src="../../../assets/images//left.png" @click="back"></div>
            <div class="dialog-title">名字</div>
            <div class="dialog-info"><img src="user.png"></div>
        </div>
        <div class="dialog-main" ref="dialogMain">
            <ul class="msg-ul">
                <!-- <li :class="item.from == 'friends' ? 'msg-ul-left' : 'msg-ul-right'"> -->
                <!-- 判断是哪边发送 -->
                <li>
                    <div class="msg-li-content">
                        内容
                    </div>
                    <div class="msg-li-time">
                        时间
                    </div>
                </li>
            </ul>
        </div>
        <div class="dialog-input">
            <div class="dialog-input-plus"><img src="../../../assets/images/plus.png"></div>
            <div class="dialog-input-content">
                <div contenteditable="true" ref="dialogInputContent" @input="moveToBottom" @focus="moveToBottom"></div>
                <img src="../../../assets/images/keyboard.png" @click="toggleType" v-if="isEmoji">
                <img src="../../../assets/images/emoji.png" @click="toggleType" v-else>
            </div>
            <div class="dialog-input-send"><img src="../../../assets/images/send.png" @click="send"></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Dialog',
    props: ['msgData', 'intoId'],
    data() {
        return {
            isEmoji: false,
        }
    },
    methods:{
        back() {
            this.$bus.$emit('showMsg')
            this.$bus.$emit('showTabBar')
        },

        // 切换键盘
        toggleType() {
            this.isEmoji = !this.isEmoji
            if (this.isEmoji) {
                this.$refs.dialogInputContent.blur()
            } else {
                this.$refs.dialogInputContent.focus()
            }
        },

        // 发送消息
        send() {
            let content = this.$refs.dialogInputContent.innerText
            let userId = this.$store.state.User.userInfo._id
            let friendId = this.friend.friendId
            let types = '0'

            // 添加进数组，socket 发送方法

            this.$refs.dialogInputContent.innerText = ''
            this.$nextTick(() => {
                this.moveToBottom()
            })

            this.$refs.dialogInputContent.focus()
        },

        // 消息盒子滚至底部
        moveToBottom() {
            // this.$refs.dialogMain.scrollHeight - this.$refs.dialogInput.offsetTop
            setTimeout(() => {
                this.$refs.dialogMain && this.$refs.dialogMain.scrollTo(0, this.$refs.dialogMain.scrollHeight)
            }, 100)
        },

        // 快速排序
        qSort(arr) {
            if (arr.length <= 0) {
                return []
            }

            let pivot = arr.splice(0, 1)[0]
            let lesser = []
            let greater = []

            arr.forEach(item => {
                if (item.time < pivot.time) {
                    lesser.push(item)
                } else {
                    greater.push(item)
                }
            })
            return this.qSort(lesser).concat(pivot, this.qSort(greater))
        },

        // 格式化时间
        formatDateTime(date) {
            if (date == "" || !date) {
                return ""
            }
            var date = new Date(date)
            // var y = date.getFullYear()
            // var m = date.getMonth() + 1
            // m = m < 10 ? ('0' + m) : m
            // var d = date.getDate()
            // d = d < 10 ? ('0' + d) : d
            var h = date.getHours()
            h = h < 10 ? ('0' + h) : h
            var minute = date.getMinutes()
            minute = minute < 10 ? ('0' + minute) : minute
            // var second = date.getSeconds()
            // second = second < 10 ? ('0' + second) : second
            return `${h}:${minute}`
        },

    },
    mounted() {
        this.$bus.$on('moveToBottom', this.moveToBottom)
    }
}
</script>

<style lang="less" scoped>
.mask {
        width: 100%;
        height: 60px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        backdrop-filter: blur(8px);
    }
    .dialog{
        background: #ffffff;
        .dialog-top{
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
            z-index: 99;
            position: absolute;
            top: 0;
            left: 0;
            .dialog-back{
                width: 60px;
                text-align: center;
                img{
                    width: 25px;
                    height: 25px;
                }
            }
            .dialog-title{
                flex: 1;
                height: 60px;
                text-align: center;
                line-height: 60px;
                font-size: 20px;
            }
            .dialog-info{
                width: 60px;
                img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                }
            }
        }
        .dialog-main{
            height: calc(100vh - 60px);
            overflow: scroll;
            .msg-ul{
                padding-top: 60px;
                box-sizing: border-box;
                list-style: none;
                li{
                    padding: 5px 20px;
                    width: fit-content;
                    width: -webkit-fit-content;
                    width: -moz-fit-content;
                    .msg-li-time{
                        font-size: 12px;
                    }
                }
                .msg-ul-left{
                    .msg-li-content{
                        background: #E7F0F7;
                        border-radius: 20px;
                        border-bottom-left-radius: 10px;
                        padding: 10px;
                    }
                    .msg-li-time{
                        padding-left: 5px;
                    }
                }
                .msg-ul-right{
                    margin-left: auto;
                    .msg-li-content{
                        background: #607D8B;
                        border-radius: 20px;
                        border-bottom-right-radius: 10px;
                        padding: 10px;
                        color: #ffffff;
                        text-align: end;
                    }
                    .msg-li-time{
                        text-align: end;
                        padding-right: 5px;
                    }
                }
            }
        }
        .dialog-input{
            width: 100%;
            background: #E7F0F7;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .dialog-input-plus{
                width: 50px;
                height: 60px;
                padding: 16px 0;
                text-align: center;
                box-sizing: border-box;
                img{
                    width: 28px;
                    height: 28px;
                }
            }
            .dialog-input-content{
                flex: 1;
                min-height: 40px;
                background: #ffffff;
                border-radius: 5px;
                font-size: 20px;
                margin: 10px 0;
                box-sizing: border-box;
                display: flex;
                align-items: flex-end;
                div{
                    flex: 1;
                    outline: none;
                    padding: 5px 0 5px 10px;
                }
                img{
                    width: 30px;
                    height: 30px;
                    margin: 5px;
                }
            }
            .dialog-input-send{
                width: 50px;
                height: 60px;
                padding: 15px 0;
                text-align: center;
                box-sizing: border-box;
                img{
                    width: 30px;
                    height: 30px;
                }
            }
        }
    }
</style>