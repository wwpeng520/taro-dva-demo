import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import BlockAreaProps from './PropsType'
import './index.scss'

export default class BlockArea extends Component<BlockAreaProps, any> {
  static externalClasses = ['extra-class']
  static defaultProps = {
    style: {}
  }

  render() {
    const { style } = this.props
    return <View className='block-area-comp extra-class' style={style} />
  }
}
