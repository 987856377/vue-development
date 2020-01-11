<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>处方流转</el-breadcrumb-item>
      <el-breadcrumb-item>流转详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      表单-->
      <el-table :data="tableData" style="width: 100%" max-height="520" stripe border v-loading.lock="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
        <el-table-column prop="pid" label="处方编号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="originName" label="来源机构" width="120" align="center">
        </el-table-column>
        <el-table-column prop="senderName" label="发送者" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="originTime" label="发送日期" width="140" align="center" >
        </el-table-column>
        <el-table-column prop="achieveName" label="目标机构" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="receiverName" label="目标人员" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="acceptStatus" label="接收状态" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.acceptStatus === 1" style="text-align: center">已接收</div>
            <div v-else-if="scope.row.acceptStatus === 0" style="color: red; text-align: center">未接收</div>
            <div v-else-if="scope.row.acceptStatus === 9" style="color: red; text-align: center">已拒绝</div>
          </template>
        </el-table-column>
        <el-table-column prop="changeTime" label="接收日期" width="140" align="center" >
        </el-table-column>
        <el-table-column prop="extra" label="备注" width="120" align="center">
        </el-table-column>
        <el-table-column prop="flag" fixed="right" label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button @click="handleClickView(scope.row)" type="primary" icon="el-icon-view" size="mini"></el-button>
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
      <!--      处方对话框-->
      <el-dialog :visible.sync="dialogTableVisible">
        <div style="border-style: solid; border-width: 1px; height: 700px;">
          <div>
            <h2>{{prescriptionData.orgname}}</h2>
            <div>
              <h2>处方笺</h2>
              <div style="position: absolute; margin-left: 550px; margin-top: -70px; border-style: solid; border-width: 1px;">
                <div v-if="prescriptionData.type == 1" style="padding: 5px">普通处方</div>
                <div v-if="prescriptionData.type == 2" style="color: red; padding: 5px">特殊处方</div>
              </div>
            </div>
          </div>
          <div style="height: 100px; width: 675px; margin-left: 20px; border-style: solid; border-width: 1px">
            <div style="position: absolute; margin-left: 20px">处方编号: {{prescriptionData.id}}</div>
            <div style="position: absolute; margin-left: 280px">归属科室: {{prescriptionData.department}}</div>
            <div style="position: absolute; margin-left: 500px">录入人员: {{prescriptionData.uname}}</div>
            <div style="position: absolute; margin-left: 280px; margin-top: 30px">适用年龄: {{prescriptionData.age}}</div>
            <div style="position: absolute; margin-left: 500px; margin-top: 30px">适用性别: {{prescriptionData.sex}}</div>
            <div style="position: absolute; margin-left: 20px; margin-top: 30px">开方日期: {{prescriptionData.date}}</div>
            <div style="position: absolute; margin-left: 20px; margin-top: 60px">适用症状: {{prescriptionData.symptom}}</div>
          </div>
          <div style="height: 400px; width: 675px; margin-left: 20px; border-style: solid; border-width: 1px">
            <div style="position: absolute; margin-left: 20px"><h2>Rp.</h2></div>
            <div style="height: 280px; width: 615px; margin-left: 30px; margin-top: 45px; border-style: solid; border-width: 1px">
              <div style="position: absolute; width: 585px; margin-left: 30px; margin-top: 30px; text-align: left;">{{prescriptionData.medicine}}</div>
            </div>
            <div style="position: absolute; margin-left: 40px; margin-top: 10px">医嘱: {{prescriptionData.advice}}</div>
            <div style="position: absolute; margin-left: 500px; margin-top: 30px">Price: {{prescriptionData.price}}</div>
          </div>
          <div style="height: 80px; width: 675px; margin-left: 20px; border-style: solid; border-width: 1px">
            <div style="position: absolute; margin-left: 20px">开方医生: {{prescriptionData.doctorName}}</div>
            <div style="position: absolute; margin-left: 280px">审核医生: {{prescriptionData.checkDoctor}}</div>
            <div style="position: absolute; margin-left: 20px; margin-top: 30px">开方医生手机: {{prescriptionData.doctorPhone}}</div>
            <div style="position: absolute; margin-left: 280px; margin-top: 30px">审核医生手机: {{prescriptionData.checkPhone}}</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" align="center">
          <div v-if="roleFlag === true">
            <el-button @click="handleCloseView">关  闭</el-button>
            <el-button type="primary" @click="handleClickAccept(prescriptionData)">接  收</el-button>
            <el-button type="danger" @click="handleClickDeny(prescriptionData)">拒  绝</el-button>
          </div>
          <div v-else-if="roleFlag === false">
            <el-button @click="handleCloseView">关  闭</el-button>
          </div>
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
        code: ''
      },
      roleList: [],
      roleFlag: false,
      circulation_info_id: '',
      acceptStatus: '',
      prescriptionData: Object,
      loading: false,
      waiting: false,
      total: 0,
      dialogTableVisible: false,
      tableData: []
    }
  },
  created () {
    this.request.code = window.sessionStorage.getItem('orgCode')
    this.getCirculationInfoList()
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    async getCirculationInfoList () {
      this.loading = true
      await this.$axios.post('prescription/circulationinfo/getCirculationInfoList', this.request).then(result => {
        if (result.data.code === 200) {
          this.request.current = result.data.data.current
          this.request.size = result.data.data.size
          this.total = result.data.data.total
          this.loading = false
          // eslint-disable-next-line no-return-assign
          return this.tableData = result.data.data.records
        } else {
          this.loading = false
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        return this.$message.error('获取数据失败: ' + error)
      })
    },
    async getRoleList () {
      await this.$axios.post('userrole/getRoleList', {'uid': window.sessionStorage.getItem('id')}).then(result => {
        if (result.data.code === 200) {
          this.roleList = result.data.data
          this.roleList.forEach(item => {
            if (item.code === 'AUDIT') {
              this.roleFlag = true
            }
          })
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户可操作角色数据失败: ' + error)
      })
    },
    async handleClickView (row) {
      if (window.sessionStorage.getItem('name') !== row.receiverName) {
        return this.$notify({ type: 'error', message: '对不起, 您无权查看' })
      }
      this.dialogTableVisible = true
      this.circulation_info_id = row.id
      this.acceptStatus = row.acceptStatus
      this.$axios.post('prescription/status/getPrescriptionById', {'pid': row.pid}).then(result => {
        if (result.data.code === 200) {
          // eslint-disable-next-line no-return-assign
          return this.prescriptionData = result.data.data
        } else {
          return this.$notify({type: 'error', message: '获取处方数据失败: ' + result.data.message})
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$notify({type: 'error', message: '获取处方数据失败: ' + error})
      })
    },
    handleCloseView () {
      this.dialogTableVisible = false
    },
    async handleClickAccept (prescriptionData) {
      if (this.acceptStatus === 1) {
        return this.$notify({ type: 'info', message: '处方已接收, 不需重复接收' })
      }
      await this.$axios.post('prescription/circulationinfo/acceptPrescription', {'id': this.circulation_info_id,
        'acceptStatus': 1}).then(async result => {
        if (result.data.code === 200) {
          this.dialogTableVisible = false
          this.getCirculationInfoList()
          prescriptionData.id = ''
          prescriptionData.orgcode = window.sessionStorage.getItem('orgCode')
          prescriptionData.orgname = window.sessionStorage.getItem('orgName')
          prescriptionData.origin = 9
          await this.$axios.post('prescription/detail/saveOrUpdate', prescriptionData).then(result => {
            if (result.data.code === 200) {
              return this.$notify({ type: 'success', message: '处方已保存' })
            } else {
              return this.$notify({ type: 'error', message: '处方未保存: ' + result.data.message })
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            return this.$notify({ type: 'error', message: '处方未保存: ' + error })
          })
        } else {
          return this.$notify({ type: 'error', message: '处方未接收: ' + result.data.message })
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$notify({ type: 'error', message: '操作未接收: ' + error })
      })
    },
    handleClickDeny (prescriptionData) {
      if (this.acceptStatus === 9) {
        return this.$notify({ type: 'info', message: '处方已拒绝' })
      } else if (this.acceptStatus === 1) {
        return this.$notify({ type: 'info', message: '处方已接收, 不可被拒绝' })
      }
      this.$prompt('请输入原因', '备注', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async ({ value }) => {
          await this.$axios.post('prescription/circulationinfo/acceptPrescription', {'id': this.circulation_info_id,
            'acceptStatus': 9,
            'extra': value}).then(result => {
            if (result.data.code === 200) {
              this.dialogTableVisible = false
              this.getCirculationInfoList()
              return this.$notify({ type: 'warning', message: '处方已拒绝' })
            } else {
              return this.$notify({ type: 'error', message: '操作未完成: ' + result.data.message })
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            return this.$notify({ type: 'error', message: '操作未完成: ' + error })
          })
        }).catch((error) => {
          this.$notify({ type: 'error', message: '取消输入: ' + error })
        })
    },
    handleSizeChange (newSize) {
      this.request.page.size = newSize
      this.getCirculationInfoList()
    },
    handleCurrentChange (newPage) {
      this.request.page.current = newPage
      this.getCirculationInfoList()
    }
  }
}
</script>

<style scoped>

</style>
