<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;position:relative;">
    <div
      style="position:absolute;left:0,top:0;transform:translate(calc(50% - 35px),calc(38% - 35px));height:100%;width:100%;"
    >
      <span class="iconfont huoche" style="font-size:70px;color:rgb(31,171,233)" v-show="type=='D'"></span>
      <span class="iconfont huoche1" style="font-size:70px;color:rgb(31,171,233)" v-show="type=='P'"></span>
    </div>
    <div ref="chart" style="width:100%;height:80%"></div>
    <div style="width:100%;height:20%;display:flex;justify-content:center">
      <div style="width:100%;font-weight:bold;padding-left:28%;">
        <div style="display:flex;align-items:center;white-space:nowrap">
          <div style="width:10px;height:10px;background:rgb(249,161,147);margin-right:10px;"></div>
          收入：{{income}}
        </div>
        <div style="display:flex;align-items:center;white-space:nowrap">
          <div style="width:10px;height:10px;background:rgb(31,171,232);margin-right:10px;"></div>
          发送：{{send}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "echarts/lib/chart/pie";

export default {
  data() {
    return {}
  },
  props: {
    dataList: { type: Array, default: () => { return [[], []] } },
    colorList: { type: Array, default: () => { return [] } },
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
          text: "发送方向",
          textStyle: { color: '#fff', fontWeight: 'bold' },
          x: 'center',
          y: 'top',
        },
        color: this.colorList,
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor:"transparent",
          className:'tooltipBGColor',
          borderWidth:0,
          textStyle:{
            color:'#fff',
          }
        },
        series: [
          {
            name: "收入",
            center: ["50%", "50%"],
            type: 'pie',
            radius: ['55%', '65%'],
            label: {
              show: false,
              position: 'inner',
              formatter: function (param) {
                return param.name;
              },
            },
            labelLine: {
              show: false,

            },
            data: this.dataList[0],
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgb(2,12,71)',
              borderWidth: 5
            },
          },
          {
            name: "发送",
            center: ["50%", "50%"],
            type: 'pie',
            radius: ['70%', '80%'],
            label: {
              show: false,
              position: 'inner',

            },
            labelLine: {
              show: false,

            },
            data: this.dataList[1],
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgb(2,12,71)',
              borderWidth: 5,
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
    income() {
      var rs = 0;
      this.dataList[0].forEach(v => {
        rs += parseInt(v.value);
      })
      return rs;
    },
    send() {
      var rs = 0;
      this.dataList[1].forEach(v => {
        rs += parseInt(v.value);
      })
      return rs;
    },
  },
  // 组件
  components: {},
}
</script>

<style>
</style>
