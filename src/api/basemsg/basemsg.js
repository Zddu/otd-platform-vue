import request from '@/utils/request'
// 查询学校基本信息列表
export function listBasemsg(query) {
  return request({
    url: '/basemsg/basemsg/list',
    method: 'get',
    params: query
  })
}

// 查询学校基本信息详细
export function getBasemsg(id) {
  return request({
    url: '/basemsg/basemsg/' + id,
    method: 'get'
  })
}

// 新增学校基本信息
export function addBasemsg(data) {
  return request({
    url: '/basemsg/basemsg',
    method: 'post',
    data: data
  })
}

// 修改学校基本信息
export function updateBasemsg(data) {
  return request({
    url: '/basemsg/basemsg',
    method: 'put',
    data: data
  })
}

// 删除学校基本信息
export function delBasemsg(id) {
  return request({
    url: '/basemsg/basemsg/' + id,
    method: 'delete'
  })
}

// 导出学校基本信息
export function exportBasemsg(query) {
  return request({
    url: '/basemsg/basemsg/export',
    method: 'get',
    params: query
  })
}
