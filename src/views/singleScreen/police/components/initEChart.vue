<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-23 18:13:17
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-10-24 08:58:34
 * @FilePath: \JFLCMS_MAP\src\views\singleScreen\police\components\initEChart.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="echart-line" :style="{width:'100%', height:'100%'}"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  methods: {
    initEChart(name, xData, yData) {
      let mainContainer = document.getElementById("chart_line_one");
      let resizeMainContainer = function() {
        mainContainer.style.width = 300 + "px";
        mainContainer.style.height = 300 + "px";
      };
      resizeMainContainer();
      let mainChart = echarts.init(mainContainer);
      // $(window).on("resize", function() {
      //   resizeMainContainer();
      //   mainChart.resize();
      // });

      let getchart = echarts.init(document.getElementById("echart-line"));
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
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: name,
            type: "line",
            stack: "总量",
            data: yData
          }
        ]
      };

      getchart.setOption(option);
      // 随屏幕大小调节
      window.addEventListener("resize", () => {
        getchart.resize();
      });
    }
  }
};
</script>