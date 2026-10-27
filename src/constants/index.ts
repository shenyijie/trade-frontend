// src/constants/index.ts
// constants/index.ts
export const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8080'           // 本地调试
  : 'https://api.cxs.com'             // 上线必须 https


export const API_URL = BASE_URL + '/api'
