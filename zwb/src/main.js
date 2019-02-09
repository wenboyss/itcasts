// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import MyBread from '@/layout/bread.vue'
// import axios from 'axios'
import myaxios from '@/assets/js/myaxios.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import moment from 'moment'

// // 统一设置请求路径
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
// // 挂载到 vue 的原型中
// Vue.prototype.$http = axios
Vue.use(myaxios)
Vue.use(Element)

// 注册全局面包屑导航组件
Vue.component(MyBread.name, MyBread)
Vue.filter('dateformat', function (value) {
  return moment(value).format('YYYY-MM-DD hh:mm:ss')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
