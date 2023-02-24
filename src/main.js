import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
import MyComponents from '@/components'
import * as filters from '@/filters'
import Print from 'vue-print-nb'
import checkPermission from '@/mixins/checkPermission' // 页面打印
// 注册所有指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// 注册所有组件
Vue.use(MyComponents)
Vue.use(Print)
// 铸注册所有过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
// 全局混入
Vue.mixin(checkPermission)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
