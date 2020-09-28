import request from '@/utils/request'
const api_name = '/assets/items'
// 查询资产管理列表
export function listPage(query) {
  return request({
    url: `${api_name}/list`,
    method: 'get',
    params: query
  })
}

// 查询资产管理详细
export function getAsset(id) {
  return request({
    url: `${api_name}/${id}`,
    method: 'get'
  })
}

// 新增资产管理
export function addAsset(data) {
  return request({
    url:`${api_name}`,
    method: 'post',
    data: data
  })
}

// 修改资产管理
export function updateAsset(data) {
  return request({
    url: `${api_name}`,
    method: 'put',
    data: data
  })
}

// 删除资产管理
export function delAssets(id) {
  return request({
    url: `${api_name}/${id}`,
    method: 'delete'
  })
}

// 导出资产管理
export function exportAssets(query) {
  return request({
    url: `${api_name}/export`,
    method: 'get',
    params: query
  })
}
