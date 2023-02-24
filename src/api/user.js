import serve from '@/utils/request'
import request from '@/utils/request'

export function login(data) {
  return serve({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户基本信息( 不含头像)
export function getUserInfo() {
  return serve({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取用户基本信息(含头像)
export function getUserBaseInfo(id) {
  return serve({
    url: `/sys/user/${id}`
  })
}

// 给员工分配角色
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })

}
