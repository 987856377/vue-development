<template>
  <div>
    <el-card>
      {{introduction}}
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
