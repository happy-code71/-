import request from '@/utils/request'

// 查找公司所有部门
export function getAllDepartment() {
  return request({ url: '/company/department' })
}

// 删除公司部门
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 修改部门
export function editDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

// 查询部门详情
export function findDepartmentById(id) {
  return request({
    url: `/company/department/${id}`
  })
}
