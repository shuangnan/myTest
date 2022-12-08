<template>
  <div style="height: 100%; width: 100%;">
    <div class="summary">
      <h2 style="color: white">全部线路: </h2>
      <i class="icon dc"></i>
      <span class="dc-sum">{{ getCount('D').sum }}</span>
      <span class="ed">({{ getCount('D').ed }})</span>
      <i class="icon pc"></i>
      <span class="pc-sum">{{ getCount('P').sum }}</span>
      <span class="ed">({{ getCount('P').ed }})</span>
      <i class="icon hc"></i>
      <span class="hc-sum">{{ getCount('H').sum }}</span>
      <span class="ed">({{ getCount('H').ed }})</span>
    </div>
    <vxe-table border height="700" :data="data" class="eq-status-table" :row-class-name="getRowClass" header-row-class-name="header-row" :span-method="colspanMethod">
      <vxe-column v-for="(col, index) in tableCols" :key="index" :field="col.prop" :title="col.label" :formatter="col.formatter" :cell-render="{name: col.cellRender}" align="center"></vxe-column>
    </vxe-table>
  </div>
</template>

<script>
import VXETable from 'vxe-table'

VXETable.renderer.add('ATTRIBUTE', {
  renderDefault (h, cellRender, params) {
    let {row} = params
    if (row.ATTRIBUTE === '0') {
      return [
        <span style='color: #DF990C'>限速</span>
      ]
    } else if (row.ATTRIBUTE === '1') {
      return [
        <span style='color: #FD5A5A'>封锁</span>
      ]
    }
  }
})

VXETable.renderer.add('ROW_OTHER', {
  renderDefault (h, cellRender, params) {
    let {row} = params
    return [
      <span style='color: #09F6FF'>{row.ROW_OTHER}</span>
    ]
  }
})

VXETable.renderer.add('EDTIME', {
  renderDefault (h, cellRender, params) {
    let {row} = params
    if (row.EDTIME === '0') {
      return [
        <span style='color: #5BCA56'>正点</span>
      ]
    } else if (row.EDTIME === '') {
      return [
        <span></span>
      ]
    } else {
      return [
        <span style='color: #FD5A5A'>晚点{row.EDTIME}分</span>
      ]
    }
  }
})

export default {
  name: "EqStatus",
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableCols: [
        {
          label: '线名',
          prop: 'L_NAME'
        },
        {
          label: '行别',
          prop: 'ROW_OTHER',
          cellRender: 'ROW_OTHER'
        },
        {
          label: '区间',
          prop: 'SECTION'
        },
        {
          label: '动车数量',
          prop: 'DCOUNT'
        },
        {
          label: '普车数量',
          prop: 'PCOUNT'
        },
        {
          label: '货车数量',
          prop: 'HCOUNT'
        },
        {
          label: '类型',
          prop: 'ATTRIBUTE',
          cellRender: 'ATTRIBUTE'
        },
        {
          label: '车次',
          prop: 'TRAIN'
        },
        {
          label: '发点',
          prop: 'START_DATE',
          formatter: ({cellValue}) => {
            if (cellValue !== '') {
              return cellValue.split(' ')[1].substring(0, 5)
            }
          }
        },
        {
          label: '发站',
          prop: 'START_STN'
        },
        {
          label: '到点',
          prop: 'END_DATE',
          formatter: ({cellValue}) => {
            if (cellValue !== '') {
              return cellValue.split(' ')[1].substring(0, 5)
            }
          }
        },
        {
          label: '到站',
          prop: 'END_STN'
        },
        {
          label: '当前位置',
          prop: 'CURRNAME'
        },
        {
          label: '正晚点',
          prop: 'EDTIME',
          cellRender: 'EDTIME'
        }
      ]
    }
  },
  methods: {
    getRowClass({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'row-class-a'
      } else {
        return 'row-class-b'
      }
    },
    getCount(type) {
      let sum = 0
      let ed = 0
      this.data.map((train) => {
        if (train.TRAIN_TYPE === type) {
          sum++
          if (train.EDTIME !== '0') {
            ed++
          }
        }
      })
      return {
        sum: sum,
        ed: ed
      }
    },
    formatColspan(arr) {
      let colspanResult = []
      let colspanIndex = 0
      arr.forEach((item, index) => {
        if (index === 0) {
          colspanResult.push(1)
        } else {
          if (item.SECTION === arr[index - 1].SECTION) {
            colspanResult[colspanIndex] += 1
            colspanResult.push(0)
          } else {
            colspanResult.push(1)
            colspanIndex = index
          }
        }
      })
      return colspanResult
    },
    colspanMethod({row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, data}) {
      if (columnIndex <= 6) {
        console.log(row)
        let arr = this.formatColspan(data)
        const _row = arr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        let a = {
          rowspan: _row,
          colspan: _col
        }
        return a
      }
    }
  }
}
</script>

<style>
.eq-status-table .vxe-body--row.row-class-a {
  background-color: #3A5D8A;
  color: white
}

.eq-status-table .vxe-body--row.row-class-b {
  background-color: rgba(24, 36, 71, 0.76);
  color: white;
}

.eq-status-table .vxe-header--row.header-row {
  background-color: rgba(24, 36, 71, 0.6);
  color: white;
}
</style>

<style scoped>
.summary {
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
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

.icon.hc {
  background:      url("../img/stat_hc.png") no-repeat;
  background-size: 120% 100%;
}

.dc-sum {
  color: #00F0FF;
  font-size: 16px;
}

.pc-sum {
  color: #5BCA56;
  font-size: 16px;
}

.hc-sum {
  color: #5BCA56;
  font-size: 16px;
}

.ed {
  color: #FD5A5A;
  font-size: 16px;
}
</style>
