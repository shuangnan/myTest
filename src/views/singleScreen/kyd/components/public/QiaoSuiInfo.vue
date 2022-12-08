<!-- 
 * @created：	2021年9月1日
 * @author：	ch
 * @version:	v1.0
 * @desc:		桥隧信息
 * @path:		http://10.192.6.155:9090/JFLCMS/vue/#/qiaoSuiInfo?id=118672757
 -->
<template>
	<div style="width:100%;height:100%;overflow: auto;border-bottom-left-radius: 6px;background:rgba(67,90,121,0.6);color: white;">
		<table class="solid-tab" cellpadding="0" cellspacing="0">
			<tbody class="border">
				<tr>
					<th colspan="6">桥隧信息</th>
				</tr>
				<tr>
					<td class="odd" style="width: 80px;">桥隧类型</td>
					<td :style="{width:valWidth}">{{base.BRI_HOLE_TYPE==='0'?'桥梁':'隧2道'}}</td>
					<td class="odd" style="width: 80px;">桥隧名称</td>
					<td :style="{width:valWidth}">{{base.BRI_HOLE_NAME}}</td>
					<td class="odd" style="width: 80px;">所属线别</td>
					<td :style="{width:valWidth}">{{base.LINE_NAME}}</td>
				</tr>
				<tr>
					<td class="odd">所属区间</td>
					<td>{{base.INERVAL}}</td>
					<td class="odd">中心里程</td>
					<td>{{base.CENTER_MILEAGE}}</td>
					<td class="odd">全长(米)</td>
					<td>{{base.TOTAL_LEN*0.01}}</td>
				</tr>
			</tbody>
			<tbody>
				<tr>
					<th colspan="6">疏散通道</th>
				</tr>
				<tr>
					<th>序号</th>
					<th>里程</th>
					<th>侧别</th>
					<th>类型</th>
					<th>紧急出口类型</th>
					<th>备注</th>

				</tr>
				<tr v-for="(item,index) in detail" class="hover-tr" :class="{'odd':index%2===0}">
					<td>{{index+1}}</td>
					<td>{{item.EXIT_MILEAGE}}</td>
					<td>{{item.SIDE_DIRECT}}</td>
					<td>{{item.EXIT_KIND}}</td>
					<td>{{dicExit[item.EXIT_KIND_ID]}}</td>
					<td style="text-align: left;">{{item.MEMO}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../../../assets/com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				urlP: {},
				base: {},
				detail: [],
				dicExit: {
					"0": "紧急出口",
					"1": "救援站",
					"2": "顺坡式",
					"3": "折叠式",
					"4": "横通道",
					"5": "平导"
				},
				valWidth:""
			}
		},
		// 属性
		props: {},
		// 组件挂载完毕
		mounted() {
			this.valWidth = Math.floor((window.document.body.offsetWidth - 240)/3) + "px";
			this.getDatas();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			getDatas() {
				const webP = this.$store.state.params;
				C.getData({
					c: "kydp_zxy8020",
					s: [webP.name, webP.line],
					// s: ["成都高架特大桥", "成渝高速线"],
					a: "获取桥遂数据",
					url:C.ADDS.trdm
				}, (r) => {
					this.base = JSON.parse(r.data)[0];
					this.detail = JSON.parse(this.base.EXIT_DETAIL);
				});
			},

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
	.solid-tab {
		width: 100%;
		height: auto;
		text-align: center;
		border-collapse: collapse;
		border: 1px solid #091650;
		font-size: 12px;
	}

	.solid-tab th,
	.solid-tab td {
		border-collapse: collapse;
		border-right: 1px solid #0f326c;
		padding: 2px;
	}

	.solid-tab .border th,
	.solid-tab .border td {
		border-collapse: collapse;
		border: 1px solid #0f326c;
	}

	.solid-tab th {
		background: #203d5d;
	}

	.solid-tab .odd {
		background-color: rgba(46, 67, 94, .6);
	}

	.hover-tr {
		color: #d8dbdc;
	}

	.hover-tr:hover {
		cursor: pointer;
		background-color: #208B78;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
