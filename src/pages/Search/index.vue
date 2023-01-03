<template>
    <div class="search">
        <div class="search-top">
            <div class="back" @click="back">
                <img src="../../assets/images/left.png">
            </div>
            <div class="search-input">
                <input type="text" placeholder="搜索...">
            </div>
        </div>
        <ul class="search-list">
            <li class="search-item">
                搜索结果
            </li>
            <li class="search-item">
                搜索结果
            </li>
            <li class="search-item">
                搜索结果
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Search',
    methods:{
        back(){
            this.$router.back()
        }
    },
    mounted() {
        this.$bus.$emit('closeTabBar')
    },
    beforeDestroy(){
        this.$bus.$emit('showTabBar')
    }
}
</script>

<style lang="less" scoped>
    .search{
        .search-top{
            height: 60px;
            box-sizing: border-box;
            background: #ffffff;
            border-bottom: 1px solid #EDEDED;
            display: flex;
            align-items: center;
            .back{
                width: 60px;
                text-align: center;
                img{
                    width: 25px;
                    height: 25px;
                }
            }
            .search-input{
                flex: 1;
                input{
                    width: 80%;
                    height: 30px;
                    outline: none;
                    border: none;
                    font-size: 20px;
                }
            }
        }
        .search-list{
            height: calc(100vh - 60px);
            list-style: none;
            overflow: scroll;
            li{
                width: 100%;
                height: 60px;
                padding: 0 20px;
                box-sizing: border-box;
                border-bottom: 1px solid #EDEDED;
                display: flex;
                align-items: center;
            }
        }
    }
</style>