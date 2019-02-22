import * as _ from 'lodash'
import * as service from './service'
import * as gtpService from '../../services/gtp'
import * as configService from '../../services/config'

export default {
  namespace: 'home',
  state: {
    videoShare: [],
    carousels: [],
    gtps: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *getCarousels({ payload }, { call, put }) {
      const res = yield call(configService.get, { key: payload.key })
      console.log('effects getCarousels res: ', res)
      if (_.isArray(res) && res.length) {
        yield put({
          type: 'save',
          payload: { carousels: res }
        })
      }
    },
    *getGtps({ payload }, { call, put }) {
      const res = yield call(gtpService.getGtps, { type: payload.type, count: payload.count || 6 })
      console.log('effects getGtps res: ', res)
      const data = _.get(res, 'data')
      if (_.isArray(data) && data.length) {
        yield put({
          type: 'save',
          payload: { gtps: data }
        })
      }
    },
    *getVideos({ payload }, { call, put }) {
      const res = yield call(service.getVideos, { type: payload.type, count: payload.count || 6 })
      console.log('effects getVideos res: ', res)
      const data = _.get(res, 'data')
      if (_.isArray(data) && data.length) {
        yield put({
          type: 'save',
          payload: { videoShare: data }
        })
      }
    }
  }
}
