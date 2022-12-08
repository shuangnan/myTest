<template>
  <div class="lay-con" id="kyz_main">
    <div class="lay" :class="{'big':bigScreen}">
      <div class="log">
        <div class="main-box top-left">
          <TopLeft :cur="NumFS" :curBb="bbNumFS" :curFd="fdNumFS"></TopLeft>
        </div>
        <div class="main-box top-right">
          <TopRight :cur="NumSR" :curBb="bbNumSR" :curFd="fdNumSR"></TopRight>
        </div>
        <div class="main-box top-menu">
          <el-select
            size="mini"
            v-model="unitselect"
            style="width:130px;"
            :disabled="unitFlag"
            class="blue-control"
            popper-class="blue-control"
          >
            <el-option
              v-for="(item,index) in unitList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
          <div style="display: inline-block;vertical-align: middle;padding-left: 10px;">
            <el-menu
              default-active="首页"
              mode="horizontal"
              class="blue-control"
              @select="chooseMenu"
              style="height: 30px;"
            >
              <el-submenu index="a" popper-class="blue-control">
                <template slot="title">{{curMenu.P_NAME}}</template>
                <el-menu-item :key="item.ID" :index="item.ID" v-for="item in menu">{{item.P_NAME}}</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
        </div>
        <div v-if="!other" class="main-box map-view" @click="changeMapView">
          <div v-if="curMapView==='all'"></div>
          <div v-else></div>
        </div>
        <div class="main-box tianqi Sunny"></div>
      </div>
      <!-- 中单iframe内容 -->
      <div v-if="other" class="frame-con">
        <iframe
          v-if="!otherFull"
          :src="curMenu.PAGE_URL"
          style="width: 100%;height: 100%;"
          frameborder="0"
        ></iframe>
        <div v-else class="img-con">
          <template v-if="curMenu.ID==='C980C0D0DB5C2EB1E053EF22C00A9F78'">
            <img v-if="bigScreen" :src="curMenu.PAGE_URL" style="height: 120%;width: 80%;" />
            <img v-else :src="curMenu.PAGE_URL" style="height: 100%;width: 130%;" />
          </template>
          <img v-else :src="curMenu.PAGE_URL" style="height: 100%;" />
        </div>
      </div>
      <!-- 中间主体内容 -->
      <div v-else class="center-con">
        <!-- <div class="map-con">
          <div class="map-border-top"></div>
          <div class="map-border-right"></div>
          <div class="map-border-bottom"></div>
          <div class="map-border-left"></div>
        </div>-->
        <div class="map-con2">
          <Map
            :mapView="curMapView"
            @openXiaoYu="openXiaoYu"
            :oid="unitselect"
            :oname="unitselectName"
          ></Map>
        </div>
        <!-- 左侧 -->
        <div class="main-box left" id="main-box-left">
          <div class="box has-tit" style="height: 20%;padding-bottom:0px;">
            <div class="box-tit shadow-txt" @click="openExtendView('left','half')">风险管控</div>
            <L1 :unitid="unitselect"></L1>
          </div>
          <div class="box" style="height: 40%;padding-bottom:5px;">
            <tabs
              ref="FXJHTabs"
              :tabsList="fxjhTabsTitle"
              @titleClick="fxjhTitleClick"
              style="height: 30px;"
              itemWidth="80px"
            ></tabs>
            <L2
              ref="L2"
              :unitid="unitselect"
              @changeFXJHTab="changeFXJHView"
              :fxjhSelectType="fxjhSelectType"
              @openDialogC="openDialogFX"
            ></L2>
          </div>
          <div class="box" style="height: 22%;">
            <tabs ref="myTabs" :tabsList="[{id:0,text:'设备管控'}]" style="height: 30px;"></tabs>
            <div style="width:100%;height:calc(100% - 20px)">
              <L3 :unitid="unitselect"></L3>
            </div>
          </div>
          <div class="box" style="height: 18%;">
            <tabs ref="myTabs" :tabsList="[{id:0,text:'外包管控'}]" style="height: 30px;"></tabs>
            <div style="width:100%;height:calc(100% - 20px)">
              <L4 :unitid="unitselect" @openDetail="openDetailL4"></L4>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="main-box right">
          <div class="box has-tit" style="height: 55%;">
            <div class="box-tit shadow-txt" @click="openExtendView('right','half')">生产管控</div>
            <R1 :unitid="unitselect" :unitselectName="unitselectName"></R1>
          </div>
          <div class="box" style="height: 45%;padding-top:15px;">
            <tabs ref="myTabs" :tabsList="[{id:0,text:'应急管控'}]" style="height: 30px;"></tabs>
            <div style="width:100%;height:calc(100% - 30px)">
              <R2 :unitid="unitselect" @openDetail="openDetailR2"></R2>
            </div>
          </div>
        </div>
      </div>

      <!-- 向右扩展屏 -->
      <div class="extend-view left" :class="extendView.left">
        <div class="extend-view-head" style="text-align: right;">
          <a class="arrow-left" title="点击关闭" @click="openExtendView('left','')"></a>
          <a class="arrow-right" title="点击展开" @click="openExtendView('left','full')"></a>
        </div>
        <div class="extend-view-body"></div>
      </div>
      <!-- 向左扩展屏 -->
      <div class="extend-view right" :class="extendView.right">
        <div class="extend-view-head" style="text-align: left;">
          <a class="arrow-left" title="点击展开" @click="openExtendView('right','full')"></a>
          <a class="arrow-right" title="点击关闭" @click="openExtendView('right','')"></a>
        </div>
        <div class="extend-view-body"></div>
      </div>

      <!-- 左翅膀屏 -->
      <div
        id="wing-view-left"
        v-if="!other ||(other && !otherFull) "
        class="wing-view left"
        :class="wingView.left"
      >
        <div class="wing-view-head" style="text-align: right;">
          <div
            style="display: inline-block;float: left;margin-top: -12px;width: calc(100% - 100px);height: 40px;"
          >
            <!-- <el-tabs v-model="activeWingLeftTab">
							<el-tab-pane label="普通屏" name="1">普通屏</el-tab-pane>
							<el-tab-pane label="其它屏" name="2">值班员</el-tab-pane>
            </el-tabs>-->
          </div>
          <a class="arrow-left" title="点击关闭" @click="openWingView('left','')"></a>
          <a
            v-show="wingView.left===''"
            class="arrow-right"
            title="点击展开"
            @click="openWingView('left','full')"
          ></a>
        </div>
        <div id="wing-view-body" class="wing-view-body">
          <template v-if="activeWingLeftTab==='1'">
            <div style="height: 33%;padding: 10px;">
              <div class="con" style="padding-top:10px;">
                <LW1 :unitid="unitselect"></LW1>
              </div>
            </div>
            <div style="height: 33%;display: flex;">
              <div style="height: 100%;width: 50%;padding: 10px;">
                <div class="con">
                  <LW2 :unitid="unitselect" @openDetail="openDetailLW2"></LW2>
                </div>
              </div>
              <div style="height: 100%;width: 50%;padding: 10px;">
                <div class="con">
                  <LW3></LW3>
                </div>
              </div>
            </div>
            <div style="height: 34%;padding: 5px">
              <div class="con">
                <LW4 :unitid="unitselect" :webParam="webParam" @openLW4Detail="openLW4Detail"></LW4>
              </div>
            </div>
          </template>
          <template v-else-if="activeWingLeftTab==='2'">
            <iframe
              :src="leftWingUrl_zby"
              style="width:100%;height:100%;border:none;background:#fff;"
            ></iframe>
          </template>
        </div>
      </div>
      <!-- 右翅膀屏 -->
      <div v-if="!other  ||(other && !otherFull) " class="wing-view right" :class="wingView.right">
        <div class="wing-view-head" style="text-align: left;">
          <a class="arrow-right" title="点击关闭" @click="openWingView('right','')"></a>
          <a
            v-show="wingView.right===''"
            class="arrow-left"
            title="点击展开"
            @click="openWingView('right','full')"
          ></a>
        </div>
        <div
          class="wing-view-body"
          id="zydbBox"
          style="padding-left: 10px;"
          v-loading="zydbLoadFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0,0,0,0.8)"
        >
          <div
            :style="{transform:'scale('+rightScale+')',width:rightWHScale,height:rightWHScale}"
            style="transform-origin:0 0"
          >
            <iframe :src="rightFrame" style="width: 100%;height: 100%;" frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </div>
    <div class="lay_bottom">
      <div @click="tipVisible=!tipVisible">
        <i class="el-icon-s-tools lay_bottom_btn" :class="{'lay_bottom_btn_on':tipVisible}"></i>
      </div>
    </div>
    <Dialog2
      ref="dialogc"
      :title="dialogTitle"
      :dialogW="dialogW"
      :dialogH="dialogH"
      :dialogX="dialogStartX"
      :dialogY="dialogStartY"
      :positionType="dialog2Position"
      :closeColor="dialogColseColor"
    >
      <div class="dialog_btn" v-if="dialogcView=='bj_iframe'">
        <el-select
          v-model="bjIframeSelect"
          size="mini"
          @change="changeBJSelect"
          style="width:110px;"
          class="blue-control"
          popper-class="blue-control"
        >
          <el-option label="成都客运段" value="成都客运段"></el-option>
          <el-option label="贵阳客运段" value="贵阳客运段"></el-option>
          <el-option label="重庆客运段" value="重庆客运段"></el-option>
        </el-select>
      </div>
      <iframe
        v-show="dialogcView.includes('iframe')"
        style="width:100%;height:100%;border:none;background:#fff;"
        :src="dialogIframeSrc"
      ></iframe>
      <div v-show="dialogcView=='zdcz'" class="dialog_zdcz"></div>
    </Dialog2>
    <Dialog1
      ref="dialogc1"
      :title="dialogTitle1"
      :dialogX_S="dialogX_S"
      :dialogY_S="dialogY_S"
      :dialogW="dialogW1"
      :dialogH="dialogH1"
    >
      <div
        style="width:100%;height:100%;"
        v-loading="dialog1LoadFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0,0,0,0.8)"
      >
        <iframe :src="dialog1Src" style="width:100%;height:100%;border:none;background:#fff;"></iframe>
      </div>
    </Dialog1>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="xiaoyu"
      top="20px"
      title="音视频通话"
      width="80%"
      :lock-scroll="true"
      :append-to-body="true"
      :destroy-on-close="true"
      custom-class="xiaoyuLink"
    >
      <div style="height: 800px">
        <xiaoyu :targetUrl="xiaoyuTargetUrl"></xiaoyu>
      </div>
      <!-- <div slot="footer" style="text-align: center;">
				<el-button size="" plain style="width: 120px;" @click="xiaoyu=false">关闭</el-button>
				<el-button size="" type="primary" style="width: 120px;" @click="xiaoyu=false">确定</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import tabs from "../../../components/bigScreen/KydTabs";
