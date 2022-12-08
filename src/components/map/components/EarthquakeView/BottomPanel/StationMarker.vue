<template>
	<div
		class="station-marker-container"
		:style="{
			left: x
		}"
	>
		<div v-if="station.RAIL_TRAIN_NUM !== '0'">
			<span style="font-weight: bold; font-size: 10px">{{
				station.RAIL_TRAIN_NUM
			}}</span>
		</div>
		<el-popover :popper-class="'customPPopper'">
			<div @mouseover="stopScroll" @mouseout="startScroll">
				<h4 style="color: white">工务轨道车信息</h4>
				<div class="railtrains-popper-table">
					<el-table
						highlight-current-row
						size="mini"
						height="300"
						:data="gwLineTrain"
						fit
					>
						<el-table-column
							prop="DW"
							label="单位"
							align="center"
						></el-table-column>
						<el-table-column
							prop="LINE"
							label="线别"
							align="center"
						></el-table-column>
						<el-table-column
							prop="TRAIN_NO"
							label="车号"
							align="center"
						></el-table-column>
						<el-table-column
							prop="TRAIN_TYPE"
							label="机车型号"
							align="center"
						></el-table-column>
						<el-table-column
							prop="PLACE"
							label="停驻站点"
							align="center"
						></el-table-column>
						<el-table-column
							prop="PERSON_NAME"
							label="司机"
							align="center"
						></el-table-column>
						<el-table-column
							prop="PERSON_PHONE"
							label="司机电话"
							align="center"
							width="105px"
						></el-table-column>
						<el-table-column
							prop="CJ_NAME"
							label="管理人员"
							align="center"
						></el-table-column>
						<el-table-column
							prop="CJ_PHONE"
							label="管理人员电话"
							align="center"
						></el-table-column>
						<el-table-column
							prop="STATION"
							label="当前停留点"
							align="center"
						></el-table-column>
						<el-table-column
							prop="TRAIN_STATES"
							label="当前状态"
							align="center"
						>
							<template slot-scope="state">
								<span>{{
									state.row.TRAIN_STATES === "1"
										? "可用"
										: state.row.TRAIN_STATES === "2"
										? "不可用"
										: ""
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="REASON"
							label="不可用原因"
							align="center"
						></el-table-column>
						<el-table-column
							prop="INPUT_DATE"
							label="更新时间"
							align="center"
						></el-table-column>
					</el-table>
				</div>
				<h4 style="color: white">供电轨道车信息</h4>
				<div class="railtrains-popper-table">
					<el-table
						highlight-current-row
						size="mini"
						height="300"
						:data="gdLineTrain"
						fit
					>
						<el-table-column
							prop="DUAN_NAME"
							label="单位"
							align="center"
						></el-table-column>
						<el-table-column
							prop="LINE_NAME"
							label="线别"
							align="center"
						></el-table-column>
						<el-table-column
							prop="WORKTRAIN_NAME"
							label="车号"
							align="center"
						></el-table-column>
						<el-table-column
							prop="WORKTRAIN_TYPE"
							label="机车型号"
							align="center"
						></el-table-column>
						<el-table-column
							prop="PARK_PLACE"
							label="停驻站点"
							align="center"
						></el-table-column>
						<el-table-column
							prop="SJ_NAME"
							label="司机"
							align="center"
						></el-table-column>
						<el-table-column
							prop="SJ_PHONE"
							label="司机电话"
							align="center"
							width="105px"
						></el-table-column>
						<el-table-column
							prop="GL_NAME"
							label="管理人员"
							align="center"
						></el-table-column>
						<el-table-column
							prop="GL_PHONE"
							label="管理人员电话"
							align="center"
						></el-table-column>
						<el-table-column
							prop="WORK_RANGE"
							label="当前停留点"
							align="center"
						></el-table-column>
						<el-table-column
							prop="TRAIN_STATES"
							label="当前状态"
							align="center"
						>
							<template slot-scope="state">
								<span>{{
									state.row.TRAIN_STATES === "1"
										? "可用"
										: state.row.TRAIN_STATES === "2"
										? "不可用"
										: ""
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="REASON"
							label="不可用原因"
							align="center"
						></el-table-column>
						<el-table-column
							prop="INPUT_DATE"
							label="更新时间"
							align="center"
						></el-table-column>
					</el-table>
				</div>
			</div>
			<div
				class="railtrain-container"
				v-show="station.RAIL_TRAIN_NUM !== '0'"
				slot="reference"
			></div>
		</el-popover>
		<div class="station-logo"></div>
		<el-popover :popper-class="'customPPopper'">
			<div
				@mouseover="stopScroll"
				@mouseout="startScroll"
				class="railtrains-popper-table"
			>
				<el-table
					size="mini"
					:data="trains"
					max-height="400px"
				>
					<el-table-column
						label="车次"
						prop="TRAIN"
						align="center"
						width="100px"
					>
						<template slot-scope="trainT">
							<span
								:style="{
									color:
										trainT.row.TRAIN_TYPE === 'D'
											? '#438EC5'
											: trainT.row.TRAIN_TYPE === 'P'
											? '#50BE8B'
											: '#BA7D3A'
								}"
								>{{ trainT.row.TRAIN }}</span
							>
						</template>
					</el-table-column>
					<el-table-column
						label="发站"
						prop="START_STN"
						align="center"
						width="100px"
					></el-table-column>
					<el-table-column
						label="发点"
						prop="START_DATE"
						align="center"
						width="200px"
					>
						<template slot-scope="sTime">
							<span>{{
								(sTime.row.START_DATE || "").substring(11, 16)
							}}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="到站"
						prop="END_STN"
						align="center"
						width="100px"
					></el-table-column>
					<el-table-column
						label="到点"
						prop="END_DATE"
						align="center"
						width="200px"
					>
						<template slot-scope="eTime">
							<span>{{
								(eTime.row.END_DATE || "").substring(11, 16)
							}}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="当前位置"
						prop="CURRNAME"
						align="center"
						width="100px"
					></el-table-column>
					<el-table-column
						label="正晚点"
						prop="EDTIME"
						align="center"
						width="100px"
					>
						<template slot-scope="edtime">
							<span v-if="edtime.row.EDTIME == 0">
								正点
							</span>
							<span v-else style="color: crimson">
								晚点{{ edtime.row.EDTIME }}分
							</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="station-info" slot="reference">
				<span style="font-size: 12px">
					{{ station.STATION }}
					<span
						v-show="trains.length !== 0"
						style="font-weight: bold; color: #4EABF8"
						>({{ trains.length }})</span
					>
				</span>
				<span style="font-size: 12px">{{ station.CENTER_MILE }}</span>
			</div>
		</el-popover>
	</div>
</template>

<script>
	export default {
		props: {
			station: {
				type: Object,
				default: () => {
					return {
						STATION: "",
						CENTER_MILE: ""
					};
				}
			},
			x: {
				type: String,
				default: "0"
			}
		},
		data() {
			return {
				trains: [],
				showLineTrainDetail: false
			};
		},
		methods: {
			appendRailTrain() {},
			appendTrain(train) {
				// console.log("添加到站车", train);
				this.trains.push(train);
			},
			clearTrains() {
				this.trains = [];
			},
			/**
			 * @param {MouseEvent} 点击事件
			 */
			handleShowLineTrains() {
				console.log(this.station, this.station.GDRAILTRAIN);
			},
			stopScroll() {
				this.$store.commit("earthquake/updateStopAutoScroll", true);
			},
			startScroll() {
				this.$store.commit("earthquake/updateStopAutoScroll", false);
			}
		},
		computed: {
			/**
			 * 供电轨道车信息
			 * @returns {Array}
			 */
			gdLineTrain() {
				return this.station.GDRAILTRAIN;
			},
			/**
			 * 工务轨道车信息
			 * @returns {Array}
			 */
			gwLineTrain() {
				return this.station.GWRAILTRAIN;
			}
		}
	};
</script>

<style scoped>
	.station-marker-container {
		height: 100px;
		width: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
		justify-content: flex-end;
		position: absolute;
		top: calc(50% - 60px);
		z-index: 10;
	}

	.station-logo {
		background: url("../imgs/StationMarkerNormal.png") no-repeat;
		width: 17px;
		height: 17px;
		background-size: 100% 100%;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
	}

	.station-info {
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: center;
		width: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
    cursor: pointer;
	}

	.railtrain-container {
		background: url("../imgs/LineTrain.png") no-repeat;
		height: 11.5px;
		width: 16px;
		background-size: 100% 100%;
		margin-bottom: 3px;
		cursor: pointer;
	}

	.railtrains-popper-table >>> .el-table th,
	.el-table tr,
	cell {
		background: #19223c !important;
		color: white;
		font-weight: bold;
		font-size: 14px;
		padding: 0;
	}

	.railtrains-popper-table >>> .el-table__row {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
	}

	.railtrains-popper-table >>> .el-table .cell {
		padding-right: 0 !important;
		padding-left: 0 !important;
	}

	.railtrains-popper-table >>> .el-table .cell,
	.el-table--border td:first-child .cell,
	.el-table--border th:first-child .cell {
		padding: 0 !important;
	}

	.railtrains-popper-table >>> .el-table__empty-block {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
	}

	.railtrains-popper-table
		>>> .el-table--enable-row-hover
		.el-table__body
		tr:hover
		> td {
		/*box-shadow: 0 0 5px #ee0a24 inset;*/
		background: rgba(238, 10, 36, 0.22) !important;
	}

	.railtrains-popper-table >>> .el-table__body tr.current-row > td {
		background: rgba(238, 10, 36, 0.22) !important;
	}

	.railtrains-popper-table >>> .el-table__body-wrapper {
		background: #19223c
	}
</style>