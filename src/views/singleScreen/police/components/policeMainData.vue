<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-21 16:18:58
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-16 12:07:52
 * @FilePath: \JFLCMS_MAP\src\views\singleScreen\police\components\policeMainData.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div style="height:180px;border:1px solid #bdc5cc;background-color:rgba(255,255,255);">
      <!-- 主要数据 -->
      <div class="mainTop">
        <div style="float: left">
          <span
            style="margin-left:15px;font-size:16px;weight:bold;vertical-align:top;color:cornflowerblue;"
          >主要数据</span>
        </div>
        <div style="float: right">
          <el-select size="mini" v-model="timeValue1" style="width: 130px;">
            <el-option
              v-for="item in timeList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div
        style="margin-top:40px;margin-left:30px;margin-right:30px;height: 40px;display: flex;justify-content: space-between;align-items: center;padding: 0 10px;"
      >
        <div v-for="item in dataTypeDetail" :key="item.value">
          <div style="color:black">{{item.text}}</div>
          <div style="text-align:center;font-size:60px;weight:bold; color:black">{{item.num}}</div>
        </div>
      </div>

      <!-- 数据趋势 -->
      <div
        style="height:250px;border:1px solid #bdc5cc;margin-top:70px;background-color:rgba(255,255,255);"
      >
        <div class="mainTop">
          <div style="float: left">
            <span style="margin-left:15px;font-size:16px;weight:bold;color:cornflowerblue">数据趋势</span>
          </div>
          <div style="float: right">
            <el-select size="mini" v-model="timeValue2" style="width: 130px;">
              <el-option
                v-for="item in timeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <!-- 类型选择列表 -->
        <div style="margin-left:15px margin-top:10px; display:flex">
          <div style="margin-left:35px;width:150px;">
            <div
              class="menuLeftItem"
              @click="clickType(item)"
              v-for="item in dataTypeDetail"
              :key="item.value"
              :label="item.text"
              :class="{'menuLeftItemSelect':item.value==typeValue}"
            >
              <div
                style="padding-left:10px;width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
              >{{item.text}}</div>
            </div>
          </div>

          <div style="width:400px; height:200px">
            <!-- <initEchart ref="chart_line_one"></initEchart> -->
            <div id="chart_line_one" style="width:100%; height:100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import C from "../../../../assets/com.js";

import * as echarts from "echarts/lib/echarts";
import initEChart from "./initEChart.vue";

