<!-- 
 * @created：2022年9月17日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		病害分析
 -->
<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div style="position: absolute;top:18px;right:15px;z-index: 10;"></div>
		<div ref="chart" style="width:100%;height:100%"></div>
	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/radar';
	import "echarts/lib/chart/scatter";

	export default {
		data() {
			return {
				myChart: null,
				s_date: "",
				xData: [], //X轴数据
				yData: [], //Y轴数据
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.myChart = this.$echarts.init(this.$refs.chart);
			this.getData();
		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			getValues(len) {
				const rs = [];
				for (let n = 0; n < 4; n++) {
					const d = [];
					for (let i = 0; i < len; i++) {
						d.push((Math.random() * 1000).toFixed(0))
					}
					rs.push(d)
				}
				return rs;
			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData(view, name) {
				this.yData = this.getValues(6);
				this.initCharts();
			},
			initCharts() {
				let option = {
					title: {

					},
					tooltip: {
						trigger: 'axis'
					},
					grid: {

					},
					legend: {
						textStyle: {
							fontSize: 10,
							color: "#ffffff",
						},
						left: 25,
						top: 0,
						itemHeight: 12,
					},
					radar: {
						// shape: 'circle',
						indicator: [{
								name: '便携添乘',
								max: 1000
							},
							{
								name: '人工添乘',
								max: 1000
							},
							{
								name: '轨检超限',
								max: 1000
							},
							{
								name: '轨检小车',
								max: 1000
							},
							{
								name: '人工检查',
								max: 1000
							},
							{
								name: '线路巡检',
								max: 1000
							}
						]
					},
					series: [{
						name: '病害分析',
						type: 'radar',
						tooltip: {
							trigger: 'item'
						},
						data: [{
								value: this.yData[0],
								name: '未签收',
								itemStyle: {
									color: "#4afd88"
								}
							},
							{
								value: this.yData[1],
								name: '未确认',
								itemStyle: {
									color: "#32beff"
								}
							},
							{
								value: this.yData[2],
								name: '未整改',
								itemStyle: {
									color: "#ffe575"
								}
							},
							{
								value: this.yData[3],
								name: '超周期未整改',
								itemStyle: {
									color: "#f87a7b"
								}
							}
						]
					}]
				};
				this.myChart.setOption(option);
				// window.tools.loopShowTooltip(this.myChart, option, {
				// 	loopSeries: true
				// });
			},
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
		// 组件
		components: {},
	}
</script>

<style scoped>
	.box {
		background: url(img/b3-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}
</style>
