import * as gtpService from '../../services/gtp'

export default {
  namespace: 'gtp',
  state: {
    error: null,
  },
  effects: {
    *getGtps({ payload }, { call }) {
      const res = yield call(gtpService.getGtps, payload)
      console.log('effects getGtps res: ', res)
      return res;
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
