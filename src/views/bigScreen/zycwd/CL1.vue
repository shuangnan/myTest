<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		旅客发送及收入
 -->
<template>
	<div class="temp">
		<div class="sr_fdbb">
			<div style="width:230px;" class="fdbbPress">
				<div style="display:flex">
					<div style="width:65px;text-align:center;">
						<img src="./img/lkfs.png" />
					</div>
					<div>
						<div>已完成发送(月)</div>
						<div style="margin-top:5px;">
							<span>{{lkfsl}}</span>万人次
						</div>
					</div>
				</div>
				<div style="padding:5px 10px;">
					<div style="width:100%;height:10px;position:relative">
						<div class="fdBarMax"></div>
						<div class="bbBarMax" :style="{width:fdNumFS/fdMaxNumFS*100+'%'}"></div>
						<div class="bbBarMin" :style="{width:bbNumFS/fdMaxNumFS*100+'%'}"></div>
						<div class="fsBar" :style="{width:lkfsl/fdMaxNumFS*100+'%'}"></div>
					</div>
				</div>
			</div>
			<div style="width:230px;" class="fdbbPress">
				<div style="display:flex;justify-content:flex-end;">
					<div>
						<div>已完成收入(月)</div>
						<div style="margin-top:5px;">
							<span>{{wcsr}}</span>万元
						</div>
					</div>
					<div style="width:65px;text-align:center;">
						<img src="./img/wcsr.png" />
					</div>
				</div>
				<div style="padding:5px 10px;transform:rotateY(180deg)">
					<div style="width:100%;height:10px;position:relative">
						<div class="fdBarMax"></div>
						<div class="bbBarMax" :style="{width:fdNumSR/fdMaxNumSR*100+'%'}"></div>
						<div class="bbBarMin" :style="{width:bbNumSR/fdMaxNumSR*100+'%'}"></div>
						<div class="fsBar" :style="{width:wcsr/fdMaxNumSR*100+'%'}"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="srbtn">
			<tabs :tabsList="[{id:0,text:infoBtn}]" @titleClick='InfoClick'></tabs>
		</div>
		<div class="srchart">
			<chart></chart>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../assets/com.js";
	import tabs from "../../../components/bigScreen/KydTabs";
	import chart from "./CL1Chart.vue";
	export default {
		// 组件
		components: {
			tabs,
			chart
		},
		// 数据仓库
		data() {
			return {
				selectType: "",
				infoBtn: "",
				stns: ["ZYE", "ZNE", "XFW", "TBE", "TDE", "LSE", "XWE"],
				// 旅客发送---已完成
				lkfsl: 0,
				// 旅客发送---必保
				bbNumFS: 0,
				// 旅客发送---奋斗
				fdNumFS: 0,
				// 客运收入---已完成
				wcsr: 0,
				// 客运收入---必保
				bbNumSR: 0,
				// 客运收入---奋斗
				fdNumSR: 0,
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			// this.infoBtn = "<div class='CL1infoBtn'>详情</div>"
			this.infoBtn = "7日统计";
			this.getData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			InfoClick(item) {
				this.$emit("changeInfoDetailFlag");
			},

			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			//获取数据---旅客发送及收入情况
			getData() {
				const dayFirst = C.formatDate('', 'yyyyMM01');
				const curDay = C.formatDate('', 'yyyyMMdd');
				// [站名略码用','隔开（ICW','CUW）,类型（-发送人数，2-客运收入），开始日期（20210511），开始日期（20210518）]
				C.getData({
					url:this.$store.state.url,
					c: "trdm_ys_309",
					s: [this.stns.join("','"), 1, dayFirst, curDay]
				}, (r) => {
					this.lkfsl = r && r.length > 0 ? (r[0].DATA_NUM*0.0001).toFixed(3) : 0;
					console.log("【trdm_ys_309】旅客发送及收入情况(发送)>>>", r);
				});
				C.getData({
					url:this.$store.state.url,
					c: "trdm_ys_309",
					s: [this.stns.join("','"), 2, dayFirst, curDay]
				}, (r) => {
					this.wcsr = r && r.length > 0 ? (r[0].DATA_NUM*0.0001).toFixed(3) : 0;
					console.log("【trdm_ys_309】旅客发送及收入情况(收入)>>>", r);
				});
				
				// 获取车务段级奋斗、必保数据
				C.getData({
					url:this.$store.state.url,
					c: "trdm_ys_310",
					s: ["遵义车务段", curDay.substring(0,6)]
				}, (r) => {
					if(r&&r.length>0){
						// {KYFSL_B: "71", KYSR_B: "7700", KYFSL_F: "74", KYSR_F: "8100"}
						// KYSR_B, 收入必保（万元）
						// KYFSL_B,人数必保（万人）
						// KYSR_F,收入奋斗（万元）
						// KYFSL_F人数奋斗（万人）
						// 旅客发送---必保
						this.bbNumFS = r[0].KYFSL_B;
						// 旅客发送---奋斗
						this.fdNumFS = r[0].KYFSL_F;
						// 客运收入---必保
						this.bbNumSR = r[0].KYSR_B;
						// 客运收入---奋斗
						this.fdNumSR = r[0].KYSR_F;
					}
					console.log("【trdm_ys_310】获取车务段级奋斗、必保数据>>>", r);
				});
			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {
			fdMaxNumFS() {
				return this.fdNumFS * 1.3
			},
			fdMaxNumSR() {
				return this.fdNumSR * 1.3
			},
		},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.temp {
		width: 100%;
		height: 100%;
	}

	.srtitle {
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}

	.sr_fdbb {
		height: 75px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		position: relative;
		z-index: 3;
	}

	.sr_fdbb span {
		font-size: 24px;
		color: #fefffa;
		display: inline-block;
		width: 120px;
	}

	.fdbbPress {
		color: #959fa2;
		font-size: 12px;
	}

	>>>.CL1infoBtn {
		background: url("./img/btn.png");
		background-size: 100% 100%;
		font-size: 18px;
		height: 40px;
		line-height: 40px;
		width: 120px;
		margin-left: -5px;
		margin-right: -5px;
		position: relative;
		z-index: 3;
	}

	.fdBarMax {
		width: calc(100%);
		height: 10px;
		background: #3d3425;
		border: 1px solid #5c6375;
		border-radius: 3px;
		transform: skew(-40deg);
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.bbBarMax {
		height: 10px;
		background: #3c4228;
		border: 1px solid #5c6375;
		border-radius: 3px;
		transform: skew(-40deg);
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		border-right: 3px solid #070e34;
	}

	.bbBarMin {
		height: 10px;
		background: #3c4258;
		border: 1px solid #5c6375;
		border-radius: 3px;
		transform: skew(-40deg);
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
		border-right: 3px solid #070e34;
	}

	.fsBar {
		height: 10px;
		background: #fefffa;
		border-radius: 3px;
		transform: skew(-40deg);
		position: absolute;
		left: 0;
		top: 0;
		z-index: 4;
		box-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
	}

	.srbtn {
		margin-top: -25px;
	}

	.srchart {
		margin: 10px;
		width: calc(100% - 20px);
		height: calc(100% - 110px);
		background: url("./img/fssrtab.png");
		background-size: 100% 100%;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
