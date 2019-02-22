import * as service from './service'
import * as configService from '../../services/config'

export default {
  namespace: 'gtpDetail',
  state: {},
  effects: {
    *getDetail({ payload }, { call }) {
      const res = yield call(service.getDetail, { id: payload.id })
      console.log('effects getDetail res: ', res)
      return res
    },
    *favor({ payload }, { call }) {
      const res  = yield call(service.favor, { id: payload.id, type: payload.type })
      console.log('effects favor res: ', res)
      return res
    },
    *collect({ payload }, { call }) {
      const res  = yield call(service.collect, { id: payload.id, type: payload.type })
      console.log('effects collect res: ', res)
      return res
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
