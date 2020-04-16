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
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input placeholder="处方编号" v-model="request.id" clearable @clear="getPrescriptionList">
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="归属科室" v-model="request.department" clearable @clear="getPrescriptionList">
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-input placeholder="适用症" v-model="request.symptom" clearable @clear="getPrescriptionList">
          </el-input>
        </el-col>
        <el-col :span="4"><el-button icon="el-icon-search" @click="getPrescriptionList">检索</el-button></el-col>
      </el-row>
      <!--      表单-->
      <el-table :data="tableData" style="width: 100%" max-height="520" stripe border v-loading.lock="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
        <el-table-column prop="id" label="处方编号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="orgname" label="机构" width="120" align="center">
        </el-table-column>
        <el-table-column prop="department" label="归属" sortable width="120" align="center" >
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
        <el-table-column prop="flag" label="状态" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.flag == 1" style="text-align: center">已启用</div>
            <div v-else-if="scope.row.flag == 0" style="color: red; text-align: center">已停用</div>
          </template>
        </el-table-column>
        <el-table-column prop="verify" label="审核状态" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.verify === 1" style="text-align: center">已审核</div>
            <div v-else-if="scope.row.verify === 0" style="color: red; text-align: center">未通过</div>
            <div v-else-if="scope.row.verify === 9" style="color: red; text-align: center">待审核</div>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="审核员" width="120" align="center">
        </el-table-column>
        <el-table-column prop="verifyTime" label="审核日期" width="140" align="center" >
        </el-table-column>
        <el-table-column prop="enable" label="流转状态" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.enable === 1" style="text-align: center">可流转</div>
            <div v-else-if="scope.row.enable === 0" style="color: red; text-align: center">不可流转</div>
          </template>
        </el-table-column>
        <el-table-column prop="origin" label="处方来源" width="120" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.origin === 1" style="text-align: center">本地</div>
            <div v-else-if="scope.row.origin === 9" style="color: #1500FE; text-align: center">外来</div>
          </template>
        </el-table-column>
        <el-table-column prop="extra" label="备注" width="140" align="center" >
        </el-table-column>
         <div v-if="roleFlag === true" style="display: flex">
           <transition name="el-fade-in-linear">
              <el-table-column prop="flag" fixed="right" label="操作" align="center" width="255px">
              <template slot-scope="scope">
                <div v-if="scope.row.flag === 1">
                  <el-button @click="handleClickView(scope.row)" type="primary" icon="el-icon-view" size="mini"></el-button>
                  <el-button @click="handleClickChange(scope.row)" type="danger" icon="el-icon-remove-outline" size="mini"></el-button>
                  <el-button @click="handleClickCirculate(scope.row)" type="info" icon="el-icon-refresh" size="mini"></el-button>
                  <el-button @click="handleCirculateDialog(scope.row)" type="warning" icon="el-icon-sort" size="mini"></el-button>
                </div>
                <div v-else-if="scope.row.flag === 0">
                  <el-button @click="handleClickView(scope.row)" type="primary" icon="el-icon-view" size="mini"></el-button>
                  <el-button @click="handleClickChange(scope.row)" type="success" icon="el-icon-circle-check" size="mini"></el-button>
                  <el-button @click="handleClickCirculate(scope.row)" type="info" icon="el-icon-refresh" size="mini"></el-button>
                  <el-button @click="handleCirculateDialog(scope.row)" type="warning" icon="el-icon-sort" size="mini"></el-button>
                </div>
              </template>
            </el-table-column>
           </transition>
         </div>
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
            <div style="position: absolute; margin-left: 20px; margin-top: 60px; color: red">适用症状: {{prescriptionData.symptom}}</div>
          </div>
          <div style="height: 400px; width: 675px; margin-left: 20px; border-style: solid; border-width: 1px">
            <div style="position: absolute; margin-left: 20px"><h2>Rp.</h2></div>
            <div style="height: 280px; width: 615px; margin-left: 30px; margin-top: 45px; border-style: solid; border-width: 1px">
              <div style="position: absolute; width: 585px; margin-left: 30px; margin-top: 30px; text-align: left;">{{prescriptionData.medicine}}</div>
            </div>
            <div style="position: absolute; margin-left: 40px; margin-top: 10px; text-align: left;width: 625px">医嘱: {{prescriptionData.advice}}</div>
            <div style="position: absolute; margin-left: 500px; margin-top: 55px">Price: {{prescriptionData.price}}</div>
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
            <el-button @click="handleCloseView">关 闭</el-button>
            <el-button type="primary" @click="handleClickPass(prescriptionData)">通  过</el-button>
            <el-button type="danger" @click="handleClickUnPass(prescriptionData)">不通过</el-button>
          </div>
          <div v-else-if="roleFlag === false">
            <el-button @click="handleCloseView">关 闭</el-button>
          </div>
        </div>
      </el-dialog>
      <!--      流转对话框-->
      <el-dialog :visible.sync="dialogPrescriptionVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="prescriptionFormRef" :model="circulationInfo" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="处方编号" prop="id">
            <el-input v-model="circulationInfo.pid" disabled style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="目标机构" prop="achieveName">
            <el-select v-model="circulationInfo.achieveName" @change="setOrgCode(circulationInfo.achieveName)" style="width: 300px">
              <el-option v-for="item in this.orgList" :label="item.name" :key="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收人员" prop="receiverName">
            <el-select v-model="circulationInfo.receiverName" @change="setReceiver(circulationInfo.receiverName)" style="width: 300px">
              <el-option v-for="item in this.receiverList" :label="item.name" :key="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="extra">
            <el-input v-model="circulationInfo.extra" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 400px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="handleCloseCirculateDialog">取 消</el-button>
          <el-button type="primary" @click="handleClickSendPrescription">确 定</el-button>
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
        id: '',
        orgname: '',
        department: '',
        type: '',
        symptom: '',
        flag: '',
        verify: '',
        enable: ''
      },
      circulationInfo: {
        pid: '',
        sender: '',
        senderName: '',
        originCode: '',
        originName: '',
        achieveCode: '',
        achieveName: '',
        receiver: '',
        receiverName: '',
        extra: ''
      },
      receiverList: [],
      roleList: [],
      roleFlag: false,
      orgList: [],
      prescriptionData: Object,
      loading: false,
      waiting: false,
      total: 0,
      dialogTableVisible: false,
      dialogPrescriptionVisible: false,
      tableData: [],
      rules: {
        achieveName: [
          { required: true, message: '请选择接收处方的机构', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        receiverName: [
          { required: true, message: '请选择接收处方的人员', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.request.orgname = window.sessionStorage.getItem('orgName')
    this.getRoleList()
    this.getPrescriptionList()
    this.getPeerAndSubOrgListByOrgFlag()
  },
  methods: {
    async getPrescriptionList () {
      this.loading = true
      await this.$axios.post('prescription/status/getPrescriptionList', this.request).then(result => {
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
        return this.$message.error('获取用户可操作角色数据失败')
      })
    },
    handleClickView (row) {
      this.dialogTableVisible = true
      this.prescriptionData = row
    },
    handleCloseView () {
      this.dialogTableVisible = false
    },
    handleCirculateDialog (row) {
      if (row.verify !== 1 || row.flag !== 1 || row.enable !== 1) {
        return this.$notify({ type: 'error', message: '处方要流转必须要通过审核, 已启用, 且设置为可流转状态, 才可流转向其他机构' })
      }
      this.dialogPrescriptionVisible = true
      this.prescriptionData = row
      this.circulationInfo.pid = row.id
      this.circulationInfo.sender = window.sessionStorage.getItem('id')
      this.circulationInfo.senderName = window.sessionStorage.getItem('name')
      this.circulationInfo.originCode = window.sessionStorage.getItem('orgCode')
      this.circulationInfo.originName = window.sessionStorage.getItem('orgName')
    },
    async getPeerAndSubOrgListByOrgFlag () {
      await this.$axios.post('organization/getPeerAndSubOrgListByOrgFlag', {'orgflag': window.sessionStorage.getItem('orgFlag')}).then(result => {
        if (result.data.code === 200) {
          this.orgList = result.data.data
        } else {
          return this.$message.error('获取目标机构失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取目标机构失败: ' + error)
      })
    },
    setOrgCode (name) {
      this.orgList.forEach(async item => {
        if (item.name === name) {
          this.circulationInfo.achieveCode = item.code
          await this.$axios.post('userinfo/getUserInfoByOrgCodeOrName', {'orgcode': this.circulationInfo.achieveCode}).then(result => {
            if (result.data.code === 200) {
              this.receiverList = result.data.data
              this.circulationInfo.receiverName = ''
            } else {
              return this.$notify({ type: 'error', message: '获取目标机构人员列表失败: ' + result.data.message })
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            return this.$notify({ type: 'error', message: '获取目标机构人员列表失败: ' + error })
          })
        }
      })
    },
    setReceiver (name) {
      this.receiverList.forEach(item => {
        if (item.name === name) {
          this.circulationInfo.receiver = item.id
        }
      })
    },
    handleCloseCirculateDialog () {
      this.dialogPrescriptionVisible = false
      this.circulationInfo.achieveName = ''
      this.circulationInfo.receiverName = ''
    },
    async handleClickSendPrescription () {
      if (this.circulationInfo.achieveName === '' || this.circulationInfo.receiverName === '') {
        return this.$notify({ type: 'info', message: '请选择目标机构或目标人员' })
      }
      await this.$axios.post('prescription/circulationinfo/saveOrUpdate', this.circulationInfo).then(result => {
        if (result.data.code === 200) {
          this.dialogPrescriptionVisible = false
          this.circulationInfo.achieveName = ''
          this.circulationInfo.receiverName = ''
          return this.$notify({ type: 'success', message: '流转成功' })
        } else {
          return this.$notify({ type: 'error', message: '流转失败: ' + result.data.message })
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$notify({ type: 'error', message: '流转失败: ' + error })
      })
    },
    async handleClickPass (prescriptionData) {
      if (prescriptionData.verify === 1) {
        return this.$notify({ type: 'info', message: '处方已审核, 不需重复审核' })
      }
      await this.$axios.post('prescription/status/verifyPrescription', {'pid': prescriptionData.id,
        'operator': window.sessionStorage.getItem('id'),
        'operatorName': window.sessionStorage.getItem('name'),
        'verify': 1}).then(result => {
        if (result.data.code === 200) {
          this.dialogTableVisible = false
          this.getPrescriptionList()
          return this.$notify({ type: 'success', message: '处方已审核通过' })
        } else {
          return this.$notify({type: 'error', message: '操作未完成: ' + result.data.message})
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$notify({ type: 'error', message: '操作未完成: ' + error })
      })
    },
    handleClickUnPass (prescriptionData) {
      if (prescriptionData.verify === 0) {
        return this.$notify({ type: 'info', message: '处方未通过审核' })
      } else if (prescriptionData.verify === 1) {
        return this.$notify({ type: 'info', message: '处方已通过审核, 不可设置为未通过状态' })
      }
      this.$prompt('请输入原因', '备注', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async ({ value }) => {
          await this.$axios.post('prescription/status/verifyPrescription', {'pid': prescriptionData.id,
            'operator': window.sessionStorage.getItem('id'),
            'operatorName': window.sessionStorage.getItem('name'),
            'verify': 0,
            'extra': value}).then(result => {
            if (result.data.code === 200) {
              this.dialogTableVisible = false
              this.getPrescriptionList()
              return this.$notify({ type: 'warning', message: '处方未通过审核' })
            } else {
              return this.$notify({ type: 'error', message: '操作未完成' + result.data.message })
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            return this.$notify({ type: 'error', message: '操作未完成: ' + error })
          })
        }).catch(() => {
          this.$notify({ type: 'error', message: '取消输入' })
        })
    },
    handleClickChange (row) {
      if (row.verify !== 1) {
        return this.$message({ type: 'error', message: '该处方还未通过审核, 不可启用' })
      }
      let msg = ''
      if (row.flag === 1) msg = '此操作将停用该处方, 是否继续?'
      else if (row.flag === 0) msg = '此操作将启用该处方, 是否继续?'
      this.$confirm(msg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async () => {
          this.loading = true
          if (row.flag === 1) {
            row.flag = 0
            row.enable = 0
          } else if (row.flag === 0) {
            row.flag = 1
          }
          await this.$axios.post('prescription/status/stopCirculate', {'pid': row.id, 'flag': row.flag}).then(result => {
            if (result.data.code === 200) {
              this.loading = false
              return this.$message({ type: 'success', message: '更新处方状态成功!' })
            } else {
              this.loading = false
              return this.$message({ type: 'error', message: '更新处方状态失败: ' + result.data.message })
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            this.loading = false
            return this.$message({ type: 'error', message: '更新处方状态失败: ' + error })
          })
        }).catch(() => {
          this.loading = false
          this.$message({ type: 'info', message: '已取消操作' })
        })
    },
    handleClickCirculate (row) {
      if (row.verify !== 1 || row.flag !== 1) {
        return this.$message({ type: 'error', message: '该处方未通过审核或已停用, 不可设置流转状态' })
      }
      let msg = ''
      if (row.enable === 1) msg = '此操作将设置该处方不可流转, 是否继续?'
      else if (row.enable === 0) msg = '此操作将设置该处方可流转, 是否继续?'
      this.$confirm(msg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async () => {
          this.loading = true
          if (row.enable === 1) row.enable = 0
          else if (row.enable === 0) row.enable = 1
          await this.$axios.post('prescription/status/enableCirculate', {'pid': row.id, 'enable': row.enable}).then(result => {
            if (result.data.code === 200) {
              this.loading = false
              return this.$message({ type: 'success', message: '更新处方流转状态成功!' })
            } else {
              this.loading = false
              return this.$message({ type: 'error', message: '更新处方流转状态失败: ' + result.data.message })
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            this.loading = false
            return this.$message({ type: 'error', message: '更新处方流转状态失败: ' + error })
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
