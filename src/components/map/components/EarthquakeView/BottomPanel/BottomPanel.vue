<template>
  <div class="bottom-panel-container" @mouseover="stopAutoScroll" @mouseout="activeAutoScroll">
    <div class="line-title">
      <span>{{ currentRenderingRange.L_NAME }} ({{
          currentRenderingRange.O_STATION
        }} - {{ currentRenderingRange.E_STATION }})</span>
      
      <div style="margin-right: 15px; display: flex; flex-direction: row">
        <div style="display: flex; flex-direction: row; align-items: center; align-content: center; margin-right: 5px">
          <div class="fsTl" />：封锁区间
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; align-content: center; margin-right: 5px">
          <div class="xsTl" />：限速区间
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; align-content: center; margin-right: 5px">
          <div class="pyTl" />：平原/微丘
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; align-content: center; margin-right: 5px">
          <div class="zqTl" />：重丘/丘陵
        </div>
      </div>
    </div>
    <div class="diagram-container">
      <div style="width: 100%; height: 100%; padding-bottom: 10px" id="effect-range">
        <!-- <EffectRangePreview
            v-if="JSON.stringify(currentRenderingRange) !== '{}'"
            :range-start-mile="renderStart"
            :range-end-mile="renderEnd"
            :sections="sections"
            :stations="stations"
            :trains="trains"
            :client-width="diagramClientWidth"
            :client-height="diagramClientHeight"
        /> -->
        <effect-range-preview-n />
      </div>
    </div>
  </div>
</template>

<script>
import EffectRangePreview from "@/components/map/components/EarthquakeView/BottomPanel/EffectRangePreview";
import EffectRangePreviewN from "./EffectRangePreviewN.vue"
export default {
  name: "BottomPanel",
  components: {EffectRangePreviewN},
  computed: {
    currentRenderingRange() {
      return this.$store.state.earthquake.currentRenderingSection
    },
    sections() {
      let targetSet = this.$store.state.earthquake.currentEarthquakeSubSections.filter((section) => {
        return section.LINE_NAME === this.currentRenderingRange.L_NAME
      }).sort((a, b) => {
        return parseFloat(a.S_MILE) - parseFloat(b.S_MILE)
      })
      // console.log(targetSet)
      // console.log(this.currentRenderingRange.L_NAME, this.renderStart, this.renderEnd, '渲染区间', targetSet)
      return targetSet
    },
    renderStart() {
      let firstSection = this.sections[0]
      if (firstSection.hasOwnProperty('S_MILE')) {
        return parseFloat(firstSection.S_MILE)
      } else {
        return 0
      }
    },
    renderEnd() {
      let lastSection = this.sections[this.sections.length - 1]
      if (lastSection.hasOwnProperty('E_MILE')) {
        return parseFloat(lastSection.E_MILE)
      } else {
        return 0
      }
    },
    stations() {
      let targetSet = this.$store.state.earthquake.currentEarthquakeStations.filter((station) => {
        return station.LINE_NAME === this.currentRenderingRange.L_NAME
      }).sort((a, b) => {
        return parseFloat(a.CENTER_MILE) - parseFloat(b.CENTER_MILE)
      })
      // console.log(this.currentRenderingRange.L_NAME, this.renderStart, this.renderEnd, '渲染车站', targetSet)
      return targetSet
    },
    trains() {
      let targetSet = this.$store.state.earthquake.currentEarthquakeEffectedTrains.filter((train) => {
        return train.L_NAME === this.currentRenderingRange.L_NAME
      })
      // console.log(this.currentRenderingRange.L_NAME, this.renderStart, this.renderEnd, '渲染车次', targetSet)
      return targetSet
    },
    diagramClientWidth() {
      let container = document.getElementById('effect-range')
      if (container) {
        console.log('容器宽度', container.clientWidth)
        return container.clientWidth
      } else {
        return 0
      }
    },
    diagramClientHeight() {
      let container = document.getElementById('effect-range')
      if (container) {
        console.log('容器高度', container.clientHeight)
        return container.clientHeight
      } else {
        return 0
      }
    }
  },
  methods: {
    stopAutoScroll() {
      this.$store.commit('earthquake/updateStopAutoScroll', true)
    },
    activeAutoScroll() {
      this.$store.commit('earthquake/updateStopAutoScroll', false)
    }
  },
}
</script>

