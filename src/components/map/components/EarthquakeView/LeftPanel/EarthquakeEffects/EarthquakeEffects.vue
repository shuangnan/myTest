<template>
  <div class="earthquake-effect-container">
    <div class="earthquake-effect-title">
      <span>影响线路</span>
      <div class="earthquake-effect-lines-count">
        <span>{{ effectedLines.length }}</span>
      </div>
    </div>
    <div class="effect-lines-select" @mouseover="clearLineSelectAutoScroll" @mouseout="setLineSelectAutoScroll">
      <div @click="handleLineSelectScroll(-1)" class="effect-line-left-scroll"></div>
      <div class="effect-line-container"
           v-for="(line, index) in effectedLines.slice(showEffectLineIndex, showEffectLineIndex + 3)" :key="index">
        <span>{{ line.LINE_NAME }}</span>
      </div>
      <div @click="handleLineSelectScroll(1)" class="effect-line-right-scroll"></div>
    </div>
    <div class="effect-split-line"></div>
    <div class="effect-trains-stat">
      <div class="effect-trains-fs">
        <span class="effect-trains-container-title">
          封锁
        </span>
        <span class="effect-trains-container-amount">{{
            parseInt(fsTrainsCount.DCOUNT) + parseInt(fsTrainsCount.PCOUNT) + parseInt(fsTrainsCount.HCOUNT)
          }}</span>
        <div class="effect-trains-item" style="margin-top: 30px">
          <div class="effect-train-gs-icon"></div>
          <span class="effect-trains-count">
           {{
              fsTrainsCount.DCOUNT
            }} 列
          </span>
        </div>
        <div class="effect-trains-item">
          <div class="effect-train-ps-icon"></div>
          <span class="effect-trains-count">
           {{
              fsTrainsCount.PCOUNT
            }} 列
          </span>
        </div>
        <div class="effect-trains-item">
          <div class="effect-train-hs-icon"></div>
          <span class="effect-trains-count">
            {{
              fsTrainsCount.HCOUNT
            }} 列
          </span>
        </div>
      </div>
      <div class="effect-trains-xs">
        <span class="effect-trains-container-title">
          限速
        </span>
        <span class="effect-trains-container-amount">{{
            parseInt(xsTrainsCount.HCOUNT) + parseInt(xsTrainsCount.PCOUNT) + parseInt(xsTrainsCount.DCOUNT)
          }}</span>
        <div class="effect-trains-item" style="margin-top: 30px">
          <div class="effect-train-gs-icon"></div>
          <span class="effect-trains-count">
           {{
              xsTrainsCount.DCOUNT
            }} 列
          </span>
        </div>
        <div class="effect-trains-item">
          <div class="effect-train-ps-icon"></div>
          <span class="effect-trains-count">
           {{
              xsTrainsCount.PCOUNT
            }} 列
          </span>
        </div>
        <div class="effect-trains-item">
          <div class="effect-train-hs-icon"></div>
          <span class="effect-trains-count">
            {{
              xsTrainsCount.HCOUNT
            }} 列
          </span>
        </div>
      </div>
      <div class="effect-trains-coming">
        <span class="effect-trains-container-title">
          将行
        </span>
        <span class="effect-trains-container-amount">{{
            parseInt(incomingTrainsCount.DCOUNT) + parseInt(incomingTrainsCount.PCOUNT) + parseInt(incomingTrainsCount.HCOUNT)
          }}</span>
        <div class="effect-trains-item" style="margin-top: 30px">
          <div class="effect-train-gs-icon"></div>
          <span class="effect-trains-count">
           {{
              incomingTrainsCount.DCOUNT
            }} 列
          </span>
        </div>
        <div class="effect-trains-item">
          <div class="effect-train-ps-icon"></div>
          <span class="effect-trains-count">
           {{
              incomingTrainsCount.PCOUNT
            }} 列
          </span>
        </div>
        <div class="effect-trains-item">
          <div class="effect-train-hs-icon"></div>
          <span class="effect-trains-count">
            {{
              incomingTrainsCount.HCOUNT
            }} 列
          </span>
        </div>
      </div>
    </div>
    <div class="effect-split-line"></div>
    <div class="effect-trains-table" @mouseover="clearTrainsTableAutoScroll" @mouseout="setTrainsTableAutoScroll">
      <el-table ref="table" :data="effectedSectionsTable" size="mini" max-height="340" fit :row-style="function ({row, rowIndex}) {
        return {
          background: rowIndex % 2 === 0 ? '#111A30' : '#1B2C45',
          padding: '0'
        }
      }" :span-method="arraySpanMethod" @row-click="handleSectionClick" highlight-current-row :cell-style="{
        paddingLeft: '0 !important',
        paddingRight: '0 !important'
      }">
        <el-table-column prop="L_NAME" label="线别" align="center" width="112px"></el-table-column>
