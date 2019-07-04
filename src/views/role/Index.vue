<template>
  <div>
    <el-breadcrumb separator="/" class="pd-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="searchDto" class="pd-search-form">
      <el-form-item label="业务线">
        <el-select v-model="searchDto.businessLineId" @change="businessLineChange" clearable filterable>
          <el-option
              v-for="item in businessLines"
              :key="item.id"
              :label="item.value"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
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
        <el-button @click="showAddDialog">新增</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="records" border style="width: 100%" class="pd-list-table"
                header-row-class-name="pd-list-table-header"
                @selection-change="handleSelectionChange"
                @sort-change="handleSortChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="roleName" label="角色" width="120" sortable="custom"/>
        <el-table-column prop="envName" label="环境" width="100"/>
        <el-table-column prop="businessLineName" label="业务线" width="120"/>
        <el-table-column prop="appName" label="应用" width="100"/>
        <el-table-column prop="description" label="描述" width="200"/>
        <el-table-column prop="createTime" label="注册时间" width="200"/>
        <el-table-column prop="updateTime" label="更新时间" width="200"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
            <el-button @click="grant(scope.row)" type="text" size="small">授权</el-button>
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
        <el-form-item label="环境" prop="envCode">
          <el-select v-model="editDto.envCode" filterable>
            <el-option
                v-for="item in envs"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务线" prop="businessLineId">
          <el-select v-model="editDto.businessLineId" @change="businessLineChange" filterable>
            <el-option
                v-for="item in businessLines"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用" prop="appCode">
          <el-select v-model="editDto.appCode" filterable>
            <el-option
                v-for="item in apps"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editDto.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editDto.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDaialog">取 消</el-button>
        <el-button type="primary" @click="save" v-bind:disabled="saveBtnDisable">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="授权框" :visible.sync="grantDialogVisible" class="pd-large-dialog" center>
      <Grant :role-id="currentRoleId"
             :business-line-id="currentBusinessLineId"
             :app-code="currentAppCode"
             :selected-tags="selectedTags"/>
    </el-dialog>
  </div>
</template>
<script>
  import _util from '../../assets/js/util';
  import _selectItem from '../../components/selectItem.vue';
  import Grant from '../../views/role/Grant.vue';

  export default {
    data() {
      return {
        searchUrl: '/panda/core/role/search',
        removeUrl: '/panda/core/role/delete',
        saveUrl: '/panda/core/role/save',
        detailUrl: '/panda/core/role/detail',
        permissionUrl: '/panda/core/role/permissions',
        searchDto: {},
        editDto: {},
        records: [],
        editDialogVisible: false,
        saveBtnDisable: false,
        multipleSelection: [],
        editRules: {
          roleName: [{required: true, trigger: 'blur'}],
          businessLineId: [{required: true, trigger: 'blur'}],
          appCode: [{required: true, trigger: 'blur'}],
          envCode: [{required: true, trigger: 'blur'}],
        },
        pagination: {current: 1, pageSize: 20, total: 0},
        sortInfo: {sortField: null, sortOrder: null},
        businessLines: [],
        apps: [],
        envs: [],
        grantDialogVisible: false,
        selectedTags: [],
        currentRoleId: null,
        currentBusinessLineId: null,
        currentAppCode: null,
      }
    },
    components: {
      Grant
    },
    created: function () {
      _selectItem.businessLineSelectItem(this);
      _selectItem.envSelectItem(this);
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
        console.log("multipleSelection", val);
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
      businessLineChange(val) {
        _selectItem.appSelectItem(this, {businessLineId: val});
      },
      grant(val) {
        this.currentRoleId = val.id;
        this.currentBusinessLineId = val.businessLineId;
        this.currentAppCode = val.appCode;
        this.grantDialogVisible = true;
        _util.requestGet(this, this.permissionUrl, {id: val.id}, (data) => {
          this.selectedTags = data ? data : [];
        });
      }
    }
  }
</script>


