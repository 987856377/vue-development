// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import ecahrts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$echarts = ecahrts;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
// 配置请求根路径
axios.defaults.baseURL = '/'
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// axios.interceptors.response.use(function (response) {
//         // Do something with response data
//         console.log(response);
//         return response;
//     }, function (error) {
//         // Do something with response error
//         return Promise.reject(error);
// });
// 添加响应拦截器
axios.interceptors.request.use(
	config => {
    // config.headers = {
    //    'Content-Type': 'application/json;charset=utf-8',
    //    'X-Requested-With':'XMLHttpRequest'
    // }
    let token = window.sessionStorage.getItem("Authorization")
    if(token){
      config.headers.Authorization = `${token}`;
    }
    console.log("Authorization: "+config.headers.Authorization)
    // 以表单形式提交 post 请求
		// if (config.method === 'post') {
		// 	config.data = qs.stringify(config.data)
    //     console.log(config.data)
		// }
		return config
	},
	error => {
		console.log(error)
		Promise.reject(error)
	}
);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
