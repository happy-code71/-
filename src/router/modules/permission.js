export default {
  path: '/permission',
  name: 'permissions',
  component: () => import('@/layout'),
  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
