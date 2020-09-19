import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";

// Configuration d'Axios
axios.defaults.baseURL = 'http://localhost:3000/api/';
const JWT_TOKEN = sessionStorage.getItem('token')
if (JWT_TOKEN) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + JWT_TOKEN;
}
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')