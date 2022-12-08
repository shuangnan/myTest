<!-- 废弃 -->
<template>
  <div
    @keydown.17="ctrlFlag=true"
    @keyup.17="ctrlFlag=false"
    style="width: 100%;height:calc(100vh);overflow: hidden;padding:0;margin:0;"
  >
    <div style="position: absolute;top:80px;left:50%;margin-left:-100px;width: 200px;z-index: 410;">
      <el-input
        size="mini"
        placeholder="输入车次名定位..."
        :clearable="false"
        v-model="filterTrainStr"
        @change="filterTrain"
      >
        <i slot="append" class="el-icon-search" @click="filterTrain"></i>
      </el-input>
    </div>
    <div class="tools-con" :style="{height:!toolVisible?'30px':''}">
      <div class="tools-control" :class="{opened:toolVisible}">
        <i
          v-if="toolVisible"
          @click="toolVisible=false"
          class="el-icon-d-arrow-right"
          style="font-size: 16px;cursor: pointer;transform: rotate(90deg);"
        ></i>
        <i
          v-else
          @click="toolVisible=true"
          class="el-icon-s-tools"
          style="font-size: 16px;cursor: pointer;"
        ></i>
      </div>
      <div class="tools-item-con" :class="{show:toolVisible}">
        <div style="padding-top: 15px;">
          <el-checkbox-group
            v-model="layerFilters"
            @change="filterLayers"
            style="display: inline-block;"
          >
            <el-checkbox label="担当车"></el-checkbox>
            <el-checkbox label="普车"></el-checkbox>
            <el-checkbox label="动车"></el-checkbox>
            <el-checkbox label="桥梁"></el-checkbox>
            <el-checkbox label="隧道"></el-checkbox>
            <el-checkbox label="天气"></el-checkbox>
            <el-checkbox label="天气预警"></el-checkbox>
            <div>
              动车：
              <el-checkbox label="wd1_D">5-120分钟</el-checkbox>
              <el-checkbox label="wd2_D">120-240分钟</el-checkbox>
              <el-checkbox label="wd3_D">240-360分钟</el-checkbox>
              <el-checkbox label="wd4_D">360分钟以上</el-checkbox>
            </div>
            <div>
              普车：
              <el-checkbox label="wd2_P">240-480分钟</el-checkbox>
              <el-checkbox label="wd3_P">480-720分钟</el-checkbox>
              <el-checkbox label="wd4_P">720分钟以上</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div style="margin-top: 15px;width: 100%;padding-right: 20px;">
          <el-button
            :type="drawFlag==='框选列车'?'primary':'info'"
            size="small"
            icon="el-icon-news"
            @click="startDraw"
          >{{drawFlag}}</el-button>
          <el-button type="primary" size="small" @click="toolClick('openTask')">指派任务</el-button>
          <el-button type="primary" size="small" @click="toolClick('openLate')">正晚点信息</el-button>
          <el-button type="primary" size="small" @click="toolClick('openTravel')">旅服信息</el-button>
          <span style="float: right;margin-top: -5px;cursor: pointer;">
            <el-image
              :src="msgImg"
              @click="toolClick('openMsg')"
              title="发送消息"
              style="width: 40px;height: 40px;vertical-align: middle;margin-right: 20px;"
            ></el-image>
            <el-image
              :src="callImg"
              @click="toolClick('openXiaoYu')"
              title="音视频对讲"
              style="width: 40px;height: 40px;vertical-align: middle;margin-right: 20px;"
            ></el-image>
            <el-image
              :src="phoneImg"
              @click="toolClick('openPhone')"
              title="应急呼叫"
              style="width: 40px;height: 40px;vertical-align: middle;"
            ></el-image>
          </span>
        </div>
      </div>
    </div>
    <div
      id="home-map"
      style="width: 100vw;height: calc(100vh);background: #1c2026;"
      @click="onMapClick"
    ></div>

    <!-- 列车详情 -->
    <el-dialog
      :close-on-click-modal="false"
      v-if="visible"
      :visible.sync="visible"
      top="3vh"
      title="车次信息"
      width="98%"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <div style="height: 100%">
        <detail :datasource="detail" :detailSql="detailSql"></detail>
      </div>
    </el-dialog>
    <!-- 列车右键菜单 -->
    <TrainPhoneList
      v-if="visiblePhone"
      :style="phoneListStyle"
      :cc="phoneListCC"
      @callPer="callPhone"
    ></TrainPhoneList>
    <!-- 拨打电话组件 -->
    <call
      ref="call"
      :visibleController="false"
      :targetNumber="targetNumber"
      :initGroupNo="initGroupNo"
      :initPosition="ipos"
      style="z-index:9000"
    ></call>
    <!-- 正晚点信息 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visibleLate"
      title="正晚点信息"
      width="800px"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <div style="height: 600px">
        <MapTrainLate></MapTrainLate>
      </div>
    </el-dialog>
    <!-- 旅服信息 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visibleTravel"
      title="旅服信息"
      width="800px"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <div style="height: 600px">
        <MapTravelService></MapTravelService>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import C from "../../../assets/com.js";
import mapUtil from "./utils/mapUtil.js";
import home from "./service/home.js";
import detail from "./way/detail.vue";
import websoketMsg from "../../../assets/websoketMsg.js";
import TrainPhoneList from "./components/TrainPhoneList.vue";
import FutureWeather from "./components/FutureWeather.vue";
import MapTrainLate from "./components/MapTrainLate.vue";
import MapTravelService from "./components/MapTravelService.vue";

