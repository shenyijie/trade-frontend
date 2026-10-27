// utils/cart.ts
import type {CartItem, GoodsItem} from '@/types'

// 展开 GoodsItem 自动带字段，不手写映射
export const buildCartItem = (goods: GoodsItem, count: number): CartItem => ({
  ...goods,                       // id/name/picUrl/price/stock 全部自动带上
  spec: goods.spec || '默认规格', // 兜底
  count,
  selected: true,
})
