<!-- 
 * @created：2022年9月17日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		动静态数据重复分析
 -->
<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div style="position: absolute;top:18px;right:15px;z-index: 10;"></div>
		<div style="position: relative;display: inline-block;width: 50%;height: 100%;vertical-align: top;">
			<a class="btn">考核</a>
			<div ref="chart1" style="width:100%;height:100%"></div>
		</div>
		<div style="position: relative;display: inline-block;width: 50%;height: 100%;vertical-align: top;">
			<a class="btn">激励</a>
			<div ref="chart2" style="width:100%;height:100%"></div>
		</div>
	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/bar';
	import "echarts/lib/chart/scatter";

	export default {
		data() {
			return {
				myChart1: null,
				myChart2: null,
				xData1: [], //X轴数据
				yData1: [], //Y轴数据
				xData2: [], //X轴数据
				yData2: [], //Y轴数据
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.myChart1 = this.$echarts.init(this.$refs.chart1);
			this.myChart2 = this.$echarts.init(this.$refs.chart2);
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
					rs.push((Math.random() * 500).toFixed(0))
				}
				return rs;
			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData(view, name) {
				this.xData1 = ["便携添乘", "人工添乘", '轨检超限', '轨检小车', '人工检查'];
				this.yData1 = this.getValues(this.xData1.length);
				this.xData2 = ["便携添乘", "人工添乘", '轨检超限', '轨检小车', '人工检查'];
				this.yData2 = this.getValues(this.xData2.length);
				this.initCharts1();
				this.initCharts2();
			},
			initCharts1() {
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
							var rs = `<div style='width:100%;height:110%;'>
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
						left: '5%',
						right: '5%',
						bottom: 5,
						top: 30,
						containLabel: true
					},
					legend: {
						show:false,
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
						data: this.xData1,
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01],
						axisLabel: {
							color: "#4d94cb",
							fontSize: 12,
							interval: 0,
						},
					},
					series: [{
						name: '考核',
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
									color: '#3967ff'
								},
								{
									offset: 1,
									color: '#01faf7'
								}
							]),
							borderRadius:[0,10,10,0]
						},
						data: this.yData1
					}, ],
				};
				this.myChart1.setOption(option);
				// window.tools.loopShowTooltip(this.myChart1, option, {
				// 	loopSeries: true
				// });
			},
			initCharts2() {
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
							var rs = `<div style='width:100%;height:110%;'>
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
						left: '5%',
						right: '5%',
						bottom: 5,
						top: 30,
						containLabel: true
					},
					legend: {
						show:false,
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
						data: this.xData2,
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01],
						axisLabel: {
							color: "#4d94cb",
							fontSize: 12,
							interval: 0,
						},
					},
					series: [{
						name: '激励',
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
									color: '#d65185'
								},
								{
									offset: 1,
									color: '#fd981f'
								}
							]),
							borderRadius:[0,10,10,0]
						},
						data: this.yData2
					}, ],
				};
				this.myChart2.setOption(option);
				// window.tools.loopShowTooltip(this.myChart2, option, {
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
	.btn{
		position:absolute;
		display:inline-block;
		left:50%;
		width:120px;
		margin-left:-60px;
		padding:4px;
		text-align:center;
		color: #D0C5E3;
		text-shadow: 0 0 10px #0000FF, 0 0 20px #fff;
		background-image:radial-gradient(#022483,rgba(1, 7, 19, .8));
	}
	.box {
		background: url(img/b4-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}
</style>
