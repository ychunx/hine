<template>
    <div class="more">
        <div class="more-top">
            <img src="../../assets/images/1.jpg">
            <div>
                <p>王强</p>
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
    </div>
</template>

<script>
export default {
    name: 'More',
    methods:{
        intoSearch(){
            this.$router.push('/search')
        }
    }
}
</script>

<style lang="less" scoped>
.more{
        .more-top{
            width: 100%;
            height: 175px;
            padding: 50px 25px 25px 25px;
            box-sizing: border-box;
            display: flex;
            //background: #607D8B;
            background: linear-gradient(145deg, #678695, #56717d);
            box-shadow: 10px 10px 20px #526a76,
                -10px -10px 20px #6e90a0;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            img{
                width: 100px;
                height: 100px;
                border-radius: 10px;
                margin-right: 20px;
            }
            div{
                flex: 1;
                color: #fff;
                font-size: 20px;
                font-weight: bold;
            }
        }
        .more-main{
            width: 100%;
            padding-top: 30px;
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