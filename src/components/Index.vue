<template>
  <el-container class='home-container'>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt=""/>
      </div>
      Electronic Prescription Platform
      <el-button type="info" @click="logout" style="float: right">退出</el-button>
    </el-header>
    <el-container style="height: 100%;">
      <el-aside width="200px">
        <el-menu class="el-menu-vertical-demo" :router="true" unique-opened>
          <el-menu-item index="/home">首页</el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">机构管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/addOrg">机构入驻</el-menu-item>
              <el-menu-item index="/orgList">机构列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-service"></i>
              <span slot="title">人员维护</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">添加用户</el-menu-item>
              <el-menu-item index="2-2">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span slot="title">权限控制</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">角色列表</el-menu-item>
              <el-menu-item index="3-2">权限列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-refresh"></i>
              <span slot="title">处方流转</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">处方列表</el-menu-item>
              <el-menu-item index="4-2">流转详情</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-date"></i>
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">机构统计</el-menu-item>
              <el-menu-item index="5-2">人员统计</el-menu-item>
              <el-menu-item index="5-2">处方统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-time"></i>
              <span slot="title">消息详情</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="6-1">发送</el-menu-item>
              <el-menu-item index="6-2">已发送</el-menu-item>
              <el-menu-item index="6-3">已接收</el-menu-item>
              <el-menu-item index="6-4">草稿箱</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">个人设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/config">完善资料</el-menu-item>
              <el-menu-item index="7-2">修改密码</el-menu-item>
            </el-menu-item-group>
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
    return {}
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
  .home-container {
    height: 100%;
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

</style>
