import request from '@/utils/request'
import defaultSettings from '@/settings'

export function importCity() {
  return request.defaults.baseURL + "/common/ImportCity";
}

export function importHistoryOrder() {
  return request({
    url: '/common/ImportHistoryOrder',
    method: 'post',
  })
}
