<template>
  <div>
    <van-nav-bar
      title="公告列表"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="$router.go(-1)"
    />
    <div style="height: 46px;"></div>
    <div class="noticeList">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadNotice">
        <van-cell-group>
          <template v-for="item in noticeList">
            <van-cell icon="comment-o" :key="item.id" :title="item.title" is-link :url="'noticeDetail?id=' + item.id" />
          </template>
        </van-cell-group>
      </van-list>
    </div>
  </div>
</template>

<script>
  export default {
    name: "noticeList",
    data() {
      return {
        loading: true,
        finished: false,
        noticeList: []
      }
    },
    methods: {
      loadNotice() {
        this.$post('getNoticeList').then(res => {
          if (res.code == 0) {
            this.loading = false;
            this.noticeList.push(...res.data.rows)
            if (this.noticeList.length >= res.data.reccount) {
              this.finished = true;
            }
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      }
    },
    mounted() {
      this.loadNotice()
    }
  }
</script>

<style lang="less" scoped>

</style>