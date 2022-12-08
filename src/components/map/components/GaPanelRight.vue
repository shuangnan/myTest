<template>
  <div :style="{
        top:'80px',
				width: window.innerWidth > 3000?toolOpt.width:'280px',
				right: darkPanelHideRight?'-500px':toolOpt.left,
				bottom: window.innerWidth > 3000?toolOpt.bottom:'30px',
        paddingTop: 0,
			}" class="big filter-con-light">
    <div class="filter-change-tool" @click="config.controller.mini = !config.controller.mini"></div>

    <div v-if="gaPanelType === 'gac'" class="filter-body">
      <div>
        <div class="group-title-big">成都铁路公安局</div>
        <div class="duty-info">
          <div style="color:black;font-size:16px;font-weight: bold;text-align: center;"> 2022年11月21日</div>
          <div class="duty-info-item" style="margin-top:10px">
            <img src="../img/gongAn/duty-leader.png">
            <div style="margin-left:5px;color:#9ba19c;width:80px;font-size:12px">
              值班领导：
            </div>
            <div style="color:rgb(71,133,224);width:100px;font-size:14px">
              雷宏飞
            </div>
          </div>
          <div class="duty-info-item">
            <img src="../img/gongAn/leader-phone.png">
            <div style="margin-left:5px;color:#9ba19c;width:80px;font-size:12px">
              领导电话：
            </div>
            <div style="color:rgb(71,133,224);width:100px;font-size:14px">
              135XXXXXXXX
            </div>
          </div>
          <div class="duty-info-item">
            <img src="../img/gongAn/commander.png">
            <div style="margin-left:5px;color:#9ba19c;width:80px;font-size:12px">
              指挥长：
            </div>
            <div style="color:rgb(71,133,224);width:100px;font-size:14px">
              谢文强
            </div>
          </div>
          <div class="duty-info-item">
            <img src="../img/gongAn/duty-phone.png">
            <div style="margin-left:5px;color:#9ba19c;width:80px;font-size:12px">
              值班电话：
            </div>
            <div style="color:rgb(71,133,224);width:100px;font-size:14px">
              028-86484328
            </div>
          </div>

        </div>
        <div class="info-middle">
          <div style="color:black;font-size:20px;font-weight: bold;padding:5px;">
            今日上岗警力
          </div>
          <div style="position:relative;display:flex; justify-content:center;">
            <img src="../img/gongAn/yuan.png">
            <div style="position:absolute; top:21px; left:90px;color:rgb(74,133,224);font-size:34px;font-weight:bold;">3715</div>
            <div style="position:absolute; top:55px; left:115px;color:rgb(72,84,98);font-size:18px;font-weight:bold;">/6331</div>
          </div>

          <div style="position:relative;display:flex; justify-content: space-between;margin:0 40px">
            <div>
              <img src="../img/gongAn/kuang.png">
              <div style="position:absolute; top:28px; left:13px;color:rgb(74,133,224);font-size:20px;font-weight:bold;text-align:center; width:47px">1174</div>
              <div style="color:black;text-align:center;font-weight:bold">成都处</div>
            </div>

            <div>
              <img src="../img/gongAn/kuang.png">
              <div style="position:absolute; top:28px; left:117px;color:rgb(74,133,224);font-size:20px;font-weight:bold;text-align:center; width:47px">1025</div>
              <div style="color:black;text-align:center;font-weight:bold">重庆处</div>
            </div>
          </div>

          <div style="position:relative;display:flex; justify-content: space-between;margin:0 40px">
            <div>
              <img src="../img/gongAn/kuang.png">
              <div style="position:absolute; top:28px; left:13px;color:rgb(74,133,224);font-size:20px;font-weight:bold;text-align:center; width:47px">872</div>
              <div style="color:black;text-align:center;font-weight:bold">贵阳处</div>
            </div>

            <div>
              <img src="../img/gongAn/kuang.png">
              <div style="position:absolute; top:28px; left:117px;color:rgb(74,133,224);font-size:20px;font-weight:bold;text-align:center; width:47px">441</div>
              <div style="color:black;text-align:center;font-weight:bold">西昌处</div>
            </div>
          </div>

          <div style="position:relative;display:flex; justify-content:center;">
            <div style="color: black;font-weight: bold;margin-top: 20px;font-size: 18px;">上岗率：</div>
            <div style="color: rgb(65,146,237);font-weight: bold;font-size: 34px;margin-top: 11px;">59</div>
            <div style="color: rgb(65,146,237);font-weight: bold;font-size: 16px;margin-top: 28px;">%</div>

          </div>

          <div>
          </div>

        </div>
        <div class="info-top2">
          <div style="color:black;font-size:20px;font-weight: bold;padding:5px">
            今日警情
          </div>
          <div style="position:relative;display:flex; justify-content:center;margin-top:20px">
            <img src="../img/gongAn/yuanzhu.png">
            <div style="position:absolute; top:-15px; left:90px;color:rgb(74,133,224);font-size:54px;font-weight:bold;">19</div>
            <div style="position:absolute; top:20px; left:150px;color:rgb(74,133,224);font-size:18px;font-weight:bold;">起</div>

            <div style="color:rgb(153,172,190);position:absolute; top:140px; left:170px;font-size:14px;">更多详情>></div>
          </div>

        </div>
        <div>
          <!-- 放置伸缩图标 -->

        </div>
      </div>
    </div>

    <div v-if="gaPanelType === 'pcs'" class="filter-body">
      <div>
        <div class="group-title-big">日常管理</div>
        <div>

          <div class="info-top2">
            <div style="color:black;font-size:20px;font-weight: bold;padding:5px">
              今日警情
            </div>
            <div style="position:relative;display:flex; justify-content:center;margin-top:20px">
              <img src="../img/gongAn/yuanzhu.png">
              <div style="position:absolute; top:-15px; left:90px;color:rgb(74,133,224);font-size:54px;font-weight:bold;">19</div>
              <div style="position:absolute; top:20px; left:150px;color:rgb(74,133,224);font-size:18px;font-weight:bold;">起</div>

              <div style="color:rgb(153,172,190);position:absolute; top:140px; left:170px;font-size:14px;">更多详情>></div>
            </div>
          </div>

          <div class="info-middle2">
            <div style="color:black;font-size:20px;font-weight: bold;padding:5px">
              典型案事例
            </div>
            <div class="case-info" style="display:flex; justify-content:space-between;flex-direction:column">
              <div v-for="item in typicalCase" :key="item.id" class="case-info-item">
                <div>{{ item.id }}. {{ item.content }} </div>

              </div>
              <!-- <div class="case-info-item">
                1.
              </div>
              <div class="case-info-item">
                2.xxxxx
              </div>
              <div class="case-info-item">
                3.xxxxx
              </div> -->
            </div>

            <div style="color:rgb(153,172,190);position:absolute; bottom:10px; right:20px;font-size:14px;">更多详情>></div>

          </div>

          <div class="info-bottom2">
            <div style="color:black;font-size:20px;font-weight: bold;padding:5px">
              视频监控
            </div>
            <div style="position:absolute;left:120px;top:14px">
              <el-select class="select-depart" v-model="gaDepart" placeholder="请选择" style="mini">
                <el-option v-for="item in GaDepartments" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="color:rgb(153,172,190);position:absolute; bottom:10px; right:20px;font-size:14px;">更多详情>></div>
          </div>
          <div>
            <!-- 放置伸缩图标 -->
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import C from "../../../assets/com.js";
import config from "../js/config.js";
import Index from "../Index.vue";
import keYun from "../js/keYun.js"; // 客运

