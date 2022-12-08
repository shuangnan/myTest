<!--
	营销明细
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
    <div ref="chart" style="width:100%;height:100%"></div>
</template>

<script>
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import "echarts/lib/chart/scatter";

const colorArr = ["#aba43c", "#552ebf", "#f66c44", "#404559", "rgb(91,228,210)", "rgb(82,177,243)"];
export default {
    data() {
        return {
            myChart: null,
            loop: null,
        }
    },
    props: {
        XList: {
            type: Array,
            default: () => { return ["1月", "2月", '3月', '4月', '5月', '6月', '7月', "8月", "9月", '10月', '11月', '12月'] }
        },
        YDataList: {
            type: Array,
            default: () => { return [] }
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
        initCharts() {
            if (this.loop) {
                this.loop.clearLoop();
            }
            if (this.myChart) {
                this.myChart.dispose();
            }
            this.myChart = this.$echarts.init(this.$refs.chart);
            this.myChart.resize();
            this.myChart.on("click", (param) => {
                console.log(param)
            });
            let seriesList = [];
            for(var i=1;i<this.YDataList.length;i++){
                var v=this.YDataList[i];
                var item = {
                    name: v[0],
                    type: 'bar',
                    yAxisIndex: 0,
                    data: v[1],
                    itemStyle: {
                        barBorderRadius: 2,
                        color: v[2],
                    },
                    barMaxWidth: 10,
                    stack: "one",
                };
                if (v[0] == "出乘组数") {
                    item = {
                        name: v[0],
                        type: 'line',
                        yAxisIndex: 1,
                        data: v[1],
                        smooth: false,
                        itemStyle: {
                            barBorderRadius: 2,
                            color: v[2],
                        },
                    }
                }
                seriesList.push(item)
            }
            var className = "tooltipBGColor_ALL";
            if (seriesList.length === 0) {
                className = "";
            }
            let yData1 = [256, 400, 234, 400, 300, 275, 210, 255, 124, 236, 190, 356];
            let yData2 = [321, 256, 326, 211, 260, 200, 210, 126, 128, 236, 110, 156];
            let yData3 = [-120, -200, -240, -30, -50, -180, -236, -189, -125, -120, -175, -23]
            let option = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: "transparent",
                    className: className,
                    borderWidth: 0,
                    textStyle: {
                        color: '#bad9de',
                    },
                    formatter: function (params) {
                        var items = [];
                        params.forEach(v => {
                            items.push(`<div>${v.marker} ${v.seriesName}：${v.value} 元</div>`);
                        })
                        var rs = `<div style='width:100%;height:100%;'>
              <div>${params[0].axisValueLabel}</div>
              ${items.join("")}
            </div>`;
                        return rs;
                    },
                    position: function (point, params, dom, rect, size) {
                        return [point[0] - 1, 0];
                    },
                },
                grid: {
                    left: 10,
                    right: 20,
                    bottom: 0,
                    top: 40,
                    containLabel: true
                },
                legend: {
                    // icon: "circle",
                    textStyle: {
                        fontSize: 12,
                        color: "#aec0f2",
                    },
                    data: [
                        { name: "现金", icon: "circle" },
                        { name: "二维码", icon: "circle" },
                        { name: "川之味", icon: "circle" },
                        { name: "出乘组数" },
                    ]
                },
                yAxis: [{
                    type: 'value',
                    // inverse:true,
                    //						position: 'top',
                    nameTextStyle: {
                        color: "#bad9de",
                        fontSize: 14,
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#17306a",
                        },
                        onZero: false,
                    },

                    axisLabel: {
                        color: "#aec0f2",
                        fontSize: 12,
                        fontWeight: 700,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#17306a",
                        }
                    },
                    splitNumber:3,
                }, {
                    type: "value",
                    nameTextStyle: {
                        color: "#bad9de",
                        fontSize: 14,
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#17306a",
                        },
                        onZero: false,
                    },

                    axisLabel: {
                        color: "#aec0f2",
                        fontSize: 12,
                        fontWeight: 700,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#17306a",
                        }
                    },
                    splitNumber:3,
                }],
                xAxis: {
                    type: 'category',
                    data: this.XList,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#17306a',
                            fontSize: 12
                        }
                    },
                    axisTick: {
                        show: true,
                        inside: true,
                    },
                    axisLabel: {
                        color: "#aec0f2",
                        fontSize: 12,
                        interval: 0,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#17306a",
                        }
                    },
                },
                series:seriesList,
            };

            this.myChart.setOption(option);
            this.loop = window.tools.loopShowTooltip(this.myChart, option, { loopSeries: true })
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
>>> .tooltipBGColor_ALL {
    height: calc(84%);
    width: 120px;
    background-image: repeating-linear-gradient(
        90deg,
        rgba(62, 130, 196, 0.9),
        rgba(62, 130, 196, 0.4) 30%,
        rgba(62, 130, 196, 0)
    );
    top: 20px !important;
    font-size: 10px !important;
    border-left: 2px solid #bbeee7 !important;
    padding-top: 5px !important;
    /* transform:translate3d(0, 0, 0px) !important; */
}
</style>
