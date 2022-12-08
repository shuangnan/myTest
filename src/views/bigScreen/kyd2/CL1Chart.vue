<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div id="ylqs" ref="chart" style="width:100%;height:100%"></div>
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
      let myChart = this.$echarts.init(this.$refs.chart);
      myChart.on("click", (param) => {
        console.log(param)
      })


      let xData = ["3.2", "3.3", '3.4', '3.5', '3.6', '3.7', '3.8'];
      let yData1 = [256, 400, 234, 400, 300, 275, 210];
      let yData2 = [321, 256, 326, 211, 260, 200, 210];
      let yData3=[200, 356, 260, 211, 280, 270, 230];
      let option = {
        title: {},
        tooltip: {
          trigger: 'axis',
          backgroundColor: "transparent",
          className: 'tooltipBGColor_kyd2',
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
          left: '24%',
          right: '3%',
          bottom: 5,
          top: '50',
          containLabel: true
        },
        legend: {
          data: ["人数","列数", "收入"],
          textStyle: {
            fontSize: 10,
            color: "#ffffff",
          },
          orient: "vertical",
          left: 25,
          bottom: 5,
          itemHeight: 10,
        },
        yAxis: [{
          type: 'value',
          name: "列",
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
        }, {
          type: "value",
          name: "万人",
          //   nameLocation:"start",
          nameGap: 10,
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 14,
            align: "left"
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
        }],
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
            color: "#ffffff",
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
            name: "列数",
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
            name: "收入",
            type: 'bar',
            yAxisIndex: 1,
            data: yData3,
            itemStyle: {
              color: colorArr[2],
              barBorderRadius: 2,
            },
            smooth: true,
            barMaxWidth: 10,
          },
          {
            name: "人数",
            type: 'line',
            yAxisIndex: 1,
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
>>> .tooltipBGColor_kyd2 {
  height: calc(84% - 25px);
  width: 80px;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(62, 130, 196, 0.9),
    rgba(62, 130, 196, 0.4) 30%,
    rgba(62, 130, 196, 0)
  );
  top: 16% !important;
  font-size: 10px !important;
  border-left: 2px solid #bbeee7 !important;
}
</style>
