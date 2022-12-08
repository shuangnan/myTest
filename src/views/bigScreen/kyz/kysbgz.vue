<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		客运设备故障数与故障率
 -->
<template>
	<div ref="carouselCon" class="blue-table" style="width:100%;height:100%;">
		<el-carousel indicator-position="outside" :height="carouselHeight" arrow="never">
			<el-carousel-item v-for="(item,index) in 3" :key="index">
				<HBar :data-source="hbarData" :totlaText="['总计','3日前']" unit="成都"></HBar>
			</el-carousel-item>
		</el-carousel>
		
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
				carouselHeight: "200px",
				hbarData: [{
						i: 1,
						t: "安检",
						total: 1203,
						per: 820
					},
					{
						i: 2,
						t: "客票",
						total: 1123,
						per: 820
					},
					{
						i: 3,
						t: "旅服",
						total: 1003,
						per: 720
					},
					{
						i: 4,
						t: "电梯",
						total: 980,
						per: 620
					},
					{
						i: 5,
						t: "暖通",
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
		mounted() {
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
