import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import dva from './utils/dva'
import models from './models'
import Home from './pages/home'

import './styles/base.scss'
import { APP_NAME } from './config';

if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})
const store = dvaApp.getStore()

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/home/index', 
      'pages/mine/index',
      'pages/gtp_list/index',
      'pages/gtp_detail/index',
      'pages/collection/index',
      'pages/search/index',
      'pages/settings/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#00C2DE',
      navigationBarTitleText: APP_NAME,
      navigationBarTextStyle: 'white',
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/home/index',
          text: '发现',
          iconPath: './assets/images/tabbar/home.png',
          selectedIconPath: './assets/images/tabbar/home_active.png'
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './assets/images/tabbar/user.png',
          selectedIconPath: './assets/images/tabbar/user_active.png'
        }
      ],
      color: '#333',
      selectedColor: '#333',
      backgroundColor: '#fff',
      borderStyle: 'black'
    },
    // requiredBackgroundModes: ['audio'],
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
