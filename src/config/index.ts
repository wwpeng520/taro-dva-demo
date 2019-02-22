export { default as color } from './color'
// 请求连接前缀
export const APP_NAME = '吉他'
export const APP_VERSION = '1.0.0'

// http://192.168.0.102:65000,https://mxjtapi.example.com
// export const baseUrl = 'https://mxjtapi.example.com'
export const baseUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.1.104:65000' : 'http://api.example.com'

export const WEAPP = {
  AppID: 'wxbac2553xxxxxxxxx',
  AppSecret: '8b0xxxxxxxxxxxxxxxxxxxxxxxxxxx'
}

export const CLIENT = {
  ID: 'weapp',
  Secret: 'KaCNnWbyohFrGmaRaYYpAGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}
