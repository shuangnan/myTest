<!--
 * @created：	2021年2月25日
 * @author：	ch
 * @version:	v1.0
 * @desc:		客运段大屏
 -->
<template>
  <div style="width:100%;height:100%;positino:relative;">
    <div class="selector" style>
      <el-checkbox
        style="margin:2px 0"
        v-model="dongcheSelected"
        @change="(state) => onChangeTrain(state,'O')"
      >
        <img style="vertical-align:middle" src="./img2/dongche.png" alt />
        <span>动车</span>
      </el-checkbox>
      <el-checkbox
        style="margin:2px 0"
        v-model="pusuSelected"
        @change="(state) => onChangeTrain(state,'P')"
      >
        <img style="vertical-align:middle" src="./img2/pusu.png" alt />
        <span>普速</span>
      </el-checkbox>
      <el-checkbox
        style="margin:2px 0"
        v-model="huoyunSelected"
        @change="(state) => onChangeTrain(state,'H')"
      >
        <img style="vertical-align:middle" src="./img2/cargo.png" alt />
        <span>货车</span>
      </el-checkbox>
      <!-- <el-checkbox v-model="stationSelected" @change="(state) => onChangeTrain(state,'S')">
				<div style="margin:4px;width:16px;height:16px;display:inline-block;vertical-align:middle;border-radius:7px" class="big-map-marker-default-station"></div>
				<span>车站</span>
      </el-checkbox>-->
    </div>
    <div ref="map" class="map-con"></div>
  </div>
</template>