import config_ga from "../js/config_ga.js";
import gongAnPcs from "../js/gongAnPcs"; // 铁路派出所
export default {
  // 组件
  components: {},

  // 属性
  props: {
    isPolice: Boolean,
    darkPanelHideRight: Boolean,
    toolOpt: {
      default: function () {
        return {
          width: "260px",
          height: "750px",
          left: "20px",
          bottom: "20px",
          lateBottom: "10px",
          lateRight: "840px"
        };
      }
    },

    gaPanelType: String,

    curGaArea: String,

    // obj: Object,
    // detailSql: Array
  },
  // 数据仓库
  data() {
    return {
      config: config,
      config_ga: config_ga,
      curMenu: "0",
      scrollHeight: [], // 存储所有模块的高度
      activities: [
        { content: "物", id: "0" },
        { content: "人", id: "1" },
        { content: "事", id: "2" }
      ],
      GaDepartments: [
        { value: '0', label: "综合指挥室" }
      ],
      gaDepart: '0',
      window: window,
      // 典型案事例
      typicalCase: [
        {
          id: '1', content: "2022年11月21日，成都东车站派出所挡获一名吸毒人员，从其随身......"
        },
        { id: '2', content: "2022年11月21日，成都东车站派出所挡获一名吸毒人员，从其随身......" },
        {
          id: '3', content: "2022年11月21日，成都东车站派出所挡获一名吸毒人员，从其随身......"
        }
      ],
    };
  },
  // 组件挂载完毕
  mounted() {
    // 获取每个模块高度
    this.$nextTick(() => {
      this.getScrollHeight();
    });
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    // 切换控制面板
    changeFilterTab(name) {
      this.curMenu = name + "";
      console.log("this.curMenu", this.curMenu);
      this.$refs["content_" + name] &&
        this.$refs["content_" + name].scrollIntoView(true);
    },

    getScrollHeight() {
      this.scrollHeight = [];
      this.activities.map(item => {
        this.scrollHeight.push(document.getElementById(item.id).offsetTop);
      });
      console.log("this.scrollHeight", this.scrollHeight);
    },

    handleScroll(e) {
      // console.log("e.target.scrollTop", e.target.scrollTop);
      if (
        e.target.scrollTop >
        this.scrollHeight[this.scrollHeight.length - 1] - 340
      ) {
        this.curMenu = this.scrollHeight.length - 1 + "";
      } else {
        this.scrollHeight.map((item, index) => {
          if (e.target.scrollTop >= item - 180) {
            this.curMenu = index + "";
          }
        });
      }
    },

    filterLayers(ty, data) {
      console.log("filerLLLLLLLLLLLLLLLLLLLLLLLLLL");
      switch (ty) {
        case "派出所_地方派出所": {
          console.log("filterLayers 派出所_地方派出所");
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_dfpcs");
          break;
        }
        case "派出所_全部铁路派出所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_tlpcs");
          break;
        }
        case "派出所_进京": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_jjing");
          break;
        }
        case "派出所_进疆": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_jjiang");
          break;
        }
        case "派出所_进藏": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_jzang");
          break;
        }
        case "派出所_客运枢纽所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_kysn");
          break;
        }
        case "派出所_客运A类所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_kya");
          break;
        }
        case "派出所_客运B类所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_kyb");
          break;
        }
        case "派出所_客运C类所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_kyc");
          break;
        }
        case "派出所_线路A类所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_linea");
          break;
        }
        case "派出所_线路B类所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_lineb");
          break;
        }
        case "派出所_线路C类所": {
          gongAnPcs.filterLayer("wu_pcs", "wu_pcs_linec");
          break;
        }
      }
    },

    getTitle(str) {
      return "------------ " + "\xa0\xa0" + str + "\xa0\xa0" + " ------------";
    }

    /* @info  数据处理区-----------------------------------*/
    /* @info  数据交互区-----------------------------------*/
    // 获取数据
  },
  // 监视属性
  watch: {
    // 左右面板类型变化
    gaPanelType(v) {
      this.gaPanelType = v;
    },
    // 公安处发生改变
    curGaArea(val) {
      this.curGaArea = val;
      // 改变右侧的数据
    },

  },
  // 计算属性
  computed: {},
  created() {
    // console.log("toolOpt", this.toolOpt);
  }
};
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.tq-list {
  padding: 0px;
  white-space: nowrap;
  height: 100px;
}

