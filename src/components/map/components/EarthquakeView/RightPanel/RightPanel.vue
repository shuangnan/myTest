<template>
	<div class="right-panel-container">
		<div class="event-brief">
			<div class="event-level">
				<span>{{ yjEvent.levelStr }}</span>
			</div>
			<div class="event-info-container">
				<div class="event-info-location-and-time">
					<div class="event-location">
						<span>{{ yjEvent.xianming }}线</span>
					</div>
					<!-- <div class="event-time">
						<span>{{ yjEvent.fssj.substring(0, 16) }}</span>
					</div> -->
				</div>
				<div class="event-information" :title="yjEvent.shijianBaogao">
					<span>{{
						yjEvent.shijianBaogao.length > 30
							? yjEvent.shijianBaogao.substring(0, 27) + "..."
							: yjEvent.shijianBaogao
					}}</span>
				</div>
				<div class="button-text" @click="handleTerminateEarthquake">
					<span>结束应急响应</span>
				</div>
			</div>
		</div>
		<div class="timeboard">
			<span>应急响应时长</span>
			<div>
				<span class="timestr">{{ time.hours }}</span>
				时
				<span class="timestr">{{ time.minutes }}</span>
				分
				<span class="timestr">{{ time.seconds }}</span>
				秒
			</div>
		</div>
		<div class="earthquake-effect-title">
			<span>应急方案</span>
		</div>
		<div
			@mouseover="clearPlansAutoScroll"
			@mouseout="setPlansAutoScroll"
			class="line-train-plans"
		>
			<div
				style="
					height: 100%;
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					align-content: center;
				"
			>
				<div
					style="
						height: 40px;
						width: 100%;
						display: flex;
						flex-direction: row;
						align-items: center;
						align-content: center;
						justify-content: flex-start;
					"
				>
					<div
						style="
							width: 35%;
							display: flex;
							align-content: center;
							align-items: center;
							justify-content: center;
						"
					>
						<span style="font-weight: bold; color: #4eabf8"
							>行调台/是否制订方案</span
						>
					</div>
					<div
						style="
							width: 25%;
							display: flex;
							align-content: center;
							align-items: center;
							justify-content: center;
						"
					>
						<span style="font-weight: bold; color: #4eabf8"
							>车次</span
						>
					</div>
					<div
						style="
							width: 25%;
							display: flex;
							align-content: center;
							align-items: center;
							justify-content: center;
						"
					>
						<span style="font-weight: bold; color: #4eabf8"
							>巡线范围</span
						>
					</div>
					<div
						style="
							width: 15%;
							display: flex;
							align-content: center;
							align-items: center;
							justify-content: center;
						"
					>
						<span style="font-weight: bold; color: #4eabf8"
							>是否销记</span
						>
					</div>
				</div>
				<div
					id="planTable"
					style="
						height: calc(100% - 40px);
						width: 100%;
						display: flex;
						flex-direction: column;
						align-items: center;
						align-content: center;
						justify-content: flex-start;
						overflow-y: scroll;
						z-index: 10;
					"
				>
					<div
						v-for="(ddt, index) in plans"
						:key="index"
						style="
							width: 100%;
							display: flex;
							flex-direction: row;
							align-content: center;
							align-items: center;
							justify-content: center;
							margin-bottom: 2px;
							padding-top: 10px;
							padding-bottom: 10px;
						"
						:style="{
							background: index % 2 === 0 ? '#111A30' : '#1B2C45'
						}"
					>
						<div
							v-if="ddt.PLANS.length !== 0"
							style="
								width: 35%;
								display: flex;
								flex-direction: column;
								align-items: center;
								align-content: center;
								justify-content: space-between;
							"
						>
							<div
								v-for="(train, tIndex) in ddt.PLANS"
								:key="tIndex"
								style="
									height: 60px;
									width: 100%;
									display: flex;
									align-items: center;
									align-content: center;
									justify-content: center;
								"
							>
								<span style="margin-left: 15px">{{
									ddt.DDT
								}}</span>
								<div
									:class="{
										'has-plan': ddt.PLANS.length !== 0,
										'no-plan': ddt.PLANS.length === 0
									}"
									style="margin-right: 15px"
								></div>
							</div>
						</div>
						<div
							v-else
							style="
								width: 35%;
								display: flex;
								flex-direction: column;
								align-items: center;
								align-content: center;
								justify-content: space-between;
							"
						>
							<div
								style="
									height: 60px;
									width: 100%;
									display: flex;
									align-items: center;
									align-content: center;
									justify-content: center;
								"
							>
								<span style="margin-left: 15px">{{
									ddt.DDT
								}}</span>
								<div
									:class="{
										'has-plan': ddt.PLANS.length !== 0,
										'no-plan': ddt.PLANS.length === 0
									}"
									style="margin-right: 15px"
								></div>
							</div>
						</div>
						<div
							style="
								width: 25%;
								display: flex;
								flex-direction: column;
								align-content: center;
								align-items: center;
								justify-content: center;
							"
						>
							<div
								v-for="(train, tIndex) in ddt.PLANS"
								:key="tIndex"
								style="
									height: 60px;
									width: 100%;
									display: flex;
									align-items: center;
									align-content: center;
									justify-content: center;
								"
							>
								<span>{{ train.TRAIN }}</span>
							</div>
						</div>
						<div
							style="
								width: 25%;
								display: flex;
								flex-direction: column;
								align-content: center;
								align-items: center;
								justify-content: center;
							"
						>
							<div
								v-for="(range, rIndex) in ddt.PLANS"
								:key="rIndex"
								style="
									height: 60px;
									width: 100%;
									display: flex;
									flex-direction: column;
									align-items: center;
									align-content: center;
									justify-content: center;
								"
							>
								<div
									style="
										display: flex;
										flex-direction: row;
										align-content: center;
										align-items: center;
										justify-content: space-between;
										width: 100%;
									"
								>
									<div
										class="start-marker"
										style="margin-left: 5px"
									></div>
									<span style="margin-right: 5px">{{
										range.START_STN
									}}</span>
								</div>
								<div
									style="
										display: flex;
										flex-direction: row;
										align-content: center;
										align-items: center;
										justify-content: space-between;
										width: 100%;
									"
								>
									<div
										class="end-marker"
										style="margin-left: 5px"
									></div>
									<span style="margin-right: 5px">{{
										range.END_STN
									}}</span>
								</div>
							</div>
						</div>
						<div
							style="
								width: 15%;
								display: flex;
								flex-direction: column;
								align-content: center;
								align-items: center;
								justify-content: center;
							"
						>
							<div
								v-for="(done, dIndex) in ddt.PLANS"
								:key="dIndex"
								style="
									height: 60px;
									width: 100%;
									display: flex;
									align-items: center;
									align-content: center;
									justify-content: center;
								"
							>
								<span
									:style="{
										color:
											done.STATUS === '0'
												? '#8D9BCC'
												: done.STATUS === '1'
												? '#0FFFAB'
												: '#13BFFF'
									}"
									>{{
										done.STATUS === "0"
											? "未开行"
											: done.STATUS === "1"
											? "已开行"
											: "已销记"
									}}</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div style="margin-top: 10px" class="earthquake-effect-title">
			<span>速报信息</span>
			<div class="earthquake-effect-lines-count">
				<span>{{ reports.length }}</span>
			</div>
			<el-button
				@click="handleExportReport"
				style="margin-left: 10px"
				type="text"
				>导出</el-button
			>
			<!--      <span style="font-size: 14px; margin-left: 5px; cursor:pointer;" @click="uploadReport.visible = true">-->
			<!--        <el-icon class="el-icon-plus"></el-icon>-->
			<!--        上报-->
			<!--      </span>-->
		</div>
		<div
			class="report-container"
			id="reportsContainer"
			@mouseover="disableReportAutoScroll"
			@mouseout="setReportAutoScroll"
		>
			<ReportCard
				style="cursor: pointer; border-bottom: 10px solid transparent"
				v-for="(report, index) in reports"
				:key="index"
				:content="report"
				:index="index"
			/>
		</div>
		<!--    <div class="report-ops">-->
		<!--      <el-input style="margin-top: 10px" :autosize="{-->
		<!--        minRows: 2,-->
		<!--        maxRows: 8-->
		<!--      }" type="textarea" placeholder="添加速报..." v-model="uploadReport.content"></el-input>-->
		<!--      <el-button type="primary" style="width: 100%; position: relative; bottom: 0" @click="handleUploadReport">上报速报</el-button>-->
		<!--    </div>-->
		<z-dialog
			ref="dialog1"
			title="上报速报"
			:show.sync="uploadReport.visible"
			:is-footer="false"
		>
			<div slot="body">
				<el-input
					type="textarea"
					autosize=""
					v-model="uploadReport.content"
					placeholder="输入速报内容..."
				></el-input>
				<el-button
					style="margin-top: 10px"
					type="primary"
					size="mini"
					@click="handleUploadReport"
					>确定</el-button
				>
			</div>
		</z-dialog>
		<z-dialog
			ref="dialog2"
			title="导出速报"
			:show.sync="showExportReport"
			:is-footer="false"
		>
			<div slot="body">
				<div style="width: 100%; height: 100%">
					<ExportReport></ExportReport>
				</div>
			</div>
		</z-dialog>
	</div>
