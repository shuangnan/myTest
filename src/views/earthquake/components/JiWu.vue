<!-- 
 * @created：	2022年3月9日
 * @author：	ch
 * @version:	v1.0
 * @desc:		机务
 -->
<template>
	<div>
		<div v-if="!isLight">
			<tabs ref="myTabs" :tabsList="[{id:0,text:'机务信息'}]" style="height: 30px;"></tabs>
			<div style="height: 210px;">
				<div style="display: inline-block;" class="eq-log"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">机务段</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>热备内燃机车</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.nr}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>热备电力机车</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.dl}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>救援列车</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.jy}}</div>
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
						<th class="" style="padding: 10px 0;">车务段</th>
						<th class="eq_1_column_2">热备内燃机车</th>
						<th class="eq_1_column_3">热备电力机车</th>
						<th class="eq_1_column_4">救援列车</th>
					</tr>
				</thead>
			</table>
			<div style="height:200px;overflow-y: auto;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="" width="100">
						<col name="eq_1_column_2" width="120">
						<col name="eq_1_column_3" width="100">
						<col name="eq_1_column_4" width="100">
					</colgroup>
					<tbody style="background: rgba(21,42,99,.8);">
						<tr v-for="(row,indexRow) in dataList" :key="indexRow">
							<td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.cwd}}</td>
							<td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;color: #f0ce43;">{{row.nr}}台</td>
							<td class="eq_1_column_3" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.dl}}台</td>
							<td class="eq_1_column_4" style="border-bottom: 1px solid #293D72;height: 29px;color: #c8c1c0;">{{row.jy}}列</td>
						</tr>
					</tbody>
				</table>
			</div>
			<tabs ref="myTabs" :tabsList="[{id:0,text:'救援列车'}]" style="height: 30px;"></tabs>
			<div style="padding: 5px;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="100">
						<col name="eq_2_column_3" width="70">
						<col name="eq_2_column_4" width="70">
						<col name="eq_2_column_5" width="100">
						<col name="eq_2_column_6" width="50">
					</colgroup>
					<thead>
						<tr style="color: #5B96EF;">
							<th class="eq_2_column_1" style="padding: 10px 0;">救援列车名称</th>
							<th class="eq_2_column_2">停放地点</th>
							<th class="eq_2_column_3">
								<el-select size="mini" v-model="value" @change="getCurDataMx" class="blue-select" popper-class="blue-select">
									<el-option v-for="item in options" :key="item" :label="item" :value="item">
									</el-option>
								</el-select>
							</th>
							<th class="eq_2_column_4">起重机限速</th>
							<th class="eq_2_column_5">车辆限速</th>
							<th class="eq_2_column_6"> </th>
						</tr>
					</thead>
				</table>
				<div style="height:calc(100vh - 650px);overflow-y: auto;">
					<table style="width: 100%;text-align: center;font-size: 12px;" border="0" cellpadding="0" cellspacing="0">
						<colgroup>
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="100">
							<col name="eq_2_column_3" width="70">
							<col name="eq_2_column_4" width="70">
							<col name="eq_2_column_5" width="100">
							<col name="eq_2_column_6" width="50">
						</colgroup>
						<tbody>
							<tr v-for="row in dataMxCur" class="table-row-bg">
								<td class="eq_2_column_1" style="height: 42px;padding:5px 0;color: #06F3FB;" :title="row.TRAIN_NAME">
									<div style="display: inline-block;height: 20px;padding-top: 3px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 50px;">{{row.TRAIN_NAME}}</div>
								</td>
								<td class="eq_2_column_2">
									{{row.PLACE}}
								</td>
								<td class="eq_2_column_3">{{row.DIRECTION}}</td>
								<td class="eq_2_column_4">{{row.CRANE_SPEED}}</td>
								<td class="eq_2_column_5">{{row.TRAIN_SPEED}}</td>
								<td class="eq_2_column_6">
									<el-popover placement="left" title="救援列车详情" trigger="click" :content="row.REMARKS">
										<el-button type="text" slot="reference">详情</el-button>
									</el-popover>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<!-- <el-pagination layout="prev, pager, next" :page-size="10" small :total="dataMx.length" @current-change="getCurDataMx">
			</el-pagination> -->
			</div>
		</div>
		<div class="gongwu-light-panel" v-if="isLight">
			<!-- <tabs ref="myTabs" :tabsList="[{id:0,text:'机务信息'}]" style="height: 30px;"></tabs> -->
			<div class="brief-area">
				<div class="light-gongwu-logo">
					<div>
						<span style="color: #5EB0F3; font-size: 36px; font-weight: bolder">机务</span>
					</div>
					<div class="eq-log-light"></div>
				</div>
				<div class="light-gongwu-status">
					<div style="width: 110px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #656E77; font-weight: bold; display: flex; align-items: flex-end; flex-direction: column;font-size: 12px;">
							<p>热备内燃机车</p>
							<p>热备电力机车</p>
							<p>救援列车</p>
						</div>
					</div>
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #04B5AF; font-weight: bold; display: flex; align-items: flex-start; flex-direction: column">
							<p>{{ totals.nr}}</p>
							<p>{{ totals.dl }}</p>
							<p>{{ totals.jy }}</p>
						</div>
					</div>
				</div>
			</div>

			<div style="padding: 10px;">
				<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="dataList" :border="false"
				 :stripe="false" size="mini">
					<el-table-column width="" prop="cwd" label="车务段" align="center"></el-table-column>
					<el-table-column width="" prop="nr" label="热备内燃机车" align="center">
					</el-table-column>
					<el-table-column width="" prop="dl" label="热备电力机车" align="center"></el-table-column>
					<el-table-column width="" prop="jy" label="救援列车" align="center"></el-table-column>
				</el-table>
			</div>
			<div style="padding: 10px;background-color: white;border-radius: 10px;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="100">
						<col name="eq_2_column_3" width="70">
						<col name="eq_2_column_4" width="70">
						<col name="eq_2_column_5" width="100">
						<col name="eq_2_column_6" width="50">
					</colgroup>
					<thead>
						<tr style="color:#656E77;">
							<th class="eq_2_column_1" style="padding: 10px 0;">救援列车名称</th>
							<th class="eq_2_column_2">停放地点</th>
							<th class="eq_2_column_3">
								<el-select size="mini" v-model="value" @change="getCurDataMx" class="light-select" popper-class="light-select">
									<el-option v-for="item in options" :key="item" :label="item" :value="item">
									</el-option>
								</el-select>
							</th>
							<th class="eq_2_column_4">起重机限速</th>
							<th class="eq_2_column_5">车辆限速</th>
							<th class="eq_2_column_6"> </th>
						</tr>
					</thead>
				</table>
				<div style="height:calc(100vh - 650px);overflow-y: auto;">
					<table style="width: 100%;text-align: center;font-size: 12px;" border="0" cellpadding="0" cellspacing="0">
						<colgroup>
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="100">
							<col name="eq_2_column_3" width="70">
							<col name="eq_2_column_4" width="70">
							<col name="eq_2_column_5" width="100">
							<col name="eq_2_column_6" width="50">
						</colgroup>
						<tbody>
							<tr v-for="row in dataMxCur" class="table-row-bg-light" style="color: #656E77;">
								<td class="eq_2_column_1" style="height: 42px;padding:5px 0;" :title="row.TRAIN_NAME">
									<div style="display: inline-block;height: 20px;padding-top: 3px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 50px;">{{row.TRAIN_NAME}}</div>
								</td>
								<td class="eq_2_column_2">
									{{row.PLACE}}
								</td>
								<td class="eq_2_column_3">{{row.DIRECTION}}</td>
								<td class="eq_2_column_4">{{row.CRANE_SPEED}}</td>
								<td class="eq_2_column_5">{{row.TRAIN_SPEED}}</td>
								<td class="eq_2_column_6">
									<el-popover placement="left" title="救援列车详情" trigger="click" :content="row.REMARKS">
										<el-button type="text" slot="reference">详情</el-button>
									</el-popover>
								</td>
							</tr>
						</tbody>
					</table>
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
					all: 0,
					dong: 0,
					pu: 0
				},
				dataList: [],
				dataMx: [],
				dataMxCur: [],
				value: "",
				options: []
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			this.getData();
			this.getData_mx();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


			/* @info  数据处理区-----------------------------------*/
			getCurDataMx(type) {
				this.dataMxCur = this.dataMx.filter(v => v.DIRECTION === type);
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
					c: "tyzd_ggy2029",
					a: "救援列车",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					let value = "";
					let options = [];
					r["1"].forEach(v => {
						if (options.indexOf(v.DIRECTION) < 0) {
							options.push(v.DIRECTION);
						}
					});
					this.value = options[0];
					this.options = options;
					this.dataMx = r["1"];
					this.getCurDataMx(options[0]);
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

	.table-row-bg-light {
		background: url(../img/rowBg.png) no-repeat;
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

	>>>.blue-select .el-input__inner {
		padding: 0 0 0 5px;
		height: 20px;
		line-height: 20px;
		color: #5B96EF;
		background-color: transparent;
		border-color: #71AFDC;
	}

	>>>.blue-select .el-input__suffix {
		display: none;
	}

	>>>.light-select .el-input__inner {
		padding: 0 0 0 5px;
		height: 20px;
		line-height: 20px;
		color: #5B96EF;
		background-color: transparent;
		border-color: #71AFDC;
	}

	>>>.light-select .el-input__suffix {
		display: none;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
	.light-select.el-select-dropdown {
		background-color: whitesmoke;
	}

	.light-select .el-select-dropdown__item {
		color: #7C87A5;
	}

	.light-select .el-select-dropdown__item.hover,
	.light-select .el-select-dropdown__item:hover {
		background-color: skyblue;
		color: #FAFAFA;
	}

	.blue-select.el-select-dropdown {
		background-color: #4D5670;
	}

	.blue-select .el-select-dropdown__item {
		color: #FAFAFA;
	}

	.blue-select .el-select-dropdown__item.hover,
	.blue-select .el-select-dropdown__item:hover {
		background-color: #7C87A5;
		color: #FAFAFA;
	}
</style>
