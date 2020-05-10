import request from '@/utils/request'

export function totalCount() {
  return request({
    url: '/home/TotalCount',
    method: 'get'
  })
}

export function lineData() {
  return request({
    url: '/home/LineData',
    method: 'get'
  })
}
