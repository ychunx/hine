<template>
  <div class="group-detail">
    <div class="group-detail-top">
      <img
        src="../../../assets/images/left-white.png"
        class="back"
        @click="back"
      />
      <img
        :src="info && info.imgUrl"
        class="groupImg"
        @click="$refs.groupPortraitFile.click()"
      />
      <input
        type="file"
        ref="groupPortraitFile"
        style="display: none"
        @change="uploadGroupPortrait($event)"
      />
      <span>
        <input type="text" v-if="modifyName" v-model="newName" />
        <p v-else>{{ info && info.name }}</p>
        <img
          src="../../../assets/images/modify-white.png"
          v-show="isMember && isLeader && !modifyName"
          @click="toggleName(true)"
        />
        <img
          src="../../../assets/images/finish-white.png"
          v-show="isMember && isLeader && modifyName"
          @click="toggleName(false)"
        />
      </span>
    </div>
    <ul class="group-detail-main">
      <li class="group-notice">
        <div class="group-notice-title">
          <span>群组公告</span>
          <img
            src="../../../assets/images/modify.png"
            v-show="isMember && isLeader && !modifyNotice"
            @click="toggleNotice(true)"
          />
          <img
            src="../../../assets/images/finish.png"
            v-show="isMember && isLeader && modifyNotice"
            @click="toggleNotice(false)"
          />
        </div>
        <div class="group-notice-main" ref="groupNotice">
          {{ info && info.notice }}
        </div>
      </li>
      <li class="group-members">
        <div class="group-members-title">
          <span>群组成员</span>
          <span v-show="isMember && isLeader && isDelete" @click="finishDelete"
            >删除成员</span
          >
          <span v-show="isMember && isLeader && !isDelete" @click="deleteHandle"
            >管理成员</span
          >
        </div>
        <div class="group-members-main">
          <div
            v-for="item in members && members.memberInfos"
            :key="item._id"
            @click="intoDetails(item._id)"
          >
            <label>
              <img :src="item.imgUrl" />
              <p>{{ item.name }}</p>
              <input
                type="checkbox"
                v-show="isDelete"
                :value="item._id"
                v-model="deleteMembers"
                v-if="item._id != info.userId"
              />
            </label>
          </div>
          <div v-show="isMember">
            <img src="../../../assets/images/+.png" @click="invite" />
          </div>
        </div>
      </li>
      <li v-show="isMember">
        <div class="detail-main-left">群内昵称</div>
        <div class="detail-main-center">{{ info && info.nickName }}</div>
        <div class="detail-main-right">
          <img
            src="../../../assets/images/right.png"
            @click="toggleNickName"
            :class="{ modifyNickName }"
          />
        </div>
      </li>
      <li class="group-nickname-modify" :class="{ modifyNickName }">
        <input type="text" v-model="newNickname" />
      </li>
      <li>
        <div class="detail-main-left">建立时间</div>
        <div class="detail-main-center">
          {{ info && formatDateTime(info.time) }}
        </div>
      </li>
      <li v-show="isMember">
        <div class="detail-main-left">加入时间</div>
        <div class="detail-main-center">
          {{ info && formatDateTime(info.joinTime) }}
        </div>
      </li>
    </ul>
    <div class="group-detail-bottom" v-if="isMember && isLeader">
      <div class="detail-break" @click="breakGroup">解散群组</div>
    </div>
    <div class="group-detail-bottom" v-else-if="isMember">
      <div class="detail-exit" @click="exitGroup">退出群组</div>
    </div>
    <div class="group-detail-bottom" v-else>
      <div class="detail-apply" @click="intoApply">加入群组</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupDetail",
  data() {
    return {
      id: "", // 群组 id
      isLeader: false, // 是否为群主
      isMember: true, // 是否为群内成员
      isDelete: false, // 是否处于管理成员状态
      deleteMembers: [], // 欲移除成员列表
      // 是否处于修改群组名称、群组公告、群内昵称状态
      modifyName: false,
      modifyNotice: false,
      modifyNickName: false,
      // 存储新群组名称、群内昵称
      newName: "",
      newNickname: "",
    };
  },
  methods: {
    // 根据路径来源不同判断如何返回
    back() {
      if (this.isMember) {
        // 从群对话页面进入
        this.$router.push("/groupdialog");
        this.$nextTick(() => {
          this.$bus.$emit("intoGroupDialog", this.id);
        });
      } else {
        // 从搜索页进入
        this.$router.back();
      }
    },

    // 通过群组 id 获取群组资料
    async getGroupInfoById() {
      let res = await this.$API.getGroupInfoById({ groupId: this.id });
      if (res.status == 200) {
        this.info = res.msg.groupInfo;
        this.members = res.msg.memberInfos;
      } else {
        this.info = {};
        this.members = {};
      }
    },

    // 上传群组头像文件
    async uploadGroupPortrait(e) {
      e.preventDefault();

      let formData = new FormData();
      let file = this.$refs.groupPortraitFile.files[0];
      let name = file.name;

      formData.append("groupPortraitFile", file, name);

      let res = await this.$API.uploadGroupPortrait(formData);
      if (res.status == 200) {
        this.info.imgUrl = res.msg;
        // 修改群头像
        this.$API.updatePortrait({
          groupId: this.id,
          imgUrl: res.msg,
        });
      }
    },

    // 更新群组名称
    async toggleName(bool) {
      if (!bool) {
        // 提交
        // 检查群组名称占用（唯一）
        let res = await this.$API.groupNameInUse(this.newName);
        if (res.status == 200) {
          if (res.msg < 1) {
            // 没有该群组名称则提交修改
            this.$API.updateName({
              groupId: this.id,
              newName: this.newName,
            });

            // 修改本地
            this.info.name = this.newName;
            this.modifyName = bool;
            this.newName = "";
          } else {
            // 已有该群组名称
            this.newName = "群组名称已被占用";
          }
        } else {
          // 返回码不为 200，可能发生错误
          this.newName = "接口响应错误";
        }
      } else {
        // 打开修改框
        this.newName = this.info.name;
        this.modifyName = bool;
      }
    },

    // 更新群组公告
    async toggleNotice(bool) {
      if (bool) {
        this.modifyNotice = bool;
        // 改成输入
        this.$refs.groupNotice.setAttribute("contenteditable", true);
        this.$refs.groupNotice.focus();
      } else {
        // 调用接口
        let res = await this.$API.updateNotice({
          groupId: this.id,
          newNotice: this.$refs.groupNotice.innerText,
        });

        if (res.status == 200) {
          this.info.notice = this.$refs.groupNotice.innerText;
          this.$refs.groupNotice.setAttribute("contenteditable", false);
          this.modifyNotice = bool;
        }
      }
    },

    // 进入管理成员状态
    deleteHandle() {
      this.isDelete = true;
    },

    // 提交成员移除请求
    async finishDelete() {
      try {
        await Promise.all(
          // 遍历欲移除成员数组进行多次请求
          this.deleteMembers.map(async (item) => {
            let res = await this.$API.removeGroupMember({
              groupId: this.id,
              memberId: item,
            });

            if (res.status == 200) {
              return "ok";
            } else {
              return Promise.reject(new Error(res.msg));
            }
          })
        );

        // 刷新数据、清空输入
        this.$bus.$emit("refreshGroupMsgs");
        this.deleteMembers = [];
        this.isDelete = false;
      } catch (error) {
        console.log("移除失败", error);
      }
    },

    // 邀请
    invite() {
      this.$router.push({
        path: "/invite",
        query: {
          id: this.id,
        },
      });
    },

    // 更新群内昵称
    async toggleNickName() {
      if (this.modifyNickName) {
        let res = await this.$API.updateNickName({
          groupId: this.id,
          newNickName: this.newNickname,
        });

        if (res.status == 200) {
          this.info.nickName = this.newNickname;
          this.newNickname = "";
        }
      }

      this.modifyNickName = !this.modifyNickName;
    },

    // 解散群组
    async breakGroup() {
      let res = await this.$API.breakGroup({ groupId: this.id });
      if (res.status == 200) {
        this.$bus.$emit("refreshGroupMsgs");
        this.$router.push("/groupdialog");
      }
    },

    // 退出群组
    async exitGroup() {
      let res = await this.$API.exitGroup({ groupId: this.id });
      if (res.status == 200) {
        this.$bus.$emit("refreshGroupMsgs");
        this.$router.push("/groupdialog");
      }
    },

    // 申请加入群组
    intoApply() {
      this.$router.push({
        path: "/apply",
        query: {
          id: this.id,
          name: this.info.name,
          imgUrl: this.info.imgUrl,
          type: "group",
        },
      });
    },

    // 进入用户详情页
    intoDetails(id) {
      if (this.isDelete) {
        return;
      }
      this.$router.push({
        path: "/detail",
        query: { id },
      });
    },

    // 格式化时间
    formatDateTime(date) {
      if (date == "" || !date) {
        return "";
      }
      let newDate = new Date(date);
      let y = newDate.getFullYear();
      let m = newDate.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = newDate.getDate();
      d = d < 10 ? "0" + d : d;
      // let h = newDate.getHours()
      // h = h < 10 ? ('0' + h) : h
      // let minute = newDate.getMinutes()
      // minute = minute < 10 ? ('0' + minute) : minute
      // let second = newDate.getSeconds()
      // second = second < 10 ? ('0' + second) : second

      return `${y}-${m}-${d}`;
    },
  },
  computed: {
    // 获取/设置群组资料
    info: {
      get() {
        return this.$store.state.Chat.allGroupMsgs.groupMsgs.find(
          (item) => item.groupId == this.id
        );
      },
      set(newVal) {
        this.$store.state.Chat.allGroupMsgs.groupMsgs.push({
          groupId: this.id,
          ...newVal,
        });
      },
    },

    // 获取/设置群组成员
    members: {
      get() {
        return this.$store.state.Chat.allGroupMsgs.userInfos.find(
          (item) => item.groupId == this.id
        );
      },
      set(newVal) {
        this.$store.state.Chat.allGroupMsgs.userInfos.push({
          groupId: this.id,
          memberInfos: newVal,
        });
      },
    },
  },
  mounted() {
    // 从路由 query 获取群组 id
    let query = this.$route.query;
    this.id = query.id;

    // 如果用户非群内成员
    if (!this.info) {
      this.isMember = false;
      this.getGroupInfoById();
    } else {
      // 判断用户是否为该群群主
      if (this.info.userId == this.$store.state.User.userInfo._id) {
        this.isLeader = true;
      }
    }
  },
  beforeDestroy() {
    if (this.isMember == false) {
      // 由于本页数据是由 state 计算属性得出的 info
      // 故当使用 id 查询群组信息时需要往 state 新添信息数据
      // 则摧毁前再将其去除
      this.$store.state.Chat.allGroupMsgs.groupMsgs.pop(
        this.$store.state.Chat.allGroupMsgs.groupMsgs.find(
          (item) => item.groupId == this.id
        )
      );
      this.$store.state.Chat.allGroupMsgs.userInfos.pop(
        this.$store.state.Chat.allGroupMsgs.userInfos.find(
          (item) => item.groupId == this.id
        )
      );
    }
  },
};
</script>