import Dialog2 from "../../../components/data/Dialog2.vue";
import Dialog1 from "../../../components/data/Dialog1.vue";
import Map from "./IndexMap.vue"; //地图
import MapCD from "./IndexMapCD.vue"; //地图-成都
import TopLeft from "./TopLeft.vue"; //旅客发送量
import TopRight from "./TopRight.vue"; //完成收入
import LW3 from "./LW3.vue"; //
import LW4 from "./LW4.vue"; //
import L1 from "./L1.vue"; //
import L2 from "./L2.vue"; //
import L3 from "./L3.vue"; //
import L4 from "./L4.vue"; //
import R1 from "./R1.vue"; //
import R2 from "./R2.vue"; //
import LW1 from "./LW1";
// import LW2 from "../../bigScreen/kyz/kygzsbbl.vue"
import LW2 from "./LW2.vue";
import xiaoyu from "./xiaoyu.vue";
import C from "../../../assets/com.js";
import unitTreeData from "../../../assets/unitTreeData.js";
const rightFrameHeader = "/JFLCMS/vue/#/zydb?viewType=v2&Oid=";
let xyRUL = "/JFLCMS/vue/#/XYLink?";
export default {
  data() {
    return {
      unitFlag: false,
      unitList: [], //单位列表
      unitselect: "", //单位树选中数据
      unitselectName: "", //使用单位名
      curMapView: "all",
      webParam: "",
      other: false, //是否为iframe嵌套页面
      otherFull: false, //是否为iframe嵌套页面-全屏
      menu: [],
      curMenu: {},
      bigScreen: false, //是否为超宽屏
      // 扩展屏
      extendView: {
        left: "",
        right: ""
      },
      // 翅膀屏
      wingView: {
        left: "",
        right: ""
      },
      // 左翅膀选中tab选项卡
      activeWingLeftTab: "1",
      rightFrame: "", //"http://10.192.6.155:9090/JFLCMS/vue/#/zydb?Oid=99990002001499A50004&StnCode=ICW&viewType=v2",
      rightScale: "1", //右侧扩展屏 缩放比例
      rightWHScale: "100%", //右侧扩展屏宽度
      fxjhTabsTitle: [
        {
          id: 0,
          text: "重大风险"
        },
        {
          id: 1,
          text: "综控风险"
        },
        {
          id: 2,
          text: "乘降风险"
        },
        {
          id: 3,
          text: "施工风险"
        }
      ], //风险计划标题
      //风险计划选中id
      fxjhSelectType: 0,
      //奋斗必保数据
      NumFS: "",
      bbNumFS: 0,
      fdNumFS: 0,
      NumSR: "",
      bbNumSR: 0,
      fdNumSR: 0,

      zydbLoadFlag: true, //右侧扩展loading
      tipVisible: false,

      //dialog2数据
      dialogTitle: "", //自定义弹框名称
      dialogStartX: "0px", //自定义弹框起始位置
      dialogStartY: "0px", //自定义弹框起始位置
      dialogW: "40%", //自定义弹框宽度
      dialogH: "100%", //自定义弹框高度
      dialog2Position: "left",
      dialogcView: "iframe",
      dialogColseColor: "",
      dialogIframeSrc: "",
      //dialog1数据
      dialogTitle1: "",
      dialogX_S: "",
      dialogY_S: "",
      dialogW1: "650px",
      dialogH1: "500px",
      dialog1Src: "",
      dialog1LoadFlag: true,
      bjIframeSelect: "成都客运段",
      xiaoyu: false,
      xiaoyuTargetUrl: ""
    };
  },
  computed: {
    leftWingUrl_zby() {
      return (
        "http://10.192.6.175:9090/JFLCMS/kylk/zby.html?StnCode=&UserType=1&pageType=V1&Oid=" +
        this.unitselect +
        "&Oname=" +
        this.unitselectName +
        "&UserPID=" +
        this.$store.state.params.UserPID +
        "&UserName=" +
        this.$store.state.params.UserName
      );
    }
  },
  created() {
    this.webParam = this.$store.state.params;
    this.unitselectName = this.webParam.Oname;
    var sData = unitTreeData.getSelectOname(this.webParam);
    this.unitList = sData.selectData;
    this.unitselect = sData.value;
    this.unitFlag = this.unitList.length < 2;
    this.getDataS();
    window.addEventListener("message", e => {
      if (e.data.code == "video_001") {
        //接收视频监控全屏消息
        console.log("监控视频全屏消息", e.data);
        this.dialog1LoadFlag = true;
        this.dialogX_S = window.event.x + "px";
        this.dialogY_S = window.event.y + "px";
        this.dialogTitle1 = "监控视频";
        this.$nextTick(() => {
          this.$refs.dialogc1.openDialog();
          this.dialog1Src = "";
          setTimeout(() => {
            this.dialog1Src =
              C.origin +
              "/JFLCMS/vue/index2.html#/JKItems?closeFlag=false&refreshBtn=1&nameList=" +
              e.data.resname +
              "&resid=" +
              e.data.resid +
              "&UserPID=" +
              this.webParam.UserPID;
            setTimeout(() => {
              this.dialog1LoadFlag = false;
            }, 500);
          }, 500);
        });
      }
    });
  },
  mounted() {
    this.bigScreen = window.innerWidth > 3000;
    document.querySelector("title").innerHTML = "客运站生产指挥中心"; //页面名称
    if (this.bigScreen) {
      this.rightViewVisible("full");
    }
    this.$nextTick(() => {
      this.setDefaults(); //计算页面默认设置
    });
    xyRUL = C.origin + xyRUL;
    xyRUL =
      xyRUL +
      "&UserName=" +
      this.webParam.UserName +
      "&UserPID=" +
      this.webParam.UserPID;
    this.xiaoyuTargetUrl =
      xyRUL + "&Oname=" + this.webParam.Oname + "&Oid=" + this.webParam.Oid;
  },
  components: {
    tabs,
    Dialog2,
    Dialog1,
    Map,
    MapCD,
    TopLeft,
    TopRight,
    LW3,
    LW4,
    L1,
    L2,
    L3,
    L4,
    R1,
    R2,
    LW1,
    LW2,
    xiaoyu
  },
  methods: {
    //获取数据
    getDataS() {
      var sdate = new Date().Format("yyyyMM01");
      var edate = new Date().Format("yyyyMMdd");
      this.getFDBBData(); //获取奋斗必保数据
      this.getFDBBCur("1", sdate, edate, rs => {
        if (rs[0]) {
          this.NumFS = rs[0].DATA_NUM
            ? (rs[0].DATA_NUM / 10000).toFixed(2)
            : "0";
        }
        console.log("发送人数", rs);
      }); //获取发送人数当前值
      this.getFDBBCur("2", sdate, edate, rs => {
        if (rs[0]) {
          this.NumSR = rs[0].DATA_NUM
            ? (rs[0].DATA_NUM / 10000).toFixed(2)
            : "0";
        }
        console.log("收入", rs);
      }); //获取收入当前值
      this.getMenus(); //获取左上角菜单
    },
    setDefaults() {
      //计算右侧扩展屏缩放比例
      var width = document.getElementById("zydbBox").offsetWidth;
      var temp = 1920 / width;
      this.rightWHScale = temp * 100 + "%";
      this.rightScale = 1 / temp;
    },
    // 切换扩展屏状态
    openExtendView(key, cls) {
      this.extendView[key] = cls;
    },
    // 切换翅膀屏状态
    openWingView(key, cls) {
      this.wingView[key] = cls;
      if (key == "right") {
        this.rightViewVisible(cls); //右侧展开关闭切换
      }
    },
    // 切换地图显示方式
    changeMapView() {
      this.curMapView = this.curMapView === "all" ? "chengdu" : "all";
    },
    // 选择菜单
    chooseMenu(key, keyPath) {
      this.curMenu = this.menu.filter(item => item.ID === key)[0];
      this.other = this.curMenu.ID !== "首页"; //首页
      this.otherFull = this.curMenu.otherFull;
    },
    //自动切换风险计划显示
    changeFXJHView() {
      var selectType = this.$refs.FXJHTabs.selectType;
      var index = -1;
      this.fxjhTabsTitle.forEach((v, i) => {
        if (v.id === selectType) {
          index = i;
        }
      });
      if (this.fxjhTabsTitle[index + 1]) {
        selectType = this.fxjhTabsTitle[index + 1].id;
      } else {
        selectType = this.fxjhTabsTitle[0].id;
      }
      this.$refs.FXJHTabs.setActiveItem(selectType);
      this.$nextTick(() => {
        this.fxjhSelectType = selectType;
      });
    },
    fxjhTitleClick(item) {
      console.log("手动切换");
      this.$refs.L2.clearSetTimeOut();
      this.fxjhSelectType = item.id;
      this.$refs.FXJHTabs.setActiveItem(item.id);
    },
    rightViewVisible(cls) {
      if (cls == "full") {
        //右侧展开
        this.rightFrame = "";
        setTimeout(() => {
          this.rightFrame =
            C.origin + rightFrameHeader + this.unitselect.toUpperCase();
          // this.rightFrame ="http://localhost:8080/#/zydb?viewType=v2&Oid="+this.unitselect.toUpperCase();
          this.$nextTick(() => {
            setTimeout(() => {
              this.zydbLoadFlag = false;
            }, 1500);
          });
        }, 100);
      } else {
        //右侧关闭
        this.rightFrame = "";
      }
    },
    //打开风险计划
    openDialogFX(item) {
      console.log("风险计划", item, window.event);
      this.dialog1LoadFlag = true;
      this.dialogX_S = window.event.x + "px";
      this.dialogY_S = window.event.y + "px";
      if (this.fxjhSelectType === 0) {
        this.dialogTitle1 = "列车作业视频";
      } else if (this.fxjhSelectType === 1) {
        this.dialogTitle1 = "列车作业视频";
      }
      this.$nextTick(() => {
        this.$refs.dialogc1.openDialog();
      });
    },
    //打开监控视频详情
    openLW4Detail(node) {
      var itemBox = document.getElementById("wing-view-left");
      var src =
        "http://10.192.6.177:9090/JFLCMS/vue/index2.html#/JKVideo?type=1&Oid" +
        this.unitselect +
        "&UserPID=" +
        this.webParam.UserPID +
        "&searchText=" +
        node.text;
      this.dialog2Position = "left";
      this.dialogcView = "iframe";
      this.dialogColseColor = "#fff";
      this.openDialogC(
        itemBox.offsetLeft,
        itemBox.offsetTop,
        itemBox.offsetHeight,
        1920,
        src,
        "视频监控"
      );
    },
    //打开外包管控详情
    openDetailL4(type) {
      //main-box-left
      var src = "";
      var title = "",
        timeout = 100;
      if (type == "A") {
        //安检
        title = "危险品管理";
        src =
          "http://10.192.6.155:9090/JFLCMS/vue/#/wxpmx?UserMType=安检&blueSkin=true&UserName=" +
          this.webParam.UserName +
          "&UserPID=" +
          this.webParam.UserPID +
          "&Oid=" +
          this.unitselect.toUpperCase();
        this.dialogcView = "iframe";
      } else if (type == "B") {
        //保洁
        title = "";
        src =
          "https://10.192.34.79/ky3450/SOSE/kydms/distv/web/sjfx/index.html?Oname=" +
          this.bjIframeSelect;
        timeout = 600;
        this.dialogcView = "bj_iframe";
      }
      var itemBox = document.getElementById("main-box-left");
      this.dialog2Position = "left";

      this.dialogColseColor = "#fff";
      this.openDialogC(
        itemBox.offsetLeft,
        itemBox.offsetTop,
        itemBox.offsetHeight,
        1900,
        src,
        title,
        timeout
      );
    },
    //打开应急管控详情
    openDetailR2(type) {
      var src = "";
      var title = "",
        timeout = 600;
      var itemBox = document.getElementById("main-box-left");
      var dialogHeight = itemBox.offsetHeight;
      if (type == "gdbg") {
        //股道变更
        this.dialogcView = "iframe";
        this.dialogColseColor = "#0e90d2";
        src =
          "http://10.192.6.175:9090/JFLCMS/kylk/zby.html?UserType=1&pageType=V1&UserName=" +
          this.webParam.UserName +
          "&UserPID=" +
          this.webParam.UserPID +
          "&Oid=" +
          this.unitselect.toUpperCase() +
          "&Oname" +
          this.unitselectName;
      } else if (type == "ldld") {
        this.dialogcView = "zdcz";
        dialogHeight = 690;
        this.dialogColseColor = "#fff";
      }
      this.dialog2Position = "right";
      this.openDialogC(
        itemBox.offsetLeft,
        itemBox.offsetTop,
        dialogHeight,
        1900,
        src,
        title,
        timeout
      );
    },
    //打开设备统计详情
    openDetailLW2(type) {
      //main-box-left
      var src = "";
      var title = "",
        timeout = 100;
      src =
        "http://10.192.6.155:9090/JFLCMS/vue/#/unitSelectSB?pageIndex=0&bg=1&Oid=" +
        this.unitselect.toUpperCase();
      var itemBox = document.getElementById("kyz_main");
      this.dialog2Position = "left";
      this.dialogColseColor = "#fff";
      this.dialogcView = "iframe";
      var w = itemBox.offsetWidth,
        left = itemBox.offsetLeft;
      if (w > 2160) {
        w = 2160;
        left = (itemBox.offsetWidth - w) / 2;
      }
      var h = itemBox.offsetHeight,
        top = itemBox.offsetTop;
      if (h > 1080) {
        h = 1080;
        top = (item.offsetHeight - h) / 2;
      }
      this.openDialogC(left, top, h, w, src, title, timeout);
    },
    openDialogC(dgx, dgy, dgh, dgw, src, title, timeout) {
      this.dialogStartX = dgx + "px";
      this.dialogStartY = dgy + "px";
      this.dialogH = dgh + "px";
      this.dialogW = dgw + "px";
      this.dialogTitle = title;
      var tout = 100;
      if (timeout) {
        tout = timeout;
      }
      this.$nextTick(() => {
        this.$refs.dialogc.openDialog();
        this.dialogIframeSrc = "";
        setTimeout(() => {
          this.dialogIframeSrc = src;
        }, tout);
      });
    },
    //获取奋斗必保数据
    getFDBBData() {
      var date = new Date().Format("yyyyMM");
      // 获取车务段级奋斗、必保数据
      C.getData(
        {
          c: "trdm_ys_310",
          s: [this.unitselectName, date]
        },
        r => {
          if (r && r.length > 0) {
            // {KYFSL_B: "71", KYSR_B: "7700", KYFSL_F: "74", KYSR_F: "8100"}
            // KYSR_B, 收入必保（万元）
            // KYFSL_B,人数必保（万人）
            // KYSR_F,收入奋斗（万元）
            // KYFSL_F人数奋斗（万人）
            // 旅客发送---必保
            this.bbNumFS = Number(r[0].KYFSL_B);
            // 旅客发送---奋斗
            this.fdNumFS = Number(r[0].KYFSL_F);
            // 客运收入---必保
            this.bbNumSR = Number(r[0].KYSR_B);
            // 客运收入---奋斗
            this.fdNumSR = Number(r[0].KYSR_F);
          }
          console.log("【trdm_ys_310】获取车务段级奋斗、必保数据>>>", r);
        }
      );
    },
    //获取收入发送当前值
    //类型（1-发送人数，2-客运收入）
    getFDBBCur(type, sdate, edate, callback) {
      C.getData(
        {
          c: "trdm_ys_334",
          s: [type, sdate, edate],
          o: [this.unitselect.toUpperCase()],
          a: "【trdm_ys_334】收入发送当前值",
          async: true
        },
        r => {
          callback(r);
        }
      );
    },
    //获取左上角菜单
    getMenus() {
      // 2.51、获取聚合界面菜单（客运段）
      // code trdm_lv_713
      // param1 [菜单类型（2-客运段，3-客运站大屏，4-客运段大屏）]
      // return [[p_name（页面名称），state（为closed时表示顶级节点），p_id（父节点ID），id（节点ID）]]
      // {P_NAME: "首页", STATE: "", PID: "B9C9D6B74695568DE053EF22C00ABD4C", ID: "C980C0D0DB582EB1E053EF22C00A9F78", P_ID: "C96C17F6F0B32D70E053DD02C20A85C8"}
      C.getData(
        {
          // url: "http://10.192.6.175:9090/TRDM/GeneralProServlet",
          // url: "http://10.192.34.84:9090/TRDM/GeneralProServlet",
          // url: this.$store.state.url,
          c: "trdm_lv_713",
          s: [3],
          a: "获取人员可用菜单"
        },
        r => {
          console.log("获取聚合界面菜单（客运段）", r);
          const realMenu = [];
          const realTemp = {};
          const jsonM = {};
          if (r && r.length > 0) {
            r.forEach(item => {
              if (item.P_ID !== "") {
                jsonM[item.P_ID] = item; //菜单对应页面ID
              }
              item.otherFull = true;
              if (item.ID === "C980C0D0DB582EB1E053EF22C00A9F78") {
                //"首页"
                item.ID = "首页";
                realMenu.push(item);
              }
              // else if (item.ID === "C980C0D0DB592EB1E053EF22C00A9F78") { //"成都东站3D沙盘"
              // 	item.otherFull = false;
              // 	item.PAGE_URL =
              // 		"http://10.192.32.95:8080/Account/Auth/edulogin?cmV0dXJudXJsPS9Nb2RlbC9TaG93L0RlbW8md29ya3M9MCwxLDIsMyZVc2VyUElEPTUxMTAyMzE5ODgwNzA2Mzg5WCZpZENhcmQ9NTExMDIzMTk4ODA3MDYzODlYJmlkQ2FyZFN0cmluZz01MTEwMjMxOTg4MDcwNjM4OVgmaWRjYXJkPTUxMTAyMzE5ODgwNzA2Mzg5WCZPaWQ9VTIwMTcxMDIwMDk0NzAwNDMxJk9uYW1lPSVFNiU4OCU5MCVFOSU4MyVCRCVFOSU5MyU4MSVFOCVCNyVBRiVFNyVBNyU5MSVFNSU4OCU5QiVFNiU5QyU4OSVFOSU5OSU5MCVFOCVCNCVBMyVFNCVCQiVCQiVFNSU4NSVBQyVFNSU4RiVCOCZEZXBJZD05OTk5MDAwMjAwMTQwMDA4MTVBNzAwMDQwMDAxJkRlcE5hbWU9JUU1JUE0JUE3JUU2JTk1JUIwJUU2JThEJUFFJUU1JUJBJTk0JUU3JTk0JUE4JUU1JUJDJTgwJUU1JThGJTkxJUU5JTgzJUE4JlVzZXJNVHlwZT0="; //无图
              // 	realMenu.push(item);
              // } else if (item.ID === "C980C0D0DB5A2EB1E053EF22C00A9F78") { //"成都东站设备设施管控"
              // 	item.otherFull = false;
              // 	item.PAGE_URL =
              // 		"http://10.192.6.183:8080/web/map/index.html#/equipment-distribution?station=重庆北&account=kcadmin&deptid=null&company=1325";
              // 		realMenu.push(item);
              // } else if (item.ID === "C980C0D0DB5B2EB1E053EF22C00A9F78") { //"车站周边交通客流情况"
              // 	item.PAGE_URL = require("./img/1-车站周边交通客流情况.jpg");
              // 	realMenu.push(item);
              // } else if (item.ID === "C980C0D0DB5C2EB1E053EF22C00A9F78") { //"重点车站交通情况"
              // 	item.PAGE_URL = require("./img/2-重点车站交通情况.jpg");
              // 	realMenu.push(item);
              // } else if (item.ID === "C980C0D0DB5D2EB1E053EF22C00A9F78") { //"地铁客流情况"
              // 	item.PAGE_URL = require("./img/3-地铁客流情况.jpg");
              // 	realMenu.push(item);
              // } else if (item.ID === "C980C0D0DB5E2EB1E053EF22C00A9F78") { //"重点车站可视化"
              // 	item.PAGE_URL = require("./img/4-重点车站可视化.jpg");
              // 	realMenu.push(item);
              // }
            });

            const creatMenu = arr => {
              C.$.each(arr, (i, v) => {
                if (v.children && v.children.length > 0) {
                  creatMenu(v.children);
                } else if (
                  v.MJ_TYPE === "2" &&
                  typeof jsonM[v.SYSM_PAGE] !== "undefined" &&
                  jsonM[v.SYSM_PAGE].ID !== "首页"
                ) {
                  const realItem = Object.assign(jsonM[v.SYSM_PAGE], v);
                  realTemp[v.SYSM_PAGE] = realItem;
                }
              });
            };
            //userid和userEncode
            C.getData(
              {
                c: "trdm_lv_642",
                s: [
                  "77EFCE2665F92AACE0534720C00A8AA1",
                  "7327E2B7F46D8219E0534720C00AB286"
                ],
                a: "获取管理信息系统菜单"
              },
              m => {
                C.$.each(m, (_, fws) => {
                  creatMenu(fws);
                });
                C.$.each(realTemp, (_, real) => {
                  if (real.PAGE_URL.indexOf(".jpg") < 0) {
                    real.otherFull = false;
                  }
                  realMenu.push(real);
                });
                console.log("获取聚合界面菜单>>>>>>>>", realMenu);
                this.menu = realMenu;
                this.curMenu = realMenu[0];
              }
            );
          }
        }
      );
    },
    changeBJSelect(selectName) {
      var src =
        "https://10.192.34.79/ky3450/SOSE/kydms/distv/web/sjfx/index.html?Oname=" +
        selectName;
      this.dialogIframeSrc = "";
      setTimeout(() => {
        this.dialogIframeSrc = src;
      }, 100);
    },
    openXiaoYu() {
      this.xiaoyu = true;
    }
  },
  watch: {
    unitselect(val) {
      this.unitselectName = "";
      this.unitList.forEach(v => {
        if (v.id == val) {
          this.unitselectName = v.text;
        }
      });
      this.$nextTick(() => {
        this.getDataS(); //奋斗必保数据
        if (this.wingView["right"] == "full") {
          this.rightViewVisible("full"); //右侧展开关闭切换
        }
      });
    }
  }
};
</script>

