<template>
    <div class="search">
        <div class="search-top">
            <img src="../../assets/images/left.png" @click="back">
            <input type="text" placeholder="搜索">
        </div>
        <ul class="search-list">
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
            </li>
            <li class="search-item">
                aaaaaaaaaaaaaaaaa
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
            padding: 15px;
            width: 100%;
            height: 110px;
            text-align: center;
            box-sizing: border-box;
            background: #ffffff;
            border-bottom: 1px solid #EDEDED;
            img{
                width: 30px;
                height: 30px;
                display: block;
                margin-bottom: 10px;
            }
            input{
                width: 95%;
                height: 40px;
                border: none;
                font-size: 22px;
            }
        }
        .search-list{
            height: calc(100vh - 110px);
            list-style: none;
            overflow: scroll;
            li{
                width: 100%;
                height: 60px;
                padding: 0 20px;
                box-sizing: border-box;
                border-bottom: 1px solid #EDEDED;
            }
        }
    }
</style>