import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/order/List',
    method: 'post',
    data: query
  })
}

export function edit(data) {
  return request({
    url: '/order/Edit',
    method: 'post',
    data
  })
}

export function single(id) {
  return request({
    url: '/order/Single',
    method: 'get',
    data: {
      id
    }
  })
}

export function add(data) {
  return request({
    url: '/order/Add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/order/Del',
    method: 'post',
    params: {
      ids
    }
  })
}

export function updateRemark(id, remark) {
  return request({
    url: '/order/UpdateRemark',
    method: 'post',
    params: {
      id,
      remark
    }
  })
}
