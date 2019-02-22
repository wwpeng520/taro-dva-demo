// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const key = event.key
  if (!key) {
    return { error: '未识别到参数key' }
  }
  try {
    const config = await db.collection('config').where({
        key: key
      })
      .get()

    return config
  } catch (e) {
    return { error: e }
  }
}
