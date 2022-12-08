<template>
  <div class="container">
    <div class="title-container">
      <span>各专业处置情况通报</span>
      <el-select style="margin-top: 0px; width: 1040px" placeholder="选择应急事件..." @change="handleCurrentEarthquakeChange" v-model="currentEarthquakeID">
        <el-option v-for="(eq, index) in eqs" :value="eq.EQ_ID" :key="index" :label="eq.EQ_LOCATION + '（' + eq.EQ_LEVEL + '级）'">
          <!--          <span>{{ eq.EQ_LOCATION }}({{ eq.EQ_LEVEL }})</span>-->
        </el-option>
      </el-select>
    </div>
    <div class="report-card-container" id="subCommandContainer" @mouseover="clearSubCommandAutoScroll" @mouseout="setSubCommandAutoScroll">
      <ReportCard
        style="cursor: pointer; border-bottom: 10px solid transparent; max-height: 300px"
        v-for="(report, index) in subReports"
        :key="index"
        :content="report"
        :index="index"
        :bigger="true"
      />
    </div>
  </div>
</template>

<script>
import C from "../../../assets/com.js";
import ReportCard from "@/components/map/components/EarthquakeView/RightPanel/ReportCard";
import webMessageUtil from "../../../components/map/js/websoketMsg"

export default {
  data () {
    return {
      allReports: [],
      ddCommands: [],
      eqs: [],
      searchKeyword: '',
      currentEarthquake: {},
      currentEarthquakeID: '',
      centerCommandAutoScroll: null,
      subCommandAutoScroll: null,
      ddCommandAutoScroll: null
    }
  },
  components: { ReportCard },
  created () {
  },
  mounted () {
    this.getAvailableEarthquake().then( ( eqs ) => {
      let firstEq = eqs[0]
      if (firstEq !== undefined) {
        this.getAllReports( firstEq ).then(() => {
        // this.setCenterCommandAutoScroll()
        // this.setDdCommandAutoScroll()
        this.setSubCommandAutoScroll()
      })
      }
    } )
    this.initMsg()
  },
  computed: {
    centerReports () {
      return this.allReports.filter( ( r ) => {
        return r.KIND == 0
      } )
    },
    subReports () {
      return this.allReports.filter( ( r ) => {
        return r.KIND == 1
      } )
    }
  },
  methods: {
    getAvailableEarthquake () {
      return new Promise( ( resolve, reject ) => {
        C.getData( {
          c: 'eqeh_zxy2001',
          url: 'https://10.192.126.203/GeneralProServlet'
        }, ( eqs ) => {
          try {
            this.eqs = eqs.data['1'].filter( ( e ) => {
              return e.EQ_STATUS == 0
            } )
            console.log('获取可选地震', this.eqs)
            resolve( this.eqs )
          } catch (e) {
            reject( e )
          }
        } )
      } )
    },
    getAllReports ( eq ) {
      return new Promise( ( resolve, reject ) => {
        this.currentEarthquake = JSON.parse(JSON.stringify(eq))
        this.currentEarthquakeID = eq.EQ_ID
        C.getData( {
          c: 'eqeh_zxy2056',
          s: [
            {
              E_ID: eq.EQ_ID
            }
          ],
          url: 'https://10.192.126.203/GeneralProServlet'
        }, ( report ) => {
          try {
            this.allReports = report.data['1']
            this.ddCommands = report.data['3']
            console.log( '应急响应信息', this.allReports )
            console.log( '应急调度命令', this.ddCommands )
            resolve( report )
          } catch (e) {
            reject( e )
          }
        } )
      } )
    },
    getCommandPreview ( commandHTML = '' ) {
      let filterHTMLReg = new RegExp( '<[^<>]+>', 'g' )
      let target = commandHTML.replace( filterHTMLReg, '' ).replace( /&nbsp;/g, '' )
      // console.log( target )
      return target
    },
    initMsg() {
      webMessageUtil.init({
        onmessage: (type, msg) => {
          if (type === 'earthquake_report_update') {
            if (JSON.parse(msg.phone).E_ID === this.currentEarthquake.EQ_ID) {
              this.getAllReports(this.currentEarthquake)
            }
          }
        },
        onopen: () => {
          console.log('消息链接已建立')
        },
        onclose: () => {
          console.log('消息链接已断开')
        }
      })
    },
    handleCurrentEarthquakeChange(newID) {
      let targetEq = this.eqs.find((e) => {
        return e.EQ_ID === newID
      })
      let loading = this.$loading({
        lock: true,
        text: '正在获取速报信息...',
      })
      this.clearCenterCommandAutoScroll()
      this.clearDdCommandAutoScroll()
      this.clearSubCommandAutoScroll()
      this.getAllReports(targetEq).then(() => {
        this.setCenterCommandAutoScroll()
        this.setDdCommandAutoScroll()
        this.setSubCommandAutoScroll()
        loading.close()
      })
    },
    setCenterCommandAutoScroll() {
      let container = document.getElementById('centerCommandContainer')
      this.centerCommandAutoScroll = setInterval(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0
        } else {
          container.scrollTo({
            top: container.scrollTop + 2,
            behavior: 'smooth'
          })
        }
      }, 100)
    },
    setSubCommandAutoScroll() {
      let container = document.getElementById('subCommandContainer')
      this.subCommandAutoScroll = setInterval(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0
        } else {
          container.scrollTo({
            top: container.scrollTop + 2,
            behavior: 'smooth'
          })
        }
      }, 100)
    },
    setDdCommandAutoScroll() {
      let container = document.getElementById('ddCommandContainer')
      this.ddCommandAutoScroll = setInterval(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0
        } else {
          container.scrollTo({
            top: container.scrollTop + 2,
            behavior: 'smooth'
          })
        }
      }, 100)
    },
    clearCenterCommandAutoScroll() {
      clearInterval(this.centerCommandAutoScroll)
    },
    clearSubCommandAutoScroll() {
      clearInterval(this.subCommandAutoScroll)
    },
    clearDdCommandAutoScroll() {
      clearInterval(this.ddCommandAutoScroll)
    }
  },
  beforeDestroy () {
    localStorage.clear()
  }
}
</script>
</script>

<style scoped>
.container {
  height:         100vh;
  width:          100vw;
  display:        flex;
  flex-direction: column;
  align-content:  center;
  align-items:    center;
  background: url("./img/bg-new.png") no-repeat;
  background-size: 100% 100%;
}

.title-container {
  width:           1797px;
  background:      url("./img/title-bg.svg") no-repeat;
  height:          162px;
  background-size: 100% 100%;
  display:         flex;
  flex-direction: column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-end;
}

.title-container > span {
  color:       white;
  font-weight: bold;
  font-size:   50px;
}

.report-card-container {
  height: calc(100% - 192px);
  width:  100%;
  overflow-y: scroll;
  padding-left: 30px;
  margin-top: 30px;
}

>>>.el-input__inner {
  background: #0B1732 !important;
  color: white !important;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #1698E3;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}
</style>
