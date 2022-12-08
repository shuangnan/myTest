<!-- 
 * @created：	2020年8月7日
 * @author：	ch
 * @version:	v1.0
 * @desc:		进度条
 -->
<template>
	<div style="height: 100%;width:100%;">
		<div class="wc_item">
			<div class="wc_item_1">
				<img :src="imgurl" style="height:65px;" />
			</div>
			<div class="wc_item_2">
				<div style="font-size:14px;white-space:nowrap">{{text1}}</div>
				<div style="font-size:12px;white-space:nowrap">
					<span :style="{color:text2Color,fontSize:fontSize_wc}">{{wcNum}}</span>
					&nbsp;
					{{text2.split(",")[1]}}
				</div>
			</div>
			<div class="wc_item_3">
				<div style="height:100%;height:100%;position: relative;font-size:12px;">
					<div class="pro_progress">
						<div class="proGress_div" :style="{'background':pgColor}">
							<div style="overflow:hidden" :style="{'background':pgWCColor,width:wcPrev*100+'%'}">
								<transition>
									<table class="proGress_div_G" :style="{'animation-duration':(wcPrev*10/1.3).toFixed(1)+'s'}">
										<tbody>
											<tr>
												<td v-for="item in getG_num" :key="item" :style="{'box-shadow':'0px 0px 4px 2px '+ydColor}"></td>
											</tr>
										</tbody>
									</table>
								</transition>
							</div>
						</div>
					</div>
					<div class="pro_numItem" :style="{left:bbNum/(fdNum*allPie)*100+'%'}">
						<div class="pro_numItemContent">
							<div style="height:20px;">{{parseInt(wcNum/bbNum*100)?parseInt(wcNum/bbNum*100):"0"}}%</div>
							<img :src="imgurl1" style="line-height:20px;" />
							<div style="height:20px;color:#54ca54;">必保</div>
						</div>
					</div>
					<div class="pro_numItem" :style="{left:fdNum/(fdNum*allPie)*100+'%'}">
						<div class="pro_numItemContent">
							<div style="height:20px;">{{parseInt(wcNum/fdNum*100)?parseInt(wcNum/fdNum*100):"0"}}%</div>
							<img :src="imgurl1" style="line-height:20px;" />
							<div style="height:20px;color:#e99e72">奋斗</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				allPie: 1.1, //数据最大为奋斗数据的1.1倍
			}
		},
		// 属性
		props: {
			imgurl: { //名称图片地址
				type: String,
				default: "",
			},
			imgurl1: { //奋斗必保图片地址
				type: String,
				default: "",
			},
			text1: { //名称
				type: String,
				default: "",
			},
			text2: { //已完成数量 342,万人次
				type: String,
				default: "",
			},
			text2Color: { //已完成数量的字体颜色
				type: String,
				default: "",
			},
			pgColor: { //空条背景色
				type: String,
				default: "",
			},
			pgWCColor: { //已完成背景色
				type: String,
				default: "",
			},
			wcNum: { //已完成
				type: String,
				default: "0",
			},
			bbNum: { //必保
				type: String,
				default: "0",
			},
			fdNum: { //奋斗
				type: String,
				default: "0",
			},
			ydColor: { //滚动条内动画竖条颜色
				type: String,
				default: "",
			}
		},
		// 组件挂载完毕
		mounted() {

		},
		// 方法
		methods: {

			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			getData() {

			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {
			getG_num() {
				var wcprev = this.wcNum / (this.fdNum * this.allPie);
				if (wcprev > 1) {
					wcprev = 1;
				}
				var rs = parseInt(wcprev * 20);
				if (isNaN(rs)) {
					rs = 0;
				} else {
					if (rs < 2) {
						rs = 2;
					}
				}
				return rs
			},
			fontSize_wc() {
				var rs = 22;
				if (this.wcNum.length > 4) {
					rs = 22 - this.wcNum.length + 2;
				}
				return rs + "px";
			},
			wcPrev() {
				var rs = this.wcNum / (this.fdNum * this.allPie);
				if (rs > 1) {
					rs = 1;
				}
				return rs;
			}
		},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.wc_item {
		width: 100%;
		height: 70px;
	}

	.wc_item_1 {
		float: left;
		width: 65px;
		height: 100%;
	}

	.wc_item_2 {
		float: left;
		width: 85px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
		height: 100%;
	}

	.wc_item_2>div {
		height: 24px;
		display: flex;
		align-items: center;
	}

	.wc_item_3 {
		float: left;
		width: calc(100% - 155px);
		text-align: center;
		padding: 0 30px;
		height: 100%;
	}

	.proGress_div {
		height: 10px;
		display: inline-block;
		width: 100%;
		border-radius: 10px;
		overflow: hidden;
	}

	.proGress_div>div:nth-child(1) {
		height: 100%;
		border-radius: 10px;
	}

	.proGress_div_G {
		display: inline-block;
		vertical-align: top;
		height: 100%;
		width: 200%;
		animation: proGress_div_G 3s infinite;
		animation-timing-function: linear;
		transform: translateX(-50%);
		border-collapse: collapse;
	}

	.proGress_div_G td {
		height: 10px;
		width: 25px;
	}

	@keyframes proGress_div_G {
		0% {
			transform: translateX(-50%);
		}

		100% {
			transform: translateX(0%);
		}
	}

	.pro_numItem {
		position: absolute;
		top: 0px;
		height: 100%;
		width: 30px;
	}

	.pro_numItemContent {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0px;
		left: -17px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pro_progress {
		position: absolute;
		top: 0px;
		height: 100%;
		width: 100%;
		left: 0px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
