<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		已完成发送、收入
 -->
<template>
	<div class="con">
		<div>
			<Progress :imgurl="require('../../../assets/imgs/h-speedRailway/wc_l.png')" :imgurl1="require('../../../assets/imgs/h-speedRailway/wc_l1.png')"
			 text1="已完成发送(月)" text2="342,万人次" text2Color="#23f9fb" pgColor="#093972" pgWCColor="#09bef7" :wcNum="lkwc" :bbNum="lkbbmb"
			 :fdNum="lkfdmb" ydColor="#0c8ac9"></Progress>
		</div>
		<div>
			<Progress :imgurl="require('../../../assets/imgs/h-speedRailway/wc_r.png')" :imgurl1="require('../../../assets/imgs/h-speedRailway/wc_r1.png')"
			 text1="已完成收入(月)" text2="342,万元" text2Color="#f89f93" pgColor="#39335d" pgWCColor="#f89f93" :wcNum="srwc" :bbNum="srbbmb"
			 :fdNum="srfdmb" ydColor="#c46d62"></Progress>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import Progress from "./Progress.vue";
	export default {
		// 组件
		components: {
			Progress
		},
		// 数据仓库
		data() {
			return {
				lkwc: "500",
				lkbbmb: "600",
				lkfdmb: "800",
				srwc: "300",
				srbbmb: "400",
				srfdmb: "500"
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			// document.querySelector("title").innerHTML = "页面名称";
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			getData() {

			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.con {
		display: inline-block;
		width: 900px;
		height: 100%;
	}

	.con>div {
		display: inline-block;
		width: 44%;
		height: 100%;
		padding: 10px;
		margin: 0 3%;
		border: 2px solid #06315B;
		background: rgba(6, 23, 95, .8);
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
