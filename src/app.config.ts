// src/app.config.ts
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/goodsDetail/index',
    'pages/cart/index',
    'pages/orderCreate/index',
    'pages/orderList/index',
    'pages/my/index',
    'pages/addressList/index',
    'pages/payOrder/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#07C160',
    navigationBarTitleText: '彩西施商贸',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666666',        //未选中文字颜色（灰色）
    selectedColor: '#07C160',//选中文字颜色（果蔬绿，和导航栏统一）
    backgroundColor: '#ffffff', //tab栏背景白色
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      // {
      //   pagePath: 'pages/cart/index',
      //   text: '购物车',
      //   iconPath: 'assets/tabbar/cart.png',
      //   selectedIconPath: 'assets/tabbar/cart-active.png'
      // },
      {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: 'assets/tabbar/profile.png',
        selectedIconPath: 'assets/tabbar/profile-active.png'
      }
    ]
  }
})
