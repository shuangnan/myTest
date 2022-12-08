<!--
	客运站左上角 收入与发送饼图
-->
<template>
  <div style="width:100%;height:100%;position:relative;">
    <div @click="stnClick" style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:2">
      <div class="stnItemNameXZ">
        <div :class="{'stnItemNameXZContent':xzFlag}"></div>
      </div>
      <div class="stnItemNameImg" :style="{backgroundImage:'url('+url+stnCode+'.jpg)'}"></div>
    </div>
    <div ref="chart" style="width:100%;height:80%;z-index:1"></div>
    <div style="width:100%;height:20%;display:flex;justify-content:center">
      <div style="width:100%;font-weight:bold;padding-left:28%;">
        <div style="display:flex;align-items:center;white-space:nowrap">
          <div style="width:10px;height:10px;background:rgb(249,161,147);margin-right:10px;" :style="{background:srColorList[0]}"></div>
          收入：{{income}}
        </div>
        <div style="display:flex;align-items:center;white-space:nowrap">
          <div style="width:10px;height:10px;background:rgb(31,171,232);margin-right:10px;" :style="{background:fsColorList[0]}"></div>
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
    return {
      myChart: null,
      url: "",
    }
  },
  props: {
    dataList: { type: Array, default: () => { return [[], []] } },
    srColorList: { type: Array, default: () => { return [] } },
    fsColorList: { type: Array, default: () => { return [] } },
    xzFlag: { type: Boolean, default: false },
    stnCode: { type: String, default: '' },
  },
  // 组件挂载完毕
  mounted() {
    this.initCharts();
  },
  created() {
    var urlTop =window.location.href;//正试服
    if (process.env.NODE_ENV == "development") {
      urlTop = "http://10.192.6.175:9090"; //测试服务器
    }
    this.url = urlTop + "/JFLCMS/lc1/image/stn/"
  },
  // 方法
  methods: {
    /**-------------------------响应事件-------------------------------*/
    /**-------------------------数据展示-------------------------------*/
    /**-------------------------获取数据-------------------------------*/
    // 获取数据
    initCharts() {
      let temp=this.dataList;
      if(this.myChart){
        this.myChart.dispose();
      }
      this.myChart = this.$echarts.init(this.$refs.chart);
      this.myChart.resize();
      this.myChart.on("click", (param) => {
        console.log(param)
      });
      let option = {
        title: {
          text: "发送方向",
          textStyle: { color: '#fff', fontWeight: 'bold' },
          x: 'center',
          y: 'top',
        },
        tooltip: {
          trigger: 'item',
          confine:true,
          appendToBody:true,
          formatter: function (params) {
            var rs = "";
            var item = params.data;
            if(item.name){
              rs=`${item.name}: ${item.value} (${params.percent}%)`;
            }
            return rs;
          },
          backgroundColor: "transparent",
          className: 'tooltipBGColor',
          borderWidth: 0,
          textStyle: {
            color: '#fff',
          },
          extraCssText:"background-image: linear-gradient(to right, rgba(62, 130, 196, .9), rgba(62, 130, 196, .4))",
        },
        series: [
          {
            name: "发送",
            center: ["50%", "50%"],
            type: 'pie',
            radius: ['55%', '65%'],
            color:this.fsColorList,
            label: {
              show: false,
              // position: 'inner',
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
            name: "收入",
            center: ["50%", "50%"],
            type: 'pie',
            radius: ['70%', '80%'],
            color:this.srColorList,
            label: {
              show: false,
              // position: 'inner',

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
      this.myChart.setOption(option);
    },
    resizeChart() {
      this.myChart.resize();
    },
    stnClick(){
      this.$emit("stnSelect",this.stnCode);
    }
  },
  // 监视属性
  watch: {
    "dataList":function(){
      // this.initCharts();
    }
  },
  // 计算属性
  computed: {
    income() {
      var rs = 0;
      if(this.dataList[1][0]){
        rs=parseInt(this.dataList[1][0].value);
      }
      return rs;
    },
    send() {
      var rs = 0;
      if(this.dataList[0][0]){
        rs=parseInt(this.dataList[0][0].value);
      }
      return rs;
    },
  },
  // 组件
  components: {},
}
</script>

<style scoped>
.stnItemNameImg {
  width: 70px;
  height: 70px;
  background-size: 100% 100%;
  border-radius: 100%;
  display: inline-block;
  border: 4px solid #0b57a8;
  cursor: pointer;
}
.stnItemNameXZ {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 0;
  animation: lds-hourglass 2.4s infinite linear;
  cursor: pointer;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.stnItemNameXZContent {
  position: absolute;
  left: 2px;
  top: 15px;
  width: 7px;
  height: 6px;
  /* background: #23f9fb; */
  background-image: repeating-radial-gradient(#fff, #fff 20%, transparent 100%);
  border-radius: 100%;
}
</style>
