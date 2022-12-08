<template>
	<div class="lay">
		<div class="back-to-normal-button" v-if="hasCurrentEarthquake">
			<el-button
				@click="handleBackToNormalMode"
				type="primary"
				size="mini"
				>返回</el-button
			>
			<el-button type="primary" size="mini" @click="handleGdcVisible">{{
				gdcVisible ? "隐藏轨道车" : "显示轨道车"
			}}</el-button>
			<el-button type="primary" size="mini" @click="handleMapVisible">{{
				mapVisible ? "隐藏地图" : "显示地图"
			}}</el-button>
		</div>
		<EarthquakeView v-if="hasCurrentEarthquake" />
		<div v-if="!isLight" class="lay-top">
			<div class="log"></div>
		</div>
		<div class="lay-main">
			<div
				v-if="!isLight"
				style="
					position: absolute;
					right: 220px;
					top: 1px;
					z-index: 9999;
				"
			>
				<el-button size="small" type="text">
					<span
						style="
							font-weight: bold;
							font-size: 16px;
							color: #c8e3ff;
						"
					></span>
				</el-button>
			</div>
			<div v-if="isLight" class="light-title">
				<div class="light-title-logo"></div>
				<div class="light-title-text">
					<span style="color: white; font-size: 18px"
						>中国铁路成都局集团有限公司</span
					>
					<span
						style="
							color: white;
							font-size: 18px;
							font-weight: bold;
							margin-left: 10px;
						"
						>应急指挥中心</span
					>
				</div>
			</div>
			<!-- 地图 -->
			<div class="map-con">
				<Map
					ref="myMap"
					:style="{ background: !isLight ? '#272F46' : '#EAEAF5' }"
					sys="yjxy"
					:mapConfig="{ zoom: 3 }"
					:toolsConfig="{ height: '750px', bottom: '100px' }"
					@markerClick="markerClick"
					@reloadData="getEarthquake"
					@clickEarthquakeEffectPoint="
						handlePanelRowClick(
							$event.row,
							$event.index,
							$event.eq,
							$event.eqb
						)
					"
					@controllerTabChange="controllerTabChange"
					@lightPanelChange="handlePanelChange($event)"
					@lightShowEffect="handleEffectDisplay($event)"
					@phoneUploadLocation="
						earthquakeTypeChange({ id: 2, text: '86433333报警' })
					"
					@phoneCallIn="getPhoneCallIn"
				></Map>
			</div>
			<!--      亮版影响范围-->
			<div
				class="light-effect"
				v-if="
					effectData.length !== 0 &&
						isLight &&
						currentSelectedEq.IMPORT_TYPE == '1' &&
						panel.current === '灾害' &&
						panel.display &&
						!hasCurrentEarthquake
				"
				v-show="effectDisplay"
			>
				<div
					v-for="(row, index) in effectData"
					:key="index"
					:class="{
						'effect-row': currentSelectedRow != index,
						'effect-row-selected': currentSelectedRow == index
					}"
					@click="handleLightPanelRowClick(row, index)"
				>
					<div class="row-index">
						<span
							style="
								margin-bottom: 3px;
								font-size: 12px;
								text-align: center;
							"
							>{{ index + 1 }}</span
						>
					</div>
					<div class="row-content">
						<div class="row-line-name">
							<span style="color: #0f50b1">
								{{ row.LINE_NAME || row.L_NAME }}
							</span>
							<span style="color: #656e77; margin-left: 20px"
								>双线</span
							>
							<span style="color: #656e77; margin-left: 20px">
								{{ row.ENVIRONMENT }}
							</span>
						</div>
						<div class="row-line-section">
							<span style="color: #656e77">
								{{ row.O_STATION }} ({{ row.O_KM }}) -
								{{ row.E_STATION }} ({{ row.E_KM }})
							</span>
						</div>
					</div>
					<div class="row-type">
						<div
							v-if="row.ATTRIBUTE == '0'"
							class="plan-xs"
							style="
								display: flex;
								justify-content: center;
								align-items: center;
								align-content: center;
							"
						>
							<span>限速</span>
						</div>
						<div
							v-if="row.ATTRIBUTE == '1'"
							class="plan-fs"
							style="
								display: flex;
								justify-content: center;
								align-items: center;
								align-content: center;
							"
						>
							<span>封锁</span>
						</div>
					</div>
				</div>
			</div>
			<!-- =========================================== 地震相关 -->
			<div
				v-show="!isLight && darkPanel.display && !hasCurrentEarthquake"
				:class="{
					'dark-panel': darkPanel.hide,
					'dark-panel-show': !darkPanel.hide
				}"
			>
				<div
					@click="darkPanel.hide = !darkPanel.hide"
					:class="{
						'hide-switch': !darkPanel.hide,
						'unhide-switch': darkPanel.hide
					}"
					class="dark-switch"
					style="cursor: pointer; z-index: 1000"
					v-show="
						darkPanel.display &&
							controllerTab !== '后勤' &&
							controllerTab !== '施工' &&
							controllerTab !== '交通' &&
							controllerTab !== '其它' &&
							controllerTab !== '客运' &&
							controllerTab !== '车辆' &&
							controllerTab !== '货运'
					"
				></div>
				<div
					v-if="!isLight"
					v-show="darkPanel.display && !darkPanel.hide"
					class="right-con"
					:class="{ show: controllerTab === '灾害' }"
				>
					<tabs
						ref="myTabs"
						:tabsList="[
							{ id: 0, text: '地震网数据' },
							{ id: 1, text: '地震网数据(历史)' },
						]"
						@titleClick="earthquakeTypeChange"
						style="height: 30px"
					></tabs>
					<div
						v-if="
							currentEarthTypeId !== 2 && currentEarthTypeId !== 3
						"
						style="height: 210px"
					>
						<div style="display: inline-block" class="eq-log">
							<div
								class="shadow-txt"
								style="
									font-size: 40px;
									font-weight: bold;
									padding-top: 30px;
								"
							>
								{{ curEq.srcLevel }}级
							</div>
							<div
								style="
									font-size: 16px;
									color: #b5c5f8;
									padding: 70px 40px 0 40px;
								"
							>
								{{ curEq.EQ_LOCATION }}
							</div>
						</div>
						<div
							style="
								display: inline-block;
								text-align: center;
								width: calc(100% - 150px);
								padding: 0 10px;
								color: #cdc3e1;
							"
						>
							<div style="font-size: 18px; padding-top: 20px">
								发生时刻：{{ curEq.eqDate }}
							</div>
							<div
								style="
									color: #cd7e15;
									font-size: 30px;
									font-weight: bold;
									padding: 16px;
								"
							>
								{{ curEq.eqTime }}
							</div>
							<div
								style="
									display: flex;
									justify-content: space-around;
									align-items: center;
									background: rgba(7, 13, 35, 0.5);
									height: 80px;
								"
							>
								<div
									style="
										border-right: 1px solid #000000;
										padding-left: 20px;
										padding-right: 20px;
									"
								>
									<div>经度</div>
									<div
										style="color: #0bccdc; padding-top: 5px"
									>
										{{ curEq.eqLngShort }}
									</div>
								</div>
								<div
									style="
										border-right: 1px solid #000000;
										padding-left: 20px;
										padding-right: 20px;
									"
								>
									<div>纬度</div>
									<div
										style="color: #0bccdc; padding-top: 5px"
									>
										{{ curEq.eqLatShort }}
									</div>
								</div>
								<div
									style="
										padding-left: 20px;
										padding-right: 20px;
									"
								>
									<div>深度</div>
									<div
										style="color: #0bccdc; padding-top: 5px"
									>
										{{ curEq.srcDepth }}千米
									</div>
								</div>
							</div>
						</div>
					</div>
					<table
						v-if="
							currentEarthTypeId !== 2 && currentEarthTypeId !== 3
						"
						style="width: 100%; text-align: center; font-size: 12px"
						cellpadding="0"
						cellspacing="0"
						border="0"
					>
						<colgroup>
							<col name="eq_1_column_1" width="40" />
							<col
								name="eq_1_column_2"
								:width="earthquakeNowFlag ? '120' : '300'"
							/>
							<col name="eq_1_column_3" width="50" />
							<col name="eq_1_column_4" width="50" />
							<col name="eq_1_column_5" width="80" />
<!--							<col-->
<!--								name="eq_1_column_6"-->
<!--								:width="earthquakeNowFlag ? '140' : '0'"-->
<!--							/>-->
						</colgroup>
						<thead>
							<tr style="color: #5b96ef">
								<th
									class="eq_1_column_1"
									style="padding: 10px 0"
								>
									震级
								</th>
								<th>发生时刻</th>
								<th class="eq_1_column_3">经度</th>
								<th class="eq_1_column_4">纬度</th>
								<th class="eq_1_column_5">发生地点</th>
<!--								<th-->
<!--									class="eq_1_column_6"-->
<!--									v-if="earthquakeNowFlag"-->
<!--								>-->
<!--									操作-->
<!--								</th>-->
							</tr>
						</thead>
					</table>
					<div
						v-if="
							currentEarthTypeId !== 2 && currentEarthTypeId !== 3
						"
						style="height: 200px; overflow-y: auto"
					>
						<table
							style="
								width: 100%;
								text-align: center;
								font-size: 12px;
							"
							cellpadding="0"
							cellspacing="0"
							border="0"
						>
							<colgroup>
								<col name="eq_1_column_1" width="40" />
								<col
									name="eq_1_column_2"
									:width="earthquakeNowFlag ? '120' : '300'"
								/>
								<col name="eq_1_column_3" width="50" />
								<col name="eq_1_column_4" width="50" />
								<col name="eq_1_column_5" width="80" />
<!--								<col-->
<!--									name="eq_1_column_6"-->
<!--									:width="earthquakeNowFlag ? '140' : '0'"-->
<!--								/>-->
							</colgroup>
							<tbody style="background: rgba(21, 42, 99, 0.8)">
								<tr
									v-for="(row, indexRow) in earthquakeData"
									:key="indexRow"
									:style="{
										background:
											curEq.earthId === row.earthId
												? '#0E307E'
												: ''
									}"
								>
									<td
										class="eq_1_column_1"
										style="
											border-bottom: 1px solid #293d72;
											height: 29px;
										"
										@click="earthquakeRowClick(row)"
									>
										{{ row.srcLevel }}
									</td>
									<td
										style="border-bottom: 1px solid #293d72"
										@click="earthquakeRowClick(row)"
									>
										{{ row.cTime }}
									</td>
									<td
										class="eq_1_column_3"
										style="border-bottom: 1px solid #293d72"
										@click="earthquakeRowClick(row)"
									>
										{{ row.eqLngShort }}
									</td>
									<td
										class="eq_1_column_4"
										style="border-bottom: 1px solid #293d72"
										@click="earthquakeRowClick(row)"
									>
										{{ row.eqLatShort }}
									</td>
									<td
										class="eq_1_column_5"
										style="border-bottom: 1px solid #293d72"
										@click="earthquakeRowClick(row)"
									>
										{{ row.EQ_LOCATION }}
									</td>
