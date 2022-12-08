<!-- 
 * @created：	2021年4月29日
 * @author：	ch
 * @version:	v1.0
 * @desc:		4分之3环形统计大图
 -->
<template>
	<div class="con">
		<div ref="chartOut" style="position:absolute;width:90px;height:90px;left:5px;"></div>
		<div ref="chartIn" style="position:absolute;width:80px;height:80px;left:10px;top:5px;"></div>
		<div class="chart-name">{{chartName}}</div>
		<div class="chart-value">{{chartValue}}</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	import "echarts/lib/chart/pie";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				chartValue: "60%"
			}
		},
		// 属性
		props: {
			// 统计图名称
			chartName: {
				type: String,
				default: "统计"
			},
			// 总数
			dataSource: {
				type: Array,
				default: function() {
					return [100, 25]
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			this.initChartsOut();//绘制外框
			this.drawData();//绘制内框统计数据
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/

			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			initChartsOut() {
				let myChart = this.$echarts.init(this.$refs.chartOut);
				myChart.on("click", (param) => {
					console.log(param)
				})
				let option = {
					color: ["#141623", "#0B9A4B", "#0A3AA5", ],
					tooltip: {
						show: false,
					},
					series: [{
						hoverAnimation: false, //鼠标滑过变大
						center: ["50%", "50%"],
						type: 'pie',
						radius: ['85%', '96%'],
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						data: [2, 3, 8]
					}]
				};
				myChart.setOption(option);
			},
			drawData() {
				const pers = (this.dataSource[1] / this.dataSource[0]).toFixed(4);
				this.chartValue = pers * 100 + "%";
				const len = 40 * pers;
				const data = [];
				for (let i = 0; i < 40; i++) {
					const item = {
						value: 1,
						itemStyle: {
							normal: {
								color: "#0A3AA5"
							}
						}
					};
					if (i >= len) {
						item.itemStyle.normal.color = "#151724";
					}
					data.push(item);
				}

				let myChart = this.$echarts.init(this.$refs.chartIn);
				let option = {
					// color: this.colorList2,
					tooltip: {
						show: false,
					},
					series: [{
						hoverAnimation: false, //鼠标滑过变大
						center: ["50%", "50%"],
						type: 'pie',
						radius: ['70%', '95%'],
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						data: data,
						itemStyle: {
							borderRadius: 1,
							borderColor: '#222222',
							borderWidth: 2,
						},
					}]
				};
				myChart.setOption(option);
			},
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.con {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		width: 100px;
		height: 110px;
		text-align: center;
	}

	.chart-name {
		position: absolute;
		font-size: 12px;
		color: #bad9d3;
		width: 100%;
		bottom: 0px;
		/* text-shadow: 0 0 10px #0000FF,0 0 20px #fff; */
	}

	.chart-value {
		position: absolute;
		font-size: 12px;
		color: #bad9d3;
		width: 100%;
		top: 38px;
		text-shadow: 0 0 10px #0000FF, 0 0 20px #fff;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
