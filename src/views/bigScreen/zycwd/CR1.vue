<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		客运车站股道占用
 -->
<template>
	<div class="temp" :class="{'full':full}">
		<div style="position: absolute;z-index: 10;cursor: pointer;" :style="{top:full?'4px':'0px',right:full?'320px':'10px'}" @click="changeView">
			<a v-if="full" class="icon iconfont icon-msnui-fullsceen-exit" style="font-size: 24px;"></a>
			<a v-else class="icon iconfont icon-msnui-fullscreen" style="font-size: 24px;"></a>
		</div>
		<div class="frame-con" :class="{'mini-con':!full}">
			<iframe :src="webUrl" style="width:100%;height:100%;border:none"></iframe>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	const webUrl1 =
		"http://10.192.6.175:9090/JFLCMS/lv/#/zydbs?Oid=99990002001499A50004&Oname=遵义车务段&DepId=23012134BF4A1580E053BC04C00A22C4&DepName=软件开发一科&StnCode=ZNE&isMinFlag=true&isCloseFlag=false";
	const webUrl2 =
		"http://10.192.6.175:9090/JFLCMS/lv/#/zydbs?Oid=99990002001499A50004&Oname=遵义车务段&DepId=23012134BF4A1580E053BC04C00A22C4&DepName=软件开发一科&StnCode=ZNE&isCloseFlag=false";

	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				full: false,
				webUrl: webUrl1
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			changeView() {
				this.full = !this.full;
				this.webUrl = "";
				this.$nextTick(()=>{
					setTimeout(()=>{
						if (this.full) {
							this.webUrl = webUrl2;
						} else {
							this.webUrl = webUrl1;
						}
					},200)
				});
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
	.temp {
		width: 100%;
		height: calc(100% - 30px);
		position: relative;
		overflow: hidden;
	}

	.temp.full {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 10;
	}

	.frame-con {
		height: 100%;
		width: 100%;
	}

	.frame-con.mini-con {
		width: 125%;
		height: 125%;
		transform: scale(0.8);
		transform-origin: 0 0;
	}

	.srtitle {
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
