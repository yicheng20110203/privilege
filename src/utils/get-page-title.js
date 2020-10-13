import defaultSettings from '@/settings'

const title = defaultSettings.title || '数字中欧'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
