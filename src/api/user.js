import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/SystemUser/Login',
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info\.*',
    // url: '/SystemUser/Info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    // url: '/SystemUser/logout',
    method: 'get'
  })
}

export function test() {
  return request({
    url: '/SystemUser/test',
    method: 'get'
  })
}
