import request from '@/utils/request'

export function getDsByNs(ns) {
  return request({
    url: '/v1/dr?ns=' + ns,
    method: 'get'
  })
}

export function createDr(data) {
  return request({
    url: '/v1/dr',
    method: 'post',
    data: data
  })
}

export function getDrByNsAndName(ns, name) {
  return request({
    url: '/v1/dr/' + ns + '/' + name,
    method: 'get'
  })
}

export function deleteDs(ns, name) {
  return request({
    url: '/v1/dr/' + ns + '/' + name,
    method: 'delete'
  })
}
