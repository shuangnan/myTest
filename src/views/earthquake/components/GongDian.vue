<!-- 
 * @created：	2020年7月31日
 * @author：	开发人员
 * @version:	v1.0
 * @desc:		当前脚本功能描述
 -->
<template>
	<div>
		<div v-if="!isLight" style="height: calc(100vh - 120px);overflow: auto;">
			<tabs ref="myTabs" :tabsList="[{id:0,text:'供电信息'}]" style="height: 30px;"></tabs>
			<div style="height: 210px;">
				<div style="display: inline-block;" class="eq-log"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">{{curList.DEPOT}}</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 60px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>变电所</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.BDS_COUNT}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div>供电臂</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.GDB_COUNT}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>人员</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.PERSON_COUNT}}人</div>
						</div>
					</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 60px;margin-top: 10px;">
						<div style="padding-left: 20px;padding-right: 20px;border-right: 1px solid #000000;">
							<div>DC600V应急供电电源</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.DC600V_COUNT}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div>应急发电机</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.GENERATOR_COUNT}}</div>
						</div>
					</div>
				</div>
			</div>
			<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
				<colgroup>
					<col name="" width="120">
					<col name="eq_1_column_2" width="80">
					<col name="eq_1_column_3" width="80">
					<col name="eq_1_column_4" width="80">
					<col name="eq_1_column_4" width="60">
				</colgroup>
				<thead>
					<tr style="color: #5B96EF;">
						<th class="" style="padding: 10px 0;">供电段</th>
						<th class="eq_1_column_2">变电所</th>
						<th class="eq_1_column_4">人员</th>
						<th class="eq_1_column_4">供电臂数量</th>
						<th class="eq_1_column_4">DC600V应急供电电源</th>
					</tr>
				</thead>
			</table>
			<div style="height:150px;overflow-y: auto;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="" width="120">
						<col name="eq_1_column_2" width="80">
						<col name="eq_1_column_3" width="80">
						<col name="eq_1_column_4" width="80">
						<col name="eq_1_column_4" width="60">
					</colgroup>
					<tbody style="background: rgba(21,42,99,.8);">
						<tr v-for="(row,indexRow) in dataList" :key="indexRow" @click="getDetail(row)" :style="{background:curList.DEPOT===row.DEPOT?'#0E307E':''}">
							<td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.DEPOT}}</td>
							<td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.BDS_COUNT}}所</td>
							<td class="eq_1_column_3" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.PERSON_COUNT}}</td>
							<td class="eq_1_column_4" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.GDB_COUNT}}个</td>
							<td class="eq_1_column_4" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.DC600V_COUNT}}个</td>
						</tr>
					</tbody>
				</table>
			</div>
			<tabs ref="myTabs" :tabsList="[{id:0,text:'DC600V应急供电电源'}]" style="height: 30px;"></tabs>
			<div style="padding: 5px;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="100">
						<col name="eq_2_column_3" width="150">
						<col name="eq_2_column_4" width="120">
					</colgroup>
					<thead>
						<tr style="color: #5B96EF;">
							<th class="eq_2_column_1" style="padding: 10px 0;">线别</th>
							<th class="eq_2_column_2">设置地点</th>
							<th class="eq_2_column_3">设备管理单位</th>
							<th class="eq_2_column_4">接触网地点·支柱号</th>
						</tr>
					</thead>
				</table>
				<div style="height:150px;overflow-y: auto;">
					<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0">
						<colgroup>
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="100">
							<col name="eq_2_column_3" width="150">
							<col name="eq_2_column_4" width="120">
						</colgroup>
						<tbody>
							<tr v-for="row in detailList" class="table-row-bg">
								<td class="eq_2_column_1" style="height: 42px;padding:5px;color: #06F3FB;">{{row.LINE_NAME}}</td>
								<td class="eq_2_column_2">{{row.STN_NAME}}</td>
								<td class="eq_2_column_3">
									{{row.DEPOT}}
									<!-- <div>成都东-昆明</div> -->
									<!-- <div style="color: #CDC3E1;width:150px;white-space: nowrap;overflow: hidden;">{{row.MILEAGE_START}} <span style="color: #06F3FB;">- </span>{{row.MILEAGE_END}}</div> -->
								</td>
								<td class="eq_2_column_4" style="position: relative;"><i class="split"></i>{{row.GDB}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<tabs ref="myTabs" :tabsList="[{id:0,text:'应急发电机'}]" style="height: 30px;"></tabs>
			<div style="padding: 5px;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="140">
						<col name="eq_2_column_3" width="100">
						<col name="eq_2_column_4" width="120">
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="100">
						<col name="eq_2_column_3" width="150">
						<col name="eq_2_column_4" width="120">
						<col name="eq_2_column_4" width="120">
					</colgroup>
					<thead>
						<tr style="color: #5B96EF;">
							<th class="eq_2_column_1" style="padding: 10px 0;">线别</th>
							<th class="eq_2_column_2">配置地点</th>
							<th class="eq_2_column_3">相数</th>
							<th class="eq_2_column_4">容量（kW）</th>
							<th class="eq_2_column_2">数量</th>
							<th class="eq_2_column_3">油料种类</th>
							<th class="eq_2_column_4">使用单位</th>
							<th class="eq_2_column_2">维护单位</th>
							<th class="eq_2_column_2">备注</th>
						</tr>
					</thead>
				</table>
				<div style="height:150px;overflow-y: auto;">
					<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0">
						<colgroup>
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="140">
							<col name="eq_2_column_3" width="100">
							<col name="eq_2_column_4" width="120">
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="100">
							<col name="eq_2_column_3" width="150">
							<col name="eq_2_column_4" width="120">
							<col name="eq_2_column_4" width="120">
						</colgroup>
						<tbody>
							<tr v-for="row in yjfdj">
								<td class="eq_2_column_1">{{row.LINE_NAME}}</td>
								<td class="eq_2_column_2">{{row.LOCATION}}</td>
								<td class="eq_2_column_3">
									{{row.PHASE}}
								</td>
								<td class="eq_2_column_4">{{row.POWER}}</td>
								<td class="eq_2_column_1">{{row.NUM}}</td>
								<td class="eq_2_column_2">{{row.OIL}}</td>
								<td class="eq_2_column_3">{{row.USE_UNIT}}</td>
								<td class="eq_2_column_4">{{row.MAINTAIN_UNIT}}</td>
								<td class="eq_2_column_4">{{row.NOTE}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<!-- 备品备料 -->
			<!-- <tabs ref="myTabs" :tabsList="[{id:0,text:'备品备料'}]" style="height: 30px;"></tabs>
			<div style="padding: 5px;">
				<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
					<colgroup>
						<col name="eq_2_column_1" width="100">
						<col name="eq_2_column_2" width="100">
						<col name="eq_2_column_2" width="100">
					</colgroup>
					<thead>
						<tr style="color: #5B96EF;">
							<th class="eq_2_column_1" style="padding: 10px 0;">处置方法</th>
							<th class="eq_2_column_2">物料名称</th>
							<th class="eq_2_column_2">存放地点</th>
						</tr>
					</thead>
				</table>
				<div style="height:calc(100vh - 630px);overflow-y: auto;">
					<table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0">
						<colgroup>
							<col name="eq_2_column_1" width="100">
							<col name="eq_2_column_2" width="100">
							<col name="eq_2_column_2" width="100">
						</colgroup>
						<tbody>
							<tr v-for="row in bpDetail" class="table-row-bg">
								<td class="eq_2_column_1" style="height: 42px;padding:5px;color: #06F3FB;">{{row.checkOfficeSuppliesDt.sManageName}}</td>
								<td class="eq_2_column_2">{{row.checkOfficeSuppliesDt.sMatlName}}</td>
								<td class="eq_2_column_2">{{row.checkOfficeSuppliesDt.sStorageArea}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div> -->
		</div>

		<div v-if="isLight">
			<!-- <tabs ref="myTabs" :tabsList="[{id:0,text:'供电信息'}]" style="height: 30px;"></tabs> -->
			<div style="height: 210px;">
				<div style="display: inline-block;" class="eq-log-light"> </div>
				<div style="display: inline-block;text-align: center;width: calc(100% - 160px);padding: 0 10px;color: #CDC3E1;">
					<div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">{{curList.DEPOT}}</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(255,255,255,.9);height: 60px;">
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div style="color:#656E77">变电所</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.BDS_COUNT}}</div>
						</div>
						<div style="border-right: 1px solid #000000;padding-left: 20px;padding-right: 20px;">
							<div style="color:#656E77"> 供电臂</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.GDB_COUNT}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div style="color:#656E77">人员</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.PERSON_COUNT}}人</div>
						</div>
					</div>
					<div style="display: flex;justify-content: space-around;align-items: center;background: rgba(255,255,255,.9);height: 60px;margin-top: 10px;">
						<div style="padding-left: 20px;padding-right: 20px;border-right: 1px solid #000000;">
							<div style="color:#656E77">DC600V应急供电电源</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.DC600V_COUNT}}</div>
						</div>
						<div style="padding-left: 20px;padding-right: 20px;">
							<div style="color:#656E77">应急发电机</div>
							<div style="color: #0BCCDC;padding-top:5px;">{{curList.GENERATOR_COUNT}}</div>
						</div>
					</div>
				</div>
			</div>
			<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" @row-click="getDetail" :data="dataList"
			 :border="false" :stripe="false" size="mini">
				<el-table-column width="" prop="DEPOT" label="供电段" align="center"></el-table-column>
				<el-table-column width="" prop="BDS_COUNT" label="变电所" align="center">
				</el-table-column>
				<el-table-column width="" prop="PERSON_COUNT" label="人员" align="center"></el-table-column>
				<el-table-column width="" prop="GDB_COUNT" label="供电臂数量" align="center"></el-table-column>
				<el-table-column width="" prop="DC600V_COUNT" label="DC600V应急供电电源" align="center"></el-table-column>
			</el-table>
			<!-- <tabs ref="myTabs" :tabsList="[{id:0,text:'DC600V应急供电电源'}]" style="height: 30px;"></tabs> -->
			<div style="padding: 5px;">
				<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="detailList" :border="false"
				 :stripe="false" size="mini">
					<el-table-column width="" prop="LINE_NAME" label="线别" align="center"></el-table-column>
					<el-table-column width="" prop="STN_NAME" label="设置地点" align="center">
					</el-table-column>
					<el-table-column width="" prop="DEPOT" label="设备管理单位" align="center"></el-table-column>
					<el-table-column width="" prop="GDB" label="接触网地点·支柱号" align="center"></el-table-column>
				</el-table>
			</div>
			<div style="padding: 5px;">
				<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="yjfdj" :border="false"
				:stripe="false" size="mini">
					<el-table-column width="" prop="LINE_NAME" label="线别" align="center"></el-table-column>
					<el-table-column width="" prop="LOCATION" label="配置地点" align="center">
					</el-table-column>
					<el-table-column width="" prop="PHASE" label="相数" align="center"></el-table-column>
					<el-table-column width="" prop="POWER" label="容量（kW）" align="center"></el-table-column>
					<el-table-column width="" prop="NUM" label="数量" align="center"></el-table-column>
					<el-table-column width="" prop="OIL" label="油料种类" align="center">
					</el-table-column>
					<el-table-column width="" prop="USE_UNIT" label="使用单位" align="center"></el-table-column>
					<el-table-column width="" prop="MAINTAIN_UNIT" label="维护单位" align="center"></el-table-column>
					<el-table-column width="" prop="NOTE" label="备注" align="center"></el-table-column>
				</el-table>
			</div>
			<!-- 备品备料 -->
			<!-- <tabs ref="myTabs" :tabsList="[{id:0,text:'备品备料'}]" style="height: 30px;"></tabs> -->
			<!-- <div style="padding: 5px;">
				<el-table height="150px" style="width: 100%; height: 100%; border-radius: 15px" :data="bpDetail" :border="false"
							:stripe="false" size="mini">
								<el-table-column width="" prop="checkOfficeSuppliesDt.sManageName" label="处置方法" align="center"></el-table-column>
								<el-table-column width="" prop="checkOfficeSuppliesDt.sMatlName" label="物料名称" align="center">
								</el-table-column>
								<el-table-column width="" prop="checkOfficeSuppliesDt.sStorageArea" label="存放地点" align="center"></el-table-column>
							</el-table>
				</div> -->
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
				dataList: [],
				curList: {},
				detailList: [],
				bpDetail: [],
				yjfdj: [],
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


			/* @info  数据交互区-----------------------------------*/
			// 查询所有段供电设备统计数据
			getData() {
				C.getDataP123({
					c: "eqeh_zxy2010",
					a: "【eqeh_zxy2010】查询所有段供电设备统计数据",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
					async: true,
				}, (r) => {
					this.dataList = r["1"];
				});
			},
			getDetail(row, col, event) {
				this.curList = row;
				C.getDataP123({
					s: [
						[row.DEPOT],
						[row.DEPOT]
					],
					c: "eqeh_zxy2011",
					a: "【eqeh_zxy2011】根据段名称查询供电设备详细信息",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
					async: true,
				}, (r) => {
					this.detailList = r["1"];
					this.yjfdj = r['2'];
				});
				this.getBp();
			},
			getBp() {
				C.getDataP123({
					s: [this.curList.SUNITCODE, '1', '20', '03'],
					c: "eqeh_zxy9007",
					a: "【eqeh_zxy9007】查询备品备料数据",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
					async: true,
				}, (r) => {
					this.bpDetail = r;
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
		width: 160px;
		height: 160px;
		background: url(../img/gongwuLight.gif) no-repeat;
		background-size: 160px 160px;
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
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