<style scoped="scoped">
.lay-con {
  position: relative;
  width: 100%;
  height: 100%;
  padding-bottom: 60px;
  background: #01081b url(img/picBottomBg.png) no-repeat;
  background-size: 100% 142px;
  background-position: bottom;
}

.lay {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: white;
}

/* 顶部logo标题 */
.log {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -960px;
  height: 72px;
  width: 1920px;
  background: url(img/log.png) no-repeat;
  z-index: 520;
}

/* 中间 地图容器 其它元素的层级必须大于400*/
.center-con {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 页面容器 */
.frame-con {
  position: absolute;
  top: 120px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}

.frame-con > .img-con {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  padding-top: 50px;
  overflow: auto;
  z-index: 400;
}

.frame-con > .img-con > img {
  display: block;
  margin: 0 auto;
  /* min-width: 3840px; */
}

.lay.big .center-con {
  width: 50%;
  margin: 0 auto;
}

.lay.big .frame-con {
  width: 50%;
  margin: 0 auto;
}

.main-box {
  position: absolute;
  z-index: 410;
}

/* 左上角菜单 */
.top-menu {
  top: 5px;
  left: 10px;
}

/* 左上角统计 */
.main-box.top-left {
  top: 42px;
  left: 20px;
  width: 546px;
  height: 72px;
}

/* 右上角统计 */
.main-box.top-right {
  top: 42px;
  right: 20px;
  width: 546px;
  height: 72px;
}

/* 左上角地图切换 */
.main-box.map-view {
  top: 18px;
  left: 460px;
  height: 50px;
  width: 60px;
  background: url(img/logoCD.png) no-repeat;
  background-size: 60px auto;
  background-position: 0 12px;
}

.main-box.map-view > div {
  width: 100%;
  height: 100%;
  line-height: 45px;
  text-align: center;
  letter-spacing: 5px;
  cursor: pointer;
}

/* 右上角天气 */
.main-box.tianqi {
  top: 14px;
  right: 455px;
  height: 50px;
  width: 60px;
}

.tianqi.Sunny {
  background: url(./img/tianqi/Sunny.gif) no-repeat;
}

/* 中间地图 */
.map-con {
  position: absolute;
  top: 80px;
  left: 450px;
  right: 450px;
  bottom: 0;
}

.map-con2 {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0;
}

.map-border-top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 37px;
  background: url(img/map-box-top.png) repeat-x;
  background-position: 0px -20px;
  z-index: 420;
}

