<!-- 
 * @created：	2021年4月29日
 * @author：	ch
 * @version:	v1.0
 * @desc:		4分之3环形统计大图
 -->
<template>
	<div class="con">
		<div class="bg">
			<div ref="chart" style="position:absolute;width:170px;height:170px;left:37px;top:-2px;"></div>
			<div class="chart-name">{{chartName}}</div>
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
				colorList: [ "rgba(7,14,52,0)","#3692DD"],
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
			dataSource:{
				type:Array,
				default:function(){
					return [25,75]
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


			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			initCharts() {
				let myChart = this.$echarts.init(this.$refs.chart);
				myChart.on("click", (param) => {
					console.log(param)
				})
				let option = {
					color: this.colorList,
					tooltip: {
						show: false,
					},
					series: [{
						hoverAnimation:false,//鼠标滑过变大
						center: ["50%", "50%"],
						type: 'pie',
						radius: ['80%', '94%'],
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						data: this.dataSource,
						itemStyle: {
							borderRadius: 0,
							borderColor: 'rgb(2,12,71)',
							borderWidth: 0,
							normal: {
								shadowBlur: '0',
								shadowColor: this.colorList[1],
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
		width: 241px;
		height: 204px;
	}

	.bg {
		position: absolute;
		top: 0px;
		width: 241px;
		height: 204px;
		background: url(../../assets/imgs/bigScreen/circle43_big.png)no-repeat;
		background-size: 100% 100%;
	}

	.chart-name {
		position: absolute;
		font-size: 24px;
		color: #bad9d3;
		width: 100%;
		top: 70px;
		text-shadow: 0 0 10px #0000FF,0 0 20px #fff;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
