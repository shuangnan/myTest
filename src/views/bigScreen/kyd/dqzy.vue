<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		当前作业情况
 -->
<template>
	<div style="width:100%;height:100%;padding:20px;">
		<table class="group-table" cellspaing="0">
			<tbody>
				<tr v-for="(item,index) in list">
					<th v-if="index===0" rowspan="3" style="width:120px;">
						<div class="tit-con">

						</div>
					</th>
					<td :class="{'bordered':index<2}">
						<div class="group-tit">{{item.title}}</div>
						<div class="group-num">{{item.value}}<label>车</label></div>
					</td>
					<td :class="{'bordered':index<2}" style="width:100px;background-color: rgba(13,28,67,.8);">
						<div class="compare">
							<span>同比：</span>
							<label><i>↑</i>{{item.temp}}</label>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
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
					title: "总列车数量",
					value: "135,254,165",
					temp: "5%"
				}, {
					title: "在途",
					value: "35,254,165",
					temp: "8%"
				}, {
					title: "未作业",
					value: "5,254,165",
					temp: "15%"
				}]
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
			// 获取数据
			getData() {

			}
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
		color: #20E1E9;
		font-weight: bold;
		background-color: rgba(11, 25, 63, .6);
	}

	.bordered {
		border-bottom: 3px solid #010D47;
	}

	.tit-con {
		height: 100%;
		font-size: 24px;
		background: url(img/dqzy.gif);
	}

	.group-tit {
		height: 20px;
		/* padding-left: 10px;
		border-top-left-radius: 20px;
		background-image: linear-gradient(to right, rgba(152, 223, 248, .3), rgba(9,24,66, .5)); */
	}

	.group-num {
		font-size: 24px;
		padding-top: 3x;
		color: #FAFAFA;
	}

	.group-num>label {
		float: right;
		font-size: 14px;
		margin-right: 20px;
		color: #20E1E9;
	}

	.compare {
		width: 100%;
		padding: 2px;
		text-align: center;
	}

	.compare>label {
		color: #9A3134;
		font-size: 18px;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