.map-border-right {
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 10px;
  width: 37px;
  height: 100%;
  background: url(img/map-box-right.png) repeat-y;
  z-index: 420;
}

.map-border-bottom {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0px;
  height: 37px;
  background: url(img/map-box-bottom.png) repeat-x;
  z-index: 420;
}

.map-border-left {
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 10px;
  width: 37px;
  height: 100%;
  background: url(img/map-box-left.png) repeat-y;
  background-position: -20px 0px;
  z-index: 420;
}

/* 中间左侧 */
.main-box.left {
  top: 125px;
  left: 10px;
  bottom: 5px;
  width: 425px;
  padding: 0px;
  background: url(./img/picBoxRadius.png) no-repeat;
  background-size: 120% 100%;
  background-position: -55px 0;
  transition: all 0.3s;
  padding-bottom: 10px;
}

.main-box.left::after {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 100%;
  height: 100%;
  background: url(./img/picBoxToRight.png) no-repeat;
  background-size: 100% 100%;
  z-index: -1;
}

/* 中间右侧 */
.main-box.right {
  top: 125px;
  right: 10px;
  bottom: 5px;
  width: 425px;
  padding: 0px;
  background: url(./img/picBoxRadius.png) no-repeat;
  background-size: 120% 100%;
  background-position: -22px 0;
  transition: all 0.3s;
  padding-bottom: 10px;
}

