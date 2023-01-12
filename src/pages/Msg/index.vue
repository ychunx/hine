<template>
  <div class="msg">
    <div class="msg-main" :class="{ hide }">
      <TopBar />
      <ul class="msg-ul">
        <li class="msg-item" @click="intoDialog(item.friendId)" v-for="item in msgList" :key="item.friendId">
          <div class="msg-item-tip" v-show="item.tip != 0">{{ item.tip }}</div>
          <img :src="item.imgUrl">
          <div class="msg-item-main">
            <div class="msg-item-title">
              <span>{{ item.name }}</span>
              <span>{{ formatDateTime(item.time) }}</span>
            </div>
            <div class="msg-item-content">
              {{ item.content }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="dialog" :class="{dialogShow}">
      <Dialog :msgData="dialogProp" :intoId="intoId"></Dialog>
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
        msgsArr: [],
        msgList: [],
        hide: false,
        dialogShow: false,
        intoId: '',
        in: false
      }
    },
    methods:{
      intoDialog(friendId){
        this.intoId = friendId
        this.$bus.$emit('hideTabBar')
        this.hideMsg()
        this.$nextTick(() => {
          this.$bus.$emit('moveToBottom')
        })
        this.in = true

        this.$API.readFriendMsgs({userId: this.$store.state.User.userInfo._id, friendId})
      },
      hideMsg() {
        this.hide = true
        this.dialogShow = true
      },
      showMsg() {
        this.hide = false
        this.dialogShow = false
        this.in = false
      },

      // 合并为一个数组，每个元素是每个好友的所有来回消息和好友id
      getMsgsArr() {
        let name = ''
        let imgUrl = ''
        this.msgsArr = this.myAllMsgs.reduce((prev, myitem) => {
          let friendMsg = prev.find((item) => {
            return item.userId == myitem.friendId
          })

          if (friendMsg) {
            friendMsg.myMsgs = myitem.myMsgs
          } else {
            prev.push({
              userId: myitem.friendId,
              myMsgs: myitem.myMsgs
            })
          }

          return prev
        }, this.friendAllMsgs)
      },

      // Msg页面展示所需数据
      getMsgList() {
        let arr = []
        let content = ''
        let time = ''
        let name = ''
        let imgUrl = ''
        let tip = 0

        this.msgsArr.forEach(item => {
          if (item.friendMsgs && item.myMsgs) {
            let which = item.friendMsgs[item.friendMsgs.length - 1].time > item.myMsgs[item.myMsgs.length - 1].time
            if (which) {
              content = item.friendMsgs[item.friendMsgs.length - 1].content
              time = item.friendMsgs[item.friendMsgs.length - 1].time
            } else {
              content = item.myMsgs[item.myMsgs.length - 1].content
              time = item.myMsgs[item.myMsgs.length - 1].time
            }
          } else if (item.friendMsgs) {
            content = item.friendMsgs[item.friendMsgs.length - 1].content
            time = item.friendMsgs[item.friendMsgs.length - 1].time
          } else {
            content = item.myMsgs[item.myMsgs.length - 1].content
            time = item.myMsgs[item.myMsgs.length - 1].time
          }

          let info = this.$store.state.Friend.friends.find((ele) => {
            return item.userId == ele._id
          })
          if (info) {
            name = info.name
            imgUrl = info.imgUrl
          } else {
            name = ''
            imgUrl = ''
          }

          tip = 0
          if (item.friendMsgs) {
            item.friendMsgs.forEach((ele) => {
              if (ele.state == 1) {
                tip++
              }
            })
          }

          arr.push({
            name,
            imgUrl,
            time,
            content,
            tip,
            friendId: item.userId
          })
        })
        this.msgList = arr
      },

      // 挂载前获取数据
      async getData() {
        await this.$store.dispatch('Chat/reqAllMsgs')
        if (this.$store.state.Friend.friends.length == 0) {
          await this.$store.dispatch('Friend/reqFriends')
        }
        this.getMsgsArr()
        this.getMsgList()
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
        friendAllMsgs: state => state.Chat.friendAllMsgs,
        myAllMsgs: state => state.Chat.myAllMsgs
      }),
      dialogProp() {
        return {
          msgsArr: this.msgsArr,
          msgList: this.msgList
        }
      }
    },
    mounted() {
      this.$bus.$emit('activeTabBar')
      this.getData()
      this.$bus.$on('hideMsg',this.hideMsg)
      this.$bus.$on('showMsg',this.showMsg)

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