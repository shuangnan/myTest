<template>
	<div >
	<!-- <div style="color:#0194cb;" class="zh-size"><h2 >{{type}}</h2></div> -->
	<!-- <div style="color:#f4f4f4; text-align:center ; margin-top: 5px;" id="detail" @click="opendon">动态病害<a  style=" cursor: pointer;color: white;">24</a>条</div> -->
	<!-- <div style="color:#f4f4f4; text-align:center;margin-top:10px" @click="openjin">静态病害<a  style="cursor: pointer;color: white;">24</a>条</div> -->
	
	<!-- <el-dialog :title="openFlag?'动态病害':'静态病害'" :visible.sync="dialogIsVisible" append-to-body width="1300px" style="padding: 0;" height="800px" :before-close="()=>{this.dialogIsVisible=false;}"> -->
		<!-- <div style="width: 100%;height: 700px;overflow-y: ;"> -->
				<!-- <el-table :data="tableData" ref="mytable" size="mini" -->
				    <!-- fit border highlight-current-row  height="calc(100% - 40px)" @selection-change="selectionChange" -->
				    <!-- :key="key" -->
				   <!-- :header-cell-style="{'border-right':'1px solid lightgray','border-bottom':'1px solid lightgray',color:'white',background:'#238EE0',}" -->
				<!-- > -->
				
					<!-- <el-table-column type="selection" align="center" :reserve-selection="true"></el-table-column> -->
				  <!-- <el-table-column type="index" align="center" label="序号" @click="change"></el-table-column> -->
					<!-- <el-table-column label="检测类型"  align="center" prop="jc_type"></el-table-column> -->
					<!-- <el-table-column label="线名"  align="center" prop="LINE_NAME"></el-table-column> -->
					<!-- <el-table-column label="行别"  align="center" prop="direction_type"></el-table-column> -->
					<!-- <el-table-column label="超限等级"  align="center" prop="dengji" ></el-table-column> -->
					<!-- <el-table-column label="病害日期"  align="center" prop="DATE" ></el-table-column> -->
					<!-- <el-table-column label="段"  align="center" prop="duan_name" ></el-table-column> -->
					<!-- <el-table-column label="车间"  align="center" prop="chejian"></el-table-column> -->
					<!-- <el-table-column label="工区"  align="center" prop="gongqu"></el-table-column> -->

				  <!-- </el-table-column> -->
				  
				<!-- </el-table> -->
				<!-- </div> -->
	<!-- </el-dialog> -->
	

	<div style="color: #FFFFFF;font-size: 16px; margin-top: -12px;padding-left: 10px;">Ⅳ级病害</div>
	<div style="color: #FFFFFF;font-size: 16px; padding-top: 15px;margin-left: -10px;">线别：成渝线</div>
	<div style="color: #FFFFFF;font-size: 16px; padding-top: 3px;margin-left: -10px;">站段：成都工务段</div>
	<div style="color: #FFFFFF;font-size: 16px; padding-top: 3px;margin-left: -10px;">公里标：K100+234</div>
	</div>
</template>

<script>
	export default{
		components:{},
		data(){
		    return{
		      treeList:[],
		      lineNameList:[],
		      oname:'',
		      ename:'',
			  openFlag:true,
			  type:'',
		      line:'all',
		      stationList:[],
		      TELEPHONE:'',
		      DELETE_FLAG:'',
		      currentPage: 1,
		      pageSize: 30,
		      tableData:[
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"下",dengji:"2级",DATE:"2022-09-12 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-07 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"江油线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"兰渝西成联络线",direction_type:"下",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"下",dengji:"2级",DATE:"2022-09-12 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-07 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"江油线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"兰渝西成联络线",direction_type:"下",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"下",dengji:"2级",DATE:"2022-09-12 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-07 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"江油线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"兰渝西成联络线",direction_type:"下",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"下",dengji:"2级",DATE:"2022-09-12 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-07 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"江油线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"兰渝西成联络线",direction_type:"下",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"下",dengji:"2级",DATE:"2022-09-12 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-07 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"江油线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"兰渝西成联络线",direction_type:"下",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"下",dengji:"2级",DATE:"2022-09-12 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-07 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"江油线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"西成客专",direction_type:"上",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路精测维修工区"},
				  {jc_type:"静态检查",LINE_NAME:"兰渝西成联络线",direction_type:"下",dengji:"2级",DATE:"2022-09-06 00:00:00",duan_name:"成都高铁工务段",chejian:"广元线路车间",gongqu:"广元线路巡检工区"},
			  ],
		      treeDisabled:false,
		      user:'',
		      webParam: {},
			  dialogIsVisible:false,
		
		  }
		},
		props:{
			type:'',
		},
		// watch:{
		// 	type:function(newData){
		// 		console.log("11111")
		// 		if(this.type === "1"){
		// 			this.oname="成都工务段"
		// 			alert(11111)
		// 		}
		// 		if(this.type === "2"){
		// 			this.oname="涪陵工务段"
		// 		}
		// 	}
		// },
		
		methods:{
			opendon(){
				this.openFlag=true
				this.dialogIsVisible=true
				console.log(this.oname)
			},
			openjin(){
				this.openFlag=false
				this.dialogIsVisible=true
			},
			change(){
				alert(this.type)
			}
		},
		}
</script>

<style scoped>
	.box{
		background: url(img2/pop2.png)no-repeat;
		background-size: auto;
	}
	.title{
		font-size: 14px;
		color: #FFFFFF;
		margin-top: -10px;
	}
</style>
