<!-- 
 * @created：	2021年4月27日
 * @author：	ch
 * @version:	v1.0
 * @desc:		电话卡片
 -->
<template>
	<ul class="card-list">
		<li v-for="item in dataSource" :key="item.name">
			<div class="head" :class="{'empty':outName}">
				<div v-if="outName"></div>
				<div v-else>{{item.name}}</div>
			</div>
			<div v-if="outName">{{item.name}}</div>
			<div class="content" :class="{'empty':outName}">{{item.value}}</div>
		</li>
	</ul>
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
			}
		},
		// 属性
		props: {
			outName:{
				type:Boolean,
				default:false
			},
			dataSource: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		// 组件挂载完毕
		mounted() {
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
	.card-list{
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
		height: 100%;
	}
	.card-list>li{
		display: inline-block;
		vertical-align: top;
		margin: 10px;
		width: 85px;
		height: 50px;
		padding: 1px;
		text-align: center;
		background: url(../../assets/imgs/bigScreen/phone-card.png);
		background-size: 100% 100%;
	}
	.head{
		position: relative;
		color: #ffffff;
		background: #222C3C;
		font-size: 12px;
	}
	.head>div{
		background: #234271;
		width: 70%;
		line-height: 20px;
	}
	.head.empty>div{
		height: 8px;
		margin-bottom: 2px;
	}
	
	.content{
		line-height: 26px;
		color: #6093ee;
		text-shadow: 0 0 10px #0000FF,0 0 20px #fff;
	}
	.content.empty{
		line-height: 20px;
	}
</style>
