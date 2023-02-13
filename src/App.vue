<template>
  <div id="app">
    <router-view />
    <TabBar />
  </div>
</template>

<script>
import TabBar from "./components/TabBar";
import { mapState } from "vuex";
import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";
export default {
  name: "App",
  components: { TabBar },
  data() {
    return {
      myPrivateKey: "",
      jsDecrypt: null,
    };
  },
  methods: {
    // 获取消息页数据
    async getMsgs() {
      // 普通一对一消息
      await this.$store.dispatch("Chat/reqAllMsgs");
      // 排序某个好友的记录，并添加最后发送的消息和时间方便展示
      this.allMsgs.forEach((item) => {
        item.allMsgs.sort((a, b) => (a.time > b.time ? 1 : -1));
        item.lastMsg = item.allMsgs[item.allMsgs.length - 1].content;
        if (item.allMsgs[item.allMsgs.length - 1].types == "1") {
          item.lastMsg = "[图片]";
        }
        item.lastTime = item.allMsgs[item.allMsgs.length - 1].time;
      });
      // 排序全部好友的列表
      this.allMsgs.sort((a, b) => (a.lastTime < b.lastTime ? 1 : -1));
    },

    async getEncryptedMsgs() {
      // 加密一对一消息
      await this.$store.dispatch("Chat/reqAllEncryptedMsgs");
      // 解密全部消息
      if (this.jsDecrypt) {
        this.decryptMsgs();
      }
    },

    async getGroupMsgs() {
      // 群消息
      await this.$store.dispatch("Chat/reqAllGroupMsgs");
      // 排序某个群组的聊天记录，并添加最后的消息和时间方便展示
      this.allGroupMsgs.groupMsgs.forEach((item) => {
        item.allMsgs.sort((a, b) => (a.time > b.time ? 1 : -1));
        item.lastMsg = item.allMsgs[item.allMsgs.length - 1].content;
        if (item.allMsgs[item.allMsgs.length - 1].types == "1") {
          item.lastMsg = "[图片]";
        }
        item.lastTime = item.allMsgs[item.allMsgs.length - 1].time;
      });
      // 排序全部群组的列表
      this.allGroupMsgs.groupMsgs.sort((a, b) =>
        a.lastTime < b.lastTime ? 1 : -1
      );
    },

    getMsgData() {
      this.getMsgs()
      this.getEncryptedMsgs()
      this.getGroupMsgs()
    },

    // 获取通讯录页数据
    getContactsData() {
      this.$store.dispatch("Friend/reqFriends");
      this.$store.dispatch("Friend/reqFriendApplys");
    },

    // 解密私钥
    decryptPrivateKey() {
      try {
        this.myPrivateKey = CryptoJS.AES.decrypt(
          this.userPrivateKey,
          this.pwd
        ).toString(CryptoJS.enc.Utf8);
        this.jsDecrypt = new JSEncrypt();
        this.jsDecrypt.setPrivateKey(this.myPrivateKey);

        this.$bus.pwdCorrect = true;

        // 获取到私钥了就着手解密消息
        this.decryptMsgs();
      } catch (error) {
        this.$bus.pwdCorrect = false;
      }
    },

    // 解密消息
    decryptMsgs() {
      this.allEncryptedMsgs.forEach((item) => {
        item.allMsgs.forEach((msg) => {
          // 重新打开软件后看不到自己发的消息，原因是自己发的消息是由对方公钥加密的，故需要同时使用自己的公钥加密一次存储，用|分隔
          let oppositeEncrypted = msg.content.split("|")[0];
          let ownEncrypted = msg.content.split("|")[1];
          if (msg.friendId == item.friendId) {
            msg.content = this.jsDecrypt.decrypt(ownEncrypted);
          } else {
            msg.content = this.jsDecrypt.decrypt(oppositeEncrypted);
          }
        });
      });

      // 排序某个好友的记录，并添加最后发送的消息和时间方便展示
      this.allEncryptedMsgs.forEach((item) => {
        item.allMsgs.sort((a, b) => (a.time > b.time ? 1 : -1));
        item.lastMsg = item.allMsgs[item.allMsgs.length - 1].content;
        if (item.allMsgs[item.allMsgs.length - 1].types == "1") {
          item.lastMsg = "[图片]";
        }
        item.lastTime = item.allMsgs[item.allMsgs.length - 1].time;
      });
      // 排序全部好友的列表
      this.allEncryptedMsgs.sort((a, b) => (a.lastTime < b.lastTime ? 1 : -1));
    },
  },
  computed: {
    ...mapState({
      _id: (state) => state.User.userInfo._id,
      pwd: (state) => state.User.password,
      userPrivateKey: (state) => state.User.userInfo.privateKey,
      allMsgs: (state) => state.Chat.allMsgs,
      allEncryptedMsgs: (state) => state.Chat.allEncryptedMsgs,
      allGroupMsgs: (state) => state.Chat.allGroupMsgs,
    }),
  },
  watch: {
    _id() {
      // 监控 _id 来获取数据是为了兼顾未登录、已登录和登录失效状态的情况
      // 上线、获取数据
      // socket 根据用户 id 来发收信息，同接口一致
      if (this._id) {
        this.getMsgData();
        this.getContactsData();
        this.$socket.emit("online", this._id);

        // 解决使用密码登录时的私钥获取
        if (this.pwd) {
          this.decryptPrivateKey();
        }
      }
    },
    pwd() {
      // 解决 token 有效状态下的私钥获取，即需要用户输入密码后才能查看
      if (this.pwd && this._id) {
        this.decryptPrivateKey();
      }
    },
  },
  mounted() {
    // 刷新数据，供路由组件使用
    this.$bus.$on("refreshData", () => {
      this.getMsgData();
      this.getContactsData();
    });

    // 接收非加密消息
    this.$socket.on("receiveMsg", (msg) => {
      let friend = this.$store.state.Chat.allMsgs.find(
        (item) => item.friendId == msg.userId
      );
      if (friend) {
        friend.allMsgs.push(msg);
        friend.lastMsg = msg.content;
        if (msg.types == '1') {
          friend.lastMsg = '[图片]'
        }
        friend.lastTime = msg.time;
        friend.unReadNum++;
      } else {
        // 新建好友消息项（首次消息）
        let data = {};
        data.allMsgs = [msg];
        data.friendId = msg.userId;
        data.lastMsg = msg.content;
        if (msg.types == '1') {
          friend.lastMsg = '[图片]'
        }
        data.lastTime = msg.time;
        data.unReadNum = 1;

        let friendInfo = this.$store.state.Friend.friends.find(
          (item) => item._id == msg.userId
        );
        data.imgUrl = friendInfo.imgUrl;
        data.name = friendInfo.name;
        data.nickname = friendInfo.nickname;

        this.$store.state.Chat.allMsgs.unshift(data);
      }

      // 判断是否已读消息，在该好友对话页则已读
      this.$bus.$emit("autoReadMsg");
    });

    // 接收加密消息
    this.$socket.on("receiveEncryptedMsg", (msg) => {
      // 解密消息
      try {
        msg.content = this.jsDecrypt.decrypt(msg.content);
      } catch (error) {
        console.log("用户没有验证密码");
      }

      let friend = this.$store.state.Chat.allEncryptedMsgs.find(
        (item) => item.friendId == msg.userId
      );
      if (friend) {
        friend.allMsgs.push(msg);
        friend.lastMsg = msg.content;
        friend.lastTime = msg.time;
        friend.unReadNum++;
      } else {
        // 新建好友消息项（首次消息）
        let data = {};
        data.allMsgs = [msg];
        data.friendId = msg.userId;
        data.lastMsg = msg.content;
        data.lastTime = msg.time;
        data.unReadNum = 1;

        let friendInfo = this.$store.state.Friend.friends.find(
          (item) => item._id == msg.userId
        );
        data.imgUrl = friendInfo.imgUrl;
        data.name = friendInfo.name;
        data.nickname = friendInfo.nickname;

        this.$store.state.Chat.allEncryptedMsgs.unshift(data);
      }

      // 判断是否已读消息，在该好友对话页则已读
      this.$bus.$emit("autoReadEncryptedMsg");
    });

    // 接收群组消息
    this.$socket.on("receiveGroupMsg", (msg) => {
      let group = this.$store.state.Chat.allGroupMsgs.groupMsgs.find(
        (item) => item.groupId == msg.groupId
      );

      group.allMsgs.push(msg);
      group.lastMsg = msg.content;
      if (msg.types == '1') {
        group.lastMsg = '[图片]'
      }
      group.lastTime = msg.time;
      group.unReadNum++;

      // 判断是否已读消息，在该群组对话页则已读
      this.$bus.$emit("autoReadGroupMsg");
    });

    // 接收申请，有人请求添加，刷新申请列表
    this.$socket.on("receiveApply", () => {
      this.getContactsData();
    });

    // 申请被同意，用户申请添加被通过
    this.$socket.on("acceptedApply", () => {
      this.getContactsData();
      this.getMsgs();
    });

    // 群组新成员加入
    this.$socket.on("newGroupMemberJoin", (data) => {
      this.getGroupMsgs();
    })

    // 关闭窗口前下线
    window.addEventListener("beforeunload", () => {
      if (this._id) {
        this.$socket.emit("offline", this._id);
      }
    });

    // 被挤下线
    this.$socket.on("forceOffline", () => {
      this.$store.dispatch("User/logout");
      this.$router.go(0);
    });
  },
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;

  // 禁止长按选择
  -webkit-touch-callout: none;
  /*系统默认菜单被禁用*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -khtml-user-select: none;
  /*早期浏览器*/
  -moz-user-select: none;
  /*火狐*/
  -ms-user-select: none;
  /*IE10*/
  user-select: none;
}
// 恢复输入框
input {
  -webkit-user-select: auto;
  /*webkit浏览器*/
}
textarea {
  -webkit-user-select: auto;
  /*webkit浏览器*/
}
#app {
  width: 100%;
}
</style>
