<template>
	<div style="width: 100%;height: 100%;">
		<div class="l-box">
			<div class="chart">
				<CircleChart chartName="成都,客运段" :data-source="chartData"></CircleChart>
			</div>
			<div class="info">
				<div class="tit">成都东开行效益</div>
				<div class="group ps">普速车</div>
				<div class="val">
					<span>122&nbsp;</span>&nbsp;<label>万元&nbsp;/134&nbsp;万元</label>
				</div>
				<div class="group dc">动车</div>
				<div class="val">
					<span>122&nbsp;</span>&nbsp;<label>万元&nbsp;/134&nbsp;万元</label>
				</div>
			</div>
		</div>
		<div class="r-box">
			<div class="shadow-txt head">开行效益排行</div>
			<PhoneCard :data-source="data_xy" out-name style="height: 140px;"></PhoneCard>
			<div class="shadow-txt head">客坐率</div>
			<PhoneCard :data-source="data_kzl" out-name style="height: 140px;"></PhoneCard>
		</div>
	</div>
</template>

<script>
	import CircleChart from "../../../components/bigScreen/CircleChart.vue";
	import PhoneCard from "../../../components/bigScreen/PhoneCard.vue";
	export default {
		// 组件
		components: {
			CircleChart,
			PhoneCard
		},
		data() {
			return {
				chartData: [{
					name: "动车",
					total: 200,
					cur: 160
				}, {
					name: "普速车",
					total: 100,
					cur: 40
				}],
				data_xy: [],
				data_kzl: []
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			const d1 = [];
			const d2 = [];
			for (let i = 0; i < 8; i++) {
				d1.push({
					name: i + 1,
					value: "成都" + i
				});
				d2.push({
					name: i + 1,
					value: "G854" + i
				});
			}
			this.data_xy = d1;
			this.data_kzl = d2;
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
	.l-box {
		float: left;
		position: relative;
		width: 50%;
		height: 100%;
	}

	.l-box>.chart {
		float: left;
		width: 260px;
		height: 300px;
		padding-top: 20px;
		margin-top: calc((100% - 300px)/2);
	}

	.l-box>.info {
		float: right;
		width: calc(100% - 260px);
		height: 300px;
		margin-top: calc((100% - 380px)/2);
		padding: 15px 10px 0px 0px;
		color: #aec0f2;
		font-weight: bold;
		text-align: center;
	}

	.l-box>.info>.tit {
		font-size: 14px;
		height: 35px;
		text-align: left;
	}

	.l-box>.info>.group {
		font-size: 14px;
		padding: 10px;
		text-align: center;
	}

	.l-box>.info>.group.ps {
		border-top: 1px solid #599C19;
	}

	.l-box>.info>.group.dc {
		border-top: 1px solid #1B4A95;
	}

	.l-box>.info>.val {
		padding-bottom: 90px;
	}

	.l-box>.info>.val>span {
		font-size: 18px;
	}

	.l-box>.info>.val>label {
		font-size: 12px;
	}


	.r-box {
		float: left;
		width: 50%;
		height: 100%;
	}

	.r-box>.head {
		padding: 15px 10px 0px 10px;
		font-size: 18px;
		font-weight: bold;
	}
</style>
