import request from '@/utils/request'

export function getIngressByNs(ns) {
  return request({
    url: '/v1/ingress?ns=' + ns,
    method: 'get'
  })
}

export function getIngressInfo(ns, name) {
  return request({
    url: '/v1/ingress/' + ns + '/' + name,
    method: 'get'
  })
}

export function deleteIngress(data) {
  return request({
    url: '/v1/ingress',
    method: 'delete',
    data: data
  })
}
