<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div style="height: 65px; width: 100%; padding: 10px; display: flex; flex-direction: row">
      <div :style="dw_4g"></div>
      <div style="height: 100%; width: calc(100% - 65px); display: flex; flex-direction: column; align-items: center; justify-content: center">
        <span style="font-size: 16px; font-weight: bold">4G应急通信设备</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.DEPOT }}</span>
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
import dw4gPopperStyles from "./dw4gPopperStyles.js";
export default {
  name: "dw4gPopper",
  props: ['type', 'popper-data'],
  data () {
    return {
      content: {},
      ...dw4gPopperStyles,
      descDic: [
        {
          text: '线名',
          key: 'LINE_NAME'
        },
        {
          text: '线路等级',
          key: 'LINE_LEVEL'
        },
        {
          text: '车间',
          key: 'WORKSHOP'
        },
        {
          text: '工区',
          key: 'WORKAREA'
        },
        {
          text: '临近车站',
          key: 'STN_NAME'
        },
        {
          text: '编号',
          key: 'NUM'
        },
        {
          text: '设备状况',
          key: 'STATUS'
        },
        {
          text: '故障原因及送修情况',
          key: 'BROKE'
        },
        {
          text: '管理人员联系电话',
          key: 'CONTACT'
        },
        {
          text: '备注',
          key: 'NOTE'
        }
      ]
    }
  },
  methods: {
    initData () {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取4G设备信息', popperStr )
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
