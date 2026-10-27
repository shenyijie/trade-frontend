import { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import './index.scss'

const PayOrder = () => {
  const [orderNo, setOrderNo] = useState<string>('')
  const [totalMoney, setTotalMoney] = useState<string>('0.00')

  useEffect(() => {
    const instance = getCurrentInstance()
    const params = instance.router?.params
    if (params) {
      setOrderNo((params.orderNo as string) || '')
      setTotalMoney((params.total as string) || '0.00')
    }
  }, [])

  // 模拟支付
  const handlePay = () => {
    Taro.showModal({
      title: '确认支付',
      content: `订单号：${orderNo}\n应付金额：¥${totalMoney}`,
      confirmText: '确认支付',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '支付成功', icon: 'success', duration: 1000 })
          // 支付成功跳订单列表，没有订单列表就跳首页
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/index/index' })
          }, 1000)
        } else {
          // 用户取消支付，返回首页
          Taro.showToast({ title: '已取消支付', icon: 'none' })
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/index/index' })
          }, 800)
        }
      }
    })
  }

  return (
    <View className='pay-order-page'>
      <View className='order-card'>
        <View className='row-item'>
          <Text className='label'>订单编号</Text>
          <Text className='value'>{orderNo}</Text>
        </View>
        <View className='row-item'>
          <Text className='label'>应付金额</Text>
          <Text className='money'>¥{totalMoney}</Text>
        </View>
      </View>

      <View className='btn-wrap'>
        <Button className='pay-btn' onClick={handlePay}>立即支付</Button>
      </View>
    </View>
  )
}

export default PayOrder
