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
          <el-table-column prop="readFlag" icon="el-icon-message" width="80" align="center" >
            <template slot-scope="scope">
              <i class="el-icon-message">
                <div v-if="scope.row.readFlag === 1" style="text-align: center"></div>
                <div v-else-if="scope.row.readFlag === 0" style="color: red; text-align: center">未读</div>
              </i>
            </template>
          </el-table-column>
          <el-table-column prop="subject" label="主题" width="120" align="center">
          </el-table-column>
          <el-table-column prop="content" label="详细" align="center">
          </el-table-column>
          <el-table-column prop="sendTime" label="发送时间" sortable width="140" align="right">
          </el-table-column>
        <el-table-column prop="flag" fixed="right" label="操作" width="125px" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClickReply(scope.row)" type="primary" icon="el-icon-time" size="mini">回复</el-button>
          </template>
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
<!--      回复对话框-->
      <el-dialog :visible.sync="replyTableVisible" @close="handleCloseReplyDialog" v-loading.lock="waiting">
        <el-form ref="messageFormRef" :model="message" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="主题" prop="subject">
            <el-input v-model="message.subject" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="message.content" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 400px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="handleCloseReplyDialog">取 消</el-button>
          <el-button type="primary" @click="handleClickReplyMessage">确 定</el-button>
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
        id: '',
        sender: '',
        receiver: '',
        sendFlag: '',
        readFlag: ''
      },
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
      loading: false,
      waiting: false,
      total: 0,
      messageTableVisible: false,
      replyTableVisible: false,
      messageData: Object,
      multipleSelection: [],
      ids: [],
      tableData: [],
      rules: {
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
  created () {
    this.getMessageList()
  },
  methods: {
    async getMessageList () {
      this.loading = true
      this.request.receiver = window.sessionStorage.getItem('id')
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
          console.log(row)
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
    },
    handleClickReply (row) {
      this.replyTableVisible = true
      this.message.sender = window.sessionStorage.getItem('id')
      this.message.senderName = window.sessionStorage.getItem('name')
      this.message.sendOrgName = window.sessionStorage.getItem('orgName')
      this.message.sendOrgCode = window.sessionStorage.getItem('orgCode')
      this.message.receiver = row.sender
      this.message.receiverName = row.senderName
      this.message.acceptOrgCode = row.sendOrgCode
      this.message.acceptOrgName = row.sendOrgName
    },
    handleClickReplyMessage () {
      this.$refs.messageFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.waiting = true
        await this.$axios.post('message/saveOrUpdate', this.message).then(result => {
          if (result.data.code === 200) {
            this.waiting = false
            this.replyTableVisible = false
            this.$refs.messageFormRef.resetFields()
            return this.$notify({ type: 'success', message: '发送成功' })
          } else {
            this.waiting = false
            return this.$notify({type: 'error', message: '申请发送失败: ' + result.data.message})
          }
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          this.waiting = false
          return this.$notify({type: 'error', message: '申请发送失败: ' + error})
        })
      })
    },
    handleCloseReplyDialog () {
      this.replyTableVisible = false
      this.$refs.messageFormRef.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
