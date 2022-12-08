<!--
	保洁支出分析
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
    <div style="width:100%;height:100%;">
        <div style="height:30px;width:100%;display:flex;justify-content:flex-end;padding-right:20px;">
            <div v-for="(item,index) in colorList" :key="index" class="KR25Tool">
                <div :style="{background:item.color}"></div>
                <span>{{item.text}}</span>
            </div>
        </div>
        <div ref="chartKR11" style="width:100%;height:calc(100% - 30px)"></div>
    </div>
</template>

<script>
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
import "echarts/lib/chart/scatter";

const colorArr = ["rgb(82,175,242)", "rgb(90,226,206)", "rgb(249,161,147)"];
export default {
    data() {
        return {
            myChart: null,
            loop: null,
            colorList: [
                { text: "收入", color: "#a45b36" },
            ]
        }
    },
    props: {
        XList: {
            type: Array,
            default: () => { return ["1月", "2月", '3月', '4月', '5月', '6月', '7月', "8月", "9月", '10月', '11月', '12月'] }
        },
        YDataList: {
            type: Array,
            default: () => { return [256, 400, 234, 400, 300, 275, 210, 255, 124, 236, 190, 356] }
        }
    },
    // 组件挂载完毕
    mounted() {
        this.initCharts();
    },
    created() {

    },
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
            this.myChart = this.$echarts.init(this.$refs.chartKR11);
            this.myChart.resize();
            this.myChart.on("click", (param) => {
                console.log(param)
            });
            var className = "tooltipBGColor_ALL";
            let option = {
                title: {
                    text: "库存情况",
                    show: false,
                    textStyle: {
                        color: '#bad9de'
                    }
                },
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
                        return [point[0] - 1,0];
                    },
                },
                grid: {
                    left: 10,
                    right: 20,
                    bottom: 0,
                    top: 10,
                    containLabel: true
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
                        rotate: 10,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#17306a",
                        }
                    },
                },
                series: [
                    {
                        name: "收入",
                        type: 'bar',
                        yAxisIndex: 0,
                        data: this.YDataList,
                        itemStyle: {
                            barBorderRadius: 2,
                            color: params => {
                                var colorList = [
                                    ['#8f5636', '#bd603e'],//第一名
                                ];
                                //参数用于配置渐变色的起止位置，分别 右，下，左，上
                                return new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                    offset: 0,
                                    color: colorList[0][0],
                                }, {
                                    offset: 1,
                                    color: colorList[0][1],
                                }])
                            },
                        },
                        barMaxWidth: 10,
                    }
                ],
            };

            this.myChart.setOption(option);
            this.loop = window.tools.loopShowTooltip(this.myChart, option, { loopSeries: true })
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
    width: 80px;
    background-image: repeating-linear-gradient(
        90deg,
        rgba(62, 130, 196, 0.9),
        rgba(62, 130, 196, 0.4) 30%,
        rgba(62, 130, 196, 0)
    );
    top: 10px !important;
    font-size: 10px !important;
    border-left: 2px solid #bbeee7 !important;
    padding-top: 5px !important;
}
.KRTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #bad9de;
    font-weight: bold;
}
.KR25Tool {
    display: flex;
    font-size: 12px;
    align-items: center;
    margin-right: 20px;
}
.KR25Tool > div {
    height: 12px;
    width: 12px;
    border-radius: 100%;
    margin-right: 5px;
}
</style>
