<template>
  <div class="app-container">
    <div style="padding: 20px 20px 0 20px;">
      授权角色: {{ $route.query.roleName }}
    </div>
    <el-tree
    style="margin: 20px 0"
    ref="tree"
    :data="sysMenuList"
    node-key="id"
    show-checkbox
    default-expand-all
    :props="defaultProps" />
    <div style="padding: 20px 20px;">
      <el-button :loading="loading" type="primary" icon="el-icon-check" size="mini" @click="save">保存</el-button>
      <el-button @click="$router.push('/system/sysRole')" size="mini" icon="el-icon-refresh-right">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/system/menu'
export default {
  name: 'AssignAuth',
  data() {
    return {
      loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
      sysMenuList: [], // 所有菜单列表
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const roleId = this.$route.query.id
      api.toAssign(roleId).then(res => {
        const sysMenuList = res.data
        this.sysMenuList = sysMenuList
        const checkedIds = this.getCheckedIds(sysMenuList)
        this.$refs.tree.setCheckedKeys(checkedIds)
      })
    },
    getCheckedIds(auths, initArr = []) {
      return auths.reduce((pre, item) => {
        if (item.select && item.children.length === 0) {
          pre.push(item.id)
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr)
        }
        return pre
      }, initArr)
    },
    save() {
      const allCheckedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const idList = allCheckedNodes.map(node => node.id)
      const assignMenuVo = {
        roleId: this.$route.query.id,
        menuIdList: idList
      }
      this.loading = true
      api.doAssign(assignMenuVo).then(res => {
        this.loading = false
        this.$message.success(res.message || '分配权限成功')
        this.$router.push('/system/sysRole')
      })
    }
  }
}
</script>

<style scoped>

</style>
