<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      搜索与添加-->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="getOrgList">
            <el-button slot="append" icon="el-icon-search" @click="getOrgByName"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
<!--      表单-->
      <el-table :data="tableData" style="width: 100%" max-height="520" stripe border>
        <el-table-column fixed prop="date" label="注册日期" sortable width="140">
        </el-table-column>
        <el-table-column prop="name" label="机构名称" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="120">
        </el-table-column>
        <el-table-column prop="postcode" label="邮编" width="120">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="120">
        </el-table-column>
        <el-table-column prop="mail" label="机构邮箱" width="120">
        </el-table-column>
        <el-table-column prop="officer" label="法人代表" width="120">
        </el-table-column>
<!--        <el-table-column prop="relation" label="隶属关系" width="120">-->
<!--          <template slot-scope="scope">-->
<!--            {{ relationObj[scope.row.relation] }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="supervising" label="上级机构" width="120">
        </el-table-column>
        <el-table-column prop="flag" label="状态" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.flag == 1">
              <el-tooltip class="item" effect="dark" content="该机构已启用, 点击停用" placement="top" :enterable="false">
                <el-button type="warning" round size="mini" @click="changeState(scope.row)">停用</el-button>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.flag == 0">
              <el-tooltip class="item" effect="dark" content="该机构已停用, 点击启用" placement="top" :enterable="false">
                <el-button type="success" round size="mini" @click="changeState(scope.row)">启用</el-button>
              </el-tooltip>
            </div>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="125px">
          <template slot-scope="scope">
            <el-button @click="handleClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="handleClickView(scope.row)" type="success" icon="el-icon-view" size="mini"></el-button>
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrganizationList',
  data () {
    return {
      query: '',
      page: {
        current: 1,
        size: 5
      },
      total: 0,
      tableData: [],
      classifyObj: {
        1: '非营利性医疗机构',
        2: '盈利性医疗机构',
        3: '其他医疗机构'
      },
      typeObj: {
        1: '省卫生厅',
        2: '市卫生局',
        3: '区卫生局',
        4: '卫生社会团体',
        5: '其他卫生机构',
        6: '健康教育所(站、中心)',
        7: '医学教育机构',
        8: '医学科学研究机构',
        9: '卫生监督检验(监测、检测)所(站)',
        10: '卫生监督所(局)',
        11: '疾病防控制中心(防疫站)',
        12: '专科疾病防治院(所、站)',
        13: '医院',
        14: '采供血机构',
        15: '急救中心(站)',
        16: '妇幼保健院(所、站)',
        17: '门诊部、诊所、医务室、村卫生室',
        18: '卫生院',
        19: '社区卫生服务中心(站)'
      },
      hostObj: {
        1: '卫生行政部门',
        2: '其他行政部门',
        3: '企业',
        4: '事业单位',
        5: '社会团体',
        6: '其他社会组织'
      },
      relationObj: {
        1: '中央属',
        2: '省,自治区直辖市属',
        3: '省辖市(地区,州,盟)',
        4: '县级市(省辖市区)属',
        5: '县(旗)属',
        6: '镇属',
        7: '乡属',
        8: '街道属'
      }
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    getOrgByName () {
      this.$axios.post('organization/getOrgByName', {'name': this.query}).then(result => {
        if (result.data.code === 200) {
          // eslint-disable-next-line no-return-assign
          return this.tableData = result.data.data
        } else {
          return this.$message.error('获取数据失败')
        }
      },
        // eslint-disable-next-line handle-callback-err
      error => {
        return this.$message.error('获取数据失败')
      }
      )
    },
    getOrgList () {
      this.$axios.post('organization/getOrgList', this.page).then(result => {
        if (result.data.code === 200) {
          this.current = result.data.data.current
          this.size = result.data.data.size
          this.total = result.data.data.total
          // eslint-disable-next-line no-return-assign
          return this.tableData = result.data.data.records
        } else {
          return this.$message.error('获取数据失败')
        }
      },
        // eslint-disable-next-line handle-callback-err
      error => {
        return this.$message.error('获取数据失败')
      }
      )
    },
    changeState (row) {
      let msg = ''
      if (row.flag === 1) msg = '此操作将停用该机构, 是否继续?'
      else if (row.flag === 0) msg = '此操作将启用该机构, 是否继续?'
      this.$confirm(msg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
        .then(async () => {
          if (row.flag === 1) row.flag = 0
          else if (row.flag === 0) row.flag = 1
          await this.$axios.post('organization/cancelOrg', {'name': row.name, 'flag': row.flag}).then(result => {
            return this.$message({ type: 'success', message: '更新机构状态成功!' })
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            return this.$message({ type: 'error', message: '更新机构状态失败!' })
          })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消操作' })
        })
    },
    handleClickEdit (row) {
      console.log(row)
    },
    handleClickView (row) {
      console.log(row)
    },
    handleSizeChange (newSize) {
      this.page.size = newSize
      this.getData()
    },
    handleCurrentChange (newPage) {
      this.page.current = newPage
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
