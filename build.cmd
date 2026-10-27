:: 删除Taro编译缓存文件夹 .taro
rmdir /s /q .taro

:: 删除编译输出dist文件夹
rmdir /s /q dist

:: 启动微信小程序开发模式
npm run dev:weapp
