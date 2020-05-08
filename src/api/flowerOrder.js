import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query
  })
}

export function edit(id) {
  return request({
    url: '/order/edit',
    method: 'get',
    params: { id }
  })
}

export function add(data) {
  return request({
    url: '/order/add',
    method: 'post',
    data
  })
}

