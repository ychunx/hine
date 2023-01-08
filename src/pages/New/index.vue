<template>
  <div class="new">
    <div class="new-top">
        <div class="back" @click="back">
            <img src="../../assets/images/left.png">
        </div>
    </div>
    <ul class="new-ul">
        <li class="new-li" v-for="item in $store.state.Friend.friendApplys" :key="item.FriendId">
            <div class="li-left">
                <img :src="item.imgUrl">
                <p>{{ item.name }}</p>
            </div>
            <div class="li-center">{{ item.msgs[item.msgs.length-1].content }}</div>
            <div class="li-right"></div>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
    name: 'new',
    methods: {
        back() {
            this.$router.back()
            this.$store.dispatch('Search/clearResult')
        }
    },
}
</script>

<style lang="less" scoped>
    .new{
        .new-top{
            height: 60px;
            background: #ffffff;
            box-sizing: border-box;
            border-bottom: 1px solid #EDEDED;
            display: flex;
            align-items: center;
            .back {
                width: 60px;
                text-align: center;
                img {
                    width: 25px;
                    height: 25px;
                }
            }
        }
    }
</style>