<template>
  <div class="export-report-page-container">
    <div class="eq-select-bar">
      <el-select v-model="currentEq" style="margin-left: 10px" size="mini" placeholder="选择应急事件..." @change="getReports">
        <el-option v-for="(eq, index) in eqs" :value="eq.EQ_ID" :key="index" :label="eq.EQ_LOCATION + '（' + eq.EQ_LEVEL + '级）'"></el-option>
      </el-select>
    </div>
    <div class="export-dialog-container">
      <export-report />
    </div>
  </div>
</template>

<script>
import ExportReport from "@/components/map/components/EarthquakeView/RightPanel/ExportReport";
import C from "@/assets/com";
import com from "@/assets/com";
export default {
  name: "index",
  components: {
    ExportReport
  },
  data() {
    return {
      eqs: [],
      currentEq: ''
    }
  },
  mounted () {
    let overrideID = this.$store.state.params.id
    if (overrideID !== undefined) {
      this.getAvailableEarthquake().then( ( eqs ) => {
        // let firstEq = eqs[0]
        let eid = overrideID
        console.log('CURRENT OVERRIDE', eid)
        this.getReports(eid)
        // this.getAllReports( firstEq ).then(() => {
        //   // this.setCenterCommandAutoScroll()
        //   // this.setDdCommandAutoScroll()
        //   this.setSubCommandAutoScroll()
        // })
      } )
    }
    this.getAvailableEarthquake().then( ( eqs ) => {
      let firstEq = eqs[0]
      let eid = firstEq.EQ_ID
      this.getReports(eid)
      // this.getAllReports( firstEq ).then(() => {
      //   // this.setCenterCommandAutoScroll()
      //   // this.setDdCommandAutoScroll()
      //   this.setSubCommandAutoScroll()
      // })
    } )
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
            resolve( eqs.data['1'] )
          } catch (e) {
            reject( e )
          }
        } )
      } )
    },
    getReports(eid) {
      return new Promise((resolve, reject) => {
        let eq = this.eqs.find((e) => {return e.EQ_ID === eid})
        this.currentEq = eid
        const loading = this.$loading({
          lock: true,
          text: "正在获取数据...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 获取巡线方案
        com.getData({
          c: 'eqeh_zxy2058',
          s: [
            {
              E_ID: eid,
              DDT: 'all',
              TRAIN: 'all',
              LINE_NAME: 'all'
            }
          ],
          url: 'https://10.192.126.203/GeneralProServlet'
        }, (res) => {
          // 获取历史速报
          com.getData({
            c: 'eqeh_zxy2068',
            s: [
              {
                E_ID: eid,
              }
            ],
            url: 'https://10.192.126.203/GeneralProServlet'
          }, (reports) => {
            this.$store.commit('earthquake/updateDetailLineTrainPlans', res.data['1'])
            this.$store.commit('earthquake/updateEarthquakeReports', reports.data['1'])
            // 获取地震基本信息
            C.getData({
              c: 'eqeh_zxy9010',
              s: [eid],
              w: ['all'],
              url: 'https://10.192.126.203/GeneralProServlet'
            }, (res) => {
              try {
                console.log('地震详情', res.data[1])
                C.getData({
                  c: 'eqeh_zxy2056',
                  s: [{
                    E_ID: eid
                  }],
                  url: 'https://10.192.126.203/GeneralProServlet'
                }, (reports) => {
                  C.getData({
                    c: 'eqeh_zxy2057',
                    s: [
                      {
                        DDT: 'all',
                        E_ID: eid
                      }
                    ],
                    url: 'https://10.192.126.203/GeneralProServlet'
                  }, (plans) => {
                    try {
                      this.$store.commit('earthquake/updateLineTrainPlans', plans.data['1'])
                      this.$store.commit('earthquake/updateReports', reports.data)
                      localStorage.setItem('reportsData', JSON.stringify(reports.data))
                      // window.postMessage(reports.data, '*')
                      this.$store.commit('earthquake/updateCurrentEarthquakeInfo', res.data[1])
                      this.$store.commit('earthquake/updateCurrentEarthquake', eq)
                      // this.$store.commit('earthquake/updateHidePanelOverRide', false)
                      // let earthquake = JSON.parse(JSON.stringify(row))
                      // earthquake.srcLatitude = parseFloat(this.$store.state.earthquake.currentEarthquakeInfo.EQ_LAT)
                      // earthquake.srcLongitude = parseFloat(this.$store.state.earthquake.currentEarthquakeInfo.EQ_LON)
                      // eqObj.creatEarthquakeMarker(earthquake, true)
                      loading.close()
                    } catch (e) {
                      this.$message.warning('网络连接超时，请稍后再试')
                      loading.close()
                    }
                  })
                })
              } catch (e) {
                this.$message.warning('网络连接超时，请稍后再试')
                loading.close()
              }
            })
            // this.showExportReport = true
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.export-report-page-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.eq-select-bar {
  height:          50px;
  width:           100%;
  display:         flex;
  flex-direction:  row;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
  background:      #B1BBC4;
}

.export-dialog-container {
  height: calc(100% - 150px);
  width: 100%;
}
</style>
