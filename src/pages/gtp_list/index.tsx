import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon, AtDivider, AtActivityIndicator, AtLoadMore } from 'taro-ui'
import * as _ from 'lodash';
import './index.scss'
import { IProps, PagePropsType } from './PropsType'
import { FAVOR_GTP } from '../../constants'
import { Loading } from '../../components'

@connect(({ common, collection, loading }: IProps) => ({ ...common, ...collection, loading }))
export default class GtpList extends Component<PagePropsType, any> {
  config = {
    navigationBarTitleText: '吉他谱',
    enablePullDownRefresh: true
  }
  constructor(props) {
    super(props)
    this.state = {
      favorGtps: [],
      gtps: [],
      links: null,
      isRefreshing: false,
    }
  }

  async componentWillMount() {
    this.init()
    const favorGtps = Taro.getStorageSync(FAVOR_GTP) || []
    this.setState({ favorGtps })
  }

  async init() {
    const res: any = await this.props.dispatch({ type: 'gtp/getGtps' });
    if (res && _.isArray(res.data)) {
      this.setState({ gtps: res.data, links: _.get(res, 'links') })
    } else {
      const msg = _.get(res, 'error.message') || '获取列表错误'
      Taro.showToast({ title: msg, icon: 'none' });
    }

    if (this.props.getUserError) {
      this.props.dispatch({ type: 'common/profile' })
    }
  }

  onGtpItemClick(id: number) {
    Taro.navigateTo({ url: `../gtp_detail/index?id=${id}&from=list` })
  }

  async onPullDownRefresh() {
    await this.setState({ isRefreshing: true })
    await this.init()
    setTimeout(() => {
      Taro.stopPullDownRefresh()
      this.setState({ isRefreshing: false })
    }, 200);
  }

  async loadMore() {
    const res: any = await this.props.dispatch({ type: 'gtp/getGtps', payload: { next_link: this.state.links.next } });
    if (res && _.isArray(res.data)) {
      this.setState((prevState: any) => ({ gtps: [...prevState.gtps, ...res.data], links: _.get(res, 'links') }))
    } else {
      const msg = _.get(res, 'error.message') || '获取列表错误'
      Taro.showToast({ title: msg, icon: 'none' });
    }
  }

  render() {
    const { gtps, links, favorGtps, isRefreshing } = this.state
    const { userInfo, loading } = this.props
    const gtpCollection = userInfo && userInfo.collections && userInfo.collections.gtp_pic
    const isLoading = loading && loading.effects['gtp/getGtps']
    const status = isLoading ? 'loading' : (_.get(links, 'next') ? 'more' : 'noMore')
    return (
      <View className='collection-page'>
        <Loading animating={isLoading} />
        {isRefreshing && <View style={{ position: 'relative', width: '100%', paddingBottom: 10 }}>
          <AtActivityIndicator mode='center'></AtActivityIndicator>
        </View>}
        {!gtps.length && <View className='box-content-center'>
          <Text className='content-title'>暂无吉他谱</Text>
        </View>}

        {gtps.length && <View className='main-box'>
          <View className='content-box'>
            {gtps.map((item, index) => {
              const hasFavored = favorGtps.includes(`${item.id}`)
              const hasCollected = gtpCollection && gtpCollection.includes(Number(item.id))
              return <View key={item.id} className={`list-item ${index !== gtps.length - 1 ? 'border-line-1px' : ''}`} onClick={this.onGtpItemClick.bind(this, item.id)}>
                <View className='list-item-header'>
                  <View className='list-item-title text-one-line'>
                    {item.title}
                    {item.audio && item.audio.source && <AtIcon prefixClass='icon' value='music' size='16' color='orange' />}
                  </View>

                  <View className='icon-box'>
                    <AtIcon prefixClass='icon' value='eye2' size='18' color='#999' />
                    <Text className='icon-text'>{item.scans} </Text>
                  </View>
                  <View className='icon-box'>
                    <AtIcon
                      prefixClass='icon'
                      value={hasFavored ? 'favor-fill' : 'favor-outline'}
                      size='16'
                      color={hasFavored ? 'orange' : '#999'}
                    />
                    <Text className='icon-text'>{item.stars}</Text>
                  </View>
                  <View className='icon-box'>
                    <AtIcon prefixClass='icon' value={hasCollected ? 'star1' : 'star2'} size='16' color={hasCollected ? 'orange' : '#999'} />
                    <Text className='icon-text'>{item.collections}</Text>
                  </View>

                </View>
                <View className='list-item-description'>{item.description}</View>
              </View>
            })}

            {!!links && !!_.get(links, 'next') && <AtLoadMore
              onClick={this.loadMore.bind(this)}
              status={status}
              noMoreText='我是有底线的'
              customStyle='height: 46px;'
            />}

            {!!links && !_.get(links, 'next') && <View style={{ width: '80%', zIndex: 1, margin: 'auto' }}>
              <AtDivider content='我是有底线的' fontColor='#999' lineColor='#ddd' fontSize={24} />
            </View>}
          </View>
        </View>}

      </View>
    )
  }
}
