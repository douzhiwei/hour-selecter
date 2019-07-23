import Vue from 'vue'
import App from './App'
import hourSelect from '../dist/time-select'

Vue.use(hourSelect)

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
