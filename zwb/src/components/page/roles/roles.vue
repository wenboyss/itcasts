<template>
    <el-card>
        <!-- 面包屑导航 -->
        <mybread firstnav="权限管理" lastnav="角色管理" />
        <!-- 添加角色按钮 -->
        <el-row class="myrow">
            <el-col :span="24">
                <el-button plain>添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 列表 -->
        <el-table :data="rolesList" border style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 遍历角色对应的数据，并且生成 tag 标签 -->
                    <!-- 遍历生成一级权限  -->
                    <el-row v-for="item1 in scope.row.children" :key="item1.id">
                        <el-col :span="5">
                            <el-tag @close="delRight(scope.row.id, item1.id, scope.row)" closable>{{item1.authName}}-{{item1.id}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <!-- 遍历生成二级权限 -->
                            <el-row v-for="item2 in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag @close="delRight(scope.row.id, item2.id, scope.row)" type="success" closable>{{item2.authName}}-{{item2.id}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <!-- 遍历生成三级权限 -->
                                    <el-tag @close="delRight(scope.row.id, item3.id, scope.row)" type="warning" closable v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}-{{item3.id}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <span v-if="scope.row.children.length === 0">没有分配权限</span>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete"></el-button>
                    <el-button @click="openRole(scope.row.children, scope.row.id)" size="mini" plain type="success" icon="el-icon-check"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分配权限面板 -->
        <el-dialog title="分配权限" :visible.sync="roleDialog">
            <el-tree ref="mytree" :data="rightsList" show-checkbox :default-checked-keys="defaultChecked" node-key="id" :props="props" :default-expand-all="true">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialog = false">取 消</el-button>
                <el-button type="primary" @click="setRights">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      roleDialog: false,
      props: {
        label: 'authName',
        children: 'children'
      },
      rightsList: [],
      // 默认选中的数组
      defaultChecked: [],
      // 设置当前角色的 id
      roleId: ''
    }
  },
  methods: {
    // 得到所有的角色数据
    async getAllRoles () {
      var res = await this.$http.request({
        url: '/roles',
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色的权限
    //  要删除权限的角色 id
    //  要删除的权限 id
    async delRight (roleId, rightId, rightData) {
      var res = await this.$http.request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        // console.log(data)
        rightData.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 打开分配权限面板，设置默认选中的权限的选项
    openRole (rights, id) {
      this.defaultChecked = []
      this.roleId = id
      this.getAllRights()
      this.roleDialog = true
      // 得到当前角色的权限
      // 得到第三层元素的id
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultChecked.push(item3.id)
          })
        })
      })
    },
    // 得到所有的权限数据
    async getAllRights () {
      var res = await this.$http.request({
        url: `/rights/tree`,
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
    },
    // 设置权限
    async setRights () {
      // console.log(this.roleId)
      var allcheck = this.$refs.mytree.getCheckedKeys()
      var halfcheck = this.$refs.mytree.getHalfCheckedKeys()
      var newArr = allcheck.concat(halfcheck)
      // 将所有选中的内容以，分隔成为字符串
      var rids = newArr.join(',')
      // 提交数据
      var res = await this.$http.request({
        url: `/roles/${this.roleId}/rights`,
        method: 'post',
        data: {
          rids: rids
        },
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
      var {meta} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
      this.roleDialog = false
      this.getAllRoles()
    }
  },
  mounted () {
    this.getAllRoles()
  }
}
</script>

<style>
.myrow {
    margin: 15px 0px;
}

.el-tag {
    margin-top: 10px;
    margin-right: 10px;
}
</style>
