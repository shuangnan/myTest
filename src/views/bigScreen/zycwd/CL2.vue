<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		预计客流情况(上车)
 * chart 宽度 每30秒=1px（2880） 再加上左右共100 = 2980
 * chart 宽度 每60秒=1px（1440） 再加上左右共100 = 1540
 -->
<template>
	<div class="temp">
		<div ref="con" class="itemContent" style="width: 100%;height: calc(100% - 40px);overflow-x: auto;overflow-y: hidden;">
			<div style="width: 2980px;height: 100%;position: relative;">
				<div class="time-line" :style="{left:timeLineLeft+'px'}"></div>
				<div ref="chart" style="width: 100%;height: 100%;"> </div>
			</div>
		</div>
	</div>
</template>

<script>
	import C from "../../../assets/com.js";
	// 这里引用各种资源
	import "echarts/lib/component/legend";
	import "echarts/lib/component/legendScroll";
	import "echarts/lib/component/visualMap";
	import "echarts/lib/component/tooltip";
	// import "echarts/lib/component/dataZoom";
	import "echarts/lib/chart/bar";
	import "echarts/lib/chart/pie";
	import "echarts/lib/chart/radar";
	import "echarts/lib/chart/scatter";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				conWidth: 0, //滚动容器宽度
				chartWidth: 0, //滚动内容宽度
				chartItemWidth: 0, //统计图每个单元宽度
				secondWidth: 0, //每一秒对应宽度
				lineTimer: null,
				timeLineLeft: 0,
				chart: null,
				legendX:"center",
				colors: ["#5be4d0", "#3692dd", "#b0aeff", "#562ec7", "#8e77d0", "#d0b375", "#c58259"],
				snames: ["遵义", "遵义南", "息烽", "桐梓北", "桐梓东", "娄山关南", "修文县"],
				stns: ["ZYE", "ZNE", "XFW", "TBE", "TDE", "LSE", "XWE"],
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.getData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			initChart(xAxis_data) {
				this.chart = this.chart || this.$echarts.init(this.$refs.chart);
				let option = {
					tooltip: {
						trigger: 'axis',
						backgroundColor: "transparent",
						className: 'tooltipBGColor_kyd2',
						borderWidth: 0,
						textStyle: {
							color: '#fff',
						},
					},
					grid: {
						top: '40px',
						left: '50px',
						right: '50px',
						bottom: '30px',
					},
					legend: {
						data: this.snames,
						textStyle: {
							color: "#aaa"
						},
						x:this.legendX
					},
					xAxis: {
						name: "时间",
						type: "category",
						data: ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00",
							"05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
							"11:30",
							"12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
							"18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
						],
						nameTextStyle: {
							color: '#aaa'
						},
						axisLine: {
							lineStyle: {
								color: '#3e55bb'
							}
						},
						axisTick: {
							inside: true
						},
					},
					yAxis: {
						name: "人数",
						type: 'value',
						splitLine: {
							lineStyle: {
								color: '#3e55bb'
							}
						},
						nameTextStyle: {
							color: '#aaa',
							align: 'right'
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
					},
					series: this.xAxis_data,
					textStyle: {
						color: '#eee'
					},
				}
				this.chart.setOption(option);
			},

			/* @info  数据处理区-----------------------------------*/
			getScrollWidth(callback) {
				this.conWidth = this.$refs.con.offsetWidth;
				this.chartWidth = this.$refs.chart.offsetWidth;
				this.chartItemWidth = (this.chartWidth - 100) / 48; //统计图每格宽度 
				this.secondWidth = (this.chartWidth - 100) / (24 * 60 * 60); //每秒
				this.$nextTick(() => {
					callback.call();
				});
			},
			setPosition() {
				// 定位当前时间
				const w = this.chartWidth;
				const s = w / 12;
				const hour = (new Date()).getHours();
				const minute = (new Date()).getMinutes();
				// 显示当前时间对应时间轴
				this.chart.dispatchAction({
					type: "showTip",
					seriesIndex: 0,
					dataIndex: hour * 2 + (minute >= 30 ? 1 : 0)
				});
			},
			setCurTimeLine() {
				const c = this.conWidth;
				const w = this.chartWidth;
				const s = this.secondWidth; //每一秒钟宽度
				const hour = (new Date()).getHours(); //当前小时
				const minute = (new Date()).getMinutes(); //当前分钟
				const second = (new Date()).getSeconds(); //当前秒
				const timeLineLeft = 50 + this.chartItemWidth / 2 + (hour * 60 * 60 + minute * 60 + second) * s; //时间线离左边距离
				let scrollLeft = timeLineLeft / 2;
				if (timeLineLeft > c) {
					scrollLeft = (w - c) / 2 + (timeLineLeft - w / 2);
				}
				this.timeLineLeft = timeLineLeft;
				// console.log("scrollLeft:",scrollLeft)
				// console.log("timeLineLeft:",timeLineLeft)
				this.$refs.con.scrollLeft = scrollLeft;
				
				this.legendX = scrollLeft +"px";
				this.initChart();
			},
			/* @info  数据交互区-----------------------------------*/
			getData() {
				// [站名略码用','隔开（ICW','CUW）,查询日期（2021-05-18）]
				const curDay = C.formatDate('', 'yyyy-MM-dd');
				C.getData({
					url:this.$store.state.url,
					c: "trdm_ys_307",
					s: [this.stns.join("','"), curDay],
					o: ["STN_CODE"]
				}, (r) => {
					const xAxis_data = [];
					r.forEach((item, i) => {
						let d = {
							name: this.snames[i],
							type: 'line',
							smooth: true,
							stack: this.snames[i],
							data: item.map(v => v.BZSC === "" ? 0 : parseInt(v.BZSC)),
							symbolSize: 0,
							showSymbol: false,
							barMaxWidth: 5,
							itemStyle: {
								color: this.colors[i],
								barBorderRadius: 2,
							},
							areaStyle: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 1,
									color: this.colors[i] + '15'
								}, {
									offset: 0,
									color: this.colors[i] + '8f'
								}])
							},
						};
						xAxis_data.push(d);
					});
					this.xAxis_data = xAxis_data;
					this.initChart()
					this.getScrollWidth(() => {
						if (this.lineTimer) {
							clearInterval(this.lineTimer);
						}
						this.setCurTimeLine();
						this.lineTimer = setInterval(()=>{
							this.setCurTimeLine();
							// this.setPosition();
						},5000);
					});
					console.log("【trdm_ys_307】客流情况（上车）>>>", r)
				});
			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
		destroyed() {
			if (this.lineTimer) {
				clearInterval(this.lineTimer);
			}
		}
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.temp {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.srtitle {
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}

	.itemContent::-webkit-scrollbar-track {
		background-color: #183b94 !important
	}

	.itemContent::-webkit-scrollbar-thumb {
		background-color: #567ee4 !important
	}

	.time-line {
		position: absolute;
		top: 30px;
		bottom: 30px;
		left: 450px;
		width: 1px;
		border-right: 2px solid white;
		z-index: 10;
	}

	.time-line::after {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		bottom: -5px;
		left: -4px;
		border-top: 5px solid #fff;
		border-right: 6px solid transparent;
		border-left: 5px solid transparent;
	}

	>>>.tooltipBGColor_kyd2 {
		height: calc(84% - 25px);
		width: auto;
		background-image: repeating-linear-gradient(90deg,
			rgba(62, 130, 196, 0.9),
			rgba(62, 130, 196, 0.4) 30%,
			rgba(62, 130, 196, 0));
		top: 16% !important;
		font-size: 10px !important;
		border-left: 2px solid #bbeee7 !important;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
