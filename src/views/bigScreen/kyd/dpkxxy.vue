<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		动车、普车开行效益
 -->
<template>
	<div style="width:100%;height:100%;">
		<HBar :data-source="hbarData" unit="单位: 元"></HBar>
	</div>
</template>

<script>
	// 这里引用各种资源
	import HBar from "./HBar.vue";
	export default {
		// 组件
		components: {
			HBar
		},
		// 数据仓库
		data() {
			return {
				hbarData: [{
						i: 1,
						t: "成都市",
						total: 1203,
						per: 820
					},
					{
						i: 2,
						t: "重庆",
						total: 1123,
						per: 820
					},
					{
						i: 3,
						t: "贵阳",
						total: 1003,
						per: 720
					},
					{
						i: 4,
						t: "绵阳",
						total: 980,
						per: 620
					},
					{
						i: 5,
						t: "德阳",
						total: 820,
						per: 420
					},
				]
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {},
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

</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
