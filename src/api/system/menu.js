import request from '@/utils/request'

const api_name = '/admin/system/sysMenu'

export default {
  findNodes() {
    return request({
      url: `${api_name}/findNodes`,
      method: 'get'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  save(sysMenu) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: sysMenu
    })
  },
  updateById(sysMenu) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: sysMenu
    })
  }
}
