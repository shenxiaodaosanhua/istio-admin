import request from '@/utils/request'

export function getDsByNs(ns) {
  return request({
    url: '/v1/ds?ns=' + ns,
    method: 'get'
  })
}

export function deleteDs(ns, name) {
  return request({
    url: '/v1/ds/' + ns + '/' + name,
    method: 'delete'
  })
}
