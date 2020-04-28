import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
    	path:'/',
    	component: resolve => require(['pages/index/user.vue'], resolve)

    },
    {
    	path:'/clickInfo/:id',
    	component: resolve => require(['pages/index/clickInfo.vue'], resolve)

    },
    {
    	path:'/modeInfo',
    	component: resolve => require(['pages/index/modeInfo.vue'], resolve)

    },
    {
    	path:'/userUseTime',
    	component: resolve => require(['pages/index/userUseTime.vue'], resolve)

    }
  ]
})
