<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户维护</el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>添加用户</h2>
      <!-- 添加用户表单区域 -->
      <el-form ref="addUserFormRef" :model="user" :rules="rules1" :inline="true" label-width="90px" size="mini">
        <el-card>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="user.password"></el-input>
          </el-form-item>
        </el-card>
      </el-form>

      <!-- 添加用户信息表单区域 -->
      <el-form ref="addUserInfoFormRef" :model="userInfo" :rules="rules2" :inline="true" label-width="90px" size="mini">
        <el-card>
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="identity">
            <el-input v-model="userInfo.identity"></el-input>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-input v-model="userInfo.nation"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="userInfo.sex">
              <el-option value="男" key="男"></el-option>
              <el-option value="女" key="女"></el-option>
              <el-option value="不详" key="不详"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="userInfo.age"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="userInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="userInfo.mail"></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="orgname">
            <el-select v-model="userInfo.orgname" @change="setOrgCode(userInfo.orgname)">
              <el-option v-for="item in this.orgList" :label="item.name" :key="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="userInfo.role">
              <el-option v-for="item in roleList" :key="item.code" :value="item.code" :label="item.title">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-form-item label="是否启用" prop="flag">
              <el-switch v-model="user.flag" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-row>
        </el-card>
        <el-form-item style="margin-top: 15px">
          <el-button type="primary" @click='handleClickSave' v-loading.fullscreen.lock="loading">创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: '',
        flag: 9
      },
      userInfo: {
        id: '',
        name: '',
        orgcode: '',
        orgname: '',
        nation: '',
        identity: '',
        sex: '',
        age: '',
        phone: '',
        mail: '',
        role: ''
      },
      orgList: [],
      roleList: [],
      loading: false,
      rules1: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      },
      rules2: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        nation: [
          { required: true, message: '请输入用户民族', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        identity: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { min: 18, max: 18, message: '长度在 18 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'blur' },
          { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.orgList = JSON.parse(window.sessionStorage.getItem('orgList'))
  },
  mounted () {
    this.getRoleListAvalible()
  },
  methods: {
    setOrgCode (name) {
      this.orgList.forEach(item => {
        if (item.name === name) {
          this.userInfo.orgcode = item.code
        }
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
    handleClickSave () {
      this.$refs.addUserFormRef.validate(async valid1 => {
        if (!valid1) {
          return
        }
        this.$refs.addUserInfoFormRef.validate(async valid2 => {
          if (!valid2) {
            return
          }
          let reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
          if (!reg.test(this.userInfo.phone)) {
            return this.$notify({ type: 'error', message: '手机号格式错误' })
          }
          this.loading = true
          await this.$axios.post('userinfo/create', {'user': this.user, 'userInfo': this.userInfo}).then(async result => {
            if (result.data.code !== 200) {
              this.loading = false
              return this.$message.error('用户注册失败: ' + result.data.data)
            }
            this.userInfo.id = result.data.data
            await this.$axios.post('userrole/addUserRole', {'uid': this.userInfo.id, 'destRole': this.userInfo.role}).then(async result => {
              if (result.data.code === 200) {
                this.loading = false
                this.$refs.addUserFormRef.resetFields()
                this.$refs.addUserInfoFormRef.resetFields()
                return this.$message.success('用户注册成功')
              } else {
                this.loading = false
                return this.$message.error('用户注册失败: ' + result.data.data)
              }
            })
            // await this.$axios.post('user/saveOrUpdate', this.user).then(async result => {
            //   if (result.data.code !== 200) {
            //     this.loading = false
            //     return this.$message.error('用户注册失败: ' + result.data.data)
            //   }
            //   this.userInfo.id = result.data.data
            // await this.$axios.post('userinfo/completeUserInfo', this.userInfo).then(async result => {
            //   if (result.data.code !== 200) {
            //     this.loading = false
            //     return this.$message.error('用户注册失败: ' + result.data.data)
            //   }
            //   await this.$axios.post('userrole/addUserRole', {'uid': this.userInfo.id, 'destRole': this.userInfo.role}).then(async result => {
            //     if (result.data.code === 200) {
            //       this.loading = false
            //       this.$refs.addUserFormRef.resetFields()
            //       this.$refs.addUserInfoFormRef.resetFields()
            //       return this.$message.success('用户注册成功')
            //     } else {
            //       this.loading = false
            //       return this.$message.error('用户注册失败: ' + result.data.data)
            //     }
            //   })
            // }).catch(error => {
            //   this.loading = false
            //   return this.$message.error('用户信息完善失败: ' + error)
            // })
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            this.loading = false
            return this.$message.error('用户注册失败: ' + error)
          })
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
