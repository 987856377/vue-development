<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt=""/>
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" label-width="0px" :model="user" :rules="rules" class="form-login" DefaultButton >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="user.username" prefix-icon="el-icon-view" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="user.password" type="password" prefix-icon="el-icon-d-arrow-right" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button id="btnLogin" type="primary" @click='login' v-loading.fullscreen.lock="loading">登录</el-button>
          <el-button type="info" @click='reset'>重置</el-button>
          <el-button type="warning" @click='forget'>忘记密码</el-button>
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
  created () {
    let _self = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key === 13 || key === 100) {
        _self.login('loginFormRef')
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
        await this.$axios.post('login', this.$qs.stringify(this.user)).then(async result => {
          if (result.data.code === 409) {
            this.loading = false
            return this.$message.error('登录失败: ' + result.data.message)
          }
          window.sessionStorage.setItem('Authorization', result.headers.authorization)
          window.sessionStorage.setItem('username', this.user.username)
          await this.$axios.post('userinfo/getUserAndOrgInfoByUsername', {'username': this.user.username}).then(async result1 => {
            if (result1.data.code === 200) {
              window.sessionStorage.setItem('id', result1.data.data.id)
              window.sessionStorage.setItem('name', result1.data.data.name)
              window.sessionStorage.setItem('orgCode', result1.data.data.orgcode)
              window.sessionStorage.setItem('orgName', result1.data.data.orgname)
              window.sessionStorage.setItem('orgFlag', result1.data.data.orgflag)
              window.sessionStorage.setItem('orgList', JSON.stringify(result1.data.data.subOrgList))
            } else {
              this.loading = false
              return this.$message.error('登录失败')
            }
          }).catch(error => {
            this.loading = false
            return this.$message.error('获取数据失败' + error.message)
          })
          // 代码优化, 将两次请求合并为一次请求
          // await this.$axios.post('userinfo/getUserInfoByUsername', {'username': this.user.username}).then(async result1 => {
          //   if (result1.data.code === 200) {
          //     window.sessionStorage.setItem('id', result1.data.data.id)
          //     window.sessionStorage.setItem('name', result1.data.data.name)
          //     await this.$axios.post('organization/getOrgInfoByUid', {'id': window.sessionStorage.getItem('id')}).then(result => {
          //       if (result.data.code === 200) {
          //         window.sessionStorage.setItem('orgCode', result.data.data.code)
          //         window.sessionStorage.setItem('orgName', result.data.data.name)
          //         window.sessionStorage.setItem('orgFlag', result.data.data.orgflag)
          //         window.sessionStorage.setItem('orgList', JSON.stringify(result.data.data.subOrgList))
          //       }
          //       // eslint-disable-next-line handle-callback-err
          //     }).catch(error => {
          //       this.loading = false
          //       return this.$message.error('获取数据失败' + error.message)
          //     })
          //   } else {
          //     this.loading = false
          //     return this.$message.error('登录失败')
          //   }
          // })
          await this.$router.push('/')
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
    },
    forget () {
      this.$router.push('/reset')
    }
  }
}
</script>

<style>
  #app {
    /* margin-top: 60px; */
    /*
    inear-gradient() 函数用于创建一个线性渐变的 "图像"。
    为了创建一个线性渐变，你需要设置一个起始点和一个方向（指定为一个角度）的渐变效果。你还要定义终止色。
    终止色就是你想让Gecko去平滑的过渡，并且你必须指定至少两种，当然也会可以指定更多的颜色去创建更复杂的渐变效果。
    */
    background-image: linear-gradient(120deg, #3498db, #8e44ad);
  }
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
