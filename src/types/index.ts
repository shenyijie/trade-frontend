export interface GoodsItem  {
  id: number;
  name: string;
  picUrl: string;
  spec?: string;
  price: number
  stock: number;
  description: string;
  origin: string;
}

// 购物车项：从商品派生，去掉详情字段，加上购物车专属字段
// 不再手写 id/name/picUrl/price/stock 的类型！
export type CartItem = Omit<GoodsItem, 'description' | 'origin' | 'spec'> & {
  spec: string         // 购物车里必填（构造时兜底）
  count: number
  selected: boolean
}

// 收货地址
export interface AddressItem {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

// 订单商品项
export interface OrderGoodsItem {
  id: number
  goodsName: string
  picUrl: string
  price: number
  count: number
}

// 类型定义
export interface CategoryItem {
  id: number
  name: string
  sort: number
}

export interface OrderItem {
  orderNo:string
  status:number //0待付款，1待发货，2待收货，3已完成
  statusText:string
  totalAmount:number
  createTime:string
  goodsList:OrderGoodsItem[]
  address:AddressItem
  remark:string
}
