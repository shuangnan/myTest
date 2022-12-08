<template>
	<div style="position: relative;width:100%;height:100%;padding: 30px 10px 90px 10px;" class="box">
		<div class="title">{{title1}}</div>

		<div style="position: absolute;top:20px;left:0px;bottom:;width:100%;height: 90px;flex-direction:column;justify-content: space-between;">
			<div style="width: 90px;font-size: 16px;margin-left: 220px; padding-top: 12px;color: #d0c5e3;text-shadow: 0px 0px 10px #0000FF, 0 0 20px #fff;cursor: pointer;" @click="open">更多详情>></div>
		<div style="font-size: 16px;color: #d0c5e3;width: 100px;;margin-top: -20px; text-shadow:0px 0px 10px #0000FF, 0 0 20px #fff ;-webkit-user-select: none;-webkit-user-select: none;">{{word2}}</div>
			<div class="left-list" style="margin-top: -20px; height: 10px; -webkit-user-select: none; ">
				<div class="wz" :class="{active:listtype==='工区'}" style="width: 80px;" @click="chooseleft('工区',1)">工区质量</div>
				/
				<div class="wz" :class="{active:listtype==='车间'}" style="width: 80px;" @click="chooseleft('车间',2)">车间质量</div>
			</div>
			<div :class="rank ? 'kk' : 'kk3'" style="margin-top: 40px;">
				<div class="name">{{rank1_name}}</div>
				<div class="num">{{rank1_num}}</div>
				<div class="duan">{{rank1_duan}}</div>
				<div class="snum">1</div>
				<!-- <div v-show="rank===1" ref="chart1" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
				<!-- <div v-show="rank===0" ref="chart7" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
			</div>
			<div :class="rank ? 'kk' : 'kk3'" style="margin-top: 10px;">
				<div class="name">{{rank2_name}}</div>
				<div class="num">{{rank2_num}}</div>
				<div class="duan">{{rank2_duan}}</div>
				<div class="snum">2</div>
				<!-- <div v-show="rank===1" ref="chart2" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
				<!-- <div v-show="rank===0" ref="chart8" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
			</div>
			<div :class="rank ? 'kk2' : 'kk3'" style="margin-top: 10px;">
				<div class="name">{{rank3_name}}</div>
				<div class="num">{{rank3_num}}</div>
				<div class="duan">{{rank3_duan}}</div>
				<div class="snum">3</div>
				<!-- <div v-show="rank===1" ref="chart3" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
				<!-- <div v-show="rank===0" ref="chart9" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
			</div>
			<div :class="rank ? 'kk2' : 'kk3'" style="margin-top: 10px;">
				<div class="name">{{rank4_name}}</div>
				<div class="num">{{rank4_num}}</div>
				<div class="duan">{{rank4_duan}}</div>
				<div class="snum">4</div>
				<!-- <div v-show="rank===1" ref="chart4" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
				<!-- <div v-show="rank===0" ref="chart10" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div> -->
			</div>
			<!-- <div :class="rank ? 'kk2' : 'kk3'" style="margin-top: 10px;">
				<div class="name">{{rank5_name}}</div>
				<div class="num">{{rank5_num}}</div>
				<div class="duan">{{rank5_duan}}</div>
				<div class="snum">5</div>
				<div v-show="rank===1" ref="chart5" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div>
				<div v-show="rank===0" ref="chart11" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div>
			</div>
			<div :class="rank ? 'kk2' : 'kk3'" style="margin-top: 10px;">
				<div class="name">{{rank6_name}}</div>
				<div class="num">{{rank6_num}}</div>
				<div class="duan">{{rank6_duan}}</div>
				<div class="snum">6</div>
				<div v-show="rank===1" ref="chart6" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div>
				<div v-show="rank===0" ref="chart12" style="width:95px;height:5px;position: absolute; margin-top: 8px;margin-left: 268px;"></div>
			</div> -->

		</div>

		<div style="position: absolute;top:180px;left:450px;bottom:;width:100px;height: 90px;flex-direction:row;justify-content: space-between;">
			<img @click="changeData()" class="img" src="./img2/right.png" />
			<div class="xianl" @click="changeData()">{{word1}}</div>
		</div>
		
		<div class="dialog_diy" style="height: 300px;">
			<el-dialog :visible.sync="dialogIsVisible" append-to-body width="700px" style="padding-right: 0px;" height="800px"
			 :before-close="()=>{this.dialogIsVisible=false;}">
				<div style="width: 100%;height: 800px;overflow-y: ; background-color: #030e22;">
					<el-table :data="tableData" ref="mytable" size="mini" fit border highlight-current-row height="calc(100% - 0px)"
					 :row-class-name="tableRowClassName"
					 class="my-table"
					 
					 :header-cell-style="{'border-right':'0px solid lightgray','border-bottom':'0px solid lightgray','border-left':'0px solid lightgray',color:'#5a87a9',}">
						<el-table-column label="名称" align="center" prop="name"></el-table-column>
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
	import C from "../../../assets/com.js"
	import axios from 'axios'
	export default {
		data() {
			return {
				listtype: "工区",
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
				myChart11: null,
				myChart12: null,
				dialogIsVisible: false,
				tableData1:[],
				tableData: [
					{
						LINE_NAME: "成都工务段",
						rank: "1",
						defen: "99"
					},
					{
						LINE_NAME: "绵阳工务段",
						rank: "2",
						defen: "98"
					},
					{
						LINE_NAME: "凯里工务段",
						rank: "2",
						defen: "98"
					},
					{
						LINE_NAME: "重庆工务段",
						rank: "2",
						defen: "98"
					},
					{
						LINE_NAME: "贵阳工务段",
						rank: "2",
						defen: "98"
					},
					{
						LINE_NAME: "贵阳高铁工务段",
						rank: "2",
						defen: "98"
					},
					{
						LINE_NAME: "贵阳高铁工务段",
						rank: "2",
						defen: "98"
					},
					{
						LINE_NAME: "贵阳高铁工务段",
						rank: "1",
						defen: "99"
					},
					{
						LINE_NAME: "贵阳高铁工务段",
						rank: "1",
						defen: "99"
					},
				
				],
				gqtable:[
					// {
					// 	LINE_NAME: "xxx工区",
					// 	rank: "1",
					// 	defen: "99"
					// },
				],
				cjtable:[
					// {
					// 	LINE_NAME: "xxx车间",
					// 	rank: "1",
					// 	defen: "89"
					// }
				],
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
				rank1_duan: '',
				rank2_duan: '',
				rank3_duan: '',
				rank4_duan: '',
				rank5_duan: '',
				rank6_duan: '',
				rank1_num: '',
				rank2_num: '',
				rank3_num: '',
				rank4_num: '',
				rank5_num: '',
				rank6_num: '',
				rank7_num: '',
				rank8_num: '',
				rank9_num: '',
				rank10_num: '',
				name: 'I级快速(普速)',
				rank: 1, //1为前六，0为末六
				word1: "排行末四",
				word2: "排行前4",

				title1: "工区质量排序",
				gq: "清白江巡养工区",

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
				yData11: [],
				yData12: [],
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			
			// this.getData();
			// this.getData1()
			// this.myChart = this.$echarts.init(this.$refs.chart);

			setTimeout(()=>{
				// this.myChart1 = this.$echarts.init(this.$refs.chart1);
				// this.myChart2 = this.$echarts.init(this.$refs.chart2);
				// this.myChart3 = this.$echarts.init(this.$refs.chart3);
				
				
				
				// this.myChart4 = this.$echarts.init(this.$refs.chart4);
				// this.myChart5 = this.$echarts.init(this.$refs.chart5);
				// this.myChart6 = this.$echarts.init(this.$refs.chart6);
				
				
				// this.myChart7 = this.$echarts.init(this.$refs.chart7);
				// this.myChart8 = this.$echarts.init(this.$refs.chart8);
				// this.myChart9 = this.$echarts.init(this.$refs.chart9);
				// this.myChart10 = this.$echarts.init(this.$refs.chart10);
				// this.myChart11 = this.$echarts.init(this.$refs.chart11);
				// this.myChart12 = this.$echarts.init(this.$refs.chart12);
				// this.initCharts1();
				// this.initCharts2();
			},1000)
			// this.initCharts();
			

		},
		created() {
			// this.getData1()
			// this.getXQgq()
			// this.getXQcj()
			this.getDatabykys()
		},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			
				getDatabykys(){
					axios.get('https://10.192.34.79/kys119/external/getLineQualityScoreListByYearAndMonth?year=2022&month=10')
					.then((response)=>{
						console.log("科研所接口数据")
						// console.log(response.data.data)
						this.tableData=response.data.data
						// console.log(this.tableData)
						if(this.listtype === '工区'){
						if(this.name==='I级快速(普速)'){
							this.tableData=this.tableData.filter(v=>v.source===4&&v.score>0&&v.lineLevel.includes("快速")&&v.departmentName.includes("工区"))
						}else if(this.name==='I级快速(高铁)'){
							this.tableData=this.tableData.filter(v=>v.source===4&&v.score>0&&v.lineLevel.includes("高铁")&&v.departmentName.includes("工区"))
						}else if(this.name==='I级重载'){
							this.tableData=this.tableData.filter(v=>v.source===4&&v.score>0&&v.lineLevel.includes("重载")&&v.departmentName.includes("工区"))
						}else if(this.name==='II级'){
							this.tableData=this.tableData.filter(v=>v.source===4&&v.score>0&&v.lineLevel==="II级"&&v.departmentName.includes("工区"))
						}else if(this.name==='III级'){
							this.tableData=this.tableData.filter(v=>v.source===4&&v.score>0&&v.lineLevel.includes("III级")&&v.departmentName.includes("工区"))
						}else if(this.name==='IV级'){
							this.tableData=this.tableData.filter(v=>v.source===4&&v.score>0&&v.lineLevel.includes("IV级")&&v.departmentName.includes("工区"))
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
							this.tableData[i].tmpduan = this.tableData[i].departmentName.split('-',3)[0]
							this.tableData[i].name = this.tableData[i].departmentName
							this.tableData[i].departmentName=this.tableData[i].departmentName.split('-',3)[2]
							// console.log(tmpduan)
							// console.log(this.tableData[i].source)
						}
						console.log("L_3")
						console.log(this.tableData)
						let l = this.tableData.length
						if(this.rank===1){
							this.rank1_name=this.tableData[0].departmentName
							this.rank2_name=this.tableData[1].departmentName
							this.rank3_name=this.tableData[2].departmentName
							this.rank4_name=this.tableData[3].departmentName
							this.rank1_num=this.tableData[0].score
							this.rank2_num=this.tableData[1].score
							this.rank3_num=this.tableData[2].score
							this.rank4_num=this.tableData[3].score
							this.rank1_duan=this.tableData[0].tmpduan
							this.rank2_duan=this.tableData[1].tmpduan
							this.rank3_duan=this.tableData[2].tmpduan
							this.rank4_duan=this.tableData[3].tmpduan
						}else{
							this.rank1_name=this.tableData[l-4].departmentName
							this.rank2_name=this.tableData[l-3].departmentName
							this.rank3_name=this.tableData[l-2].departmentName
							this.rank4_name=this.tableData[l-1].departmentName
							this.rank1_num=this.tableData[l-4].score
							this.rank2_num=this.tableData[l-3].score
							this.rank3_num=this.tableData[l-2].score
							this.rank4_num=this.tableData[l-1].score
							this.rank1_duan=this.tableData[l-4].tmpduan
							this.rank2_duan=this.tableData[l-3].tmpduan
							this.rank3_duan=this.tableData[l-2].tmpduan
							this.rank4_duan=this.tableData[l-1].tmpduan
						}
						
						}else{
							if(this.name==='I级快速(普速)'){
								this.tableData=this.tableData.filter(v=>v.source===3&&v.score>0&&v.lineLevel.includes("普速")&&v.departmentName.includes("车间"))
							}else if(this.name==='I级快速(高铁)'){
								this.tableData=this.tableData.filter(v=>v.source===3&&v.score>0&&v.lineLevel.includes("高铁")&&v.departmentName.includes("车间"))
							}else if(this.name==='I级重载'){
								this.tableData=this.tableData.filter(v=>v.source===3&&v.score>0&&v.lineLevel.includes("重载")&&v.departmentName.includes("车间"))
							}else if(this.name==='II级'){
								this.tableData=this.tableData.filter(v=>v.source===3&&v.score>0&&v.lineLevel==="II级"&&v.departmentName.includes("车间"))
							}else if(this.name==='III级'){
								this.tableData=this.tableData.filter(v=>v.source===3&&v.score>0&&v.lineLevel.includes("III级")&&v.departmentName.includes("车间"))
							}else if(this.name==='IV级'){
								this.tableData=this.tableData.filter(v=>v.source===3&&v.score>0&&v.lineLevel.includes("IV级")&&v.departmentName.includes("车间"))
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
								this.tableData[i].tmpduan = this.tableData[i].departmentName.split('-',2)[0]
								this.tableData[i].name = this.tableData[i].departmentName
								this.tableData[i].departmentName=this.tableData[i].departmentName.split('-',2)[1]
								// console.log(tmpduan)
								// console.log(this.tableData[i].source)
							}
							console.log("L_3")
							console.log(this.tableData)
							let l = this.tableData.length
							if(this.rank===1){
								this.rank1_name=this.tableData[0].departmentName
								this.rank2_name=this.tableData[1].departmentName
								this.rank3_name=this.tableData[2].departmentName
								this.rank4_name=this.tableData[3].departmentName
								this.rank1_num=this.tableData[0].score
								this.rank2_num=this.tableData[1].score
								this.rank3_num=this.tableData[2].score
								this.rank4_num=this.tableData[3].score
								this.rank1_duan=this.tableData[0].tmpduan
								this.rank2_duan=this.tableData[1].tmpduan
								this.rank3_duan=this.tableData[2].tmpduan
								this.rank4_duan=this.tableData[3].tmpduan
							}else{
								this.rank1_name=this.tableData[l-4].departmentName
								this.rank2_name=this.tableData[l-3].departmentName
								this.rank3_name=this.tableData[l-2].departmentName
								this.rank4_name=this.tableData[l-1].departmentName
								this.rank1_num=this.tableData[l-4].score
								this.rank2_num=this.tableData[l-3].score
								this.rank3_num=this.tableData[l-2].score
								this.rank4_num=this.tableData[l-1].score
								this.rank1_duan=this.tableData[l-4].tmpduan
								this.rank2_duan=this.tableData[l-3].tmpduan
								this.rank3_duan=this.tableData[l-2].tmpduan
								this.rank4_duan=this.tableData[l-1].tmpduan
							}
						}
						
					})
								

			
			},
			open() {
				// if(this.listtype=="工区"){
				// 	this.tableData1=this.gqtable
				// }else{
				// 	this.tableData1=this.cjtable
				// }
				
				this.dialogIsVisible = true
			},
			getXQgq(){
				C.getData({
				  s: 
				    [[this.name]],
				  
					url:"https://10.192.126.203/GeneralProServlet",
					c:'ajsdp_zhaoyue2010',
				}, res=>{
					// this.loading =false;
				  console.log("工区详情")
				  console.log(res)
				  
				  for(let i=0;i<res.data['1'].length;i++){
					  // Number(this.tableData[i].rownum).toFixed(0)
					  // parseInt(res.data['1'][i].rownum)
					  res.data['1'][i].rownum=i+1
				  }
				this.gqtable=res.data['1']
				});
			},
			getXQcj(){
				C.getData({
				  s: 
				    [[this.name]],
				  
					url:"https://10.192.126.203/GeneralProServlet",
					c:'ajsdp_zhaoyue2009',
				}, res=>{
					// this.loading =false;
				  console.log("车间详情")
				  console.log(res)
				  
				  for(let i=0;i<res.data['1'].length;i++){
					  // Number(this.tableData[i].rownum).toFixed(0)
					  // parseInt(res.data['1'][i].rownum)
					  res.data['1'][i].rownum=i+1
				  }
				this.cjtable=res.data['1']
				});
			},
			getData1() {
				if (this.listtype === '工区') {
					C.getData({

						s: [
							[this.name]
						],
						url: "https://10.192.126.203/GeneralProServlet",
						c: 'ajsdp_zhaoyue2004',
					}, res => {
						// this.loading =false;
						console.log("接口数据3")
						console.log(this.name)
						console.log(res)
						this.tableData=res.data['1']
						// console.log("接口数据3table")
						// console.log(this.tableData)
						if(this.rank===1){
							let arr1=res.data['1'][0].DEPARTMENT_NAME.split('-',3)
							let arr2=res.data['1'][1].DEPARTMENT_NAME.split('-',3)
							let arr3=res.data['1'][2].DEPARTMENT_NAME.split('-',3)
							let arr4=res.data['1'][3].DEPARTMENT_NAME.split('-',3)
							let arr5=res.data['1'][4].DEPARTMENT_NAME.split('-',3)
							let arr6=res.data['1'][5].DEPARTMENT_NAME.split('-',3)
							// this.rank1_name = res.data['1'][0].DEPARTMENT_NAME
							// this.rank2_name = res.data['1'][1].DEPARTMENT_NAME
							// this.rank3_name = res.data['1'][2].DEPARTMENT_NAME
							// this.rank4_name = res.data['1'][3].DEPARTMENT_NAME
							// this.rank5_name = res.data['1'][4].DEPARTMENT_NAME
							// this.rank6_name = res.data['1'][5].DEPARTMENT_NAME
							this.rank1_name = arr1[2]
							this.rank2_name = arr2[2]
							this.rank3_name = arr3[2]
							this.rank4_name = arr4[2]
							this.rank5_name = arr5[2]
							this.rank6_name = arr6[2]
							this.rank1_duan = arr1[0]
							this.rank2_duan = arr2[0]
							this.rank3_duan = arr3[0]
							this.rank4_duan = arr4[0]
							this.rank5_duan = arr5[0]
							this.rank6_duan = arr6[0]
							
							this.rank1_num = res.data['1'][0].BASE_SCORE
							this.rank2_num = res.data['1'][1].BASE_SCORE
							this.rank3_num = res.data['1'][2].BASE_SCORE
							this.rank4_num = res.data['1'][3].BASE_SCORE
							this.rank5_num = res.data['1'][4].BASE_SCORE
							this.rank6_num = res.data['1'][5].BASE_SCORE
						}else{
							// this.rank1_name = res.data['1'][6].DEPARTMENT_NAME
							// this.rank2_name = res.data['1'][7].DEPARTMENT_NAME
							// this.rank3_name = res.data['1'][8].DEPARTMENT_NAME
							// this.rank4_name = res.data['1'][9].DEPARTMENT_NAME
							// this.rank5_name = res.data['1'][10].DEPARTMENT_NAME
							// this.rank6_name = res.data['1'][11].DEPARTMENT_NAME
							let arr7=res.data['1'][6].DEPARTMENT_NAME.split('-',3)
							let arr8=res.data['1'][7].DEPARTMENT_NAME.split('-',3)
							let arr9=res.data['1'][8].DEPARTMENT_NAME.split('-',3)
							let arr10=res.data['1'][9].DEPARTMENT_NAME.split('-',3)
							let arr11=res.data['1'][10].DEPARTMENT_NAME.split('-',3)
							let arr12=res.data['1'][11].DEPARTMENT_NAME.split('-',3)
							this.rank1_name = arr7[2]
							this.rank2_name = arr8[2]
							this.rank3_name = arr9[2]
							this.rank4_name = arr10[2]
							this.rank5_name = arr11[2]
							this.rank6_name = arr12[2]
							this.rank1_duan = arr7[0]
							this.rank2_duan = arr8[0]
							this.rank3_duan = arr9[0]
							this.rank4_duan = arr10[0]
							this.rank5_duan = arr11[0]
							this.rank6_duan = arr12[0]
							
							this.rank1_num = res.data['1'][6].BASE_SCORE
							this.rank2_num = res.data['1'][7].BASE_SCORE
							this.rank3_num = res.data['1'][8].BASE_SCORE
							this.rank4_num = res.data['1'][9].BASE_SCORE
							this.rank5_num = res.data['1'][10].BASE_SCORE
							this.rank6_num = res.data['1'][11].BASE_SCORE
						}
						
						
					});

				}else{
					C.getData({
					
						s: [
							[this.name]
						],
						url: "https://10.192.126.203/GeneralProServlet",
						c: 'ajsdp_zhaoyue2003',
					}, res => {
						// this.loading =false;
						console.log("接口数据3(车间)")
						console.log(this.name)
						console.log(res)
						this.tableData=res.data['1']
						// console.log("接口数据3table")
						// console.log(this.tableData)
						if(this.rank===1){
							// this.rank1_name = res.data['1'][0].DEPARTMENT_NAME
							// this.rank2_name = res.data['1'][1].DEPARTMENT_NAME
							// this.rank3_name = res.data['1'][2].DEPARTMENT_NAME
							// this.rank4_name = res.data['1'][3].DEPARTMENT_NAME
							// this.rank5_name = res.data['1'][4].DEPARTMENT_NAME
							// this.rank6_name = res.data['1'][5].DEPARTMENT_NAME
							let arr1=res.data['1'][0].DEPARTMENT_NAME.split('-',3)
							let arr2=res.data['1'][1].DEPARTMENT_NAME.split('-',3)
							let arr3=res.data['1'][2].DEPARTMENT_NAME.split('-',3)
							let arr4=res.data['1'][3].DEPARTMENT_NAME.split('-',3)
							let arr5=res.data['1'][4].DEPARTMENT_NAME.split('-',3)
							let arr6=res.data['1'][5].DEPARTMENT_NAME.split('-',3)
							this.rank1_name = arr1[1]
							this.rank2_name = arr2[1]
							this.rank3_name = arr3[1]
							this.rank4_name = arr4[1]
							this.rank5_name = arr5[1]
							this.rank6_name = arr6[1]
							this.rank1_duan = arr1[0]
							this.rank2_duan = arr2[0]
							this.rank3_duan = arr3[0]
							this.rank4_duan = arr4[0]
							this.rank5_duan = arr5[0]
							this.rank6_duan = arr6[0]
							
							this.rank1_num = res.data['1'][0].BASE_SCORE
							this.rank2_num = res.data['1'][1].BASE_SCORE
							this.rank3_num = res.data['1'][2].BASE_SCORE
							this.rank4_num = res.data['1'][3].BASE_SCORE
							this.rank5_num = res.data['1'][4].BASE_SCORE
							this.rank6_num = res.data['1'][5].BASE_SCORE
						}else{
							// this.rank1_name = res.data['1'][6].DEPARTMENT_NAME
							// this.rank2_name = res.data['1'][7].DEPARTMENT_NAME
							// this.rank3_name = res.data['1'][8].DEPARTMENT_NAME
							// this.rank4_name = res.data['1'][9].DEPARTMENT_NAME
							// this.rank5_name = res.data['1'][10].DEPARTMENT_NAME
							// this.rank6_name = res.data['1'][11].DEPARTMENT_NAME
							let arr7=res.data['1'][6].DEPARTMENT_NAME.split('-',3)
							let arr8=res.data['1'][7].DEPARTMENT_NAME.split('-',3)
							let arr9=res.data['1'][8].DEPARTMENT_NAME.split('-',3)
							let arr10=res.data['1'][9].DEPARTMENT_NAME.split('-',3)
							let arr11=res.data['1'][10].DEPARTMENT_NAME.split('-',3)
							let arr12=res.data['1'][11].DEPARTMENT_NAME.split('-',3)
							this.rank1_name = arr7[1]
							this.rank2_name = arr8[1]
							this.rank3_name = arr9[1]
							this.rank4_name = arr10[1]
							this.rank5_name = arr11[1]
							this.rank6_name = arr12[1]
							this.rank1_duan = arr7[0]
							this.rank2_duan = arr8[0]
							this.rank3_duan = arr9[0]
							this.rank4_duan = arr10[0]
							this.rank5_duan = arr11[0]
							this.rank6_duan = arr12[0]
							
							this.rank1_num = res.data['1'][6].BASE_SCORE
							this.rank2_num = res.data['1'][7].BASE_SCORE
							this.rank3_num = res.data['1'][8].BASE_SCORE
							this.rank4_num = res.data['1'][9].BASE_SCORE
							this.rank5_num = res.data['1'][10].BASE_SCORE
							this.rank6_num = res.data['1'][11].BASE_SCORE
						}
						
						
					});
				}

			},
			chooseleft(name, seq) {
				this.listtype = name;
				// this.$refs.myL1.changetype(seq);
				// this.$refs.myL2.changetype(seq);
				// this.$refs.myL3.changetype(seq);
				if (name == "工区") {
					this.title1 = "工区质量排序"
					this.gq = "清白江巡养工区"
				} else {
					this.title1 = "车间质量排序"
					this.gq = "青白江线路车间"
				}
				// this.yData1.splice(0, this.yData1.length)
				// this.yData2.splice(0, this.yData2.length)
				// this.yData3.splice(0, this.yData3.length)
				// this.yData4.splice(0, this.yData4.length)
				// this.yData5.splice(0, this.yData5.length)
				// this.yData6.splice(0, this.yData6.length)
				// this.yData7.splice(0, this.yData7.length)
				// this.yData8.splice(0, this.yData8.length)
				// this.yData9.splice(0, this.yData9.length)
				// this.yData10.splice(0, this.yData10.length)
				// this.yData11.splice(0, this.yData11.length)
				// this.yData12.splice(0, this.yData12.length)
				this.getDatabykys()
				
				// this.getData();
				// this.initCharts1();
				// this.initCharts2();
				// this.initCharts3();
			},
			/**-------------------------数据展示-------------------------------*/

			changetype(name) {
				// this.yData1.splice(0, this.yData1.length)
				// this.yData2.splice(0, this.yData2.length)
				// this.yData3.splice(0, this.yData3.length)
				// this.yData4.splice(0, this.yData4.length)
				// this.yData5.splice(0, this.yData5.length)
				// this.yData6.splice(0, this.yData6.length)
				// this.yData7.splice(0, this.yData7.length)
				// this.yData8.splice(0, this.yData8.length)
				// this.yData9.splice(0, this.yData9.length)
				// this.yData10.splice(0, this.yData10.length)
				// this.yData11.splice(0, this.yData11.length)
				// this.yData12.splice(0, this.yData12.length)
				this.name=name
				// this.getData1();
				// this.getXQgq()
				// this.getXQcj()
				this.getDatabykys()
				// this.initCharts1();
				// this.initCharts2();
				// this.initCharts3();
			},
			getData() {
				this.yData1.push((Math.random() * 200).toFixed(0))
				this.yData2.push((Math.random() * 200).toFixed(0))
				this.yData3.push((Math.random() * 200).toFixed(0))
				this.yData4.push((Math.random() * 200).toFixed(0))
				this.yData5.push((Math.random() * 200).toFixed(0))

				this.yData6.push((Math.random() * 200).toFixed(0))
				this.yData7.push((Math.random() * 200).toFixed(0))
				this.yData8.push((Math.random() * 200).toFixed(0))
				this.yData9.push((Math.random() * 200).toFixed(0))
				this.yData10.push((Math.random() * 200).toFixed(0))
				this.yData11.push((Math.random() * 200).toFixed(0))
				this.yData12.push((Math.random() * 200).toFixed(0))
			},

			changeData() {
				if (this.rank === 1) {
					this.rank = 0;
					this.word1 = "排行前四";
					this.word2 = "排行末4"
					this.getDatabykys()
					// this.rank1_name = this.tableData[6].DEPARTMENT_NAME
					// // console.log(this.rank1_name)
					// this.rank2_name = this.tableData[7].DEPARTMENT_NAME
					// this.rank3_name = this.tableData[8].DEPARTMENT_NAME
					// this.rank4_name = this.tableData[9].DEPARTMENT_NAME
					// this.rank5_name = this.tableData[10].DEPARTMENT_NAME
					// this.rank6_name = this.tableData[11].DEPARTMENT_NAME
					// this.rank1_num =this.tableData[6].BASE_SCORE
					// this.rank2_num = this.tableData[7].BASE_SCORE
					// this.rank3_num = this.tableData[8].BASE_SCORE
					// this.rank4_num = this.tableData[9].BASE_SCORE
					// this.rank5_num = this.tableData[10].BASE_SCORE
					// this.rank6_num =this.tableData[11].BASE_SCORE
					// this.initCharts3();
				} else {
					this.rank = 1;
					this.word1 = "排行末四";
					this.word2 = "排行前4"
					
					
					// this.rank1_name = this.tableData[0].DEPARTMENT_NAME
					// // console.log(this.rank1_name)
					// this.rank2_name = this.tableData[1].DEPARTMENT_NAME
					// this.rank3_name = this.tableData[2].DEPARTMENT_NAME
					// this.rank4_name = this.tableData[3].DEPARTMENT_NAME
					// this.rank5_name = this.tableData[4].DEPARTMENT_NAME
					// this.rank6_name = this.tableData[5].DEPARTMENT_NAME
					// this.rank1_num = this.tableData[0].BASE_SCORE
					// this.rank2_num = this.tableData[1].BASE_SCORE
					// this.rank3_num = this.tableData[2].BASE_SCORE
					// this.rank4_num = this.tableData[3].BASE_SCORE
					// this.rank5_num = this.tableData[4].BASE_SCORE
					// this.rank6_num = this.tableData[5].BASE_SCORE
					// this.getData1()
					this.getDatabykys()
				}
				

			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			initCharts1() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank1_num],
						type: 'bar',
						// showBackground:true,
						color: '#d96101',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				let option2 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank2_num],
						type: 'bar',
						// showBackground:true,
						color: '#d96101',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				let option3 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank3_num],
						type: 'bar',
						// showBackground:true,
						color: '#d96101',
						backgroundStyle: {
							color: 'rgba(3, 34, 88, 204)'
						}
					}],
				};
				this.myChart1.setOption(option1);
				this.myChart2.setOption(option2);
				
				// this.myChart4.setOption(option);
				// this.myChart5.setOption(option);
			},

			initCharts2() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank4_num],
						type: 'bar',
						// showBackground:true,
						color: '#0096ff',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				let option2 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank5_num],
						type: 'bar',
						// showBackground:true,
						color: '#0096ff',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				let option3 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank6_num],
						type: 'bar',
						// showBackground:true,
						color: '#0096ff',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				// this.myChart1.setOption(option);
				// this.myChart2.setOption(option);
				// this.myChart3.setOption(option);
				this.myChart4.setOption(option1);
				this.myChart3.setOption(option3);
				// this.myChart5.setOption(option2);
				// this.myChart6.setOption(option3);
			},
			initCharts3() {
				let option1 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank1_num],
						type: 'bar',
						// showBackground:true,
						color: '#aa9ea9',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				let option2 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank2_num],
						type: 'bar',
						// showBackground:true,
						color: '#aa9ea9',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				let option3 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank3_num],
						type: 'bar',
						// showBackground:true,
						color: '#aa9ea9',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				let option4 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank4_num],
						type: 'bar',
						// showBackground:true,
						color: '#aa9ea9',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				let option5 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank5_num],
						type: 'bar',
						// showBackground:true,
						color: '#aa9ea9',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				let option6 = {
					title: {},
					xAxis: {
						type: 'value',
						data: ['one'],
						show: false,
						max: 100,
					},
					yAxis: {
						type: 'category'
					},
					series: [{
						data: [this.rank6_num],
						type: 'bar',
						// showBackground:true,
						color: '#aa9ea9',
						// backgroundStyle:{
						// 	color:'rgba(3, 34, 88, 204)'
						// }

					}],
				};
				this.myChart7.setOption(option1);
				this.myChart8.setOption(option2);
				this.myChart9.setOption(option3);
				this.myChart10.setOption(option4);
				this.myChart11.setOption(option5);
				this.myChart12.setOption(option6);
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
		computed: {
			compute1() {
				if (this.rank === 1) {
					return this.yData1[0]
				} else {
					return this.yData7[0]
				}
			},
			compute2() {
				if (this.rank === 1) {
					return this.yData2[0]
				} else {
					return this.yData8[0]
				}
			},
			compute3() {
				if (this.rank === 1) {
					return this.yData3[0]
				} else {
					return this.yData9[0]
				}
			},
			compute4() {
				if (this.rank === 1) {
					return this.yData4[0]
				} else {
					return this.yData10[0]
				}
			},
			compute5() {
				if (this.rank === 1) {
					return this.yData5[0]
				} else {
					return this.yData11[0]
				}
			},
			compute6() {
				if (this.rank === 1) {
					return this.yData6[0]
				} else {
					return this.yData12[0]
				}
			},
		},
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
	
	.title{
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
		/* margin-top: -0px; */
		margin-left: 220px;
		font-size: 14px;
		/* padding-top: 10px; */
		/* color: #1ae3ff; */
		/* background-image: linear-gradient(#1ae3ff,#2f7aca); */
		-webkit-background-clip: text;
		/* color: transparent; */
		color: #d0c5e3;
		text-shadow: 0px 0px 10px #0000FF, 0 0 20px #fff;
		-webkit-user-select: none;
		cursor: pointer;
	}
	.kk{
		margin-top: 0px;
		height: 49px;
		width: 445px;
		background: url(img2/组 589 拷贝.png)no-repeat;
		background-size: auto;
		/* flex-direction: row; */
		/* display: inline-block; */
		-webkit-user-select: none;
	}
	.kk>.name{
		position: absolute;
		font-size: 16px;
		color: #ffffff;
		padding-left: 62px;
		padding-top: 13px;
/* 		white-space: nowrap;
		overflow: hidden;
		width: 190px;
		text-overflow: ellipsis; */
	}
	.kk>.num{
		position: absolute;
		font-size: 15px;
		color: #ff6f01;
		padding-top: 15px;
		padding-left: 280px;
		direction: rtl;
		text-align: center;
		width: 10px;
	}
	.kk>.duan{
		position: absolute;
		font-size: 16px;
		color: #ffffff;
		padding-top: 26px;
		padding-left: 310px;
	}
	.kk>.snum{
		position: absolute;
		font-size: 20px;
		color: #d96101;
		padding-left: 32px;
		padding-top: 12px;
	}
	.kk2{
		margin-top: 0px;
		height: 49px;
		width: 445px;
		background: url(img2/组 590.png)no-repeat;
		background-size: auto;
		/* flex-direction: row; */
		/* display: inline-block; */
		-webkit-user-select: none;
	}
	.kk2>.name{
		position: absolute;
		color: #ffffff;
		font-size: 16px;
		padding-left: 62px;
		padding-top: 13px;
		/* width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis; */
	}
	.kk2>.num{
		position: absolute;
		font-size: 15px;
		padding-top: 15px;
		padding-left: 280px;
		width: 10px;
		color: #5ed7ff;
		
		direction: rtl;
		text-align: center;
		
	}
	.kk2>.duan{
		position: absolute;
		font-size: 16px;
		padding-top: 26px;
		padding-left: 310px;
		color: #ffffff;
		
	}
	.kk2>.snum{
		position: absolute;
		font-size: 20px;
		color: #4399b6;
		padding-left: 32px;
		padding-top: 12px;
	}
	
	
	.kk3{
		margin-top: 0px;
		height: 49px;
		width: 445px;
		background: url(img2/灰2.png)no-repeat;
		background-size: auto;
		/* flex-direction: row; */
		/* display: inline-block; */
		-webkit-user-select: none;
	}
	.kk3>.name{
		position: absolute;
		font-size: 16px;
		padding-left: 62px;
		padding-top: 13px;
		width: 240px;
		color: #ffffff;
		
		white-space: nowrap;
		overflow: hidden;
		/* width: 180px; */
		text-overflow: ellipsis;
	}
	.kk3>.num{
		position: absolute;
		font-size: 15px;
		padding-top: 15px;
		padding-left: 280px;
		width: 10px;
		color: #b0b0b0;
		direction: rtl;
		text-align: center;
	}
	.kk3>.duan{
		position: absolute;
		font-size: 16px;
		padding-top: 26px;
		padding-left: 310px;
		color: #ffffff;
		
	}
	.kk3>.snum{
		position: absolute;
		font-size: 20px;
		padding-left: 32px;
		padding-top: 12px;
		color: #b0a4ae;
		
	}
	
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
	.left-list {
		position:absolute;
		width: 50%;
		margin-top: -15px;
		height: 0px;
		display: flex;
		/* color: #0096ff; */
		background: url(img2/工区质量.png)no-repeat;
		background-size: auto;
		background-position: right top;
		/* margin: 80 auto; */
		margin-left: 270px;
		padding-left: 100px;
		padding-bottom: 50px;
		padding-top: 2px;
		text-align: center;
		justify-content: space-around;
		z-index: 2;
	}
	.left-list>.wz{
		cursor: pointer;
		font-size: 16px;
		padding-left: 0px;
		/* padding-top: 10px; */
		/* height: 100px; */
		/* width: 100px; */
	}
	.left-list>.wz.active{
		/* background: url(./img2/jianbian.png)no-repeat; */
		background-position: center 5px;
		font-size: 16px;
		color: #0a97bb;
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