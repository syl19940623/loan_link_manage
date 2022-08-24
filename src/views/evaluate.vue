<template>
  <div>
    <van-nav-bar
      title="评价"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="$router.go(-1)"
    />
    <div style="height: 46px;"></div>
    <template v-for="(item, index) in questionList">
      <van-cell-group :key="index" :title="(index + 1) + '、' + item.question" v-if="item.remarks.split(':')[0] == '单选框'">
        <van-radio-group v-model="formData[item.id]">
          <template v-for="(childItem, childIndex) in questionConvert(item.remarks)">
            <van-radio :key="childIndex" :name="childItem">{{childItem}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell-group>
      <div class="evaluateItem" :key="index" v-if="item.remarks.split(':')[0] == '满意框'">
        <div class="title">{{index + 1}}、{{item.question}}</div>
        <div class="evaluate">
          <template v-for="(childItem, childIndex) in questionConvert(item.remarks)">
            <div :key="childIndex" class="faceImg" :name="item.id" :childName="childItem"  :style="formData[item.id] != childItem ? 'filter: grayscale(1);' : ''" @click.stop="selectFaceImg(item.id, childItem)">
              <img :src="require('../assets/img/evaluate/' + (3 - childIndex) + '.png')" alt="">
              <h1>{{childItem}}</h1>
            </div>
          </template>
        </div>
      </div>
      <van-cell-group :key="index" :title="(index + 1) + '、' + item.question" style="padding: 0;" v-if="item.remarks.split(':')[0] == '编辑框'">
        <van-field
          v-model="formData[item.id]"
          type="textarea"
          placeholder="请输入..."
          rows="5"
          autosize
          @input="textareaInput"
        />
      </van-cell-group>
    </template>
    <div class="applyBtn">
      <van-button type="info" size="large" @click="submitEvaluate">提交评价</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "evaluate",
    data() {
      return {
        loanId: '',
        questionList: [],
        formData: {
          '201': '',
          '202': '',
          '203': '',
          '204': ''
        }
      }
    },
    methods: {
      loadQuestion() {
        this.$post('getQuestionDict', {
          tcType: '2'
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
      selectFaceImg(id, name) {
        this.formData[id] = name
      },
      textareaInput() {
        if (this.formData['205'].length > 200) {
          this.$notify('宝贵意见不能超过200字')
          this.formData['205'] = this.formData['205'].slice(0, 200)
        }
      },
      submitEvaluate() {
        const sendData = {}
        Object.assign(sendData, this.formData)
        if (sendData['201'] == '' || sendData['202'] == '' || sendData['203'] == '' || sendData['204'] == '') {
          this.$notify('请将评价填写完整')
        } else {
          const answerArr = []
          Object.keys(sendData).forEach(key => {
            const obj = {
              id: key,
              answer: sendData[key]
            }
            answerArr.push(obj)
          })
          this.$post('appraiseLoan', {
            tcBespeakID: this.loanId,
            toData: answerArr
          }).then(res => {
            if (res.code == 0) {
              this.$toast({
                type: 'success',
                message: res.message,
                duration: 1500,
                onClose: () => {
                  this.$router.go(-1)
                }
              });
            } else if (res.code == 200) {
              this.$toast({
                type: 'fail',
                message: res.message,
                duration: 1500
              });
            }
          })
        }
      }
    },
    mounted() {
      this.loadQuestion()
      this.loanId = this.$route.query.id
    }
  }
</script>

<style lang="less" scoped>
  .van-cell-group{overflow: hidden;padding: 15px;}
  .van-radio{float: left;margin-right: 35px;}
  .evaluateItem{
    .title{padding: 16px 16px 8px;color: #969799;}
    .evaluate{display: flex;justify-content: space-around;padding: 15px 0;background: #fff;
      .faceImg{width: 80px;
        img{width: 24px;display: block;margin: 0 auto;}
        h1{font-size: 12px;text-align: center;margin-top: 5px;color: #FF976A;}
      }
    }
  }
</style>