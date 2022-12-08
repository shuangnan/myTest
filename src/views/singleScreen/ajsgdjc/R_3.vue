<template>
	<div style="position: relative;width:100%;height:100%;padding: 30px 10px 90px 30px;" class="box">
		<div class="title">重点薄弱设备</div>
		
		<div style="position: relative;height: 50%;padding-top: 45px;bottom:0;">
			<!-- <div ref="chart1" style="display: inline-block;width: 10%;height:10%;vertical-align: top;"></div> -->
			<!-- <div ref="chart2" style="display: inline-block;width: 10%;height:10%;vertical-align: top;"></div> -->
			<div style="position: relative;;left:0;bottom:;width:100%;height: 90px;display: flex;justify-content: space-between;">
			<div class="shebei" >
				<div class="num">1231个</div>
				<div class="name">X X 设 备</div>
				<div class="orange">故障: 8</div>
				<div class="green">故障: 8</div>
			</div>
			
			<div class="shebei">
				<div class="num">1231个</div>
				<div class="name">X X 设 备</div>
				<div class="orange">故障: 8</div>
				<div class="green">故障: 8</div>
			</div>
			</div>
		</div>
		
		<div style="position: relative;height: 50%;padding-top: 90px;bottom:0;">
			<!-- <div ref="chart1" style="display: inline-block;width: 10%;height:10%;vertical-align: top;"></div> -->
			<!-- <div ref="chart2" style="display: inline-block;width: 10%;height:10%;vertical-align: top;"></div> -->
			<div style="position: relative;;left:0;bottom:;width:100%;height: 90px;display: flex;justify-content: space-between;">
			<div class="shebei">
				<div class="num">1231个</div>
				<div class="name">X X 设 备</div>
				<div class="orange">故障: 8</div>
				<div class="green">故障: 8</div>
			</div>
			
			<div class="shebei">
				<div class="num">1231个</div>
				<div class="name">X X 设 备</div>
				<div class="orange">故障: 8</div>
				<div class="green">故障: 8</div>
			</div>
			</div>
		</div>
		
		
		
		
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
	
		},
		// 组件挂载完毕
		mounted() {
			
			this.getData();
		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData() {
				
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
		margin-top: -25px;
		margin-left: -8px;
		font-size: 12px;
		/* color: #1ae3ff; */
		background-image: linear-gradient(#1ae3ff,#2f7aca);
		-webkit-background-clip: text;
		color: transparent;
		-webkit-user-select: none;
	}
	
	
	.shebei{
		position: relative;
		width: 100%;
		/* text-align: center; */
		margin-left: 25px;
		margin-top: -35px;
		-webkit-user-select: none;
		background: url(img2/gz.png)no-repeat;
	}
	.shebei>.num{
		position: absolute;
		font-size: 14px;
		color: #aec0f2;
		text-align: center;
		padding-top: 26px;
		padding-left: 75px;
	}
	.shebei>.name{
		position: absolute;
		font-size: 16px;
		color: #fefefe; 
		text-align: center;
		padding-top: 58px;
		padding-left: 63px;
	}
	.shebei>.orange{
		position: absolute;
		font-size: 14px;
		color: #c5733c; 
		text-align: left; 
		padding-top: 83px;
		padding-left: 35px;
	}
	.shebei>.green{
		position: absolute;
		font-size: 14px;
		color: #92e252; 
		text-align: right; 
		padding-top: 83px;
		padding-left: 119px;
	}
	

</style>