</template>

<script>
	import dayjs from "dayjs";
	import ReportCard from "@/components/map/components/EarthquakeView/RightPanel/ReportCard";
	import ZDialog from "@/components/ZDialog";
	import com from "@/assets/com";
	import ExportReport from "./ExportReport";
	import earthquakeUtils from "../../../js/earthquake";
	export default {
		name: "RightPanel",
		components: { ReportCard, ZDialog, ExportReport },
		computed: {
			yjEvent() {
				console.log(
					"应急响应",
					this.$store.state.earthquake.currentEarthquakeInfo
				);
				return {
					levelStr: this.$store.state.earthquake.currentEarthquakeInfo
						.EVENT_LEVEL,
					xianming: this.$store.state.earthquake.currentEarthquakeInfo
						.LINE_NAME,
					fssj: this.$store.state.earthquake.currentEarthquakeInfo.C_TIME,
					shijianBaogao: this.$store.state.earthquake
						.currentEarthquakeInfo.CONTENT
				};
				// return this.$store.state.yjEventPush.events[0]
			},
			reports() {
				return this.$store.state.earthquake.reports;
			},
			plans() {
				console.log(
					"轨道车开行方案",
					this.$store.state.earthquake.lineTrainPlans
				);
				return this.$store.state.earthquake.lineTrainPlans.filter((p) => {
					return p.PLANS.length !== 0
				});
			}
		},
		data() {
			return {
				timer: null,
				time: {
					hours: 0,
					minutes: 0,
					seconds: 0
				},
				uploadReport: {
					visible: false,
					content: ""
				},
				reportAutoScroll: null,
				plansAutoScroll: null,
				showExportReport: false
			};
		},
		mounted() {
			this.displayElapsedTime();
			this.setReportAutoScroll();
			this.setPlansAutoScroll();
			console.log(this.plans);
		},
		methods: {
			setReportAutoScroll() {
				let reportsContainer = document.getElementById("reportsContainer");
				this.reportAutoScroll = setInterval(() => {
					if (
						reportsContainer.scrollTop +
							reportsContainer.clientHeight >=
						reportsContainer.scrollHeight
					) {
						reportsContainer.scrollTop = 0;
					} else {
						reportsContainer.scrollTo({
							top: reportsContainer.scrollTop + 2,
							behavior: "smooth"
						});
					}
				}, 100);
			},
			disableReportAutoScroll() {
				console.log("清除定时器");
				clearInterval(this.reportAutoScroll);
			},
			setPlansAutoScroll() {
				console.log("设置定时器");
				let planTableContainer = document.getElementById("planTable");
				if (this.plansAutoScroll) {
					clearInterval(this.plansAutoScroll);
				}
				this.plansAutoScroll = setInterval(() => {
					if (
						planTableContainer.scrollTop +
							planTableContainer.clientHeight >=
						planTableContainer.scrollHeight
					) {
						planTableContainer.scrollTop = 0;
					} else {
						planTableContainer.scrollTo({
							top: planTableContainer.scrollTop + 2,
							behavior: "smooth"
						});
					}
				}, 100);
			},
			clearPlansAutoScroll() {
				console.log("清除定时器");
				clearInterval(this.plansAutoScroll);
			},
			displayElapsedTime() {
				this.timer = setInterval(() => {
					this.time = JSON.parse(JSON.stringify(this.elapsedTime()));
				}, 1000);
			},
			elapsedTime() {
				let startTime = dayjs(
					this.yjEvent.fssj,
					"YYYY-MM-DD HH:mm:ss"
				).unix();
				let currentTime = dayjs().unix();
				let duration = dayjs.duration(currentTime - startTime, "seconds");
				return {
					hours:
						parseInt(duration.format("H")) +
						parseInt(duration.format("DD") * 24),
					minutes: duration.format("mm"),
					seconds: duration.format("ss")
				};
			},
			handleExportReport() {
				console.log("导出速报");
				const loading = this.$loading({
					lock: true,
					text: "正在获取数据...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)"
				});
				com.getData(
					{
						c: "eqeh_zxy2058",
						s: [
							{
								E_ID: this.$store.state.earthquake.currentEarthquake
									.EQ_ID,
								DDT: "all",
								TRAIN: "all",
								LINE_NAME: "all"
							}
						],
						url: "https://10.192.126.203/GeneralProServlet"
					},
					res => {
						com.getData(
							{
								c: "eqeh_zxy2068",
								s: [
									{
										E_ID: this.$store.state.earthquake
											.currentEarthquake.EQ_ID
									}
								],
								url: "https://10.192.126.203/GeneralProServlet"
							},
							reports => {
								this.$store.commit(
									"earthquake/updateDetailLineTrainPlans",
									res.data["1"]
								);
								this.$store.commit(
									"earthquake/updateEarthquakeReports",
									reports.data["1"]
								);
								this.showExportReport = true;
								loading.close();
							}
						);
					}
				);
			},
			handleUploadReport() {
				com.getData(
					{
						c: "eqeh_zxy9018",
						s: [
							{
								PKID: "",
								E_ID: this.$store.state.earthquake.currentEarthquake
									.EQ_ID,
								EM_ID: this.$store.state.params.UserID,
								EM_NAME: this.$store.state.params.UserName,
								UNIT_ID: this.$store.state.params.Oid,
								UNIT_NAME: this.$store.state.params.Oname,
								DEP_ID: this.$store.state.params.DepId,
								DEP_NAME: this.$store.state.params.DepName,
								CONTENT: this.uploadReport.content,
								DELETE_FLAG: "0"
							}
						]
					},
					res => {
						if (res) {
							com.getData(
								{
									c: "eqeh_zxy2056",
									s: [
										{
											E_ID: this.$store.state.earthquake
												.currentEarthquake.EQ_ID
										}
									]
								},
								r => {
									this.$store.commit(
										"earthquake/updateReports",
										r.data["1"]
									);
									this.$message.success("上报速报成功！");
									this.uploadReport.visible = false;
									this.uploadReport.content = "";
								}
							);
						} else {
							this.$message.error("上报速报失败！");
						}
					}
				);
			},
			handleTerminateEarthquake() {
				this.$confirm("确认结束应急响应吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						earthquakeUtils.huiFuEarthquake(
							this.$store.state.earthquake.currentEarthquake,
							[]
						);
						this.$store.commit(
							"earthquake/updateHidePanelOverRide",
							true
						);
					})
					.catch();
			}
		}
	};
