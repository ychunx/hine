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
  }
  #app {
    width: 100%;
  }
</style>
