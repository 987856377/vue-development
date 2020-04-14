<template>
  <div>
    <el-card>
      <div class="img">
        <img src="../assets/images/title.jpg" :style="{borderRadius: '0',width: '100%',height: '100%'}" alt=""/>
      </div>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="12">
          <img src="../assets/images/home.jpg" :style="{borderRadius: '0',width: '100%',height: '100%'}" alt="" align="left"/>
        </el-col>
        <el-col :span="12">
          <el-card>
            <p style="text-indent:25px; text-align: left">{{introduction}}</p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      introduction: '在实施“医药分开”综合改革的过程当中，处方外流或院外处方流转是其中一项重点内容，意即此前由医院药房承担的药品供给、药事服务等要逐渐释放到以零售药店为主的其他药品流通渠道，保障患者购药需求。\n' +
        '处方外流除了能作为能解决“以药养医”问题的有效方案，还有两个重要的因素：一是医保基金浪费严重，基金被大检查、大处方严重吞噬；二是近年来暴力伤医层出不穷，医患关系严重不和谐，患者也对大检查、大处方深恶痛绝。只有彻底割断医生和医药之间的利益关系，让医生不再谋求检查和药品上的灰色利益，医患关系才能在一定程度上和谐起来。\n' +
        '电子处方流转平台的实现是为了将处方外流落实到实际上，在各类医疗机构入驻流转平台的前提下，只需要将本机构的处方录入本平台，在其他机构有需求的情况下，收到处方申请，就可以将本机构的处方流转出去。其他在医疗机构收到处方后就可以应用于实际市场需求。\n' +
        '电子处方流转平台是医院的“互联网+”建设的重要内容，它弥补了医院服务资源的不足，带动医疗服务模式的升级，使患者就诊的便捷性、自主性大幅提高。切实改善民众就医问题，实现“患者少跑腿、信息多跑路”的项目建设初衷。\n'
    }
  },
  created () {
    this.getOrgIntroductionByCode()
  },
  methods: {
    async getOrgIntroductionByCode () {
      await this.$axios.post('organization/getOrgIntroductionByCode', {'code': window.sessionStorage.getItem('orgCode')}).then(result => {
        if (result.data.code === 200) {
          if (result.data.data !== null) {
            this.introduction = result.data.data
          }
        } else {
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
      }).catch(error => {
        return this.$message.error('获取机构信息失败: ' + error)
      })
    }
  }
}
</script>

<style>

</style>
