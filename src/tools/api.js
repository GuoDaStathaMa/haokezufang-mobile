import axios from 'axios'
const API = axios.create({
  baseURL: 'http://localhost:8080'
})

// 添加响应拦截器
API.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export { API }
