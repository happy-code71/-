export default {
  path: '/employees',
  name: 'employees',
  component: () => import('@/layout'),
  children: [
    {
      path: '',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/components/detail'),
      hidden: true,
      meta: { title: '员工详情' }
    },
    //   员工信息打印
    {
      path: 'print/:id',
      component: () => import('@/views/employees/components/print.vue'),
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }

    }
  ]
}
