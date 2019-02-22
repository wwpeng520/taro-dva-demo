import * as _ from 'lodash'
import * as service from '../services/config'
import { APP_VERSION } from '../config'

export interface ConfigState {
  weappVerified: boolean;
}

export default {
  namespace: 'config',
  state: {
    weappVerified: false,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *get({ payload }, { call }) {
      const res = yield call(service.get, { key: payload.key })
      console.log('effects get res: ', res)
      return res
    },
    *getWeappSh(action, { call, put }) {
      const res = yield call(service.get, { key: 'weapp_sh' })
      console.log('effects get res: ', res)
      if (_.isString(_.get(res, 'version'))) {
        yield put({
          type: 'save',
          payload: { weappVerified: _.get(res, 'version') !== APP_VERSION }
        })
      }
    },
  },
}
