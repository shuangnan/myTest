<!--
Created by jiangfulong on 2021-05-21.
页面功能：浏览PDF
页面地址：
-->
<template>
	<iframe v-if="fileType==='pdf'" :src="pathUrl" frameborder="0" height="750px" width="100%"></iframe>
	<iframe v-else-if="fileType==='doc'||fileType==='docx'" :src="pathUrl" frameborder="0" height="750px" width="100%"></iframe>
</template>

<script>
	// 这里引用各种资源
	export default {
		// 组件
		components: {

		},
		created() { //初始化

		},
		data() {
			return {
				pathUrl: "", //pdf链接
				fileType: "",
			}
		},
		// 组件挂载完毕
		mounted() {
			var Type = "";
			try{
				var fileArr = this.PDFSrc.split(".");
				Type = fileArr[fileArr.length-1];
			}catch(err){
				Type = "";
			}
			if (Type === "pdf") {
				this.pathUrl = "static/pdf/web/viewer.html?file=" + this.PDFSrc;//pdf预览
				// this.pathUrl = "http://127.0.0.1:8848/JFLCMS_VUE/public/static/pdf/web/viewer.html?file=" + this.PDFSrc;
				this.fileType = Type;
			}else if (Type === "doc" || Type === "docx") {
				this.pathUrl = this.PDFSrc;//pdf预览
				this.fileType = Type;
			}
		},
		// 方法
		methods: {
			
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
		// 属性
		props: ["PDFSrc"],
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped"></style>
<!-- 公有样式（会影响全局） -->
<style></style>
