<template>
  <div class="b-lay">
    <div class="b-lay-item b-lay-left" :class="{'mini':isMini,'opened':visibleLeft}">
      <div class="view">
        <div v-if="isMini" class="close-arrow" @click="changeView('visibleLeft')">收起</div>
        <div v-if="isMini" class="view-tit" @click="changeView('visibleLeft')">
          更
          <br />多
        </div>
        <div class="view-box">
          <div class="box-item w50 h100">
            <div class="box-item w100 h33">
              <DataPanel
                type="border"
                title="客运设备故障数与故障率（15日）"
                titleAlign="left"
                @titleClick="dataPanelTitleClick"
              >
                <Kysbgz></Kysbgz>
              </DataPanel>
            </div>
            <div class="box-item w100 h33">
              <DataPanel type="border" title="直梯故障排名" @titleClick="dataPanelTitleClick">
                <Dtgzpm></Dtgzpm>
              </DataPanel>
            </div>
            <div class="box-item w100 h33">
              <DataPanel type="border" title="扶梯故障排名" @titleClick="dataPanelTitleClick">
                <Dtgzpm></Dtgzpm>
              </DataPanel>
            </div>
          </div>
          <div class="box-item w50 h100" style="border: none;">
            <div class="box-item w100 h33">
              <DataPanel type="border" title @titleClick="dataPanelTitleClick">
                <Kysbgz></Kysbgz>
              </DataPanel>
            </div>
            <div class="box-item w100 h33">
              <DataPanel type="border" title="直梯故障频率趋势" @titleClick="dataPanelTitleClick">
                <Dtgzpl></Dtgzpl>
              </DataPanel>
            </div>
            <div class="box-item w100 h33">
              <DataPanel type="border" title="扶梯故障频率趋势" @titleClick="dataPanelTitleClick">
                <Dtgzpl></Dtgzpl>
              </DataPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="b-lay-item b-lay-main" :class="{'mini':isMini}">
      <div class="main-top">
        <div class="main-top-top">
          <div class="log"></div>
        </div>
        <div class="main-top-content">
          <selectTree
            :props="st_props"
            :options="st_list"
            :value="st_valueId"
            :clearable="st_isClearable"
            :accordion="st_isAccordion"
            :disabled="st_isDisabled"
            :filterable="st_filterFlag"
            selectTreeClass="selectTreeOne"
            size="mini"
            @getValue="st_getValue($event)"
          ></selectTree>
        </div>
      </div>
      <div class="main-center">
        <div class="main-center-item map">
          <div class="main-center-item left w25">
            <div class="w100 h33">
              <IncomeAndSend :stnCode="selectTreeNode.zmlm"></IncomeAndSend>
            </div>
            <div class="w100 h33">
              <DataPanel
                type="line"
                title="客运故障设备比例"
                subTitle="PositiveDelay"
                @titleClick="dataPanelTitleClick"
              >
                <kygzsbbl></kygzsbbl>
              </DataPanel>
            </div>
            <div class="w100 h33">
              <DataPanel
                type="line"
                title="设备报修工单情况"
                subTitle="TrainOperation"
                @titleClick="dataPanelTitleClick"
              >
                <sbbxgdqk></sbbxgdqk>
              </DataPanel>
            </div>
          </div>
          <div class="main-center-item right w25">
            <div class="w100 h20" title="当前作业情况">
              <Dqzy></Dqzy>
            </div>
            <div class="w100 h46">
              <DataPanel
                type="line"
                title="命令统计（ 7天 ）"
                subTitle="AtStationBox"
                @titleClick="dataPanelTitleClick"
              >
                <Mltj></Mltj>
              </DataPanel>
            </div>
            <div class="w100 h33">
              <DataPanel
                type="line"
                title="工单"
                subTitle="OnRoadBox"
                @titleClick="dataPanelTitleClick"
              >
                <Gd></Gd>
              </DataPanel>
            </div>
          </div>

          <div class="main-center-item bottom">
            <Fssr :stnCode="selectTreeNode.zmlm"></Fssr>
          </div>
          <!-- 地图 -->
          <IndexMap></IndexMap>
        </div>
      </div>
    </div>
    <div class="b-lay-item b-lay-right" :class="{'mini':isMini,'opened':visibleRight}">
      <div class="view">
        <div v-if="isMini" class="close-arrow" @click="changeView('visibleRight')">收起</div>
        <div v-if="isMini" class="view-tit" @click="changeView('visibleRight')">
          更
          <br />多
        </div>
        <div class="view-box">
          <div class="box-item w100 h33">
            <DataPanel type="border" title="人员安排" @titleClick="dataPanelTitleClick">
              <Ryap></Ryap>
            </DataPanel>
          </div>
          <div class="box-item w100 h33">
            <DataPanel type="border" title="重点设备数量及其完好情况" @titleClick="dataPanelTitleClick">
              <Zdsb></Zdsb>
            </DataPanel>
          </div>
          <div class="box-item w100 h33">
            <DataPanel type="border" title="今日物资出库统计" @titleClick="dataPanelTitleClick">
              <Jrwzcktj></Jrwzcktj>
            </DataPanel>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title
      :visible.sync="indexDetailVisible"
      :destroy-on-close="true"
      :width="indexDetailWidth"
      custom-class="blueDialog"
      top="8vh"
    >
      <div class="lds-hourglass-p" v-show="indexDetailBGFlag">
        <div class="lds-hourglass"></div>
      </div>
      <div style="width:100%;background-color:#2c3e50" :style="{height:indexDetailHeight}">
        <template v-if="indexDetailType=='gzsbbl'">
          <kygzsbbl></kygzsbbl>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DataPanel from "../../../components/bigScreen/DataPanel"; //每个组件的蓝色方框
