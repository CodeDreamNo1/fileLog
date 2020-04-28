// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
// 加载样式
import '@vnnox/novaui/libs/nova.css'
// 加载ui组件库
import NovaUI from '@vnnox/novaui/libs/nova-vue.js'
Vue.config.productionTip = false

Vue.prototype.$axios = axios;
// 正式
// axios.defaults.baseURL = 'http://localhost:4000';
Vue.use(NovaUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
