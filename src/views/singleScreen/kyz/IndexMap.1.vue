<!--
 * @created：	2021年2月25日
 * @author：	ch
 * @version:	v1.0
 * @desc:		客运段大屏
 -->
<template>
	<div @keydown.17="ctrlFlag=true" @keyup.17="ctrlFlag=false" style="width:100%;height:100%;positino:relative;">
		<div v-show="lastMapZoom>2" style="position: absolute;top:80px;left:50%;margin-left:-100px;width: 200px;z-index: 410;">
			<el-input size="mini" prefix-icon="el-icon-search" placeholder="输入车次名定位..." clearable v-model="filterTrainStr"
			 @change="filterTrain"></el-input>
		</div>
		<div class="filter">
			<div class="list" :class="{'open':tipVisible}">
				<div style="display:inline-block;">
					<el-checkbox-group v-model="layerFilters" @change="filterLayers">
						<el-checkbox label="普车"></el-checkbox>
						<el-checkbox label="桥普车"></el-checkbox>
						<el-checkbox label="隧道普车"></el-checkbox>
						<el-checkbox label="动车"></el-checkbox>
						<el-checkbox label="桥动车"></el-checkbox>
						<el-checkbox label="隧道动车"></el-checkbox>
						<el-checkbox label="桥梁"></el-checkbox>
						<el-checkbox label="隧道"></el-checkbox>
					</el-checkbox-group>
				</div>

				<div style="float:right;margin-top:0px">
					<el-image :src="callImg" @click="toolClick('openXiaoYu')" style="width: 40px;height: 40px;vertical-align: middle;"></el-image>
				</div>
				<div v-show="lastMapZoom===1||lastMapZoom===2" style="padding-top: 10px;">
					<div>当前查看时间：{{flyHours}}点</div>
					<el-slider v-model="flyHours" show-stops :show-tooltip="false" :max="23"></el-slider>
				</div>
				<!-- <div v-show="lastMapZoom>2" style="width: 100%;padding-bottom: 5px;padding-top: 10px;">
					<el-button type="primary" size="small" icon="el-icon-news" @click="startDraw">{{drawFlag}}</el-button>
					<el-button type="primary" size="small" @click="toolClick('openTask')">指派任务</el-button>
					<el-button type="primary" size="small" @click="toolClick('openMsg')">发送消息</el-button>
				</div> -->
			</div>
		</div>
		<div ref="map" class="map-con" @click="onMapClick"></div>
	</div>
</template>



