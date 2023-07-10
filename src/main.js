import Vue from 'vue'
import App from './App.vue'
import store from './store'

import router from './router'

import './plugins'
import './layouts'
import VueAxios from './plugins/axios'

Vue.use(VueAxios)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
