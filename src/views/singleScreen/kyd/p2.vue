<template>
	<div style="width: 100%;height:100%;overflow: hidden;padding:0;margin:0;background:#2a3252">
		<div class="content">
			<label class="title">组织机构</label>
			<div class="center">
				<div class="left">
					<span class="font-blue"><label class="font-white s16">车队：</label>{{data.TEAM_NUM?data.TEAM_NUM:'--'}}</span>
					<span class="font-blue"><label class="font-white s16">班组：</label>{{data.CLASS_NUM?data.CLASS_NUM:'--'}}</span>
				</div>
				<div class="space"></div>
				<div class="right">
					<span class="font-blue">
						<span><label class="font-white">在途人数：</label>{{data.PAS_NUM?data.PAS_NUM:'--'}}</span>
						<span><label class="font-white">出乘人数：</label>{{data.CC_NUM?data.CC_NUM:'--'}}</span>
						<span><label class="font-white">退乘人数：</label>{{data.TC_NUM?data.TC_NUM:'--'}}</span>
					</span>
					<span class="font-blue">
						<span><label class="font-white">休息人数：</label>{{data.XX_NUM?data.XX_NUM:'--'}}</span>
						<span><label class="font-white">病假人数：</label>{{data.QJ_NUM?data.QJ_NUM:'--'}}</span>
					</span>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
	import home from './service/home.js'
	export default{
		props:{
			oname:{
				type:String,
				default:"",
			}
		},
		data(){
			return {
				logo:require('../../images/yyqk.png'),
				data:{},
				user:{
					oName:null
				}
			}
		},
		mounted() {
			this.user.oName = this.$store.state.user.u_DEPOT
			this.initZzjg()
		},
		methods:{
			initZzjg(){
				let t = this
				home.getZzjg({
					s:[[t.oname]]
				}).then(r => {
					if(r){
						t.data = r["1"][0]
					}else{
						this.$message('接口错误')
					}
				}, error => {
					t.$notify.error({
						title: '组织机构',
						message: '获取组织机构异常'
					})
				})	
			}
		},
		watch:{
			oname(){
				this.initZzjg();
			}
		}
	}
</script>
<style scoped="scoped">
	.content{
		display: flex;
		flex-direction: column;
		color: #f0f0f0;
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
		justify-content: flex-start;
		align-items: center;
		height:100px;
	}
	.content .center .logo{
		width:50px;
		height:50px;
	}
	.content .center .left{
		display: flex;
		flex-direction: column;
		min-width: 100px;
		padding: 0 0 0 15px;
	}
	.content .center .right{
		display: flex;
		flex-direction: column;
		width: 100%;
		padding:0 15px;
	}
	.content .center .right>span{
		width:100%;
		display: flex;
		align-items: center;
	}
	.content .center .right>span>span{
		width:33%;
	}
	
	.content .center .right>span>span label:nth-child(1){
		width:90px;
		text-align: right;
	}
	.content .center .space{
		width:1px;
		height:50px;
		background:#222222;
	}
	.content .center>div>span:nth-child(2){
		margin:15px 0 0 0;
	}
	.font-blue{
		color:#2b97ff;
		font-size: 20px;
	}
	.font-white{
		color:#f0f0f0;
		font-size:14px;
	}
	.s16{
		font-size: 20px;
	}
</style>
