<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户维护</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      搜索与添加-->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入用户名进行查询" v-model="query" clearable @clear="getUserInfoList">
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
      <!--      表单-->
      <el-table :data="tableData" style="width: 100%" max-height="520" stripe border v-loading.lock="loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
        <el-table-column fixed prop="username" label="用户名" width="120" align="center">
        </el-table-column>
        <el-table-column fixed prop="name" label="姓名" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="80" align="center" >
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" sortable align="center" >
        </el-table-column>
        <el-table-column prop="nation" label="民族" width="100" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机" width="120" align="center">
        </el-table-column>
        <el-table-column prop="mail" label="邮箱" width="140" align="center">
        </el-table-column>
        <el-table-column prop="identity" label="身份证号" width="150" align="center">
        </el-table-column>
        <el-table-column prop="orgname" label="所属机构" width="120" sortable align="center">
        </el-table-column>
        <el-table-column prop="registerTime" label="注册日期" sortable width="140" align="center">
        </el-table-column>
        <el-table-column prop="modifyTime" label="修改日期" sortable width="140" align="center">
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录日期" sortable width="140" align="center">
        </el-table-column>
        <el-table-column prop="flag" label="状态" width="100" sortable  align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.flag === 1" style="background-color: greenyellow; color: #333333; text-align: center">已启用</div>
            <div v-else-if="scope.row.flag === 0" style="background-color: red; color: aliceblue; text-align: center">已停用</div>
          </template>
        </el-table-column>
        <el-table-column prop="flag" fixed="right" label="操作" align="center" width="185px">
          <template slot-scope="scope">
            <div v-if="scope.row.flag === 1">
              <el-button @click="handleClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-tooltip class="item" effect="dark" content="该用户已启用, 点击停用" placement="top" :enterable="false">
                <el-button @click="handleClickChange(scope.row)" type="danger" size="mini" icon="el-icon-remove-outline"></el-button>
              </el-tooltip>
              <el-button @click="handleClickView(scope.row)" type="info" icon="el-icon-view" size="mini"></el-button>
            </div>
            <div v-else-if="scope.row.flag === 0">
              <el-button @click="handleClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-tooltip class="item" effect="dark" content="该用户已停用, 点击启用" placement="top" :enterable="false">
                <el-button @click="handleClickChange(scope.row)" type="success" size="mini" icon="el-icon-circle-check"></el-button>
              </el-tooltip>
              <el-button @click="handleClickView(scope.row)" type="info" icon="el-icon-view" size="mini"></el-button>
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
      <el-dialog title="编辑" :visible.sync="dialogTableVisible" width="500px" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

        <el-form ref="usrFormRef" :model="usrData" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="usrData.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="usrData.name"></el-input>
          </el-form-item>
          <el-form-item label="性别"  prop="sex">
            <el-select v-model="usrData.sex" style="width: 360px">
              <el-option value="男" key="男"></el-option>
              <el-option value="女" key="女"></el-option>
              <el-option value="不详" key="不详"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="usrData.age"></el-input>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-input v-model="usrData.nation"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="usrData.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="usrData.mail"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="identity">
            <el-input v-model="usrData.identity"></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="orgname">
            <el-input v-model="usrData.orgname" disabled></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="handleCloseEdit">取 消</el-button>
          <el-button type="primary" @click="handleClickUpdate(usrData)">确 定</el-button>
        </div>
      </el-dialog>
