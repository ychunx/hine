# Hine

Hine 是一款即时通讯应用的 Vue 2 前端，页面按手机单栏排版，在浏览器里会铺满窗口。它包含注册登录、好友与群组、一对一聊天、群聊，以及需要密码才能打开的加密私聊。资料和历史记录走 HTTP，在线状态和实时消息走 Socket.IO。服务端是独立仓库 [hine-server](https://github.com/ychunx/hine-server)，本仓库只包含前端。

## 主要功能

- **账号。** 用用户名和邮箱注册，提交前会检查是否已被占用。登录可以用邮箱或用户名。成功后把 token 存进 `localStorage`。未登录访问业务页会去登录页；已登录不能再进登录和注册页；token 失效会清掉登录态并回到登录页。
- **消息。** 首页是会话列表，展示最后一条内容、时间和未读数。好友会话可以发文字和图片，打开后会把该会话标为已读。
- **加密私聊。** 私钥用登录密码做 AES 解密。刚登录时直接用这次输入的密码；刷新后 Vuex 里没有密码，需要在消息页再输入一次才能查看。发送时同一段文字分别用对方公钥和自己的公钥做 RSA 加密，用 `|` 拼起来交给服务端，本地再用私钥解密。加密会话目前只发送文字。
- **群组。** 从好友里至少选一个人建群，群名不能重复，可以上传群头像。群聊支持文字和图片。群主可以改名称、头像和公告，也能邀请或移除成员；成员可以改群内昵称、退出群组；群主可以解散群组。
- **通讯录与搜索。** 通讯录列出好友，并能同意或拒绝好友申请，也可以从好友发起加密对话。顶栏搜索按关键词查用户和群组：已是好友或已在群里显示「发信息」，否则可以加好友或申请加入群组。
- **个人资料。** 可以改头像、个性签名、性别、生日、用户名、邮箱和密码。退出登录会先通知下线，再清除本地 token。收到服务端的 `forceOffline` 时，页面会退出并刷新。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Vue 2.6、Vue Router 3、Vuex 3 |
| 构建 | Vue CLI 5（`@vue/cli-service`）、Babel |
| 请求 | Axios |
| 实时 | 仓库自带的 Socket.IO 客户端 `src/utils/weapp.socket.io.js` |
| 样式 | Less |
| 加密 | JSEncrypt（RSA）、crypto-js（AES） |
| 检查 | ESLint。`vue.config.js` 里关闭了保存时检查 |

## 项目结构

```text
.
├── public/                 # index.html、favicon
├── src/
│   ├── api/                # Axios 实例和接口方法
│   ├── assets/images/      # 界面图标
│   ├── components/         # 顶栏 TopBar、底栏 TabBar
│   ├── pages/              # 登录注册、消息、通讯录、搜索、资料、群组
│   ├── router/             # 路由表和登录守卫
│   ├── store/modules/      # User、Chat、Friend、Search
│   ├── utils/              # token 读写、Socket.IO 客户端
│   ├── App.vue             # 拉取消息、解密、监听实时事件
│   └── main.js             # 入口，创建 Socket 连接
├── vue.config.js           # publicPath 为 ./，关闭保存时 lint
└── package.json
```

底栏三个入口是 `/msg`（消息）、`/contacts`（通讯录）和 `/more`（我）。`/` 会重定向到 `/msg`。

## 本地运行

需要 Node.js 12 及以上（Vue CLI 5 的要求）和 npm。项目没有读取环境变量，服务地址写在源码里，见下一节。请先在本机启动 [hine-server](https://github.com/ychunx/hine-server)，否则登录和收发消息都会失败。

```bash
git clone https://github.com/ychunx/hine.git
cd hine
npm install
npm run serve
```

开发服务器默认打开 [http://localhost:8080](http://localhost:8080)。`vue.config.js` 没有改端口，8080 被占用时 Vue CLI 会改用下一个可用端口。

| 命令 | 作用 |
| --- | --- |
| `npm run serve` | 本地开发 |
| `npm run build` | 生产构建，输出到 `dist/`。`publicPath` 为 `./`，可以用相对路径打开 |
| `npm run lint` | 手动跑 ESLint |

## 与 hine-server 的连接

前端固定连本机两个端口：

- HTTP：`src/api/request.js` 的 `baseURL` 是 `http://localhost:3000/api`，超时 5 秒。有 token 时写入请求头 `token`。
- Socket.IO：`src/main.js` 连接 `http://localhost:3001`。拿到用户 id 后发送 `online`，关闭页面前发送 `offline`。

`src/api/index.js` 使用的接口包括：

- 注册登录：`/signup/adduser`、`/signup/nameinuse`、`/signup/emailinuse`、`/signin/login`、`/signin/getUserInfo`
- 搜索：`/search/user`、`/search/relation`、`/search/group`、`/search/isingroup`
- 好友：`/friend/getfriends`、`/friend/getfriendapplys`、`/friend/reject`、`/friend/delete`
- 资料：`/detail/name`、`/detail/email`、`/detail/pwd`、`/detail/sex`、`/detail/birth`、`/detail/signature`、`/detail/portrait`、`/detail/nickname`、`/detail/getuserinfobyid`
- 聊天记录：`/chat/getallmsgs`、`/chat/getallencryptedmsgs`、`/chat/getallgroupmsgs`，以及对应的已读接口
- 群组：`/group/build`、`/group/nameinuse`、`/group/getgroupinfobyid`、`/group/updateportrait`、`/group/updatename`、`/group/updatenotice`、`/group/invite`、`/group/removegroupmember`、`/group/updatenickname`、`/group/exitgroup`、`/group/breakgroup`
- 上传：`/upload/portrait`、`/upload/groupportrait`、`/upload/image`、`/upload/groupimage`

实时收发不走上面的 HTTP 列表。客户端发送 `sendMsg`、`sendGroupMsg`、`friendApply`、`groupApply`、`agreeApply`，并监听 `receiveMsg`、`receiveEncryptedMsg`、`receiveGroupMsg`、`receiveApply`、`acceptedApply`、`newGroupMemberJoin`、`forceOffline`。

新建群组时的默认头像是 `http://localhost:3000/user.png`，所以 3000 端口上的这个静态文件也要能访问。

如果服务不在本机或端口不同，改 `src/api/request.js` 的 `baseURL` 和 `src/main.js` 里的 Socket 地址。

## 界面预览

仓库里的图片都是界面图标（`src/assets/images/`），还没有产品截图。下表留给后续补图，当前均为待补充。

| 登录 / 注册 | 消息列表 | 好友对话 |
| --- | --- | --- |
| 待补充 | 待补充 | 待补充 |

| 加密对话 | 群组 | 通讯录 / 个人资料 |
| --- | --- | --- |
| 待补充 | 待补充 | 待补充 |
