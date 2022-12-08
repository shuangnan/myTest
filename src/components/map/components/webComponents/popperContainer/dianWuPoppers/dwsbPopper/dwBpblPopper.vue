<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div style="height: 85.3px; width: 100%; padding: 10px; display: flex; flex-direction: row">
      <div :style="dw_bpbl"></div>
      <div style="height: 100%; width: calc(100% - 85.3px); display: flex; flex-direction: column; align-items: center; justify-content: center">
        <span style="font-size: 16px; font-weight: bold">备品备料</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.STATION }}</span>
      </div>
    </div>
    <div style="height: calc(100% - 125px); width: calc(100% - 20px); padding: 10px; border-top: 1px solid gray">
      <div style="height: 100%; width: 100%; display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">
        <div style="height: 40px; width: 100%; display: flex; flex-direction: row; align-content: center; align-items: center; justify-content: space-around">
          <el-input v-model="searchData" size="mini" placeholder="搜索备品备料信息..."></el-input>
          <el-button @click="jumpToMaintainPage" size="mini" type="primary">维护</el-button>
        </div>
        <div style="width: 100%; height: 30px; display: flex; flex-direction: row; align-items: center; align-content: center; justify-content: center">
          <div style="width: 20%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4eabf8">设备类型</span>
          </div>
          <div style="width: 20%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4eabf8">设备名称</span>
          </div>
          <div style="width: 20%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4eabf8">设备编号</span>
          </div>
          <div style="width: 20%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4eabf8">设备厂家</span>
          </div>
          <div style="width: 20%; display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="font-weight: bold; font-size: 14px; color: #4eabf8">设备数量</span>
          </div>
        </div>
        <div style="width: 100%; height: calc(100% - 60px); overflow-y: scroll; display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: flex-start">
          <div v-for="(c, index) in contentData" :key="index" style="margin-bottom: 5px; width: 100%; display: flex; flex-direction: row; align-items: center; align-content: center; justify-content: center">
            <div style="width: 20%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.DEVICE_TYPE }}</span>
            </div>
            <div style="width: 20%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.EQUIP_NAME }}</span>
            </div>
            <div style="width: 20%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.EQUIP_NUM }}</span>
            </div>
            <div style="width: 20%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.MANUFACTURER }}</span>
            </div>
            <div style="width: 20%; display: flex; align-content: center; align-items: center; justify-content: center">
              <span>{{ c.QUANTITY }}</span>
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
import store from '../../../../../../../store/index'
import dwBpblPopperStyles
  from "@/components/map/components/webComponents/popperContainer/dianWuPoppers/dwsbPopper/dwBpblPopperStyles";
export default {
  name: "dwBpblPopper",
  props: ['type', 'popper-data'],
  data() {
    return {
      content: {},
      ...dwBpblPopperStyles,
      searchData: ''
    }
  },
  computed: {
    contentData() {
      if (this.searchData === '') {
        return this.content.ITEMS
      } else {
        return this.content.ITEMS.filter((i) => {
          return JSON.stringify(i).includes(this.searchData)
        })
      }
    }
  },
  methods: {
    initData () {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取电务备品备料信息', popperStr )
      let popper = JSON.parse( popperStr )
      this.content = popper
    },
    jumpToMaintainPage() {
      window.open(`https://10.192.126.27/hqbz/#/basicDataMaintain/electricity/9-8?` + this.generateUserParams())
    },
    generateUserParams() {
      let userencode = store.state.params.UserEncode;
      let username = store.state.params.UserName;
      let userpid = store.state.params.UserPID;
      let oid = store.state.params.Oid;
      let oname = store.state.params.Oname;
      let depid = store.state.params.DepId;
      let depname = store.state.params.DepName;
      let usermtype = store.state.params.UserMType;
      let olevel = store.state.params.Olevel;
      let deptype = store.state.params.Deptype;
      return `UserEncode=${userencode}&UserName=${username}&UserPID=${userpid}&Oid=${oid}&Oname=${oname}&DepId=${depid}&DepName=${depname}&UserMType=${usermtype}&Olevel=${olevel}&Deptype=${deptype}&`;
    },
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
