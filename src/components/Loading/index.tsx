import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import LoadingProps from './PropsType'
import { WhiteSpace } from '../index'
import { color as COLOR } from '../../config'
import './index.scss'

export default class Loading extends Component<LoadingProps, any> {
  static externalClasses = ['extra-class']
  static defaultProps = {
    size: 'md',
    color: COLOR.theme,
    text: '',
    animating: true,
    style: {}
  }

  render() {
    const { size, style, text, animating, color } = this.props
    let iconSize = 30
    switch (size) {
      case 'sm':
        iconSize = 26
        break
      case 'lg':
        iconSize = 34
        break
      default:
        iconSize = 30
    }
    return (
      <View className='loading-comp extra-class' style={{ ...style, ...(!animating ? { display: 'none' } : null) }}>
        <View className='rotate-box'>
          <AtIcon prefixClass='icon' value='loading1' size={iconSize} color={color} />
        </View>
        {text && <Text className={`text-${size}`}>{text}</Text>}
        <WhiteSpace size='xl' />
      </View>
    )
  }
}
