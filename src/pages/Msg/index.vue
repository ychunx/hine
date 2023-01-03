<template>
  <div class="msg">
    <TopBar />
    <ul class="msg-ul">
      <li class="msg-item" @click="intoDialog">
        <div class="msg-item-tip">3</div>
        <img src="../../assets/images/1.jpg">
        <div class="msg-item-main">
          <div class="msg-item-title">
            <span>{{$store.state.User.userInfo.name}}</span>
            <span>PM 12:00</span>
          </div>
          <div class="msg-item-content">
            你好啊，{{$store.state.User.userInfo.name}}
          </div>
        </div>
      </li>
      <li class="msg-item" @click="intoDialog">
        <div class="msg-item-tip">3</div>
        <img src="../../assets/images/1.jpg">
        <div class="msg-item-main">
          <div class="msg-item-title">
            <span>{{$store.state.User.userInfo.name}}</span>
            <span>PM 12:00</span>
          </div>
          <div class="msg-item-content">
            你好啊，{{$store.state.User.userInfo.name}}
          </div>
        </div>
      </li>
      <li class="msg-item" @click="intoDialog">
        <div class="msg-item-tip">3</div>
        <img src="../../assets/images/1.jpg">
        <div class="msg-item-main">
          <div class="msg-item-title">
            <span>{{$store.state.User.userInfo.name}}</span>
            <span>PM 12:00</span>
          </div>
          <div class="msg-item-content">
            你好啊，{{$store.state.User.userInfo.name}}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import TopBar from '../../components/TopBar'

export default {
    name: 'Msg',
    components:{TopBar},
    methods:{
      intoDialog(e){
        this.$router.push('/dialog')
      }
    }
}
</script>

<style lang="less" scoped>
.msg{
  background: #F9F9F9;
  .msg-ul{
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
          .msg-item-title{
            width: 100%;
            height: 25px;
            box-sizing: border-box;
            span:nth-child(1){
              font-size: 18px;
              font-weight: bold;
            }
            span:nth-child(2){
              float: right;
              color: #999;
              font-size: 12px;
            }
          }
          .msg-item-content{
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
</style>