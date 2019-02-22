import qs from 'qs'
import Request from '../../utils/request'
import { API_ROUTE } from '../../constants'

export const demo = data =>
  Request({
    url: '/',
    method: 'POST',
    data
  })

export async function getVideos(params: Object) {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.VIDEO_SHARE}?${qs.stringify(params)}`
    })
    console.log('service getVideos res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('getVideos ERROR: ', e)
    return e
  }
}

export async function getGtpsFromWxCloud({ type, count }) {
  try {
    wx.cloud.init()
    console.log('type, count: ', type, count)
    const res = await wx.cloud.callFunction({
      name: 'getGTPs',
      data: {
        type: type,
        count: count
      }
    })
    return (res && res.result) || res
  } catch (e) {
    console.log('getGTPs ERROR: ', e)
    return e
  }
}

export async function getCarouselsFromWxCloud({ key }) {
  try {
    wx.cloud.init()
    const res = await wx.cloud.callFunction({
      name: 'getConfig',
      data: {
        key: key
      }
    })
    return (res && res.result) || res
  } catch (e) {
    console.log('getCarousels ERROR: ', e)
    return e
  }
}
