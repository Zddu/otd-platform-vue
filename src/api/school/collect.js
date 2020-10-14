import request from '@/utils/request'

// 查询文件列表
export function listDocument(query) {
  return request({
    url: '/document/receive/collected',
    method: 'get',
    params: query
  })
}
// 取消归档
export function cancelCollected(ids) {
  return request({
    url: '/document/receive/not-collected/'+ids,
    method: 'post',
  })
}
