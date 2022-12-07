<template>
    <div class="more">
        <div class="more-top">
            <img src="../../assets/images/1.jpg">
            <div>
                <p>王强</p>
            </div>
        </div>
        <div class="more-br"></div>
        <ul class="more-main">
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
    </div>
</template>

<script>
export default {
    name: 'More',
}
</script>

<style lang="less" scoped>
.more{
        background: #E7F0F7;
        .more-top{
            width: 100%;
            height: 175px;
            padding: 50px 25px 25px 25px;
            box-sizing: border-box;
            display: flex;
            background: #607D8B;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            img{
                width: 100px;
                height: 100px;
                border-radius: 10px;
                margin-right: 20px;
            }
            div{
                flex: 1;
                color: #fff;
                font-size: 18px;
                font-weight: bold;
            }
        }
        .more-br{
            width: 100%;
            height: 30px;
        }
        .more-main{
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
    }
</style>