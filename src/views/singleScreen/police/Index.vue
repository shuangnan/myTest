<template>
  <div class="lay-con">
    <div class="lay" :class="{'big':bigScreen}">
      <div class="log">
        <div class="main-box top-menu"></div>
        <!-- 切换黑白地图 -->

        <div class="main-box top-menu-right">
          <div style="display: inline-block;">
            <el-menu :default-active="activeMenuIndex" mode="horizontal" @select="handleSelectMenu" background-color="#0f50b1" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="1">首页</el-menu-item>
              <el-menu-item index="2">警情分析</el-menu-item>
              <el-menu-item index="3">隐患分析</el-menu-item>
              <el-menu-item index="4">绩效分析</el-menu-item>
              <el-menu-item index="5">视频巡查</el-menu-item>
              <!-- <el-menu-item disabled></el-menu-item>
              <el-menu-item disabled style="margin-left:10px"></el-menu-item>-->
            </el-menu>
          </div>
          <div class="right-icon" style="margin-left:10px">
            <div style="display:inline-block;">
              <i class="stuff-icon"></i>
              <span>信息所（张三）</span>
            </div>
            <el-switch style="display: inline-block;margin-left: 10px;" active-icon-class="el-icon-sunny" inactive-icon-class="el-icon-moon" v-model="lightOverride" @change="changeMapTheme"></el-switch>
            <el-switch style="display: inline-block;margin-left: 10px;" active-text="卫星" inactive-text="off" v-model="satelliteOverride" @change="changeMapTheme">卫星地图</el-switch>
          </div>
          <!-- <el-switch style="display:inline-block;margin-top:10px;" v-model="LRShowFlag"></el-switch> -->
          <!-- <div style="margin-left:10px;display:inline-block">
            <el-switch
              style="display:inline-block;"
              active-icon-class="el-icon-sunny"
              inactive-icon-class="el-icon-moon"
              v-model="lightOverride"
              @change="changeMapTheme"
            ></el-switch>
          </div>-->
        </div>
      </div>
      <!-- 中间主体内容 -->
      <div class="center-con">
        <div class="map-con2">
          <Map ref="myMap" :style="lightOverride?'background:#FFFFFF;':'background:#272f46;'" sys="police" :oid="unitselect" :oname="unitselectname" :lightSkin="lightOverride" :toolsConfig="{left:'5px',bottom:'50px',height:'750px',lateRight:'440px'}"></Map>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="iframeVisible" top="20px" :title="iframeTitle" :width="iframeWidth" :lock-scroll="true" :append-to-body="true" :destroy-on-close="true" :show-close="iframeCloseFlag" :custom-class="iframeClass">
      <div style="position:relative" :style="{height:iframeHeight}">
        <iframe v-if="iframeType=='iframe'" :src="iframeUrl" width="100%" style="border: 0;" height="100%"></iframe>
        <FXPlan v-if="iframeType=='fxplan'" :dataList="FXDataList"></FXPlan>
        <CZInfo v-if="iframeType=='czinfo'" :dataList="CZDataList"></CZInfo>
        <TrainView v-if="iframeType=='trainView'" :dataList="trainDataList"></TrainView>
        <div v-if="iframeBtnCFlag" style="text-align: center;position:absolute;top:5px;right:80px;">
          <el-button size="mini" type="danger" style="width: 60px;" @click="iframeVisible=false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Map from "../../../components/map/Index.vue"; //地图
