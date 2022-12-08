<template>
    <div class="bar-box" :class="close ? 'deactive' : ''">
        <div class="bar-button" :class="scene == 'msg' ? 'active' : ''" @click="changeScene('msg')">
            <img src="../../assets/images/msg.png">
            <img src="../../assets/images/msg-fill.png">
            <span>消息</span>
        </div>
        <div class="bar-button" :class="scene == 'contacts' ? 'active' : ''" @click="changeScene('contacts')">
            <img src="../../assets/images/contacts.png">
            <img src="../../assets/images/contacts-fill.png">
            <span>通讯录</span>
        </div>
        <div class="bar-button" :class="scene == 'more' ? 'active' : ''" @click="changeScene('more')">
            <img src="../../assets/images/more.png">
            <img src="../../assets/images/more-fill.png">
            <span>发现</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TabBar',
    data(){
        return {
            scene : 'msg',
            close: false
        }
    },
    methods:{
        closeTabBar(){
            this.close = true
        },
        showTabBar(){
            this.close = false
        },
        changeScene(scene){
            let curScene = this.$route.path.slice(1)
            if(scene != curScene) {
                this.$router.push(`/${scene}`)
                this.scene = scene
            }
        }
    },
    mounted(){
        this.$bus.$on('closeTabBar',this.closeTabBar)
        this.$bus.$on('showTabBar', this.showTabBar)
    }
}
</script>

<style lang="less" scoped>
.bar-box.deactive{
    transform: translateY(60px);
}
.bar-box{
        width: 100%;
        height: 60px;
        background: #E7F0F7;
        position: fixed;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        transition: all .3s ease-out;
        .bar-button{
            width: 60px;
            height: 60px;
            padding-top: 15px;
            box-sizing: border-box;
            text-align: center;
            transition: all .3s ease-out;
            img{
                width: 25px;
                height: 25px;
                display: block;
                padding: 3px 17.5px;
            }
            img:nth-child(2){
                display: none;
            }
            span{
                font-size: 12px;
                transition: all .3s ease-out;
                display: block;
                opacity: 0;
                color: #607D8B;
            }
        }
        .bar-button.active{
            padding-top: 7px;
            img:nth-child(1){
                display: none;
            }
            img:nth-child(2){
                display: block;
                background: #D7E4F5;
                border-radius: 25px;
            }
            span{
                opacity: 1;
            }
        }
    }
</style>