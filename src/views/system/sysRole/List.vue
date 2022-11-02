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

    <el-table
      :data="list"
      stripe
      style="width: 100%; margin-top: 10px;">
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
      searchObj: {}
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
    }
  }
}
</script>

<style scoped>

</style>
