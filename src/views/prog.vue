<template>
  <div id="container">
    <Header></Header>
    <template v-if="loanList.length > 0">
      <van-cell-group>
        <van-field
          v-model="loanInfo.productname"
          readonly
          :is-link="true"
          label="贷款记录"
          label-width="auto"
          @click="loanShow = true"
        />
        <van-popup v-model="loanShow" position="bottom">
          <van-picker show-toolbar :columns="loanList" value-key="productname" @cancel="loanShow = false" @confirm="loanConfirm"/>
        </van-popup>
      </van-cell-group>
      <div class="loanInfo">
        <div class="name">办理人：{{loanInfo.name}}</div>
        <div class="date">办理时间：{{loanInfo.createdate}}</div>
        <div class="money">￥<span>{{loanInfo.amount / 10000}}万元</span></div>
      </div>
      <div class="loanStep">
        <van-steps direction="vertical" :active="activeStep" active-icon="replay" active-color="#1989FA">
          <van-step v-for="(item, index) in progressList" :key="index" v-show="item.notshow == 0">
            <h3>[{{item.name}}]<span class="fr">{{item.createdate}}</span></h3>
            <p style="margin-top: 10px;color: #666;">{{item.notes.replace(/{\d}/g, $1 => {return item.extparas.split(',')[$1.slice(1,-1)*1-1]})}}</p>
          </van-step>
        </van-steps>
        <div class="applyBtn" v-if="[0,9].includes(loanInfo.deactivate)">
          <van-button type="danger" size="large" @click="revokeShow = true" v-if="finalFlowId < '0801'">撤销申请</van-button>
          <van-button type="warning" size="large" :to="'evaluate?id=' + loanInfo.id" v-if="finalFlowId == '0801'">去评价</van-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="noData">
        <img src="../assets/img/noData.png" alt="">
        <h1>暂无数据</h1>
      </div>
    </template>
    <van-dialog
      v-model="noLoginShow"
      title="提示"
      message="您尚未登录系统，是否马上去登录?"
      :showConfirmButton="true"
      :showCancelButton="true"
      cancelButtonText="我再想想"
      confirmButtonText="马上登录"
      confirmButtonColor="#1989FA"
      :before-close="noLoginClose">
    </van-dialog>
    <van-dialog
      v-model="revokeShow"
      title="撤销申请"
      show-cancel-button
      :before-close="revokeApply">
      <div class="revokeReason">
        <van-field
          v-model="revokeReason"
          type="textarea"
          placeholder="请输入撤销原因"
          rows="3"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import Header from "@/components/Header";

  export default {
    name: "prog",
    components: {
      Header
    },
    data() {
      return {
        noLoginShow: false,
        loanShow: false,
        loanList: [],
        progressList: [],
        loanInfo: {
          id: '',
          productname: '',
          name: '',
          createdate: '',
          amount: 0,
          deactivate: 0
        },
        activeStep: 0,
        loanState: ['正常', '被拒绝', '已撤销', '已结清'],
        finalFlowId: '',
        revokeShow: false,
        revokeReason: '',
        activeIndex: 0
      }
    },
    methods: {
      loadLoanInfo(data) {
        Object.keys(this.loanInfo).forEach(key => {
          this.loanInfo[key] = data[key]
        })
      },
      loadLoanList() {
        this.$post('getBespeakList').then(res => {
          if (res.code == 0) {
            const newLoanList = res.data.rows
            for (let v of newLoanList) {
              v.productname = v.productname + '(' + this.loanState[v.deactivate] + ')'
            }
            this.loanList = newLoanList
            if (res.data.rows.length > 0) {
              this.$nextTick(() => {
                this.loadProgress(this.activeIndex)
              })
            }
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      loanConfirm(value, index) {
        this.activeIndex = index
        this.loadLoanInfo(value)
        this.loadProgress(index)
        this.loanShow = false
      },
      loadProgress(index) {
        this.loadLoanInfo(this.loanList[index])
        this.$post('getBespeakFlow', {
          bespeakId: this.loanInfo.id
        }).then(res => {
          if (res.code == 0 && res.data.reccount > 0) {
            this.progressList = res.data.rows
            this.activeStep = res.data.rows.length - 1
            this.finalFlowId = this.progressList[this.activeStep].id
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      noLoginClose(action, done) {
        done()
        if (action === 'confirm') {
          this.$router.push('login')
        }
      },
      revokeApply(action, done) {
        if (action === 'confirm') {
          if (trim(this.revokeReason) == '') {
            done(false)
            this.$notify('撤销原因不能为空')
          } else {
            this.$post('revokeLoan', {
              tcBespeakId: this.loanInfo.id,
              tcReason: this.revokeReason
            }).then(res => {
              if (res.code == 0) {
                done()
                this.$toast({
                  type: 'success',
                  message: res.message,
                  duration: 1500,
                  onClose: () => {
                    this.loadLoanList()
                  }
                })
              } else if (res.code == 200) {
                done(false)
                this.$toast({
                  type: 'fail',
                  message: res.message,
                  duration: 1500
                })
              }
            })
          }
        } else {
          done()
        }
      },
      loadBasicInfo() {
        this.$post('getOverview').then(res => {
          if (res.code == 0) {
            const name = res.data.rows[0].name
            if (name) {
              this.$store.commit('saveName', name)
              this.loadLoanList()
            } else {
              this.noLoginShow = true
            }
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      }
    },
    mounted() {
      this.loadBasicInfo()
    },
    activated() {
      this.loadBasicInfo()
    }
  }
</script>

<style lang="less" scoped>
  #container{overflow: hidden;
    .loanInfo{background: #fff;padding: 12px 16px;font-size: 12px;position: relative;
      &::after{content: '';width: 100%;left: -3px;bottom: 0;height: 2px;position: absolute;background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);background-size: 80px;}
      .name{margin-bottom: 5px;}
      .money{position: absolute;top: 10px;right: 16px;color: #e74c3c;
        span{font-size: 20px;}
      }
    }
    :deep(.van-icon-replay){animation: iconRotate 1s infinite linear;background: #fff;}
    @keyframes iconRotate{
      from{transform: rotate(0);}
      to{transform: rotate(360deg);}
    }
    :deep(.van-steps__items){
      display: flex;
      flex-direction: column-reverse;
    }
    :deep(.van-step__line){top: -100px;left: -15.5px;}
    :deep(.van-step__title){height: 100px;}
    .loanStep{height: calc(100vh - 205px);overflow: auto;}
    .revokeReason{padding: 15px;
      .van-cell{border: 1px solid #ebedf0;}
    }
    .noData{width: 240px;position: fixed;top: 45%;left: 50%;transform: translate(-50%, -50%);
      img{display: block;}
      h1{text-align: center;margin-top: 30px;}
    }
  }
</style>