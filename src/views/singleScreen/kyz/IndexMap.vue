<template>
  <div
    class="skin-blue"
    @keydown.17="ctrlFlag=true"
    @keyup.17="ctrlFlag=false"
    style="width: 100%;height:100%;overflow: hidden;padding:0;margin:0;"
  >
    <div
      v-show="mapZoom>2"
      style="position: absolute;top:80px;left:50%;margin-left:-100px;width: 200px;z-index: 410;"
    >
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
      <div class="tools-control" :class="{opened:toolVisible}" @click="toolVisible=!toolVisible">
        <i
          v-if="toolVisible"
          class="el-icon-d-arrow-right"
          style="font-size: 16px;cursor: pointer;transform: rotate(90deg);margin-top: -2px;"
        ></i>
        <i v-else class="el-icon-s-tools" style="font-size: 16px;cursor: pointer;margin-top: 4px;"></i>
      </div>
      <div class="tools-item-con" :class="{show:toolVisible}">
        <div class="filter-group">
          <div class="group-title">列车</div>
          <div class="group-body">
            <el-checkbox v-model="filter.dongche" label="动车">
              <i class="filter-icon dongche"></i>动车
            </el-checkbox>
            <el-checkbox v-model="filter.puche" label="普车">
              <i class="filter-icon puche"></i>普车
            </el-checkbox>
            <el-checkbox v-model="filter.dandang" label="担当车">
              <i class="filter-icon dandang"></i>担当车
            </el-checkbox>
          </div>
        </div>
        <div class="filter-group">
          <div class="group-title">桥隧</div>
          <div class="group-body">
            <el-checkbox v-model="filter.qiaoliang" label="桥梁">
              <i class="filter-icon qiaoliang"></i>桥梁
            </el-checkbox>
            <el-checkbox v-model="filter.suidao" label="隧道">
              <i class="filter-icon suidao"></i>隧道
            </el-checkbox>
          </div>
        </div>
        <div class="filter-group">
          <div class="group-title">天气</div>
          <div class="group-body">
            <el-checkbox v-model="filter.tianqi" label="天气">
              <i class="filter-icon tianqi"></i>天气情况
            </el-checkbox>
            <el-checkbox v-model="filter.tianqiyujing" label="天气预警">
              <i class="filter-icon tianqiyujing"></i>天气预警
            </el-checkbox>
          </div>
        </div>
        <div class="filter-group">
          <div class="group-title">
            区域
            <i
              v-if="filter_quyu.length>0"
              class="el-icon-edit"
              @click="quyuEdit=!quyuEdit"
              title="编辑区域"
              style="margin-left: 10px;cursor: pointer;"
            ></i>
          </div>
          <div class="group-body">
            <template v-for="(qy,index) in filter_quyu">
              <span v-if="quyuEdit">
                <el-input v-model="qy.REGION_NAME" size="mini" style="width: 200px;"></el-input>
                <i
                  class="el-icon-circle-check"
                  style="margin: 0 5px;cursor: pointer;"
                  title="保存"
                  @click="handleUpdateQuyu(qy)"
                ></i>
                <el-popconfirm title="确定删除此区域？" @onConfirm="handleDeletQuyu(qy,index)">
                  <i
                    slot="reference"
                    class="el-icon-delete"
                    style="color: red;cursor: pointer;"
                    title="删除"
                  ></i>
                </el-popconfirm>
              </span>
              <el-checkbox
                v-else
                v-model="qy.visible"
                :label="qy.REGION_NAME"
                @change="handleFilterQuyu(qy)"
              ></el-checkbox>
            </template>
          </div>
        </div>
        <div class="filter-group">
          <div class="group-title">其它</div>
          <div class="group-body" v-show="filter.dongche">
            <div @click="toolClick('openLate','动车')" class="late-train-link">动车晚点</div>
            <el-checkbox v-model="filter.late_d1" :disabled="!filter.dongche" label="5-120分钟">
              <i class="filter-late wd1"></i>5-120分
            </el-checkbox>
            <el-checkbox v-model="filter.late_d2" :disabled="!filter.dongche" label="120-240分钟">
              <i class="filter-late wd2"></i>120-240分
            </el-checkbox>
            <el-checkbox v-model="filter.late_d3" :disabled="!filter.dongche" label="240-360分钟">
              <i class="filter-late wd3"></i>240-360分
            </el-checkbox>
            <el-checkbox v-model="filter.late_d4" :disabled="!filter.dongche" label="360分钟以上">
              <i class="filter-late wd4"></i>360分以上
            </el-checkbox>
          </div>
          <div class="group-body" v-show="filter.puche">
            <div @click="toolClick('openLate','普车')" class="late-train-link">普车晚点</div>
            <el-checkbox v-model="filter.late_p2" :disabled="!filter.puche" label="240-480分钟">
              <i class="filter-late wd2"></i>240-480分
            </el-checkbox>
            <el-checkbox v-model="filter.late_p3" :disabled="!filter.puche" label="480-720分钟">
              <i class="filter-late wd3"></i>480-720分
            </el-checkbox>
            <el-checkbox v-model="filter.late_p4" :disabled="!filter.puche" label="720分钟以上">
              <i class="filter-late wd4"></i>720分以上
            </el-checkbox>
          </div>
        </div>
        <div class="filter-group">
          <div class="group-title">操作</div>
          <div class="group-body flex">
            <el-button
              :type="drawFlag==='框选列车'?'primary':'info'"
              size="small"
              icon="el-icon-news"
              @click="startDraw"
            >{{drawFlag}}</el-button>
            <el-button
              type="primary"
              size="small"
              @click="toolClick('openXiaoYu')"
              icon="el-icon-document"
            >音视频对讲</el-button>
          </div>
          <div class="group-body flex">
            <!-- <el-image :src="msgImg" @click="toolClick('openMsg')" title="发送消息" class="tool-img-btn"></el-image> -->
            <!-- <el-image :src="callImg" @click="toolClick('openXiaoYu')" title="音视频对讲" class="tool-img-btn"></el-image> -->
            <!-- <el-image :src="phoneImg" @click="toolClick('openPhone')" title="应急呼叫" class="tool-img-btn"></el-image> -->
          </div>
          <div v-show="mapZoom===1||mapZoom===2" class="group-body">
            <div>当前查看时间：{{flyHours}}点</div>
            <el-slider v-model="flyHours" show-stops :show-tooltip="false" :max="23"></el-slider>
          </div>
        </div>
      </div>
    </div>
    <!-- 地图 -->
    <div id="home-map" style="width: 100vw;height: calc(100vh);background: #1c2026;"></div>

    <!-- 列车右键菜单 -->
    <TrainPhoneList
      v-if="visiblePhone"
      :style="phoneListStyle"
      :cc="phoneListCC"
      @callPer="callPhone"
    ></TrainPhoneList>
    <!-- 正晚点信息 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visibleLate"
      title="正晚点信息"
      width="800px"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <div class="skin-blue" style="height: 600px">
        <MapTrainLate :trains="dataTrain" :defaultLate="lateListType" :mapFilter="filter"></MapTrainLate>
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
    <!-- 区域编辑窗口 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visibleQuYu"
      title="区域编辑"
      width="500px"
      style="margin-top: 100px;"
      :destroy-on-close="true"
      :append-to-body="false"
    >
      <div style="padding-top:20px;">
        <el-form
          ref="myForm"
          :model="formQuYu"
          :rules="rulesQuYu"
          :inline="true"
          size="mini"
          @submit.native.prevent
          label-width="120px"
          style="height: auto;padding: 0px;"
        >
          <el-form-item label="区域名称:" prop="REGION_NAME">
            <el-input v-model="formQuYu.REGION_NAME" placeholder="请输入区域名称" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="是否发送消息:">
            <el-radio v-model="formQuYu.REGION_TYPE" label="1">发送警戒消息</el-radio>
            <el-radio v-model="formQuYu.REGION_TYPE" label="0">不发送警戒消息</el-radio>
          </el-form-item>
          <el-form-item label="警戒消息内容:">
            <el-input
              v-model="formQuYu.WARN_MESSAGE"
              type="textarea"
              :rows="4"
              placeholder="请输入警戒消息内容"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button plain style="width: 120px;" @click="haddleCloseQuyu">关闭</el-button>
        <el-button type="primary" style="width: 120px;" @click="haddleSaveQuyu">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import C from "../../../assets/com.js";
