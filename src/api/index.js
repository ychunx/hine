// 引入自封装axios
import requests from "./request"

export const addUser = (data) => requests({ url: '/signup/adduser', method: 'post', data })

export const nameInUse = (name) => requests({ url: `/signup/nameinuse/${name}`, method: 'get' })

export const emailInUse = (email) => requests({ url: `/signup/emailinuse/${email}`, method: 'get' })

export const login = (data) => requests({ url: '/signin/login', method: 'post', data })

export const reqUserInfo = () => requests({ url: '/signin/getUserInfo', method: 'get' })

//export const logout = () => requests({ url: '/signin/logout', method: 'get' })

export const searchUser = (data) => requests({ url: '/search/user', method: 'post', data })

export const relation = (data) => requests({ url: '/search/relation', method: 'post', data })

export const searchGroup = (data) => requests({ url: '/search/group', method: 'post', data })

export const isInGroup = (data) => requests({ url: '/search/isingroup', method: 'post', data })

//export const friendApply = (data) => requests({ url: '/friend/apply', method: 'post', data })

export const getFriendApplys = () => requests({ url: '/friend/getfriendapplys', method: 'get' })

//export const agreeApply = (data) => requests({ url: '/friend/agree', method: 'post', data })

export const rejectApply = (data) => requests({ url: '/friend/reject', method: 'post', data })

export const reqFriends = () => requests({ url: '/friend/getfriends', method: 'get' })

export const deleteFriend = (data) => requests({ url: '/friend/delete', method: 'post', data })

export const reqAllMsgs = () => requests({ url: '/chat/getallmsgs', method: 'get' })

export const readFriendMsgs = (data) => requests({ url: '/chat/readfriendmsgs', method: 'post', data })
