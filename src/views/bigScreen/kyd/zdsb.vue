<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		重点设备数量及其完好情况
 -->
<template>
	<div class="blue-table" style="width:100%;height:100%;">
		<div style="width:50%;height:100%;float:left;">
			<el-table :data="tableData" cell-class-name="stripe-row" size="mini" stripe height="100%" class="blue-table" style="width: 100%;">
				<el-table-column label="设备" prop="i" width="100" align="center">
					<template slot-scope="scope">
						<span class="default-color" :class="{'light-color':scope.$index%2!==0}">{{scope.row.i}}</span>
					</template>
				</el-table-column>
				<el-table-column label="数量" prop="z" width="100" align="center">
					<template slot-scope="scope">
						<span class="default-color" :class="{'light-color':scope.$index%2!==0}">{{scope.row.z}}</span>
					</template>
				</el-table-column>
				<el-table-column label="完好度" prop="p" width="200" align="center">
					<template slot-scope="scope">
						<div class="persent" :class="{'light':scope.$index%2!==0}">
							<span>
								<i :style="{width:scope.row.p}"></i>
							</span>
							<label>{{scope.row.p}}</label>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="width:50%;height:100%;float:right;">
			<el-table :data="tableData" cell-class-name="stripe-row" size="mini" stripe height="100%" class="blue-table" style="width: 100%;">
				<el-table-column label="设备" prop="i" width="100" align="center">
					<template slot-scope="scope">
						<span class="default-color" :class="{'light-color':scope.$index%2!==0}">{{scope.row.i}}</span>
					</template>
				</el-table-column>
				<el-table-column label="数量" prop="z" width="100" align="center">
					<template slot-scope="scope">
						<span class="default-color" :class="{'light-color':scope.$index%2!==0}">{{scope.row.z}}</span>
					</template>
				</el-table-column>
				<el-table-column label="完好度" prop="p" width="200" align="center">
					<template slot-scope="scope">
						<div class="persent" :class="{'light':scope.$index%2!==0}">
							<label>{{scope.row.p}}</label>
							<span>
								<i :style="{width:scope.row.p}"></i>
							</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
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
				tableData: [{
					i: "手持机",
					z: "253",
					p: "80%"
				}, {
					i: "手持机",
					z: "253",
					p: "70%"
				}, {
					i: "手持机",
					z: "253",
					p: "88%"
				}, {
					i: "手持机",
					z: "253",
					p: "90%"
				}, {
					i: "手持机",
					z: "253",
					p: "76%"
				}, {
					i: "手持机",
					z: "253",
					p: "92%"
				}, ]
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
	.persent {
		position: relative;
		line-height: 12px;
		color: rgba(83, 180, 235, 1);
	}

	.persent.light {
		color: rgba(54, 185, 193, 1);
	}
	
	.persent>span {
		position: relative;
		display: inline-block;
		padding: 0px;
		height: 3px;
		width: 100%;
		left: 0;
		background-color: rgba(41, 67, 118, 1);
		text-align: left;
	}

	.persent>span>i {
		position: absolute;
		left: 0;
		top: 0;
		display: inline-block;
		height: 100%;
		background-color: rgba(83, 180, 235, 1);
	}
	
	.persent>label {
		display: block;
		padding: 0;
	}
	
	
	.default-color{
		color: rgba(83, 180, 235, 1);
	}
	.light-color{
		color: rgba(54, 185, 193, 1);
	}
	.persent.light>span>i {
		background-color: rgba(54, 185, 193, 1);
	}
	
</style>
<!-- 公有样式（会影响全局） -->
<style>

</style>
