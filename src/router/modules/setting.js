export default {
  path: '/setting',
  name: 'settings',
  component: () => import('@/layout'),
  children: [
    {
      path: '',
      component: () => import('@/views/setting'),
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]
}
