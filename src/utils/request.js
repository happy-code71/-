import Axios from 'axios'
import { Message } from 'element-ui'

const serve = Axios.create({
  // 基础路径
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时时间
  timeout: 5000
})
// 请求拦截器
serve.interceptors.request.use(config => {
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
  // 提示错误信息
  Message.error(err)
  return Promise.reject(err)
})
export default serve