<!--        <el-table-column label="类型" align="center" width="56px">-->
<!--          <template slot-scope="type" style="display: flex; align-items: center; align-content: center">-->
<!--            <div style="height: 100%; width: 100%; display: flex; align-items: center; align-content: center; justify-content: center">-->
<!--              <div :class="{-->
<!--              'xs-marker': type.row.ATTRIBUTE === '0',-->
<!--              'fs-marker': type.row.ATTRIBUTE === '1'-->
<!--              }"></div>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="DIRECTION" label="行别" align="center" width="56px"></el-table-column>
        <el-table-column label="影响范围" align="center">
          <template slot-scope="effect">
            <div style="height: 100%; width: 100%; display: flex; flex-direction: column; align-content: center; align-items: center">
              <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">
                <div class="start-marker"></div>
                <span>{{ effect.row.O_STATION }}</span>
              </div>
              <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">
                <div class="end-marker"></div>
                <span>{{ effect.row.E_STATION }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="动/普/货" align="center" width="100px">
          <template slot-scope="count">
            <el-popover :popper-class="'customPPopper'">
              <div class="popperTable" @mouseover="clearTrainsTableAutoScroll" @mouseout="setTrainsTableAutoScroll">
                <el-table :data="count.row.TRAINS" size="mini" highlight-current-row max-height="500px">
                  <el-table-column label="车次" prop="TRAIN" align="center" width="100px">
                    <template slot-scope="trainT">
								<span :style="{
									color: trainT.row.TRAIN_TYPE === 'D' ? '#438EC5' : (trainT.row.TRAIN_TYPE === 'P' ? '#50BE8B' : '#BA7D3A')
								}">{{ trainT.row.TRAIN }}</span>
							</template>
                  </el-table-column>
                  <el-table-column label="发站" prop="START_STN" align="center" width="100px"></el-table-column>
                  <el-table-column label="发点" prop="START_DATE" align="center" width="200px">
                    <template slot-scope="sTime">
                      <span>{{ (sTime.row.END_DATE || '').substring(11, 16) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="到站" prop="END_STN" align="center" width="100px"></el-table-column>
                  <el-table-column label="到点" prop="END_DATE" align="center" width="200px">
                    <template slot-scope="eTime">
                      <span>{{ (eTime.row.END_DATE || '').substring(11, 16) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="当前位置" prop="CURRNAME" align="center" width="100px"></el-table-column>
                  <el-table-column label="正晚点" prop="EDTIME" align="center" width="100px">
                    <template slot-scope="edtime">
                                  <span v-if="edtime.row.EDTIME == 0">
                                    正点
                                  </span>
                      <span v-else style="color: crimson">
                                    晚点{{ edtime.row.EDTIME }}分
                                  </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div slot="reference" style="cursor: pointer">
                <span style="color: #438EC5">{{ count.row.DCOUNT == '0' ? '-' : count.row.DCOUNT }}</span>
                /
                <span style="color: #50BE8B">{{ count.row.PCOUNT == '0' ? '-' : count.row.PCOUNT }}</span>
                /
                <span style="color: #BA7D3A">{{ count.row.HCOUNT == '0' ? '-' : count.row.HCOUNT }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "EarthquakeEffects",
  computed: {
    earthquakeInfo() {
      return this.$store.state.earthquake.currentEarthquakeInfo
    },
    effectedLines() {
      return this.$store.state.earthquake.currentEarthquakeEffectedLines
    },
    fsTrainsCount() {
      let fsBrief = this.$store.state.earthquake.currentEarthquakeEffectedTrainsBrief.find((b) => {
        return b.ATTRIBUTE === '1'
      })
      if (fsBrief === undefined) {
        return {
          ATTRIBUTE: '1',
          DCOUNT: '0',
          PCOUNT: '0',
          HCOUNT: '0'
        }
      } else {
        return fsBrief
      }
    },
    xsTrainsCount() {
      let xsBrief = this.$store.state.earthquake.currentEarthquakeEffectedTrainsBrief.find((b) => {
        return b.ATTRIBUTE === '0'
      })
      if (xsBrief === undefined) {
        return {
          ATTRIBUTE: '0',
          DCOUNT: '0',
          PCOUNT: '0',
          HCOUNT: '0'
        }
      } else {
        return xsBrief
      }
    },
    autoScrollThreshold() {
      return this.$store.state.earthquake.stopAutoScroll
    },
    incomingTrainsCount() {
      let incomingBrief = this.$store.state.earthquake.currentEarthquakeEffectedTrainsBrief.find((b) => {
        return b.ATTRIBUTE === '-1'
      })
      if (incomingBrief === undefined) {
        return {
          ATTRIBUTE: '-1',
          DCOUNT: '0',
          PCOUNT: '0',
          HCOUNT: '0'
        }
      } else {
        return incomingBrief
      }
    },
    effectedSectionsTable() {
      function unlink(array, key) {
        if (array.length === 0) {
          return []
        }
        let result = [array[0]]
        for (let i = 1; i < array.length; i++) {
          let item = array[i]
          let repeat = false
          for (let j = 0; j < result.length; j++) {
            if (item[key] == result[j][key]) {
              repeat = true
              break
            }
          }
          if (!repeat) {
            result.push(item)
          }
        }
        return result
      }

      function ifTrainRelatedInStation(type, station, nextStation, train) {
        if (type === 'incoming') {
          // 传当前站和上一站
          return (train.NEXTNAME.includes(station.STATION) || station.STATION.includes(train.NEXTNAME)) && (train.CURRNAME.includes(nextStation.STATION) || nextStation.STATION.includes(train.CURRNAME))
        } else if (type === 'deped') {
          // 传当前站和下一站
          return ((train.CURRNAME.includes(station.STATION) || station.STATION.includes(train.CURRNAME))
                  && (train.NEXTNAME.includes(nextStation.STATION) || nextStation.STATION.includes(train.NEXTNAME))) ||
              ((train.NEXTNAME.includes(station.STATION) || station.STATION.includes(train.NEXTNAME))
                  && (train.CURRNAME.includes(nextStation.STATION) || nextStation.STATION.includes(train.CURRNAME)))
        }
      }

      let rawData = this.$store.state.earthquake.currentEarthquakeEffectedSections
      let allEffectedTrains = this.$store.state.earthquake.currentEarthquakeEffectedTrains
      let allEffectedStations = this.$store.state.earthquake.currentEarthquakeStations
      let allSubSections = this.$store.state.earthquake.currentEarthquakeSubSections

      function ifTrainInSection(train, sectionStart, sectionEnd, sectionStartPoint, sectionEndPoint) {
        if (
            (parseFloat(train.O_KM) >= parseFloat(sectionStart) && parseFloat(train.E_KM) <= parseFloat(sectionEnd)) ||
            (parseFloat(train.E_KM) >= parseFloat(sectionStart) && parseFloat(train.O_KM) <= parseFloat(sectionEnd))
        ) {
          return true
        } else {
          return false
        }
      }

      rawData.map((section) => {
        let sectionStart = section.O_KM
        let sectionEnd = section.E_KM
        let sectionPointStart = section.O_STATION
        let sectionPointEnd = section.E_STATION
        // 获取区间中包含的站和车次信息
        // console.log(section, allEffectedStations)
        let allRelatedStations = allEffectedStations.filter((station) => {
          return (station.LINE_NAME === section.L_NAME) && ((sectionStart <= parseFloat(station.O_KM) && (parseFloat(station.O_KM) <= sectionEnd)) || (sectionStart <= parseFloat(station.E_KM) && (parseFloat(station.E_KM) <= sectionEnd)))
        })
        // console.log(allRelatedStations)
        // console.log(section.L_NAME, allRelatedStations)
        allRelatedStations = unlink(allRelatedStations, 'STATION')
        let allRelatedTrains = allEffectedTrains.filter((train) => {
          return ifTrainInSection(train, sectionStart, sectionEnd, sectionPointStart, sectionPointEnd) && (train.L_NAME === section.L_NAME)
        })
        let allRelatedSections = allSubSections.filter((s) => {
          return s.LINE_NAME === section.L_NAME && (parseFloat(s.S_MILE) >= sectionStart && parseFloat(s.E_MILE) <= sectionEnd)
        })
        // console.log('ALL Related stations', allRelatedStations)
        section.STATIONS = allRelatedStations.sort((stationA, stationB) => {
          return parseFloat(stationA.CENTER_MILE) - parseFloat(stationB.CENTER_MILE)
        })
        // console.log(section.STATIONS)
        section.STATIONS.map((station, index, arr) => {
          let targetSection = allRelatedSections.find((section) => {
            // console.log('SECTION STATION', station, section)
            return parseFloat(station.O_KM) >= parseFloat(section.S_MILE) && parseFloat(section.E_MILE) >= parseFloat(station.E_KM)
          })
          if (targetSection !== undefined) {
            station.ENVIRONMENT = targetSection.ENVIRONMENT
          } else {
            station.ENVIRONMENT = ''
          }
          let incoming = JSON.parse(JSON.stringify([]))
          let deped = JSON.parse(JSON.stringify([]))
          if (index < arr.length - 1) {
            deped = allRelatedTrains.filter((train) => {
              return ifTrainRelatedInStation('deped', station, arr[index + 1], train)
            })
            station.DEPED = deped
            station.INCOMING = []
          } else {
            station.DEPED = []
            station.INCOMING = []
          }
        })
        section.TRAINS = allRelatedTrains.sort((trainA, trainB) => {
          return parseFloat(trainA.O_KM) - parseFloat(trainB.O_KM)
        })
        section.SECTIONS = allRelatedSections.sort((sectionA, sectionB) => {
          return parseFloat(sectionA.S_MILE) - parseFloat(sectionB.E_MILE)
        })
      })
      // console.log(rawData)
      return rawData
    }
  },
  mounted() {
    // console.log('EFFECT AREA', this.effectArea)
    // console.log('EFFECT TRAINS', this.effectedTrains)
    this.setTrainsTableAutoScroll()
    this.setLineSelectAutoScroll()
  },
  beforeDestroy() {
    clearInterval(this.trainTableAutoScrollTimer)
  },
  data() {
    return {
      showEffectLineIndex: 0,
      trainTableCurrentActiveRowIndex: 0,
      trainTableAutoScrollTimer: null,
      lineSelectAutoScrollTimer: null
    }
  },
  methods: {
    handleLineSelectScroll(delta) {
      if (delta === -1) {
        if (this.showEffectLineIndex > 0) {
          this.showEffectLineIndex = this.showEffectLineIndex + delta
        }
      } else {
        if (this.showEffectLineIndex + 1 + 3 <= this.effectedLines.length) {
          this.showEffectLineIndex = this.showEffectLineIndex + delta
        } else {
          this.showEffectLineIndex = 0
        }
      }
    },
    handleSectionClick(row) {
      console.log(row)
      let index = this.effectedSectionsTable.findIndex((item) => {
        return JSON.stringify(item) === JSON.stringify(row)
      })
      this.trainTableCurrentActiveRowIndex = index
    },
    clearTrainsTableAutoScroll() {
      clearInterval(this.trainTableAutoScrollTimer)
    },
    setTrainsTableAutoScroll() {
      const table = this.$refs['table']
      const divData = table.bodyWrapper
      if (this.trainTableAutoScrollTimer) {
        clearInterval(this.trainTableAutoScrollTimer)
      }
      this.trainTableAutoScrollTimer = setInterval(() => {
        if (this.trainTableCurrentActiveRowIndex + 1 >= this.effectedSectionsTable.length) {
          this.trainTableCurrentActiveRowIndex = 0
          divData.scrollTop = 0
        } else {
          this.trainTableCurrentActiveRowIndex++
          divData.scrollTop += 52
        }
      }, 4000)
    },
    setLineSelectAutoScroll() {
      setTimeout(() => {
        if (this.lineSelectAutoScrollTimer) {
          clearInterval(this.lineSelectAutoScrollTimer)
        }
        this.lineSelectAutoScrollTimer = setInterval(() => {
          this.handleLineSelectScroll(1)
        }, 4000)
      }, 2000)
    },
    clearLineSelectAutoScroll() {
      clearInterval(this.lineSelectAutoScrollTimer)
    },
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      const arr = this.getSpan(this.effectedSectionsTable)
      // console.log(arr)
      if (columnIndex < 1) {
        const row = arr[rowIndex].row
        const col = arr[rowIndex].col
        return {
          rowspan: row,
          colspan: col
        }
      }
    },
    getSpan(list) {
      const newArr = []
      const obj = {}
      for (let i = 0; i < list.length; i++) {
        if (i === 0) {
          obj.row = 1
          obj.col = 1
          newArr.push(obj)
        } else {
          if (list[i].L_NAME === list[i - 1].L_NAME) {
            newArr.push({row: 0, col: 0})
            const index = list.findIndex(item => {
              return item.L_NAME === list[i - 1].L_NAME
            })
            newArr[index].row++
          } else {
            newArr.push({row: 1, col: 1})
          }
        }
      }
      return newArr
    }
  },
  watch: {
    'trainTableCurrentActiveRowIndex': {
      deep: true,
      handler: function (newVal) {
        let row = this.effectedSectionsTable[newVal]
        this.$refs['table'].setCurrentRow(row)
        this.$store.commit('earthquake/updateCurrentRenderingSection', row)
      }
    },
    'autoScrollThreshold': {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          console.log('清除定时器')
          this.clearTrainsTableAutoScroll()
        } else if (!newVal && newVal !== oldVal) {
          console.log('启动定时器')
          this.setTrainsTableAutoScroll()
        }
      }
    }
  }
}
</script>

<style scoped>
.earthquake-effect-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
}

