<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		工单
 -->
<template>
	<table class="group-table" cellspaing="0">
		<tbody>
			<template v-for="(item,index) in list">
				<tr :key="index">
					<th class="group">
						<img :src="item.src" class="group-img">
					</th>
					<th>
						<div>待接收</div><span style="color:#f3a566">{{item.waiting}}</span>
					</th>
					<th>
						<div>处理中</div><span style="color:#9ecbf5">{{item.doing}}</span>
					</th>
					<th class="last">
						<div>本日新增</div><span style="color:#ebe98f">{{item.today}}</span>
					</th>
				</tr>
				<tr :key="'c'+index" v-if="index<2">
					<td colspan="4" style="height:16px;"></td>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				list: [{
						type: "投诉",
						waiting: 231,
						doing: 25,
						today: 68,
						src:require('./img/ts.png')
					},
					{
						type: "求助",
						waiting: 231,
						doing: 25,
						today: 68,
						src:require('./img/qz.png')
					},
					{
						type: "重点旅客预约",
						waiting: 231,
						doing: 25,
						today: 68,
						src:require('./img/zd.png')
					},
				]
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			// document.querySelector("title").innerHTML = "页面名称";
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
	.group-table {
		width: 100%;
		height: 100%;
		border-collapse: collapse
	}

	.group-table th {
		font-size: 20px;
		border-top: 1px solid #142465;
		border-bottom: 1px solid #142465;
	}

	.group-table th.last {
		border-right: 1px solid #142465;
	}

	.group-table th>div {
		font-size: 12px;
		color: #848899;
	}

	.group-table th.group {
		font-size: 14px;
		width: 70px;
		background: #182B6F;
		color: #24F1F5;
		border-left: 1px solid #142465;
	}
	.group-img{
		display: inline-block;
		vertical-align:middle;
		width:54px;
		height:54px;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