.main-box.right::after {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 100%;
  height: 100%;
  background: url(./img/picBoxToLeft.png) no-repeat;
  background-size: 100% 100%;
  z-index: -1;
}

/* 扩展屏 、翅膀屏*/
.extend-view,
.wing-view {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 34px;
  border: 1px solid #122d56;
  background: rgba(5, 11, 47, 0.8);
  z-index: 550;
}

.extend-view {
  top: 73px;
}

/* 超宽屏下的扩展屏 */
.lay.big .extend-view {
  width: 50%;
}

/* 翅膀屏 */
.wing-view {
  width: 50%;
  border: 1px solid #122d56;
  background: rgba(5, 11, 47, 0.9);
}

/* 超宽屏下的翅膀屏 */
.lay.big .wing-view {
  top: 40px;
  width: 25%;
  padding-top: 0px;
  border-radius: 20px;
  border: 0px solid #122d56;
  background: rgba(5, 11, 47, 0.1);
  z-index: 490;
  height: calc(100% - 40px);
}

.extend-view-head,
.wing-view-head {
  position: absolute;
  top: 0px;
  width: 100%;
  padding: 5px;
}

.extend-view-head > a,
.wing-view-head > a {
  display: inline-block;
  padding: 0 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #20c8d5;
}

/* 超宽屏下的翅膀屏头部按钮 */
.lay.big .wing-view > .wing-view-head > a {
  display: none;
}

