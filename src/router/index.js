import Vue from 'vue'
import Router from 'vue-router'
 
Vue.use(Router)
 
import Main from '@/pages/Main'

 
let routes = [{
  path: '/',
  component: Main,
  hidden: true
  
}]
 
const router = new Router({
  routes: routes
})
 
export default router