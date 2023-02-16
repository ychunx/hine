export default [
  // 首页
  {
    path: "/",
    redirect: "/msg",
  },

  // 消息页
  {
    path: "/msg",
    component: () => import("../pages/Msg"),
  },

  // 通讯录页
  {
    path: "/contacts",
    component: () => import("../pages/Contacts"),
  },

  // 更多页
  {
    path: "/more",
    component: () => import("../pages/More"),
  },

  // 搜索页
  {
    path: "/search",
    component: () => import("../pages/Search"),
  },

  // 登录页
  {
    path: "/login",
    component: () => import("../pages/Login"),
  },

  // 注册页
  {
    path: "/register",
    component: () => import("../pages/Register"),
  },

  // 申请页
  {
    path: "/apply",
    component: () => import("../pages/Apply"),
  },

  // 用户详情页
  {
    path: "/detail",
    component: () => import("../pages/Detail"),
  },

  // 群组详情页
  {
    path: "/groupdetail",
    component: () => import("../pages/Detail/GroupDetail"),
  },

  // 加密消息页
  {
    path: "/dialog",
    component: () => import("../pages/Msg/EncryptedDialog"),
  },

  // 群组消息页
  {
    path: "/groupdialog",
    component: () => import("../pages/Msg/GroupDialog"),
  },

  // 邀请页
  {
    path: "/invite",
    component: () => import("../pages/Contacts/Build"),
  },
];
