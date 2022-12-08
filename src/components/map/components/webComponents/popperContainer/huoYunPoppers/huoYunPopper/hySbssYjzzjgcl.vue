<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div :style="logoContainerStyle">
      <div :style="getLogoStyle()"></div>
      <div :style="titleContainerStyle">
        <span style="font-size: 16px; font-weight: bold">应急装载站及常用加固材料</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.STATION }}</span>
      </div>
    </div>
    <div :style="contentContainerStyle">
<!--      <div v-for="(desc, index) in descDic" :key="index" style="font-size: 14px; display: flex">-->
<!--        <div style="width: 50%">{{ desc.text }}</div>-->
<!--        <div style="color: #FDA629; width: 50%">{{ content[desc.key] === '' ? '暂无' : content[desc.key] }}</div>-->
<!--      </div>-->
      <div style="width: 100%; height: auto; display: flex; flex-direction: row; align-items: center; align-content: center; justify-content: space-around">
        <div style="width: 15%; display: flex; justify-content: center">
          <span :style="tableHeaderStyle">加固材料名称</span>
        </div>
        <div style="width: 10%; display: flex; justify-content: center">
          <span :style="tableHeaderStyle">单位</span>
        </div>
        <div style="width: 15%; display: flex; justify-content: center">
          <span :style="tableHeaderStyle">加固材料数量</span>
        </div>
        <div style="width: 15%; display: flex; justify-content: center">
          <span :style="tableHeaderStyle">加固工具</span>
        </div>
        <div style="width: 12%; display: flex; justify-content: center">
          <span :style="tableHeaderStyle">加固工具数量</span>
        </div>
        <div style="width: 18%; display: flex; justify-content: center">
          <span :style="tableHeaderStyle">日常维护保管人员</span>
        </div>
      </div>
      <div style="width: 100%;">
        <div v-for="(row, index) in tableData" :key="index" style="width: 100%; height: auto; display: flex; flex-direction: row; align-items: center; align-content: center; justify-content: space-around; margin-bottom: 10px">
          <div style="width: 15%; display: flex; justify-content: center">
            <span>{{ row.JGCL }}</span>
          </div>
          <div style="width: 10%; display: flex; justify-content: center">
            <span>{{ row.CLDW }}</span>
          </div>
          <div style="width: 15%; display: flex; justify-content: center">
            <span>{{ row.SL }}</span>
          </div>
          <div style="width: 15%; display: flex; justify-content: center">
            <span>{{ row.JGGJ === '' ? '暂无' : row.JGGJ }}</span>
          </div>
          <div style="width: 12%; display: flex; justify-content: center">
            <span>{{ row.GJSL === '' ? '暂无' : row.GJSL }}</span>
          </div>
          <div style="width: 18%; display: flex; justify-content: center">
            <span>{{ row.CZBZ }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hySbssYjzzjgcl",
  props: ['type', 'popper-data'],
  data() {
    return {
      commonStyles: {
        height: '85.3px',
        width: '83.3px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat'
      },
      logoContainerStyle: {
        height: '85.3px',
        width: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row'
      },
      titleContainerStyle: {
        height: '100%',
        width: 'calc(100% - 83.3px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      contentContainerStyle: {
        height: 'calc(100% - 85.3px)',
        width: 'calc(100% - 20px)',
        padding: '10px',
        borderTop: '1px solid gray',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll'
      },
      tableHeaderStyle: {
        fontWeight: 'bold',
        color: '#5EB0F3'
      },
      descDic: [
        {
          key: 'JGCL',
          text: '加固材料名称'
        },
        {
          key: 'CLDW',
          text: '单位'
        },
        {
          key: 'SL',
          text: '加固材料数量'
        },
        {
          key: 'JGGJ',
          text: '加固工具'
        },
        {
          key: 'GJSL',
          text: '加固工具数量'
        },
        {
          key: 'CZBZ',
          text: '日常维护保管人员'
        },
      ],
      content: {},
      tableData: []
    }
  },
  mounted () {
    if (this.popperData === '' || this.popperData === undefined) {
      return
    } else {
      this.initData()
      // this.logo = require(__dirname, '/dwsbPopperLogos/天窗-大.png')
    }
  },
  methods: {
    getLogoStyle() {
      return {
        ...this.commonStyles,
        backgroundImage: `url('${this.loadImage(this.type + '.png')}')`
      }
    },
    loadImage(filename) {
      return require(__dirname + '/huoYunPopperLogos/' + filename)
    },
    initData() {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取信息', popperStr )
      let popper = JSON.parse( popperStr )
      this.content = popper
      this.tableData = popper.CONTENTS
    },
  }
}
</script>

<style scoped>

</style>
