<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
    <div style="width:100%;height:100%;position:relative;">
        <div ref="chart" style="width:100%;height:100%"></div>
    </div>
</template>

<script>
import "echarts/lib/chart/pie";
export default {
    data() {
        return {
            colorList: ["#615eff", "#8986ff", "#b0aeff", "#d8d7ff",
                "#4288ff", "#68a0ff", "#8eb7ff", "#b3cfff", "#d9e7ff",
                "#53bdbf", "#6efcff", "#a8fdff", "#c5feff", "#e2feff",
                "#45b3eb", "#6ac2ed", "#8fd2f1", "#b5e1f6", "#daf0fa"],
            myChart: null,
        }
    },
    props: {
        dataList: { type: Array, default: () => { return [] } },
    },
    // 组件挂载完毕
    mounted() {
        setTimeout(() => {
            this.initCharts();
        }, 100);
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
            let myChart = this.$echarts.init(this.$refs.chart);
            myChart.resize();
            myChart.on("click", (param) => {
                console.log(param)
            })
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var rs = "";
                        var item = params.data;
                        if (item) {
                            rs = `<div class='gradientRight_chart'> ${item.name} ： ${item.value}`;
                        }
                        return rs;
                    },
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    className: 'tooltipBGColor',
                    textStyle: {
                        color: '#fff',
                    },
                    padding: 0,
                },
                series: [
                    {
                        name: "人员安排",
                        center: ["50%", "50%"],
                        type: 'pie',
                        radius: ["20%", "80%"],
                        labelLine: {
                            //   lineStyle: {
                            //     color: '#bbb',
                            //   },
                            length: 0,
                            // length2: 50,
                        },
                        data: this.dataList,
                        color: this.colorList,
                        roseType: 'radius',
                        label: {
                            alignTo: 'edge',
                            minMargin: 5,
                            edgeDistance: 10,
                            lineHeight: 15,
                            formatter: '{b|{b}}\n {c|{c}}  {per|{d}%}  ',
                            rich: {
                                b: {
                                    color: '#eee',
                                    align: 'center',
                                    fontSize: 10,
                                },
                                c: {
                                    color: '#eee',
                                    fontSize: 10,
                                    align: 'left'
                                },
                                per: {
                                    color: '#eee',
                                    align: 'right',
                                    fontSize: 10,
                                }
                            },
                        },
                        labelLayout: function (params) {
                            var isLeft = params.labelRect.x < myChart.getWidth() / 2;
                            var points = params.labelLinePoints;
                            // Update the end point.
                            points[2][0] = isLeft
                                ? params.labelRect.x
                                : params.labelRect.x + params.labelRect.width;

                            return {
                                labelLinePoints: points
                            };
                        },
                    }
                ]
            };
            myChart.setOption(option);
            this.loop = window.tools.loopShowTooltip(myChart, option, { loopSeries: true })
            this.myChart=myChart;
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
>>> .gradientRight_chart {
    border-left: 3px solid #5d95b8 !important;
    background-image: linear-gradient(to right, #5d95b8b3, #5b5e5fb3);
    padding: 5px;
}
</style>
