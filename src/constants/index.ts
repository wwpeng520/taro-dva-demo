import * as globalData from './global'
import WX_ERROR from './wx_error'

export { globalData, WX_ERROR }

export const ACCESS_TOKEN = 'ACCESS_TOKEN'
export const REFRESH_TOKEN = 'REFRESH_TOKEN'
export const OPEN_ID = 'OPEN_ID'

export const FAVOR_GTP = 'FAVOR_GTP'

export const API_ROUTE = {
  CONFIG: '/config',
  GTP_PIC: '/gtp_pic',
  GTP_PIC_FAVOR: '/gtp_pic/favor',
  GTP_PIC_COLLECTION: '/gtp_pic/collection',
  GTP_PIC_SEARCH: '/gtp_pic/search',
  VIDEO_SHARE: '/video_share',
  USER_COLLECTION: '/user/collection',
}
