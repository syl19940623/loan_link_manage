<template>
  <div>
    <Header></Header>
    <div class="result">
      <div v-if="type == 'success'" class="success">
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon-success"><path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M34.5548098,16.4485711 C33.9612228,15.8504763 32.9988282,15.8504763 32.4052412,16.4485711 L32.4052412,16.4485711 L21.413757,27.5805811 L21.413757,27.5805811 L21.4034642,27.590855 C21.0097542,27.9781674 20.3766105,27.9729811 19.9892981,27.5792711 L19.9892981,27.5792711 L15.5947588,23.1121428 C15.0011718,22.514048 14.0387772,22.514048 13.4451902,23.1121428 C12.8516033,23.7102376 12.8516033,24.6799409 13.4451902,25.2780357 L13.4451902,25.2780357 L19.6260786,31.5514289 C20.2196656,32.1495237 21.1820602,32.1495237 21.7756472,31.5514289 L21.7756472,31.5514289 L34.5548098,18.614464 C35.1483967,18.0163692 35.1483967,17.0466659 34.5548098,16.4485711 Z"></path></svg>
      </div>
      <div v-if="type == 'warning'" class="warning">
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon-warning"><path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M24,31 C22.8954305,31 22,31.8954305 22,33 C22,34.1045695 22.8954305,35 24,35 C25.1045695,35 26,34.1045695 26,33 C26,31.8954305 25.1045695,31 24,31 Z M24,14 C23.1715729,14 22.5,14.6715729 22.5,15.5 L22.5,15.5 L22.5,27.5 C22.5,28.3284271 23.1715729,29 24,29 C24.8284271,29 25.5,28.3284271 25.5,27.5 L25.5,27.5 L25.5,15.5 C25.5,14.6715729 24.8284271,14 24,14 Z"></path></svg>
      </div>
      <div v-if="type == 'error'" class="error">
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon-error"><path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M32.57818,15.42182 C32.0157534,14.8593933 31.1038797,14.8593933 30.541453,15.42182 L30.541453,15.42182 L24.0006789,21.9625941 L17.458547,15.42182 C16.8961203,14.8593933 15.9842466,14.8593933 15.42182,15.42182 C14.8593933,15.9842466 14.8593933,16.8961203 15.42182,17.458547 L15.42182,17.458547 L21.9639519,23.9993211 L15.42182,30.541453 C14.8593933,31.1038797 14.8593933,32.0157534 15.42182,32.57818 C15.9842466,33.1406067 16.8961203,33.1406067 17.458547,32.57818 L17.458547,32.57818 L24.0006789,26.0360481 L30.541453,32.57818 C31.1038797,33.1406067 32.0157534,33.1406067 32.57818,32.57818 C33.1406067,32.0157534 33.1406067,31.1038797 32.57818,30.541453 L32.57818,30.541453 L26.0374059,23.9993211 L32.57818,17.458547 C33.1406067,16.8961203 33.1406067,15.9842466 32.57818,15.42182 Z"></path></svg>
      </div>
      <div class="title">{{title}}</div>
      <div class="describe">{{describe}}</div>
      <template v-if="redirect">
        <div class="vanBtnBox">
          <van-button v-if="redirect == 'goBack'" type="warning" size="small" @click="$router.go(-1)">返回上一页</van-button>
          <van-button type="info" size="small" @click="$router.replace('home')">去首页</van-button>
        </div>
      </template>
      <QrCode :show="showQrCode" style="margin-top: 25px;"></QrCode>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import QrCode from "@/components/QrCode";

  export default {
    name: "result",
    components: {
      Header,
      QrCode
    },
    data() {
      return {
        type: '',
        title: '',
        describe: '',
        redirect: '',
        showQrCode: false
      }
    },
    mounted() {
      this.type = this.$route.query.type
      this.title = this.$route.query.title
      this.describe = this.$route.query.describe
      this.redirect = this.$route.query.redirect

      this.$post('isFollowMP').then(res => {
        if (res.code == 0) {
          if (res.data.subscribe == 0 && this.type == 'success') {
            this.showQrCode = true
          } else {
            this.showQrCode = false
          }
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .result{position: fixed;top: 50%;left: 0;transform: translateY(-50%);width: 100%;padding: 0 30px;
    svg{width: 64px;display: block;margin: 0 auto;}
    .success{
      svg{fill: #67c23a;}
    }
    .warning{
      svg{fill: #e6a23c;}
    }
    .error{
      svg{fill: #f56c6c;}
    }
    .title{text-align: center;padding: 15px 0;color: #5e6d82;font-size: 15px;font-weight: bold;}
    .describe{color: #5e6d82;text-align: center;}
    .vanBtnBox{display: flex;justify-content: center;
      .van-button{margin: 30px 15px 0;}
    }
  }
</style>