<template>
  <div className="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关键字">
              <el-input style="width: 95%" v-model="searchObj.keyword" placeholder="用户名/姓名/手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px; width: 100%">
              </el-date-picker>
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
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;">
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="110"></el-table-column>
      <el-table-column prop="phone" label="手机"></el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
          v-model="scope.row.status === 1"
          @change="switchStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"></el-button>
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignRole(scope.row)" title="分配角色"></el-button>
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

    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="sysUser.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="assignRole" size="small">保存</el-button>
        <el-button @click="dialogRoleVisible=false" size="small">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysUser" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="用户名">
          <el-input v-model="sysUser.username"></el-input>
        </el-form-item>
        <el-form-item v-if="!sysUser.id" label="密码" prop="password">
          <el-input v-model="sysUser.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="sysUser.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="sysUser.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false" size="small" icon="el-icon-refresh-right">取消</el-button>
        <el-button type="primary" @click="saveOrUpdate()" size="small" icon="el-icon-check">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import api from '@/api/system/user'
import roleApi from '@/api/system/role'

export default {
  name: 'List',
  data() {
    return {
      searchObj: {},
      createTimes: [],
      listLoading: false,
      list: null,
      page: 1,
      limit: 10,
      total: 0,
      dialogVisible: false,
      sysUser: {},
      saveBtnDisabled: false,

      dialogRoleVisible: false,
      allRoles: [],
      userRoleIds: [],
      isIndeterminate: false,
      checkAll: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(page = 1) {
      this.page = page
      if (this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }
      api.getPageList(this.page, this.limit, this.searchObj).then(res => {
        this.list = res.data.records
        this.total = res.data.total
      })
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.limit = val
      this.getData()
    },
    resetData() {
      Object.assign(this.$data, this.$options.data())
      this.getData()
    },
    add() {
      this.dialogVisible = true
      this.sysUser = {}
    },
    saveOrUpdate() {
      if (!this.sysUser.id) {
        this.saveUser()
      } else {
        this.updateUser()
      }
    },
    saveUser() {
      api.save(this.sysUser).then(res => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getData()
      })
    },
    updateUser() {
      api.updateUser(this.sysUser).then(res => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getData()
      })
    },
    edit(id) {
      this.dialogVisible = true
      api.getUser(id).then(res => {
        this.sysUser = res.data
      })
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.removeById(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getData()
        })
      })
    },
    switchStatus(row) {
      row.status = row.status === 1 ? 0 : 1
      api.updateStatusById(row.id, row.status).then(res => {
        this.$message.success(res.message || '操作成功')
        this.getData()
      })
    },
    // 展示分配角色
    showAssignRole(row) {
      this.sysUser = row
      this.dialogRoleVisible = true
      roleApi.getRolesByUserId(row.id).then(res => {
        this.allRoles = res.data.allRoles
        this.userRoleIds = res.data.userRoleIds
        console.log(this.allRoles)
        console.log(this.userRoleIds)
        this.checkAll = this.userRoleIds.length === this.allRoles.length
        this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length
      })
    },
    // 全选勾选状态发生改变的监听
    handleCheckAllChange(value) { // value 当前勾选状态true/false
      // 如果当前全选，userRoleIds就是所有角色id的数组，否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 当前不是全选也不全不选时，指定为false
      this.isIndeterminate = false
    },
    // 角色列表选中项发生改变的监听
    handleCheckedChange(value) {
      const { userRoleIds, allRoles } = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length > 0
      this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length
    },
    // 分配角色
    assignRole() {
      const assignRoleVo = {
        userId: this.sysUser.id,
        roleIdList: this.userRoleIds
      }
      roleApi.assignRoles(assignRoleVo).then(res => {
        this.$message.success(res.message || '分配角色成功')
        this.dialogRoleVisible = false
        this.getData(this.page)
      })
    }
  }
}
</script>

<style scoped>

</style>
