import request from '@/utils/request'

export function getGwByNs(ns) {
  return request({
    url: '/v1/gw?ns=' + ns,
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
