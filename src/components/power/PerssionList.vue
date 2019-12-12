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
      <el-select v-model="roleData" @change="handleSelectedChange" style="margin-right: 600px">
        <el-option v-for="item in roleList" :key="item.code" :value="item.code" :label="item.title"></el-option>
      </el-select>
      <el-transfer></el-transfer>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleData: '',
      roleList: []
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
