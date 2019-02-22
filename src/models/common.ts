import Taro from '@tarojs/taro'
import * as service from '../services/common'
import { OPEN_ID, ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

export interface CommonState {
  accessToken: string;
  refreshToken: string;
  openId: string;
  userInfo: any;
  isGuest: boolean;
  getUserError: any;
}

export default {
  namespace: 'common',
  state: {
    accessToken: Taro.getStorageSync(ACCESS_TOKEN),
    refreshToken: Taro.getStorageSync(REFRESH_TOKEN),
    userInfo: null, // 不保存在 localStorage
    openId: Taro.getStorageSync(OPEN_ID),
    isGuest: true,
    getUserError: null
  },

  effects: {
    // 每次使用小程序时
    *init(_, { call, put }) {
      const res = yield call(service.init)
      console.log('effects init res: ', res)
      if (res && res.result) {
        yield put({
          type: 'save',
          payload: { isGuest: res.isGuest }
        })
      }
    },
    // 已注册但本地无 token
    *retoken(_, { call, put }) {
      const res = yield call(service.code2session)
      console.log('effects retoken res: ', res)
      if (res && res.openId && res.cryptedSessionKey) {
        yield put({
          type: 'save',
          payload: { openId: res.openId }
        })

        const tokenRes = yield call(service.login, {
          username: res.openId,
          password: `WX_3RD_SESSION_${res.cryptedSessionKey}`,
          scope: 'password_login',
          grant_type: 'password'
        })
        console.log('effects tokenRes: ', tokenRes)
      } else {
        const msg = (res && res.error && res.error.message) || '获取openid错误'
        Taro.showToast({ title: msg, icon: 'none' })
      }
    },
    // 微信授权登录 -> 创建用户/更新用户信息 + 获取 token
    *onGotUserInfo({ payload }, { call, put }) {
      if (payload.userInfo) {
        yield put({
          type: 'save',
          payload: { userInfo: payload.userInfo, getUserError: null }
        })
      }

      // 1. wx.login -> code(server) -> openId(cryptedSessionKey)
      const { openId, cryptedSessionKey, unionid, ...extra } = yield call(service.code2session)
      if (openId) {
        // 2. create user
        const createUserRes = yield call(service.createUser, payload, openId, cryptedSessionKey, unionid)
        console.log('effects createUserRes: ', createUserRes)
        if ((createUserRes && createUserRes.id) || createUserRes.username) {
          yield put({
            type: 'save',
            payload: { openId, userInfo: createUserRes, getUserError: null }
          })
        } else {
          const error = (createUserRes && createUserRes.error) || { message: '获取用户失败' }
          Taro.showToast({ title: error && error.message, icon: 'none' })
          yield put({
            type: 'save',
            payload: { openId, getUserError: error }
          })
        }

        // 3. create token
        const tokenRes = yield call(service.login, {
          username: openId,
          password: `WX_3RD_SESSION_${cryptedSessionKey}`,
          scope: 'password_login',
          grant_type: 'password'
        })
        console.log('effects tokenRes: ', tokenRes)
      } else {
        const msg = (extra && extra.error && extra.error.message) || '获取openid错误'
        Taro.showToast({ title: msg, icon: 'none' })
      }
    },
    *profile(_, { call, put }) {
      const res = yield call(service.profile)
      console.log('effects profile res: ', res)
      if (!res || !res.id) {
        const error = (res && res.error) || { message: '获取用户失败' }
        // Taro.showToast({ title: error && error.message, icon: 'none' })
        yield put({
          type: 'save',
          payload: { getUserError: error }
        })
      } else {
        yield put({
          type: 'save',
          payload: { userInfo: res, getUserError: null }
        })
      }
    },
    *patchUserInfoInProps({ payload }, { put }) {
      yield put({
        type: 'updateUserInfo',
        payload: payload
      })
    },
    *logout(_, { call, put }) {
      const res = yield call(service.logout)
      console.log('effects logout res: ', res)
      yield put({
        type: 'save',
        payload: {
          accessToken: null,
          refreshToken: null,
          userInfo: null,
          openId: null,
          getUserError: null
        }
      })
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    updateUserInfo(state, { payload }) {
      return { ...state, userInfo: { ...state.userInfo, ...payload } }
    }
  }
}
