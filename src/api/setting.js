import request from '@/utils/request'

// 获取角色列表
export function getAllRole(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 删除公司角色
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 获取角色详情
export function getRoleDetailById(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 更新角色
export function UpdateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
