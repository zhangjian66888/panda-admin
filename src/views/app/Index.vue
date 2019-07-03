<template>
  <div>
    <el-breadcrumb separator="/" class="pd-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应用管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="searchDto" class="pd-search-form">
      <el-form-item label="名称">
        <el-input v-model="searchDto.appAlias"></el-input>
      </el-form-item>
      <el-form-item label="应用名">
        <el-input v-model="searchDto.appName"></el-input>
      </el-form-item>
      <el-form-item label="业务线">
        <el-select v-model="searchDto.businessLine" clearable filterable>
          <el-option
              v-for="item in businessLines"
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
        <el-table-column sortable="custom" fixed prop="appAlias" label="名称" width="120">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="right" @show="showPopover(scope.row)">
              <p>应用编号 : {{ scope.row.appCode }}</p>
              <p>应用名 : {{ scope.row.appName }}</p>
              <el-table :data="scope.row.secrets">
                <el-table-column width="50" property="envProfile" label="环境"></el-table-column>
                <el-table-column width="300" property="secret" label="秘钥"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="flushSecret(scope.row)">刷新</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.appAlias }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="appCode" label="应用编号" width="120"/>
        <el-table-column sortable="custom" prop="appName" label="应用名" width="120"/>
        <el-table-column prop="businessLineName" label="业务线" width="120"/>
        <el-table-column prop="appLevel" label="级别" width="80"/>
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
        <el-form-item label="名称" prop="appAlias">
          <el-input v-model="editDto.appAlias" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="应用名" prop="appName">
          <el-input v-model="editDto.appName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="应用级别" prop="appLevel">
          <el-input v-model="editDto.appLevel" type="number" autocomplete="off"></el-input>
        </el-form-item>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDaialog">取 消</el-button>
        <el-button type="primary" @click="save" v-bind:disabled="saveBtnDisable">确 定</el-button>
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
        searchUrl: '/panda/core/app/search',
        removeUrl: '/panda/core/app/delete',
        saveUrl: '/panda/core/app/save',
        secretUrl: '/panda/core/app/secrets',
        detailUrl: '/panda/core/app/detail',
        flushSecretUrl: '/panda/core/app/flushSecret',
        searchDto: {},
        editDto: {},
        records: [],
        editDialogVisible: false,
        saveBtnDisable: false,
        multipleSelection: [],
        businessLines: [/*{id: 1, name: "小班课"}, {id: 2, name: "luna数学"}*/],
        editRules: {
          appAlias: [{required: true, trigger: 'blur'}],
          appName: [{required: true, trigger: 'blur'}],
          appLevel: [{required: true, trigger: 'blur'}],
          businessLineId: [{required: true, trigger: 'blur'}],
        },
        pagination: {current: 1, pageSize: 20, total: 0},
        sortInfo: {sortField: null, sortOrder: null},
      }
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
        console.log("multipleSelection", val);
        this.multipleSelection = val;
      },
      showPopover(row) {
        if (!row.secrets) {
          _util.requestGet(this, this.secretUrl,
            {"appCode": row.appCode},
            (data) => {
              this.$set(row, 'secrets', data);
            });
        }
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
      flushSecret(val) {
        _util.requestPost(this, this.flushSecretUrl, {appCode: val.appCode, envProfile: val.envProfile, envCode: val.envCode}, (data) => {
          this.$set(val, 'secret', data);
        });
      }
    }
  }
</script>


