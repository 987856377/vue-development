<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息详情</el-breadcrumb-item>
      <el-breadcrumb-item>已发送</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      全选,取消,删除-->
      <el-row>
        <el-col :span="2">
          <el-button @click="handleClickDelete" type="danger" >删除</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="toggleSelection()">取消选择</el-button>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
      <!--      表单-->
      <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" max-height="520"
                stripe v-loading.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                @selection-change="handleSelectionChange" @row-dblclick="getMessageDetail">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="acceptOrgName" label="收件机构" width="120" align="center">
        </el-table-column>
        <el-table-column prop="receiverName" label="收件人" width="120" align="center">
        </el-table-column>
        <el-table-column prop="subject" label="主题" align="center">
        </el-table-column>
        <el-table-column prop="content" label="详细" align="center">
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" sortable width="140" align="right">
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="request.page.current"
        :page-sizes="[1, 5, 10]"
        :page-size="request.page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--      消息详情对话框-->
      <el-dialog :visible.sync="messageTableVisible">
        <div style="border-style: solid; border-width: 1px; height: 600px;">
          <div>
            <h4 style="position: absolute; margin-left: 25px; margin-top: 15px;">{{messageData.sendTime}}</h4>
            <h4 style="position: absolute; margin-left: 25px; margin-top: 35px;">{{messageData.sendOrgName}}, {{messageData.senderName}}</h4>
            <h2  style="position: absolute; margin-left: 50%; transform: translate(-50%, -50%); margin-top: 65px;">{{messageData.subject}}</h2>
          </div>
          <div style="height: 500px; width: 675px; margin-left: 20px; margin-top: 100px;">
            <div style="height: 450px; width: 625px; margin-left: 20px; margin-top: 15px; text-align: left">
              <h3>{{messageData.content}}</h3>
            </div>
          </div>
        </div>
      </el-dialog>
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
      loading: false,
      total: 0,
      messageTableVisible: false,
      messageData: Object,
      multipleSelection: [],
      ids: [],
      tableData: []
    }
  },
  created () {
    this.getMessageList()
  },
  methods: {
    async getMessageList () {
      this.loading = true
      this.request.sender = window.sessionStorage.getItem('id')
      this.request.sendFlag = 0
      await this.$axios.post('message/getMessageList', this.request).then(result => {
        if (result.data.code === 200) {
          this.current = result.data.data.current
          this.size = result.data.data.size
          this.total = result.data.data.total
          this.loading = false
          // eslint-disable-next-line no-return-assign
          return this.tableData = result.data.data.records
        } else {
          this.loading = false
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        return this.$message.error('获取数据失败: ' + error)
      })
    },
    handleSizeChange (newSize) {
      this.request.page.size = newSize
      this.getMessageList()
    },
    handleCurrentChange (newPage) {
      this.request.page.current = newPage
      this.getMessageList()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async handleClickDelete () {
      this.multipleSelection.forEach(item => {
        this.ids.push(item.id)
      })
      await this.$axios.post('message/delMessage', this.ids).then(result => {
        if (result.data.code === 200) {
          this.getMessageList()
          return this.$message.success('删除消息成功')
        } else {
          return this.$message.error('删除消息失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('删除消息失败: ' + error)
      })
    },
    async getMessageDetail (row) {
      this.messageTableVisible = true
      if (row.readFlag === 0) {
        this.request.id = row.id
        this.request.readFlag = 1
        await this.$axios.post('message/isRead', this.request).then(result => {
          if (result.data.code === 200) {
            row.readFlag = 1
          }
        })
      }
      this.messageData = row
    }
  }
}
</script>

<style scoped>

</style>
