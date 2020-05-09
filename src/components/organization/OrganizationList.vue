<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      搜索与添加-->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入机构名称" v-model="query" clearable @clear="getOrgList">
            <el-button slot="append" icon="el-icon-search" @click="getOrgByName"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
<!--      表单-->
      <el-table :data="tableData" style="width: 100%" max-height="520" stripe border v-loading.lock="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
        <el-table-column fixed prop="date" label="注册日期" sortable width="140" align="center">
        </el-table-column>
        <el-table-column prop="name" label="机构名称" width="120" align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="120" align="center">
        </el-table-column>
        <el-table-column prop="postcode" label="邮编" width="80" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="100" align="center">
        </el-table-column>
        <el-table-column prop="mail" label="机构邮箱" width="160" align="center">
        </el-table-column>
        <el-table-column prop="officer" label="法人代表" width="80" align="center">
        </el-table-column>
        <el-table-column prop="classify" label="机构类别" width="120" align="center">
          <template slot-scope="scope">
            {{ classifyObj[scope.row.classify] }}
          </template>
        </el-table-column>
        <el-table-column prop="relation" label="隶属关系" width="140" align="center">
          <template slot-scope="scope">
            {{ relationObj[scope.row.relation] }}
          </template>
        </el-table-column>
        <el-table-column prop="host" label="单位类型" width="120" align="center">
          <template slot-scope="scope">
            {{ hostObj[scope.row.host] }}
          </template>
        </el-table-column>
        <el-table-column prop="supervising" label="上级机构" width="120" align="center">
        </el-table-column>
        <el-table-column prop="flag" label="状态" width="100" sortable align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.flag === 1" style="background-color: greenyellow; color: #333333; text-align: center">已启用</div>
            <div v-else-if="scope.row.flag === 0" style="background-color: red; color: aliceblue; text-align: center">已停用</div>
            <div v-else-if="scope.row.flag === 9" style="background-color: yellow; color: black; text-align: center">待激活</div>
            </template>
        </el-table-column>
        <el-table-column prop="flag" fixed="right" label="操作" width="125px" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.flag === 1">
              <el-button @click="handleClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-tooltip class="item" effect="dark" content="该机构已启用, 点击停用" placement="top" :enterable="false">
                <el-button @click="handleClickChange(scope.row)" type="danger" size="mini" icon="el-icon-remove-outline"></el-button>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.flag === 0">
              <el-button @click="handleClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-tooltip class="item" effect="dark" content="该机构已停用, 点击启用" placement="top" :enterable="false">
                <el-button @click="handleClickChange(scope.row)" type="success" size="mini" icon="el-icon-circle-check"></el-button>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.flag === 9">
              <el-button @click="handleClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-tooltip class="item" effect="dark" content="该机构待激活, 点击激活" placement="top" :enterable="false">
                <el-button @click="handleClickChange(scope.row)" type="success" size="mini" icon="el-icon-circle-check"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[1, 5, 10]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