<!--      角色对话框-->
      <el-dialog title="用户角色" :visible.sync="roleTableVisible" center :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <template>
          <el-select v-model="role.destRole" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.code" :value="item.code" :label="item.title">
            </el-option>
          </el-select>
          <el-button @click="handleClickAddRole" type="success" icon="el-icon-plus" style="margin-right: 15px">添加角色</el-button>
        </template>
        <el-table :data="roleData" style="width: 100%" max-height="520" stripe border v-loading.lock="waiting" element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading">
          <el-table-column label="角色ID" prop="id" align="center">
          </el-table-column>
          <el-table-column label="角色标识" prop="title" align="center">
          </el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-button @click="handleClickDelRole(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="handleCloseRoleDialog">关 闭</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    return {
      query: '',
      page: {
        current: 1,
        size: 5
      },
      role: {
        uid: '',
        destRole: '',
        sourceRole: ''
      },
      roleData: [],
      roleList: [],
      org: {
        orgName: '',
        orgCode: '',
        orgFlag: ''
      },
      loading: false,
      waiting: false,
      total: 0,
      dialogTableVisible: false,
      roleTableVisible: false,
      usrData: Object,
      tableData: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入用户地址', trigger: 'blur' },
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
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
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
          { required: true, message: '请输入上级用户', trigger: 'blur' },
          { min: 6, max: 16, message: '长度为 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserInfoList()
  },
  mounted () {
    this.getRoleListAvalible()
  },
  methods: {
    async getUserInfo () {
      if (this.query === '') {
        return
      }
      this.loading = true
      await this.$axios.post('userinfo/getUserInfo', {'username': this.query}).then(result => {
        if (result.data.code === 200) {
          this.loading = false
          // eslint-disable-next-line no-return-assign
          return this.tableData = new Array(result.data.data)
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
    async getUserInfoList () {
      this.loading = true
      await this.$axios.post('userinfo/getUserInfoPage', { page: this.page, 'orgflag': window.sessionStorage.getItem('orgFlag') }).then(result => {
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
    async getUserRoleList () {
      this.waiting = true
      await this.$axios.post('userrole/getRoleList', this.role).then(result => {
        if (result.data.code === 200) {
          this.roleData = result.data.data
        }
        this.waiting = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.waiting = false
        return this.$message.error('获取用户角色数据失败: ' + error)
      })
    },
    async getRoleListAvalible () {
      await this.$axios.post('userrole/getRoleListAvalible', {'uid': window.sessionStorage.getItem('id')}).then(result => {
        if (result.data.code === 200) {
          this.roleList = result.data.data
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户可操作角色数据失败: ' + error)
      })
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
            if (result.data.data === true) {
              this.loading = false
              return this.$message({ type: 'success', message: '更新用户状态成功!' })
            } else {
              if (row.flag === 1) row.flag = 0
              else if (row.flag === 0) row.flag = 1
              this.loading = false
              return this.$message({ type: 'error', message: '更新用户状态失败, 改机构可能已停用, 详情请咨询管理员!' })
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            if (row.flag === 1) row.flag = 0
            else if (row.flag === 0) row.flag = 1
            this.loading = false
            return this.$message({ type: 'error', message: '更新用户状态失败: ' + error })
          })
        }).catch(() => {
          this.loading = false
          this.$message({ type: 'info', message: '已取消操作' })
        })
    },
    handleClickEdit (row) {
      this.dialogTableVisible = true
      this.usrData = row
    },
    async handleClickView (row) {
      this.roleTableVisible = true
      this.role.uid = row.id
      this.getUserRoleList()
    },
    handleCloseRoleDialog () {
      this.roleTableVisible = false
      this.role.uid = ''
      this.role.sourceRole = ''
      this.role.destRole = ''
    },
    async handleClickAddRole () {
      if (this.role.uid === null || this.role.uid === '' || this.role.destRole === null || this.role.destRole === '') {
        return
      }
      for (let i = 0; i < this.roleData.length; i++) {
        if (this.roleData[i].code === this.role.destRole) {
          return this.$message.error('该用户已拥有该角色')
        }
      }
      this.waiting = true
      await this.$axios.post('userrole/addUserRole', this.role).then(result => {
        if (result.data.code === 200) {
          this.getUserRoleList()
        }
        this.role.destRole = ''
        this.waiting = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.role.destRole = ''
        this.waiting = false
        return this.$message.error('添加用户角色失败')
      })
    },
    async handleClickDelRole (row) {
      this.role.destRole = row.code
      if (this.role.uid === null || this.role.uid === '' || this.role.destRole === null || this.role.destRole === '') {
        return
      }
      this.waiting = true
      await this.$axios.post('userrole/delUserRole', this.role).then(result => {
        if (result.data.code === 200) {
          this.getUserRoleList()
        }
        this.role.destRole = ''
        this.waiting = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.role.destRole = ''
        this.waiting = false
        return this.$message.error('删除用户角色失败: ' + error)
      })
    },
    handleCloseEdit () {
      this.dialogTableVisible = false
      this.$refs.usrFormRef.resetFields()
    },
    handleClickUpdate (row) {
      this.$refs.usrFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请确认信息')
        }
        // 点击更新按钮, 弹出的对话框隐藏, 如果添加 @click 监听函数, 关闭对话框的时候会将数据重置, 起不到更新的效果
        this.dialogTableVisible = false
        this.loading = true
        await this.$axios.post('userinfo/completeUserInfo', row).then(result => {
          if (result.data.code === 200) {
            this.getUserInfoList()
            this.loading = false
            // eslint-disable-next-line no-return-assign
            return this.$message.success('更新成功')
          } else {
            this.getUserInfoList()
            this.loading = false
            return this.$message.error('更新失败: ' + result.data.message)
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.getUserInfoList()
          this.loading = false
          return this.$message.error('更新失败: ' + error)
        })
      })
    },
    handleSizeChange (newSize) {
      this.page.size = newSize
      this.getUserInfoList()
    },
    handleCurrentChange (newPage) {
      this.page.current = newPage
      this.getUserInfoList()
    }
  }
}
</script>

<style scoped>

</style>
