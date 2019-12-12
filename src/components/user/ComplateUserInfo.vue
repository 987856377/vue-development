<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人设置</el-breadcrumb-item>
      <el-breadcrumb-item>完善信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>完善信息</h2>
      <!-- 添加用户表单区域 -->
      <el-form ref="usrFormRef" :model="usrData" :rules="rules" :inline="true" label-width="90px" size="mini">
        <el-card>
          <el-row :gutter="20">
            <el-col>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="usrData.name"></el-input>
              </el-form-item>
              <el-form-item label="性别"  prop="sex">
                <el-select v-model="usrData.sex">
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
            </el-col>
            <el-col>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="usrData.phone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="mail">
                <el-input v-model="usrData.mail"></el-input>
              </el-form-item>
              <el-form-item label="身份证" prop="identity">
                <el-input v-model="usrData.identity"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-form-item style="margin-top: 15px">
          <el-button type="primary" @click='handleClickComplate' v-loading.fullscreen.lock="loading">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      usrData: {
        id: '',
        name: '',
        nation: '',
        identity: '',
        sex: '',
        age: '',
        phone: '',
        mail: ''
      },
      loading: false,
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
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      this.loading = true
      await this.$axios.post('userinfo/getUserInfoById', { 'id': window.sessionStorage.getItem('id') }).then(result => {
        if (result.data.code === 200) {
          this.loading = false
          // eslint-disable-next-line no-return-assign
          return this.usrData = result.data.data
        } else {
          this.loading = false
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
      }).catch(error => {
        this.loading = false
        return this.$message.error('获取数据失败: ' + error)
      })
    },
    async handleClickComplate () {
      this.$refs.usrFormRef.validate(async valid1 => {
        if (!valid1) {
          return
        }
        this.loading = true
        this.usrData.id = window.sessionStorage.getItem('id')
        await this.$axios.post('userinfo/completeUserInfo', this.usrData).then(result => {
          if (result.data.code === 200) {
            this.loading = false
            return this.$message.success('更新成功')
          } else {
            this.loading = false
            return this.$message.error('更新失败: ' + result.data.message)
          }
        }).catch(error => {
          this.loading = false
          return this.$message.error('更新失败: ' + error)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
