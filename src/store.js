import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem("accessToken") ? localStorage.getItem('accessToken') : '',
    expireTime: localStorage.getItem("expireTime") ? localStorage.getItem('expireTime') : '',
    zhName: localStorage.getItem("zhName") ? localStorage.getItem('zhName') : '',
  },
  mutations: {
    saveLoginInfo(state, data) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("expireTime", data.expireTime);
      localStorage.setItem("zhName", data.zhName);
      state.accessToken = data.accessToken;
      state.expireTime = data.expireTime;
      state.zhName = data.zhName;
      location.href = '/';
      console.log("zhName", state.zhName);
    },
    clearLoginInfo(state) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expireTime");
      localStorage.removeItem("zhName");
      state.accessToken = null;
      state.expireTime = null;
      state.zhName = null;
      location.href = '/login.html';
    },
  },
  actions: {
    checkToken() {
      let token = this.state.accessToken;
      if (token == null || token == '') {
        return false
      }
      return true;
    },
  },
})
