import request from '@/utils/request'

export function testApi() {
  return request({
    url: '/weatherforecast',
    method: 'get'
  })
}
