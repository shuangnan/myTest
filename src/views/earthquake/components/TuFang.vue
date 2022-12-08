<!-- 
 * @created：	2022年3月14日
 * @author：	ch
 * @version:	v1.0
 * @desc:		土房
 -->
<template>
	<div style="height: 100%;">
		<div v-if="!isLight">
			<tabs ref="myTabs" :tabsList="[{id:0,text:'土房信息'}]" style="height: 30px;"></tabs>
			<div style="height: 160px;">
				<div style="display: inline-block;" class="eq-log"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">土房</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>工区</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.GQ_SUM}}所</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>车间</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.CJ_SUM}}所</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>段人数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.RS_SUM}}人</div>
						</div>
					</div>
				</div>
			</div>
			<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
				<colgroup>
					<col name="" width="100">
					<col name="eq_1_column_2" width="120">
					<col name="eq_1_column_3" width="100">
					<col name="eq_1_column_4" width="100">
				</colgroup>
				<thead>
					<tr style="color: #5B96EF;">
						<th class="" style="padding: 10px 0;">段</th>
						<th class="eq_1_column_2">工区</th>
						<th class="eq_1_column_3">车间</th>
						<th class="eq_1_column_4">人员</th>
					</tr>
				</thead>
			</table>
			<div style="overflow-y: auto;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="" width="100">
						<col name="eq_1_column_2" width="120">
						<col name="eq_1_column_3" width="100">
						<col name="eq_1_column_4" width="100">
					</colgroup>
					<tbody style="background: rgba(21,42,99,.8);">
						<tr v-for="(row,indexRow) in dataList" :key="indexRow">
							<td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.DW}}</td>
							<td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;color: #f0ce43;">{{row.GQ_NUM}}所</td>
							<td class="eq_1_column_3" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.CJ_NUM}}所</td>
							<td class="eq_1_column_4" style="border-bottom: 1px solid #293D72;height: 29px;color: #c8c1c0;">{{row.GQ_RS}}/{{row.CJ_RS}}</td>
						</tr>
					</tbody>
				</table>
			</div>


			<tabs ref="myTabs" :tabsList="[{id:0,text:'社保'}]" style="height: 30px;margin-top: 10px;"></tabs>
			<div style="height: 240px;">
				<div style="display: inline-block;" class="eq-log"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">社保</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>疾控所</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{sb_data[1][0].JKS}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>卫生监督所</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{sb_data[2][0].JDS}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>健康列车</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{sb_data[6][0].JKLC}}</div>
						</div>
					</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;margin-top: 10px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>食堂</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{sb_data[3][0].ST}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>伙食团</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{sb_data[4][0].HST}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>送餐点</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{sb_data[5][0].ZD}}</div>
						</div>
					</div>
				</div>
			</div>
			<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
				<colgroup>
					<col name="" width="100">
					<col name="eq_1_column_2" width="120">
					<col name="eq_1_column_3" width="100">
					<col name="eq_1_column_4" width="100">
				</colgroup>
				<thead>
					<tr style="color: #5B96EF;">
						<th class="" style="padding: 10px 0;">段</th>
						<th class="eq_1_column_2">食堂</th>
						<th class="eq_1_column_3">伙食团</th>
						<th class="eq_1_column_4">送餐点</th>
					</tr>
				</thead>
			</table>
			<div style="height:calc(100vh - 750px);overflow-y: auto;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="" width="100">
						<col name="eq_1_column_2" width="120">
						<col name="eq_1_column_3" width="100">
						<col name="eq_1_column_4" width="100">
					</colgroup>
					<tbody style="background: rgba(21,42,99,.8);">
						<tr v-for="(row,indexRow) in sb_data[7]" :key="indexRow">
							<td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.DW}}</td>
							<td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;color: #f0ce43;">{{row.ST_NUM}}</td>
							<td class="eq_1_column_3" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.HST_NUM}}</td>
							<td class="eq_1_column_4" style="border-bottom: 1px solid #293D72;height: 29px;color: #c8c1c0;">{{row.ZD_NUM}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div  class="gongwu-light-panel" v-if="isLight" style="overflow: auto;height: calc(100vh - 100px);">
			<div class="brief-area">
				<div class="light-gongwu-logo">
					<div>
						<span style="color: #5EB0F3; font-size: 36px; font-weight: bolder">后勤保障</span>
					</div>
					<div class="eq-log-light"></div>
				</div>
				<div class="light-gongwu-status">
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #656E77; font-weight: bold; display: flex; align-items: flex-end; flex-direction: column">
							<p>工区</p>
							<p>车间</p>
							<p>段人数</p>
						</div>
					</div>
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #04B5AF; font-weight: bold; display: flex; align-items: flex-start; flex-direction: column">
							<p>{{totals.GQ_SUM}}所</p>
							<p>{{totals.CJ_SUM}}所</p>
							<p>{{totals.RS_SUM}}人</p>
						</div>
					</div>
				</div>
			</div>
			<div style="padding: 10px;">
				<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="dataList" :border="false"
				 :stripe="false" size="mini">
					<el-table-column width="" prop="DW" label="段" align="center"></el-table-column>
					<el-table-column width="" prop="GQ_NUM" label="工区" align="center">
					</el-table-column>
					<el-table-column width="" prop="CJ_NUM" label="车间" align="center"></el-table-column>
					<el-table-column width="" prop="GDB" label="人员" align="center">
						<template slot-scope='scope'>
							{{scope.row.GQ_RS}}/{{scope.row.CJ_RS}}
						</template>
					</el-table-column>
				</el-table>
			</div> 
			<div class="gongwu-light-panel">
				<div class="brief-area">
					<div class="light-gongwu-logo">
						<div>
							<span style="color: #5EB0F3; font-size: 36px; font-weight: bolder">社保</span>
						</div>
						<div class="eq-log-light"></div>
					</div>
					<div class="light-gongwu-status">
						<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
							<div style="color: #656E77; font-weight: bold; display: flex; align-items: flex-end; flex-direction: column">
								<p>疾控所</p>
								<p>卫生监督所</p>
								<p>健康列车</p>
								<p>食堂</p>
								<p>伙食团</p>
								<p>送餐点</p>
							</div>
						</div>
						<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
							<div style="color: #04B5AF; font-weight: bold; display: flex; align-items: flex-start; flex-direction: column">
								<p>{{ sb_data[1][0].JKS }}</p>
								<p>{{ sb_data[2][0].JDS }}</p>
								<p>{{ sb_data[6][0].JKLC }}</p>
								<p>{{ sb_data[3][0].ST }}</p>
								<p>{{ sb_data[4][0].HST }}</p>
								<p>{{ sb_data[5][0].ZD }}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="table-area">
					<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="sb_data[7]" :border="false"
					:stripe="false" size="mini">
						<el-table-column width="" prop="DW" label="段" align="center"></el-table-column>
						<el-table-column width="" prop="ST_NUM" label="食堂" align="center">
						</el-table-column>
						<el-table-column width="" prop="HST_NUM" label="伙食团" align="center"></el-table-column>
						<el-table-column width="" prop="ZD_NUM" label="送餐点" align="center">
						</el-table-column>
					</el-table>
				</div>
			</div>
			
		</div>
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
			this.getData_sb();
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
					c: "tyzd_ggy2028",
					a: "统计机车数量",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					// TRAIN_TYPE 类型（1：救援列车 2：热备内燃 3：热备电力）	
					if (r["1"].length > 0) {
						r["1"].forEach(v => {
							if (v.TRAIN_TYPE === "1") {
								this.totals.jy = v.SUM;
							} else if (v.TRAIN_TYPE === "2") {
								this.totals.nr = v.SUM;
							} else if (v.TRAIN_TYPE === "3") {
								this.totals.dl = v.SUM;
							}
						});
					}
					if (r["2"].length > 0) {
						const countRow = (row, v) => {
							if (v.TRAIN_TYPE === "1") {
								row.jy += parseInt(v.NUM);
							} else if (v.TRAIN_TYPE === "2") {
								row.nr += parseInt(v.NUM);
							} else if (v.TRAIN_TYPE === "3") {
								row.dl += parseInt(v.NUM);
							}
						}
						const real = [];
						const temp = {};
						let tempI = 0;
						r["2"].forEach(v => {
							if (typeof(temp[v.DEPOT]) === "undefined") {
								const row = {
									cwd: v.DEPOT,
									nr: 0,
									dl: 0,
									jy: 0,
								}
								countRow(row, v);
								real.push(row);
								temp[v.DEPOT] = tempI++;
							} else {
								countRow(real[temp[v.DEPOT]], v);
							}
						});
						this.dataList = real;
					}
				});
			},
			getData_mx() {
				C.getDataP123({
					c: "tyzd_ggy2037",
					a: "全局慢行情况",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					this.totals = r["1"][0];
					this.dataList = r["2"];
				});
			},
			getData_sb() {
				C.getDataP123({
					c: "tyzd_ggy2079",
					a: "统计",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					this.sb_data = r;
				});
			}
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
