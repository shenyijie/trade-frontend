import {useState, useRef} from 'react'
import Taro, {useDidShow} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'

const CartFloat = () => {
  const [count, setCount] = useState(0)
  const [y, setY] = useState(0)                 // 只保留Y偏移
  const startRef = useRef({x: 0, y: 0, moved: false})
  const yRef = useRef(0)                        // 实时Y偏移

  const refresh = () => {
    try {
      const str = Taro.getStorageSync('cart_list')
      const list = str ? JSON.parse(str) : []
      setCount(list.reduce((sum: number, item: any) => sum + item.count, 0))
    } catch (e) {
      setCount(0)
    }
  }

  useDidShow(() => refresh())

  const onTouchStart = (e: any) => {
    const t = e.touches[0]
    startRef.current = {x: t.clientX, y: t.clientY, moved: false}
  }

  const onTouchMove = (e: any) => {
    const t = e.touches[0]
    const dy = t.clientY - startRef.current.y
    if (Math.abs(dy) > 3) startRef.current.moved = true

    // 边界：状态栏下方 ↔ tabBar上方
    const win = Taro.getWindowInfo()
    const statusBar = win.statusBarHeight || 44
    const initTop = win.windowHeight - 220      // 初始球顶（bottom:120 + 球高100）
    const minTop = statusBar + 10
    const maxTop = win.windowHeight - 100 - 50 - 20

    const newTop = Math.max(minTop, Math.min(maxTop, initTop + yRef.current + dy))
    const ny = newTop - initTop

    yRef.current = ny
    setY(ny)

    startRef.current = {x: t.clientX, y: t.clientY, moved: startRef.current.moved}
  }

  const onTouchEnd = () => {
    // 没拖动 = 点击 → 进购物车
    if (!startRef.current.moved) {
      Taro.navigateTo({url: '/pages/cart/index'})
    }
  }

  return (
    <View
      className='cart-float'
      style={{transform: `translateY(${y}px)`}}   // ⭐ 只用translateY，X永远靠右
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Text className='cart-float-icon'>🛒</Text>
      {count > 0 && (
        <View className='cart-float-badge'>{count > 99 ? '99+' : count}</View>
      )}
    </View>
  )
}

export default CartFloat
