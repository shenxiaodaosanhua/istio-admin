import request from '@/utils/request'

export function getSvcByNs(ns) {
  return request({
    url: '/v1/svc?ns=' + ns,
    method: 'get'
  })
}
