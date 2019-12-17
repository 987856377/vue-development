<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限控制</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <el-select v-model="roleData" @change="handleSelectedChange">
        <el-option v-for="item in roleList" :key="item.code" :value="item.code" :label="item.title"></el-option>
      </el-select>
      <el-transfer v-model="value1" :data="data"></el-transfer>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      roleData: '',
      roleList: [],
      data: generateData(),
      value1: [1, 4]
    }
  },
  created () {
    this.getRoleListAvalible()
  },
  methods: {
    async getRoleListAvalible () {
      this.loading = true
      // 获取所有角色: flag传空值, 获取所有角色, 不传flag, 获取默认获取所有已启用的角色(后端代码flag 默认为1)
      await this.$axios.post('userrole/getRoleListAvalible', {
        'uid': window.sessionStorage.getItem('id'),
        'flag': ''
      }).then(result => {
        if (result.data.code === 200) {
          this.roleList = result.data.data
          this.loading = false
        } else {
          this.loading = false
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        return this.$message.error('获取用户可操作角色数据失败: ' + error)
      })
    },
    handleSelectedChange () {
      console.log(this.roleData)
    }
  }
}
</script>
