<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div style="height: 65px; width: 100%; padding: 10px; display: flex; flex-direction: row">
      <div :style="dw_gdsb"></div>
      <div style="height: 100%; width: calc(100% - 65px); display: flex; flex-direction: column; align-items: center; justify-content: center">
        <span style="font-size: 16px; font-weight: bold">轨道电路设备</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.LINE_NAME }}</span>
      </div>
    </div>
    <div style="height: calc(100% - 65px); width: calc(100% - 20px); padding: 10px; border-top: 1px solid gray">
      <div v-for="(desc, index) in descDic" :key="index" style="font-size: 14px; display: flex">
        <div style="width: 50%">{{ desc.text }}: </div>
        <div style="color: #FDA629; width: 50%">{{ content[desc.key] === '' ? '暂无' : content[desc.key] }}</div><br />
      </div>
    </div>
  </div>
</template>

<script>
import dwGdsbPopperStyles from "./dwGdsbPopperStyles";
export default {
  name: "dwGdsbPopper",
  props: ['type', 'popper-data'],
  data () {
    return {
      content: {},
      ...dwGdsbPopperStyles,
      descDic: [
        {
          key: 'CODE',
          text: '设备编号'
        },
        {
          key: 'RAILWAY_STATION_NAME',
          text: '站名'
        },
        {
          key: 'LINE_TYPE',
          text: '线路类型'
        },
        {
          key: 'DEVICE_CLASSIFY',
          text: '设备等级'
        },
        {
          key: 'START_STATION_NAME',
          text: '起始站名'
        },
        {
          key: 'END_STATION_NAME',
          text: '结束站名'
        },
        {
          text: '公里标',
          key: 'KILOMETER_POST'
        }
      ]
    }
  },
  methods: {
    initData () {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取轨道电路设备信息', popperStr )
      let popper = JSON.parse( popperStr )
      this.content = popper
    }
  },
  mounted () {
    if (this.popperData === '' || this.popperData === undefined) {
      return
    } else {
      this.initData()
      // this.logo = require(__dirname, '/dwsbPopperLogos/天窗-大.png')
    }
  }
}
</script>

<style scoped>

</style>