<style lang="less" scoped>
.group-detail {
  height: 100vh;
  .group-detail-top {
    height: 180px;
    background: #607d8b;
    position: relative;
    padding: 15px 0 0 10px;
    box-sizing: border-box;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    .back {
      width: 25px;
      height: 25px;
    }
    .groupImg {
      width: 100px;
      height: 100px;
      border-radius: 20%;
      position: absolute;
      top: 60px;
      left: 10%;
      box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
    }
    span {
      width: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
      position: absolute;
      top: 80px;
      left: calc(10% + 120px);
      input {
        height: 30px;
        outline: none;
        padding-left: 10px;
        box-sizing: border-box;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .group-detail-main {
    height: calc(100vh - 280px);
    list-style: none;
    padding: 0 20px;
    overflow: scroll;
    box-sizing: border-box;
    li {
      width: 100%;
      height: 55px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      background: #ffffff;
      border-bottom: 1px solid #ededed;
      &.group-notice {
        height: auto;
        display: block;
        margin-top: 20px;
        .group-notice-title {
          width: 100%;
          height: 30px;
          color: #607d8b;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .group-notice-main {
          width: 100%;
          height: auto;
          min-height: 55px;
          padding: 5px;
          box-sizing: border-box;
          text-indent: 32px;
        }
      }
      &.group-members {
        height: auto;
        display: block;
        padding: 10px 0;
        .group-members-title {
          width: 100%;
          height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #607d8b;
          font-weight: bold;
        }
        .group-members-main {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          div {
            margin-top: 10px;
            width: 20%;
            text-align: center;
            position: relative;
            &:active {
              background: #f9f9f9;
            }
            img {
              width: 60px;
              height: 60px;
              border-radius: 20%;
            }
            p {
              font-size: 16px;
              font-weight: normal;
            }
            input {
              position: absolute;
              top: 0;
              right: 0;
              width: 20px;
              height: 20px;
            }
            &:last-child {
              img {
                border-radius: 0;
              }
            }
          }
        }
      }
      &.group-nickname-modify {
        height: 0;
        overflow: hidden;
        &.modifyNickName {
          height: 55px;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease-out;
          input {
            width: 80%;
            height: 30px;
            outline: none;
            padding-left: 10px;
            box-sizing: border-box;
          }
        }
      }
      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      .detail-main-left {
        width: 100px;
        padding-left: 20px;
        box-sizing: border-box;
        color: #607d8b;
        font-weight: bold;
      }
      .detail-main-center {
        flex: 1;
      }
      .detail-main-right {
        padding-right: 10px;
        img {
          transition: all 0.3s ease;
          &.modifyNickName {
            transform: rotate(90deg);
          }
        }
      }
    }
  }
  .group-detail-bottom {
    width: 100%;
    height: 100px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #ffffff;
    .detail-exit,
    .detail-break {
      width: 80%;
      height: 50px;
      font-size: 20px;
      text-align: center;
      line-height: 50px;
      border-radius: 10px;
      background: rgba(255, 182, 193, 0.5);
      color: #dc143c;
    }
    .detail-apply {
      width: 80%;
      height: 50px;
      background: #607d8b;
      color: #ffffff;
      font-size: 20px;
      text-align: center;
      line-height: 50px;
      border-radius: 10px;
    }
  }
}
</style>