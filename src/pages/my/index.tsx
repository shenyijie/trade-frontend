import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

const My = () => {

  // 跳转到订单列表
  const goOrderList = () => {
    Taro.navigateTo({
      url: '/pages/orderList/index'
    })
  }

  // 跳转到收货地址管理（预留）
  const goAddress = () => {
    Taro.navigateTo({
      url: '/pages/addressList/index'
    })
  }

  return (
    <View className='my-page'>
      {/* 用户头部 */}
      <View className='user-header'>
        <View className='avatar'>👤</View>
        <View className='user-name'>微信用户</View>
      </View>

      {/* 订单入口模块 */}
      <View className='order-entry-card'>
        <View className='card-title'>
          <Text>我的订单</Text>
          <Text className='more' onClick={goOrderList}>全部订单</Text>
        </View>
        <View className='order-icon-row'>
          <View className='order-item' onClick={goOrderList}>
            <Text className='icon'>💳</Text>
            <Text className='label'>待付款</Text>
          </View>
          <View className='order-item' onClick={goOrderList}>
            <Text className='icon'>📦</Text>
            <Text className='label'>待发货</Text>
          </View>
          <View className='order-item' onClick={goOrderList}>
            <Text className='icon'>🚚</Text>
            <Text className='label'>待收货</Text>
          </View>
          <View className='order-item' onClick={goOrderList}>
            <Text className='icon'>✅</Text>
            <Text className='label'>已完成</Text>
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className='menu-card'>
        <View className='menu-item' onClick={goAddress}>
          <Text className='menu-icon'>📍</Text>
          <Text className='menu-text'>收货地址管理</Text>
          <Text className='arrow'></Text>
        </View>
        <View className='menu-item'>
          <Text className='menu-icon'>⚙️</Text>
          <Text className='menu-text'>设置</Text>
          <Text className='arrow'></Text>
        </View>
      </View>

    </View>
  )
}

export default My
