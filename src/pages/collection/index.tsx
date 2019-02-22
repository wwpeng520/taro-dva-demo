import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon, AtDivider, AtButton } from 'taro-ui'
import * as _ from 'lodash';
import './index.scss'
import { IProps, PagePropsType } from './PropsType'
import { Loading } from '../../components'

@connect(({ common, collection, loading }: IProps) => ({ loading, ...common, ...collection }))
export default class Collection extends Component<PagePropsType, any> {
  config = {
    navigationBarTitleText: '我的收藏'
  }
  constructor(props) {
    super(props)
  }

  async componentWillMount() {
    this.init()
  }

  init() {
    this.props.dispatch({ type: 'collection/getCollections' })
  }

  onGtpItemClick(id: number) {
    Taro.navigateTo({ url: `../gtp_detail/index?id=${id}&from=collection` })
  }

  async cancelCollect(id: number) {
    let collectResult: any = await this.props.dispatch({
      type: 'gtpDetail/collect',
      payload: { id, type: 'minus' }
    })
    console.log('collectResult: ', collectResult)
    this.init()
    if (collectResult && _.isNumber(collectResult.collections)) {
      this.props.dispatch({ type: 'common/profile' })
    }
  }

  render() {
    const { collections, loading } = this.props
    const isLoading = loading && loading.models['collection']
    let gtps: any[] = []
    if (collections && _.isArray(collections.gtpPics)) {
      gtps = collections.gtpPics
    }
    return (
      <View className='collection-page'>
        <Loading animating={isLoading} />

        {!isLoading && !gtps.length && <View className='box-content-center'>
          <Text className='content-title'>暂无收藏</Text>
        </View>}

        {!isLoading && gtps.length && <View className='category-box'>
          <View className='category-header'>
            <Text className='header-title'>吉他谱收藏</Text>
            <AtIcon prefixClass='icon' value='star1' size='18' color='orange' />
          </View>
          <View className='content-box'>
            {gtps.map((item, index) => (
              <View key={item.id} className={`list-item ${index !== gtps.length - 1 ? 'border-line-1px' : ''}`}>
                <View className='list-item-header'>
                  <View className='list-item-title text-one-line' onClick={this.onGtpItemClick.bind(this, item.id)}>
                    {item.title}
                    {item.audio && item.audio.source && <AtIcon prefixClass='icon' value='music' size='16' color='orange' />}
                  </View>
                  <AtButton type='secondary' size='small' className='cancel-btn' onClick={this.cancelCollect.bind(this, item.id)}>
                    <Text className='btn-text'>取消收藏</Text>
                  </AtButton>
                </View>
                <View className='list-item-description' onClick={this.onGtpItemClick.bind(this, item.id)}>{item.description}</View>
              </View>
            ))}
          </View>
          <View style={{ width: '80%', zIndex: 1, margin: 'auto' }}>
            <AtDivider content='分割线' fontColor='#999' lineColor='#ddd' fontSize={24} />
          </View>
        </View>}

      </View>
    )
  }
}
