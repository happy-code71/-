import store from '@/store'
import router from '@/router'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 路由白名单
const whiteRouter = ['/login', '/404']
// 路由导航守卫
// to: 要跳转的目标路由
// from : 跳转之前的路由
// next : next()=>放行   next(false)=>终止跳转   next('/')=>重定向到其他路由
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteRouter.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  // 为什么还要手动执行一次呢
  // 难道是因为next('/') 执行不会再次进入导航守卫吗
  NProgress.done()// 手动关闭进度条
})

router.afterEach((to, from) => {
  NProgress.done()// 关闭进度条
})
