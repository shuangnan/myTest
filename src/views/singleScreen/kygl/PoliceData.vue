<!-- 
 * @created：	2022年10月12日
 * @author：	ch
 * @version:	v1.0
 * @desc:		公安基础数据维护
 -->
<template>
	<el-container>
	    <el-header style="height: 40px;padding-top: 7px;border-bottom: 1px solid #ddd;">
			<span style="font-size: 16px;padding-right: 20px;">公安基础数据维护</span>
	    </el-header>
	    <el-container>
	        
	        <el-main>
	            <h1 class="custom-content-tip">主体内容</h1>
	            <div class="custom-content"></div>
	        </el-main>
	    </el-container>
	</el-container>
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

			}
		},
		// 属性
		props:{
			
		},
		// 组件挂载完毕
		mounted() {
			document.querySelector("title").innerHTML = "公安基础数据维护";
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
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
