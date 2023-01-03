<template>
  <div id="app">
    <router-view />
    <TabBar />
  </div>
</template>

<script>
import TabBar from './components/TabBar'

export default {
  name: 'App',
  components:{TabBar}
}
</script>

<style lang="less">
*{
    padding: 0;
    margin: 0;

    // 禁止长按选择
    -webkit-touch-callout: none;
    /*系统默认菜单被禁用*/
    -webkit-user-select: none;
    /*webkit浏览器*/
    -khtml-user-select: none;
    /*早期浏览器*/
    -moz-user-select: none;
    /*火狐*/
    -ms-user-select: none;
    /*IE10*/
    user-select: none;
  }
  // 恢复输入框
  input {
    -webkit-user-select: auto;
    /*webkit浏览器*/
  }
  textarea {
    -webkit-user-select: auto;
    /*webkit浏览器*/
  }
  #app {
    width: 100%;
  }
</style>
