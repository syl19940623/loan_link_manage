<template>
  <div class="container" v-if="show">
    <div class="qrCode">
      <img src="../assets/img/qrCode/1.png" alt="" class="qrCodeBorder topLeft">
      <img src="../assets/img/qrCode/2.png" alt="" class="qrCodeBorder topRight">
      <img src="../assets/img/qrCode/3.png" alt="" class="qrCodeBorder botLeft">
      <img src="../assets/img/qrCode/4.png" alt="" class="qrCodeBorder botRight">
      <img src="../assets/img/qrCode/qrCode.jpg" alt="" class="mainImg">
      <div class="scanLine"></div>
    </div>
    <div class="tips">
      <p>长按识别二维码关注公众号</p>
      <p>可以及时获得贷款办理进度信息</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "QrCode",
    props: {
      show: Boolean
    }
  }
</script>

<style lang="less" scoped>
  .container{
    .tips{font-size: 12px;margin-top: 15px;
      p{text-align: center;margin-bottom: 5px;}
    }
    .qrCode{width: 200px;position: relative;padding: 20px;margin: 0 auto;
      .qrCodeBorder{position: absolute;width: 24px;}
      .topLeft{top: 0;left: 0;}
      .topRight{top: 0;right: 0;}
      .botLeft{bottom: 0;left: 0;}
      .botRight{bottom: 0;right: 0;}
      .mainImg{width: 100%;}
      .scanLine{width: calc(100% - 10px);height: 20px;background: linear-gradient(to bottom, transparent, rgba(255,159,8,.5));position: absolute;left: 5px;animation: scanLineMove 2.5s linear infinite;opacity: 0;}
    }
  }
  @keyframes scanLineMove {
    0%{top: 0;opacity: 1;}
    50%{top: 180px;opacity: 1;}
    100%{top: 180px;opacity: 0;}
  }
</style>