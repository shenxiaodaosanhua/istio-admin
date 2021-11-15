import request from '@/utils/request'

export function getVsByNs(ns) {
  return request({
    url: '/v1/vs?ns=' + ns,
    method: 'get'
  })
}
