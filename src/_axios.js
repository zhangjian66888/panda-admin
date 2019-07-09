import Axios from "axios";
import store from "@/store";
import {Message} from 'element-ui';

const service = Axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});
service.interceptors.request.use(config => {
  const token = store.state.accessToken;
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config
}, error => Promise.reject(error));

service.interceptors.response.use(response => {
    if (response.data && response.data.code === 401) { // 401, token失效
      store.dispatch('clearLoginInfo')
    }
    return response
  }, error => {
    Message({
      showClose: true,
      message: error.response.data.msg,
      type: 'error'
    });
    return Promise.reject(error.response);
  }
);

export default service