import selectTree from "../../../components/data/selectTree.vue";//下拉树组件
import unitTree from "../../../assets/unitTreeData"; //单位树
import kygzsbbl from "./kygzsbbl"; //客运故障设备比例
import sbbxgdqk from "./sbbxgdqk"; //设备报修工单情况
import Fssr from "./fssr.vue"; //已完成发送、收入
import Dqzy from "./dqzy.vue"; //当前作业情况
import Ryap from "./ryap.vue"; //人员安排
import Gd from "./gd.vue"; //工单
import Kysbgz from "./kysbgz.vue"; //动车、普车开行效益
import Dtgzpm from "./dtgzpm.vue"; //动车、普车客座率
import Zdsb from "./zdsb.vue"; //重点设备数量及其完好情况
import Mltj from "./mltj.vue"; //命令统计
import IncomeAndSend from "./IncomeAndSend"; //动车普车 收入发送人数
import Jrwzcktj from "./jrwzcktj"; //今日物质出库统计
import CSCount from "./CSCount"; //餐售
import Dtgzpl from "./dtgzpl"; //动车收入日分析
import IndexMap from './IndexMap.vue';
import IData from './InitData.js'
import C from "../../../assets/com.js";
export default {
  components: {
    DataPanel,
    IndexMap,
    Kysbgz,
    Dtgzpm,
    Fssr,
    Gd,
    Dqzy,
    Ryap,
    Zdsb,
    kygzsbbl,
    sbbxgdqk,
    IncomeAndSend,
    Jrwzcktj,
    CSCount,
    Dtgzpl,
    Mltj,
    selectTree,
  },
  data() {
    return {
      //单位树
      st_list: [], //列表项 必选
      st_isClearable: false, //可清空 可选
      st_isAccordion: true, //可收起 可选
      st_isDisabled: false, //禁用
      st_valueId: "", //初始值 可选
      st_filterFlag: true,//可以进行搜搜
      st_props: {
        //配置项 必选
        value: "id",
        label: "text",
        children: "children"
      },
      selectTreeNode:"",//单位树选中数据
      // 是否为小屏模式
      isMini: true,
      visibleLeft: false,
      visibleRight: false,
      myNum: "0000",
      indexDetailVisible: false,//详情界面是否显示
      indexDetailWidth: "0%",//详情界面宽度
      indexDetailBGFlag: false,//详情界面loading是否显示
      indexDetailHeight: 0,//详情界面内容高度
      indexDetailType: "",//详情界面显示内容
      webParam: null,//url参数
    }
  },
  created() {
    // 组件创建完毕后，将当前地图模块设置为 default
    this.isMini = window.innerWidth < 3000;
    setInterval(() => {
      this.myNum = "" + Math.floor(Math.random() * 10000);
    }, 1000 * 5);
    this.webParam = C.getUrlParam(false);
    var treeData = unitTree.getData_tree(this.webParam);
    this.st_isDisabled = !treeData.flag;
    this.st_list = treeData.treeData;

    if (treeData.value) {
      this.st_valueId = treeData.value;
    }
    if (this.st_list.length > 0) {
      //根据id找到对应的树选项
      var item = unitTree.getTreeNodeByid(this.st_valueId, this.st_list);
      item.zmlm = item.zmlm.toUpperCase();
      this.selectTreeNode = item;
    } else {
      this.$message.error("没有查询到单位树");
      return;
    }
  },
  mounted() {

  },
  methods: {
    // 切换左右视图
    changeView(k) {
      this[k] = !this[k];
      // 左右屏打开且未取过数据，则通知对应屏下子组件取数据
      if (this[k] && !this[k + "_flag"]) {
        this[k + "_flag"] = true;
      }
    },
    // 切换身份
    dataPanelTitleClick(title) {
      if (title == "客运故障设备比例") {
        this.openIndexDetail("gzsbbl");
      }
    },
    //车站选择事件
    st_getValue(node) {
      if (node) {
        node.zmlm = node.zmlm.toUpperCase();
        this.selectTreeNode = node;
        this.st_valueId = node.id;
        window.console.log(node);
      }
    },
    //打开详情界面框
    openIndexDetail(type) {
      this.indexDetailBGFlag = true;
      this.indexDetailHeight = document.documentElement.clientHeight * 0.8 + "px";
      this.indexDetailVisible = true;
      if (type == "gzsbbl") {
        this.indexDetailType = type;
        this.indexDetailWidth = "50%";
      }
      this.$nextTick(() => {
        this.indexDetailBGFlag = false;
      })
    },
  }
}
</script>

