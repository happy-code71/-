export default {
  path: '/social',
  name: 'social_securitys',
  component: () => import('@/layout'),
  children: [
    {
      path: '',
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
