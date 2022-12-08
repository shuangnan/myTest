<!-- 
 * @created：2022年9月17日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		动静态数据重复分析
 -->
<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div style="position: absolute;top:18px;right:15px;z-index: 10;">
			<el-date-picker v-model="s_date" @change="getData()" type="monthrange" size="mini" :clearable="false"
			 range-separator="-" style="width: 160px;" class="blue-control" popper-class="blue-control">
			</el-date-picker>
		</div>
		<div ref="chart" style="width:100%;height:100%"></div>
	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/bar';
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
				for (let i = 0; i < len; i++) {
					rs.push((Math.random() * 1000).toFixed(0))
				}
				return rs;
			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData(view, name) {
				this.xData = ["便携添乘", "人工添乘", '轨检超限', '轨检小车', '人工检查'];
				this.yData = this.getValues(this.xData.length);
				this.initCharts();
			},
			initCharts() {
				let option = {
					title: {},
					tooltip: {
						trigger: 'axis',
						backgroundColor: "rgba(52, 94, 127, 0.8)",
						className: 'tooltipBGColor_ALL',
						borderWidth: 0,
						textStyle: {
							color: '#fff',
						},
						formatter: function(params) {
							var items = [];
							params.forEach(v => {
								items.push(
									`<div style='font-size:8px;color:#00e6e6;'>${v.value}</div>`
								);
							})
							var rs =
								`<div style='width:100%;height:110%;'>
								  <div>${params[0].axisValueLabel}</div>
								  ${items.join("")}
								</div>`;
							return rs;
						},
						position: function(point, params, dom, rect, size) {
							return [point[0] - 1, point[1]];
						},
					},
					grid: {
						left: '3%',
						right: '3%',
						bottom: 5,
						top: 30,
						containLabel: true
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
					yAxis: {
						type: 'category',
						axisLabel: {
							color: "#4d94cb",
							fontSize: 14,
						},
						data: this.xData,
					},
					xAxis: {
						type: 'value',
						axisLabel: {
							color: "#4d94cb",
							fontSize: 12,
							interval: 0,
						},
						splitLine: {
							lineStyle: {
								color: "#4d5ec5",
							}
						},
						boundaryGap: [0, 0.01]
					},
					series: [{
						name: '重复次数',
						type: 'bar',
						label:{
							show:true,
							position:"right",
							textStyle: {
								fontSize: 14,
								color: "#ffffff",
							},
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [{
									offset: 0,
									color: '#03fdf4'
								},
								{
									offset: 1,
									color: '#fb9602'
								}
							])
						},
						data: this.yData
					}, ],
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
		background: url(img/b1-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}
</style>
