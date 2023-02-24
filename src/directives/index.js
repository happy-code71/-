// 处理图片异常时的自定义指令
import store from '@/store'

export const imagerror = {
  inserted(dom, options) {
    // dom: 指令绑定的dom元素
    // options: 指令中变量的解释,有一个值value 就是绑定到指令身上的值
    dom.src = dom.src || options.value // 如果自身的src 为空，那么就是用传入的默认值
    dom.onerror = function() {
      dom.src = options.value
    }
  },
  update(dom, options) {
    dom.src = dom.src || options.value // 如果自身的src 为空，那么就是用传入的默认值
  }
}
// 检查是否有操作权限的指令
export const btnpermission = {
  inserted(dom, options) {
    function getPints() {
      let points = []
      if (store.state.user.userInfo.roles && store.state.user.userInfo.roles.points) {
        points = store.state.user.userInfo.roles.points
      }
      return points
    }

    const points = getPints()
    const isHas = points.some(item => item === options.value)
    if (!isHas) {
      dom.style.display = 'none'
    }
  }
}
