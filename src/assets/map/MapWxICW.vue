<!-- 
 * @created：	2022年5月30日
 * @author：	ch
 * @version:	v1.0
 * @desc:		卫星地图-成都东
 -->
<template>
  <div style="width: 100%;height: 100%;">
    <div ref="map" class="map-con"></div>
  </div>
</template>

<script>
// 这里引用各种资源
import C from "../com.js";
import dicUrl from "./weixingdituData.js";
export default {
  // 组件
  components: {},
  // 数据仓库
  data() {
    return {
      map: null,
      baseLayersUrl:
        "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
      // baseUrl: "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChengDuDongWeiXing/rest/maps/成都东卫星",
      baseUrl:
        "http://10.192.125.65:8090/iserver/services/map-ugcv5-ChengDuDongWeiXing/rest/maps/成都东卫星",
      baseUrl2:
        "http://10.192.125.55:8090/iserver/services/map-changchun/rest/maps/长春市区图",
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
      ]
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
    // document.querySelector("title").innerHTML = "客运地图";
    const name = this.$store.state.params.name;
    const dic = dicUrl[name];
    const p = L.Util.transform(
      L.marker([dic.center[1], dic.center[0]]),
      L.CRS.EPSG3857,
      L.CRS.EPSG4326
    ).geometry.coordinates;
    this.mapCenterPoint = [p[1], p[0]];
    console.log(this.mapCenterPoint);
    this.baseUrl = dic.url;
    this.initMap();
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    initMap() {
      // const mapCenterPoint = [30.631198007430534, 104.13895925954046]; //成都东
      const scaleDenominators = [
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
        9028,
        4514,
        2257,
        1129,
        564
      ];
      //自定义坐标系
      const crs = L.Proj.CRS("EPSG:3857", {
        origin: this.mapCenterPoint,
        scaleDenominators: scaleDenominators
      });
      //边界
      const cornerLeftUp = L.latLng(70, 30);
      const cornerRightDown = L.latLng(-10, 175);
      const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown);
      this.map = L.map(this.$refs.map, {
        crs: crs,
        center: this.mapCenterPoint, //中心点
        minZoom: 13, //最小缩放
        maxZoom: 18, //最大缩放15
        zoom: 14, //默认缩放
        maxBounds: bounds, //边界
        zoomControl: false, //不显示缩放按钮
        logoControl: false, //supermap水印
        attributionControl: false //水印文本,可以传字符串进行自定义
      });
      L.supermap
        .tiledMapLayer(this.baseUrl, {
          noWrap: true
        })
        .addTo(this.map)
        .once("load", function() {
          // 取数据
        });
      this.map.on("click", e => {
        // console.log(e.latlng)
      });
      //注册地图的缩放事件
      this.map.on("zoomend", e => {
        const newZoom = e.target._zoom;
        console.log("地图缩放事件: → " + newZoom);
      });
    }
    /* @info  数据处理区-----------------------------------*/
    /* @info  数据交互区-----------------------------------*/
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
