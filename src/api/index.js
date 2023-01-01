// 引入自封装axios
import requests from "./request"

export const adduser = (data) => requests({
    url: '/signup/adduser',
    method: 'post',
    data
})

export const nameinuse = (name) => requests({ url: `/signup/nameinuse/${name}`, method: 'get' })

export const emailinuse = (email) => requests({ url: `/signup/emailinuse/${email}`, method: 'get' })