<!--									<td-->
<!--										class="eq_1_column_6"-->
<!--										style="border-bottom: 1px solid #293d72"-->
<!--										v-if="earthquakeNowFlag"-->
<!--									>-->
<!--										<el-popover-->
<!--											v-if="earthquakeNowFlag"-->
<!--											placement="top"-->
<!--											width="160"-->
<!--											v-model="row.visible"-->
<!--											popper-class="map-blue"-->
<!--										>-->
<!--											<p>确认恢复该地震吗？</p>-->
<!--											<div-->
<!--												style="-->
<!--													text-align: right;-->
<!--													margin: 0;-->
<!--												"-->
<!--											>-->
<!--												<el-button-->
<!--													type="primary"-->
<!--													size="mini"-->
<!--													@click="huiFu(row)"-->
<!--													>确定-->
<!--												</el-button>-->
<!--											</div>-->
<!--											<el-button-->
<!--												type="text"-->
<!--												slot="reference"-->
<!--												size="mini"-->
<!--												v-if="config.earthquake.addFlag"-->
<!--											>-->
<!--												<span style="font-size: 12px"-->
<!--													>结束</span-->
<!--												>-->
<!--											</el-button>-->
<!--										</el-popover>-->
<!--										<el-popover-->
<!--											v-else-->
<!--											placement="top"-->
<!--											width="160"-->
<!--											v-model="row.visible"-->
<!--											popper-class="map-blue"-->
<!--										>-->
<!--											<p>确认删除该地震吗？</p>-->
<!--											<div-->
<!--												style="-->
<!--													text-align: right;-->
<!--													margin: 0;-->
<!--												"-->
<!--											>-->
<!--												<el-button-->
<!--													type="primary"-->
<!--													size="mini"-->
<!--													>确定-->
<!--												</el-button>-->
<!--											</div>-->
<!--											<el-button-->
<!--												type="text"-->
<!--												slot="reference"-->
<!--												v-if="config.earthquake.addFlag"-->
<!--												>删除-->
<!--											</el-button>-->
<!--										</el-popover>-->
<!--										<el-button-->
<!--											type="text"-->
<!--											size="mini"-->
<!--											v-if="row.IMPORT_TYPE == '1'"-->
<!--											@click="showUploadStatus(row)"-->
<!--											>报表-->
<!--										</el-button>-->
<!--										<el-button-->
<!--											type="text"-->
<!--											size="mini"-->
<!--											v-if="row.IMPORT_TYPE == '1'"-->
<!--											style="margin-left: 0"-->
<!--											@click="showEarthquakeXj(row)"-->
<!--											v-show="config.earthquake.addFlag"-->
<!--											>销记-->
<!--										</el-button>-->
<!--										<el-button-->
<!--											type="text"-->
<!--											size="mini"-->
<!--											v-if="row.IMPORT_TYPE == '1'"-->
<!--											style="margin-left: 0"-->
<!--											@click="showEffectDiagram(row)"-->
<!--											>范围-->
<!--										</el-button>-->
<!--										<el-button-->
<!--											type="text"-->
<!--											size="mini"-->
<!--											v-if="row.IMPORT_TYPE == '1'"-->
<!--											style="margin-left: 0"-->
<!--											@click="showOrderGenerator(row)"-->
<!--											v-show="config.earthquake.addFlag"-->
<!--											>命令-->
<!--										</el-button>-->
<!--									</td>-->
								</tr>
							</tbody>
						</table>
					</div>
					<tabs
						ref="myTabs"
						v-if="
							currentEarthTypeId !== 2 && currentEarthTypeId !== 3
						"
						:tabsList="[{ id: 0, text: '线路影响情况' }]"
						style="height: 30px"
					></tabs>
					<table
						v-if="
							currentEarthTypeId !== 2 && currentEarthTypeId !== 3
						"
						style="width: 100%; text-align: center; font-size: 12px"
						cellpadding="0"
						cellspacing="0"
						border="0"
					>
						<colgroup>
							<col name="eq_2_column_1" width="40" />
							<col name="eq_2_column_2" width="40" />
							<col name="eq_2_column_3" width="70" />
							<col name="eq_2_column_4" width="70" />
							<col name="eq_2_column_5" width="40" />
							<col name="eq_2_column_6" width="40" />
						</colgroup>
						<thead>
							<tr style="color: #5b96ef">
								<th
									style="padding: 10px 0"
									class="eq_2_column_1"
								>
									线名
								</th>
								<th class="eq_2_column_2">线别</th>
								<th class="eq_2_column_3">区间/公里标</th>
								<th class="eq_2_column_4">
									{{
										curEq.IMPORT_TYPE === "1"
											? "站名"
											: "行别"
									}}
								</th>
								<th class="eq_2_column_5">方案</th>
								<th class="eq_2_column_6">
									{{
										curEq.IMPORT_TYPE === "1"
											? "高层"
											: "继电器"
									}}
								</th>
							</tr>
						</thead>
					</table>
					<div
						v-if="
							currentEarthTypeId !== 2 && currentEarthTypeId !== 3
						"
						style="height: 350px; overflow-y: auto"
					>
						<table
							style="
								width: 100%;
								text-align: center;
								font-size: 12px;
							"
							cellpadding="0"
							cellspacing="0"
						>
							<colgroup>
								<col name="eq_2_column_1" width="40" />
								<col name="eq_2_column_2" width="40" />
								<col name="eq_2_column_3" width="70" />
								<col name="eq_2_column_4" width="70" />
								<col name="eq_2_column_5" width="40" />
								<col name="eq_2_column_6" width="40" />
							</colgroup>
							<tbody>
								<tr
									v-for="(row, index) in effectData"
									:key="index"
									class="table-row-bg"
									@click="setEarthquakeEffectLineId(row)"
									:style="{
										background:
											curEffect.seq === row.seq
												? '#0E307E'
												: ''
									}"
								>
									<td
										style="
											height: 42px;
											color: #06f3fb;
										"
										class="eq_2_column_1"
									>
										{{ row.LINE_NAME || row.L_NAME }}
									</td>
									<td
										style="width: 50px"
										class="eq_2_column_2"
									>
										双线
									</td>
									<td style class="eq_2_column_3">
										<!-- <div>成都东-昆明</div> -->
										<div style="color: #cdc3e1">
											{{ row.glbTextS || row.O_KM }}
											<span style="color: #06f3fb"
												>-</span
											>
											{{ row.glbTextE || row.E_KM }}
										</div>
									</td>
									<td style class="eq_2_column_4">
										<span
											v-show="curEq.IMPORT_TYPE !== '1'"
										>
											{{
												row.ROW_OTHER
													? row.ROW_OTHER
													: ""
											}}
										</span>
										<span
											v-show="curEq.IMPORT_TYPE === '1'"
										>
											{{ row.O_STATION }} -
											{{ row.E_STATION }}
										</span>
									</td>
									<td
										v-if="row.clickable"
										style="position: relative"
										:style="{ color: dicColor[row.LEVEL] }"
										class="eq_2_column_5"
									>
										<i class="split"></i>
										{{ dicLX[row.LEVEL] }}
									</td>
									<td
										v-else
										style="position: relative"
										class="eq_2_column_5"
									>
										<i
											v-show="curEq.IMPORT_TYPE !== '1'"
											class="split"
										></i>
										<span
											:title="row.PLAN"
											:style="{
												color:
													row.ATTRIBUTE == '0'
														? '#DF990C'
														: '#FD5A5A',
												marginLeft:
													curEq.IMPORT_TYPE === '1'
														? 0
														: 0
											}"
										>
											{{
												row.ATTRIBUTE == "0"
													? "限速"
													: "封锁"
											}}
										</span>
									</td>
									<td style class="eq_2_column_6">
										<el-popover
											v-if="row.LEVEL === '1'"
											placement="left"
											width="500"
											trigger="click"
											popper-class="map-blue"
										>
											<el-table
												:data="
													curEq.IMPORT_TYPE === '1'
														? []
														: row.jdq
												"
												height="300"
											>
												<el-table-column
													width="100"
													property="STN_NAME"
													label="名称"
												></el-table-column>
												<el-table-column
													property="name"
													label="上行"
												>
													<template
														slot-scope="scope"
													>
														{{
															scope.row
																.UP_MIL_START
														}}
														至
														{{
															scope.row.UP_MIL_END
														}}
													</template>
												</el-table-column>
												<el-table-column
													property="address"
													label="下行"
												>
													<template
														slot-scope="scope"
													>
														{{
															scope.row
																.DOWN_MIL_START
														}}
														至
														{{
															scope.row
																.DOWN_MIL_END
														}}
													</template>
												</el-table-column>
											</el-table>
											<i
												slot="reference"
												class="el-icon-view"
												style="
													cursor: pointer;
													font-size: 16px;
												"
											></i>
										</el-popover>
										<span
											v-show="curEq.IMPORT_TYPE === '1'"
											>{{ row.ENVIRONMENT }}</span
										>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div v-if="currentEarthTypeId === 2">
						<tabs
							ref="fhHisTab"
							:tabs-list="[{ id: 0, text: '手机呼入' }]"
						></tabs>
						<div class="history-upload-locations">
							<table
								style="
									width: 100%;
									text-align: center;
									font-size: 12px;
								"
								cellpadding="0"
								cellspacing="0"
								border="0"
							>
								<colgroup>
									<col name="eq_2_column_1" width="65" />
									<col name="eq_2_column_2" width="70" />
									<col name="eq_2_column_3" width="70" />
									<col name="eq_2_column_4" width="70" />
								</colgroup>
								<thead>
									<tr style="color: #5b96ef">
										<th class="eq_2_column_1">电话号</th>
										<th class="eq_2_column_2">呼入时间</th>
										<th class="eq_2_column_3">
											发送短信次数
										</th>
										<th class="eq_2_column_4">操作</th>
									</tr>
								</thead>
							</table>
							<div style="height: 250px; overflow-y: auto">
								<table
									style="
										width: 100%;
										text-align: center;
										font-size: 12px;
									"
									cellpadding="0"
									cellspacing="0"
								>
									<colgroup>
										<col name="eq_2_column_1" width="65" />
										<col name="eq_2_column_2" width="70" />
										<col name="eq_2_column_3" width="70" />
										<col name="eq_2_column_4" width="70" />
									</colgroup>
									<tbody>
										<tr
											v-for="(row,
											index) in historyCallInData"
											:key="index"
											class="table-row-bg"
											style="height: 40px"
										>
											<td
												style
												class="eq_2_column_1"
												:style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
											>
												{{ row.PHONE }}
											</td>
											<td
												style
												class="eq_2_column_2"
												:style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
											>
												<!-- <div>成都东-昆明</div> -->
												{{ row.CTIME }}
											</td>
											<td
												style
												class="eq_2_column_3"
												:style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
											>
												{{ row.SEND_COUNT }}
											</td>
											<td style="" class="eq_2_column_3">
												<el-button
													type="primary"
													size="mini"
													@click="sendMsgToPhone(row)"
													v-if="
														config.earthquake
															.addFlag && ifToday(row.CTIME)
													"
                          title="仅当日手机呼入可发送短信"
													>发送短信
												</el-button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<tabs
							ref="fhHisTab"
							:tabs-list="[{ id: 0, text: '上报历史' }]"
						></tabs>
						<div class="history-upload-locations">
							<table
								style="
									width: 100%;
									text-align: center;
									font-size: 12px;
								"
								cellpadding="0"
								cellspacing="0"
								border="0"
							>
								<colgroup>
									<col name="eq_2_column_1" width="65" />
									<col name="eq_2_column_2" width="70" />
									<col name="eq_2_column_3" width="70" />
									<col name="eq_2_column_4" width="40" />
								</colgroup>
								<thead>
									<tr style="color: #5b96ef">
										<th class="eq_2_column_1">经度</th>
										<th class="eq_2_column_2">纬度</th>
										<th class="eq_2_column_3">上报电话</th>
										<th class="eq_2_column_4">上报时间</th>
									</tr>
								</thead>
							</table>
							<div style="height: 250px; overflow-y: auto">
								<table
									style="
										width: 100%;
										text-align: center;
										font-size: 12px;
									"
									cellpadding="0"
									cellspacing="0"
								>
									<colgroup>
										<col name="eq_2_column_1" width="65" />
										<col name="eq_2_column_2" width="70" />
										<col name="eq_2_column_3" width="70" />
										<col name="eq_2_column_4" width="40" />
									</colgroup>
									<tbody>
										<tr
											v-for="(row,
											index) in historyLocationUploads"
											:key="index"
											class="table-row-bg"
											@click="
												clickHistoryInfluenceData(row)
											"
											:style="{
												background:
													currentSelectedInfluenceData.PKID ===
													row.PKID
														? '#0E307E'
														: ''
											}"
										>
											<td
												style
												class="eq_2_column_1"
												:style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
											>
												{{
													parseFloat(row.LON).toFixed(
														5
													)
												}}
											</td>
											<td
												style
												class="eq_2_column_2"
												:style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
											>
												<!-- <div>成都东-昆明</div> -->
												{{
													parseFloat(row.LAT).toFixed(
														5
													)
												}}
											</td>
											<td
												style
												class="eq_2_column_3"
												:style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
											>
												{{ row.PHONE }}
											</td>
											<td
												style
												class="eq_2_column_4"
												:style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
											>
												{{ row.CTIME.substr(0, 16) }}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<tabs
							ref="fhTab"
							:tabs-list="[{ id: 0, text: '线路影响情况' }]"
						></tabs>
						<div class="history-upload-locations">
							<table
								style="
									width: 100%;
									text-align: center;
									font-size: 12px;
								"
								cellpadding="0"
								cellspacing="0"
								border="0"
							>
								<colgroup>
									<col name="eq_2_column_1" width="65" />
									<col name="eq_2_column_2" width="70" />
									<col name="eq_2_column_3" width="70" />
								</colgroup>
								<thead>
									<tr style="color: #5b96ef">
										<th class="eq_2_column_1">线别</th>
										<th class="eq_2_column_2">起点</th>
										<th class="eq_2_column_3">终点</th>
									</tr>
								</thead>
							</table>
							<div style="height: 250px; overflow-y: auto">
								<table
									style="
										width: 100%;
										text-align: center;
										font-size: 12px;
									"
									cellpadding="0"
									cellspacing="0"
								>
									<colgroup>
										<col name="eq_2_column_1" width="65" />
										<col name="eq_2_column_2" width="70" />
										<col name="eq_2_column_3" width="70" />
									</colgroup>
									<tbody>
										<tr
											v-for="(row,
											index) in currentInfluenceTableData"
											:key="index"
											class="table-row-bg"
											style="height: 30px"
										>
											<td style class="eq_2_column_1">
												{{ row.LINE_NAME }}
											</td>
											<td style class="eq_2_column_2">
												<!-- <div>成都东-昆明</div> -->
												{{ row.DATA[0].LINE_KM_DIS }}
											</td>
											<td style class="eq_2_column_3">
												{{ row.DATA[1].LINE_KM_DIS }}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
