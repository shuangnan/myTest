<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;position:relative;">
    <div class="srCir">
      <img v-if="type=='2'" src="./img/canbicon.png" style="width:60%;height:60%;" />
      <img v-if="type=='1'" src="./img/chebicon.png" style="width:60%;height:60%;" />
    </div>
    <div ref="chart" style="width:100%;height:100%;position:absolute;left:0;top:0;"></div>
  </div>
</template>

<script>
import "echarts/lib/chart/pie";

export default {
  data() {
    return {}
  },
  props: {
    dataList: { type: Array, default: () => { return [{ name: "成都", value: "5262" }, { name: "贵阳", value: "2568" }] } },
    colorList: { type: Array, default: () => { return [] } },
    type:{type:String,default:"1"}
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
          show:false,
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: "transparent",
          className: 'tooltipBGColor',
          borderWidth: 0,
          textStyle: {
            color: '#fff',
          }
        },
        series: [
          {
            name: "收入",
            center: ["55%", "50%"],
            type: 'pie',
            radius: ['76%', '82%'],
            hoverAnimation:false,
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
            data: this.dataList,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgb(2,12,71)',
              //   borderColor: 'rgba(38,46,57,0.9)',
              borderWidth: 1,
              normal: {
                shadowBlur: '7',
                // shadowColor: '#73bbf1',
                shadowColor: this.colorList[0],
                // shadowColor: function(seriseIndex,dataIndex,data,value){
                //     debugger;
                //     console.log(seriseIndex,dataIndex,data,value)
                // },
              }
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

<style scoped>
.srCir {
  border: 2px dashed rgb(22, 26, 51);
  /* border: 2px dashed red; */
  width: 60%;
  height: 60%;
  border-radius: 100%;
  position: absolute;
  left: 25%;
  top: 20%;
  display: flex;
  justify-content: center;
  align-items:center;
}
</style>
