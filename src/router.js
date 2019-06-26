import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/app/index",
      name: "app-index",
      component: () =>
        import("./views/app/Index.vue")
    },
    {
      path: "/env/index",
      name: "env-index",
      component: () =>
        import("./views/env/Index.vue")
    },
    {
      path: "/business-line/index",
      name: "business-line-index",
      component: () =>
        import("./views/business-line/Index.vue")
    }
  ]
});
