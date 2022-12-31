// 引入自封装axios
import requests from "./request"

export const adduser = (data) => requests({
    url: '/signup/adduser',
    method: 'post',
    data
})

export const nameinuse = (data) => requests({
    url: '/signup/nameinuse',
    method: 'post',
    data
})

export const emailinuse = (data) => requests({
    url: '/signup/emailinuse',
    method: 'post',
    data
})