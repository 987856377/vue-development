<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>处方流转</el-breadcrumb-item>
      <el-breadcrumb-item>处方列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      搜索与添加-->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入用户名进行查询" clearable @clear="getPrescriptionList">
            <el-button slot="append" icon="el-icon-search" @click="getPrescriptionList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
      <!--      表单-->
      <el-table :data="tableData" style="width: 100%" max-height="520" stripe border v-loading.lock="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
        <el-table-column prop="id" label="处方编号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="orgname" label="机构" width="120" align="center">
        </el-table-column>
        <el-table-column prop="department" label="归属" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="type" label="处方类型" sortable width="120" align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.type == 1">普通</div>
            <div v-else-if="scope.row.type == 2" style="color: red">特殊</div>
          </template>
        </el-table-column>
        <el-table-column prop="symptom" label="适用症" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="date" label="开方日期" width="140" align="center" >
        </el-table-column>
        <el-table-column prop="flag" label="流转状态" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.flag == 1" style="text-align: center">已启用</div>
            <div v-else-if="scope.row.flag == 0" style="color: red; text-align: center">已停用</div>
          </template>
        </el-table-column>
        <el-table-column prop="verify" label="审核状态" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.verify == 1" style="text-align: center">已审核</div>
            <div v-else-if="scope.row.verify == 0" style="color: red; text-align: center">待审核</div>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="流转状态" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.enable == 1" style="text-align: center">可流转</div>
            <div v-else-if="scope.row.enable == 0" style="color: red; text-align: center">不可流转</div>
          </template>
        </el-table-column>
        <el-table-column prop="flag" fixed="right" label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button @click="handleClickView(scope.row)" type="success" icon="el-icon-search" size="mini">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="request.page.current"
        :page-sizes="[1, 5, 10]"
        :page-size="request.page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--      编辑对话框-->
      <el-dialog title="详情" :visible.sync="dialogTableVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

        <el-form ref="prescriptionFormRef" :model="prescriptionData" label-width="100px" size="mini">
          <el-form-item label="机构" prop="orgname">
            <el-input v-model="prescriptionData.orgname" disabled></el-input>
          </el-form-item>
          <el-form-item label="录入者" prop="uname">
            <el-input v-model="prescriptionData.uname"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseView">取 消</el-button>
          <el-button type="primary" @click="handleClickUpdate(prescriptionData)">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      request: {
        page: {
          current: 1,
          size: 5
        },
        orgname: '',
        department: '',
        type: '',
        symptom: '',
        flag: '',
        verify: '',
        enable: ''
      },
      roleList: [],
      org: {
        orgName: '',
        orgCode: '',
        orgFlag: ''
      },
      prescriptionData: Object,
      loading: false,
      waiting: false,
      total: 0,
      dialogTableVisible: false,
      tableData: []
    }
  },
  created () {
    this.getUserOrg()
  },
  mounted () {
    this.getRoleListAvalible()
  },
  methods: {
    async getUserOrg () {
      await this.$axios.post('organization/getOrgInfoByUid', {'id': window.sessionStorage.getItem('id')}).then(result => {
        if (result.data.code === 200) {
          this.org.orgName = result.data.data.name
          this.org.orgCode = result.data.data.code
          this.org.orgFlag = result.data.data.orgflag
          this.request.orgname = result.data.data.name
          return this.getPrescriptionList()
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        return this.$message.error('获取数据失败')
      })
    },
    getPrescriptionList () {
      this.loading = true
      this.$axios.post('prescription/status/getPrescriptionList', this.request).then(result => {
        if (result.data.code === 200) {
          this.request.current = result.data.data.current
          this.request.size = result.data.data.size
          this.total = result.data.data.total
          this.loading = false
          // eslint-disable-next-line no-return-assign
          return this.tableData = result.data.data.records
        } else {
          this.loading = false
          return this.$message.error('获取数据失败')
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        return this.$message.error('获取数据失败')
      })
    },
    async getRoleListAvalible () {
      await this.$axios.post('userrole/getRoleListAvalible', {'uid': window.sessionStorage.getItem('id')}).then(result => {
        if (result.data.code === 200) {
          this.roleList = result.data.data
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户可操作角色数据失败')
      })
    },
    handleClickView (row) {
      this.dialogTableVisible = true
      this.prescriptionData = row
    },
    handleCloseView () {
      this.dialogTableVisible = false
      this.$refs.prescriptionFormRef.resetFields()
    },
    handleClickChange (row) {
      let msg = ''
      if (row.flag === 1) msg = '此操作将停用该用户, 是否继续?'
      else if (row.flag === 0) msg = '此操作将启用该用户, 是否继续?'
      this.$confirm(msg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async () => {
          this.loading = true
          if (row.flag === 1) row.flag = 0
          else if (row.flag === 0) row.flag = 1
          await this.$axios.post('user/cancelUserById', {'id': row.id, 'flag': row.flag}).then(result => {
            this.loading = false
            return this.$message({ type: 'success', message: '更新用户状态成功!' })
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            this.loading = false
            return this.$message({ type: 'error', message: '更新用户状态失败!' })
          })
        }).catch(() => {
          this.loading = false
          this.$message({ type: 'info', message: '已取消操作' })
        })
    },
    handleSizeChange (newSize) {
      this.request.page.size = newSize
      this.getPrescriptionList()
    },
    handleCurrentChange (newPage) {
      this.request.page.current = newPage
      this.getPrescriptionList()
    }
  }
}
</script>

<style scoped>

</style>
