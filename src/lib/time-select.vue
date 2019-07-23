<template>
    <div ref="div">
        <div class="time-select-ctrl">
            <div class="choose-line">
                <div class="example">
                    <div class="selected"><span class="selected-color select-color"></span><span>投放时间</span>
                    </div>
                    <div class="deselected">
                        <span class="deselected-color no-select-color"></span>
                        <span>暂停时间</span>
                    </div>
                </div>
                <div class="choiceBtn" :class="{active: all}" @click="checkAll()">全部</div>
                <div class="choiceBtn" :class="{active: weekday}" @click="checkWeek()">工作日</div>
                <div class="choiceBtn" :class="{active: weekend}" @click="checkWeekend()">周末</div>
                <div class="choiceBtn" @click="clear()">清除</div>
            </div>
        </div>

        <div class="time-line-block">
            <div class="hour-tips" v-for="tip in hoursEven" :key="tip">{{tip}}</div>
        </div>

        <div class="line-block">
            <div class="left-block" v-for="(day, index) in days" :key="day.name">
                <input type="checkbox" :value="index" v-model="oneDayArr"
                       @change="selectOneDay(index)">
                <span class="day-sp">{{day.name}}</span>
            </div>

        </div>
        <div class="hour-con">
            <div class="hour-row" v-for="(day, index1) in days.length">
                <div class="hour-unit no-select-color"
                     v-for="(hour, index2) in hours.length-1"
                     :class="{'select-color': selected[index1][index2] == 0, 'no-select-color': selected[index1][index2] == 1}"
                     @click="selectHour(index1, index2)"
                     @mousedown.stop="frameSelect(index1, index2)"
                     @mousemove.stop="touch ? frameMove(index1, index2):''"
                     @mouseup.stop="frameEnd(index1, index2)"
                >
                </div>
            </div>

        </div>

        <div class="tips">
            <div class="left-block selected-days">已添加时间</div>
            <div class="rightBlock">
                <div class="line-block-noh" v-for="(week, index) in days" v-show="timeList[index]&&timeList[index]!=0">
                    <div class="left-days-block">
                        <span>{{week.name}}</span>
                    </div>
                    <div class="tips-block">
                        <ul style="margin: 0;padding: 0">
                            <li v-for="tl in timeList[index]" ng-if="tl.length > 0">{{tl}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!--<div v-html="htmlStr"></div>-->

    </div>
</template>

<script>
  import {fillAll, fillWeek, fillWeekend, clearAll, days, hours, deepcopy} from './config'

  export default {
    name: 'hourSelect',
    props: {
      timevalue: {
        type: String,
        required: true
      },
      isEditable: {
        type: Boolean,
        default: true
      },
      index: {
        type: Number,
      },
      touch: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        days: days,
        hours: hours,
        all: false,
        weekday: false,
        weekend: false,
        oneDayArr: [],
        oneDaySet: new Set(),
        selected: null,
        htmlStr: '',
        timeList: new Array(7),
        timeval: this.timevalue,
        res: ''
      }
    },
    methods: {
      // 选择小时
      selectHour(index1, index2) {
        if (!this.isEditable) return
        if (this.selected[index1][index2] === '0') {
          this.$set(this.selected[index1], index2, '1')
          this.$nextTick(() => {
            let selectedIndex = this.selected[index1].findIndex((value) => {
              return value === '0'
            })
            // 如果没有在数组中找到了 0 就说明没有全选
            if (selectedIndex !== -1) {
              let delIndex = this.oneDayArr.findIndex((value) => {
                return value === index1
              })
              console.log('要删除的index', delIndex)
              console.log('数组操作前', this.oneDayArr)
              if (delIndex !== -1) {
                this.oneDayArr.splice(delIndex, 1)
              }
              this.oneDaySet.clear()
              this.oneDayArr.forEach(item => {
                this.oneDaySet.add(item)
              })
              console.log('数组操作后', this.oneDayArr)
            }
          })
        } else {
          this.$set(this.selected[index1], index2, '0')
          this.$nextTick(() => {
            let selectedIndex = this.selected[index1].findIndex((value) => {
              return value === '1'
            })
            // 如果没有在数组中找到1 就说明全选了
            if (selectedIndex === -1) {
              this.oneDaySet.add(index1)
              this.oneDayArr = Array.from(this.oneDaySet)
            }
          })
        }
        this.timeListFunc(index1)
      },

      // 选择一天
      selectOneDay(index) {
        let oneDayArrIndex = this.oneDayArr.indexOf(index)
        if (oneDayArrIndex === -1) {
          this.$set(this.selected, index, new Array(24).fill('1'))
        } else {
          this.$set(this.selected, index, new Array(24).fill('0'))
        }
        this.timeListFunc(index)
      },

      // 选择全部
      checkAll() {
        this.all = true
        this.weekday = false
        this.weekend = false
        this.selected = deepcopy(fillAll)
        this.oneDayArr = [0, 1, 2, 3, 4, 5, 6]
        this.oneDayArr.forEach(item => {
          this.timeListFunc(item)
        })
      },
      // 选择工作日
      checkWeek() {
        this.timeList = []
        this.all = false
        this.weekday = true
        this.weekend = false
        this.selected = deepcopy(fillWeek)
        this.oneDayArr = [0, 1, 2, 3, 4]
        this.oneDayArr.forEach(item => {
          this.timeListFunc(item)
        })
      },
      // 选择周末
      checkWeekend() {
        this.timeList = []
        this.all = false
        this.weekday = false
        this.weekend = true
        this.selected = deepcopy(fillWeekend)
        this.oneDayArr = [5, 6]
        this.oneDayArr.forEach(item => {
          this.timeListFunc(item)
        })
      },
      // 清除
      clear() {
        this.all = false
        this.weekday = false
        this.weekend = false
        this.selected = deepcopy(clearAll)
        this.oneDayArr = []
        this.res = '1'.repeat(168)
        this.timeList = []
      },
      timeListFunc(index) {
        this.$set(this.timeList, index, [])
        let tempArr = this.getRange(this.selected[index].join(''), 0)
        for (let j = 0, jmax = tempArr.length; j < jmax; j += 2) {
          this.timeList[index].push(tempArr[j] + ':00点-' + tempArr[j + 1] + ':00点')
        }
        this.res = ''
        for (var i = 0, imax = this.selected.length; i < imax; i++) {
          this.res += this.selected[i].join('')
        }
      },
      getRange(str, index) {
        let marr = []
        getinfo(str, index)
        return marr

        // 递归获取
        function getinfo(str, index) {
          var start = str.indexOf('0', index)
          if (start !== -1) {
            if (start < 10) start = '0' + start
            marr.push(start.toString())
            var end = str.indexOf('1', start)
            if (end === -1) {
              marr.push(str.length.toString())
            } else {
              if (end < 10) end = '0' + end
              marr.push(end)
              getinfo(str, end)
            }
          }
        }
      },
      init() {
        if (this.timeval.split('').length !== 7 * 24) {
          throw new Error('the hours length must be 7*24')
        }
        this.selected = []
        let initSelected = this.timeval.split('')
        let hourlength = 24
        for (let h = 0, hmax = 7; h < hmax; h++) {
          this.$set(this.selected, h, [])
          for (let j = h * hourlength, jmax = (h + 1) * hourlength; j < jmax; j++) {
            this.selected[h].push(initSelected[j])
          }
          this.timeListFunc(h)
          let selectIndex = this.selected[h].findIndex(value => {
            return value === '1'
          })
          if (selectIndex === -1) {
            this.oneDayArr.push(h)
            this.oneDaySet.add(h)
          }
        }
      },
      frameSelect(index1, index2) {
        console.log('开始选择了')
        this.frameSelectFlag = true
        if (typeof index1 === 'number' && typeof index2 === 'number') {
          this.startX = index1
          this.startY = index2
        }
        let evt = window.event || arguments[0]
        this._startX = (evt.x || evt.clientX)
        this._startY = (evt.y || evt.clientY)
        var box = this.$refs.div.getBoundingClientRect()
        console.log(box)
        let left = Math.abs(this._startX - box.left)
        let top = Math.abs(this._startY - box.top)
        console.log(left, top)
        this.htmlStr = ` <div style="position:absolute;
                                    left:${left}px;
                                    top:${top}px;
                                    width:0px;
                                    height:0px;
                                    font-size:0px;
                                    margin:0px;
                                    padding:0px;
                                    border:1px dashed #0099FF;
                                    background-color:#C3D5ED;
                                    z-index:1000;
                                    filter:alpha(opacity:60);
                                    opacity:0.6;
                                    display:none"></div>

                       `
      },
      frameMove(index1, index2) {
        if (!this.frameSelectFlag) {
          return
        }
        let evt = window.event || arguments[0]
        var box = this.$refs.div.getBoundingClientRect()
        let _x = (evt.x || evt.clientX)
        let _y = (evt.y || evt.clientY)
        let left = Math.min(_x, this._startX)
        let top = Math.min(_y, this._startY)
        let width = Math.abs(_x - this._startX) + 'px'
        let height = Math.abs(_y - this._startY) + 'px'
        this.htmlStr = ` <div  style="position:absolute;
                                    width:${width};
                                    height:${height};
                                    left:${left}px;
                                    top:${top}px;
                                    font-size:0px;
                                    margin:0px;
                                    padding:0px;
                                    border:1px dashed #0099FF;
                                    background-color:#C3D5ED;
                                    z-index:1000;
                                    filter:alpha(opacity:60);
                                    opacity:0.6;
                                    display:''"></div>

                       `
      },
      frameEnd(index1, index2) {
        // 框选计算
        if (typeof index1 === 'number' && typeof index2 === 'number') {
          this.endX = index1
          this.endY = index2
        }
        if (this.startX !== this.endX || this.startY !== this.endY) {
          this.addSelected()
        }
        this.clearFrameSelect()
      },
      clearFrameSelect() {
        this.frameSelectFlag = false
        this.htmlStr = ''
        this.startX = null
        this.startY = null
        this.endX = null
        this.endY = null
      },
      addSelected() {
        let a = Math.min(this.endX, this.startX)
        let amax = Math.max(this.endX, this.startX)
        let b = Math.min(this.endY, this.startY)
        let bmax = Math.max(this.endY, this.startY)
        for (var i = a, imax = amax; i <= imax; i++) {
          for (var j = b, jmax = bmax; j <= jmax; j++) {
            this.selectHour(i, j)
          }
        }
      }
    },
    watch: {
      res: function (n) {
        let res = this.index >= 0 ? {n, index: this.index} : n
        this.$emit('res-change', res)
          // 添加v-model 支持
        this.$emit('input', res)
      }
    },
    computed: {
      hoursEven() {
        let evenList = []
        this.hours.filter((value, index) => {
          if (index % 2 === 0) {
            evenList.push(value)
          }
        })
        return evenList
      }
    },
    created() {
      this.selected = deepcopy(clearAll)
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped rel="stylesheet/scss">
    * {
        margin: 0;
        padding: 0;
        font-size: 12px;
    }

    .active {
        background-color: #6697e7 !important;
    }

    .no-select-color {
        background-color: #d1d1d1;
    }

    .select-color {
        background-color: #8bc069
    }

    .hour-row {
        margin-top: -4px
    }

    .choose-line {
        padding: 6px;
        margin-bottom: 6px;
        width: 540px;
        position: relative;
    }

    .hour-unit {
        color: #666666;
        width: 18px;
        height: 18px;
        display: inline-block;
        margin: 0 1px 1px 0;
        cursor: pointer;
    }

    .hour-tips {
        color: #666666;
        width: 36px;
        display: inline-block;
        margin: 0 2px 2px 0;
        overflow: hidden;
        text-align: left;
    }

    .info-unit {
        color: #666666;
        width: 50px;
        height: 24px;
        display: inline-block;
        margin: 0 0 2px 0;
        cursor: pointer;
    }
    .line-block {
        overflow: hidden;
        float: left;
    }

    .time-line-block {
        overflow: hidden;
        padding-left: 54px;
    }

    .line-block-noh {
        overflow: hidden;
        line-height: 20px;
    }

    .left-block {
        text-align: right;
        width: 70px;
        line-height: 18px;
        color: #666666;
        padding-right: 10px;
        overflow: hidden;
        vertical-align: top;
    }

    .selected-days {
        line-height: 20px;
        display: inline-block;
    }

    .left-days-block {
        text-align: right;
        color: #666666;
        padding-right: 10px;
        overflow: hidden;
        display: inline-block;
        vertical-align: top;
    }

    .rightBlock {
        width: 620px;
        display: inline-block;
    }

    .choiceBtn {
        background-color: #d1d1d1;
        display: inline-block;
        padding: 5px 12px;
        margin-right: 10px;
        color: #fff;
        cursor: pointer;
    }

    .day-sp {
        display: inline-block;
        color: #666666;
    }

    .example {
        position: absolute;
        top: 6px;
        right: 6px;
    }

    .example .selected .selected-color {
        display: inline-block;
        height: 20px;
        width: 20px;
        vertical-align: top;
        margin-right: 6px;
    }

    .example .selected, .example .deselected {
        display: inline-block;
        margin-left: 10px;
    }

    .example .deselected-color {
        display: inline-block;
        height: 20px;
        width: 20px;
        vertical-align: top;
        margin-right: 6px;
    }

    .tips {
        width: 800px;
        color: #666666;
        margin-top: 8px;
    }

    .tips-block {
        width: 530px;
        display: inline-block;
    }

    .tips-block ul li {
        list-style: none;
        display: inline-block;
        width: 120px;
        color: #666666;
    }

    .time-select-ctrl {
        width: 560px;
        background-color: #f1f1f1;
        padding-bottom: 5px;
        -moz-user-select: none;
        -khtml-user-select: none;
        user-select: none;
        position: relative;
        line-height: 18px;
    }

    .select-frame {
        border: 1px solid #898989;
        position: fixed;
    }
</style>