.tq-list-item {
  display: inline-block;
  padding: 10px;
  text-align: center;
}

.tq-weather {
}

.tq-weather td {
  padding: 5px;
  border-bottom: 1px solid #333;
}
/*天气*/
.weather-icon {
  width: 20px;
}

>>> .el-tabs__header {
  margin: 0;
}

>>> .el-tabs__item {
  color: #c1c1c1;
}

>>> .el-tabs__item.is-active {
  color: #409eff;
}

>>> .el-tabs__nav-wrap::after {
  background-color: transparent;
}

>>> .el-scrollbar__wrap::-webkit-scrollbar {
  /*滚动条两端块*/
  width: 0px;
  height: 0px;
  border-radius: 0px;
  background-color: transparent !important;
}

>>> .el-scrollbar__wrap::-webkit-scrollbar-track {
  /*滚动条滑槽*/
  border-radius: 0px;
  background-color: transparent !important;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0) !important;
}

>>> .el-scrollbar__wrap::-webkit-scrollbar-thumb {
  /*滚动条滑动条*/
  border-radius: 0px;
  background-color: transparent !important;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0) !important;
}

>>> .el-scrollbar__wrap::-webkit-scrollbar-thumb:hover {
  background-color: transparent !important;
}

>>> .el-scrollbar__wrap::-webkit-scrollbar-thumb:active {
  background-color: transparent !important;
}

