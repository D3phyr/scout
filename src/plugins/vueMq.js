import Vue from 'vue'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: {
    sm: 650,
    md: 1025,
    lg: Infinity,
  },
})
