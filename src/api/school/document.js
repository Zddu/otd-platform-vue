import request from '@/utils/request'

// 查询文件列表
export function listDocument(query) {
  return request({
    url: '/document/receive/list',
    method: 'get',
    params: query
  })
}

// 查询文件详细
export function getDocument(id) {
  return request({
    url: '/document/receive/' + id,
    method: 'get'
  })
}

// 查看详情
export function checkDetail(id) {
  return request({
    url: `/document/receive/${id}`,
    method: 'get',
  })
}
// 导出文件
export function exportDocument(query) {
  return request({
    url: '/document/receive/export',
    method: 'get',
    params: query
  })
}
//归档
export function isCollected(ids) {
  return request({
    url: `/document/receive/collected`,
    method: 'put',
    data:JSON.stringify(ids)
  })
}


// 下载附件
export function downloadFj() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}

