import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.css'
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import PanelTag from '@/components/PanelTag.vue'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component('pd-panel-tag', PanelTag);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
