<template>
  <el-container class='home-container'>
    <el-header>
      <h2 style="margin-left: 40%; text-align: center">Electronic Prescription Platform</h2>
      <i class="el-icon-bell" style="margin-left: 20%; margin-top: 15px">
        <div v-if="count > 0">
          <el-badge :value="count" :max="99" class="item"/>
        </div>
      </i>
      <el-dropdown trigger="click">
        <div style="width: 50px; height: 50px; float:left; border-radius: 50%; border: 3px snow solid; overflow: hidden;">
          <img ref="img" src="../assets/NIL.png" slot="reference" style="width: 52px; height: 52px; align-self: center"/>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown" style="text-align: center">
          {{user}}
          <router-link to="/complateUserInfo" style="text-decoration: none;">
            <el-dropdown-item divided>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="handleClickUploadVisible">更换头像</el-dropdown-item>
          <router-link to="/resetPassword" style="text-decoration: none;">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog :visible.sync="dialogVisible" center width="500px">
        <el-upload style="text-align: center"
          :limit="1"
          ref="upload"
          action
          drag
          :file-list="fileList"
          accept="image/*"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :http-request="doPost"
        >
          <i class="el-icon-picture-outline" style="font-size: 80px"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png/bmp/jpeg文件，且不超过2MB</div>
        </el-upload>
      </el-dialog>
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
            <el-menu-item :index="children.url" v-for="children in item.children" :key="children.id" style="text-align: right">
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
      headerObj: '',
      header: '',
      file: Object,
      fileList: [],
      count: 0,
      dialogVisible: false,
      user: window.sessionStorage.getItem('name')
    }
  },
  created () {
    this.getUserRoleList()
    this.getUserHeader()
    this.getUnReadCount()
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
    },
    async getUserHeader () {
      await this.$axios.post('user/getHeaderByUsername', {'username': window.sessionStorage.getItem('username')}).then(async result => {
        if (result.data.code === 200) {
          this.header = result.data.data
          this.getHeaderImage()
        }
      })
    },
    async getHeaderImage () {
      await this.$axios.get('img/' + this.header, {responseType: 'arraybuffer'}).then(response => {
        return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      }).then(data => {
        this.$refs.img.src = data
      })
    },
    async getUnReadCount () {
      await this.$axios.post('message/getUnReadCount', {'receiver': window.sessionStorage.getItem('id')}).then(result => {
        if (result.data.code === 200) {
          this.count = result.data.data
        }
      })
    },
    handleClickUploadVisible () {
      this.dialogVisible = true
    },
    async doPost () {
      let formData = new FormData()
      formData.set('file', this.file)
      await this.$axios.post('user/headerUpload', formData, {headers: {'Content-type': 'multipart/form-data'}}).then(result => {
        if (result.data.code === 200) {
          this.getHeaderImage()
          this.dialogVisible = false
          this.fileList = []
        } else {
          this.dialogVisible = false
          return this.$message.error('头像上传失败: ' + result.data.message)
        }
      }).catch(error => {
        this.dialogVisible = false
        return this.$message.error('头像上传失败: ' + error)
      })
    },
    handleAvatarSuccess (res, file) {
      this.getUserHeader()
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.file = new File([file], `${this.header.substr(0, this.header.indexOf('.'))}` + `${file.name.substr(file.name.indexOf('.'))}`)
      return isLt2M
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

  .item {
    margin-top: -65px;
    margin-right: -40px;
  }
</style>
