<template>
  <div :style="popperContainerStyle">
    <div style="width: 100%; height: 60%; display: flex; flex-direction: row; align-items: center; align-content: center; justify-content: center">
      <div style="width: 50%; height: 60%; display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: flex-start">
        <div>
          <span style="color: #00F6FF; text-shadow: 0 0 7px #00F6FF; font-size: 30px; font-weight: bold">{{ content.levelstr }}</span>
        </div>
        <div>
          <span style="color: #00F6FF; font-size: 20px; font-weight: bold">{{ content.xianming }}线 {{ content.zhanming }} ({{ content.gonglibiao }})</span>
        </div>
      </div>
      <div style="width: 50%; height: 60%; display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: flex-start">
        <div>
          <span style="color: white; font-size: 30px; font-weight: bold">{{ content.fssj }}</span>
        </div>
        <div>
          <span style="color: #25AEEA; font-size: 20px; font-weight: bold">{{ content.gzlxstr }}</span>
        </div>
      </div>
    </div>
    <div style="width: 100%">
      <span style="color: white; font-size: 16px">{{ content.shijianBaogao }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "emergencyPopper",
  props: ['popper-data'],
  data() {
    return {
      popperContainerStyle: {
        height: '400px',
        width: '600px',
        background: '#102050',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        padding: '10px'
      },
      content: {}
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
    initData () {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取信息', popperStr )
      let popper = JSON.parse( popperStr )
      this.content = popper
    }
  }
}
</script>

<style scoped>

</style>
