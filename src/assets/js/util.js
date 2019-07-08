import Axios from '@/_axios';
import _global from '@/_global';

function searching(vueObj) {
  const params = {
    pageSize: vueObj.pagination.pageSize,
    current: vueObj.pagination.current,
    sortField: vueObj.sortInfo.sortField,
    sortOrder: vueObj.sortInfo.sortOrder,
    ...vueObj.searchDto
  }
  for (let k in params) {
    if (!params[k]) delete params[k];
  }
  Axios({
    url: _global.backUrl + vueObj.searchUrl,
    method: "get",
    params: {
      ...params
    },
    type: "json"
  }).then(response => {
    let data = response.data;
    vueObj.pagination.total = data.total;
    vueObj.records = data.records;
  });
}

function showDetail(vueObj, id) {
  Axios({
    url: _global.backUrl + vueObj.detailUrl,
    method: "get",
    params: {id: id},
    type: "json"
  }).then(response => {
    let data = response.data;
    if (data.code == 0) {
      vueObj.editDto = data.data;
      vueObj.saveBtnDisable = false;
      vueObj.editDialogVisible = true;
    } else {
      vueObj.$message({
        type: 'error', message: data.msg
      });
    }
  });
}

function removeById(vueObj, id) {
  vueObj.$confirm('此操作将永久删除，是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    Axios({
      url: _global.backUrl + vueObj.removeUrl,
      method: "post",
      params: {id: id},
      type: "json"
    }).then(response => {
      let data = response.data;
      if (data.code == 0) {
        vueObj.$message({
          type: 'success', message: data.msg
        });
        vueObj.search();
      } else {
        vueObj.$message({
          type: 'error', message: data.msg
        });
      }
    });
  }).catch((e) => {
    console.log("remove catch", e);
    vueObj.$message({
      type: 'info', message: '已取消删除'
    });
  });
}

function save(vueObj) {
  vueObj.$refs['editDto'].validate((valid) => {
    if (valid) {
      vueObj.saveBtnDisable = true;
      Axios({
        url: _global.backUrl + vueObj.saveUrl,
        method: "post",
        data: JSON.stringify(vueObj.editDto),
        type: "json"
      }).then(response => {
        let data = response.data;
        vueObj.saveBtnDisable = false;
        if (data.code == 0) {
          vueObj.$message({
            type: 'success', message: data.msg
          });
          vueObj.editDialogVisible = false;
          vueObj.search();
        } else {
          vueObj.$message({
            type: 'error', message: data.msg
          });
        }
      }, (err, msg) => {
        this.$message({
          type: 'error', message: msg
        });
        vueObj.saveBtnDisable = false;
      });
    } else {
      return false;
    }
  });
}

function requestGet(vueObj, url, params = {}, successFun) {
  Axios({
    url: _global.backUrl + url,
    method: "get",
    params: params,
    type: "json"
  }).then(response => {
    let data = response.data;
    if (data.code == 0) {
      if (successFun) {
        successFun(data.data);
      }
    } else {
      vueObj.$message({
        type: 'error', message: data.msg
      });
    }
  });
}

function requestPost(vueObj, url, params = {}, successFun) {
  Axios({
    url: _global.backUrl + url,
    method: "post",
    data: JSON.stringify(params),
    type: "json"
  }).then(response => {
    let data = response.data;
    if (data.code == 0) {
      if (successFun) {
        successFun(data.data);
      }
    } else {
      vueObj.$message({
        type: 'error', message: data.msg
      });
    }
  });
}

export default {
  searching,
  showDetail,
  removeById,
  save,
  requestGet,
  requestPost
}


