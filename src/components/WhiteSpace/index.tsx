import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import WhiteSpaceProps from './PropsType'
import './index.scss'

export default class WhiteSpace extends Component<WhiteSpaceProps, any> {
  static externalClasses = ['extra-class']
  static defaultProps = {
    size: 'md',
    style: {}
  }

  render() {
    const { size, style } = this.props
    const style1 = `whitespace-${size} extra-class`
    return <View className={style1} style={style} />
  }
}
