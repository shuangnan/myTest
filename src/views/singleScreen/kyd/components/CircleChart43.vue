<!-- 
 * @created：	2021年4月28日
 * @author：	ch
 * @version:	v1.0
 * @desc:		4分之3环形统计
 -->
<template>
	<div class="con" @click="dataClick">
		<div class="bg" :class="{'green':type==='green'}">
			<div ref="chart" style="position:absolute;width:70px;height:70px;left:-12px;bottom:-1px;" :class="{'selectBox':chartName==selectChartName}"></div>
			<div class="chart-name">
				<div :class="{'selectText':chartName==selectChartName}">{{chartName}}</div>
				<div :class="{'selectText':chartName==selectChartName}">{{chartValue}}</div>
			</div>
		</div>
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
				colorList1: ["#0A3AA5", "rgba(7,14,52,0)"],
				colorList2: ["#0AA54E", "rgba(7,14,52,0)"],
			}
		},
		// 属性
		props: {
			// 类型：blue green
			type: {
				type: String,
				default: "blue"
			},
			// 统计图名称
			chartName: {
				type: String,
				default: "统计"
			},
			selectChartName:{
				type: String,
				default: ""
			},
			chartValue:{
				type:String,
				default:"",
			},
			// 总数
			dataSource:{
				type:Array,
				default:function(){
					return [100,25]
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			this.initCharts()
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/

			/* @info  数据处理区-----------------------------------*/
			dataClick(){
				this.$emit("dataClick",this.chartName)
			},

			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			initCharts() {
				const colorList = this.type === "blue" ? this.colorList1 : this.colorList2;
				let myChart = this.$echarts.init(this.$refs.chart);
				myChart.on("click", (param) => {
					console.log(param)
				})
				let option = {
					color: colorList,
					tooltip: {
						show: false,
					},
					series: [{
						hoverAnimation:false,//鼠标滑过变大
						center: ["50%", "50%"],
						type: 'pie',
						radius: ['75%', '84%'],
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						data: this.dataSource,
						itemStyle: {
							borderRadius: 2,
							borderColor: 'rgb(2,12,71)',
							borderWidth: 1,
							normal: {
								shadowBlur: '1',
								shadowColor: colorList[0],
							}
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
		width: 70px;
		height: 83px;
		transform: scale(1.1);
		cursor: pointer;
	}

	.bg {
		position: absolute;
		left: 10px;
		width: 54px;
		height: 83px;
		background: url('./img/circle43_blue.png')no-repeat;
		background-size: 100% 100%;
	}

	.bg.green {
		background: url('./img/circle43_green.png')no-repeat;
		background-size: 100% 100%;

	}

	.chart-name {
		position: absolute;
		font-size: 12px;
		color: #bad9d3;
		width: 100%;
		bottom: 20px;
		margin-left: -5px;
		text-align: center;
	}
	.selectText{
		text-shadow: 0 0 20px #00a2ff, 0 0 20px #fff;
		/* text-shadow: 0 0 20px #fff; */
	}
	.selectBox{
		box-shadow: 0 0 10px 5px #00a2ff0e,0 0 10px 10px #00a2ff0e inset;
		border-radius: 100%;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
