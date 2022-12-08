<template>
	<table style="width: 100%;height: 100%;">
		<tbody>
			<tr>
				<td>


					<el-carousel indicator-position="none" direction="vertical" height="280px" arrow="never">
						<el-carousel-item v-for="item in 4" :key="item">
							<div class="left-con">
								<div class="l-box">
									<div class="group">上海{{item+1}}队</div>
									<div class="info">
										<h3>在途</h3>
										<div class="shadow-txt">5223人</div>
										<h3>出乘数</h3>
										<div class="shadow-txt">21车</div>
									</div>
									<div class="list">
										<table class="s-table" cellspacing="0">
											<tbody v-for="v in 5"  :key="v">
												<tr>
													<td style="padding-left: 15px;">G8522</td>
													<td style="width: 88px;padding-right: 8px;">
														<div class="percent">
															<div class="val" style="width: 50%;"></div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div class="r-box">
								<PhoneCard :data-source="personList"></PhoneCard>
							</div>
						</el-carousel-item>
					</el-carousel>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import PhoneCard from "../../../components/bigScreen/PhoneCard.vue";
	export default {
		// 组件
		components: {
			PhoneCard
		},
		data() {
			return {
				personList: []
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			const d = [];
			for (let i = 0; i < 12; i++) {
				d.push({
					name: i + 1,
					value: "张明顺" + i
				});
			}
			this.personList = d;
		},
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
	}
</script>

<style scoped>
	.left-con {
		float: left;
		width: 50%;
		height: 100%;
		background: url(img/r2train.png) no-repeat;
		background-position: -50px bottom;
	}

	.l-box {
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 40px;
		padding-left: 150px;
	}

	.l-box>.group {
		position: absolute;
		height: 26px;
		line-height: 24px;
		top: 10px;
		left: 10px;
		right: 10px;
		background: #09295A;
		border: 1px solid #28688E;
		text-align: center;
		font-weight: bold;
		color: var(--kyd2_tcolor);
	}

	.l-box>.info {
		position: absolute;
		left: 40px;
		top: 60px;
	}

	.l-box>.info>h3 {
		font-size: 16px;
		color: #bad9d3;
		padding: 10px 0 5px 0;
		margin: 0;
	}

	.l-box>.info>div {
		font-size: 24px;
		font-weight: bold;
	}

	.l-box>.list {
		position: absolute;
		top: 50px;
		left: 150px;
		right: 10px;
		bottom: 20px;
	}

	.s-table {
		width: 100%;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		letter-spacing: 2px;
		padding: 0px 10px;
		color: var(--kyd2_tcolor);
	}

	.s-table>tbody>tr {
		height: 40px;
		background: url(img/r2row.png) no-repeat;
		background-size: 100% 32px;
		background-position: 0px 4px;
	}

	.percent {
		width: 100%;
		background: #032258;
		border: 1px solid #032258;
	}

	.percent>.val {
		height: 10px;
		background: #6ACBF8;
	}

	.r-box {
		float: left;
		width: 50%;
		height: 100%;
	}
</style>
