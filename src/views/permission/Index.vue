<template>
  <div>
    <el-breadcrumb separator="/" class="pd-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="searchDto" class="pd-search-form">
      <el-form-item label="业务线">
        <el-select v-model="searchDto.businessLineId" @change="businessLineChange"  clearable filterable>
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
      <el-form-item label="名称">
        <el-input v-model="searchDto.name"></el-input>
      </el-form-item>
      <el-form-item label="显示名称">
        <el-input v-model="searchDto.showName"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="searchDto.url"></el-input>
      </el-form-item>
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
        <el-table-column prop="name" label="权限名称" width="120" sortable="custom"/>
        <el-table-column prop="showName" label="显示名称" width="120"/>
        <el-table-column prop="url" label="地址" width="200"/>
        <el-table-column prop="type" label="类型" width="100"/>
        <el-table-column prop="createTime" label="注册时间" width="200"/>
        <el-table-column prop="updateTime" label="更新时间" width="200"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
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
      <el-steps :active="editActive" simple style="margin-bottom: 20px">
        <el-step title="步骤 1" icon="el-icon-edit"></el-step>
        <el-step title="步骤 2" icon="el-icon-upload"></el-step>
        <el-step title="步骤 3" icon="el-icon-picture"></el-step>
      </el-steps>
      <el-form :model="editDto" ref="editDto1" :rules="editRule1" v-show="editActive == 1"
               label-width="100px" label-position="right">
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
        <el-form-item label="权限名称" prop="name">
          <el-input placeholder="请输入内容" v-model="editDto.name">
            <template slot="prepend">ROLE_</template>
          </el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="showName">
          <el-input v-model="editDto.showName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="editDto.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-select v-model="editDto.method">
            <el-option
                v-for="item in permissionMethods"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editDto.type">
            <el-option
                v-for="item in permissionTypes"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-form :model="editDto" ref="editDto2" :rules="editRule2" v-show="editActive == 2"
               label-width="100px" label-position="right">
        <el-form-item label="行为" prop="action">
          <el-select v-model="editDto.action" clearable filterable>
            <el-option
                v-for="item in actions"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="editDto.menuType" @change="menuTypeChange">
            <el-option
                v-for="item in menuTypes"
                :key="item.id"
                :label="item.value"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单" prop="parentId">
          <el-input v-model="editDto.parentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="menuIcon">
          <el-input v-model="editDto.menuIcon" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="editDto" ref="editDto" v-show="editActive == 3"
               label-width="100px" label-position="right">
        <el-form-item label="排序" prop="menuSequence">
          <el-input v-model="editDto.menuSequence" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" rows="3" v-model="editDto.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDaialog">取 消</el-button>
        <el-button @click="editPrev" v-show="editActive <= 3 && editActive > 1">上一步</el-button>
        <el-button @click="editNext" v-show="editActive < 3">下一步</el-button>
        <el-button type="primary" @click="save" v-show="editActive == 3 " v-bind:disabled="saveBtnDisable">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import _util from '../../assets/js/util';
  import _selectItem from '../../components/selectItem.vue';

  export default {
    data() {
      return {
        searchUrl: '/panda/core/permission/search',
        remoteUrl: '/panda/core/permission/delete',
        saveUrl: '/panda/core/permission/save',
        detailUrl: '/panda/core/permission/detail',
        searchDto: {},
        editDto: {},
        records: [],
        editDialogVisible: false,
        saveBtnDisable: false,
        multipleSelection: [],
        editRules: {
          name: [{required: true, trigger: 'blur'}],
          showName: [{required: true, trigger: 'blur'}],
          businessLineId: [{required: true, trigger: 'blur'}],
          appCode: [{required: true, trigger: 'blur'}],
          url: [{required: true, trigger: 'blur'}],
          method: [{required: true, trigger: 'blur'}],
          type: [{required: true, trigger: 'blur'}],
          action: [{required: true, trigger: 'blur'}],
          menuType: [{required: true, trigger: 'blur'}],
        },
        editRule1: {
          name: [{required: true, trigger: 'blur'}],
          showName: [{required: true, trigger: 'blur'}],
          businessLineId: [{required: true, trigger: 'blur'}],
          appCode: [{required: true, trigger: 'blur'}],
          url: [{required: true, trigger: 'blur'}],
          method: [{required: true, trigger: 'blur'}],
          type: [{required: true, trigger: 'blur'}],
        },
        editRule2: {
          action: [{required: true, trigger: 'blur'}],
          menuType: [{required: true, trigger: 'blur'}],
        },
        editActive: 1,
        pagination: {current: 1, pageSize: 20, total: 0},
        sortInfo: {sortField: null, sortOrder: null},
        permissionMethods: [],
        permissionTypes: [],
        actions: [],
        menuTypes: [],
        businessLines: [],
        apps: [],
      }
    },
    created: function () {
      _selectItem.staticSelectItem(this, "permissionMethod");
      _selectItem.staticSelectItem(this, "permissionType");
      _selectItem.staticSelectItem(this, "action");
      _selectItem.staticSelectItem(this, "menuType");
      _selectItem.businessLineSelectItem(this);
      //_selectItem.appSelectItem(this);
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
        this.editActive = 1;
        this.$refs['editDto1'].resetFields();
        this.$refs['editDto2'].resetFields();
        this.editDialogVisible = false;
      },
      save() {
        _util.save(this);
      },
      editPrev() {
        this.editActive--;
      },
      editNext() {
        if (this.editActive == 1 || this.editActive == 2) {
          this.$refs['editDto' + this.editActive].validate((valid) => {
            if (valid) {
              this.editActive++;
            }
          });
        }
      },
      remove(id) {
        _util.removeById(this, id);
      },
      businessLineChange(val) {
        _selectItem.appSelectItem(this, {businessLineId: val});
      },
      menuTypeChange(val) {
        if (val == 1) {
          this.$set(this.editRule2, 'menuIcon', [{required: true, trigger: 'blur'}]);
          this.$set(this.editRule2, 'parentId', []);
        } else if (val == 2) {
          this.$set(this.editRule2, 'parentId', [{required: true, trigger: 'blur'}]);
          this.$set(this.editRule2, 'menuIcon', []);
        } else {
          this.$set(this.editRule2, 'menuIcon', []);
          this.$set(this.editRule2, 'parentId', []);
        }
        return false;
      }
    }
  }
</script>


