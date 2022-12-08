<template>
	<div
		class="section-marker-container"
		:style="{
			left: x
		}"
	>
		<el-popover :popper-class="'customPPopper'">
			<div class="trains-popper">
				<el-table size="mini" :data="upTrains" max-height="400px" fit :row-style="function ({row, rowIndex}) {
        return {
          background: rowIndex % 2 === 0 ? '#111A30' : '#1B2C45',
          padding: '0'
        }
      }">
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
			<div
				class="train-container-up"
				slot="reference"
				v-show="upTrains.length !== 0"
			>
				<span>{{ upTrains.length }}</span>
			</div>
		</el-popover>
		<el-popover :popper-class="'customPPopper'">
			<div class="trains-popper">
				<el-table size="mini" :data="downTrains" max-height="400px">
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
			<div
				class="train-container-down"
				slot="reference"
				v-show="downTrains.length !== 0"
			>
				<span>{{ downTrains.length }}</span>
			</div>
		</el-popover>
		<div
			class="section-background"
			:class="{
				xs: attribute == '0',
				fs: attribute == '1'
			}"
		></div>
	</div>
</template>

<script>
	export default {
		name: "SectionMarker",
		props: {
			attribute: {
				type: String,
				default: "0"
			},
			x: {
				type: String,
				default: "0"
			}
		},
		data() {
			return {
				trains: []
			};
		},
		computed: {
			/**
			 * 上行车
			 * @returns {Array}
			 */
			upTrains() {
				return this.trains.filter(t => {
					return t.DIRECTION === "下";
				});
			},
			/**
			 * 下行车
			 * @returns {Array}
			 */
			downTrains() {
				return this.trains.filter(t => {
					return t.DIRECTION === "上" || t.DIRECTION === "";
				});
			}
		},
    methods: {
			appendTrain(train) {
				// console.log("区间中添加列车", train);
				this.trains.push(train);
			},
			clearTrains() {
				this.trains = [];
			}
		}
	};
</script>

<style scoped>
	.section-marker-container {
		position: absolute;
		top: calc(50% - 4px);
		width: 150px;
	}
	.section-background {
		height: 8px;
		width: 100%;
	}
	.section-background.xs {
		background: url("../imgs/RailXs.png") repeat-x;
		/* background-size: 100% 100%; */
	}
	.section-background.fs {
		background: url("../imgs/RailFs.png") repeat-x;
		/* background-size: 100% 100%; */
	}
	.train-container-up {
		position: absolute;
		top: calc(50% - 20px);
		left: calc(50% - 7.5px);
		background: url("../imgs/TrainRight.png") no-repeat;
		width: 24.5px;
		height: 10px;
		background-size: 100% 100%;
    cursor: pointer;
	}
	.train-container-up > span {
		position: absolute;
		top: calc(50% - 23px);
		left: calc(50% - 4px);
		color: #4eabf8;
		font-weight: bold;
	}
	.train-container-down {
		position: absolute;
		top: calc(50% + 5px);
		left: calc(50% - 7.5px);
		background: url("../imgs/TrainLeft.png") no-repeat;
		width: 24.5px;
		height: 10px;
		background-size: 100% 100%;
    cursor: pointer;
	}
	.train-container-down > span {
		position: absolute;
		top: calc(50% + 6px);
		left: calc(50% - 4px);
		color: #4eabf8;
		font-weight: bold;
	}

	.trains-popper >>> .el-table th,
	.el-table tr,
	cell {
		background: #19223c !important;
		color: white;
		font-weight: bold;
		font-size: 14px;
		padding: 0;
	}

	.trains-popper >>> .el-table__row {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
	}

	.trains-popper >>> .el-table .cell {
		padding-right: 0 !important;
		padding-left: 0 !important;
	}

	.trains-popper >>> .el-table .cell,
	.el-table--border td:first-child .cell,
	.el-table--border th:first-child .cell {
		padding: 0 !important;
	}

	.trains-popper >>> .el-table__empty-block {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
	}

	.trains-popper
		>>> .el-table--enable-row-hover
		.el-table__body
		tr:hover
		> td {
		/*box-shadow: 0 0 5px #ee0a24 inset;*/
		background: rgba(238, 10, 36, 0.22) !important;
	}

	.trains-popper >>> .el-table__body tr.current-row > td {
		background: rgba(238, 10, 36, 0.22) !important;
	}
</style>
