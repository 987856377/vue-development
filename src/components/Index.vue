<template>
  <el-container class='home-container'>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt=""/>
      </div>
      Electronic Prescription Platform
      <h5 style="float: right">欢迎您, {{ user }}</h5>
      <el-button type="info" @click="logout" style="float: right">退出</el-button>
    </el-header>
    <el-container style="height: 100%;">
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu class="el-menu-vertical-demo" :router="true" unique-opened :collapse="isCollapse"
                 :collapse-transition="false" :default-active="$route.path">
          <el-menu-item index="/home">首页</el-menu-item>
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in roleModule" :key="item.id">
          <!--一级菜单模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.title}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.url" v-for="subItem in item.subModule" :key="subItem.id">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-d-arrow-right"></i>
                <!--文本-->
                <span>{{subItem.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Home from '@/components/Home'

export default {
  name: 'index',
  components: {
    Home
  },
  data () {
    return {
      roleList: [],
      roleModule: [],
      iconsObj: {
        '1': 'el-icon-menu',
        '2': 'el-icon-location',
        '3': 'el-icon-service',
        '4': 'el-icon-tickets',
        '5': 'el-icon-refresh',
        '6': 'el-icon-date',
        '7': 'el-icon-time',
        '8': 'el-icon-setting'
      },
      isCollapse: false,
      user: window.sessionStorage.getItem('name')
    }
  },
  created () {
    this.getUserRoleList()
  },
  methods: {
    async getUserRoleList () {
      this.waiting = true
      await this.$axios.post('userrole/getRoleList', {'uid': window.sessionStorage.getItem('id')}).then(result => {
        if (result.data.code === 200) {
          result.data.data.forEach(item => {
            this.roleList.push(item.code)
          })
          this.getRoleModule()
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户角色数据失败: ' + error)
      })
    },
    async getRoleModule () {
      await this.$axios.post('permission/role-module/getModulesByRoles', {
        'userRoles': this.roleList
      }).then(result => {
        if (result.data.code === 200) {
          this.roleModule = result.data.data
        } else {
          return this.$message.error('获取数据失败: ' + result.data.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        return this.$message.error('获取用户可操作角色数据失败: ' + error)
      })
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style>
  .home-container {
    height: 100%;
    background-color: ghostwhite;
  }

  .el-header {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
  }

  .el-aside {
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-menu {
    border-right: none;
  }

  .el-main {
    background-color: ghostwhite;
    color: #333;
    text-align: center;
  }

  body > .el-container {
    height: 100%;
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .toggle-button {
    background-color: #F0F8FF;
    font-size: 10px;
    line-height: 24px;
    color: black;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