<style scoped="scoped">
.b-lay {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url("../../../assets/imgs/bigScreen/back.jpg");
  background-size: cover;
  background-position: center;
  color: white;
}

.b-lay-item {
  position: relative;
  display: inline-block;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
}

.b-lay-item > .view {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
}

.b-lay-item.mini > .view {
  padding-top: 40px;
}

.b-lay-item.mini.opened > .view {
  background: #1e255c;
}

/* 左 */
.b-lay-left {
  width: 25%;
  padding: 0px;
  z-index: 410;
}

.b-lay-left.mini {
  position: absolute;
  width: 50%;
  left: -50%;
  z-index: 420;
  padding-right: 35px;
  transition: left 0.3s;
}

.b-lay-left.mini.opened {
  left: 0;
}

/* 中 */
.b-lay-main {
  position: relative;
  width: 50%;
}

.b-lay-main.mini {
  width: 100%;
}

.main-top {
  position: relative;
  height: 60px;
}

.main-top-top {
  height: 60px;
}

.main-top-top > .log {
  width: 1920px;
  height: 51px;
  background: url("./img/logo2.png") no-repeat;
  /*logo 是否居中*/
  margin: 0 auto;
}

/* 顶部数字 */
.main-top-nums {
  position: absolute;
  padding-top: 40px;
  text-align: center;
  width: 100%;
  z-index: 410;
}

.main-center {
  position: absolute;
  top: 60px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}

.main-center-item {
  position: absolute;
  z-index: 410;
}

