import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/SystemUser/Login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/SystemUser/Info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/SystemUser/logout',
    method: 'get'
  })
}

export function test() {
  return request({
    url: '/SystemUser/test',
    method: 'get'
  })
}
