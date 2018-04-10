import Vue from 'vue'
import App from './App'
import hourSelect from './lib/index.js'

Vue.use(hourSelect)

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
