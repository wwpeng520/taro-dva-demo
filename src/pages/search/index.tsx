import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtSearchBar, AtIcon, AtTag, AtDivider } from 'taro-ui'
import * as _ from 'lodash';
import './index.scss'
import { IProps, PagePropsType } from './PropsType'
import { Loading } from '../../components'

const TAGS = ['蓝莲花', '那些花儿', '往后余生', '同桌的你']

@connect(({ common, collection, loading }: IProps) => ({ ...common, ...collection, loading }))
export default class Search extends Component<PagePropsType, any> {
  config = {
    navigationBarTitleText: '搜索',
  }
  constructor(props) {
    super(props)
    this.state = {
      gtps: [],
      searchValue: '',
      hasSearched: false,
      searchFocus: false,
    }
  }

  onChange(value) {
    this.setState({ searchValue: value })
  }

  async onSearch() {
    console.log('开始搜索：', this.state.searchValue)
    await this.setState({ gtps: [], hasSearched: false })
    const res = await this.props.dispatch({ type: 'search/queryByKeyword', payload: { keyword: this.state.searchValue } })
    if (_.isArray(res)) {
      this.setState({ gtps: res, hasSearched: true })
    } else {
      const msg = _.get(res, 'error.message') || '获取列表错误'
      Taro.showToast({ title: msg, icon: 'none' });
    }
  }

  onGtpItemClick(id: number) {
    Taro.navigateTo({ url: `../gtp_detail/index?id=${id}&from=list` })
  }

  tagClick(value) {
    this.setState({ searchValue: value, searchFocus: true })
    setTimeout(() => {
      this.onSearch()
    }, 300);
  }

  render() {
    const { gtps, hasSearched, searchFocus, searchValue } = this.state
    const { loading } = this.props
    const isLoading = loading && loading.effects['search/queryByKeyword']
    console.log('isLoading: ', isLoading, loading.effects['search/queryByKeyword'])
    return (
      <View className='search-page'>
        <AtSearchBar
          actionName='搜一下'
          className='search-bar'
          value={searchValue}
          focus={searchFocus}
          onChange={this.onChange}
          onActionClick={this.onSearch}
        />

        <View className='main-box'>

          <View>
            {TAGS.map((item, index) => <AtTag key={index} className='tag' type='primary' circle onClick={this.tagClick.bind(this, item)}>{item}</AtTag>)}
          </View>

          {hasSearched && !gtps.length && <View className='box-content-center'>
            <Text className='content-title'>未查询到相关数据</Text>
          </View>}

          {(gtps.length || isLoading) && <View className='content-box'>
            <Loading animating={isLoading === true} />
            {gtps.map((item, index) => {
              return <View key={item.id} className={`list-item ${index !== gtps.length - 1 ? 'border-line-1px' : ''}`} onClick={this.onGtpItemClick.bind(this, item.id)}>
                <View className='list-item-header'>
                  <View className='list-item-title text-one-line'>
                    {item.title}
                    {item.audio && item.audio.source && <AtIcon prefixClass='icon' value='music' size='16' color='orange' />}
                  </View>
                </View>
                <View className='list-item-description'>{item.description}</View>
              </View>
            })}
            <View style={{ width: '80%', zIndex: 1, margin: 'auto' }}>
              <AtDivider content='分割线' fontColor='#999' lineColor='#ddd' fontSize={24} />
            </View>
          </View>}

        </View>

      </View>
    )
  }
}
