<template>
  <div>
    <el-select v-model="ownerType">
      <el-option
          v-for="item in ownerTypes"
          :key="item.id"
          :label="item.value"
          :value="item.id"
      />
    </el-select>
    <el-select
        v-model="selected"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="loadUser"
        :loading="loading"
        @blur="selectedBlur">
      <el-option
          v-for="item in users"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-button @click="saveOwner">添加</el-button>

    <el-divider></el-divider>
    <pd-panel-tag title="管理员" :tags="adminTags" v-on:tagRemove="remoteOwner"></pd-panel-tag>
    <pd-panel-tag title="运营" :tags="operateTags" v-on:tagRemove="remoteOwner"></pd-panel-tag>
    <pd-panel-tag title="用户" :tags="userTags" v-on:tagRemove="remoteOwner"></pd-panel-tag>
  </div>
</template>

<script>
  import _util from '@/assets/js/util';

  export default {
    props: {
      appCode: Number,

      ownerTypes: Array,
    },
    data() {
      return {
        loading: false,
        users: [],
        selected: null,
        ownerType: 0,
        vagueUserUrl: '/panda/core/user/vague',
        saveOwnerUrl: '/panda/core/app/saveOwner',
        deleteOwnerUrl: '/panda/core/app/deleteOwner',
        ownerTags: [],
        userTags: [],
        operateTags: [],
        adminTags: [],
      };
    },
    methods: {
      loadUser(query) {
        if (query !== '') {
          this.loading = true;
          _util.requestGet(this, this.vagueUserUrl, {key: query}, (data) => {
            this.users.length = 0;
            data.forEach((item, index) => {
              this.users.push({value: item.id, label: item.zhName + '(' + item.mobile + ')'});
              this.loading = false;
            });
          });
        } else {
          this.users.length = 0;
        }
      },
      handlerTags(tags) {
        this.userTags = [];
        this.operateTags = [];
        this.adminTags = [];
        this.ownerTags = tags;
        this.ownerTags.forEach((tag, index) => {
          let tmp = {value: tag.ownerId, label: tag.ownerName, ownerType: tag.ownerType};
          if (tag.ownerType == 0) {
            this.userTags.push(tmp);
          } else if (tag.ownerType == 1) {
            this.operateTags.push(tmp);
          } else if (tag.ownerType == 10) {
            this.adminTags.push(tmp);
          }
        });
      },
      saveOwner() {
        let obj = {};
        let isSelected = false;
        obj = this.users.find((item) => {
          return item.value === this.selected;
        });
        if (obj != "" && obj != undefined) {
          this.userTags.forEach((tag, index) => {
            if (tag.value == this.selected) {
              this.$message({type: 'error', message: "请勿重复添加"});
              isSelected = true;
            }
          });
          this.operateTags.forEach((tag, index) => {
            if (tag.value == this.selected) {
              this.$message({type: 'error', message: "请勿重复添加"});
              isSelected = true;
            }
          });
          this.adminTags.forEach((tag, index) => {
            if (tag.value == this.selected) {
              this.$message({type: 'error', message: "请勿重复添加"});
              isSelected = true;
            }
          });
        }
        if (!isSelected) {
          _util.requestPost(this, this.saveOwnerUrl, {appCode: this.appCode, ownerType: this.ownerType, ownerId: obj.value}, (data) => {
            this.selected = null;
            let tmp = {value: obj.value, label: obj.label, ownerType: this.ownerType};
            if (this.ownerType == 0) {
              this.userTags.push(tmp);
            } else if (this.ownerType == 1) {
              this.operateTags.push(tmp);
            } else if (this.ownerType == 10) {
              this.adminTags.push(tmp);
            }
          });
        }
      },
      remoteOwner(val) {
        _util.requestPost(this, this.deleteOwnerUrl, {appCode: this.appCode, ownerId: val.value}, () => {
          if (val.ownerType == 0) {
            this.userTags.splice(this.userTags.indexOf(val), 1);
          } else if (val.ownerType == 1) {
            this.operateTags.splice(this.operateTags.indexOf(val), 1);
          } else if (val.ownerType == 10) {
            this.adminTags.splice(this.adminTags.indexOf(val), 1);
          }
        });
      },
      selectedBlur() {
        this.selected = null;
      },
    }
  };
</script>