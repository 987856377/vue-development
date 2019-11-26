<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt=""/>
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" label-width="0px" :model="user" :rules="rules" class="form-login">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="user.username" prefix-icon="el-icon-view"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="user.password" type="password" prefix-icon="el-icon-d-arrow-right"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click='login' v-loading.fullscreen.lock="loading">登录</el-button>
          <el-button type="info" @click='reset'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

      user: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.loading = true
        await this.$axios.post('login', this.$qs.stringify(this.user)).then(result => {
          if (result.data.code === 409) {
            this.loading = false
            return this.$message.error('登录失败')
          }
          window.sessionStorage.setItem('Authorization', result.headers.authorization)
          this.$router.push('/')
          this.loading = false
          return this.$message.success('登录成功')
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.loading = false
          return this.$message.error('登录失败')
        })
      })
    },
    reset () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
  .login_container {
    background-color: #2C3E50;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: lightsteelblue;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #2C3E50;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px aliceblue;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #F0F8FF;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: floralwhite;
  }

  .form-login {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
