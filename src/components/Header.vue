<template>
  <div>
    <header :style="{'box-shadow': shadow ? '0 0 8px 2px rgba(0,0,0,.05)' : '', 'position': shadow ? 'fixed' : '', 'background': shadow ? '#fff' : ''}">
      <img src="../assets/img/logo.png" alt="">
      <h1 v-if="$store.state.name" @click="show = true" class="ellipsis">{{$store.state.name}}<i class="fa fa-angle-down"></i></h1>
    </header>
    <div v-if="shadow" style="height: 50px;"></div>
    <van-actionSheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      @select="select"
    />
  </div>
</template>

<script>
  export default {
    name: "Header",
    props: {
      shadow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        show: false,
        actions: [
          {
            name: '切换账号'
          },
          {
            name: '退出登录',
            className: 'logout'
          }
        ]
      }
    },
    methods: {
      select(item, index) {
        this.show = false
        if (index == 0) {
          this.$router.push('login')
        } else if (index == 1) {
          this.$post('logout').then(res => {
            if (res.code == 0) {
              this.$toast({
                type: 'success',
                message: res.message,
                duration: 1500,
                onClose: () => {
                  this.$store.commit('saveName', '')
                  window.location.reload()
                }
              })
            } else if (res.code == 200) {
              this.$toast({
                type: 'fail',
                message: res.message,
                duration: 1500
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  header{padding: 9px 10px;overflow: hidden;top: 0;left: 0;width: 100%;z-index: 9;
    img{height: 32px;float: left;}
    h1{float: right;line-height: 32px;max-width: 30%;
      i{margin-left: 5px;}
    }
  }
  .logout{border-top: 1px solid #F7F8FA;color: #f44;}
</style>