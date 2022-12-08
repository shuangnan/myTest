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
					<el-select v-model="searcher" @change="addTrain" :multiple="false" filterable remote reserve-keyword placeholder="输入车次回车加入列表" :remote-method="remoteMethod"
					 :loading="loading">
						<el-option v-for="item in filterList" :key="item.TRAIN" :label="item.TRAIN" :value="item.TRAIN">
						</el-option>
					</el-select>
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
	// import InterFace from "../../service/index.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				searcher: "",
				loading: false,
				taskList: [],
				filterList:[],//过滤车次
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
			this.$store.dispatch('tasks/getTempTasks', this.$store.state.params.Oname).then((res) => {
				this.taskList = res["1"];
			})
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			addTrain(trainCode) {
				const row = this.trainList.find(item=>item.TRAIN===trainCode)
				row && this.selectedTrains.unshift(row);
			},
			removeTrain(index) {
				this.selectedTrains.splice(index, 1);
			},

			/* @info  数据处理区-----------------------------------*/
			remoteMethod(query) {
				if (query !== '' && query.length>1) {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						this.filterList = this.trainList.filter(item => {
							return item.TRAIN.toLowerCase().indexOf(query.toLowerCase()) > -1;
						});
					}, 200);
				} else {
					this.filterList = [];
				}
			},

			/* @info  数据交互区-----------------------------------*/
			// 分配临时任务
			handleAddTempTask(row) {
			  let checked = []
			  this.selectedTrains.forEach((train) => {
			    let trainInfo = []
			    trainInfo.push(train.START_DATE.toString().substring(0, 10).replace(/-/g, ''));
			    trainInfo.push(train.TRAIN);
			    trainInfo.push(row.MOD_ID);
			    checked.push(trainInfo);
			  });
			  this.$store.dispatch('tasks/dispatchTempTask', checked).then((res) => {
			    this.$message.success(res)
			  }).catch((err) => {
			    this.$message.error(err)
			  });
			},
		},
		// 监视属性
		watch: {},
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
