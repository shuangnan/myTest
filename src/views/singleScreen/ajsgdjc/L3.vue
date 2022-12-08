<!-- 
 * @created：2022年9月16日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		晃车排名
 -->
<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div style="position: absolute;top:18px;right:15px;z-index: 10;">
			<el-button size="mini" type="primary" @click="getData" v-show="curView==='线路'" style="margin-right:10px;">返回</el-button>
			<el-date-picker v-model="s_date" @change="getData()" type="monthrange" size="mini" :clearable="false" range-separator="-" style="width: 180px;" class="blue-control"
				popper-class="blue-control">
			</el-date-picker>
		</div>
		<div ref="chart" style="width:100%;height:100%"></div>
	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/line';
	import "echarts/lib/chart/scatter";

	const colorArr = ["rgb(82,175,242)", "rgb(90,226,206)", "rgb(249,161,147)"];
	export default {
		data() {
			return {
				curView:"全局",
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
			this.myChart.on('click', (params) => {
				this.getDataGlb(params.name);
			});
			this.getData("全局");
		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			getValues(len) {
				const rs = [528];
				for (let i = 0; i < len; i++) {
					rs.push(rs[rs.length - 1] - (Math.random() * 80).toFixed(0))
				}
				return rs;
			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData() {
				this.curView = "全局";
				this.xData = ["成渝", "成昆", '川黔', '泸昆', '黔桂', '内六', '渝怀', '广岳', '成汶', '资威'];
				this.yData = this.getValues(this.xData.length);
				this.initCharts();
			},
			getDataGlb(name) {
				this.curView = "线路";
				this.xData = ["K1+21~K2+323", "K2+21~K3+323","K4+21~K4+323","K4+21~K5+323"];
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
									`<div style='font-size:8px;color:#00e6e6;'>排名：${v.value}</div>`
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
						type: 'value',
						axisLabel: {
							color: "#4d94cb",
							fontSize: 14,
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
							color: "#4d94cb",
							fontSize: 12,
							interval: 0,
						},
						splitLine: {
							lineStyle: {
								color: "#48a0c5",
							}
						},
						triggerEvent: true
					},
					series: [{
						name: '线路排名',
						type: 'line',
						smooth: true,
						lineStyle: {
							width: 1,
							color:"#20ff88"
						},
						showSymbol: false,
						areaStyle: {
							opacity: 0.8,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: '#20ff88'
								},
								{
									offset: 1,
									color: 'rgba(133, 203, 161, 0.1)'
								}
							])
						},
						emphasis: {
							focus: 'series'
						},
						data: this.yData
					}, ],
				};
				this.myChart.setOption(option);
				window.tools.loopShowTooltip(this.myChart, option, {
					loopSeries: true
				});
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
	.box{
		background: url(img/l3-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}
</style>
