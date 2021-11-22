import request from '@/utils/request'

export function getIngressByNs(ns) {
  return request({
    url: '/v1/ingress?ns=' + ns,
    method: 'get'
  })
}
