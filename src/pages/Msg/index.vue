<template>
  <div class="msg">
    <div class="msg-main" :class="{ hide }">
      <TopBar />
      <ul class="msg-ul">
        <li class="msg-item" v-for="item in msgList" :key="item.friendId" @click="intoDialog(item.friendId)">
          <div class="msg-item-tip" v-show="item.unReadNum > 0">{{ item.unReadNum }}</div>
          <img :src="item.imgUrl">
          <div class="msg-item-main">
            <div class="msg-item-title">
              <span>{{ item.name }}</span>
              <span>{{ formatDateTime(item.lastTime) }}</span>
            </div>
            <div class="msg-item-content">
              {{ item.lastMsg }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="dialog" :class="{ 'dialogShow': hide }">
      <Dialog :msgList="msgList" :friendId="friendId"></Dialog>
    </div>
  </div>
</template>

<script>
import TopBar from '../../components/TopBar'
import Dialog from './Dialog'
export default {
    name: 'Msg',
    components:{TopBar, Dialog},
    data() {
      return {
        hide: false,
        msgList: [],
        friendId: ''
      }
    },
    methods:{
      intoDialog(friendId){
        this.friendId = friendId

        this.$bus.$emit('hideTabBar')
        this.toggleMsg()

        this.$nextTick(() => {
          this.$bus.$emit('moveToBottom')
        })

        this.$API.readFriendMsgs({userId: this.$store.state.User.userInfo._id, friendId})
      },

      // 切换显示隐藏对话窗
      toggleMsg() {
        this.hide = !this.hide
      },

      // 获取数据
      async getMsgData() {
        await this.$store.dispatch('Chat/reqAllMsgs')
        if (this.$store.state.Friend.friends.length == 0) {
          await this.$store.dispatch('Friend/reqFriends')
        }

        let allMsgs = []
        this.deepCopy(allMsgs, this.$store.state.Chat.allMsgs)

        // 排序某个好友的记录，并添加最后发送的消息和时间方便展示
        allMsgs.forEach(item => {
          item.allMsgs.sort((a, b) => a.time > b.time ? 1 : -1)
          item.lastMsg = item.allMsgs[item.allMsgs.length - 1].content
          item.lastTime = item.allMsgs[item.allMsgs.length-1].time
        })
        // 排序全部好友的列表
        allMsgs.sort((a, b) => a.lastTime > b.lastTime ? 1 : -1)

        this.msgList = allMsgs
      },

      // 深拷贝
      deepCopy(newObj, oldObj) {
        for (let key in oldObj) {
          let item = oldObj[key];
          if (item instanceof Array) {
            newObj[key] = [];
            this.deepCopy(newObj[key], item);
          } else if (item instanceof Object) {
            newObj[key] = {};
            this.deepCopy(newObj[key], item);
          } else {
            newObj[key] = item;
          }
        }
      },

      // 格式化时间
      formatDateTime(date) {
        if (date == "" || !date) {
          return ""
        }
        let newDate = new Date(date)
        let y = newDate.getFullYear()
        let m = newDate.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        let d = newDate.getDate()
        d = d < 10 ? ('0' + d) : d
        let h = newDate.getHours()
        h = h < 10 ? ('0' + h) : h
        let minute = newDate.getMinutes()
        minute = minute < 10 ? ('0' + minute) : minute
        // let second = newDate.getSeconds()
        // second = second < 10 ? ('0' + second) : second

        let nowDate = new Date()
        if (nowDate.getFullYear - y > 0) {
          return `${y}-${m}-${d} ${h}:${minute}`
        } else if (nowDate.getDate() - d > 0) {
          return `${m}-${d} ${h}:${minute}`
        } else {
          return `${h}:${minute}`
        }
      }

    },
    mounted() {
      this.$bus.$emit('activeTabBar')

      this.$bus.$on('toggleMsg',this.toggleMsg)

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
      transition: all .3s;
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
            height: 20px;
            line-height: 20px;
            padding: 0 5px;
            border-radius: 10px;
            color: #fff;
            background: #FA5252;
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