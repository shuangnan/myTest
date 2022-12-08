<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		设备故障分析
 -->
<template>
	<div ref="con" class="temp">
		<tabs ref="myTabs" :tabsList="[{id:0,text:'设备故障数量分析'},{id:1,text:'设备故障类型比例'}]" @titleClick="changeView" style="height: 30px;"></tabs>
		<el-carousel ref="myCarousel" indicator-position="none" :height="carouselHeight" :autoplay="false" arrow="never">
			<el-carousel-item>
				<div ref="chart1" style="width: 100%;height: 100%;"> </div>
			</el-carousel-item>
			<el-carousel-item>
				<div ref="chart2" style="width: 100%;height: 100%;"> </div>
			</el-carousel-item>
		</el-carousel>
		<el-dialog append-to-body :close-on-click-modal="true" :visible.sync="visible" title="时刻表" width="1000px" custom-class="blue-dialog" @close="visible=false">
			<div class="blue-table no-border">
				<el-table size="mini" :data="tableData" border stripe tooltip-effect="light" :height="600">
					<el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
					<template v-for="h in tableHead">
						<el-table-column :prop="h.field" :label="h.title" :align="h.align" :width="h.width" show-overflow-tooltip></el-table-column>
					</template>
				</el-table>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import tabs from "../../../components/bigScreen/KydTabs";
	// 这里引用各种资源
	import 'echarts/lib/component/title';
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/bar';
	import 'echarts/lib/chart/pie';
	// import 'echarts/lib/chart/line';
	import "echarts/lib/chart/scatter";
	import C from "../../../assets/com.js";
	export default {
		// 组件
		components: {tabs},
		// 数据仓库
		data() {
			return {
				visible:false,
				tableHead:[],
				tableData:[],
				url: "http://10.192.6.156:9090/PTMSREPORT/GeneralProServlet",
				urlEq:"http://10.192.6.156:9090/PTMS/GeneralProServlet",
				carouselHeight: "300px",
				chart1: null,
				chart2: null,
				timer:null,
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			const h = this.$refs.con.offsetHeight - 20;
			this.carouselHeight = h + "px";
			this.$nextTick(()=>{
				this.initChart1();
				this.initChart2();
				this.getData();
			});
			if(this.timer===null){
				this.timer = setInterval(()=>{
					const temp = {id:this.curView===0?1:0};
					this.$refs.myTabs.setActiveItem(temp.id);
					this.changeView(temp);
				},1000*15);
			}
		},
		// 方法
		methods: {
			changeView(item){
				this.curView = item.id;
				this.$refs.myCarousel.setActiveItem(item.id);
			},
			/* @info  事件处理区-----------------------------------*/
			initChart1() {
				this.chart1 = this.$echarts.init(this.$refs.chart1);
				var option = {
					title: {
						// text:"数量分析",
						textStyle:{
							color: "#ffffff",
							fontSize: 14,
						}
					},
					color: ['#7BC0F2', '#DF9499'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						},
						//	        formatter: "{b} <br/> {a0} : {c0} <br/> {a1} : {c1} <br/> 故障比例 ：{c1/c0}"
						formatter: function(params) {
							var per = ((params[1].value / params[0].value) * 100).toFixed(2) + '%';
							return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' +
								params[1].seriesName + ' : ' + params[1].value + '<br/>故障比例  : ' + per;
						},
						backgroundColor:"transparent",
						borderWidth:0,
						className:'tooltipBGColor',
						textStyle:{
						  color:'#fff',
						}
					},
					legend: {
						orient: 'horizontal',
						left: 'center',
						data: ['设备总数','故障数'],
						textStyle:{
							color: "#ffffff",
							fontSize: 14,
						}
					},
					grid: {
						top: '40px',
						left: '5%',
						right: '5%',
						bottom: '5%',
						containLabel: true
					},
					xAxis: [{
						type: 'value',
						axisLabel: {
						  color: "#ffffff",
						  fontSize: 12,
						  interval: 0,
						},
					}],
					yAxis: [{
						type: 'category',
						data: [],
						triggerEvent: true,
						axisTick: {
							alignWithLabel: true
						},
						axisLabel: {
						  color: "#ffffff",
						  fontSize: 12,
						  fontWeight: 700,
						},
					}],
					series: [{
							name: '设备总数',
							type: 'bar',
							barWidth: '40%',
							label: {
								normal: {
									show: true,
									position: 'right',
									textStyle:{
										color:"#7BC0F2"
									}
								},
							},
							
							data: []
						},
						{
							name: '故障数',
							type: 'bar',
							barWidth: '40%',
							label: {
								normal: {
									show: true,
									position: 'right',
									textStyle:{
										color:"#DF9499"
									}
								}
							},
							data: []
						}
					]
				};
				this.chart1.setOption(option);
				this.chart1.showLoading({
					text: '加载中...',
				});
			},
			initChart2(data) {
				this.chart2 = this.$echarts.init(this.$refs.chart2);
				this.chart2.on("click",(p)=>{
					this.getEq(p.data.deviceKind);
				});
				var option = {
					color: ["#615eff","#8986ff","#b0aeff","#d8d7ff",
					  "#4288ff","#68a0ff","#8eb7ff","#b3cfff","#d9e7ff",
					  "#53bdbf","#6efcff","#a8fdff","#c5feff","#e2feff",
					  "#45b3eb","#6ac2ed","#8fd2f1","#b5e1f6","#daf0fa"],
				    title : {
				        // text: '故障设备比例',
						textStyle:{
						  color:'#fff',
						  fontSize: 14,
						}
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)",
						backgroundColor:"transparent",
						borderWidth:0,
						className:'tooltipBGColor',
						textStyle:{
						  color:'#fff',
						}
				    },
				    series : [
				        {
				            name:'故障比例',
				            type:'pie',
				            radius : [20, 110],
				            center: ['49%', '55%'],
				            roseType : 'radius',
				            label: {
								// alignTo: 'edge',
								// minMargin: 5,
								// edgeDistance: 10,
								// lineHeight: 15,
								formatter: '{b|{b}}\n {c|{c}}\t\t{per|{d}%}',
								rich: {
								  b: {
								    color: '#3d99ff',
								    align: 'center',
								    fontSize: 14,
								  },
								  c: {
								    color: '#eee',
								    fontSize: 12,
								    align: 'right'
								  },
								  per: {
								    color: '#eee',
								    align: 'right',
								    fontSize: 12,
								  }
								},
				            },
				            data:[]
				        }
				    ]
				};
				this.chart2.setOption(option);
				this.chart2.showLoading({
					text: '加载中...',
				});
			},

			/* @info  数据处理区-----------------------------------*/
			setChartOption1(d){
				//   stns: ["桐梓北", "桐梓东", "娄山关南", "遵义", "遵义南", "息烽", "修文县"],
				const seq = {"TBE":0,"TDE":1,"LSE":2,"ZYE":3,"ZNE":4,"XFW":5,"XW0":6};
				const units = [0,0,0,0,0,0,0];
				const unitsTotal = [0,0,0,0,0,0,0];
				const unitsError = [0,0,0,0,0,0,0];
				C.$.each(d, function(i, v) {
					const _seq = seq[v.zMLM];
					if(typeof(_seq)!=="undefined"){
						units[_seq] = v.tEXT;
						unitsTotal[_seq] = v.deviceCount;
						unitsError[_seq] = v.allRepairDeviceCount;
					}
				});
				var option = this.chart1.getOption();
				option.yAxis[0].data = units.reverse();
				option.series[0].data = unitsTotal.reverse();
				option.series[1].data = unitsError.reverse();
				this.chart1.setOption(option, true);
				this.chart1.hideLoading();
			},
			setChartOption2(d){
				const pieData = [];
				C.$.each(d, function(i, v) {
					if (v.repairDeviceCount != 0) {
						pieData.push({
							value: parseInt(v.repairDeviceCount),
							name: v.fa_name,
							deviceKind:v.deviceKind
						});
					}
				});
				var option = this.chart2.getOption();
				option.series[0].data = pieData;
				this.chart2.setOption(option, true);
				this.chart2.hideLoading();
			},
			/* @info  数据交互区-----------------------------------*/
			getData() {
				C.getData({
					c: "D0121",
					s: ["19B8C3534E0E5665E0539106C00A58FD"],
					url: this.url,
				}, (d) => {
					console.log("【D0121】设备故障分析（数量）>>>", d);
					this.setChartOption1(d);
				});
				
				C.getData({
					c: "D0123",
					s: ["19B8C3534E0E5665E0539106C00A58FD"],
					url: this.url
				}, (d) => {
					console.log("【D0123】设备故障分析（类型）>>>", d);
					this.setChartOption2(d);
				});
			},
			getEq(deviceKind){
				C.getData({
					c: "1162",
					s: [deviceKind],
					url: this.urlEq,
				}, (d) => {
					this.tableHead = d;
					// align: "center",fa_code: "0128",field: "standard",title: "专业系统",width: "120",zmlm: "ALL"
					console.log("【1162】设备表头>>>", d);
					C.getData({
						c: "0530",
						s: ["19B8C3534E0E5665E0539106C00A58FD","",deviceKind],
						url: this.urlEq,
					}, (d) => {
						this.tableData = d;
						this.visible = true;
						console.log("【0530】设备数据>>>", d);
						
					});
				});
			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.temp {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		padding-top: 0px;
	}

	.srtitle {
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
	
</style>
<!-- 公有样式（会影响全局） -->
<style>
	.blue-table.no-border>.el-table{
		border-left:none;
	}
	
	.blue-dialog{
		background:#293066;
	}
	.blue-dialog .el-dialog__title{
		color:#fafafa;
	}
	.blue-dialog .el-dialog__body{
		border-color:transparent;
	}
</style>