// Vue.prototype.$echarts = echarts;
export default {
  data() {
    return {
      timeList: [
        { value: "0", text: "昨日" },
        { value: "1", text: "本周" },
        { value: "2", text: "本月" },
        { value: "3", text: "本季度" },
        { value: "4", text: "本年" }
      ],
      timeValue1: "",
      timeValue2: "",
      typeValue: "",
      // 里面将包含主要数据和数据趋势的内容
      dataTypeDetail: [
        { value: "1", text: "接处警数", trend: [], num: "" },
        { value: "2", text: "治安案件", trend: [], num: "" },
        { value: "3", text: "治安罚款", trend: [], num: "" },
        { value: "4", text: "治安拘留", trend: [], num: "" },
        { value: "5", text: "刑事案件", trend: [], num: "" }
      ],
      // 主要数据列表
      mainData: [],
      // 某一类的数据趋势列表
      dataTrend: {}
      // 具体要显示的数据趋势列表
    };
  },

  props: {
    source: {
      type: Object,
      default: () => {
        return {};
      }
    }
    // viewType: {//1 查看，2 新增，3 修改
    //     type: String,
    //     default: "1",
    // },
    // editType: {//1,2,3 不同类型显示属性不一样
    //     type: String,
    //     default: "1",
    // }
  },

  components: {
    initEChart
  },

  created() {
    let that = this;
    C.getData(
      {
        c: "trdm_ga_007",
        s: [this.source.code]
      },
      r => {
        if (r && r[0]) {
          console.log("派出所主要数据 :", r);
          this.mainData = r;
          // 初始化昨日
          let data = r[0];
          this.timeValue1 = "0";
          this.dataTypeDetail.forEach(item => {
            item.num = data[item.value];
          });
        } else {
        }
      }
    );

    C.getData(
      {
        c: "trdm_ga_008",
        s: [this.source.code]
      },
      r => {
        if (r && r[0]) {
          console.log("派出所数据趋势 :", r);
          // 对应value组成数据
          // 第一个是接处警数，以此类推5个
          let len = r.length;
          for (let i = 0; i < len; i++) {
            this.dataTypeDetail[i].trend = r[i];
          }
          console.log("加上数据趋势，this.dataTypeDetail", this.dataTypeDetail);

          // this.dataTrend = r;
          // 初始化接处警数的数据趋势
          this.typeValue = "1"; // 默认为接处警数
          // 接警处数的所有数据趋势
          console.log("this.typeValue", this.typeValue);
          // filter里面的this指向undefined
          this.dataTrend = this.dataTypeDetail.filter(function(item) {
            return item.value === that.typeValue;
          })[0].trend;
          console.log("this.dataTrend", this.dataTrend);
          this.timeValue2 = "0"; // 默认选择昨日
          let data = this.dataTrend;
          this.playCharts("1", "昨日", data[Number(this.timeValue2)][0].CT);
          // this.playCharts();
          // this.$refs.chart_line_one.initEChart("", xData, yData);
          // let data = dataTypeAll.trend[Number(this.timeValue2)];
        } else {
        }
      }
    );
  },

  methods: {
    clickType(item) {
      this.typeValue = item.value;
    },

    // echart
    playCharts(name, xData, yData) {
      // playCharts() {
      let myChart = echarts.init(document.getElementById("chart_line_one"));
      // myChart.resize();
      let option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [name],
          bottom: "0%"
        },
        grid: {
          // 调整图标上下左右位置
          top: "10%",
          left: "3%",
          right: "8%",
          bottom: "11%",
          containLabel: true
        },

        xAxis: {
          type: "category",
          boundaryGap: "false",
          data: xData
        },
        yAxis: {
          type: "value",
          minInterval: 1 // 保持为整数
        },
        series: [
          {
            name: name,
            type: "line",
            // stack: "总量",
            data: yData
          }
        ]
      };
      myChart.setOption(option);

      // let myChart = this.$echarts.init(this.$refs.chart_line_one);

      // // 绘制图表
      // myChart.setOption(option, true);
      // window.addEventListener("resize", () => {
      //   myChart.resize();
      // });
    }
  },

  watch: {
    timeValue1() {
      let data = this.mainData[Number(this.timeValue1)];

      this.dataTypeDetail.forEach(item => {
        item.num = data[item.value];
      });
    },
    timeValue2() {
      let data = this.dataTrend;
      let xData = [];
      let yData = [];

      let dataRange = data[Number(this.timeValue2)];

      dataRange.forEach(item => {
        xData.push(item.RANGE);
        yData.push(item.CT);
      });

      console.log("@@@@@@横坐标和纵坐标：", xData, yData);
      this.playCharts(" ", xData, yData);
      // this.playCharts();
      // this.$refs.chart_line_one.initEChart("", xData, yData);
    },
    typeValue() {
      let that = this;
      // filter里面的this指向undefined
      this.dataTrend = this.dataTypeDetail.filter(function(item) {
        return item.value === that.typeValue;
      })[0].trend;
      // this.timeValue2选择时间类型
      let data = this.dataTrend;

      let xData = [];
      let yData = [];

      let dataRange = data[Number(this.timeValue2)];

      dataRange.forEach(item => {
        xData.push(item.RANGE);
        yData.push(item.CT);
      });

      console.log("@@@@@@横坐标和纵坐标：", xData, yData);
      this.playCharts(" ", xData, yData);
      // this.playCharts();
      // this.$refs.chart_line_one.initEChart("", xData, yData);
    }
  },

  mounted() {
    // this.playCharts();
  }
};
</script>

<style scoped="scoped">
.mainTop {
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}
.mainTop > div {
  display: flex;
  align-items: center;
}
.menuLeftItem {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  /* background: rgba(238, 238, 238, 0.637); */
  color: darkslategray;
  margin-top: 10px;
  /* border-radius: 5px; */
  font-size: 16px;
}
.menuLeftItem:hover {
  background: #d7e9fa;
  color: #555;
}
.menuLeftItemSelect {
  /* background: #8fc9ff; */
  color: black;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
}

>>> .el-select .el-input__inner {
  color: cornflowerblue;
}

/* .span {
  color: cornflowerblue;
  font-weight: bold;
} */
</style>
