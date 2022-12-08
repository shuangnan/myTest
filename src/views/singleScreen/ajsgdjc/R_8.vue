<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div class="title">TQI质量降幅</div>
		
		<div style="position: absolute;top:18px;right:200px;z-index: 10;">
			<el-select v-model="s_year" size="mini" style="width: 80px;margin-top: 5px; margin-right: 5px;" class="blue-control mini"
				popper-class="blue-control"></el-select>
			<!-- <el-radio-group v-model="s_ju" @change="getData('站段','全局')" size="mini" style="margin-right:5px;"> -->
				<!-- <el-radio-button label="全局"></el-radio-button> -->
			<!-- </el-radio-group> -->
			
			<!-- <el-select v-model="s_cj" size="mini" style="width: 60px;margin-right: 5px;" class="blue-control mini" -->
				<!-- popper-class="blue-control" placeholder="车间"></el-select> -->
			<!-- <el-select v-model="s_gq" size="mini" style="width: 60px;" class="blue-control mini" popper-class="blue-control" -->
				<!-- placeholder="工区"></el-select> -->
		</div>
		<div class="left-list" style="height: 60px; -webkit-user-select: none; ">
			<div class="wz" :class="{active:listtype==='线路'}" style="width: 80px;" @click="chooseleft('线路',1)">线路</div>
			/
			<div class="wz" :class="{active:listtype==='站段'}" style="width: 80px;" @click="chooseleft('站段',2)">站段</div>
		</div>
		<div ref="chart" style="width:100%;height:100%;padding-top: 20px;"></div>
	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/bar';
	import "echarts/lib/chart/scatter";

	// const colorArr = ["#e6c48a", "#b1f28d", "#4782ee","#7b2bf8"];
	const colorArr = ["#4cf4f8"];
	export default {
		data() {
			return {
				myChart: null,
				s_year: "2022年",
				s_ju: "全局",
				listtype:"线路",
				s_zd: "",
				s_cj: "",
				s_gq: "",
				yData1:[],
				tootipTimer:null,
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
			// this.myChart.on('click', (params) => {
			// 	this.getData('公里标', params.name);
			// });
			this.getData("站段", '全局');

		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			chooseleft(name,seq){
				this.listtype=name;
				this.yData1=[];
				// this.$refs.myL1.changetype(seq);
				// this.$refs.myL2.changetype(seq);
				// this.$refs.myL3.changetype(seq);
				if(name=="线路"){
					// this.title1="工区质量排序"
					// this.gq="清白江巡养工区"
					this.xData = ["成渝", "成昆", '川黔', '泸昆', '黔桂'];
					this.yData1 = this.getValues(this.xData.length);
					// this.initCharts();
				}else{
					// this.title1="车间质量排序"
					// this.gq="青白江线路车间"
					this.xData = ["成都工务段", "绵阳工务段", '重庆工务段', '凯里工务段', '遂宁工务段'];
					this.yData1 = this.getValues(this.xData.length);
				}
				// this.yData1.splice(0,this.yData1.length)
				// this.yData2.splice(0,this.yData2.length)
				// this.yData3.splice(0,this.yData3.length)
				// this.yData4.splice(0,this.yData4.length)
				// this.yData5.splice(0,this.yData5.length)
				// this.yData6.splice(0,this.yData6.length)
				// this.yData7.splice(0,this.yData7.length)
				// this.yData8.splice(0,this.yData8.length)
				// this.yData9.splice(0,this.yData9.length)
				// this.yData10.splice(0,this.yData10.length)
				// this.yData11.splice(0,this.yData11.length)
				// this.yData12.splice(0,this.yData12.length)
				// this.getData();
				// this.initCharts1();
				// this.initCharts2();
				// this.initCharts3();
				this.initCharts();
			},
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
					this.xData = ["成渝", "成昆", '川黔', '泸昆', '黔桂'];
				} else if (this.curView === "工区") {
					this.s_ju = "";
					this.xData = ["工区1", "工区2", '工区3', '工区4', '工区5', '工区6', '工区7', '工区8', '工区9', '工区10', '工区11', '工区12'];
				} else if (this.curView === "车间") {
					this.s_ju = "";
					this.xData = ["车间1", "车间2", '车间3', '车间4', '车间5', '车间6', '车间7', '车间8', '车间9', '车间10'];
				}else if(this.curView==="公里标"){
					this.s_ju = "";
					this.xData = ["K1+21~K2+323", "K2+21~K3+323","K4+21~K4+323","K4+21~K5+323","K5+21~K6+323","K6+21~K7+323"];
				}
				this.yData1 = this.getValues(this.xData.length);
				this.yData2 = this.getValues(this.xData.length);
				this.yData3 = this.getValues(this.xData.length);
				this.yData4 = this.getValues(this.xData.length);
				this.initCharts();
			},
			initCharts() {
				let option = {
					title: {},
					color: colorArr,
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
						// 			`<div style='font-size:8px;color:#00e6e6;'>${v.seriesName}:${v.value}</div>`
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
						bottom: 8,
						top: 30,
						containLabel: true
					},
					legend: {
						textStyle: {
							fontSize: 15,
							color: "#ffffff",
						},
						left: 15,
						top: -4,
						// bottom:50,
						itemGap:5,
						itemHeight:8,
						itemWidth: 15,
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
						axisLabel: {
							color: "#eaeff2",
							fontSize: 12,
							interval: 0,
						},
						axisTick: {
							show: true,
							inside: true,
						},
						splitLine: {
							lineStyle: {
								color: "#48a0c5",
							}
						},
						triggerEvent: true
					},
					series: [{
							name: '排行末五',
							type: 'bar',
							// stack: '排行',
							// 鼠标进入高亮当前项
							// emphasis: {
							// 	focus: 'series'
							// },
							data: this.yData1
						},
						// {
						// 	name: '总体病害',
						// 	type: 'bar',
						// 	stack: '排行',
						// 	data: this.yData2
						// },
						// {
						// 	name: 'Ⅲ级',
						// 	type: 'bar',
						// 	stack: '排行',
						// 	data: this.yData3
						// },
						// {
						// 	name: 'Ⅳ级',
						// 	type: 'bar',
						// 	stack: '排行',
						// 	data: this.yData4
						// },
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
	.box {
		background: url(img2/右边框.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
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
	}
	.left-list {
		position:absolute;
		width: 50%;
		margin-top: 5px;
		height: 0px;
		display: flex;
		/* color: #0096ff; */
		background: url(img2/工区质量.png)no-repeat;
		background-size: auto;
		background-position: right top;
		/* margin: 80 auto; */
		margin-left: 270px;
		padding-left: 110px;
		padding-bottom: 50px;
		padding-top: 3px;
		text-align: center;
		justify-content: space-around;
		z-index: 1;
	}
	.left-list>.wz{
		cursor: pointer;
		font-size: 14px;
		padding-left: 0px;
		/* padding-top: 10px; */
		/* height: 100px; */
		/* width: 100px; */
	}
	.left-list>.wz.active{
		/* background: url(./img2/jianbian.png)no-repeat; */
		background-position: center 5px;
		color: #0a97bb;
	}
</style>