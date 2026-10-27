import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import type { OrderItem } from '@/types'
import './index.scss'

// 订单tab类型
type OrderTabType = 'all' | 'unpay' | 'unsend' | 'unreceive' | 'finish'

const OrderList = () => {
  const tabList: {key:OrderTabType; title:string}[] = [
    {key:'all', title:'全部'},
    {key:'unpay', title:'待付款'},
    {key:'unsend', title:'待发货'},
    {key:'unreceive', title:'待收货'},
    {key:'finish', title:'已完成'},
  ]
  const [activeTab, setActiveTab] = useState<OrderTabType>('all')
  const [orderList, setOrderList] = useState<OrderItem[]>([])

  // 读取本地订单
  const loadOrders = () => {
    const data = Taro.getStorageSync('order_list') || []
    setOrderList(data)
  }

  useEffect(()=>{
    loadOrders()
  },[])

  // tab过滤
  const filterList = () => {
    if(activeTab === 'all') return orderList
    const map:Record<OrderTabType,number> = {
      all:0,
      unpay:0,
      unsend:1,
      unreceive:2,
      finish:3
    }
    const status = map[activeTab]
    return orderList.filter(o=>o.status === status)
  }

  // 跳订单详情
  const goDetail = (orderNo:string) => {
    Taro.navigateTo({
      url:`/pages/orderDetail/index?orderNo=${orderNo}`
    })
  }

  // 删除订单
  const handleDelOrder = (orderNo:string,e:any) => {
    e.stopPropagation()
    Taro.showModal({
      title:'提示',
      content:'确定删除这条订单？',
      success:res=>{
        if(res.confirm){
          const newArr = orderList.filter(item=>item.orderNo !== orderNo)
          Taro.setStorageSync('order_list', newArr)
          setOrderList(newArr)
        }
      }
    })
  }

  // 确认收货
  const handleConfirmReceive = (orderNo:string,e:any) => {
    e.stopPropagation()
    const arr = orderList.map(item=>{
      if(item.orderNo === orderNo){
        return {...item, status:3}
      }
      return item
    })
    Taro.setStorageSync('order_list',arr)
    setOrderList(arr)
  }

  return (
    <View className='order-list-page'>
      {/* tab头部 */}
      <ScrollView className='tab-scroll' scrollX>
        <View className='tab-wrap'>
          {tabList.map(tab=>(
            <View
              key={tab.key}
              className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={()=>setActiveTab(tab.key)}
            >
              {tab.title}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className='order-container'>
        {filterList().length === 0 ? (
          <View className='empty'>
            <Text className='empty-text'>暂无订单</Text>
          </View>
        ) : (
          filterList().map(order=>(
            <View className='order-card' key={order.orderNo} onClick={()=>goDetail(order.orderNo)}>
              <View className='order-head'>
                <Text className='order-no'>订单号：{order.orderNo}</Text>
                <Text className='status-text'>{order.statusText}</Text>
              </View>

              <View className='goods-row'>
                {order.goodsList.map(g=>(
                  <Image key={g.id} className='thumb' src={g.picUrl} mode='aspectFill' />
                ))}
              </View>

              <View className='order-footer'>
                <Text className='total'>实付 ¥{order.totalAmount.toFixed(2)}</Text>
                <View className='btn-group'>
                  {order.status === 0 && <Button className='btn btn-pay' onClick={(e)=>e.stopPropagation()}>去付款</Button>}
                  {order.status === 2 && <Button className='btn btn-confirm' onClick={handleConfirmReceive.bind(null,order.orderNo)}>确认收货</Button>}
                  <Button className='btn btn-del' onClick={handleDelOrder.bind(null,order.orderNo)}>删除订单</Button>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  )
}

export default OrderList
