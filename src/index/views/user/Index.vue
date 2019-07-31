<template xmlns:v-has="">
  <div>
    <el-breadcrumb separator="/" class="pd-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
      <el-form-item label="用户名">
        <el-input v-model="searchDto.username"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="searchDto.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="searchDto.email"></el-input>
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
        <el-table-column prop="groupName" label="组" width="120"/>
        <el-table-column prop="username" label="用户名" width="120" sortable="custom"/>
        <el-table-column prop="zhName" label="中文名" width="120"/>
        <el-table-column prop="mobile" label="手机" width="120" sortable="custom"/>
        <el-table-column prop="email" label="邮箱" width="200"/>
        <el-table-column prop="userTypeShow" label="类型" width="100"/>
        <el-table-column prop="createTime" label="注册时间" width="200"/>
        <el-table-column prop="updateTime" label="更新时间" width="200"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" type="text" size="small" v-if="phas('USER_EDIT')">编辑</el-button>
            <el-button @click="showCopyDialog(scope.row.id)" type="text" size="small" v-if="phas('USER_COPY')">复制</el-button>
            <el-button @click="remove(scope.row.id)" type="text" size="small" v-if="phas('USER_DELETE')">删除</el-button>
            <el-button @click="bind(scope.row)" type="text" size="small" v-if="phas('USER_BIND')">绑定</el-button>
            <el-button @click="resetPasswd(scope.row.id)" type="text" size="small" v-if="phas('USER_RESET_PASSWD')">重置</el-button>
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
          <el-select v-model="editDto.businessLineId" @change="businessLineChange" clearable filterable>
            <el-option
                v-for="item in businessLines"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="组" prop="groupId">
          <el-select v-model="editDto.groupId" clearable filterable>
            <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editDto.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="中文名" prop="zhName">
          <el-input v-model="editDto.zhName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editDto.mobile" type="mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editDto.email" type="email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editDto.id">
          <el-input v-model="editDto.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="userType">
          <el-select v-model="editDto.userType" clearable filterable>
            <el-option
                v-for="item in userTypes"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDaialog">取 消</el-button>
        <el-button type="primary" @click="save" v-bind:disabled="saveBtnDisable">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="绑定权限" :visible.sync="bindDialogVisible" class="pd-large-dialog" center>
      <Bind
          :apps="apps"
          :user-id="currentUserId"
          :business-line-id="currentBusinessLineId"
          :selected-tags="selectedTags"/>
    </el-dialog>
  </div>
</template>
<script>
  import _util from '@/assets/js/util';
  import _selectItem from '@/components/SelectItem.vue';
  import Bind from './Bind.vue'

  export default {
    data() {
      return {
        searchUrl: '/panda/core/user/search',
        removeUrl: '/panda/core/user/delete',
        saveUrl: '/panda/core/user/save',
        detailUrl: '/panda/core/user/detail',
        copyUrl: '/panda/core/user/copy',
        roleUrl: '/panda/core/user/roles',
        resetPasswdUrl: '/panda/core/user/reset/passwd/',
        searchDto: {},
        editDto: {},
        records: [],
        editDialogVisible: false,
        saveBtnDisable: false,
        multipleSelection: [],
        editRules: {
          businessLineId: [{required: true, trigger: 'blur'}],
          username: [{required: true, trigger: 'blur'}],
          zhName: [{required: true, trigger: 'blur'}],
          mobile: [{required: true, trigger: 'blur'}],
          email: [{required: true, trigger: 'blur'}],
          userType: [{required: true, trigger: 'blur'}],
          password: [{required: true, trigger: 'blur'}],
        },
        pagination: {current: 1, pageSize: 20, total: 0},
        sortInfo: {sortField: null, sortOrder: null},
        userTypes: [],
        businessLines: [],
        groups: [],
        bindDialogVisible: false,
        selectedTags: [],
        currentUserId: null,
        currentBusinessLineId: null,
        apps: [],
      }
    },
    components: {
      Bind
    },
    created: function () {
      _selectItem.staticSelectItem(this, "userType");
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
        _util.showDetail(this, id, () => this.businessLineChange(this.editDto.businessLineId));
      },
      showCopyDialog(id) {
        _util.showCopy(this, id, () => this.businessLineChange(this.editDto.businessLineId));
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
      businessLineChange(val) {
        _selectItem.groupSelectItem(this, {businessLineId: val});
      },
      bind(val) {
        this.currentUserId = val.id;
        this.currentBusinessLineId = val.businessLineId;
        this.bindDialogVisible = true;
        _util.requestGet(this, this.roleUrl, {id: val.id}, (data) => {
          this.selectedTags = data ? data : [];
        });
        _selectItem.appSelectItem(this, {businessLineId: val.businessLineId});
      },
      resetPasswd(id) {
        this.$confirm('确定重置密码，是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _util.requestPost(this, this.resetPasswdUrl + id);
        }).catch((e) => {
          this.$message({
            type: 'info', message: '已取消重置'
          });
        });
      }
    }
  }
</script>


