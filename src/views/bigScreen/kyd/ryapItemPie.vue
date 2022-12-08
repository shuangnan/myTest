<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;position:relative;">
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

        color: colorList,
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor:"transparent",
          borderWidth:0,
          className:'tooltipBGColor',
          textStyle:{
            color:'#fff',
          }
        },
        series: [
          {
            name: "人员安排",
            center: ["50%", "50%"],
            type: 'pie',
            radius: ["20%", "80%"],
            labelLine: {
              lineStyle: {
                color: '#bbb',
              },
              length: 0,
              // length2: 50,
            },
            data: this.dataList,
            roseType: 'radius',
            label: {
              alignTo: 'edge',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              formatter: '{b|{b}}\n {c|{c}}  {per|{d}%}  ',
              rich: {
                b: {
                  color: '#eee',
                  align: 'center',
                  fontSize: 10,
                },
                c: {
                  color: '#eee',
                  fontSize: 10,
                  align: 'left'
                },
                per: {
                  color: '#eee',
                  align: 'right',
                  fontSize: 10,
                }
              },
            },
            labelLayout: function (params) {
                var isLeft = params.labelRect.x < myChart.getWidth() / 2;
                var points = params.labelLinePoints;
                // Update the end point.
                points[2][0] = isLeft
                    ? params.labelRect.x
                    : params.labelRect.x + params.labelRect.width;

                return {
                    labelLinePoints: points
                };
            },
          }
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
