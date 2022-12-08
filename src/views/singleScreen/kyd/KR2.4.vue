<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		考核金额分析
 -->
<template>
    <div class="main" style="width:100%;height:100%;padding-left:15px;padding-bottom:0px;">
        <div style="width:100%;height:calc(100% - 40px);display:flex;padding-bottom:10px;">
            <div style="width:40px;height:100%;position:relative">
                <div class="TX_R"></div>
            </div>
            <div ref="chart" style="width:calc(100% - 40px);height:100%;" class="KR24BG"></div>
            <div style="width:40px;height:100%;position:relative">
                <div class="TX_L"></div>
            </div>
        </div>
        <div style="height:40px;width:100%;" class="KRTitle">{{dataType=='0'?'考核金额分析':'成本核算'}}</div>
    </div>
</template>

<script>
// 这里引用各种资源
import 'echarts/lib/component/tooltip';
import "echarts/lib/component/legend";
import 'echarts/lib/chart/pie';
const colorArr = ["#6acbf8", "#4f29b3", "#9c953a", "#f86c47"];
export default {
    // 组件
    components: {},
    // 数据仓库
    data() {
        return {
            loop: null,
        }
    },
    // 属性
    props: {
        dataList: {
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
        //document.querySelector("title").innerHTML = "";//页面名称
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        initCharts() {
            let myChart = this.$echarts.init(this.$refs.chart);
            myChart.resize();
            myChart.on("click", (param) => {
                console.log(param)
            })
            let option = {
                title: {
                    text: "",
                    textStyle: { color: '#fff', fontWeight: 'bold' },
                    x: 'center',
                    y: 'top',
                },
                legend: {
                    icon: "circle",
                    left: "5%",
                    top: "10%",
                    orient: "vertical",
                    textStyle: {
                        fontSize: 12,
                        color: "#aec0f2",
                    },
                },
                color: colorArr,
                tooltip: {
                    trigger: 'item',
                    // formatter: '{b}: {c} ({d}%)'
                    formatter: function (params) {
                        var rs = "";
                        var item = params.data;
                        if (item) {
                            rs = `<div class='gradientRight_chart'> ${item.name} ： ${Number(item.value).toFixed(2)}元`;
                        }
                        return rs;
                    },
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    textStyle: {
                        color: '#fff',
                    },
                    padding: 0,
                    extraCssText: "z-index:1000",
                },
                series: [
                    {
                        name: "车队",
                        center: ["70%", "50%"],
                        type: 'pie',
                        selectedMode: 'single',
                        radius: ['0%', '70%'],
                        label: {
                            show: false,
                            position: 'inner',
                            formatter: function (param) {
                                return param.name;
                            },
                            color: "#fff",
                        },
                        labelLine: {
                            show: false,

                        },
                        roseType: 'radius',
                        data: this.dataList,
                        itemStyle: {                            normal: {
                                shadowBlur: '11',
                                shadowColor: '#73bbf1',
                                // shadowOffsetY: 2,
                                // shadowOffsetX: -2
                            }                        },
                    },
                ]
            };
            myChart.setOption(option);
            if (this.loop) {
                this.loop.clearLoop();
            }
            this.loop = window.tools.loopShowTooltip(myChart, option, { loopSeries: true });
        },
        getData() {

        }
    },
    // 监视属性
    watch: {},
    // 计算属性
    computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.main {
    width: 100%;
    height: 100%;
    padding: 20px;
}
.KR24BG {
    background: url("./img1/KR24.png") no-repeat;
    background-size: 100% 100%;
}
.KRTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #bad9de;
    font-weight: bold;
}
.TX_R {
    border-left: 20px solid #0e1c41;
    width: 0;
    height: 60%;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}
.TX_L {
    border-right: 20px solid #0e1c41;
    width: 0;
    height: 60%;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
}
>>> .gradientRight_chart {
    border-left: 3px solid #5d95b8 !important;
    background-image: linear-gradient(to right, #5d95b8b3, #5b5e5fb3);
    padding: 5px;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
