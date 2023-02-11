// 处理图片异常时的自定义指令
export const imagerror = {
  inserted(dom, options) {
    // dom: 指令绑定的dom元素
    // options: 指令中变量的解释,有一个值value 就是绑定到指令身上的值
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}
