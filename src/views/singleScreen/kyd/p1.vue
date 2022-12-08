<template>
	<div style="width: 100%;height:100%;overflow: hidden;padding:0;margin:0;background:#2a3252">
		<div class="content">
			<label class="title">运营情况</label>
			<label class="time">{{curTime}}</label>
			<div class="center">
				<el-image class="logo" :src="logo"></el-image>
				<div class="left">
					<label class="font-white">今日全程旅客量：</label>
					<label class="font-blue">{{data.QCLKL>0?data.QCLKL:'--'}}</label>
					<span class="font-white">客座率：<label class="font-blue">98.3%</label></span>
				</div>
				<div class="space"></div>
				<div class="right">
					<span class="font-blue"><label class="font-white">今日普车收入：</label>{{data.JRPKSR?data.JRPKSR:'--'}}</span>
					<span class="font-blue"><label class="font-white">今日动车收入：</label>{{data.JRDCSR?data.JRDCSR:'--'}}</span>
					<span class="font-blue"><label class="font-white">总计收入：</label>21万</span>
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
				curTime:echarts.format.formatTime('yyyy-MM-dd',new Date().getTime()),
				data:{},
				user:{
					oName:null
				}
			}
		},
		mounted() {
			this.user.oName = this.$store.state.user.u_DEPOT
			console.log("用户信息：",this.$store.state.user)
			this.initYyqk()
		},
		methods:{
			initYyqk(){
				let t = this
				console.log("获取运营情况异常>",t.oname)
				home.getYyqk({
					s:[[t.oname]]
				}).then(r => {
					if(r){
						t.data = r["1"][0]
					}else{
						this.$message('接口错误')
					}
				}, error => {
					t.$notify.error({
						title: '运营情况',
						message: '获取运营情况异常'
					})
				})	
			}
			
		},
		watch:{
			oname(){
				this.initYyqk();
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
		line-height: 28px;
	}
	.font-white{
		color:#f0f0f0;
		font-size:14px;
	}
</style>
