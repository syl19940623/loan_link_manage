<template>
  <div id="container">
    <div class="main">
      <component :is="active == 0 ? 'Index' : 'Prog'" :key="active"></component>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="tosend">进度</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  import Index from './index';
  import Prog from './prog';

  export default {
    name: "home",
    components: {
      Index,
      Prog
    },
    data() {
      return {
        active: 0
      }
    },
    mounted() {
      if (this.$route.query.to === 'prog') {
        this.active = 1
      }
    }
  }
</script>

<style lang="less" scoped>
  .main{height: calc(100vh - 50px);overflow-x: hidden;overflow-y: auto;}
  .van-hairline--top-bottom{box-shadow: 0 0 8px 2px rgba(0,0,0,.05);}
</style>