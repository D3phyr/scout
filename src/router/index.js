import Vue from 'vue'
import VueRouter from 'vue-router'
import VueBodyClass from 'vue-body-class'
import LSstore from '../store/index.js'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/Login.vue'),
  },
  {
    path: '/add',
    name: 'add',
    component: () => import('../views/Add/Add.vue'),
  },
  {
    path: '/match/:id',
    name: 'id',
    component: () => import('../views/id/id.vue'),
  },
  {
    path: '/widget',
    name: 'widget',
    component: () => import('../views/Widget/index.vue'),
    meta: { bodyClass: 'bg-light' },
  },
]

const vueBodyClass = new VueBodyClass(routes)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
router.beforeEach((to, from, next) => { vueBodyClass.guard(to, next) })

router.beforeEach(async (to, from, next) => {
  if (!LSstore.state.token && to.path !== '/login' && to.path !== '/widget/') {
    next('/login')
  } else {
    next()
  }
})

export default router
