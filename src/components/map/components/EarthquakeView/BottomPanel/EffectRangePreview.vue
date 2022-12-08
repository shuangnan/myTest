<template>
	<div class="effect-range-container">
		<!--影响图示画布-->
		<div style="width: 100%; height: 100%" id="graph"></div>

		<!--放大显示弹框-->
		<div
			id="tooltip"
			:style="{
				display: showDetail ? 'inline-block' : 'none',
				position: 'absolute',
				borderRadius: '15px',
				background: '#17223E',
				border: '1px solid #4EABF8',
			}"
		>
			<div style="display: flex; flex-direction: column">
				<div
					style="
						height: 20px;
						width: 100%;
						display: flex;
						justify-content: space-between;
						cursor: pointer;
					"
					@click="showDetail = false"
				>
					<span
						style="
							font-weight: bold;
							font-size: 18px;
							margin-left: 10px;
						"
						>放大显示</span
					>
					<span
						style="
							font-weight: bold;
							margin-right: 10px;
							font-size: 20px;
						"
						>x</span
					>
				</div>
				<div style="height: calc(100% - 20px); width: 100%">
					<EffectRangeDetail
						v-if="showDetail"
						:auto-fold="false"
						:client-height="detailHeight"
						:client-width="detailWidth"
						:trains="trains"
						:stations="stations"
						:sections="detailSections"
						:range-start-mile="showDetailStartMileage"
						:range-end-mile="showDetailEndMileage"
					/>
				</div>
			</div>
		</div>

		<!--列车详情弹框-->
		<div
			id="trainTableToolTip"
			:style="{
				display: showTrainDetail ? 'inline-block' : 'none',
				position: 'absolute',
				borderRadius: '15px',
				background: '#17223E',
				border: '1px solid #4EABF8',
				width: '1000px',
				height: '230px',
				left: '10px',
			}"
		>
			<div
				style="
					height: 100%;
					width: 100%;
					display: flex;
					flex-direction: column;
				"
			>
				<div
					style="
						height: 20px;
						width: 100%;
						display: flex;
						justify-content: space-between;
						cursor: pointer;
					"
					@click="showTrainDetail = false"
				>
					<span
						style="
							font-weight: bold;
							font-size: 18px;
							margin-left: 10px;
						"
						>车次详情</span
					>
					<span
						style="
							font-weight: bold;
							margin-right: 10px;
							font-size: 20px;
						"
						>x</span
					>
				</div>
				<div
					style="
						height: calc(100% - 20px);
						width: 100%;
						margin-top: 5px;
						display: flex;
						align-items: center;
						align-content: center;
						justify-content: center;
					"
					class="train-detail-table"
				>
					<el-table
						size="mini"
						:data="trainDetails"
						max-height="200px"
						style="
							display: flex;
							flex-direction: column;
							align-items: center;
							align-content: center;
							justify-content: center;
							margin-left: 30px;
						"
					>
						<el-table-column
							label="车次"
							prop="TRAIN"
							align="center"
							width="100px"
						>
							<template slot-scope="trainT">
								<span :style="{
									color: trainT.row.TRAIN_TYPE === 'D' ? '#438EC5' : (trainT.row.TRAIN_TYPE === 'P' ? '#50BE8B' : '#BA7D3A')
								}">{{ trainT.row.TRAIN }}</span>
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
                <span>{{ (sTime.row.START_DATE || '').substring(11, 16) }}</span>
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
                <span>{{ (eTime.row.END_DATE || '').substring(11, 16) }}</span>
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
			</div>
		</div>

		<!--轨道车详情弹框-->
		<div
			id="lineTrainDetailTable"
			:style="{
				display: showLineTrainDetail ? 'inline-block' : 'none',
				position: 'absolute',
				borderRadius: '15px',
				background: '#17223E',
				border: '1px solid #4EABF8',
				width: '1800px',
				height: 'auto',
				left: '-350px',
			}"
		>
			<div
				style="
					height: 100%;
					width: 100%;
					display: flex;
					flex-direction: column;
				"
			>
				<div
					style="
						height: 20px;
						width: 100%;
						display: flex;
						justify-content: space-between;
						cursor: pointer;
					"
					@click="showLineTrainDetail = false"
				>
					<span
						style="
							font-weight: bold;
							font-size: 18px;
							margin-left: 10px;
						"
						>轨道车信息</span
					>
					<span
						style="
							font-weight: bold;
							margin-right: 10px;
							font-size: 20px;
						"
						>x</span
					>
				</div>
				<div
					style="
						height: auto;
						width: 100%;
						margin-top: 5px;
						display: flex;
						flex-direction: column;
						align-content: center;
						align-items: center;
					"
				>
					<div style="height: auto; width: 100%">
						<h4 style="color: white; margin-left: 10px">
							供电轨道车信息
						</h4>
						<div class="train-detail-table">
							<el-table
								:data="gdLineTrain"
								size="mini"
								max-height="200px"
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
					<div style="height: auto; width: 100%">
						<h4 style="color: white; margin-left: 10px">
							工务轨道车信息
						</h4>
						<div
							class="train-detail-table"
							style="margin-bottom: 15px"
						>
							<el-table
								:data="gwLineTrain"
								size="mini"
								max-height="200px"
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
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import EffectRangeDetail from "@/components/map/components/EarthquakeView/BottomPanel/EffectRangeDetail";

	export default {
		name: "EffectRangePreview",
		components: { EffectRangeDetail },
		props: {
			autoFold: {
				type: Boolean,
				default: true,
			},
			/**
			 * 渲染起点公里标
			 */
			rangeStartMile: {
				type: Number,
				default: 0,
			},
			/**
			 * 渲染终点公里标
			 */
			rangeEndMile: {
				type: Number,
				default: 0,
			},
			/**
			 * 渲染区间
			 */
			sections: {
				type: Array,
				default: () => [],
			},
			/**
			 * 渲染车站
			 */
			stations: {
				type: Array,
				default: () => [],
			},
			/**
			 * 渲染车次
			 */
			trains: {
				type: Array,
				default: () => [],
			},
			/**
			 * 画布容器宽度
			 */
			clientWidth: {
				type: Number,
				default: 0,
			},
			/**
			 * 画布容器高度
			 */
			clientHeight: {
				type: Number,
				default: 0,
			},
		},
		computed: {
			/**
			 * 像素-公里标比例尺
			 */
			graphScale() {
				if (Math.abs(this.rangeEndMile - this.rangeStartMile) !== 0) {
					return (
						this.clientWidth /
						Math.abs(this.rangeEndMile - this.rangeStartMile)
					);
				} else {
					return 0;
				}
			},
			/**
			 * 放大显示弹框宽度
			 */
			detailWidth() {
				return document.body.clientWidth * 0.5;
			},
			/**
			 * 放大显示弹框高度
			 */
			detailHeight() {
				return 120;
			},
			detailStations() {},
			/**
			 * 放大显示区间
			 */
			detailSections() {
				return this.sections.filter((section) => {
					if (
						(parseFloat(section.S_MILE) <
							parseFloat(this.showDetailStartMileage) &&
							parseFloat(this.showDetailStartMileage) <
								parseFloat(section.E_MILE) &&
							parseFloat(section.E_MILE) <
								parseFloat(this.showDetailEndMileage)) ||
						(parseFloat(this.showDetailStartMileage) <=
							parseFloat(section.S_MILE) &&
							parseFloat(section.E_MILE) <=
								parseFloat(this.showDetailEndMileage)) ||
						(parseFloat(this.showDetailStartMileage) <
							parseFloat(section.S_MILE) &&
							parseFloat(section.S_MILE) <
								parseFloat(this.showDetailEndMileage) &&
							parseFloat(this.showDetailEndMileage) <
								parseFloat(section.E_MILE))
					) {
						return true;
					} else {
						return false;
					}
				});
			},
			/**
			 * 放大显示列车
			 */
			detailTrains() {
				return this.trains;
			},
		},
		methods: {
			/**
			 * 加载图片纹理资源
			 */
			loadPatterns() {
				return new Promise((resolve, reject) => {
					try {
						// 普通铁路线
						const normalRailwayPattern = new window.Image();
						normalRailwayPattern.src = require("../imgs/RailNormal.png");
						this.railwayPatterns.normal = normalRailwayPattern;

						// 限速铁路线
						const xsRailwayPattern = new window.Image();
						xsRailwayPattern.src = require("../imgs/RailXs.png");
						this.railwayPatterns.xs = xsRailwayPattern;

						// 封锁铁路线
						const fsRailwayPattern = new window.Image();
						fsRailwayPattern.src = require("../imgs/RailFs.png");
						this.railwayPatterns.fs = fsRailwayPattern;

						// 轨道车图标
						const lineTrainIcon = new window.Image();
						lineTrainIcon.src = require("../imgs/LineTrain.png");
						this.trainIcons.lineTrain = lineTrainIcon;

						// 车站图标
						const stationIconNormal = new window.Image();
						stationIconNormal.src = require("../imgs/StationMarkerNormal.png");
						this.stationIcons.stationNormal = stationIconNormal;

						// 上行车图标
						const trainUpIcon = new window.Image();
						trainUpIcon.src = require("../imgs/TrainRight.png");
						this.trainIcons.upTrain = trainUpIcon;

						// 下行车图标
						const trainDownIcon = new window.Image();
						trainDownIcon.src = require("../imgs/TrainLeft.png");
						this.trainIcons.downTrain = trainDownIcon;

						// 平原图标
						const pingyuanIcon = new window.Image();
						pingyuanIcon.src = require("../imgs/Weiqiu.png");
						this.envIcons.pingyuan = pingyuanIcon;

						// 重丘图标
						const zhongqiuIcon = new window.Image();
						zhongqiuIcon.src = require("../imgs/Pingyuan.png");
						this.envIcons.zhongqiu = zhongqiuIcon;

						resolve(true);
					} catch (e) {
						reject(e);
					}
				});
			},
			/**
			 * 公里标转换为像素
			 */
			kmToPx(km) {
				return (
					60 +
					this.graphScale *
						(parseFloat(km) - parseFloat(this.rangeStartMile))
				);
			},
			/**
			 * 像素转换为公里标
			 */
			pxToKm(px) {
				return (
					(px - 60) / this.graphScale + parseFloat(this.rangeStartMile)
				);
			},
			/**
			 * 绘制Stage
			 */
			renderStage() {
				if (this.layers.stage) {
					// 已存在Stage，清除内容
					this.layers.stage.clear();
          this.layers.stage.destroy()
				}
				// console.log(
				// 	"初始化Stage",
				// 	this.$store.state.earthquake.currentRenderingSection.L_NAME
				// );
				// 初始化Stage
				let stage = new Konva.Stage({
					container: "#graph",
					x: 0,
					y: 0,
					width: this.clientWidth,
					height: this.clientHeight,
				});
				this.layers.stage = stage;
				this.renderRailLines()
					.then(() => {
						this.renderStations()
							.then(() => {
								this.renderTrains()
									.then(() => {
										this.renderEnvSection().then(() => {});
									})
									.catch((e) => {
										this.$message.error("渲染车次错误:" + e);
									});
							})
							.catch((e) => {
								this.$message.error("渲染车站错误:" + e);
							});
					})
					.catch((e) => {
						this.$message.error("渲染铁路线错误:" + e);
					});
			},
			/**
			 * 绘制线路纹理
			 * @returns {Promise}
			 */
			renderRailLines() {
				return new Promise((resolve, reject) => {
					try {
						for (let key in this.layers.rails) {
							if (this.layers.rails[key]) {
								this.layers.rails[key].clear();
							}
						}
						this.layers.rails.normalLine = new Konva.Layer();
						this.layers.rails.xsLine = new Konva.Layer();
						this.layers.rails.fsLine = new Konva.Layer();

						// 渲染不受影响铁路线
						let normalLineRect = new Konva.Rect({
							x: 0,
							y: 0.5 * this.clientHeight - 10 - 2,
							width: this.clientWidth,
							height: 4,
							fillPatternImage: this.railwayPatterns.normal,
							fillPatternRepeat: "repeat-x",
						});
						this.layers.rails.normalLine.add(normalLineRect);
						this.layers.stage.add(this.layers.rails.normalLine);

						// 渲染封锁和限速铁路线
						let fsLineRects = new Konva.Group();
						let xsLineRects = new Konva.Group();
						// console.log('区间', this.sections)
						this.sections.map((section) => {
							if (section.TYPE === "1") {
								// 封锁区间
								let fsLineRect = new Konva.Rect({
									x: this.kmToPx(section.S_MILE),
									y: 0.5 * this.clientHeight - 10 - 2,
									width:
										this.kmToPx(section.E_MILE) -
										this.kmToPx(section.S_MILE),
									height: 4,
									fillPatternImage: this.railwayPatterns.fs,
									fillPatternRepeat: "repeat-x",
								});
								fsLineRects.add(fsLineRect);
							} else if (section.TYPE === "0") {
								// 限速区间
								let xsLineRect = new Konva.Rect({
									x: this.kmToPx(section.S_MILE),
									y: 0.5 * this.clientHeight - 10 - 2,
									width:
										this.kmToPx(section.E_MILE) -
										this.kmToPx(section.S_MILE),
									height: 4,
									fillPatternImage: this.railwayPatterns.xs,
									fillPatternRepeat: "repeat-x",
								});
								xsLineRects.add(xsLineRect);
							}
						});
						this.layers.rails.xsLine.add(xsLineRects);
						this.layers.rails.fsLine.add(fsLineRects);
						this.layers.stage.add(this.layers.rails.xsLine);
						this.layers.stage.add(this.layers.rails.fsLine);
						resolve(true);
					} catch (e) {
						reject(e);
					}
				});
			},
			/**
			 * 绘制车站
			 * @returns {Promise}
			 */
			renderStations() {
				return new Promise((resolve, reject) => {
					try {
						if (this.layers.stations) {
							this.layers.stations.clear();
						}
						const _this = this;
						this.layers.stations = new Konva.Layer();
						let stationsGroup = new Konva.Group();
						this.stations.map((station) => {
							let stationGroup = new Konva.Group();

							// 存在轨道车时渲染
							let railTrainIcon = new Konva.Image({
								x: this.kmToPx(station.CENTER_MILE),
								y: 0.5 * this.clientHeight - 10 - 2 - 8.5 - 5 - 11.5,
								height: 11.5,
								width: 16,
								image:
									station.GDRAILTRAIN.length +
										station.GWRAILTRAIN.length !==
									0
										? this.trainIcons.lineTrain
										: null,
								name: "railTrain",
							});
							stationGroup.add(railTrainIcon);

							let railTrainNum = new Konva.Text({
								x: this.kmToPx(station.CENTER_MILE) + 8 + 10,
								y: 0.5 * this.clientHeight - 10 - 2 - 8.5 - 5 - 11.5,
								text:
									station.GDRAILTRAIN.length +
										station.GWRAILTRAIN.length !==
									0
										? station.GDRAILTRAIN.length +
										  station.GWRAILTRAIN.length
										: "",
								fill: "white",
								name: "railTrainNum",
							});
							stationGroup.add(railTrainNum);

							// 渲染车站图标
							let stationMarker = new Konva.Image({
								x: this.kmToPx(station.CENTER_MILE),
								y: 0.5 * this.clientHeight - 10 - 2 - 8.5,
								height: 17,
								width: 17,
								image: this.stationIcons.stationNormal,
								name: "stationMarker",
							});
							stationGroup.add(stationMarker);

							// 渲染站名
							let stationNameString = new Konva.Text({
								x: this.kmToPx(station.CENTER_MILE),
								y: 0.5 * this.clientHeight - 10 - 2 + 8.5 + 5 - 1,
								text: station.STATION,
								fill: "white",
								name: "stationName",
							});
							stationGroup.add(stationNameString);

							// 渲染公里标
							let stationMileString = new Konva.Text({
								x: this.kmToPx(station.CENTER_MILE),
								y: 0.5 * this.clientHeight - 10 - 2 + 8.5 + 3 + 14,
								text: station.CENTER_MILE,
								fill: "white",
								name: "stationMileage",
							});
							stationGroup.add(stationMileString);

							// 计算边界
							let stationBoundBox = stationGroup.getClientRect({
								relativeTo: "layer",
							});

							// console.log('Group宽度', stationBoundBox.width)
							let groupWidth = stationBoundBox.width;

							// 处理元素居中
							stationGroup.getChildren().map((ele) => {
								if (ele.attrs.name === "railTrain") {
									// 轨道车图标居中
									ele.x(ele.attrs.x + groupWidth * 0.5 - 8);
								}
								if (ele.attrs.name === "stationMarker") {
									// 车站图标居中
									ele.x(ele.attrs.x + groupWidth * 0.5 - 8.5);
								}
								if (ele.attrs.name === "stationName") {
									// 车站名居中
									let textWidth = 12 * station.STATION.length;
									ele.x(
										ele.attrs.x +
											groupWidth * 0.5 -
											textWidth * 0.5
									);
								}
								if (ele.attrs.name === "stationMileage") {
									let textWidth = 6 * station.CENTER_MILE.length;
									ele.x(
										ele.attrs.x +
											groupWidth * 0.5 -
											textWidth * 0.5
									);
								}
								if (ele.attrs.name === "railTrainNum") {
									ele.x(ele.attrs.x + groupWidth * 0.5 - 8);
								}
							});

							let boundBox = new Konva.Rect({
								x: stationBoundBox.x,
								y: stationBoundBox.y,
								width: stationBoundBox.width,
								height: stationBoundBox.height,
								stroke: "white",
								strokeWidth: 0,
								name: "boundingBox",
							});
							stationGroup.add(boundBox);
							stationGroup.on("click", function (e) {
								console.log("显示轨道车");
								let railTrainTableTooltip = document.getElementById(
									"lineTrainDetailTable"
								);
								_this.gwLineTrain = station.GWRAILTRAIN;
								_this.gdLineTrain = station.GDRAILTRAIN;
								_this.showLineTrainDetail =
									station.GWRAILTRAIN.length +
										station.GDRAILTRAIN.length !==
									0;
								_this.$nextTick(() => {
									railTrainTableTooltip.style.top =
										e.evt.layerY -
										railTrainTableTooltip.clientHeight +
										100 +
										"px";
								});
							});

							stationsGroup.add(stationGroup);
						});

						// 处理车站图标重叠
						stationsGroup.getChildren().map((group, index, arr) => {
							const _this = this;
							// 寻找所有跟本站重叠的元素
							// console.log('车站Group', group)
							let groupX = 0;
							let groupWidth = 0;
							let groupEnd = 0;
							group.getChildren().map((ele) => {
								if (ele.attrs.name === "boundingBox") {
									groupX = ele.attrs.x;
									groupWidth = ele.attrs.width;
								}
							});
							let overlayStations = arr.filter((station) => {
								// console.log('车站是否可见', station.visible())
								if (station.visible()) {
									let stationX = 0;
									let stationWidth = 0;
									station.getChildren().map((ele) => {
										if (ele.attrs.name === "boundingBox") {
											stationX = ele.attrs.x;
											stationWidth = ele.attrs.width;
										}
									});
									if (groupX <= stationX) {
										// 被测元素在本站后
										if (stationX - groupX <= groupWidth + 50) {
											groupEnd = stationX;
											return true;
										} else {
											return false;
										}
									} else {
										// 被测元素在本站前
										if (
											groupX - stationX <=
											stationWidth + 50
										) {
											groupEnd = stationX;
											return true;
										} else {
											return false;
										}
									}
								} else {
									return false;
								}
							});
							// console.log('重叠车站', overlayStations)
							if (overlayStations.length > 1) {
								let firstStation = overlayStations[0];
								let lastStation =
									overlayStations[overlayStations.length - 1];
								let startPt = firstStation
									.getChildren()
									.find((node) => {
										return node.attrs.name === "boundingBox";
									}).attrs.x;
								let endPt = lastStation
									.getChildren()
									.find((node) => {
										return node.attrs.name === "boundingBox";
									}).attrs.x;

								// 折叠原有Group
								overlayStations.map((ele) => {
									ele.visible(false);
								});

								// 渲染折叠车站Group
								let overlayStationsGroup = new Konva.Group({
									name: "overlayStation",
								});

								// 折叠车站图标
								let overlayStationMarker = new Konva.Image({
									x: group.getChildren().find((node) => {
										return node.attrs.name === "stationMarker";
									}).attrs.x,
									y: 0.5 * this.clientHeight - 10 - 2 - 8.5,
									width: 17,
									height: 17,
									image: this.stationIcons.stationNormal,
								});

								// 折叠车站个数提示
								let overlayStationCount = new Konva.Text({
									x:
										group.getChildren().find((node) => {
											return (
												node.attrs.name === "stationMarker"
											);
										}).attrs.x +
										8.5 -
										6,
									y: 0.5 * this.clientHeight - 10 - 2 - 8.5 - 5 - 6,
									text: "+" + (overlayStations.length - 1),
									fill: "#5EB0F3",
									fontStyle: "bold",
								});
								overlayStationsGroup.add(overlayStationCount);

								// 折叠车站站名提示（鼠标悬浮显示）
								let overlayStationsPreview = new Konva.Group({
									name: "overlayedStations",
									visible: false,
								});
								let overlayString = overlayStations
									.map((station) => {
										return station
											.getChildren()
											.find((node) => {
												return (
													node.attrs.name ===
													"stationName"
												);
											}).attrs.text;
									})
									.join("/");
								let stringLength =
									overlayString.length * 12 -
									6 * (overlayStations.length - 1);
								let stationStr = new Konva.Text({
									x:
										group.getChildren().find((node) => {
											return (
												node.attrs.name === "stationMarker"
											);
										}).attrs.x -
										0.5 * stringLength,
									y: 0.5 * this.clientHeight - 10 - 2 - 8.5 - 15,
									text: overlayString,
									fill: "white",
								});
								overlayStationsPreview.add(stationStr);
								overlayStationsGroup.add(overlayStationsPreview);

								// 为折叠车站图标绑定事件显示Tooltip
								overlayStationsGroup
									.on("mouseover", function () {
										overlayStationsPreview.visible(true);
									})
									.on("mouseout", function () {
										overlayStationsPreview.visible(false);
										// _this.showDetail = false
									})
									.on("click", function (e) {
										// _this.$store.commit('earthquake/updateStopAutoScroll', true)
										let tooltipContainer =
											document.getElementById("tooltip");
										console.log("显示折叠车站", e.evt);
										_this.showDetailStartMileage =
											_this.pxToKm(startPt);
										_this.showDetailEndMileage =
											_this.pxToKm(endPt);
										tooltipContainer.style.left = 10 + "px";
										tooltipContainer.style.top =
											e.evt.layerY - 150 + "px";
										tooltipContainer.style.height =
											_this.detailHeight + 50 + "px";
										tooltipContainer.style.width =
											_this.detailWidth + 150 + "px";
										console.log(tooltipContainer);
										_this.showDetail = true;
									});

								// 添加碰撞边缘
								let boundingBox =
									overlayStationsGroup.getClientRect({
										relativeTo: "Group",
									});

								overlayStationsGroup.add(
									new Konva.Rect({
										x: boundingBox.x,
										y: boundingBox.y,
										height: boundingBox.height,
										width: boundingBox.width,
										stroke: "white",
										strokeWidth: 0,
										name: "overlayStationBounding",
									})
								);

								overlayStationsGroup.add(overlayStationMarker);
								overlayStationsGroup.moveToTop();
								stationsGroup.add(overlayStationsGroup);
							}
						});

						this.layers.stations.add(stationsGroup);
						this.layers.stage.add(this.layers.stations);
						resolve(true);
					} catch (e) {
						reject(e);
					}
				});
			},
			/**
			 * 渲染车次
			 * @returns {Promise}
			 */
			renderTrains() {
				return new Promise((resolve, reject) => {
					try {
						const _this = this;
						if (this.layers.trains) {
							this.layers.trains.clear();
						}
						let trainsLayer = new Konva.Layer();
						let trainsGroup = new Konva.Group();
						this.trains.map((train) => {
							let direction =
								parseFloat(train.O_KM) <= parseFloat(train.E_KM)
									? "上"
									: "下";
							let trainSectionStart = parseFloat(train.O_KM);
							let trainSectionEnd = parseFloat(train.E_KM);
							let trainPlacement =
								(trainSectionStart + trainSectionEnd) / 2;

							let trainGroup = new Konva.Group({
								name: train.TRAIN,
							});

							// 车次图标
							let trainMarker = new Konva.Image({
								x: this.kmToPx(trainPlacement),
								y:
									direction === "上"
										? 0.5 * this.clientHeight - 10 - 2 - 12
										: 0.5 * this.clientHeight - 10 - 2 + 10,
								width: 24.5,
								height: 10,
								image:
									direction === "上"
										? this.trainIcons.upTrain
										: this.trainIcons.downTrain,
								name: "trainMarker",
							});
							trainGroup.add(trainMarker);

							// 车次文本
							let trainNo = new Konva.Text({
								x: this.kmToPx(trainPlacement),
								y:
									direction === "上"
										? 0.5 * this.clientHeight - 10 - 2 - 12 - 12
										: 0.5 * this.clientHeight - 10 - 2 + 10 + 12,
								text: train.TRAIN,
								fill: "white",
								name: "trainNo",
							});
							trainGroup.add(trainNo);

							let trainBoundBox = trainGroup.getClientRect({
								relativeTo: "Group",
							});
							let groupWidth = trainBoundBox.width;

							// 处理车次文本居中
							trainGroup.getChildren().map((ele) => {
								if (ele.attrs.name === "trainMarker") {
									ele.x(ele.attrs.x + groupWidth * 0.5 - 12.25);
								}
								if (ele.attrs.name === "trainNo") {
									let stringLength = 6 * train.TRAIN.length;
									ele.x(
										ele.attrs.x +
											groupWidth * 0.5 -
											stringLength * 0.5
									);
								}
							});

							// 添加碰撞检测边缘
							let trainBoundingRect = new Konva.Rect({
								x: trainBoundBox.x,
								y: trainBoundBox.y,
								width: trainBoundBox.width,
								height: trainBoundBox.height,
								stroke: "white",
								strokeWidth: 0,
								name: "trainBoundingRect",
							});
							trainGroup.add(trainBoundingRect);

							trainGroup.on("click", function (e) {
								let trainDetailTable = [];
								let trainTableToolip =
									document.getElementById("trainTableToolTip");
								trainDetailTable.push(train);
								console.log("车次详情", trainDetailTable);
								trainTableToolip.style.top =
									e.evt.layerY - 230 + "px";
								_this.trainDetails = trainDetailTable;
								_this.showTrainDetail = true;
							});

							trainsGroup.add(trainGroup);
						});

						// 处理车次重叠
						trainsGroup.getChildren().map((trainGroup, index, arr) => {
							const _this = this;

							let groupX = 0;
							let groupWidth = 0;

							trainGroup.getChildren().map((ele) => {
								if (ele.attrs.name === "trainBoundingRect") {
									groupX = ele.attrs.x;
									groupWidth = ele.attrs.width;
								}
							});

							let overlayTrains = arr.filter((train) => {
								if (train.visible()) {
									let trainX = 0;
									let trainWidth = 0;
									train.getChildren().map((ele) => {
										if (
											ele.attrs.name === "trainBoundingRect"
										) {
											trainX = ele.attrs.x;
											trainWidth = ele.attrs.width;
										}
									});
									if (groupX <= trainX) {
										if (trainX - groupX <= groupWidth + 40) {
											return true;
										} else {
											return false;
										}
									} else {
										if (groupX - trainX <= trainWidth + 40) {
											return true;
										} else {
											return false;
										}
									}
								} else {
									return false;
								}
							});
							// console.log('重叠车次', overlayTrains)
							if (overlayTrains.length > 1) {
								// 折叠隐藏原有Train
								overlayTrains.map((ele) => {
									ele.visible(false);
								});

								// 去折叠车次Marker图片
								let trainMarker = overlayTrains[0]
									.getChildren()
									.find((node) => {
										return node.attrs.name === "trainMarker";
									});

								// 渲染折叠车次Group
								let overlayTrainGroup = new Konva.Group({
									name: "overlayTrain",
								});

								// 折叠车次图标
								overlayTrainGroup.add(trainMarker);

								// 折叠车次个数
								let overlayTrainCount = new Konva.Text({
									x: trainMarker.x() + 12.25 - 3,
									y:
										trainMarker.y() >
										0.5 * this.clientHeight - 10 - 2
											? trainMarker.y() + 15
											: trainMarker.y() - 15,
									text: overlayTrains.length,
									fill: "#5EB0F3",
									fontStyle: "bold",
								});
								overlayTrainGroup.add(overlayTrainCount);

								overlayTrainGroup.on("click", function (e) {
									let trainDetailTable = [];
									let trainTableToolip =
										document.getElementById(
											"trainTableToolTip"
										);
									overlayTrains.map((train) => {
										let trainInfo = _this.trains.find((t) => {
											return t.TRAIN === train.attrs.name;
										});
										if (trainInfo !== undefined) {
											trainDetailTable.push(trainInfo);
										}
									});
									console.log("车次详情", trainDetailTable);
									trainTableToolip.style.top =
										e.evt.layerY - 230 + "px";
									_this.trainDetails = trainDetailTable;
									_this.showTrainDetail = true;
								});

								// 添加碰撞边缘
								let overlayTrainBoundingBox =
									overlayTrainGroup.getClientRect({
										relativeTo: "Group",
									});

								let overlayTrainBound = new Konva.Rect({
									x: overlayTrainBoundingBox.x,
									y: overlayTrainBoundingBox.y,
									width: overlayTrainBoundingBox.width,
									height: overlayTrainBoundingBox.height,
									stroke: "white",
									strokeWidth: 0,
									name: "overlayTrainBounding",
								});

								overlayTrainGroup.add(overlayTrainBound);

								trainsGroup.add(overlayTrainGroup);
							}
						});
						// console.log("处理站车重叠", trainsGroup);
						// 处理站车重叠
						trainsGroup.getChildren().map((trainGroup, index, arr) => {
							// console.log(trainGroup);
							if (trainGroup.attrs.name === "overlayTrain") {
								// 折叠图标
								let boundingLeft = trainGroup
									.getChildren()
									.find((node) => {
										return (
											node.attrs.name ===
											"overlayTrainBounding"
										);
									}).attrs.x;

								let boundingRight =
									boundingLeft +
									trainGroup.getChildren().find((node) => {
										return (
											node.attrs.name ===
											"overlayTrainBounding"
										);
									}).attrs.width;

								let overlayed = false;

								this.layers.stations
									.getChildren()[0]
									.getChildren()
									.map((station) => {
										if (
											station.attrs.name === "overlayStation"
										) {
											let stationBoundingLeft = station
												.getChildren()
												.find((node) => {
													return (
														node.attrs.name ===
														"overlayStationBounding"
													);
												}).x;

											let stationBoundingRight =
												stationBoundingLeft +
												station
													.getChildren()
													.find((node) => {
														return (
															node.attrs.name ===
															"overlayStationBounding"
														);
													}).width;

											// 判断是否重叠

											if (
												boundingRight >= stationBoundingLeft
											) {
												// 车在站左侧重叠，车左移
												trainGroup.offsetX(10);
											} else if (
												stationBoundingRight >= boundingLeft
											) {
												// 车在站右侧重叠，车右移
												trainGroup.offsetX(-10);
											}
										} else {
											let stationBoundingLeft = station
												.getChildren()
												.find((node) => {
													return (
														node.attrs.name ===
														"boundingBox"
													);
												}).x;

											let stationBoundingRight =
												stationBoundingLeft +
												station
													.getChildren()
													.find((node) => {
														return (
															node.attrs.name ===
															"boundingBox"
														);
													}).width;

											// 判断是否重叠

											if (
												boundingRight >= stationBoundingLeft
											) {
												// 车在站左侧重叠，车左移
												trainGroup.offsetX(10);
											} else if (
												stationBoundingRight >= boundingLeft
											) {
												// 车在站右侧重叠，车右移
												trainGroup.offsetX(-10);
											}
										}
									});
							} else {
								// 折叠图标
								let boundingLeft = trainGroup
									.getChildren()
									.find((node) => {
										return (
											node.attrs.name === "trainBoundingRect"
										);
									}).attrs.x;

								let boundingRight =
									boundingLeft +
									trainGroup.getChildren().find((node) => {
										return (
											node.attrs.name === "trainBoundingRect"
										);
									}).attrs.width;

								let overlayed = false;

								this.layers.stations
									.getChildren()[0]
									.getChildren()
									.map((station) => {
										if (
											station.attrs.name === "overlayStation"
										) {
											let stationBoundingLeft = station
												.getChildren()
												.find((node) => {
													return (
														node.attrs.name ===
														"overlayStationBounding"
													);
												}).x;

											let stationBoundingRight =
												stationBoundingLeft +
												station
													.getChildren()
													.find((node) => {
														return (
															node.attrs.name ===
															"overlayStationBounding"
														);
													}).width;

											// 判断是否重叠

											if (
												boundingRight >= stationBoundingLeft
											) {
												// 车在站左侧重叠，车左移
												trainGroup.offsetX(10);
											} else if (
												stationBoundingRight >= boundingLeft
											) {
												// 车在站右侧重叠，车右移
												trainGroup.offsetX(-10);
											}
										} else {
											let stationBoundingLeft = station
												.getChildren()
												.find((node) => {
													return (
														node.attrs.name ===
														"boundingBox"
													);
												}).x;

											let stationBoundingRight =
												stationBoundingLeft +
												station
													.getChildren()
													.find((node) => {
														return (
															node.attrs.name ===
															"boundingBox"
														);
													}).width;

											// 判断是否重叠

											if (
												boundingRight >= stationBoundingLeft
											) {
												// 车在站左侧重叠，车左移
												trainGroup.offsetX(10);
											} else if (
												stationBoundingRight >= boundingLeft
											) {
												// 车在站右侧重叠，车右移
												trainGroup.offsetX(-10);
											}
										}
									});
							}
						});

						trainsLayer.add(trainsGroup);
						this.layers.stage.add(trainsLayer);
						this.layers.stations.moveToTop();
						resolve(true);
					} catch (e) {
						reject(e);
					}
				});
			},
			/**
			 * 渲染高层信息
			 * @returns {Promise}
			 */
			renderEnvSection() {
				return new Promise((resolve, reject) => {
					try {
						if (this.layers.env) {
							this.layers.env.clear();
						}
						let envLayer = new Konva.Layer();
						let allSections = this.sections.sort(
							(sectionA, sectionB) => {
								return (
									parseFloat(sectionA.S_MILE) -
									parseFloat(sectionB.S_MILE)
								);
							}
						);
						let sectionList = [];

						// 合并相同高层区间
						allSections.map((section, index, arr) => {
							// console.log(
							// 	section.S_MILE,
							// 	section.E_MILE,
							// 	section.merged
							// );
							if (section.merged === undefined || !section.merged) {
								let sectionStart = parseFloat(section.S_MILE);
								let sectionEnd = parseFloat(section.E_MILE);
								let type =
									section.ENVIRONMENT === "平原" ||
									section.ENVIRONMENT === "微丘"
										? "1"
										: "2";

								let newSection = {
									start: sectionStart,
									end: sectionEnd,
									env: type,
								};

								// 获取该区间之后的全部区间
								let behindSections = arr.slice(index + 1);
								// console.log('待合并区间', behindSections)

								for (let i = 0; i < behindSections.length; i++) {
									let currentSection = behindSections[i];
									let currentStart = parseFloat(
										currentSection.S_MILE
									);
									let currentEnd = parseFloat(
										currentSection.E_MILE
									);
									let currentType =
										currentSection.ENVIRONMENT === "平原" ||
										currentSection.ENVIRONMENT === "微丘"
											? "1"
											: "2";
									if (newSection.end >= currentStart) {
										// console.log('区间连续', newSection.end, currentStart)
										if (newSection.env === currentType) {
											newSection.end = currentEnd;
											arr[index + i + 1].merged = true;
										} else {
											arr[index + i + 1].merged = false;
											break;
										}
									} else {
										// console.log('区间不连续', newSection.end, currentStart)
										arr[index + i + 1].merged = false;
										break;
									}
								}
								sectionList.push(newSection);
							}
						});

						// console.log("合并后区间", sectionList);

						sectionList.map((section) => {
							let sectionGroup = new Konva.Group();
							// console.log(section);

							// 渲染高层识别线
							let envLine = new Konva.Rect({
								x: this.kmToPx(section.start),
								y: this.clientHeight - 16,
								height: 3,
								width:
									this.kmToPx(section.end) -
									this.kmToPx(section.start),
								fill: section.env === "1" ? "#B8E897" : "#FFA339",
							});

							let envIcon = new Konva.Image({
								x:
									(this.kmToPx(section.start) +
										this.kmToPx(section.end)) /
										2 -
									10.5,
								y: this.clientHeight - 5 - 16,
								width: 21,
								height: 12,
								image:
									section.env === "1"
										? this.envIcons.pingyuan
										: this.envIcons.zhongqiu,
							});
							sectionGroup.add(envIcon);
							sectionGroup.add(envLine);
							envIcon.moveToTop();
							// console.log("区间元素", sectionGroup);
							envLayer.add(sectionGroup);
							// this.layers.env.add(sectionGroup)
						});
						// envLayer.moveToTop()
						// console.log(envLayer);
						this.layers.env = envLayer;
						this.layers.stage.add(envLayer);
						resolve(true);
					} catch (e) {
						reject(e);
					}
				});
			},
		},
		mounted() {
			this.loadPatterns()
				.then(() => {
					this.renderStage();
				})
				.catch((e) => {
					this.$message.error("加载图片纹理资源错误:" + e);
				});
		},
		data() {
			return {
        /**
         * 铁路线纹理
         */
				railwayPatterns: {
					normal: null,               // 普通铁路线
					xs: null,                   // 限速区间
					fs: null,                   // 封锁区间
				},

        /**
         * 车站图标
         */
				stationIcons: {
					stationNormal: null,
				},

        /**
         * 列车图标
         */
				trainIcons: {
					lineTrain: null,            // 轨道车
					upTrain: null,              // 上行车
					downTrain: null,            // 下行车
				},

        /**
         * 高层指示图标
         */
				envIcons: {
					pingyuan: null,             // 平原
					zhongqiu: null,             // 重丘
				},

        /**
         * 图层
         */
				layers: {
					stage: null,                // Stage
					rails: {
						normalLine: null,
						xsLine: null,
						fsLine: null,
					},
					stations: null,
					trains: null,
					env: null,
				},
				overlayThreshold: 20,
				showDetail: false,
				showDetailStartMileage: 0,
				showDetailEndMileage: 0,
				showTrainDetail: false,
				trainDetails: [],
				showLineTrainDetail: false,
				gwLineTrain: [],
				gdLineTrain: [],
			};
		},
		watch: {
			renderStartMile: {
				deep: true,
				handler: function () {
					this.renderStage();
				},
			},
			renderEndMile: {
				deep: true,
				handler: function () {
					this.renderStage();
				},
			},
			sections: {
				deep: true,
				handler: function () {
					this.renderStage();
				},
			},
			stations: {
				deep: true,
				handler: function () {
					this.renderStage();
				},
			},
			trains: {
				deep: true,
				handler: function () {
					this.renderStage();
				},
			},
			clientWidth: {
				deep: true,
				handler: function () {
					this.renderStage();
				},
			},
			clientHeight: {
				deep: true,
				handler: function () {
					this.renderStage();
				},
			},
		},
    beforeDestroy () {
      this.layers.stage.destroy()
    }
	};
</script>

<style scoped>
	.effect-range-container {
		width: 100%;
		height: 100%;
	}

	.train-detail-table >>> .el-table th,
	.el-table tr,
	cell {
		background: #19223c !important;
		color: #5eb0f3 !important;
		font-weight: bold;
		font-size: 14px;
		padding: 0;
		border: 0 !important;
	}

	.train-detail-table >>> .el-table__row {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
		border: 0 !important;
	}

	.train-detail-table >>> .el-table__empty-block {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
		border: 0 !important;
	}

	.train-detail-table
		>>> .el-table--enable-row-hover
		.el-table__body
		tr:hover
		> td {
		/*box-shadow: 0 0 5px #ee0a24 inset;*/
		background: rgba(238, 10, 36, 0.22) !important;
	}

	.train-detail-table >>> .el-table__body tr.current-row > td {
		background: rgba(238, 10, 36, 0.22) !important;
	}

	.train-detail-table >>> .el-table,
	.el-table__expanded-cell {
		background: transparent !important;
		border: 0 !important;
	}

	.train-detail-table >>> .el-table--border::after,
	.el-table--group::after,
	.el-table::before {
		border: 0 !important;
		background: transparent !important;
	}
</style>
