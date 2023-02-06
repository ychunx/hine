export default [
  {
    path: "/",
    redirect: "/msg",
  },
  {
    path: "/msg",
    component: () => import("../pages/Msg"),
  },
  {
    path: "/contacts",
    component: () => import("../pages/Contacts"),
  },
  {
    path: "/more",
    component: () => import("../pages/More"),
  },
  {
    path: "/search",
    component: () => import("../pages/Search"),
  },
  {
    path: "/login",
    component: () => import("../pages/Login"),
  },
  {
    path: "/register",
    component: () => import("../pages/Register"),
  },
  {
    path: "/apply",
    component: () => import("../pages/Apply"),
  },
  {
    path: "/detail",
    component: () => import("../pages/Detail"),
  },
  {
    path: "/dialog",
    component: () => import("../pages/Msg/EncryptedDialog"),
  },
];
