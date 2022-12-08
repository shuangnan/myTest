<!--
	保洁支出分析
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
    <div class="main" style="width:100%;height:100%;padding-right:15px;padding-bottom:0px;">
        <div ref="chartKR23" style="width:100%;height:calc(100% - 40px)"></div>
        <div style="height:40px;width:100%;" class="KRTitle">{{dataType=='0'?'保洁支出分析':'服务耗材消耗分析'}}</div>
    </div>
</template>

<script>
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import "echarts/lib/chart/scatter";

const colorArr = ["rgb(82,175,242)", "rgb(90,226,206)", "rgb(249,161,147)"];
export default {
    data() {
        return {
            loop: null,
            myChart: null,
        }
    },
    props: {
        legend: {
            type: Array,
            default: () => { return ['2020', '2021'] }
        },
        dwText: {
            type: String,
            default: "",
        },
        xData: {
            type: Array,
            default: () => { return [] }
        },
        yDataList: {
            type: Array,
            default: () => { return [] }
        },
        dataType: {
            type: String,
            default: "",
        }
    },
    // 组件挂载完毕
    mounted() {
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
            this.myChart = this.$echarts.init(this.$refs.chartKR23);
            this.myChart.resize();
            this.myChart.on("click", (param) => {
                console.log(param)
            })
            let seriesList = [];
            this.yDataList.forEach(v => {
                seriesList.push({
                    name: v[0],
                    type: 'line',
                    data: v[1],
                    itemStyle: {
                        barBorderRadius: 2,
                    },
                    smooth: true,
                })
            });
            var className="tooltipBGColor_ALL";
            if(seriesList.length===0){
                className="";
            }
            let option = {
                title: {},
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: "transparent",
                    className: className,
                    borderWidth: 0,
                    textStyle: {
                        color: '#fff',
                    },
                    formatter: function (params) {
                        var items = [];
                        params.forEach((v, i) => {
                            if (i < 6) {
                                items.push(`<div style='font-size:8px;'>${v.marker} ${v.seriesName}：${parseInt(v.value)}元</div>`);
                            }

                        })
                        var rs = `<div style='width:100%;height:110%;'>
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
                    left: '3%',
                    right: '3%',
                    bottom: 0,
                    top: '16%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    name: this.dwText,
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
                },
                xAxis: {
                    type: 'category',
                    data: this.xData,

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
                        // color: "#ffffff",
                        color: "transparent",
                        fontSize: 12,
                        interval: 0,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#4d5ec5",
                        }
                    },
                },
                series: seriesList,
            };
            this.myChart.setOption(option);
            this.loop = window.tools.loopShowTooltip(this.myChart, option, { loopSeries: true });

        },
    },
    // 监视属性
    watch: {
        "yDataList": function () {
        }
    },
    // 计算属性
    computed: {},
    // 组件
    components: {},
}
</script>

<style scoped>
>>> .tooltipBGColor_ALL {
    height: calc(84% - 20px);
    width: 180px;
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
.KRTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #bad9de;
    font-weight: bold;
}
</style>
