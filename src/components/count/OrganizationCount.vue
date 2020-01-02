<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>机构统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="font-size: 13px">
      <el-row>
        隶属关系:
        <el-select v-model="request.relation" size="mini" placeholder="隶属关系" style="margin-right: 15px">
          <el-option v-for="item in relationObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
        </el-select>
        机构类型:
        <el-select v-model="request.type" size="mini" placeholder="机构类型" style="margin-right: 15px">
          <el-option v-for="item in typeObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
        </el-select>
        主办单位:
        <el-select v-model="request.classify" size="mini" placeholder="主办单位" style="margin-right: 15px">
          <el-option v-for="item in classifyObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
        </el-select>
        机构分类:
        <el-select v-model="request.host" size="mini" placeholder="机构分类" style="margin-right: 15px">
          <el-option v-for="item in hostObj" :label="item.key" :key="item.value" :value="item.value"></el-option>
        </el-select>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-date-picker size="mini" type="date" value-format="yyyy-MM-dd" v-model="request.begin" placeholder="开始日期"></el-date-picker>
        ===>
        <el-date-picker size="mini" type="date" value-format="yyyy-MM-dd" v-model="request.end" placeholder="截至日期"></el-date-picker>
        <el-radio v-model="request.radio" label="1" style="margin-left: 195px">已启用</el-radio>
        <el-radio v-model="request.radio" label="0">未启用</el-radio>
        <el-button type="success" size="mini" @click="handleClickCount" style="margin-left: 65px">统计</el-button>
      </el-row>
    </el-card>
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrganizationCount',
  data () {
    return {
      request: {
        classify: '',
        type: '',
        host: '',
        relation: '',
        radio: '1',
        begin: '',
        end: ''
      },
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
      ]
    }
  },
  methods: {
    async handleClickCount () {
      console.log(this.request)
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('main'))

      myChart.showLoading()
      await this.$axios.post('organization/countOrganization', this.request).then(result => {
        myChart.hideLoading()
        myChart.setOption({
          title: {
            text: '机构概况',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '详情',
              type: 'pie',
              radius: '65%',
              data: result.data.data,
              roseType: 'angle',
              selectedMode: 'single',
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        )
      })
    }
  }
}
</script>

<style>

</style>
