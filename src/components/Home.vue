<template>
  <div>
    <el-card>
      <div class="img">
        <img src="../assets/images/title.jpg" height="120" alt="" width="1250"/>
      </div>
    </el-card>
    <el-card>
      <img src="../assets/images/home.jpg" height="400" alt="" width="700" align="left"/>
      <el-card>
        <p style="text-indent:25px; text-align: left">{{introduction}}</p>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      introduction: ''
    }
  },
  created () {
    this.getOrgIntroductionByCode()
  },
  methods: {
    async getOrgIntroductionByCode () {
      await this.$axios.post('organization/getOrgIntroductionByCode', {'code': window.sessionStorage.getItem('orgCode')}).then(result => {
        if (result.data.code === 200) {
          this.introduction = result.data.data
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
