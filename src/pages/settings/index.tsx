import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtList, AtListItem } from 'taro-ui'
import './index.scss'
import { IProps, PagePropsType } from './PropsType'
import { WhiteSpace } from '../../components'

const listItem = {
  profile: '账号信息',
}

@connect(({ common, loading }: IProps) => ({ ...common, loading }))
export default class Search extends Component<PagePropsType, any> {
  config = {
    navigationBarTitleText: '设置',
  }
  constructor(props) {
    super(props)
  }

  listItemClick = (type: string) => {
    switch (type) {
      case listItem.profile:
        Taro.showToast({ title: '暂未开启', icon: 'none' })
        break
    }
  }

  logout() {
    this.props.dispatch({ type: 'common/logout' })
  }

  render() {
    return (
      <View className='settings-page'>
        <WhiteSpace />

        <AtList hasBorder={false}>
          <AtListItem
            className='list-item'
            title={listItem.profile}
            arrow='right'
            onClick={this.listItemClick.bind(this, listItem.profile)}
          />
        </AtList>

        {!!(this.props.userInfo || this.props.accessToken) && <AtButton
          type='primary'
          full
          className='logout-btn'
          onClick={this.logout}
        >
          退出登录
        </AtButton>}
      </View>
    )
  }
}