.main-center-item.map {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main-center-item.left {
  top: 10px;
  left: 0;
  bottom: 10px;
}

.main-center-item.right {
  top: 10px;
  right: 0;
  bottom: 10px;
}

.main-center-item.bottom {
  left: 0;
  bottom: 10px;
  width: 100%;
  height: 90px;
  text-align: center;
}

/* 右 */
.b-lay-right {
  width: 25%;
  padding: 0px;
  z-index: 410;
}

.b-lay-right.mini {
  position: absolute;
  width: 50%;
  right: -50%;
  z-index: 420;
  padding-left: 35px;
  transition: right 0.3s;
}

.b-lay-right.mini.opened {
  right: 0;
}

/* 折叠按钮标题 */
.view-tit {
  position: absolute;
  top: 0px;
  width: 35px;
  height: 184px;
  color: #20c8d5;
  font-size: 16px;
  text-align: center;
  padding-top: 70px;
  cursor: pointer;
}

.b-lay-left .view-tit {
  padding-right: 6px;
  right: -65px;
  background: url("../../../assets/imgs/bigScreen/lock-left.png") no-repeat;
}

.b-lay-left.mini.opened .view-tit {
  right: -35px;
}

.b-lay-right .view-tit {
  padding-left: 6px;
  left: -65px;
  background: url("../../../assets/imgs/bigScreen/lock-right.png") no-repeat;
}

.b-lay-right.mini.opened .view-tit {
  left: -35px;
}

/* 收起 */
.close-arrow {
  position: absolute;
  height: 40px;
  line-height: 40px;
  top: 0px;
  color: #20c8d5;
  font-size: 16px;
  cursor: pointer;
}

.close-arrow:hover {
  font-weight: bold;
}

.b-lay-left .close-arrow {
  left: 10px;
  padding-left: 30px;
  background: url("../../../assets/imgs/bigScreen/arrow-left.png") no-repeat;
  background-position: 5px 10px;
}

.b-lay-right .close-arrow {
  right: 10px;
  padding-right: 30px;
  background: url("../../../assets/imgs/bigScreen/arrow-right.png") no-repeat;
  background-position: right 5px top 10px;
}

/* 左右视图容器 */
.view-box {
  width: 100%;
  height: 100%;
}

.box-item {
  display: inline-block;
  vertical-align: top;
}

/* 各种高、宽 百分经*/
.w100 {
  width: 100%;
}

.w50 {
  width: 50%;
}

.w50 {
  width: 50%;
}

.w25 {
  width: 25%;
}

.h100 {
  height: 100%;
}

.h50 {
  height: 50%;
}

.h40 {
  height: 40%;
}

.h20 {
  height: 20%;
}

.h25 {
  height: 25%;
}

.h30 {
  height: 30%;
}

.h33 {
  height: 33.33%;
}
.h46 {
  height: 46.66%;
}
.border {
  border: 1px solid red;
}
.main-top-content {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  height:100%;
  width:100%;
  padding-left:10px;
  padding-top:10px;
}
</style>
<style>
.blue-table ::-webkit-scrollbar {
  width: 2px;
  background-color: transparent;
  -webkit-overflow-scrolling: touch;
}

/* 表格背景 */
.blue-table .el-table {
  color: #fff;
  background-color: #293066;
}

/* 表头文本颜色 */
.blue-table .el-table thead {
  color: #fff;
}

/* 行背景 */
.blue-table .el-table .el-table__header > thead > tr,
.blue-table .el-table .el-table__header > thead > tr > th,
.blue-table .el-table .el-table__header > thead > tr:hover,
.blue-table .el-table .el-table__body > tbody > tr,
.blue-table .el-table .el-table__body > tbody > tr > th {
  background-color: transparent;
}

/* 单元格边框 */
.blue-table .el-table td,
.blue-table .el-table th.is-leaf {
  border-bottom: none;
}

/* 表格行鼠标移动背景色 */
.el-table--enable-row-hover .el-table__body tr:hover > td {
  cursor: pointer;
  background-color: #293066;
}

/* 斑马纹 */
/* 表格行鼠标移动背景色 */
.blue-table .el-table--striped .el-table__body tr.el-table__row--striped:hover,
.blue-table .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: rgba(32, 38, 86, 0.9);
}

/* 表格底部边框 */
.blue-table .el-table--border::after,
.blue-table .el-table--group::after,
.blue-table .el-table::before {
  background-color: transparent;
}

/*详情框loading*/
.lds-hourglass-p {
  position: absolute;
  text-align: center;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 100000000;
  opacity: 0.5;
}
.lds-hourglass {
  display: inline-block;
  width: 64px;
  height: 64px;
  position: absolute;
  top: calc(50% - 32px);
  left: calc(50% - 32px);
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 6px;
  box-sizing: border-box;
  border: 26px solid #b5eaff;
  border-color: #b5eaff transparent #b5eaff transparent;
  animation: lds-hourglass 1.2s infinite;
}

@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  100% {
    transform: rotate(1800deg);
  }
}
/* 弹出框样式修改 */
.blueDialog {
  box-shadow: 0 0 14px #b2dcfd;
}
.blueDialog .el-dialog__header {
  padding: 0 !important;
}
.blueDialog .el-dialog__headerbtn {
  font-size: 24px;
  top: 8px;
  right: 10px;
  z-index: 2;
}
.blueDialog .el-dialog__body {
  border: none;
}
/* 弹出框动画 */
.el-dialog__wrapper {
  transition-duration: 0.3s;
}

.dialog-fade-enter-active {
  animation: none !important;
}

.dialog-fade-leave-active {
  transition-duration: 0.15s !important;
  animation: none !important;
}

.dialog-fade-enter-active .el-dialog,
.dialog-fade-leave-active .el-dialog {
  animation-fill-mode: forwards;
}

.dialog-fade-enter-active .el-dialog {
  animation-duration: 0.3s;
  animation-name: anim-open;
  animation-timing-function: cubic-bezier(0.6, 0, 0.4, 1);
}

.dialog-fade-leave-active .el-dialog {
  animation-duration: 0.3s;
  animation-name: anim-close;
}

@keyframes anim-open {
  0% {
    opacity: 0;
    transform: scale3d(0, 0, 1);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes anim-close {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale3d(0.5, 0.5, 1);
  }
}
</style>
<style src="../../../assets/css/EchartsBlue.css" scoped></style>
