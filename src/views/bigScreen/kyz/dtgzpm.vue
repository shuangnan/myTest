<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		电梯故障排名
 -->
<template>
	<div ref="carouselCon" class="blue-table" style="width:100%;height:100%;">
		<el-carousel indicator-position="outside" :height="carouselHeight" arrow="never">
			<el-carousel-item v-for="(item,index) in tableDatas" :key="index">
				<el-table :data="item" size="big" stripe height="100%" class="blue-table" style="width: 100%;">
					<el-table-column label="排序" prop="i" width="100" align="center"></el-table-column>
					<el-table-column label="车站" prop="z" align="center"></el-table-column>
					<el-table-column label="故障数量" prop="p" width="100" align="center"></el-table-column>
				</el-table>
			</el-carousel-item>
		</el-carousel>
		
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
				carouselHeight: "200px",
				tableDatas: [
					[{
						i: 1,
						z: "成都东",
						p: "235"
					}, {
						i: 2,
						z: "重庆北",
						p: "195"
					}, {
						i: 3,
						z: "重庆西",
						p: "187"
					}, {
						i: 4,
						z: "贵阳",
						p: "156"
					}],
					[{
						i: 1,
						z: "成都东",
						p: "235"
					}, {
						i: 2,
						z: "重庆北",
						p: "195"
					}, {
						i: 3,
						z: "重庆西",
						p: "187"
					}, {
						i: 4,
						z: "贵阳",
						p: "156"
					}],
					[{
						i: 1,
						z: "成都东",
						p: "235"
					}, {
						i: 2,
						z: "重庆北",
						p: "195"
					}, {
						i: 3,
						z: "重庆西",
						p: "187"
					}, {
						i: 4,
						z: "贵阳",
						p: "156"
					}]
				]
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			// document.querySelector("title").innerHTML = "页面名称";
			this.carouselHeight = this.$refs.carouselCon.offsetHeight - 8 + "px";
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
