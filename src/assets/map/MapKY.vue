<!-- 
 * @created：	2021年8月24日
 * @author：	ch
 * @version:	v1.0
 * @desc:		客运地图模板
 -->
<template>
	<div style="width: 100%;height: 100%;">
		<div style="position: fixed;top:0;left:0;border: 1px solid #ddd;background: #EEEEEE;z-index: 500;">
			<el-button @click="geoBufferAnalystProcess">测试</el-button>
			<el-button @click="remove">移除车</el-button>
		</div>
		<div ref="map" class="map-con"></div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				map: null,
				// 天地图地址
				baseLayersUrl: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
				// baseLayersUrl: "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
				// 铁路线图地址
				lineLayerUrl: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine",
				// 四川重庆详细地图地址
				sccqUrl: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-MapClip/rest/maps",
				// 天地图中心点
				// mapCenterPoint: [29.87600725249192, 107.5441221573846], //成都
				mapCenterPoint: [29.9532539232503, 104.449862462555], //成都
				// 可缩放比例尺
				scaleDenominators: [
					36978669,
					18489335,
					9244667,
					4622334,
					3081556,
					2311167,
					1540778,
					1155583,
					770389,
					577792,
					288896,
					144448,
					72224,
					36112,
					18056,
					9028
				],
				zoom: 1, //默认缩放倍数
				maxZoom: 11, //最大缩放16
				minZoom: 1, //最小缩放，

				// 所有图层
				layers: {
					qiaoLiang: null, //桥梁
					suiDao: null //遂道
				},
				// 当前点击对象
				curClickObj: {
					qiaoSuiId: "" //桥遂id
				},
				// 详细信息popup层
				popups: {
					qiaoSui: null
				}
			};
		},
		// 属性
		props: {
			// 全国铁路线路图
			roalLayer: {
				type: Boolean,
				default: true
			},
			//四川重庆详细地图
			sccqLayer: {
				type: Boolean,
				default: true
			}
		},
		// 组件挂载完毕
		mounted() {
			document.querySelector("title").innerHTML = "客运地图";
			this.initMap();
			this.getTrains();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			initMap() {
				//自定义坐标系
				const crs = L.Proj.CRS("EPSG:3857", {
					origin: this.mapCenterPoint,
					scaleDenominators: this.scaleDenominators
				});
				//边界
				const cornerLeftUp = L.latLng(70, 30);
				const cornerRightDown = L.latLng(-10, 175);
				const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown);
				this.map = L.map(this.$refs.map, {
					crs: crs,
					center: this.mapCenterPoint, //中心点
					maxZoom: this.maxZoom, //最大缩放
					minZoom: this.minZoom, //最小缩放
					zoom: this.zoom, //默认缩放
					maxBounds: bounds, //区域
					zoomControl: false, //显示缩放按钮
					logoControl: false, //supermap水印
					attributionControl: false //水印文本,可以传字符串进行自定义
				});
				// 载入天地图
				L.supermap
					.tiledMapLayer(this.baseLayersUrl, {
						transparent: true
					})
					.addTo(this.map);
				// 载入四川重庆详细地图
				if (this.sccqLayer) {
					L.supermap
						.tiledMapLayer(this.sccqUrl, {
							transparent: true
						})
						.addTo(this.map);
				}
				// 载入全国铁路线
				if (this.roalLayer) {
					L.supermap
						.tiledMapLayer(this.lineLayerUrl, {
							transparent: true
						})
						.addTo(this.map);
				}
				// 地图缩放事件
				this.map.on("zoomend", this.onMapZoom);
				// this.map.on("click", (e) => {
				// 	console.log(e.latlng)
				// 	this.geoBufferAnalystProcess(e)
				// });
			},
			// 地图缩放事件
			onMapZoom(e) {
				const newZoom = e.target._zoom;
				const val = newZoom / 5;
				// const oldCss = C.$(".qiao-sui-other-con").css("transform", "scale(" + val + ")")
			},
			/* @info  数据处理区-----------------------------------*/
			geoBufferAnalystProcess(e) {
				// var point = new SuperMap.LonLat(e.latlng.lng, e.latlng.lat);
				// console.log("latlng", point)
				// // var point = new SuperMap.LonLat(-71.147,42.472);
				// point.transform("EPSG:4326", "EPSG:3857")

				var bufferAnalystService,
					geoBufferAnalystParams,
					resultLayer,
					queryService,
					queryByGeometryParameters,
					resultLayer1;
				var serviceUrl =
					"http://10.194.72.181:8090/iserver/services/spatialAnalysis-TieLuTu-2/restjsr/spatialanalyst";
				var marker = L.marker([28.356617529426945, 104.79395736314595]).addTo(
					this.map
				);
				// var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
				// 				var cir = L.circle([e.latlng.lat, e.latlng.lng], {
				// 					color: 'black',
				// 					radius: 50000
				// 				}).addTo(this.map);
				bufferAnalystService = L.supermap.spatialAnalystService(serviceUrl);
				//对生成的线路进行缓冲区分析
				geoBufferAnalystParams = new SuperMap.GeometryBufferAnalystParameters({
					sourceGeometry: marker,
					sourceGeometrySRID: 4326,
					bufferSetting: new SuperMap.BufferSetting({
						endType: SuperMap.BufferEndType.ROUND,
						radiusUnit: SuperMap.BufferRadiusUnit.METER,
						leftDistance: new SuperMap.BufferDistance({
							value: 50000
						}),
						rightDistance: new SuperMap.BufferDistance({
							value: 50000
						}),
						semicircleLineSegment: 0
					})
				});
				bufferAnalystService.bufferAnalysis(
					geoBufferAnalystParams,
					serviceResult => {
						console.log(serviceResult);
						resultLayer = L.geoJSON(serviceResult.result.resultGeometry).addTo(
							this.map
						);
						//console.log(serviceResult.result.resultGeometry.geometry.coordinates[0][0])
						var aa = serviceResult.result.resultGeometry.geometry.coordinates[0];
						var pointsList = aa[0];
						var DZ = [];
						for (var i = 0; i < pointsList.length; i++) {
							var xx = pointsList[i][0];
							var yy = pointsList[i][1];
							var cor = [yy, xx];
							// var point = new SuperMap.LonLat(e.latlng.lng, e.latlng.lat);
							// console.log("latlng", point)
							var point = new SuperMap.LonLat(xx, yy);
							// point.transform("EPSG:4326", "EPSG:3857")
							// var marker = L.marker(point).addTo(this.map);
							DZ[i] = cor;
						}
						console.log(DZ);
						var polygon = L.polygon(DZ, {
							color: "red"
						}).addTo(this.map);
						// polygon = L.Polygon(DZ, {
						// 	color: 'red'
						// }).addTo(this.map);
						// //console.log(DZ)
						// //console.log(polygon)
						this.overlayAnalystProcess(polygon);

						//var polygon = L.polygon(DZ, {color: 'blue'}).addTo(map);
						//console.log(polygon)

						//查询出缓冲区内信号影响范围内的工厂
						// queryService = L.supermap.queryService(baseUrl);
						// queryByGeometryParameters = new SuperMap.QueryByGeometryParameters({
						//     queryParams: [new SuperMap.FilterParameter({name: "全国高铁线@铁路"})],
						//     geometry: resultLayer,
						//     spatialQueryMode: SuperMap.SpatialQueryMode.INTERSECT
						// });
						// queryService.queryByGeometry(queryByGeometryParameters, function (serviceResult) {
						//     var result = serviceResult.result;
						//     console.log(result)
						//     resultLayer1 = L.geoJSON(result.recordsets[0].features).addTo(map);
						// });

						// var geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
						//     datasetNames: ["铁路:全国高铁线"],
						//     geometry: resultLayer,
						//     spatialQueryMode: SuperMap.SpatialQueryMode.INTERSECT,
						// 	toIndex:-1
						// });
						// L.supermap
						//     .featureService(dataservice)
						//     .getFeaturesByGeometry(geometryParam, function (serviceResult) {
						//     console.log(serviceResult);
						//         resultLayer = L.geoJSON(serviceResult.result.features).addTo(map);
						//     });
					}
				);

				// 				var overlayAnalystProcess = (polygon) => {
				//
				// 				}
			},
			overlayAnalystProcess(polygon) {
				console.log(polygon);
				var serveUel =
					"http://10.194.72.181:8090/iserver/services/spatialAnalysis-TieLuTu-2/restjsr/spatialanalyst";
				const overlayAnalystService = L.supermap.spatialAnalystService(serveUel);
				const datasetOverlayAnalystParameters = new SuperMap.DatasetOverlayAnalystParameters({
					// sourceDataset: "全国铁路线_1@铁路",
					sourceDataset: "空间分析用线_1@kfknew",
					operateRegions: [polygon],
					tolerance: 0.000001,
					operation: SuperMap.OverlayOperationType.CLIP
				});
				console.log(
					"datasetOverlayAnalystParameters" + datasetOverlayAnalystParameters
				);
				overlayAnalystService.overlayAnalysis(
					datasetOverlayAnalystParameters,
					serviceResult => {
						var result = serviceResult.result;
						console.log(result);
						resultLayer = L.geoJSON(result.recordset.features).addTo(this.map);
					}
				);
			},

			serviceAreas(e) {
				var findServiceAreasService,
					parameter,
					analystParameter,
					resultSetting,
					centersArray,
					weightsArray;
				var point = new SuperMap.Geometry.Point(e.layerPoint.x, e.layerPoint.y);
				// var point = new SuperMap.LonLat(e.latlng);
				// 29.828752719344454  103.74783487370607
				var point = new SuperMap.LonLat(e.latlng.lng, e.latlng.lat);
				console.log("latlng", point);
				// var point = new SuperMap.LonLat(-71.147,42.472);
				point.transform("EPSG:4326", "EPSG:3857");
				console.log("3857", point);
				const marker = L.marker(e.latlng, {
					icon: L.divIcon({
						className: "weather-icon-container",
						iconSize: [30, 30],
						popupAnchor: [5, 5],
						html: `<div class="marker-weather">1</div>`
					})
				});
				marker.addTo(this.map);
				// var point = new SuperMap.LonLat(e.layerPoint.x,e.layerPoint.y)
				// point.transform("EPSG:3857","EPSG:4326")
				// point.transform("EPSG:4326","EPSG:3857")
				console.log(point);
				centersArray = [{
					y: point.lat,
					x: point.lon
				}];
				weightsArray = [1000 * 50];
				// 交通网络分析结果参数
				resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
					returnEdgeFeatures: true, //是否在分析结果中包含弧段要素集合
					returnEdgeGeometry: true, //返回的弧段要素集合中是否包含集合对象信息
					returnEdgeIDs: true, //返回的结果中是否包含经过弧段ID集合
					returnNodeFeatures: true, //返回的分析结果是否包含结点要素集合
					returnNodeGeometry: true, //返回的结点要素集合中是否包含集合对象信息
					returnNodeIDs: true, //返回的分析结果中是否包含经过结点ID集合
					returnPathGuides: true, //返回分析结果中是否包含行驶导引集合
					returnRoutes: true //返回结果中是否包含路由对象集合
				});
				// 交通网络分析通用参数
				analystParameter = new SuperMap.REST.TransportationAnalystParameter({
					resultSetting: resultSetting, //分析结果返回的内容
					weightFiledName: "length" //阻力字段的名称
				});
				parameter = new SuperMap.REST.FindServiceAreasParameters({
					centers: centersArray, //服务站点数组
					isAnalyzeById: false, //是否通过节点ID指定路径分析的结点
					weights: weightsArray //每个服务站点提价服务的阻力半径
				});
				// 定义服务区分析服务
				// var url =
				// "http://10.192.125.55:8090/iserver/services/transportationanalyst-sample/rest/networkanalyst/RoadNet@Changchun";
				var url =
					"http://10.194.72.181:8090/iserver/services/transportationAnalyst-WeiXingDiTu/rest/networkanalyst/铁路_Network@铁路";
				findServiceAreasService = new SuperMap.REST.FindServiceAreasService(url, {
					eventListeners: {
						processCompleted: this.processCompleted,
						processFailed: this.processFailed
					}
				});
				//向服务端发送请求
				findServiceAreasService.processAsync(parameter);
			},
			processCompleted(findServiceAreasEventArgs) {
				this.layerTest = L.layerGroup();
				this.layerTest.addTo(this.map);
				console.log("成功", findServiceAreasEventArgs);
				var result = findServiceAreasEventArgs.originResult,
					features = [];
				if (result.serviceAreaList) {
					result.serviceAreaList.forEach(sa => {
						sa.serviceRegion.points.forEach(p => {
							var point = new SuperMap.LonLat(p.x, p.y);
							point.transform("EPSG:3857", "EPSG:4326");
							features.push(point);
						});
					});
				}
				console.log("features", features);
				// var lastPoint = JSON.parse(JSON.stringify(obj[0]));
				// obj.push(lastPoint);
				// let antPath = L.polyline.antPath(features, {
				// 	"paused": false, //暂停 初始化状态
				// 	"reverse": false, //方向反转
				// 	"delay": 2000, //延迟，值越大越慢
				// 	"dashArray": [10, 20], //间隔样式
				// 	"weight": 1, //线宽
				// 	"color": "gray", //颜色
				// 	"opacity": 1, //透明度
				// 	"pulseColor": "white", //块颜色
				// 	// "fillOpacity" : 1,//
				// });
				features = features.splice(1);
				let line = new L.polyline(features, {
					//临时虚线
					dashArray: 5
				});
				line.addTo(this.map);
			},
			processFailed(processFailedArgs) {
				console.log("错误", processFailedArgs);
			},
			/* @info  数据交互区-----------------------------------*/
			getTrains() {
				C.getDataP123({
					c: "eqeh_zxy2002",
					a: "【eqeh_zxy2002】在途车客运段站",
					url: C.ADDS.servGS, //接口地址
					async: true,
				}, (r) => {
					let d = [];
					if (r) {
						d = r["1"].concat(r["2"]).concat(r["3"]); //.concat(r["4"]).concat(r["5"]).concat(r["8"]);
					}
					this.createMarkerCluster(d)
				});
			},
			/**
			 * 绘制可聚合marker簇
			 * @param source  图标数据源
			 * @returns {*}   绘制好的图标Cluster
			 */
			createMarkerCluster(source) {
				this.group = L.markerClusterGroup({
					zoomToBoundsOnClick: true,
					maxClusterRadius: 20,
					iconCreateFunction: (cluster) => {
						const len = cluster.getAllChildMarkers().length;
						if (len > 1) {
							return L.divIcon({
								className: "train-icon-container",
								html: `<span style="background:blue;color:white;">${len}</span>`,
							})
						} else {
							return cluster.getAllChildMarkers()[0].options.icon
						}
					}
				})
				source.map((train) => {
					let marker = L.marker({
						lon: train.LON,
						lat: train.LAT
					}, {
						icon: L.divIcon({
							className: "train-icon-container",
							data: train,
							html: `<span style="background:blue;color:white;">${train.TRAIN}</span>`,
						})
					});
					this.group.addLayer(marker)
				})
				this.group.addTo(this.map);
			},
			remove() {
				// 筛选选定的单位管界
				// debugger;
				this.group.getLayers().map((layer) => {
					if(layer.options.icon.options.data.TRAIN==="G401"){
						this.group.removeLayer(layer)
					}
				});
				// this.group.clearLayers()
				this.group.refreshClusters()
				// this.group.getFeatureGroup().pm.getLayers().map((layer) => {
				// 	this.map.removeLayer(layer)
				// })
			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {}
	};
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.map-con {
		position: relative;
		width: 100%;
		height: 100%;
		display: inline-block;
		background: #01081b;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
	.qiao-sui-other-con {
		width: 100%;
		height: 100%;
		transition: all 0.3s;
		transform-origin: center;
	}
</style>
<!-- iconAnchor: i === 0 ? (p2Flag?[0, 13]:[12, 13]) :(p2Flag? [12, 13]:[0, 13]), -->
