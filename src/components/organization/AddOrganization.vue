<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构入驻</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>机构入驻</h2>
      <!-- 添加机构表单区域 -->
      <el-form ref="addOrgFormRef" :model="organization" :rules="rules" :inline="true" label-width="90px" size="mini">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="机构代码" prop="code">
                <el-input v-model="organization.code"></el-input>
              </el-form-item>
              <el-form-item label="机构名称" prop="name">
                <el-input v-model="organization.name"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="organization.phone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="mail">
                <el-input v-model="organization.mail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="机构类型" prop="type">
                <el-select v-model="organization.type">
                  <el-option v-for="item in typeObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主办单位" prop="host">
                <el-select v-model="organization.host">
                  <el-option v-for="item in hostObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="隶属关系" prop="relation">
                <el-select v-model="organization.relation">
                  <el-option v-for="item in relationObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机构分类" prop="classify">
                <el-select v-model="organization.classify">
                  <el-option v-for="item in classifyObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="邮政编码" prop="postcode">
                <el-input v-model="organization.postcode"></el-input>
              </el-form-item>
              <el-form-item label="负责人" prop="responser">
                <el-input v-model="organization.responser"></el-input>
              </el-form-item>
              <el-form-item label="法人" prop="officer">
                <el-input v-model="organization.officer"></el-input>
              </el-form-item>
              <el-form-item label="上级机构" prop="supervising">
                <el-input v-model="organization.supervising"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="机构网站" prop="web">
                <el-input v-model="organization.web">
                  <template slot="prepend">Http://</template>
                </el-input>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="organization.address" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 400px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="是否启用" prop="flag">
              <el-switch v-model="organization.flag" active-color="#13ce66" active-value="1" inactive-value="9"></el-switch>
            </el-form-item>
          </el-row>
        </el-card>
        <el-form-item style="margin-top: 15px">
          <el-button type="primary" @click='handleClickSave' v-loading.fullscreen.lock="loading">入驻</el-button>
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
      organization: {
        code: '',
        name: '',
        classify: '',
        type: '',
        host: '',
        relation: '',
        postcode: '',
        address: '',
        phone: '',
        mail: '',
        responser: '',
        officer: '',
        web: '',
        supervising: '',
        flag: 9
      },
      loading: false,
      classifyObj: [
        {
          key: '非营利性医疗机构',
          value: 1
        },
        {
          key: '盈利性医疗机构',
          value: 2
        },
        {
          key: '其他医疗机构',
          value: 3
        }
      ],
      typeObj: [
        {
          key: '省卫生厅',
          value: 1
        },
        {
          key: '市卫生局',
          value: 2
        },
        {
          key: '区卫生局',
          value: 3
        },
        {
          key: '卫生社会团体',
          value: 4
        },
        {
          key: '其他卫生机构',
          value: 5
        },
        {
          key: '健康教育所(站、中心)',
          value: 6
        },
        {
          key: '医学教育机构',
          value: 7
        },
        {
          key: '医学科学研究机构',
          value: 8
        },
        {
          key: '卫生监督检验(监测、检测)所(站)',
          value: 9
        },
        {
          key: '卫生监督所(局)',
          value: 10
        },
        {
          key: '疾病防控制中心(防疫站)',
          value: 11
        },
        {
          key: '专科疾病防治院(所、站)',
          value: 12
        },
        {
          key: '医院',
          value: 13
        },
        {
          key: '采供血机构',
          value: 14
        },
        {
          key: '急救中心(站)',
          value: 15
        },
        {
          key: '妇幼保健院(所、站)',
          value: 16
        },
        {
          key: '门诊部、诊所、医务室、村卫生室',
          value: 17
        },
        {
          key: '卫生院',
          value: 18
        },
        {
          key: '社区卫生服务中心(站)',
          value: 19
        }
      ],
      hostObj: [
        {
          key: '卫生行政部门',
          value: 1
        },
        {
          key: '其他行政部门',
          value: 2
        },
        {
          key: '企业',
          value: 3
        },
        {
          key: '事业单位',
          value: 4
        },
        {
          key: '社会团体',
          value: 5
        },
        {
          key: '其他社会组织',
          value: 6
        }
      ],
      relationObj: [
        {
          key: '中央属',
          value: 1
        },
        {
          key: '省,自治区直辖市属',
          value: 2
        },
        {
          key: '省辖市(地区,州,盟)',
          value: 3
        },
        {
          key: '县级市(省辖市区)属',
          value: 4
        },
        {
          key: '县(旗)属',
          value: 5
        },
        {
          key: '镇属',
          value: 6
        },
        {
          key: '乡属',
          value: 7
        },
        {
          key: '街道属',
          value: 8
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入机构代码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        classify: [
          { required: true, message: '请选择机构类别', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择机构类型', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '请选择机构单位类型', trigger: 'blur' }
        ],
        relation: [
          { required: true, message: '请选择机构隶属关系', trigger: 'blur' }
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
          { required: true, message: '请输入上级机构, 没有上级机构填写机构名称', trigger: 'blur' },
          { min: 6, max: 16, message: '长度为 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClickSave () {
      this.$refs.addOrgFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!reg.test(this.organization.phone)) {
          return this.$notify({ type: 'error', message: '手机号格式错误' })
        }
        this.loading = true
        await this.$axios.post('organization/saveOrUpdate', this.organization).then(result => {
          if (result.data.code !== 200) {
            this.loading = false
            return this.$message.error('机构入驻失败: ' + result.data.data)
          }
          this.loading = false
          this.$router.push('/orgList')
          return this.$message.success('机构入驻成功')
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.loading = false
          return this.$message.error('机构入驻失败: ' + error)
        })
      })
    },
    handleClickReset () {
      this.$refs.addOrgFormRef.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
