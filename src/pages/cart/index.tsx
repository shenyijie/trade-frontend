import {useState} from 'react'
import Taro, {useLoad, useDidShow} from '@tarojs/taro'
import {View, Image, Text, Button} from '@tarojs/components'
import type {CartItem} from '@/types'
import {BASE_URL} from "@/constants";
import './index.scss'

const Cart = () => {
  const [cartList, setCartList] = useState<CartItem[]>([])

  const readCartFromStorage = () => {
    console.log('🛒执行readCartFromStorage')
    const str = Taro.getStorageSync('cart_list')
    if (!str) {
      setCartList([])
      return
    }
    try {
      const list = JSON.parse(str)
      console.log('🛒读取到购物车：', list)
      setCartList(list)
    } catch (e) {
      console.error('🛒解析cart_list失败', e)
      setCartList([])
    }
  }

  useLoad(() => {
    readCartFromStorage()
  })

  useDidShow(() => {
    readCartFromStorage()
  })

  const totalPrice = cartList
    .filter(i => i.selected)
    .reduce((sum, item) => sum + item.price * item.count, 0)

  const selectedCount = cartList
    .filter(i => i.selected)
    .reduce((sum, item) => sum + item.count, 0)

  // 切换单个商品选中状态
  const toggleItemSelect = (id: number) => {
    const newCartList = cartList.map(goods => {
      if (goods.id === id) {
        return {...goods, selected: !goods.selected}
      }
      return goods
    })
    setCartList(newCartList)
    Taro.setStorageSync('cart_list', JSON.stringify(newCartList))
  }

  // 全选 / 取消全选
  const toggleAllSelect = () => {
    const allChecked = cartList.length > 0 && cartList.every(i => i.selected)
    const newCartList = cartList.map(g => ({...g, selected: !allChecked}))
    setCartList(newCartList)
    Taro.setStorageSync('cart_list', JSON.stringify(newCartList))
  }

  const changeCount = (id: number, delta: number) => {
    const newList = cartList.map(item => {
      if (item.id === id) {
        const newCnt = item.count + delta
        return {...item, count: newCnt < 1 ? 1 : newCnt}
      }
      return item
    })
    setCartList(newList)
    Taro.setStorageSync('cart_list', JSON.stringify(newList))
  }

  const deleteItem = (id: number) => {
    const newList = cartList.filter(item => item.id !== id)
    setCartList(newList)
    Taro.setStorageSync('cart_list', JSON.stringify(newList))
  }

  const handleSettle = () => {
    const selected = cartList.filter(i => i.selected)
    console.log('🛒选中商品：', selected)
    if (selected.length === 0) {
      void Taro.showToast({title: '请选择商品', icon: 'none'})
      return
    }
    const goodsStr = encodeURIComponent(JSON.stringify(selected))
    void Taro.navigateTo({
      url: `/pages/orderCreate/index?goods=${goodsStr}`
    })
  }

  const goHome = () => {
    void Taro.switchTab({url: '/pages/index/index'})
  }

  return (
    <View className='cart-page'>

      {cartList.length === 0 ? (
        <View className='cart-empty-wrap'>
          <View className='empty-icon'>🛒</View>
          <Text className='empty-desc'>购物车还是空的</Text>
          <Text className='empty-tip'>快去挑选心仪的商品吧</Text>
          <Button className='empty-go-home-btn' onClick={goHome}>去逛逛</Button>
        </View>
      ) : (
        <>
          {/* 商品列表 */}
          <View className='cart-list'>
            {cartList.map(item => (
              <View className='cart-item' key={item.id}>
                {/* 圆形勾选 */}
                <View
                  className={`check ${item.selected ? 'active' : ''}`}
                  onClick={() => toggleItemSelect(item.id)}
                >
                  {item.selected && <Text className='check-mark'>✓</Text>}
                </View>

                {/* 商品小图 */}
                <Image className='goods-img' src={`${BASE_URL}${item.picUrl}`} mode='aspectFill' />

                {/* 信息区 */}
                <View className='goods-body'>
                  <Text className='goods-name'>{item.name}</Text>
                  {/* 规格标签 */}
                  <View className='goods-spec'>{item.spec || '默认规格'}</View>
                  <View className='goods-bottom'>
                    <Text className='goods-price'>¥{item.price.toFixed(2)}</Text>
                    <View className='stepper'>
                      <View className='stepper-btn' onClick={() => changeCount(item.id, -1)}>-</View>
                      <Text className='stepper-num'>{item.count}</Text>
                      <View className='stepper-btn' onClick={() => changeCount(item.id, 1)}>+</View>
                    </View>
                  </View>
                </View>

                {/* 右上角小叉删除 */}
                <View className='cart-del' onClick={() => deleteItem(item.id)}>×</View>
              </View>
            ))}
          </View>

          {/* 底部结算栏 */}
          <View className='cart-footer'>
            <View
              className={`check ${cartList.length > 0 && cartList.every(i => i.selected) ? 'active' : ''}`}
              onClick={toggleAllSelect}
            >
              {cartList.length > 0 && cartList.every(i => i.selected) && <Text className='check-mark'>✓</Text>}
            </View>
            <Text className='all-text'>全选</Text>
            <View className='total-info'>
              <Text>合计：<Text className='red'>¥{totalPrice.toFixed(2)}</Text></Text>
            </View>
            <Button className='btn-settle' onClick={handleSettle}>去结算({selectedCount})</Button>
          </View>
        </>
      )}
    </View>
  )
}

export default Cart
