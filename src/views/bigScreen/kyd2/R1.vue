<template>
	<div style="width: 100%;height: 100%;font-weight: bold;">
		<table class="l-box">
			<tbody>
				<tr>
					<td style="width: 55%;">
						<CircleChart43big chartName="23293" :data-source="dataList_all"></CircleChart43big>
					</td>
					<td style="width: 45%;">
						<div style="font-size: 16px;color: #bad9d3;">配属在途</div>
						<div style="font-size: 30px;color: #bad9d3;padding: 20px 0;">42934</div>
						<div>
							<CircleChart43 type="blue" chartName="动车" :data-source="dataList_cd"></CircleChart43>
							<CircleChart43 type="green" chartName="普车" :data-source="dataList_pc"></CircleChart43>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<table class="r-box">
			<tbody>
				<tr>
					<td>
						<div style="text-align: center;">
							<div style="font-size: 16px;color: #bad9d3;padding-top: 0px;padding-bottom: 20px;">全段工作劳时统计</div>
							<CircleChart43fill chartName="0-100" :data-source="dataList_ls1"></CircleChart43fill>
							<CircleChart43fill chartName="100-160" :data-source="dataList_ls2"></CircleChart43fill>
							<CircleChart43fill chartName="160-180" :data-source="dataList_ls3"></CircleChart43fill>
							<CircleChart43fill chartName="180以上" :data-source="dataList_ls4"></CircleChart43fill>
						</div>
						<div style="width: 100%;height: 140px;padding-top: 15px;">
							<el-carousel indicator-position="none" height="140px" arrow="never">
								<el-carousel-item>
									<R1GS seq="1" tit="0-100小时"></R1GS>
								</el-carousel-item>
								<el-carousel-item>
									<R1GS seq="2" tit="100-160小时"></R1GS>
								</el-carousel-item>
								<el-carousel-item>
									<R1GS seq="3" tit="160-180小时"></R1GS>
								</el-carousel-item>
								<el-carousel-item>
									<R1GS seq="4" tit="180以上"></R1GS>
								</el-carousel-item>
							</el-carousel>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import CircleChart43big from "../../../components/bigScreen/CircleChart43big.vue";
	import CircleChart43 from "../../../components/bigScreen/CircleChart43.vue";
	import CircleChart43fill from "../../../components/bigScreen/CircleChart43fill.vue";
	import R1GS from "./R1_gs.vue";
	export default {
		data() {
			return {
				dataList_all: [25, 75],
				dataList_cd: [100, 35],
				dataList_pc: [100, 65],
				dataList_ls1: [100, 60],
				dataList_ls2: [100, 50],
				dataList_ls3: [100, 30],
				dataList_ls4: [100, 10],
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			/**-------------------------获取数据-------------------------------*/
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {

		},
		// 组件
		components: {
			CircleChart43big,
			CircleChart43,
			CircleChart43fill,
			R1GS
		},
	}
</script>

<style scoped>
	.l-box {
		float: left;
		position: relative;
		width: 50%;
		height: 100%;
		text-align: center;
	}

	.r-box {
		float: left;
		width: 50%;
		height: 100%;
	}
</style>
