<template>
  <div>
    <h1>{{msg}}</h1>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="date" label="日期" sortable width="150">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="120">
      </el-table-column>
      <el-table-column prop="province" label="省份" width="120">
      </el-table-column>
      <el-table-column prop="city" label="市区" width="120">
      </el-table-column>
      <el-table-column prop="address" label="地址" width="300">
      </el-table-column>
      <el-table-column prop="zip" label="邮编" width="120">
      </el-table-column>
      <el-table-column prop="phone" label="手机" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        page: {
          current: 1,
          size: 5
        },
        msg: '首页',
        tableData: [],
        multipleSelection: []
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      handleClick(row) {
        console.log(row)
      },
      getData(){
        this.$axios.post('userinfo/getUserInfoByPage',this.page).then(res => {
            console.log(res)
            if(res.data.code == '200'){
              this.tableData=res.data.data.records
            }
          },
          error => {
            console.log(error)
          }
        )
      },
    }
  }
</script>

<style>

</style>