.extend-view-head > a:hover,
.wing-view-head > a:hover {
  cursor: pointer;
  text-shadow: 0 0 10px #0000ff, 0 0 10px #fff;
}

.extend-view-head > a.arrow-left,
.wing-view-head > a.arrow-left {
  display: inline-block;
  height: 20px;
  width: 22px;
  background: url("../../../assets/imgs/bigScreen/arrow-left.png") no-repeat;
  background-position: 0 2px;
}

.extend-view-head > a.arrow-right,
.wing-view-head > a.arrow-right {
  display: inline-block;
  height: 20px;
  width: 22px;
  background: url("../../../assets/imgs/bigScreen/arrow-right.png") no-repeat;
  background-position: right 2px;
}

/* 左翅膀屏的展开按钮 */
.wing-view.left > .wing-view-head > a.arrow-right {
  position: absolute;
  top: calc(50vh);
  right: -10px;
  transition: right 0.3s;
}

.wing-view.left > .wing-view-head > a.arrow-right:hover {
  right: -20px;
}

/* 右翅膀屏的展开按钮 */
.wing-view.right > .wing-view-head > a.arrow-left {
  position: absolute;
  top: calc(50vh);
  left: -11px;
  transition: left 0.3s;
}

.wing-view.right > .wing-view-head > a.arrow-left:hover {
  left: -20px;
}

