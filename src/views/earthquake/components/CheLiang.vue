<!-- 
 * @created：	2022年4月20日
 * @author：	djm
 * @version:	v1.0
 * @desc:		车辆
 -->
<template>

	<div style="height: 100%;">
		<div v-if="!isLight">
			<tabs ref="myTabs" :tabsList="[{id:0,text:'车辆信息'}]" style="height: 30px;"></tabs>
			<div style="height: 160px;">
				<div style="display: inline-block;" class="eq-log"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">车辆</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;">
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>备料总数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.SUM}}所</div>
						</div>
					</div>
				</div>
			</div>
			<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
				<colgroup>
					<col name="" width="100">
					<col name="eq_1_column_2" width="120">
				</colgroup>
				<thead>
					<tr style="color: #5B96EF;">
						<th class="" style="padding: 10px 0;">单位</th>
						<th class="eq_1_column_2">备料数量</th>
					</tr>
				</thead>
			</table>
			<div style="overflow-y: auto;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="" width="100">
						<col name="eq_1_column_2" width="120">
					</colgroup>
					<tbody style="background: rgba(21,42,99,.8);">
						<tr v-for="(row,indexRow) in dataList" :key="indexRow">
							<td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.DEPOT}}</td>
							<td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;color: #f0ce43;">{{row.NUM}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="gongwu-light-panel" v-if="isLight">
			<div class="brief-area">
				<div class="light-gongwu-logo">
					<div>
						<span style="color: #5EB0F3; font-size: 36px; font-weight: bolder">车辆</span>
					</div>
					<div class="eq-log-light"></div>
				</div>
				<div class="light-gongwu-status">
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #656E77; font-weight: bold; display: flex; align-items: flex-end; flex-direction: column">
							<p>备料总数</p>
						</div>
					</div>
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #04B5AF; font-weight: bold; display: flex; align-items: flex-start; flex-direction: column">
							<p>{{totals.SUM}}所</p>
						</div>
					</div>
				</div>
			</div>
			<div class="table-area">
			<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="dataList" :border="false"
			 :stripe="false" size="mini">
				<el-table-column width="" prop="DEPOT" label="单位" align="center"></el-table-column>
				<el-table-column width="" prop="NUM" label="备料数量" align="center">
				</el-table-column>
			</el-table>
		</div></div>
	</div>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	import C from "../../../assets/com.js"
	import tabs from "../../../components/bigScreen/KydTabs.vue";
	import config from "../../../components/map/js/config.js"

	export default {
		// 组件
		components: {
			tabs
		},
		// 数据仓库
		data() {
			return {
				totals: {
					CJ_SUM: 0,
					GQ_SUM: 0,
					RS_SUM: 0
				},
				dataList: [],
				dataMx: [],
				dataMxCur: [],
				sb_data: [], //社保数据
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.getData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


			/* @info  数据处理区-----------------------------------*/
			getCurDataMx(curPageNum) {
				this.dataMxCur = this.dataMx.slice((curPageNum - 1) * 10, curPageNum * 10);
			},

			/* @info  数据交互区-----------------------------------*/
			// 查询所有段供电设备统计数据
			getData() {
				C.getDataP123({
					c: "tyzd_ggy2121",
					a: "备品备料位置",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					if (r["1"].length > 0) {
						this.totals = r['1'][0];
						this.dataList = r['2'];
					}
				});
			},
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {
			isLight() {
				if (config.superMap.lightMode === undefined) {
					return false
				} else {
					return config.superMap.lightMode
				}
			}
		},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.gongwu-light-panel {
	  padding: 30px;
	  height: 100%;
	  width: 100%;
	}
	
	.gongwu-light-panel .brief-area {
	  height: 300px;
	  width: 100%;
	  display: flex;
	  justify-content: space-between;
	}
	
	.gongwu-light-panel .brief-area .light-gongwu-logo {
	  width: 40%;
	  height: 100%;
	  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
	  background-color: white;
	  border-radius: 15px;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  align-content: center;
	  padding-top: 20px;
	  padding-bottom: 20px;
	}
	
	.gongwu-light-panel .brief-area .light-gongwu-status {
	  width: 220px;
	  height: 100%;
	  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
	  background-color: white;
	  border-radius: 15px;
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  padding: 15px;
	}
	
	.gongwu-light-panel .table-area {
	  height: 520px;
	  width: 100%;
	  display: flex;
	  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
	  background-color: white;
	  border-radius: 15px;
	  margin-top: 50px;
	}
	
	.eq-log {
		vertical-align: top;
		width: 150px;
		height: 100%;
		background: url(../img/1.gif) no-repeat;
		background-position: 20px 30px;
		text-align: center;
	}

	.eq-log-light {
	  vertical-align: top;
	  width: 200px;
	  height: 200px;
	  background: url(../img/gongwuLight.gif) no-repeat;
	  background-size: 200px 200px;
	  background-position: 0px 0px;
	  text-align: center;
	}

	.table-row-bg {
		background: url(../img/2.png) no-repeat;
		background-size: 100% 36px;
		background-position: 0px 3px;
	}

	.split {
		position: absolute;
		left: 0;
		height: 30px;
		width: 1px;
		margin-top: -6px;
		border-left: 1px solid #71AFDC;
	}

	>>>.el-pager li,
	>>>.el-pagination button:disabled,
	>>>.el-pagination .btn-next,
	>>>.el-pagination .btn-prev {
		background: transparent;
		color: white;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
