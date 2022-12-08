<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div :style="logoContainerStyle">
      <div :style="getLogoStyle()"></div>
      <div :style="titleContainerStyle">
        <span style="font-size: 16px; font-weight: bold">路外应急抢险机械</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.DW }}</span>
      </div>
    </div>
    <div :style="contentContainerStyle">
      <div v-for="(desc, index) in descDic" :key="index" style="font-size: 14px; display: flex">
        <div style="width: 50%">{{ desc.text }}</div>
        <div style="color: #FDA629; width: 50%">{{ content[desc.key] === '' ? '暂无' : content[desc.key] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hySbssLwyjqxjx",
  props: ['type', 'popper-data'],
  data () {
    return {
      commonStyles: {
        height: '52.3px',
        width: '85.3px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat'
      },
      logoContainerStyle: {
        height: '52.3px',
        width: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row'
      },
      titleContainerStyle: {
        height: '100%',
        width: 'calc(100% - 52.3px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      contentContainerStyle: {
        height: 'calc(100% - 52.3px)',
        width: 'calc(100% - 20px)',
        padding: '10px',
        borderTop: '1px solid gray',
      },
      descDic: [
        {
          key: 'STATION',
          text: '车站'
        },
        {
          key: 'LOCATION',
          text: '所属行政区域'
        },
        {
          key: 'STATION_PEOPLE',
          text: '车站联系人姓名'
        },
        {
          key: 'STATION_PHONE',
          text: '车站联系人手机号'
        },
        {
          key: 'SOCIAL_DW',
          text: '配合单位'
        },
        {
          key: 'SOCIAL_PEOPLE',
          text: '可配合汽车吊联系人'
        },
        {
          key: 'SOCIAL_PHONE',
          text: '汽车吊联系人手机号'
        },
        {
          key: 'MACHIEN_TYPE',
          text: '汽车吊规格型号'
        },
        {
          key: 'MACHINE_NUM',
          text: '台数'
        },
        {
          key: 'MACHINE_USE',
          text: '起重能力(t)'
        },
        {
          key: 'DISTANCE',
          text: '距联系车站距离(km)'
        }
      ],
      content: {},
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
    getLogoStyle () {
      return {
        ...this.commonStyles,
        backgroundImage: `url('${ this.loadImage( this.type + '.png' ) }')`
      }
    },
    loadImage ( filename ) {
      return require( __dirname + '/huoYunPopperLogos/' + filename )
    },
    initData () {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取信息', popperStr )
      let popper = JSON.parse( popperStr )
      this.content = popper
    },
  }
}
</script>

<style scoped>

</style>
