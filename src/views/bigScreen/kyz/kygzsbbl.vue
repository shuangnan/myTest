<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div id="ylqs" ref="chart" style="width:100%;height:100%">
    <kygzsbblPie :dataList="dataList"></kygzsbblPie>
  </div>
</template>

<script>
import kygzsbblPie from "./kygzsbblPie";
export default {
  data() {
    return {
      colorList: ["rgb(31,171,232)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)", "rgb(0,255,255)",
        "rgb(247,161,148)", "rgb(172,80,67)", "rgb(109,35,24)", "rgb(74,29,23)", "rgb(248,204,201)"],
      dataList: [
        { name: "安检系统", value: "120" }, { name: "客票系统", value: "80" }, { name: "旅服系统", value: "67" },
        { name: "电梯系统", value: "23" }, { name: "暖通系统", value: "86" }, { name: "上水设施", value: "45" },
        { name: "机电系统", value: "102" }, { name: "保洁设备", value: "89" }, { name: "站台客运设施", value: "56" },
        { name: "其他设备设置", value: "54" }, { name: "巡视系统", value: "38" }, { name: "行包设备", value: "62" },
        { name: "吸污设施", value: "43" }, 
      ],
    }
  },
  props: {},
  // 组件挂载完毕
  mounted() {
  },
  created() {

  },
  // 方法
  methods: {
    
  },
  // 监视属性
  watch: {
  },
  // 计算属性
  computed: {},
  // 组件
  components: {
    kygzsbblPie
  },
}
</script>

<style scoped>
</style>
