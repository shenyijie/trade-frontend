import { useState, useEffect, useRef } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import type { AddressItem } from '@/types'
import './index.scss'

const AddressList = () => {
  const [addressList, setAddressList] = useState<AddressItem[]>([])
  const channelRef = useRef<any>(null)

  useEffect(() => {
    const list = Taro.getStorageSync('address_list') || []
    setAddressList(list)

    // 获取页面eventChannel，用于回传参数给上一页
    const page = getCurrentInstance().page
    if(page?.getOpenerEventChannel){
      channelRef.current = page.getOpenerEventChannel()
    }
  }, [])

  // 选择地址，回传给确认订单页面
  const handleSelectAddress = (item: AddressItem) => {
    // 把选中地址存为默认地址
    Taro.setStorageSync('default_address', item)
    if(channelRef.current){
      channelRef.current.emit('onSelectAddress', item)
    }
    Taro.navigateBack()
  }

  // 删除地址
  const handleDelete = (idx: number) => {
    const newList = [...addressList]
    newList.splice(idx, 1)
    setAddressList(newList)
    Taro.setStorageSync('address_list', newList)
  }

  // 模拟新增测试地址
  const addTestAddr = () => {
    const testAddr: AddressItem = {
      id: Date.now(),
      name: '刘先生',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '福田区',
      detail: '某某街道某某小区1栋101室',
      isDefault: true
    }
    const newList = [...addressList, testAddr]
    setAddressList(newList)
    Taro.setStorageSync('address_list', newList)
  }

  return (
    <View className='address-list-page'>
      {addressList.length === 0 ? (
        <View className='empty-wrap'>
          <Text className='empty-tip'>暂无收货地址</Text>
          <Button className='btn-test-add' onClick={addTestAddr}>生成测试地址</Button>
        </View>
      ) : (
        <View className='addr-container'>
          {addressList.map((item, index) => (
            <View className='addr-item' key={item.id} onClick={() => handleSelectAddress(item)}>
              <View className='name-phone'>
                <Text className='name'>{item.name}</Text>
                <Text className='phone'>{item.phone}</Text>
              </View>
              <View className='full-address'>
                {item.province}{item.city}{item.district}{item.detail}
              </View>
              <View className='operate'>
                <Button className='btn-del' onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(index)
                }}>删除</Button>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default AddressList
