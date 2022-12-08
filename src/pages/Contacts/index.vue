<template>
    <div class="contacts">
        <TopBar />
        <div class="contacts-main">
            <ul class="contacts-menu">
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
            <ul class="contacts-main-box">
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
                <li>
                    <img src="../../assets/images/1.jpg">
                    <span>王强</span>
                </li>
            </ul>
            <h1>共 88 位</h1>
        </div>
    </div>
</template>

<script>
import TopBar from '../../components/TopBar'

export default {
    name: 'Contacts',
    components:{TopBar}
}
</script>

<style lang="less" scoped>
    .contacts{
        background: #E7F0F7;
        .contacts-main{
            padding-top: 60px;
            height: calc(100vh - 60px);
            box-sizing: border-box;
            overflow: scroll;
            .contacts-menu{
                width: 100%;
                margin-bottom: 20px;
                background: #fff;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
                box-shadow: 20px 20px 60px #d9d9d9,
                        -20px -20px 60px #ffffff;
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
                }
            }
            .contacts-main-box{
                width: 100%;
                background: #fff;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                box-shadow: 20px 20px 60px #d9d9d9,
                        -20px -20px 60px #ffffff;
                li{
                    display: flex;
                    align-items: center;
                    padding: 10px 20px;
                    border-bottom: 1px solid #EDEDED;
                    img{
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                        margin-right: 20px;
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