<template>
  <div>
    <el-breadcrumb separator="/" class="pd-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务线</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="searchDto" class="pd-search-form">
      <el-form-item label="名称">
        <el-input v-model="searchDto.businessLineName"></el-input>
      </el-form-item>
      <el-form-item label="级别">
        <el-input v-model="searchDto.businessLineLevel"></el-input>
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
        <el-table-column sortable="custom" prop="businessLineName" label="名称" width="120"/>
        <el-table-column prop="businessLineLevel" label="级别" width="120"/>
        <el-table-column prop="parentName" label="父业务线" width="120"/>
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
      <el-form :model="editDto" ref="editDto" :rules="editRules" label-width="100px" label-position="right">
        <el-form-item label="名称" prop="businessLineName">
          <el-input v-model="editDto.businessLineName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="businessLineLevel">
          <el-input v-model="editDto.businessLineLevel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDaialog">取 消</el-button>
        <el-button type="primary" @click="save" v-bind:disabled="saveBtnDisable">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
  import _util from '@/assets/js/util';

  export default {
    data() {
      return {
        searchUrl: '/panda/core/businessline/search',
        removeUrl: '/panda/core/businessline/delete',
        saveUrl: '/panda/core/businessline/save',
        tokenUrl: '/panda/core/businessline/token',
        detailUrl: '/panda/core/businessline/detail',
        searchDto: {},
        editDto: {},
        records: [],
        editDialogVisible: false,
        saveBtnDisable: false,
        multipleSelection: [],
        editRules: {
          businessLineName: [{required: true, trigger: 'blur'}],
          businessLineLevel: [{required: true, trigger: 'blur'}],
        },
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
        _util.showDetail(this, id)
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
      }
    }
  }
</script>