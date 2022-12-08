<template>
	<div style="position: relative;width:100%;height:100%;padding: 30px 10px 90px 10px;" class="box">
		<div class="title"> 病害情况</div>
		<div style=";position: absolute;;left:0;bottom:;width:98%;height: 90px;display: flex;justify-content: space-between;align-items: center;align-content: center;">
			<div class="tj-item" style="">
				<label>Ⅰ级</label>
				<div>19304</div>

			</div>
			<div class="tj-item">
				<label>Ⅱ级</label>
				<div>{{tableList2.allCount}}</div>

			</div>
			<div class="tj-item">
				<label>Ⅱ.Ⅴ级</label>
				<div>{{tableList25.allCount}}</div>
			</div>
			<div class="tj-item">
				<label>Ⅲ级</label>
				<div>{{tableList3.allCount}}</div>
			</div>
			<div class="tj-item">
				<label>Ⅳ级</label>
				<div>{{tableList4.allCount}}</div>
			</div>
		</div>
		<div style="cursor: pointer; position: relative;height: 50%;padding-top: 85px;bottom:0;" @click="childmd(1)">
			<div class="btn" style="margin-top: 5px;">本月新增</div>
			<!-- <div ref="chart1" style="display: inline-block;width: 10%;height:10%;vertical-align: top;"></div> -->
			<!-- <div ref="chart2" style="display: inline-block;width: 10%;height:10%;vertical-align: top;"></div> -->
			<div style="position: relative;;left:0;bottom:;width:100%;height: 90px;display: flex;justify-content: space-between;">
				<div class="xz-item">
					<div>324</div>
				</div>

				<div class="xz-item">
					<div>{{tableList2.xzAllCount}}</div>
				</div>
				<div class="xz-item">
					<div>{{tableList25.xzAllCount}}</div>
				</div>
				<div class="xz-item">
					<div>{{tableList3.xzAllCount}}</div>
				</div>
				<div class="xz-item">
					<div>{{tableList4.xzAllCount}}</div>
				</div>
			</div>
		</div>


		<!-- <div style="position: relative;height: 50%;padding-top: 100px;bottom:0;"> -->
		<!-- <div class="btn2" style="">今日处置</div> -->
		<!-- <div ref="chart3" style="display: inline-block;width: 50%;height:100%;vertical-align: top;"></div> -->
		<!-- <div ref="chart4" style="display: inline-block;width: 50%;height:100%;vertical-align: top;"></div> -->
		<!-- <div style="position: absolute;;left:0;bottom:;width:100%;height: 90px;display: flex;justify-content: space-between;">
			<div class="cz-item">
				<div>52</div>
			</div>
			
			<div class="cz-item">
				<div>124</div>
			</div>
			<div class="cz-item">
				<div>97</div>
			</div>
			<div class="cz-item">
				<div>34</div>
			</div>
			</div>
		</div> -->
		<div style="position: relative;height: 50%;padding-top: 80px;bottom:0;">
			<div class="btn">本月处置</div>
			<div style="position: absolute;;left:0;bottom:;width:100%;height: 90px;display: flex;justify-content: space-between;">
				<div class="cz-item">
					<div>1374</div>
				</div>

				<div class="cz-item">
					<div>{{tableList2.czAllCount}}</div>
				</div>
				<div class="cz-item">
					<div>{{tableList25.czAllCount}}</div>
				</div>
				<div class="cz-item">
					<div>{{tableList3.czAllCount}}</div>
				</div>
				<div class="cz-item">
					<div>{{tableList4.czAllCount}}</div>
				</div>
			</div>
		</div>



	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				tableList:[],
				tableList1:[],
				tableList2:[],
				tableList25:[],
				tableList3:[],
				tableList4:[],
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {

			this.getData();
			this.getDatabykys();
		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			/**-------------------------获取数据-------------------------------*/
			getDatabykys() {
				// var that = this
				axios.get('https://10.192.34.79/kys119/external/getDiseaseLevelNumber')
					.then((response) => {
						// console.log("科研所接口数据")
						// console.log(response.data.data)
						this.tableList = response.data.data
						console.log("this is R_1")
						console.log(response.data.data)
						console.log(this.tableList.length)
						for(let i=0;i<this.tableList.length;i++){
							if(this.tableList[i].level==='2级'){
								this.tableList2=this.tableList[i]
							}else if(this.tableList[i].level==='1级'){
								this.tableList1=this.tableList[i]
							}else if(this.tableList[i].level==='2.5级'){
								this.tableList25=this.tableList[i]
							}else if(this.tableList[i].level==='3级'){
								this.tableList3=this.tableList[i]
							}else if(this.tableList[i].level==='4级'){
								this.tableList4=this.tableList[i]
							}
							
						}
						console.log(this.tableList1)
						console.log(this.tableList2)
						console.log(this.tableList25)
						console.log(this.tableList3)
						console.log(this.tableList4)
					})
			},
			childmd(name1) {
				// this.$parent.shigong();
				this.$emit('fatherMethod', name1)
			},
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

	.title {
		margin-top: -28px;
		margin-left: 15px;
		font-size: 16px;
		position: absolute;
		color: #bccde6;
		/* background-image: linear-gradient(#1ae3ff,#2f7aca); */
		-webkit-background-clip: text;
		/* color: transparent; */
		-webkit-user-select: none;
	}

	.tj-item {
		position: relative;
		width: 20%;
		text-align: center;
		padding-left: 12px;
		padding-top: 10px;
		-webkit-user-select: none;
	}

	.tj-item>div {
		/* display: inline-block; */
		height: 57px;
		width: 59px;
		padding-top: 20px;
		padding-left: 0px;
		font-size: 16px;
		color: #ffffff;
		background: url(./img2/组 591.png)no-repeat;
		background-size: 100% 100%;
		margin-left: 30px;
	}

	.tj-item>label {
		display: inline-block;
		width: 105px;
		margin-top: 5px;
		margin-left: 5px;
		/* padding:3px 5px; */
		border: 1px solid #4473D6;
		background: #136D8D;
		font-weight: bold;
		font-size: 16px;
		text-shadow: 0 0 10px #06203A;
	}

	.xz-item {
		position: relative;
		width: 25%;
		text-align: center;
		padding-left: 25px;
		-webkit-user-select: none;
	}

	.xz-item>div {
		display: inline-block;
		height: 70px;
		width: 50px;
		padding-top: 32px;
		/* padding-left:-10px; */
		padding-right: 5px;
		font-size: 16px;
		color: #ffffff;
		text-align: center;
		background: url(img2/xz.png)no-repeat;
		background-size: 100% 100%;
	}

	.cz-item {
		position: relative;
		width: 25%;
		text-align: center;
		padding-left: 25px;
		-webkit-user-select: none;
	}

	.cz-item>div {
		display: inline-block;
		height: 70px;
		width: 50px;
		padding-top: 32px;
		/* padding-left:-10px; */
		padding-right: 5px;
		font-size: 15px;
		color: #ffffff;
		text-align: center;
		background: url(img2/cz.png)no-repeat;
		background-size: 100% 100%;
	}

	.btn {
		position: absolute;
		display: inline-block;
		left: 10px;
		top: 85px;
		width: 20px;
		padding: 4px;
		text-align: center;
		font-size: 14px;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0 10px 10px #0000FF, 0 0 20px #fff;
		background-image: radial-gradient(#022483, rgba(1, 7, 19, .8));
		-webkit-user-select: none;
	}
</style>
