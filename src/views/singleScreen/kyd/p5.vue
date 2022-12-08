<template>
	<div style="width: 100%;height:100%;overflow: hidden;padding:0;margin:0;background:#2a3252">
		<div class="content">
			<label class="title">正晚点列车</label>
			<div class="opa">
				<span>
					<el-radio-group v-model="opt.trainType" size="mini" @change="changeTrainType">
						<el-radio-button :label="0">全部</el-radio-button>
						<el-radio-button :label="1">动车</el-radio-button>
						<el-radio-button :label="2">普速</el-radio-button>
					</el-radio-group>
				</span>
				<span>
					<label>车站</label>
					<el-select size="mini" v-model="opt.station" @change="filterData" filterable>
						<el-option v-for="(item,i) in dicStation" :value="item.STATION_CODE" :label="item.STATION_NAME"></el-option>
					</el-select>
				</span>
				<!-- <el-button type="primary" size="mini" @click="filterData">筛选</el-button> -->
			</div>
			<el-table style="width:100%;" height="300" size="mini" :data="datasource" :border="false" v-loading="loading" element-loading-background="rgba(0,0,0,.5)" element-loading-text="loading" :highlight-current-row="false">
				<!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column> -->
				<el-table-column label="车次" align="center" prop="CC"></el-table-column>
				<el-table-column label="经停站" align="center" prop="NODE"></el-table-column>
				<el-table-column label="晚点信息" align="center" prop="DZWD"></el-table-column>
				<el-table-column label="图定" align="center">
					<el-table-column label="到达" align="center" width="120" prop="TDDDSJ"></el-table-column>
					<el-table-column label="出发" align="center" width="120" prop="TDCFSJ"></el-table-column>
				</el-table-column>
				<el-table-column label="实际" align="center">
					<el-table-column label="到达" align="center" width="120" prop="DDSJ"></el-table-column>
					<el-table-column label="出发" align="center" width="120" prop="CFSJ"></el-table-column>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import home from './service/home.js'
	export default{
		data(){
			return {
				loading:false,
				logo:require('../../images/yyqk.png'),
				opt:{
					trainType:0,
					station:''
				},
				dicStation:[],
				datasource:[],
				dc:[],
				pk:[],
				user:{
					oName:null
				}
			}
		},
		mounted() {
			this.initStation()
		},
		methods:{
			initStation(){
				let t = this
				home.getCzzd({
					
				}).then((r)=>{
					if(r){
						t.dicStation = r["1"]
						if(t.dicStation){
							t.opt.station = t.dicStation[0].STATION_CODE
							t.getZwd()
						}
					}else {
						this.$message('接口错误')
					}
				}, error => {
					t.$notify.error({
						title: '正晚点列车',
						message: '获取车站数据异常'
					})
				})
			},
			getZwd(){
				let t = this
				t.datasource = []
				home.getZwd({
					s:[[t.opt.station],[t.opt.station]]
				}).then((r)=>{
					if(r){
						t.dc = r["1"]
						t.pk = r["2"]
						t.checkData()
					}else {
						this.$message('接口错误')
					}
					t.loading = false
				}, error => {
					t.loading = false
					t.$notify.error({
						title: '正晚点列车',
						message: '获取正晚点列车异常'
					})
				})
			},
			filterData(){
				this.loading = true
				this.getZwd()
			},
			changeTrainType(type){
				this.checkData()
			},
			checkData(){
				if(this.opt.trainType == 0){
					this.datasource = [].concat(this.dc).concat(this.pk)
				}else if(this.opt.trainType == 1){
					this.datasource = [].concat(this.dc)
				}else if(this.opt.trainType == 2){
					this.datasource = [].concat(this.pk)
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.content{
		display: flex;
		flex-direction: column;
		color: #f0f0f0;
		width: 100%;
		height: 100%;
	}
	
	.content .opa{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding:15px;
	}
	.content .opa>span{
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		align-items: center;
		margin-right:15px;
	}
	.content .opa>span>label{
		padding:0 5px 0 0;
		font-size: 16px;
	}
	.content .title{
		font-size: 22px;
		margin:15px 0 0 15px;
	}
	.content .time{
		width: 100%;
		text-align: center;
		font-size:16px;
		margin: 10px 0;
	}
	.content .center{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}
	.content .center .logo{
		width:50px;
		height:50px;
	}
	.content .center .left{
		display: flex;
		flex-direction: column;
	}
	.content .center .right{
		display: flex;
		flex-direction: column;
	}
	.content .center .right span{
		width:100%;
		display: flex;
		align-items: center;
	}
	.content .center .right span label:nth-child(1){
		width:100px;
		text-align: right;
	}
	.content .center .space{
		width:1px;
		height:70px;
		background:#222222;
	}
	.font-blue{
		color:#2b97ff;
		font-size: 18px;
	}
	.font-white{
		color:#f0f0f0;
		font-size:14px;
	}
	>>>.el-radio{
		color:#f0f0f0;
	}
	>>>.el-table thead.is-group th{
		background: none;
	}
	>>>.el-table--border, .el-table--group{
		border:0;
	}
	>>>.el-table--border td{
		border-right:0;
	}
	>>>.el-table--border th, .el-table__fixed-right-patch{
		border:0;
	}
	>>>.el-table--border::after, .el-table--group::after{
		width: 0;
	}
	>>>.el-table--border th.gutter:last-of-type{
		border-bottom:0;
	}
</style>
