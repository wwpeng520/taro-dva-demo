import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import { connect } from '@tarojs/redux'
import * as _ from 'lodash'
import './index.scss'
import { WhiteSpace, ReloadButton, Separator } from '../../components'
import { IProps, PagePropsType } from './PropsType'
import { APP_VERSION, APP_NAME } from '../../config';

const listItem = {
  collection: '我的收藏',
  plan: '学习进度',
  feedback: '问题反馈',
  about: `关于`,
  setting: `设置`,
}

@connect(({ mine, common }: IProps) => ({ ...mine, ...common }))
export default class Mine extends Component<PagePropsType, any> {
  config = {
    navigationBarTitleText: '我的'
  }
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }

  componentDidMount() {
    this.init()
  }

  async init() {
    if (this.props.getUserError && this.props.getUserError !== 'invalid_token') {
      await this.props.dispatch({ type: 'common/profile' })
    }
  }

  onGotUserInfo = async e => {
    console.log('onGotUserInfo: ', e)
    if (e.detail && e.detail.errMsg.includes('auth deny')) {
      Taro.showToast({ title: '未授权', icon: 'none' })
    } else if (e.detail && e.detail.userInfo) {
      this.props.dispatch({ type: 'common/onGotUserInfo', payload: e.detail })
    } else {
      Taro.showToast({ title: '授权出错了', icon: 'none' })
    }
  }

  listItemClick = (type: string) => {
    switch (type) {
      case listItem.collection:
        const { getUserError, userInfo } = this.props
        if (!userInfo) {
          const msg = _.get(getUserError, 'message') || '请先授权登录'
          Taro.showToast({ title: msg, icon: 'none' })
        } else {
          Taro.navigateTo({ url: '../collection/index' })
        }
        break
      case listItem.plan:
        Taro.showToast({ title: '正在开发中', icon: 'none' })
        break
      case listItem.setting:
        Taro.navigateTo({ url: '../settings/index' })
        break
      case listItem.feedback:
        Taro.showToast({ title: '暂未开启', icon: 'none' })
        break
      case listItem.about:
        this.setState({ modalVisible: true })
        break
    }
  }

  closeModal() {
    this.setState({ modalVisible: false })
  }

  render() {
    const { userInfo, getUserError } = this.props
    const avatar = (userInfo && userInfo.avatarUrl) || require('../../assets/images/avatar/avatar.png')
    let collections = userInfo && userInfo.collections
    let collectionsCount = 0
    if (collections && _.isObject(collections)) {
      Object.keys(collections).forEach((key) => {
        if (_.isArray(collections[key])) {
          collectionsCount += collections[key].length
        }
      });
    }
    return (
      <View className='mine-page'>

        <AtModal isOpened={this.state.modalVisible}>
          <AtModalHeader>关于{APP_NAME}</AtModalHeader>
          <AtModalContent>{APP_NAME}是由个人开发用于学习的小程序。如有侵权，请联系开发者删除：wwpeng520@gmail.com</AtModalContent>
          <Separator />
          <AtButton type='secondary' className='modal-btn' onClick={this.closeModal}>好 的</AtButton>
        </AtModal>
        {!!userInfo && (
          <View className='user-header'>
            <Image className='avatar' src={avatar} />
            <Text className='username'>{userInfo.nickName}</Text>
          </View>
        )}

        {!userInfo && !!getUserError && getUserError !== 'invalid_token' && (
          <View className='user-header'>
            <Image className='avatar' src={avatar} />
            <Text className='error-info'>{_.isString(getUserError) ? getUserError : (_.get(getUserError, 'message') || '未知错误')}</Text>
            <ReloadButton onClick={this.init} />
          </View>
        )}

        {!userInfo && getUserError === 'invalid_token' && (
          <View className='user-header'>
            <AtButton
              type='primary'
              circle
              className='login-btn'
              openType='getUserInfo'
              lang='zh_CN'
              onGetUserInfo={this.onGotUserInfo}
            >
              重新授权
            </AtButton>
            <Text className='tip'>您好久没来了吧 O(∩_∩)O~~</Text>
          </View>
        )}

        {!userInfo && !getUserError && (
          <View className='user-header'>
            <AtButton
              type='primary'
              circle
              className='login-btn'
              openType='getUserInfo'
              lang='zh_CN'
              onGetUserInfo={this.onGotUserInfo}
            >
              一键登录
            </AtButton>
            <Text className='tip'>体验一下又何妨 O(∩_∩)O~~</Text>
          </View>
        )}
        <WhiteSpace size='lg' />

        <AtList hasBorder={false}>
          <AtListItem
            className='list-item'
            title={listItem.collection}
            extraText={`${collectionsCount}条`}
            iconInfo={{ size: 25, color: '#FF5B54', value: 'favor-circle', prefixClass: 'icon' }}
            onClick={this.listItemClick.bind(this, listItem.collection)}
          />
          <AtListItem
            className='list-item list-item-no-border'
            title={listItem.plan}
            iconInfo={{ size: 25, color: '#FF5B54', value: 'meirijihua', prefixClass: 'icon' }}
            onClick={this.listItemClick.bind(this, listItem.plan)}
          />
        </AtList>

        <WhiteSpace />
        <AtList hasBorder={false}>
          <AtListItem
            className='list-item'
            title={listItem.setting}
            iconInfo={{ size: 25, color: '#FF5B54', value: 'setting-circle3', prefixClass: 'icon' }}
            onClick={this.listItemClick.bind(this, listItem.setting)}
          />
          <AtListItem
            className='list-item'
            title={listItem.feedback}
            iconInfo={{ size: 25, color: '#FF5B54', value: 'pen', prefixClass: 'icon' }}
            onClick={this.listItemClick.bind(this, listItem.feedback)}
          />
          <AtListItem
            className='list-item list-item-no-border'
            title={listItem.about}
            extraText={`v${APP_VERSION}`}
            iconInfo={{ size: 25, color: '#FF5B54', value: 'about4', prefixClass: 'icon' }}
            onClick={this.listItemClick.bind(this, listItem.about)}
          />
        </AtList>
      </View>
    )
  }
}
