import request from '@/utils/request'

export function getTaskByNs(ns) {
  return request({
    url: '/v1/task?ns=' + ns,
    method: 'get'
  })
}

export function getTaskDetail(ns, name) {
  return request({
    url: '/v1/task/' + ns + '/' + name,
    method: 'get'
  })
}

export function updateTask(data) {
  return request({
    url: '/v1/task/' + data.metadata.namespace + '/' + data.metadata.name,
    method: 'post',
    data: data
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

export function getPipelineByNs(ns) {
  return request({
    url: '/v1/pipeline?ns=' + ns,
    method: 'get'
  })
}

export function createPipeline(data) {
  return request({
    url: '/v1/pipeline',
    method: 'post',
    data: data
  })
}

export function getPipelineDetail(ns, name) {
  return request({
    url: '/v1/pipeline/' + ns + '/' + name,
    method: 'get'
  })
}

export function deletePipeline(ns, name) {
  return request({
    url: '/v1/pipeline/' + ns + '/' + name,
    method: 'delete'
  })
}

export function updatePipeline(data) {
  return request({
    url: '/v1/pipeline/' + data.metadata.namespace + '/' + data.metadata.name,
    method: 'post',
    data: data
  })
}

export function getPipelineRunByNs(ns) {
  return request({
    url: '/v1/pipeline-run?ns=' + ns,
    method: 'get'
  })
}

export function createPipelineRun(data) {
  return request({
    url: '/v1/pipeline-run',
    method: 'post',
    data: data
  })
}