import call from "liuzb-anycall";
export default {
  components: {
    FutureWeather,
    TrainPhoneList,
    MapTrainLate,
    MapTravelService,
    detail,
    call
  },
  props: {
    oid: {
      type: String,
      default: ""
    },
    oname: {
      type: String,
      default: ""
    },
    ccname: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      ctrlFlag: false,
      //sip params
      targetNumber: "",
      initGroupNo: "1002",
      vc: false,
      ipos: "bottom",
      visiblePhone: false, //电话列表窗口
      phoneListCC: "",
      phoneListStyle: {
        top: 0,
        left: 0
      },
      intervalTrainInfo: null,

      trainPointObj: {}, //坐标相同的车
      trainData: [],
      menuTop: 0,
      menuLeft: 0,
      isMenuVisible: false,
      chart: null,
      opt: null,
      visible: false,
      detail: null, //车次详情信息
      detailSql: [],
      checkedTrain: [], //选中的车辆
      lateLimit: 30, //晚点标记时间阀
      datasource: [],
      dotDc: require("../../images/dongche.png"),
      dotPk: require("../../images/pusu.png"),
      dotPkwd: require("../../images/pusu_wd.png"),
      dotDcwd: require("../../images/dongche_wd.png"),
      dcImg: require("../../images/dongche_long.png"),
      dcwdImg: require("../../images/dongche_long_wd.png"),
      pkImg: require("../../images/pusu_long.png"),
      pkwdImg: require("../../images/pusu_long_wd.png"),
      hcImg: require("../../images/hc.png"),
      exitImg: require("../../images/exit.png"),
      bridgeImg: require("../../images/bridge.png"),
      tunnelImg: require("../../images/tunnel.png"),
      baseLayers: {
        cdj: {
          layer: null,
          url: C.ADDS.map,
          line: C.ADDS.trainLine
        }
      },
      markerLayer: {
        PC_Layer: null, //普车
        DC_Layer: null //动车
      },
      // 预警图层
      yuJingLayer: null,
      // 天气图层
      weatherLayer: null,
      // 桥梁图层
      qiaoliangLayer: null,
      qiaoliangData: [],
      // 隧道图层
      suidaoLayer: null,
      suidaoData: [],
      /**缩放等级相关*/
      maxZoom: 11,
      minZoom: 1,
      initZoom: 5,
      mapZoom: 5, //当前地图缩放等级
      filterTrainStr: "",
      phoneImg: require("./components/images/call.png"),
      msgImg: require("../../images/sendMsg.png"),
      callImg: require("../../images/vidio.png"),
      yujing: require("./icons/yujingIcon.png"),
      // 底部工具栏
      toolVisible: false,
      drawFlag: "框选列车",
      kuangXuanTrains: [], //框选列车数据，
      // 过滤图层
      layerFilters: [
        "担当车",
        "普车",
        "动车",
        "桥梁",
        "隧道",
        "天气",
        "天气预警"
      ],

      // 管辖区域图层
      compassLayer: null,
      //
      filterLateDC: "all", //正晚点筛选-动车
      filterLatePC: "all", //正晚点筛选-普车
      visibleLate: false, //正晚点窗口
      visibleTravel: false //旅服信息窗口
    };
  },
  watch: {
    oid() {
      this.getTrains();
      this.queryPolygonPoints();
      // this.getData_flyTrain();
    },
    isMenuVisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    ccname(value) {
      let t = this;
      if (value) {
        let targetTrain = {};
        console.log("ccname", t.ccname);
        targetTrain = t.trainData.find(train => {
          return train.TRAIN === value;
        });
        if (targetTrain) {
          console.log(targetTrain);
          mapUtil.moveTo([targetTrain.LAT, targetTrain.LON], 8);
        } else {
          t.$message.error("未找到指定车次！");
        }
      }
    }
  },
  mounted() {
    document.oncontextmenu = () => {
      return false;
    };
    document.body.addEventListener("click", () => {
      this.visiblePhone = false;
    });

    websoketMsg.init({
      onmessage: msg => {
        const $train = C.$("#" + msg.TRAIN_ID);
        if ($train.length > 0) {
          this.trainMessageArr($train, msg);
        }
      }
    });
    // 绑定 查看列车统计图方法
    window.showTrainCharts = trainid => this.showTrainCharts(trainid);

    mapUtil.setVm(this);
    markerUtil.setVm(this);
    this.loading = this.$loading({
      lock: true,
      text: "正在加载地图数据...",
      spinner: "el-icon-loading",
      background: "rgba(0,0,0,0.7)",
      customClass: "loading1"
    });

    this.initFunction(this.currentFunc);

    // this.initChart()

    this.loading.setText("正在加载列车数据...");
    // 查询当前天气
    this.getData_curWeather();
    // 查询当前预警信息
    this.getData_yuJing();
    //查询桥遂
    this.getData_qiaoliang(() => {
      //this.drawLinesTest()
      this.getTrains();
    });

    setInterval(() => {
      this.getData_yuJing();
      this.getData_curWeather();
      this.getTrains();
    }, 1000 * 60 * 10);

    // this.getExit() //应急救援通道
    this.loading.close();
  },
  methods: {
    /**
     * 拨打电话
     * @param {Object} per
     * @param {Object} ty
     */
    callPhone(per, ty, isMore) {
      if (ty === "phone") {
        this.$refs.call.ringup(per.E_Phone);
      } else {
        const userNameList = [];
        const userPidList = [];
        if (isMore) {
          per.forEach(item => {
            userNameList.push(item.E_Name);
            userPidList.push(item.E_Phone);
          });
        } else {
          userNameList.push(per.E_Name);
          userPidList.push(per.E_Phone);
        }
        this.loading = this.$loading({
          lock: true,
          text: "正在与 " + userNameList.join("、") + " 建立视频链接",
          spinner: "el-icon-loading",
          background: "rgba(0,0,0,0.7)",
          customClass: "loading1"
        });
        const webP = this.$store.state.params;
        const pos =
          "&UserName=" +
          webP.UserName +
          "&UserPID=" +
          webP.UserPID +
          "&Oid=" +
          webP.Oid +
          "&Oname=" +
          webP.Oname;
        const rec =
          "&userNameList=" +
          userNameList.join(",") +
          "&userPidList=" +
          userPidList.join(",");
        // const url = "http://10.194.72.31:8080/#/XYLink?pageType=1" + pos + rec;
        const url =
          "http://10.192.6.175:9090/JFLCMS/vue/#/XYLink?pageType=1" + pos + rec;
        setTimeout(() => {
          window.open(url);
          this.loading.close();
        }, 3000);
      }
    },
    /**
     * 在途列车消息处理
     * @param {Object} el
     * @param {Object} msgTrain
     */
    trainMessageArr(el, msgTrain) {
      const lastMapZoom = this.mapZoom;
      // 当前站===终到站，为终到车，则延迟从地图中移除
      const isEnd = msgTrain.CURRNAME === msgTrain.ENDNAME;

      // 1-4层 点状车
      // 5层上 图标车
      let hasFlag = false; //此车是否在地图中存在
      const existTrains = this.trainPointObj[msgTrain.LAT + "|" + msgTrain.LAT];
      C.$.each(this.markerLayer, (i, markerLayer) => {
        if (markerLayer) {
          const layers = markerLayer._layers;
          C.$.each(layers, (_key, layer) => {
            const options = layer.options.icon.options;
            if (options.data.TRAIN_ID === msgTrain.TRAIN_ID) {
              hasFlag = true;
              if (
                options.data.LAT === msgTrain.LAT ||
                options.data.LON === msgTrain.LON
              ) {
                //console.warn(msgTrain.TRAIN+"：收到列车消息【动车】，但位置未发生改变"+ (new Date()).Format("hh:mm:ss"),msgTrain)
              } else {
                // console.warn("【动车】" + msgTrain.TRAIN + " 位置改变" + (new Date()).Format("hh:mm:ss") + "," + options.data.LAT +
                // 	":" + options.data.LON + ">" + msgTrain.LAT + ":" + msgTrain.LON, msgTrain);
                el.addClass("filtered");
                setTimeout(() => {
                  el.removeClass("filtered");
                }, 5000);
                options.data.LAT = msgTrain.LAT;
                options.data.LON = msgTrain.LON;
                layer.setLatLng([msgTrain.LAT, msgTrain.LON]);
              }
              // 终到车
              if (isEnd) {
                console.warn("终到车：" + msgTrain.TRAIN, msgTrain);
                // if(typeof(existTrains)!=="undefined"){
                // 	if(existTrains.length===0){
                // 		delete this.trainPointObj[msgTrain.LAT+"|"+msgTrain.LAT];
                // 	}else{
                // 		existTrains.forEach((item,index)=>{
                // 			if(item.TRAIN====msgTrain.TRAIN){
                // 				this.trainPointObj[msgTrain.LAT+"|"+msgTrain.LAT].splice(index,1);
                // 			}
                // 		});
                // 	}
                // }
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
        const tempTrain = this.trainData.find(
          item => item.TRAIN_ID === msgTrain.TRAIN_ID
        );
        if (tempTrain) {
          console.warn("始发车：" + msgTrain.TRAIN, msgTrain);
          const isPoint = lastMapZoom < 5;
          const trainType = this.getTrainType(msgTrain.TRAIN); //TZKYGDC0 P
          if (trainType === "P") {
            if (this.markerLayer.PC_Layer) {
              const marker = this.createPkMarker([msgTrain], isPoint);
              this.markerLayer.PC_Layer._layers[
                msgTrain.TRAIN_ID
              ] = marker.addTo(this.map);
            }
          } else {
            if (this.markerLayer.PC_Layer) {
              const marker = this.createDcMarker([msgTrain], isPoint);
              this.markerLayer.DC_Layer._layers[
                msgTrain.TRAIN_ID
              ] = marker.addTo(this.map);
            }
          }
          if (typeof existTrains === "undefined") {
            this.trainPointObj[msgTrain.LAT + "|" + msgTrain.LON] = [msgTrain];
          } else {
            this.trainPointObj[msgTrain.LAT + "|" + msgTrain.LON].push(
              msgTrain
            );
          }
          this.setTrainCount();
        }
      }
    },
    //查询管辖区域
    queryPolygonPoints() {
      // C.getData({
      // 	c: "trdm_lv_692",
      // 	s: [this.oid.toUpperCase(), "1"],
      // 	async: true,
      // 	a: "获取指定组织机构GIS范围坐标点集合"
      // }, (rs) => {
      // 	var points = [];
      // 	rs.forEach(v => {
      // 		const p = [parseFloat(v.AREA_X), parseFloat(v.AREA_Y)];
      // 		points.push(p);
      // 	});
      // 	// points.push(points[0]);
      // 	console.log("获取指定组织机构GIS范围坐标点集合", rs)
      // 	this.compassLayer && this.map.removeLayer(this.compassLayer); //删除范围
      // 	if (points.length > 0) {
      // 		const firstX = rs[0].AREA_X.substring(0, rs[0].AREA_X.length - 1);
      // 		const firstN = rs[0].AREA_X.substr(-1);
      // 		points.push([firstX + (firstN === '5' ? '4' : '5'), rs[0].AREA_Y]);
      // 		this.drawLines(points);
      // 	}
      // });
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
        weight: 2, //线宽
        color: "#b0d7e1", //颜色
        opacity: 0.5 //透明度
      });
      this.compassLayer = antPath.addTo(this.map);
    },
    drawLinesTest() {
      let obj = [];
      this.suidaoData.forEach(item => {
        if (item.BRI_HOLE_NAME === "黄家梁隧道") {
          obj = item.lonlats;
        }
      });
      let antPath = L.polyline(obj, {
        weight: 2, //线宽
        color: "#00ff7f", //颜色
        opacity: 1 //透明度
      });
      // var measureParam = new SuperMap.MeasureParameters();
      // measureParam.geometry = antPath;
      // measureParam.unit = SuperMap.Unit.METER;
      // var measureService = L.supermap.measureService("url");
      // measureService.measureDistance(measureParam,function(serviceResult){
      // 	var result = serviceResult.result;
      // })

      this.compassLayer = antPath.addTo(this.map);
    },
    // 查看列车统计信息
    showTrainCharts(trainid) {
      let t = this;
      let item = this.trainData.find(v => v.TRAIN_ID === trainid);
      t.visible = true;
      t.detail = null;
      t.getClxq(item);
    },
    filterTrain() {
      const d = this.trainData.find(
        v => v.TRAIN.indexOf(this.filterTrainStr.toUpperCase()) > -1
      );
      if (d) {
        C.$(".filtered").removeClass("filtered");
        this.map.panTo([d.LAT, d.LON], {
          animate: true
        }); //平移地图
        C.$("#" + d.TRAIN_ID).addClass("filtered");
        setTimeout(() => {
          C.$(".filtered").removeClass("filtered");
        }, 5000);
      } else {
        this.$message.error("未找到指定车次！");
      }
    },
    closeMenu() {
      this.isMenuVisible = false;
    },
    // 工具栏点击事件
    toolClick(ty) {
      if (ty === "openPhone") {
        this.$refs.call.visibleWindow();
        return;
      }
      const trains = this.getSelectTrains();
      if (ty === "openXiaoYu") {
        let trainCount = trains.length;
        if (trainCount > 0) {
          var real = [];
          trains.forEach(train => {
            var now = new Date();
            now = now.Format("yyyy-MM-dd");
            C.getData(
              {
                c: "trdm_lv_647",
                s: [train.TRAIN, now],
                url: "http://10.192.34.79/TRDM/GeneralProServlet", //在途列车接口地址,
                a: "【trdm_lv_647】获取三乘信息"
              },
              r => {
                trainCount--;
                if (r !== "null") {
                  C.$.each(r, function(i, v) {
                    if (v.ZhiWei === "列车长") {
                      real.push(v);
                    }
                  });
                }
              }
            );
          });
          this.intervalTrainInfo = setInterval(() => {
            if (trainCount === 0) {
              console.log("real", real);
              this.callPhone(real, "xiaoyu", true);
              clearInterval(this.intervalTrainInfo);
            }
          }, 1000);
        } else {
          this.$emit("openXiaoYu");
        }
      } else if (ty === "openLate") {
        this.visibleLate = true;
      } else if (ty === "openTravel") {
        this.visibleTravel = true;
      } else if (trains.length === 0) {
        this.$message.error("请框车次！");
      } else if (ty === "openTask") {
        this.$emit("openTask", trains, this.trainData);
      } else if (ty === "openMsg") {
        this.$emit("openMsg", trains, this.trainData);
      }
    },
    startDraw() {
      if (this.drawFlag === "框选列车") {
        mapUtil.openEditFlag();
        this.drawFlag = "取消框选";
      } else {
        mapUtil.clearEidtAll();
        this.drawFlag = "框选列车";
        this.kuangXuanTrains = [];
        // C.$(".kuang-xuang").removeClass("kuang-xuang");
      }
    },
    // 框选结束
    endDrawLines(points) {
      const extTrains = [];
      // C.$(".kuang-xuang").removeClass("kuang-xuang");
      this.trainData.forEach(train => {
        const p = {
          x: train.LAT,
          y: train.LON
        };
        if (mapUtil.isPointInPoly(p, points)) {
          C.$("#" + train.TRAIN_ID).addClass("kuang-xuang");
          extTrains.push(train);
        }
      });
      this.kuangXuanTrains = extTrains;
      this.startDraw();
      console.log("extTrains", extTrains);
    },
    // 组织选中及框选的列车
    getSelectTrains() {
      const cks = [];
      this.checkedTrain.forEach(item => {
        cks.push(item.options.icon.options.data);
      });
      const kx = this.kuangXuanTrains.filter(item => cks.indexOf(item) < 0);
      return cks.concat(kx);
    },
    // 动车marker
    createDcMarker(data, isPoint) {
      let markers = [];
      let t = this;
      $.each(data, (i, item) => {
        var c_layer;
        let iconUrl = this.getMarkerIconImage(item);
        let c_dom = isPoint
          ? `<div id="${item.TRAIN_ID}" class="train-dd${item.dandang} train-for-ck ${iconUrl.cls} train-min-point ${iconUrl.trainType}" style="position:relative"><label class="count"></label><i></i></div>`
          : `<div id="${item.TRAIN_ID}" class="train-dd${item.dandang} map-train train-for-ck ${iconUrl.cls} ${iconUrl.trainType}" style="position:relative">
							<img src="${iconUrl.iconUrl}">
							<span class="num">${item.TRAIN} <label class="count"></label></span>
							<i></i>
						</div>`;
        var myIcon = L.divIcon({
          className: "train-icon-container",
          iconSize: isPoint ? [14, 14] : [80, 20],
          iconAnchor: isPoint ? [7, 7] : [0, 20],
          html: c_dom,
          data: item
        });
        c_layer = L.marker(
          {
            lon: item.LON,
            lat: item.LAT
          },
          {
            icon: myIcon
          }
        )
          .on("click", t.setTrainMarkerClick)
          .on("mousedown", param => {
            t.onMouseDown(param);
          });
        try {
          markers.push(c_layer);
        } catch (e) {
          console.log("iconUrl.trainType", iconUrl.trainType, item);
        }
        // 只有一列车，则为消息
        if (data.length === 1) {
          markers = c_layer;
        }
      });
      return markers;
    },
    // 普车marker
    createPkMarker(data, isPoint) {
      let markers = [];
      let t = this;
      let marker = null;
      $.each(data, (i, item) => {
        var c_layer;
        let iconUrl = this.getMarkerIconImage(item);
        let c_dom = isPoint
          ? `<div id="${item.TRAIN_ID}" class="train-dd${item.dandang} train-for-ck ${iconUrl.cls} train-min-point ${iconUrl.trainType}" style="position:relative"><label class="count"></label><i></i></div>`
          : `<div id="${item.TRAIN_ID}" class="train-dd${item.dandang} map-train train-for-ck ${iconUrl.cls} ${iconUrl.trainType}" style="position:relative">
							<img src="${iconUrl.iconUrl}">
							<span class="num">${item.TRAIN} <label class="count"></label></span>
							<i></i>
						  </div>`;
        var myIcon = L.divIcon({
          className: "train-icon-container",
          iconSize: isPoint ? [14, 14] : [80, 20],
          iconAnchor: isPoint ? [7, 7] : [0, 20],
          html: c_dom,
          data: item
        });
        c_layer = L.marker(
          {
            lon: item.LON,
            lat: item.LAT
          },
          {
            icon: myIcon
          }
        )
          .on("click", t.setTrainMarkerClick)
          .on("mousedown", param => {
            t.onMouseDown(param);
          });
        markers.push(c_layer);
        // 只有一列车，则为消息
        if (data.length === 1) {
          markers = c_layer;
        }
      });
      return markers;
    },
    // 获取晚点样式
    getLateClass(train, ty) {
      let lateCls = "";
      let times = parseInt(train.EDTIME);
      // 动车：0-5分钟不算晚点，5-120分钟，120-240分钟，240-360分钟，360分钟以上
      // 普车：0-5分钟不算晚点，240-480分钟，480-720分钟，720分钟以上
      if (ty === "D") {
        if (times >= 5 && times < 120) {
          lateCls = "wd-train wd1";
        } else if (times >= 120 && times < 240) {
          lateCls = "wd-train wd2";
        } else if (times >= 240 && times < 360) {
          lateCls = "wd-train wd3";
        } else if (times >= 360) {
          lateCls = "wd-train wd4";
        }
      } else {
        if (times >= 240 && times < 480) {
          lateCls = "wd-train wd2";
        } else if (times >= 480 && times < 720) {
          lateCls = "wd-train wd3";
        } else if (times >= 720) {
          lateCls = "wd-train wd4";
        }
      }
      return {
        late: lateCls !== "",
        cls: lateCls
        // cls : "wd-train wd4"
      };
    },
    //是否在桥隧上
    isNearQiaoSui(train) {
      const diffTwoPoint = (point1, point2) => {
        const xdiff = point1[0] - point2[0];
        const ydiff = point1[1] - point2[1];
        const diff = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
        return diff;
      };
      const x1 = train.LAT;
      const y1 = train.LON;
      if (train.TRAIN === "G3286") {
        this.suidaoData.forEach(suidao => {
          if (suidao.BRI_HOLE_NAME === "黄家梁隧道") {
            // if(suidao.BRI_HOLE_NAME==="庙子梁隧道"){
            const p1 = suidao.lonlats[0];
            const p2 = suidao.lonlats[suidao.lonlats.length - 1];
            const centerP = [
              (parseFloat(p1[0]) + parseFloat(p2[0])) / 2,
              (parseFloat(p1[1]) + parseFloat(p2[1])) / 2
            ]; //中点
            let r = diffTwoPoint(
              suidao.lonlats[0],
              suidao.lonlats[suidao.lonlats.length - 1]
            );
            r = r * 0.5; //半径
            console.log("半径>>>>>>", r);
            suidao.lonlats.forEach(item => {
              const xdiff = x1 - item[0];
              const ydiff = y1 - item[1];
              const d = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
              if (d - r < 0) {
                console.log("有效车离中心点距离>>>>>>", d);
              } else {
                console.log("车与桥隧中心点距离>>>>>>", d);
              }
            });
          }
        });
      }
    },
    // 获取列车对应图标
    getMarkerIconImage: function(data, isMini) {
      let iconUrl = "";
      let lateObj = {};
      // const qsFlag = this.isNearQiaoSui(data);//判断是否在桥隧上
      const qFlag = Math.random() > 0.8;
      const sFlag = Math.random() > 0.6;
      if (
        data.TRAIN.includes("D") ||
        data.TRAIN.includes("G") ||
        data.TRAIN.includes("C")
      ) {
        lateObj = this.getLateClass(data, "D");
        lateObj.trainType = "DC";
        iconUrl = require("./icons/普通动车.png");
        // if (qFlag) {
        // 	lateObj.trainType = "DQ";
        // 	iconUrl = require("./icons/桥动车.png");
        // } else if (sFlag) {
        // 	lateObj.trainType = "DS";
        // 	iconUrl = require("./icons/隧道动车.png");
        // }
      } else {
        // this.isNearQiaoSui(data)
        lateObj = this.getLateClass(data, "P");
        lateObj.trainType = "PC";
        iconUrl = require("./icons/普车.png");
        // if (qFlag) {
        // 	lateObj.trainType = "PQ";
        // 	iconUrl = require("./icons/桥普车.png");
        // } else if (sFlag) {
        // 	lateObj.trainType = "PS";
        // 	iconUrl = require("./icons/隧道普车.png");
        // }
      }
      return {
        iconUrl: iconUrl,
        ...lateObj
      };
    },
    createExitMarker(data) {},

    drawTrains(data) {
      let t = this;
      this.markerLayer.PC_Layer &&
        this.map.removeLayer(this.markerLayer.PC_Layer); //普车
      this.markerLayer.DC_Layer &&
        this.map.removeLayer(this.markerLayer.DC_Layer); //动车
      this.markerLayer.PC_Layer = L.layerGroup();
      this.markerLayer.DC_Layer = L.layerGroup();
      const isPoint = this.mapZoom < 5; //是否为圆点
      const markersD = this.createDcMarker(data["1"], isPoint);
      const markersP = this.createPkMarker(data["2"], isPoint);
      C.$.each(markersP, (i, marker) => {
        this.markerLayer.PC_Layer.addLayer(marker);
      });
      C.$.each(markersD, (i, marker) => {
        this.markerLayer.DC_Layer.addLayer(marker);
      });
      this.markerLayer.PC_Layer.addTo(this.map);
      this.markerLayer.DC_Layer.addTo(this.map);
      this.changeTrainDDAndLate();
      this.setTrainCount();
    },
    // 设置列车重叠数量
    setTrainCount() {
      setTimeout(() => {
        const ddFlag = this.checkLayerCheckFlag("担当车");
        C.$("label.count").html("");
        setTimeout(() => {
          C.$.each(this.trainPointObj, (k, v) => {
            let arr = ddFlag ? v.filter(item => item.dandang) : v;
            if (arr.length > 1) {
              arr.forEach(train => {
                C.$("#" + train.TRAIN_ID)
                  .find("label.count")
                  .html(arr.length);
                if (arr.length > 5) {
                  console.log("leng>>>>>>>", v);
                }
              });
            }
          });
        }, 50);
      }, 200);
    },
    // 桥遂marker点击事件
    setQiaoSuiMarkerClick(marker, data) {
      //设置列车marker的鼠标事件
      marker.on("click", e => {
        $(".leaflet-popup").remove();
        // const prev = 'http://10.194.72.27:8080/#/qiaoSuiInfo?';
        const prev = "http://10.192.34.84:9090/JFLCMS/vue/#/qiaoSuiInfo";
        const trainInfoPath =
          prev + "?name=" + data.BRI_HOLE_NAME + "&line=" + data.LINE_NAME;
        let nameDivIcon = L.divIcon({
          className: "textFonts",
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
        // this.map.panTo(e.latlng, {
        // 	animate: true
        // }); //平移地图
        L.marker(e.latlng, {
          icon: nameDivIcon
        }).addTo(this.map);
        setTimeout(() => {
          C.$("#popupLoading").remove();
        }, 1000);
      });
    },
    // 列车marker点击事件
    setTrainMarkerClick(param) {
      let train = param.target.options.icon.options.data;
      $(".leaflet-popup").remove();
      const count = C.$("#" + train.TRAIN_ID)
        .find("label.count")
        .html();
      if (count !== "") {
        const isSingle = C.$("#" + train.TRAIN_ID)
          .parent()
          .hasClass("single-train");
        let trains = this.trainPointObj[train.LAT + "|" + train.LON] || [];
        if (trains.length > 0 && isSingle === false) {
          C.$.each(trains, (i, d) => {
            C.$("#" + d.TRAIN_ID)
              .parent()
              .addClass("single-train");
            if (i > 0) {
              let mtop = -i * 26 - 20 + "px";
              if (this.mapZoom >= 5) {
                mtop = -i * 26 - 20 + "px";
              } else {
                mtop = -i * 15 - 7 + "px";
              }
              C.$("#" + d.TRAIN_ID)
                .parent()
                .css("margin-top", mtop);
            }
          });
          return;
        }
      }
      const { UserName, UserPID, Oid, Oname } = this.$store.state.params;
      // const prev = "http://10.194.72.27:8082/#/trainTravelInfo";
      const prev = "http://10.192.34.84:9090/JFLCMS/vue/#/trainTravelInfo";
      const trainInfoPath =
        prev +
        "?UserName=" +
        UserName +
        "&UserPID=" +
        UserPID +
        "&Oid=" +
        Oid +
        "&Oname=" +
        Oname +
        "&id=" +
        train.TRAIN_ID +
        "&cc=" +
        train.TRAIN;
      let nameDivIcon = L.divIcon({
        className: "textFonts",
        iconSize: [10, 10],
        popupAnchor: [0, 0],
        html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -25px, 0px); bottom: 0px; left:-260px;">
							<div class="leaflet-popup-tools">
								<a>操作</a>
								<ul>
									<li onclick="window.showTrainCharts('${train.TRAIN_ID}')">作业详情</li>
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
      // this.map.panTo([train.LAT, train.LON], {
      // 	animate: true
      // }); //平移地图
      L.marker([train.LAT, train.LON], {
        icon: nameDivIcon
      }).addTo(this.map);
      setTimeout(() => {
        C.$("#popupLoading").remove();
      }, 1000);
    },

    //当车次筛选栏变化时调用函数
    filterLayers(list) {
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
      if (this.checkLayerCheckFlag("天气")) {
        this.weatherLayer && this.map.addLayer(this.weatherLayer);
      } else {
        this.weatherLayer && this.map.removeLayer(this.weatherLayer);
      }
      if (this.checkLayerCheckFlag("天气预警")) {
        this.yuJingLayer && this.map.addLayer(this.yuJingLayer);
      } else {
        this.yuJingLayer && this.map.removeLayer(this.yuJingLayer);
      }
      if (this.checkLayerCheckFlag("普车")) {
        this.markerLayer.PC_Layer &&
          this.map.addLayer(this.markerLayer.PC_Layer);
        this.changeTrainDDAndLate();
      } else {
        this.markerLayer.PC_Layer &&
          this.map.removeLayer(this.markerLayer.PC_Layer);
      }
      if (this.checkLayerCheckFlag("动车")) {
        this.markerLayer.DC_Layer &&
          this.map.addLayer(this.markerLayer.DC_Layer);
        this.changeTrainDDAndLate();
      } else {
        this.markerLayer.DC_Layer &&
          this.map.removeLayer(this.markerLayer.DC_Layer);
      }
      this.setTrainCount();
    },
    // 过滤担当车+晚点车
    changeTrainDDAndLate() {
      if (this.checkLayerCheckFlag("担当车")) {
        C.$(".train-dd0").hide();
      } else {
        C.$(".train-dd0").show();
      }
      this.changeTrainLate();
    },
    // 检查图层是否允许显示
    checkLayerCheckFlag(txt) {
      return this.layerFilters.indexOf(txt) > -1;
    },
    getClxq(item) {
      // [["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"]]
      let t = this;
      const _date = echarts.format.formatTime(
        "yyyyMMdd",
        new Date(item.START_DATE).getTime()
      );
      const p = [item.TRAIN, _date];
      this.detailSql = p;
      home
        .getClxq({
          s: [p]
        })
        .then(
          r => {
            if (r) {
              t.detail = r;
              // t.visible = true
            } else {
              this.$message("接口错误");
            }
            t.loading.close();
          },
          error => {
            t.loading.close();
            t.$notify.error({
              title: "提示",
              message: "获取车辆详情异常"
            });
          }
        );
    },
    //应急救援通道
    getExit() {
      let t = this;
      home.getExit({}).then(
        r => {
          if (r) {
            t.createExitMarker(r["1"]);
          } else {
            this.$message("接口错误");
          }
        },
        error => {
          t.$notify.error({
            title: "提示",
            message: "获取应急救援通道数据异常"
          });
        }
      );
    },
    // 获取未来天气
    getFutureWeather(e) {
      if (!this.ctrlFlag) {
        return;
      }
      this.ctrlFlag = false;
      let p = e.latlng;
      $(".leaflet-popup").remove();
      // const prev = "http://10.194.72.27:8081/#/futureWeather"
      // const prev = "http://10.192.6.155:9090/JFLCMS/vue/#/futureWeather";
      const prev = "http://10.192.34.84:9090/JFLCMS/vue/#/futureWeather";
      const trainInfoPath =
        prev +
        "?lat=" +
        p.lat +
        "&lng=" +
        p.lng +
        "&StnCode=" +
        (e.StnCode ? e.StnCode : "");
      let nameDivIcon = L.divIcon({
        className: "textFonts",
        iconSize: [10, 10],
        popupAnchor: [0, 0],
        html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; bottom: 0px; left:-150px;">
								<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
								<div class = "leaflet-popup-content-wrapper blue">
								<div class="leaflet-popup-content no-padding" style="position:relative;width:300px;height: 330px;border-radius: 10px;background:rgba(0,0,0,.3)">
									<div><h2 style="margin:0;padding-left:110px;padding-top:5px;font-size:14px;">天气预报</h2></div>
									<iframe src="${trainInfoPath}" style="height: 360px;width: 100%;margin-left:-1px;border-radius:10px;" frameborder="0"></iframe>
								</div>
								</div>
								<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
								<div class="leaflet-popup-tip blue"></div></div>
							   </div>`
      });
      L.marker([p.lat, p.lng], {
        icon: nameDivIcon
      }).addTo(this.map);
    },
    //获取当前天气信息
    getData_curWeather() {
      let t = this;
      this.weatherLayer && this.map.removeLayer(this.weatherLayer);
      home.getCurWeather({}).then(
        r => {
          if (r) {
            if (r["1"].length === 0) {
              console.warn("未获取到天气信息");
            }
            console.log("获取当前天气信息", r);
            let weatherGroup = L.layerGroup(); //天气
            // C.$.each([{LAT:"30.62163483453266", LON:"104.13359743541896"}], (index, item) => {
            C.$.each(r["1"], (index, item) => {
              // BRI_HOLE_NAME 名称
              const imgUrl =
                "https://10.192.34.79/ky3450/SOSE/weather/icons/" +
                item.ICON +
                "-fill.svg";
              const marker = L.marker([item.LAT, item.LON], {
                icon: L.divIcon({
                  className: "textFonts",
                  iconSize: [30, 30],
                  popupAnchor: [5, 5],
                  html: `<div class="marker-weather"><img src="${imgUrl}"/></div>`
                })
              }).on("click", () => {
                // this.map.panTo([item.LAT, item.LON], {
                // 	animate: true
                // }); //平移地图
                console.log("正在获取车站未来天气信息：", item);
                this.ctrlFlag = true;
                this.getFutureWeather({
                  StnCode: item.STN_CODE,
                  latlng: {
                    lat: item.LAT,
                    lng: item.LON
                  }
                });
              });
              weatherGroup.addLayer(marker);
            });
            if (this.checkLayerCheckFlag("天气")) {
              this.weatherLayer = weatherGroup.addTo(this.map);
            } else {
              this.weatherLayer = weatherGroup;
            }
          } else {
            this.$message("接口错误");
          }
        },
        error => {
          t.$notify.error({
            title: "提示",
            message: "获取当前天气信息数据异常"
          });
        }
      );
    },
    //获取当前预警信息
    getData_yuJing() {
      let t = this;
      this.yuJingLayer && this.map.removeLayer(this.yuJingLayer);
      home.getYuJing({}).then(
        r => {
          if (r) {
            if (r["1"].length === 0) {
              console.warn("未获取到预警信息");
            }
            console.log("获取当前预警信息", r);
            let yuJingLayer = L.layerGroup(); //天气
            // C.$.each([{LAT:"30.62163483453266", LON:"104.13359743541896"}], (index, item) => {
            C.$.each(r["1"], (index, item) => {
              // BRI_HOLE_NAME 名称
              const imgUrl =
                "https://10.192.34.79/ky3450/SOSE/weather/icons/" +
                item.level +
                "预警.png";
              const marker = L.marker([item.LAT, item.LON], {
                icon: L.divIcon({
                  className: "textFonts",
                  iconSize: [30, 30],
                  popupAnchor: [5, 5],
                  html: `<div class="marker-weather yujing"><img src="${imgUrl}"/></div>`
                })
              }).on("click", () => {
                item.startTime = item.startTime.substring(0, 16);
                item.endTime = item.endTime.substring(0, 16);
                const arr = item.title.split("[");
                item.title1 = arr[0];
                item.title2 = "[" + arr[1];
                $(".leaflet-popup").remove();
                let nameDivIcon = L.divIcon({
                  className: "textFonts",
                  iconSize: [10, 10],
                  popupAnchor: [0, 0],
                  html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -5px, 0px); bottom: 0px; left:-145px;">
											<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
											<div class = "leaflet-popup-content-wrapper blue">
											<div class="leaflet-popup-content no-padding" style="position:relative;width:320px;height: 250px;border-radius: 10px;background:rgba(0,0,0,.3)">
												<div style="padding-top:20px;">
													<div style="white-space: nowrap;display:inline-block;padding-left:15px;letter-spacing: 2px;font-weight: bold;font-size:16px;height: 30px;color:#00c4ff;">${item.typeName}${item.level}预警</div>
													<div style="float:right;color:#819dae;padding-right: 25px;margin-top:-5px;">
														<div>${item.startTime}</div>
														<div>${item.endTime}</div>
													</div>
												</div>
												<div style="padding:10px;">
													<div style="font-size:14px;padding-bottom:10px;">
														<img src="${this.yujing}" style="margin-right:5px;display:inline-block;vertical-align: middle;"/>
														<span style="display:inline-block;vertical-align: middle;width:200px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;" title="${item.title1}">${item.title1}</span>
														<span style="float:right;color:#00c4ff;">${item.title2}</span>
													</div>
													<p style="height:150px;overflow:auto;margin:0;padding:10px;border-radius: 10px;line-height: 20px;text-indent:24px;background:rgba(255,255,255,.1)">${item.text}</p>
												</div>
											</div>
											</div>
											<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
											<div class="leaflet-popup-tip blue"></div></div>
										   </div>`
                });
                L.marker([item.LAT, item.LON], {
                  icon: nameDivIcon
                }).addTo(this.map);
              });
              yuJingLayer.addLayer(marker);
            });
            if (this.checkLayerCheckFlag("天气预警")) {
              this.yuJingLayer = yuJingLayer.addTo(this.map);
            } else {
              this.yuJingLayer = yuJingLayer;
            }
          } else {
            this.$message("接口错误");
          }
        },
        error => {
          t.$notify.error({
            title: "提示",
            message: "获取当前预警信息数据异常"
          });
        }
      );
    },
    // 获取桥遂数据
    getData_qiaoliang(cb) {
      C.getData(
        {
          c: "kydp_zxy8020",
          s: ["ALL", "ALL"],
          a: "获取桥遂数据",
          url:
            process.env.NODE_ENV == "development"
              ? "http://10.192.126.203:9088/GeneralProServlet"
              : "https://10.192.34.79/ky203/GeneralProServlet"
        },
        r => {
          r = JSON.parse(r.data);
          console.log("桥梁隧道", r);
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
            if (
              points.length === 3 &&
              points[0] === points[1] &&
              points[1] === points[2]
            ) {
              singleFlag = true;
            }
            item.singleFlag = singleFlag;
            // 桥梁
            if (item.BRI_HOLE_TYPE === "0") {
              qiaoliangData.push(item);
              const marker = singleFlag
                ? L.marker([item.lonlats[0][0], item.lonlats[0][1]], {
                    icon: L.divIcon({
                      className: "textFonts",
                      iconSize: [10, 10],
                      popupAnchor: [5, 5],
                      html: `<div class="marker-qiaosui" style="color:#FF9966;transform:scale(0.7)">▲</div>`
                    })
                  })
                : L.polyline(item.lonlats, {
                    color: "#FF9966",
                    weight: 5
                  });
              this.setQiaoSuiMarkerClick(marker, item);
              linesQiaoLiang.addLayer(marker);
            }
            // 隧道
            else if (item.BRI_HOLE_TYPE === "1") {
              suidaoData.push(item);
              const marker = singleFlag
                ? L.marker([item.lonlats[0][0], item.lonlats[0][1]], {
                    icon: L.divIcon({
                      className: "textFonts",
                      iconSize: [10, 10],
                      popupAnchor: [5, 5],
                      html: `<div class="marker-qiaosui" style="color:#6c00d8;transform:scale(0.7)">▲</div>`
                    })
                  })
                : L.polyline(item.lonlats, {
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
          cb.call(null);
        }
      );
    },
    // 判断列车类型
    getTrainType(txt) {
      // const typeStr = "TZKYGDC0"; //特快、直达、快速、旅游、高铁、动车、城际列车、空送/动检车
      const typeStr = "GDC0"; //特快、直达、快速、旅游、高铁、动车、城际列车、空送/动检车
      const first = txt.substring(0, 1);
      return typeStr.indexOf(first) > -1
        ? txt.indexOf("K") > 0
          ? "P"
          : first
        : "P";
    },
    getTrains() {
      let t = this;
      this.trainPointObj = {};
      home.getTrains({}).then(
        r => {
          console.log("全国在途列车", r);
          if (r) {
            // 返回数据// 1：动车组列车// 2：普速客车// 3：货车// 4：晚点客车// 5：告警客车// 6：晚点货车// 7：告警货车// 8：管外车
            t.trainData = r["1"]
              .concat(r["2"])
              .concat(r["4"])
              .concat(r["5"])
              .concat(r["8"])
              .filter(v => v.LAT !== "" && v.LON !== "");
            let dataD = [];
            let dataP = [];
            let trainPointObj = {};
            let tempObj = {};
            t.trainData.forEach(train => {
              if (typeof tempObj[train.TRAIN_ID] === "undefined") {
                tempObj[train.TRAIN_ID] = 1;
                const trainType = this.getTrainType(train.TRAIN);
                train.dandang = train.DEPOT === this.oname ? 1 : 0;
                if (trainType === "P") {
                  dataP.push(train);
                } else {
                  dataD.push(train);
                }
                const _key = train.LAT + "|" + train.LON;
                if (typeof trainPointObj[_key] === "undefined") {
                  trainPointObj[_key] = [train];
                } else {
                  trainPointObj[_key].push(train);
                }
              }
            });
            this.trainPointObj = trainPointObj;
            console.log("trainPointObj", trainPointObj);
            t.drawTrains({
              "1": dataD,
              "2": dataP
            });
          } else {
            this.$message({
              type: "error",
              message: "接口错误"
            });
          }
          t.loading.close();
        },
        error => {
          t.loading.close();
          t.$notify.error({
            title: "提示",
            message: "获取车辆信息异常"
          });
        }
      );
    },
    // 分配临时任务
    handleAddTempTask(MOD_ID) {
      let checked = [];
      this.checkedTrain.forEach(train => {
        let trainInfo = [];
        trainInfo.push(
          train.options.icon.options.data.START_DATE.toString()
            .substring(0, 10)
            .replace(/-/g, "")
        );
        trainInfo.push(train._icon.querySelector("label").innerHTML);
        trainInfo.push(MOD_ID);
        checked.push(trainInfo);
      });
      this.$store
        .dispatch("tasks/dispatchTempTask", checked)
        .then(res => {
          this.$message.success(res);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    //初始化底图图层
    initBaseLayer(layerKey) {
      mapUtil.initBaseLayer(layerKey);
    },
    initFunction() {
      this.mapType = "cdj";

      this.initMap();
      this.initBaseLayer(this.mapType);
      // this.initMarkerLayer();
    },
    //初始化地图
    initMap() {
      //边界
      mapUtil.initMap();
    },
    //初始化图标图层
    initMarkerLayer() {
      markerUtil.initMarkers();
    },
    onDblClick(param) {
      let t = this;
      let item = param.target.options.icon.options.data;
      t.visible = true;
      t.detail = null;
      t.getClxq(item);
    },
    onMapClick(e) {
      if (!e.ctrlKey) {
        this.checkedTrain.forEach((item, i) => {
          let html = item.options.icon.options.html;
          html = html.replace(/ctrl-select/g, "train-for-ck");
          item.options.icon.options.html = html;
          item.refreshIconOptions();
        });
        this.checkedTrain = [];
      }
    },
    // 右键弹出菜单
    onMapRightClick(e) {
      this.menuLeft = e.clientX - 650;
      this.menuTop = e.clientY - 150;
      this.isMenuVisible = true;
    },

    onMapZoom(e) {
      let t = this;
      const newZoom = e.target._zoom;
      const oldRoom = t.mapZoom;
      console.log("onMapZoom", newZoom);
      if (oldRoom !== newZoom) {
        if (newZoom >= t.initZoom && oldRoom < t.initZoom) {
          //放大
          C.$.each(this.markerLayer, (i, layerObj) => {
            layerObj.eachLayer(layer => {
              const item = layer.options.icon.options.data;
              let iconUrl = this.getMarkerIconImage(item);
              let c_dom = `<div id="${item.TRAIN_ID}" class="train-dd${item.dandang} map-train train-for-ck ${iconUrl.cls} ${iconUrl.trainType}" style="position:relative">
												<img src="${iconUrl.iconUrl}">
												<span class="num">${item.TRAIN} <label class="count"></label></span>
												<i></i>
											  </div>`;
              layer.options.icon.options.html = c_dom;
              layer.options.icon.options.className = "";
              layer.options.icon.options.iconSize = [80, 20];
              layer.options.icon.options.iconAnchor = [0, 20];
              layer.refreshIconOptions();
            });
          });
          this.changeTrainDDAndLate();
        } else if (newZoom < t.initZoom && oldRoom >= t.initZoom) {
          //缩小
          C.$.each(this.markerLayer, (i, layerObj) => {
            layerObj.eachLayer(layer => {
              const item = layer.options.icon.options.data;
              let iconUrl = this.getMarkerIconImage(item);
              let c_dom = `<div id="${item.TRAIN_ID}" class="train-dd${item.dandang} train-for-ck ${iconUrl.cls} train-min-point ${iconUrl.trainType}" style="position:relative;"><label class="count"></label><i></i></div>`;
              layer.options.icon.options.html = c_dom;
              layer.options.icon.options.iconSize = [14, 14];
              layer.options.icon.options.iconAnchor = [7, 7];
              layer.refreshIconOptions();
            });
          });
          this.changeTrainDDAndLate();
        }
        this.setTrainCount();
      }
      // 桥遂三角形图标缩放
      if (newZoom > 3) {
        C.$(".marker-qiaosui").addClass("big");
      } else {
        C.$(".marker-qiaosui").removeClass("big");
      }
      t.mapZoom = newZoom;
    },
    onMouseDown(param) {
      if (window.event.button === 2) {
        let t = this;
        this.phoneListCC = param.target.options.icon.options.data.TRAIN;
        this.visiblePhone = true;
        this.phoneListStyle = {
          top: window.event.y + "px",
          left: window.event.x + "px"
        };
      } else {
        this.visiblePhone = false;
      }
    }
  }
};
</script>

<style scoped="scoped">
.tools-con {
  position: fixed;
  bottom: 10px;
  left: 50%;
  margin-left: -380px;
  width: 760px;
  height: 120px;
  background: rgba(13, 26, 88, 0.9);
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  z-index: 410;
  transition: height 0.3s;
}

.tools-item-con {
  position: absolute;
  top: 30px;
  left: 10px;
  width: 100%;
  transition: top 0.3s;
}

.tools-item-con.show {
  top: 0px;
}

.tools-control {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transition: bottom 0.3s;
}

.tools-control.opened {
  top: 0px;
  bottom: unset;
  z-index: 10;
}

>>> .leaflet-div-icon {
  border: 0;
  background: rgba(0, 0, 0, 0);
}

>>> .el-dialog {
  /* margin-top: 5% !important; */
}

>>> .el-checkbox {
  margin-right: 20px;
}
</style>
<style>
.train-zoy,
.train-lhxtd,
.train-yj {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.train-zoy {
  background: #ffbd55;
}

.train-lhxtd {
  background: #5dff55;
}

.train-yj {
  background: #55a5ff;
}

/*应急救援通道*/
.exit img {
  width: 16px;
  height: 16px;
}

/*天气*/
.marker-weather {
  font-size: 20px;
  width: 30px;
  height: 30px;
  padding: 5px;
  text-align: center;
  background: rgba(254, 254, 254, 0.2);
  border-radius: 5px;
}

.marker-weather.yujing {
  background: transparent;
}

.marker-weather > img {
  width: 20px;
  height: 20px;
}

/* 桥遂三角形图标 */
.marker-qiaosui.big {
  transform: scale(1.2) !important;
}

.map-train label.count {
  color: red;
  display: none;
}

.train-min-point {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3d8fd1;
  font-size: 12px;
  border-radius: 50%;
  text-align: center;
}

/* 晚点列车 */
.map-train > .num {
  position: absolute;
  display: inline-block;
  left: 5px;
  padding-left: 5px;
  right: 0px;
  top: 1px;
  background: transparent;
  color: white;
}

.map-train > i {
  position: absolute;
  display: inline-block;
  left: 5px;
  padding-left: 5px;
  right: 0px;
  top: 1px;
  bottom: 9px;
  color: white;
  background: transparent;
  animation: trainLateAnimate 1.5s;
  animation-iteration-count: infinite;
}

/* 普通 A6ABE2 桥 DAAD3C 隧道 9A52EA */
.wd-train.wd1 > i {
  box-shadow: 0 0 20px #a6abe2;
}

.wd-train.wd2 > i {
  box-shadow: 0 0 20px #b86f33;
}

.wd-train.wd3 > i {
  box-shadow: 0 0 20px #e8af16;
}

.wd-train.wd4 > i {
  box-shadow: 0 0 20px #ff0202;
}

@keyframes trainLateAnimate {
  from {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0.3;
  }
}

/* 筛选得到的车次样式 */
.filtered > img {
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
