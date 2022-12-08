<!-- 
 * @created：	2022年1月28日
 * @author：	ch
 * @version:	v1.0
 * @desc:		交通线路维护
 -->
<template>
  <div class="map-blue" style="width: 100%;height: 100%;">
    <el-container style="height: 100%;background: #010713;color: white;">
      <el-header style="height:40px;padding: 4px;background: #525C75;">
        <h3 style="display: inline-block;margin: 0;padding: 4px 15px 2px 10px;">交通线路维护</h3>
        <el-button size="mini" @click="startDraw" :disabled="!curPlace.deviced">绘制线路</el-button>
        <el-button size="mini" @click="saveData" :disabled="points.length===0">保存数据</el-button>
      </el-header>
      <el-container>
        <el-aside style="position: relative;width:300px;">
          <div style="padding: 5px;">
            <el-input size="mini" v-model="filterText" @change="filterPlace" placeholder="输入名称筛选"></el-input>
          </div>
          <ul class="place-list">
            <template v-for="item in placeListShow">
              <li
                :key="item.deviced"
                :class="{'active':item.deviced===curPlace.deviced}"
                @click="choosePlace(item)"
                :title="item.collectionaddress"
              >{{item.collectionaddress}}</li>
            </template>
          </ul>
        </el-aside>
        <el-main style="width: 100%;height: 100%;padding: 0;">
          <div
            ref="map"
            oncontextmenu="return false"
            style="width: 100%;height: 100%;background: transparent;"
          ></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 这里引用各种资源
