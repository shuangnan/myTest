<template>
	<div class="export-report-dialog-container">
		<div
			class="report-select-container"
			:style="{
				height: isPage ? '900px' : '600px'
			}"
		>
			<div style="height: 50px">
				<h3 style="margin-left: 10px">速报列表</h3>
			</div>
			<div style="height: calc(100% - 10% - 50px)">
				<el-tree
					ref="reportTree"
					v-if="allReports.length !== 0"
					:props="reportTreeProps"
					:data="allReports"
					node-key="REDISKEY"
					show-checkbox
					@node-click="handleReportClick"
				>
					<span slot-scope="{ node, data }"
						>{{ node.label === "新速报*" ? "" : "速报: "
						}}{{ node.label }}</span
					>
				</el-tree>
				<span v-else>暂无速报</span>
			</div>
			<div
				style="height: 10%; display: flex; align-content: center; align-items: center; justify-content: center"
			>
				<el-button
					type="primary"
					size="mini"
					@click="handleCreateReport"
					>新建</el-button
				>
				<el-button
					type="primary"
					size="mini"
					@click="handleReportExport"
					>下载已选</el-button
				>
				<el-button type="success" size="mini" @click="handleSaveReport"
					>保存</el-button
				>
			</div>
		</div>
		<div class="report-body">
			<div
				class="report-content"
				:style="{
					height: isPage ? '900px' : '600px'
				}"
			>
				<UE
					style="width: 1620px; height: 900px; overflow-y: scroll"
					:style="{
						width: isPage ? '1620px' : '1262px',
						height: isPage ? '900px' : '700px',
						overflowY: 'scroll'
					}"
					:editor-id="'reportEditor'"
					ref="reportUeEditor"
					:editortext="currentReport"
					:config="{
						initialFrameWidth: isPage ? 1600 : 1262,
						initialFrameHeight: isPage ? 900 : 550
					}"
				/>
<!--				 <vue-tinymce v-model="currentReport" :setting="{height: 1400}"></vue-tinymce>-->
			</div>
		</div>
	</div>
</template>

