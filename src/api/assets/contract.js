import request from '@/utils/request'

// 查询合同管理列表
export function listContract(query) {
  return request({
    url: '/assets/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同管理详细
export function getContract(id) {
  return request({
    url: '/assets/contract/' + id,
    method: 'get'
  })
}

// 新增合同管理
export function addContract(data) {
  return request({
    url: '/assets/contract',
    method: 'post',
    data: data
  })
}

// 修改合同管理
export function updateContract(data) {
  return request({
    url: '/assets/contract',
    method: 'put',
    data: data
  })
}

// 删除合同管理
export function delContract(id) {
  return request({
    url: '/assets/contract/' + id,
    method: 'delete'
  })
}

// 导出合同管理
export function exportContract(query) {
  return request({
    url: '/assets/contract/export',
    method: 'get',
    params: query
  })
}