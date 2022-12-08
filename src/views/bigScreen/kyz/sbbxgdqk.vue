<!--
	客运站-设备报修工单情况
-->
<template>
  <div id="ylqs" ref="chart" style="width:100%;height:100%"></div>
</template>

<script>
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/line';

const colorArr = ["rgb(91,228,210)", "rgb(82,177,243)"];
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


      let xData = ["安检", "客票", '旅服', '电梯', '暖通', '上水', '机电'];
      let yData2 = [326,321,260, 256, 211 ,210, 200 ];
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
              items.push(`<div>${v.marker} ${v.seriesName}<div>${v.value}</div></div>`);
            })
            var rs = `<div style='width:100%;height:100%;'>
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
        //   data: ["人数"],
        //   textStyle: {
        //     fontSize: 12,
        //     color: "#ffffff",
        //   },
        // },
        yAxis: {
          type: "value",
          name: "数量",
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 14,
          },
          axisLine: {
            lineStyle: {
              color: "#4d5ec5",
            },
            onZero: false,
          },

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
            name: "数量",
            type: 'bar',
            // yAxisIndex: 1,
            data: yData2,
            smooth: false,
            itemStyle: {
              color: colorArr[1],
              barBorderRadius: 2,
            },
            barMaxWidth: 15,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#fff'
                  }
                },
                color: params => {
                  var colorList = [
                    '#f89f93',//第一名
                    '#2c8cdb',//第二名
                    '#a76431',//其他
                  ];

                  var index = 2;
                  if (params.dataIndex === 0) {//第一名
                    index = 0
                  }
                  if (params.dataIndex ===1) {//第二名
                    index = 1
                  }
                  return colorList[index];
                },
              },
            }
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
