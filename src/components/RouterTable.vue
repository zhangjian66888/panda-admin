<script>

  import Vue from "vue";
  import store from '@/store'
  import router from '@/index/router'
  import Home from '@/index/views/Home.vue'
  import AppIndex from '@/index/views/app/Index.vue'
  import BusinessLineIndex from '@/index/views/business-line/Index'
  import EnvIndex from '@/index/views/env/Index'
  import GroupIndex from '@/index/views/group/Index'
  import PermissionIndex from '@/index/views/permission/Index'
  import RoleIndex from '@/index/views/role/Index'
  import UserIndex from '@/index/views/user/Index'

  const routers = [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/app/index",
      name: "app-index",
      component: AppIndex
    },
    {
      path: "/env/index",
      name: "env-index",
      component: EnvIndex
    },
    {
      path: "/business-line/index",
      name: "business-line-index",
      component: BusinessLineIndex
    },
    {
      path: "/user/index",
      name: "user-index",
      component: UserIndex
    },
    {
      path: "/role/index",
      name: "role-index",
      component: RoleIndex
    },
    {
      path: "/permission/index",
      name: "permission-index",
      component: PermissionIndex
    },
    {
      path: "/group/index",
      name: "group-index",
      component: GroupIndex
    }
  ];

  function checkAccessToken() {
    let token = store.state.accessToken;
    if (token == null || token == '') {
      return false;
    }
    return true;
  }

  function dynamicRouter(permissions) {
    console.log("aaaaaaaaaaaaaaaaa", permissions);
    let hadRouters = routers.filter(item => {
      return permissions.indexOf(item.path) > -1;
    });
    const tmp = new Vue({router});
    console.log("bbbbbbbbbbbbbbbbbb", hadRouters);
    tmp.$router.addRoutes(hadRouters);
    tmp.$router.beforeEach((to, from, next) => {
      if (!checkAccessToken() || permissions.indexOf(to.path) < 0) {
        location.href = '/login.html'
      }
      next();
    });
  }

  export default {
    dynamicRouter,
  }
</script>