.earthquake-effect-title {
  height: 26px;
  width: 381px;
  background: url("../../imgs/SplitLine2.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.earthquake-effect-title > span {
  text-shadow: 0 0 .05em, 0 0 .1em;
  font-weight: bold;
  font-size: 16px;
}

.earthquake-effect-lines-count {
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background: crimson;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
}

.earthquake-effect-lines-count > span {
  font-weight: bold;
  font-size: 20px;
  text-shadow: 0 0 .05em, 0 0 .1em;
}

.effect-lines-select {
  height: 50px;
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-around;
}

.effect-line-left-scroll {
  background: url("../../imgs/EffectLineLeftArrow.png") no-repeat;
  height: 17px;
  width: 11px;
  background-size: 100% 100%;
  cursor: pointer;
}

.effect-line-container {
  background: url("../../imgs/EffectLineContainer.png") no-repeat;
  height: 37px;
  width: 98px;
  background-size: 100% 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.effect-line-container > span {
  font-weight: bold;
}

.effect-line-right-scroll {
  background: url("../../imgs/EffectLineRightArrow.png") no-repeat;
  height: 17px;
  width: 11px;
  background-size: 100% 100%;
  cursor: pointer;
}

.effect-split-line {
  background: url("../../imgs/SplitLine1.png") no-repeat;
  height: 18.5px;
  width: 214px;
  background-size: 100% 100%;
  margin-top: 10px;
}

.effect-trains-stat {
  height: 240px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-around;
  margin-top: 10px;
}

.effect-trains-fs {
  background: url("../../imgs/EffectFsTrains.png") no-repeat;
  height: 211.5px;
  width: 108px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.effect-trains-xs {
  background: url("../../imgs/EffectedXsTrains.png") no-repeat;
  height: 211.5px;
  width: 108px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.effect-trains-coming {
  background: url("../../imgs/EffectComingTrains.png") no-repeat;
  height: 211.5px;
  width: 108px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.effect-trains-container-title {
  margin-top: 2px;
  /*font-weight: bold;*/
  text-shadow: 0 0 .1em, 0 0 .1em;
}

.effect-trains-container-amount {
  margin-top: 21px;
  font-weight: bold;
  text-shadow: 0 0 .1em, 0 0 .1em;
  font-size: 20px;
}

.effect-trains-item {
  height: 20px;
  width: calc(100% - 30px);
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  margin-top: 15px;
}

.effect-train-gs-icon {
  background: url("../../imgs/TrainLeft.png") no-repeat;
  height: 10px;
  width: 24.5px;
  background-size: 100% 100%;
}

.effect-train-ps-icon {
  background: url("../../imgs/Puche.png") no-repeat;
  height: 11.5px;
  width: 23px;
  background-size: 100% 100%;
}

.effect-train-hs-icon {
  background: url("../../imgs/Huoche.png") no-repeat;
  height: 10px;
  width: 23px;
  background-size: 100% 100%;
}

.effect-trains-count {
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 .1em, 0 0 .1em;
  margin-left: 8px;
}

.effect-trains-table {
  width: 100%;
  height: calc(100% - 26px - 26px - 18.5px - 240px - 18.5px - 70px);
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding-left: 1px;
  padding-right: 1px;
}

.effect-trains-table-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
}

.effect-trains-table-header-item {
  color: #b4cefd;
  font-weight: bold;
  text-align: center;
}

.effect-trains-table-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 40px);
  overflow-y: scroll;
  align-items: center;
  align-content: center;
}

.effect-trains-table-content-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  max-height: 80px;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
}

.effect-trains-table-content-values {
  text-align: center;
  font-weight: bold;
}

.effect-trains-table-active-row {
  box-shadow: 0 0 5px #ee0a24 inset
}

.effect-trains-table >>> .el-table th, .el-table tr, cell {
  background: #19223C !important;
  color: #5EB0F3 !important;
  font-weight: bold;
  font-size: 14px;
  padding: 0;
}

.effect-trains-table >>> .el-table__row {
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 0 !important;
}

.effect-trains-table >>> .el-table, .el-table__expanded-cell {
  background: transparent !important;
}

.effect-trains-table >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  /*box-shadow: 0 0 5px #ee0a24 inset;*/
  background: rgba(238, 10, 36, 0.22) !important;
}

