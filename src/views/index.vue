<template>
  <div id="container">
    <div class="top">
      <img src="../assets/img/topBg.jpg" alt="">
      <div class="topText">
        <Header :shadow="false"></Header>
<!--        <div class="topTextCol">-->
<!--          <div class="num">-->
<!--            <h1><span>{{statistic.quantity}}</span>户</h1>-->
<!--            <h2>累计发放户数</h2>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="topTextCol">-->
<!--          <div class="money">-->
<!--            <h1><span>{{statistic.amount}}</span>万</h1>-->
<!--            <h2>累计发放金额</h2>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="topTextCol">-->
<!--          <div class="time">-->
<!--            <h1><span>{{statistic.avgday}}</span>天</h1>-->
<!--            <h2>放贷审批时长</h2>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
    <div class="notice" v-if="noticeList.length > 0">
      <div class="icon">
        <img src="../assets/img/notice.png" alt="">
      </div>
      <div class="content">
        <van-swipe :autoplay="5000" :show-indicators="false" :height="30" :duration="300" vertical>
          <van-swipe-item v-for="item in noticeList" :key="item.id" class="ellipsis" @click="$router.push('noticeDetail?id=' + item.id)">{{item.title}}</van-swipe-item>
        </van-swipe>
      </div>
      <van-icon name="arrow" style="line-height: 30px;" @click="$router.push('noticeList')"/>
    </div>
    <div class="productList">
      <h1 class="title">产品列表</h1>
      <div class="product">
        <div class="productItem" v-for="(item, index) in productList" :key="item.id">
          <div class="icon">
            <img :src="require('../assets/img/productList/' + (index + 1) + '.png')" alt="">
          </div>
          <h1 class="name">{{item.name}}</h1>
          <router-link tag="span" :to="'prod?prodId=' + item.attribute" class="go">
            去办理 <van-icon name="arrow" style="line-height: 30px;"/>
          </router-link>
        </div>
      </div>
    </div>
    <QrCode :show="showQrCode"></QrCode>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import QrCode from "@/components/QrCode";

  export default {
    name: "index",
    components: {
      Header,
      QrCode
    },
    data() {
      return {
        statistic: {},
        noticeList: [],
        productList: [],
        showQrCode: false
      };
    },
    methods: {
      loadBasicInfo() {
        this.$post('getOverview').then(res => {
          if (res.code == 0) {
            const data = res.data.rows[0]
            this.$store.commit('saveName', data.name)
            this.statistic = {
              amount: data.amount,
              quantity: data.quantity,
              avgday: data.avgday
            }
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      loadNotice() {
        this.$post('getNoticeList').then(res => {
          if (res.code == 0) {
            this.noticeList = res.data.rows
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      loadProduct() {
        this.$post('getProductDict').then(res => {
          if (res.code == 0) {
            this.productList = res.data.rows
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      judgeFocusThePublic() {
        this.$post('isFollowMP').then(res => {
          if (res.code == 0) {
            if (res.data.subscribe == 0) {
              this.showQrCode = true
            } else {
              this.showQrCode = false
            }
          }
        })
      }
    },
    mounted() {
      this.judgeFocusThePublic()
      this.loadBasicInfo()
      this.loadNotice()
      this.loadProduct()
    },
    activated() {
      this.judgeFocusThePublic()
      this.loadBasicInfo()
    }
  }
</script>

<style lang="less" scoped>
  #container{
    .top{background: #3F88FB;padding-top: 30px;position: relative;
      img{width: 100%;display: block;}
      .topText{position: absolute;top: 0;left: 0;width: 100%;height: 100%;color: #fff;
        .topTextCol{width: calc(100% / 3);float: left;position: relative;height: calc(100% - 50px);
          .num,.money,.time{position: absolute;width: 100%;
            h1{text-align: center;font-size: 12px;
              span{font-size: 28px;}
            }
            h2{font-size: 12px;text-align: center;}
          }
          .num{left: 12%;bottom: 32%;}
          .money{left: 21%;bottom: 50%;}
          .time{left: 4%;bottom: 21%;}
        }
      }
    }
    .notice{height: 50px;background: #fff;display: flex;padding: 10px 15px;
      .icon{width: 30px;height: 30px;
        img{width: 100%;display: block;}
      }
      .content{flex: 1;overflow: hidden;padding: 0 10px;
        .van-swipe-item{height: 30px !important;overflow: hidden;line-height: 30px;}
      }
    }
    .productList{padding: 15px;
      .title{font-size: 15px;font-weight: bold;margin-bottom: 15px;}
      .productItem{padding: 10px;box-shadow: 0 0 8px 2px rgba(0,0,0,.05);display: flex;margin-bottom: 10px;
        .icon{width: 30px;height: 30px;
          img{width: 100%;height: 100%;display: block;}
        }
        .name{flex: 1;line-height: 30px;padding-left: 10px;}
        .go{width: 80px;text-align: right;
          i{font-size: 12px;}
        }
      }
    }
  }
</style>