.extend-view-body,
.wing-view-body {
  height: 100%;
  width: 100%;
}

/* 左侧屏 */
.extend-view.left {
  left: -100%;
  transition: left 0.3s;
}

.extend-view.left.half {
  left: -50%;
}

.extend-view.left.full {
  left: 0%;
}

/* 超宽屏下的左扩展屏 */
.lay.big .extend-view.left {
  left: -50%;
  transition: left 0.3s;
}

.lay.big .extend-view.left.half {
  left: -25%;
}

.lay.big .extend-view.left.full {
  left: 0%;
}

/* 右侧屏 */
.extend-view.right {
  right: -100%;
  transition: right 0.3s;
}

.extend-view.right.half {
  right: -50%;
}

.extend-view.right.full {
  right: 0%;
}

/* 超宽屏下的右展屏 */
.lay.big .extend-view.right {
  right: -50%;
  transition: right 0.3s;
}

.lay.big .extend-view.right.half {
  right: -25%;
}

.lay.big .extend-view.right.full {
  right: 0%;
}

/* 左翅膀 */
.wing-view.left {
  left: -50%;
  transition: left 0.3s;
}

.wing-view.left.full {
  left: 0%;
}

/* 超宽屏下的左翅膀 */
.lay.big .wing-view.left {
  left: 0%;
}

