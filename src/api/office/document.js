import request from '@/utils/request'

// 查询文件列表
export function listDocument(query) {
  return request({
    url: '/document/document/list',
    method: 'get',
    params: query
  })
}

// 查询文件详细
export function getDocument(id) {
  return request({
    url: '/document/document/' + id,
    method: 'get'
  })
}

// 新增文件
export function addDocument(data) {
  return request({
    url: '/document/document',
    method: 'post',
    data: data
  })
}

// 修改文件
export function updateDocument(data) {
  return request({
    url: '/document/document',
    method: 'put',
    data: data
  })
}

// 删除文件
export function delDocument(id) {
  return request({
    url: '/document/document/' + id,
    method: 'delete'
  })
}

// 导出文件
export function exportDocument(query) {
  return request({
    url: '/document/document/export',
    method: 'get',
    params: query
  })
}
// 获取发布学校
export function listDepts() {
  return request({
    url: '/document/document/depts',
    method: 'get',
  })
}
// 发布学校
export function outSchools(data) {
  return request({
    url: '/document/document/submit',
    method: 'post',
    data:data
  })
}
// 查询已选择的学校
export function checkedSchools(id) {
  return request({
    url: `/document/document/get/${id}`,
    method: 'get',
  })
}
// 撤回文件
export function withdrawDocument(id) {
  return request({
    url: `/document/document/withdraw/${id}`,
    method: 'post',
  })
}

// 查看详情
export function checkDetail(id) {
  return request({
    url: `/document/document/school/${id}`,
    method: 'get',
  })
}
// 删除附件
export function deleteFj(ids) {
  return request({
    url: `/document/document/file/${ids}`,
    method: 'delete',
  })
}
