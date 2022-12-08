<!-- 
 * @created：2022年9月17日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		库存排行
 -->
<template>
	<div style="position: relative;width:100%;height:100%;padding: 25px 10px 5px 13px;" class="box blue-table">
		<div style="position: absolute;top:-20px;right:5px;">
		</div>
		<el-table :data="list" size="mini" stripe height="100%" class="blue-table" style="width: 100%;">
			<el-table-column label="单位" prop="dw" align="center"></el-table-column>
			<el-table-column label="入库(未签收/已入库)" prop="rk1" align="center">
				<template slot-scope="{row}">
					<span style="color: yellow;">{{row.rk1}}</span>/{{row.rk2}}
				</template>
			</el-table-column>
			<el-table-column label="签收(未计划/已签收)" prop="qs1" align="center">
				<template slot-scope="{row}">
					<span style="color: yellow;">{{row.qs1}}</span>/{{row.qs2}}
				</template>
			</el-table-column>
			<el-table-column label="计划(未编号/已计划)" prop="jh1" align="center">
				<template slot-scope="{row}">
					<span style="color: yellow;">{{row.jh1}}</span>/{{row.jh2}}
				</template>
			</el-table-column>
			<el-table-column label="销号合计" prop="xh" align="center"></el-table-column>
			<el-table-column label="未销号总数" prop="wxh" align="center"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: []
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
			getData() {
				const t = ["成都工务段", "涪陵工务段", '贵阳工务段', '凯里工务段', '遂宁工务段', '内江工务段', '重庆工务段', '绵阳工务段', '达州工务段', '西昌工电段',
					'重庆工电段', '宜宾工电段', '六盘水工电段', '成都高铁工务段', '贵阳高铁工务段'
				];
				this.list = t.map(v => {
					return {
						dw: v,
						rk1: (Math.random() * 2000).toFixed(0),
						rk2: (Math.random() * 2000).toFixed(0),
						qs1: (Math.random() * 2000).toFixed(0),
						qs2: (Math.random() * 2000).toFixed(0),
						jh1: (Math.random() * 2000).toFixed(0),
						jh2: (Math.random() * 2000).toFixed(0),
						xh: (Math.random() * 2000).toFixed(0),
						wxh: (Math.random() * 2000).toFixed(0),
					}
				});
			},
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
	.box {
		background: url(img/r2-bg.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
	}
	.num {
		display: inline-block;
		width: 80%;
		border: 1px solid #55aaff;
		border-radius: 10px;
		padding: 10px;
		font-size: 30px;
		text-align: center;
	}

	.num>div {
		font-size: 20px;
		color: aqua;
	}
</style>
