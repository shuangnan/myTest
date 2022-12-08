<!--
 * @created：	2021年2月25日
 * @author：	ch
 * @version:	v1.0
 * @desc:		客运段大屏
 -->
<template>
    <div style="width:100%;height:100%;positino:relative;">
        <div ref="map" class="map-con"></div>
    </div>
</template>

<script>
import C from "../../../assets/com.js";
import mt from "../../../assets/map/tools.js";
import flyBlLayerUtil from "../../../assets/map/flyBlLayerUtil.js";
//绘制多边形
var points = [],
    geometry = [],
    dbxLi = [];
var lines = new L.polyline([]);
var tempLines = new L.polyline([], { dashArray: 5 });
export default {
    data() {
        return {
            dialogVisible: false,
            trainInfoPath: "",
            map: null,
            // 铁路线图
            lineLayers: null,
            // 铁路线图地址
            lineLayerUrl:
                "https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7bq2/rest/maps/RoadLine7bq2",
            // lineLayerUrl: "https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine3/rest/maps/RoadLine3",
            dongcheSelected: true,
            pusuSelected: true,
            huoyunSelected: true,
            //动车组标记图层
            trainMarkerLayerDongche: null,
            // 普速
            trainMarkerLayerPusu: null,
            //货车标记图层
            trainMarkerLayerCargo: null,
            // 集群图层
            markerClusterLayer: null,
            selectedPolygon: null,
            roadQgLayer:null,
            roadSccqLayer:null,
        };
    },
    props: {
        bgColor: {
            type: String,
            default: ""
        },
        bdColor: {
            type: String,
            default: ""
        },
        colorOpacity: {
            type: String,
            default: ""
        },
        editFlag: {
            type: Boolean,
            default: "",
        }
    },
    created() { },
    mounted() {
        mt.setVue(this);
        mt.initMap(this, {
            el: this.$refs.map,
            zoom: 1,
            minZoom: 1,
            // 中心点
            mapCenterPoint: [27.536233, 106.807438], //遵义
            // 可缩放比例尺
            scaleDenominators: [
                4622334,
                6081556,
                2311167,
                1540778,
                1155583,
                770389,
                577792,
                288896,
                144448
            ],
            // 天地图
            // baseLayersUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-chinamap/rest/maps/china_map",
            // baseLayersUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
            baseLayersUrl:
                "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3"
        });
        if (this.lineLayers === null) {
            this.baseLayers = L.supermap
                .tiledMapLayer(this.lineLayerUrl, {
                    transparent: true
                })
                .addTo(this.map);
        }
        //初始化一下图标集合图层
        this.markerClusterLayer = L.markerClusterGroup({
            zoomToBoundsOnClick: false,
            maxClusterRadius: 20,
            disableClusteringAtZoom: 3,
            iconCreateFunction: cluster => {
                return cluster.getAllChildMarkers()[0].options.icon;
            }
        });
        this.map.addLayer(this.markerClusterLayer);
        this.map.doubleClickZoom.disable();
        // 加载铁路线
        var tlUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7bq3/rest/maps/RoadLine7bq3';
		this.roadQgLayer = L.supermap.tiledMapLayer(tlUrl, {
			// opacity: $vm.config.superMap.zoom >= 5 ? 0 : 1,//$vm.config.superMap.zoom >= 5 ? 0 : 1,
			transparent: true
		}).addTo(this.map);
        //四川重庆铁路线
        var tlSccqUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7bq22/rest/maps/RoadLine7bq2';
		this.roadSccqLayer = L.supermap.tiledMapLayer(tlSccqUrl, {
			// opacity: $vm.config.superMap.zoom >= 5 ? 1 : 0,
			transparent: true
		}).addTo(this.map);
        // this.getStations();
    },
    components: {},
    methods: {
        openEditFlag() {
            this.map.on("click", this.mapClick); //点击地图
            this.map.on("dblclick", this.mapDoubleClick);//双击地图
            this.map.on("mousemove", this.mapMove);
        },
        closeEditFlag() {
            this.map.off("click"); //
            this.map.off("dblclick"); //
            this.map.off("mousemove"); //
        },
        mapClick(e) {
            if (points.length > 0) {
                var lastPoint = points[points.length - 1];
                if (lastPoint[0] == e.latlng.lat && lastPoint[1] == e.latlng.lng) {
                    return;
                }
            }
            points.push([e.latlng.lat, e.latlng.lng]);
            lines.addLatLng(e.latlng);
            this.map.addLayer(tempLines);
            this.map.addLayer(lines);
            const node = L.circle(e.latlng, {
                color: "#ff0000",
                fillColor: "ff0000",
                fillOpacity: 1
            });
            this.map.addLayer(node);
            geometry.push(node);
        },
        mapDoubleClick() {
            this.addPolygon(points);
            this.clearEditcircle();
            points = [];
            lines.remove();
            lines = new L.polyline([]);
            // this.closeEditFlag();
            this.$emit("changeEditDataFlag", true);
        },
        mapMove(e) {
            if (points.length > 0) {
                let ls = [
                    points[points.length - 1],
                    [e.latlng.lat, e.latlng.lng],
                    points[0]
                ];
                tempLines.setLatLngs(ls);
            }
        },
        clearEditcircle() {
            geometry.forEach(v => {
                v.remove();
            });
            tempLines.remove();
            tempLines = new L.polyline([], { dashArray: 5 });
        },
        clearEidtAll() {
            this.clearEditcircle();
            dbxLi.forEach(v => {
                v.remove();
            });
            dbxLi = [];
        },
        delTarget() {
            var removeList = [];
            dbxLi.forEach(v => {
                if (v.options.selectFlag) {
                    removeList.push(v);
                }
            });
            if (removeList.length == 0) {
                this.$message.error("请选择需要删除的区域");
                return;
            }
            this.$confirm('确认删除选中区域?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeList.forEach(v => {
                    this.delCircleMove(v.options.CID);
                    v.remove();
                });
                dbxLi = dbxLi.filter(v => {
                    return !v.options.selectFlag
                })
                this.$emit("changeEditDataFlag", true);
            }).catch(() => { });
        },
        getPolygonPoints() {
            var PolygonPoints = [];
            dbxLi.forEach(v => {
                console.log(v);
                var item = [];
                v.editing.latlngs[0][0].forEach(m => {
                    item.push([m.lat, m.lng]);
                })
                PolygonPoints.push(item);
            })
            return PolygonPoints;
        },
        saveEdit(ppoints) {
            this.clearEidtAll();
            ppoints.forEach(v => {
                this.addPolygon(v);
            });
        },
        addPolygon(polyInt) {
            var plyall = new L.Polygon(polyInt, {
                color: this.bdColor + this.colorOpacity,
                fillColor: this.bgColor + this.colorOpacity,
                realColor: this.bdColor + this.colorOpacity,
                selectFlag: false,
                CID: C.getUuid(),
            });
            if (this.editFlag) {
                plyall.on("click", (e, data) => {
                    var options = plyall.options;
                    console.log("属性", options);
                    if (options.selectFlag) {
                        plyall.setStyle({
                            color: options.realColor,
                            selectFlag: false,
                        });
                        this.delCircleMove(options.CID);
                    } else {
                        plyall.setStyle({
                            color: "green",
                            selectFlag: true,
                        })
                        plyall.editing.latlngs[0][0].forEach((m, i) => {
                            this.addCircleMove(options.CID, m, i, plyall.editing.latlngs[0][0], plyall);
                        })
                    }
                });
            }
            plyall.addTo(this.map);
            dbxLi.push(plyall);
        },

        reloadDraw() {
            this.clearEditcircle();
            dbxLi.forEach(v => {
                v.setStyle({
                    color: this.bdColor + "7c",
                    fillColor: this.bgColor + "7c"
                })
            })
        },
        getStations() {
            C.getDataP123(
                {
                    c: "eqeh_zxy2003",
                    url: C.ADDS.servGS, //接口地址
                },
                r => {
                    const stationLayer = L.layerGroup();
                    r["1"].forEach(s => {
                        let flag = false;
                        if (s.GIS_KHTYPE.indexOf("客运") > -1) {
                        }
                        if (s.GIS_KHTYPE.indexOf("货运") > -1) {
                        }
                        if (s.BUREAU === "成都铁路局") {
                            flag = true;
                        }
                        if (flag) {
                            let marker = L.marker(
                                {
                                    lon: s.GPS_POINT_X,
                                    lat: s.GPS_POINT_Y
                                },
                                {
                                    icon: L.divIcon({
                                        iconSize: [100, 26],
                                        className: "station-icon-container",
                                        html: `<span style="color:#fafafa;font-size:12px;">${s.STN_NAME}</span>`
                                    })
                                }
                            );
                            this.markerClusterLayer.addLayer(marker);
                        }
                    });
                    // this.map.addLayer(stationLayer);
                }
            );
        },
        addCircleMove(CID, latlng, index, latlngs, plyall) {
            let markerIcon = L.divIcon({
                html: "<div></div>",
                className: "qygjwh_areaCircle",
            })
            const node = L.marker(latlng, {
                icon: markerIcon,
                CID: CID,
                draggable: true,
            });
            var lastIndex = index - 1;
            var nextIndex = index + 1;
            if (lastIndex < 0) {
                lastIndex = latlngs.length - 1;
            }
            if (nextIndex > (latlngs.length - 1)) {
                nextIndex = 0;
            }
            var lastLatlng = latlngs[lastIndex];
            var nextLatlng = latlngs[nextIndex];
            node.on("mousedown", (e, data) => {
                console.log("aaaa");
                this.map.dragging.disable(); //地图允许拖动
                this.map.doubleClickZoom.disable(); //地图允许双击放大
                this.map.scrollWheelZoom.disable(); //地图允许鼠标滚轮缩放
                // tempLines = new L.polyline([], { dashArray: 5 });
                this.map.addLayer(tempLines);
                lastLatlng = latlngs[lastIndex];
                nextLatlng = latlngs[nextIndex];
                console.log("mousedown");
            }).on("mouseup", (e, data) => {
                this.map.dragging.enable(); //地图允许拖动
                this.map.doubleClickZoom.enable(); //地图允许双击放大
                this.map.scrollWheelZoom.enable(); //地图允许鼠标滚轮缩放
                tempLines.remove();
                latlngs[index] = e.latlng;
                plyall.setLatLngs(latlngs);
                lastLatlng = latlngs[lastIndex];
                nextLatlng = latlngs[nextIndex];
                console.log("mouseup");
                this.$emit("changeEditDataFlag", true);
            }).on("mousemove", (e, data) => {
                let ls = [
                    lastLatlng,
                    [e.latlng.lat, e.latlng.lng],
                    nextLatlng
                ];
                tempLines.setLatLngs(ls);
                console.log("mousemove");
            });
            this.map.addLayer(node);
            geometry.push(node);
        },
        delCircleMove(CID) {
            geometry = geometry.filter(v => {
                var flag = true;
                var options = v.options;
                if (options.CID == CID) {
                    v.remove();
                    flag = false;
                }
                return flag;
            })
        }
    }
};
</script>

<style scoped="scoped">
.map-con {
    width: 100%;
    height: 100%;
    display: inline-block;
    /* background: transparent; */
    background-color: rgba(255, 255, 255, 0);
}

.selector {
    border-radius: 10px;
    margin: 10px;
    z-index: 1000;
    opacity: 0.4;
    transition: opacity 0.2s ease-in;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: absolute;
    padding: 10px;
    bottom: 32px;
    left: 25%;
    background: rgba(13, 26, 88, 0.8);
    height: 160px;
    width: 100px;
}

.selector:hover {
    opacity: 1;
}
.areaCircle {
}
</style>
<style>
.qygjwh_areaCircle {
    height: 15px;
    width: 15px;
    border-radius: 100%;
    border: 2px solid red;
}
</style>
