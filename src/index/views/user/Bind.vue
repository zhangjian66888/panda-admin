<template>
  <div>
    <pd-panel-tag title="selected" :tags="selectedTags" v-on:tagRemove="removeRole"></pd-panel-tag>
    <el-divider></el-divider>
    <el-form :inline="true" :model="searchDto" class="pd-search-form" @keyup.enter.native="search">
      <el-form-item label="应用">
        <el-select v-model="searchDto.appCode" clearable filterable>
          <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.value"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色名">
        <el-input v-model="searchDto.roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="records" border style="width: 100%" class="pd-list-table"
                header-row-class-name="pd-list-table-header"
                @sort-change="handleSortChange">
        <el-table-column prop="businessLineName" label="业务线" width="120"/>
        <el-table-column prop="envName" label="环境" width="100"/>
        <el-table-column prop="appName" label="应用" width="100"/>
        <el-table-column prop="roleName" label="角色" width="120" sortable="custom"/>
        <el-table-column prop="description" label="描述" width="200"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="bindRole(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pd-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.current"
          :page-size="pagination.pageSize"
          :page-sizes="[1, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import _util from '@/assets/js/util';

  export default {
    props: {
      selectedTags: Array,
      userId: Number,
      businessLineId: Number,
      apps: Array,
    },
    data() {
      return {
        searchUrl: '/panda/core/role/search',
        saveRoleUrl: '/panda/core/user/saveRole',
        deleteRoleUrl: '/panda/core/user/deleteRole',
        searchDto: {},
        records: [],
        pagination: {current: 1, pageSize: 20, total: 0},
        sortInfo: {sortField: null, sortOrder: null},
      }
    },
    methods: {
      search() {
        this.pagination.current = 1;
        this.searching();
      },
      handleSizeChange(val) {
        this.pagination.pageSize = val;
        this.searching();
      },
      handleCurrentChange(val) {
        this.pagination.current = val;
        this.searching();
      },
      handleSortChange(val) {
        this.sortInfo.sortField = val.prop;
        this.sortInfo.sortOrder = val.order;
        this.searching();
      },
      searching() {
        this.searchDto.businessLineId = this.businessLineId;
        _util.searching(this);
      },
      bindRole(val) {
        let binded = false;
        this.selectedTags.forEach((tag, index) => {
          if (tag.value == val.id) {
            this.$message({type: 'error', message: "请勿重复添加"});
            binded = true;
          }
        });
        if (!binded) {
          _util.requestPost(this, this.saveRoleUrl, {userId: this.userId, roleId: val.id}, (data) => {
            this.selectedTags.push({value: val.id, label: val.roleName});
          });
        }
      },
      removeRole(val) {
        _util.requestPost(this, this.deleteRoleUrl, {userId: this.userId, roleId: val.value}, () => {
          this.selectedTags.splice(this.selectedTags.indexOf(val), 1);
        });
      }
    }
  }
</script>