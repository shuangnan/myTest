<template>
  <div class="lay-con">
    <div class="lay" :class="{'big':bigScreen}">
      <div class="log">
        <div class="main-box top-menu">
          <el-select
            size="mini"
            v-model="unitselect"
            style="width:130px;margin:10px 0 0 15px"
            :disabled="unitFlag"
            class="blue-control"
            popper-class="blue-control"
          >
            <el-option
              v-for="(item,index) in unitListLoad"
              :key="index"
              :label="item.TEXT"
              :value="item.ID"
            ></el-option>
          </el-select>
        </div>
        <div class="main-box top-menu-right">
          <!-- <el-switch style="display:inline-block;margin-top:10px;" v-model="LRShowFlag"></el-switch> -->
        </div>
        <!-- <div class="main-box tianqi Sunny"></div> -->
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
        <!-- 地图 -->
        <div class="map-con2">
          <Map
            ref="myMap"
            style="background: #272f46;"
            sys="kyd"
            :oid="unitselect"
            :oname="unitselectname"
            :toolsConfig="{left:'440px',height:'826px'}"
          ></Map>
        </div>
        <!-- 左侧按钮 -->
        <div class="leftBoxBtn" :class="{'leftBoxBtnClose':!leftViewBoxVisible&&!bigScreen,'leftBoxBtnCloseBig':!leftViewBoxVisible&&bigScreen}">
            <a class="arrow-left" v-show="leftViewBoxVisible" title="点击关闭" @click="leftViewBoxVisible=!leftViewBoxVisible"></a>
            <a class="arrow-right" v-show="!leftViewBoxVisible" title="点击展开" @click="leftViewBoxVisible=!leftViewBoxVisible"></a>
        </div>
        <!-- 右侧按钮 -->
        <div class="rightBoxBtn" :class="{'rightBoxBtnClose':!rightViewBoxVisible&&!bigScreen,'rightBoxBtnCloseBig':!rightViewBoxVisible&&bigScreen}">
            <a class="arrow-left" v-show="!rightViewBoxVisible" title="点击展开" @click="rightViewBoxVisible=!rightViewBoxVisible"></a>
            <a class="arrow-right" v-show="rightViewBoxVisible" title="点击关闭" @click="rightViewBoxVisible=!rightViewBoxVisible"></a>
        </div>
        <!-- 左侧 -->
        <div class="main-box leftMainBG" v-show="leftViewBoxVisible">
          <div></div>
        </div>
        <div class="main-box left" id="main-box-left" style="padding-top:25px;" v-show="leftViewBoxVisible">
          <div class="left_topText">
            <span class="shadow-txt1">安全生产天数</span>
            <div class="left_topText_NUM" v-for="(item,index) in safeDays" :key="index">{{item}}</div>
          </div>
          <div style="height:33%;width:100%;position:relative;">
            <!-- <div class="box-tit shadow-txt" @click="openExtendView('left','half')">生产日况</div> -->
            <tabs
              :tabsList="[{id:0,text:'风险预警'}]"
              style="height: 30px;font-weight:bold;"
              @titleClick="openFXINFO"
            ></tabs>
            <div style="width:100%;height:calc(100% - 30px)">
              <CR4 :oname="unitselectname" @setFXDataList="setFXDataList"></CR4>
            </div>
          </div>
          <div style="height:33%;width:100%;">
            <tabs
              :tabsList="[{id:0,text:'生产日况'}]"
              style="height: 30px;font-weight:bold;"
              @titleClick="openSCRKDetail"
            ></tabs>
            <div style="width:100%;height:calc(100% - 30px);">
              <CL1 :oname="unitselectname"></CL1>
            </div>
          </div>
          <div style="height:33%;width:100%">
            <tabs :tabsList="[{id:0,text:'餐售情况'}]" style="height: 30px;font-weight:bold;"></tabs>
            <div style="width:100%;height:calc(100% - 30px)">
              <CL2 :oname="unitselectname"></CL2>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="main-box rightMainBG" v-show="rightViewBoxVisible">
          <div></div>
        </div>
        <div class="main-box right" style="padding-top:25px;" v-show="rightViewBoxVisible">
          <div class="right_topText">{{right_topText}}</div>
          <div style="height:33%;width:100%;">
            <tabs
              :tabsList="[{id:0,text:'调度命令'}]"
              style="height: 30px;font-weight:bold;"
              @titleClick="openKDML"
            ></tabs>
            <div style="width:100%;height:calc(100% - 30px)">
              <CR1
                :oname="unitselectname"
                @openOrderDetail="openOrderDetail"
                @openOrderView="openOrderView"
              ></CR1>
            </div>
          </div>
          <div style="height:33%;width:100%;">
            <tabs
              :tabsList="[{id:0,text:'车长信息'}]"
              style="height: 30px;font-weight:bold;"
              @titleClick="openCZINFO"
            ></tabs>
            <div style="width:100%;height:calc(100% - 30px)">
              <CR2 :oname="unitselectname" @setCZDataList="setCZDataList"></CR2>
            </div>
          </div>
          <div style="height:33%;width:100%;">
            <tabs :tabsList="[{id:0,text:'后勤情况'}]" style="height: 30px;font-weight:bold;"></tabs>
            <div style="width:100%;height:calc(100% - 30px)">
              <CL3 :oname="unitselectname"></CL3>
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
        :style="{'width':'1920px'}"
      >
        <div class="wing-view-head" style="text-align: right;">
          <div
            style="display: inline-block;float: left;margin-top: -12px;width: calc(100% - 100px);height: 40px;"
          >
            <el-tabs v-model="activeWingLeftTab" @tab-click="leftTitleClick">
              <el-tab-pane label="综控管理" name="1"></el-tab-pane>
              <el-tab-pane label="股道占用" name="2"></el-tab-pane>
            </el-tabs>
          </div>
          <a class="arrow-left" title="点击关闭" @click="openWingView('left','')"></a>
          <a
            v-show="wingView.left===''"
            class="arrow-right"
            title="点击展开"
            @click="openWingView('left','full')"
          ></a>
        </div>
        <div
          id="leftViewBody"
          class="wing-view-body"
          v-loading="leftViewLoadFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0,0,0,0.8)"
        >
          <div
            :style="{transform:'scale('+leftScale+')',width:leftWHScale,height:leftWHScale}"
            style="transform-origin:0 0"
          >
            <iframe :src="leftFrame" style="width: 100%;height:100%" frameborder="0"></iframe>
          </div>
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
        <div class="wing-view-body" id="zydbBox" style="padding-left: 10px;">
          <div style="height:33%;width:100%;">
            <div style="height:40px;width:100%">
              <DataPanel title="餐售统计" style="padding-top:0px;"></DataPanel>
            </div>
            <div style="height:calc(100% - 40px);width:100%">
              <KR1 :oname="unitselectname"></KR1>
            </div>
          </div>
          <div style="height:66%;width:100%;">
            <div style="height:40px;width:100%">
              <DataPanel title="保洁备品情况" style="padding-top:0px;"></DataPanel>
            </div>
            <div style="height:calc(100% - 40px);width:100%">
              <KR2 :oname="unitselectname"></KR2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="xiaoyu"
      top="20px"
      :title="title"
      width="1500px"
      :lock-scroll="true"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <div style="height: 800px">
        <xiaoyu :targetUrl="xiaoyuTargetUrl"></xiaoyu>
      </div>
      <!-- <div slot="footer" style="text-align: center;">
				<el-button size="" plain style="width: 120px;" @click="xiaoyu=false">关闭</el-button>
				<el-button size="" type="primary" style="width: 120px;" @click="xiaoyu=false">确定</el-button>
      </div>-->
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="taskVisible"
      title="指派任务"
      width="700px"
      :lock-scroll="true"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <div style="height: 500px">
        <Task :trainList="trainList" :selectedTrains="selectedTrainList"></Task>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="msgVisible"
      title="发送消息"
      width="700px"
      :lock-scroll="true"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <div style="height: 500px">
        <SendMsg :trainList="trainList" :selectedTrains="selectedTrainList"></SendMsg>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="iframeVisible"
      top="20px"
      :title="iframeTitle"
      :width="iframeWidth"
      :lock-scroll="true"
      :append-to-body="true"
      :destroy-on-close="true"
      :show-close="iframeCloseFlag"
      :custom-class="iframeClass"
    >
      <div style="position:relative" :style="{height:iframeHeight}">
        <iframe
          v-if="iframeType.includes('iframe')"
          :src="iframeUrl"
          width="100%"
          style="border: 0;"
          height="100%"
        ></iframe>
        <CZInfo v-if="iframeType=='czinfo'" :dataList="CZDataList" @phoneDo="phoneDo"></CZInfo>
        <FXPlan v-if="iframeType=='fxplan'" :dataList="FXDataList"></FXPlan>
        <div
          v-if="iframeBtnCFlag"
          style="text-align: center;position:absolute;top:5px;right:80px;"
          :style="{right:iframeType=='iframeMLQS'?'165px':'80px'}"
        >
          <el-button size="mini" type="danger" style="width: 60px;" @click="iframeVisible=false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <Dialog2
      ref="dialogc"
      :title="dialogTitle"
      :dialogW="dialogW"
      :dialogH="dialogH"
      :dialogX="dialogStartX"
      :dialogY="dialogStartY"
      :positionType="dialog2Position"
      :closeColor="dialogColseColor"
      :closeClass="dialog2CloseClass"
    >
      <iframe
        v-show="dialogcView.includes('iframe')"
        style="width:100%;height:100%;border:none;background:#fff;"
        :src="dialogIframeSrc"
      ></iframe>
    </Dialog2>
  </div>
