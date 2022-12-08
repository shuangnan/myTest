<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;display:flex">
    <div style="width:100%;height:100%;padding:16px 32px;display:flex;justify-content:center;">
      <CountNum title="今日经营收入统计" :dataList="wzDataList"></CountNum>
    </div>
    <!-- <div style="width:25%;height:100%">
      <div style="width:100%;height:34%;display:flex;padding-left:0 5%;algin-items:center;font-size:12px;">
          <div>
              <div>今日经营收入统计</div>
              <div style="color:#609eee"></div>
          </div>
      </div>
       <div style="width:100%;height:33%;display:flex;padding-left:0 5%;algin-items:center">
          <div>
              <div>动车</div>
              <div style="color:#609eee;display:flex;justify-content:space-between">
                  <div></div>
                  <div></div>
              </div>
          </div>
      </div>
       <div style="width:100%;height:33%;display:flex;padding-left:0 5%;algin-items:center">
          <div>
              <div>普速</div>
              <div style="color:#609eee;display:flex;justify-content:space-between">
                  <div></div>
                  <div></div>
              </div>
          </div>
      </div>
    </div> -->
  </div>
</template>

<script>

import CountNum from "./CountNum"; //
import JrwzcktjPie from "./jrwzcktjPie";
export default {
  data() {
    return {
      wzDataList: [
        { name: "动车商品收入", value: "2000" },
        { name: "餐车商品收入", value: "1500" },
        { name: "动车餐营收入", value: "1500" },
        { name: "列车堵漏补票", value: "3000" },
      ],
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
