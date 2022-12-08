<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div :style="logoContainerStyle">
      <div :style="getLogoStyle()"></div>
      <div :style="titleContainerStyle">
        <span style="font-size: 16px; font-weight: bold">危险货物施救信息网络及应急资源</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.ZD }}</span>
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
  name: "hySbssWxhyshwl",
  props: ['type', 'popper-data'],
  data () {
    return {
      commonStyles: {
        height: '84px',
        width: '85.3px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat'
      },
      logoContainerStyle: {
        height: '84px',
        width: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row'
      },
      titleContainerStyle: {
        height: '100%',
        width: 'calc(100% - 84px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      contentContainerStyle: {
        height: 'calc(100% - 84px)',
        width: 'calc(100% - 20px)',
        padding: '10px',
        borderTop: '1px solid gray',
      },
      descDic: [
        {
          key: 'ZM',
          text: '站名'
        },
        {
          key: 'XZQY',
          text: '行政区域所属'
        },
        {
          key: 'ZYX',
          text: '专用线名称'
        },
        {
          key: 'ZZXM',
          text: '车站站长姓名'
        },
        {
          key: 'ZZLD',
          text: '车站站长路电'
        },
        {
          key: 'ZZSD',
          text: '车站站长市电'
        },
        {
          key: 'ZZSJ',
          text: '车站站长手机号'
        },
        {
          key: 'HYXM',
          text: '货运负责人姓名'
        },
        {
          key: 'HYLD',
          text: '货运负责人路电'
        },
        {
          key: 'HYSD',
          text: '货运负责人市电'
        },
        {
          key: 'HYSJ',
          text: '货运负责人手机号'
        },
        {
          key: 'ZYXXM',
          text: '专用线负责人姓名'
        },
        {
          key: 'ZYXSD',
          text: '专用线负责人市电'
        },
        {
          key: 'ZXYSJ',
          text: '专用线负责人手机号'
        },
        {
          key: 'JYD',
          text: '专业救援队伍'
        },
        {
          key: 'JYDLXDH',
          text: '专业救援队伍联系电话'
        },
        {
          key: 'WXHW',
          text: '办理危险货物品名'
        },
        {
          key: 'AQJC_DEV',
          text: '安全检测设备种类及数量'
        },
        {
          key: 'LDAQFH_DEV',
          text: '劳动安全防护用品种类及数量'
        },
        {
          key: 'TX_DEV',
          text: '通信设备及数量'
        },
        {
          key: 'QT_DEV',
          text: '其他防护用品器材种类和数量'
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
