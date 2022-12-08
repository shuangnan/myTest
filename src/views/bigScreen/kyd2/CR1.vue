<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		命令开行
 -->
<template>
	<div style="position: relative;width: 100%;height: 100%;padding: 10px;">
		<div style="position: absolute;top:-32px;left:50%;margin-left: -74px;">
			<ComboH auto="5" :data-source="comboList" @select="handleComboSelect"></ComboH>
		</div>
		<div class="shadow-txt" style="padding-left: 10px;padding-bottom: 10px;">开行计划变化</div>
		<div ref="box" class="box">
			<div class="log"></div>
			<div class="main">
				<el-carousel ref="myCarousel" indicator-position="none" :autoplay="false" :height="carouselHeight" arrow="never">
					<el-carousel-item key="今日开行" name="今日开行">
						<table class="table-view" border="0">
							<tbody>
								<tr>
									<td style="height: 34%;width: 100px;"><label class="shadow-txt" style="font-size: 28px;">123,445</label></td>
									<td style="color: var(--kyd2_tcolor);">
										<div style="font-size: 12px;">列车总数</div>
										<div>同比：<a class="tongbi">↑5%</a></div>
									</td>
								</tr>
								<tr>
									<td colspan="2" style="height: 15%;padding-right: 5px;">
										<div class="percent">
											<div class="val" style="width: 50%;"></div>
										</div>
									</td>
								</tr>
								<tr style="color: var(--kyd2_tcolor);">
									<td valign="bottom">已开行</td>
									<td valign="bottom">开行</td>
								</tr>
								<tr style="font-size: 20px;" class="shadow-txt">
									<td>123,34</td>
									<td>3422</td>
								</tr>
								<tr style="color: var(--kyd2_tcolor);">
									<td valign="bottom">同比</td>
									<td valign="bottom">同比</td>
								</tr>
								<tr style="">
									<td valign="top"><a class="tongbi">↑5%</a></td>
									<td valign="top"><a class="tongbi">↑5%</a></td>
								</tr>
							</tbody>
						</table>
					</el-carousel-item>
					<el-carousel-item  key="命令" name="命令">
						<table class="table-view" border="0">
							<tbody>
								<tr>
									<td style="height: 34%;width: 100px;"><label class="shadow-txt" style="font-size: 28px;">123,445</label></td>
									<td style="color: var(--kyd2_tcolor);">
										<div style="font-size: 12px;">命令总数</div>
										<div>同比：<a class="tongbi">↑5%</a></div>
									</td>
								</tr>
								<tr style="color: var(--kyd2_tcolor);">
									<td valign="bottom">车底变化</td>
									<td valign="bottom">列车加开</td>
								</tr>
								<tr style="font-size: 27px;" class="shadow-txt">
									<td>134</td>
									<td>342</td>
								</tr>
								<tr style="color: var(--kyd2_tcolor);">
									<td valign="bottom">列车甩挂</td>
									<td valign="bottom">列车停运</td>
								</tr>
								<tr style="font-size: 27px;" class="shadow-txt">
									<td>124</td>
									<td>322</td>
								</tr>
							</tbody>
						</table>
					</el-carousel-item>
				</el-carousel>
			</div>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	import ComboH from "../../../components/bigScreen/comboH.vue";
	export default {
		// 组件
		components: {
			ComboH
		},
		// 数据仓库
		data() {
			return {
				carouselHeight: "200px",
				comboList: ["今日开行", "命令"],
				curTab: "今日开行"
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.carouselHeight = this.$refs.box.offsetHeight - 0 + "px";
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			handleComboSelect(value) {
				this.curTab = value;
				this.$refs.myCarousel.setActiveItem(value);
			}

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
	.box {
		position: relative;
		width: 100%;
		height: calc(100% - 30px);
		padding: 0px 0px 0px 180px;
		background: url(img/cr1box.png)no-repeat;
		background-size: 100% 100%;
	}

	.box>.log {
		position: absolute;
		top: 50%;
		left: 1%;
		width: 180px;
		height: 186px;
		margin-top: -93px;
		padding: 10px 10px 20px 10px;
		background: url(img/cr1log.png) no-repeat;
		background-size: 100% 100%;
	}

	.box>.main {
		width: 100%;
		height: 100%;
	}

	.table-view {
		width: 100%;
		height: 100%;
		text-align: center;
	}

	.percent {
		width: 100%;
		background: #545454;
		border: 1px solid #5C6665;
	}

	.percent>.val {
		height: 10px;
		background: #59DCCA;
	}

	.tongbi {
		color: #fa4623;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
