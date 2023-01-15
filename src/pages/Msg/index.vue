<template>
  <div class="msg">
    <div class="msg-main" :class="{ hide }">
      <TopBar />
      <ul class="msg-ul">
        <li class="msg-item" v-for="item in allMsgs" :key="item.friendId">
          <div class="msg-item-tip">0</div>
          <img :src="item.imgUrl">
          <div class="msg-item-main">
            <div class="msg-item-title">
              <span>{{ item.name }}</span>
              <span>最后时间</span>
            </div>
            <div class="msg-item-content">
              最后消息
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="dialog" :class="{dialogShow}">
      <Dialog></Dialog>
    </div>
  </div>
</template>

<script>
import TopBar from '../../components/TopBar'
import Dialog from './Dialog'
import { mapState } from 'vuex'
export default {
    name: 'Msg',
    components:{TopBar, Dialog},
    data() {
      return {
        hide: false,
        dialogShow: false,
      }
    },
    methods:{
      intoDialog(friendId){
        this.$bus.$emit('hideTabBar')
        this.hideMsg()
        
        this.$nextTick(() => {
          this.$bus.$emit('moveToBottom')
        })

        this.$API.readFriendMsgs({userId: this.$store.state.User.userInfo._id, friendId})
      },
      hideMsg() {
        this.hide = true
        this.dialogShow = true
      },
      showMsg() {
        this.hide = false
        this.dialogShow = false
      },

      // 获取数据
      async getMsgData() {
        await this.$store.dispatch('Chat/reqAllMsgs')
        if (this.$store.state.Friend.friends.length == 0) {
          await this.$store.dispatch('Friend/reqFriends')
        }
      },

      // 格式化时间
      formatDateTime(date) {
        if (date == "" || !date) {
          return ""
        }
        var date = new Date(date)
        // var y = date.getFullYear()
        // var m = date.getMonth() + 1
        // m = m < 10 ? ('0' + m) : m
        // var d = date.getDate()
        // d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        var minute = date.getMinutes()
        minute = minute < 10 ? ('0' + minute) : minute
        // var second = date.getSeconds()
        // second = second < 10 ? ('0' + second) : second
        return `${h}:${minute}`
      }
    },
    computed: {
      ...mapState({
        allMsgs: state => state.Chat.allMsgs,
      })
    },
    mounted() {
      this.$bus.$emit('activeTabBar')

      this.$bus.$on('hideMsg',this.hideMsg)
      this.$bus.$on('showMsg',this.showMsg)

      this.getMsgData()

      // 暂时解决
      // setInterval(() => {
      //   this.getData()
      //   if (this.in) {
      //     this.$bus.$emit('moveToBottom')
      //   }
      // },2000)
    },
    beforeDestroy() {
      this.$bus.$emit('deactiveTabBar')
    }
}
</script>

<style lang="less" scoped>
.msg{
    position: relative;
    .msg-main {
      background: #F9F9F9;
      transition: all .5s;
      &.hide {
        transform: translateX(-20%);
      }
      .msg-ul {
        width: 100%;
        height: calc(100vh - 60px);
        padding-top: 60px;
        overflow: scroll;
        box-sizing: border-box;
        .msg-item {
          width: 100%;
          height: 80px;
          padding: 0 20px;
          position: relative;
          box-sizing: border-box;
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #EDEDED;

          .msg-item-tip {
            width: 30px;
            height: 20px;
            border-radius: 10px;
            color: #fff;
            background: #FA5252;
            line-height: 20px;
            position: absolute;
            bottom: 15px;
            right: 20px;
            text-align: center;
          }

          img {
            width: 50px;
            height: 50px;
            border-radius: 20%;
            margin-right: 8px;
          }

          .msg-item-main {
            flex: 1;
            height: 80px;
            padding: 15px 0;
            overflow: hidden;
            box-sizing: border-box;

            .msg-item-title {
              width: 100%;
              height: 25px;
              box-sizing: border-box;

              span:nth-child(1) {
                font-size: 18px;
                font-weight: bold;
              }

              span:nth-child(2) {
                float: right;
                color: #999;
                font-size: 12px;
              }
            }

            .msg-item-content {
              width: 80%;
              height: 25px;
              color: #999;
              font-weight: bold;
              line-height: 30px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 14px;
              letter-spacing: 1.5px;
            }
          }
        }
      }
    }
    .dialog{
      width: 100%;
      position: fixed;
      top: 0;
      left: 100%;
      transition: all .3s;
      z-index: 999;
      &.dialogShow{
        left: 0
      }
    }
  }
</style>