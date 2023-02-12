<template>
  <div class="group-dialog">
    <div class="group-dialog-top">
      <div class="back" @click="back">
        <img src="../../../assets/images/left.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupDialog",
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.group-dialog {
  background: #f0f3f8;
  height: 100vh;
  .group-dialog-top {
    height: 60px;
    display: flex;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #ededed;
    position: relative;
    overflow: hidden;
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