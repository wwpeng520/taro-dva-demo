import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton, AtSlider, AtDivider } from 'taro-ui'
import { connect } from '@tarojs/redux'
import * as _ from 'lodash'
import './index.scss'
import { Loading, ReloadButton } from '../../components'
import { IProps, PagePropsType } from './PropsType'
import { FAVOR_GTP } from '../../constants'
import { setStorage } from '../../utils/storage'
import { formatPlayerTime } from '../../utils/helper';

@connect(({ common, config, loading }: IProps) => ({ loading, ...common, ...config }))
export default class GtpDetail extends Component<PagePropsType, any> {
  config = {
    navigationBarTitleText: '吉他谱'
  }

  detailId: string
  innerAudioContext: any
  innerAudioDuration: string
  prevPage: string
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      detail: null,
      error: null,
      favorGtps: [],
      modalVisible: false,
      audioPlaying: false,
      audioDuration: '00:00',
      audioCurrentTime: '00:00',
      playPercentage: 0,
    }
  }

  async componentWillMount() {
    const { id, from } = this.$router.params
    this.detailId = id
    this.prevPage = from
    console.log('id, from: ', id, from)
  }

  componentDidMount() {
    this.init()
    const favorGtps = Taro.getStorageSync(FAVOR_GTP) || []
    if (favorGtps.length) {
      this.setState({ favorGtps })
    }
    if (this.props.getUserError) {
      this.props.dispatch({ type: 'common/profile' })
    }
  }

  componentWillUnmount() {
    this.innerAudioContext.destroy();
  }

  async init() {
    await this.setState({ loading: true })
    if (!this.detailId) {
      return Taro.showToast({ title: '获取id错误', icon: 'none' })
    }
    const detail: any = await this.props.dispatch({ type: 'gtpDetail/getDetail', payload: { id: this.detailId } })
    if (detail && detail.id) {
      this.setState({ detail, error: null, loading: false })
      if (detail.audio) {
        const { source, duration } = detail.audio
        this.innerAudioContext = Taro.createInnerAudioContext()
        this.innerAudioContext.src = source

        // const backgroundAudioManager = wx.getBackgroundAudioManager()
        // backgroundAudioManager.src = source
        // console.log('backgroundAudioManager: ', backgroundAudioManager)

        const interval = setInterval(() => {
          if (this.state.audioDuration === '00:00' && this.innerAudioContext.duration) {
            this.setState({ audioDuration: formatPlayerTime(this.innerAudioContext.duration || duration) })
          } else if (this.state.audioDuration !== '00:00') {
            clearInterval(interval)
          }
        }, 500);
      }
    } else {
      this.setState({ error: detail && detail.error, loading: false })
    }
  }

  previewImage(i: number) {
    const { detail } = this.state
    Taro.previewImage({
      current: detail.pics[i],
      urls: detail.pics
    })
  }

  // 点赞
  async onFavor() {
    let favorGtps = this.state.favorGtps
    let favorResult
    if (favorGtps.includes(this.detailId)) {
      favorGtps = _.without(favorGtps, this.detailId)
      favorResult = await this.props.dispatch({
        type: 'gtpDetail/favor',
        payload: { id: this.detailId, type: 'minus' }
      })
    } else {
      favorGtps = [...favorGtps, this.detailId]
      favorResult = await this.props.dispatch({ type: 'gtpDetail/favor', payload: { id: this.detailId, type: 'add' } })
    }
    setStorage(FAVOR_GTP, favorGtps)
    this.setState({ favorGtps })

    if (favorResult && _.isNumber(favorResult.stars)) {
      this.setState(prevState => ({ detail: { ...prevState.detail, stars: favorResult.stars } }))
    }
  }

  // 收藏
  async onCollect() {
    const { userInfo } = this.props
    if (!userInfo) {
      return this.setState({ modalVisible: true })
    }

    const gtpCollection = userInfo && userInfo.collections && userInfo.collections.gtp_pic
    const hasCollected = gtpCollection && gtpCollection.includes(Number(this.detailId))
    let collectResult
    if (!hasCollected) {
      collectResult = await this.props.dispatch({
        type: 'gtpDetail/collect',
        payload: { id: this.detailId, type: 'add' }
      })
    } else {
      collectResult = await this.props.dispatch({
        type: 'gtpDetail/collect',
        payload: { id: this.detailId, type: 'minus' }
      })
    }
    if (collectResult && _.isNumber(collectResult.collections)) {
      this.setState(prevState => ({ detail: { ...prevState.detail, collections: collectResult.collections } }))
      this.props.dispatch({ type: 'common/profile' })

      if (this.prevPage) {
        this.props.dispatch({ type: 'collection/getCollections' })
      }
    }
  }

  audioPlay() {
    this.setState({ audioPlaying: this.innerAudioContext.paused })

    this.innerAudioContext.onPlay(() => {
      const interval = setInterval(() => {
        if (this.state.audioDuration === '00:00' && this.innerAudioContext.duration) {
          this.setState({ audioDuration: formatPlayerTime(this.innerAudioContext.duration) })
        } else if (this.state.audioDuration !== '00:00') {
          clearInterval(interval)
        }
      }, 500);
      const paused = this.innerAudioContext.paused
      console.log('onPlay: ', paused)
    })

    this.innerAudioContext.onPause(() => {
      this.setState({ audioPlaying: false })
    })

    if (this.innerAudioContext.paused) {
      this.innerAudioContext.play()
      this.innerAudioContext.onTimeUpdate(() => {
        this.setState({
          audioCurrentTime: formatPlayerTime(this.innerAudioContext.currentTime),
          playPercentage: 100 * this.innerAudioContext.currentTime / this.innerAudioContext.duration
        })
      })

      this.innerAudioContext.onEnded(() => {
        this.setState({
          audioCurrentTime: '00:00',
          playPercentage: 0,
          audioPlaying: false,
        })
      })
    } else {
      this.innerAudioContext.pause()
    }
  }

  sliderChanging(e) {
    console.log('sliderChanging:', e)
    if (_.isNumber(e.value)) {
      this.setState({ playPercentage: e.value })
      this.innerAudioContext.seek(e.value * this.innerAudioContext.duration / 100)
      this.innerAudioContext.pause()
    }
  }

  sliderChange(e) {
    console.log('sliderChange:', e)
    if (this.state.audioPlaying) {
      this.innerAudioContext.play()
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

    this.setState({ modalVisible: false })
  }

  cancelAuth() {
    this.setState({ modalVisible: false })
  }

  render() {
    const { detail, error, favorGtps, modalVisible, audioPlaying, audioDuration, audioCurrentTime, playPercentage, loading } = this.state
    const { userInfo, weappVerified } = this.props
    const hasFavored = favorGtps.includes(this.detailId)
    const gtpCollection = userInfo && userInfo.collections && userInfo.collections.gtp_pic
    const hasCollected = gtpCollection && gtpCollection.includes(Number(this.detailId))
    return (
      <View className='detail-page'>
        <Loading animating={loading} />

        <AtModal isOpened={modalVisible}>
          <AtModalHeader>未登录</AtModalHeader>
          <AtModalContent>您尚未授权登录，点击下方按钮一键授权登录。</AtModalContent>
          <AtModalAction>
            <View className='btn-line'>
              <AtButton type='primary' size='small' className='cancel-btn' onClick={this.cancelAuth}>
                取消
              </AtButton>
              <AtButton
                type='primary'
                size='small'
                className='login-btn'
                openType='getUserInfo'
                lang='zh_CN'
                onGetUserInfo={this.onGotUserInfo}
              >
                一键登录
              </AtButton>
            </View>
          </AtModalAction>
        </AtModal>

        {!loading && detail && (
          <View className='detail-box'>
            <Text className='title'>{detail.title}</Text>
            <View className='icon-boxes'>
              <Text className='icon-text'>浏览：{detail.scans} </Text>
              <View className='icon-box' onClick={this.onFavor}>
                <AtIcon
                  prefixClass='icon'
                  value={hasFavored ? 'favor-fill' : 'favor-outline'}
                  size='18'
                  color='orange'
                />
                <Text className='icon-text'>{detail.stars}</Text>
              </View>
              <View className='icon-box' onClick={this.onCollect}>
                <AtIcon prefixClass='icon' value={hasCollected ? 'star1' : 'star2'} size='18' color='orange' />
                <Text className='icon-text'>{detail.collections}</Text>
              </View>
            </View>
            <Text className='description'>{detail.description}</Text>
            {_.isArray(detail && detail.pics) &&
              detail.pics.map((item, index) => (
                <Image key={index} src={item} mode='widthFix' onClick={this.previewImage.bind(this, index)} />
              ))}

            <View style={{ width: '80%', zIndex: 1 }}>
              <AtDivider content='分割线' fontColor='#999' lineColor='#ddd' fontSize={24} />
            </View>

            {_.get(detail, 'audio.source') && weappVerified && <View className='bottom-player-box'>
              <View className='player-icon-box' onClick={this.audioPlay}>
                <View className='player-icon-bg'>
                  <AtIcon className={audioPlaying ? 'rotate-box' : ''} prefixClass='icon' value={audioPlaying ? 'rotating' : 'cd2'} size='40' color='rgba(255,255,255,0.5)' />
                </View>
                <AtIcon prefixClass='icon' value={audioPlaying ? 'zanting1' : 'play-fill'} size='20' color='#fff' />
              </View>
              <View className='player-slider'>
                <AtSlider
                  step={1}
                  value={playPercentage}
                  activeColor='#FF5B54'
                  backgroundColor='#eee'
                  blockColor='#FF5B54'
                  blockSize={12}
                  onChanging={this.sliderChanging}
                  onChange={this.sliderChange}
                />
              </View>
              <Text className='player-time'>{audioCurrentTime}/{audioDuration}</Text>
            </View>}
          </View>
        )}

        {!loading && !detail && (
          <View className='box-content-center flex-column'>
            <Text>{(error && error.message) || '获取信息出错了！'}</Text>
            <ReloadButton onClick={this.init} />
          </View>
        )}

      </View>
    )
  }
}
