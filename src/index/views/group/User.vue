<template>
  <div>
    <el-select
        v-model="selected"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="loadUser"
        :loading="loading"
        @change="selectedChanage"
        @blur="selectedBlur"
    >
      <el-option
          v-for="item in users"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>

    <el-divider></el-divider>
    <pd-panel-tag title="selected" :tags="selectedTags" v-on:tagRemove="removeUser"></pd-panel-tag>
  </div>
</template>

<script>
  import _util from '@/assets/js/util';

  export default {
    props: {
      selectedTags: Array,
      groupId: Number,
    },
    data() {
      return {
        loading: false,
        users: [],
        selected: null,
        vagueUserUrl: '/panda/core/user/vague',
        saveUserUrl: '/panda/core/group/saveUser',
        deleteUserUrl: '/panda/core/group/deleteUser',
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
      removeUser(val) {
        _util.requestPost(this, this.deleteUserUrl, {groupId: this.groupId, userId: val.value}, () => {
          this.selectedTags.splice(this.selectedTags.indexOf(val), 1);
        });
      },
      selectedChanage(val) {
        let obj = {};
        let selected = false;
        obj = this.users.find((item) => {
          return item.value === val;
        });
        if (obj != "" && obj != undefined) {
          this.selectedTags.forEach((tag, index) => {
            if (tag.value == val) {
              this.$message({type: 'error', message: "请勿重复添加"});
              selected = true;
            }
          });
        }
        if (!selected) {
          _util.requestPost(this, this.saveUserUrl, {groupId: this.groupId, userId: obj.value}, (data) => {
            this.selected = null;
            this.selectedTags.push({value: obj.value, label: obj.label});
          });
        }
      },
      selectedBlur(){
        this.selected = null;
      },
    }
  };
</script>