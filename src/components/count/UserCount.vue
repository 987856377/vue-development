<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>人员统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrganizationCount',
  data () {
    return {
    }
  },
  mounted () {
    this.getUserCount()
  },
  methods: {
    async getUserCount () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('main'))
      myChart.showLoading()
      await this.$axios.post('userinfo/countUser').then(result => {
        myChart.hideLoading()
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data: ['男', '女', '总']
          },
          xAxis: [
            {
              type: 'category',
              data: result.data.data.orgNameList,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '人数',
              min: 0,
              max: 25,
              interval: 5,
              axisLabel: {
                formatter: '{value} 人'
              }
            }
          ],
          series: [
            {
              name: '男',
              type: 'bar',
              data: result.data.data.orgManList
            },
            {
              name: '女',
              type: 'bar',
              data: result.data.data.orgWomanList
            },
            {
              name: '总',
              type: 'line',
              data: result.data.data.orgTotalList
            }
          ]
        })
      })
    }
  }
}
</script>

<style>

</style>
