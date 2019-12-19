<template>
  <el-card class="box-card" shadow="never" style="height: 620px;">
    <div slot="header" class="clearfix" style="height:15px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限控制</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-select v-model="roleData" @change="handleSelected">
      <el-option v-for="item in roleList" :key="item.code" :value="item.code" :label="item.title"></el-option>
    </el-select>
    <div style="margin-top:20px; margin-left: 18%" >
      <el-transfer
        v-model="value"
        :data="data"
        :value="value"
        :titles="['待选菜单', '已选菜单']"
        :button-texts="['移除', '添加']"
        style="text-align: left"
      ></el-transfer>

      <el-button type="success" style="margin-left:-20%;margin-top:40px;"  @click="handleClickSave()">保存</el-button>
      <el-button type="warning" style="margin-left:200px; margin-top:40px;" @click="handleClickReset">重置</el-button>
    </div>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      roleData: '',
      roleList: [],
      ownedModule: [],
      unOwnedModule: [],
      loading: false,
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
    async getOwnedModule () {
      await this.$axios.post('permission/role-module/getModulesByRoles', {
        'own': 1,
        'userRoles': new Array(this.roleData)
      }).then(result => {
        if (result.data.code === 200) {
          this.ownedModule = result.data.data
          for (let i = 0; i <= this.ownedModule.length; i++) {
            for (let j = 0; j <= this.ownedModule[i].subModule.length; i++) {
              this.value.push({
                key: this.ownedModule[i].subModule[j].id,
                label: `${this.ownedModule[i].subModule[j].title}`
              })
            }
          }
        } else {
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户已拥有的菜单失败: ' + error)
      })
    },
    async getUnOwnedModule () {
      await this.$axios.post('permission/role-module/getModulesByRoles', {
        'own': 0,
        'userRoles': new Array(this.roleData)
      }).then(result => {
        if (result.data.code === 200) {
          this.unOwnedModule = result.data.data
          for (let i = 0; i <= this.unOwnedModule.length; i++) {
            for (let j = 0; j <= this.unOwnedModule[i].subModule.length; i++) {
              this.data.push({
                key: this.unOwnedModule[i].subModule[j].id,
                label: `${this.unOwnedModule[i].subModule[j].title}`
              })
            }
          }
        } else {
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户未拥有的菜单失败: ' + error)
      })
    },
    handleSelected () {
      this.data = []
      this.value = []
      this.getOwnedModule()
      this.getUnOwnedModule()
    },
    handleClickSave () {
      console.log()
    },
    handleClickReset: function () {
      this.rolePool = []
      this.handleSelectedValue = []
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
