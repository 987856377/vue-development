<template>
  <el-card class="box-card" shadow="never" style="height: 620px;">
    <div slot="header" class="clearfix" style="height:15px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限控制</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-select v-model="roleData" @change="handleSelected(roleData)">
      <el-option v-for="item in roleList" :key="item.code" :value="item.code" :label="item.title"></el-option>
    </el-select>
    <div style="margin-top:20px" >
      <tree-transfer
        :from_data='fromData' :to_data='toData'
        :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :mode='mode' height='360px' high-light filter openAll
        :title = "['待选菜单', '已选菜单']"
        :button_text = "['添加', '移除']"
        style = "text-align: left"
      ></tree-transfer>

      <el-button type="success" style="margin-top:40px;"  @click="handleClickSave()">保存</el-button>
      <el-button type="warning" style="margin-left:200px; margin-top:40px;" @click="handleClickReset">重置</el-button>
    </div>
  </el-card>
</template>
<script>
import treeTransfer from 'el-tree-transfer' // 引入
export default {
  components: { treeTransfer }, // 注册
  data () {
    return {
      roleData: '',
      request: {
        rid: '',
        midList: []
      },
      roleList: [],
      toData: [],
      fromData: [],
      beforeData: [],
      afterData: [],
      addData: [],
      delData: [],
      mode: 'transfer',
      data: [],
      value: []
    }
  },
  created () {
    this.getRoleListAvalible()
  },
  methods: {
    async getRoleListAvalible () {
      // 获取所有角色: flag传空值, 获取所有角色, 不传flag, 获取默认获取所有已启用的角色(后端代码flag 默认为1)
      await this.$axios.post('userrole/getRoleListAvalible', {
        'uid': window.sessionStorage.getItem('id'),
        'flag': ''
      }).then(result => {
        if (result.data.code === 200) {
          this.roleList = result.data.data
        } else {
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户可操作角色数据失败: ' + error)
      })
    },
    async getToData () {
      await this.$axios.post('permission/role-module/getModulesByRoles', {
        'own': 1,
        'userRoles': new Array(this.roleData)
      }).then(result => {
        if (result.data.code === 200) {
          this.toData = result.data.data
          this.afterData = result.data.data
        } else {
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取角色已选菜单失败: ' + error)
      })
    },
    async getFromData () {
      await this.$axios.post('permission/role-module/getModulesByRoles', {
        'own': 0,
        'userRoles': new Array(this.roleData)
      }).then(result => {
        if (result.data.code === 200) {
          this.fromData = result.data.data
          this.beforeData = result.data.data
        } else {
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取角色待选菜单失败: ' + error)
      })
    },
    handleSelected (roleData) {
      this.addData = []
      this.delData = []
      this.getToData()
      this.getFromData()
      this.roleList.forEach(item => {
        if (item.code === roleData) {
          this.request.rid = item.id
        }
      })
    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode () {
      if (this.mode === 'transfer') {
        this.mode = 'addressList'
      } else {
        this.mode = 'transfer'
      }
    },
    // 监听穿梭框组件添加
    add (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log('fromData:', fromData)
      // console.log('toData:', toData)
      // console.log('obj:', obj)
      obj.keys.forEach(item => {
        this.addData.push(item)
      })
      obj.harfKeys.forEach(item => {
        this.addData.push(item)
      })
    },
    // 监听穿梭框组件移除
    remove (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log('fromData:', fromData)
      // console.log('toData:', toData)
      // console.log('obj:', obj)
      obj.keys.forEach(item => {
        this.delData.push(item)
      })
      obj.harfKeys.forEach(item => {
        this.delData.push(item)
      })
    },
    async handleClickSave () {
      let addTemp = this.addData
      let delTemp = this.delData
      // js中删除两个数组中相同的id
      this.delData = this.delData.filter(item => {
        return !addTemp.includes(item)
      })
      this.addData = this.addData.filter(item => {
        return !delTemp.includes(item)
      })
      if (this.addData.length === 0 && this.delData.length === 0) {
        return
      }
      if (this.addData.length !== 0) {
        this.request.midList = this.addData
        await this.$axios.post('permission/role-module/addModulesByRole',
          {'rid': this.request.rid, 'midList': this.request.midList}
        ).then(result => {
          if (result.data.code === 200) {
            this.addData = []
            return this.$message.success('添加待选角色菜单成功')
          } else {
            return this.$message.error('添加待选角色菜单失败: ' + result.data.message)
          }
        })
      }
      if (this.delData.length !== 0) {
        this.request.midList = this.delData
        await this.$axios.post('permission/role-module/delModulesByRole',
          {'rid': this.request.rid, 'midList': this.request.midList}
        ).then(result => {
          if (result.data.code === 200) {
            this.delData = []
            return this.$message.success('删除已选角色菜单成功')
          } else {
            return this.$message.error('删除已选角色菜单失败: ' + result.data.message)
          }
        })
      }
    },
    handleClickReset () {
      this.handleSelected(this.roleData)
    }
  }
}
</script>
<style>
  /* 设置穿梭框的 宽高 */
  .el-transfer-panel{
    width : 350px;
    height: 400px;
  }
  .el-transfer-panel__list {
    margin: 0;
    padding: 6px 0;
    list-style: none;
    height: 390px;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-transfer__buttons {
    display: inline-block;
    vertical-align: middle;
    padding: 0 30px;
  }
</style>
