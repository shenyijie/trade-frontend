import {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, ScrollView} from '@tarojs/components'
import {apiGetCategoryList, apiGetGoodsList} from '@/api'
import {BASE_URL} from "@/constants";
import {CategoryItem, GoodsItem} from "@/types";
import CartFloat from "@/components/CartFloat";
import './index.scss'


const Index = () => {
  // 当前选中分类，0=全部
  const [activeCatId, setActiveCatId] = useState<number>(0)
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([])
  const [goodsList, setGoodsList] = useState<GoodsItem[]>([])
  const [loading, setLoading] = useState(true)

  // 加载分类
  const loadCategory = async () => {
    try {
      const list = await apiGetCategoryList()
      // 兜底：接口返回null/undefined强制转为空数组，防止展开运算符报错
      const safeList = Array.isArray(list) ? list : []
      setCategoryList([{id: 0, name: '全部', sort: 0}, ...safeList])
    } catch (err) {
      console.error('加载分类失败', err)
      // 出错至少保留【全部】选项，页面不要直接崩溃
      setCategoryList([{id: 0, name: '全部', sort: 0}])
    }
  }

  // 加载商品，传入分类id，0查全部
  const loadGoods = async (catId: number) => {
    setLoading(true)
    try {
      const list = await apiGetGoodsList(catId === 0 ? undefined : catId)
      // 兜底，防止后端返回null
      const safeList = Array.isArray(list) ? list : []
      setGoodsList(safeList)
    } catch (err) {
      console.error('加载商品失败', err)
      setGoodsList([])
      await Taro.showToast({title: '商品加载失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }

  // 切换分类
  const handleChangeCat = (catId: number) => {
    setActiveCatId(catId)
    loadGoods(catId)
  }

  // 跳转到商品详情
  const goGoodsDetail = (goodsId: number) => {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${goodsId}`
    })
  }

  useEffect(() => {
    // useEffect内部调用异步函数，不直接传async给useEffect回调
    const init = async () => {
      await loadCategory()
      await loadGoods(0)
    }
    init()
  }, [])

  return (
    <View className='home-page'>
      {/* 横向滚动分类栏 */}
      <ScrollView className='cat-scroll' scrollX>
        <View className='cat-wrap'>
          {categoryList.map(cat => (
            <View
              key={cat.id}
              className={`cat-item ${activeCatId === cat.id ? 'active' : ''}`}
              onClick={() => handleChangeCat(cat.id)}
            >
              <Text>{cat.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 商品列表 */}
      <View className='goods-container'>
        {loading ? (
          <View className='loading-tip'><Text>加载中...</Text></View>
        ) : goodsList.length === 0 ? (
          <View className='empty-tip'><Text>暂无商品</Text></View>
        ) : (
          <View className='goods-list'>
            {goodsList.map(goods => (
              <View className='goods-card' key={goods.id} onClick={() => goGoodsDetail(goods.id)}>
                <Image className='goods-img' src={`${BASE_URL}${goods.picUrl}`} mode='aspectFit'
                  onError={(e) => console.log("图片加载失败", e)}
                ></Image>
                <View className='goods-info'>
                  <Text className='goods-name'>{goods.name}</Text>
                  <Text className='goods-price'>¥{goods.price.toFixed(2)}</Text>
                  <Text className='goods-stock'>库存： {goods.stock}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <CartFloat />
    </View>
  )
}

export default Index
