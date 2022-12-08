<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		列车长信息
 -->
<template>
	<div ref="con" style="position: relative;height: 100%;">
		<div class="tit">
			<span class="shadow-txt">动车</span>
			<span class="shadow-txt" style="float: right;">普车</span>
		</div>
		<div style="padding-top: 30px;padding-bottom: 10px;">
			<KydTabs :tabs-list="tabsList"></KydTabs>
		</div>
		<el-carousel indicator-position="none" direction="vertical" :height="carouselHeight" arrow="never">
			<el-carousel-item v-for="(item,index) in 3" :key="index">
				<table class="s-table" cellspacing="0">
					<tbody v-for="item in rows">
						<tr>
							<td style="width: 120px;padding-left: 45px;">张小明</td>
							<td>上海一队&nbsp;<span style="font-size: 12px;">3班</span></td>
							<td style="width: 140px;">
								<div style="text-align: right;padding-right: 15px;color: #50b6d3;">车次</div>
								<div style="padding-left: 10px;padding-top: 5px;font-size: 12px;">13599590050</div>
							</td>
						</tr>
					</tbody>
				</table>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	import KydTabs from "../../../components/bigScreen/KydTabs.vue";
	export default {
		// 组件
		components: {KydTabs},
		// 数据仓库
		data() {
			return {
				rows:3,
				carouselHeight:"200px",
				tabsList: [{
					id: "1",
					text: "列车长信息"
				}]
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			const h = this.$refs.con.offsetHeight - 80 ;
			this.carouselHeight = h+"px";
			this.rows = Math.floor(h/60);
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


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
	.tit {
		position: absolute;
		width: 100%;
		padding: 10px;
		font-size: 22px;
		font-weight: bold;
	}
	
	.s-table{
		width: 100%;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		letter-spacing: 2px;
		padding: 0px 10px;
	}
	.s-table>tbody>tr{
		height: 62px;
		background: url(img/table-tr-l.png) no-repeat;
		background-size: 100% 46px;
		background-position: 0px 8px;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
