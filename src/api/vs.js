import request from '@/utils/request'

export function getVsByNs(ns) {
  return request({
    url: '/v1/vs?ns=' + ns,
    method: 'get'
  })
}

export function createVs(data) {
  return request({
    url: '/v1/vs',
    method: 'post',
    data: data
  })
}

export function updateVs(data) {
  return request({
    url: '/v1/vs?update=1',
    method: 'post',
    data: data
  })
}

export function deleteVs(data) {
  return request({
    url: '/v1/vs',
    method: 'delete',
    data: data
  })
}

export function getVsByNsAndName(ns, name) {
  return request({
    url: '/v1/vs/' + ns + '/' + name,
    method: 'get'
  })
}
