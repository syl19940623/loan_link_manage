<template>
  <div class="container">
    <van-nav-bar
      title="公告详情"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="$router.go(-1)"
    />
    <div style="height: 46px;"></div>
    <div class="main">
      <div class="title">{{noticeDetail.title}}</div>
      <div class="subtitle">
        <div class="time"><i class="fa fa-clock-o fa-fw"></i>{{noticeDetail.sendtime}}</div>
      </div>
      <div class="content" v-html="noticeDetail.content"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "noticeDetail",
    data() {
      return {
        noticeDetail: {}
      }
    },
    mounted() {
      this.$post('getNotice', {
        id: this.$route.query.id * 1
      }).then(res => {
        if (res.code == 0) {
          this.noticeDetail = res.data.rows[0]
          const reg = new RegExp('\r\n', 'g')
          this.noticeDetail.content = this.noticeDetail.content.replaceAll(reg, '<br/>')
        } else if (res.code == 200) {
          this.$notify(res.message)
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .container{background: #fff;
    .title{font-size: 18px;font-weight: bold;padding: 30px 30px 15px;text-align: center;}
    .subtitle{display: flex;font-size: 12px;color: #999;justify-content: center;
      div{line-height: 16px;padding: 0 10px;}
    }
    .content{padding: 15px;line-height: 24px;
      p{text-indent: 28px;margin-bottom: 10px;}
    }
  }
</style>