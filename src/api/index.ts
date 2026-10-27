// src/api/index.ts
import {GoodsItem} from "@/types";
import request from '../utils/request'


// 登录
export function apiWxLogin(code: string): Promise<{ openId: string, token:string }> {
  return request<{ openId: string, token:string }>({
    url: '/wx/login',
    method: 'POST',
    data: {code}
  })
}

// 获取分类列表
export function apiGetCategoryList() {
  return request<Array<{ id: number; name: string; sort: number }>>({
    url: '/category/list'
  })
}

// 获取商品列表
export function apiGetGoodsList(categoryId?: number): Promise<GoodsItem[]> {
  const params: Record<string, number> = {}
  if (categoryId !== undefined) {
    params.categoryId = categoryId
  }
  return request<GoodsItem[]>({
    url: '/goods/list',
    method: 'GET',
    data: params
  })
}

// 获取商品详情
export async function apiGetGoodsDetail(id: number): Promise<GoodsItem> {
  return request<GoodsItem>({
    url: `/goods/good/${id}`,
    method: 'GET'
  })
}

// 获取会员信息
export function apiGetMemberInfo(openid: string) {
  return request<any>({
    url: '/member/info',
    data: {openid}
  })
}

// 积分流水
export function apiGetIntegralLog(openid: string) {
  return request<any[]>({
    url: '/member/integralLog',
    data: {openid}
  })
}

// 创建订单
export function apiCreateOrder(openid: string, data: any) {
  return request<any>({
    url: '/order/create',
    method: 'POST',
    data,
    header: {params: {openid}}
  })
}

// 我的订单列表
export function apiMyOrderList(openid: string) {
  return request<any[]>({
    url: '/order/myList',
    data: {openid}
  })
}

// 订单详情
export function apiOrderDetail(id: number) {
  return request<any>({url: `/order/${id}`})
}
