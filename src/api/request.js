import axios from 'axios'

// 引入vuex，是为了判断用户是否登录
import store from '@/store'

const requests = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
})

requests.interceptors.request.use((config) => {
    if (store.state.User.token) {
        // 设置请求头带token
        config.headers.token = store.state.User.token
    }
    return config
})

requests.interceptors.response.use((res) => {
    return res.data
}, (error) => {
    return Promise.reject(new Error('faile'))
})

export default requests