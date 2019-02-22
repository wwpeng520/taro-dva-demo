import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import ReloadButtonProps from './PropsType'
import './index.scss'

export default class ReloadButton extends Component<ReloadButtonProps, any> {
  static defaultProps = {
    color: '#999999',
    text: '',
    style: {},
    onClick: () => {}
  }

  render() {
    const { style, text, color, onClick } = this.props

    return (
      <View className='reload-comp' style={style}>
        <AtButton type='secondary' circle size='small' className='reload-btn' onClick={onClick}>
          <AtIcon prefixClass='icon' value='reload2' size={20} color={color} />
          {text && (
            <Text className='text' style={{ color: color }}>
              {text}
            </Text>
          )}
        </AtButton>
      </View>
    )
  }
}