.effect-trains-table >>> .el-table__body tr.current-row > td {
  background: rgba(238, 10, 36, 0.22) !important;
}

.popperTable >>> .el-table th, .el-table tr, cell {
  background: #19223C !important;
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 0;
}

.popperTable >>> .el-table__row {
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 0 !important;
  background: #19223C !important;
}

.popperTable >>> .el-table .cell {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.popperTable >>> .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
  padding: 0 !important;
}

.popperTable >>> .el-table__empty-block {
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 0 !important;
  background: #19223C !important;
}

.popperTable >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  /*box-shadow: 0 0 5px #ee0a24 inset;*/
  background: rgba(238, 10, 36, 0.22) !important;
}

.popperTable >>> .el-table__body tr.current-row > td {
  background: rgba(238, 10, 36, 0.22) !important;
}

.effect-trains-table >>> .el-table .cell, .el-table th div {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.fs-marker {
  background: url("../../imgs/fsmarker.png") no-repeat;
  height: 30px;
  width: 30px;
  background-size: 100% 100%;
}

.xs-marker {
  background: url("../../imgs/xsmarker.png") no-repeat;
  height: 30px;
  width: 30px;
  background-size: 100% 100%;
}

.start-marker {
  background: url("../../imgs/startstnmarker.png") no-repeat;
  height: 20px;
  width: 20px;
  background-size: 100% 100%;
}

.end-marker {
  background: url("../../imgs/endstationmarker.png") no-repeat;
  height: 20px;
  width: 20px;
  background-size: 100% 100%;
}
</style>
