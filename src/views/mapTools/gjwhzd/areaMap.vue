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

import mt from "../../../assets/map/tools.js"
import flyBlLayerUtil from "../../../assets/map/flyBlLayerUtil.js"
//绘制多边形
var PolygonPoints = [];//最终的多边形点位信息
var points = [], geometry = [], dbxLi = [];
var lines = new L.polyline([])
var tempLines = new L.polyline([], { dashArray: 5 });
export default {
    data() {
        return {
            dialogVisible: false,
            trainInfoPath: '',
            map: null,
            // 铁路线图
            lineLayers: null,
            // 铁路线图地址
            lineLayerUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine",
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
        }
    },
    created() {

    },
    mounted() {
        mt.setVue(this);
        mt.initMap(this, {
            el: this.$refs.map,
            zoom: 1,
            minZoom: 1,
            // 中心点
            mapCenterPoint: [27.536233, 106.807438], //遵义
            // 可缩放比例尺
            scaleDenominators: [4622334, 6081556, 2311167, 1540778, 1155583, 770389, 577792, 288896, 144448],
            // 天地图
            // baseLayersUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-chinamap/rest/maps/china_map",
            baseLayersUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
        });
        if (this.lineLayers === null) {
            this.baseLayers = L.supermap.tiledMapLayer(this.lineLayerUrl, {
                transparent: true
            }).addTo(this.map);
        }

        //初始化一下图标集合图层
        this.markerClusterLayer = L.markerClusterGroup({
            zoomToBoundsOnClick: false,
            maxClusterRadius: 20,
            disableClusteringAtZoom: 8,
            iconCreateFunction: (cluster) => {
                return cluster.getAllChildMarkers()[0].options.icon
            }
        });
        this.map.addLayer(this.markerClusterLayer);
    },
    components: {},
    methods: {
        openEditFlag() {
            this.map.on('click', this.mapClick);    //点击地图
            this.map.on('dblclick', this.mapDoubleClick);
            this.map.on('mousemove', this.mapMove)//双击地图
        },
        mapClick(e) {
            if (points.length > 0) {
                var lastPoint = points[points.length - 1];
                if (lastPoint[0] == e.latlng.lat && lastPoint[1] == e.latlng.lng) {
                    return;
                }
            }
            points.push([e.latlng.lat, e.latlng.lng])
            lines.addLatLng(e.latlng)
            this.map.addLayer(tempLines)
            this.map.addLayer(lines)
            const node = L.circle(e.latlng, { color: '#ff0000', fillColor: 'ff0000', fillOpacity: 1 })
            this.map.addLayer(node)
            geometry.push(node);
        },
        mapDoubleClick() {
            // geometry.push(L.polygon(points).addTo(this.map));
            PolygonPoints = points;
            this.drawLines(points);
            points = []
            lines.remove()
            tempLines.remove()
            lines = new L.polyline([])
            this.map.off("click");//
            this.map.off("dblclick");//
            this.map.off("mousemove");//
            
        },
        mapMove(e) {
            if (points.length > 0) {
                let ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng], points[0]]
                tempLines.setLatLngs(ls)
            }
        },
        clearEditcircle() {
            geometry.forEach(v => {
                v.remove();
            })
        },
        clearEidtAll() {
            geometry.forEach(v => {
                v.remove();
            })
            dbxLi.forEach(v => {
                v.remove();
            })
        },
        getPolygonPoints() {
            return PolygonPoints;
        },
        saveEdit(ppoints) {
            // this.addPolygon(ppoints);
            this.clearEditcircle();
        },
        addPolygon(polyInt) {
            var latlngs = [[70, 30], [70, 175], [-10, 175], [-10, 30]];//先纬度，再经度 横经竖维 左上角顺时针
            var plyall = new L.Polygon([latlngs, polyInt], { color: 'transparent', opacity: 0.2, fillColor: '#aaa', fillOpacity: 0.4 });
            plyall.addTo(this.map);
            dbxLi.push(plyall);
        },
        drawLines(obj) {
            var lastPoint=JSON.parse(JSON.stringify(obj[0]));
            obj.push(lastPoint);
            let antPath = L.polyline.antPath(obj, {
                "paused": false, //暂停 初始化状态
                "reverse": false, //方向反转
                "delay": 400, //延迟，值越大越慢
                "dashArray": [10, 20], //间隔样式
                "weight": 1, //线宽
                "color": "gray", //颜色
                "opacity": 1, //透明度
                "pulseColor": "white", //块颜色
                // "fillOpacity" : 1,//
            });
            dbxLi.push(antPath.addTo(this.map));
        },

    }
}
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
</style>
