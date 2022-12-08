<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div style="height: 85.3px; width: 100%; padding: 10px; display: flex; flex-direction: row">
      <div :style="gw_llxc"></div>
      <div
        style="height: 100%; width: calc(100% - 85.3px); display: flex; flex-direction: column; align-items: center; justify-content: center">
        <span style="font-size: 16px; font-weight: bold">巡查两轮小车</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.STATION }}</span>
      </div>
    </div>
    <div style="height: calc(100% - 125px); width: calc(100% - 20px); padding: 10px; border-top: 1px solid gray">
      <div
        style="height: 100%; width: 100%; display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">
        <div
          style="width: calc(100% - 17px); padding-right: 17px; height: 30px; display: flex; flex-direction: row; align-items: center; align-content: center; justify-content: center">
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">线名</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">行别</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">驻点</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">巡查车编号</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">保管维护人</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">巡查起点里程</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">巡查终点里程</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">巡查长度</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">巡查时间</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">巡查方向</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">巡查人</span>
          </div>
          <div style="width: 8.3%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4EABF8">备注</span>
          </div>
        </div>
        <div
          style="width: 100%; height: calc(100% - 20px); overflow-y: scroll; display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: flex-start">
          <div v-for="(c, index) in content.DETAILS" :key="index"
               style="margin-bottom: 5px; width: 100%; display: flex; flex-direction: row; align-items: center; align-content: center; justify-content: center">
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.LINE_NAME }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.LINE_DIRECT }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.STATION }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.CODE }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.MAINTAINER }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.START_MILEAGE }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.END_MILEAGE }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.TOTAL_LENGTH }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.PATROL_TIME }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.PATROL_DIRECT }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.PATROL_DETAIL }}</span>
            </div>
            <div style="width: 8.3%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.NOTE }}</span>
            </div>
          </div>
        </div>
      </div>
      <!--      <div v-for="(desc, index) in descDic" :key="index" style="font-size: 14px; display: flex">-->
      <!--        <div style="width: 50%">{{ desc.text }}: </div>-->
      <!--        <div style="color: #FDA629; width: 50%">{{ content[desc.key] === '' ? '暂无' : content[desc.key] }}</div><br />-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "gwLlxcPopper",
  data() {
    return {
      content: {}
    }
  },
  props: ['popper-data'],
  computed: {
    gw_llxc() {
      return {
        height: '61px',
        width: '85.3px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url('${this.imageLoader('gw_llxc.png')}')`
      }
    }
  },
  methods: {
    initData () {
      let popperStr = this.popperData.replace( /'/g, '"' )
      // console.log( '获取电务备品备料信息', popperStr )
      let popper = JSON.parse( popperStr )
      this.content = popper
      console.log( '获取巡查两轮小车信息', popper )
    },
    imageLoader(imageUrl) {
      let imageBaseUrl = './gwPopperLogos/'
      // console.log(require(imageBaseUrl + imageUrl))
      let img = require(__dirname + '/gwPopperLogos/' + imageUrl)
      // console.log(img)
      return img
      // return require(imageBaseUrl + imageUrl)
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
