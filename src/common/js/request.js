import axios from 'axios'
import utils from 'common/js/util'
import { notification } from 'antd'

const ACCESS_TOKEN = '__music_assess_token__'
// 创建 axios 实例
const request = axios.create({
    timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
    if (error.response) {
        const data = error.response.data
        // 从 localstorage 获取 token
        const token = utils.storage.get(ACCESS_TOKEN)
        if (error.response.status === 403) {
            notification.error({
                message: 'Forbidden',
                description: data.message
            })
        }
        if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
            notification.error({
                message: 'Unauthorized',
                description: 'Authorization verification failed'
            })
            if (token) {
                notification.warn(`no token`)
            }
        }
    }
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    const token = utils.storage.get(ACCESS_TOKEN)
    // 如果 token 存在
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
    return response
}, errorHandler)


export default request

