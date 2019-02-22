// 在 Taro 中推荐使用 Redux 来进行全局变量的管理，但是对于一些小型的应用，Redux 就可能显得比较重了。
// 这时候如果想使用全局变量，推荐如下使用。

const data = {}

export function setGlobalData(key, val) {
  data[key] = val
}

export function getGlobalData(key) {
  return data[key]
}
