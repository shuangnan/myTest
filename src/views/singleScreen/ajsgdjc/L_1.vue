<template>

	<div style="position: relative;width:100%;height:100%;padding: 20px 10px 90px 10px;" class="box">
		<div class="title">线路质量排序</div>
		<div class="title2" @click="open">更多详情>></div>
		<!-- <div style="position: absolute;;left:0;bottom:;width:100%;height: 90px;flex-direction:column;justify-content: space-between;"> -->
			<!-- <img class="img" src="./img2/1.gif" />
			<div class="xianl">线路数<div>10条</div>
			</div> -->
		<!-- </div> -->
		<div style="position: absolute;top:23px;left:10px;bottom:;width:200px;height: 90px;flex-direction:column;justify-content: space-between;" v-show="tableData.length>=8">
			<div style="font-size: 15px;color: #d0c5e3; text-shadow:0px 0px 10px #0000FF, 0 0 20px #fff ; -webkit-user-select: none;-webkit-user-select: none;">排行前4</div>
			<div class="kk" style="margin-top: 10px;">
				<div :class="rank1_name.length>2?'name2':'name'" >{{rank1_name}}</div>
				<div class="num" style="cursor: pointer;" :title="rank1_name">{{rank1_num}}</div>
				<div ref="chart1" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 135px;" v-show="tableData.length>=8"></div>
			</div>
			<div class="kk">
				<div :class="rank2_name.length>2?'name2':'name'">{{rank2_name}}</div>
				<div class="num" style="cursor: pointer;" :title="rank2_name">{{rank2_num}}</div>
				<div ref="chart2" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 135px;" v-show="tableData.length>=8"></div>
			</div>
			<div class="kk">
				<div :class="rank3_name.length>2?'name2':'name'">{{rank3_name}}</div>
				<div class="num" style="cursor: pointer;" :title="rank3_name">{{rank3_num}}</div>
				<div ref="chart3" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 135px;" v-show="tableData.length>=8"></div>
			</div>
			<div class="kk">
				<div :class="rank4_name.length>2?'name2':'name'">{{rank4_name}}</div>
				<div class="num" style="cursor: pointer;" :title="rank4_name">{{rank4_num}}</div>
				<div ref="chart4" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 135px;" v-show="tableData.length>=8"></div>
			</div>
			<!-- <div class="kk">
				<div :class="rank5_name.length>2?'name2':'name'">{{rank5_name}}</div>
				<div class="num" style="cursor: pointer;" :title="rank5_name">{{rank5_num}}</div>
				<div ref="chart5" style="width:55px;height:8px;position: absolute; margin-top: -11px;margin-left: 95px;"></div>
			</div> -->
		</div>
		<div style="position: absolute;top:23px;left:10px;bottom:;width:200px;height: 90px;flex-direction:column;justify-content: space-between;" v-show="tableData.length<8">
					<!-- <div style="font-size: 15px;color: #d0c5e3; text-shadow:0px 0px 10px #0000FF, 0 0 20px #fff ; -webkit-user-select: none;-webkit-user-select: none;">排行前4</div> -->
					<div class="kk" style="margin-top: 15px;"v-show="tableData.length>=1">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #e80808;font-weight: bolder;">1</div>
						<div :class="rank1_name.length>2?'name2':'name'" >{{rank1_name}}</div>
						<div class="num" style="cursor: pointer;" :title="rank1_name">{{rank1_num}}</div>
						<div ref="chart20" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 137px;"></div>
					</div>
					<div class="kk" v-show="tableData.length>=2">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #ddb940;font-weight: bolder;">2</div>
						<div :class="rank2_name.length>2?'name2':'name'">{{rank2_name}}</div>
						<div class="num" style="cursor: pointer;" :title="rank2_name">{{rank2_num}}</div>
						<div ref="chart21" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 137px;"></div>
					</div>
					<div class="kk" v-show="tableData.length>=3">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #6acbf8;font-weight: bolder;">3</div>
						<div :class="rank3_name.length>2?'name2':'name'">{{rank3_name}}</div>
						<div class="num" style="cursor: pointer;" :title="rank3_name">{{rank3_num}}</div>
						<div ref="chart22" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 137px;"></div>
					</div>
					<div class="kk" v-show="tableData.length>=4">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #6acbf8;font-weight: bolder;">4</div>
						<div :class="rank4_name.length>2?'name2':'name'">{{rank4_name}}</div>
						<div class="num" style="cursor: pointer;" :title="rank4_name">{{rank4_num}}</div>
						<div ref="chart23" style="width:55px;height:8px;position: absolute; margin-top: -13px;margin-left: 137px;"></div>
					</div>
				</div>
				
		<div style="position: absolute;top:23px;left:280px;bottom:;width:200px;height: 90px;flex-direction:column;justify-content: space-between;"  v-show="tableData.length>=8">
			<div style="font-size:15px;color:#d0c5e3;padding-left:140px;text-shadow:0px 0px 10px #0000FF, 0 0 20px #fff;-webkit-user-select: none;">排行末4</div>
			<div class="kk1" style="margin-top: 10px;">
				<div :class="rank6_name.length>2?'name2':'name'" style="cursor: pointer;" :title="rank6_name">{{rank6_name}}</div>
				<div class="num" >{{rank6_num}}</div>
				<div ref="chart6" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 3px;" v-show="tableData.length>=8"></div>
			</div>
			<div class="kk1">
				<div :class="rank7_name.length>2?'name2':'name'"  style="cursor: pointer;" :title="rank7_name">{{rank7_name}}</div>
				<div class="num">{{rank7_num}}</div>
				<div ref="chart7" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 3px;" v-show="tableData.length>=8"></div>
			</div>
			<div class="kk1">
				<div :class="rank8_name.length>2?'name2':'name'" style="cursor: pointer;" :title="rank8_name">{{rank8_name}}</div>
				<div class="num" >{{rank8_num}}</div>
				<div ref="chart8" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 3px;" v-show="tableData.length>=8"></div>
			</div>
			<div class="kk1">
				<div :class="rank9_name.length>2?'name2':'name'" style="cursor: pointer;" :title="rank9_name">{{rank9_name}}</div>
				<div class="num" >{{rank9_num}}</div>
				<div ref="chart9" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 3px;" v-show="tableData.length>=8"></div>
			</div>
			<!-- <div class="kk1">
				<div :class="rank10_name.length>2?'name2':'name'" style="cursor: pointer;" :title="rank10_name">{{rank10_name}}</div>
				<div class="num" >{{rank10_num}}</div>
				<div ref="chart10" style="width:55px;height:8px;position: absolute;margin-top: -11px; margin-left: 3px;"></div>
			</div> -->
		</div>
		<div style="position: absolute;top:23px;left:280px;bottom:;width:200px;height: 90px;flex-direction:column;justify-content: space-between;" v-show="tableData.length<8">
					<div class="kk" style="margin-top: 15px;" v-show="tableData.length>=5">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #6acbf8;font-weight: bolder;">5</div>
						<div :class="rank6_name.length>2?'name2':'name'" style="cursor: pointer;" :title="rank6_name">{{rank6_name}}</div>
						<div class="num" >{{rank6_num}}</div>
						<div ref="chart24" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 137px;"></div>
					</div>
					<div class="kk" v-show="tableData.length>=6">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #6acbf8;font-weight: bolder;">6</div>
						<div :class="rank7_name.length>2?'name2':'name'"  style="cursor: pointer;" :title="rank7_name">{{rank7_name}}</div>
						<div class="num">{{rank7_num}}</div>
						<div ref="chart25" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 137px;"></div>
					</div>
					<div class="kk" v-show="tableData.length>=7">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #6acbf8;font-weight: bolder;">7</div>
						<div :class="rank8_name.length>2?'name2':'name'" style="cursor: pointer;" :title="rank8_name">{{rank8_name}}</div>
						<div class="num" >{{rank8_num}}</div>
						<div ref="chart26" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 137px;"></div>
					</div>
					<div class="kk" v-show="tableData.length>=8">
						<div style="position: absolute; padding-top: 7px;font-size: 17px;margin-left: -18px;color: #6acbf8;font-weight: bolder;">8</div>
						<div :class="rank9_name.length>2?'name2':'name'" style="cursor: pointer;" :title="rank9_name">{{rank9_name}}</div>
						<div class="num" >{{rank9_num}}</div>
						<div ref="chart27" style="width:55px;height:8px;position: absolute;margin-top: -13px; margin-left: 137px;"></div>
					</div>
					</div>
					
					
		<div class="dialog_diy" style="height: 300px;">
			<el-dialog :visible.sync="dialogIsVisible" append-to-body width="700px" style="padding-right: 0px;" height="800px"
			 :before-close="()=>{this.dialogIsVisible=false;}" append-to-body="false">
				<div style="width: 100%;height: 800px;overflow-y: ; background-color: #030e22;">
					<el-table :data="tableData" ref="mytable" size="mini" fit border highlight-current-row height="calc(100% - 0px)"
					 :row-class-name="tableRowClassName"
					 class="my-table">
					 @row-click="rowClickEv"
					 <!-- :header-cell-style="{'border-right':'0px solid lightgray','border-bottom':'0px solid lightgray','border-left':'0px solid lightgray',color:'#5a87a9',}"> -->
						<el-table-column label="线名" align="center" prop="lineName"></el-table-column>
						<el-table-column label="排行" align="center" prop="rownum"></el-table-column>
						<el-table-column label="评分" align="center" prop="score"></el-table-column>
						</el-table-column>
					</el-table>
				</div>
			</el-dialog>
		</div>



	</div>
