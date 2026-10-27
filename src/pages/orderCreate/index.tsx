import {useState, useEffect} from 'react'
import {View, Text, Image, Textarea} from '@tarojs/components'
import Taro, {getCurrentInstance, useDidShow} from '@tarojs/taro'
import {AddressItem, CartItem} from '@/types'
import './index.scss'
import {BASE_URL} from "@/constants";


const OrderCreate = () => {
  const [goodsList, setGoodsList] = useState<CartItem[]>([])
  const [addressInfo, setAddressInfo] = useState<AddressItem | null>(null)
  const [remark, setRemark] = useState<string>('')

  useEffect(() => {
    const instance = getCurrentInstance()
    const query = instance.router?.params
    if (query?.goods) {
      try {
        const decodeStr = decodeURIComponent(query.goods as string)
        const list: CartItem[] = JSON.parse(decodeStr)
        setGoodsList(list)
      } catch (err) {
        console.error('解析商品参数异常', err)
      }
    }
  }, [])

  // ✅重点：每次页面显示都会执行，从地址页返回自动刷新
  useDidShow(() => {
    try {
      const addr = Taro.getStorageSync('default_address')
      if (addr) {
        setAddressInfo(addr)
      }
    } catch (e) {
      console.error('读取地址', e)
    }
  })

  const totalPrice = goodsList.reduce((sum, item) => {
    return sum + Number(item.price) * item.count
  }, 0)

  const goSelectAddress = () => {
    Taro.navigateTo({url: '/pages/addressList/index'})
  }

  const handleSubmitOrder = async () => {
    if (!addressInfo) {
      Taro.showToast({title: '请选择收货地址', icon: 'none'})
      return
    }
    if (goodsList.length === 0) {
      Taro.showToast({title: '没有订单商品', icon: 'none'})
      return
    }

    // 1.组装完整收货地址字符串
    const fullAddress = `${addressInfo.province}${addressInfo.city}${addressInfo.district}${addressInfo.detail}`

    // 组装订单数据（后续传给后端接口）
    const orderData = {
      name: addressInfo.name,
      phone: addressInfo.phone,
      address: fullAddress,
      remark,
      goodsList,
      totalPrice
    }
    console.log('提交订单数据', orderData)

    // ==========模拟创建订单，这里后面替换成后端请求==========
    const mockOrderNo = `ORD${Date.now()}` //模拟订单号
    // ======================================================

    // 清空购物车选中商品（保留逻辑）
    try {
      const cartStr = Taro.getStorageSync('cart_list')
      let cartAll: any[] = []
      if (cartStr) cartAll = JSON.parse(cartStr)
      const submitIds = goodsList.map(g => g.id)
      const newCart = cartAll.filter(item => !submitIds.includes(item.id))
      Taro.setStorageSync('cart_list', JSON.stringify(newCart))
    } catch (e) {
      console.error('清理购物车失败', e)
    }

    await Taro.showToast({title: '订单创建成功', icon: 'success', duration: 800})

    // ✅不再 navigateBack，跳转到支付页面，把订单号、金额传过去
    setTimeout(() => {
      Taro.navigateTo({
        url: `/pages/payOrder/index?orderNo=${mockOrderNo}&total=${totalPrice.toFixed(2)}`
      })
    }, 800)
  }


  return (
    <View className='order-create-page'>
      {/* 地址卡片 */}
      <View className='address-box' onClick={goSelectAddress}>
        {addressInfo ? (
          <View>
            <Text className='name'>{addressInfo.name}</Text>
            <Text className='phone'> {addressInfo.phone}</Text>
            <View className='address-text'>
              {addressInfo.province}{addressInfo.city}{addressInfo.district}{addressInfo.detail}
            </View>
          </View>
        ) : (
          <Text className='tip'>请选择收货地址</Text>
        )}
      </View>


      {/* 商品卡片 */}
      <View className='goods-wrap'>
        {goodsList.map((item) => (
          <View className='goods-item' key={item.id}>
            <Image className='goods-img' src={`${BASE_URL}${item.picUrl}`} mode='aspectFill' />
            <View className='goods-info'>
              <Text className='goods-name'>{item.name}</Text>
              {/* 规格，和购物车/订单页一致 */}
              <View className='goods-spec'>{item.spec || '默认规格'}</View>
              <View className='goods-bottom'>
                <Text className='price'>¥{item.price.toFixed(2)}</Text>
                <Text className='count'>×{item.count}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 备注卡片 */}
      <View className='remark-box'>
        <Textarea
          placeholder='请输入订单备注（选填）'
          value={remark}
          onInput={(e) => setRemark(e.detail.value)}
        />
      </View>

      {/* 底部悬浮结算栏 */}
      <View className='footer-bar'>
        <View className='total-text'>
          <Text>商品合计：</Text>
          <Text className='money'>¥{totalPrice.toFixed(2)}</Text>
        </View>
        <View className='submit-btn' onClick={handleSubmitOrder}>
          <Text>提交订单</Text>
        </View>
      </View>
    </View>
  )
}

export default OrderCreate
