import Axios from "axios";
import store from "@/store";

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
  }, error => Promise.reject(error)
)
export default service