<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div style="height: 85.3px; width: 100%; padding: 10px; display: flex; flex-direction: row">
      <div :style="dw_dccxsb"></div>
      <div style="height: 100%; width: calc(100% - 73.7px); display: flex; flex-direction: column; align-items: center; justify-content: center">
        <span style="font-size: 16px; font-weight: bold">道岔融雪设备</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.DEPOT }}</span>
      </div>
    </div>
    <div style="height: calc(100% - 85.3px); width: calc(100% - 20px); padding: 10px; border-top: 1px solid gray">
      <div v-for="(desc, index) in descDic" :key="index" style="font-size: 14px; display: flex">
        <div style="width: 50%">{{ desc.text }}: </div>
        <div style="color: #FDA629; width: 50%">{{ content[desc.key] === '' ? '暂无' : content[desc.key] }}</div><br />
      </div>
    </div>
  </div>
</template>

<script>
import dw_dccxsb from './dwDccxsbPopperStyles'
export default {
  name: "dwGdsbPopper",
  props: ['type', 'popper-data'],
  data () {
    return {
      content: {},
      ...dw_dccxsb,
      descDic: [
        {
          key: 'LINE_NAME',
          text: '线别'
        },
        {
          key: 'WORKSHOP',
          text: '车间'
        },
        {
          key: 'STATION',
          text: '车站'
        },
        {
          key: 'PSB_NO',
          text: '供电箱编号'
        },
        {
          key: 'CONTROL_NAME',
          text: '融雪控制柜名称'
        },
        {
          key: 'CONTROL_NO',
          text: '控制道岔名称'
        },
        {
          text: '设备厂家',
          key: 'FACTORY'
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
