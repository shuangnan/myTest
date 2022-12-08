<!--
 * @created：	2022年10月17日
 * @author：	ch
 * @version:	v1.0
 * @desc:		工务轨道车台账
 -->
<template>
	<div style="width: 100%;height: 100%;">
		<tabs ref="myTabs" :tabsList="[{id:0,text:'轨道车台账'}]" style="height: 30px;"></tabs>
		<div style="position: relative;height: calc(100% - 30px);padding: 32px 10px 10px 10px;color: #CDC3E1;">
			<div style="position: absolute;height: 32px;top:0px;left:10px;right: 10px;">
				<el-input v-model="str" size="mini" style="width: 150px;" placeholder="输入内容筛选" @change="filterData">
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
				日期范围：<el-date-picker v-model="date" @change="handleChang" size="mini" style="width: 330px;" :clearable="false" type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
				 value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
				</el-date-picker>
			</div>
			<div style="width: 100%;height: 100%;" class="blue-table">
				<el-table :data="realList" @expand-change="getDetail" border size="mini" stripe height="100%" class="blue-table"
				 style="width: 100%;">
					<el-table-column type="expand" width="30">
						<template slot-scope="scope">
							<div style="padding: 5px;font-size: 14px;">
								<div>总计<span style="display: inline-block;padding:0 5px;color:red;font-weight: bold;">{{scope.row.details.length}}</span>条记录</div>
								<div>开始时间：{{scope.row.startTime}}</div>
								<div>截止时间：{{scope.row.endTime}}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="单位" prop="O_NAME" align="center" width="100"></el-table-column>
					<el-table-column label="车间" prop="DEP_NAME" align="center"></el-table-column>
					<el-table-column label="班组" prop="CLASS_NAME" align="center"></el-table-column>
					<el-table-column label="车型" prop="CAR_TYPE" align="center" width="90">
						<template slot-scope="{row}">
							<a v-if="row.hasPoint" @click="showPoint(row)" style="color: #eeb327;text-decoration: underline;cursor: pointer;">
								<i class="el-icon-location"></i>{{row.CAR_TYPE}}
							</a>
							<span v-else>{{row.CAR_TYPE}}</span>
						</template>
					</el-table-column>
					<el-table-column label="车号" prop="CAR_NUM" align="center" width="60"></el-table-column>
					<el-table-column label="最后回传" prop="LAST_TIME__str" align="center" width="70"></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../../assets/com.js"
	import tabs from "../../../../components/bigScreen/KydTabs.vue";
	import guiDaoChe from "../../js/guiDaoChe.js"
	export default {
		// 组件
		components: {
			tabs
		},
		// 数据仓库
		data() {
			return {
				str: "",
				date: ["", ""],
				dataList: [],
				realList: []
			}
		},
		// 属性
		props: {
			"source": Array
		},
		// 组件挂载完毕
		mounted() {
			this.date = [C.getDateTimeSub(new Date(), "yyyy-MM-dd hh:mm:ss", -24), (new Date()).Format("yyyy-MM-dd hh:mm:ss")];
			this.dataList = this.source;
			this.filterData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			handleChang(){
				guiDaoChe.drawHistory("日期更改", "全部");//清空历史轨迹
			},
			showPoint(row){
				guiDaoChe.moveToPoint([row.LATITUDE,row.LONGITUDE]);
			},
			/* @info  数据处理区-----------------------------------*/
			filterData() {
				if (this.str === "") {
					this.realList = this.dataList;
				} else {
					this.realList = this.dataList.filter(v => {
						const txt = v.O_NAME + v.DEP_NAME + v.CLASS_NAME + v.CAR_TYPE + v.CAR_NUM;
						return txt.indexOf(this.str) > -1;
					});
				}
			},
			/* @info  数据交互区-----------------------------------*/
			getDetail(row,expandedRows) {
				// 取过数据
				if(row.geted){
					guiDaoChe.drawHistory(row,"单条");
				}else {
					// 47.1、获取指定轨道车历史轨迹信息
					// code trdm_lv_868
					// param1 [SN_NUM 定位设备SN号，开始时间（2022-10-19 00:00:00），结束时间]
					C.getData({
						c: "trdm_lv_868",
						s: [row.SN_NUM,this.date[0],this.date[1]],
						a: "获取轨道车历史轨迹",
						url: C.ADDS.url_34_79 + "/TRDM/GeneralProServlet", //接口地址
						// url: "http://10.192.6.110:9090/TRDM/GeneralProServlet", //接口地址
					}, (r) => {
						row.geted = true;
						// {"RKSJ":"2022-10-17 16:45:35.0","LONGITUDE":"104.729501555","SN_NUM":"M9142891","LATITUDE":"31.485038998333334"}
						row.details = r;
						row.points = r.map(v => [v.LATITUDE, v.LONGITUDE]);
						if (row.points.length > 0) {
							row.startTime = r[r.length - 1].RKSJ.substring(0, 19);
							row.endTime = r[0].RKSJ.substring(0, 19);
							guiDaoChe.drawHistory(row,false);
						}
					});
				}
			}
		},
		// 监视属性
		watch: {
			"source"(v) {
				this.dataList = v;
				this.filterData();
			}
		},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	>>>.el-table .cell {
		line-height: 14px;
		padding-left: 3px !important;
		padding-right: 3px !important;
	}

	>>>.el-input-group__append {
		padding: 0px;
	}
	>>>.el-input-group__append>.el-button{
		margin-right: 0px;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
