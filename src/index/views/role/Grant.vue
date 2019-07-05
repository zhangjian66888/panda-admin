<template>
  <div>
    <pd-panel-tag title="selected" :tags="selectedTags" v-on:tagRemove="removePermission"></pd-panel-tag>
    <el-divider></el-divider>
    <el-form :inline="true" :model="searchDto" class="pd-search-form">
      <el-form-item label="类型">
        <el-select v-model="searchDto.type" clearable filterable>
          <el-option
              v-for="item in permissionTypes"
              :key="item.id"
              :label="item.value"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="searchDto.name"></el-input>
      </el-form-item>
      <el-form-item label="显示名称">
        <el-input v-model="searchDto.showName"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="searchDto.url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="records" border style="width: 100%" class="pd-list-table"
                header-row-class-name="pd-list-table-header"
                @sort-change="handleSortChange">
        <el-table-column prop="name" label="权限名称" width="120" sortable="custom"/>
        <el-table-column prop="showName" label="显示名称" width="120"/>
        <!--<el-table-column prop="url" label="地址" width="200"/>-->
        <el-table-column prop="typeShow" label="类型" width="100"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="grantPremission(scope.row)" type="text" size="small">选择</el-button>
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
  import _selectItem from '@/components/SelectItem.vue';

  export default {
    props: {
      selectedTags: Array,
      roleId: Number,
      businessLineId: Number,
      appCode: Number,
    },
    data() {
      return {
        searchUrl: '/panda/core/permission/search',
        savePermissionUrl: '/panda/core/role/savePermission',
        deletePermissionUrl: '/panda/core/role/deletePermission',
        searchDto: {},
        records: [],
        pagination: {current: 1, pageSize: 20, total: 0},
        sortInfo: {sortField: null, sortOrder: null},
        permissionMethods: [],
        permissionTypes: [],
        actions: [],
        menuTypes: []
      }
    },
    created: function () {
      _selectItem.staticSelectItem(this, "permissionType");
      _selectItem.staticSelectItem(this, "action");
      _selectItem.staticSelectItem(this, "menuType");
      _selectItem.businessLineSelectItem(this);
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
        this.searchDto.appCode = this.appCode;
        _util.searching(this);
      },
      businessLineChange(val) {
        _selectItem.appSelectItem(this, {businessLineId: val});
      },
      grantPremission(val) {
        let granted = false;
        this.selectedTags.forEach((tag, index) => {
          if (tag.id == val.id) {
            this.$message({type: 'error', message: "请勿重复添加"});
            granted = true;
          }
        });
        if (!granted) {
          _util.requestPost(this, this.savePermissionUrl, {roleId: this.roleId, permissionId: val.value}, (data) => {
            this.selectedTags.push({value: val.id, label: val.showName, title: val.name});
          });
        }
      },
      removePermission(val) {
        _util.requestPost(this, this.deletePermissionUrl, {roleId: this.roleId, permissionId: val.value}, () => {
          this.selectedTags.splice(this.selectedTags.indexOf(val), 1);
        });
        console.log("removePermission", val);
      }
    }
  }
</script>


