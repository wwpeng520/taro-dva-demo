import Taro from '@tarojs/taro'
import * as _ from 'lodash'
import '@tarojs/async-await'
import { Buffer } from 'buffer'
import Request from '../utils/request'
import { OPEN_ID, ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { CLIENT, baseUrl } from '../config'
import { setStorage, clearStorage } from '../utils/storage'
import { setGlobalData } from '../constants/global';

// 服务器更新该用户的lastLogin或新建guest表（未创建user表时）
export async function init() {
  // clearStorage()
  let params
  let openId = Taro.getStorageSync(OPEN_ID)
  if (openId) {
    params = { openId }
  } else {
    const loginRes = await Taro.login()
    let code = loginRes && loginRes.code
    params = { code }
  }

  try {
    const res: any = await Request({
      url: `/user/init`,
      method: 'POST',
      data: params
    })
    console.log('Request init: ', res.data)
    if (_.get(res, 'data.openId')) {
      setStorage(OPEN_ID, res.data.openId)
    }
    return res && res.data
  } catch (e) {
    console.log('Request init ERROR: ', e) // { errMsg: "request:fail " }
    return e
  }
}

// 点击微信登录按钮 传入获取的数据中的 detail 部分
export async function createUser(userData: any, openId: string, cryptedSessionKey: string, unionid: string) {
  let userInfo = userData.userInfo
  console.log('userInfo: ', userInfo)
  if (!userInfo && !_.isObject(userInfo)) {
    return { error: { message: '获取用户信息错误！' } }
  }

  try {
    const res: any = await Request({
      url: `/user/wx_authorize`,
      method: 'POST',
      data: {
        openId,
        cryptedSessionKey,
        unionid,
        encryptedData: userData.encryptedData,
        iv: userData.iv,
        ...userInfo
      }
    })
    console.log('Request wx_authorize: ', res && res.data)
    // res.data: {"id":2,"username":"o9wma5dLd8WIbzRDVm4bMkBZFb2Y","password":null,"encrypted":null,"role":"user","unionId":null,"openId":"o9wma5dLd8WIbzRDVm4bMkBZFb2Y","cryptedSession":"7ea97d6339822470d989d2f809bb2ddb3c1578ec63b9c83f56eb617c446c909b","nickName":"Gothic","phone":null,"gender":1,"avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/uSYpqJrcJ3mDCu56fNWfKVspYgX54880mXvHeupd4icrQLbyOeKWZNLEBdsxTGEzpibJTutiagiacbOCsqJsZgWXDA/132","city":"杭州","province":"浙江","country":"中国","extra":"中国","createdAt":"2018-12-07T14:06:53.097Z","updatedAt":"2018-12-07T15:02:18.562Z"}
    return res && res.data
  } catch (e) {
    console.log('Request wx_authorize ERROR: ', e)
    return e
  }
}

export async function code2session() {
  const loginRes = await Taro.login()
  let code = loginRes && loginRes.code
  try {
    const res: any = await Request({
      url: `/user/wx_code2session`,
      method: 'POST',
      data: { code }
    })
    console.log('Request code2session: ', res.data)
    if (_.get(res, 'data.openId')) {
      // const { openId, cryptedSessionKey, unionid } = res.data
      setStorage(OPEN_ID, res.data.openId)
    }
    return res && res.data
  } catch (e) {
    console.log('Request code2session ERROR: ', e)
    return e
  }
}

// token 获取和保存
export async function login(params: Object) {
  try {
    const res: any = await Request({
      url: `/user/token`,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer(`${CLIENT.ID}:${CLIENT.Secret}`).toString('base64')}`
      },
      data: { ...params }
    })
    console.log('Request login(token) result: ', res.data)
    if (res && res.data && res.data.access_token) {
      await setStorage(ACCESS_TOKEN, res.data.access_token)
      setStorage(REFRESH_TOKEN, res.data.refresh_token)
      setGlobalData(ACCESS_TOKEN, res.data.access_token)
    }
    return res && res.data
  } catch (e) {
    console.log('Request login(token) ERROR: ', e)
    return e
  }
}

// 更新 token
export async function renewToken() {
  try {
    let refreshToken = Taro.getStorageSync(ACCESS_TOKEN)
    console.log('refreshToken: ', refreshToken)
    if (!refreshToken) {
      return {
        error: {
          message: 'no refresh_token'
        }
      }
    }

    const url =  baseUrl + `/user/token`
    const res = await Taro.request({
      url: url,
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer(`${CLIENT.ID}:${CLIENT.Secret}`).toString('base64')}`
      },
      method: 'POST'
    })

    console.log('Request renewToken result: ', res.data)
    if (res && res.data && res.data.access_token) {
      await setStorage(ACCESS_TOKEN, res.data.access_token)
      setStorage(REFRESH_TOKEN, res.data.refresh_token)
      setGlobalData(ACCESS_TOKEN, res.data.access_token)
    }
    return res && res.data
  } catch (e) {
    console.log('Request renewToken ERROR: ', e)
    return e
  }
}

export async function logout() {
  clearStorage()
  return true
}

export async function profile() {
  try {
    const res: any = await Request({
      url: `/user/profile`,
      method: 'GET'
    })
    console.log('Request profile result: ', res.data)
    return res && res.data
  } catch (e) {
    console.log('Request profile ERROR: ', e)
    return e
  }
}
