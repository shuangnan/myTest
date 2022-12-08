<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div style="height: 96px; width: 100%; padding: 10px; display: flex; flex-direction: row">
      <div :style="ky_sb_yjsscs"></div>
      <div style="height: 100%; width: calc(100% - 96px); display: flex; flex-direction: column; align-items: center; justify-content: center">
        <span style="font-size: 16px; font-weight: bold">应急疏散场所</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.STATION_NAME }}</span>
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
import kySbYjsscsPopperStyles from "./kySbYjsscsPopperStyles";
export default {
  name: "kySbYjsscsPopper",
  props: ['type', 'popper-data'],
  data () {
    return {
      content: {},
      ...kySbYjsscsPopperStyles,
      descDic: [
        {
          key: 'YJD',
          text: '应急灯'
        },
        {
          key: 'YJSSCS',
          text: '应急疏散场所名称'
        },
        {
          key: 'SSCSMJ',
          text: '疏散场所面积'
        },
        {
          key: 'SSCSNL',
          text: '疏散场所候车能力'
        },
        {
          key: 'SSCSLXR',
          text: '疏散场所联系人'
        },
        {
          key: 'SSCSLXFS',
          text: '疏散场所联系人联系方式'
        },
        {
          key: 'SSJTFS',
          text: '疏散交通方式'
        }
      ]
    }
  },
  methods: {
    initData () {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取应急疏散场所信息', popperStr )
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
