<!-- 
 * @created：2022年9月16日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		站段风险评分
 -->
<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div style="position: absolute;top:18px;right:15px;z-index: 10;">
			<el-select v-model="s_yue" size="mini" style="width: 60px;margin-right: 5px;" class="blue-control mini" popper-class="blue-control"></el-select>
			<el-radio-group v-model="s_ju" @change="getData('站段','全局')" size="mini" style="margin-right:5px;">
				<el-radio-button label="全局"></el-radio-button>
			</el-radio-group>
			<el-select v-model="s_zd" size="mini" style="width: 60px;margin-right: 5px;" class="blue-control mini" popper-class="blue-control"
			 placeholder="站段"></el-select>
			<el-select v-model="s_cj" size="mini" style="width: 60px;margin-right: 5px;" class="blue-control mini" popper-class="blue-control"
			 placeholder="车间"></el-select>
			<el-select v-model="s_gq" size="mini" style="width: 60px;" class="blue-control mini" popper-class="blue-control"
			 placeholder="工区"></el-select>
		</div>
		<div ref="chart" style="width:100%;height:100%"></div>
	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/component/legend';
	import 'echarts/lib/chart/line';
	import "echarts/lib/chart/scatter";

	export default {
		data() {
			return {
				myChart: null,
				s_yue: "9月",
				s_ju: "全局",
				s_zd: "",
				s_cj: "",
				s_gq: "",
				xData: [], //X轴数据
				yData: [], //Y轴数据
				curView: "站段", //站段、工区、车间
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.myChart = this.$echarts.init(this.$refs.chart);
			this.myChart.on('click', (params) => {
				if (params.componentType == "xAxis") {
					if (this.curView === "站段") {
						this.getData('车间', params.name);
					} else if (this.curView === "车间") {
						this.getData('工区', params.name);
					}
				} else {
					alert("单击了" + params.name + "柱状图");
				}
			});
			this.getData("站段", '全局');

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
				this.curView = view;
				if (this.curView === "站段") {
					this.xData = ["成都工务段", "涪陵工务段", '贵阳工务段', '凯里工务段', '遂宁工务段', '内江工务段', '重庆工务段', '绵阳工务段', '达州工务段', '西昌工电段',
						'重庆工电段', '宜宾工电段', '六盘水工电段', '成都高铁工务段', '贵阳高铁工务段'
					];
				} else if (this.curView === "工区") {
					this.s_ju = "";
					this.xData = ["青白江巡养工区", "彭县线路工区", '新都岔道维修工区', '大弯镇巡养工区', '天回镇巡养工区', '大弯镇线路维修工区', '青白江线路检查工区'];
				} else if (this.curView === "车间") {
					this.s_ju = "";
					this.xData = ["青白江线路车间", "成都南线桥车间", "彭山线路车间", "成都北线路车间", "成都桥路车间", "综合机修车间", "探伤车间", "金堂线路车间", "淮口南线桥车间",
						"石板滩线路车间", "普兴线路车间", "金堂桥路车间", "成都线路车间", "彭山桥路车间", "线路综合维修车间"
					];
				}
				this.yData = this.getValues(this.xData.length);
				this.initCharts();
			},
			initCharts() {
				let option = {
					title: {},
					tooltip: {
						trigger: 'axis',
						backgroundColor: "rgba(52, 94, 127, 0.8)",
						className: 'tooltipBGColor_ALL auto-width',
						borderWidth: 0,
						textStyle: {
							color: '#fff',
						},
						formatter: function(params) {
							var items = [];
							params.forEach(v => {
								items.push(
									`<div style='font-size:16px;color:#00cdff;'>风险分：${v.value}</div>`
								);
							})
							var rs =
								`<div style='width:auto;height:110%;color:#b5ddfd;font-size:14px;'>
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
						bottom: 0,
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
						// X轴刻度
						axisTick: {
							show: true,
							inside: true,
						},
						axisLabel: {
							color: "#eaeff2",
							fontSize: 11,
							interval: 0,
							rotate: -80,
							formatter: function(v) {
								const len = (v.length/2).toFixed(0);
								return v.substring(0,len)+"\n"+v.substring(len)
								// return v.split("").join("\n")
							}
						},
						splitLine: {
							lineStyle: {
								color: "#48a0c5",
							}
						},
						triggerEvent: true
					},
					series: [{
						name: '风险分',
						type: 'line',
						smooth: true,
						lineStyle: {
							width: 1,
							color: "#00fdf6"
						},
						showSymbol: false,
						areaStyle: {
							opacity: 0.8,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: '#00fdf6'
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
	.box {
		background: url(img/l1-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}
</style>
