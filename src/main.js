import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

import Echo from 'laravel-echo'
import vuetify from './plugins/vuetify';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
     broadcaster: 'pusher',
     key: '0987654321',
     cluster: 'mt1',
     //encrypted: true
     wsHost: window.location.hostname,
     wsPort: 6001,
     disableStats: true,
});

//axios.defaults.baseURL = 'http://realtime-blog.test/'
//axios.defaults.baseURL = 'http://192.168.43.48:8000/'
axios.defaults.baseURL = `http://${window.location.hostname}:8000/`

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
