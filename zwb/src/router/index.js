import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'
import User from '@/components/page/users/users.vue'
import Rights from '@/components/page/rights/rights.vue'
import Roles from '@/components/page/roles/roles.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: User }, // /users
        { path: '/rights', component: Rights }, // /rights
        { path: '/roles', component: Roles }// /roles
      ]
    }
  ]
})