/* 左翅膀 */
.wing-view.right {
  right: -50%;
  transition: right 0.3s;
}

.wing-view.right.full {
  right: 0%;
}

/* 超宽屏下的右翅膀 */
.lay.big .wing-view.right {
  right: 0%;
}

/* 盒子窗口 */
.box {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.box.has-tit {
  padding-top: 30px;
}

.box-tit {
  position: absolute;
  top: 6px;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

/* 纯容器 */
.con {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 1px solid #122d56;
  background: rgba(5, 11, 47, 0.9);
}

/* 呼吸灯 */
>>> .SSlight {
  animation: SSlightDo 3s infinite;
  animation-timing-function: linear;
}

@keyframes SSlightDo {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

>>> .warningLight {
  animation: SSlightDo 0.8s infinite;
  animation-timing-function: linear;
}

@keyframes SSlightDo {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

>>> .warningLightM {
  animation: SSlightDo 1.5s infinite;
  animation-timing-function: linear;
}

@keyframes SSlightDo {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

>>> .HScroll {
  animation: HScrollDo 1.5s infinite;
  animation-timing-function: linear;
}

@keyframes HScrollDo {
  0% {
    transform: translateY(-50%);
  }

  100% {
    transform: translateY(0%);
  }
}

.lay_bottom {
  position: absolute;
  height: 54px;
  width: 100%;
  left: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.lay_bottom > div {
  cursor: pointer;
}

.lay_bottom_btn {
  color: #23858b;
  font-size: 24px;
}

.lay_bottom_btn_on {
  color: #20c8d5;
}

>>> .el-select-dropdown__wrap {
  max-height: 300px !important;
}

>>> .el-tabs__item {
  color: white;
}

>>> .el-tabs__item.is-active {
  color: #409eff;
}

>>> .el-tabs__nav-wrap::after {
  background-color: transparent;
}
.dialog_zdcz {
  width: 100%;
  height: 100%;
  background: url("./img/zdczjt.jpg") no-repeat;
  background-size: 100% 100%;
  background-position: center;
  background-color: #000;
}
.dialog_btn {
  position: absolute;
  right: 50px;
  top: 5px;
  display: inline-block;
  vertical-align: top;
}
>>> .xiaoyuLink .el-dialog__header {
  background: #4d5f83;
}
>>> .xiaoyuLink .el-dialog__title {
  color: #fff;
}
>>> .xiaoyuLink .el-dialog__headerbtn {
  color: #fff;
}
>>> .xiaoyuLink .el-dialog__body {
  border-top: none;
  border-bottom: none;
}
</style>
<style>
/* 发光字体 */
.shadow-txt {
  color: #d0c5e3;
  text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
}
</style>
