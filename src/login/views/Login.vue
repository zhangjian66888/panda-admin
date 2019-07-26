<template>
  <div class="pd-panel-login">
    <el-row>
      <el-col :span="24" class="pd-panel-login-title"> 登录框
      </el-col>
    </el-row>
    <el-form label-width="80px" :model="loginInfo" :rules="rules" ref="loginInfo" class="pd-login-form" @keyup.enter.native="submitForm('loginInfo')">
      <el-form-item label="账号" prop="username">
        <el-input v-model="loginInfo.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginInfo.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="vcode">
        <el-input v-model="loginInfo.vcode">
          <el-button slot="append" @click="createVCode">{{vcode}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginInfo')">提交</el-button>
        <el-button @click="resetForm('loginInfo')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  import _util from '@/assets/js/util';
  import store from '@/store'

  export default {
    data() {
      let checkVCode = (rule, value, callback) => {
        if (value == null || value == '') {
          callback(new Error('code is required'));
        } else if (value.toUpperCase() !== this.vcode) {
          callback(new Error('code is error!'));
        } else {
          callback();
        }
      };
      return {
        vcode: null,
        loginInfo: {},
        rules: {
          username: [{required: true, trigger: 'blur'}],
          password: [{required: true, trigger: 'blur'}],
          vcode: [{validator: checkVCode, trigger: 'blur'}],
        },
      }
    },
    mounted() {
      let callback = _util.getUrlKey("callback");
      if (callback) {
        console.log("callback url", callback);
      } else {
        store.dispatch('checkToken').then(data => {
          if (data) {
            location.href = "/";
          }
        });
      }
      this.createVCode();
    },
    methods: {
      ...mapMutations(['saveLoginInfo']),
      submitForm(formName) {
        let callback = _util.getUrlKey("callback");
        let level = _util.getUrlKey("level");
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _util.requestPost(this, '/panda/core/login',
              {callback: callback, level: level, ...this.loginInfo},
              (data) => {
                if (data.callback) {
                  let href = data.callback;
                  if (data.level && data.level == 'high') {
                    href = href + "?timeCode=" + data.timeCode;
                  } else {
                    href = href + "?token=" + data.accessToken;
                  }
                  console.log("callback is ", href);
                  location.href = href;
                } else {
                  this.saveLoginInfo(data);
                }

              }, () => this.createVCode());
          } else {
            this.createVCode();
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      createVCode() {
        let code = "";
        let codeLength = 4;//验证码的长度
        let random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
          'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数
        for (let i = 0; i < codeLength; i++) {
          //循环操作
          let index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）
          code += random[index];//根据索引取得随机数加到code上
        }
        this.vcode = code;//把code值赋给验证码
      },

    }
  }
</script>
<style scoped>

  .pd-panel-login {
    position: fixed;
    top: 20%;
    right: 5%;
    height: 300px;
    width: 400px;
    background-color: rgba(255, 255, 255, 0.2);
    /*border: 1px solid #ddd;*/
    border-radius: 4px;
    /*-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .2);*/
    /*box-shadow: 0 1px 1px rgba(0, 0, 0, .2);*/

  }

  .pd-panel-login-title {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: #333;
    background-color: #f5f5f5;
    background-color: rgba(255, 255, 255, 0.2);
    border-color: #ddd;
  }

  .pd-login-form {
    padding: 20px 0;
    font-size: 18px;
  }

  .pd-login-form .el-input {
    width: 80%;
  }

</style>