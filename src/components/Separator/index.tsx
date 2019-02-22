import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeparatorProps from './PropsType'
import './index.scss'

export default class Separator extends Component<SeparatorProps, any> {
  static externalClasses = ['extra-class']
  static defaultProps = {
    style: {}
  }

  render() {
    const { style } = this.props
    return <View className='separator-comp extra-class' style={style} />
  }
}
