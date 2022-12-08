<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
	<div id="ylqs" ref="chart" style="width:100%;height:100%"></div>
</template>

<script>
	import C from "../../../assets/com.js";
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/bar';
	import 'echarts/lib/chart/line';
	import "echarts/lib/chart/scatter";

	const colorArr = ["rgb(82,175,242)", "rgb(90,226,206)", "rgb(249,161,147)"];
	export default {
		data() {
			return {
				stns: ["ZYE", "ZNE", "XFW", "TBE", "TDE", "LSE", "XWE"],
			}
		},
		props: {},
		// 组件挂载完毕
		mounted() {
			this.getData();
		},
		created() {

		},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData() {
				const sDate = C.getDateTimeSub(new Date(), "yyyyMMdd", -7 * 24);
				const eDate = C.getDateTimeSub(new Date(), "yyyyMMdd", -1 * 24);;
				C.getData({
					url:this.$store.state.url,
					c: "trdm_ys_308",
					s: [this.stns.join("','"), 1, sDate, eDate]
				}, (r1) => {
					console.log("【trdm_ys_308】7日统计(人数)>>>", r1);
					C.getData({
						url:this.$store.state.url,
						c: "trdm_ys_308",
						s: [this.stns.join("','"), 2, sDate, eDate]
					}, (r2) => {
						console.log("【trdm_ys_308】7日统计(收入)>>>", r2);
						this.initCharts({
							fs: r1.map(v=>v.DATA_NUM===""?0:v.DATA_NUM),
							sr: r2.map(v=>v.DATA_NUM===""?0:(v.DATA_NUM*0.0001).toFixed(3))
						});
					});
				});

			},
			initCharts(data) {
				let xData = [];
				for (let i = 1; i <= 7; i++) {
					const d = C.getDateTimeSub(new Date(), "MM月dd", -i * 24);
					xData.unshift(d)
				}
				let myChart = this.$echarts.init(this.$refs.chart);
				let yData1 = data.fs;
				let yData2 = data.sr;
				let option = {
					title: {},
					tooltip: {
						trigger: 'axis',
						backgroundColor: "transparent",
						className: 'tooltipBGColor_kyd2',
						borderWidth: 0,
						textStyle: {
							color: '#fff',
						},
						formatter: function(params) {
							var items = [];
							params.forEach((v) => {
								var unit = v.seriesName==="收入"?"万元":"人";
								items.push(`<div style='font-size:8px;'>${v.marker} ${v.seriesName}：<br/>${v.value}${unit}</div>`);
							})
							var rs =
								`<div style='width:100%;height:100%;'>
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
						left: '24%',
						right: '20px',
						bottom: 5,
						top: '50',
						containLabel: true
					},
					legend: {
						data: ["人数", "收入"],
						textStyle: {
							fontSize: 10,
							color: "#ffffff",
						},
						orient: "vertical",
						left: 25,
						bottom: 15,
						itemHeight: 10,
					},
					yAxis: [{
						type: 'value',
						name: "人数",
						nameGap: 10,
						nameTextStyle: {
							color: "#ffffff",
							fontSize: 14,
							align: 'right',
						},
						axisLine: {
							lineStyle: {
								color: "#4d5ec5",
							},
							onZero: false,
						},
						splitNumber: 3,
						axisLabel: {
							color: "#ffffff",
							fontSize: 12,
							fontWeight: 700,
						},
						splitLine: {
							lineStyle: {
								color: "#4d5ec5",
							}
						},
					}, {
						type: "value",
						name: "收入",
						//   nameLocation:"start",
						nameGap: 10,
						nameTextStyle: {
							color: "#ffffff",
							fontSize: 14,
							align: "left"
						},
						axisLine: {
							lineStyle: {
								color: "#4d5ec5",
							},
							onZero: false,
						},
						splitNumber: 3,
						axisLabel: {
							color: "#ffffff",
							fontSize: 12,
							fontWeight: 700,
						},
						splitLine: {
							lineStyle: {
								color: "#4d5ec5",
							}
						},
					}],
					xAxis: {
						type: 'category',
						data: xData,
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
							color: "#ffffff",
							fontSize: 12,
							interval: 0,
						},
						splitLine: {
							lineStyle: {
								color: "#4d5ec5",
							}
						},
					},
					series: [{
							name: "人数",
							type: 'line',
							yAxisIndex: 0,
							data: yData1,
							itemStyle: {
								color: colorArr[1],
								barBorderRadius: 2,
							},
							smooth: true,
						},
						{
							name: "收入",
							type: 'bar',
							yAxisIndex: 1,
							data: yData2,
							itemStyle: {
								color: colorArr[2],
								barBorderRadius: 2,
							},
							smooth: true,
							barMaxWidth: 10,
						}
					],
				};

				myChart.setOption(option);
				window.tools.loopShowTooltip(myChart, option, {
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
	>>>.tooltipBGColor_kyd2 {
		height: calc(84% - 25px);
		width: 80px;
		background-image: repeating-linear-gradient(90deg,
			rgba(62, 130, 196, 0.9),
			rgba(62, 130, 196, 0.4) 30%,
			rgba(62, 130, 196, 0));
		top: 16% !important;
		font-size: 10px !important;
		border-left: 2px solid #bbeee7 !important;
	}
</style>
