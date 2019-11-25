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
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
<!--      表单-->
      <el-table :data="tableData" style="width: 100%" max-height="520" stripe border>
        <el-table-column fixed prop="date" label="注册日期" sortable width="150">
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
        <el-table-column prop="relation" label="隶属关系" width="120">
        </el-table-column>
        <el-table-column prop="supervising" label="上级机构" width="120">
        </el-table-column>
        <el-table-column prop="flag" label="启用状态" width="120">
          <template slot-scope="scope">
            <el-switch  @change="stateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="125px">
          <template slot-scope="scope">
            <el-button @click="handleClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="handleClickDelete(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
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
      page: {
        current: 1,
        size: 5
      },
      tableData: [],
      total: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$axios.post('organization/getOrgList', this.page).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.current = res.data.data.current
          this.size = res.data.data.size
          this.total = res.data.data.total
          // eslint-disable-next-line no-return-assign
          return this.tableData = res.data.data.records
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
    async stateChanged (row) {
      console.log(row.flag)
      await this.$axios.post('organization/cancelOrg', {'name': row.name, flag: row.flag}).then(result => {
        return this.$message.success('更新机构状态成功')
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('更新机构状态失败')
      })
    },
    handleClickEdit (row) {
      console.log(row)
    },
    handleClickDelete (row) {
      console.log(row)
    },
    handleSizeChange (newSize) {
      this.page.size = newSize
      this.getData()
    },
    handleCurrentChange (newPage) {
      this.page.page = newPage
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
