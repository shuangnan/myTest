<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		应急处置
 -->
<template>
	<div ref="con" style="height: 100%;">
		<div style="padding-top: 30px;padding-bottom: 10px;">
			<KydTabs :tabs-list="tabsList"></KydTabs>
		</div>
		<el-carousel indicator-position="none" direction="vertical" :height="carouselHeight" arrow="never">
			<el-carousel-item v-for="(item,index) in 3" :key="index">
				<table class="s-table" cellspacing="0">
					<tbody v-for="item in rows">
						<tr>
							<td style="padding-left: 45px;">
								<a class="link">20210101号文件</a><span style="float: right;color: #d36250;">3班</span>
							</td>
							<td style="width: 150px;">
								<div style="text-align: right;padding-right: 15px;font-size: 12px;margin-top: -15px;">2012-12-22</div>
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
		components: {
			KydTabs
		},
		// 数据仓库
		data() {
			return {
				rows:3,
				carouselHeight: "200px",
				tabsList: [{
					id: "1",
					text: "应急处置"
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
	.s-table {
		width: 100%;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		letter-spacing: 2px;
		padding: 0px 10px;
	}

	.s-table>tbody>tr {
		height: 62px;
		background: url(img/table-tr-r.png) no-repeat;
		background-size: 100% 46px;
		background-position: 0px 8px;
	}

	.link:hover {
		cursor: pointer;
		color: #71D1F4;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
