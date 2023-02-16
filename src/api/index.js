// 引入自封装axios
import requests from "./request";

// 注册
export const addUser = (data) =>
  requests({ url: "/signup/adduser", method: "post", data });

// 检查用户名是否被占用
export const nameInUse = (name) =>
  requests({ url: `/signup/nameinuse/${name}`, method: "get" });

// 检查邮箱是否被占用
export const emailInUse = (email) =>
  requests({ url: `/signup/emailinuse/${email}`, method: "get" });

// 登录
export const login = (data) =>
  requests({ url: "/signin/login", method: "post", data });

// 请求用户信息
export const reqUserInfo = () =>
  requests({ url: "/signin/getUserInfo", method: "get" });

//export const logout = () => requests({ url: '/signin/logout', method: 'get' })

// 搜索用户
export const searchUser = (data) =>
  requests({ url: "/search/user", method: "post", data });

// 查询用户关系
export const relation = (data) =>
  requests({ url: "/search/relation", method: "post", data });

// 搜索群组
export const searchGroup = (data) =>
  requests({ url: "/search/group", method: "post", data });

// 查询用户是否在群组内
export const isInGroup = (data) =>
  requests({ url: "/search/isingroup", method: "post", data });

// 获取好友请求列表
export const getFriendApplys = () =>
  requests({ url: "/friend/getfriendapplys", method: "get" });

// 拒绝好友请求
export const rejectApply = (data) =>
  requests({ url: "/friend/reject", method: "post", data });

// 获取好友列表
export const reqFriends = () =>
  requests({ url: "/friend/getfriends", method: "get" });

// 删除好友
export const deleteFriend = (data) =>
  requests({ url: "/friend/delete", method: "post", data });

// 获取好友非加密消息
export const reqAllMsgs = () =>
  requests({ url: "/chat/getallmsgs", method: "get" });

// 已读好友非加密消息
export const readFriendMsgs = (data) =>
  requests({ url: "/chat/readfriendmsgs", method: "post", data });

// 更新用户名
export const modifyName = (data) =>
  requests({ url: "/detail/name", method: "post", data });

// 更新邮件地址
export const modifyEmail = (data) =>
  requests({ url: "/detail/email", method: "post", data });

// 更改密码
export const modifyPwd = (data) =>
  requests({ url: "/detail/pwd", method: "post", data });

// 更新性别
export const modifySex = (data) =>
  requests({ url: "/detail/sex", method: "post", data });

// 更新出生日期
export const modifyBirth = (data) =>
  requests({ url: "/detail/birth", method: "post", data });

// 更新个性签名
export const modifySignature = (data) =>
  requests({ url: "/detail/signature", method: "post", data });

// 更新头像
export const modifymodifyPortraitUrl = (data) =>
  requests({ url: "/detail/portrait", method: "post", data });

// 更新好友昵称
export const modifyNickname = (data) =>
  requests({ url: "/detail/nickname", method: "post", data });

// 上传头像图片
export const uploadPortrait = (data) =>
  requests({
    url: "/upload/portrait",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 上传群组头像图片
export const uploadGroupPortrait = (data) =>
  requests({
    url: "/upload/groupportrait",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 上传好友聊天图片
export const uploadImage = (data) =>
  requests({
    url: "/upload/image",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 上传群组聊天图片
export const uploadGroupImage = (data) =>
  requests({
    url: "/upload/groupimage",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 获取好友加密消息
export const reqAllEncryptedMsgs = () =>
  requests({ url: "/chat/getallencryptedmsgs", method: "get" });

// 已读好友加密消息
export const readFriendEncryptedMsgs = (data) =>
  requests({ url: "/chat/readfriendencryptedmsgs", method: "post", data });

// 删除好友消息
export const deleteFriendMsgs = (data) =>
  requests({ url: "/chat/delete", method: "post", data });

// 删除好友加密消息
export const deleteFriendEncryptedMsgs = (data) =>
  requests({ url: "/chat/deleteencrypted", method: "post", data });

// 查询群组名称是否被占用
export const groupNameInUse = (name) =>
  requests({ url: `/group/nameinuse/${name}`, method: "get" });

// 建立群组
export const buildGroup = (data) =>
  requests({ url: "/group/build", method: "post", data });

// 获取群组消息
export const reqAllGroupMsgs = () =>
  requests({ url: "/chat/getallgroupmsgs", method: "get" });

// 已读群组消息
export const readGroupMsgs = (data) =>
  requests({ url: "/chat/readgroupmsgs", method: "post", data });

// 通过用户 id 获取用户信息
export const getUserInfoById = (data) =>
  requests({ url: "/detail/getuserinfobyid", method: "post", data });

// 通过群组 id 获取群组信息
export const getGroupInfoById = (data) =>
  requests({ url: "/group/getgroupinfobyid", method: "post", data });

// 更新群组头像
export const updatePortrait = (data) =>
  requests({ url: "/group/updateportrait", method: "post", data });

// 更新群组名称
export const updateName = (data) =>
  requests({ url: "/group/updatename", method: "post", data });

// 更新群组公告
export const updateNotice = (data) =>
  requests({ url: "/group/updatenotice", method: "post", data });

// 邀请好友加入群组
export const groupInvite = (data) =>
  requests({ url: "/group/invite", method: "post", data });

// 移除群组成员，同时删除其消息
export const removeGroupMember = (data) =>
  requests({ url: "/group/removegroupmember", method: "post", data });

// 更新群内昵称
export const updateNickName = (data) =>
  requests({ url: "/group/updatenickname", method: "post", data });

// 退出群组
export const exitGroup = (data) =>
  requests({ url: "/group/exitgroup", method: "post", data });

// 解散群组
export const breakGroup = (data) =>
  requests({ url: "/group/breakgroup", method: "post", data });
