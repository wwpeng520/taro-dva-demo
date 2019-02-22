import * as service from './service'

export default {
  namespace: 'search',
  state: {
    error: null,
  },
  effects: {
    *queryByKeyword({ payload }, { call }) {
      const res = yield call(service.queryByKeyword, { keyword: payload.keyword })
      console.log('effects queryByKeyword res: ', res)
      return res
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
