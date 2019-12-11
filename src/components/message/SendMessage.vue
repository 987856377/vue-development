<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息</el-breadcrumb-item>
      <el-breadcrumb-item>处方申请</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>处方申请</h2>
      <!-- 添加处方信息表单区域 -->
      <el-form ref="addMessageFormRef" :model="message" :rules="rules" :inline="true" label-width="90px" size="mini">
        <el-card>
          <el-form-item label="目标机构" prop="acceptOrgName">
            <el-input v-model="message.acceptOrgName" @blur="getOrgCodeAndUsersByName()" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="目标机构人员" prop="receiverName" label-width="150px">
            <el-select v-model="message.receiverName" @change="setReceiver(message.receiverName)">
              <el-option v-for="item in this.receiverList" :label="item.name" :key="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-card>
        <el-card>
          <el-col>
            <el-form-item label="标题" prop="subject">
              <el-input v-model="message.subject" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 400px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="详情描述" prop="content">
              <el-input v-model="message.content" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" style="width: 600px"></el-input>
            </el-form-item>
          </el-col>
        </el-card>
        <el-form-item style="margin-top: 15px">
          <el-button type="primary" @click='handleClickSend' v-loading.fullscreen.lock="loading">发送</el-button>
          <el-button type="primary" @click='handleClickSave' v-loading.fullscreen.lock="loading">存至草稿箱</el-button>
          <el-button type="info" @click='handleClickReset'>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: {
        sender: '',
        senderName: '',
        sendOrgCode: '',
        sendOrgName: '',
        sendFlag: 1,
        receiver: '',
        receiverName: '',
        acceptOrgCode: '',
        acceptOrgName: '',
        subject: '',
        content: ''
      },
      receiverList: [],
      loading: false,
      rules: {
        acceptOrgName: [
          { required: true, message: '请输入目标机构', trigger: 'change' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        receiverName: [
          { required: true, message: '请输入目标机构人员', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入详情描述', trigger: 'blur' },
          { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.message.sender = window.sessionStorage.getItem('id')
    this.message.senderName = window.sessionStorage.getItem('name')
    this.message.sendOrgName = window.sessionStorage.getItem('orgName')
    this.message.sendOrgCode = window.sessionStorage.getItem('orgCode')
  },
  methods: {
    async getOrgCodeAndUsersByName () {
      if (this.message.acceptOrgName === '') {
        return
      }
      await this.$axios.post('organization/getOrgCodeAndUsersByName', { 'name': this.message.acceptOrgName }).then(result => {
        if (result.data.code === 200) {
          this.message.acceptOrgCode = result.data.data.code
          this.receiverList = result.data.data.targetUserList
        } else {
          return this.$notify({ type: 'error', message: '获取申请机构信息失败, 请确认输入的机构是有误!' })
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        return this.$notify({ type: 'error', message: '服务器内部错误' })
      })
    },
    setReceiver (name) {
      this.receiverList.forEach(item => {
        if (item.name === name) {
          this.message.receiver = item.id
        }
      })
    },
    handleClickSend () {
      this.$refs.addMessageFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.loading = true
        await this.$axios.post('message/saveOrUpdate', this.message).then(result => {
          if (result.data.code === 200) {
            this.loading = false
            this.$refs.addMessageFormRef.resetFields()
            return this.$notify({ type: 'success', message: '发送成功' })
          } else {
            this.loading = false
            return this.$notify({ type: 'error', message: '服务器内部错误, 申请发送失败' })
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.loading = false
          return this.$notify({ type: 'error', message: '服务器内部错误, 申请发送失败' })
        })
      })
    },
    handleClickSave () {
      this.$refs.addMessageFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.loading = true
        this.message.sendFlag = 0
        await this.$axios.post('message/saveOrUpdate', this.message).then(result => {
          if (result.data.code === 200) {
            this.loading = false
            this.$refs.addMessageFormRef.resetFields()
            return this.$notify({ type: 'success', message: '发送成功' })
          } else {
            this.loading = false
            return this.$notify({ type: 'error', message: '服务器内部错误, 申请发送失败' })
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.loading = false
          return this.$notify({ type: 'error', message: '服务器内部错误, 申请发送失败' })
        })
      })
    },
    handleClickReset () {
      this.$refs.addMessageFormRef.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
