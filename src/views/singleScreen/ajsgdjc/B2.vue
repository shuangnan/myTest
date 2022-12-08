<!-- 
 * @created：2022年9月17日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		动静态数据重复分析
 -->
<template>
	<div class="box" style="position: relative;width:100%;height:100%">
		<div style="position: absolute;top:18px;right:15px;z-index: 10;">
			<el-select v-model="s_line" size="mini" style="width: 80px;margin-right: 5px;" class="blue-control mini"
				popper-class="blue-control" placeholder="线"></el-select>
			<el-date-picker v-model="s_date" @change="getData()" type="monthrange" size="mini" :clearable="false"
				range-separator="-" style="width: 160px;" class="blue-control" popper-class="blue-control">
			</el-date-picker>
		</div>
		<table style="width: 100%;height: 0%;100%">
			<tbody>
				<tr>
					<th><img class="img" src="./img/b2-1.png" /></th>
					<th><img class="img" src="./img/b2-2.png" /></th>
					<th><img class="img" src="./img/b2-3.png" /></th>
				</tr>
				<tr>
					<th>
						<div class="num">1233<div>便捷大值</div></div>
					</th>
					<th>
						<div class="num">2133<div>轨检大值</div></div>
					</th>
					<th>
						<div class="num">1421<div>线路大值</div></div>
					</th>
				</tr>
			</tbody>
		</table>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				s_line: "",
				s_date: "",
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.getData();
		},
		created() {},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			getData(view, name) {},
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
		// 组件
		components: {},
	}
</script>

<style scoped>
	.img{
		display: inline-block;
		width: 70px;
		height: 80px;
		margin-top: 20px;
	}
	.num {
		display: inline-block;
		width: 80%;
		background: url(img/b2-4.png)no-repeat;
		background-size: 100% 100%;
		font-size: 28px;
		padding: 2px;
		text-align: center;
		color: #eaf1fd;
	}

	.num>div {
		font-size: 18px;
		color: #00fcf9;
	}
	.box {
		background: url(img/b2-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}
</style>
