<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div ref="chart" style="width:100%;height:100%"></div>
</template>

<script>
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line';
import "echarts/lib/chart/scatter";
var colorList=["rgb(31,171,232)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)", "rgb(0,255,255)",
        "rgb(247,161,148)", "rgb(172,80,67)", "rgb(109,35,24)", "rgb(74,29,23)", "rgb(248,204,201)"];
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
      let option = {
        title: {},
        tooltip: {
          trigger: 'axis',
          backgroundColor:"transparent",
          className:'tooltipBGColor_ALL',
          borderWidth:0,
          textStyle:{
            color:'#fff',
          },
          formatter:function(params){
            var items=[];
            params.forEach(v=>{
              items.push(`<div>${v.marker} ${v.seriesName}<div>${v.value}</div></div>`);
            })
            var rs=`<div style='width:100%;height:100%;'>
              <div>${params[0].axisValueLabel}</div>
              ${items.join("")}
            </div>`;
            return rs;
          },
          position:function(point,params,dom,rect,size){
            return [point[0]-1,point[1]];
          },
        },
        color: colorList,
        grid: {
          left: '3%',
          right: '3%',
          bottom: 10,
          top: '16%',
          containLabel: true
        },
        yAxis: {
          type: "value",
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
            name: "收入",
            type: 'line',
            data: yData1,
            itemStyle: {
              barBorderRadius: 2,
            },
            smooth:true,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 1, color: '#42baf215' }, { offset: 0, color: '#42baf28f' }])
            },
          }
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
