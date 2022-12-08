<!-- 
 * @created：	2021年9月15日
 * @author：	
 * @version:	v1.0
 * @desc:		指派任务
 -->
<template>
	<el-container style="width:100%;height:100%;">
		<el-aside style="width:240px;height:100%;padding:0;border-right:1px solid #333;">
			<el-container style="width:100%;height:100%;">
				<el-header style="height:40px;padding:10px;border-botom:1px solid #333;">
					<el-autocomplete size="mini" placeholder="输入车次..." :clearable="true" v-model="searcher" :fetch-suggestions="remoteMethod"
					 :trigger-on-focus="true" popper-class="blue-popper">
						<template slot-scope="{ item }">
							<div class="name" @click="addTrain(item)">{{ item.TRAIN }}</div>
						</template>
					</el-autocomplete>
				</el-header>
				<el-main style="height:100%;padding:10px;">
					<el-table ref="myTable" :data="selectedTrains" size="mini" border :highlight-current-row="false" height="100%"
					 style="width: 100%;">
						<el-table-column label="车次" prop="TRAIN" align="center"></el-table-column>
						<el-table-column label="操作" width="100" align="center">
							<template slot-scope="{row,$index}">
								<el-button size="mini" type="danger" @click="removeTrain($index)">移除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-main>
			</el-container>
		</el-aside>
		<el-main style="height:100%;padding:10px;">
			<el-table ref="myTable" :data="taskList" size="mini" border highlight-current-row height="100%" style="width: 100%;">
				<el-table-column label="任务内容" prop="MOD_CONTENT" align="center"></el-table-column>
				<el-table-column label="操作" prop="MOD_NAME" width="100" align="center">
					<template slot-scope="{row}">
						<el-button size="mini" type="success" :disabled="selectedTrains.length===0" @click="handleAddTempTask(row)">{{row.MOD_NAME}}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
	</el-container>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../assets/com.js"
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				searcher: "",
				loading: false,
				taskList: [],
				filterList: [], //过滤车次
			}
		},
		// 属性
		props: {
			trainList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			selectedTrains: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			console.log(this.trainList)
			this.getTempTasks();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			addTrain(row) {
				this.selectedTrains.unshift(row);
			},
			removeTrain(index) {
				this.selectedTrains.splice(index, 1);
			},

			/* @info  数据处理区-----------------------------------*/
			remoteMethod(query, cb) {
				let d = [];
				if (query) {
					d = this.trainList.filter(v => v.TRAIN.indexOf(query.toUpperCase()) > -1);
				}
				cb(d);
			},

			/* @info  数据交互区-----------------------------------*/
			// 获取临时任务模板
			getTempTasks() {
				C.getDataP123({
					c: "kydp_ggy2002",
					s: [
						[this.$store.state.params.Oname]
					],
					a: "【kydp_ggy2002】获取临时任务模板",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
					async: true,
				}, (r) => {
					this.taskList = r["1"];
				});
			},

			// 分配临时任务
			handleAddTempTask(row) {
				let sql = []
				this.selectedTrains.forEach((train) => {
					let trainInfo = []
					trainInfo.push(train.START_DATE.toString().substring(0, 10).replace(/-/g, ''));
					trainInfo.push(train.TRAIN);
					trainInfo.push(row.MOD_ID);
					sql.push(trainInfo);
				});
				let where = {
				    DEPOTID: this.$store.state.params.DepId,
				    UNITID: this.$store.state.params.Oid,
				    PERID: this.$store.state.params.UserID,
				    DEPOT: this.$store.state.params.DepName,
				    UNIT: this.$store.state.params.Oname
				}
				C.getDataP123({
					c: "kydp_ggy9001",
					s: sql,
					w:where,
					a: "【kydp_ggy9001】分配临时任务",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
					async: true,
				}, (r) => {
					if(r){
						this.$message.success('分配成功！');
					}else{
						this.$message.error('分配失败！');
					}
				});
			},
		},
		// 监视属性
		watch: {
			"searcher"(v) {
				this.searcher = C.parseTrainCode(v);
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
