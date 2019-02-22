import Taro from '@tarojs/taro'
// import * as _ from 'lodash'
import '@tarojs/async-await'

export async function checkScope(scope: string): Promise<Boolean> {
  const settings = await Taro.getSetting()
  console.log('settings: ', settings)
  // { errMsg: "getSetting:ok", authSetting: { scope.userLocation: true, scope.userInfo: true } }
  if (settings && settings.authSetting[`scope.${scope}`]) {
    return true
  }
  return false
}
