<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>处方流转</el-breadcrumb-item>
      <el-breadcrumb-item>处方录入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>处方录入</h2>
      <!-- 添加处方信息表单区域 -->
      <el-form ref="addPrescriptionFormRef" :model="prescriptionInfo" :rules="rules" :inline="true" label-width="90px" size="mini">
        <el-card>
          <el-form-item label="处方类型" prop="type">
            <el-select v-model="prescriptionInfo.type" style="width: 185px">
              <el-option label="普通" value="1" key='1'></el-option>
              <el-option label="特殊" value="2" key="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属科室" prop="department">
            <el-input v-model="prescriptionInfo.department"></el-input>
          </el-form-item>
          <el-form-item label="建议价格" prop="price">
            <el-input v-model="prescriptionInfo.price"></el-input>
          </el-form-item>
        </el-card>
        <el-card>
          <el-form-item label="开方医生" prop="doctorName">
            <el-input v-model="prescriptionInfo.doctorName"></el-input>
          </el-form-item>
          <el-form-item label="开方手机" prop="doctorPhone">
            <el-input v-model="prescriptionInfo.doctorPhone"></el-input>
          </el-form-item>
          <el-form-item label="审核医生" prop="checkDoctor">
            <el-input v-model="prescriptionInfo.checkDoctor"></el-input>
          </el-form-item>
          <el-form-item label="审核手机" prop="checkPhone">
            <el-input v-model="prescriptionInfo.checkPhone"></el-input>
          </el-form-item>
          <el-form-item label="适用性别" prop="sex">
            <el-input v-model="prescriptionInfo.sex"></el-input>
          </el-form-item>
          <el-form-item label="适用年龄" prop="age">
            <el-input v-model="prescriptionInfo.age"></el-input>
          </el-form-item>
          <el-form-item label="开方日期" prop="date">
            <el-date-picker v-model="prescriptionInfo.date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开方日期" style="width: 185px" >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="适用症" prop="symptom">
            <el-input v-model="prescriptionInfo.symptom" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="建议用药" prop="medicine">
            <el-input v-model="prescriptionInfo.medicine" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="医嘱" prop="advice">
            <el-input v-model="prescriptionInfo.advice" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 400px"></el-input>
          </el-form-item>
        </el-card>
        <el-form-item style="margin-top: 15px">
          <el-button type="primary" @click='handleClickSave' v-loading.fullscreen.lock="loading">录入</el-button>
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
      prescriptionInfo: {
        orgcode: '',
        orgname: '',
        uid: '',
        uname: '',
        type: '',
        doctorName: '',
        doctorPhone: '',
        department: '',
        checkDoctor: '',
        checkPhone: '',
        symptom: '',
        sex: '',
        age: '',
        date: '',
        medicine: '',
        advice: '',
        price: ''
      },
      loading: false,
      rules: {
        type: [
          { required: true, message: '请输入处方类型', trigger: 'blur' }
        ],
        doctorName: [
          { required: true, message: '请输入开方医生', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        doctorPhone: [
          { required: true, message: '请输入开方医生手机', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入归属科室', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        checkDoctor: [
          { required: true, message: '请输入审核医生', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        checkPhone: [
          { required: true, message: '请输入审核医生手机', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        symptom: [
          { required: true, message: '请输入适用症', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入适用性别', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入适用年龄', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请输入开方日期', trigger: 'blur' }
        ],
        medicine: [
          { required: true, message: '请输入建议用药', trigger: 'blur' },
          { min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur' }
        ],
        advice: [
          { required: true, message: '请输入医嘱', trigger: 'blur' },
          { min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入建议价格', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.prescriptionInfo.orgcode = window.sessionStorage.getItem('orgCode')
    this.prescriptionInfo.orgname = window.sessionStorage.getItem('orgName')
    this.prescriptionInfo.uid = window.sessionStorage.getItem('id')
    this.prescriptionInfo.uname = window.sessionStorage.getItem('name')
  },
  methods: {
    handleClickSave () {
      this.$refs.addPrescriptionFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!reg.test(this.prescriptionInfo.doctorPhone) || !reg.test(this.prescriptionInfo.checkPhone)) {
          return this.$notify({ type: 'error', message: '手机号格式错误' })
        } else if (this.prescriptionInfo.doctorPhone === this.prescriptionInfo.checkPhone) {
          return this.$notify({ type: 'error', message: '开方医生手机号不应和审核医生手机号相同' })
        }
        this.loading = true
        await this.$axios.post('prescription/detail/saveOrUpdate', this.prescriptionInfo).then(result => {
          if (result.data.code === 200) {
            this.loading = false
            this.$refs.addPrescriptionFormRef.resetFields()
            return this.$notify({ type: 'success', message: '处方录入成功' })
          } else {
            this.loading = false
            return this.$notify({ type: 'error', message: '服务器内部错误, 处方录入失败' })
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.loading = false
          return this.$notify({ type: 'error', message: '服务器内部错误, 处方录入失败' })
        })
      })
    },
    handleClickReset () {
      this.$refs.addPrescriptionFormRef.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
