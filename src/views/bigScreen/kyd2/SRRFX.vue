<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div id="ylqs" ref="chart" style="width:100%;height:80%"></div>
</template>

<script>
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import "echarts/lib/chart/scatter";

const colorArr = ["rgb(82,175,242)", "rgb(90,226,206)", "rgb(249,161,147)"];
export default {
  data() {
    return {}
  },
  props: {
    legend: {
      type: Array,
      default: () => { return ['2020', '2021'] }
    },
    dwText: {
      type: String,
      default: "",
    }
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
      let myChart = this.$echarts.init(this.$refs.chart);
      myChart.on("click", (param) => {
        console.log(param)
      })


      let xData = ["3.2", "3.3", '3.4', '3.5', '3.6', '3.7', '3.8','3.9','3.10','3.11','3.12','3.13','3.14','3.15'];
      let yData1 = [120, 310, 1850, 810, 300, 1900, 3500, 3300, 1000, 1800, 100, 500, 20, 3000];
      let yData2 = [120, 310, 1150, 950, 260, 4200, 1950, 3600, 1000, 1800, 90, 1000, 900, 2700];
      let option = {
        title: {},
        tooltip: {
          trigger: 'axis',
          backgroundColor: "transparent",
          className: 'tooltipBGColor_ALL',
          borderWidth: 0,
          textStyle: {
            color: '#fff',
          },
          formatter: function (params) {
            var items = [];
            params.forEach(v => {
              items.push(`<div style='font-size:8px;'>${v.marker} ${v.seriesName}：${v.value}</div>`);
            })
            var rs = `<div style='width:100%;height:110%;'>
              <div>${params[0].axisValueLabel}</div>
              ${items.join("")}
            </div>`;
            return rs;
          },
          position: function (point, params, dom, rect, size) {
            return [point[0] - 1, point[1]];
          },
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: 10,
          top: '16%',
          containLabel: true
        },
        // legend: {
        //   data: this.legend,
        //   textStyle: {
        //     fontSize: 10,
        //     color: "#ffffff",
        //   },
        //   right: 25,
        //   top: 5,
        //   itemHeight: 12,
        // },
        yAxis: {
          type: 'value',
          name: this.dwText,
          nameGap: 10,
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 14,
            align: 'right',
          },
          axisLine: {
            lineStyle: {
              color: "#4d5ec5",
            },
            onZero: false,
          },
          splitNumber: 3,
          axisLabel: {
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 700,
          },
          splitLine: {
            lineStyle: {
              color: "#4d5ec5",
            }
          },
        },
        xAxis: {
          type: 'category',
          data: xData,

          axisLine: {
            show: true,
            lineStyle: {
              color: '#3e55bb',
              fontSize: 12
            }
          },
          axisTick: {
            show: true,
            inside: true,
          },
          axisLabel: {
            // color: "#ffffff",
            color: "transparent",
            fontSize: 12,
            interval: 0,
          },
          splitLine: {
            lineStyle: {
              color: "#4d5ec5",
            }
          },
        },
        series: [
          {
            name: this.legend[0],
            type: 'line',
            yAxisIndex: 0,
            data: yData1,
            itemStyle: {
              color: colorArr[1],
              barBorderRadius: 2,
            },
            smooth: true,
          },
          {
            name: this.legend[1],
            type: 'line',
            yAxisIndex: 0,
            data: yData2,
            smooth: false,
            itemStyle: {
              color: colorArr[0],
              barBorderRadius: 2,
            },

          },
        ],
      };

      myChart.setOption(option);
      window.tools.loopShowTooltip(myChart, option, { loopSeries: true })
    },
  },
  // 监视属性
  watch: {
  },
  // 计算属性
  computed: {},
  // 组件
  components: {},
}
</script>

<style scoped>
</style>