<script>
	import dayjs from "dayjs";
	import UE from "@/components/UE";
	import com from "@/assets/com";
	import JSZip from "jszip";
	// import html2docx from 'html-docx-js'

	export default {
		data() {
			return {
				reportTreeProps: {
					label: "C_TIME",
					children: ""
				},
				currentReport: "",
				currentReportId: 0,
				newReportContent: "",
				currentReportPkid: ""
			};
		},
		components: {
			UE
		},
		computed: {
			isPage() {
				// console.log(this.$route)
				return this.$route.path.includes("/ExportReport");
			},
			allReports() {
				// console.log(this.isPage)
				return this.$store.state.earthquake.earthquakeReports;
			},
			/**
			 * 当前时间
			 * @returns {String}
			 */
			currentTime() {
				return dayjs().format("M月DD日 HH时mm分ss秒");
			},
			/**
			 * 当前地震信息
			 * @returns {Object}
			 */
			currentEarthquake() {
				return this.$store.state.earthquake.currentEarthquakeInfo;
			},
			/**
			 * 地震发生时间
			 * @returns {String}
			 */
			earthquakeTime() {
				return dayjs(
					this.currentEarthquake.C_TIME,
					"YYYY-MM-DD HH:mm:ss"
				).format("YYYY年M月D日HH:mm:ss");
			},
			/**
			 * 地震震级
			 * @returns {String}
			 */
			earthquakeLevel() {
				return this.$store.state.earthquake.currentEarthquake.EQ_LEVEL;
			},
			/**
			 * 地震影响线路
			 * @returns {Array}
			 */
			earthquakeEffectedLines() {
				return this.$store.state.earthquake.currentEarthquakeEffectedLines;
			},
			/**
			 * 封锁区间列车统计
			 * @returns {Object}
			 */
			fsTrainsCount() {
				let fsBrief = this.$store.state.earthquake.currentEarthquakeEffectedTrainsBrief.find(
					b => {
						return b.ATTRIBUTE === "1";
					}
				);
				if (fsBrief === undefined) {
					return {
						ATTRIBUTE: "1",
						DCOUNT: "0",
						PCOUNT: "0",
						HCOUNT: "0"
					};
				} else {
					return fsBrief;
				}
			},
			/**
			 * 限速区间列车统计
			 * @returns {Object}
			 */
			xsTrainsCount() {
				let xsBrief = this.$store.state.earthquake.currentEarthquakeEffectedTrainsBrief.find(
					b => {
						return b.ATTRIBUTE === "0";
					}
				);
				if (xsBrief === undefined) {
					return {
						ATTRIBUTE: "0",
						DCOUNT: "0",
						PCOUNT: "0",
						HCOUNT: "0"
					};
				} else {
					return xsBrief;
				}
			},
			/**
			 * 影响列车
			 * @returns {Array}
			 */
			effectedTrains() {
				return this.$store.state.earthquake.currentEarthquakeEffectedTrains;
			},
			/**
			 * 将行列车统计
			 * @returns {Array}
			 */
			incomingTrainsCount() {
				let incomingBrief = this.$store.state.earthquake.currentEarthquakeEffectedTrainsBrief.find(
					b => {
						return b.ATTRIBUTE === "-1";
					}
				);
				if (incomingBrief === undefined) {
					return {
						ATTRIBUTE: "-1",
						DCOUNT: "0",
						PCOUNT: "0",
						HCOUNT: "0"
					};
				} else {
					return incomingBrief;
				}
			},
			/**
			 * 速报文本首行缩进
			 * @returns {String}
			 */
			firstLineIndent() {
				return `<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
			},
			/**
			 * 巡线计划信息
			 * @returns {Array}
			 */
			availablePlans() {
				let allPlansStatus = this.$store.state.earthquake.lineTrainPlans;
				return allPlansStatus.filter(ddt => {
					return ddt.PLANS.length !== 0;
				});
			},
			/**
			 * 影响区间列表
			 * @returns {Array}
			 */
			effectedSectionsTable() {
				function unlink(array, key) {
					if (array.length === 0) {
						return [];
					}
					let result = [array[0]];
					for (let i = 1; i < array.length; i++) {
						let item = array[i];
						let repeat = false;
						for (let j = 0; j < result.length; j++) {
							if (item[key] == result[j][key]) {
								repeat = true;
								break;
							}
						}
						if (!repeat) {
							result.push(item);
						}
					}
					return result;
				}

				function ifTrainRelatedInStation(
					type,
					station,
					nextStation,
					train
				) {
					if (type === "incoming") {
						// 传当前站和上一站
						return (
							(train.NEXTNAME.includes(station.STATION) ||
								station.STATION.includes(train.NEXTNAME)) &&
							(train.CURRNAME.includes(nextStation.STATION) ||
								nextStation.STATION.includes(train.CURRNAME))
						);
					} else if (type === "deped") {
						// 传当前站和下一站
						return (
							((train.CURRNAME.includes(station.STATION) ||
								station.STATION.includes(train.CURRNAME)) &&
								(train.NEXTNAME.includes(nextStation.STATION) ||
									nextStation.STATION.includes(
										train.NEXTNAME
									))) ||
							((train.NEXTNAME.includes(station.STATION) ||
								station.STATION.includes(train.NEXTNAME)) &&
								(train.CURRNAME.includes(nextStation.STATION) ||
									nextStation.STATION.includes(train.CURRNAME)))
						);
					}
				}

				let rawData = this.$store.state.earthquake
					.currentEarthquakeEffectedSections;
				let allEffectedTrains = this.$store.state.earthquake
					.currentEarthquakeEffectedTrains;
				let allEffectedStations = this.$store.state.earthquake
					.currentEarthquakeStations;
				let allSubSections = this.$store.state.earthquake
					.currentEarthquakeSubSections;

				function ifTrainInSection(
					train,
					sectionStart,
					sectionEnd,
					sectionStartPoint,
					sectionEndPoint
				) {
					if (
						(parseFloat(train.O_KM) >= parseFloat(sectionStart) &&
							parseFloat(train.E_KM) <= parseFloat(sectionEnd)) ||
						(parseFloat(train.E_KM) >= parseFloat(sectionStart) &&
							parseFloat(train.O_KM) <= parseFloat(sectionEnd))
					) {
						return true;
					} else {
						return false;
					}
				}

				rawData.map(section => {
					let sectionStart = section.O_KM;
					let sectionEnd = section.E_KM;
					let sectionPointStart = section.O_STATION;
					let sectionPointEnd = section.E_STATION;
					// 获取区间中包含的站和车次信息
					// console.log(section, allEffectedStations)
					let allRelatedStations = allEffectedStations.filter(station => {
						return (
							station.LINE_NAME === section.L_NAME &&
							((sectionStart <= parseFloat(station.O_KM) &&
								parseFloat(station.O_KM) <= sectionEnd) ||
								(sectionStart <= parseFloat(station.E_KM) &&
									parseFloat(station.E_KM) <= sectionEnd))
						);
					});
					// console.log(allRelatedStations)
					// console.log(section.L_NAME, allRelatedStations)
					allRelatedStations = unlink(allRelatedStations, "STATION");
					let allRelatedTrains = allEffectedTrains.filter(train => {
						return (
							ifTrainInSection(
								train,
								sectionStart,
								sectionEnd,
								sectionPointStart,
								sectionPointEnd
							) && train.L_NAME === section.L_NAME
						);
					});
					let allRelatedSections = allSubSections.filter(s => {
						return (
							s.LINE_NAME === section.L_NAME &&
							parseFloat(s.S_MILE) >= sectionStart &&
							parseFloat(s.E_MILE) <= sectionEnd
						);
					});
					// console.log('ALL Related stations', allRelatedStations)
					section.STATIONS = allRelatedStations.sort(
						(stationA, stationB) => {
							return (
								parseFloat(stationA.CENTER_MILE) -
								parseFloat(stationB.CENTER_MILE)
							);
						}
					);
					// console.log(section.STATIONS)
					section.STATIONS.map((station, index, arr) => {
						let targetSection = allRelatedSections.find(section => {
							// console.log('SECTION STATION', station, section)
							return (
								parseFloat(station.O_KM) >=
									parseFloat(section.S_MILE) &&
								parseFloat(section.E_MILE) >=
									parseFloat(station.E_KM)
							);
						});
						if (targetSection !== undefined) {
							station.ENVIRONMENT = targetSection.ENVIRONMENT;
						} else {
							station.ENVIRONMENT = "";
						}
						let incoming = JSON.parse(JSON.stringify([]));
						let deped = JSON.parse(JSON.stringify([]));
						if (index < arr.length - 1) {
							deped = allRelatedTrains.filter(train => {
								return ifTrainRelatedInStation(
									"deped",
									station,
									arr[index + 1],
									train
								);
							});
							station.DEPED = deped;
							station.INCOMING = [];
						} else {
							station.DEPED = [];
							station.INCOMING = [];
						}
					});
					section.TRAINS = allRelatedTrains.sort((trainA, trainB) => {
						return parseFloat(trainA.O_KM) - parseFloat(trainB.O_KM);
					});
					section.SECTIONS = allRelatedSections.sort(
						(sectionA, sectionB) => {
							return (
								parseFloat(sectionA.S_MILE) -
								parseFloat(sectionB.E_MILE)
							);
						}
					);
				});
				// console.log(rawData)
				return rawData;
			},
			/**
			 * 巡线车信息
			 * @returns {Array}
			 */
			detailLineTrains() {
				return this.$store.state.earthquake.detailLineTrainPlan;
			},
			/**
			 * 速报统计信息
			 * @returns {Object}
			 */
			reportsBrief() {
				return this.$store.state.earthquake.reportEffectedBrief;
			},
			/**
			 * 速报信息
			 * @returns {Array}
			 */
			reports() {
				return this.$store.state.earthquake.reports;
			}
		},
		mounted() {
			this.$nextTick(() => {
				if (this.allReports.length !== 0) {
					let firstReport = this.allReports[0];
					this.handleReportClick(firstReport);
				}
			});
		},
		watch: {
			allReports: {
				deep: true,
				handler: function(newVal) {
					if (newVal.length !== 0) {
						let firstReport = newVal[0];
						this.handleReportClick(firstReport);
					}
				}
			}
		},
		methods: {
			hasUnSavedReport() {
				return JSON.stringify(this.allReports).includes("新速报");
			},
			handleReportExport() {
				let currentCheckedReports = this.$refs[
					"reportTree"
				].getCheckedNodes();
				// console.log('已选择速报', currentCheckedReports)
				let getReportContentPromise = [];
				currentCheckedReports.map(report => {
					getReportContentPromise.push(
						new Promise((resolve, reject) => {
							if (report.REDISKEY.includes("new")) {
								resolve(this.newReportContent);
							} else {
								com.getData(
									{
										c: "eqeh_zxy9023",
										s: {
											REDISKEY: report.REDISKEY
										},
										url:
											"https://10.192.126.203/GeneralProServlet"
									},
									res => {
										if (res.success) {
											resolve(res.data);
										} else {
											reject(res);
										}
									}
								);
							}
						})
					);
				});
				Promise.all(getReportContentPromise).then(allReports => {
					// 导出速报
					// console.log(allReports, this.currentEarthquake)
					let zip = new JSZip();
					allReports.map((report, index) => {
						zip.file(
							`${this.currentEarthquake.E_PLACE}_${currentCheckedReports[index].C_TIME}_应急速报.html`,
							report
						);
						// let rawHtml = `<!DOCTYPE html><html lang="en"><body>${report}</body></html>`
						// let docBlob = html2docx.asBlob(rawHtml)
						// console.log('DOC', docBlob)
						// zip.file(`${this.currentEarthquake.E_PLACE}_${currentCheckedReports[index].C_TIME}_应急速报.docx`, html2docx.asBlob(report), {binary: true})
					});
					zip.generateAsync({ type: "blob" }).then(content => {
						let downloadATag = document.createElement("a");
						downloadATag.download = `${this.currentEarthquake.E_PLACE}应急速报.zip`;
						downloadATag.style.display = "none";
						downloadATag.href = URL.createObjectURL(content);
						document.body.appendChild(downloadATag);
						downloadATag.click();
						document.body.removeChild(downloadATag);
					});
				});
			},
			handleCheckedReportChange() {},
			/**
			 * 保存速报内容
			 */
			handleSaveReport() {
				let content = window.UE.getEditor("reportEditor").getContent();
				console.log(com.securityStr(content, false));
				console.log(com.securityStr(com.securityStr(content, false), true));
				if (this.currentReportId === "") {
					// 新增
					com.getDataP123(
						{
							c: "eqeh_zxy9022",
							s: {
								E_ID: this.currentEarthquake.E_ID,
								CONTENT: content,
								PKID: ""
							},
							url: "https://10.192.126.203/GeneralProServlet"
						},
						r => {
							if (r) {
								this.$message.success("速报保存成功");
								this.getReports();
							} else {
								this.$message.error("速报保存失败" + r);
							}
						}
					);
				} else {
					// 编辑
					com.getDataP123(
						{
							c: "eqeh_zxy9022",
							s: {
								E_ID: this.currentEarthquake.E_ID,
								CONTENT: content,
								PKID: this.currentReportPkid
							},
							url: "https://10.192.126.203/GeneralProServlet"
						},
						r => {
							if (r) {
								this.$message.success("速报编辑成功");
								this.getReports();
							} else {
								this.$message.error("速报保存失败" + r);
							}
						}
					);
				}
			},
			/**
			 * 新建速报
			 */
			handleCreateReport() {
				const loading = this.$loading({
					lock: true,
					text: "正在加载数据...",
					spinner: "el-icon-loading",
					background: "rgba(0,0,0,0.7)",
					customClass: "loading"
				});
				console.log(
					"INFO",
					this.$store.state.earthquake.currentEarthquakeInfo
				);
				com.getData(
					{
						c: "eqeh_zxy9010",
						s: [this.currentEarthquake.E_ID],
						w: ["train"],
						url: "https://10.192.126.203/GeneralProServlet"
					},
					res => {
						com.getData(
							{
								c: "eqeh_zxy9024",
								s: [
									// {
									// 	MES_ID: this.$store.state.earthquake
									// 		.currentEarthquakeInfo.MES_ID
									// }
									{
										MES_ID: "15723"
									}
								],
								url: "https://10.192.126.203/GeneralProServlet"
							},
							contacts => {
								console.log("CONTACTS", contacts.data.yjqdVoList);
								this.$store.commit(
									"earthquake/updateEmergencyContacts",
									contacts.data.yjqdVoList
								);
								com.getData(
									{
										c: "eqeh_zxy9025",
										s: this.$store.state.earthquake
											.currentEarthquakeEffectedSections,
										url:
											"https://10.192.126.203/GeneralProServlet"
									},
									diffs => {
										try {
											console.log("DIFF", diffs.data);
										this.$store.commit(
											"earthquake/updateEffectedTrainsDiff",
											diffs.data
										);
										this.$store.commit(
											"earthquake/updateTrainInfo",
											res.data
										);
										let newReport = this.getContent();
										this.$refs["reportUeEditor"].setContent(
											newReport
										);
										this.currentReportId = "";
										this.newReportContent = newReport;
										this.currentReport = newReport;
										this.allReports.unshift({
											C_TIME: "新速报*",
											REDISKEY: `new${new Date()
												.getTime()
												.toString()}`
										});
										loading.close();
										} catch (e) {
											this.$message.warning('网路连接超时，请稍后再试')
											loading.close()
										}
									}
								);
							}
						);
					}
				);
			},
			/**
			 * 点击历史速报查看内容
			 * @param node
			 */
			handleReportClick(node) {
				console.log("显示速报", node);
				if (node.REDISKEY.includes("new")) {
					this.$refs["reportUeEditor"].setContent(this.newReportContent);
				} else {
					this.currentReportId = node.REDISKEY;
					this.currentReportPkid = node.PKID;
					console.log(node);
					com.getData(
						{
							c: "eqeh_zxy9023",
							s: {
								REDISKEY: node.REDISKEY
							},
							url: "https://10.192.126.203/GeneralProServlet"
						},
						r => {
							if (r.success) {
								let content = r.data;
								console.log(content);
								this.currentReport = content;
								this.$refs["reportUeEditor"].setContent(content);
							}
						}
					);
				}
				// this.currentReport = node.CONTENT
				// this.currentReportId = node.ID
				// setTimeout(() => {
				//   this.$refs['reportUeEditor'].setContent(node.CONTENT)
				// }, 100)
				// console.log(editor)
				// this.$nextTick(() => {
				//   setTimeout(() => {
				//     let editor = window.UE.getEditor('reportEditor')
				//     editor.setContent(node.CONTENT)
				//   }, 500)
				// })
			},
			/**
			 * 获取历史速报
			 * @returns {Promise}
			 */
			getReports() {
				return new Promise((resolve, reject) => {
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
							// this.$store.commit('earthquake/updateDetailLineTrainPlans', res.data['1'])
							this.$store.commit(
								"earthquake/updateEarthquakeReports",
								reports.data["1"]
							);
							resolve();
							// this.showExportReport = true
							// loading.close()
						}
					);
				});
			},
			/**
			 * 获取速报内容
			 * @returns {String}
			 */
			getContent() {
				return (
					this.getTitle() +
					this.getParagraph1() +
					this.getParagraphNew1() +
					this.getParagraph2() +
					this.getParagraphNew2() +
					this.getParagraph3() +
					this.getParagraphNew3() +
					this.getParagraph4() +
					this.getParagraphNew4() +
					this.getParagraph9()
				);
			},
			/**
			 * 获取应急抢险通讯录
			 */
			getParagraph9() {
				let title = `<p style="font-size: 20px;">九、应急抢险通讯录</p>`;
				let tableContent = [];
				this.$store.state.earthquake.emergencyContacts.map(c => {
					tableContent.push(`
											<tr align="center">
												<td>${c.unit || ''}</td>
												<td>${c.qdrXm || ''}</td>
												<td>${c.qdrZw || ''}</td>
												<td>${c.phone || ''}</td>
												<td>${c.signTime || ''}</td>
												<td>${c.levels || ''}</td>
											</tr>
										`);
				});
				let table = `
										<table align="center" border="1" cellpadding="2" cellspacing="0">
										<caption>
											<span style="font-size: 20px; font-weight: bold">应急抢险通讯录</span>
										</caption>
										<tr>
											<th>单位</th>
											<th>姓名</th>
											<th>职务</th>
											<th>手机号</th>
											<th>签到时间</th>
											<th>事件等级</th>
										</tr>
										${tableContent.join("")}
									</table>
									`;
				let content = table;
				return title + content;
			},
			/**
			 * 获取概况段
			 * @returns {string}
			 */
			getParagraph1() {
				let title = `<p style="font-size: 20px;">一、概况</p>`;
				let content = `<p>${this.firstLineIndent}${this.earthquakeTime}在${this.currentEarthquake.E_PLACE}发生${this.earthquakeLevel}级地震。</p>`;
				return title + content;
			},
			/**
			 * 获取影响区段/列车段
			 * @returns {string}
			 */
			getParagraph2() {
				let title = `<p style="font-size: 20px;">三、影响区段及列车</p>`;

				// 影响线别
				let lineEffect =
					this.earthquakeEffectedLines.length !== 0
						? `总共影响${
								this.earthquakeEffectedLines.length
						  }条线，分别是${this.earthquakeEffectedLines
								.map(line => {
									return line.LINE_NAME;
								})
								.join("、")}。`
						: "";

				// 影响列车统计
				// 区段内全部列车
				let allEffectedTrainsCount = this.effectedTrains.length;
				let allEffectedTrainsDCount = this.effectedTrains.filter(train => {
					return train.TRAIN_TYPE === "D";
				}).length;
				let allEffectedTrainsPCount = this.effectedTrains.filter(train => {
					return train.TRAIN_TYPE === "P";
				}).length;
				let allEffectedTrainsHCount = this.effectedTrains.filter(train => {
					return train.TRAIN_TYPE === "H";
				}).length;
				let allEffectedTrainsByTrainTypeText =
					[
						allEffectedTrainsDCount !== 0
							? `动车${allEffectedTrainsDCount}列`
							: "",
						allEffectedTrainsPCount !== 0
							? `普车${allEffectedTrainsPCount}列`
							: "",
						allEffectedTrainsHCount !== 0
							? `货车${allEffectedTrainsHCount}列`
							: ""
					]
						.filter(t => {
							return t !== "";
						})
						.join("，") + "。";
				let allEffectedTrainsText =
					allEffectedTrainsCount !== 0
						? `区段内影响列车${allEffectedTrainsCount}列，其中${allEffectedTrainsByTrainTypeText}`
						: "";

				// 封锁区段列车
				let allFsTrainsCount =
					parseInt(this.fsTrainsCount.DCOUNT) +
					parseInt(this.fsTrainsCount.PCOUNT) +
					parseInt(this.fsTrainsCount.HCOUNT);
				let allFsTrainsByTrainTypeText =
					[
						this.fsTrainsCount.DCOUNT !== "0"
							? `动车${this.fsTrainsCount.DCOUNT}列`
							: "",
						this.fsTrainsCount.PCOUNT !== "0"
							? `普车${this.fsTrainsCount.PCOUNT}列`
							: "",
						this.fsTrainsCount.HCOUNT !== "0"
							? `货车${this.fsTrainsCount.HCOUNT}列`
							: ""
					]
						.filter(t => {
							return t !== "";
						})
						.join("，") + "。";
				let allFsTrainsText =
					allFsTrainsCount !== 0
						? `封锁区段影响列车${allFsTrainsCount}列，其中${allFsTrainsByTrainTypeText}`
						: "";

				// 限速区段列车
				let allXsTrainsCount =
					parseInt(this.xsTrainsCount.DCOUNT) +
					parseInt(this.xsTrainsCount.PCOUNT) +
					parseInt(this.xsTrainsCount.HCOUNT);
				let allXsTrainsByTrainTypeText =
					[
						this.xsTrainsCount.DCOUNT !== "0"
							? `动车${this.xsTrainsCount.DCOUNT}列`
							: "",
						this.xsTrainsCount.PCOUNT !== "0"
							? `普车${this.xsTrainsCount.PCOUNT}列`
							: "",
						this.xsTrainsCount.HCOUNT !== "0"
							? `货车${this.xsTrainsCount.HCOUNT}列`
							: ""
					]
						.filter(t => {
							return t !== "";
						})
						.join("，") + "。";
				let allXsTrainsText =
					allXsTrainsCount !== 0
						? `限速区段影响列车${allXsTrainsCount}列，其中${allXsTrainsByTrainTypeText}`
						: "";

				// 将行列车
				let allIncomingTrainsCount =
					parseInt(this.incomingTrainsCount.DCOUNT) +
					parseInt(this.incomingTrainsCount.PCOUNT) +
					parseInt(this.incomingTrainsCount.HCOUNT);
				let allIncomingTrainsByTrainTypeText =
					[
						this.incomingTrainsCount.DCOUNT !== "0"
							? `动车${this.incomingTrainsCount.DCOUNT}列`
							: "",
						this.incomingTrainsCount.PCOUNT !== "0"
							? `普车${this.incomingTrainsCount.PCOUNT}列`
							: "",
						this.incomingTrainsCount.HCOUNT !== "0"
							? `货车${this.incomingTrainsCount.HCOUNT}列`
							: ""
					]
						.filter(t => {
							return t !== "";
						})
						.join("，") + "。";
				let allIncomingTrainsText =
					allIncomingTrainsCount !== 0
						? `4小时内将行列车${allIncomingTrainsCount}列，其中${allIncomingTrainsByTrainTypeText}`
						: "";

				let trainTableRows = [];
				this.earthquakeEffectedLines.map((line, index, arr) => {
					let relatedRows = this.effectedSectionsTable.filter(section => {
						return section.L_NAME === line.LINE_NAME;
					});

					let tableRowSpan = relatedRows.length;

					// 相同线别的第一个区间需要合并单元格
					relatedRows.map((section, sectionIndex) => {
						let trains = section.TRAINS;
						let sectionRowSpan = trains.length;
						trains.map((train, trainIndex) => {
							train.DIRECTION = "双";
							trainTableRows.push(`
									              <tr align="center">
																	<td>${section.L_NAME}</td>
																	<td>${section.DIRECTION}</td>
																	<td>${section.O_STATION}-${section.E_STATION}</td>
																	<td><span style="color: #438EC5">${
																		section.DCOUNT
																	}</span>/<span style="color: #50BE8B">${
								section.PCOUNT
							}</span>/<span style="color: #BA7D3A">${
								section.HCOUNT
							}</span></td>
									                <td>${train.TRAIN}</td>
																	<td style="color: ${train.ATTRIBUTE === "1" ? "red" : "black"}">${
								train.ATTRIBUTE === "0" ? "限速" : "封锁"
							}</td>
									                <td>${(train.START_DATE || "").substring(11, 16)}</td>
									                <td>${train.START_STN}</td>
									                <td>${(train.END_DATE || "").substring(11, 16)}</td>
									                <td>${train.END_STN}</td>
									                <td>${train.CURRNAME}</td>
									                <td>
									                  ${
															train.EDTIME == 0
																? `<p style="text-align: center">正点</p>`
																: `
									                    <p style="color: red; text-align: center">晚点${train.EDTIME}分钟</p>
									                  `
														}
									                </td>
									              </tr>
									            `);
						});
					});
				});

				let tableRowsN = [];
				this.$store.state.earthquake.currentEarthquakeEffectedSections.map(
					(section, index) => {
						let trainsCount = section.TRAINLIST.length;
						section.TRAINLIST.map((train, tIndex) => {
							tableRowsN.push(`<tr align="center">
													${tIndex === 0 ? `<td rowspan="${trainsCount}">${section.L_NAME}</td>` : ""}
													${tIndex === 0 ? `<td rowspan="${trainsCount}">${section.DIRECTION}</td>` : ""}
													${
														tIndex === 0
															? `<td rowspan="${trainsCount}">${section.O_STATION} - ${section.E_STATION}</td>`
															: ""
													}
													${tIndex === 0 ? `
													<td rowspan="${trainsCount}">
														<span style="color: #438EC5">${section.DCOUNT}</span>
														/
														<span style="color: #50BE8B">${section.PCOUNT}</span>
														/
														<span style="color: #BA7D3A">${section.HCOUNT}</span>
													</td>` : ""}
													${
														tIndex === 0
															? `<td style="color: ${
																	section.ATTRIBUTE ===
																	"1"
																		? "red"
																		: "black"
															  }" rowspan="${trainsCount}">${
																	section.ATTRIBUTE ===
																	"0"
																		? "限速"
																		: "封锁"
															  }</td>`
															: ""
													}
													<td>${train.TRAIN}</td>
													<td>${(train.START_DATE || '').substring(11, 16)}</td>
													<td>${train.START_STN}</td>
													<td>${(train.END_DATE || '').substring(11, 16)}</td>
													<td>${train.END_STN}</td>
													<td>${train.LOCAL_FLAG === '0' ? train.CURRNAME : `${train.CURRNAME} - ${train.NEXTNAME}`}</td>
													<td>
														<span style="color: ${train.EDTIME !== '0' ? 'red' : 'black'}">
															${train.EDTIME !== '0' ? `晚点${train.EDTIME}分钟` : '正点'}
														</span>
													</td>
												</tr>`);
						});
					}
				);

				// 影响列车统计表
				let trainTable = `
									      <table align="center" border="1" cellpadding="2" cellspacing="0">
									        <caption>
									          <span style="font-size: 20px; font-weight: bold">封锁限速区域影响列车统计表</span>
									        </caption>
									        <tr>
									          <th>线别</th>
									          <th>行别</th>
									          <th>区间</th>
									          <th>影响列车（列）</th>
														<th>影响类型</th>
									          <th>车次</th>
														
									          <th>发点</th>
									          <th>发站</th>
									          <th>到点</th>
									          <th>到站</th>
									          <th>当前位置</th>
									          <th>正晚点</th>
									        </tr>
									        ${tableRowsN.join("").trim()}
									      </table>
									      `;
				console.log(trainTable)
				let content = `<p>${this.firstLineIndent +
					lineEffect +
					allEffectedTrainsText +
					allFsTrainsText +
					allXsTrainsText +
					allIncomingTrainsText}</p>`;
				return title + content + trainTable;
			},
			getParagraph2N() {},
			/**
			 * 获取巡线方案文本段
			 * @returns {string}
			 */
			getParagraph3() {
				let title = `<p style="font-size: 20px;">五、巡查车方案</p>`;
				let plans = this.detailLineTrains;
				let checkTrainsCount = this.$store.state.earthquake.checkTrainsCount
				console.log("可用巡线方案", plans);
				let plansCount = 0;
				// plans.map((ddt) => {
				//   plansCount = plansCount + ddt.PLANS.length
				// })
				let contentText = `<p>${this.firstLineIndent}总共指定巡线方案${plans.length}个，总共开行轨道车${checkTrainsCount.NUM_RAIL_TOTAL}台，出动人数${checkTrainsCount.NUM_PEO_TOTAL}人。</p>`;

				let planTableRows = [];

				let lineTrains = JSON.parse(JSON.stringify(this.detailLineTrains));
				let tableList = [];

				let ddtList = Array.from(
					new Set(
						lineTrains.map(train => {
							return train.DDT;
						})
					)
				);

				ddtList.map(ddt => {
					let relatedTrains = lineTrains.filter(train => {
						return train.DDT === ddt;
					});
					let linenameList = Array.from(
						new Set(
							relatedTrains.map(train => {
								return train.LINE_NAME;
							})
						)
					);
					let line = [];
					linenameList.map(l => {
						line.push({
							LINE_NAME: l,
							TRAINS: relatedTrains.filter(train => {
								return train.LINE_NAME === l;
							})
						});
					});
					tableList.push({
						DDT: ddt,
						LINES: line
					});
				});

				tableList.map((ddt, ddtIndex) => {
					let ddtRowSpan = 0;
					ddt.LINES.map(l => {
						ddtRowSpan = ddtRowSpan + l.TRAINS.length;
					});
					ddt.LINES.map((l, lIndex) => {
						let lineRowSpan = l.TRAINS.length;
						l.TRAINS.map((train, tIndex) => {
							let doneRecord =
								train.RECORDS.filter(r => {
									return r.C_TIME !== undefined;
								}) || [];
							let undoneRecord =
								train.RECORDS.filter(r => {
									return r.C_TIME === undefined;
								}) || [];
							console.log(doneRecord, undoneRecord);
							let lastDone = doneRecord[doneRecord.length - 1] || {};
							let lastDoneText =
								lastDone.STATION_NAME !== undefined &&
								lastDone.NEXT_NAME !== undefined
									? lastDone.STATION_NAME === lastDone.NEXT_NAME
										? `已销记${lastDone.STATION_NAME}，`
										: `已销记${lastDone.STATION_NAME} - ${lastDone.NEXT_NAME}区间，`
									: "";
							let nextTodo = undoneRecord[0] || {};
							let nextText =
								nextTodo.STATION_NAME !== undefined &&
								nextTodo.NEXT_NAME !== undefined
									? nextTodo.STATION_NAME === nextTodo.NEXT_NAME
										? `${nextTodo.STATION_NAME}。`
										: `${nextTodo.STATION_NAME} - ${nextTodo.NEXT_NAME}区间。`
									: "";
							planTableRows.push(`
									              <tr align="center">
									                
									                ${
														lIndex === 0
															? `<td rowspan="${ddtRowSpan}">${train.DDT}</td>`
															: ""
													}
									                ${
														tIndex === 0
															? `<td rowspan="${lineRowSpan}">${train.LINE_NAME}</td>`
															: ""
													}
									                <td>${train.TRAIN}</td>
									                <td>${train.LINE_TYPE}</td>
									                <td>${train.START_STN}</td>
									                <td>${train.START_TIME || ""}</td>
									                <td>${train.END_STN}</td>
									                <td>${train.END_TIME || ""}</td>
									                <td>${
														train.STATUS == 0
															? "未开始"
															: train.STATUS == 1
															? "巡线中"
															: "巡线完毕"
													}</td>
									                <td>${train.FINISH_TIME || ""}</td>
									                <td>${train.NOTE}</td>
									                <td>${train.STATUS == 0 ? "" : lastDoneText + nextText}</td>
									              </tr>
									            `);
						});
					});
				});

				let planTable = `
									        <table align="center" border="1" cellpadding="2" cellspacing="0">
									          <caption>
									            <span style="font-size: 20px; font-weight: bold">地震巡线方案统计表</span>
									          </caption>
									          <tr align="center">
									            
									            <th>调度台</th>
									            <th>线别</th>
									            <th>巡查列车</th>
									            <th>巡线行别</th>
									            <th>始发站</th>
									            <th>发车时间</th>
									            <th>终到站</th>
									            <th>终到时间</th>
									            <th>当前状态</th>
									            <th>预计寻完时间</th>
									            <th>备注</th>
									            <th>销记进度</th>
									          </tr>
									          ${planTableRows.join("")}
									        </table>
									      `;
				return title + contentText + planTable;
			},
			getParagraph4() {
				let title = `<p style="font-size: 20px;">七、地震受灾情况</p>`;
				let content = `<p>${this.firstLineIndent}根据站段报告，总共有${this.reportsBrief.QUAKE_COUNT}个站有震感，其中${this.reportsBrief.ALL_COUNT}个站有受灾情况。</p>`;
				let effectTableRows = [];
				this.reports.map(r => {
					console.log(r);
					if (r.KIND === "1") {
						effectTableRows.push(`
									          <tr align="center">
															<td>${r.UNIT_NAME}</td>
									            <td>${r.DEP_NAME}</td>
															<td style="color: ${r.QUAKE_FLAG === "1" ? "red" : "black"}">${
							r.QUAKE_FLAG === "1" ? "有" : "无"
						}</td>
															<td>${r.QUAKE_STATION_LIST}</td>
									            <td>${r.CONTENT}</td>
									            <td>${r.CONTENT2}</td>
															<td>${r.NUM_RAIL}</td>
															<td>${r.NUM_PEO}</td>
									          </tr>
									        `);
					}
				});
				let effectTable = `
									        <table align="center" border="1" cellpadding="2" cellspacing="0">
									          <caption>
									            <span style="font-size: 20px; font-weight: bold">地震受灾情况统计表</span>
									          </caption>
									          <tr align="center">
															<th>上报单位</th>
									            <th>上报部门</th>
															<th>有无震感</th>
															<th>有震感车站</th>
									            <th>人员受灾情况</th>
									            <th>设备受灾情况</th>
															<th>出动巡查车台数</th>
															<th>出动巡查人员数</th>
									          </tr>
									          ${effectTableRows.join("")}
									        </table>
									      `;
				return title + content + effectTable;
			},
			getParagraphNew1() {
				let title = `<p style="font-size: 20px;">二、启动应急响应概况</p>`;
				let content = `<p>${this.firstLineIndent}${this.$store.state.earthquake.currentEarthquakeInfo.CONTENT}</p>`;
				return title + content;
			},
			getParagraphNew2() {
				let diffTrains = this.$store.state.earthquake.effectedTrainsDiff;
				let title = `<p style="font-size: 20px">四、影响列车对比</p>`;
				let tableContent = [];
				diffTrains.map((section, index) => {
					let trainsCount = section.TRAINLIST_RT.length;
					section.TRAINLIST_RT.map((train, tIndex) => {
						tableContent.push(`
												<tr align="center">
													${tIndex === 0 ? `<td rowspan="${trainsCount}">${section.L_NAME}</td>` : ""}
													${tIndex === 0 ? `<td rowspan="${trainsCount}">${section.DIRECTION}</td>` : ""}
													${
														tIndex === 0
															? `<td rowspan="${trainsCount}">${section.O_STATION} - ${section.E_STATION}</td>`
															: ""
													}
													${
														tIndex === 0
															? `<td style="color: ${
																	section.ATTRIBUTE ===
																	"1"
																		? "red"
																		: "black"
															  }" rowspan="${trainsCount}">${
																	section.ATTRIBUTE ===
																	"0"
																		? "限速"
																		: "封锁"
															  }</td>`
															: ""
													}
													<td>${train.cc}</td>
													<td>${train.currentZm}</td>
												</tr>
											`);
					});
				});
				let table = `
									<table align="center" border="1" cellpadding="2" cellspacing="0">
										<caption>
											<span style="font-size: 20px; font-weight: bold">影响列车对比表</span>
										</caption>
										<tr>
											<th>线别</th>
											<th>行别</th>
											<th>区间</th>
											<th>影响类型</th>
											<th>车次</th>
											<th>当前位置</th>
										</tr>
										${tableContent.join("")}
									</table>
									`;
				let content = `<p>${table}</p>`;
				return title + content;
			},
			getParagraphNew3() {
				let title = `<p style="font-size: 20px;">六、客车调整方案</p>`;
				let content = `<p>${this.firstLineIndent}</p>`;
				return title + content;
			},
			getParagraphNew4() {
				let title = `<p style="font-size: 20px">八、其他</p>`;
				let content = `<p>${this.firstLineIndent}</p>`;
				return title + content;
			},
			getTitle() {
				return `
									        <div style="width: 100%; height: auto; border-bottom: 1px solid red; display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">
									          <p style="font-size: 28px; color: red; text-align: center">应急速报</p>
									          <p style="text-align: center; border-bottom: 2px solid red;">（截止${this.currentTime}）</p>
									        </div>
									      `;
			}
		}
	};
</script>

<style>
	.export-report-dialog-container {
		height: auto;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: flex-start;
		justify-content: center;
		background: white;
	}

	.report-select-container {
		height: 600px;
		width: 15%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.report-body {
		height: 100%;
		width: 85%;
		display: flex;
		flex-direction: column;
	}

	.report-title {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: center;
		border-bottom: 2px solid red;
	}

	.report-content {
		width: 100%;
		height: 600px;
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
	}

	.report-paragraph {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		margin-top: 10px;
	}

	.report-paragraph-title {
		width: 100%;
	}

	.report-paragraph-title > span {
		font-size: 20px;
	}

	.report-paragraph-content {
		margin-left: 40px;
		width: calc(100% - 40px);
		margin-top: 10px;
	}
</style>
