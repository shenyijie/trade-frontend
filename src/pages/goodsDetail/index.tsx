import {useState, useEffect} from 'react'
import Taro, {useLoad, useDidShow, useRouter} from '@tarojs/taro'
import {View, Image, Text, Button} from '@tarojs/components'
import {apiGetGoodsDetail} from '@/api'
import {CartItem, GoodsItem} from "@/types";
import {BASE_URL} from "@/constants";
import {buildCartItem} from "@/utils/cart";
import './index.scss'


export default function GoodsDetail() {
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const [goods, setGoods] = useState<GoodsItem | null>(null)
  const [count, setCount] = useState(1)

  // 获取路由传来商品id
  const goodsId = Number(router.params.id)

  useEffect(() => {
    if (!goodsId) {
      void Taro.showToast({title: '参数错误', icon: 'none'})
      return
    }
    void fetchDetail()
  }, [goodsId])

  const fetchDetail = async () => {
    try {
      const res = await apiGetGoodsDetail(goodsId)
      setGoods(res)
    } catch (err) {
      await Taro.showToast({title: '获取详情失败', icon: 'none'})
    }
  }

  // 从本地存储计算购物车总件数
  const refreshCartCount = () => {
    try {
      const str = Taro.getStorageSync('cart_list')
      if (!str) {
        setCartCount(0);
        return
      }
      const list = JSON.parse(str)
      const total = list.reduce((sum: number, item: any) => sum + item.count, 0)
      setCartCount(total)
    } catch (e) {
      console.error('读取购物车数量失败', e)
    }
  }

  useLoad(() => {
    refreshCartCount()
  })
  useDidShow(() => {
    refreshCartCount()
  })   // 从购物车返回时刷新角标

  const goCart = () => {
    void Taro.navigateTo({url: '/pages/cart/index'})
  }

  // 数量加减
  const handleAdd = () => {
    if (!goods) return
    if (count >= goods.stock) {
      void Taro.showToast({title: '超出库存', icon: 'none'})
      return
    }
    setCount(v => v + 1)
  }
  const handleMinus = () => {
    if (count <= 1) return
    setCount(v => v - 1)
  }

  // 加入购物车（这里先做toast提示，后面对接购物车存储）
  // 加入购物车
  const handleAddCart = () => {
    if (!goods) return

    // 1. 读取本地购物车（同步，无需链式）
    let list: CartItem[] = []
    try {
      const str = Taro.getStorageSync('cart_list')
      if (str) list = JSON.parse(str)
    } catch (e) {
      console.error('读取购物车失败', e)
    }

    // 2. 已有商品累加，没有则新增
    const existIndex = list.findIndex((item: CartItem) => item.id === goods.id)
    if (existIndex >= 0) {
      list[existIndex].count += count
    } else {
      list.push(buildCartItem(goods, count))
    }

    // 3. 写回
    Taro.setStorageSync('cart_list', JSON.stringify(list))

    // 4. 提示（void 消除 floating promise 警告）
    void Taro.showToast({title: '已加入购物车', icon: 'success'})

    // 5. 刷新悬浮球角标（如果做了购物车悬浮球）
    refreshCartCount()
  }


  if (!goods) {
    return <View className='detail-page loading'>加载中...</View>
  }

  return (
    <View className='detail-page'>
      {/* 商品大图 */}
      <Image className='detail-img' src={`${BASE_URL}${goods.picUrl}`} mode='aspectFill' />

      <View className='detail-info'>
        <Text className='price'>¥{goods.price.toFixed(2)}</Text>
        <Text className='title'>{goods.name}</Text>
        {/*<Text className='stock'>库存：{goods.stock} 件｜产地：{goods.origin}</Text>*/}
        <Text className='stock'>库存：{goods.stock} 件</Text>
      </View>

      <View className='detail-desc'>
        <Text className='desc-title'>商品介绍</Text>
        <Text className='desc-text'>{goods.description}</Text>
      </View>

      {/* 选择数量 */}
      <View className='count-wrap'>
        <Text>购买数量</Text>
        <View className='count-box'>
          <Button className='btn-minus' onClick={handleMinus}>-</Button>
          <Text className='num'>{count}</Text>
          <Button className='btn-add' onClick={handleAdd}>+</Button>
        </View>
      </View>

      {/* 底部操作栏：购物车入口 + 两个按钮 */}
      <View className='detail-footer'>
        <View className='footer-cart' onClick={goCart}>
          <Text className='footer-cart-icon'>🛒</Text>
          {cartCount > 0 && (
            <View className='footer-cart-badge'>{cartCount > 99 ? '99+' : cartCount}</View>
          )}
        </View>
        <Button className='btn-base btn-cart' onClick={handleAddCart}>加入购物车</Button>
        <Button className='btn-base btn-buy'>立即购买</Button>
      </View>

    </View>
  )
}
