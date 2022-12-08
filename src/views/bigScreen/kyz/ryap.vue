<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		人员安排
 -->
<template>
	<div style="width:100%;height:100%;padding:5px;">
		<div style="width:100%;height:calc(50% - 10px);">
			<ryapItem title="动车"></ryapItem>
		</div>
		<div style="width:100%;height:calc(50% - 10px);margin-top:10px;">
			<ryapItem title="普车"></ryapItem>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import ryapItem from "./ryapItem";
	export default {
		// 组件
		components: {ryapItem},
		// 数据仓库
		data() {
			return {}
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
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