<!--					<div v-if="currentEarthTypeId === 3">-->
<!--						<div-->
<!--							style="-->
<!--								display: flex;-->
<!--								flex-direction: column;-->
<!--								align-items: center;-->
<!--								margin-top: 20px;-->
<!--								height: 800px;-->
<!--								overflow-y: scroll;-->
<!--							"-->
<!--						>-->
<!--							<div-->
<!--								v-for="(event, index) in yjEvents"-->
<!--								:key="index"-->
<!--								class="yj-event"-->
<!--								@click="handleYjEventClick(event)"-->
<!--							>-->
<!--								<div-->
<!--									style="-->
<!--										width: 122px;-->
<!--										height: 112px;-->
<!--										display: flex;-->
<!--										align-items: center;-->
<!--										align-content: center;-->
<!--										justify-content: center;-->
<!--									"-->
<!--								>-->
<!--									<div>-->
<!--										<span class="yj-event-level">-->
<!--											{{ event.levelstr }}-->
<!--										</span>-->
<!--									</div>-->
<!--								</div>-->
<!--								<div-->
<!--									style="-->
<!--										margin-top: 20px;-->
<!--										height: 92px;-->
<!--										width: calc(413px - 130px);-->
<!--										display: flex;-->
<!--										flex-direction: column;-->
<!--									"-->
<!--								>-->
<!--									<div-->
<!--										style="-->
<!--											width: 100%;-->
<!--											display: flex;-->
<!--											flex-direction: row;-->
<!--											align-content: center;-->
<!--											align-items: center;-->
<!--											justify-content: space-between;-->
<!--										"-->
<!--									>-->
<!--										<div>-->
<!--											<span-->
<!--												style="-->
<!--													font-size: 20px;-->
<!--													font-weight: bold;-->
<!--													color: #00f6ff;-->
<!--												"-->
<!--												>{{ event.xianming }}线</span-->
<!--											>-->
<!--										</div>-->
<!--										<div>-->
<!--											<span-->
<!--												style="-->
<!--													font-size: 14px;-->
<!--													font-weight: bold;-->
<!--													color: #00f6ff;-->
<!--												"-->
<!--												>{{ event.zhanming }}</span-->
<!--											>-->
<!--										</div>-->
<!--										<div>-->
<!--											<span style="font-size: 12px">{{-->
<!--												event.fssj-->
<!--											}}</span>-->
<!--										</div>-->
<!--									</div>-->
<!--									<div style="color: #25aeea">-->
<!--										{{ event.gzlxstr }}-->
<!--									</div>-->
<!--									<div-->
<!--										style="-->
<!--											color: white;-->
<!--											font-size: 12px;-->
<!--											height: 40px;-->
<!--											width: 283px;-->
<!--											overflow-y: auto;-->
<!--										"-->
<!--									>-->
<!--										{{ event.shijianBaogao }}-->
<!--									</div>-->
<!--								</div>-->
<!--								&lt;!&ndash;                <h1>{{ event.fssj }} / {{ event.levelstr }}</h1>&ndash;&gt;-->
<!--								&lt;!&ndash;                <h3>{{ event.xianming }}线 / {{ event.zhanming }} / {{ event.gonglibiao }}</h3>&ndash;&gt;-->
<!--								&lt;!&ndash;                <h4>{{ event.gzlxstr }}</h4>&ndash;&gt;-->
<!--								&lt;!&ndash;                <h5>{{ event.shijianBaogao }}</h5>&ndash;&gt;-->
<!--							</div>-->
<!--						</div>-->
<!--					</div>-->
				</div>
				<!-- =========================================== 地震相关 -->
				<div
					v-if="!isLight"
					v-show="darkPanel.display && !darkPanel.hide"
					class="right-con"
					:class="{ show: controllerTab === '供电' }"
				>
					<GongDian v-if="controllerTab === '供电'"></GongDian>
				</div>
        <div
          v-if="!isLight"
          v-show="darkPanel.display && !darkPanel.hide"
          class="right-con"
          :class="{ show: controllerTab === '基础' }"
        >
          <ji-chu @yjClick="handleYjEventClick($event)" v-if="controllerTab === '基础'" />
        </div>
        <div
          v-if="!isLight"
          v-show="darkPanel.display && !darkPanel.hide"
          class="right-con"
          :class="{ show: controllerTab === '报警' }"
        >
          <Alert v-if="controllerTab === '报警'"/>
        </div>
				<div
					v-if="!isLight"
					v-show="darkPanel.display && !darkPanel.hide"
					class="right-con"
					:class="{ show: controllerTab === '机务' }"
				>
					<JiWu v-if="controllerTab === '机务'"></JiWu>
				</div>
				<div
					v-if="!isLight"
					v-show="darkPanel.display && !darkPanel.hide"
					class="right-con"
					:class="{ show: controllerTab === '运输' }"
				>
					<YunShu v-if="controllerTab === '运输'"></YunShu>
				</div>
				<div
					v-if="!isLight"
					v-show="darkPanel.display && !darkPanel.hide"
					class="right-con"
					:class="{ show: controllerTab === '土房' }"
				>
					<TuFang v-if="controllerTab === '土房'"></TuFang>
				</div>
				<div
					v-if="!isLight"
					v-show="darkPanel.display && !darkPanel.hide"
					class="right-con"
					:class="{ show: controllerTab === '工务' }"
				>
					<GongWu v-if="controllerTab === '工务'"></GongWu>
				</div>
				<!--        <div-->
				<!--            v-if="!isLight"-->
				<!--            class="right-con"-->
				<!--            v-show="darkPanel.display && !darkPanel.hide"-->
				<!--            :class="{ show: controllerTab === '货运' }"-->
				<!--        >-->
				<!--          <Huoyun v-if="controllerTab === '货运'"></Huoyun>-->
				<!--        </div>-->
				<div
					v-if="!isLight"
					class="right-con"
					v-show="darkPanel.display && !darkPanel.hide"
					:class="{ show: controllerTab === '车辆' }"
				>
					<CheLiang v-if="controllerTab === '车辆'"></CheLiang>
				</div>
				<div
					v-if="!isLight"
					class="right-con"
					v-show="darkPanel.display && !darkPanel.hide"
					:class="{ show: controllerTab === '电务' }"
				>
					<DianWu
						v-if="controllerTab === '电务'"
						@showItem="handleShowItem($event)"
					></DianWu>
				</div>
			</div>

			<!--      亮版Panel-->
			<div
				v-show="isLight && panel.display && !hasCurrentEarthquake"
				:class="{
					'light-panel': panel.hide,
					'light-panel-show': !panel.hide
				}"
			>
				<div
					@click="panel.hide = !panel.hide"
					:class="{
						'hide-switch': !panel.hide,
						'unhide-switch': panel.hide
					}"
					v-show="panel.display"
				></div>
				<!--        <div @click="panel.hide = !panel.hide" class="unhide-switch" v-show="panel.display && panel.hide"></div>-->
				<!--        工务Panel-->
				<div v-show="isLight && panel.display && !panel.hide">
					<GongWu v-show="panel.current === '工务'" />
				</div>
				<div v-show="isLight && panel.display && !panel.hide">
					<GongDian v-if="panel.current === '供电'"></GongDian>
				</div>
				<div v-show="isLight && panel.display && !panel.hide">
					<JiWu v-if="controllerTab === '机务'"></JiWu>
				</div>
				<div v-show="isLight && panel.display && !panel.hide">
					<YunShu v-if="controllerTab === '运输'"></YunShu>
				</div>
				<div v-show="isLight && panel.display && !panel.hide">
					<TuFang v-if="controllerTab === '土房'"></TuFang>
				</div>
				<div v-show="isLight && panel.display && !panel.hide">
					<GongWu v-if="controllerTab === '工务'"></GongWu>
				</div>
				<!--        <div v-show="isLight && panel.display && !panel.hide">-->
				<!--          <Huoyun v-if="controllerTab === '货运'"></Huoyun>-->
				<!--        </div>-->
				<div v-show="isLight && panel.display && !panel.hide">
					<CheLiang v-if="controllerTab === '车辆'"></CheLiang>
				</div>
				<!--        灾害Panel-->
				<div v-show="isLight && panel.display && !panel.hide">
					<div
						class="earthquake-light-panel"
						v-show="panel.current === '灾害'"
					>
						<div class="earthquake-brief">
							<div class="earthquake-panel-title">
								<span>地震网数据</span>
							</div>
							<div class="earthquake-panel-brief">
								<div
									style="
										height: 100px;
										width: 100%;
										display: flex;
										flex-direction: row;
										align-content: center;
										align-items: center;
										justify-content: space-around;
									"
								>
									<div
										class="earthquake-light-logo"
										style="
											display: flex;
											justify-content: center;
										"
									>
										<div>
											<span
												style="
													color: #ff573d;
													font-size: 30px;
													font-weight: bold;
												"
												>{{ curEq.srcLevel }}级</span
											>
										</div>
									</div>
									<div class="earthquake-light-place">
										<p style="color: #656e77; margin: 10px">
											发生地点:
											<span style="color: #04b5af">
												{{ curEq.EQ_LOCATION }}
											</span>
										</p>
										<p style="color: #656e77; margin: 10px">
											发生时刻:
											<span style="color: #ff573d">
												{{ curEq.eqDate }}
											</span>
										</p>
										<p
											style="
												font-size: 30px;
												color: #ff573d;
												margin: 10px;
											"
										>
											{{ curEq.eqTime }}
										</p>
									</div>
								</div>
								<!-- <div
									v-else
									style="
										height: 100px;
										width: 100%;
										display: flex;
										align-content: center;
										justify-content: center;
										align-items: center;
									"
								>
									<span style="color: #656e77"
										>平平安安才是真</span
									>
                </div>-->
							</div>
							<div
								style="
									height: 30px;
									width: 100%;
									display: flex;
									justify-content: space-evenly;
								"
							>
								<div>
									<span style="color: #656e77">经度:</span>
									<span style="color: #04b5af">
										{{ curEq.eqLngShort }}
									</span>
								</div>
								<div>
									<span style="color: #656e77">纬度:</span>
									<span style="color: #04b5af">
										{{ curEq.eqLatShort }}
									</span>
								</div>
								<div>
									<span style="color: #656e77">深度:</span>
									<span style="color: #04b5af"
										>{{ curEq.srcDepth }}km</span
									>
								</div>
							</div>
						</div>
						<div class="earthquake-list">
							<div
								class="earthquake-panel-title"
								style="
									display: flex;
									flex-direction: row;
									justify-content: space-evenly;
								"
							>
								<span
									@click="earthquakeTypeChange({ id: 0 })"
									:style="{
										color:
											currentSelectedTab === '当前'
												? '#5EB0F3'
												: '#BDC5CC'
									}"
									>当前</span
								>
								<span
									@click="earthquakeTypeChange({ id: 1 })"
									:style="{
										color:
											currentSelectedTab === '历史'
												? '#5EB0F3'
												: '#BDC5CC'
									}"
									>历史</span
								>
							</div>
							<div class="earthquake-list-table">
								<div style="width: 100%; height: 100%">
									<el-table
										@row-click="earthquakeRowClick"
										fit
										height="201px"
										:data="earthquakeData"
										style="
											width: 400px;
											height: 100%;
											border-radius: 15px;
										"
										:stripe="false"
										:border="false"
										size="mini"
									>
										<el-table-column
											label="震级"
											align="center"
											width="50"
										>
											<template slot-scope="levelRow">
												<span
													style="
														color: #5eb0f3;
														font-weight: bold;
													"
												>
													{{ levelRow.row.srcLevel }}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											label="发生时刻"
											width="85"
											align="center"
										>
											<template slot-scope="timeRow">
												<span
													:title="timeRow.row.cTime"
													style="color: #656e77"
												>
													{{
														timeRow.row.EQ_CTIME.substring(
															5,
															16
														)
													}}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											label="经度"
											align="center"
											width="60"
										>
											<template slot-scope="lngRow">
												<span style="color: #656e77">
													{{ lngRow.row.eqLngShort }}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											label="纬度"
											align="center"
											width="60"
										>
											<template slot-scope="latRow">
												<span style="color: #656e77">
													{{ latRow.row.eqLatShort }}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											show-overflow-tooltip
											label="发生地点"
											align="center"
											:width="
												currentSelectedTab === '当前'
													? '70'
													: '70'
											"
										>
											<template slot-scope="placeRow">
												<span style="color: #656e77">
													{{
														placeRow.row.EQ_LOCATION
													}}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											align="center"
											:width="
												currentSelectedTab === '当前'
													? '75'
													: '60'
											"
										>
											<template slot-scope="opRow">
												<div
													v-if="
														currentSelectedTab ===
															'当前'
													"
													style="
														display: flex;
														width: 75px;
														height: 100%;
														align-items: center;
														align-content: center;
													"
												>
													<el-popover
														placement="top"
														width="160"
													>
														<div>
															<p>
																确认恢复该地震吗？
															</p>
															<el-button
																size="mini"
																type="primary"
																@click="
																	huiFu(
																		opRow.row
																	)
																"
																>确定
															</el-button>
														</div>
														<i
															slot="reference"
															title="结束"
															class="el-icon-refresh-left"
														></i>
													</el-popover>
													<i
														v-if="
															opRow.row
																.IMPORT_TYPE ==
																'1'
														"
														@click="
															showUploadStatus(
																opRow.row
															)
														"
														title="报表"
														class="el-icon-data-analysis"
														style="margin-left: 5px"
													></i>
													<i
														v-if="
															opRow.row
																.IMPORT_TYPE ==
																'1'
														"
														@click="
															showEffectDiagram(
																opRow.row
															)
														"
														title="影响范围示意图"
														class="el-icon-location"
														style="margin-left: 5px"
													></i>
													<i
														v-if="
															opRow.row
																.IMPORT_TYPE ==
																'1'
														"
														@click="
															showEarthquakeXj(
																opRow.row
															)
														"
														title="销记"
														class="el-icon-tickets"
														style="margin-left: 5px"
													></i>
												</div>
												<div
													v-else
													style="
														display: flex;
														width: 80px;
														height: 100%;
														align-items: center;
														align-content: center;
													"
												>
													<i
														v-if="
															opRow.row
																.IMPORT_TYPE ==
																'1'
														"
														@click="
															showEffectDiagram(
																opRow.row
															)
														"
														title="影响范围示意图"
														class="el-icon-location"
														style="margin-left: 5px"
													></i>
													<i
														v-if="
															opRow.row
																.IMPORT_TYPE ==
																'1'
														"
														@click="
															showEarthquakeXj(
																opRow.row
															)
														"
														title="销记"
														class="el-icon-tickets"
														style="margin-left: 5px"
													></i>
												</div>
											</template>
										</el-table-column>
									</el-table>
								</div>
							</div>
						</div>
						<div class="earthquake-effect-list">
							<div class="earthquake-panel-title">
								<span>线路影响情况</span>
							</div>
							<div class="earthquake-effect-table">
								<div style="width: 100%; height: 100%">
									<el-table
										fit
										height="301px"
										:data="effectData"
										style="
											width: 400px;
											height: 100%;
											border-radius: 15px;
										"
										:stripe="false"
										:border="false"
										size="mini"
									>
										<el-table-column
											label="线名"
											prop="LINE_NAME"
											align="center"
											width="80"
										>
											<template slot-scope="lRow">
												<span style="color: #656e77">
													{{ lRow.row.LINE_NAME }}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											label="行别"
											align="center"
											width="50"
											v-if="curEq.IMPORT_TYPE !== '1'"
										>
											<template slot-scope="hRow">
												<span style="color: #656e77"
													>双线</span
												>
											</template>
										</el-table-column>
										<el-table-column
											label="高层"
											align="center"
											width="50"
											v-if="curEq.IMPORT_TYPE === '1'"
										>
											<template slot-scope="eRow">
												<span style="color: #656e77">
													{{ eRow.row.ENVIRONMENT }}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											label="区间/公里标"
											align="center"
											width="150"
										>
											<template slot-scope="mRow">
												<span style="color: #656e77">
													{{ mRow.row.glbTextS }} -
													{{ mRow.row.glbTextE }}
													<br />
													{{ mRow.row.O_STATION }} -
													{{ mRow.row.E_STATION }}
												</span>
											</template>
										</el-table-column>
										<el-table-column
											label="方案"
											align="center"
											width="50"
										>
											<template slot-scope="planRow">
												<span
													v-if="planRow.row.clickable"
													:style="{
														color:
															dicColor[
																planRow.row
																	.LEVEL
															]
													}"
												>
													{{
														dicLX[planRow.row.LEVEL]
													}}
												</span>
												<span
													v-else
													:title="planRow.row.PLAN"
													:style="{
														color:
															planRow.row
																.ATTRIBUTE ==
															'0'
																? '#DF990C'
																: '#FD5A5A'
													}"
												>
													{{
														planRow.row.ATTRIBUTE ==
														"0"
															? "限速"
															: "封锁"
													}}
												</span>
											</template>
										</el-table-column>
										<!--                    <el-table-column-->
										<!--                      label="站名"-->
										<!--                      align="center"-->
										<!--                      width="70"-->
										<!--                      v-if="curEq.IMPORT_TYPE === '1'"-->
										<!--                      show-overflow-tooltip-->
										<!--                    >-->
										<!--                      <template slot-scope="stnRow">-->
										<!--                        <span style="color: #656e77"-->
										<!--                        >{{ stnRow.row.O_STATION }} - -->
										<!--													{{-->
										<!--                            stnRow.row.E_STATION-->
										<!--                         }}</span-->
										<!--                        >-->
										<!--                      </template>-->
										<!--                    </el-table-column>-->
										<el-table-column
											label="继电器"
											align="center"
											width="70"
										>
											<template slot-scope="jdqRow">
												<el-popover
													placement="left"
													width="600"
													trigger="click"
												>
													<el-table
														fit
														:data="
															curEq.IMPORT_TYPE ===
															'1'
																? []
																: jdqRow.row.jdq
														"
														height="300"
														:border="false"
														:stripe="false"
													>
														<el-table-column
															align="center"
															prop="STN_NAME"
															label="名称"
														></el-table-column>
														<el-table-column
															align="center"
															label="上行"
														>
															<template
																slot-scope="upRow"
															>
																<span
																	style="
																		color: #656e77;
																	"
																>
																	{{
																		upRow
																			.row
																			.UP_MIL_START
																	}}
																	-
																	{{
																		upRow
																			.row
																			.UP_MIL_END
																	}}
																</span>
															</template>
														</el-table-column>
														<el-table-column
															align="center"
															label="下行"
														>
															<template
																slot-scope="downRow"
															>
																<span
																	style="
																		color: #656e77;
																	"
																>
																	{{
																		downRow
																			.row
																			.DOWN_MIL_START
																	}}
																	-
																	{{
																		downRow
																			.row
																			.DOWN_MIL_END
																	}}
																</span>
															</template>
														</el-table-column>
													</el-table>
													<i
														class="el-icon-view"
														slot="reference"
														style="cursor: pointer"
													></i>
												</el-popover>
											</template>
										</el-table-column>
									</el-table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<z-dialog
			:show.sync="uploadStatus"
			title="影响列车统计"
			z-dialog-ref="z-dialog1"
			:is-footer="false"
		>
			<div slot="body">
				<eq-status :data="uploadEqData"></eq-status>
			</div>
		</z-dialog>
		<z-dialog
			:show.sync="orderDialog"
			title="命令"
			z-dialog-ref="orderDialog"
			:is-footer="false"
		>
			<div slot="body">
				<order-generator
					:effect="orderEffect"
					:earthquake="orderEarthquake"
				/>
			</div>
		</z-dialog>
	</div>
