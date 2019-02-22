import Taro from '@tarojs/taro'
import '@tarojs/async-await'

export async function getStorage(key: string) {
  try {
    const getResult = await Taro.getStorage({ key })
    console.log(`getStorage key: ${key} success!: `, getResult)
    return getResult
  } catch (e) {
    console.log(`getStorage key: ${key} fail!: `, e)
    return e
  }
}

export async function setStorage(key: string, data: String | Object) {
  try {
    const setResult = await Taro.setStorage({ key, data })
    console.log(`setStorage key: ${key} success!: `, setResult)
    return true
  } catch (e) {
    console.log(`setStorage key: ${key} fail!: `, e)
    return false
  }
}

export async function clearStorage() {
  try {
    const clearResult = await Taro.clearStorage()
    console.log(`clearStorage success!: `, clearResult)
    return true
  } catch (e) {
    console.log(`clearStorage fail!: `, e)
    return false
  }
}
