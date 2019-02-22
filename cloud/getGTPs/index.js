// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    type,
    count = 10
  } = event;
  const _ = db.command
  let gtps;
  try {
    switch (type) {
      case 'top':
        gtps = await db.collection('gtp')
          .limit(count)
          .orderBy('updatedAt', 'desc')
          .get()
    }
  } catch (e) {
    gtps = { error: e }
  }

  return gtps
}
