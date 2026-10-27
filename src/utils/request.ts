// src/utils/request.ts
import Taro from '@tarojs/taro'
import {API_URL} from "@/constants";

type RequestOption = Taro.request.Option

async function request<T>(option: RequestOption): Promise<T> {
  const {url, data: reqData, method = 'GET', header = {}} = option

  const res: Taro.request.SuccessCallbackResult<any> = await Taro.request({
    url: API_URL + url,
    data: reqData,
    method,
    header: {
      ...header,
      'content-type': 'application/json'
    }
  })

  const {code, msg, data: respData} = res.data
  // 后端业务成功码为200
  if (code !== 200) {
    await Taro.showToast({title: msg || '请求失败', icon: 'none'})
    throw new Error(msg || '请求失败')
  }
  return respData as T
}

export default request