</template>

<script>
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/chart/bar';
	import "echarts/lib/chart/scatter";
	import C from "../../../assets/com.js"
	import axios from 'axios'
	export default {
		data() {
			return {
				rank1_name: '',
				rank2_name: '',
				rank3_name: '',
				rank4_name: '',
				rank5_name: '',
				rank6_name: '',
				rank7_name: '',
				rank8_name: '',
				rank9_name: '',
				rank10_name: '',
				dialogIsVisible: false,
				rank1_num:'',
				rank2_num:'',
				rank3_num:'',
				rank4_num:'',
				rank5_num:'',
				rank6_num:'',
				rank7_num:'',
				rank8_num:'',
				rank9_num:'',
				rank10_num:'',
				name:'I级快速(普速)',
				tableData: [
					// {
					// 	LINE_NAME: "成昆",
					// 	rank: "1",
					// 	defen: "99"
					// },
					// {
					// 	LINE_NAME: "沪昆",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "沪昆",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "沪昆",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "沪昆",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "沪昆",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "沪昆",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "成昆",
					// 	rank: "1",
					// 	defen: "99"
					// },
					// {
					// 	LINE_NAME: "成昆",
					// 	rank: "1",
					// 	defen: "99"
					// },
				
				],
				yData1: [],
				yData2: [],
				yData3: [],
				yData4: [],
				yData5: [],
				yData6: [],
				yData7: [],
				yData8: [],
				yData9: [],
				yData10: [],
				notall:[],
				myChart1: null,
				myChart2: null,
				myChart3: null,
				myChart4: null,
				myChart5: null,

				myChart6: null,
				myChart7: null,
				myChart8: null,
				myChart9: null,
				myChart10: null,
				myChart20: null,
				myChart21: null,
				myChart22: null,
				myChart23: null,
				myChart24: null,
				
				myChart25: null,
				myChart26: null,
				myChart27: null,
				type: 1, //默认为1，1为Ⅰ级快速，2为Ⅰ级重载，3为Ⅱ级，4为Ⅲ级，5为Ⅳ级，6为Ⅴ级
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			// this.getData1();
			setTimeout(()=>{
				this.myChart1 = this.$echarts.init(this.$refs.chart1);
				this.myChart2 = this.$echarts.init(this.$refs.chart2);
				this.myChart3 = this.$echarts.init(this.$refs.chart3);
				this.myChart4 = this.$echarts.init(this.$refs.chart4);
				// this.myChart5 = this.$echarts.init(this.$refs.chart5);
				
				this.myChart6 = this.$echarts.init(this.$refs.chart6);
				this.myChart7 = this.$echarts.init(this.$refs.chart7);
				this.myChart8 = this.$echarts.init(this.$refs.chart8);
				this.myChart9 = this.$echarts.init(this.$refs.chart9);
				// this.myChart10 = this.$echarts.init(this.$refs.chart10);
				
				
				
				this.initCharts1();
				this.initCharts2();
			},800)
			
			this.getXQ()
			
			// this.getData();
		},
		created() {
			// this.getData1();
			this.getDatabykys();
		},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			getDatabykys(){
				// var that = this
				axios.get('https://10.192.34.79/kys119/external/getLineQualityScoreListByYearAndMonth?year=2022&month=10')
				.then((response)=>{
					console.log("科研所接口数据")
					console.log(response.data.data)
					this.tableData=response.data.data
					console.log(this.tableData)
					if(this.name==='I级快速(普速)'){
						console.log("I级快速(普速)")
						this.tableData=this.tableData.filter(v=>v.source===1&&v.score>0&&v.lineLevel.includes("快速")&&v.departmentName.includes("成都局集团公司"))
						console.log(this.tableData)
					}else if(this.name==='I级快速(高铁)'){
						this.tableData=this.tableData.filter(v=>v.source===1&&v.score>0&&v.lineLevel.includes("高铁")&&v.departmentName.includes("成都局集团公司"))
					}else if(this.name==='I级重载'){
						this.tableData=this.tableData.filter(v=>v.source===1&&v.score>0&&v.lineLevel.includes("重载")&&v.departmentName.includes("成都局集团公司"))
					}else if(this.name==='II级'){
						this.tableData=this.tableData.filter(v=>v.source===1&&v.score>0&&v.lineLevel==="II级"&&v.departmentName.includes("成都局集团公司"))
					}else if(this.name==='III级'){
						this.tableData=this.tableData.filter(v=>v.source===1&&v.score>0&&v.lineLevel.includes("III级")&&v.departmentName.includes("成都局集团公司"))
					}else if(this.name==='IV级'){
						this.tableData=this.tableData.filter(v=>v.source===1&&v.score>0&&v.lineLevel.includes("IV级")&&v.departmentName.includes("成都局集团公司"))
					}
					
					// console.log(this.tableData)
					// // this.tableData=Array.from(new Set(this.tableData))
					// // const map = new Map()
					// // this.tableData=this.tableData.filter(key=>!map.has(key.lineName)&&map.set(key.lineName,1))
					this.tableData.sort(function(a,b){
						return b.score - a.score
					})
					for(let i=0;i<this.tableData.length;i++){
						this.tableData[i].rownum=i+1
						// console.log(this.tableData[i].source)
					}
					console.log(this.tableData)
					let l = this.tableData.length
					this.rank1_num=''
					this.rank2_num=''
					this.rank3_num=''
					this.rank4_num=''
					this.rank5_num=''
					this.rank6_num=''
					this.rank7_num=''
					this.rank8_num=''
					this.rank9_num=''
					this.rank10_num=''
					this.rank1_name=''
					this.rank2_name=''
					this.rank3_name=''
					this.rank4_name=''
					this.rank5_name=''
					this.rank6_name=''
					this.rank7_name=''
					this.rank8_name=''
					this.rank9_name=''
					this.rank10_name=''
					// myChart1=null
					if(this.tableData.length>=8){
						this.rank1_name=this.tableData[0].lineName
						this.rank2_name=this.tableData[1].lineName
						this.rank3_name=this.tableData[2].lineName
						this.rank4_name=this.tableData[3].lineName
						// this.rank5_name=this.tableData[0].lineName
						// this.rank6_name=res.data['1'][5].LINE_NAME
						this.rank6_name=this.tableData[l-4].lineName
						this.rank7_name=this.tableData[l-3].lineName
						this.rank8_name=this.tableData[l-2].lineName
						this.rank9_name=this.tableData[l-1].lineName
						
						this.rank1_num=this.tableData[0].score
						this.rank2_num=this.tableData[1].score
						this.rank3_num=this.tableData[2].score
						this.rank4_num=this.tableData[3].score
						// this.rank5_num=res.data['1'][4].BASE_SCORE
						// this.rank6_num=res.data['1'][5].BASE_SCORE
						this.rank6_num=this.tableData[l-4].score
						this.rank7_num=this.tableData[l-3].score
						this.rank8_num=this.tableData[l-2].score
						this.rank9_num=this.tableData[l-1].score
						this.initCharts1();
						this.initCharts2();
					}else{
						if(this.tableData.length>=1){
							this.rank1_name=this.tableData[0].lineName
							this.rank1_num=this.tableData[0].score
							this.myChart20 = this.$echarts.init(this.$refs.chart20);
							this.initCharts20();
						}
						if(this.tableData.length>=2){
							this.rank2_name=this.tableData[1].lineName
							this.rank2_num=this.tableData[1].score
							this.myChart21 = this.$echarts.init(this.$refs.chart21);
							this.initCharts21();
						}
						if(this.tableData.length>=3){
							this.rank3_name=this.tableData[2].lineName
							this.rank3_num=this.tableData[2].score
							this.myChart22 = this.$echarts.init(this.$refs.chart22);
							this.initCharts22();
						}
						if(this.tableData.length>=4){
							this.rank4_name=this.tableData[3].lineName
							this.rank4_num=this.tableData[3].score
							this.myChart23 = this.$echarts.init(this.$refs.chart23);
							this.initCharts23();
						}
						if(this.tableData.length>=5){
							this.rank6_name=this.tableData[4].lineName
							this.rank6_num=this.tableData[4].score
							this.myChart24 = this.$echarts.init(this.$refs.chart24);
							this.initCharts24();
						}
						if(this.tableData.length>=6){
							this.rank7_name=this.tableData[5].lineName
							this.rank7_num=this.tableData[5].score
							this.myChart25 = this.$echarts.init(this.$refs.chart25);
							this.initCharts25();
						}
						if(this.tableData.length>=7){
							this.rank8_name=this.tableData[6].lineName
							this.rank8_num=this.tableData[6].score
							this.myChart26 = this.$echarts.init(this.$refs.chart26);
							this.initCharts26();
						}
					}
					
				})

			},
			open() {
				this.dialogIsVisible = true
			},
			getXQ(){
				C.getData({
				  s: 
				    [[this.name]],
				  
					url:"https://10.192.126.203/GeneralProServlet",
					c:'ajsdp_zhaoyue2007',
				}, res=>{
					// this.loading =false;
				  console.log("线路详情")
				  console.log(res)
				  
				  for(let i=0;i<res.data['1'].length;i++){
					  // Number(this.tableData[i].rownum).toFixed(0)
					  // parseInt(res.data['1'][i].rownum)
					  res.data['1'][i].rownum=i+1
				  }
				// this.tableData=res.data['1']
				});
			},
			/**-------------------------获取数据-------------------------------*/



			changetype(name) {
				this.name=name
				this.getDatabykys()
			},

			initCharts1() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank1_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};

				let option2 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],

					},
					yAxis: {
						type: 'category',

					},
					series: [{
						data: [this.rank2_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				let option3 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',

					},
					series: [{
						data: [this.rank3_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				let option4 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',

					},
					series: [{
						data: [this.rank4_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				let option5 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',

					},
					series: [{
						data: [this.rank5_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart1.setOption(option1);
				this.myChart2.setOption(option2);
				this.myChart3.setOption(option3);
				this.myChart4.setOption(option4);
				// this.myChart5.setOption(option5);
			},
			initCharts20() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank1_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart20.setOption(option1);
			},
			initCharts21() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank2_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart21.setOption(option1);
			},
			initCharts22() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank3_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart22.setOption(option1);
			},
			initCharts23() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank4_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart23.setOption(option1);
			},
			initCharts24() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank6_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart24.setOption(option1);
			},
			initCharts25() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank7_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart25.setOption(option1);
			},
			initCharts26() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank8_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart26.setOption(option1);
			},
			initCharts27() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						max: 100,
						show: false,
						data: ['one'],
					},
					yAxis: {
						type: 'category',
					},
					series: [{
						data: [this.rank9_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart27.setOption(option1);
			},

			initCharts2() {
				let option1 = {
					title: {},
					yAxis: {
						type: 'category',
					},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max:100
					},

					series: [{
						data: [this.rank6_num],
						type: 'bar',
						showBackground: true,
						color: '#54400e',
						backgroundStyle: {
							color: 'rgba(23, 17, 16, 204)'
						}
					}],
				};
				let option2 = {
					title: {},
					yAxis: {
						type: 'category',
					},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100
					},

					series: [{
						data: [this.rank7_num],
						type: 'bar',
						showBackground: true,
						color: '#54400e',
						backgroundStyle: {
							color: 'rgba(23, 17, 16, 204)'
						}
					}],
				};
				let option3 = {
					title: {},
					yAxis: {
						type: 'category',
					},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100
					},

					series: [{
						data: [this.rank8_num],
						type: 'bar',
						showBackground: true,
						color: '#54400e',
						backgroundStyle: {
							color: 'rgba(23, 17, 16, 204)'
						}
					}],
				};
				let option4 = {
					title: {},
					yAxis: {
						type: 'category',
					},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100
					},

					series: [{
						data: [this.rank9_num],
						type: 'bar',
						showBackground: true,
						color: '#54400e',
						backgroundStyle: {
							color: 'rgba(23, 17, 16, 204)'
						}
					}],
				};
				let option5 = {
					title: {},
					yAxis: {
						type: 'category',

					},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100
					},

					series: [{
						data: [this.rank10_num],
						type: 'bar',
						showBackground: true,
						color: '#54400e',
						backgroundStyle: {
							color: 'rgba(23, 17, 16, 204)'
						}
					}],
				};
				this.myChart6.setOption(option1);
				this.myChart7.setOption(option2);
				this.myChart8.setOption(option3);
				this.myChart9.setOption(option4);
				// this.myChart10.setOption(option5);
			},
			tableRowClassName({row,rowIndex}){
			  if(rowIndex%2===1){
				  return 'jinagli'
			  }else{
				  return 'tongbao'
			  }
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
		background: url(img2/左边标题.png)no-repeat;
		background-size: auto 20px;
		padding-top: 20px;
	}

	.title {
		margin-top: -35px;
		margin-left: -22px;
		font-size: 16px;
		padding-top: 10px;
		color: #bccde6;
		/* background-image: linear-gradient(#9eefff, #98cac4); */
		-webkit-background-clip: text;
		/* color: transparent; */
		-webkit-user-select: none;
	}
	.title2 {
		margin-top: -30px;
		margin-left: 400px;
		font-size: 15px;
		padding-top: 10px;
		/* color: #1ae3ff; */
		/* background-image: linear-gradient(#1ae3ff,#2f7aca); */
		-webkit-background-clip: text;
		/* color: transparent; */
		color: #d0c5e3;
		text-shadow: 0px 0px 10px #0000FF, 0 0 20px #fff;
		-webkit-user-select: none;
		cursor: pointer;
	}

	.img {
		display: inline-block;
		margin-top: 20px;
		-webkit-user-select: none;
		width: 130px;
	}

	.xianl {
		font-size: 12px;
		color: #bad9de;
		padding-left: 45px;
		margin-bottom: 30px;
		margin-top: -5px;
		-webkit-user-select: none;
	}

	.xianl>div {
		font-size: 19px;
		color: #bad9de;
		padding-top: 5px;
		margin-left: -3px;
		text-shadow: 0px 0px 10px #0000FF, 0 0 20px #fff;
		/* background-image: radial-gradient(#022483, rgba(1, 7, 19, .8)); */
	}

	.kk {
		margin-top: 4px;
		height: 32px;
		width: 212px;
		background: url(img2/组 144.png)no-repeat;
		background-size: auto;
		/* flex-direction: row; */
		/* display: inline-block; */
		-webkit-user-select: none;
	}

	.kk>.name {
		font-size: 16px;
		color: #d0c5e3;
		width: 60px;
		padding-left: 15px;
		padding-top: 5px;
	}
	.kk>.name2 {
		font-size: 16px;
		color: #d0c5e3;
		width: 75px;
		padding-left: 10px;
		padding-top: 5px;
		overflow: hidden;
		-webkit-line-clamp: 1;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.kk>.num {
		position: absolute;
		font-size: 15px;
		color: #d0c5e3;
		margin-top: -18px;
		text-align: center;
		width: 10px;
		padding-left: 125px;
		direction: rtl;
	}

	.kk>.chart {
		position: absolute;
		padding-left: 102px;

	}

	.kk1 {
		margin-top: 4px;
		height: 32px;
		width: 212px;
		background: url(img2/组 145.png)no-repeat;
		background-size: auto;
		/* flex-direction: row; */
		/* display: inline-block; */
		-webkit-user-select: none;
	}

	.kk1>.name {
		font-size: 16px;
		color: #d0c5e3;
		padding-left: 160px;
		padding-top: 5px;
	}
	.kk1>.name2 {
		font-size: 16px;
		color: #d0c5e3;
		padding-left: 130px;
		padding-top: 5px;
	}

	.kk1>.num {
		position: absolute;
		font-size: 15px;
		color: #d0c5e3;
		margin-top: -18px;
		padding-left: 80px;
	}
</style>

<style>
	.el-dialog__header {

		background-color: salmon;
		/* padding: -20px 0px 0px; */
		display: none;
	}

	.dialog_diy .el-dialog__body {
		/* background-color: red; */
		/* display: none; */
	}

	.el-dialog__footer {
		display: none;
	}

	/* 	.dialog_diy .el-table__body{
		background-color: red;
	} */
	.el-table,
	.el-table__expanded-cell {
		background-color: transparent;
		color: white;
	}

	.el-table__body tr:hover>td {
		background-color: #002140 !important;
	}

	.el-table th,
	.el-table tr {
		background-color: transparent;
	}

	.el-table__row>td {
		border: none;
	}

	.el-table th.is-leaf {
		border: none;
	}

	.el-table::before {
		height: 0px;
		border: none;
	}

	.el-table--border {
		border: 0px;
		border: none;
	}

	.el-table--border::after {
		border: 0px;
		display: none;
	}

	.el-dialog__body {
		padding: 30px 20px;
		color: #606266;
		font-size: 14px;
		word-break: break-all;
		border: 1px solid #00008B;
		border-radius: 80px;
	}
	.jinagli{
		color: #20edff;
		font-size: 15px;
	}
	.tongbao{
		color: #ffffff;
		font-size: 15px;
	}
</style>