import tabs from "../../../components/bigScreen/KydTabs.vue";
import C from "../../../assets/com.js";
import home1 from "../kyd/service/home1.js";
import home from "../kyd/service/home.js";
import CL1 from "../kyd/CR4.vue";
import CR1 from "./CR1.vue";
import CR2 from "./CR2.vue";
import CR3 from "./CR3.vue";
import FXPlan from "../kyd/fxPlan.vue";
import TrainView from "./TrainView.vue";
import CZInfo from "../kyd/CZInfo.vue";
import mapUtil from "../../../components/map/js/mapUtil";
const zydbFrameHeader = "/JFLCMS/vue/#/zydb?viewType=v2&trackAutoFlag=0&Oid=";
export default {
  components: {
    Map,
    tabs,
    CL1,
    FXPlan,
    CR1,
    CR2,
    CR3,
    CZInfo,
    TrainView
  },
  data() {
    return {
      bigScreen: false, //是否为超宽屏
      // 翅膀屏
      wingView: {
        left: "",
        right: ""
      },
      unitselect: null,
      unitselectname: "",
      unitList: [],
      unitListLoad: [
        {
          TEXT: "成都客运段",
          ID: "",
          stnList: ["ICW"]
        },
        {
          TEXT: "重庆客运段",
          ID: "",
          stnList: ["CUW,CXW"]
        },
        {
          TEXT: "贵阳客运段",
          ID: "",
          stnList: ["KQW"]
        }
      ],
      unitFlag: false,
      FXDataList: [], //风险计划
      trainDataList: [], //动普车数据
      leftFrame: "", //"http://10.192.6.155:9090/JFLCMS/vue/#/zydb?Oid=99990002001499A50004&StnCode=ICW&viewType=v2",
      leftScale: "1", //右侧扩展屏 缩放比例
      leftWHScale: "100%", //右侧扩展屏宽度
      leftViewLoadFlag: true, //右侧扩展loading

      rightFrame: "", //"http://10.192.6.155:9090/JFLCMS/vue/#/zydb?Oid=99990002001499A50004&StnCode=ICW&viewType=v2",
      rightScale: "1", //右侧扩展屏 缩放比例
      rightWHScale: "100%", //右侧扩展屏宽度
      rightViewLoadFlag: true, //右侧扩展loading

      xtTime: "", //系统时间
      safeDays: "", //安全生产天数
      right_topText: "",
      iframeType: "iframe",
      iframeVisible: false,
      iframeTitle: "",
      iframeUrl: "",
      iframeWidth: "80%",
      iframeHeight: "800px",
      iframeBtnCFlag: false,
      iframeCloseFlag: true,
      iframeClass: "",
      LRShowFlag: false, //是否显示左右两侧屏幕
      hasLRView: false, //是否显示左右翅膀
      lightOverride: true,
      satelliteOverride: false, // 卫星地图

      activeMenuIndex: "1"
    };
  },
  computed: {},
  created() {
    this.bigScreen = window.innerWidth > 3000;
    document.querySelector("title").innerHTML = "警用地理信息系统"; //页面名称
    let p = this.$store.state.params;
    if (p.topHidden) {
      this.topVisible = false;
    }
    //#####
    // this.initOname(rs => {
    //   if (!rs) {
    //     document.querySelector("body").innerHTML = "非法访问";
    //   }
    //   if (this.bigScreen) {
    //     this.leftViewVisible("full");
    //     this.rightViewVisible("full");
    //   }
    // });
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaults(); //计算页面默认设置
    });
    this.getDataS();
  },
  methods: {
    // 切换翅膀屏状态
    openWingView(key, cls) {
      this.wingView[key] = cls;
      if (key == "left") {
        this.leftViewVisible(cls); //左侧侧展开关闭切换
      } else if (key == "right") {
        this.rightViewVisible(cls); //左侧侧展开关闭切换
      }
    },
    //获取数据
    getDataS() {
      this.getServiceTime(); //取系统时间
    },
    setDefaults() {
      if (this.hasLRView) {
        this.setLeftIframeSize();
        this.setRightIframeSize();
      }
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
    },
    //设置左侧扩展屏缩放比例
    setLeftIframeSize() {
      //计算左侧侧扩展屏缩放比例
      var defaultWidth = 1920;
      var width = document.getElementById("leftViewBody").offsetWidth;
      var height = document.getElementById("leftViewBody").offsetHeight;
      var temp = defaultWidth / width;
      this.leftWHScale = temp * 100 + "%";
      this.leftScale = 1 / temp;
    },
    setRightIframeSize() {
      //计算右侧侧扩展屏缩放比例
      var defaultWidth = 1500;
      var width = document.getElementById("leftViewBody").offsetWidth;
      var height = document.getElementById("leftViewBody").offsetHeight;
      var temp = defaultWidth / width;
      this.rightWHScale = temp * 100 + "%";
      this.rightScale = 1 / temp;
    },
    leftViewVisible(cls) {
      this.leftViewLoadFlag = true;
      if (cls == "full") {
        //左侧展开
        this.leftFrame = "";
        setTimeout(() => {
          var unitid = this.unitselect.toUpperCase();
          // if (this.unitselectname == "成都客运段") {
          //     unitid = "19B8C3534E125665E0539106C00A58FD"
          // } else if (this.unitselectname == "重庆客运段") {
          //     unitid = "19B8C3534E1E5665E0539106C00A58FD"
          // } else if (this.unitselectname == "贵阳客运段") {
          //     unitid = "19B8C3534E205665E0539106C00A58FD"
          // }
          //
          unitid = "19B8C3534E545665E0539106C00A58FD";
          this.unitStnList = ["ICW", "KQW", "CUW", "CXW"];
          this.leftFrame =
            C.ADDS.url_34_79 +
            zydbFrameHeader +
            unitid +
            "&pageType=v1&KYDFilter=" +
            this.unitselectname +
            "&stnList=" +
            this.unitStnList.join(",");
          this.$nextTick(() => {
            setTimeout(() => {
              this.leftViewLoadFlag = false;
            }, 2500);
          });
        }, 100);
      } else {
        //右侧关闭
        this.leftFrame = "";
      }
    },
    rightViewVisible(cls) {
      this.rightViewLoadFlag = true;
      if (cls == "full") {
        //左侧展开
        this.rightFrame = "";
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
          this.rightFrame =
            C.ADDS.url_34_79 +
            "/JFLCMS/lc/trackZYT.html?StnCode=&isMinFlag=1&pageType=v1&Oid=" +
            unitid +
            "&KYDFilter=" +
            this.unitselectname;
          this.$nextTick(() => {
            setTimeout(() => {
              this.rightViewLoadFlag = false;
            }, 1500);
          });
        }, 100);
      } else {
        //右侧关闭
        this.rightFrame = "";
      }
    },
    setFXDataList(list) {
      this.FXDataList = list;
    },
    //获取系统时间
    getServiceTime() {
      C.getData(
        {
          c: "trdm_xyy_027@kyz_0001",
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
    openKDML() {
      this.iframeVisible = true;
      this.iframeTitle = "";
      this.iframeUrl =
        C.ADDS.url_34_79 +
        "/PTMSAdmin/Views/ddml/search.html?Oid=" +
        this.unitselect;
      this.iframeWidth = "1220px";
      this.iframeHeight = "800px";
      this.iframeCloseFlag = false;
      this.iframeClass = "KDMLIFrame";
      this.iframeBtnCFlag = true;
      this.iframeType = "iframe";
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
    setCZDataList(list) {
      this.CZDataList = list;
    },
    setTrainDataList(list) {
      console.log("1111111111", list);
      this.trainDataList = list;
      this.iframeVisible = true;
      this.iframeTitle = "车次信息";
      this.iframeWidth = "1220px";
      this.iframeHeight = "700px";
      this.iframeCloseFlag = true;
      this.iframeClass = "blue-dialog";
      this.iframeBtnCFlag = false;
      this.iframeType = "trainView";
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

    changeMapTheme() {
      console.log("切换主题,是白版吗", this.lightOverride);
      console.log("切换主题，是卫星吗", this.satelliteOverride)
      mapUtil.changePoliceLayer(this.lightOverride, this.satelliteOverride);
    },

    // 切换菜单栏
    handleSelectMenu(key, keyPath) {
      console.log("key, keyPath", key, keyPath);
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
      this.$nextTick(() => {
        if (this.wingView["left"] == "full") {
          this.leftViewVisible("full"); //右侧展开关闭切换
        }
        if (this.wingView["right"] == "full") {
          this.rightViewVisible("full");
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
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  background: url(img/LOGO.png) no-repeat;
  background-position: 15px;
  background-color: #0f50b1;

  z-index: 520;
}

/* .lay.big > .log {
  background: url(img/log.png) no-repeat;
  background-position: center;
} */

/* 中间 地图容器 其它元素的层级必须大于400*/
.center-con {
  position: relative;
  width: 100%;
  height: 100%;
}

.center-con.hidden {
  display: none;
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

/* 中间左侧 */
.main-box.left {
  top: 90px;
  left: 10px;
  bottom: 5px;
  width: 425px;
  padding: 0px;
  transition: all 0.3s;
  padding-bottom: 10px;
  z-index: 530;
}

.main-box.leftMainBG {
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 435px;
  background: url("../kyd/img1/home1boxW.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 90px;
  padding-bottom: 20px;
  padding-left: 10px;
}

.main-box.leftMainBG > div {
  height: 100%;
  width: 100%;
  background: url("../kyd/img1/home1box.png") no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 0 100px #00000066;
}

/* 中间右侧 */
.main-box.right {
  top: 90px;
  right: 10px;
  bottom: 5px;
  width: 425px;
  padding: 0px;
  transition: all 0.3s;
  padding-bottom: 10px;
}

.main-box.rightMainBG {
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 435px;
  background: url("../kyd/img1/home1boxW.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 90px;
  padding-bottom: 20px;
  padding-left: 10px;
  transform: rotateY(180deg);
}

.main-box.rightMainBG > div {
  height: 100%;
  width: 100%;
  background: url("../kyd/img1/home1box.png") no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 0 100px #00000066;
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
  top: 50px;
  width: 25%;
  padding-top: 0px;
  border-radius: 20px;
  border: 0px solid #122d56;
  background: rgba(5, 11, 47, 0.1);
  z-index: 490;
  height: calc(100% - 50px);
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

.right_topText {
  justify-content: flex-end;
  font-family: "quartzRegular";
  height: 50px;
  position: absolute;
  right: 0;
  top: 40px;
  display: flex;
  align-items: center;
  font-size: 28px;
  /* color: #e98167; */
  color: #81cfff;
  padding: 10px;
  font-weight: bold;
  z-index: 500;
}

@font-face {
  font-family: "quartzRegular";
  src: url("../kyd/font/Quartz Regular.ttf") format("truetype");
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
  background: url("../kyd/img1/home1_1.png") no-repeat;
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

>>> .KDMLIFrame .el-dialog__header {
  padding: 0 !important;
}

.top-menu-right {
  right: 10px;
  display: flex;
  vertical-align: middle;
}
</style>
<style>
.no-padding-popper {
  padding: 0;
  border-color: rgba(67, 90, 121, 0.9);
}

/* 发光字体 */
.shadow-txt {
  color: #d0c5e3;
  text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
}

.stuff-icon {
  display: inline-block;
  width: 14px !important;
  height: 14px !important;
  vertical-align: middle;
  margin: 0 5px 0 8px;
  background: url("./img/stuff.png") no-repeat;
  background-size: 100% 100%;
}

.el-menu-item.is-active {
  border-bottom: none !important;
  font-size: 16px !important;
  font-weight: bold;
}

.el-menu--horizontal > .el-menu-item {
  border-bottom: none;
}
.el-menu-item {
  padding: 0px 10px;
  font-size: 15px;
}

.right-icon {
  display: flex;
  align-items: center;
}

.el-switch__label * {
  line-height: 1;
  font-size: 14px;
  display: inline-block;
}
.el-switch__label {
  position: absolute;
  display: none;
  color: #fff !important;
  font-size: 14px !important;
}
/*打开时文字位置设置*/
.el-switch__label--right {
  z-index: 1;
  left: -2px;
  top: 2px;
}
/*关闭时文字位置设置*/
.el-switch__label--left {
  z-index: 1;
  left: 32px;
  top: 1px;
}
/*显示文字*/
.el-switch__label.is-active {
  display: block;
}
/*开关宽度*/
.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 60px !important;
  height: 20px !important;
}
</style>