<script>
import C from "../../../assets/com.js"
import mt from "../../../assets/map/tools.js"
import flyBlLayerUtil from "../../../assets/map/flyBlLayerUtil.js"
export default {
  data() {
    return {
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
	  
	  //
	  stationInfoLayers:[],
	  curTrainId:"",
    }
  },
  created() {

  },
  mounted() {
    mt.setVue(this);
    mt.initMap(this,{
      el: this.$refs.map,
      zoom: 1,
      minZoom:1,
      // 中心点
      mapCenterPoint: [27.536233, 106.807438], //遵义
      // 可缩放比例尺
      scaleDenominators: [4622334, 6081556, 2311167, 1540778, 1155583, 770389, 577792, 288896, 144448],
      // 天地图
      baseLayersUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-chinamap/rest/maps/china_map",
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

    // const option = flyBlLayerUtil.getOption();
    // L.supermap.echartsLayer(option).addTo(this.map);

    this.getData_onRoadTrain();
	this.queryPolygonPoints();//查询管辖区域
  },
  components: {},
  methods: {
    getData_onRoadTrain() {
      // 1：动车组列车
      // 2：普速客车
      // 3：货车
      // 4：晚点客车
      // 5：告警客车
      // 6：晚点货车
      // 7：告警货车

      // 字段说明：
      // JCHM1: 机车号1,
      // TRAIN_ID: 列车id,
      // TRAIN_TYPE: 列车类型：H-货车 K-客车,
      // NEXTNAME: 下一站点名称,
      // JCHM2: 机车号2,
      // CURRNAME: 当前站点名称,
      // BUREAU: 担当局,
      // LON: 当前站点经度,
      // ENDNAME: 终到站名称,
      // TRAIN: 车次,
      // EDTIME: 晚点时间,
      // STARTNAME: 始发站名称,
      // LJMC: 当前站点所属局管,
      // LOCAL_FLAG: 是否到站,
      // LAT: 当前站点纬度,
      // TRAIN_LEVEL: 列车类型2：H-货车 K-普客 D-动车
      // LS: 辆数
      // ZHZ: 总重
      // HC: 换长
      // PASSENGER: 旅客人数
      C.getDataP123({
        url: "http://10.192.126.203:9088/admin/dlmo/onRoadTrainData",
        c: "dlmo_zxy2004"
      }, (r) => {
        console.log("【D0121】在途车数据>>>", r);
        this.drawTrains(r)
      });
    },
    drawTrains: function (data) {
      let that = this;
      let trainMarkerLayerDongche = L.layerGroup();
      let trainMarkerLayerPusu = L.layerGroup();
      let trainMarkerLayerCargo = L.layerGroup();
      for (let trainCatagory = 1; trainCatagory < 8; trainCatagory++) {
        let trainList = data[trainCatagory];
        for (let i = 0; i < trainList.length; i++) {
          let train = trainList[i];
          let trainInfo = {
            trainid: train.TRAIN_ID,
            train: train.TRAIN,
            startname: train.STARTNAME,
            endname: train.ENDNAME,
            bureau: train.BUREAU,
            nums: 0,
            trainlevel: train.TRAIN_LEVEL,
            jchm: (train.JCHM1 || "") + " " + (train.JCHM2 || ""),
            zhz: train.ZHZ,
            ls: train.LS,
            hc: train.HC,
            id: train.DDT_DID,
            lng: train.LON,
            lat: train.LAT,
            status: this.getTrainStatus(trainCatagory)
          }
          let iconUrl = this.getMarkerIconImage(trainInfo);
          let html =
            `<div style="position:relative">
								<img src="${iconUrl}">
								<span style="position:absolute;left: 35px;top: 0px;color: white;">${train.TRAIN}</span>
							  </div>`
          let trainIcon = L.divIcon({
            className: "train-icon-container",
            iconSize: [80, 21],
            iconAnchor: this.getMarkerIconOffset(trainInfo),
            data: trainInfo,
            html: html,
          });
          let marker = L.marker({
            lon: trainInfo.lng,
            lat: trainInfo.lat
          }, {
            icon: trainIcon
          })

          //设置一下列车marker的鼠标事件
          marker.on("mouseover", function (e) {
            that.trainToolTipVisible = true;
            that.toolLeft = e.containerPoint.x + 20
            that.toolTop = e.containerPoint.y + 20
            that.currentToolTipTrainInfo = trainInfo
          })
          marker.on("mouseout", function (e) {
            that.trainToolTipVisible = false;
          })
          marker.on("click", async (e) => {
			$('.leaflet-popup').remove();
            const trainInfoPath = 'http://10.192.6.155:9090/JFLCMS/vue/#/trainTravelInfo?id=' + trainInfo.trainid + '&cc=' + trainInfo.train;
            // const trainInfoPath = 'http://10.192.185.44:8081/#/trainTravelInfo?id=' + trainInfo.trainid + '&cc=' + trainInfo.train;
			if(trainInfo.trainid === this.curTrainId && trainInfo.opend){
				trainInfo.opend = false;
				return;
			}
			this.curTrainId = trainInfo.trainid;
			trainInfo.opend = true;
			let nameDivIcon = L.divIcon({
			    className: 'textFonts',
			    iconSize: [10, 10],
			    popupAnchor: [0, 0],
			    html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -25px, 0px); bottom: 0px; left:-260px;">
					<a class ="leaflet-popup-close-button" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class = "leaflet-popup-content-wrapper blue">
					<div class="leaflet-popup-content no-padding" style="width:540px;">
						<div><h2 style="margin:0;padding-left:5px;">${trainInfo.train}</h2></div>
						<iframe src="${trainInfoPath}" style="height: 300px;width: 100%;margin-left:-1px;" frameborder="0"></iframe>
					</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
					<div class="leaflet-popup-tip blue"></div></div>
					</div>`
			});
			const layer = L.marker([train.LAT, train.LON], {
			    icon: nameDivIcon
			});
			const theLayer = layer.addTo(this.map);
			this.stationInfoLayers.push(theLayer);
          });
		  // 为marker绑定点击事件
		  // marker.bindPopup((layer)=> {
		  // 	const data = layer.options.icon.options.data;
		  // 	return '<div>123</div>';
		  // });

          //根据车次分类放置标记到正确的列表中
          if (train.TRAIN_LEVEL === "D") {
            trainMarkerLayerDongche.addLayer(marker);
          } else if (train.TRAIN_LEVEL === "K") {
            trainMarkerLayerPusu.addLayer(marker);
          } else if (train.TRAIN_TYPE === "H") {
            trainMarkerLayerCargo.addLayer(marker);
          }
          this.markerClusterLayer.addLayer(marker);
        }
      }

      this.trainMarkerLayerDongche = trainMarkerLayerDongche
      this.trainMarkerLayerPusu = trainMarkerLayerPusu
      this.trainMarkerLayerCargo = trainMarkerLayerCargo
    },
    //根据车次所在的类别，获取它的状态
    getTrainStatus: function (catagory) {
      switch (catagory) {
        case 3:
        case 5:
          return "late";
        case 4:
        case 6:
          return "warning";
        default:
          return "normal";
      }
    },
    getMarkerIconImage: function (data) {
      //决定是货车还是客车
      if (data.trainlevel === "H") {
        return require("./img2/cargo_long.png")
      } else {
        if (
          data.train.includes("D") ||
          data.train.includes("G") ||
          data.train.includes("C")
        ) {
          return require("./img2/dongche_long.png")
        } else {
          return require("./img2/pusu_long.png")
        }
      }
    },
    getMarkerIconOffset: function (data) {
      if (
        data.train.includes("D") ||
        data.train.includes("G") ||
        data.train.includes("C") ||
        data.trainlevel === "H"
      ) {
        return [0, 20]
      } else {
        return [60, 20]
      }
    },
    //当车次筛选栏变化时调用函数
    onChangeTrain: function (state, id) {
      let targetLayer = null;
      switch (id) {
        case "O":
          targetLayer = this.trainMarkerLayerDongche;
          break
        case "P":
          targetLayer = this.trainMarkerLayerPusu;
          break
        case "H":
          targetLayer = this.trainMarkerLayerCargo;
          break
        case "D":
          targetLayer = this.diaojiMarkerLayer;
          break
        case "S":
          if (state) mt.map.addLayer(this.stationMarkerLayer);
          else mt.map.removeLayer(this.stationMarkerLayer);
          return;
      }
      if (targetLayer !== null) {
        if (state) this.markerClusterLayer.addLayer(targetLayer);
        else this.markerClusterLayer.removeLayer(targetLayer);
      }
    },
    //查询管辖区域
    queryPolygonPoints() {
      C.getData({
        c: "trdm_lv_692",
        s: [this.$store.state.params.Oid, "1"],
        url: 'https://10.192.34.79/TRDM/GeneralProServlet',
        async: true,
        a: "获取指定组织机构GIS范围坐标点集合"
      }, (rs) => {
        var points = [];
        rs.forEach(v => {
          points.push([v.AREA_X, v.AREA_Y]);
        })
        if (points.length > 0) {
          this.addPolygon(points);
        }
      });
    },
    //添加管辖区域
    addPolygon(PolygonPoints) {
      var latlngs = [[70, 30], [70, 175], [-10, 175], [-10, 30]];//先纬度，再经度 横经竖维 左上角顺时针
      var plyall = new L.Polygon([latlngs, PolygonPoints], { color: 'transparent', opacity: 0.2, fillColor: '#aaa', fillOpacity: 0.4 });
      plyall.addTo(this.map);
    }
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
