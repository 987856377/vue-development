<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限控制</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      搜索与添加-->
      <el-table :data="roleList" style="width: 100%" max-height="520" stripe border v-loading.lock="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
        <el-table-column label="角色ID" prop="id" width="100" align="center">
        </el-table-column>
        <el-table-column label="角色标识" prop="title" align="center">
        </el-table-column>
        <el-table-column prop="flag" label="状态" width="100" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.flag === 1" style="background-color: greenyellow; color: #333333; text-align: center">已启用</div>
            <div v-else-if="scope.row.flag === 0" style="background-color: red; color: aliceblue; text-align: center">已停用</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="185px">
          <template slot-scope="scope">
            <div v-if="scope.row.flag === 1">
              <el-tooltip class="item" effect="dark" content="该角色已启用, 点击停用" placement="top" :enterable="false">
                <el-button @click="handleClickChange(scope.row)" type="danger" size="mini" icon="el-icon-remove-outline"></el-button>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.flag === 0">
              <el-tooltip class="item" effect="dark" content="该角色已停用, 点击启用" placement="top" :enterable="false">
                <el-button @click="handleClickChange(scope.row)" type="success" size="mini" icon="el-icon-circle-check"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrganizationList',
  data () {
    return {
      roleList: [],
      flag: '',
      loading: false
    }
  },
  created () {
    this.getRoleListAvalible()
  },
  methods: {
    async getRoleListAvalible () {
      this.loading = true
      // 获取所有角色: flag传空值, 获取所有角色, 不传flag, 获取默认获取所有已启用的角色(后端代码flag 默认为1)
      await this.$axios.post('userrole/getRoleListAvalible', {'uid': window.sessionStorage.getItem('id'), 'flag': ''}).then(result => {
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
    handleClickChange (row) {
      let msg = ''
      if (row.flag === 1) msg = '此操作将停用该角色, 且拥有该角色的用户将不再使用本平台 是否继续?'
      else if (row.flag === 0) msg = '此操作将启用该角色, 且拥有该角色的用户将继续使用本平台, 是否继续?'
      this.$confirm(msg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async () => {
          this.loading = true
          if (row.flag === 1) row.flag = 0
          else if (row.flag === 0) row.flag = 1
          await this.$axios.post('role/updateRoleState', {'id': row.id, 'flag': row.flag}).then(result => {
            this.loading = false
            return this.$message({ type: 'success', message: '更新角色状态成功!' })
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            this.loading = false
            return this.$message({ type: 'error', message: '更新角色状态失败: ' + error })
          })
        }).catch(() => {
          this.loading = false
          this.$message({ type: 'info', message: '已取消操作' })
        })
    }
  }
}
</script>

<style scoped>

</style>
