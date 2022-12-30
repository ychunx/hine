// 引入自封装axios
import requests from "./request"

export const test = () => requests({ url: '/', method: 'get' })

export const signup = (address) => requests({
    url: '/signup',
    method: 'post',
    data: {
        address
    }
})