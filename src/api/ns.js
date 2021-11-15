import request from '@/utils/request'

export function getNsAll() {
  return request({
    url: '/v1/ns',
    method: 'get'
  })
}
