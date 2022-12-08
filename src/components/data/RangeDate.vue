<!-- 
 * @created：	2020年11月25日
 * @author：	ch
 * @version:	v1.0
 * @desc:		日期范围
 -->
<template>
	<div>
		<div style="padding:5px 15px;">
			开始日期：
			<el-date-picker v-model="sdate" size="small" @change="handleChange" :editable="false" :clearable="false" value-format="yyyy-MM-dd" style="width: 130px;"></el-date-picker>
		</div>
		<div style="padding:5px 15px;">
			结束日期：
			<el-date-picker v-model="edate" size="small" @change="handleChange" :editable="false" :clearable="false" value-format="yyyy-MM-dd" style="width: 130px;"></el-date-picker>
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
				sdate: "",
				edate: "",
			}
		},
		// 属性
		props: {
			startDate: String,
			endDate: String
		},
		// 组件挂载完毕
		mounted() {
			this.sdate = this.startDate
			this.edate = this.endDate;
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			handleChange(){
				this.$emit("change",[this.sdate,this.edate]);
			}
			/* @info  数据处理区-----------------------------------*/

			/* @info  数据交互区-----------------------------------*/
		},
		// 监视属性
		watch: {
			"startDate"(v) {
				this.sdate = v;
			},
			"endDate"(v) {
				this.edate = v;
			}
		},
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
