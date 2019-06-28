<template>
  <div id="app">
    <Index :menusList="menusList"></Index>
  </div>
</template>

<script>
  import Index from "@/components/Index.vue";

  export default {
    data() {
      return {
        menusList: [
          {"icon": "el-icon-s-home", "title": "首页", "url": "/"},
          {"icon": "el-icon-c-scale-to-original", "title": "业务线", "url": "/business-line/index"},
          {"icon": "el-icon-s-grid", "title": "应用管理", "url": "/app/index"},
          {"icon": "el-icon-grape", "title": "环境管理", "url": "/env/index"},
          {"icon": "el-icon-s-goods", "title": "用户组", "url": "/group/index"},
          {"icon": "el-icon-s-custom", "title": "用户管理", "url": "/user/index"},
          {"icon": "el-icon-bangzhu", "title": "角色管理", "url": "/role/index"},
          {"icon": "el-icon-cpu", "title": "权限管理", "url": "/permission/index"},
        ],
        /*{ "icon": "el-icon-grape", "title": "环境管理", "subMenus": [{ "title": "环境首页", "url": "/env/index"}]}]*/
      }
    },
    components: {
      Index
    }
  };
</script>
<style lang="less">
  body {
    margin: 0px;
  }
</style>
