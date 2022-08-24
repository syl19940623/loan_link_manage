<template>
  <div id="container">
    <van-nav-bar
      title="登录"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-cell-group>
      <van-field
        v-model="mobile"
        label="手机号码"
        label-width="72px"
        placeholder="请输入手机号码"
      />
      <van-field
        v-model="smsCode"
        center
        label="短信验证码"
        label-width="72px"
        placeholder="请输入短信验证码">
        <van-button slot="button" size="small" type="warning" :disabled="disabled" @click="sendSms">{{btnText}}</van-button>
      </van-field>
    </van-cell-group>
    <div class="applyBtn">
      <van-button type="info" size="large" @click="login">登录</van-button>
    </div>

    <!-- 图形验证码 -->
    <van-dialog
      v-model="imgCodeShow"
      title="图形验证"
      confirm-button-text="验证"
      confirm-button-color="#1989FA"
      show-cancel-button
      :before-close="imgCodeDialogClose">
      <div class="imgCodeContainer">
        <img :src="img" @click="refreshImg">
        <van-field
          v-model="imgCode"
          placeholder="请输入图形验证码"
          @input="vanInput"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import { util } from "@/utils/util";

  export default {
    name: "login",
    data() {
      return {
        img: '',
        mobile: '',
        idnumber: '',
        imgCode: '',
        smsCode: '',
        disabled: false,
        btnText: '获取验证码',
        imgCodeShow: false,
        timer: null
      }
    },
    methods: {
      vanInput() {
        this.imgCode = this.imgCode.toUpperCase()
      },
      refreshImg() {
        this.img = '/api/code.asp?r=' + Math.random()
      },
      sendSms() {
        if (this.mobile == '') {
          this.$notify('手机号码不能为空');
        } else if (!util.checkPhone(this.mobile)) {
          this.$notify('手机号码格式不正确');
        } else {
          this.refreshImg()
          this.imgCodeShow = true
        }
      },
      imgCodeDialogClose(action, done) {
        if (action === 'cancel') {
          done()
        } else if (action === 'confirm') {
          if (this.imgCode == '') {
            this.$notify('图形验证码不能为空')
            done(false)
          } else {
            this.$post('sendSMSCode', {
              tcPhone: this.mobile,
              tcImgValidCode: this.imgCode
            }).then(res => {
              if (res.code == 0) {
                let second = 60
                this.btnText = second + 's后重新获取'
                this.disabled = true
                this.timer = setInterval(() => {
                  second--
                  this.btnText = second + 's后重新获取'
                  if (second <= 0) {
                    clearInterval(this.timer)
                    this.btnText = '重新获取验证码'
                    this.disabled = false
                  }
                }, 1000)
                done()
              } else if (res.code == 200) {
                this.$notify(res.message);
                done(false)
                this.refreshImg()
              }
            })
          }
        }
      },
      login() {
        if (this.mobile == '') {
          this.$notify('手机号码不能为空');
        } else if (!util.checkPhone(this.mobile)) {
          this.$notify('手机号码格式有误');
        } else if (this.smsCode == '') {
          this.$notify('短信验证码不能为空');
        } else {
          this.$post('login', {
            tcMobile: this.mobile,
            tcSMSCode: this.smsCode
          }).then(res => {
            if (res.code == 0) {
              this.$store.commit('saveName', res.data.name)
              this.$toast({
                type: 'success',
                message: res.message,
                duration: 1500,
                onClose: () => {
                  this.$router.go(-1)
                  clearInterval(this.timer)
                  this.timer = null
                  Object.assign(this.$data, this.$options.data())
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
  :deep(.van-field__right-icon){
    img{height: 24px;display: block;}
  }
  .imgCodeContainer{padding: 15px;
    img{display: block;margin: 0 auto 15px;}
    .van-cell{border: 1px solid #ebedf0;}
  }
</style>