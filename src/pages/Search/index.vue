<template>
  <div class="search">
    <div class="search-top">
      <div class="back" @click="back">
        <img src="../../assets/images/left.png" />
      </div>
      <div class="search-input">
        <input
          type="text"
          placeholder="搜索..."
          @input="search"
          v-model="key"
          ref="searchInput"
        />
      </div>
    </div>
    <ul class="search-list">
      <li class="title" v-show="searchUsers.length != 0">用户</li>
      <li class="search-item" v-for="item in users" :key="item._id" @click="intoDetails(item._id)">
        <img :src="item.imgUrl" />
        <div class="info">
          <p class="info-name">{{ item.name }}</p>
          <p class="info-email">{{ item.email }}</p>
        </div>
        <div
          class="enter-btn"
          v-if="item.relation == 200"
          @click="intoDialog(item._id)"
        >
          发信息
        </div>
        <div
          class="apply-btn"
          v-else-if="item.relation == 201"
          @click="intoApply(item._id, item.name, item.imgUrl, 'friend')"
        >
          申请中
        </div>
        <div
          class="apply-btn"
          v-else
          @click="intoApply(item._id, item.name, item.imgUrl, 'friend')"
        >
          加好友
        </div>
      </li>
      <li class="title" v-show="searchGroups.length != 0">群组</li>
      <li class="search-item" v-for="item in groups" :key="item._id">
        <img :src="item.imgUrl" />
        <div class="info">
          <p class="info-name">{{ item.name }}</p>
          <p class="info-email">{{ item.email }}</p>
        </div>
        <div class="enter-btn" v-if="item.relation == 200">发信息</div>
        <div
          class="apply-btn"
          v-else
          @click="intoApply(item._id, item.name, item.imgUrl, 'group')"
        >
          申请加入
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      key: "",
      users: [],
      groups: [],
      timer: null,
    };
  },
  methods: {
    back() {
      this.$router.back();
      this.$store.dispatch("Search/clearResult");
    },

    intoDialog(friendId) {
      this.$router.push("/msg");
      this.$nextTick(() => {
        this.$bus.$emit("intoDialog", friendId);
      });
    },
    search() {
      // 防抖
      clearTimeout(this.timer);
      this.timer = setTimeout(this.searchHandle, 1000);
    },
    searchHandle() {
      let key = this.key;
      if (key.trim() == "") {
        this.$store.dispatch("Search/clearResult");
        this.users = [];
        this.groups = [];
      } else {
        this.$store.dispatch("Search/search", { key }).then((v) => {
          this.getUsers();
          this.getGroups();
        });
      }
    },
    getUsers() {
      let usersArr = this.searchUsers;
      let relationsArr = this.relations;
      for (let i = 0; i < usersArr.length; i++) {
        // 正常情况都是按顺序的数组，因为Promise.All()是按数组顺序返回结果的，以防万一
        if (usersArr[i]._id == relationsArr[i].friendId) {
          usersArr[i].relation = relationsArr[i].relation;
        }
      }
      this.users = usersArr;
    },
    getGroups() {
      let groupsArr = this.searchGroups;
      let relationsArr = this.isInGroups;
      for (let i = 0; i < groupsArr.length; i++) {
        // 正常情况都是按顺序的数组，因为Promise.All()是按数组顺序返回结果的，以防万一
        if (groupsArr[i]._id == relationsArr[i].groupId) {
          groupsArr[i].relation = relationsArr[i].relation;
        }
      }
      this.groups = groupsArr;
    },
    intoApply(id, name, imgUrl, type) {
      this.$router.push({
        path: "/apply",
        query: { id, name, imgUrl, type },
      });
    },
    // 进入用户详情页
    intoDetails(id) {
      this.$router.push({
        path: "/detail",
        query: { id },
      });
    },
    // ★进入群组详情页
  },
  computed: {
    ...mapState({
      searchUsers: (state) => state.Search.searchUsers,
      searchGroups: (state) => state.Search.searchGroups,
      relations: (state) => state.Search.relations,
      isInGroups: (state) => state.Search.isInGroups,
      keyStore: (state) => state.Search.key,
    }),
  },
  mounted() {
    this.key = this.keyStore;
    this.searchHandle();
    this.$refs.searchInput.focus();
  },
};
</script>

<style lang="less" scoped>
.search {
  .search-top {
    height: 60px;
    box-sizing: border-box;
    background: #ffffff;
    border-bottom: 1px solid #ededed;
    display: flex;
    align-items: center;
    .back {
      width: 60px;
      text-align: center;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .search-input {
      flex: 1;
      input {
        width: 80%;
        height: 30px;
        outline: none;
        border: none;
        font-size: 20px;
      }
    }
  }
  .search-list {
    height: calc(100vh - 60px);
    list-style: none;
    overflow: scroll;
    .title {
      height: 25px;
      background: #e7f0f7;
      padding: 0 20px;
      font-weight: bold;
    }
    .search-item {
      width: 100%;
      height: 70px;
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #ededed;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .info {
        flex: 1;
        padding: 0 15px;
        .info-name {
          font-size: 20px;
          font-weight: bold;
        }
      }
      .apply-btn {
        height: 36px;
        width: 90px;
        border-radius: 18px;
        background: #607d8b;
        color: #ffffff;
        text-align: center;
        line-height: 36px;
      }
      .enter-btn {
        height: 36px;
        width: 90px;
        border-radius: 18px;
        background: #d7e4f5;
        text-align: center;
        line-height: 36px;
      }
    }
  }
}
</style>