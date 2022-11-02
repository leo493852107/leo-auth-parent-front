<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 100%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添加</el-button>
      <el-button class="btn-add" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-left: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="sysRole.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false" size="small" icon="el-icon-refresh-right">取消</el-button>
        <el-button type="primary" @click="saveOrUpdate" size="small" icon="el-icon-check">确定</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="list"
      stripe
      style="width: 100%; margin-top: 10px;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        v-loading="listLoading"
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column prop="description" label="角色描述"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="getData">
    </el-pagination>
  </div>
</template>

<script>
import api from '@/api/role/role'

export default {
  name: 'List',
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      page: 1,
      limit: 10,
      searchObj: {},
      sysRole: {},
      dialogVisible: false,
      selectValue: [] // 复选框
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(pageNum = 1) {
      this.page = pageNum
      api.getPageList(this.page, this.limit, this.searchObj).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.limit = val
      console.log(val)
      this.getData()
    },
    resetData() {
      Object.assign(this.$data, this.$options.data())
      this.getData()
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.removeId(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    add() {
      this.dialogVisible = true
      this.sysRole = {}
    },
    saveOrUpdate() {
      if (!this.sysRole.id) {
        this.saveRole()
      } else {
        this.updateRole()
      }
    },
    saveRole() {
      api.saveRole(this.sysRole).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.dialogVisible = false
        this.getData()
      })
    },
    updateRole() {
      api.updateRole(this.sysRole).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogVisible = false
        this.getData()
      })
    },
    edit(id) {
      this.dialogVisible = true
      api.getRole(id).then(res => {
        this.sysRole = res.data
        console.log(this.sysRole)
        console.log(res.data)
      })
    },
    handleSelectionChange(selection) {
      this.selectValue = selection
    },
    batchRemove() {
      if (this.selectValue.length === 0) {
        this.$message.warning('请选择要删除的记录')
        return
      } else {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = []
          for (let i = 0; i < this.selectValue.length; i++) {
            var obj = this.selectValue[i]
            ids.push(obj.id)
          }
          api.batchRemoveByIds(ids).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
