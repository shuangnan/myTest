<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;position:relative;">
    <div
      style="position:absolute;left:0,top:0;transform:translate(calc(50% - 35px),calc(48% - 35px));height:100%;width:100%;"
    >
      <span class="iconfont huoche" style="font-size:70px;color:rgb(31,171,233)" v-show="type=='D'"></span>
      <span
        class="iconfont huoche1"
        style="font-size:70px;color:rgb(31,171,233)"
        v-show="type=='P'"
      ></span>
    </div>
    <div ref="chart" style="width:100%;height:100%"></div>
  </div>
</template>

<script>
import "echarts/lib/chart/pie";
var colorList = ["rgb(31,171,232)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)", "rgb(0,255,255)",
  "rgb(247,161,148)", "rgb(172,80,67)", "rgb(109,35,24)", "rgb(74,29,23)", "rgb(248,204,201)"];
export default {
  data() {
    return {}
  },
  props: {
    dataList: { type: Array, default: () => { return [] } },
    type: { type: String, default: "D" },
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
    initCharts() {
      let myChart = this.$echarts.init(this.$refs.chart);
      myChart.on("click", (param) => {
        console.log(param)
      })
      let option = {
        title: {
          text: "出库统计",
          textStyle: { color: '#fff', fontWeight: 'bold' },
          x: 'center',
          y: 'top',
        },
        color: colorList,
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: "transparent",
          borderWidth:0,
          className: 'tooltipBGColor',
          textStyle: {
            color: '#fff',
          }

        },
        series: [
          {
            name: "出库统计",
            center: ["50%", "50%"],
            type: 'pie',
            radius: ['55%', '80%'],
            label: {
              show: true,
              position: 'inner',
              formatter: function (param) {
                return param.name;
              },
              color: "#fff",
            },
            labelLine: {
              show: false,

            },
            data: this.dataList,
            itemStyle: {
              normal: {
                shadowBlur: '11',
                shadowColor: '#73bbf1',
              }
            },
          },
        ]
      };
      myChart.setOption(option);
    },
  },
  // 监视属性
  watch: {
  },
  // 计算属性
  computed: {

  },
  // 组件
  components: {},
}
</script>

<style>
</style>
