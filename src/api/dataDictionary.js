import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/dataDictionary/List',
    method: 'post',
    data: query
  })
}

export function edit(data) {
  return request({
    url: '/dataDictionary/Edit',
    method: 'post',
    data
  })
}


export function updateDisabledStatus(id, disabled) {
  return request({
    url: '/dataDictionary/UpdateDisabledStatus',
    method: 'post',
    params: {
      id,
      disabled
    }
  })
}

export function single(id) {
  return request({
    url: '/dataDictionary/Single',
    method: 'get',
    data: {
      id
    }
  })
}

export function add(data) {
  return request({
    url: '/dataDictionary/Add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/dataDictionary/Del',
    method: 'post',
    params: {
      ids
    }
  })
}
