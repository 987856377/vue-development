<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt=""/>
      </div>
      <div class="reset-area">
        <div>
          <el-input v-model="mail.sendTo" placeholder="请输入您的邮箱"></el-input>
        </div>
        <el-button type="primary" style="margin-top: 30px" @click="handleClickSend" :loading="loading">确 定</el-button>
      </div>
    </div>
    <!--      编辑对话框-->
    <el-dialog title="输入密码" :visible.sync="dialogTableVisible" width="300px" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-input v-model="mail.verifyCode" style="margin-top: 10px" placeholder="请输入验证码"></el-input>
      <el-input v-model="mail.password" style="margin-top: 10px" placeholder="请输入密码"></el-input>
      <el-input v-model="temp" style="margin-top: 10px" placeholder="请再次输入密码"></el-input>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClickReset">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Reset',
  data () {
    return {
      dialogTableVisible: false,
      loading: false,
      temp: '',
      mail: {
        sendTo: '',
        verifyCode: '',
        password: ''
      }
    }
  },
  methods: {
    async handleClickSend () {
      if (this.mail.sendTo === '') {
        return
      }
      this.loading = true
      await this.$axios.post('sendVerificationCode', this.mail).then(result => {
        if (result.data.code === 200) {
          this.dialogTableVisible = true
          this.loading = false
        } else {
          this.loading = false
          return this.$message.error('验证码发送失败')
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        return this.$message.error('验证码发送失败: ' + error)
      })
    },
    handleClose () {
      this.dialogTableVisible = false
    },
    async handleClickReset () {
      if (this.mail.password === '' || this.mail.verifyCode === '' || this.mail.password !== this.temp) {
        return
      }
      await this.$axios.post('resetPassword', this.mail).then(result => {
        if (result.data.code === 200) {
          this.dialogTableVisible = false
          this.mail.sendTo = ''
          this.mail.verifyCode = ''
          this.mail.password = ''
          this.temp = ''
          this.$router.push('/login')
          return this.$message.success('密码重置成功')
        } else {
          this.mail.verifyCode = ''
          this.mail.password = ''
          this.temp = ''
          return this.$message.error('密码重置失败: ' + result.data.data)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.mail.verifyCode = ''
        this.mail.password = ''
        this.temp = ''
        return this.$message.error('密码重置失败: ' + error)
      })
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

  .form-login {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
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

  .reset-area {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 70%;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
