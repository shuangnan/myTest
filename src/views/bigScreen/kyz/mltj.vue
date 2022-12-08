<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		命令统计
 -->
<template>
	<div ref="carouselCon" class="blue-table" style="width:100%;height:100%;">
		<el-carousel indicator-position="outside" :height="carouselHeight" arrow="never">
			<el-carousel-item v-for="(item,index) in 3" :key="index">
				<HBar :data-source="hbarData1" unit="单位: 条" :totlaText="['接收','生效']" :bgFlag="index===0"></HBar>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	// 这里引用各种资源
	import HBar from "./Hbar_H.vue";
	export default {
		// 组件
		components: {
			HBar
		},
		// 数据仓库
		data() {
			return {
				carouselHeight: "200px",
				hbarData1: [{
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
						per: 820
					},
					{
						i: 4,
						t: "绵阳",
						total: 980,
						per: 820
					},
					{
						i: 5,
						t: "德阳",
						total: 820,
						per: 720
					},
				],
				hbarData2: [{
						i: 6,
						t: "成都市",
						total: 760,
						per: 720
					},
					{
						i: 7,
						t: "重庆",
						total: 710,
						per: 680
					},
					{
						i: 8,
						t: "贵阳",
						total: 650,
						per: 523
					},
					{
						i: 9,
						t: "绵阳",
						total: 560,
						per: 250
					},
					{
						i: 10,
						t: "德阳",
						total: 486,
						per: 121
					},
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
