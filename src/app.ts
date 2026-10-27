import Taro from '@tarojs/taro'
import { apiWxLogin } from '@/api'
import './app.scss'

// 小程序全局生命周期onLaunch
const onLaunch = async () => {
  try {
    const token = Taro.getStorageSync('token')
    if (token) {
      console.log('已有token，跳过登录')
      return
    }
    const wxRes = await Taro.login()
    const code = wxRes.code
    if (!code) {
      await Taro.showToast({title: '获取登录code失败', icon: 'none'})
      return
    }
    const loginResult = await apiWxLogin(code)
    console.log('登录成功 openid: ', loginResult.openId)
    Taro.setStorageSync('token', loginResult.token)
    Taro.setStorageSync('openid', loginResult.openId)
  } catch (err) {
    console.error('登录异常', err)
    await Taro.showToast({title: '登录失败，请重试', icon: 'none'})
  }
}

function App({ children }) {
  // 小程序启动触发登录
  onLaunch()
  // 核心！必须return children，解决【没有找到页面实例】
  return children
}

export default App
