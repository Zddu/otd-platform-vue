import request from '@/utils/request'
const api_name = '/assets/maintenance'
// 查询资产管理列表
export function maintenanceAdd(data) {
  return request({
    url: `${api_name}`,
    method: 'post',
    data: data
  })
}
