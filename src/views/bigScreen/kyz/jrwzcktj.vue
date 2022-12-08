<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;display:flex">
    <div style="width:40%;height:100%;padding:16px;">
      <CountNum title="今日物资出库统计" :dataList="wzDataList"></CountNum>
    </div>
    <div style="width:30%;height:100%">
      <JrwzcktjPie :dataList="dctj" type="D"></JrwzcktjPie>
    </div>
    <div style="width:30%;height:100%">
      <JrwzcktjPie :dataList="pctj" type="P"></JrwzcktjPie>
    </div>
  </div>
</template>

<script>

import CountNum from "./CountNum"; //
import JrwzcktjPie from "./jrwzcktjPie";
export default {
  data() {
    return {
      wzDataList: [
        { name: "动车服务耗材", value: "2000" },
        { name: "餐车服务耗材", value: "1500" },
        { name: "动车商品物质", value: "1500" },
        { name: "餐车商品物质", value: "3000" },
      ],
      dctj: [
        { name: "服务耗材", value: "2000" },
        { name: "商品物质", value: "1500" },
      ],
      pctj: [
        { name: "服务耗材", value: "1500" },
        { name: "商品物质", value: "3000" },
      ]
    }
  },
  props: {

  },
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
  computed: {
    countNum() {
      var rs = 0;
      dataList.forEach(v => {
        rs += parseInt(v.value);
      })
      return rs.split("");
    }
  },
  // 组件
  components: {
    CountNum,
    JrwzcktjPie
  },
}
</script>

<style>
</style>
