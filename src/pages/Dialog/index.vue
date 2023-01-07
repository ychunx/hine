<template>
  <div>
    <div class="mask"></div>
    <div class="dialog">
        <div class="dialog-top">
            <div class="dialog-back"><img src="../../assets/images//left.png" @click="back"></div>
            <div class="dialog-title">{{ $store.state.User.userInfo.name }}</div>
            <div class="dialog-info"><img src="../../assets/images/info.png"></div>
        </div>
        <div class="dialog-main" ref="dialogMain">
            <div class="msg-ul">
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
                <div class="msg-li-left"><img src="../../assets/images/1.jpg">你好</div>
                <div class="msg-li-right">你好<img src="../../assets/images/1.jpg"></div>
            </div>
        </div>
        <div class="dialog-input" ref="dialogInput">
            <div class="dialog-input-plus"><img src="../../assets/images/plus.png"></div>
            <div class="dialog-input-content">
                <div contenteditable="true" ref="dialogInputContent" @focus="moveToBottom"></div>
                <img src="../../assets/images/keyboard.png" @click="chooseType(false)" v-if="isKeyboard">
                <img src="../../assets/images/emoji.png" @click="chooseType(true)" v-else>
            </div>
            <div class="dialog-input-send"><img src="../../assets/images/send.png"></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Dialog',
    data() {
        return {
            isKeyboard: false
        }
    },
    methods:{
        back() {
            this.$router.back()
        },
        chooseType(type) {
            this.isKeyboard = type
            if (type) {
                this.$refs.dialogInputContent.blur()
            } else {
                this.$refs.dialogInputContent.focus()
            }
        },
        moveToBottom() {
            // 消息盒子滚至底部
            // 卷起的高度 = 内容的高度 - 输入框离父元素（相当于浏览器视窗顶部）的高度
            this.$refs.dialogMain.scrollTop = this.$refs.dialogMain.scrollHeight - this.$refs.dialogInput.offsetTop
        }
    },
    mounted(){
        this.$nextTick(() => {
            // 进入页面时消息盒子自动滚至底部
            this.moveToBottom()
        })
    }
}
</script>

<style lang="less" scoped>
.mask {
        width: 100%;
        height: 60px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        backdrop-filter: blur(8px);
    }
    .dialog{
        .dialog-top{
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
            z-index: 99;
            position: fixed;
            top: 0;
            left: 0;
            .dialog-back{
                width: 60px;
                text-align: center;
                box-sizing: border-box;
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
                text-align: center;
                box-sizing: border-box;
                img{
                    width: 25px;
                    height: 25px;
                }
            }
        }
        .dialog-main{
            height: calc(100vh - 60px);
            overflow: scroll;
            .msg-ul{
                padding-top: 60px;
                box-sizing: border-box;
                background: #F9F9F9;
                .msg-li-left{
                    height: 80px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    background: #E7F0F7;
                }
                .msg-li-right{
                    height: 80px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                }
                img{
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }
        }
        .dialog-input{
            width: 100%;
            //height: 60px;
            background: #E7F0F7;
            display: flex;
            justify-content: space-between;
            align-items: end;
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
                align-items: end;
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