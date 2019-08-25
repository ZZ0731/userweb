import Vue from 'vue'
import Router from 'vue-router'
 
Vue.use(Router)
 
import Main from '@/pages/Main'
import User from '@/pages/User'
import addpage from '@/pages/add'
//import loginpage from '@/components/Login'
const loginpage = resolve => require(['@/components/Login'],resolve)
 
let router =new Router({
  routes: [
    {
        path:'/',
        name :'login',
        component:loginpage
    },
    {
        path:'/login',
        name :'login',
        component:loginpage
    },
    {
        path:'/main',
        name: '用户管理',
        component: Main,
        iconCls: 'fa fa-user-circle-o',
        children: [{
          path: '/main/data',
          component: User,
          name: '用户信息管理'
        }, 
        {
            path:'/main/add',
            name :'add',
            hidden:true,
            component:addpage
        }, 
        {
            path:'/main/update',
            name :'update',
            hidden:true,
            component:addpage
        }
    ]},
        
]
})

    //对每次访问之前都要先看是否已经登录
    router.beforeEach((to,from,next)=>{
        if(to.path.startsWith('/login')){
            window.sessionStorage.removeItem('access-token');
            next();
        }else{
            let token = window.sessionStorage.getItem('access-token');
            if(!token){
                //未登录  跳回主页面
                next({path:'/login'});
            }else{
                next();
            }
        }
        
    });
    
    
export default router

