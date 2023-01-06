// 引入自封装axios
import requests from "./request"

export const addUser = (data) => requests({
    url: '/signup/adduser',
    method: 'post',
    data
})

export const nameInUse = (name) => requests({ url: `/signup/nameinuse/${name}`, method: 'get' })

export const emailInUse = (email) => requests({ url: `/signup/emailinuse/${email}`, method: 'get' })

export const login = (data) => requests({
    url: '/signin/login',
    method: 'post',
    data
})

export const reqUserInfo = () => requests({ url: '/signin/getUserInfo', method: 'get' })

//export const logout = () => requests({ url: '/signin/logout', method: 'get' })

export const searchUser = (data) => requests({ url: '/search/user', method: 'post', data })

export const relation = (data) => requests({ url: '/search/relation', method: 'post', data })

export const searchGroup = (data) => requests({ url: '/search/group', method: 'post', data })

export const isInGroup = (data) => requests({ url: '/search/isingroup', method: 'post', data })