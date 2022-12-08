<!-- 
 * @created：	2021年7月16日
 * @author：	ch
 * @version:	v1.0
 * @desc:		旅客收入量
 -->
<template>
	<div class="fdbbPress" style="padding-left: 140px;">
		<div style="width: 160px;padding-bottom: 5px;padding-top: 44px;">
			<div class="press-con">
				<div class="press-item back"></div>
				<div class="press-item cur SSlight" :style="{width:cur/maxTotal*100+'%'}"></div>
				<div class="press-item bb" :style="{width:curBb/maxTotal*100+'%'}">
					<el-tooltip placement="right" popper-class="customPopper1">
						<div slot="content">{{bbpre}}</div>
						<div class="bb_icon">
							<div class="HScroll"></div>
						</div>
					</el-tooltip>
				</div>
				<div class="press-item fd" :style="{width:curFd/maxTotal*100+'%'}">
					<el-tooltip placement="right" popper-class="customPopper1">
						<div slot="content">{{fdpre}}</div>
						<div class="fd_icon">
							<div class="HScroll"></div>
						</div>
					</el-tooltip>
				</div>
			</div>
		</div>
		<div style="display:flex;width:200px;padding-top: 10px;position:absolute;right:0px;top:0px;">
			<div>
				<div>已完成收入</div>
				<div style="margin-top:8px;">
					<span class="press-total">{{cur}}</span>万元
				</div>
			</div>
			<div style="width:65px;text-align:center;">
				<img src="./img/wcsr.png" />
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

			}
		},
		// 属性
		props: {
			cur: { //当前
				type: String,
				default: "142",
			},
			curBb: { //必保
				type: Number,
				default: 400,
			},
			curFd: { //奋斗
				type: Number,
				default: 500,
			}
		},
		// 组件挂载完毕
		mounted() {
			// document.querySelector("title").innerHTML = ""; //页面名称
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
		computed: {
			maxTotal() {
				return this.curFd * 1.3
			},
			bbpre() {
				return parseInt(this.cur / this.curBb * 100) + "%";
			},
			fdpre() {
				return parseInt(this.cur / this.curFd * 100) + "%";
			}
		},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.fdbbPress {
		display: flex;
		color: #959fa2;
		font-size: 12px;
		justify-content: space-between;
		align-items: flex-end;
	}

	.fdbbPress::after {
		content: "";
		position: absolute;
		left: 6px;
		bottom: 0;
		height: 38px;
		width: 384px;
		background: url(img/fdbb_top_right.png) no-repeat;
		background-size: 100% 100%;
	}

	.press-total {
		display: inline-block;
		vertical-align: middle;
		padding-right: 8px;
		font-size: 24px;
		font-weight: bold;
		color: #fefffa;
	}

	/* 进度条容器 */
	.press-con {
		position: relative;
		width: 100%;
		height: 10px;
		transform: rotateY(180deg);
	}

	.press-item {
		position: absolute;
		left: 0;
		top: 0px;
		height: 100%;
		border: 1px solid #5c6375;
		border-radius: 3px;
		transform: skew(-40deg);
	}

	/* 进度条背景 */
	.press-item.back {
		width: 100%;
		background: #3d3425;
		z-index: 1;
	}

	/* 当前完成 */
	.press-item.cur {
		background: #fefffa;
		z-index: 4;
		box-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
	}

	/* 必保 */
	.press-item.bb {
		background: #3c4228;
		border-right: 3px solid #070e34;
		z-index: 3;
	}

	/* 奋斗 */
	.press-item.fd {
		background: #3c4258;
		border-right: 3px solid #070e34;
		z-index: 2;
	}

	.bb_icon {
		content: "";
		position: absolute;
		top: -20px;
		right: 5px;
		width: 6px;
		height: 13px;
		transform: skew(40deg);
		overflow: hidden;
	}

	.bb_icon>div {
		height: 200%;
		width: 100%;
		background: url("./img/iconDown_bb.png") repeat-y;
	}

	.fd_icon {
		content: "";
		position: absolute;
		top: -20px;
		right: 5px;
		width: 6px;
		height: 14px;
		background-size: 100% 100%;
		transform: skew(40deg);
		overflow: hidden;
	}

	.fd_icon>div {
		height: 200%;
		width: 100%;
		background: url("./img/iconDown_fd.png") repeat-y;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
