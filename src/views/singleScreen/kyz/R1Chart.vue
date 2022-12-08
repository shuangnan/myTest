<!-- 
 * @created：	2020年8月11日
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
  <div ref="myChart" @click="myChartClick()" style="height:100%;width:100%"></div>
</template>

<script>
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import "echarts/lib/chart/line";
import "echarts/lib/chart/scatter";
import ecStat from 'echarts-stat';
const colorArr = ["#5d95b8", "rgb(195,53,49)", "#69b876"];
let myChartBottom = "30px";
export default {
  data() {
    return {
      myChart: null,
    }
  },
  props: {
    chartData: {
      type: Array,
      default: function () {
        return [
          [],
          [],
          [],
          [],
        ];
      }
    }
  },
  // 组件挂载完毕
  mounted() {
    var myChartH = this.$refs.myChart.offsetHeight;
    if (myChartH > 160) {
	  myChartBottom = "40px";
    }
    this.initChar();
  },
  // 方法
  methods: {
    /**-------------------------响应事件-------------------------------*/
    /**-------------------------数据展示-------------------------------*/
    initChar() {
      const dataList = this.chartData;
      this.myChart = this.$echarts.init(this.$refs.myChart);
      this.myChart.resize();
      let option = {
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
              items.push(`<div style='font-size:8px;margin-top:-2px;'>${v.marker} ${v.seriesName}：${v.value}</div>`);
            })
            var rs =
              `<div style='width:100%;height:110%;margin-top:-8px'>
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
          top: "45px",
          left: "50px",
          right: "40px",
          bottom: myChartBottom,
          // containLabel: true
        },
        legend: {
          data: ['进站', "出站", "到达", "出发"],
          textStyle: {
            color: "#aaa"
          },
          top: "10px"
        },
        xAxis: {
          name: "时间",
          type: "category",
          data: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24'],
          // data: dataList[0],
          nameTextStyle: {
            color: '#aaa'
          },
          axisLine: {
            lineStyle: {
              color: '#3e55bb'
            }
          },
          axisTick: {
            inside: true
          },
        },
        yAxis: [{
          name: "人数",
          type: 'value',
          // interval: 20000,
          scale: true, //根据数据自动调整Y轴刻度
          splitLine: {
            lineStyle: {
              color: '#3e55bb'
            }
          }
        },
        {
          name: "车数",
          type: 'value',
          scale: true,
          // interval: 200,
          splitLine: {
            lineStyle: {
              color: '#3e55bb'
            }
          }
        },
        ],
        series: [{
          name: '进站',
          type: 'line',
          smooth: true,
          // data: [12000, 16000, 14000, 16000, 11000, 13000, 14000, 13000, 14000, 16000],
          data: dataList[0],
          symbolSize: 0,
          showSymbol: false, //是否显示节点
          itemStyle: {
            color: '#ffff7f',
            barBorderRadius: 2,
          },
          // areaStyle: {
          // 	color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          // 		offset: 1,
          // 		color: '#42baf215'
          // 	}, {
          // 		offset: 0,
          // 		color: '#42baf28f'
          // 	}])
          // },
        }, {
          name: '出站',
          type: 'line',
          smooth: true,
          // data: [14000, 12000, 11000, 16000, 13000, 16000, 12000, 10000, 12000, 13000],
          data: dataList[1],
          symbolSize: 0,
          showSymbol: false,
          itemStyle: {
            color: '#f89f93',
            barBorderRadius: 2,
          },
          // areaStyle: {
          // 	color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          // 		offset: 1,
          // 		color: '#f89f9315'
          // 	}, {
          // 		offset: 0,
          // 		color: '#f89f938f'
          // 	}])
          // },
        }, {
          name: '到达',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          // data: [3, 6, 4, 6, 2, 3, 4, 3, 5, 7],
          data: dataList[2],
          symbolSize: 0,
          showSymbol: false,
          itemStyle: {
            color: '#55aaff',
            barBorderRadius: 2,
          },
          // areaStyle: {
          // 	color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          // 		offset: 1,
          // 		color: '#f89f9315'
          // 	}, {
          // 		offset: 0,
          // 		color: '#f89f938f'
          // 	}])
          // },
        }, {
          name: '出发',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          // data: [5, 8, 6, 7, 5, 7, 8, 5, 6, 9],
          data: dataList[3],
          symbolSize: 0,
          showSymbol: false,
          itemStyle: {
            color: '#00aa00',
            barBorderRadius: 2,
          },
          // areaStyle: {
          // 	color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          // 		offset: 1,
          // 		color: '#f89f9315'
          // 	}, {
          // 		offset: 0,
          // 		color: '#f89f938f'
          // 	}])
          // },
        }],
        textStyle: {
          color: '#eee'
        },
      };
      this.myChart.setOption(option);
      // window.tools.loopShowTooltip(this.myChart, option, {
      // 	loopSeries: true
      // })
      // setInterval(() => {
      // 	let newOpt = this.myChart.getOption();
      // 	newOpt.legend[0].selected["进站"] = false;
      // 	newOpt.legend[0].selected["到达"] = false;
      // 	newOpt.legend[0].selected["出站"] = false;
      // 	newOpt.legend[0].selected["出发"] = false;
      // 	this.myChart.setOption(newOpt);
      // 	newOpt.legend[0].selected["进站"] = true;
      // 	newOpt.legend[0].selected["到达"] = true;
      // 	newOpt.legend[0].selected["出站"] = true;
      // 	newOpt.legend[0].selected["出发"] = true;
      // 	this.myChart.setOption(newOpt);
      // }, 5000);
    },
    myChartClick() { }
    /**-------------------------获取数据-------------------------------*/
  },
  // 监视属性
  watch: {
    "chartData": function () {
      this.initChar();
    },
  },
  // 计算属性
  computed: {},
  // 组件
  components: {}
};
</script>

<style scoped>
>>> .tooltipBGColor_kyd2 {
  height: calc(84% - 30px);
  width: 80px;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(62, 130, 196, 0.9),
    rgba(62, 130, 196, 0.4) 30%,
    rgba(62, 130, 196, 0)
  );
  top: 30px !important;
  font-size: 10px !important;
  border-left: 2px solid #bbeee7 !important;
  display: none;
}

.gradientRight_chart {
  border-left: 3px solid #5d95b8 !important;
  background-image: linear-gradient(to right, #5d95b8b3, #5b5e5fb3);
  padding: 5px;
}
</style>