<script>
	import store from '../../../store'
	import C from "../../../assets/com.js"
	import mt from "../../../assets/map/tools.js"
	import flyBlLayerUtil from "../../../assets/map/flyBlLayerUtil.js"
	import websoketMsg from "../../../assets/websoketMsg.js"

	const noStn = [];
	let allFlayData = [];
	export default {
		data() {
			return {
				map: null,
				// 铁路线图
				lineLayers: null,
				// 铁路线图地址
				lineLayerUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine",
				// 成都详细地图
				chengduLayers: null,
				chengduDetailUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-chengduCity/rest/maps/chengduCity",
				// 图层---小图标
				layersMin: {
					PC_Layer: null, //普车
					PQ_Layer: null, //桥普车
					PS_Layer: null, //隧普车
					DC_Layer: null, //动车
					DQ_Layer: null, //桥动车
					DS_Layer: null, //隧动车
				},
				// 图层---大图标
				layersBig: {
					PC_Layer: null, //普车
					PQ_Layer: null, //桥普车
					PS_Layer: null, //隧普车
					DC_Layer: null, //动车
					DQ_Layer: null, //桥动车
					DS_Layer: null, //隧动车
				},
				keyOfLayers: {
					"普车": "PC_Layer",
					"桥普车": "PQ_Layer",
					"隧道普车": "PS_Layer",
					"动车": "DC_Layer",
					"桥动车": "DQ_Layer",
					"隧道动车": "DS_Layer",
				},
				// 管辖区域图层
				compassLayer: null,
				// 飞行图层
				flayLayer: null,
				allFlayOptions: [],
				flyHours: (new Date()).getHours(),
				flyInterval: null,
				// 桥梁图层
				qiaoliangLayer: null,
				qiaoliangData: [],
				// 隧道图层
				suidaoLayer: null,
				suidaoData: [],
				// 当前飞行图数据
				curFlyData: [],
				// 所有车数据
				trainData: [],
				// 当前查看列车ID
				curTrainId: "",
				// 当前查看桥遂ID
				curQiaoSuiId: "",
				lastMapZoom: 1,
				// 过滤图层
				// layerFilters: ["特快","直达","快车","旅游车","普速","高铁","动车","城际列车","空送/动检车", "桥梁", "隧道"]
				layerFilters: ["普车", "桥普车", "隧道普车", "动车", "桥动车", "隧道动车", "桥梁", "隧道"],
				lateLimit: 30, //晚点标记时间阀
				filterTrainStr: "", //搜索车次
				drawFlag: "框选车次",
				ctrlFlag: false, //Ctrl键是否按下,
				kuangXuanTrains: [], //已框选车
				ctrlTrains: [], //点选车
				// 加载等待信息
				loading: null,
				interValTrain: null,
				callImg: require('./img/vidio.png'),
			}
		},
		props: {
			oid: {
				type: String,
				default: ""
			},
			tipVisible: {
				type: Boolean,
				default: false,
			}
		},
		mounted() {
			websoketMsg.init({
				onmessage: (msg) => {
					const $train = C.$("#" + msg.TRAIN);
					if ($train.length > 0) {
						this.trainMessageArr($train, msg);
					}
				}
			});
			// 绑定 查看列车统计图方法
			this.loading = this.$loading({
				lock: true,
				text: '正在加载地图数据...',
				spinner: 'el-icon-loading',
				background: 'rgba(0,0,0,0.7)',
				customClass: 'loading1'
			});
			window.showTrainCharts = (trainid) => this.showTrainCharts(trainid);
			// return;
			mt.setVue(this);
			setTimeout(() => {
				mt.initMap(this, {
					el: this.$refs.map,
					zoom: this.lastMapZoom,
					minZoom: 1,
					maxZoom: 11,
					// 中心点
					mapCenterPoint: [30.660903, 104.064289], //成都
					// 可缩放比例尺(包含全国层级)
					scaleDenominators: [36978669, 18489335, 9244667, 4622334, 3081556, 2311167, 1540778, 1155583, 770389, 577792,
						288896, 144448, 72224, 36112, 18056, 9028
					],
					// 天地图
					baseLayersUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
					// 成都详细地图
					// baseLayersUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-chengduCity/rest/maps/chengduCity",
				}, () => {
					if (this.lineLayers === null) {
						this.lineLayers = L.supermap.tiledMapLayer(this.lineLayerUrl, {
							transparent: true
						}).addTo(this.map);
					}
					this.map.on("zoomend", this.onMapZoom);
					this.map.on("click", (params) => {
						// console.log(params.latlng)
					});
					this.loading.setText("正在加载列车数据...");
					//查询桥遂
					this.getData_qiaoliang(() => {
						//this.drawLinesTest()
						this.getData_onRoadTrain(); //查询列车
					});
					if (this.interValTrain) {
						clearInterval(this.interValTrain);
					}
					this.interValTrain = setInterval(() => {
						this.getData_onRoadTrain();
					}, 1000 * 60 * 10);
					//获取全国客运车站字典（带经纬度）
					if (this.$store.state.dicAllStation.length === 0) {
						C.getDataP123({
							url: "http://10.192.126.203:9088/admin/kydp/execute",
							c: "kydp_zxy2023"
						}, (r) => {
							store.commit("updateDicAllStation", r["1"]);
							this.getData_flyTrain(); //查询飞行图列车
						});
					} else {
						this.getData_flyTrain(); //查询飞行图列车
					}
					this.queryPolygonPoints(); //查询管辖区域
				});
			}, 200);
		},
		components: {},
		methods: {
			// 查看列车统计信息
			showTrainCharts(trainid) {
				let item = this.trainData.find(v => v.TRAIN_ID === trainid);
				// this.$message.error('查看统计信息！')
			},
			onMapClick() {
				if (!this.ctrlFlag) {
					this.ctrlTrains = [];
					C.$(".ctrl-select").removeClass("ctrl-select");
				}
			},
			startDraw() {
				this.kuangXuanTrains = [];
				if (this.drawFlag === "框选车次") {
					mt.openEditFlag();
					this.drawFlag = "取消框选";
				} else {
					mt.clearEidtAll();
					C.$(".kuang-xuang").removeClass("kuang-xuang");
					this.drawFlag = "框选车次";
				}
			},
			// 框选结束
			endDrawLines(points) {
				const extTrains = [];
				C.$(".kuang-xuang").removeClass("kuang-xuang");
				this.trainData.forEach(train => {
					const p = {
						x: train.LAT,
						y: train.LON
					};
					if (mt.isPointInPoly(p, points)) {
						C.$("#" + train.TRAIN).addClass("kuang-xuang");
						extTrains.push(train);
					}
				});
				this.kuangXuanTrains = extTrains;
				console.log("extTrains", extTrains);
			},
			filterTrain() {
				const d = this.trainData.filter(v => v.TRAIN.indexOf(this.filterTrainStr.toUpperCase()) > -1);
				if (d.length > 0) {
					C.$(".filtered").removeClass("filtered");
					// this.map.setView([d[0].LAT, d[0].LON]); //重置地图大小和中心点
					this.map.panTo([d[0].LAT, d[0].LON], {
						animate: true
					}); //平移地图
					C.$("#" + d[0].TRAIN).addClass("filtered");
				} else {
					this.$message.error('未找到指定车次！');
				}
			},
			// 地图缩放事件
			onMapZoom(e, init) {
				const LS = this.lastMapZoom;
				const newZoom = init === true ? this.lastMapZoom : e.target._zoom;
				// 1-2层 飞行图
				// 3-5层 点状车
				// 5层上 图标车
				console.log("当前层级", newZoom)
				if (newZoom === 1 || newZoom === 2) {
					if (this.flayLayer === null) {
						// this.drawFly();
					}
					LS > 2 && this.changeCarOrFlyLayer("fly");
				} else if (newZoom === 3 || newZoom === 4 || newZoom === 5) {
					const {
						PC_Layer,
						PQ_Layer,
						PS_Layer,
						DC_Layer,
						DQ_Layer,
						DS_Layer
					} = this.layersMin;
					if (PC_Layer === null && PQ_Layer === null && PS_Layer === null && DC_Layer === null && DQ_Layer === null &&
						DS_Layer === null) {
						this.drawTrainsMin();
					}
					(LS < 3 || LS > 5) && this.changeCarOrFlyLayer("carMin");
				} else {
					const {
						PC_Layer,
						PQ_Layer,
						PS_Layer,
						DC_Layer,
						DQ_Layer,
						DS_Layer
					} = this.layersBig;
					if (PC_Layer === null && PQ_Layer === null && PS_Layer === null && DC_Layer === null && DQ_Layer === null &&
						DS_Layer === null) {
						this.drawTrainsBig();
					}
					LS < 6 && this.changeCarOrFlyLayer("carBig");
				}
				// 桥遂三角形图标缩放
				if (newZoom > 3) {
					C.$(".marker-qiaosui").addClass("big");
				} else {
					C.$(".marker-qiaosui").removeClass("big");
				}
				// 成都详细地图
				if (newZoom > 3) {
					this.map.removeLayer(this.lineLayers);
					if (this.chengduLayers === null) {
						this.chengduLayers = L.supermap.tiledMapLayer(this.chengduDetailUrl, {
							transparent: true
						}).addTo(this.map);
					} else {
						this.map.addLayer(this.chengduLayers);
					}
					this.map.addLayer(this.lineLayers);
				} else {
					if (this.chengduLayers !== null) {
						this.map.removeLayer(this.chengduLayers);
					}
					this.map.addLayer(this.lineLayers);
				}
				this.lastMapZoom = newZoom;
			},
			//当车次筛选栏变化时调用函数
			filterLayers(val) {
				if (this.checkLayerCheckFlag("桥梁")) {
					this.qiaoliangLayer && this.map.addLayer(this.qiaoliangLayer);
				} else {
					this.qiaoliangLayer && this.map.removeLayer(this.qiaoliangLayer);
				}

				if (this.checkLayerCheckFlag("隧道")) {
					this.suidaoLayer && this.map.addLayer(this.suidaoLayer);
				} else {
					this.suidaoLayer && this.map.removeLayer(this.suidaoLayer);
				}
				// 1-2层 飞行图
				// 3-5层 点状车
				// 5层上 图标车
				if (this.lastMapZoom === 3 || this.lastMapZoom === 4 || this.lastMapZoom === 5) {
					C.$.each(this.keyOfLayers, (k, v) => {
						if (this.checkLayerCheckFlag(k)) {
							this.layersMin[v] && this.map.addLayer(this.layersMin[v]); //显示
						} else {
							this.layersMin[v] && this.map.removeLayer(this.layersMin[v]); //移除
						}
					});
				} else if (this.lastMapZoom > 5) {
					C.$.each(this.keyOfLayers, (k, v) => {
						if (this.checkLayerCheckFlag(k)) {
							this.layersBig[v] && this.map.addLayer(this.layersBig[v]); //显示
						} else {
							this.layersBig[v] && this.map.removeLayer(this.layersBig[v]); //移除
						}
					});
				}
			},

			// 切换列车与飞行图层
			changeCarOrFlyLayer(mapView) {
				this.flayLayer && this.map.removeLayer(this.flayLayer); //删除飞行图
				C.$.each(this.keyOfLayers, (k, v) => {
					this.layersMin[v] && this.map.removeLayer(this.layersMin[v]); //移除-小图标
					this.layersBig[v] && this.map.removeLayer(this.layersBig[v]); //移除-大图标
				});
				// 小图标列车
				if (mapView === "carMin") {
					C.$.each(this.keyOfLayers, (k, v) => {
						if (this.checkLayerCheckFlag(k)) {
							this.layersMin[v] && this.map.addLayer(this.layersMin[v]); //显示
						}
					});
				}
				// 大图标列车
				else if (mapView === "carBig") {
					C.$.each(this.keyOfLayers, (k, v) => {
						if (this.checkLayerCheckFlag(k)) {
							this.layersBig[v] && this.map.addLayer(this.layersBig[v]); //显示
						}
					});
					this.checkLayerCheckFlag("动车") && this.layersBig.dc_D && this.map.addLayer(this.layersBig.dc_D); //动车
				}
				// 飞行图
				else if (mapView === "fly") {
					this.map.addLayer(this.flayLayer);
				}
			},
			// 检查图层是否允许显示
			checkLayerCheckFlag(txt) {
				return this.layerFilters.indexOf(txt) > -1;
			},
			// 判断列车类型
			getTrainType(txt) {
				// const typeStr = "TZKYGDC0"; //特快、直达、快速、旅游、高铁、动车、城际列车、空送/动检车
				const typeStr = "GDC0"; //特快、直达、快速、旅游、高铁、动车、城际列车、空送/动检车
				const first = txt.substring(0, 1);
				return typeStr.indexOf(first) > -1 ? first : "P";
			},
			// 绘制所有列车（仅图标）
			drawTrainsMin() {
				this.layersMin.PC_Layer = L.layerGroup(); //普车
				this.layersMin.PQ_Layer = L.layerGroup(); //桥普车
				this.layersMin.PS_Layer = L.layerGroup(); //隧普车
				this.layersMin.DC_Layer = L.layerGroup(); //动车
				this.layersMin.DQ_Layer = L.layerGroup(); //桥动车
				this.layersMin.DS_Layer = L.layerGroup(); //隧动车
				this.trainData.forEach(train => {
					let marker = this.creatTrainMarker(train, true);
					this.layersMin[marker.trainType + "_Layer"].addLayer(marker);
				});
				C.$.each(["PC", "PQ", "PS", "DC", "DQ", "DS"], (i, key) => {
					this.layersMin[key + "_Layer"].addTo(this.map)
				});
			},
			// 绘制所有列车（带车次）
			drawTrainsBig: function() {
				this.layersBig.PC_Layer = L.layerGroup(); //普车
				this.layersBig.PQ_Layer = L.layerGroup(); //桥普车
				this.layersBig.PS_Layer = L.layerGroup(); //隧普车
				this.layersBig.DC_Layer = L.layerGroup(); //动车
				this.layersBig.DQ_Layer = L.layerGroup(); //桥动车
				this.layersBig.DS_Layer = L.layerGroup(); //隧动车
				this.trainData.forEach(train => {
					let marker = this.creatTrainMarker(train, false);
					this.layersBig[marker.trainType + "_Layer"].addLayer(marker);
				});
				C.$.each(["PC", "PQ", "PS", "DC", "DQ", "DS"], (i, key) => {
					this.layersBig[key + "_Layer"].addTo(this.map)
				});
			},
			creatTrainMarker(train, isPoint) {
				let iconUrl = this.getMarkerIconImage(train, isPoint);
				let trainIcon = L.divIcon({
					className: "train-icon-container",
					iconSize: isPoint ? [14, 14] : [80, 20],
					iconAnchor: isPoint ? [7, 7] : [0, 20],
					data: train,
					// html: `<div class="${iconUrl.cls}" style="position:relative"><img src="${iconUrl.iconUrl}"></div>`,
					html: isPoint ?
						`<div id="${train.TRAIN}" class="${iconUrl.cls} train-min-point ${iconUrl.trainType}" style="position:relative"><i></i></div>` :
						`<div id="${train.TRAIN}" class="map-train ${iconUrl.cls} ${iconUrl.trainType}" style="position:relative">
							<img src="${iconUrl.iconUrl}">
							<span class="num">${train.TRAIN}</span>
							<i></i>
						  </div>`,
				});
				let marker = L.marker({
					lon: train.LON,
					lat: train.LAT
				}, {
					icon: trainIcon
				});
				marker.trainType = iconUrl.trainType;
				this.setTrainMarkerClick(marker, train); //设置列车marker的鼠标事件
				return marker;
			},
			// 桥遂marker点击事件
			setQiaoSuiMarkerClick(marker, data) {
				//设置列车marker的鼠标事件
				marker.on("click", (e) => {
					$('.leaflet-popup').remove();
					// const trainInfoPath = 'http://10.194.72.27:8080/#/qiaoSuiInfo?name=' +data.BRI_HOLE_NAME+'&line='+data.LINE_NAME;
					const trainInfoPath = 'http://' + window.location.hostname + ':9090/JFLCMS/vue/#/qiaoSuiInfo?name=' + data.BRI_HOLE_NAME +
						'&line=' + data.LINE_NAME;
					let nameDivIcon = L.divIcon({
						className: 'textFonts',
						iconSize: [10, 10],
						popupAnchor: [0, 0],
						html: `<div id="qiaoSuiDetailInfo" class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -0px, 0px); bottom: 0px; left:-350px;">
									<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
									<div class = "leaflet-popup-content-wrapper blue">
									<div class="leaflet-popup-content no-padding" style="width:700px;height: 325px;">
										<div><h2 style="margin:0;padding-left:5px;">${data.BRI_HOLE_NAME}<span style="font-weight:400;font-size:14px;margin-left:10px;"></span></h2></div>
										<div id="popupLoading" style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:0;padding:150px 300px;">加载中,请稍候...</div>
										<iframe src="${trainInfoPath}" style="height: 300px;width: 100%;margin-left:-1px;border-radius:10px;" frameborder="0"></iframe>
									</div>
									</div>
									<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
									<div class="leaflet-popup-tip blue"></div></div>
								</div>`
					});
					L.marker(e.latlng, {
						icon: nameDivIcon
					}).addTo(this.map);
					setTimeout(() => {
						C.$("#popupLoading").remove();
					}, 1000);
				});
			},
			// 列车marker点击事件
			setTrainMarkerClick(marker, train) {
				marker.on("click", (e) => {
					// Ctrl键按下，则为选择车
					if (this.ctrlFlag) {
						if (this.ctrlTrains.indexOf(train) > -1) {
							this.ctrlTrains.splice(this.ctrlTrains.indexOf(train), 1);
							C.$("#" + train.TRAIN).removeClass("ctrl-select");
						} else {
							C.$("#" + train.TRAIN).addClass("ctrl-select");
							this.ctrlTrains.push(train);
						}
						return;
					}
					C.$(".ctrl-select").removeClass("ctrl-select");
					$('.leaflet-popup').remove();
					const {
						UserName,
						UserPID,
						Oid,
						Oname
					} = this.$store.state.params;
					// const pathPrev = "http://10.194.72.27:8082/#/trainTravelInfo?UserName="+UserName+"&UserPID="+UserPID;
					const pathPrev = "http://" + window.location.hostname + ":9090/JFLCMS/vue/#/trainTravelInfo?UserName=" +
						UserName + "&UserPID=" + UserPID + "&Oid=" + Oid + "&Oname=" + Oname;
					const trainInfoPath = pathPrev + '&id=' + train.TRAIN_ID + '&cc=' + train.TRAIN;
					let nameDivIcon = L.divIcon({
						className: 'textFonts',
						iconSize: [10, 10],
						popupAnchor: [0, 0],
						html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -25px, 0px); bottom: 0px; left:-260px;">
								<div class="leaflet-popup-tools">
									<a>操作</a>
									<ul>
										<li onclick="window.showTrainCharts('${train.TRAIN_ID}')">查看统计</li>
										<li>拨打电话</li>
									</ul>
								</div>
								<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
								<div class = "leaflet-popup-content-wrapper blue">
								<div class="leaflet-popup-content no-padding" style="position:relative;width:700px;height: 325px;">
									<div><h2 style="margin:0;padding-left:110px;font-size:14px;">${train.TRAIN}</h2></div>
									<div id="popupLoading" style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:0;padding:150px 300px;">加载中,请稍候...</div>
									<iframe src="${trainInfoPath}" style="height: 300px;width: 100%;margin-left:-1px;border-radius:10px;" frameborder="0"></iframe>
								</div>
								</div>
								<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
								<div class="leaflet-popup-tip blue"></div></div>
							   </div>`
					});
					L.marker([train.LAT, train.LON], {
						icon: nameDivIcon
					}).addTo(this.map);
					setTimeout(() => {
						C.$("#popupLoading").remove();
					}, 1000);
				});
			},
			// 绘制飞行图
			drawFly(options) {
				this.flayLayer && this.map.removeLayer(this.flayLayer); //删除飞行图
				this.flayLayer = L.supermap.echartsLayer(options);
				if (this.lastMapZoom === 1 || this.lastMapZoom === 2) {
					this.flayLayer.addTo(this.map);
				}
			},
			// 获取晚点样式
			getLateClass(train, ty) {
				let lateCls = "";
				let times = parseInt(train.EDTIME);
				if (ty === "D") {
					if (times >= 10 && times < 30) {
						lateCls = "wd-train late10_30";
					} else if (times >= 30 && times < 60) {
						lateCls = "wd-train late30_60";
					} else if (times >= 60) {
						lateCls = "wd-train late60";
					}
				} else {
					if (times >= 60 && times < 120) {
						lateCls = "wd-train late60_120";
					} else if (times >= 120 && times < 180) {
						lateCls = "wd-train late120_180";
					} else if (times >= 180) {
						lateCls = "wd-train late180";
					}
				}
				return {
					late: lateCls !== "",
					cls: lateCls
					// cls: "wd-train"
				};
			},
			// 获取列车对应图标
			getMarkerIconImage: function(data, isMini) {
				let iconUrl = "";
				let lateObj = {};
				// const qsFlag = this.isNearQiaoSui(data);//判断是否在桥隧上
				const qFlag = Math.random() > 0.8;
				const sFlag = Math.random() > 0.6;
				if (data.TRAIN.includes("D") || data.TRAIN.includes("G") || data.TRAIN.includes("C")) {
					lateObj = this.getLateClass(data, "D");
					lateObj.trainType = "DC";
					iconUrl = require("./img/普通动车.png");
					// if (qFlag) {
					// 	lateObj.trainType = "DQ";
					// 	iconUrl = require("./img/桥动车.png");
					// } else if (sFlag) {
					// 	lateObj.trainType = "DS";
					// 	iconUrl = require("./img/隧道动车.png");
					// }
				} else {
					// this.isNearQiaoSui(data)
					lateObj = this.getLateClass(data, "P");
					lateObj.trainType = "PC";
					iconUrl = require("./img/普车.png");
					// if (qFlag) {
					// 	lateObj.trainType = "PQ";
					// 	iconUrl = require("./img/桥普车.png");
					// } else if (sFlag) {
					// 	lateObj.trainType = "PS";
					// 	iconUrl = require("./img/隧道普车.png");
					// }
				}
				return {
					iconUrl: iconUrl,
					...lateObj
				};
			},
			// 绘制管辖区域
			drawLines(obj) {
				// let antPath = L.polyline.antPath(obj, {
				// 	"paused": true, //暂停 初始化状态
				// 	"reverse": false, //方向反转
				// 	"delay": 1000, //延迟，值越大越慢
				// 	"dashArray": [10, 10], //间隔样式
				// 	"weight": 2, //线宽
				// 	"color": "#b0d7e1", //颜色
				// 	"opacity": 0.5, //透明度
				// 	"pulseColor": "#b0d7e1", //块颜色
				// 	"fillOpacity" : 0.5,//
				// });
				let antPath = L.polyline(obj, {
					"weight": 2, //线宽
					"color": "#b0d7e1", //颜色
					"opacity": 0.5, //透明度
				});
				this.compassLayer = antPath.addTo(this.map);
			},
			/**
			 * 在途列车消息处理
			 * @param {Object} el
			 * @param {Object} msgTrain
			 */
			trainMessageArr(el, msgTrain) {
				if (this.lastMapZoom > 2) {
					// 当前站===终到站，为终到车，则延迟从地图中移除
					const isEnd = msgTrain.CURRNAME === msgTrain.ENDNAME;

					let layerObj = {};
					// 1-2层 飞行图
					// 3-5层 点状车
					// 5层上 图标车
					if (this.lastMapZoom === 3 || this.lastMapZoom === 4 || this.lastMapZoom === 5) {
						layerObj = this.layersMin;
					} else {
						layerObj = this.layersBig;
					}
					let hasFlag = false; //此车是否在地图中存在

					C.$.each(layerObj, (i, markerLayer) => {
						if (markerLayer) {
							const layers = markerLayer._layers;
							C.$.each(layers, (_key, layer) => {
								const options = layer.options.icon.options;
								if (options.data.TRAIN === msgTrain.TRAIN) {
									hasFlag = true;
									if (options.data.LAT === msgTrain.LAT || options.data.LON === msgTrain.LON) {
										//console.warn(msgTrain.TRAIN+"：收到列车消息【动车】，但位置未发生改变"+ (new Date()).Format("hh:mm:ss"),msgTrain)
									} else {
										// console.warn("【动车】" + msgTrain.TRAIN + " 位置改变" + (new Date()).Format("hh:mm:ss") + "," + options.data.LAT +
										// 	":" + options.data.LON + ">" + msgTrain.LAT + ":" + msgTrain.LON, msgTrain);
										el.addClass("filtered");
										options.data.LAT = msgTrain.LAT;
										options.data.LON = msgTrain.LON;
										layer.setLatLng([msgTrain.LAT, msgTrain.LON]);
									}
									// 终到车
									if (isEnd) {
										console.warn("终到车：" + msgTrain.TRAIN, msgTrain);
										setTimeout(() => {
											delete layers[_key];
											layer.removeFrom(this.map);
										}, 1000 * 60 * 5);
									}
								}
							});
						}
					});
					if (isEnd) return; //终到车，则停止
					// 地图中没有此车
					if (hasFlag === false) {
						console.warn("始发车：" + msgTrain.TRAIN, msgTrain);
						const isPoint = this.lastMapZoom === 3 || this.lastMapZoom === 4 || this.lastMapZoom === 5;
						let markerBig = this.creatTrainMarker(msgTrain, false);
						let markerMin = this.creatTrainMarker(msgTrain, true);
						const trainType = this.getTrainType(msgTrain.TRAIN); //TZKYGDC0 P
						if (this.layersMin[marker.trainType]) this.layersMin[marker.trainType]._layers[msgTrain.TRAIN] = isPoint ?
							markerMin.addTo(this.map) : markerMin;
						if (this.layersBig[marker.trainType]) this.layersBig[marker.trainType]._layers[msgTrain.TRAIN] = isPoint ?
							markerBig : markerBig.addTo(this.map);
					}
				}
			},
			/* @info  数据交互区-----------------------------------*/
			// 获取桥遂数据
			getData_qiaoliang(cb) {
				C.getData({
					c: "trdm_ys_348",
					s: ["ALL", "ALL"],
					a: "获取桥遂数据"
				}, (r) => {
					console.log("桥梁隧道", r)
					const qiaoliangData = [];
					const suidaoData = [];
					let linesQiaoLiang = L.layerGroup(); //桥梁
					let linesSuiDao = L.layerGroup(); //隧道
					C.$.each(r, (index, item) => {
						// BRI_HOLE_NAME 名称
						const points = JSON.parse(item.ALL_COORD);
						item.lonlats = [];
						points.forEach(p => {
							const temp = p.split(",");
							item.lonlats.push([temp[1], temp[0]]);
						});
						// 只有3个点，且全部相同
						let singleFlag = false;
						if (points.length === 3 && points[0] === points[1] && points[1] === points[2]) {
							singleFlag = true;
							// let firstX = item.lonlats[0][0].substring(0, item.lonlats[0][0].length - 1);
							// let firstN = item.lonlats[0][0].substr(-1);
							// item.lonlats[0][0] = firstX + (firstN === '5' ? '4' : '5');
						}
						item.singleFlag = singleFlag;
						// 桥梁
						if (item.BRI_HOLE_TYPE === "0") {
							qiaoliangData.push(item);
							const marker = singleFlag ? L.marker([item.lonlats[0][0], item.lonlats[0][1]], {
								icon: L.divIcon({
									className: 'textFonts',
									iconSize: [10, 10],
									popupAnchor: [5, 5],
									html: `<div class="marker-qiaosui" style="color:#FF9966;transform:scale(0.7)">▲</div>`
								})
							}) : L.polyline(item.lonlats, {
								color: "#FF9966",
								weight: 5
							});
							this.setQiaoSuiMarkerClick(marker, item);
							linesQiaoLiang.addLayer(marker);
						}
						// 隧道
						else if (item.BRI_HOLE_TYPE === "1") {
							suidaoData.push(item);
							const marker = singleFlag ? L.marker([item.lonlats[0][0], item.lonlats[0][1]], {
								icon: L.divIcon({
									className: 'textFonts',
									iconSize: [10, 10],
									popupAnchor: [5, 5],
									html: `<div class="marker-qiaosui" style="color:#6c00d8;transform:scale(0.7)">▲</div>`
								})
							}) : L.polyline(item.lonlats, {
								color: "#6c00d8",
								weight: 5
							});
							this.setQiaoSuiMarkerClick(marker, item);
							linesSuiDao.addLayer(marker);
						}
					});
					this.qiaoliangLayer = linesQiaoLiang.addTo(this.map);
					this.suidaoLayer = linesSuiDao.addTo(this.map);
					this.qiaoliangData = qiaoliangData;
					this.suidaoData = suidaoData;
					cb.call(null)
				});
			},
			//查询飞行图列车
			getData_flyTrain() {
				const oid = this.oid === "c73b368ba6f9702fe0534820c00a00a8" ? "99990002001499A50004" : this.oid.toUpperCase();
				C.getData({
					c: "trdm_ys_347",
					s: [(new Date()).Format("yyyy-MM-dd"), 24],
					o: [oid],
					a: "获取飞行图列车数据"
				}, (r) => {
					// {"START_STN":"重庆西","ARR_TIME":"2021-09-01 00:00:00","TRAIN_NUM_SCH":"0G8511","END_STN":"重庆西动车所","LEV":"0"}
					// console.log("所有车站坐标",this.$store.state.dicAllStationGEO)
					const allData = [];
					r.forEach((data, index) => {
						allData.push(JSON.parse(data));
					});
					const allFlayOptions = []; //所有飞行线数据，分时段
					const geo = this.$store.state.dicAllStationGEO;
					console.log("this.$store.state.dicAllStation", this.$store.state.dicAllStation.length)
					allData.forEach(data => {
						const curData = [];
						data.forEach(item => {
							item.ARR_TIME = item.ARR_TIME.split(" ")[0];
							if (typeof(geo[item.START_STN]) === "undefined" || typeof(geo[item.END_STN]) === "undefined") {} else {
								curData.push([{
									name: item.START_STN
								}, {
									name: item.END_STN,
									value: 1,
									meta: item
								}]);
							}
						});
						let options = flyBlLayerUtil.getFlyOpts([curData], geo);
						allFlayOptions.push(options);
					});
					this.allFlayOptions = allFlayOptions;
					console.log("获取飞行图列车数据", allFlayOptions)
					// 每隔5分钟设置当前显示飞行图时间段
					this.drawFly(this.allFlayOptions[this.flyHours]);
					if (this.flyInterval) {
						clearInterval(this.flyInterval);
					}
					this.flyInterval = setInterval(() => {
						this.flyHours = (new Date()).getHours();
					}, 1000 * 60 * 5);
				});
			},
			// 获取在途车数据
			getData_onRoadTrain() {
				C.getDataP123({
					url: "http://10.192.126.203:9088/admin/dlmo/onRoadTrainData",
					c: "dlmo_zxy2004"
				}, (r) => {
					console.log("全国在途列车", r)
					if (r) {
						this.layersMin.ps_P && this.map.removeLayer(this.layersMin.ps_P); //普速
						this.layersBig.ps_P && this.map.removeLayer(this.layersBig.ps_P); //普速
						this.layersMin.dc_D && this.map.removeLayer(this.layersMin.dc_D); //动车
						this.layersBig.dc_D && this.map.removeLayer(this.layersBig.dc_D); //动车
						// 返回数据// 1：动车组列车// 2：普速客车// 3：货车// 4：晚点客车// 5：告警客车// 6：晚点货车// 7：告警货车// 8：管外车
						this.trainData = r["1"].concat(r["2"]).concat(r["4"]).concat(r["5"]).concat(r["8"]);
						this.onMapZoom(null, true);
					} else {

					}
					this.loading.close();
				});
			},
			//查询管辖区域
			queryPolygonPoints() {
				C.getData({
					c: "trdm_lv_692",
					s: [this.oid.toUpperCase(), "1"],
					async: true,
					a: "获取指定组织机构GIS范围坐标点集合",
          url: 'https://10.192.34.79/TRDM/GeneralProServlet'
				}, (rs) => {
					var points = [];
					let pointsXY = [];
					rs.forEach(v => {
						const p = [parseFloat(v.AREA_X), parseFloat(v.AREA_Y)];
						points.push(p);
						pointsXY.push({
							x: p[0],
							y: p[1]
						});
					});
					this.pointsXY = pointsXY;
					// points.push(points[0]);
					console.log("获取指定组织机构GIS范围坐标点集合", rs)
					this.compassLayer && this.map.removeLayer(this.compassLayer); //删除范围
					if (points.length > 0) {
						const firstX = rs[0].AREA_X.substring(0, rs[0].AREA_X.length - 1);
						const firstN = rs[0].AREA_X.substr(-1);
						points.push([firstX + (firstN === '5' ? '4' : '5'), rs[0].AREA_Y]);
						this.drawLines(points);
					}
				});
			},
			// 工具栏点击事件
			toolClick(ty) {
				if (ty === "openXiaoYu") {
					this.$emit("openXiaoYu");
				} else if (ty === "openTask") {
					this.$emit("openTask", this.getSelectTrains(), this.trainData);
				} else if (ty === "openMsg") {
					this.$emit("openMsg", this.getSelectTrains(), this.trainData);
				}
			},
		},
		watch: {
			"flyHours"(v) {
				this.drawFly(this.allFlayOptions[this.flyHours]);
			},
			"oid"() {
				this.queryPolygonPoints();
				this.getData_flyTrain();
			}
		},
		beforeDestroy() {
			if (this.interValTrain) {
				clearInterval(this.interValTrain);
			}
		}
	}
</script>

<style scoped="scoped">
	.map-con {
		position: relative;
		width: 100%;
		height: 100%;
		display: inline-block;
		background: transparent;
	}

	.filter {
		position: absolute;
		bottom: 0px;
		left: 25%;
		right: 25%;
		height: 90px;
		z-index: 410;
	}

	.filter>.list {
		width: 0;
		height: 0;
		padding: 0px;
		margin: 0;
		border-radius: 10px;
		opacity: 0.8;
		background: rgba(13, 26, 88, 0.9);
		overflow: hidden;
		transition: width .3s;
	}

	.filter>.list.open {
		padding: 10px;
		width: 100%;
		height: 100%;
	}

	>>>.filter>.list .el-checkbox,
	>>>.filter>.list .el-checkbox__input.is-checked+.el-checkbox__label {
		color: #fafafa;
		text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
	}

	>>>.el-input__inner,
	>>>.el-input.is-disabled .el-input__inner,
	>>>.el-textarea__inner {
		background-color: transparent;
		border-color: #5D6375;
		color: #FAFAFA;
	}
</style>
<style>
	.leaflet-marker-icon.train-icon-container:focus {
		outline: none;
	}

	/* 桥遂三角形图标 */
	.marker-qiaosui.big {
		transform: scale(1.2) !important;
	}

	.train-min-point {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #A6ABE2;
	}

	.train-min-point.PC,
	.train-min-point.DC {
		background: #A6ABE2;
	}
	
	.train-min-point.PQ,
	.train-min-point.DQ {
		background: #DAAD3C;
	}
	
	.train-min-point.PS,
	.train-min-point.DS {
		background: #9A52EA;
	}
	
	.map-train>.num {
		position: absolute;
		display: inline-block;
		left: 5px;
		padding-left: 5px;
		right: 0px;
		top: 1px;
		color: white;
		background: transparent;
	}
	
	/* 晚点列车 */
	.wd-train>i {
		position: absolute;
		top: -2px;
		right: 2px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #BD5620;
		animation: trainLateAnimate 1.5s;
		animation-iteration-count: infinite;
		z-index: 10;
	}
	/* 普通 A6ABE2 桥 DAAD3C 隧道 9A52EA */
	.wd-train.PC>.num,
	.wd-train.DC>.num{
		box-shadow: 0 0 20px #A6ABE2;
	}
	.wd-train.PQ>.num,
	.wd-train.DQ>.num{
		box-shadow: 0 0 20px #DAAD3C;
	}
	.wd-train.PS>.num,
	.wd-train.DS>.num{
		box-shadow: 0 0 20px #9A52EA;
	}

	@keyframes trainLateAnimate {
		from {
			opacity: 0.3;
		}

		50% {
			opacity: 1;
			box-shadow: 0 0 1px 2px #BD5620;
		}

		to {
			opacity: 0.3;
		}
	}

	.train-min-point.filtered,
	.filtered>img {
		animation: filteredAnimate 1.5s;
		/* animation-iteration-count: infinite; */
		animation-iteration-count: 3;
	}

	.ctrl-select {
		border: 1px solid sandybrown;
	}

	.kuang-xuang {
		animation: filteredAnimate 1.5s;
		animation-iteration-count: infinite;
	}

	@keyframes filteredAnimate {
		from {
			display: 0.4;
		}

		50% {
			opacity: 1;
			transform: scale(1.5);
		}

		to {
			opacity: 0.4;
		}
	}
</style>
