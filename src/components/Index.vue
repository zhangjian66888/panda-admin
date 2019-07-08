<template>
  <el-container class="pd-main">
    <el-header class="pd-header">
      <div class="pd-logo">权限中心</div>
      <div class="pd-user-info">
        <a href="/"><i class="el-icon-message"></i></a>
        <a href="/"><i class="el-icon-user-solid"></i><span>{{zhName}}</span></a>
        <a href="/"><i class="el-icon-setting"></i></a>
        <a href="javascript:void(0);" @click="logout"><i class="el-icon-switch-button"></i></a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
          <slot v-for="menu in menus">
            <el-submenu v-if="menu.subMenus" v-bind:index="menu.index">
              <template slot="title">
                <i v-bind:class="menu.icon"></i>
                <span>{{ menu.title }}</span>
              </template>
              <el-menu-item i v-bind:index="subMenu.index" v-for="subMenu  in menu.subMenus">
                {{ subMenu.title }}
                <router-link v-bind:to="subMenu.url"/>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-bind:index="menu.index" v-else>
              <template slot="title">
                <i v-bind:class="menu.icon"></i>
                <span>{{ menu.title }}</span>
                <router-link v-if="menu.url" v-bind:to="menu.url"/>
              </template>
            </el-menu-item>
          </slot>
        </el-menu>
      </el-aside>
      <el-main class="pd-content">
        <router-view/>
      </el-main>
    </el-container>
    <el-footer class="pd-footer">panda ©2019 Created by zlj</el-footer>
  </el-container>
</template>
<script>
  import store from '@/store';

  export default {
    name: "Index",
    props: {
      menusList: Array
    },
    data() {
      return {
        zhName: store.state.zhName
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      logout() {
        store.commit('clearLoginInfo');
      }
    },
    created: function () {
      store.dispatch("checkToken").then(data => {
        if (!data) location.href = 'login.html'
      });
    },
    computed: {
      menus: function () {
        this.menusList.forEach((menu, index) => {
          menu.index = index + "";
          if (menu.subMenus) {
            menu.subMenus.forEach((subMenu, subIndex) => {
              subMenu.index = index + '_' + subIndex
            });
          }
        })
        return this.menusList;
      }
      ,
    }
  }
</script>
<style lang="less">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 600px;
  }

  .pd-main .pd-header {
    padding: 0px 10px;
    background: #fff;
    box-shadow: 0 2px 8px #f0f1f2;
    position: relative;
    z-index: 10;
    max-width: 100%;
  }

  .pd-main .pd-logo {
    width: 200px;
    height: 30px;
    line-height: 30px;
    margin: 16px 0;
    float: left;
    text-align: center;
    font-weight: bold;
    color: #000;
  }

  .pd-main .pd-logo:before {
    width: 30px;
    height: 30px;
    background: url("../assets/logo.png") no-repeat;
    background-size: contain;
    content: "";
    position: absolute;
    top: 16px;
    left: 40px;
  }

  .pd-main .pd-user-info {
    float: right;
    margin: 16px 0 16px 28px;
    height: 30px;
    line-height: 30px;
  }

  .pd-main .pd-user-info a {
    padding: 0px 5px;
  }

  .pd-main .pd-footer {
    text-align: center;
    position: fixed;
    bottom: 0px;
    width: 100%;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, .1);
    height: 60px;
    line-height: 60px;
  }

  .el-menu-item > a:before {
    position: absolute;
    background-color: transparent;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';
  }

  .pd-main .el-main {
    padding: 0px;
  }

  .pd-main .el-main:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    background: url("../assets/images/home-bg.png");
    opacity: 0.02;

  }
</style>