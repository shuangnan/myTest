<template>
  <div style="width: 100%; height: 750px; display: flex; flex-direction: row">
    <div style="width: 20%; height: 100%">
      <div
        style="height: 100%; width: 100%; display: flex; flex-direction: row; flex-wrap: wrap; align-content: flex-start; justify-content: center; align-items: center; overflow-y: scroll">
        <div v-for="(line, index) in statData" :id="'lineName' + index.toString()" :key="index"
             class="line-name-card" @click="showDetails(line, index)">
          <div style="padding: 5px">
            <div style="height: 30%">
              <h3 style="color: white">{{ line.LINE_NAME }}</h3>
            </div>
            <div style="height: 70%">
              <p style="color: #00F0FF">
                动车: {{ line.COUNT.D_SUM }}
                <span style="color: #FD5A5A; font-weight: bold">
                ({{ line.COUNT.D_ED }})
              </span>
              </p>
              <p style="color: #46C564">
                普车: {{ line.COUNT.P_SUM }}
                <span style="color: #FD5A5A; font-weight: bold">
                ({{ line.COUNT.P_ED }})
              </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 75%; height: 100%; border-left-style: solid; border-left-color: #FFFFFF; border-left-width: 1px">
      <div
        style="height: 8%; margin-left: 10px; margin-top: 10px; display: flex; flex-direction: row; align-content: center; justify-content: space-between; align-items: center">
        <el-radio-group v-model="filter">
          <el-radio-button label="区间"></el-radio-button>
          <el-radio-button label="站内"></el-radio-button>
          <el-radio-button label="全部"></el-radio-button>
        </el-radio-group>
        <p style="color: white">
          <span style="color: #FD5A5A">红色</span>
          标注的为晚点列车数
        </p>
        <div>
          <p style="font-size: 20px; color: white">
            全部线路:
            <i class="icon dc"></i>
            <span style="color: #00F0FF">
              {{ allDSum }}
            </span>
            <span style="color: #FD5A5A">
              ({{ allDEd }})
            </span>
            <i class="icon pc"></i>
            <span style="color: #46C564">
              {{ allPSum }}
            </span>
            <span style="color: #FD5A5A">
              ({{ allPEd }})
            </span>
          </p>
        </div>
      </div>
      <div
        style="height: calc(92% - 10px); display: flex; flex-direction: row; flex-wrap: wrap; align-content: flex-start; justify-content: flex-start; align-items: center; overflow-y: scroll">
        <div
          v-for="(d, index) in details.filter((dd) => { if (filter === '全部') {return true} else {return dd.TYPE === filter}})"
          :id="'card' + index.toString()"
          :key="index"
          :class="d.TYPE === '区间' ? 'card-section' : 'card-station'">
          <el-popover placement="bottom" width="900" popper-class="popper">
            <div class="table">
              <el-table :data="d.TRAINS" size="mini" fit stripe :header-row-style="{color: '#72B8FF', fontSize: '14px', fontWeight: 'bold'}" :row-style="{color: 'black'}">
                <el-table-column v-for="(col, index) in tableCols" align="center" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" />
              </el-table>
            </div>
            <div style="padding: 5px" slot="reference">
              <div style="height: 30%">
                <h3 style="color: white">{{ d.NAME }}</h3>
              </div>
              <div style="height: 70%">
                <p style="color: white">
                  动车: {{ d.COUNT.D_SUM }}
                  <span style="color: #FF8585; font-weight: bold">
                  ({{ d.COUNT.D_ED }})
                </span>
                </p>
                <p style="color: white">
                  普车: {{ d.COUNT.P_SUM }}
                  <span style="color: #FF8585; font-weight: bold">
                  ({{ d.COUNT.P_ED }})
                </span>
                </p>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainStat",
  data () {
    return {
      statData: [],
      details: [],
      filter: '全部',
      currentLineName: '',
      allDSum: '',
      allPSum: '',
      allDEd: '',
      allPEd: '',
      tableCols: [
        {
          label: '车次',
          prop: 'TRAIN'
        },
        {
          label: '线别',
          prop: 'LINE_NAME'
        },
        {
          label: '出发站',
          prop: 'STARTNAME'
        },
        {
          label: '出发时间',
          prop: 'START_DATE',
          formatter: ( row, column, cellValue, index ) => {
            return row.START_DATE.split( ' ' )[1]
          }
        },
        {
          label: '到达站',
          prop: 'ENDNAME'
        },
        {
          label: '到达时间',
          prop: 'END_DATE',
          formatter: ( row, column, cellValue, index ) => {
            return row.END_DATE.split( ' ' )[1]
          }
        },
        {
          label: '位置',
          prop: 'LOCAL_FLAG',
          formatter: ( row, column, cellValue, index ) => {
            if (row.LOCAL_FLAG === 0) {
              return row.CURRNAME
            } else {
              return row.CURRNAME + '-' + row.NEXTNAME
            }
          },
          width: '200px'
        },
        {
          label: '到晚',
          prop: 'EDTIME',
          formatter: ( row, column, cellValue, index ) => {
            // console.log( row.EDTIME )
            if (parseInt( row.EDTIME ) > 5) {
              return <span style='color: red'>晚点{ row.EDTIME }分钟</span>
            } else {
              return '正点'
            }
          }
        }
      ]
    }
  },
  methods: {
    showDetails ( line, index ) {
      console.log( '显示详情', line )
      for (let i = 0; i < this.statData.length; i ++) {
        document.getElementById( 'lineName' + i.toString() ).setAttribute( 'class', 'line-name-card' )
      }
      document.getElementById( 'lineName' + index.toString() ).setAttribute( 'class', 'line-name-card-clicked' )
      this.currentLineName = line.LINE_NAME
      this.details = this.sortByEdCount(line.DETAILS)
    },
    applyData ( data ) {
      this.statData = this.sortByEdCount(data)
      setTimeout( () => {
        this.$nextTick( () => {
          const all = data.find( ( v ) => {
            return v.LINE_NAME === '全部'
          } )
          this.allPSum = all.COUNT.P_SUM
          this.allDSum = all.COUNT.D_SUM
          this.allDEd = all.COUNT.D_ED
          this.allPEd = all.COUNT.P_ED
          this.filter = '全部'
          this.showDetails( data.find( ( v ) => {
            return v.LINE_NAME === '全部'
          } ), 0 )
        } )
      }, 50 )
    },
    sortByEdCount(array) {
      return array.sort((a, b) => {
        return (parseInt(b.COUNT.P_ED) + parseInt(b.COUNT.D_ED)) - (parseInt(a.COUNT.P_ED) + parseInt(a.COUNT.D_ED))
      })
    }
  }
}
</script>

<style scoped>
.line-name-card {
  background-color: #0D1836;
  border-radius:    4px;
  margin-bottom:    1px;
  margin-left:      20px;
  width:            100%;
}

.line-name-card-clicked {
  background-color: #2B3960;
  border-radius:    4px;
  margin-bottom:    1px;
  margin-left:      20px;
  width:            100%;
}

.card-section {
  background-color: #0E92AE;
  border-radius:    4px;
  margin:           10px;
  width:            180px;
}

.card-station {
  background-color: #1C75CF;
  border-radius:    4px;
  margin:           10px;
  width:            180px;
}

.icon {
  display:        inline-block;
  height:         20px;
  margin:         0 5px 0 8px;
  vertical-align: middle;
  width:          20px;
}

.icon.pc {
  background:      url("../img/stat_pc.png") no-repeat;
  background-size: 100% 100%;
}

.icon.dc {
  background:      url("../img/stat_dc.png") no-repeat;
  background-size: 120% 100%;
}

.popper.table {
  background-color: #0D1836;
}
</style>
