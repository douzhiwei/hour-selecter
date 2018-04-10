<template>
    <div id="app">
        <div style="overflow: hidden">
            <hour-select ref="hourSelect" @res-change="timeValueChanged" :timevalue="timeval"></hour-select>
        </div>
        <div>
            <p style="color: cornflowerblue">已选的小时</p>
            <p>{{selectHour}}</p>
            <p style="color: cornflowerblue">* 0代表选择的小时,1代表没有选的小时</p>
            <p style="color: cornflowerblue">* 可以拖动鼠标来框选</p>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
                timeval: '1'.repeat(100) + '0'.repeat(68),
                selectHour: ''
            }
        },
        methods: {
            timeValueChanged(val) {
                this.selectHour = val
            }
        },
        mounted() {
        }
    }
</script>

<style>
    #app {
        width: 100%;
    }
</style>
