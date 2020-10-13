// 日期格式过滤器
const dateServer = value => {
  return value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
}
// 金额格式过滤器
const moneyFilter = (value, num, type, btype, base) => {
  if (value === 0 || value === undefined || value === '') { return btype + '0.00' + type }
  value = value * base
  // '￥'
  return btype + value.toFixed(num) + ' ' + type
}

const vipPriceFilter = (value, price) => {
  value = value * 0.01
  if (price === null) { return '￥' + value.toFixed(2) + ' ' + '元' }

  if (price === 0) {
    const r = 0
    return '￥' + r.toFixed(2) + ' ' + '元'
  }
  if (price === '0') {
    const r = 0
    return '￥' + r.toFixed(2) + ' ' + '元'
  }
  price = price * 0.01

  return '￥' + (value * price).toFixed(2) + ' ' + '元'
}

const priceFilter = (value) => {
  return '￥' + value + '元'
}

const fileSizeFilter = (value) => {
  value = value / 1024 / 1024
  return value.toFixed(2) + 'M'
}

const genderFilter = (value) => {
  switch (value) {
    case 0:
      return '未知'
    case 1:
      return '男'

    case 2:
      return '女'
  }
}
// 时间格式过滤器
const dateFilter = (input, format = 0) => {
  if (input === '0' || input === 0 || input === undefined) {
    return ''
  }

  var d = new Date(input)
  var year = d.getFullYear()
  var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1)
  var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()

  var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours()
  var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes()
  var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds()

  switch (format) {
    case 0:
      return year + '-' + month + '-' + day

    case 1:
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  }
}

export { dateServer, moneyFilter, dateFilter, genderFilter, vipPriceFilter, priceFilter, fileSizeFilter }
