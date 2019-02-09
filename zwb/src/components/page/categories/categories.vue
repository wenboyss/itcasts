<template>
    <el-card>
        <!-- 面包屑导航 -->
        <mybread lastnav="商品分类" firstnav="商品管理"></mybread>
        <!-- 添加分类按钮 -->
        <el-row>
            <el-col :span="24">
                <el-button>添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <el-table :data="cateList" border max-height="250">
            <el-table-tree-column parentKey="cat_pid" levelKey="cat_level" treeKey="cat_id" prop="cat_name" label="分类名称" width="220"></el-table-tree-column>
            <el-table-column prop="cat_level" label="级别" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level === 0">一级</span>
                    <span v-else-if="scope.row.cat_level === 1">二级</span>
                    <span v-else>三级</span>
                </template>
            </el-table-column>
            <el-table-column prop="cat_deleted" label="是否有效" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_deleted === false">有效</span>
                    <span v-else>无效</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <div>
                        <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>
                        <el-button size="mini" plain type="danger" icon="el-icon-delete"></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            cateList: []
        }
    },
    methods: {
        // 得到所有的分类
        async getCateList() {
            var res = await this.$http.get('/categories?type=3')
            var { meta, data } = res.data
            if (meta.status === 200) {
                this.cateList = data
            } else {
                this.$message.error(meta.msg)
            }
        }
    },
    mounted() {
        this.getCateList()
    }
}
</script>

<style>

</style>
