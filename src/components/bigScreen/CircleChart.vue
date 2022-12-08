<!-- 
 * @created：	2021年4月26日
 * @author：	ch
 * @version:	v1.0
 * @desc:		环形统计
 -->
<template>
	<div class="box-con">
		<div class="chart-tit" :class="{'double':chartNameArr.length===2}">
			<div v-for="tit in chartNameArr">{{tit}}</div>
			
			<!-- <ul class="points">
				<li v-for="p in 30" style="background: #5CA119;"></li>
			</ul> -->
			
		</div>
		<div class="box">
			<div class="bg1">
				<div ref="percent1" class="pr1">
					<ul class="points-list points1">
						<li v-for="p in 30" style="background: #5CA119;" :style="{transform:'rotate('+6*(p-1)+'deg)'}"></li>
					</ul>
				</div>
			</div>
			<div class="bg2">
				<div ref="percent2" class="pr2">
					<ul class="points-list points2">
						<li v-for="p in 30" style="background: #156BF6;" :style="{transform:'rotate(-'+6*(p-1)+'deg)'}"></li>
					</ul>
				</div>
			</div>
			<div class="content"></div>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				chartNameArr:[],
				percent1:0,
				percent2:0
			}
		},
		// 属性
		props: {
			// 名称
			chartName:{
				type:String,
				default:"环形统计"
			},
			// 数据
			dataSource: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			this.chartNameArr = this.chartName.split(",");
			if(this.dataSource.length>0){
				setTimeout(()=>{
					const p1 = Math.floor( 180/this.dataSource[0].total*this.dataSource[0].cur);
					const p2 = Math.floor( 180/this.dataSource[1].total*this.dataSource[1].cur);
					this.$refs.percent1.style.transform = "rotate(-"+p1+"deg)";
					this.$refs.percent2.style.transform = "rotate("+p2+"deg)";
				},500);
			}
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/

			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.box-con{
		position: relative;
		width: 267px;
		height: 267px;
		background: url(../../assets/imgs/bigScreen/lightCircle.png)no-repeat;
		background-size: 100% 100%;
	}
	.chart-tit{
		position: absolute;
		top: 50%;
		left: 50%;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		color: #D0C5E3;
		text-shadow: 0 0 10px #0000FF,0 0 20px #fff;
		width: 140px;
		height: 140px;
		line-height: 140px;
		margin-top: -70px;
		margin-left: -70px;
		z-index: 10;
	}
	.chart-tit.double{
		padding-top: 15px;
		line-height: 50px;
	}
	
	.points-list{
		position: absolute;
		top: 50%;
		width: 0px;
		height: 0px;
		list-style: none;
		padding: 0;
		margin: 0;
		line-height: 10px;
		background: red;
	}
	.points-list.points1{
		left: 6px;
		transform: rotate(1deg);
	}
	.points-list.points2{
		right: 0px;
		transform: rotate(-5deg);
	}
	.points-list>li{
		position: absolute;
		display: inline-block;
		top:-90px;
		width: 6px;
		height: 90px;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.points-list.points1>li{
		right: 0;
		transform-origin:0px 90px;/*旋转X点为线条宽度*/
	}
	.points-list.points2>li{
		left: 0;
		transform-origin:0px 90px;/*旋转X点为线条宽度*/
	}
	
	.box{
		position: absolute;
		top: 50%;
		left: 50%;
		width: 200px;
		height: 200px;
		margin-top: -100px;
		margin-left: -100px;
		transform: rotate(-30deg);
	}
	.content{
		position: absolute;
		top: 50%;
		left: 50%;
		width:140px;
		height: 140px;
		margin-top: -70px;
		margin-left: -70px;
		border-radius: 50%;
		background:#070E34;
		z-index: 5;
	}
	.bg1{
		position: absolute;
		left: 0;
		width: 100px;
		height: 200px;
		border-radius: 200px 0 0 200px;
		z-index: 3;
		background: #10214D;
		overflow: hidden;
	}
	.bg1::before{
		content: "";
		position: absolute;
		top: 25px;
		right: 0;
		width: 75px;
		height: 150px;
		border-radius: 150px 0 0 150px;
		background: #273D78;/*内圈*/
	}
	
	.pr1{
		position: absolute;
		left: 100px;
		width: 100px;
		height: 200px;
		border-radius: 0 200px 200px  0;
		/* background: red; */
		transform: rotate(-0deg);
		transform-origin: 0 100px;
		transition: transform 2s;
		/* animation: pr1A 2s 1 ease-in-out forwards; */
	}
	
	.bg2{
		position: absolute;
		left: 100px;
		width: 100px;
		height: 200px;
		border-radius: 0 200px 200px 0;
		z-index: 3;
		background: #10214D;
		overflow: hidden;
	}
	.bg2::before{
		content: "";
		position: absolute;
		top: 25px;
		left: 0;
		width: 75px;
		height: 150px;
		border-radius: 0 150px 150px 0;
		background: #273D78;/*内圈*/
	}
	
	.pr2{
		position: absolute;
		left: -100px;
		width: 100px;
		height: 200px;
		border-radius: 200px 0 0 200px;
		/* background: green; */
		transform: rotate(0deg);
		transform-origin: 100px 100px;
		transition: transform 2s;
		/* animation: pr2A 2s 1 ease-in-out forwards; */
	}
	@keyframes pr1A{
		0%{
			transform: rotate(0deg);
		}
		/* 50%{
			transform: rotate(0deg);
		} */
		100%{
			transform: rotate(-180deg);
		}
	}
	@keyframes pr2A{
		0%{
			transform: rotate(0deg);
		}
		100%{
			transform: rotate(180deg);
		}
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
	
</style>
