export function setToken(token) {
  localStorage.setItem('token', token)
}

export function getToken() {
  return localStorage.getItem('token')
}

export function removeToken() {
  localStorage.removeItem('token')
}

// 保存获取到token时的时间戳
export function setTimeStamp() {
  localStorage.setItem('TimeStamp', Date.now())
}

// 获取token的时间戳
export function getTimeStamp() {
  return localStorage.getItem('TimeStamp')
}

// 删除token 时间戳
export function removeTimeStamp() {
  console.log('s')
  localStorage.removeItem('TimeStamp')
}
