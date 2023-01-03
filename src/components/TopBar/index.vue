<template>
    <div>
        <div class="mask"></div>
        <div class="top-bar">
            <div>Hine</div>
            <img src="../../assets/images/search.png" @click="intoSearch">
        </div>
    </div>
</template>

<script>
export default {
    name: 'TopBar',
    methods:{
        intoSearch(){
            this.$router.push('/search')
        }
    }
}
</script>

<style lang="less" scoped>
.mask{
        width: 100%;
        height: 60px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        backdrop-filter: blur(8px);
    }
    .top-bar{
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #EDEDED;
        //background: #E7F0F7;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 10px 10px 20px #f2f2f2,
                -10px -10px 20px #ffffff;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        line-height: 60px;
        font-size: 26px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        align-items: center;
        img {
            width: 25px;
            height: 25px;
        }
    }
</style>