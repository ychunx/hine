import axios from "axios";

import { getToken } from "@/utils/token";

const requests = axios.create({
  // 接口服务器基地址
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

requests.interceptors.request.use((config) => {
  let token = getToken();
  if (token) {
    // 设置请求头带token
    config.headers.token = token;
  }
  return config;
});

requests.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    return Promise.reject(new Error("faile"));
  }
);

export default requests;