<!--      编辑对话框-->
      <el-dialog title="编辑" :visible.sync="dialogTableVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

        <el-form ref="orgFormRef" :model="orgData" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="名称" prop="name">
            <el-input v-model="orgData.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="机构类别">
            <el-input v-model="classifyObj[orgData.classify]" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="隶属关系">
            <el-input v-model="relationObj[orgData.relation]" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="单位类型">
            <el-input v-model="hostObj[orgData.host]" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="机构分类">
            <el-input v-model="typeObj[orgData.type]" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="地址"  prop="address">
            <el-input v-model="orgData.address"></el-input>
          </el-form-item>
          <el-form-item label="邮编" prop="postcode">
            <el-input v-model="orgData.postcode"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="orgData.phone"></el-input>
          </el-form-item>
          <el-form-item label="机构邮箱" prop="mail">
            <el-input v-model="orgData.mail"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="responser">
            <el-input v-model="orgData.responser"></el-input>
          </el-form-item>
          <el-form-item label="法人代表" prop="officer">
            <el-input v-model="orgData.officer"></el-input>
          </el-form-item>
          <el-form-item label="机构网站" prop="web">
            <el-input v-model="orgData.web"></el-input>
          </el-form-item>
          <el-form-item label="上级机构" prop="supervising">
            <el-input v-model="orgData.supervising"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="handleCloseEdit">取 消</el-button>
          <el-button type="primary" @click="handleClickUpdate(orgData)">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrganizationList',
  data () {
    return {
      query: '',
      page: {
        current: 1,
        size: 5
      },
      loading: false,
      total: 0,
      dialogTableVisible: false,
      orgData: Object,
      tableData: [],
      classifyObj: {
        1: '非营利性医疗机构',
        2: '盈利性医疗机构',
        3: '其他医疗机构'
      },
      typeObj: {
        1: '省卫生厅',
        2: '市卫生局',
        3: '区卫生局',
        4: '卫生社会团体',
        5: '其他卫生机构',
        6: '健康教育所(站、中心)',
        7: '医学教育机构',
        8: '医学科学研究机构',
        9: '卫生监督检验(监测、检测)所(站)',
        10: '卫生监督所(局)',
        11: '疾病防控制中心(防疫站)',
        12: '专科疾病防治院(所、站)',
        13: '医院',
        14: '采供血机构',
        15: '急救中心(站)',
        16: '妇幼保健院(所、站)',
        17: '门诊部、诊所、医务室、村卫生室',
        18: '卫生院',
        19: '社区卫生服务中心(站)'
      },
      hostObj: {
        1: '卫生行政部门',
        2: '其他行政部门',
        3: '企业',
        4: '事业单位',
        5: '社会团体',
        6: '其他社会组织'
      },
      relationObj: {
        1: '中央属',
        2: '省,自治区直辖市属',
        3: '省辖市(地区,州,盟)',
        4: '县级市(省辖市区)属',
        5: '县(旗)属',
        6: '镇属',
        7: '乡属',
        8: '街道属'
      },
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入机构地址', trigger: 'blur' },
          { min: 8, max: 32, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        postcode: [
          { required: true, message: '请输入邮政编码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度为 6 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '长度为 11 个字符', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入机构邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        responser: [
          { required: true, message: '请输入负责人', trigger: 'blur' },
          { min: 3, max: 16, message: '长度为 3 到 16 个字符', trigger: 'blur' }
        ],
        officer: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度为 3 到 16 个字符', trigger: 'blur' }
        ],
        web: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 9, max: 32, message: '长度为 9 到 32 个字符', trigger: 'blur' }
        ],
        supervising: [
          { required: true, message: '请输入上级机构', trigger: 'blur' },
          { min: 6, max: 16, message: '长度为 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    async getOrgByName () {
      if (this.query === '') {
        return
      }
      this.loading = true
      await this.$axios.post('organization/getOrgByName', {'name': this.query}).then(result => {
        if (result.data.code === 200) {
          this.loading = false
          // eslint-disable-next-line no-return-assign
          return this.tableData = result.data.data
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
    async getOrgList () {
      this.loading = true
      await this.$axios.post('organization/getOrgList', {
        // 'orgflag': window.sessionStorage.getItem('orgFlag'),/* 获取本机构及下级机构信息则传递 orgflag 参数, 不传递则获取所有机构 */
        'page': this.page}).then(result => {
        if (result.data.code === 200) {
          this.current = result.data.data.current
          this.size = result.data.data.size
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
    handleClickChange (row) {
      let msg = ''
      if (row.flag === 1) msg = '此操作将停用该机构, 是否继续?'
      else if (row.flag === 0) msg = '此操作将启用该机构, 是否继续?'
      else if (row.flag === 9) msg = '此操作将激活该机构, 是否继续?'
      this.$confirm(msg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async () => {
          this.loading = true
          if (row.flag === 1) row.flag = 0
          else if (row.flag === 0) row.flag = 1
          else if (row.flag === 9) row.flag = 1
          await this.$axios.post('organization/cancelOrg', {'name': row.name, 'flag': row.flag}).then(result => {
            if (result.data.code === 200) {
              this.loading = false
              return this.$message({ type: 'success', message: '更新机构状态成功!' })
            } else {
              this.loading = false
              if (row.flag === 1) row.flag = 0
              else if (row.flag === 0) row.flag = 1
              else if (row.flag === 9) row.flag = 1
              return this.$message({type: 'error', message: '更新机构状态失败: ' + result.data.message})
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            this.loading = false
            return this.$message({type: 'error', message: '更新机构状态失败: ' + error})
          })
        }).catch(() => {
          this.loading = false
          this.$message({ type: 'info', message: '已取消操作' })
        })
    },
    handleClickEdit (row) {
      this.dialogTableVisible = true
      this.orgData = row
    },
    handleCloseEdit () {
      this.dialogTableVisible = false
      this.$refs.orgFormRef.resetFields()
    },
    handleClickUpdate (row) {
      this.$refs.orgFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请确认信息')
        }
        // 点击更新按钮, 弹出的对话框隐藏, 如果添加 @click 监听函数, 关闭对话框的时候会将数据重置, 起不到更新的效果
        this.dialogTableVisible = false
        this.loading = true
        await this.$axios.post('organization/saveOrUpdate', row).then(result => {
          if (result.data.code === 200) {
            this.getOrgList()
            this.loading = false
            // eslint-disable-next-line no-return-assign
            return this.$message.success('更新成功')
          } else {
            this.getOrgList()
            this.loading = false
            return this.$message.error('更新失败: ' + result.data.message)
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.getOrgList()
          this.loading = false
          return this.$message.error('更新失败: ' + error)
        })
      })
    },
    handleSizeChange (newSize) {
      this.page.size = newSize
      this.getOrgList()
    },
    handleCurrentChange (newPage) {
      this.page.current = newPage
      this.getOrgList()
    }
  }
}
</script>

<style scoped>

</style>
