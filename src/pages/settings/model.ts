// import * as service from './service'

export default {
  namespace: 'settings',
  state: {
    error: null,
  },
  effects: {
    
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
