import Taro from '@tarojs/taro'
import * as service from './service';

export default {
  namespace: 'collection',
  state: {
    collections: null,
    error: null,
  },
  effects: {
    *getCollections(_, { call, put }) {
      const res = yield call(service.getCollections);
      console.log('effects getCollections res: ', res)
      if (res && res.gtpPics) {
        yield put({
          type: 'save',
          payload: { collections: res, error: null }
        })
      } else {
        const error = (res && res.error) || { message: '获取收藏错误' }
        Taro.showToast({ title: error.message, icon: 'none' })
        yield put({
          type: 'save',
          payload: { error }
        })
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
