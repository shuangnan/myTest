<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;padding:0 16px;">
    <div style="width:100%;height:80%;display:flex">
      <div style="width:50%;height:100%;">
        <IncomeAndSendPie :dataList="D_incomeSendData" :colorList="incomeSendDataColorList" type="D"></IncomeAndSendPie>
      </div>
      <div style="width:50%;height:100%;">
        <IncomeAndSendPie :dataList="P_incomeSendData" :colorList="incomeSendDataColorList" type="P"></IncomeAndSendPie>
      </div>
    </div>
    <div style="width:100%;height:20%;background:rgb(30,37,92);display:flex;flex-wrap:wrap;">
      <div
        v-for="item in incomeSendDataColorList"
        :key="item"
        style="display:flex;justify-content:center;align-items:center;width:20%;"
      >
        <div style="width:10px;height:10px;border-radius:10px;margin-right:3px;" :style="{background:item}"></div>XX方向
      </div>
    </div>
  </div>
</template>

<script>
import IncomeAndSendPie from "./IncomeAndSendPie"; //动车普车 收入发送人数
export default {
  data() {
    return {
      D_incomeSendData: [
        //收入
        [{ name: "成都", value: "5262" }, { name: "贵阳", value: "2568" }, { name: "眉山东", value: "2451" }, { name: "重庆北", value: "3254" }],
        //发送人数
        [{ name: "成都", value: "523" }, { name: "贵阳", value: "234" }, { name: "眉山东", value: "278" }, { name: "重庆北", value: "365" }]
      ],
      P_incomeSendData: [
        //收入
        [{ name: "成都", value: "5262" }, { name: "贵阳", value: "2568" }, { name: "眉山东", value: "2451" }, { name: "重庆北", value: "3254" }],
        //发送人数
        [{ name: "成都", value: "523" }, { name: "贵阳", value: "234" }, { name: "眉山东", value: "278" }, { name: "重庆北", value: "365" }]
      ],
      incomeSendDataColorList: ["rgb(31,171,232)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)", "rgb(0,255,255)",
        "rgb(247,161,148)", "rgb(172,80,67)", "rgb(109,35,24)", "rgb(74,29,23)", "rgb(248,204,201)"],
    }
  },
  props: {},
  // 组件挂载完毕
  mounted() {
    this.initCharts();
  },
  created() {

  },
  // 方法
  methods: {
    /**-------------------------响应事件-------------------------------*/
    /**-------------------------数据展示-------------------------------*/
    /**-------------------------获取数据-------------------------------*/
    // 获取数据
    initCharts(data) {

    },
  },
  // 监视属性
  watch: {
  },
  // 计算属性
  computed: {},
  // 组件
  components: {
    IncomeAndSendPie,
  },
}
</script>

<style>
</style>