import C from "../../assets/com.js";
import mapUnit from "../../components/map/js/mapUtil.js";
export default {
  // 组件
  components: {},
  // 数据仓库
  data() {
    return {
      map: null,
      mapUrl:
        "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3", //地图服务
      trainLineUrl:
        "https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine", //铁路线服务
      sccqUrl:
        "http://10.192.125.55:8090/iserver/services/map-ugcv5-chengduCity/rest/maps/chengduCity", //四川重庆详细地图服务

      rangingFlag: false,
      lastPoint: {}, //最后一个点
      points: [], //所有点
      markers: [], //marker层
      lines: null, //实线
      tempLines: null,
      distanceV: 0, //距离
      tempDistanceV: 0, //
      distanceT: "", //距离

      filterText: "",
      placeList: [], //采集点
      placeListShow: [],
      curPlace: {}
    };
  },
  // 属性
  props: {},
  // 组件挂载完毕
  mounted() {
    document.querySelector("title").innerHTML = "交通线路维护";
    // 右键菜单关闭
    document.body.addEventListener("click", () => {
      // this.visibleTrainContextMenu = false;
    });
    this.initMap();
    this.getData();
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    initMap() {
      const mapCenterPoint = [30.631366575429297, 104.13792321791442]; //成都东
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
        9028
      ];
      //自定义坐标系
      const crs = L.Proj.CRS("EPSG:3857", {
        origin: mapCenterPoint,
        scaleDenominators: scaleDenominators
      });
      //边界
      const cornerLeftUp = L.latLng(70, 30);
      const cornerRightDown = L.latLng(-10, 175);
      const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown);
      this.map = L.map(this.$refs.map, {
        crs: crs,
        center: mapCenterPoint, //中心点
        minZoom: 1, //最小缩放
        maxZoom: 15, //最大缩放15
        zoom: 12, //默认缩放
        maxBounds: bounds, //边界
        zoomControl: false, //不显示缩放按钮
        logoControl: false, //supermap水印
        attributionControl: false //水印文本,可以传字符串进行自定义
      });
      //注册地图的缩放事件
      this.map.on("zoomend", e => {});
      // 地图点击事件
      this.map.on("click", e => {
        console.log(e);
        if (this.rangingFlag) {
          this.onClick(e);
        }
      });
      // 地图双击事件
      this.map.on("dblclick", e => {});
      // 地图鼠标移动事件
      this.map.on("mousemove", e => {
        if (this.rangingFlag) {
          this.onMove(e);
        }
      });
      this.map.on("mousedown", e => {
        if (this.rangingFlag) {
          this.onMousedown(e);
        }
      });

      // 加载天地图
      L.supermap
        .tiledMapLayer(this.mapUrl, {
          transparent: true
        })
        .addTo(this.map);
      // 加载四川重庆图
      L.supermap
        .tiledMapLayer(this.sccqUrl, {
          opacity: 1,
          transparent: true
        })
        .addTo(this.map);
      // 加载铁路线
      L.supermap
        .tiledMapLayer(this.trainLineUrl, {
          transparent: true
        })
        .addTo(this.map);
    },

    choosePlace(row) {
      console.log("当前选择地点", row);
      this.curPlace = row;
      this.filterText = row.collectionaddress;
      this.clearAll();
      if (row.lines) {
        this.lines.setLatLngs(row.lines);
        this.map.setView(row.lines[0]);
      }
    },

    /* @info  数据处理区-----------------------------------*/
    //注册点击，创建临线
    startDraw() {
      this.clearAll();
      this.rangingFlag = true;
      // this.map.dragging.disable(); //地图禁止拖动
      this.map.doubleClickZoom.disable(); //地图禁止双击放大
      // this.map.scrollWheelZoom.disable(); //地图禁止鼠标滚轮缩放
    },
    // 清除所有记录
    clearAll() {
      this.rangingFlag = false;
      this.map.dragging.enable(); //地图允许拖动
      this.map.doubleClickZoom.enable(); //地图允许双击放大
      this.map.scrollWheelZoom.enable(); //地图允许鼠标滚轮缩放
      if ($("#rangingJiaoTongLine").length === 1) {
        $("#rangingJiaoTongLine")
          .html("<span>单击确定起点</span><div>右键结束绘制</div>")
          .css({
            top: -100,
            left: -100
          });
      } else {
        $("body").append(
          `<div id="rangingJiaoTongLine"><span>单击确定起点</span><div>右键结束绘制</div></div>`
        );
      }
      $("#rangingJiaoTongLine").css({
        top: -100,
        left: -100
      });
      this.distanceV = 0;
      this.tempDistanceV = 0;
      this.distanceT = "起点";
      this.points = [];
      // 清空小圆点
      this.markers.forEach(v => {
        v.remove();
      });
      this.lines && this.lines.removeFrom(this.map);
      this.tempLines && this.tempLines.removeFrom(this.map);
      this.lines = new L.polyline([]);
      this.tempLines = new L.polyline([], {
        //临时虚线
        dashArray: 5
      });
      this.map.addLayer(this.tempLines);
      this.map.addLayer(this.lines);
    },

    onClick(e) {
      // 当前点击位置与最后一个点相同
      if (
        this.lastPoint.lat == e.latlng.lat &&
        this.lastPoint.lng == e.latlng.lng
      ) {
        return;
      }
      this.lastPoint = e.latlng;
      this.points.push(e.latlng);
      this.lines.addLatLng(e.latlng);
      this.distanceV += this.tempDistanceV;
      // 小圆点 + 信息框
      const node = L.marker(e.latlng, {
        icon: L.divIcon({
          className: "ranging-circle-container",
          // html: `<div class="ranging-box-jiaotong"><i></i><span>${this.distanceT}</span></div>`,
          html: `<div class="ranging-box-jiaotong"><i></i></div>`
        })
      }).on("click", e => {
        this.eqCreater.srcLongitude = e.target._latlng.lng;
        this.eqCreater.srcLatitude = e.target._latlng.lat;
      });
      this.map.addLayer(node);
      this.markers.push(node);
    },
    //e：鼠标移动产生的点位
    onMove(e) {
      $("#rangingJiaoTongLine").css({
        top: window.event.clientY + 10,
        left: window.event.clientX + 10
      });
      if (this.points.length > 0) {
        // this.tempDistanceV = mapUnit.getDistance(e.latlng, this.lastPoint);
        // let n = this.distanceV + this.tempDistanceV;
        // this.distanceT = n < 1000 ? Math.floor(n) + "米" : (n / 1000).toFixed(1) + "公里";
        // $("#rangingJiaoTongLine>span").html(this.distanceT);
        $("#rangingJiaoTongLine").html("右键结束绘制");
        this.tempLines.setLatLngs([this.lastPoint, e.latlng]);
      }
    },
    onMousedown() {
      if (window.event.button === 2) {
        this.rangingFlag = false;
        this.map.dragging.enable(); //地图允许拖动
        this.map.doubleClickZoom.enable(); //地图允许双击放大
        this.map.scrollWheelZoom.enable(); //地图允许鼠标滚轮缩放
        this.tempLines.removeFrom(this.map); //删除临时线
        $("#rangingJiaoTongLine").css({
          top: -100,
          left: -100
        });
        if (this.points.length === 0) {
          return;
        }
        const node = L.marker(this.lastPoint, {
          icon: L.divIcon({
            popupAnchor: [110, 110],
            className: "ranging-remove-jiaotong-container-jiaotong",
            html: `<div class="ranging-remove-jiaotong" title="清除本次绘制">×</div>`
          })
        }).on("click", () => {
          this.clearAll();
        });
        this.map.addLayer(node);
        this.markers.push(node);
      }
    },

    filterPlace() {
      this.placeListShow =
        this.filterText === ""
          ? this.placeList
          : this.placeList.filter(
              v => v.collectionaddress.indexOf(this.filterText) > -1
            );
    },

    /* @info  数据交互区-----------------------------------*/
    saveData() {
      C.getDataP123WithNoStringify(
        {
          c: "kydp_zxy9006",
          s: this.points,
          w: "e0ed96bc8266452d90e17054a09f61db",
          o: this.curPlace.deviced,
          a: "保存采集点线路",
          url: "https://10.192.34.79/ky203/GeneralProServlet" //接口地址
        },
        r => {
          if (r && r === "OK") {
            this.$notify.success({
              title: "提示",
              message: "保存采集点线路成功"
            });
            this.curPlace.lines = this.points;
            console.log("保存采集点线路", r);
          } else {
            this.$notify.error({
              title: "提示",
              message: "保存采集点线路异常"
            });
          }
        }
      );
    },
    getData() {
      this.loading = this.$loading({
        lock: true,
        text: "正在获取采集点数据...",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)",
        customClass: "loading"
      });
      C.getDataP123WithNoStringify(
        {
          c: "kydp_zxy9005",
          s: {
            uuid: "e0ed96bc8266452d90e17054a09f61db",
            condition: {
              START_pt: "20211115", //C.getDateTimeSub(new Date(), "yyyyMMdd",-24),
              END_pt: "20211115"
            },
            pageNumber: 1, //页数
            pageSize: 10000 //条数
          },
          w: "e0ed96bc8266452d90e17054a09f61db",
          o: "4d754d35993e423e99a6bb0074d5e8df",
          a: "交管局流量数据",
          url: "https://10.192.34.79/ky203/GeneralProServlet" //接口地址
        },
        r => {
          if (r) {
            const keys = {};
            const realD = [];
            r.list.forEach(v => {
              if (typeof keys[v.deviced] === "undefined") {
                try {
                  v.lines = JSON.parse(v.redis);
                } catch (e) {
                  v.lines = [];
                }
                realD.push(v);
                keys[v.deviced] = true;
              }
            });
            this.placeList = realD;
            this.placeListShow = realD;
            console.log("交管局流量数据", realD);
          } else {
            this.$notify.error({
              title: "提示",
              message: "交管局流量数据信息数据异常"
            });
          }
          this.loading.close();
        }
      );
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
.place-list {
  padding: 5px;
  margin: 0;
}

