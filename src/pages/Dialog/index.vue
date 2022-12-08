<template>
  <div class="dialog">
    <div class="dialog-top">
        <div class="dialog-back"><img src="../../assets/images//left.png" @click="back"></div>
        <div class="dialog-title">王强</div>
        <div class="dialog-portrait"><img src="../../assets/images/1.jpg"></div>
    </div>
    <div class="dialog-main">
        <div></div>
    </div>
    <div class="dialog-input">
        <div class="dialog-input-plus"><img src="../../assets/images/plus.png"></div>
        <div class="dialog-input-box"></div>
        <div class="dialog-input-send">发送</div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Dialog',
    methods:{
        back() {
            this.$router.back()
        }
    },
    mounted(){
        this.$bus.$emit('closeTabBar')
    },
    beforeDestroy() {
        this.$bus.$emit('showTabBar')
    }
}
</script>

<style lang="less" scoped>
.dialog{
        .dialog-top{
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: space-between;
            box-shadow: 10px 10px 20px #f2f2f2,
                    -10px -10px 20px #ffffff;
            background: #ffffff;
            .dialog-back{
                width: 60px;
                height: 60px;
                padding: 15px;
                box-sizing: border-box;
                img{
                    width: 30px;
                    height: 30px;
                }
            }
            .dialog-title{
                flex: 1;
                height: 60px;
                text-align: center;
                line-height: 60px;
                font-size: 20px;
            }
            .dialog-portrait{
                width: 60px;
                height: 60px;
                img{
                    width: 50px;
                    height: 50px;
                    margin-top: 5px;
                    border-radius: 50%;
                }
            }
        }
        .dialog-main{
            width: 100%;
            height: calc(100vh - 120px);
            overflow: scroll;
            div{
                height: 2000px;background: pink;
            }
        }
        .dialog-input{
            width: 100%;
            height: 60px;
            background: #E7F0F7;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .dialog-input-plus{
                width: 60px;
                height: 60px;
                padding: 12px;
                box-sizing: border-box;
                img{
                    width: 36px;
                    height: 36px;
                }
            }
            .dialog-input-box{
                flex: 1;
                height: 40px;
                background: #ffffff;
                border-radius: 20px;
            }
            .dialog-input-send{
                width: 60px;
                height: 60px;
                text-align: center;
                line-height: 60px;
                font-size: 20px;
            }
        }
    }
</style>