import store from "../../../store";
import mapUtil from "./mapUtil.js";
import home from "./home.js";
import flyBlLayerUtil from "../../../assets/map/flyBlLayerUtil.js";
import websoketMsg from "../../../assets/websoketMsg.js"; //消息
import TrainPhoneList from "./components/TrainPhoneList.vue"; //列车长电话右键菜单
import MapTrainLate from "./components/MapTrainLate.vue"; //晚点车列表
// import MapTravelService from "./components/MapTravelService.vue" //旅服信息列表
// import call from 'liuzb-anycall' //拨打电话

import TrainTravelInfo from "./components/public/TrainTravelInfo.vue"; //列车详情
import QiaoSuiInfo from "./components/public/QiaoSuiInfo.vue"; //桥隧信息
export default {
  data() {
    return {
      ctrlFlag: false, //键盘Ctrl键是否按下
      //sip params
      targetNumber: "",
      initGroupNo: "1002",
      vc: false,
      ipos: "bottom",
      //sip params
      /**缩放等级相关*/
      maxZoom: 11,
      minZoom: 1,
      initZoom: 5,
      mapZoom: 1, //当前地图缩放等级
      mapUrl:
        "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3", //地图服务
      trainLineUrl:
        "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine", //铁路线服务
      chengduDetailUrl:
        "http://10.192.125.55:8090/iserver/services/map-ugcv5-chengduCity/rest/maps/chengduCity", //成都详细地图服务
      lineLayers: null, //铁路线图层
      chengduLayers: null, // 成都详细地图
      filterTrainStr: "", //全局搜索车次
      toolVisible: false, // 底部工具栏
      visible: false, //列车详情窗口
      detail: {},
      detailSql: [],
      visiblePhone: false, //电话列表窗口
      phoneListCC: "",
      phoneListTrain: [],
      visibleQuYu: false, //区域编辑窗口
      formQuYu: {
        REGION_ID: "", //id
        REGION_TYPE: "1", //区域类型（0-不发送警戒消息，1-发送警戒消息）
        REGION_NAME: "", //区域名称
        TRAIN_LIST: [], //列车列表
        WARN_MESSAGE: "", //警戒消息内容
        DEPOT: this.oname, //所属客运段
        POINT_LIST: [] //点列表
      },
      rulesQuYu: {
        REGION_NAME: [
          {
            required: true,
            message: "请填写区域名称",
            trigger: "change"
          }
        ]
      },
      phoneImg: require("../../images/call.png"), //应急呼叫
      msgImg: require("../../images/sendMsg.png"), //发送消息
      callImg: require("../../images/vidio.png"), //音视频对讲
      yujingImg: require("./icons/yujingIcon.png"), //天气预警窗口内图标
      layerWeather: null, //图层---当前天气
      layerYuJing: null, //图层---当前天气预警
      layerQiaoLiang: null, //图层---桥梁
      layerSuiDao: null, //图层---隧道
      layerTrains: null, //图层---在途车
      dataQiaoLiang: [], //数据---桥梁
      dataSuiDao: [], //数据---隧道
      dataTrain: [], //数据---在途车
      dataPointTrain: {}, //数据---坐标在途车
      dataTrainLate: [], //晚点车
      // 过滤图层
      filter: {
        dandang: true, //担当车
        puche: true, //普车
        dongche: true, //动车
        qiaoliang: true, //桥梁
        suidao: true, //隧道
        tianqi: false, //天气
        tianqiyujing: false, //天气预警
        late_d1: false, //5-120分钟
        late_d2: false, //120-240分钟
        late_d3: false, //240-360分钟
        late_d4: false, //360分钟以上
        late_p2: false, //240-480分钟
        late_p3: false, //480-720分钟
        late_p4: false //720分钟以上
      },
      quyuEdit: false, //区域编辑状态
      filter_quyu: [], //区域列表
      drawPoints: [], //框选点
      drawFlag: "框选列车",
      //
      visibleLate: false, //正晚点窗口
      lateListType: "", //正晚点默认选中
      visibleTravel: false, //旅服信息窗口
      loading: {},
      //				1   2    3    4    5     6    7     8	  9		10	  11
      markerDiff: [
        "",
        6,
        2.5,
        1.6,
        1.1,
        0.9,
        0.55,
        0.42,
        0.3,
        0.22,
        0.11,
        0.055
      ], //桥隧、天气、预警、车信息marker向下偏移量
      compassLayer: null, //管辖区域图层
      // 飞行图层
      flayLayer: null,
      allFlayOptions: [],
      flyHours: new Date().getHours(),
      flyInterval: null
    };
  },
  watch: {
    mapView(v) {
      if (v === "all") {
        this.map.setMinZoom(1);
        this.map.setZoom(1);
      } else {
        this.map.setMinZoom(5);
      }
    },
    oid() {
      this.queryPolygonPoints();
      this.getData_flyTrain();
      if (this.dataSuiDao.length > 0) {
        this.getData_onRoadTrain(true);
      }
    },
    filter: {
      handler: function(a, b) {
        this.filterMarkers(a, b);
      },
      deep: true //深度监听
      // immediate:true//绑定完监听后立即执行
    },
    // 飞行图时间轴改变
    flyHours(v) {
      this.drawFly(this.allFlayOptions[this.flyHours]);
    }
  },
  mounted() {
    // 绑定 查看列车统计图方法
    window.showTrainCharts = trainid => this.showTrainCharts(trainid);
    // 禁用右键
    document.oncontextmenu = () => {
      return false;
    };
    // 鼠标点击时，将列车长电话窗口关闭
    document.body.addEventListener("click", () => {
      this.visiblePhone = false;
    });
    // 实例化在途列车消息
    websoketMsg.init({
      onmessage: msg => {
        this.trainMessageArr(msg);
      }
    });
    // 实例化地图
    mapUtil.setVm(this);
    mapUtil.initMap();
    this.loading = this.$loading({
      lock: true,
      text: "正在加载地图数据...",
      spinner: "el-icon-loading",
      background: "rgba(0,0,0,0.7)",
      customClass: "loading1"
    });
    this.getDatas();
  },
  methods: {
    ///////////////////////////////////////////////////////////////// 事件处理 ////////////////////////////////////////////////////
    // 获取所有数据
    getDatas() {
      this.queryPolygonPoints(); //查询管辖区域
      this.getData_curWeather(); // 查询当前天气
      this.getData_yuJingWeather(); // 查询当前天气预警信息
      //获取全国客运车站字典（带经纬度）
      if (this.$store.state.dicAllStation.length === 0) {
        C.getDataP123(
          {
            url: "http://10.192.126.203:9088/admin/kydp/execute",
            c: "kydp_zxy2023"
          },
          r => {
            store.commit("updateDicAllStation", r["1"]);
            this.getData_flyTrain(); //查询飞行图列车
          }
        );
      } else {
        this.getData_flyTrain(); //查询飞行图列车
      }
      //查询桥遂
      this.getData_qiaoSui(() => {
        this.getData_onRoadTrain(); //查询在途列车
      });
      setInterval(() => {
        // this.getData_curWeather();
        // this.getData_yuJingWeather();
        // this.getData_onRoadTrain();
      }, 1000 * 60 * 10);
    },
    // 全局搜索车次定位
    filterTrain() {
      const d = this.dataTrain.find(
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
    // 查看列车统计信息
    showTrainCharts(trainid) {
      let t = this;
      let item = this.dataTrain.find(v => v.TRAIN_ID === trainid);
      this.phoneListTrain = [item]; //用于详情页面发起消息会话
      t.detail = null;
      t.getClxq(item);
    },
    // 工具栏点击事件
    toolClick(ty, ty2) {
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
            C.getDataP123(
              {
                c: "kydp_zxy8024",
                url: C.kydUrl,
                s: [train.TRAIN, now],
                a: "【kydp_zxy8024】获取三乘信息"
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
              this.callPhone(real, "xiaoyu", true);
              clearInterval(this.intervalTrainInfo);
            }
          }, 1000);
        } else {
          this.$emit("openXiaoYu");
        }
      } else if (ty === "openLate") {
        this.lateListType = ty2;
        console.log(this.dataTrain);
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

    /**
     * 拨打电话
     * @param {Object} per
     * @param {Object} ty
     */
    callPhone(per, ty, isMore) {
      if (ty === "phone") {
        this.$refs.call.ringup(per.E_Phone);
      } else if (ty === "msg") {
        this.$emit("openMsg", this.phoneListTrain, this.trainData);
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
        const url =
          "https://10.192.34.79/JFLCMS/vue/#/XYLink?pageType=1" + pos + rec;
        setTimeout(() => {
          window.open(url);
          this.loading.close();
        }, 3000);
      }
    },
    // 开始框选
    startDraw() {
      if (this.drawFlag === "框选列车") {
        mapUtil.openEditFlag();
        this.drawFlag = "取消框选";
      } else {
        mapUtil.clearEidtAll();
        this.drawFlag = "框选列车";
      }
    },
    // 框选结束
    endDrawLines(cb) {
      this.filter_quyu.push(this.formQuYu);
      this.$nextTick(() => {
        this.startDraw();
        const kxTrains = this.kuanXuangTrainsCls([this.formQuYu]);
        cb.call(null, kxTrains);
      });
    },
    haddleCloseQuyu() {
      this.visibleQuYu = false;
      mapUtil.clearEditLines(false);
      this.formQuYu.layer.removeFrom(this.map);
    },
    haddleSaveQuyu() {
      const kxTrains = this.endDrawLines(kxTrains => {
        const f = this.formQuYu;
        // 存库
        const points = this.formQuYu.POINT_LIST.map(p => {
          return {
            lat: p.x,
            lon: p.y
          };
        });
        //sql [区域id,"区域名称",区域类型（0-不发送警戒消息，1-发送警戒消息）,"警戒消息内容","列车列表","点列表","客运段"]
        home
          .saveRegion({
            s: [
              f.REGION_ID,
              f.REGION_NAME,
              f.REGION_TYPE,
              f.WARN_MESSAGE,
              kxTrains,
              points,
              f.DEPOT
            ]
          })
          .then(
            r => {
              if (r) {
                mapUtil.clearEditLines(true);
                this.visibleQuYu = false;
              } else {
                this.$message("接口错误");
              }
            },
            error => {
              this.$notify.error({
                title: "提示",
                message: "保存警戒区域接口异常"
              });
            }
          );
      });
    },
    // 添加框选车效果
    kuanXuangTrainsCls(quyuArr) {
      const rsTrains = [];
      this.dataTrain.forEach(train => {
        const p = {
          x: train.LAT,
          y: train.LON
        };
        quyuArr.forEach(quyu => {
          if (quyu.visible && mapUtil.isPointInPoly(p, quyu.POINT_LIST)) {
            rsTrains.push(train.TRAIN_ID);
            C.$("#" + train.TRAIN_ID)
              .addClass("kuang-xuang")
              .attr("group", quyu.REGION_ID);
          }
        });
      });
      return rsTrains;
    },
    // 组织框选的列车
    getSelectTrains() {
      const trainids = [];
      C.$(".kuang-xuang").each(function() {
        trainids.push(C.$(this).attr("id"));
      });
      const cks = this.dataTrain.filter(
        train => trainids.indexOf(train.TRAIN_ID) > -1
      );
      return cks;
    },
    // 绑定marker点击事件---桥遂
    setMarkerClick_qiaoSui(marker, data) {
      marker.on("click", e => {
        if (this.drawFlag !== "框选列车") return;
        $(".leaflet-popup").remove();
        const prev = "#/QiaoSuiInfo";
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
        this.map.setView([
          parseFloat(e.latlng.lat) + this.markerDiff[this.mapZoom],
          e.latlng.lng
        ]);
        L.marker(e.latlng, {
          icon: nameDivIcon
        }).addTo(this.map);
        setTimeout(() => {
          C.$("#popupLoading").remove();
        }, 1000);
      });
    },
    // 绑定marker点击事件---列车
    setTrainMarkerClick(param) {
      if (this.drawFlag !== "框选列车") return;
      let train = param.target.options.icon.options.data;
      $(".leaflet-popup").remove();
      const count = C.$("#" + train.TRAIN_ID)
        .find("span.count")
        .html();
      if (count !== "") {
        const isSingle = C.$("#" + train.TRAIN_ID)
          .parent()
          .hasClass("single-train");
        C.$("#" + train.TRAIN_ID)
          .parent()
          .addClass("single-train");
        let trains = this.dataPointTrain[train.LAT + "|" + train.LON] || [];
        if (trains.length > 0 && isSingle === false) {
          C.$.each(trains, (i, d) => {
            C.$("#" + d.TRAIN_ID)
              .parent()
              .addClass("single-train");
            if (i > 0) {
              let mtop = -6 + "px";
              if (this.mapZoom >= 5) {
                mtop = -i * 26 - 6 + "px";
              } else {
                mtop = -i * 15 - 6 + "px";
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
      const prev = "#/trainTravelInfo";
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
        html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -25px, 0px); bottom: 0px; left:-340px;">
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
      this.map.setView([
        parseFloat(train.LAT) + this.markerDiff[this.mapZoom],
        train.LON
      ]);
      L.marker([train.LAT, train.LON], {
        icon: nameDivIcon
      }).addTo(this.map);
      setTimeout(() => {
        C.$("#popupLoading").remove();
      }, 1000);
    },
    onMapZoom(e) {
      // this.map.setMinZoom(5);
      const newZoom = e.target._zoom;
      const oldRoom = this.mapZoom;
      if (oldRoom !== newZoom) {
        if (newZoom >= this.initZoom && oldRoom < this.initZoom) {
          //放大
          C.$(".marker-tarin").removeClass("min");
          this.setTrainCount();
        } else if (newZoom < this.initZoom && oldRoom >= this.initZoom) {
          //缩小
          C.$(".marker-tarin").addClass("min");
          this.setTrainCount();
        }
      }
      this.mapZoom = newZoom;
      // 桥遂三角形图标缩放
      if (newZoom > 3) {
        C.$(".marker-qiaosui").addClass("big");
      } else {
        C.$(".marker-qiaosui").removeClass("big");
      }
      console.log("newZoom:" + newZoom);

      // 成都详细地图
      if (newZoom > 2) {
        this.filter.tianqi = true; //天气
        this.filter.tianqiyujing = true; //天气预警
        this.filter.puche = true; //普车
        this.filter.dongche = true; //动车
        this.chengduLayers.setOpacity(1);
        this.flayLayer && this.map.removeLayer(this.flayLayer); //删除飞行图
      } else {
        this.filter.tianqi = false; //天气
        this.filter.tianqiyujing = false; //天气预警
        this.filter.puche = false; //普车
        this.filter.dongche = false; //动车
        this.chengduLayers.setOpacity(0);
        this.map.addLayer(this.flayLayer);
      }
    },
    onMouseDown(param) {
      if (window.event.button === 2) {
        this.visiblePhone = false;
        this.phoneListStyle = {
          top: window.event.y + "px",
          left: window.event.x + "px"
        };
        this.phoneListCC = param.target.options.icon.options.data.TRAIN;
        this.phoneListTrain = [param.target.options.icon.options.data];
        this.$nextTick(() => {
          this.visiblePhone = true;
        });
      } else {
        this.visiblePhone = false;
      }
    },
    ///////////////////////////////////////////////////////////////// 数据处理 ////////////////////////////////////////////////////
    // 过滤地图上的marker
    filterMarkers(a, b) {
      // 桥梁
      if (this.filter.qiaoliang) {
        this.layerQiaoLiang && this.map.addLayer(this.layerQiaoLiang);
      } else {
        this.layerQiaoLiang && this.map.removeLayer(this.layerQiaoLiang);
      }
      // 隧道
      if (this.filter.suidao) {
        this.layerSuiDao && this.map.addLayer(this.layerSuiDao);
      } else {
        this.layerSuiDao && this.map.removeLayer(this.layerSuiDao);
      }
      // 天气
      if (this.filter.tianqi) {
        this.layerWeather && this.map.addLayer(this.layerWeather);
      } else {
        this.layerWeather && this.map.removeLayer(this.layerWeather);
      }
      // 天气预警
      if (this.filter.tianqiyujing) {
        this.layerYuJing && this.map.addLayer(this.layerYuJing);
      } else {
        this.layerYuJing && this.map.removeLayer(this.layerYuJing);
      }
      let trainCls = [".marker-tarin"];
      //担当车
      if (this.filter.dandang) {
        trainCls.push(".ddc-1");
      }
      //普车(无动车)
      if (this.filter.puche && !this.filter.dongche) {
        trainCls.push(".type-P");
      }
      //动车(无普车)
      if (this.filter.dongche && !this.filter.puche) {
        trainCls.push(".type-D");
      }
      // 动车、普车都不显示
      if (!this.filter.puche && !this.filter.dongche) {
        trainCls.push(".type-DP");
      }
      C.$(".marker-tarin")
        .parent()
        .hide(); //全部隐藏
      const wdCls = [];
      if (this.filter.late_d1 && this.filter.dongche) {
        wdCls.push("wd1");
      }
      if (
        (this.filter.late_d2 && this.filter.dongche) ||
        (this.filter.late_p2 && this.filter.puche)
      ) {
        wdCls.push("wd2");
      }
      if (
        (this.filter.late_d3 && this.filter.dongche) ||
        (this.filter.late_p3 && this.filter.puche)
      ) {
        wdCls.push("wd3");
      }
      if (
        (this.filter.late_d4 && this.filter.dongche) ||
        (this.filter.late_p4 && this.filter.puche)
      ) {
        wdCls.push("wd4");
      }
      // 动、普都显示,且有晚点条件
      if (this.filter.puche && this.filter.dongche && wdCls.length > 0) {
        // 动车未晚点，则将动车显示
        if (
          !this.filter.late_d1 &&
          !this.filter.late_d2 &&
          !this.filter.late_d3 &&
          !this.filter.late_d4
        ) {
          wdCls.push("type-D");
        }
        // 普车未晚点，则将普车显示
        else if (
          !this.filter.late_p2 &&
          !this.filter.late_p3 &&
          !this.filter.late_p4
        ) {
          wdCls.push("type-P");
        }
      }

      trainCls = trainCls.join("");
      console.log("trainCls", trainCls);
      console.log("wdCls", wdCls);
      C.$(trainCls).each(function() {
        if (wdCls.length > 0) {
          // 针对此车 每一个样式 进行匹配
          const exits = wdCls.filter(item => C.$(this).hasClass(item));
          // 只要匹配到一个，则显示此车
          if (exits.length > 0) {
            C.$(this)
              .parent()
              .show();
          } else {
            C.$(this)
              .parent()
              .hide();
          }
        } else {
          C.$(this)
            .parent()
            .show();
        }
      });
      if (this.filter.puche || this.filter.dongche) {
        this.setTrainCount();
      }
    },
    // 显示隐藏区域
    handleFilterQuyu(qu) {
      if (qu.visible) {
        qu.layer.addTo(this.map);
        this.kuanXuangTrainsCls([qu]);
      } else {
        $(".marker-tarin[group='" + qu.REGION_ID + "']").removeClass(
          "kuang-xuang"
        );
        qu.layer.removeFrom(this.map);
      }
    },
    // 创建marker---当前天气
    creatMarks_curWeather(source) {
      let weatherGroup = L.layerGroup();
      C.$.each(source, (index, item) => {
        const imgUrl = home.weatherUrl + item.ICON + "-fill.svg";
        const marker = L.marker([item.LAT, item.LON], {
          icon: L.divIcon({
            className: "textFonts",
            iconSize: [30, 30],
            popupAnchor: [5, 5],
            html: `<div class="marker-weather"><img src="${imgUrl}"/></div>`
          })
        }).on("click", () => {
          if (this.drawFlag !== "框选列车") return;
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
      if (this.filter.tianqi) {
        this.layerWeather = weatherGroup.addTo(this.map);
      } else {
        this.layerWeather = weatherGroup;
      }
    },
    // 创建marker---当前天气预警
    creatMarker_yujingWeather(source) {
      let yuJingLayer = L.layerGroup();
      C.$.each(source, (index, item) => {
        // BRI_HOLE_NAME 名称
        const imgUrl = home.weatherUrl + item.level + "预警.png";
        const marker = L.marker([item.LAT, item.LON], {
          icon: L.divIcon({
            className: "textFonts",
            iconSize: [30, 30],
            popupAnchor: [5, 5],
            html: `<div class="marker-weather yujing"><img src="${imgUrl}"/></div>`
          })
        }).on("click", () => {
          if (this.drawFlag !== "框选列车") return;
          $(".leaflet-popup").remove();
          let titColor = "#19A5FF";
          let bgColor = "rgba(102,158,226,.2)";
          if (item.level === "橙色") {
            titColor = "#f9a513";
            bgColor = "rgba(174,116,14,.2)";
          } else if (item.level === "黄色") {
            bgColor = "rgba(221,219,17,.2)";
            titColor = "#eae712";
          } else if (item.level === "红色") {
            titColor = "#de2302";
            bgColor = "rgba(174,52,14,.2)";
          }
          item.startTime = item.startTime.substring(0, 16);
          item.endTime = item.endTime.substring(0, 16);
          const arr = item.title.split("[");
          item.title1 = arr[0];
          item.title2 = "[" + arr[1];
          let divIcon = L.divIcon({
            className: "textFonts",
            iconSize: [10, 10],
            popupAnchor: [0, 0],
            html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -5px, 0px); bottom: 0px; left:-145px;">
									<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
									<div class = "leaflet-popup-content-wrapper blue">
									<div class="leaflet-popup-content no-padding" style="position:relative;width:320px;height: 250px;border-radius: 10px;background:rgba(0,0,0,.3)">
										<div style="padding-top:20px;">
											<div style="white-space: nowrap;display:inline-block;padding-left:15px;letter-spacing: 2px;font-weight: bold;font-size:16px;height: 30px;color:${titColor}">${item.typeName}${item.level}预警</div>
											<div style="float:right;color:#819dae;padding-right: 25px;margin-top:-5px;">
												<div>${item.startTime}</div>
												<div>${item.endTime}</div>
											</div>
										</div>
										<div style="padding:10px;">
											<div style="font-size:14px;padding-bottom:10px;">
												<img src="${this.yujingImg}" style="margin-right:5px;display:inline-block;vertical-align: middle;"/>
												<span style="display:inline-block;vertical-align: middle;width:200px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;color:#00c4ff;" title="${item.title1}">${item.title1}</span>
												<span style="float:right;color:${titColor};">${item.title2}</span>
											</div>
											<p style="height:150px;overflow:auto;margin:0;padding:10px;border-radius: 10px;line-height: 20px;text-indent:24px;background:${bgColor}">${item.text}</p>
										</div>
									</div>
									</div>
									<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
									<div class="leaflet-popup-tip blue"></div></div>
								   </div>`
          });

          this.map.setView([
            parseFloat(item.LAT) + this.markerDiff[this.mapZoom],
            item.LON
          ]);
          L.marker([item.LAT, item.LON], {
            icon: divIcon
          }).addTo(this.map);
        });
        yuJingLayer.addLayer(marker);
      });
      if (this.filter.tianqiyujing) {
        this.layerYuJing = yuJingLayer.addTo(this.map);
      } else {
        this.layerYuJing = yuJingLayer;
      }
    },
    // 创建marker---桥隧
    creatMarker_qiaoSui(source) {
      const qiaoliangData = [];
      const suidaoData = [];
      let linesQiaoLiang = L.layerGroup(); //桥梁
      let linesSuiDao = L.layerGroup(); //隧道
      C.$.each(source, (index, item) => {
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
                  html: `<div class="marker-qiaosui big" style="color:#FF9966;transform:scale(0.7)">▲</div>`
                })
              })
            : L.polyline(item.lonlats, {
                color: "#FF9966",
                weight: 5
              });
          this.setMarkerClick_qiaoSui(marker, item);
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
                  html: `<div class="marker-qiaosui big" style="color:#6c00d8;transform:scale(0.7)">▲</div>`
                })
              })
            : L.polyline(item.lonlats, {
                color: "#6c00d8",
                weight: 5
              });
          this.setMarkerClick_qiaoSui(marker, item);
          linesSuiDao.addLayer(marker);
        }
      });
      this.layerQiaoLiang = linesQiaoLiang.addTo(this.map);
      this.layerSuiDao = linesSuiDao.addTo(this.map);
      this.dataQiaoLiang = qiaoliangData;
      this.dataSuiDao = suidaoData;
    },
    //创建marker---列车
    creatMarker_train(source) {
      this.layerTrains && this.map.removeLayer(this.layerTrains); //动车
      this.layerTrains = L.layerGroup();
      this.layerTrains.addTo(this.map);
      C.$.each(source, (index, train) => {
        const marker = this.creatMarker_trainSingle(train);
        this.layerTrains.addLayer(marker);
      });
      this.filterMarkers(); //过滤
      this.setTrainCount(); //设置重叠车标记
    },
    //创建marker---列车单个
    creatMarker_trainSingle(train) {
      let marker = null;
      const minClass = this.mapZoom < 5 ? "min" : "";
      let p = this.getMarkerIconImage(train);
      var myIcon = L.divIcon({
        className: "train-icon-container",
        // iconSize: minClass ? [14, 14] : [80, 20],
        // iconAnchor: minClass ? [7, 7] : [0, 20],
        data: train,
        html: `<div id="${train.TRAIN_ID}" class="marker-tarin ddc-${train.dandang} type-${train.trainType} ${minClass} ${p.lateCls} ${p.trainType}" style="position:relative">
								<span class="pic"></span>
								<span class="num">${train.TRAIN}</span>
								<span class="count"></span>
								<span class="cover"></span>
							</div>`
      });
      marker = L.marker(
        {
          lon: train.LON,
          lat: train.LAT
        },
        {
          icon: myIcon
        }
      );
      marker.on("click", this.setTrainMarkerClick).on("mousedown", param => {
        this.onMouseDown(param);
      });
      return marker;
    },
    // 获取数据---未来天气
    getFutureWeather(e) {
      if (this.ctrlFlag) {
        this.ctrlFlag = false;
        let p = e.latlng;
        $(".leaflet-popup").remove();
        const prev = "#/futureWeather";
        const trainInfoPath =
          prev +
          "?lat=" +
          p.lat +
          "&lng=" +
          p.lng +
          "&StnCode=" +
          (e.StnCode ? e.StnCode : "");
        let divIcon = L.divIcon({
          className: "textFonts",
          iconSize: [10, 10],
          popupAnchor: [0, 0],
          html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; bottom: 0px; left:-150px;">
								<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
								<div class = "leaflet-popup-content-wrapper blue">
									<div class="leaflet-popup-content no-padding" style="position:relative;width:300px;height: 330px;border-radius: 10px;background:rgba(0,0,0,.3)">
										<div><h2 style="margin:0;padding-left:110px;padding-top:5px;font-size:14px;">天气预报</h2></div>
										<iframe src="${trainInfoPath}" style="height: 300px;width: 100%;margin-left:-1px;border-radius:10px;" frameborder="0"></iframe>
									</div>
								</div>
								<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
								<div class="leaflet-popup-tip blue"></div></div>
							   </div>`
        });

        this.map.setView([
          parseFloat(p.lat) + this.markerDiff[this.mapZoom],
          p.lng
        ]);
        L.marker([p.lat, p.lng], {
          icon: divIcon
        }).addTo(this.map);
      }
    },
    // 判断列车类型
    getTrainType(txt) {
      // const typeStr = "TZKYGDC0"; //特快、直达、快速、旅游、高铁、动车、城际列车、空送/动检车
      return txt.includes("D") || txt.includes("G") || txt.includes("C")
        ? "D"
        : "P";
    },
    // 获取列车对应图标
    getMarkerIconImage(data, isMini) {
      let iconUrl = "";
      let lateObj = {};
      // const qsFlag = this.isNearQiaoSui(data);//判断是否在桥隧上
      const qFlag = Math.random() > 0.8;
      const sFlag = Math.random() > 0.6;
      if (data.trainType === "D") {
        lateObj = this.getLateClass(data, "D");
        lateObj.trainType = "DC";
        // if (qFlag) {
        // 	lateObj.trainType = "DQ";
        // } else if (sFlag) {
        // 	lateObj.trainType = "DS";
        // }
      } else {
        // this.isNearQiaoSui(data)
        lateObj = this.getLateClass(data, "P");
        lateObj.trainType = "PC";
        // if (qFlag) {
        // 	lateObj.trainType = "PQ";
        // } else if (sFlag) {
        // 	lateObj.trainType = "PS";
        // }
      }
      data.lateObj = lateObj;
      return {
        iconUrl: iconUrl,
        ...lateObj
      };
    },
    // 获取晚点样式
    getLateClass(train, ty) {
      let lateCls = "";
      let times = parseInt(train.EDTIME);
      // 动车：0-5分钟不算晚点，5-120分钟，120-240分钟，240-360分钟，360分钟以上
      // 普车：0-5分钟不算晚点，240-480分钟，480-720分钟，720分钟以上
      // times = Math.random() * 1000;
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
        lateCls: lateCls
        // cls : "wd-train wd4"
      };
    },
    /**
     * 在途列车消息处理
     * @param {Object} msgTrain
     */
    trainMessageArr(msgTrain) {
      if (this.layerTrains === null) {
        return;
      }
      const el = C.$("#" + msgTrain.TRAIN_ID);
      // 当前站===终到站，为终到车，则延迟从地图中移除
      const isEnd = msgTrain.CURRNAME === msgTrain.ENDNAME;
      // 5层上 图标车
      const existTrains = this.dataPointTrain[
        msgTrain.LAT + "|" + msgTrain.LAT
      ];
      if (el) {
        const layers = this.layerTrains._layers;
        C.$.each(layers, (_key, layer) => {
          const options = layer.options.icon.options;
          if (options.data.TRAIN_ID === msgTrain.TRAIN_ID) {
            if (
              options.data.LAT === msgTrain.LAT ||
              options.data.LON === msgTrain.LON
            ) {
              //console.warn(msgTrain.TRAIN+"：收到列车消息【动车】，但位置未发生改变"+ (new Date()).Format("hh:mm:ss"),msgTrain)
            } else {
              el.addClass("filtered");
              setTimeout(() => {
                el.removeClass("filtered");
              }, 6000);
              options.data.LAT = msgTrain.LAT;
              options.data.LON = msgTrain.LON;
              layer.setLatLng([msgTrain.LAT, msgTrain.LON]);
            }
            // 终到车
            if (isEnd) {
              console.warn("终到车：" + msgTrain.TRAIN, msgTrain);
              setTimeout(() => {
                delete layers[_key];
                C.$("#" + msgTrain.TRAIN_ID)
                  .parent()
                  .remove();
                layer.removeFrom(this.map);
              }, 1000 * 60 * 5);
            }
          }
        });
        if (isEnd) return; //终到车，则停止
      } else {
        // 地图中没有此车
        const tempTrain = this.dataTrain.find(
          item => item.TRAIN_ID === msgTrain.TRAIN_ID
        );
        if (!tempTrain) {
          msgTrain.trainType = this.getTrainType(msgTrain.TRAIN); //列车类型---D P
          msgTrain.dandang = msgTrain.DEPOT === this.oname ? 1 : 0; //是否为担当车
          this.dataTrain.push(msgTrain);
          console.warn("始发车：" + msgTrain.TRAIN, msgTrain);
          const marker = this.creatMarker_trainSingle(msgTrain); //TZKYGDC0 P
          this.layerTrains.addLayer(marker);
          if (typeof existTrains === "undefined") {
            this.dataPointTrain[msgTrain.LAT + "|" + msgTrain.LON] = [msgTrain];
          } else {
            this.dataPointTrain[msgTrain.LAT + "|" + msgTrain.LON].push(
              msgTrain
            );
          }
        }
      }
    },
    // 设置列车重叠数量
    setTrainCount() {
      setTimeout(() => {
        C.$("span.count").html("");
        setTimeout(() => {
          C.$.each(this.dataPointTrain, (k, v) => {
            let arr = this.filter.dandang ? v.filter(item => item.dandang) : v;
            if (arr.length > 1) {
              arr.forEach(train => {
                if (train.TRAIN_ID) {
                  C.$("#" + train.TRAIN_ID + ">.count").html(arr.length);
                }
                if (arr.length > 5) {
                  console.log("重叠车超过5辆>>>>>>>", v);
                }
              });
            }
          });
        }, 50);
      }, 200);
    },
    // 绘制飞行图
    drawFly(options) {
      this.flayLayer && this.map.removeLayer(this.flayLayer); //删除飞行图
      this.flayLayer = L.supermap.echartsLayer(options);
      if (this.mapZoom === 1 || this.mapZoom === 2) {
        this.flayLayer.addTo(this.map);
      }
    },
    ///////////////////////////////////////////////////////////////// 数据交互 ////////////////////////////////////////////////////
    // 查询警戒区域
    getData_regionList() {
      $(".marker-tarin.kuang-xuang").removeClass("kuang-xuang");
      this.filter_quyu.forEach(qu => {
        qu.layer.removeFrom(this.map);
      });
      home
        .getRegionList({
          s: [[this.oname]]
        })
        .then(
          r => {
            if (r) {
              let realD = r["1"];
              realD.forEach(v => {
                v.visible = true;
                let points = [];
                let pointsXY = [];
                JSON.parse(v.POINT_LIST).forEach(p => {
                  points.push([p.lat, p.lon]);
                  pointsXY.push({
                    x: p.lat,
                    y: p.lon
                  });
                });
                v.POINT_LIST = pointsXY;
                points = points.splice(0, points.length - 1);
                v.layer = mapUtil.drawLines(points, v.REGION_ID);
              });
              this.filter_quyu = realD;
              this.kuanXuangTrainsCls(realD);
              console.log("查询警戒区域", realD);
            } else {
              this.$message("接口错误");
            }
          },
          error => {
            this.$notify.error({
              title: "提示",
              message: "获取警戒区域数据异常"
            });
          }
        );
    },
    //获取数据---当前天气信息
    getData_curWeather() {
      this.layerWeather && this.map.removeLayer(this.layerWeather);
      home.getCurWeather({}).then(
        r => {
          if (r) {
            if (r["1"].length === 0) {
              console.warn("未获取到天气信息");
            } else {
              console.log("获取当前天气信息", r);
              this.creatMarks_curWeather(r["1"]);
            }
          } else {
            this.$message("接口错误");
          }
        },
        error => {
          this.$notify.error({
            title: "提示",
            message: "获取当前天气信息数据异常"
          });
        }
      );
    },
    //获取当前预警信息
    getData_yuJingWeather() {
      let t = this;
      this.yuJingLayer && this.map.removeLayer(this.yuJingLayer);
      home.getYuJing({}).then(
        r => {
          if (r) {
            if (r["1"].length === 0) {
              console.warn("未获取到预警信息");
            } else {
              console.log("获取当前预警信息", r);
              this.creatMarker_yujingWeather(r["1"]);
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
    getData_qiaoSui(cb) {
      C.getDataP123(
        {
          c: "kydp_zxy8020",
          s: ["ALL", "ALL"],
          url: home.kydUrl,
          a: "获取桥遂数据"
        },
        r => {
          if (r) {
            const d = JSON.parse(r);
            this.creatMarker_qiaoSui(d);
            console.log("桥梁隧道", d);
          }
          cb.call(null);
        }
      );
    },
    //查询在途列车
    getData_onRoadTrain(handle) {
      if (handle === true) {
        this.loading = this.$loading({
          lock: true,
          text: "正在加载列车数据...",
          spinner: "el-icon-loading",
          background: "rgba(0,0,0,0.7)",
          customClass: "loading1"
        });
      }
      this.dataPointTrain = {};
      home.getTrains({}).then(
        r => {
          console.log("全国在途列车", r);
          if (r) {
            // 返回数据// 1：动车组列车// 2：普速客车// 3：货车// 4：晚点客车// 5：告警客车// 6：晚点货车// 7：告警货车// 8：管外车
            let d = r["1"].concat(r["2"]); //.concat(r["4"]).concat(r["5"]).concat(r["8"]);
            d = d.filter(v => {
              const flag = v.LAT !== "" && v.LON !== "";
              if (flag) {
                return true;
              } else {
                console.log("无坐标点车：", v.TRAIN);
              }
            });
            const realTrains = [];
            let trainPointObj = {};
            let tempObj = {};
            d.forEach(train => {
              if (typeof tempObj[train.TRAIN_ID] === "undefined") {
                train.trainType = this.getTrainType(train.TRAIN); //列车类型---D P
                train.dandang = train.DEPOT === this.oname ? 1 : 0; //是否为担当车
                tempObj[train.TRAIN_ID] = 1;
                const _key = train.LAT + "|" + train.LON;
                if (typeof trainPointObj[_key] === "undefined") {
                  trainPointObj[_key] = [train];
                } else {
                  trainPointObj[_key].push(train);
                }
                realTrains.push(train);
              }
            });
            this.creatMarker_train(realTrains);
            this.dataTrain = realTrains;
            this.dataPointTrain = trainPointObj;
          } else {
            this.$message({
              type: "error",
              message: "接口错误"
            });
          }
          this.getData_regionList();
          this.loading.close();
        },
        error => {
          this.loading.close();
          this.$notify.error({
            title: "提示",
            message: "获取车辆信息异常"
          });
        }
      );
    },
    //查询飞行图列车
    getData_flyTrain() {
      const oid =
        this.oid === "c73b368ba6f9702fe0534820c00a00a8"
          ? "99990002001499A50004"
          : this.oid.toUpperCase();
      C.getData(
        {
          c: "trdm_ys_347",
          s: [new Date().Format("yyyy-MM-dd"), 24],
          o: [oid],
          a: "获取飞行图列车数据"
        },
        r => {
          // {"START_STN":"重庆西","ARR_TIME":"2021-09-01 00:00:00","TRAIN_NUM_SCH":"0G8511","END_STN":"重庆西动车所","LEV":"0"}
          // console.log("所有车站坐标",this.$store.state.dicAllStationGEO)
          const allData = [];
          r.forEach((data, index) => {
            allData.push(JSON.parse(data));
          });
          const allFlayOptions = []; //所有飞行线数据，分时段
          const geo = this.$store.state.dicAllStationGEO;
          console.log(
            "this.$store.state.dicAllStation",
            this.$store.state.dicAllStation.length
          );
          allData.forEach(data => {
            const curData = [];
            data.forEach(item => {
              item.ARR_TIME = item.ARR_TIME.split(" ")[0];
              if (
                typeof geo[item.START_STN] === "undefined" ||
                typeof geo[item.END_STN] === "undefined"
              ) {
              } else {
                curData.push([
                  {
                    name: item.START_STN
                  },
                  {
                    name: item.END_STN,
                    value: 1,
                    meta: item
                  }
                ]);
              }
            });
            let options = flyBlLayerUtil.getFlyOpts([curData], geo);
            allFlayOptions.push(options);
          });
          this.allFlayOptions = allFlayOptions;
          console.log("获取飞行图列车数据", allFlayOptions);
          // 每隔5分钟设置当前显示飞行图时间段
          this.drawFly(this.allFlayOptions[this.flyHours]);
          if (this.flyInterval) {
            clearInterval(this.flyInterval);
          }
          this.flyInterval = setInterval(() => {
            this.flyHours = new Date().getHours();
          }, 1000 * 60 * 5);
        }
      );
    },
    // 获取车辆详情
    getClxq(item) {
      // [["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"]]
      this.visible = true;
      let t = this;
      const _date = echarts.format.formatTime(
        "yyyyMMdd",
        new Date(item.START_DATE).getTime()
      );
      const p = [item.TRAIN, _date];
      // const p = ["G350", _date]
      this.detailSql = p;
      home
        .getClxq({
          s: [p]
        })
        .then(
          r => {
            if (r) {
              t.detail = r;
            } else {
              this.$message("接口错误");
            }
          },
          error => {
            t.$notify.error({
              title: "提示",
              message: "获取车辆详情异常"
            });
          }
        );
    },
    // 修改区域名称
    handleUpdateQuyu(f) {
      // //sql [区域id,"区域名称",区域类型（0-不发送警戒消息，1-发送警戒消息）,"警戒消息内容","列车列表","点列表","客运段"]
      home
        .saveRegion({
          s: [
            f.REGION_ID,
            f.REGION_NAME,
            f.REGION_TYPE,
            f.WARN_MESSAGE,
            "",
            "",
            f.DEPOT
          ]
        })
        .then(
          r => {
            if (r) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            } else {
              this.$message("接口错误");
            }
          },
          error => {
            t.$notify.error({
              title: "提示",
              message: "修改区域名称异常"
            });
          }
        );
    },
    // 删除区域
    handleDeletQuyu(qu, index) {
      // sql [[[区域id1],[区域id2],....]]
      home
        .deleteRegion({
          s: [[[qu.REGION_ID]]]
        })
        .then(
          r => {
            if (r) {
              $(".marker-tarin[group='" + qu.REGION_ID + "']").removeClass(
                "kuang-xuang"
              );
              qu.layer.removeFrom(this.map);
              this.filter_quyu.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message("接口错误");
            }
          },
          error => {
            t.$notify.error({
              title: "提示",
              message: "删除警戒区域异常"
            });
          }
        );
    },
    //查询管辖区域
    queryPolygonPoints() {
      this.compassLayer && this.map.removeLayer(this.compassLayer); //删除范围
      C.getData(
        {
          c: "trdm_lv_692",
          s: [this.oid.toUpperCase(), "1"],
          async: true,
          a: "获取指定组织机构GIS范围坐标点集合",
          url: 'https://10.192.34.79/TRDM/GeneralProServlet'
        },
        rs => {
          var points = [];
          rs.forEach(v => {
            const p = [parseFloat(v.AREA_X), parseFloat(v.AREA_Y)];
            points.push(p);
          });
          // points.push(points[0]);
          console.log("获取指定组织机构GIS范围坐标点集合", rs);
          if (points.length > 0) {
            const firstX = rs[0].AREA_X.substring(0, rs[0].AREA_X.length - 1);
            const firstN = rs[0].AREA_X.substr(-1);
            points.push([firstX + (firstN === "5" ? "4" : "5"), rs[0].AREA_Y]);
            let antPath = L.polyline(points, {
              weight: 2, //线宽
              color: "#b0d7e1", //颜色
              opacity: 0.5 //透明度
            });
            this.compassLayer = antPath.addTo(this.map);
          }
        }
      );
    }
  },
  components: {
    MapTrainLate,
    TrainPhoneList
  },
  props: {
    mapView: {
      type: String,
      default: "all"
    },
    oid: {
      type: String,
      default: ""
    },
    oname: {
      type: String,
      default: ""
    },
    tipVisible: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped="scoped">
.tools-con {
  position: absolute;
  bottom: 20px;
  left: 440px;
  width: 270px;
  height: 700px;
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  z-index: 410;
  transition: height 0.3s;

  background-image: linear-gradient(-3deg, #0e1331 0%, #0d1567 100%),
    linear-gradient(#0e1743, #0e1743);
  background-blend-mode: normal, normal;
  border: 1px solid #2d82cd;
  border-image-source: linear-gradient(-2deg, #2d82cd 0%, #08233b 100%);
  border-image-slice: 1;
  opacity: 0.89;
}

.tools-item-con {
  position: absolute;
  top: 30px;
  left: 0;
  bottom: 5px;
  width: 100%;
  transition: top 0.3s;
  overflow: auto;
}

.tools-item-con.show {
  top: 20px;
}

.filter-group {
}

.group-title {
  padding: 5px;
  text-align: center;
  background: rgba(33, 41, 89, 0.7);
}

.group-body {
  padding: 10px;
  line-height: 26px;
}

.group-body.flex {
  display: flex;
  padding: 20px 10px 0px 10px;
  justify-content: space-between;
}

.tool-img-btn {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}

.tool-img-btn:hover {
  cursor: pointer;
  opacity: 0.9;
}

.late-train-link {
  display: block;
  width: 60px;
  line-height: 20px;
  color: #3d92ec;
  cursor: pointer;
  margin-bottom: 5px;
  border-bottom: 1px solid #3d92ec;
}

.group-body > .el-checkbox {
  margin-right: 0px;
  width: 50% !important;
}

.tools-control {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0px;
  width: 100%;
  text-align: center;
  transition: bottom 0.3s;
}

.tools-control.opened {
  bottom: unset;
  z-index: 10;
}

>>> .leaflet-div-icon {
  border: 0;
  background: rgba(0, 0, 0, 0);
}

>>> .el-dialog__wrapper {
  overflow: hidden;
}

>>> .el-input__inner,
>>> .el-input.is-disabled .el-input__inner,
>>> .el-textarea__inner {
  background-color: transparent;
  border-color: #5d6375;
  color: #fafafa;
}

>>> .el-input-group__append,
>>> .el-input-group__prepend {
  border-color: #5d6375;
  background: transparent;
}

/* ============= dialog =============*/
>>> .el-dialog__header {
  background: #4d5f83;
}

>>> .el-dialog__title {
  color: #fafafa;
}

>>> .el-dialog__body,
>>> .el-dialog__footer {
  background: #272f46;
  border: none;
}
</style>

<style src="./blue.css"></style>
<style>
/* 地图元素筛选 */
.filter-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 5px;
}

.filter-icon.dongche {
  background: url("./icons/filters/动车.png") no-repeat;
  background-size: 100% 100%;
}

.filter-icon.puche {
  background: url("./icons/filters/普车.png") no-repeat;
  background-size: 100% 100%;
}

.filter-icon.dandang {
  display: none;
}

.filter-icon.qiaoliang {
  background: url("./icons/filters/桥梁.png") no-repeat;
  background-size: 100% 100%;
}

.filter-icon.suidao {
  background: url("./icons/filters/隧道.png") no-repeat;
  background-size: 100% 100%;
}

.filter-icon.tianqi {
  background: url("./icons/filters/天气情况.png") no-repeat;
  background-size: 100% 100%;
}

.filter-icon.tianqiyujing {
  background: url("./icons/filters/天气预警.png") no-repeat;
  background-size: 100% 100%;
}

.filter-late {
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  margin-right: 5px;
  border-radius: 4px;
}

.filter-late.wd1 {
  background-color: #deca17;
  box-shadow: 0px 0px 3px 2px #deca17;
}

.filter-late.wd2 {
  background-color: #8e4c2c;
  box-shadow: 0px 0px 3px 2px #8e4c2c;
}

.filter-late.wd3 {
  background-color: #8b1f2b;
  box-shadow: 0px 0px 3px 2px #8b1f2b;
}

.filter-late.wd4 {
  background-color: #47111f;
  box-shadow: 0px 0px 3px 2px #47111f;
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

/* 天气预警 */
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

/* 列车 */
.marker-tarin {
  margin-top: -15px;
  margin-left: 6px;
  width: 97px;
  height: 25px;
}

.marker-tarin.min {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #a6abe2;
  font-size: 12px;
  border-radius: 50%;
  text-align: center;
  margin-top: -0px;
  margin-left: -1px;
}

.marker-tarin .pic {
  display: inline-block;
  width: 97px;
  height: 25px;
}

.marker-tarin.DC .pic {
  background: url("./icons/普通动车.png");
}

.marker-tarin.DQ .pic {
  background: url("./icons/桥动车.png");
}

.marker-tarin.DS .pic {
  background: url("./icons/隧道动车.png");
}

.marker-tarin.PC .pic {
  background: url("./icons/普车.png");
}

.marker-tarin.PQ .pic {
  background: url("./icons/桥普车.png");
}

.marker-tarin.PS .pic {
  background: url("./icons/隧道普车.png");
}

.marker-tarin.min.DC,
.marker-tarin.min.PC {
  background: #a6abe2;
}

.marker-tarin.min.DQ,
.marker-tarin.min.PQ {
  background: #daad3c;
}

.marker-tarin.min.DS,
.marker-tarin.min.PS {
  background: #9a52ea;
}

/* 圆点车下隐藏图片和车次 */
.marker-tarin.min .pic,
.marker-tarin.min .num {
  display: none;
}

.marker-tarin .num {
  position: absolute;
  display: inline-block;
  left: 5px;
  padding-left: 5px;
  right: 18px;
  top: 1px;
  background: transparent;
  color: white;
}

.marker-tarin .count {
  color: red;
  position: absolute;
  right: 0px;
  top: 1px;
  background: transparent;
  display: none;
}

/* 晚点列车 */
.marker-tarin .cover {
  position: absolute;
  display: inline-block;
  left: 5px;
  padding-left: 5px;
  right: 20px;
  top: 1px;
  bottom: 9px;
  color: white;
  background: transparent;
  animation: trainLateAnimate 1.5s;
  animation-iteration-count: infinite;
}

.marker-tarin.min .cover {
  left: 0px;
  padding-left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  border-radius: 6px;
}

/* 普通 A6ABE2 桥 DAAD3C 隧道 9A52EA */
.wd-train.wd1 .cover {
  box-shadow: 0 0 20px #deca17;
}

.wd-train.wd2 .cover {
  box-shadow: 0 0 20px #8e4c2c;
}

.wd-train.wd3 .cover {
  box-shadow: 0 0 20px #8b1f2b;
}

.wd-train.wd4 .cover {
  box-shadow: 0 0 20px #47111f;
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
.filtered .pic {
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
