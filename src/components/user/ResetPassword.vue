<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人设置</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>修改密码</h2>
      <!-- 添加用户表单区域 -->
      <el-form ref="resetFormRef" :model="user" :rules="rules" :inline="true" label-width="90px" size="mini">
        <el-card>
          <el-row :gutter="20">
            <el-col>
              <el-form-item label="请输入密码" prop="password" label-width="200px">
                <el-input v-model="user.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="请再次输入密码" prop="check" label-width="200px">
                <el-input v-model="user.check"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-form-item style="margin-top: 15px">
          <el-button type="primary" @click='handleClickReset' v-loading.fullscreen.lock="loading">修改</el-button>
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
        password: '',
        check: ''
      },
      loading: false,
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        check: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleClickReset () {
      this.$refs.resetFormRef.validate(async valid1 => {
        if (!valid1) {
          return
        }
        if (this.user.password !== this.user.check) {
          return this.$message.error('两次输入的密码不一致, 请确认输入')
        }
        this.loading = true
        await this.$axios.post('user/resetPassword', { 'id': window.sessionStorage.getItem('id'), 'password': this.user.password }).then(result => {
          if (result.data.code === 200) {
            this.loading = false
            window.sessionStorage.clear()
            this.$router.push('/login')
            return this.$message.success('密码重置成功')
          } else {
            this.loading = false
            return this.$message.error('密码重置失败')
          }
        }).catch(error => {
          this.loading = false
          return this.$message.error('密码重置失败: ' + error)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
