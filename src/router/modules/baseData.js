/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const baseDataRouter = {
  path: '/baseData',
  component: Layout,
  redirect: '/baseData/dataDictionary',
  name: 'BaseData',
  meta: {
    title: 'BaseData',
    icon: 'chart'
  },
  children: [
    {
      path: 'dataDictionary',
      component: () => import('@/views/dataDictionary/index'),
      name: 'DataDictionary',
      meta: {
        title: 'DataDictionary',
        noCache: true
      }
    }
  ]
}

export default baseDataRouter
