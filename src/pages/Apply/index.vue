<template>
    <div class="apply">
        <div class="apply-top">
            <div class="apply-top-box">
                <img :src="imgUrl">
                <div>
                    <p>{{name}}</p>
                    <div contenteditable="true" class="apply-input" ref="applyInput"></div>
                </div>
            </div>
        </div>
        <div class="apply-bottom">
            <div class="apply-back" @click="back">取消</div>
            <div class="apply-send" @click="send" ref="applySend">发送</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Apply',
    data() {
        return {
            id: '',
            name: '',
            imgUrl: '',
            type: ''
        }
    },
    methods: {
        back() {
            this.$router.back()
        },
        async send() {
            this.$refs.applySend.innerText = '请稍后'

            let data = {}
            data.content = this.$refs.applyInput.innerText.trim()
            data.userId = this.$store.state.User.userInfo._id

            try {
                let res = ''
                if (this.type == 'friend') {
                    data.friendId = this.id
                    res = await this.$API.friendApply(data)
                } else {
                    data.groupId = this.id
                    //res = await this.$API.groupApply(data)
                }
                if (res.status == 0) {
                    this.back()
                } else {
                    this.$refs.applySend.innerText = '添加失败'
                }
            } catch (error) {
                this.$refs.applySend.innerText = `添加失败${error}`
            }
        }
    },
    mounted() {
        let query = this.$route.query
        this.id = query.id
        this.name = query.name
        this.imgUrl = query.imgUrl
        this.type = query.type
    }
}
</script>

<style lang="less" scoped>
.apply{
        height: 100vh;
        .apply-top{
            height: 20vh;
            background: #607D8B;
            position: relative;
            .apply-top-box{
                width: 100%;
                height: 70vh;
                background: #ffffff;
                border-top-left-radius: 15px;
                border-top-right-radius: 15px;
                position: absolute;
                top: 85%;
                padding-top: 60px;
                box-sizing: border-box;
                img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    position: absolute;
                    top: -50px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
                }
                div {
                    p {
                        text-align: center;
                        font-size: 26px;
                        font-weight: bold;
                    }
                    .apply-input{
                        width: 90%;
                        height: 55vh;
                        background: #f9f9f9;
                        border-radius: 10px;
                        margin: 20px auto;
                        outline: none;
                        font-size: 22px;
                        padding: 10px;
                        box-sizing: border-box;
                        overflow: scroll;
                    }
                }
            }
        }
        .apply-bottom{
            width: 100%;
            height: 100px;
            position: fixed;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .apply-back{
                width: 25%;
                height: 50px;
                background: #EDEDED;
                font-size: 20px;
                text-align: center;
                line-height: 50px;
                border-radius: 10px;
            }
            .apply-send{
                width: 55%;
                height: 50px;
                background: #607D8B;
                color: #ffffff;
                font-size: 20px;
                text-align: center;
                line-height: 50px;
                border-radius: 10px;
            }
        }
    }
</style>