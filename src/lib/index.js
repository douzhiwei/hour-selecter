import hourSelecter from './time-select.vue'

const hourSelect = {
    install: function (Vue) {
        Vue.component(hourSelecter.name, hourSelecter)
    }
}
export default hourSelect