.place-list > li {
  height: 30px;
  padding: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.place-list > li:hover,
.place-list > li.active {
  cursor: pointer;
  background: #525c75;
}
</style>
<!-- 公有样式（会影响全局） -->

<style src="../../components/map/css/blue.css"></style><!-- 蓝色调 -->
<style>
/* 地图测距样式 */
#rangingJiaoTongLine {
  position: fixed;
  top: -100px;
  left: -100px;
  z-index: 420;
  padding: 3px 5px;
  color: white;
  color: #aaffff;
  border: 1px solid red;
}

#rangingJiaoTongLine > div {
  color: #d9d9d9;
  font-size: 12px;
}

.ranging-remove-jiaotong-container-jiaotong {
  margin-top: -8px !important;
  margin-left: -20px !important;
}

.ranging-remove-jiaotong {
  display: inline-block;
  width: 12px;
  height: 12px;
  font-size: 18px;
  text-align: center;
  line-height: 10px;
  font-weight: bold;
  color: red;
  background: white;
  border: 1px solid red;
}

.ranging-box-jiaotong {
  white-space: nowrap;
}

.ranging-box-jiaotong > i {
  display: inline-block;
  vertical-align: top;
  background: white;
  width: 10px;
  height: 10px;
  border-radius: 6px;
  border: 2px solid red;
}

.ranging-box-jiaotong > span {
  display: inline-block;
  vertical-align: top;
  padding: 0px 3px;
  margin-left: 3px;
  margin-top: -5px;
  white-space: nowrap;
  font-size: 12px;
  border-radius: 3px;
  border: 1px solid #a5a1cc;
}
</style>
