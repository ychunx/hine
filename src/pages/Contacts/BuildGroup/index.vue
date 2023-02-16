<template>
  <div class="build-group">
    <div class="build-group-top">
      <div class="back" @click="back">
        <img src="../../../assets/images/left.png" />
      </div>
      <div class="group-build" @click="buildGroup" ref="buildBtn">创建</div>
    </div>
    <div class="group-info">
      <div class="group-portrait">
        <img :src="groupPortrait" @click="$refs.groupPortraitFile.click()" />
        <input
          type="file"
          ref="groupPortraitFile"
          style="display: none"
          @change="uploadGroupPortrait($event)"
        />
      </div>
      <div class="group-name">
        <input
          type="text"
          placeholder="请输入群组名称..."
          v-model="groupName"
          ref="groupNameInput"
          @blur="groupNameQuery"
        />
      </div>
    </div>
    <div class="group-members">
      <div class="group-title">选择群组成员</div>
      <ul>
        <li v-for="item in friends" :key="item._id">
          <label>
            <img :src="item.imgUrl" />
            <span>{{ item.name }}</span>
            <input
              type="checkbox"
              v-model="invitationFriends"
              :value="item._id"
            />
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuildGroup",
  data() {
    return {
      groupPortrait: "http://localhost:3000/user.png", // 存储群组头像链接
      groupName: "", // 存储群组名称
      invitationFriends: [], // 存储受邀请好友列表
      groupNameInUse: null, // 群名称是否已被占用
    };
  },
  methods: {
    back() {
      this.$bus.$emit("hideBuildGroup");
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
        this.groupPortrait = res.msg;
      }
    },

    // 检查群名称占用
    async groupNameQuery() {
      if (!this.groupName) {
        return;
      }
      // 根据返回数量判断是否已被占用
      let res = await this.$API.groupNameInUse(this.groupName);
      if (res.status == 200) {
        if (res.msg > 0) {
          this.$refs.groupNameInput.style.background =
            "rgba(255, 182, 193, 0.5)";
          this.groupNameInUse = true;
        } else {
          this.$refs.groupNameInput.style.background = "#fff";
          this.groupNameInUse = false;
        }
      }
    },

    // 建立群组
    async buildGroup() {
      if (
        this.groupNameInUse ||
        this.invitationFriends.length < 1 ||
        this.groupName == ""
      ) {
        return;
      }

      let data = {
        name: this.groupName,
        imgUrl: this.groupPortrait,
        friends: this.invitationFriends,
      };

      let res = await this.$API.buildGroup(data);
      if (res.status == 200) {
        // 清空输入
        this.$bus.$emit("hideBuildGroup");
        this.groupName = "";
        this.invitationFriends = [];
        this.groupPortrait = "http://localhost:3000/user.png";

        // 进入群组聊天页面
        this.$bus.$emit("refreshGroupMsgs");
        this.$router.push("/groupdialog");
      } else {
        // 建立失败
        this.$refs.buildBtn.innerText = "失败";
        this.$refs.buildBtn.style.background = "rgba(255, 182, 193, 0.5)";
      }
    },
  },
  computed: {
    // 获取好友列表
    friends() {
      return this.$store.state.Friend.friends;
    },
  },
};
</script>

<style lang="less" scoped>
.build-group {
  background: #e7f0f7;
  height: 100vh;
  .build-group-top {
    height: 60px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back {
      width: 60px;
      text-align: center;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .group-build {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background: #fff;
      border-radius: 10px;
      margin-right: 20px;
      font-weight: bold;
      box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
      &:active {
        background: #f9f9f9;
      }
    }
  }
  .group-info {
    width: 100%;
    height: 200px;
    .group-portrait {
      width: 100%;
      height: 150px;
      img {
        display: block;
        width: 120px;
        height: 120px;
        border-radius: 20%;
        margin: 0 auto;
        box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
      }
    }
    .group-name {
      width: 100%;
      height: 50px;
      input {
        width: 70%;
        height: 50px;
        display: block;
        margin: 0 auto;
        outline: none;
        border: none;
        border-radius: 25px;
        font-size: 18px;
        font-weight: bold;
        padding: 0 20px;
        box-sizing: border-box;
        color: #607d88;
        box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
      }
    }
  }
  .group-members {
    margin: 20px auto 0;
    width: 90%;
    max-height: calc(100vh - 320px);
    background: #fff;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 0 36px 40px 0 rgba(39, 40, 50, 0.1);
    .group-title {
      width: 100%;
      padding: 10px 20px;
      box-sizing: border-box;
      font-weight: bold;
      border-bottom: 1px solid #ededed;
    }
    ul {
      max-height: calc(100vh - 360px);
      list-style: none;
      overflow: scroll;
      label {
        width: 100%;
        padding: 10px 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ededed;
        &:active {
          background: #f9f9f9;
        }
        img {
          width: 35px;
          height: 35px;
          border-radius: 20%;
          margin-right: 25px;
        }
        span {
          font-size: 16px;
          font-weight: bold;
          flex: 1;
        }
        input {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>