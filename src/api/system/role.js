import request from '@/utils/request'

const api_name = '/admin/system/sysRole/'
export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  removeId(id) {
    return request({
      url: `${api_name}${id}`,
      method: 'delete'
    })
  },
  saveRole(role) {
    return request({
      url: `${api_name}save`,
      method: 'post',
      // 传递json格式
      data: role
    })
  },
  getRole(id) {
    return request({
      url: `${api_name}findRoleById/${id}`,
      method: 'get'
    })
  },
  updateRole(role) {
    return request({
      url: `${api_name}updateRoleById`,
      method: 'post',
      data: role
    })
  },
  batchRemoveByIds(ids) {
    return request({
      url: `${api_name}batchDelete`,
      method: 'delete',
      data: ids
    })
  },
  getRolesByUserId(userId) {
    return request({
      url: `${api_name}toAssign/${userId}`,
      method: 'get'
    })
  },
  assignRoles(assignRoleVo) {
    return request({
      url: `${api_name}doAssign`,
      method: 'post',
      data: assignRoleVo
    })
  }
}

