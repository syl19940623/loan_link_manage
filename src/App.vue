<template>
  <div id="app">
    <transition name="van-fade" mode="out-in">
      <keep-alive include="home">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
  @import "assets/css/base.css";
  @import "assets/css/font-awesome.min.css";
  .applyBtn{padding: 30px;display: flex;justify-content: space-between;
    .van-button--large{height: 45px !important;}
    .van-button--normal{width: 45%;}
  }
</style>
