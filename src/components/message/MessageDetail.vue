<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息详情</el-breadcrumb-item>
      <el-button @click="handleClickBack" icon="el-icon-arrow-left" size="mini" float="right"
                 style="position: absolute; float: right; margin-top: -10px; margin-left: 400px">返回</el-button>
    </el-breadcrumb>

    <!--    卡片视图-->
    <el-card>
      <!--      全选,取消,删除-->
      <el-row>
        <el-col :span="2">
          <el-button @click="toggleSelection()" type="success" >回复</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="toggleSelection()" type="danger" >删除</el-button>
        </el-col>
      </el-row>
      <!--      表单-->
      <el-card>
        标题
      </el-card>
      <el-card>
        内容
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      request: {
        page: {
          current: 1,
          size: 5
        },
        sender: '',
        receiver: '',
        sendFlag: ''
      },
      row: this.$router.row
    }
  },
  created () {
    console.log(this.row)
  },
  methods: {
    handleClickBack () {
      this.$router.push('/inBox')
    }
  }
}
</script>

<style scoped>

</style>
