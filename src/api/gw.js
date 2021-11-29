import request from '@/utils/request'

export function getGwByNs(ns) {
  return request({
    url: '/v1/gw?ns=' + ns,
    method: 'get'
  })
}

export function createGw(data) {
  return request({
    url: '/v1/gw',
    method: 'post',
    data: data
  })
}

export function getGwDetailByNsAndName(ns, name) {
  return request({
    url: '/v1/gw/' + ns + '/' + name,
    method: 'get'
  })
}

export function deleteGw(data) {
  return request({
    url: '/v1/gw',
    method: 'delete',
    data: data
  })
}
