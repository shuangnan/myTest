<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div class="title">TQI变化趋势</div>
		<div style="position: absolute;top:18px;left: 33px;right:50px;z-index: 10;width: 90%; display: flex;flex-direction: row;justify-content: flex-end;align-items: center;">
			<!-- <el-button size="mini" type="primary" @click="getData" v-show="curView==='线路'" style="margin-right:10px;">返回</el-button> -->
			<!-- <el-date-picker v-model="s_date" @change="getData()" type="monthrange" size="mini" :clearable="false" range-separator="-" style="width: 180px;" class="blue-control"
				popper-class="blue-control">
			</el-date-picker> -->
			<div style="display: flex;margin-right: 10px;margin-top: 5px;">
			<div @click="change" class="xianl">切换线</div>
				<img  @click="change" class="img" src="./img2/right.png" style="height: 18px;width: 18px;cursor: pointer;right: 0px;left: 0px;"/>
				</div>
				<el-select v-model="s_year" size="mini" style="width: 70px;margin-top: 5px; ;padding-left: 0px;" class="blue-control mini"
					popper-class="blue-control"></el-select>
		</div>
		<div class="box1">
		<div @mouseenter="mEnter" @mouseleave="mLeave" ref="chart" style="width:100%;height:100% ;padding-top: 30px;left: 0px;z-index: 1;">
		</div>
		<!-- <img  @click="change" class="img" src="./img2/right.png" style="height: 50px;width: 40px;cursor: pointer;"/> -->
		<!-- <div @click="change" class="xianl">切换线</div> -->
		</div>
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
				s_year:"2022",
				xData: [], //X轴数据
				yData: [], //Y轴数据
				yData2: [],
				flag:'',
				yData3: [],
				yData4: [],
				tootipTimer:null,
				xianname:['达万线','渝成线','襄渝线','达成线'],
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			
			this.myChart = this.$echarts.init(this.$refs.chart);
			// this.myChart.on('click', (params) => {
			// 	this.getDataGlb(params.name);
			// });
			this.getData("全局");
			this.$nextTick(()=>{
				this.flag=setInterval(this.testHtml,23000)
			})
		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			testHtml(){
				if(this.xianname[0]==='达万线'){
					this.xianname=['内六线','成昆线','吉玉线','黔贵线']
				}else{
					this.xianname=['达万线','渝成线','襄渝线','达成线']
				}
				// console.log(this.flag)
				// this.flag=clearInterval(this.flag)
				this.getData("全局");
			},
			mEnter() {
			    clearInterval(this.flag);
			},
			// 鼠标移出继续滚动
			mLeave() {
			    this.flag=setInterval(this.testHtml,23000)
			},
			/**-------------------------数据展示-------------------------------*/
			getValues(len) {
				const rs = [];
				for (let i = 0; i < len; i++) {
					// rs.push(rs[rs.length - 1] - (Math.random() * 80).toFixed(0))
					rs.push((Math.random() * 1000).toFixed(0))
				}
				return rs;
			},
			change(){
				if(this.xianname[0]==='达万线'){
					this.xianname=['内六线','成昆线','吉玉线','黔贵线']
				}else{
					this.xianname=['达万线','渝成线','襄渝线','达成线']
				}
				
				this.getData("全局");
			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData() {
				this.curView = "全局";
				this.xData = ["1月", "2月", '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月','11月','12月'];
				this.yData = this.getValues(this.xData.length);
				this.yData2 = this.getValues(this.xData.length);
				this.yData3 = this.getValues(this.xData.length);
				this.yData4 = this.getValues(this.xData.length);
				this.initCharts();
			},
			getDataGlb(name) {
				this.curView = "线路";
				this.xData = ["K1+21~K2+323", "K2+21~K3+323","K4+21~K4+323","K4+21~K5+323"];
				this.yData = this.getValues(this.xData.length);
				this.initCharts();
			},
			initCharts() {
				// window.tools.loopShowTooltip(this.myChart, option, {
				// 	loopSeries: false,
				// 	// interval:2000,
				// });
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
						// formatter: function(params) {
						// 	var items = [];
						// 	params.forEach(v => {
						// 		items.push(
						// 			`<div style='font-size:8px;color:#00e6e6;'>排名：${v.value}</div>`
						// 		);
						// 	})
						// 	var rs = `<div style='width:100%;height:110%;'>
						// 		  <div>${params[0].axisValueLabel}</div>
						// 		  ${items.join("")}
						// 		</div>`;
						// 	return rs;
						// },
						// position: function(point, params, dom, rect, size) {
						// 	return [point[0] - 1, point[1]];
						// },
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
					series: [
					// 	{
					// 	name: '线路排名',
					// 	type: 'line',
					// 	smooth: true,
					// 	lineStyle: {
					// 		width: 1,
					// 		color:"#20ff88"
					// 	},
					// 	showSymbol: false,
					// 	areaStyle: {
					// 		opacity: 0.8,
					// 		color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					// 				offset: 0,
					// 				color: '#20ff88'
					// 			},
					// 			{
					// 				offset: 1,
					// 				color: 'rgba(133, 203, 161, 0.1)'
					// 			}
					// 		])
					// 	},
					// 	emphasis: {
					// 		focus: 'series'
					// 	},
					// 	data: this.yData
					// }, 
					{
						name: this.xianname[0],
						data:this.yData,
						type:'line',
						// stack:'x',
					},
					{
						name: this.xianname[1],
						data:this.yData2,
						type:'line',
						// stack:'x',
					},
					{
						name: this.xianname[2],
						data:this.yData3,
						type:'line',
						// stack:'x',
					},
					{
						name: this.xianname[3],
						data:this.yData4,
						type:'line',
						// stack:'x',
					}
					],
				};
				this.myChart.setOption(option);
				this.tootipTimer && this.tootipTimer.clearLoop();
				this.tootipTimer=null;
				// window.tools.loopShowTooltip(this.myChart, option, {
				// 	loopSeries: true,
				// 	// interval:2000,
				// });
				this.tootipTimer =tools.loopShowTooltip(this.myChart, option, {
					loopSeries: true,
				// 	// interval:2000,
				})
				
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
		background: url(img2/右边框.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
		display: flex;
		flex-direction: column;
	}
	.title{
		margin-top: -15px;
		margin-left: 18px;
		font-size: 12px;
		/* color: #1ae3ff; */
		background-image: linear-gradient(#1ae3ff,#2f7aca);
		-webkit-background-clip: text;
		color: transparent;
		-webkit-user-select: none;
		width: 90px;
		height: 20px;
	}
	.box1{
		height: 100%;
		width: 100%;
		display: flex;
		/* flex-direction: row; */
		/* align-items: center; */
	}
	.xianl{
		/* position: absolute; */
		/* width: 1px; */
		/* margin-top: -55px; */
		/* padding-left: 8px; */
		/* padding-left: 60px; */
		/* margin-right: 50px; */
		/* left: 50px; */
		/* top: 20px; */
		margin-top: 1px;
		font-size: 8px;
		color: #d0c5e3; 
		top: 10px;
		text-shadow:0px 0px 10px #0000FF, 0 0 20px #fff ;
		-webkit-user-select: none;
		cursor: pointer;
/* 		z-index: 2; */
	}
</style>

