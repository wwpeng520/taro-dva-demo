import * as service from './service';

export interface MineState {
}


export default {
  namespace: 'mine',
  state: {},
  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(service.demo, {});
      if (status === 'ok') {
        yield put({
          type: 'save',
          payload: {
            topData: data
          }
        });
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