</template>

<script>
import C from "../../../assets/com.js";
import util from "./utils/CommUtil.js";
import "./icons";

import Map from "../../../components/map/Index.vue";
import xiaoyu from "./xiaoyu.vue";
import Task from "./Task.vue";
import SendMsg from "./SendMsg.vue";

import home from "./service/home.js";
import home1 from "./service/home1.js";
import tabs from "./components/KydTabs.vue";
import MapTab from "./components/MapTab.vue";
import DataPanel from "./components/DataPanel1.vue";

import CL1 from "./CL1.vue";
import CL2 from "./CL2.vue";
import CL3 from "./CL3.vue";
import CR1 from "./CR1.vue";
import CR2 from "./CR2.vue";
import CR3 from "./CR3.vue";
import CR4 from "./CR4.vue";
import KR1 from "./KR1.vue";
import KR2 from "./KR2.vue";
import CZInfo from "./CZInfo.vue";
import FXPlan from "./fxPlan.vue";

import Dialog2 from "../../../components/data/Dialog2.vue";

// import Top from "@/views/map/kyz/Top";
//   http://10.192.6.155:9090/JFLCMS/vue/#/XYLink?unitFlag=1&UserName=%E6%B5%8B%E8%AF%95%E5%91%98&UserPID=10000000000000000X&StnCode=
let xyRUL = C.ADDS.url_34_79 + "/JFLCMS/vue/#/XYLink?unitFlag=1";
// let xyRUL = "https://10.194.72.31:8081/#/XYLink?unitFlag=1";
const zydbFrameHeader = "/JFLCMS/vue/#/zydb?viewType=v2&Oid=";
export default {
  components: {
    // Top,
    MapTab,
    xiaoyu,
    Task,
    SendMsg,
    Map,
    tabs,
    DataPanel,
    CL1,
    CL2,
    CL3,
    CR1,
    CR2,
    CR3,
    KR1,
    KR2,
    CR4,
    CZInfo,
    FXPlan,
    Dialog2
  },
  data() {
    return {
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
      leftFrame: "", //"http://10.192.6.155:9090/JFLCMS/vue/#/zydb?Oid=99990002001499A50004&StnCode=ICW&viewType=v2",
      leftScale: "1", //右侧扩展屏 缩放比例
      leftWHScale: "100%", //右侧扩展屏宽度

      leftViewLoadFlag: true, //右侧扩展loading
      tipVisible: false,

      queryCCName: "",
      topVisible: true,
      xiaoyu: false,
      title: "音视频对讲",
      // xiaoyuTargetUrl: 'http://10.192.6.155:9090/JFLCMS/vue/#/VideoCall?UserName=%E6%B5%8B%E8%AF%95%E5%91%98&UserEncode=ue123&UserPID=10000000000000000X&Oid=99990002001499A50004&Oname=%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E6%89%80&DepId=23012134BF4A1580E053BC04C00A22C4&DepName=%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E4%B8%80%E7%A7%91&StnCode=',
      xiaoyuTargetUrl: "",
      xiaoyuTargetUrlSelf: "", //直接开启视频
      xiaoyuTargetUrlPerson: "", //指定人发视频
      taskVisible: false, //指派任务窗口
      msgVisible: false, //发送消息窗口
      trainList: [], //所有车次
      selectedTrainList: [], //选择的车次
      isEdit: false,
      visible: true,
      listWidth: 0,
      listHeight: 0,
      unitselect: "",
      unitselectname: "",
      unitList: [],
      unitListLoad: [
        { TEXT: "成都客运段", ID: "", stnList: ["ICW"] },
        { TEXT: "重庆客运段", ID: "", stnList: ["CUW,CXW"] },
        { TEXT: "贵阳客运段", ID: "", stnList: ["KQW"] }
      ],
      unitStnList: [],
      unitFlag: false,
      iframeType: "iframe",
      iframeVisible: false,
      iframeTitle: "",
      iframeUrl: "",
      iframeWidth: "80%",
      iframeHeight: "800px",
      iframeBtnCFlag: false,
      iframeCloseFlag: true,
      iframeClass: "",
      CZDataList: [], //车长信息
      FXDataList: [], //风险计划
      right_topText: "", //右侧文字
      xtTime: "", //系统时间
      safeDays: "", //安全生产天数

      //dialog2数据
      dialogTitle: "", //自定义弹框名称
      dialogTitle2: "",
      dialogStartX: "0px", //自定义弹框起始位置
      dialogStartY: "0px", //自定义弹框起始位置
      dialogW: "40%", //自定义弹框宽度
      dialogH: "100%", //自定义弹框高度
      dialog2Position: "left",
      dialogcView: "iframe",
      dialogColseColor: "",
      dialogIframeSrc: "",
      dialog2CloseClass: "",
      leftViewBoxVisible: true,
      rightViewBoxVisible: true,
    };
  },
  computed: {
    leftWingUrl_zby() {
      return (
        C.ADDS.url_34_79 +
        "/JFLCMS/kylk/zby.html?StnCode=&UserType=1&pageType=V1&Oid=" +
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
    this.getDataS();
  },
  mounted() {
    this.bigScreen = window.innerWidth > 3000;
    document.querySelector("title").innerHTML = "客运段生产指挥中心"; //页面名称

    this.$nextTick(() => {
      this.setDefaults(); //计算页面默认设置
    });
    // let listEl = document.getElementById('list')
    // this.listWidth = listEl.clientWidth
    // this.listHeight = listEl.clientHeight

    // window.addEventListener('resize', () => {
    //     this.listWidth = listEl.clientWidth
    //     this.listHeight = listEl.clientHeight
    // })

    let p = this.$store.state.params;
    if (p.topHidden) {
      this.topVisible = false;
    }
    xyRUL = xyRUL + "&UserName=" + p.UserName + "&UserPID=" + p.UserPID;
    //#####
    this.initOname(rs => {
      if (!rs) {
        document.querySelector("body").innerHTML = "非法访问";
      }
      if (this.bigScreen) {
        this.leftViewVisible("full");
      }
    });
  },

  methods: {
    // 自定选项卡选择事件
    mapTabSelect(item) {
      console.log(item);
    },
    //获取数据
    getDataS() {
      this.getServiceTime(); //取系统时间
    },
    setDefaults() {
      this.setLeftIframeSize();
    },
    //设置左侧扩展屏缩放比例
    setLeftIframeSize() {
      //计算左侧侧扩展屏缩放比例
      var defaultWidth = 1920;
      if (this.activeWingLeftTab == "2") {
        defaultWidth = 1500;
      }
      var width = document.getElementById("leftViewBody").offsetWidth;
      var height = document.getElementById("leftViewBody").offsetHeight;
      var temp = defaultWidth / width;
      this.leftWHScale = temp * 100 + "%";
      this.leftScale = 1 / temp;
    },
    // 切换扩展屏状态
    openExtendView(key, cls) {
      this.extendView[key] = cls;
    },
    // 切换翅膀屏状态
    openWingView(key, cls) {
      this.wingView[key] = cls;
      if (key == "left") {
        this.leftViewVisible(cls); //左侧侧展开关闭切换
      }
    },
    leftViewVisible(cls) {
      this.leftViewLoadFlag = true;
      if (cls == "full") {
        //左侧展开
        this.leftFrame = "";
        setTimeout(() => {
          var unitid = this.unitselect.toUpperCase();
          if (this.unitselectname == "成都客运段") {
            unitid = "19B8C3534E125665E0539106C00A58FD";
          } else if (this.unitselectname == "重庆客运段") {
            unitid = "19B8C3534E1E5665E0539106C00A58FD";
          } else if (this.unitselectname == "贵阳客运段") {
            unitid = "19B8C3534E205665E0539106C00A58FD";
          }
          unitid = "99990002001499A50004";
          this.unitStnList = ["ICW", "KQW"];
          if (this.activeWingLeftTab == "1") {
            this.leftFrame =
              C.ADDS.url_34_79 +
              zydbFrameHeader +
              unitid +
              "&trackAutoFlag=" +
              (this.bigScreen ? "0" : "1") +
              "&pageType=" +
              (this.bigScreen ? "v1" : "v2") +
              "&KYDFilter=" +
              this.unitselectname +
              "&stnList=" +
              this.unitStnList.join(",");
          } else if (this.activeWingLeftTab == "2") {
            this.leftFrame =
              C.ADDS.url_34_79 +
              "/JFLCMS/lc/trackZYT.html?StnCode=&isMinFlag=1&pageType=v1&Oid=" +
              unitid +
              "&KYDFilter=" +
              this.unitselectname;
          }
          this.$nextTick(() => {
            setTimeout(() => {
              this.leftViewLoadFlag = false;
            }, 1500);
          });
        }, 100);
      } else {
        //右侧关闭
        this.leftFrame = "";
      }
    },
    leftTitleClick(tab) {
      this.$nextTick(() => {
        this.setLeftIframeSize();
        this.leftViewVisible("full");
      });
    },
    handleQueryCCLocation(CCName) {
      console.log(CCName);
      this.queryCCName = CCName;
    },
    activateEv(index) {
      if (this.isEdit) {
        this.$store.dispatch("rect/setActive", {
          id: index
        });
      } else {
        this.$store.dispatch("rect/unsetActive", {
          id: index
        });
      }
    },

    deactivateEv(index) {
      this.$store.dispatch("rect/unsetActive", {
        id: index
      });
    },

    changePosition(newRect, index) {
      this.$store.dispatch("rect/setTop", {
        id: index,
        top: newRect.top
      });
      this.$store.dispatch("rect/setLeft", {
        id: index,
        left: newRect.left
      });
      this.$store.dispatch("rect/setWidth", {
        id: index,
        width: newRect.width
      });
      this.$store.dispatch("rect/setHeight", {
        id: index,
        height: newRect.height
      });
    },

    changeSize(newRect, index) {
      this.$store.dispatch("rect/setTop", {
        id: index,
        top: newRect.top
      });
      this.$store.dispatch("rect/setLeft", {
        id: index,
        left: newRect.left
      });
      this.$store.dispatch("rect/setWidth", {
        id: index,
        width: newRect.width
      });
      this.$store.dispatch("rect/setHeight", {
        id: index,
        height: newRect.height
      });
    },
    checkComponent(name) {
      this.com = name;
    },
    toggleEdit(flag) {
      //关闭|打开缩放、拖动
      this.isEdit = flag;
      this.$store.dispatch("rect/toggleAllEdit", {
        flag: flag
      });
    },
    toggleVisible(flag) {
      this.visible = flag;
      this.$store.dispatch("rect/toggleVisible", {
        flag: flag
      });
    },
    openXiaoYu(url) {
      if (url) {
        // this.xiaoyuTargetUrl = this.xiaoyuTargetUrlPerson;
        this.xiaoyuTargetUrl = url;
      } else {
        this.xiaoyuTargetUrl = this.xiaoyuTargetUrlSelf;
      }
      this.xiaoyu = true;
    },
    openTask(selectedTrainList, trainList) {
      this.selectedTrainList = selectedTrainList;
      this.trainList = trainList;
      this.taskVisible = true;
    },
    openMsg(selectedTrainList, trainList) {
      this.selectedTrainList = selectedTrainList;
      this.trainList = trainList;
      this.msgVisible = true;
    },
    openKDML() {
      // this.iframeVisible = true;
      // this.iframeTitle = ""
      // this.iframeUrl = C.ADDS.url_34_79 + "/PTMSAdmin/Views/ddml/search.html?Oid=" + this.unitselect;
      // this.iframeWidth = "1200px";
      // this.iframeHeight = "800px";
      // this.iframeCloseFlag = false;
      // this.iframeClass = "KDMLIFrame";
      // this.iframeBtnCFlag = true;
      // this.iframeType = "iframe";
    },
    openCZINFO() {
      this.iframeVisible = true;
      this.iframeTitle = "车长信息";
      this.iframeWidth = "1220px";
      this.iframeHeight = "700px";
      this.iframeCloseFlag = true;
      this.iframeClass = "blue-dialog";
      this.iframeBtnCFlag = false;
      this.iframeType = "czinfo";
    },
    openFXINFO() {
      this.iframeVisible = true;
      this.iframeTitle = "风险预警";
      this.iframeWidth = "1220px";
      this.iframeHeight = "700px";
      this.iframeCloseFlag = true;
      this.iframeClass = "blue-dialog";
      this.iframeBtnCFlag = false;
      this.iframeType = "fxplan";
    },
    openSCRKDetail() {
      var src = "";
      var title = "",
        title1 = "",
        timeout = 600;
      var itemBox = document.getElementById("main-box-left");
      var dialogHeight = itemBox.offsetHeight;
      this.dialogcView = "iframe_dci";
      this.dialogColseColor = "#0e90d2";
      src =
        "https://10.192.126.27/kydp/index.html#/dataComparison?UserEncode=" +
        this.webParam.UserEncode +
        "&UserName=" +
        this.webParam.UserName +
        "&UserPID=" +
        this.webParam.UserPID +
        "&Oid=" +
        this.unitselect.toUpperCase() +
        "&Oname=" +
        this.unitselectname;
      this.dialog2Position = "left";
      this.dialog2CloseClass = "dciClose";
      this.openDialogC(
        0,
        0,
        document.body.offsetHeight,
        1920,
        src,
        title,
        timeout,
        title1
      );
    },
    initOname(callback) {
      let t = this,
        oid = this.$store.state.params.Oid;
      var falg = false;
      home.getSelectOname({}).then(r => {
        t.unitList = r["1"];
        this.unitListLoad.forEach(v => {
          t.unitList.forEach(m => {
            if (v.TEXT == m.TEXT) {
              v.ID = m.ID;
            }
          });
        });
        t.unitselect = t.unitListLoad[0].ID;
        t.unitselectname = t.unitListLoad[0].TEXT;
        var defaultRow = null;
        t.unitListLoad.forEach(v => {
          if (v.ID == oid) {
            defaultRow = v;
          }
        });
        if (defaultRow) {
          t.unitselect = defaultRow.ID;
          t.unitselectname = defaultRow.TEXT;
          falg = true;
          this.unitFlag = true;
          if (
            [
              "19B8C3534E545665E0539106C00A58FD",
              "99990002001499A50004"
            ].includes(oid)
          ) {
            this.unitFlag = false;
          }
        } else {
          //客运部和信息技术所
          if (
            [
              "19B8C3534E545665E0539106C00A58FD",
              "99990002001499A50004"
            ].includes(oid)
          ) {
            falg = true;
            this.unitFlag = false;
            if (t.unitListLoad[0]) {
              t.unitselect = t.unitListLoad[0].ID;
              t.unitselectname = t.unitListLoad[0].TEXT;
            }
          } else {
            falg = false;
          }
        }
        callback(falg);
      });
      // home.getSelectOname(oid,(r)=>{
      // 	if(r){
      // 		t.unitList = r.filter(data=> data.GT_FLAG == '0')
      // 		t.unitselect = t.unitList[0].ID
      // 	}else{
      // 		t.$notify.error({
      // 			title:'提示',
      // 			message:'获取字典数据异常'
      // 		})
      // 	}
      // })
    },
    goRwjk() {
      window.top.location.href =
        location.origin +
        location.pathname +
        "#/zt?" +
        location.hash.split("?")[1];
    },
    setCZDataList(list) {
      var jrList = [],
        zrList = [];
      if (list[0]) {
        jrList = this.initCZXXGroup(list[0]);
      }
      if (list[1]) {
        zrList = this.initCZXXGroup(list[1]);
      }
      // this.CZDataList = list;
      console.log("车长信息=============", [jrList, zrList]);
      this.CZDataList = [jrList, zrList];
    },
    initCZXXGroup(dataList) {
      var rs = [];
      var tempList = [];
      dataList.forEach(v => {
        var flag = true;
        tempList.forEach(m => {
          if (m[0] && v.CC == m[0].CC) {
            m.push(v);
            flag = false;
          }
        });
        if (flag) {
          tempList.push([v]);
        }
      });
      tempList.forEach(v => {
        var item = JSON.parse(JSON.stringify(v[0]));
        item.STEWARD_NAME1 = "";
        item.PHONE1 = "";
        item.STEWARD_NAME2 = "";
        item.PHONE2 = "";
        var nameList = [item.STEWARD_NAME];
        var phoneList = [item.PHONE];
        if (
          v[1] &&
          !nameList.includes(v[1].STEWARD_NAME) &&
          !phoneList.includes(v[1].PHONE)
        ) {
          item.STEWARD_NAME1 = v[1].STEWARD_NAME;
          item.PHONE1 = v[1].PHONE;
          nameList.push(v[1].STEWARD_NAME);
          phoneList.push(v[1].PHONE);
        }
        if (
          v[2] &&
          !nameList.includes(v[1].STEWARD_NAME) &&
          !phoneList.includes(v[1].PHONE)
        ) {
          item.STEWARD_NAME2 = v[1].STEWARD_NAME;
          item.PHONE2 = v[1].PHONE;
        }
        rs.push(item);
      });
      return rs;
    },
    setFXDataList(list) {
      this.FXDataList = list;
    },
    setRightTopText() {
      var xxsj = new Date(this.xtTime);
      xxsj.setSeconds(xxsj.getSeconds() + 1);
      var nextXTSJ = new Date(xxsj);
      this.xtTime = nextXTSJ.Format("yyyy-MM-dd hh:mm:ss");
      var rs = this.xtTime;
      var weekText = "日一二三四五六";
      rs += " 周" + weekText.charAt(nextXTSJ.getDay());
      this.right_topText = rs;
    },
    //获取系统时间
    getServiceTime() {
      C.getData(
        {
          c: "trdm_xyy_027",
          url: "https://10.192.34.79/TRDM/GeneralProServlet",
          async: true
        },
        rs => {
          this.xtTime = rs;
          this.$nextTick(() => {
            this.setRightTopText();
            var sint = setInterval(() => {
              this.setRightTopText();
              if (
                this.xtTime.split(":")[1] == "00" &&
                this.xtTime.split(":")[2] == "00"
              ) {
                clearInterval(sint);
                this.getServiceTime();
              }
            }, 1000);
          });
        }
      );
    },
    //获取安全生产天数
    getSafeDays() {
      home1
        .getHOME1({
          s: [[this.unitselectname]]
          // url:"https://10.192.126.203/admin/dlmo/safeDay"
        })
        .then(r => {
          if (r[1].length > 0) {
            this.safeDays = r[1][0].AQTS;
          }
          console.log("安全生产天数", this.unitselectname, r);
        });
    },
    openDialogC(dgx, dgy, dgh, dgw, src, title, timeout, title1) {
      this.dialogStartX = dgx + "px";
      this.dialogStartY = dgy + "px";
      this.dialogH = dgh + "px";
      this.dialogW = dgw + "px";
      this.dialogTitle = title;
      this.dialogTitle2 = "";
      if (title1) {
        this.dialogTitle2 = title1;
      }
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
    phoneDo(num) {
      this.$refs.myMap.voiceCall({ E_Phone: num }, "phone");
      // this.$refs.myMap.voiceCall({E_Phone:"18113182147"},"phone")
    },
    openOrderDetail(orderNum) {
      this.iframeVisible = true;
      this.iframeTitle = "";
      this.iframeUrl =
        C.ADDS.url_34_79 +
        "/PTMSAdmin/Views/ddml/search.html?Oid=" +
        this.unitselect +
        "&orderNum=" +
        orderNum;
      this.iframeWidth = "1200px";
      this.iframeHeight = "800px";
      this.iframeCloseFlag = false;
      this.iframeClass = "KDMLIFrame";
      this.iframeBtnCFlag = true;
      this.iframeType = "iframe";
    },
    openOrderView(type) {
      this.iframeVisible = true;
      this.iframeTitle = "";
      this.iframeWidth = "1220px";
      this.iframeHeight = "800px";
      this.iframeCloseFlag = false;
      this.iframeClass = "KDMLIFrame";
      this.iframeBtnCFlag = true;
      if (type == "JS") {
        this.iframeType = "iframeSearch";
        this.iframeUrl =
          C.ADDS.url_34_79 +
          "/PTMSAdmin/Views/ddml/search2.html?Oid=" +
          this.webParam.Oid +
          "&Oname=" +
          this.webParam.Oname +
          "&UserName=" +
          this.webParam.UserName +
          "&UserPID=" +
          this.webParam.UserPID +
          "&DepId=" +
          this.webParam.DepId +
          "&DepName=" +
          this.webParam.DepName;
      } else if ((type = "CL")) {
        this.iframeType = "iframeMLQS";
        this.iframeUrl =
          C.ADDS.url_34_79 +
          "/PTMSAdmin/Views/ddml/mlqs.html?Oid=" +
          this.webParam.Oid +
          "&Oname=" +
          this.webParam.Oname +
          "&UserName=" +
          this.webParam.UserName +
          "&UserPID=" +
          this.webParam.UserPID +
          "&DepId=" +
          this.webParam.DepId +
          "&DepName=" +
          this.webParam.DepName;
      }
    }
  },
  watch: {
    unitselect(val) {
      var oname = "",
        stnList;
      this.unitListLoad.forEach(v => {
        if (v.ID == val) {
          oname = v.TEXT;
          stnList = v.stnList;
        }
      });
      this.unitselectname = oname;
      this.unitStnList = stnList;
      this.xiaoyuTargetUrl = "";
      // this.xiaoyuTargetUrl=xyRUL+"&Oname="+oname+"&Oid="+val;
      setTimeout(() => {
        this.xiaoyuTargetUrl = xyRUL + "&Oname=" + oname + "&Oid=" + val;
        this.xiaoyuTargetUrlSelf = xyRUL + "&Oname=" + oname + "&Oid=" + val;
        this.xiaoyuTargetUrlPerson =
          xyRUL + "&Oname=" + oname + "&Oid=" + val + "&vedio=1";
      }, 10);
      this.$nextTick(() => {
        if (this.wingView["right"] == "full") {
          this.leftViewVisible("full"); //右侧展开关闭切换
        }
        this.getSafeDays(); //获取安全生产天数
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
  /* padding-bottom: 60px; */
  /* background: #01081b url(img/picBottomBg.png) no-repeat;
    background-size: 100% 142px;
    background-position: bottom; */
  background: #01081b;
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
  /* top: 5px; */
  left: 10px;
}
.top-menu-right {
  right: 10px;
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
  top: 90px;
  left: 10px;
  bottom: 5px;
  width: 425px;
  padding: 0px;
  /* background: url(./img/picBoxRadius.png) no-repeat; */
  /* background-size: 120% 100%;
    background-position: -55px 0; */
  /* background: url("./img1/home1box.png") no-repeat;
    background-size: 100% 100%; */
  transition: all 0.3s;
  padding-bottom: 10px;
}
.main-box.leftMainBG {
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 435px;
  background: url("./img1/home1boxW.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 90px;
  padding-bottom: 20px;
  padding-left: 10px;
}
.main-box.leftMainBG > div {
  height: 100%;
  width: 100%;
  background: url("./img1/home1box.png") no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 0 100px #00000066;
}
/* .main-box.left::after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    background: url(./img/picBoxToRight.png) no-repeat;
    background-size: 100% 100%;
    z-index: -1;
} */

/* 中间右侧 */
.main-box.right {
  top: 90px;
  right: 10px;
  bottom: 5px;
  width: 425px;
  padding: 0px;
  /* background: url(./img/picBoxRadius.png) no-repeat;
    background-size: 120% 100%;
    background-position: -22px 0; */
  transition: all 0.3s;
  padding-bottom: 10px;
}
.main-box.rightMainBG {
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 435px;
  background: url("./img1/home1boxW.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 90px;
  padding-bottom: 20px;
  padding-left: 10px;
  transform: rotateY(180deg);
}
.main-box.rightMainBG > div {
  height: 100%;
  width: 100%;
  background: url("./img1/home1box.png") no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 0 100px #00000066;
}

/* .main-box.right::after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    background: url(./img/picBoxToLeft.png) no-repeat;
    background-size: 100% 100%;
    z-index: -1;
} */

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
  width: 25% !important;
  padding-top: 0px;
  border-radius: 20px;
  border: 0px solid #122d56;
  background: rgba(5, 11, 47, 0.1);
  z-index: 490;
  height: calc(100% - 40px);
}
.lay.big .wing-view-head {
  top: -35px;
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
.wing-view-head > a.arrow-left,
.leftBoxBtn> a.arrow-left,
.rightBoxBtn> a.arrow-left {
  display: inline-block;
  height: 20px;
  width: 22px;
  background: url("../../../assets/imgs/bigScreen/arrow-left.png") no-repeat;
  background-position: 0 2px;
}

.extend-view-head > a.arrow-right,
.wing-view-head > a.arrow-right,
.leftBoxBtn> a.arrow-right,
.rightBoxBtn> a.arrow-right {
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
  left: -1920px;
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
.viewBody {
  width: 100%;
  height: 100%;
  background: rgba(5, 11, 47, 0.9);
  border: 1px solid #122d56;
  border-radius: 20px;
}
>>> .KDMLIFrame .el-dialog__header {
  padding: 0 !important;
}
.left_topText {
  height: 50px;
  width: 100%;
  position: absolute;
  left: 0;
  top: -50px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #409eff;

  padding: 10px;
}
.left_topText > span {
  font-size: 22px;
  /* color: #fde4a0; */
  color: #39e441;
  margin-right: 5px;
  font-weight: bold;
}
.left_topText_NUM {
  background: url("./img1/home1_1.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 27px;
  color: #81cfff;
  width: 24px;
  height: 36px;
  margin-left: 5px;
  font-weight: bold;
}
.right_topText {
  justify-content: flex-end;
  font-family: "quartzRegular";
  height: 50px;
  width: 100%;
  position: absolute;
  left: 0;
  top: -50px;
  display: flex;
  align-items: center;
  font-size: 28px;
  /* color: #e98167; */
  color: #81cfff;
  padding: 10px;
  font-weight: bold;
}
@font-face {
  font-family: "quartzRegular";
  src: url("./font/Quartz Regular.ttf") format("truetype");
}
.shadow-txt1 {
  color: #d0c5e3;
  text-shadow: 0 0 10px #4fd64246, 0 0 20px #fff;
}
.top-menu >>> .el-switch__label.is-active {
  color: #b1ebba;
}
.top-menu >>> .el-switch__label {
  color: #777;
}
.leftBoxBtn{
    position:absolute;
    z-index: 531;
    top:100px;
    left:440px;
    cursor: pointer;
}
.leftBoxBtnClose{
    left:-12px;
}
.leftBoxBtnClose:hover{
    left:0px;
}
.leftBoxBtnCloseBig{
    left:0px;
}
.rightBoxBtn{
    position:absolute;
    z-index: 531;
    top:100px;
    right:440px;
    cursor: pointer;
}
.rightBoxBtnClose{
    right:-12px;
}
.rightBoxBtnClose:hover{
    right:0px;
}
.rightBoxBtnCloseBig{
    right:0px;
}
</style>
<style>
/* 发光字体 */
.shadow-txt {
  color: #d0c5e3;
  text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
}
</style>

