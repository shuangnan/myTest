<template>
  <div>
    <div class="left-panel">
      <LeftPanel />
    </div>
    <div class="right-panel">
      <RightPanel />
    </div>
    <div class="bottom-panel">
      <BottomPanel />
    </div>
  </div>
</template>

<script>
import LeftPanel from "@/components/map/components/EarthquakeView/LeftPanel/LeftPanel";
import BottomPanel from "@/components/map/components/EarthquakeView/BottomPanel/BottomPanel";
import RightPanel from "@/components/map/components/EarthquakeView/RightPanel/RightPanel";
import earthquakeUtil from '../../js/earthquake'
import com from '../../../../assets/com.js'
export default {
  name: "EarthquakeView",
  components: {RightPanel, BottomPanel, LeftPanel},
  mounted() {
    console.log(earthquakeUtil.data)
    this.renderEarthquakeRange()
    this.setEarthquakeUpdateTimer()
  },
  data() {
    return {
      earthquakeUpdateTimer: null
    }
  },
  computed: {
    currentEarthquake() {
      return this.$store.state.earthquake.currentEarthquake
    },
    earthquakeBrief() {
      return this.$store.state.earthquake.currentEarthquakeInfo
    },
    updateInfoCount() {
      return this.$store.state.earthquake.updateCount
    },
    currentRenderingSection() {
      return this.$store.state.earthquake.currentRenderingSection
    }
  },
  methods: {
    setEarthquakeUpdateTimer() {
      if (this.earthquakeUpdateTimer) {
        clearInterval(this.earthquakeUpdateTimer)
      }
      this.earthquakeUpdateTimer = setInterval(() => {
        this.$store.commit( "earthquake/updateCount" );
      }, 60000)
    },
    renderEarthquakeRange() {
      let e = JSON.parse(JSON.stringify(this.currentEarthquake))
      console.log('render range', e)
      e.srcLatitude = e.EQ_LAT
      e.srcLongitude = e.EQ_LON
      console.log(e)
      if (!earthquakeUtil.data.eqOther.layerVisible) {
        // 如果没有设置显示地震影响范围，渲染地震影响范围
        earthquakeUtil.data.eqOther.layerVisible = true
        earthquakeUtil.creatEarthquakeMarker(e, false)
        earthquakeUtil.creatEqPulseSingle(e, false)
      }
      earthquakeUtil.filterEarthquakeMarkers()
    }
  },
  watch: {
    'updateInfoCount': {
      deep: true,
      handler: function () {
        com.getData({
          c: 'eqeh_zxy9010',
          s: [this.currentEarthquake.EQ_ID],
          w: ['train'],
          url: 'https://10.192.126.203/GeneralProServlet'
        }, (res) => {
          this.$store.commit('earthquake/updateTrainInfo', res.data)
        })
      }
    },
  },
  beforeDestroy () {
    this.$store.commit('earthquake/reset')
  }
}
</script>

<style scoped>
.left-panel {
  position: absolute;
  left: 0;
  top: 75px;
  width: 412px;
  height: 925px;
  background: url("./imgs/LeftPanelBackground.png")no-repeat;
  background-size: 100% 100%;
  z-index: 1000;
}

.right-panel {
  position: absolute;
  right: 0;
  top: 75px;
  width: 412px;
  height: 925px;
  background: url("./imgs/RightPanelBackground.png")no-repeat;
  background-size: 100% 100%;
  z-index: 1000;
}

.bottom-panel {
  position: absolute;
  bottom: 0;
  left: 445px;
  height: 244px;
  width: 1026px;
  background: url("./imgs/BottomPanelBackground.png")no-repeat;
  background-size: 100% 100%;
  z-index: 1000;
}
</style>
