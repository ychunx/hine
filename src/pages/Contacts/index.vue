<template>
    <div class="contacts">
        <TopBar />
        <ul class="contacts-menu">
            <li>
                <img src="../../assets/images/add.png">
                <span>好友请求</span>
            </li>
            <li>
                <img src="../../assets/images/add.png">
                <span>好友请求</span>
            </li>
            <li>
                <img src="../../assets/images/add.png">
                <span>好友请求</span>
            </li>
        </ul>
        <div class="contacts-br"></div>
        <ul class="contacts-main">
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
        padding: 60px 0;
        background: #E7F0F7;
        .contacts-menu{
            width: 100%;
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
            }
        }
        .contacts-br{
            width: 100%;
            height: 30px;
        }
        .contacts-main{
            width: 100%;
            background: #fff;
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
</style>