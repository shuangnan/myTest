<!-- 
 * @created：2022年9月17日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		预警与提示
 -->
<template>
	<div style="position: relative;width:100%;height:100%;padding: 30px 10px 90px 10px;" class="box">
		<div style="position: relative;height: 50%;padding-top: 10px;">
			<div class="btn">今日新增<img src="./img/increase.png"></div>
			<div ref="chart1" style="display: inline-block;width: 50%;height:100%;vertical-align: top;"></div>
			<div ref="chart2" style="display: inline-block;width: 50%;height:100%;vertical-align: top;"></div>
		</div>
		<div style="position: relative;height: 50%;padding-top: 10px;">
			<div class="btn" style="top:0px;">今日处置</div>
			<div ref="chart3" style="display: inline-block;width: 50%;height:100%;vertical-align: top;"></div>
			<div ref="chart4" style="display: inline-block;width: 50%;height:100%;vertical-align: top;"></div>
		</div>
		<div style="position: absolute;;left:0;bottom:0;width:100%;height: 90px;display: flex;justify-content: space-between;">
			<div class="tj-item">
				<div>42352</div>
				<label>动态病害库总数</label>
			</div>
			<div class="tj-item">
				<div>42352</div>
				<label>静态病害库总数</label>
			</div>
			<div class="tj-item">
				<div>42352</div>
				<label>已处置动态病害总数</label>
			</div>
			<div class="tj-item">
				<div>42352</div>
				<label>已处置静态病害总数</label>
			</div>
		</div>
	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/pie';
	import "echarts/lib/chart/scatter";


	export default {
		data() {
			return {
				myChart1: null,
				myChart2: null,
				myChart3: null,
				myChart4: null,
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.myChart1 = this.$echarts.init(this.$refs.chart1);
			this.myChart2 = this.$echarts.init(this.$refs.chart2);
			this.myChart3 = this.$echarts.init(this.$refs.chart3);
			this.myChart4 = this.$echarts.init(this.$refs.chart4);
			this.getData();
		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData() {
				const data1 = [{
					value: 574,
					name: '动态病害Ⅲ级'
				}, {
					value: 735,
					name: '动态病害Ⅳ级'
				}];
				const data2 = [{
					value: 337,
					name: '静态病害Ⅲ级'
				}, {
					value: 435,
					name: '静态病害Ⅳ级'
				}];
				const data3 = [{
					value: 547,
					name: '静态病害Ⅱ级'
				}, {
					value: 653,
					name: '动态病害Ⅲ级'
				}, {
					value: 735,
					name: '动态病害Ⅳ级'
				}];
				const data4 = [{
					value: 94,
					name: '静态病害Ⅱ级'
				}, {
					value: 134,
					name: '静态病害Ⅲ级'
				}, {
					value: 56,
					name: '静态病害Ⅳ级'
				}];
				const color = [
					new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: "#fd6a4f"
					}, {
						offset: 1,
						color: "#ffbe41"
					}]),
					new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: "#2985f7"
					}, {
						offset: 1,
						color: "#0fd4fd"
					}]),
					new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: "#f99704"
					}, {
						offset: 1,
						color: "#06fbf1"
					}]),
					new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: "#268df8"
					}, {
						offset: 1,
						color: "#0ed7fd"
					}]),
					"#1868a7",
					"#32e98b",
					"#ffde00",
					"#dd5f72",
					"#16dbb2",
				]
				this.initCharts(this.myChart1, "今日新增动态病害", data1, [color[0], color[1]]);
				this.initCharts(this.myChart2, "今日新增静态病害", data2, [color[2], color[3]]);
				this.initCharts(this.myChart3, "今日处置动态病害", data3, [color[4], color[5], color[6]]);
				this.initCharts(this.myChart4, "今日处置静态病害", data4, [color[7], color[8]]);
			},
			initCharts(chart, name, data, color) {
				let option = {
					tooltip: {
						trigger: 'item'
					},
					legend: {
						show: false,
						top: 10,
						left: 'center',
						// orient: 'vertical',
						textStyle: {
							fontSize: 10,
							color: "#ffffff",
						},
					},
					grid: {
						top: '1%',
						left: '3%',
						right: '3%',
						bottom: '5%',
						containLabel: true
					},
					series: [{
						name: name,
						type: 'pie',
						radius: ['30%', '50%'],
						avoidLabelOverlap: false,
						// itemStyle: {
						// 	borderColor: '#fff',
						// 	borderWidth: 1,
						// },
						label: {
							alignTo: 'edge',
							formatter: '{b|{b}}\n{c|{c}}',
							rich: {
								b: {
									color: '#e3e7f9',
									fontSize: 12,
									padding: [1, 1]
								},
								c: {
									color: '#ffffff',
									fontSize: 14,
									fontWeight: 'bold',
									padding: [5, 5]
								},
							},

							minMargin: 5,
							edgeDistance: 10,
							lineHeight: 25,
							textStyle: {
								fontSize: 10,
								color: "#ffffff",
							},
						},
						labelLine: {
							length: 15,
							length2: 0,
							maxSurfaceAngle: 150
						},
						labelLayout: function(params) {
							const isLeft = params.labelRect.x < chart.getWidth() / 2;
							const points = params.labelLinePoints;
							// Update the end point.
							points[2][0] = isLeft ?
								params.labelRect.x :
								params.labelRect.x + params.labelRect.width;
							return {
								labelLinePoints: points
							};
						},
						data: data
					}],
					color: color
				};
				chart.setOption(option);
				// window.tools.loopShowTooltip(chart, option, {
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
		background: url(img/r1-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}

	.tj-item {
		position: relative;
		width: 25%;
		text-align: center;
	}

	.tj-item>div {
		display: inline-block;
		height: 50px;
		width: 130px;
		padding-top: 18px;
		padding-left:50px;
		font-size: 24px;
		color: #55ffff;
		background: url(img/r1-1.png)no-repeat;
		background-size: 100% 100%;
	}

	.tj-item>label {
		display: inline-block;
		margin-top:5px;
		padding:3px 5px;
		border:1px solid #4473D6;
		background: #136C91;
		font-weight: bold;
		font-size: 12px;
		text-shadow:0 0 10px #06203A;
	}

	.btn {
		position: absolute;
		display: inline-block;
		left: 10px;
		top: 10px;
		width: 120px;
		padding: 4px;
		text-align: center;
		font-size: 18px;
		font-weight: bold;
		color: #0096ff;
		text-shadow: 0 0 10px #0000FF, 0 0 20px #fff;
		background-image: radial-gradient(#022483, rgba(1, 7, 19, .8));
	}
</style>
