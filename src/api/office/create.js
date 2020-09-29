import request from '@/utils/request'
const api_name='/document/document'
// 查询定时任务调度列表
export function attachment(data) {
  return request({
    url: `${api_name}`,
    method: 'post',
    data:data
  })
}
