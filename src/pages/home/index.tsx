import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { BlockArea, WhiteSpace, Loading } from '../../components'
import './index.scss'
import { IProps, PagePropsType } from './PropsType'
import { ACCESS_TOKEN } from '../../constants'
import { checkScope } from '../../utils/wx'
import { formatBigNumber, getRandomNumber } from '../../utils/helper';
import { APP_NAME } from '../../config';

const SENTENCE = [
  '当神已无能为力，那便是魔渡众生',
  '无人与我立黄昏，无人问我粥可温',
  '我还是很喜欢你，像风走了八千里，不问归期。',
  '谁的等待，恰逢花开',
  '因为强大，所以温柔',
  '远离玩心的人',
  '一切孤独皆是罪过',
  '春水初生，春风初盛；十里春风，不如你。',
  '岁月静好，惟愿你好',
  '窗纱透染寒鸦色，伴盏孤灯不忍眠',
  '幸福只是一种感觉，体会到了即拥有了',
  '世界上只有想不通的人，没有走不通的路',
  '上帝不会为难头脑简单的孩子',
  '慎终如始，则无败事',
  '志薄弱的人，一定不会诚实'
]

@connect(({ home, common, loading }: IProps) => ({ ...home, ...common, loading }))
export default class Home extends Component<PagePropsType, any> {
  static defaultProps = {}
  config = {
    navigationBarTitleText: '发现'
  }
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    this.props.dispatch({
      type: 'home/getCarousels',
      payload: { key: 'index_carousel' }
    })
    this.props.dispatch({
      type: 'home/getGtps',
      payload: { type: 'top', count: 10 }
    })
    await this.props.dispatch({ type: 'common/init' })

    if (Taro.getStorageSync(ACCESS_TOKEN)) {
      // 本地有 ACCESS_TOKEN 保存
      this.props.dispatch({ type: 'common/profile' })
    } else if (!this.props.isGuest) {
      // 本地没有 ACCESS_TOKEN，但该用户已授权登录过
      await this.props.dispatch({ type: 'common/retoken' })
      this.props.dispatch({ type: 'common/profile' })
    } else if (await checkScope('userInfo')) {
      const info = await Taro.getUserInfo()
      if (info && info.userInfo) {
        this.props.dispatch({ type: 'common/onGotUserInfo', payload: info })
      }
    }
    
    this.props.dispatch({ type: 'config/getWeappSh' })
  }

  carouselClick() {
    const msg = SENTENCE[getRandomNumber(0, SENTENCE.length - 1)]
    Taro.showToast({ title: msg, icon: 'none' })
  }

  moreGtpsClick() {
    console.log('clickHandler')
    Taro.navigateTo({ url: '../gtp_list/index' })
  }

  onGtpItemClick(id: number) {
    Taro.navigateTo({ url: `../gtp_detail/index?id=${id}` })
  }

  gotoSearch() {
    Taro.navigateTo({ url: `../search/index` })
  }

  // 点击分享的那一刻会进行调用
  onShareAppMessage() {
    return {
      title: `来试试${APP_NAME}可好` ,
      path: 'pages/home/index',
      imageUrl: '../../assets/images/qrcode.png'
    };
  }

  render() {
    const { carousels, gtps, loading } = this.props
    const isLoading = loading && loading.models['home']
    return (
      <View className='home-page'>
        <Loading animating={isLoading} />

        <View className='search-container'>
          <View className='search-inner' onClick={this.gotoSearch}>
            <AtIcon prefixClass='icon' value='search' size='15' color='#999' />
            <Text className='search-text'>搜索</Text>
          </View>
        </View>

        {carousels.length && (
          <Swiper
            className='swiper-container'
            indicatorColor='#999'
            indicatorActiveColor='orange'
            circular
            indicatorDots
            autoplay
          >
            {carousels.map(item => (
              <SwiperItem key={item} onClick={this.carouselClick}>
                <Image className='banner' src={item.image_url} />
              </SwiperItem>
            ))}
          </Swiper>
        )}

        <WhiteSpace />
        <View className='category-box'>
          <View className='category-header'>
            <BlockArea />
            <Text className='header-title'>吉他谱</Text>
            <View className='button-more' onClick={this.moreGtpsClick}>
              更多
              <AtIcon prefixClass='icon' value='arrow' size='10' color='#999' />
            </View>
          </View>
          <View className='padding-horizontal-lg content-box-column'>
            {gtps.map(item => (
              <View key={item.id} className='list-line-item' onClick={this.onGtpItemClick.bind(this, item.id)}>
                <View className='list-line-item-title text-one-line'>
                  {item.title}
                  {item.audio && item.audio.source && <AtIcon prefixClass='icon' value='music' size='16' color='orange' />}
                </View>
                <View className='flex-row'>
                  <Text className='list-line-item-extra'>{formatBigNumber(item.scans)}</Text>
                  <AtIcon prefixClass='icon' value='eye2' size='18' color='#999' />
                </View>
              </View>
            ))}
            {!gtps.length && <Text className='content-title'>暂无吉他谱</Text>}
          </View>
        </View>
        <WhiteSpace size='xl' />

        {/* <View className='category-box'>
          <View className='category-header'>
            <BlockArea />
            <Text className='header-title'>吉他风采</Text>
            <View className='button-more' onClick={this.clickHandler}>
              更多
              <AtIcon prefixClass='icon' value='arrow' size='10' color='#999' />
            </View>
          </View>
          <View className='padding-horizontal-lg'>
            <View className='at-row at-row--wrap content-box'>
              {videoShare.map(item => (
                <View key={item.id} className='at-col at-col-4 col-item'>
                  <Image className='col-item-image border-box-1px' src={item.cover} mode='aspectFill' />
                  <Text className='col-item-title text-one-line'>{item.title}</Text>
                </View>
              ))}
              {!videoShare.length && <Text className='content-title'>暂无已上传视频</Text>}
            </View>
          </View>
        </View>
        <WhiteSpace /> */}

        {/* <Separator />
        <View className='category-box'>
          <View className='category-header'>
            <BlockArea />
            <Text className='header-title'>吉他百科</Text>
            <View className='button-more' onClick={this.clickHandler}>
              更多
              <AtIcon prefixClass='icon' value='arrow' size='10' color='#999' />
            </View>
          </View>
          <View className='padding-horizontal-lg content-box'>
            <View className='content-title'>吉他换弦</View>
          </View>
        </View> */}

      </View>
    )
  }
}
