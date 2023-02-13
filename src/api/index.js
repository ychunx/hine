// 引入自封装axios
import requests from "./request";

export const addUser = (data) =>
  requests({ url: "/signup/adduser", method: "post", data });

export const nameInUse = (name) =>
  requests({ url: `/signup/nameinuse/${name}`, method: "get" });

export const emailInUse = (email) =>
  requests({ url: `/signup/emailinuse/${email}`, method: "get" });

export const login = (data) =>
  requests({ url: "/signin/login", method: "post", data });

export const reqUserInfo = () =>
  requests({ url: "/signin/getUserInfo", method: "get" });

//export const logout = () => requests({ url: '/signin/logout', method: 'get' })

export const searchUser = (data) =>
  requests({ url: "/search/user", method: "post", data });

export const relation = (data) =>
  requests({ url: "/search/relation", method: "post", data });

export const searchGroup = (data) =>
  requests({ url: "/search/group", method: "post", data });

export const isInGroup = (data) =>
  requests({ url: "/search/isingroup", method: "post", data });

//export const friendApply = (data) => requests({ url: '/friend/apply', method: 'post', data })

export const getFriendApplys = () =>
  requests({ url: "/friend/getfriendapplys", method: "get" });

//export const agreeApply = (data) => requests({ url: '/friend/agree', method: 'post', data })

export const rejectApply = (data) =>
  requests({ url: "/friend/reject", method: "post", data });

export const reqFriends = () =>
  requests({ url: "/friend/getfriends", method: "get" });

export const deleteFriend = (data) =>
  requests({ url: "/friend/delete", method: "post", data });

export const reqAllMsgs = () =>
  requests({ url: "/chat/getallmsgs", method: "get" });

export const readFriendMsgs = (data) =>
  requests({ url: "/chat/readfriendmsgs", method: "post", data });

export const modifyName = (data) =>
  requests({ url: "/detail/name", method: "post", data });

export const modifyEmail = (data) =>
  requests({ url: "/detail/email", method: "post", data });

export const modifyPwd = (data) =>
  requests({ url: "/detail/pwd", method: "post", data });

export const modifySex = (data) =>
  requests({ url: "/detail/sex", method: "post", data });

export const modifyBirth = (data) =>
  requests({ url: "/detail/birth", method: "post", data });

export const modifySignature = (data) =>
  requests({ url: "/detail/signature", method: "post", data });

export const modifymodifyPortraitUrl = (data) =>
  requests({ url: "/detail/portrait", method: "post", data });

export const modifyNickname = (data) =>
  requests({ url: "/detail/nickname", method: "post", data });

export const uploadPortrait = (data) =>
  requests({
    url: "/upload/portrait",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadGroupPortrait = (data) =>
  requests({
    url: "/upload/groupportrait",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadImage = (data) =>
  requests({
    url: "/upload/image",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadGroupImage = (data) =>
  requests({
    url: "/upload/groupimage",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const reqAllEncryptedMsgs = () =>
  requests({ url: "/chat/getallencryptedmsgs", method: "get" });

export const readFriendEncryptedMsgs = (data) =>
  requests({ url: "/chat/readfriendencryptedmsgs", method: "post", data });

export const deleteFriendMsgs = (data) =>
  requests({ url: "/chat/delete", method: "post", data });

export const deleteFriendEncryptedMsgs = (data) =>
  requests({ url: "/chat/deleteencrypted", method: "post", data });

export const groupNameInUse = (name) =>
  requests({ url: `/group/nameinuse/${name}`, method: "get" });

export const buildGroup = (data) =>
  requests({ url: "/group/build", method: "post", data });

export const reqAllGroupMsgs = () =>
  requests({ url: "/chat/getallgroupmsgs", method: "get" });

export const readGroupMsgs = (data) =>
  requests({ url: "/chat/readgroupmsgs", method: "post", data });