<style scoped>
.bottom-panel-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.line-title {
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}

.line-title > span {
  margin-left: 20px;
  font-weight: bold;
  font-size: 18px;
  color: #53ACF8;
}

.diagram-container {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 0px;
  height: calc(100% - 30px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.line-diagram {
  height: 70%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-around;
}

.line-diagram.fs {
  background: url("../imgs/RailFs.png") repeat-x;
  background-position: center;
}

.line-diagram.xs {
  background: url("../imgs/RailXs.png") repeat-x;
  background-position: center;
}

.station {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: space-between;
}

.station-marker {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  width: auto;
  height: auto;
}

.station-marker > span {
  font-size: 12px;
  font-weight: bold;
}

.station-logo {
  height: 17px;
  width: 17px;
  background-size: 100% 100%;
}

.station-logo.xs {
  background: url("../imgs/StationMarkerXs.png") no-repeat;
  height: 17px;
  width: 17px;
  background-size: 100% 100%;
}

.station-logo.fs {
  background: url("../imgs/StationMarkerFs.png") no-repeat;
  height: 17px;
  width: 17px;
  background-size: 100% 100%;
}

.env-diagram {
  height: calc(100% - 70%);
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-around;
}

.env {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  width: 100% !important;
  height: 100% !important;
}

.env-logo.pingyuan {
  height: 12px;
  width: 21px;
  background: url("../imgs/Weiqiu.png") no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.env-logo.weiqiu {
  height: 12px;
  width: 21px;
  background: url("../imgs/Zhongqiu.png") no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.env-logo.zhongqiu {
  height: 12px;
  width: 21px;
  background: url("../imgs/Pingyuan.png") no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.env-logo {
  height: 12px;
  width: 12px;
}

.env-line {
  height: 10px;
  width: 100%;
  border-bottom: 2px solid white;
}

.env-line.pingyuan {
  height: 10px;
  width: 100%;
  border-bottom: 2px solid #C3F49E;
}

.env-line.weiqiu {
  height: 10px;
  width: 100%;
  border-bottom: 2px solid #06B074;
}

.env-line.zhongqiu {
  height: 10px;
  width: 100%;
  border-bottom: 2px solid #FFAC39;
}

.trains {
  display: flex;
  flex-direction: row;
  height: 10px;
  width: 24.5px;
  background-size: 100% 100%;
  cursor: pointer;
}

.trains.left {
  height: 10px;
  width: 24.5px;
  background: url("../imgs/TrainLeft.png") no-repeat;
  background-size: 100% 100%;
}

.trains.right {
  height: 10px;
  width: 24.5px;
  background: url("../imgs/TrainRight.png") no-repeat;
  background-size: 100% 100%;
}

.line-train {
  background: url("../imgs/LineTrain.png") no-repeat;
  width: 16px;
  height: 11.5px;
  background-size: 100% 100%;
  margin-top: 18px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  align-content: center;
  cursor: pointer;
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

.xsTl {
  background: url("../imgs/RailXs.png") no-repeat;
  width: 13px;
  height: 4px;
  background-size: 100% 100%
}

.fsTl {
  background: url("../imgs/RailFs.png") no-repeat;
  width: 13px;
  height: 4px;
  background-size: 100% 100%
}

.pyTl {
  /* background-image: url("../imgs/Weiqiu.png") no-repeat; */
  background: #B9E896;
  width: 13px;
  height: 4px;
  background-size: 100% 100%
}

.zqTl {
  /* background: url("../imgs/Pingyuan.png") no-repeat; */
  background: #FFA338;
  width: 13px;
  height: 4px;
  background-size: 100% 100%
}
</style>