.filter-con-light {
  background-blend-mode: normal, normal;
  background-image: linear-gradient(-3deg, #fff 90%, #fff 100%),
    linear-gradient(#fff, #fff);
  border-image-slice: 1;
  border-image-source: linear-gradient(-2deg, #2d82cd 0%, #2d82cd 100%);

  border-style: solid;
  border-width: 1px;
  border-right: 0px;
  opacity: 0.89;
  overflow: hidden;
  padding: 10px 0px 0px 0px;
  position: absolute;
  z-index: 400;
  /* transition: height .3s,width .3s; */
}

.filter-con-light.big {
  overflow: visible;
  /* height: 750px; */
  /*与 filter-body 高度一致*/
}

.filter-con-light.big > .filter-body {
  height: 100%;
  overflow: auto;
}

.filter-change-tool {
  cursor: pointer;
  height: 10px;
  left: 0;
  line-height: 26px;
  position: absolute;
  text-align: center;
  top: 0px;
  width: 100%;
}

.filter-change-tool:hover {
  opacity: 0.8;
}

.filter-body {
  height: 0px;
  overflow: hidden;
  width: 100%;
}

.filter-con-light.big > .filter-body {
  height: 100%;
  overflow: auto;
}

.group-title-light {
  background: transparent;
  height: 28px;
  font-weight: bold;
  font-size: 12px;
  padding: 5px;
  text-align: center;
  color: #545967;
}

/* .group-title-big {
  color: #545967;
  height: 28px;
  font-weight: bold;
  font-size: 14px;
  padding: 5px;
  text-align: left;
} */
.group-title-big {
  background: #5684c8;
  height: 34px;
  font-weight: bold;
  font-size: 16px;
  padding: 5px;
  text-align: center;
}

.group-body-light {
  line-height: 26px;
  padding: 10px;
  font-size: 12px;
  color: #000;
}

.group-body-light.flex {
  display: flex;
  justify-content: space-between;
}

>>> .el-checkbox__label {
  color: #545967 !important;
  font-size: 12px;
  padding-left: 0px;
}

>>> .group-body-light .el-checkbox {
  margin: 5px 0;
  width: 50%;
}

.tab {
  bottom: 0px;
  max-height: 800px;
  overflow-y: scroll;
  position: absolute;
  right: -35px;
  margin-top: 10px;
  top: 0px;
  width: 35px;
}

.tab::-webkit-scrollbar {
  width: 0px;
}

.tab > div {
  color: #1e797f;
  font-size: 16px;
  height: auto;
  line-height: 16px;
  margin-top: -25px;
  padding: 17px 0;
  position: relative;
  width: 100%;
  z-index: 1;
  top: 20px;
}

.tab > div > span {
  background: url(../img/tabDefault_ga.png) no-repeat 1px -56px;
  background-size: 34px 200px;
  display: block;
  height: 39px;
  padding: 4px 5px 0px 5px;
  width: 100%;
  color: white;
}

.tab > div::before {
  background: url(../img/tabDefault_ga.png) no-repeat center 0px;
  content: "";
  height: 17px;
  left: 0;
  position: absolute;
  right: 0px;
  top: 0;
}

.tab > div::after {
  background: url(../img/tabDefault_ga.png) no-repeat center -56px;
  bottom: 0;
  content: "";
  height: 17px;
  left: 0;
  position: absolute;
  right: 0px;
  z-index: 1;
}

.tab > div.active {
  color: #20d0db;
  z-index: 2;
}

.tab > div.active > span {
  background: url(../img/tabActive_ga.png) no-repeat 1px -50px;
  background-size: 34px 200px;
  color: black;
}

.tab > div.active::before {
  background: url(../img/tabActive_ga.png) no-repeat center 0px;
}

.tab > div.active::after {
  background: url(../img/tabActive_ga.png) no-repeat center -56px;
}

.tab > div:hover {
  cursor: pointer;
  opacity: 0.8;
}

.tab-block {
  border-image-slice: 1;
  border-image-source: linear-gradient(-2deg, #2d82cd 0%, #2d82cd 100%);

  border-style: solid;
  border-width: 1px;
  padding: 5px;
  margin-bottom: 20px;
}

>>> .el-main {
  padding: 5px;
}

.duty-info {
  margin: 10px;
  height: 150px;
  /* background-color: rgba(225, 243, 250, 0.7);
  border-radius: 20px; */
}

.info-middle {
  height: 410px;
  border-top: #5684c8 dashed 0.5px;
  border-bottom: #5684c8 dashed 0.5px;
  margin: 10px;
}

.info-bottom {
  height: 209px;
  border-bottom: #5684c8 dashed 0.5px;
  margin: 10px;
}

.info-top2 {
  height: 230px;
  border-bottom: #5684c8 dashed 0.5px;
  margin: 10px;
}

.info-middle2 {
  height: 318px;
  border-bottom: #5684c8 dashed 0.5px;
  margin: 10px;
  position: relative;
}

.info-bottom2 {
  height: 180px;
  border-bottom: #5684c8 dashed 0.5px;
  margin: 10px;
  position: relative;
}

.duty-info-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
  font-weight: 700;
}

.case-info {
  color: #333;
  font-size: 12px;
  margin: 20px;
  height: 180px;
}

.case-info-item {
  /* height: 50px; */
}

.select-depart {
  width: 120px;
  background: rgba(255, 255, 255, 0.9);
}

.select-depart >>> .el-input__inner {
  color: rgb(40, 105, 172);
  font-weight: bold;
  height: 20px;
  border: 0.1px solid #999999;
  border-radius: 0%;
  font-size: 12px;
}

.select-depart >>> .el-input__icon {
  line-height: 20px;
}
</style>
<!-- 公有样式（会影响全局） -->
<!-- 公有样式（会影响全局） -->
<style src="../css/Index.css"></style><!-- 本组件 -->
<style src="../css/station.css"></style><!-- 车站 -->
<style src="../css/gongDian.css"></style><!-- 供电 -->
<style src="../css/jiWu.css"></style><!-- 机务 -->
<style src="../css/yunShu.css"></style><!-- 运输 -->
<style src="../css/tuFang.css"></style><!-- 土房 -->
<style src="../css/jiaotong.css"></style><!-- 交通 -->
<style src="../css/earthquake.css"></style><!-- 地震 -->
<style src="../css/weather.css"></style><!-- 天气 、天气预警-->
<style src="../css/qiaoSui.css"></style><!-- 桥遂 -->
<style src="../css/houQing.css"></style><!-- 后勤 -->
<style src="../css/huoYun.css"></style><!-- 后勤 -->
<style src="../css/train.css"></style><!-- 列车样式 -->
<style src="../css/gongWu.css"></style>
<style src="../css/dk.css"></style>
<style src="../css/dianWu.css"></style>
<style src="../css/keYun.css"></style>
<style>
#app {
  background: transparent !important;
}
</style>
