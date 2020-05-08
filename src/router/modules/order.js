/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Order',
  meta: {
    title: 'Order',
    icon: 'chart'
  },
  children: [
    {
      path: 'flowerOrder',
      component: () => import('@/views/flowerOrder/index'),
      name: 'Order',
      meta: {
        title: 'Order',
        noCache: true
      }
    }
  ]
}

export default orderRouter