</template>

<script>
	import C from "../../assets/com.js";
	import trainObj from "../../components/map/js/train.js";
	import eqObj from "../../components/map/js/earthquake.js";
	import config from "../../components/map/js/config.js";

	import tabs from "../../components/bigScreen/KydTabs.vue";
	import Map from "../../components/map/Index.vue";
	import GongDian from "./components/GongDian.vue";
	import JiWu from "./components/JiWu.vue";
	import YunShu from "./components/YunShu.vue";
	import TuFang from "./components/TuFang.vue";
	import GongWu from "./components/GongWu.vue";
	import Huoyun from "./components/Huoyun.vue";
	import CheLiang from "./components/CheLiang.vue";
	import DianWu from "./components/DianWu.vue";
	import ZDialog from "../../components/ZDialog.vue";
	import EqStatus from "@/components/map/components/EqStatus.vue";
	import OrderGenerator from "./components/OrderGenerator/OrderGenerator.vue";
	import EarthquakeView from "@/components/map/components/EarthquakeView/EarthquakeView";
	import earthquake from "../../components/map/js/earthquake.js";
  
  import dayjs from 'dayjs'
  import JiChu from "@/views/earthquake/components/JiChu";
  import Alert from "@/views/earthquake/components/Alert";

	export default {
		components: {
      Alert,
      JiChu,
			OrderGenerator,
			tabs,
			Map,
			GongDian,
			JiWu,
			YunShu,
			TuFang,
			GongWu,
			Huoyun,
			ZDialog,
			EqStatus,
			CheLiang,
			EarthquakeView,
			DianWu
		},
		data() {
			return {
				curMapView: "all",
				webParam: "",
				bigScreen: false, //是否为超宽屏
				// 翅膀屏
				wingView: {
					left: "",
					right: ""
				},
				config: config,
				controllerTab: "基础", //地图中当前选中的面板
				// ================地震相关
				earthquakeNowFlag: true,
				earthquakeData: [],
				earthquakeDataNow: [],
				earthquakeDataOld: [],
				effectData: [],
				curEffect: {}, //当前影响线
				curEq: {}, //当前地震
				dicDl: ["Ⅰ", "Ⅱ", "Ⅲ"],
				dicLX: ["", "封锁", "检查", "限速"],
				dicColor: [
					"",
					eqObj.DIC_COLORS.one,
					eqObj.DIC_COLORS.two,
					eqObj.DIC_COLORS.thr
				],
				uploadStatus: false,
				uploadEqData: [],
				panel: {
					display: false,
					current: "",
					hide: true
				},
				darkPanel: {
					display: false,
					current: "",
					hide: true
				},
				currentSelectedRow: "",
				currentSelectedTab: "当前",
				currentSelectedEq: {},
				effectDisplay: true,
				currentEarthTypeId: 0,
				historyLocationUploads: [],
				currentSelectedInfluenceData: {},
				currentInfluenceTableData: [],
				historyCallInData: [],
				orderDialog: false,
				orderEarthquake: {},
				orderEffect: [],
				yjCenterLayer: null,
				gdcVisible: true,
				currentShowMarker: null,
				mapVisible: true
				// ================地震相关
			};
		},
		computed: {
			isLight() {
				if (this.config.superMap.lightMode === undefined) {
					return false;
				} else {
					return this.config.superMap.lightMode;
				}
			},
			yjEvents() {
				return this.$store.state.yjEventPush.events;
			},
			hasCurrentEarthquake() {
				if (
					JSON.stringify(
						this.$store.state.earthquake.currentEarthquake
					) !== "{}"
				) {
					if (this.$store.state.earthquake.hidePanelOverRide) {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			},
			currentRenderingSection() {
				return this.$store.state.earthquake.currentRenderingSection;
			}
		},
		mounted() {
			this.bigScreen = window.innerWidth > 3000;
      this.controllerTabChange('基础')
			document.querySelector("title").innerHTML = "地震信息管理"; //页面名称
		},
		methods: {
			handleGdcVisible() {
				this.gdcVisible = !this.gdcVisible;
				this.$refs["myMap"].hideGdc(this.gdcVisible);
			},
			handlePanelRowClick(row, index, eq, eqb) {
				console.log(row, index, eq, eqb);
				this.curEq = eqb;
				this.currentSelectedRow = index;
				this.effectData = eq;
				this.$refs.myMap.setMapView([row.O_LAT, row.O_LON]);
			},
			handleLightPanelRowClick(row, index) {
				this.currentSelectedRow = index;
				document.querySelectorAll(".earth-marker").forEach(ele => {
					ele.classList.remove("breathe");
					ele.parentElement.style.zIndex = 1;
					if (
						ele.id === this.curEq.EQ_ID + index.toString() + "start" ||
						ele.id === this.curEq.EQ_ID + index.toString() + "end"
					) {
						ele.classList.add("breathe");
						ele.parentElement.style.zIndex = 999;
					}
				});
				this.$refs.myMap.setMapView([row.O_LAT, row.O_LON]);
			},
			handlePanelChange(panel) {
				if (panel === "" || panel == "基础") {
					// 不显示panel
					this.panel.display = false;
					this.panel.current = "";
					this.panel.hide = true;
				} else {
					// 切换至对应panel
					this.panel.display = true;
					this.panel.current = panel;
					this.panel.hide = false;
				}
			},
			handleEffectDisplay(display) {
				this.effectDisplay = display;
			},
			jumpToReport() {
				let url = this.$router.resolve({
					path: "/Reports"
				});
				window.open(url.href, "_blank");
			},
			showUploadStatus(row) {
				const loading = this.$loading({
					lock: true,
					text: "正在获取数据...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)"
				});
				C.getDataP123(
					{
						c: "eqeh_zxy2024",
						s: [[row.EQ_ID]],
						url: "https://10.192.126.203/GeneralProServlet" //接口地址
					},
					res => {
						if (res["1"].length !== 0) {
							this.uploadEqData = res["1"];
							loading.close();
							this.uploadStatus = true;
						}
					}
				);
			},
			showOrderGenerator(row) {
				const _this = this;
				let loading = this.$refs["myMap"].$loading({
					lock: true,
					text: "正在加列车数据...",
					spinner: "el-icon-loading",
					background: "rgba(0,0,0,0.7)",
					customClass: "loading"
				});
				// this.earthquakeRowClick(row)
				setTimeout(() => {
					console.log("生成命令", row, this.effectData);
					this.orderEarthquake = row;
					this.orderEffect = this.effectData;
					this.orderDialog = true;
					loading.close();
				}, 3000);
			},
			showEffectDiagram(row) {
				const url = this.$router.resolve({
					path: "/EarthquakeEffectDiagram"
				});
				window.open(url.href + "?id=" + row.EQ_ID, "_blank");
			},
			showEarthquakeXj(row) {
				window.open(
					"http://10.192.34.105/webroot/decision/view/report?viewlet=dds/%E5%BA%94%E6%80%A5%E5%A4%84%E7%BD%AE/%E5%9C%B0%E9%9C%87%E5%8C%BA%E6%AE%B5%E7%BB%9F%E8%AE%A1.cpt&op=write" +
						"&eid=" +
						row.EQ_ID
				);
			},
			// 切换翅膀屏状态
			openWingView(key, cls) {
				this.wingView[key] = cls;
				if (key == "left") {
					this.leftViewVisible(cls); //左侧侧展开关闭切换
				}
			},
			controllerTabChange(name) {
				this.controllerTab = name;
				this.darkPanel.current = name;
				this.darkPanel.display = true;
				this.darkPanel.hide = false;
				if (this.yjCenterLayer) {
					this.$refs["myMap"].map.removeLayer(this.yjCenterLayer);
				}
        if (this.controllerTab === '灾害') {
          eqObj.filterLayer()
        }
			},
			/////////////////////////////////////////////////////// 地震相关、、、、、、、、、、、、、、、、、、、、
			// 地震类型切换
			earthquakeTypeChange(item) {
				this.currentEarthTypeId = item.id;
				eqObj.data.eqOther.isNow = item.id === 0;
				this.earthquakeNowFlag = item.id === 0;
				// 历史
				if (item.id === 1) {
					if (this.yjCenterLayer) {
						this.$refs["myMap"].map.removeLayer(this.yjCenterLayer);
					}
					if (this.isLight) {
						this.currentSelectedTab = "历史";
					}
					this.earthquakeData = this.earthquakeDataOld;
					trainObj.data.trainOhter.dongche = false; //隐藏动车
					trainObj.data.trainOhter.puche = false; //隐藏普车
					eqObj.data.eqOther.layerVisible = false; //隐藏地震
					this.effectData = [];
					eqObj.data.eqOther.effectShow = false; //隐藏地图中地震影响线路
				}
				// 实时
				else if (item.id === 0) {
					if (this.yjCenterLayer) {
						this.$refs["myMap"].map.removeLayer(this.yjCenterLayer);
					}
					if (this.isLight) {
						this.currentSelectedTab = "当前";
					}
					eqObj.removeTempLayer(); //删除临时地震图层
					this.earthquakeData = this.earthquakeDataNow;
					trainObj.data.trainOhter.dongche = true;
					trainObj.data.trainOhter.puche = true;
					eqObj.data.eqOther.layerVisible = true;
					if (this.earthquakeData.length > 0) {
						const row =
							this.earthquakeData.find(
								v => v.earthId === eqObj.data.eqOther.curEarthId
							) || this.earthquakeData[0]; //则选中第一条数据，否则筛选出匹配数据并选中
						console.log("预选中", row);
						this.earthquakeRowClick(row, false);
						setTimeout(() => {
							eqObj.creatEqPulse(); //更新地震光圈
						}, 1);
					}
				} else if (item.id === 2) {
					if (this.yjCenterLayer) {
						this.$refs["myMap"].map.removeLayer(this.yjCenterLayer);
					}
					if (this.isLight) {
						this.currentSelectedTab = "86433333报警";
					}
					// eqObj.removeTempLayer()
					this.earthquakeData = this.earthquakeDataOld;
					trainObj.data.trainOhter.dongche = false; //隐藏动车
					trainObj.data.trainOhter.puche = false; //隐藏普车
					eqObj.data.eqOther.layerVisible = false; //隐藏地震
					this.effectData = [];
					eqObj.data.eqOther.effectShow = false; //隐藏地图中地震影响线路
					// 获取历史险情上报信息
					C.getDataP123(
						{
							c: "eqeh_zxy2033",
							s: [[0]],
							url: "https://10.192.126.203/GeneralProServlet"
						},
						res => {
							console.log("获取险情上报历史", res["1"]);
							this.historyLocationUploads = res["1"];
							if (this.historyLocationUploads.length !== 0) {
								// 选择第一个获取影响范围
							}
						}
					);
					// 获取手机呼入记录
					this.getPhoneCallIn();
				}
				eqObj.filterLayer();
				trainObj.filterLayer();
			},
			getPhoneCallIn() {
				C.getDataP123(
					{
						c: "eqeh_zxy2036",
						s: [["all"]],
						url: "https://10.192.126.203/GeneralProServlet"
					},
					res => {
						console.log("查询呼入记录", res["1"]);
						this.historyCallInData = res["1"];
					}
				);
			},
			// 地震marker点击事件
			markerClick(row) {
				this.earthquakeRowClick(row, true);
			},
			clickHistoryInfluenceData(row) {
				this.currentSelectedInfluenceData = row;
				if (row.INFLUENCE !== "") {
					this.currentInfluenceTableData = JSON.parse(row.INFLUENCE);
					eqObj.handleRenderLocation(row.PKID);
					console.log(this.currentInfluenceTableData);
				}
			},
			sendMsgToPhone(row) {
				C.getDataP123(
					{
						c: "eqeh_zxy9014",
						s: [row.PKID, row.PHONE],
						url: "https://10.192.126.203/GeneralProServlet"
					},
					() => {
						this.$message.success("已发送短信");
						this.earthquakeTypeChange({ id: 2, text: "86433333报警" });
					}
				);
			},
			handleBackToNormalMode() {
				this.$store.commit("earthquake/updateHidePanelOverRide", true);
			},
			// 地震表格行点击事件
			earthquakeRowClick(row, fromMarker = false, isInit = false) {
				this.currentSelectedEq = row;
				console.log(row, this.earthquakeNowFlag, fromMarker, isInit);
				if (this.earthquakeNowFlag === false) {
					if (row.IMPORT_TYPE === "1") {
						eqObj.data.eqOther.layerVisible = false; //隐藏地震
						this.effectData = [];
						eqObj.data.eqOther.effectShow = false; //隐藏地图中地震影响线路
						eqObj.removeTempLayer();
						eqObj.removeEqPulse();
						console.log("RENDER EFFECT POINTS");
						// eqObj.createEarthquakeMarkerFromUpload(row, true);
					} else if (row.IMPORT_TYPE == "0") {
						eqObj.creatEarthquakeMarker(row, true);
					}
				}
        if (this.earthquakeNowFlag && row.IMPORT_TYPE !== '0' && isInit) {
          eqObj.creatEarthquakeMarker(row, false)
        }
				if (this.earthquakeNowFlag && row.IMPORT_TYPE !== "0" && !isInit) {
					const loading = this.$loading({
						lock: true,
						text: "正在获取数据...",
						spinner: "el-icon-loading",
						background: "rgba(0, 0, 0, 0.7)"
					});
					C.getData(
						{
							c: "eqeh_zxy9010",
							s: [row.EQ_ID],
							w: ["all"],
							url: "https://10.192.126.203/GeneralProServlet"
						},
						res => {
							try {
								console.log("地震详情", res.data[1]);
								C.getData(
									{
										c: "eqeh_zxy2056",
										s: [
											{
												E_ID: row.EQ_ID
											}
										],
										url:
											"https://10.192.126.203/GeneralProServlet"
									},
									reports => {
										C.getData(
											{
												c: "eqeh_zxy2057",
												s: [
													{
														DDT: "all",
														E_ID: row.EQ_ID
													}
												],
												url:
													"https://10.192.126.203/GeneralProServlet"
											},
											plans => {
												try {
													this.$store.commit(
														"earthquake/updateLineTrainPlans",
														plans.data["1"]
													);
													this.$store.commit(
														"earthquake/updateReports",
														reports.data
													);
													localStorage.setItem(
														"reportsData",
														JSON.stringify(reports.data)
													);
													// window.postMessage(reports.data, '*')
													this.$store.commit(
														"earthquake/updateCurrentEarthquakeInfo",
														res.data[1]
													);
													this.$store.commit(
														"earthquake/updateCurrentEarthquake",
														row
													);
													this.$store.commit(
														"earthquake/updateHidePanelOverRide",
														false
													);
													// let earthquake = JSON.parse(JSON.stringify(row))
													// earthquake.srcLatitude = parseFloat(this.$store.state.earthquake.currentEarthquakeInfo.EQ_LAT)
													// earthquake.srcLongitude = parseFloat(this.$store.state.earthquake.currentEarthquakeInfo.EQ_LON)
													// eqObj.creatEarthquakeMarker(earthquake, true)
													loading.close();
												} catch (e) {
													this.$message.warning(
														"网络连接超时，请稍后再试"
													);
													loading.close();
												}
											}
										);
									}
								);
							} catch (e) {
								this.$message.warning("网络连接超时，请稍后再试");
								loading.close();
							}
						}
					);
				}
				if (!this.earthquakeNowFlag && row.IMPORT_TYPE == 1) {
					// earthquake.createEqCenter(row)
					console.log('绘制影响范围')
					earthquake.creatEarthquakeMarker(row, true)
				}
				// 点击地图上的地震marker
				if (fromMarker) {
					this.earthquakeData.forEach(v => {
						if (v.earthId === row.earthId) {
							this.curEq = v;
						}
					});
				} else {
					this.curEq = row;
					if (row.IMPORT_TYPE == "1") {
						console.log("显示文件上传地震", row);
					} else {
						try {
							this.$refs.myMap.setMapView([
								row.srcLatitude,
								row.srcLongitude
							]);
						} catch (e) {
							//TODO handle the exception
						}
					}
				}
				eqObj.data.eqOther.curEarthId = this.curEq.EQ_ID;
        this.getEffectData(row, isInit);
				// if(row.EQ_STATUS !== '2') {
				//
				// } //获取地震影响范围
			},
      ifToday(date) {
        let current = dayjs().format('YYYY-MM-DD')
        let test = dayjs(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
        // console.log(test, current)
        if (current === test) {
          return true
        } else {
          return false
        }
      },
			handleMapVisible() {
				this.mapVisible = !this.mapVisible;
				this.$refs["myMap"].hideMap();
			},
			handleShowItem(e) {
				const $vm = this.$refs["myMap"];
				if (this.currentShowMarker) {
					$vm.map.removeLayer(this.currentShowMarker);
				}
        console.log(e)
				let marker = renderMarker(e.type, e.data);
				this.currentShowMarker = marker;
				marker.addTo($vm.map);
				marker.fire("click");
        $vm.map.setView({
          lat: e.data.LAT,
          lng: e.data.LON
        }, 8)
				// marker.dispatchEvent('click')
				function renderMarker(type, data) {
					if (data.LAT === undefined) {
						data.LAT = data.GPS_POINT_Y;
					}
					if (data.LON === undefined) {
						data.LON = data.GPS_POINT_X;
					}
					let attr = JSON.stringify(data);
					attr = attr.replace(/"/g, "'");
					let marker = L.marker(
						{
							lat: data.LAT,
							lng: data.LON
						},
						{
							icon: L.divIcon({
								className: "marker-dianwu-container",
								data: data,
								html: `<marker-container highlight type="${type}" marker-data="${attr}">`
							})
						}
					);
					marker.on("click", p => {
						// 设置点击事件
						setMarkerClickHandler(type, data, p);
					});
					return marker;
				}
				function getPopperSize(subType = "") {
					if (subType === "") {
						return;
					}
					switch (subType) {
						case "dw_gdsb": {
							return {
								width: 350,
								height: 250
							};
						}
						case "dw_4g": {
							return {
								width: 350,
								height: 400
							};
						}
						case "dw_lksb": {
							return {
								width: 350,
								height: 250
							};
						}
						case "dw_lksb_w": {
							return {
								width: 350,
								height: 250
							};
						}
						case "dw_dccxsb": {
							return {
								width: 350,
								height: 300
							};
						}
					}
				}
				function setMarkerClickHandler(subType = "", item, p) {
					if (subType === "") {
						return;
					} else {
						if ($vm.drawFlag || $vm.rangingFlag) return;
						$vm.detailMarker && $vm.detailMarker.remove();
						console.log("显示详情", item);
						if (item.LAT === undefined) {
							item.LAT = item.GPS_POINT_Y;
						}
						if (item.LON === undefined) {
							item.LON = item.GPS_POINT_X;
						}
						let attr = JSON.stringify(item);
						attr = attr.replace(/"/g, "'");
						let size = getPopperSize(subType);
						// Popper弹框图层
						let popper = L.divIcon({
							className: "detail-pop-container",
							iconSize: [10, 10],
							popupAnchor: [0, 0],
							html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${20}px, ${size.height -
								40}px, 0px); bottom: 0px;">
									<a class="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
									<div class="leaflet-popup-content-wrapper marker-houqing-info-popup">
										<div class="leaflet-popup-content no-padding" style="position:relative;width:${
											size.width
										}px;height: ${size.height}px;">
											<i class="${"marker-dianwu-info-tip " + subType}"></i>
											<popper-container type="${subType}" popper-data="${attr}" popper-width="${
								size.width
							}" popper-height="${size.height}"></popper-container>
										</div>
									</div>
									<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
							   </div>`
						});
						$vm.detailMarker = L.marker(
							{
								lat: item.LAT,
								lng: item.LON
							},
							{
								icon: popper
							}
						).addTo($vm.map);
					}
				}
				console.log(e);
			},
			/**
			 * 显示地震大屏需要的Markers
			 */
			setEarthquakeViewMarkers() {
				eqObj.filterEarthquakeMarkers();
				// let mapInstance = this.$refs['myMap']
				// mapInstance.filterEarthquakeViewMarker()
			},
			/** 获取地震数据，数据从地图中传上来
			 * @param {Object} data 数据源
			 * @param {Object} earthId 地震ID
			 */
			getEarthquake(data, earthId) {
				this.earthquakeData = data;
				this.earthquakeDataNow = data;
        this.$store.commit('earthquake/updateEqList', data)
				this.earthquakeDataOld = eqObj.data.eqOther.listOld;
				if (data.length > 0) {
					const row = data.find(v => v.earthId === earthId) || data[0]; //则选中第一条数据，否则筛选出匹配数据并选中
					this.earthquakeRowClick(row, false, true);
				} else {
					this.curEq = {};
					this.effectData = [];
					eqObj.data.eqOther.effectShow = false; //隐藏地图中地震影响线路
				}
			},
			//获取地震影响范围
			getEffectData(row, isInit = false) {
				console.log("影响范围", row.IMPORT_TYPE);
        earthquake.updateEarthquakeEffects(row)
				if (row.IMPORT_TYPE == "0") {
					C.getDataP123(
						{
							s: [[row.earthId]],
							c: "eqeh_zxy2008",
							a: "【eqeh_zxy2008】获取地震影响范围",
							url: "https://10.192.126.203/GeneralProServlet", //接口地址
							async: true
						},
						r => {
							console.log(r);
							if (r && r["1"][0].EQ_INFLUENCE !== "") {
								const source = JSON.parse(r["1"][0].EQ_INFLUENCE);
								const effectD = [];
								source.forEach((row, index) => {
									if (row.RECOVERY === 0) {
										const d = row.DATA["1"]; //影响线路
										row.seq = row.NO;
										row.glbS = d[0];
										row.glbTextS = d[0].LINE_KM_DIS;
										row.glbE = d[1];
										row.glbTextE = d[1].LINE_KM_DIS;
										if (this.earthquakeNowFlag) {
											row.jdq =
												row.LEVEL === "1"
													? row.DATA["2"].filter(
															j => j.RECOVERY === "0"
													  )
													: []; //继电器
										} else {
											row.jdq = row.DATA["2"]; //继电器(历史，则所有都看)
										}
										row.clickable = true;
										effectD.push(row);
									}
								});
								this.effectData = effectD;
								console.log("effectData updated", this.effectData);
								if (effectD.length > 0) {
									let effectRow =
										effectD.find(
											e => e.seq === this.curEffect.seq
										) || effectD[0]; //从数据中找到当前选择的线路
									console.log("CURRENT EFFECT ROW", effectRow);
									// debugger
									this.setEarthquakeEffectLineId(effectRow); //设置地震影响线路
								} else {
									//没有影响线路
									earthquake.updateEarthquakeEffects(row)
									// this.effectData = [];
									// this.curEffect = {};
									// eqObj.data.eqOther.effectShow = false; //隐藏地图中地震影响线路
								}
							} else {
								//没取到数据
								earthquake.updateEarthquakeEffects(row)
								// this.effectData = [];
								// this.curEffect = {};
								// eqObj.data.eqOther.effectShow = false; //隐藏地图中地震影响线路
							}
						}
					);
				} else if (row.IMPORT_TYPE == "1") {
					console.log("获取文件导入地震影响区段数据");
					C.getDataP123(
						{
							s: [[row.earthId]],
							c: "eqeh_zxy2023",
							url: "https://10.192.34.79/ky203/GeneralProServlet", //接口地址
							async: true
						},
						r => {
							if (r["1"].length === 0) {
								this.effectData = [];
								this.curEffect = {};
								eqObj.data.eqOther.effectShow = false; //隐藏地图中地震影响线路
							} else {
								const source = r["1"];
								let effectD = [];
								console.log("获取影响范围", source);
								source.map(s => {
									s.seq = "";
									s.glbS = "";
									s.glbTextS = s["O_KM"];
									s.glbTextE = s["E_KM"];
									s.glbE = "";
									s.jdq = [];
									s["LINE_NAME"] = s["L_NAME"];
									s["clickable"] = false;
									effectD.push(s);
								});
								this.effectData = effectD;
								console.log("effectData updated", this.effectData);
								// 摄像机移动至发生位置
								if (!isInit) {
									let firstSection = this.effectData[0];
									this.$refs["myMap"].setMapView(
										[
											parseFloat(row.EQ_LAT),
											parseFloat(row.EQ_LON)
										],
										10
									);
								}
							}
						}
					);
				}
			},
			// 恢复地震
			huiFu(row) {
				window.event.stopPropagation(); // 事件处理过程中，阻止了事件冒泡，但不会阻止默认行为
				window.event.preventDefault(); // 事件处理过程中，不阻止事件冒泡，但阻止默认行为
				eqObj.huiFuEarthquake(
					row,
					row.IMPORT_TYPE === "0" ? this.effectData : []
				);
				if (this.curEq.EQ_ID === row.EQ_ID) {
					this.effectData = [];
				}
			},
			// 选中当前地震影响线路
			setEarthquakeEffectLineId(row) {
				if (row.clickable) {
					this.curEffect = row;
					eqObj.data.eqOther.addShow = false;
					eqObj.data.eqOther.effectShow = true;
					this.$nextTick(() => {
						console.log("指定显示一条影响线路", row);
						// this.eqOther.effectLineId = lid;
						eqObj.data.eqOther.curEffectKey = row.seq;
						eqObj.data.eqOther.curEarthId = this.curEq.EQ_ID;
						eqObj.data.eqOther.effectGlb = [
							parseInt(row.glbS.LINE_M),
							parseInt(row.glbE.LINE_M)
						];
						eqObj.data.eqOther.effectLines = this.effectData;
					});
				}
			},
			handleYjEventClick(event) {
				if (this.yjCenterLayer) {
					this.$refs["myMap"].map.removeLayer(this.yjCenterLayer);
				}
				let targetStn = event.zhanming.split("-")[0];
				console.log("显示应急响应事件", event, targetStn);
				let yjCenterMarker = L.marker(
					[parseFloat(event.GPS_POINT_Y), parseFloat(event.GPS_POINT_X)],
					{
						icon: L.divIcon({
							className: "emergency-event-pointer",
							html: `<marker-container type="emergency" marker-data="${JSON.stringify(
								event
							).replace(/"/g, "'")}"></marker-container>`
						})
					}
				);
				yjCenterMarker.bindPopup(
					`<popper-container type="emergency" popper-data="${JSON.stringify(
						event
					).replace(/"/g, "'")}"></popper-container>`,
					{
						className: "emergency-popper-class"
					}
				);
				this.$refs["myMap"].map.setView(
					[parseFloat(event.GPS_POINT_Y), parseFloat(event.GPS_POINT_X)],
					10
				);
				this.yjCenterLayer = yjCenterMarker;
				this.$refs["myMap"].map.addLayer(this.yjCenterLayer);
				// this.$refs["myMap"].jumpToStn(targetStn);
			}
			/////////////////////////////////////////////////////// 地震相关
		},
		watch: {
			// 'currentRenderingSection': {
			// 	deep: true,
			// 	handler: function (newVal) {
			// 		if (JSON.stringify(newVal) !== '{}') {
			// 			let center = newVal.STATIONLIST[0]
			// 			if (center !== undefined) {
			// 				this.$refs["myMap"].map.setView([
			// 					parseFloat(center.GPS_POINT_Y),
			// 					parseFloat(center.GPS_POINT_X)
			// 				])
			// 			}
			// 		}
			// 	}
			// }
		},
		beforeDestroy() {
			localStorage.clear();
		}
	};
</script>

<style scoped="scoped">
	.lay {
		position: relative;
		width: 100%;
		height: 100%;
		background: #2c324c;
		overflow: hidden;
		color: white;
	}

	/* 顶部 */
	.lay-top {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 70px;
	}

	.lay-main {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.log {
		position: absolute;
		top: 0;
		left: 50%;
		margin-left: -960px;
		height: 72px;
		width: 1920px;
		background: url(img/log.png) no-repeat;
		z-index: 520;
	}

	.map-con {
		width: 100%;
		height: 100%;
	}

	.light-title {
		position: absolute;
		top: 0;
		left: 0;
		width: 415px;
		z-index: 450;
		height: 60px;
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: flex-start;
		align-items: center;
	}

	.light-title .light-title-logo {
		display: inline-block;
		width: 33px;
		height: 37px;
		background: url(../../components/map/img/wayLog.png) no-repeat;
		background-size: 100% 100%;
		z-index: 401;
		margin-left: 15px;
		margin-right: 15px;
	}

	.right-con {
		position: absolute;
		top: 0px;
		right: -500px;
		bottom: 0px;
		width: 500px;
		padding-top: 60px;
		padding-left: 70px;
		background: url(img/rightBg.png) no-repeat;
		z-index: 999;
	}

	.right-con.show {
		right: 0px;
	}

	.eq-log {
		vertical-align: top;
		width: 150px;
		height: 100%;
		background: url(img/1.gif) no-repeat;
		background-position: 20px 30px;
		text-align: center;
	}

	.table-row-bg {
		background: url(img/2.png) no-repeat;
		background-size: 100% 36px;
		background-position: 0px 3px;
	}

	.split {
		position: absolute;
		left: 0;
		height: 30px;
		width: 1px;
		margin-top: -6px;
		border-left: 1px solid #71afdc;
	}

	.light-panel {
		width: 50px;
		height: calc(100vh - 60px);
		position: absolute;
		right: 0;
		top: 60px;
		background-color: transparent;
		z-index: 450;
		transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
	}

	.dark-panel {
		width: 50px;
		height: calc(100vh - 60px);
		position: absolute;
		right: 0;
		top: 50px;
		/*background-color: transparent;*/
		z-index: 450;
		transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
	}

	.light-panel-show {
		width: 500px;
		position: absolute;
		right: 0;
		top: 60px;
		height: calc(100vh - 60px);
		background-color: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(3px);
		z-index: 450;
		transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
	}

	.dark-panel-show {
		width: 500px;
		position: absolute;
		right: 0;
		top: 50px;
		height: calc(100vh - 60px);
		/*background-color: rgba(255, 255, 255, 0.7);*/
		/*backdrop-filter: blur(3px);*/
		z-index: 450;
		transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
	}

	.hide-switch {
		background: url(./img/switch.png);
		width: 29px;
		height: 56px;
		background-size: 100% 100%;
		display: inline-block;
		z-index: 451;
		position: absolute;
		right: 471px;
		top: 440px;
		transition: right 0.4s ease-in-out;
	}

	.hide-switch.dark-switch {
		right: 405px !important;
		transition: none !important;
	}

	.unhide-switch {
		background: url(./img/switch.png);
		transform: rotate(180deg);
		width: 29px;
		height: 56px;
		background-size: 100% 100%;
		display: inline-block;
		z-index: 451;
		position: absolute;
		right: 0;
		top: 440px;
		transition: right 0.4s ease-in-out;
	}

	.unhide-switch.dark-switch {
		transition: none !important;
	}

	.light-effect {
		position: absolute;
		left: 40px;
		top: 160px;
		width: 500px;
		height: 700px;
		background-color: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(1px);
		z-index: 450;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.light-effect .effect-row {
		width: 500px;
		height: 70px;
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e7e9ee;
		transition: background-color ease-in-out 0.5s;
	}

	.light-effect .effect-row-selected {
		width: 500px;
		height: 70px;
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e7e9ee;
		background-color: rgba(0, 0, 0, 0.1);
		transition: background-color ease-in-out 0.5s;
	}

	.light-effect .effect-row:hover {
		background-color: rgba(0, 0, 0, 0.1);
		transition: background-color ease-in-out 0.5s;
		cursor: pointer;
	}

	.light-effect .effect-row .row-index {
		background: url(./img/effect_row.png) no-repeat;
		width: 21px;
		height: 30px;
		background-size: 100% 100%;
		margin-left: 10px;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
	}

	.light-effect .effect-row .row-content {
		height: 60px;
		width: 390px;
		margin: 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.light-effect .effect-row .row-content .row-line-name {
		height: 25px;
	}

	.light-effect .effect-row .row-content .row-line-section {
		height: 25px;
	}

	.light-effect .effect-row .row-type {
		height: 40px;
		width: 40px;
		margin-right: 15px;
	}

	.light-effect .effect-row .row-type .plan-xs {
		height: 100%;
		width: 100%;
		background-color: #fbdd1f;
		border-radius: 100%;
	}

	.light-effect .effect-row .row-type .plan-fs {
		height: 100%;
		width: 100%;
		background-color: #e1513b;
		border-radius: 100%;
	}

	.light-effect .effect-row-selected .row-index {
		background: url(./img/effect_row.png) no-repeat;
		width: 21px;
		height: 30px;
		background-size: 100% 100%;
		margin-left: 10px;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
	}

	.light-effect .effect-row-selected .row-content {
		height: 60px;
		width: 390px;
		margin: 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.light-effect .effect-row-selected .row-content .row-line-name {
		height: 25px;
	}

	.light-effect .effect-row-selected .row-content .row-line-section {
		height: 25px;
	}

	.light-effect .effect-row-selected .row-type {
		height: 40px;
		width: 40px;
		margin-right: 15px;
		border-radius: 100%;
	}

	.light-effect .effect-row-selected .row-type .plan-xs {
		height: 100%;
		width: 100%;
		background-color: #fbdd1f;
		border-radius: 100%;
	}

	.light-effect .effect-row-selected .row-type .plan-fs {
		height: 100%;
		width: 100%;
		background-color: #e1513b;
		border-radius: 100%;
	}

	.earthquake-light-panel {
		padding: 30px;
		height: 100%;
		width: 100%;
	}

	.earthquake-light-panel .earthquake-brief {
		height: 200px;
		width: 100%;
		background-color: white;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
		border-radius: 15px;
		padding: 5px;
	}

	.earthquake-light-panel .earthquake-list {
		height: 250px;
		width: 100%;
		background-color: white;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
		border-radius: 15px;
		margin-top: 25px;
		padding: 5px;
	}

	.earthquake-light-panel .earthquake-effect-list {
		height: 350px;
		width: 100%;
		background-color: white;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
		border-radius: 15px;
		margin-top: 25px;
		padding: 5px;
	}

	.earthquake-panel-title {
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: center;
		width: 100%;
		height: 30px;
		margin-top: 15px;
	}

	.earthquake-panel-title > span {
		color: #5eb0f3;
		font-size: 18px;
		font-weight: bold;
	}

	.earthquake-light-panel .earthquake-brief .earthquake-panel-brief {
		margin-right: 15px;
		margin-left: 15px;
		width: calc(100% - 30px);
		height: 120px;
	}

	.earthquake-light-panel
		.earthquake-brief
		.earthquake-panel-brief
		.earthquake-light-logo {
		background: url(./img/earthquake_light.gif);
		background-size: 100% 100%;
		width: 80px;
		height: 100px;
	}

	.earthquake-light-panel
		.earthquake-brief
		.earthquake-panel-brief
		.earthquake-light-place {
		width: calc(100% - 180px);
		height: 100%;
	}

	.earthquake-list .earthquake-list-table {
		margin-left: 15px;
		margin-right: 15px;
		height: calc(100% - 50px);
	}

	.el-icon-refresh-left:hover {
		cursor: pointer;
		color: #5eb0f3;
	}

	.el-icon-data-analysis:hover {
		cursor: pointer;
		color: #5eb0f3;
	}

	.el-icon-location:hover {
		cursor: pointer;
		color: #5eb0f3;
	}

	.el-icon-tickets:hover {
		cursor: pointer;
		color: #5eb0f3;
	}

	>>> .el-table td {
		border: 0;
	}

	>>> .el-table th {
		border: 0;
	}

	.earthquake-effect-list .earthquake-effect-table {
		margin-left: 15px;
		margin-right: 15px;
		height: calc(100% - 50px);
	}

	.history-upload-locations >>> .el-table .el-table__expanded-cell {
		background-color: transparent;
	}

	.history-upload-locations >>> .el-table th {
		background-color: rgba(0, 0, 0, 0) !important;
		z-index: 0 !important;
	}

	.history-upload-locations >>> .el-table tr {
		background-color: transparent !important;
		z-index: 0 !important;
		color: white;
	}

	.history-upload-locations >>> .el-table .el-table__expanded-cell {
		background-color: transparent;
	}

	.yj-event {
		width: 413px;
		height: 112px;
		margin-bottom: 15px;
		background: url("./img/yjEvent.png") no-repeat;
		background-size: 100% 100%;
		display: flex;
	}

	.yj-event-level {
		font-size: 30px;
		color: #00f6ff;
		font-weight: bold;
		text-shadow: 0 0 7px #00f6ff;
	}

	.back-to-normal-button {
		position: absolute;
		left: 10px;
		top: 10px;
		z-index: 9999;
	}
</style>
<style>
</style>
