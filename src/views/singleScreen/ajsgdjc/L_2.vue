<template>
	<div style="position: relative;width:100%;height:100%;padding: 30px 10px 90px 10px;" class="box">
		<div class="title">站段质量排序</div>
		<div class="title2" @click="open">更多详情>></div>
		<!-- <div style="position: absolute;;left:0;bottom:;width:100%;height: 90px;flex-direction:column;justify-content: space-between;">
			<img class="img" src="./img2/2.gif" />
			<div class="xianl">{{pjf}}</div>
			<div class="xianldiv">站段平均分</div>
		</div> -->


		<div style="display: flex;flex-direction: row; width: 100%;padding-top: 10px;position: absolute;">
			<div style="width: 25%;font-size: 15px;">排行</div>
			<div style="width: 35%;font-size: 15px;">站段</div>
			<div style="width: 25%;font-size: 15px;">分值</div>
		</div>
		<div style="display: flex;flex-direction: column;width: 85%;height: 210px;margin-top: 35px;margin-left:-10px ;">
			<div style="display: flex;flex-direction: row; background:rgba(45, 77, 150, 0.15) ;width: 100%;height: 50px;" v-if="show6">
				<div style="position: absolute; padding-top: 7px;font-size: 17px;padding-left: 16px;color: #e80808;font-weight: bolder;">{{rankword1}}</div>
				<div style="position: absolute; padding-top: 7px;font-size: 16px;padding-left: 16px;color: #ffffff;padding-left: 75px;">{{rank1_name}}</div>
				<div style="position: absolute; padding-top: 10px;font-size: 15px;padding-left: 15px;color: #ffffff;padding-left: 255px;">{{rank1_num}}</div>
				<div ref="chart1" style="width:85px;height:22px;position: absolute; padding-top: 13px;margin-left:295px ;z-index: 5;"></div>
			</div>
			<div style="display: flex;flex-direction: row; background:rgba(45, 77, 150, 0.15) ;width: 100%;height: 50px;padding-top: 1px;" v-if="show7">
				<div style="position: absolute; padding-top: 7px;font-size: 17px;padding-left: 16px;color: #e80808;font-weight: bolder;">{{rankword2}}</div>
				<div style="position: absolute; padding-top: 7px;font-size: 16px;padding-left: 16px;color: #ffffff;padding-left: 75px;">{{rank2_name}}</div>
				<div style="position: absolute; padding-top: 10px;font-size: 15px;padding-left: 15px;color: #ffffff;padding-left: 255px;">{{rank2_num}}</div>
				<div ref="chart2" style="width:85px;height:22px;position: absolute; padding-top: 13px;margin-left:295px ;z-index: 5;"></div>
			</div>
			<div style="display: flex;flex-direction: row; background:rgba(45, 77, 150, 0.15) ;width: 100%;height: 50px;padding-top: 1px;" v-if="show8">
				<div style="position: absolute; padding-top: 7px;font-size: 17px;padding-left: 16px;color: #e80808;font-weight: bolder;">{{rankword3}}</div>
				<div style="position: absolute; padding-top: 7px;font-size: 16px;padding-left: 16px;color: #ffffff;padding-left: 75px;">{{rank3_name}}</div>
				<div style="position: absolute; padding-top: 10px;font-size: 15px;padding-left: 15px;color: #ffffff;padding-left: 255px;">{{rank3_num}}</div>
				<div ref="chart3" style="width:85px;height:22px;position: absolute; padding-top: 13px;margin-left:295px ;z-index: 5;"></div>
			</div>
			<div style="display: flex;flex-direction: row; background:rgba(45, 77, 150, 0.15) ;width: 100%;height: 50px;padding-top: 1px;" v-if="show9">
				<div style="position: absolute; padding-top: 7px;font-size: 17px;padding-left: 16px;color: #e80808;font-weight: bolder;">{{rankword4}}</div>
				<div style="position: absolute; padding-top: 7px;font-size: 16px;padding-left: 16px;color: #ffffff;padding-left: 75px;">{{rank4_name}}</div>
				<div style="position: absolute; padding-top: 10px;font-size: 15px;padding-left: 15px;color: #ffffff;padding-left: 255px;">{{rank4_num}}</div>
				<div ref="chart4" style="width:85px;height:22px;position: absolute; padding-top: 13px;margin-left:295px ;z-index: 5;"></div>
			</div>
			<div style="display: flex;flex-direction: row; background:rgba(45, 77, 150, 0.15) ;width: 100%;height: 50px;padding-top: 1px;" v-if="show10">
				<div style="position: absolute; padding-top: 7px;font-size: 17px;padding-left: 16px;color: #e80808;font-weight: bolder;">{{rankword5}}</div>
				<div style="position: absolute; padding-top: 7px;font-size: 16px;padding-left: 16px;color: #ffffff;padding-left: 75px;">{{rank5_name}}</div>
				<div style="position: absolute; padding-top: 10px;font-size: 15px;padding-left: 15px;color: #ffffff;padding-left: 255px;">{{rank5_num}}</div>
				<div ref="chart5" style="width:85px;height:22px;position: absolute; padding-top: 13px;margin-left:295px ;z-index: 5;"></div>
			</div>
		</div>
		<div style="position: absolute;top:150px;left:430px;bottom:;width:100px;height: 90px;flex-direction:row;justify-content: space-between;cursor: pointer;">
			<img @click="changeData()" class="imgl2" src="./img2/right.png" />
			<div class="xianl" @click="changeData()">{{word1}}</div>
		</div>
		<div class="dialog_diy" style="height: 300px;">
			<el-dialog :visible.sync="dialogIsVisible" append-to-body width="700px" style="padding-right: 0px;" height="800px"
			 :before-close="()=>{this.dialogIsVisible=false;}">
				<div style="width: 100%;height: 800px;overflow-y: ; background-color: #030e22;">
					<el-table :data="tableData" ref="mytable" size="mini" fit border highlight-current-row height="calc(100% - 0px)"
					 :row-class-name="tableRowClassName" class="my-table" :header-cell-style="{'border-right':'0px solid lightgray','border-bottom':'0px solid lightgray','border-left':'0px solid lightgray',color:'#5a87a9',}">
						<el-table-column label="段名" align="center" prop="departmentName"></el-table-column>
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
	import 'echarts/lib/chart/radar';
	import "echarts/lib/chart/scatter";
	import C from "../../../assets/com.js"
	import axios from 'axios'
	export default {
		data() {
			return {
				myChart1: null,
				myChart2: null,
				myChart3: null,
				myChart4: null,
				myChart5: null,
				show6:true,
				show7:true,
				show8:true,
				show9:true,
				show10:true,
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
				rankword1:'1',
				rankword2:'2',
				rankword3:'3',
				rankword4:'4',
				rankword5:'5',
				xData1: [], //X轴数据
				yData1: [], //Y轴数据
				xData2: [], //X轴数据
				yData2: [], //Y轴数据
				name: 'I级快速(普速)',
				pjf: '',
				word1:'排行末五',
				rank: 1, //1为前六，0为末六
				dialogIsVisible: false,
				tableData: [
					// {
					// 	LINE_NAME: "成都工务段",
					// 	rank: "1",
					// 	defen: "99"
					// },
					// {
					// 	LINE_NAME: "绵阳工务段",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "凯里工务段",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "重庆工务段",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "贵阳工务段",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "贵阳高铁工务段",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "贵阳高铁工务段",
					// 	rank: "2",
					// 	defen: "98"
					// },
					// {
					// 	LINE_NAME: "贵阳高铁工务段",
					// 	rank: "1",
					// 	defen: "99"
					// },
					// {
					// 	LINE_NAME: "贵阳高铁工务段",
					// 	rank: "1",
					// 	defen: "99"
					// },

				],
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			setTimeout(()=>{
				
				
				// this.myChart6 = this.$echarts.init(this.$refs.chart6);
				// this.myChart7 = this.$echarts.init(this.$refs.chart7);
				// this.myChart8 = this.$echarts.init(this.$refs.chart8);
				// this.myChart9 = this.$echarts.init(this.$refs.chart9);
				// this.myChart10 = this.$echarts.init(this.$refs.chart10);
				
				
				
				this.initCharts20();
			},800)
			// this.myChart1 = this.$echarts.init(this.$refs.chart1);
			// this.myChart2 = this.$echarts.init(this.$refs.chart2);
			// this.getData();
			// this.getData1()
			// this.getpjf()
			// this.getXQ()
		},
		created() {
			this.getDatabykys()
		},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			getDatabykys() {
				// var that = this
				axios.get('https://10.192.34.79/kys119/external/getLineQualityScoreListByYearAndMonth?year=2022&month=10')
					.then((response) => {
						// console.log("科研所接口数据")
						// console.log(response.data.data)
						this.tableData = response.data.data
						// console.log(this.tableData)
						if (this.name === 'I级快速(普速)') {
							this.tableData = this.tableData.filter(v => v.source === 2 && v.score > 0 && v.lineLevel.includes("快速") && v.departmentName
								.includes("段"))
						} else if (this.name === 'I级快速(高铁)') {
							this.tableData = this.tableData.filter(v => v.source === 2 && v.score > 0 && v.lineLevel.includes("高铁") && v.departmentName
								.includes("段"))
						} else if (this.name === 'I级重载') {
							this.tableData = this.tableData.filter(v => v.source === 2 && v.score > 0 && v.lineLevel.includes("重载") && v.departmentName
								.includes("段"))
						} else if (this.name === 'II级') {
							this.tableData = this.tableData.filter(v => v.source === 2 && v.score > 0 && v.lineLevel === "II级" && v.departmentName
								.includes("段"))
						} else if (this.name === 'III级') {
							this.tableData = this.tableData.filter(v => v.source === 2 && v.score > 0 && v.lineLevel.includes("III级") && v.departmentName
								.includes("段"))
						} else if (this.name === 'IV级') {
							this.tableData = this.tableData.filter(v => v.source === 2 && v.score > 0 && v.lineLevel.includes("IV级") && v.departmentName
								.includes("段"))
						}
						// for(let i=0;i<this.tableData.length;i++){
						// 	if(this.tableData[i].source===2){
						// 		console.log("站段")
						// 		console.log(this.tableData[i])
						// 	}
						// }

						// console.log(this.tableData)
						// // this.tableData=Array.from(new Set(this.tableData))
						// const map = new Map()
						// this.tableData=this.tableData.filter(key=>!map.has(key.departmentName)&&map.set(key.departmentName,1))
						this.tableData.sort(function(a, b) {
							return b.score - a.score
						})
						for (let i = 0; i < this.tableData.length; i++) {
							this.tableData[i].rownum = i + 1
							this.tableData[i].departmentName = this.tableData[i].departmentName + "(" + this.tableData[i].lineName.slice(0,
								2) + ")"
							// console.log(this.tableData[i].source)
						}
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
						// if(this.tableData.length>=10){
						// 	this.word1 = "排行末五";
						// }else{
						// 	this.word1 = "下一页";
						// }
						if(this.tableData.length>=10){
							 let tmp = this.tableData.length
							if(this.rank===1){
								this.rank1_name=this.tableData[0].departmentName
								this.rank1_num=Number(this.tableData[0].score).toFixed(2)
								this.rank2_name=this.tableData[1].departmentName
								this.rank2_num=Number(this.tableData[1].score).toFixed(2)
								this.rank3_name=this.tableData[2].departmentName
								this.rank3_num=Number(this.tableData[2].score).toFixed(2)
								this.rank4_name=this.tableData[3].departmentName
								this.rank4_num=Number(this.tableData[3].score).toFixed(2)
								this.rank5_name=this.tableData[4].departmentName
								this.rank5_num=Number(this.tableData[4].score).toFixed(2)
								this.initCharts20()
									this.word1 = "排行末五";
							}else{
								this.rank1_name= this.tableData[tmp - 1].departmentName
								this.rank2_name=this.tableData[tmp - 2].departmentName
								this.rank3_name=this.tableData[tmp - 3].departmentName
								this.rank4_name=this.tableData[tmp - 4].departmentName
								this.rank5_name=this.tableData[tmp - 5].departmentName
								this.rank1_num=Number(this.tableData[tmp - 1].score).toFixed(2)
								this.rank2_num=Number(this.tableData[tmp - 2].score).toFixed(2)
								this.rank3_num=Number(this.tableData[tmp - 3].score).toFixed(2)
								this.rank4_num=Number(this.tableData[tmp - 4].score).toFixed(2)
								this.rank5_num=Number(this.tableData[tmp - 5].score).toFixed(2)
								this.initCharts20()
									this.word1 = "排行前五";
							}
						}else{
							let tmp = this.tableData.length
							if(this.rank===1){
								this.rank1_name=this.tableData[0].departmentName
								this.rank1_num=Number(this.tableData[0].score).toFixed(2)
								this.rank2_name=this.tableData[1].departmentName
								this.rank2_num=Number(this.tableData[1].score).toFixed(2)
								this.rank3_name=this.tableData[2].departmentName
								this.rank3_num=Number(this.tableData[2].score).toFixed(2)
								this.rank4_name=this.tableData[3].departmentName
								this.rank4_num=Number(this.tableData[3].score).toFixed(2)
								this.rank5_name=this.tableData[4].departmentName
								this.rank5_num=Number(this.tableData[4].score).toFixed(2)
								this.initCharts20()
								this.word1 = "下一页";
								// console.log("rank===1")
							}else{
								if(this.tableData.length===6){
									this.rank1_name=this.tableData[5].departmentName
									this.rank1_num=Number(this.tableData[5].score).toFixed(2)
									this.show6=true
									this.show7=false
									this.show8=false
									this.show9=false
									this.show10=false
									this.initCharts21()
								}else if(this.tableData.length===7){
									this.rank1_name=this.tableData[5].departmentName
									this.rank1_num=Number(this.tableData[5].score).toFixed(2)
									this.rank2_name=this.tableData[6].departmentName
									this.rank2_num=Number(this.tableData[6].score).toFixed(2)
									this.show6=true
									this.show7=true
									this.show8=false
									this.show9=false
									this.show10=false
									this.initCharts21()
									this.initCharts22()
								}else if(this.tableData.length===8){
									this.rank1_name=this.tableData[5].departmentName
									this.rank1_num=Number(this.tableData[5].score).toFixed(2)
									this.rank2_name=this.tableData[6].departmentName
									this.rank2_num=Number(this.tableData[6].score).toFixed(2)
									this.rank3_name=this.tableData[7].departmentName
									this.rank3_num=Number(this.tableData[7].score).toFixed(2)
									this.show6=true
									this.show7=true
									this.show8=true
									this.show9=false
									this.show10=false
									this.initCharts21()
									this.initCharts22()
									this.initCharts23()
								}else if(this.tableData.length===9){
									this.rank1_name=this.tableData[5].departmentName
									this.rank1_num=Number(this.tableData[5].score).toFixed(2)
									this.rank2_name=this.tableData[6].departmentName
									this.rank2_num=Number(this.tableData[6].score).toFixed(2)
									this.rank3_name=this.tableData[7].departmentName
									this.rank3_num=Number(this.tableData[7].score).toFixed(2)
									this.rank4_name=this.tableData[8].departmentName
									this.rank4_num=Number(this.tableData[8].score).toFixed(2)
									this.show6=true
									this.show7=true
									this.show8=true
									this.show9=true
									this.show10=false
									this.initCharts21()
									this.initCharts22()
									this.initCharts23()
									this.initCharts24()
								}
							}
						}
						
						
						// this.xData1.splice(0, this.xData1.length)
						// this.xData2.splice(0, this.xData2.length)
						// this.yData1.splice(0, this.yData1.length)
						// this.yData2.splice(0, this.yData2.length)
						// let tmp = this.tableData.length
						// console.log("L_2")
						// console.log(this.tableData)
						// this.xData1.push(this.tableData[4].departmentName)
						// this.xData1.push(this.tableData[3].departmentName)
						// this.xData1.push(this.tableData[2].departmentName)
						// this.xData1.push(this.tableData[1].departmentName)
						// this.xData1.push(this.tableData[0].departmentName)
						// this.xData2.push(this.tableData[tmp - 1].departmentName)
						// this.xData2.push(this.tableData[tmp - 2].departmentName)
						// this.xData2.push(this.tableData[tmp - 3].departmentName)
						// this.xData2.push(this.tableData[tmp - 4].departmentName)
						// this.xData2.push(this.tableData[tmp - 5].departmentName)
						// this.yData1.push(Number(this.tableData[4].score).toFixed(2))
						// this.yData1.push(Number(this.tableData[3].score).toFixed(2))
						// this.yData1.push(Number(this.tableData[2].score).toFixed(2))
						// this.yData1.push(Number(this.tableData[1].score).toFixed(2))
						// this.yData1.push(Number(this.tableData[0].score).toFixed(2))

						// this.yData2.push(Number(this.tableData[tmp - 1].score).toFixed(2))
						// this.yData2.push(Number(this.tableData[tmp - 2].score).toFixed(2))
						// this.yData2.push(Number(this.tableData[tmp - 3].score).toFixed(2))
						// this.yData2.push(Number(this.tableData[tmp - 4].score).toFixed(2))
						// this.yData2.push(Number(this.tableData[tmp - 5].score).toFixed(2))
						// this.initCharts1();
						// this.initCharts2();

					})
			},
			changeData() {
				console.log("changedeat")
				console.log(this.tableData.length)
				if (this.rank === 1) {
					if(this.tableData.length===6){
						this.rank = 0;
						// this.word1 = "排行前五";
						this.word1 = "上一页";
						// this.word2 = "排行末5"
						this.show6=true
						this.show7=false
						this.show8=false
						this.show9=false
						this.show10=false
						this.rankword1="6"
						this.rankword2="末2"
						this.rankword3="末3"
						this.rankword4="末4"
						this.rankword5="末5"
						this.getDatabykys()
					}else if(this.tableData.length===7){
						this.rank = 0;
						// this.word1 = "排行前五";
						this.word1 = "上一页";
						// this.word2 = "排行末5"
						this.show6=true
						this.show7=true
						this.show8=false
						this.show9=false
						this.show10=false
						this.rankword1="6"
						this.rankword2="7"
						this.rankword3="末3"
						this.rankword4="末4"
						this.rankword5="末5"
						this.getDatabykys()
					}else if(this.tableData.length===8){
						this.rank = 0;
						// this.word1 = "排行前五";
						this.word1 = "上一页";
						// this.word2 = "排行末5"
						this.show6=true
						this.show7=true
						this.show8=true
						this.show9=false
						this.show10=false
						this.rankword1="6"
						this.rankword2="7"
						this.rankword3="8"
						this.rankword4="末4"
						this.rankword5="末5"
						this.getDatabykys()
					}else if(this.tableData.length===9){
						this.rank = 0;
						// this.word1 = "排行前五";
						this.word1 = "上一页";
						// this.word2 = "排行末5"
						this.show6=true
						this.show7=true
						this.show8=true
						this.show9=true
						this.show10=false
						this.rankword1="6"
						this.rankword2="7"
						this.rankword3="8"
						this.rankword4="9"
						this.rankword5="末5"
						this.getDatabykys()
					}else if(this.tableData.length>=10){
						this.rank = 0;
						this.word1 = "排行前五";
						// this.word2 = "排行末5"
						this.show6=true
						this.show7=true
						this.show8=true
						this.show9=true
						this.show10=true
						this.rankword1="末1"
						this.rankword2="末2"
						this.rankword3="末3"
						this.rankword4="末4"
						this.rankword5="末5"
						this.getDatabykys()
					}
					else{
						this.rank = 0;
						this.word1 = "排行前五";
						// this.word2 = "排行末5"
						
						this.rankword1="末1"
						this.rankword2="末2"
						this.rankword3="末3"
						this.rankword4="末4"
						this.rankword5="末5"
						this.getDatabykys()
					}
					
				} else {
					if(this.tableData.length>=10){
						this.rank = 1;
						this.word1 = "排行末五";
						// this.word2 = "排行前5"
						this.rankword1="1"
						this.rankword2="2"
						this.rankword3="3"
						this.rankword4="4"
						this.rankword5="5"
						this.show10=true
						this.show6=true
						this.show7=true
						this.show8=true
						this.show9=true
						this.getDatabykys()
					}else{
						this.rank = 1;
						this.word1 = "下一页";
						// this.word2 = "排行前5"
						this.rankword1="1"
						this.rankword2="2"
						this.rankword3="3"
						this.rankword4="4"
						this.rankword5="5"
						this.show10=true
						this.show6=true
						this.show7=true
						this.show8=true
						this.show9=true
						this.getDatabykys()
					}
					
				}
			},
			open() {
				this.dialogIsVisible = true
			},
			
			getXQ() {
				C.getData({
					s: [
						[this.name]
					],

					url: "https://10.192.126.203/GeneralProServlet",
					c: 'ajsdp_zhaoyue2008',
				}, res => {
					// this.loading =false;
					console.log("线路详情2")
					console.log(res)

					for (let i = 0; i < res.data['1'].length; i++) {
						// Number(this.tableData[i].rownum).toFixed(0)
						// parseInt(res.data['1'][i].rownum)
						res.data['1'][i].rownum = i + 1
					}
					// this.tableData = res.data['1']
				});
			},
			/**-------------------------获取数据-------------------------------*/
			getData1() {
				C.getData({
					s: [
						[this.name, "2022", "10"]
					],
					url: "https://10.192.126.203/GeneralProServlet",
					c: 'ajsdp_zhaoyue2002',
				}, res => {
					// this.loading =false;

					console.log("接口数据2.1")
					console.log(res)
					this.xData1.splice(0, this.xData1.length)
					this.xData2.splice(0, this.xData2.length)
					this.yData1.splice(0, this.yData1.length)
					this.yData2.splice(0, this.yData2.length)
					// console.log("fengge")
					// console.log(res.data['1'][0].DEPARTMENT_NAME.split('-',3))
					// let arr1=res.data['1'][0].DEPARTMENT_NAME.split('-',3)
					// let arr2=res.data['1'][1].DEPARTMENT_NAME.split('-',3)
					// let arr3=res.data['1'][2].DEPARTMENT_NAME.split('-',3)
					// let arr4=res.data['1'][3].DEPARTMENT_NAME.split('-',3)
					// let arr5=res.data['1'][4].DEPARTMENT_NAME.split('-',3)
					// this.xData1.push(arr1[0])
					// this.xData1.push(arr2[0])
					// this.xData1.push(arr3[0])
					// this.xData1.push(arr4[0])
					// this.xData1.push(arr5[0])
					// if (this.name === 'III级' || this.name === 'IV级') {
					// 	this.xData1.push(res.data['1'][0].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][1].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][2].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][3].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][4].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][5].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][2].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][3].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][4].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][5].DEPARTMENT_NAME)
					// 	this.yData1.push(Number(res.data['1'][0].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][1].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][2].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][3].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][4].BASE_SCORE).toFixed(2))

					// 	this.yData2.push(Number(res.data['1'][5].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][2].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][3].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][4].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][5].BASE_SCORE).toFixed(2))
					// 	this.initCharts1();
					// 	this.initCharts2();
					// } else {
					// 	this.xData1.push(res.data['1'][0].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][1].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][2].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][3].DEPARTMENT_NAME)
					// 	this.xData1.push(res.data['1'][4].DEPARTMENT_NAME)




					// 	this.xData2.push(res.data['1'][5].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][6].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][7].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][8].DEPARTMENT_NAME)
					// 	this.xData2.push(res.data['1'][9].DEPARTMENT_NAME)

					// 	this.yData1.push(Number(res.data['1'][0].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][1].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][2].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][3].BASE_SCORE).toFixed(2))
					// 	this.yData1.push(Number(res.data['1'][4].BASE_SCORE).toFixed(2))

					// 	this.yData2.push(Number(res.data['1'][5].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][6].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][7].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][8].BASE_SCORE).toFixed(2))
					// 	this.yData2.push(Number(res.data['1'][9].BASE_SCORE).toFixed(2))
					// 	this.initCharts1();
					// 	this.initCharts2();
					// }

					// this.rank1=res.data['1'];
					// this.rank1_name=res.data['1'][0].LINE_NAME
					// this.rank2_name=res.data['1'][1].LINE_NAME
					// this.rank3_name=res.data['1'][2].LINE_NAME
					// this.rank4_name=res.data['1'][3].LINE_NAME
					// this.rank5_name=res.data['1'][4].LINE_NAME
					// this.rank6_name=res.data['1'][5].LINE_NAME
					// this.rank7_name=res.data['1'][6].LINE_NAME
					// this.rank8_name=res.data['1'][7].LINE_NAME
					// this.rank9_name=res.data['1'][8].LINE_NAME
					// this.rank10_name=res.data['1'][9].LINE_NAME

					// this.rank1_num=res.data['1'][0].BASE_SCORE
					// this.rank2_num=res.data['1'][1].BASE_SCORE
					// this.rank3_num=res.data['1'][2].BASE_SCORE
					// this.rank4_num=res.data['1'][3].BASE_SCORE
					// this.rank5_num=res.data['1'][4].BASE_SCORE
					// this.rank6_num=res.data['1'][5].BASE_SCORE
					// this.rank7_num=res.data['1'][6].BASE_SCORE
					// this.rank8_num=res.data['1'][7].BASE_SCORE
					// this.rank9_num=res.data['1'][8].BASE_SCORE
					// this.rank10_num=res.data['1'][9].BASE_SCORE
					// this.getData();
					// console.log(this.rank1)
				});
			},
			getpjf() {
				C.getData({


					url: "https://10.192.126.203/GeneralProServlet",
					c: 'ajsdp_zhaoyue2005',
				}, res => {
					// this.loading =false;
					// console.log("接口数据2.2")
					// console.log(res)
					let pjf = res.data['1'][0].average_score
					// console.log(res.data['1'][0].average_score)
					this.pjf = Number(pjf).toFixed(1)
					// console.log(Number(pjf).toFixed(1))
				});

			},
			changetype(name) {
				this.name = name
				this.rank=0
				this.changeData()
				// this.yData1.splice(0,this.yData1.length)
				// this.yData2.splice(0,this.yData2.length)
				// this.getData1();
				// this.getXQ()
				// this.getDatabykys()
				// this.initCharts1();
				// this.initCharts2();
			},
			// 获取数据
			getValues(len) {
				const rs = [];
				for (let i = 0; i < len; i++) {
					rs.push((Math.random() * 500).toFixed(0))
				}
				return rs;
			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData(view, name) {
				this.xData1 = ["成都工务段", "绵阳工务段", '凯里工务段', '重庆工务段', '贵阳工务段'];
				this.yData1 = this.getValues(this.xData1.length);
				this.xData2 = ["成都工务段", "绵阳工务段", '凯里工务段', '重庆工务段', '贵阳工务段'];
				this.yData2 = this.getValues(this.xData2.length);
				this.initCharts1();
				this.initCharts2();
			},
			initCharts20() {
				this.myChart1 = this.$echarts.init(this.$refs.chart1);
				this.myChart2 = this.$echarts.init(this.$refs.chart2);
				this.myChart3 = this.$echarts.init(this.$refs.chart3);
				this.myChart4 = this.$echarts.init(this.$refs.chart4);
				this.myChart5 = this.$echarts.init(this.$refs.chart5);
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
							color: 'rgba(3, 34, 88, 204)',
							borderRadius: [0, 10, 10, 0]
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#3967ff'
								},
								{
									offset: 1,
									color: '#01faf7'
								}
							]),
							borderRadius: [10, 10, 10, 10]
						},
					},],
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
							color: 'rgba(3, 34, 88, 204)',
							borderRadius: [0, 10, 10, 0]
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#3967ff'
								},
								{
									offset: 1,
									color: '#01faf7'
								}
							]),
							borderRadius: [10, 10, 10, 10]
						},
					},],
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
							color: 'rgba(3, 34, 88, 204)',
							borderRadius: [0, 10, 10, 0]
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#3967ff'
								},
								{
									offset: 1,
									color: '#01faf7'
								}
							]),
							borderRadius: [10, 10, 10, 10]
						},
					},],
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
							color: 'rgba(3, 34, 88, 204)',
							borderRadius: [0, 10, 10, 0]
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#3967ff'
								},
								{
									offset: 1,
									color: '#01faf7'
								}
							]),
							borderRadius: [10, 10, 10, 10]
						},
					},],
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
							color: 'rgba(3, 34, 88, 204)',
							borderRadius: [0, 10, 10, 0]
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#3967ff'
								},
								{
									offset: 1,
									color: '#01faf7'
								}
							]),
							borderRadius: [10, 10, 10, 10]
						},
					},],
				};
				this.myChart1.setOption(option1);
				this.myChart2.setOption(option2);
				this.myChart3.setOption(option3);
				this.myChart4.setOption(option4);
				this.myChart5.setOption(option5);
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
						data: [this.rank1_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart1.setOption(option1);
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
						data: [this.rank2_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart2.setOption(option1);
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
						data: [this.rank3_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart3.setOption(option1);
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
						data: [this.rank4_num],
						type: 'bar',
						showBackground: true,
						color: '#6adbf8',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart4.setOption(option1);
			},
			initCharts1() {
				let option = {
					title: {},

					grid: {
						left: '5%',
						right: '16%',
						bottom: 5,
						top: 30,
						containLabel: true
					},
					legend: {
						show: false,
						textStyle: {
							fontSize: 10,
							color: "#ffffff"
						},
						left: 25,
						top: 0,
						itemHeight: 12,
					},
					yAxis: {
						type: 'category',
						boundaryGap: ['20%', '20%'],
						grid: {
							right: '20',
							containLabel: true,
						},
						axisLabel: {
							color: "#d1e5ff",
							fontSize: 15,
						},
						splitLine: {
							lineStyle: {
								color: "#09295a",
							}
						},
						data: this.xData1,
					},
					xAxis: {
						type: 'value',
						boundaryGap: ['20%', '20%'],
						grid: {
							right: '20',
							containLabel: true,
						},
						data: this.xData1,
						splitLine: false,
						axisLabel: {
							color: "#4d94cb",
							fontSize: 13,
							interval: 0,
							show: false,
							// formatter: function(v) {
							// 	// return v.split("").join("\n")
							// 	var val = "";
							// 	if (v.length > 7) {
							// 		val = v.substr(0, 5) + '..';
							// 		return val.split("").join("\n");
							// 	} else {
							// 		return v.split("").join("\n");
							// 	}

							// }
						},
					},
					series: [{
						name: '考核',
						type: 'bar',
						label: {
							show: true,
							position: "right",
							offset: [0, 0],
							textStyle: {
								fontSize: 13,
								color: "#ffffff",
							},
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#3967ff'
								},
								{
									offset: 1,
									color: '#01faf7'
								}
							]),
							borderRadius: [0, 10, 10, 0]
						},
						data: this.yData1
					}, ],
				};
				this.myChart1.setOption(option);

			},

			initCharts2() {
				let option = {
					title: {},
					// tooltip: {
					// 	trigger: 'axis',
					// 	backgroundColor: "rgba(52, 94, 127, 0.8)",
					// 	className: '',
					// 	borderWidth: 0,
					// 	textStyle: {
					// 		color: '#fff',
					// 	},
					// 	formatter: function(params) {
					// 		var items = [];
					// 		params.forEach(v => {
					// 			items.push(
					// 				`<div style='font-size:8px;color:#00e6e6;'>${v.value}</div>`
					// 			);
					// 		})
					// 		var rs = `<div style='width:180px;height:180px;'>
					// 			  <div>${params[0].axisValueLabel}</div>
					// 			  ${items.join("")}
					// 			</div>`;
					// 		return rs;
					// 	},
					// 	position: function(point, params, dom, rect, size) {
					// 		return [point[0] - 1, point[1]];
					// 	},
					// },
					grid: {
						left: '5%',
						right: '16%',
						bottom: 5,
						top: 30,
						containLabel: true
					},
					legend: {
						show: false,
						textStyle: {
							fontSize: 10,
							color: "#ffffff",
						},
						left: 25,
						top: 0,
						itemHeight: 12,
					},
					yAxis: {
						type: 'category',
						boundaryGap: ['20%', '20%'],
						axisLabel: {
							color: "#d1e5ff",
							fontSize: 15,
						},
						splitLine: {
							lineStyle: {
								color: "#09295a",
							}
						},
						data: this.xData2,
					},
					xAxis: {
						type: 'value',
						boundaryGap: ['20%', '20%'],
						grid: {
							right: '20',
							containLabel: true,
						},
						data: this.xData2,
						splitLine: false,
						axisLabel: {
							color: "#60bdff",
							fontSize: 12,
							interval: 0,
							show: false,
							// formatter: function(v) {
							// 	// return v.split("").join("\n")
							// 	var val = "";
							// 	if (v.length > 7) {
							// 		val = v.substr(0, 5) + '..';
							// 		return val.split("").join("\n");
							// 	} else {
							// 		return v.split("").join("\n");
							// 	}

							// }
						},
					},
					series: [{
						name: '考核',
						type: 'bar',
						label: {
							show: true,
							position: "right",
							textStyle: {
								fontSize: 13,
								color: "#ffffff",
							},
						},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#d65185'
								},
								{
									offset: 1,
									color: '#fd981f'
								}
							]),
							borderRadius: [0, 10, 10, 0]
						},
						data: this.yData2
					}, ],
				};
				this.myChart2.setOption(option);
				// window.tools.loopShowTooltip(this.myChart1, option, {
				// 	loopSeries: true
				// });
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (rowIndex % 2 === 1) {
					return 'jinagli'
				} else {
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
		color: #bccde6;
		/* background-image: linear-gradient(#1ae3ff, #2f7aca); */
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

/* 	.img {
		display: inline-block;
		margin-top: 40px;
		-webkit-user-select: none;
		width: 125px;
	} */

	.xianl{
		position: absolute;
		width: 1px;
		margin-top: -55px;
		padding-left: 40px;
		color: #d0c5e3; 
		font-size: 16px;
		text-shadow:0px 0px 10px #0000FF, 0 0 20px #fff ;
		-webkit-user-select: none;
	}

	.xianldiv {
		/* font-size: 19px;
		color: #bad9de;
		padding-top: 5px;
		margin-left: -3px;
		text-shadow: 0px 0px 10px #0000FF, 0 0 20px #fff; */
		/* background-image: radial-gradient(#022483, rgba(1, 7, 19, .8)); */
		position: absolute;
		font-size: 12px;
		padding-left: 35px;
		margin-top: -25px;
		color: #bad9de;
		-webkit-user-select: none;
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

	.jinagli {
		color: #20edff;
		font-size: 15px;
	}

	.tongbao {
		color: #ffffff;
		font-size: 15px;
	}

	.chartsty1 {
		width: 210px;
		height: 205px;
		margin-left: -45px;
		position: absolute;
	}

	.chartsty2 {
		width: 210px;
		height: 230px;
		margin-left: -45px;
		position: absolute;
	}


</style>
