<template>
  <div id="container">
    <van-nav-bar
      :title="'办理' + loanName"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="$router.push('home')"
    />
    <div style="height: 46px;"></div>
    <van-steps
      :active="step"
      active-icon="edit">
      <van-step>第一步</van-step>
      <van-step>第二步</van-step>
      <van-step>第三步</van-step>
    </van-steps>
    <div v-if="step == 0">
      <van-cell-group>
        <van-field
          v-model="formData.mobile"
          label="手机号码"
          label-width="72px"
          placeholder="请输入手机号码"
        />
        <van-field
          v-model="formData.name"
          label="联系人姓名"
          label-width="72px"
          placeholder="请输入联系人姓名"
        />
        <van-field
          v-model="formData.productName"
          readonly
          :is-link="true"
          label="贷款产品"
          label-width="72px"
          placeholder="请选择贷款产品"
          @click="productShow = true"
        />
        <van-popup v-model="productShow" position="bottom">
          <van-picker show-toolbar :columns="productList" value-key="name" @cancel="productShow = false" @confirm="productConfirm"/>
        </van-popup>
        <van-field
          v-model="formData.areaName"
          readonly
          :is-link="true"
          label="所属片区"
          label-width="72px"
          placeholder="请选择所属片区"
          @click="areaShow = true"
        />
        <van-popup v-model="areaShow" position="bottom">
          <van-picker show-toolbar :columns="areaList" value-key="name" @cancel="areaShow = false" @change="areaChange" @confirm="areaConfirm"/>
        </van-popup>
        <van-field
          v-model.number="formData.amount"
          type="number"
          label="申请额度"
          label-width="72px"
          placeholder="请输入申请额度"
          @input="amountInput">
          <span slot="right-icon">万元</span>
        </van-field>
        <van-field
          v-model="formData.purpose"
          label="贷款用途"
          type="textarea"
          label-width="72px"
          placeholder="请输入贷款用途"
          rows="1"
          autosize
          @input="purposeInput"
        />
        <van-field
          v-model="formData.smscode"
          center
          label="短信验证码"
          label-width="72px"
          placeholder="请输入短信验证码">
          <van-button slot="button" size="small" type="warning" :disabled="disabled" @click="sendSms">{{btnText}}</van-button>
        </van-field>
      </van-cell-group>
      <van-cell-group style="margin-top: 10px;">
        <van-field
          v-model="referrer"
          label="营销人工号"
          label-width="72px"
          placeholder="请输入营销人工号"
        />
      </van-cell-group>
      <div class="applyBtn">
        <van-button type="info" size="large" @click="jumpToNext(1)">下一步</van-button>
      </div>
    </div>
    <div v-if="step == 1">
      <van-cell-group>
        <template v-if="formData.productAttr == '0101'">
          <van-field
            v-model="formData.idnumber"
            label="身份证号"
            label-width="58px"
            placeholder="请输入身份证号"
          />
          <van-field
            v-model="formData.address"
            label="家庭住址"
            type="textarea"
            label-width="58px"
            placeholder="请输入家庭住址"
            rows="1"
            autosize
          />
        </template>
        <template v-if="formData.productAttr == '0102'">
          <van-field
            v-model="formData.idnumber"
            label="身份证号"
            label-width="58px"
            placeholder="请输入身份证号"
          />
          <van-field
            v-model="formData.business"
            label="主营业务"
            type="textarea"
            label-width="58px"
            placeholder="请输入主营业务"
            rows="1"
            autosize
          />
          <van-field
            v-model="formData.address"
            label="经营地址"
            type="textarea"
            label-width="58px"
            placeholder="请输入经营地址"
            rows="1"
            autosize
          />
        </template>
        <template v-if="formData.productAttr == '02'">
          <van-field
            v-model="formData.orgname"
            label="企业名称"
            label-width="116px"
            placeholder="请输入企业名称"
          />
          <van-field
            v-model="formData.orglp"
            label="法人姓名"
            label-width="116px"
            placeholder="请输入法人姓名"
          />
          <van-field
            v-model="formData.orglptel"
            label="法人电话号码"
            label-width="116px"
            placeholder="请输入法人电话号码"
          />
          <van-field
            v-model="formData.business"
            label="主营业务"
            type="textarea"
            label-width="116px"
            placeholder="请输入主营业务"
            rows="1"
            autosize
          />
          <van-field
            v-model="formData.address"
            label="经营地址"
            type="textarea"
            label-width="116px"
            placeholder="请输入经营地址"
            rows="1"
            autosize
          />
        </template>
      </van-cell-group>
      <div class="applyBtn">
        <van-button plain type="info" @click="jumpToPrev(0)">上一步</van-button>
        <van-button type="info" @click="jumpToNext(2)">下一步</van-button>
      </div>
    </div>
    <div v-if="step == 2" class="extendQuestion">
      <template v-for="(item, index) in questionList">
        <template v-if="item.remarks.split(':')[0] === '单选框'">
          <van-cell-group :key="index" :title="(index + 1) + '、' + item.question" v-if="index == 0 || answer['101'] == '是'">
            <van-radio-group v-model="answer[item.id]">
              <template v-for="(childItem, childIndex) in questionConvert(item.remarks)">
                <van-radio :key="childIndex" :name="childItem">{{childItem}}</van-radio>
              </template>
            </van-radio-group>
          </van-cell-group>
        </template>
      </template>
      <div class="applyBtn">
        <van-button plain type="info" @click="jumpToPrev(1)">上一步</van-button>
        <van-button type="info" @click="jumpToNext(3)">提交申请</van-button>
      </div>
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
    name: "prod",
    data() {
      return {
        step: 0,
        productShow: false,
        productList: [],
        areaShow: false,
        areaList: [
          {
            values: []
          },
          {
            values: []
          }
        ],
        formData: {},
        answer: {
          '101': ''
        },
        requiredField: {
          one: [
            {
              key: 'mobile',
              name: '手机号码'
            },
            {
              key: 'name',
              name: '联系人姓名'
            },
            {
              key: 'product',
              name: '贷款产品'
            },
            {
              key: 'area',
              name: '所属片区'
            },
            {
              key: 'amount',
              name: '申请额度'
            },
            {
              key: 'purpose',
              name: '贷款用途'
            },
            {
              key: 'smscode',
              name: '短信验证码'
            }
          ],
          two: [
            [
              {
                key: 'idnumber',
                name: '身份证号'
              },
              {
                key: 'address',
                name: '家庭住址'
              }
            ],
            [
              {
                key: 'idnumber',
                name: '身份证号'
              },
              {
                key: 'business',
                name: '主营业务'
              },
              {
                key: 'address',
                name: '经营住址'
              }
            ],
            [
              {
                key: 'orgname',
                name: '企业名称'
              },
              {
                key: 'orglp',
                name: '法人姓名'
              },
              {
                key: 'orglptel',
                name: '法人电话号码'
              },
              {
                key: 'business',
                name: '主营业务'
              },
              {
                key: 'address',
                name: '经营住址'
              }
            ]
          ]
        },
        disabled: false,
        btnText: '获取验证码',
        imgCode: '',
        referrer: '',
        loanName: '',
        img: '',
        imgCodeShow: false,
        questionList: [],
        quota: 0
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.loadProduct(() => {
          for (let v of vm.productList) {
            if ((vm.$route.query.prodId && v.id == vm.$route.query.prodId) || (vm.$route.query.productId && v.qyyxid && v.qyyxid.split(',').includes(vm.$route.query.productId))) {
              vm.loanName = v.name
              vm.formData.product = v.id
              vm.formData.productName = v.name
              vm.formData.productAttr = v.attribute
              vm.quota = v.quota
            }
          }
        })
      })
    },
    methods: {
      vanInput() {
        this.imgCode = this.imgCode.toUpperCase()
      },
      amountInput() {
        if (this.formData.amount > this.quota) {
          this.formData.amount = this.quota
          this.$notify(this.formData.productName + '申请额度不能超过' + this.quota + '万元')
        } else if (this.formData.amount < 1) {
          this.formData.amount = ''
          this.$notify(this.formData.productName + '申请额度最低为1万元')
        }
      },
      purposeInput() {
        if (this.formData.purpose.length > 200) {
          this.$notify('贷款用途不能超过200字')
          this.formData.purpose = this.formData.purpose.slice(0, 200)
        }
      },
      judgeRequiredField(arr) {
        let bool = true;
        for (let v of arr) {
          if (!this.formData[v.key] || this.formData[v.key] == '') {
            this.$notify(v.name + '不能为空');
            bool = false;
            break;
          }
        }
        return bool;
      },
      loadProduct(callback) {
        this.$post('getProductDict').then(res => {
          if (res.code == 0) {
            this.productList = res.data.rows
            callback && callback()
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      productConfirm(value, index) {
        this.formData.product = value.id
        this.formData.productName = value.name
        this.formData.productAttr = value.attribute
        this.quota = value.quota
        this.productShow = false
      },
      loadArea() {
        this.$post('getAreaDict').then(res => {
          if (res.code == 0) {
            const oneArr = [], twoArr = []
            for (let v of res.data.rows) {
              if (v.id.length == 6) {
                oneArr.push(v)
              } else {
                twoArr.push(v)
              }
            }
            oneArr.push({id: '000000', name: '其它'})
            this.areaList[0].values = oneArr
            this.areaList[1].values = twoArr
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      areaChange(picker, values) {
        this.$post('getAreaDict').then(res => {
          if (res.code == 0) {
            const twoArr = []
            if (values[0].id == '000000') {
              twoArr.push({id: '000000', name: '其它'})
            } else {
              for (let v of res.data.rows) {
                if (v.id.length == 9) {
                  twoArr.push(v)
                }
              }
            }
            picker.setColumnValues(1, twoArr);
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      areaConfirm(value, index) {
        let areaName = ''
        for (let v of value) {
          areaName += v.name + ' / '
        }
        this.formData.area = value[1].id
        this.formData.areaName = areaName.slice(0, -3)
        this.areaShow = false
      },
      refreshImg() {
        this.img = '/api/code.asp?r=' + Math.random()
      },
      sendSms() {
        if (!this.formData.mobile || this.formData.mobile == '') {
          this.$notify('手机号码不能为空');
        } else if (!util.checkPhone(this.formData.mobile)) {
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
              tcPhone: this.formData.mobile,
              tcImgValidCode: this.imgCode.toUpperCase()
            }).then(res => {
              if (res.code == 0) {
                let second = 60
                this.btnText = second + 's后重新获取'
                this.disabled = true
                const timer = setInterval(() => {
                  second--
                  this.btnText = second + 's后重新获取'
                  if (second <= 0) {
                    clearInterval(timer)
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
      loadQuestion() {
        this.$post('getQuestionDict', {
          tcType: '1'
        }).then(res => {
          if (res.code == 0) {
            this.questionList = res.data.rows
          } else if (res.code == 200) {
            this.$notify(res.message)
          }
        })
      },
      questionConvert(data) {
        const question = data.split(':')[1].replace('[', '').replace(']', '')
        return question.split(',');
      },
      jumpToPrev(step) {
        this.step = step
      },
      jumpToNext(step) {
        if (step == 1 && this.judgeRequiredField(this.requiredField.one)) {
          this.step = step
        } else if (step == 2) {
          const attr = this.formData.productAttr
          const index = attr == '0101' ? 0 : (attr == '0102' ? 1 : 2)
          if (this.judgeRequiredField(this.requiredField.two[index])) {
            if (index == 2) {
              if (!util.checkPhone(this.formData.orglptel)) {
                this.$notify('法人电话号码格式有误')
              } else {
                this.step = step
              }
            } else {
              if (!util.checkIdNumber(this.formData.idnumber)) {
                this.$notify('身份证号格式有误')
              } else {
                this.step = step
              }
            }
          }
        } else if (step == 3) {
          if (this.answer['101'] == '') {
            this.$notify('请勾选您是否在银行有贷款')
          } else if (this.answer['101'] == '是' && !this.answer['102']) {
            this.$notify('请勾选您的贷款所属银行')
          } else {
            const sendData = {}
            Object.assign(sendData, this.formData)
            const answerArr = []
            Object.keys(this.answer).forEach(key => {
              const obj = {
                id: key,
                answer: this.answer[key]
              }
              answerArr.push(obj)
            })
            sendData.question = answerArr
            if (this.referrer) {
              sendData.referrer = this.referrer
            }
            sendData.amount = sendData.amount * 10000
            const delKeys = ['areaName', 'productName', 'productAttr']
            for (let v of delKeys) {
              delete sendData[v]
            }
            this.$post('applyLoan', {
              toData: sendData
            }).then(res => {
              if (res.code == 0) {
                this.$router.replace('result?type=success&title=申请成功&describe=去首页看看其它产品吧&redirect=goHome').catch(err => err)
              } else if (res.code == 200) {
                this.$dialog.alert({
                  message: res.message
                });
              }
            })
          }
        }
      }
    },
    mounted() {
      this.loadArea()
      this.loadQuestion()
      if (this.$route.query.referrer) {
        this.referrer = this.$route.query.referrer
      }
    }
  }
</script>

<style lang="less" scoped>
  .extendQuestion{margin-top: -10px;
    .van-cell-group{overflow: hidden;padding: 15px;
      .van-radio{margin-bottom: 15px;}
      .van-radio:last-child{margin-bottom: 0;}
    }
  }
  :deep(.van-field__right-icon){color: #f44;
    img{height: 32px;display: block;}
  }
  .van-steps--horizontal{padding: 15px 25px 5px;margin: 10px 0;}
  .imgCodeContainer{padding: 15px;
    img{display: block;margin: 0 auto 15px;}
    .van-cell{border: 1px solid #ebedf0;}
  }
</style>