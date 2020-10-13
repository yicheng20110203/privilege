import service from '@/utils/request'

/**
 * 订单 - 列表
 * @param {*} data
 */
export function getOrderList(data) {
  return service.request({
    method: 'post',
    url: 'order/admin/list',
    data
  })
}
