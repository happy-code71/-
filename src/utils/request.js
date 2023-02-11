import Axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { checkTimeStamp } from '@/utils/index'
import router from '@/router'

// token时效 秒
const overTime = 3600 // 一小时

const serve = Axios.create({
  // 基础路径
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时时间
  timeout: 5000
})
// 请求拦截器
serve.interceptors.request.use(config => {
  if (store.getters.token) {
    if (checkTimeStamp(overTime)) {
      store.dispatch('user/logOut')
      router.push('/login')
      return Promise.reject('登录超时!!请重新登录')
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }

  return config
}, err => {
  Message.error(err)
  return Promise.reject(err)
})
// 响应拦截器
serve.interceptors.response.use(res => {
  const { success, message, data } = res.data
  // 响应成功
  if (success) {
    return data
  } else {
    // 提示错误信息
    Message.error(message)
    // 返回错误信息
    return Promise.reject(message)
  }
}, err => {
  // error 信息 里面 有 response的对象 时
  if (err.response && err.response.data && err.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logOut')
    router.push('/login')
  } else {
    // 提示错误信息
    Message.error(err)// 当code为10002的时候，err 是一个对象 所以err不是对象的时候就打印
  }
  return Promise.reject(err)
})
export default serve