</script>

<style scoped>
	.right-panel-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: flex-start;
		padding-left: 10px;
		padding-right: 10px;
	}

	.event-brief {
		background: url("../imgs/EventBriefBackground.png") no-repeat;
		height: 129.5px;
		width: 378px;
		background-size: 100% 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: flex-start;
	}

	.timeboard {
		height: 70px;
		width: 100%;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: space-around;
		background-image: linear-gradient(to right, #24396a, #18233e);
		margin-bottom: 10px;
	}

	.timeboard > span {
		font-weight: bold;
		font-size: 24px;
	}

	.timestr {
		font-family: LCD;
		font-size: 40px;
		font-style: italic;
		text-shadow: 0 0 0.1em, 0 0 0.1em;
	}

	.event-level {
		width: 100px;
		height: 100%;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		margin-left: 22px;
	}

	.event-level > span {
		font-size: 22px;
		font-weight: bold;
		text-shadow: 0 0 0.1em, 0 0 0.3em;
		color: #ffc86d;
	}

	.event-info-container {
		width: calc(100% - 22px - 100px);
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
		justify-content: flex-start;
	}

	.event-info-location-and-time {
		margin-top: 24px;
		height: 30px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: center;
		justify-content: space-between;
	}

	.event-location > span {
		font-size: 18px;
		font-weight: bold;
		text-shadow: 0 0 0.1em, 0 0 0.3em;
		color: #ffc86d;
	}

	.event-time > span {
		font-size: 14px;
		font-weight: bold;
		text-shadow: 0 0 0.1em, 0 0 0.3em;
		color: #ffc86d;
	}

	.event-information {
		height: calc(100% - 24px - 30px - 22px);
		width: 100%;
	}

	.event-information > span {
		font-weight: bold;
	}

	.button-text {
		position: absolute;
		right: 43px;
		top: 80px;
		cursor: pointer;
	}

	.button-text > span {
		font-weight: bold;
		font-size: 15px;
	}

	.button-text > span:hover {
		text-shadow: 0 0 0.1em, 0 0 0.1em;
	}

	.earthquake-effect-title {
		height: 26px;
		width: 381px;
		background: url("../imgs/SplitLine2.png") no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: center;
	}

	.earthquake-effect-title > span {
		text-shadow: 0 0 0.05em, 0 0 0.1em;
		font-weight: bold;
		font-size: 16px;
	}

	.earthquake-effect-lines-count {
		width: 26px;
		height: 26px;
		border-radius: 13px;
		background: crimson;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		margin-left: 15px;
	}

	.earthquake-effect-lines-count > span {
		font-weight: bold;
		font-size: 20px;
		text-shadow: 0 0 0.05em, 0 0 0.1em;
	}

	.report-container {
		width: 100%;
		height: calc(
			100% - 24px - 30px - 22px - 10px - 26px - 140px - 50px - 300px
		);
		margin-top: 10px;
		overflow-y: scroll;
	}

	.report-ops {
		width: 100%;
		height: 120px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.line-train-plans {
		width: 100%;
		height: 300px;
	}

	.has-plan {
		background: url("../imgs/hasplan.png") no-repeat;
		width: 17px;
		height: 17px;
		background-size: 100% 100%;
	}

	.no-plan {
		background: url("../imgs/noplan.png") no-repeat;
		width: 17px;
		height: 17px;
		background-size: 100% 100%;
	}

	::-webkit-scrollbar {
		width: 0 !important;
	}

	.start-marker {
		background: url("../imgs/startstnmarker.png") no-repeat;
		height: 20px;
		width: 20px;
		background-size: 100% 100%;
	}

	.end-marker {
		background: url("../imgs/endstationmarker.png") no-repeat;
		height: 20px;
		width: 20px;
		background-size: 100% 100%;
	}
</style>
