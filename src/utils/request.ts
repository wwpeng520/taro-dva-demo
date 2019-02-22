import Taro from '@tarojs/taro'
import * as _ from 'lodash'
import { baseUrl } from '../config'
import { ACCESS_TOKEN } from './../constants'
import { getGlobalData, setGlobalData } from '../constants/global'
import { renewToken } from '../services/common';

let token = Taro.getStorageSync(ACCESS_TOKEN)
setGlobalData(ACCESS_TOKEN, token)
console.log('token: ', token)

const request_data = {}

type Method = 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
type Options = {
  url: string;
  method?: Method;
  data?: any;
  header?: any;
}

async function request(options: Options = { method: 'GET', data: {}, url: '' }) {
  const url = options.url.startsWith('http') ? options.url : baseUrl + options.url
  token = getGlobalData(ACCESS_TOKEN)

  return await Taro.request({
    url: url,
    data: {
      ...request_data,
      ...options.data
    },
    header: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.header
    },
    method: options.method
  })
}

export default async (options: Options = { method: 'GET', data: {}, url: '' }) => {
  console.log(`${new Date().toLocaleString()}【 URL=${options.url} 】Params=${JSON.stringify(options.data)}`)
  try {
    let res = await request(options)
    console.log(`${new Date().toLocaleString()}【 URL=${options.url} 】接口响应：`, res)

    const { statusCode, data } = res
    if (statusCode >= 200 && statusCode < 300) {
      return res
    } else if (statusCode == 401 && data.error === 'invalid_token') {
      // token 过期
      await renewToken()
      res = await request(options)
      return res
    } else {
      // throw new Error(`网络请求错误，状态码${statusCode}`)
      const errorMsg = _.get(data, 'error.message')
      if (errorMsg) {
        Taro.showToast({
          title: errorMsg,
          icon: 'none'
        })
      }
      return res
    }
  } catch (e) {
    console.log('request error: ', e)
    const errorMsg = _.get(e, 'errMsg') || '网络请求失败'
    Taro.showToast({
      title: errorMsg,
      icon: 'none'
    })
    return { error: { message: errorMsg } }
  }
}
