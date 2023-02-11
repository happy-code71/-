import serve from '@/utils/request'

export function login(data) {
  return serve({
    url: '/sys/login',
    method: 'post',
    data
  })
}
