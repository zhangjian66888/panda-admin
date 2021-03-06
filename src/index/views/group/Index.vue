<template>
  <div>
    <el-breadcrumb separator="/" class="pd-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="searchDto" class="pd-search-form" @keyup.enter.native="search">
      <el-form-item label="业务线">
        <el-select v-model="searchDto.businessLineId" clearable filterable>
          <el-option
              v-for="item in businessLines"
              :key="item.id"
              :label="item.value"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="searchDto.groupName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="showAddDialog">新增</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="records" border style="width: 100%" class="pd-list-table"
                header-row-class-name="pd-list-table-header"
                @selection-change="handleSelectionChange"
                @sort-change="handleSortChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="businessLineName" label="业务线" width="120"/>
        <el-table-column prop="groupName" label="组名" width="120"/>
        <el-table-column prop="createTime" label="注册时间" width="200"/>
        <el-table-column prop="updateTime" label="更新时间" width="200"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
            <el-button @click="bind(scope.row)" type="text" size="small">绑定</el-button>
            <el-button @click="operUser(scope.row)" type="text" size="small">成员</el-button>
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
    <el-dialog title="编辑框" :visible.sync="editDialogVisible" class="pd-edit-dialog" center>
      <el-form :model="editDto" ref="editDto" :rules="editRules" label-width="100px" label-position="right">
        <el-form-item label="业务线" prop="businessLineId">
          <el-select v-model="editDto.businessLineId" clearable filterable>
            <el-option
                v-for="item in businessLines"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="组名" prop="groupName">
          <el-input v-model="editDto.groupName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDaialog">取 消</el-button>
        <el-button type="primary" @click="save" v-bind:disabled="saveBtnDisable">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="绑定权限" :visible.sync="bindDialogVisible" class="pd-large-dialog" center>
      <Bind :apps="apps"
            :group-id="currentGroupId"
            :business-line-id="currentBusinessLineId"
            :selected-tags="selectedTags"/>
    </el-dialog>
    <el-dialog title="操作用户" :visible.sync="userDialogVisible" class="pd-middle-dialog" center>
      <User :group-id="currentGroupId" :selected-tags="selectedUsers"/>
    </el-dialog>
  </div>
</template>
<script>
  import _util from '@/assets/js/util';
  import _selectItem from '@/components/SelectItem.vue';
  import Bind from './Bind.vue';
  import User from './User.vue';

  export default {
    data() {
      return {
        searchUrl: '/panda/core/group/search',
        removeUrl: '/panda/core/group/delete',
        saveUrl: '/panda/core/group/save',
        detailUrl: '/panda/core/group/detail',
        roleUrl: '/panda/core/group/roles',
        userUrl: '/panda/core/group/users',
        searchDto: {},
        editDto: {},
        records: [],
        editDialogVisible: false,
        saveBtnDisable: false,
        multipleSelection: [],
        editRules: {
          appAlias: [{required: true, trigger: 'blur'}],
          appName: [{required: true, trigger: 'blur'}],
          appLevel: [{required: true, trigger: 'blur'}],
          businessLineId: [{required: true, trigger: 'blur'}],
        },
        pagination: {current: 1, pageSize: 20, total: 0},
        sortInfo: {sortField: null, sortOrder: null},
        businessLines: [],
        bindDialogVisible: false,
        selectedTags: [],
        currentGroupId: null,
        currentBusinessLineId: null,
        apps: [],
        userDialogVisible: false,
        selectedUsers: [],
      }
    },
    components: {
      Bind,
      User
    },
    created: function () {
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
        _util.searching(this);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      showAddDialog() {
        this.editDto = {};
        this.saveBtnDisable = false;
        this.editDialogVisible = true;
      },
      showEditDialog(id) {
        _util.showDetail(this, id);
      },
      closeDaialog() {
        this.$refs['editDto'].resetFields();
        this.editDialogVisible = false;
      },
      save() {
        _util.save(this);
      },
      remove(id) {
        _util.removeById(this, id);
      },
      bind(val) {
        this.currentGroupId = val.id;
        this.currentBusinessLineId = val.businessLineId;
        this.bindDialogVisible = true;
        _util.requestGet(this, this.roleUrl, {id: val.id}, (data) => {
          this.selectedTags = data ? data : [];
        });
        _selectItem.appSelectItem(this, {businessLineId: val.businessLineId});
      },
      operUser(val) {
        this.currentGroupId = val.id;
        this.userDialogVisible = true;
        _util.requestGet(this, this.userUrl, {id: val.id}, (data) => {
          this.selectedUsers = data ? data : [];
        });
      },
    }
  }
</script>


