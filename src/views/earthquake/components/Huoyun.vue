<!-- 
 * @created：	2022年4月12日
 * @author：	djm
 * @version:	v1.0
 * @desc:		货运子系统
 -->
<template>
	<div style="height: 100%;">
		<div v-if="!isLight">
			<tabs ref="myTabs" :tabsList="[{id:0,text:'货运子系统'}]" style="height: 30px;"></tabs>
			<div style="height: 260px;">
				<div style="display: inline-block;" class="eq-log"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">货运子系统</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>机具备料站总数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals[1][0].PREPARE}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>应急劳力总数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals[2][0].PEOPLE}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>应急装卸机械总数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals[3][0].MACHINE}}</div>
						</div>
					</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;margin-top: 10px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>社会机械资源总数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals[4][0].MACHINE2}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>易腐货物办理站总数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals[5][0].BADSTATION}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>危险货物办理站总数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals[6][0].DANGERSTATION}}</div>
						</div>
					</div>
				</div>
			</div>
			<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
				<colgroup>
					<col name="" width="100">
					<col name="eq_1_column_2" width="120">
					<col name="eq_1_column_3" width="100">
					<col name="eq_1_column_4" width="90">
					<col name="eq_1_column_5" width="90">
					<col name="eq_1_column_6" width="90">
				</colgroup>
				<thead>
					<tr style="color: #5B96EF;">
						<th class="" style="padding: 10px 0;">单位</th>
						<th class="eq_1_column_2">机具备料站</th>
						<th class="eq_1_column_3">应急劳力</th>
						<th class="eq_1_column_4">应急装卸机械</th>
						<th class="eq_1_column_5">社会机械资源</th>
						<th class="eq_1_column_6">危险货物办理站</th>
					</tr>
				</thead>
			</table>
			<div style="height:calc(100vh - 750px);overflow-y: auto;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="" width="100">
						<col name="eq_1_column_2" width="120">
						<col name="eq_1_column_3" width="100">
						<col name="eq_1_column_4" width="90">
						<col name="eq_1_column_5" width="90">
						<col name="eq_1_column_6" width="90">
					</colgroup>
					<tbody style="background: rgba(21,42,99,.8);">
						<tr v-for="(row,indexRow) in dataList" :key="indexRow">
							<td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.DW}}</td>
							<td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;color: #f0ce43;">{{row.PREPARE_NUM}}</td>
							<td class="eq_1_column_3" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.PEOPLE_NUM}}</td>
							<td class="eq_1_column_4" style="border-bottom: 1px solid #293D72;height: 29px;color: #c8c1c0;">{{row.MACHINE_NUM}}</td>
							<td class="eq_1_column_5" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.MACHINE2_NUM}}</td>
							<td class="eq_1_column_6" style="border-bottom: 1px solid #293D72;height: 29px;color: #c8c1c0;">{{row.DANGERSTATION_NUM}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="gongwu-light-panel" v-if="isLight">
			<div class="brief-area">
				<div class="light-gongwu-logo">
					<div>
						<span style="color: #5EB0F3; font-size: 36px; font-weight: bolder">货运</span>
					</div>
					<div class="eq-log-light"></div>
				</div>
				<div class="light-gongwu-status">
					<div style="width: 110px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #656E77; font-weight: bold; display: flex; align-items: flex-end; flex-direction: column;font-size: 12px;">
							<p>机具备料站数</p>
							<p>应急劳力数</p>
							<p>应急装卸机械数</p>
							<p>社会机械资源数</p>
							<p>易腐货物办理站数</p>
							<p>危险货物办理站数</p>
						</div>
					</div>
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #04B5AF; font-weight: bold; display: flex; align-items: flex-start; flex-direction: column">
							<p>{{ totals[1][0].PREPARE }}</p>
							<p>{{ totals[2][0].PEOPLE }}</p>
							<p>{{ totals[3][0].MACHINE }}</p>
							<p>{{totals[4][0].MACHINE2}}</p>
							<p>{{ totals[5][0].BADSTATION }}</p>
							<p>{{ totals[6][0].DANGERSTATION }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="table-area">
			<el-table height="250px" style="width: 100%; height: 100%; border-radius: 15px" :data="dataList" :border="false"
			 :stripe="false" size="mini">
				<el-table-column width="" prop="DW" label="单位" align="center"></el-table-column>
				<el-table-column width="" prop="PREPARE_NUM" label="机具备料站" align="center"></el-table-column>
				<el-table-column width="" prop="PEOPLE_NUM" label="应急劳力" align="center"></el-table-column>
				<el-table-column width="" prop="MACHINE_NUM" label="应急装卸机械" align="center"></el-table-column>
				<el-table-column width="" prop="MACHINE2_NUM" label="社会机械资源" align="center"></el-table-column>
				<el-table-column width="" prop="DANGERSTATION_NUM" label="危险货物办理站" align="center">
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
			// this.getData();
			this.getData_mx();
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
			getData_mx() {
				C.getDataP123({
					c: "tyzd_ggy2101",
					a: "统计",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					this.totals = r;
					this.dataList = r["7"];
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
