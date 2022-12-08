<!--
 * @created：2022年9月21日
 * @author：	cpy
 * @version:	v1.0
 * @desc:		应急调度信息
 -->
<template>
  <div style="height: 100vh; width: 100vw; display: flex; flex-direction: column" class="b-lay">
    <div class="log">
      <el-select style="top: 40px; left: 60px; width: 300px" size="mini" placeholder="选择应急事件..." @change="handleCurrentEarthquakeChange" v-model="currentEarthquakeID">
        <el-option v-for="(eq, index) in eqs" :value="eq.EQ_ID" :key="index" :label="eq.EQ_LOCATION + '（' + eq.EQ_LEVEL + '级）'">
<!--          <span>{{ eq.EQ_LOCATION }}({{ eq.EQ_LEVEL }})</span>-->
        </el-option>
      </el-select>
    </div>
    <div class="main-container">
      <div class="info-container">
        <div class="area-title">
          <span>应急响应信息</span>
        </div>
        <div class="infos">
          <div class="center-info">
            <div class="earthquake-effect-title" style="margin-top: 30px">
              <span>指挥中心信息通报</span>
            </div>
            <div class="report-container" id="centerCommandContainer" @mouseover="clearCenterCommandAutoScroll" @mouseout="setCenterCommandAutoScroll">
              <ReportCard
                style="cursor: pointer; border-bottom: 10px solid transparent"
                v-for="(report, index) in centerReports"
                :key="index"
                :content="report"
                :index="index"
              />
            </div>
          </div>
          <div class="center-info">
            <div class="earthquake-effect-title" style="margin-top: 30px">
              <span>各专业处置情况通报</span>
            </div>
            <div class="report-container" id="subCommandContainer" @mouseover="clearSubCommandAutoScroll" @mouseout="setSubCommandAutoScroll">
              <ReportCard
                style="cursor: pointer; border-bottom: 10px solid transparent"
                v-for="(report, index) in subReports"
                :key="index"
                :content="report"
                :index="index"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="command-container">
        <div class="area-title">
          <span>应急调度命令</span>
        </div>
        <div class="dd-commands">
          <div style="width: 85%; margin-top: 10px" class="dd-command-search">
            <el-input v-model="searchKeyword" style="width: 100%" size="mini" placeholder="输入关键词搜索...">
              <template slot="prepend">
                <el-icon class="el-icon-search"></el-icon>
              </template>
            </el-input>
          </div>
          <div class="commands" id="ddCommandContainer" @mouseover="clearDdCommandAutoScroll" @mouseout="setDdCommandAutoScroll">
            <div
              v-for="(command, index) in ddCommands.filter((d) => {return d.CMD_TEXT.includes(searchKeyword) || d.CMD_NO.includes(searchKeyword) || d.CMD_MBMC.includes(searchKeyword)})"
              :key="index" class="command-card">
              <div class="command-brief">
                <div class="command-no">
                  <span>{{ command.CMD_NO }}</span>
                </div>
                <div class="command-memo">
                  <span>{{ command.CMD_MBMC }}</span>
                </div>
              </div>
              <div class="command-content">
                <el-popover placement="left">
                  <div style="height: 400px; width: 500px; overflow-y: scroll">
                    <div v-html="command.CMD_TEXT"></div>
                  </div>
                  <div slot="reference" style="padding: 0" class="command-content" :title="getCommandPreview(command.CMD_TEXT)">
                    {{ getCommandPreview(command.CMD_TEXT) }}
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      this.getAllReports( firstEq ).then(() => {
        this.setCenterCommandAutoScroll()
        this.setDdCommandAutoScroll()
        this.setSubCommandAutoScroll()
      })
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
            // console.log('获取可选地震', this.eqs)
            resolve( eqs.data['1'] )
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

<style scoped="scoped">
.b-lay {
  position:         relative;
  width:            100%;
  height:           100%;
  overflow:         hidden;
  background: url("./img/bg-new.png");
  background-size:  150% 150%;
  color:            white;
}

.log {
  width:           1920px;
  height:          72px;
  background:      url("./img/logo.png") no-repeat;
  background-size: 100% 100%;
}

.main-container {
  width:           100%;
  height:          auto;
  display:         flex;
  flex-direction:  row;
  align-content:   center;
  align-items:     center;
  justify-content: flex-start;
  margin-top:      10px;
}

.info-container {
  background:      url("./img/bg-main.svg") no-repeat;
  height:          910.1px;
  width:           1435.75px;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
}

.command-container {
  background:      url("./img/bg-right.svg") no-repeat;
  height:          910.1px;
  width:           410.4px;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
}

.area-title {
  width:           100%;
  height:          22px;
  display:         flex;
  align-content:   center;
  align-items:     center;
  justify-content: center;
  margin-top:      5px;
}

.area-title > span {
  font-weight: bold;
}

.infos {
  height:          calc(100% - 22px);
  width:           100%;
  display:         flex;
  flex-direction:  row;
  align-items:     center;
  align-content:   center;
  justify-content: center;
}

.center-info {
  height:          100%;
  width:           50%;
  display:         flex;
  flex-direction:  column;
  align-content:   center;
  align-items:     center;
  justify-content: flex-start;
}

.earthquake-effect-title {
  height:          26px;
  width:           381px;
  background:      url("../../../components/map/components/EarthquakeView/imgs/SplitLine2.png") no-repeat;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  row;
  align-items:     center;
  align-content:   center;
  justify-content: center;
}

.earthquake-effect-title > span {
  text-shadow: 0 0 .05em, 0 0 .1em;
  font-weight: bold;
  font-size:   16px;
}

.report-container {
  width:      85%;
  height:     calc(100% - 30px - 26px - 30px - 40px);
  margin-top: 30px;
  overflow-y: scroll;
  padding:    30px 30px 60px;
}

.dd-commands {
  width:           100%;
  height:          calc(100% - 22px);
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
}

.commands {
  width:           100%;
  height:          calc(100% - 45px - 20px);
  margin-top:      7px;
  overflow-y:      scroll;
  display:         flex;
  flex-direction:  column;
  align-content:   center;
  align-items:     center;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.command-card {
  background:      url("./img/left-1.png") no-repeat;
  height:          71px;
  width:           358px;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  row;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
  margin-top:      15px;
}

.command-brief {
  height:          100%;
  width:           47%;
  display:         flex;
  flex-direction:  column;
  align-content:   center;
  align-items:     center;
  justify-content: center;
}

.command-content {
  height:             100%;
  width:              53%;
  padding:            5px;
  word-break:         break-all;
  text-overflow:      ellipsis;
  display:            -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow:           hidden;
  word-wrap:          break-word;
}

.command-no {
  border-radius:   30px;
  border:          1px solid #4EABF8;
  background:      #163156;
  display:         flex;
  align-items:     center;
  align-content:   center;
  justify-content: center;
  padding:         5px;
}

.command-no > span {
  color:       #4EABF8;
  font-weight: bold;
}

>>> .el-input-group__prepend {
  background: transparent;
}

>>> .el-input__inner {
  background: transparent;
  color:      #FFF;
}

::-webkit-scrollbar {
  display: none;
}

</style>
<style>
/* 发光字体 */
.shadow-txt {
  color:       #D0C5E3;
  text-shadow: 0 0 10px #0000FF, 0 0 20px #FFF;
}
</style>

