import request from '@/utils/request'

// 常量
const api_name = '/admin/system/sysUser/'

export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}${id}`,
      method: 'delete'
    })
  },
  save(user) {
    return request({
      url: `${api_name}save`,
      method: 'post',
      // 传递json格式
      data: user
    })
  },
  getUser(id) {
    return request({
      url: `${api_name}findUserById/${id}`,
      method: 'get'
    })
  },
  updateUser(user) {
    return request({
      url: `${api_name}updateUserById`,
      method: 'post',
      data: user
    })
  },
  batchRemoveByIds(ids) {
    return request({
      url: `${api_name}batchDelete`,
      method: 'delete',
      data: ids
    })
  }
}

