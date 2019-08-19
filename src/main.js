// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


 Vue.config.productionTip = false
 import 'font-awesome/css/font-awesome.min.css'
 
 import ElementUI from 'element-ui'
 import './assets/theme/element-#DAC841/index.css'
 Vue.use(ElementUI)
 //引入axios用于调用后台接口
 import axios from 'axios'
Vue.prototype.$axios = axios
//传回后台的数据防止接收不到
import qs from 'qs';
Vue.prototype.$qs = qs;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
