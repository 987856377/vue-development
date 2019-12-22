<template>
  <el-container class='home-container'>
    <el-header>
      <h2 style="margin-left: 40%; text-align: center">Electronic Prescription Platform</h2>
      <el-dropdown trigger="click">
        <div style="width: 50px; height: 50px; float:left; border-radius: 50%; border: 3px solid; overflow: hidden;">
          <img src="../assets/NIL.png" style="width: 52px; height: 52px; align-self: center"/>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown" style="text-align: center">
          <router-link to="/complateUserInfo" style="text-decoration: none;">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item>更换头像</el-dropdown-item>
          <router-link to="/resetPassword" style="text-decoration: none;">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

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
              <span>{{item.label}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="children.url" v-for="children in item.children" :key="children.id">
              <template slot="title">
                <!--图标-->
<!--                <i class="el-icon-caret-right"></i>-->
                <!--文本-->
                <span>{{children.label}}</span>
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
