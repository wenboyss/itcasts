<template>
    <el-menu :router="true" :unique-opened="true" default-active="2" class="el-menu-vertical-demo mymenu">
        <el-submenu v-for="item1 in rightsList" :key="item1.id" :index="item1.path">
            <!-- 一级菜单 -->
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.authName}}</span>
            </template>
            <el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="'/' + item2.path">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    // 用来得到当前登录用户的所有的权限
    async getRightsList () {
      var res = await this.$http.request({
        url: '/menus',
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getRightsList()
  }
}
</script>

<style>
/* 侧边栏样式 */

.mymenu {
    height: 100%
}
</style>
