/**
 * 代码分离，单独处理marker图层的逻辑
 * */
import flyLayerUtil from "./drawUtils/flyLayerUtil";
import flyBlLayerUtil from "./drawUtils/flyBlLayerUtil";
import boxEchartsUtil from "./drawUtils/boxEchartsUtil";

//vue实例，在组件created的时候调用setVm传入
let $this = null;

export default {
    /**--------------------------------------初始化vm-----------------------------------------*/
    setVm(vmParam) {
        if ($this === null) {
            $this = vmParam;
        }		
    },	
    /**--------------------------------------marker图层绘制-----------------------------------------*/
    //每个类型是否展示，具体方法里面去判断
    initMarkers() {
        // this.initFly();//迁徙图（在途箱）
        // this.initFlyBL();//飞行图（班列）
        // // this.initBl();//班列
        // this.initBoxStation();//集箱-在站
        // this.initBoxWay();//集箱-在途
    },

    //绘制迁徙图
    initFly() {
        if ($this.markerLayers.fly.show && $this.markerLayers.fly.lineLayer == null) {
            //1. 绘制飞行线层
            const flyLines = flyLayerUtil.getFlyLine();
            var flyLinesSet = new mapv.DataSet(flyLines);
            const flyLineOptions = {
                strokeStyle: '#FA1618',//rgba(250,22,24, 0.8)',
                globalCompositeOperation: 'lighter',
                shadowColor: '#FA19D7',//rgba(250,25,215, 0.8)',
                methods: {
                    // click: function (item) {
                    // }
                },
                // gradient: {0: 'rgba(106,183,216, 0.6)', 1: 'rgb(106,183,216, 1)'},
                gradient: {0: '#6AB7D8', 1: '#6AB7D8'},
                lineWidth: 1,
                draw: 'intensity'
            };
            $this.markerLayers.fly.lineLayer = L.supermap.mapVLayer(flyLinesSet, flyLineOptions, {}).addTo($this.map);

            //2. 绘制飞行线动画
            const flyAnimatePoints = flyLayerUtil.getFlyAnimatePoints();
            var flyAnimatePointsSet = new mapv.DataSet(flyAnimatePoints);
            var flyAnimatePointOptions = {
                fillStyle: 'rgba(255, 250, 250, 0.9)',
                size: 1.5,
                animation: {
                    type: 'time',
                    stepsRange: {
                        start: 0,
                        end: 50
                    },
                    trails: 1,
                    duration: 5,
                },
                draw: 'simple'
            };
            //动画图层
            L.supermap.mapVLayer(flyAnimatePointsSet, flyAnimatePointOptions).addTo($this.map);
        }
    },

    initFlyBL() {
        if ($this.markerLayers.flybl.show && $this.markerLayers.flybl.lineLayer == null) {
            const option = flyBlLayerUtil.getOption();
            $this.markerLayers.flybl.lineLayer = L.supermap.echartsLayer(option).addTo($this.map);
        }
    },

    initBl() {
        const bl = $this.markerLayers.bl;
        if (bl.show) {
            //共同请求数据
            this.getBlockTrains().then(() => {
                const data = $this.$store.state.bigData.blockTrainsLocation;
                //设置最大显示数量
                $this.$store.commit('bigData/setMaxMarkerNum', data.length);
                const showMarkerNum = $this.$store.state.bigData.showMarkerNum;//当前选择最大显示数量
                let count = 0;
                //数据展示
                ["zo", "zy", "jzx", "tk", "other"].forEach(key => {
                    let config = bl[key];
                    if (config.show) {
                        const currentZoomLevel = $this.mapZoomlevel.currentZoomLevel;
                        if (currentZoomLevel === "country") {
                            let markers_country = [];
                            data.forEach((item) => {
                                if (count < showMarkerNum - 1) {
                                    if (item.zozy === key) {
                                        //显示小图标
                                        var myIcon = L.icon({
                                            iconUrl: config.layer_country.icon,
                                            iconSize: [10, 18],
                                            data: item
                                        });

                                        // eslint-disable-next-line no-undef
                                        const marker = L.marker([item.lat, item.lon], {
                                            icon: myIcon
                                        });
                                        marker.on("click", (e) => {
                                            console.log("marker点击：", item);
                                        });
                                        markers_country.push(marker);
                                        count++;
                                    }
                                }
                            });
                            $this.markerLayers.bl[key].layer_country.layer = L.featureGroup(markers_country).bindPopup(function (layer) {
                                const data = layer.options.icon.options.data;
                                let html = '<div style="margin-top: 10px;margin-left:0;border-radius: 8px;border: 2px solid rgba(0,0,0,0.67);width: 100px;height: 35px;background-color: rgba(34,39,57,0.67);color: #ffffff;font-size:16px;font-weight: bold;text-align:center;line-height:35px;">' + data.YXCC + '<span style="padding-left: 12px">' + '</span></div>';
                                return html
                            }).addTo($this.map);
                        } else if (currentZoomLevel === "bureau" || currentZoomLevel === "city" || currentZoomLevel === "station") {
                            let markers_bureau = [];
                            data.forEach((item) => {
                                if (count < showMarkerNum - 1) {
                                    if (item.zozy === key) {
                                        //显示中等图标
                                        const img = config.layer_bureau.img;
                                        const imgBack = config.layer_bureau.imgBack;
                                        const dom = `<div style="background:url(${imgBack});
                                                                white-space: nowrap;
                                                                padding:5px;
                                                                padding-bottom:10px;
                                                                background-size:100% 100%">
                                                                <img src="${img}" 
                                                                style="display:inline-block;
                                                                    vertical-align: middle;
                                                                    width:20px;
                                                                    height:20px;"/>
                                                        ${item.YXCC}
                                                    </div>`;
                                        const myIcon = L.divIcon({
                                            className: "icon-lable",
                                            iconSize: [80, 80],
                                            html: dom
                                        });

                                        const marker = L.marker([item.lat, item.lon], {
                                            icon: myIcon
                                        });
                                        marker.on("click", (e) => {
                                            console.log("marker点击：", item)
                                        });
                                        markers_bureau.push(marker);
                                        count++;
                                    }
                                }
                            });
                            $this.markerLayers.bl[key].layer_bureau.layer = L.featureGroup(markers_bureau).addTo($this.map);
                            $this.markerLayers.bl[key].layer_city.layer = L.featureGroup(markers_bureau).addTo($this.map);
                            $this.markerLayers.bl[key].layer_station.layer = L.featureGroup(markers_bureau).addTo($this.map);
                        }
                    }
                });
            });
        }
    },
    initBoxStation() {
        const boxType = "stationBox";
        if ($this.markerLayers.jx.stationBox.show && $this.markerLayers.jx.stationBox.baseLayer === false) {
            //获取局管范围
            $this.$store.dispatch("bigData/getBureauBorder", {}).then(() => {
                //获取在站箱
                this.getBoxs(boxType).then(() => {
                    //绘制在站箱
                    this.drawBox(boxType);
                })
            })
        }
    },

    initBoxWay() {
        if (!$this.markerLayers.fly.show) {
            return;
        }
    },

    drawBox(boxType) {
        const bureauBorders = $this.$store.state.bigData.bureauBorder;
        const boxs = $this.$store.state.bigData[boxType];
        console.log("boxs", boxs);
        //排序,由大到小
        boxs.sort((a, b) => b.ZS - a.ZS).forEach((bureauBox, index) => {
            //1. 绘制地图底图
            const bureauJC = bureauBox.CTN_REPO_UNIT;
            if (bureauBorders[bureauJC]) {//可以取到边界值
                const bureauBorder = bureauBorders[bureauJC].data;
                //一个局的边界点集合
                let points = [];
                bureauBorder.geometry.points.forEach(item => {
                    points.push([item.x, item.y]);
                });
                //绘制色块
                var geoJsonFeature = {
                    "type": "Feature",
                    "properties": {
                        "id": bureauJC,
                        "name": bureauJC,//路局中文简称

                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [points]
                    },
                };
                //绘制颜色深浅
                const colorArr = ["#0200ff", "#0098ff", "#00ffe6", "#a4f8ae"];//绿
                // const colorArr = ["#fdf1ef", "#f1d2bf", "#dfab94", "#ba7c61"];//橙
                let group = Math.floor(index / 5);//5个一组
                group = group > 3 ? 3 : (group < 0 ? 0 : group);
                // console.log("group", group)
                L.geoJSON(geoJsonFeature, {
                    style: function (feature) {
                        return {stroke: false, fillColor: colorArr[group]};
                    }
                }).addTo($this.map);
            }
        })
        //分布底图绘制完毕
        $this.markerLayers.jx[boxType].baseLayer = true;

        //2. 绘制各局饼图(supermap自带插件)
        boxEchartsUtil.initFeaterDatasAddStyles($this);
        boxEchartsUtil.createRingThemeLayer($this);

        //3. 使用手工popup绘制饼图
        // 改用divIcon实现
        // var geoJsonFeature = {
        //     "type": "Feature",
        //     "properties": {
        //         "id": "测试",
        //         "name": "测试",
        //
        //     },
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [116.407283, 39.904557]
        //     },
        // };
        // L.geoJSON(geoJsonFeature, {}).bindPopup(function (layer) {
        //     let html = `<div id="map-echarts" style="height:300px; width:400px">
        //
        //
        //         </div>`;
        //     return html
        // }).addTo($this.map);
        const img = "http://10.192.34.175:9090/CTTS/homemapimgs/zyPic.png"
        const imgBack = "http://10.192.34.175:9090/CTTS/homemapimgs/zyPop.png"
        const dom = `<div style="
                                background:url(${imgBack});
                                white-space: nowrap;
                                padding:5px;
                                padding-bottom:10px;
                                background-size:100% 100%">
                                <img src="${img}" 
                                style="display:inline-block;
                                    vertical-align: middle;
                                    width:20px;
                                    height:20px;"/>
                                北京测试
                    </div>`;
        const myIcon = L.divIcon({
            className: "icon-lable",
            iconSize: [80, 80],
            html: dom
        });

        const marker = L.marker([39.873942, 116.209042], {
            icon: myIcon
        });

        const popContent = `<div id="echart-div" style="width:400px;height:300px;overflow: auto"/>`;
        marker.bindPopup(popContent, {className: "echart-div-popup"})
        marker.on('popupopen', function (e) {
            var myChart = echarts.init(document.getElementById("echart-div"));
            const colorArr = ["#446bf6", "#02aee9", "#f87458", "#57d0de", "#458fce", "#1f2e98", "#7fd5f7", "#c0a4f3", "#accbe0", "#fdc9be"];
            var option = {
                title: {
                    text: "箱类分布",
                    left: "center",
                },
                tooltip: {trigger: 'item'},
                color: colorArr,
                series: [{
                    type: "pie",
                    radius: "70%",
                    center: ["50%", "60%"],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0,0,0,0.5)",
                        },
                    },
                    data: [
                        {value: 5577, name: '在途空箱', itemStyle: {normal: {color: '#b9645a'}}},
                        {value: 3300, name: '在站空箱', itemStyle: {normal: {color: '#f8cfc8'}}},
                        {value: 8000, name: '在途重箱', itemStyle: {normal: {color: '#5191b7'}}},
                        {value: 5355, name: '在站重箱', itemStyle: {normal: {color: '#9bcff9'}}},
                    ]
                }],
            };
            myChart.setOption(option);
        })

        L.featureGroup([marker]).addTo($this.map);
    },
    /**--------------------------------------以下为页面事件调用方法-----------------------------------------*/
    //层级发生变化时调用
    zoomLevelChange(oldLevel, newLevel) {
        this.hideOldZoomLevel(oldLevel);
        const newLevelExist = this.showNewZoomLevel(newLevel);
        if (!newLevelExist) {
            //新层级需要初始化
            this.initMarkers();
        }
    },
    //改变图标显示的数量，目前只能清除当前图层再画一次
    changeShowMarkerNum() {
        const zoomLevel = $this.mapZoomlevel.currentZoomLevel;
        ["zo", "zy", "jzx", "tk", "other","cdj"].forEach(key => {
            let layer = $this.markerLayers.bl[key]["layer_" + zoomLevel].layer;
            if (layer) {
                layer.removeFrom($this.map);
            }
        });
        this.initMarkers();
    },
    /**--------------------------------------以下为获取数据-----------------------------------------*/
    //获取班列
    getBlockTrains() {
        //return了一个promise对象
        return $this.$store.dispatch("bigData/getDataByTimestamp", {
            s: ["所在局", "", "", "", "", "", "", "", "", "", "", ""],
            w: [],
            o: [],
            a: "获取班列数据",
            key: "bl"
        });
    },
    //获取箱 type: stationBox-在站
    getBoxs(type) {
        //return了一个promise对象
        return $this.$store.dispatch("bigData/getDataByTimestamp", {type, key: "box"});
    },
    /**--------------------------------------以下为纯工具-----------------------------------------*/
    //隐藏其他展示层级
    hideOldZoomLevel(oldLevel) {
        if (oldLevel) {
            ["zo", "zy", "jzx", "tk", "other"].forEach(key => {
                let layer = $this.markerLayers.bl[key]["layer_" + oldLevel].layer;
                if (layer) {
                    this.hideMarkerLayer(layer);
                }
            });
        }
    },
    //展示新层级，如果之前层级是null返回false
    showNewZoomLevel(newLevel) {
        // let layerExist = false;
        // ["zo", "zy", "jzx", "tk", "other","cdj"].forEach(key => {
        //     let layer = $this.markerLayers.bl[key]["layer_" + newLevel].layer;
        //     if (layer) {
        //         this.showMarkerLayer(layer);
        //         layerExist = true;
        //     }
        // });
        // return layerExist;
    },
    //隐藏marker图层
    hideMarkerLayer(layer) {
        let layers = layer._layers;
        Object.keys(layers).forEach(item => {
            layers[item].setOpacity(0);
        });
    },
    //显示marker图层
    showMarkerLayer(layer) {
        let layers = layer._layers;
        Object.keys(layers).forEach(item => {
            layers[item].setOpacity(1);
        });
    },
}