<!-- 
 * @created：	2022年3月3日
 * @author：	ch
 * @version:	v1.0
 * @desc:		运输
 -->
<template>
	<div>
		<div v-if="!isLight">
			<tabs ref="myTabs" :tabsList="[{id:0,text:'运输信息'}]" style="height: 30px;"></tabs>
			<div style="height: 210px;">
				<div style="display: inline-block;" class="eq-log"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;"></div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 80px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>车站数</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.all}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>动车站</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.dong}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>普车站</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{totals.pu}}</div>
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
						<th class="eq_1_column_2">动/普车站数</th>
						<th class="eq_1_column_3">调度室电话</th>
						<th class="eq_1_column_4">值班领导</th>
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
							<td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.ZD_ZD}}</td>
							<td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.ZD_DCNUM}}</td>
							<td class="eq_1_column_3" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.ZD_DH}}</td>
							<td class="eq_1_column_4" style="border-bottom: 1px solid #293D72;height: 29px;text-decoration: underline;color: #0EDBF1;cursor: pointer;"
							 :title="row.EM_MOBILE1">{{row.EM_NAME}}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<tabs ref="myTabs" :tabsList="[{id:0,text:'全局慢行情况'}]" style="height: 30px;"></tabs>
			<div style="padding: 5px;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="100">
						<col name="eq_2_column_3" width="60">
						<col name="eq_2_column_4" width="60">
						<col name="eq_2_column_5" width="120">
						<col name="eq_2_column_6" width="50">
					</colgroup>
					<thead>
						<tr style="color: #5B96EF;">
							<th class="eq_2_column_1" style="padding: 10px 0;">区间</th>
							<th class="eq_2_column_2">限速</th>
							<th class="eq_2_column_3">里程</th>
							<th class="eq_2_column_4">行别</th>
							<th class="eq_2_column_5">起始时间</th>
							<th class="eq_2_column_6">原因</th>
						</tr>
					</thead>
				</table>
				<div style="height:calc(100vh - 650px);overflow-y: auto;">
					<table style="width: 100%;text-align: center;font-size: 12px;" border="0" cellpadding="0" cellspacing="0">
						<colgroup>
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="100">
							<col name="eq_2_column_3" width="60">
							<col name="eq_2_column_4" width="60">
							<col name="eq_2_column_5" width="120">
							<col name="eq_2_column_6" width="50">
						</colgroup>
						<tbody>
							<tr v-for="row in dataMxCur" class="table-row-bg">
								<td class="eq_2_column_1" style="height: 42px;padding:5px 0;color: #06F3FB;" :title="row.SECTION">
									<div style="display: inline-block;height: 20px;padding-top: 3px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 50px;">{{row.SECTION}}</div>
								</td>
								<td class="eq_2_column_2">
									{{row.SLOW_SPEED}}
								</td>
								<td class="eq_2_column_3">{{row.MILEAGE}}</td>
								<td class="eq_2_column_4">{{row.LINE_TYPE==="0"?'上行':"下行"}}</td>
								<td class="eq_2_column_5">{{row.BACKLIBRARYDATE.substring(5,16)}}</td>
								<td class="eq_2_column_6">
									<el-popover placement="left" title="慢行原因" trigger="click" :content="row.SLOW_CAUSE">
										<el-button type="text" slot="reference">详情</el-button>
									</el-popover>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<el-pagination layout="prev, pager, next" :page-size="10" small :total="dataMx.length" @current-change="getCurDataMx">
				</el-pagination>
			</div>
		</div>
		<div class="gongwu-light-panel" v-if="isLight">
			<div class="brief-area">
				<div class="light-gongwu-logo">
					<div>
						<span style="color: #5EB0F3; font-size: 36px; font-weight: bolder">运输</span>
					</div>
					<div class="eq-log-light"></div>
				</div>
				<div class="light-gongwu-status">
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #656E77; font-weight: bold; display: flex; align-items: flex-end; flex-direction: column">
							<p>车站数</p>
							<p>动车站</p>
							<p>普车站</p>
						</div>
					</div>
					<div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
						<div style="color: #04B5AF; font-weight: bold; display: flex; align-items: flex-start; flex-direction: column">
							<p>{{ totals.all }}</p>
							<p>{{ totals.dong }}</p>
							<p>{{ totals.pu }}</p>
						</div>
					</div>
				</div>
			</div>
			
			<div style="padding: 5px;">
				<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="dataList" :border="false"
				 :stripe="false" size="mini">
					<el-table-column width="" prop="ZD_ZD" label="车务段" align="center"></el-table-column>
					<el-table-column width="" prop="ZD_DCNUM" label="动/普车站数" align="center">
					</el-table-column>
					<el-table-column width="" prop="ZD_DH" label="调度室电话" align="center"></el-table-column>
					<el-table-column width="" prop="EM_NAME" label="值班领导" align="center"></el-table-column>
				</el-table>
			</div>

			<div style="padding: 5px;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="100">
						<col name="eq_2_column_3" width="60">
						<col name="eq_2_column_4" width="60">
						<col name="eq_2_column_5" width="120">
						<col name="eq_2_column_6" width="50">
					</colgroup>
					<thead>
						<tr style="color: #5B96EF;">
							<th class="eq_2_column_1" style="padding: 10px 0;">区间</th>
							<th class="eq_2_column_2">限速</th>
							<th class="eq_2_column_3">里程</th>
							<th class="eq_2_column_4">行别</th>
							<th class="eq_2_column_5">起始时间</th>
							<th class="eq_2_column_6">原因</th>
						</tr>
					</thead>
				</table>
				<div style="height:calc(100vh - 650px);overflow-y: auto;">
					<table style="width: 100%;text-align: center;font-size: 12px;" border="0" cellpadding="0" cellspacing="0">
						<colgroup>
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="100">
							<col name="eq_2_column_3" width="60">
							<col name="eq_2_column_4" width="60">
							<col name="eq_2_column_5" width="120">
							<col name="eq_2_column_6" width="50">
						</colgroup>
						<tbody>
							<tr v-for="row in dataMxCur" class="table-row-bg-light" style="color: #656E77;">
								<td class="eq_2_column_1" style="height: 42px;padding:5px 0;" :title="row.SECTION">
									<div style="display: inline-block;height: 20px;padding-top: 3px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 50px;">{{row.SECTION}}</div>
								</td>
								<td class="eq_2_column_2">
									{{row.SLOW_SPEED}}
								</td>
								<td class="eq_2_column_3">{{row.MILEAGE}}</td>
								<td class="eq_2_column_4">{{row.LINE_TYPE==="0"?'上行':"下行"}}</td>
								<td class="eq_2_column_5">{{row.BACKLIBRARYDATE.substring(5,16)}}</td>
								<td class="eq_2_column_6">
									<el-popover placement="left" title="慢行原因" trigger="click" :content="row.SLOW_CAUSE">
										<el-button type="text" slot="reference">详情</el-button>
									</el-popover>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<el-pagination layout="prev, pager, next" :page-size="10" small :total="dataMx.length" @current-change="getCurDataMx">
				</el-pagination>
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
				dataMxCur: []
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
			getCurDataMx(curPageNum) {
				this.dataMxCur = this.dataMx.slice((curPageNum - 1) * 10, curPageNum * 10);
			},

			/* @info  数据交互区-----------------------------------*/
			// 查询所有段供电设备统计数据
			getData() {
				C.getDataP123({
					c: "tyzd_ggy2015",
					a: "查询车务段基本情况",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					if (r["1"].length > 0) {
						this.totals.pu = r["1"][0].PS_NUM;
					}
					if (r["2"].length > 0) {
						this.totals.dong = r["2"][0].GS_NUM;
					}
					if (r["3"].length > 0) {
						this.totals.all = r["3"][0].NUM;
					}
					r["4"].forEach(v => {
						r["5"].forEach(vv => {
							if (vv.EM_DW === v.ZD_ZD) {
								v.EM_NAME = vv.EM_NAME;
								v.EM_MOBILE1 = vv.EM_MOBILE1;
							}
						})
					});
					this.dataList = r["4"];
				});
			},
			getData_mx() {
				C.getDataP123({
					c: "tyzd_ggy2017",
					a: "查询慢行情况",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, (r) => {
					this.dataMx = r["1"];
					this.getCurDataMx(1);
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
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
