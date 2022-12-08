<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
	<div style="width: 100%;height: 100%;">
		<div v-if="dataSource.length===0" style="position: absolute;left:50%;top:50%;margin-left: -30px;">暂无数据</div>
		<div ref="chart" style="width: 100%;height: 100%;"> </div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import 'echarts/lib/component/title';
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/bar';
	// import 'echarts/lib/chart/line';
	import "echarts/lib/chart/scatter";
	import C from "../../../assets/com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				url: "http://10.192.6.156:9090/PTMSREPORT/GeneralProServlet",
				chart: null,
			}
		},
		// 属性
		props: {
			stationName: String,
			dataSource: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			setTimeout(() => {
				this.initChart();
			}, 1);
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			initChart() {
				this.chart = this.$echarts.init(this.$refs.chart);
				var option = {
					title: {
						text: this.stationName,
						textStyle: {
							color: "#ffffff",
							fontSize: 14,
						},
						x: "center"
					},
					color: ['#7BC0F2', '#DF9499'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						},
						backgroundColor: "transparent",
						borderWidth: 0,
						className: 'tooltipBGColor',
						textStyle: {
							color: '#fff',
						}
					},
					// legend: {
					// 	orient: 'horizontal',
					// 	left: 'center',
					// 	data: ['人数'],
					// 	textStyle:{
					// 		color: "#ffffff",
					// 		fontSize: 14,
					// 	}
					// },
					grid: {
						top: '12%',
						left: '5%',
						right: '5%',
						bottom: '0%',
						containLabel: true
					},
					xAxis: [{
						type: 'value',
						axisLabel: {
							color: "#ffffff",
							fontSize: 12,
							interval: 0,
						},
					}],
					yAxis: [{
						type: 'category',
						data: [],
						triggerEvent: true,
						axisTick: {
							alignWithLabel: true
						},
						axisLabel: {
							color: "#ffffff",
							fontSize: 12,
							fontWeight: 700,
						},
					}],
					series: [{
						name: '人数',
						type: 'bar',
						barWidth: '40%',
						label: {
							normal: {
								show: true,
								position: 'right',
								textStyle: {
									color: "#7BC0F2"
								}
							},
						},
						data: []
					}]
				};
				this.chart.setOption(option);
			},

			/* @info  数据处理区-----------------------------------*/
			setChartOption(d) {
				// {RS: "34872", COUNT: "118", STN: "成都东", TYPE: "1"}
				const units = []; //Y轴单位
				const unitsTotal = []; //旅客发送人数
				C.$.each(d, function(i, v) {
					units.push(v.STN);
					unitsTotal.push(v.RS);
				});
				var option = this.chart.getOption();
				option.yAxis[0].data = units;
				option.series[0].data = unitsTotal;
				this.chart.setOption(option, true);
			},
			/* @info  数据交互区-----------------------------------*/
		},
		// 监视属性
		watch: {
			"dataSource"(d) {
				this.setChartOption(d);
			}
		},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.temp {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.srtitle {
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
