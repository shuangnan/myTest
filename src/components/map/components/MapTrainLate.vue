<!-- 
 * @created：	2021年11月25日
 * @author：	ch
 * @version:	v1.0
 * @desc:		地图中正晚点信息
 -->
<template>
	<el-container style="width: 100%;height: 100%;">
		<el-header style="height: 55px;color: white;">
			<div style="padding-top: 5px;">
				<el-checkbox v-model="filter.dongche" label="动车"><i class="filter-icon dongche"></i>动车</el-checkbox>
				<el-checkbox v-model="filter.late_d1" label="5-120分钟" style="width: 120px;"><i class="filter-late wd1"></i>5-120分钟</el-checkbox>
				<el-checkbox v-model="filter.late_d2" label="120-240分钟"><i class="filter-late wd2"></i>120-240分钟</el-checkbox>
				<el-checkbox v-model="filter.late_d3" label="240-360分钟"><i class="filter-late wd3"></i>240-360分钟</el-checkbox>
				<el-checkbox v-model="filter.late_d4" label="360分钟以上"><i class="filter-late wd4"></i>360分钟以上</el-checkbox>
				<span v-if="showdd" style="float: right;"><el-checkbox v-model="filter.dandang">担当车</el-checkbox></span>
			</div>
			<div style="padding-top: 5px;">
				<el-checkbox v-model="filter.puche" label="普车"><i class="filter-icon puche"></i>普车</el-checkbox>
				<el-checkbox v-model="filter.late_p1" label="5-240分钟" style="width: 120px;"><i class="filter-late wd1"></i>5-240分钟</el-checkbox>
				<el-checkbox v-model="filter.late_p2" label="240-480分钟"><i class="filter-late wd2"></i>240-480分钟</el-checkbox>
				<el-checkbox v-model="filter.late_p3" label="480-720分钟"><i class="filter-late wd3"></i>480-720分钟</el-checkbox>
				<el-checkbox v-model="filter.late_p4" label="720分钟以上"><i class="filter-late wd4"></i>720分钟以上</el-checkbox>
				<span style="float: right;">共：<label style="color: #dd2c0d;">{{tableData.length}}</label> 列</span>
			</div>
		</el-header>
		<el-main style="width: 100%;height: 100%;padding: 0;">
			<el-table size="small" :data="tableData" tooltip-effect="dark" height="100%">
				<el-table-column label="车次" prop="TRAIN"></el-table-column>
				<el-table-column label="始发站" prop="STARTNAME"></el-table-column>
				<el-table-column label="始发时间" prop="starDay"></el-table-column>
				<el-table-column label="终到站" prop="ENDNAME"></el-table-column>
				<el-table-column label="终到时间" prop="endDay"></el-table-column>
				<el-table-column label="晚点(分)" prop="EDTIME" sortable></el-table-column>
			</el-table>
		</el-main>
	</el-container>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				f_type: "",
				filter: {
					dandang:this.dandang,
					dongche: true,
					puche: true,
					late_d1: false,
					late_d2: false,
					late_d3: false,
					late_d4: false,
					late_p1: false,
					late_p2: false,
					late_p3: false,
					late_p4: false,
				},
				tarinDC: [],
				tarinPC: [],
				tableData: []
			}
		},
		// 属性
		props: {
			showdd:{
				type: Boolean,
				default: function() {
					return true;
				}
			},
			dandang: {
				type: Boolean,
				default: function() {
					return true;
				}
			},
			// 管界数据
			bounds:{
				type: Array,
				default: function() {
					return [];
				}
			},
			trains: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			this.getData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


			/* @info  数据处理区-----------------------------------*/
			filterData() {
				const f = this.filter;
				let realData = [];
				if (f.dongche) {
					if (f.late_d1 || f.late_d2 || f.late_d3 || f.late_d4) {
						this.tarinDC.forEach(v => {
							if (f.late_d1 && v.lateObj.lateCls.indexOf("wd1") > -1) {
								realData.push(v);
							}
							if (f.late_d2 && v.lateObj.lateCls.indexOf("wd2") > -1) {
								realData.push(v);
							}
							if (f.late_d3 && v.lateObj.lateCls.indexOf("wd3") > -1) {
								realData.push(v);
							}
							if (f.late_d4 && v.lateObj.lateCls.indexOf("wd4") > -1) {
								realData.push(v);
							}
						});
					} else {
						realData = realData.concat(this.tarinDC);
					}
				}
				if (f.puche) {
					if (f.late_p1 || f.late_p2 || f.late_p3 || f.late_p4) {
						this.tarinPC.forEach(v => {
							if (f.late_p1 && v.lateObj.lateCls.indexOf("wd1") > -1) {
								realData.push(v);
							}
							if (f.late_p2 && v.lateObj.lateCls.indexOf("wd2") > -1) {
								realData.push(v);
							}
							if (f.late_p3 && v.lateObj.lateCls.indexOf("wd3") > -1) {
								realData.push(v);
							}
							if (f.late_p4 && v.lateObj.lateCls.indexOf("wd4") > -1) {
								realData.push(v);
							}
						});
					} else {
						realData = realData.concat(this.tarinPC);
					}
				}
				// 过滤担当车
				if(f.dandang){
					realData = realData.filter(v=>v.dandang);
				}
				// 过滤管界内车
				if(this.bounds.length>0){
					realData = realData.filter(v=>v.inBound);
				}
				this.tableData = realData;
			},

			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			getData() {
				const tarinDC = [];
				const tarinPC = [];
				const lateD = this.trains.filter(v => {
					if (v.lateObj.lateCls !== "") {
						v.EDTIME = parseFloat(v.EDTIME);
						v.STARTNAME = v.START_NAME || v.STARTNAME;
						v.ENDNAME = v.END_NAME || v.ENDNAME;
						// if(typeof(v.START_DATE)==="undefined"){
						// 	debugger
						// }
						v.starDay = v.START_DATE?v.START_DATE.substring(5, 16):"";
						v.endDay = v.END_DATE?v.END_DATE.substring(5, 16):"";
						if (v.trainType === "D") {
							tarinDC.push(v);
						} else {
							tarinPC.push(v);
						}
						return true;
					}
				});
				this.tarinDC = tarinDC;
				this.tarinPC = tarinPC;
				this.filterData();
			}
		},
		// 监视属性
		watch: {
			filter: {
				handler: function(a, b) {
					this.filterData(a, b);
				},
				deep: true, //深度监听
				// immediate:true//绑定完监听后立即执行
			}
		},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
