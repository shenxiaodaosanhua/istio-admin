import request from '@/utils/request'

export function getTaskByNs(ns) {
  return request({
    url: '/v1/task?ns=' + ns,
    method: 'get'
  })
}

export function createTask(data) {
  return request({
    url: '/v1/task',
    method: 'post',
    data: data
  })
}

export function deleteTask(ns, name) {
  return request({
    url: '/v1/task/' + ns + '/' + name,
    method: 'delete'
  })
}
