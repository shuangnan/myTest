<template>
	<div style="width:280px;height:110px;position: absolute;margin-top: -6px;margin-left: -6px;">
		<div style="display: flex;">
			<div style="color: #FFFFFF;font-size: 14px;width:65px">施工项目:</div>
			<div :title="type" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{type}}</div>
		</div>
		<div style="display: flex;padding-top: 5px;">
			<div style="color: #FFFFFF;font-size: 14px;width:65px">单位:</div>
			<div :title="type" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{unit}}</div>
		</div>
		<div style="display: flex;padding-top: 5px;">
			<div style="color: #FFFFFF;font-size: 14px;width:65px">施工等级:</div>
			<div :title="type" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">XX等级施工</div>
		</div>
		<div style="display: flex;padding-top: 5px;">
			<div style="color: #FFFFFF;font-size: 14px;width:65px" @click=change>公里标：</div>
			<div :title="type" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">K100+234</div>
		</div>
	</div>
</template>

<script>
	import C from "../../../assets/com.js"
	export default{
		components:{},
		data(){
		    return{
			// tableData:[],
			// TYPE:'',
			// type:'',
		  }
		},
		// props:{
		// 	// tableData1:[],
		// 	type:'',
		// 	DO_UNIT:'',
		// 	GRADE:'',
		// 	LENGTH:'',
		// },
		props: ['type','unit'],
		
		
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
				// console.log(this.tableData1)
				console.log(this.type)
				console.log(this.unit)
			},
			// getData(){
			// 	C.getData({
			// 	  url: "https://10.192.126.203/GeneralProServlet",
			// 	  c: 'tyzd_ggy2062',
			// 	  s:[[this.typr]]
			// 	}, res => {
			// 	  console.log("弹框详情")
			// 	  this.tableData=res.data['1']
			// 	  this.TYPE=res.data['1'].TYPE
			// 	  console.log(this.tableData)
			// 	});
			// }
			
		},
		}
</script>

<style scoped="scoped">
	.one {
		display: flex;
		flex-direction: column;
		
	}
</style>
