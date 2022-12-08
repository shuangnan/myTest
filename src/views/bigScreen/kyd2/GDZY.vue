<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		股道占用、车辆段库面情况
 -->
<template>
  <div class="temp" id="gdzyBox">
    <!-- 顶部搜索栏 -->
    <div class="contentTop ELMTblue2" style="min-width: 1200px;">
      <div>
        <div class="breakLine zydb_top_tree">
          <img
            :src="require('../../../assets/imgs/zydbimg/dw.png')"
            style="vertical-align:middle;margin-right:-10px;"
          />
          <selectTree
            :options="st_list"
            :value="st_valueId"
            :disabled="st_isDisabled"
            :filterable="st_filterFlag"
            size="mini"
            @getValue="st_getValue($event)"
          ></selectTree>
        </div>
        <div class="breakLine" style="padding-right:0">
          <el-date-picker
            v-model="queryDate"
            size="small"
            :editable="false"
            :clearable="false"
            value-format="yyyy-MM-dd"
            style="width: 130px;"
            @change="queryData"
          ></el-date-picker>
        </div>
        <div class="breakLine" style="padding-top:8px;">
          <el-radio v-model="queryType" label="1" @change="queryData">计划</el-radio>
          <el-radio v-model="queryType" label="2" @change="queryData">实际</el-radio>
        </div>
      </div>
      <div>
        <div class="breakLineLeft" style="cursor:pointer;" @click="autoScrollFlag=!autoScrollFlag">
          <i
            class="el-icon-s-promotion iconBtn"
            style="font-size:20px;"
            :style="{color:autoScrollFlag?'#3abddd':'#aaa'}"
          ></i>
        </div>
        <div class="breakLineLeft" style="display:flex">
          <div v-for="(item,index) in colorList" :key="index" class="colorItem" v-show="item">
            <div class="divColor" :style="{background:item}"></div>
            <span>{{colorListText[index]}}</span>
          </div>
        </div>
        <div class="breakLineLeft">
          <strong style="font-size:150%;color:#fff;">{{xtsj}}</strong>
        </div>
      </div>
    </div>
    <div style="width:100%;height:calc(100% - 40px);display:flex">
      <!-- 左侧股道列表 -->
      <div style="width:50px;height:100%;">
        <div style="width:100%;height:60px;"></div>
        <div
          @scroll="leftOnscroll"
          id="gdzyTrackName"
          style="width:100%;height:calc(100% - 60px);overflow:auto;"
          class="itemTotalname"
        >
          <div
            v-for="(item,index) in trackDIC"
            :key="index"
            :style="{height:itemOutHeight+'px'}"
            class="trackName"
          >{{item.TRACK_NAME.replace(/股/,'')}}</div>
          <div style="width:100%;height:6px;"></div>
        </div>
      </div>
      <!-- 右侧股道和车数据 -->
      <div id="ycContent" style="width:calc(100% - 50px);overflow:auto;height:100%;">
        <div style="height:100%;position:relative;" :style="{width:contentWidth+'px'}">
          <!-- 当前时间点 -->
          <!-- <div class="timePoint" :style="{left:timePointLeft,height:timePointLineHeight}"> -->
          <div class="timePoint" :style="{left:timePointLeft}">
            <div></div>
            <div></div>
          </div>
          <!-- 内容 -->
          <div style="height:100%;">
            <!-- 时间轴 -->
            <div class="timeX" style="width:100%;height:60px;padding-top:5px;">
              <div style="width:100%;height:40px;border-bottom:2px solid #383e57;position:relative">
                <div
                  v-for="(item,index) in tiemDivList"
                  :key="index"
                  :style="{width:item.width,left:item.left}"
                  class="timeItem"
                >
                  <div :style="{color:item.color,fontSize:item.size}">{{item.text}}</div>
                  <div>
                    <div style="width:2px;background:#383e57;" :style="{height:item.height}"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 股道和车数据 -->
            <div
              id="gdzyContent"
              style="width:100%;height:calc(100% - 60px);overflow:auto;"
              @scroll="rightOnscroll"
            >
              <div
                v-for="(item,index) in trackDIC"
                :key="index"
                :style="{height:itemOutHeight+'px'}"
                class="trackName"
              >
                <div class="trackNameItem" :style="{height:itemInnerHeight+'px'}">
                  <div
                    class="trainItem"
                    v-for="(temp,seq) in item.detail"
                    :key="seq"
                    :style="{left:temp.spointw+'px',width:temp.width+'px',borderColor:temp.bdcolor,color:temp.bdcolor}"
                  >{{temp.showTrainNum}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import selectTree from "../../../components/data/selectTree.vue";
import unitTreeData from "../../../assets/unitTreeData.js";
import com from "../../../assets/com.js";
const MTLength = 50;//绘图 每10分钟长度


const zditme = 30;//终到车占用股道时间
const sftime = 30;//始发车占用股道时间
const timeDivW = 30;//时间轴具体内容div宽度
export default {
  // 组件
  components: {
    selectTree,
  },

  // 数据仓库
  data() {
    return {
      webParam: {},//url参数
      xtsj: "",
      autoScrollFlag: false,//是否自动滚动
      /*********下拉树*** */
      st_isDisabled: false, //禁用
      st_filterFlag: true, //可以进行搜搜
      st_valueId: "", //初始值 可选
      st_list: [], //列表项 必选
      selectTreeNode: "",//车站下拉树选择的车站

      queryDate: "",//查询时间
      queryType: "1",//类型
      colorList: ['', '#a87ef4', '#cec465', '#69b269', '#1f72c1'],//"1 终到" "2 始发" "3 通过" "终始" "直通 gray",
      colorListText: ['', '终到', '始发', '通过', '终始'],//"1 终到" "2 始发" "3 通过" "终始" "直通 gray",
      stime: "",//时间轴开始时间
      etime: "",//时间轴结束时间
      tiemLength: "0",//时间轴长度
      tiemDivList: [],//时间轴 具体数据
      timeMarginLeft: 10, //距离左边距离
      timeMarginRight: 10, //距离左边距离
      trackDIC: [],//股道字典

      itemOutHeight: 40,//外壳高度
      itemInnerHeight: 15,//内壳高度

      isSyncingLeftScroll: false,//左侧是否滚动
      isSyncingRightScroll: false,//右侧是否滚动

      interval: null,//计时器
      systemParam: {},//车站系统配置

      minFlag: false,//是否窗口模式
    }
  },
  // 属性
  props: {

  },
  created() {
    this.webParam = com.getUrlParam(false);
    var role = false;
    try {
      // 通过auth2方式
      if (this.webParam.SSOA) {
        com.getData({
          c: "trdm_lv_653",
          s: [this.webParam.SSOA],
          a: "获取权限",
          async: false,
        }, (r) => {
          role = r.result;
          if (role) {
            let pp = JSON.parse(r.data);
            for (var i in pp) {
              this.webParam[i] = pp[i];
            }
          }
        });
      } else {
        role = true;
      }
    } catch (e) { }
    if (!role) {
      document.body.innerHTML = "非法访问";
      return;
    }
    var treeData = unitTreeData.getData_tree(this.webParam);
    this.st_isDisabled = !treeData.flag;
    this.st_list = treeData.treeData;

    if (treeData.value) {
      this.st_valueId = treeData.value;
    }
    if (this.st_list.length > 0) {
      //根据id找到对应的树选项
      var item = unitTreeData.getTreeNodeByid(this.st_valueId, this.st_list);
      item.zmlm = item.zmlm.toUpperCase();
      this.selectTreeNode = item;
    } else {
      this.$message.error("没有查询到单位树");
      return;
    }
    this.setDefaultData();
    this.InterValFun();
    this.refreshData();
  },
  // 组件挂载完毕
  mounted() {
    // 固定时间轴
    // var get = document.querySelector.bind(document);
    // var boxEle1 = get("#gdzyContent");
    // boxEle1.addEventListener('scroll', function (e) {
    //   this.querySelector("div[class='timeX']").style.transform = 'translate(0,' + this.scrollTop + 'px)';
    // });
  },
  // 方法
  methods: {
    InterValFun() {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        var xxsj = new Date(this.xtsj);
        xxsj.setSeconds(xxsj.getSeconds() + 1)
        this.xtsj = xxsj.Format("yyyy-MM-dd hh:mm:ss")
        if (this.xtsj.split(" ")[1] == "00:00:00") {//每天零点自动刷新
          this.setDefaultData();
          this.refreshData();
        }
        if (this.autoScrollFlag) {
          this.scrollTime();
        }
      }, 1000);
    },
    setDefaultData() {
      this.xtsj = this.getBZTime();
      this.queryDate = this.xtsj.split(" ")[0];
      this.drawTrackTime();//绘制时间轴
      if (this.webParam.minFlag == "true") {
        this.minFlag = true;
        this.autoScrollFlag=true;
      }
    },
    //车站选择事件
    st_getValue(node) {
      if (node) {
        node.zmlm = node.zmlm.toUpperCase();
        this.selectTreeNode = node;
        this.st_valueId = node.id;
        window.console.log(node);
        this.refreshData();
      }
    },
    refreshData() {
      this.getTraciDIC();
      this.getStnSystemParam(this.selectTreeNode.zmlm, this.setStnSystemParam);//获取车站系统配置
      this.queryData();
    },
    queryData() {
      com.getData({
        c: "trdml_lv_Z003",
        s: [this.selectTreeNode.zmlm, this.queryDate],
        a: "获取本站日班计划（含作业人员，分股道）",
        async: true,
      }, (rs) => {
        this.initData(rs);
        this.trackDIC.forEach(v => {
          if (rs[v.TRACK_NUM]) {
            v.detail = rs[v.TRACK_NUM];
          }
        })
        console.log("股道数据", this.trackDIC);
      });
    },
    initData(data) {
      for (var i in data) {
        var trainList = data[i];
        for (var n = 0; n < trainList.length; n++) {
          //终到立折车判断
          this.setTrainZDLZ(trainList, n);
          //计算车次开始时间 和 显示的宽度
          trainList[n].showTrainNum = trainList[n].TRAIN_NUM;
          trainList[n].bdcolor = this.colorList[trainList[n].DF_FLAG];
          if (trainList[n].DF_FLAG == "1") {//终到车
            trainList[n].sTime = trainList[n].ARR_TIME;
            trainList[n].width = this.systemParam.KYSC_D2_TL / 60 / 10 * MTLength;
            if (trainList[n].ZDLZFlag) {
              trainList[n].width = (new Date(trainList[n + 1].DEP_TIME).getTime() - new Date(trainList[n].ARR_TIME).getTime()) / 1000 / 60 / 10 * MTLength;
              trainList[n].showTrainNum = trainList[n].TRAIN_NUM + " - " + trainList[n + 1].TRAIN_NUM;
              trainList[n].bdcolor = this.colorList[4];
            }
          } else if (trainList[n].DF_FLAG == "2" && !trainList[n].ZDLZFlag) {//始发车
            trainList[n].sTime = new Date(new Date(trainList[n].DEP_TIME).getTime() - this.systemParam.KYSC_F_XX * 1000).Format("yyyy-MM-dd hh:mm:ss");
            trainList[n].width = this.systemParam.KYSC_F_XX / 60 / 10 * MTLength;
          } else if (trainList[n].DF_FLAG == "3") {//通过车
            trainList[n].sTime = trainList[n].ARR_TIME;
            trainList[n].width = (new Date(trainList[n].DEP_TIME).getTime() - new Date(trainList[n].ARR_TIME).getTime()) / 1000 / 60 / 10 * MTLength;
          }
          trainList[n].spointw = this.getitemLeft(trainList[n].sTime);
          if (trainList[n - 1]) {
            let preTrain = trainList[n - 1];
            if ((preTrain.spointw + preTrain.width) > trainList[n].spointw) {
              trainList[n].spointw = preTrain.spointw + preTrain.width;
            }
          }
        }
        data[i] = trainList.filter(item => {
          return item.showFlag;
        })
      }
    },
    //终到立折车判断
    setTrainZDLZ(trainList, n) {
      var v = trainList[n];
      v.showFlag = true;
      v.ZDLZFlag = false;//是否终到立折车
      if (v.DF_FLAG == "1") {//终到车
        var arrTime = new Date(v.ARR_TIME);
        if (trainList[n + 1] && trainList[n + 1].DF_FLAG == "2" && this.systemParam.KYZY_SJJG_JXLZBZ && this.systemParam.KYSC_D2_XX) {//终到立折车判断
          var depTime = new Date(trainList[n + 1].DEP_TIME);
          if ((depTime.getTime() - arrTime.getTime()) < (this.systemParam.KYZY_SJJG_JXLZBZ * 60 * 1000)) {
            v.ZDLZFlag = true;
          }
        }
      } else if (v.DF_FLAG == "2") {//始发车
        var depTime = new Date(v.DEP_TIME);
        if (trainList[n - 1] && trainList[n - 1].DF_FLAG == "1" && this.systemParam.KYZY_SJJG_JXLZBZ && this.systemParam.KYSC_D2_XX) {//终到立折车判断
          var arrTime = new Date(trainList[n - 1].ARR_TIME);
          if ((depTime.getTime() - arrTime.getTime()) < (this.systemParam.KYZY_SJJG_JXLZBZ * 60 * 1000)) {
            v.ZDLZFlag = true;
            v.showFlag = false;
          }
        }
      }
    },
    //绘制时间轴
    drawTrackTime() {
      this.stime = new Date(new Date(this.queryDate).getTime() - 1000 * 3600 * 24).Format("yyyy-MM-dd") + " 23:00:00";
      this.etime = new Date(new Date(this.queryDate).getTime() + 1000 * 3600 * 24).Format("yyyy-MM-dd") + " 01:00:00";
      this.stime = new Date(this.stime);
      this.etime = new Date(this.etime);
      this.tiemLength = this.zyap_getTimeLength(this.stime, this.etime);////计算时间轴长度
      this.zyap_drawtimeHours(this.stime, this.etime);//绘制时间轴
    },
    //计算时间轴长度
    zyap_getTimeLength(stime, etime) {
      let nums = (etime.getTime() - stime.getTime()) / 1000 / 60 / 10; //10分钟个数
      var rs = nums * MTLength;
      return rs;
    },
    //绘制时间轴
    zyap_drawtimeHours(stimeT, etimeT) {
      let stime = stimeT.getTime() / 1000 / 60 / 10; //10分钟个数
      let etime = etimeT.getTime() / 1000 / 60 / 10; //10分钟个数
      let dewidth = 4,//文字左偏移
        deheight = 18,//文字上偏移
        color = "#636161",//文字颜色
        fontsize = "12"; //文字大小
      let index = 0;
      for (let i = stime; i <= etime; i++) {
        let newTime = new Date(i * 1000 * 60 * 10);
        let text = "", size = "12px", height = "";
        if (index % 6 === 0) {//小时
          text = newTime.getHours();
          color = "#fff";
          size = "16px";
          height = "10px";
        } else {//分钟
          text = index % 6;
          color = "#636161"//#636161
          size = "12px";
          height = "5px";
        }

        let left = this.timeMarginLeft + index * MTLength - timeDivW / 2;//左侧padding距离+10分钟个数*10分钟长度-盒子宽度一半
        this.tiemDivList.push({
          text: text,
          color: color,
          left: left + "px",
          width: timeDivW + "px",
          size: size,
          height: height,
        });
        index++;
      }
    },
    //获取距离左侧距离
    getitemLeft(time) {
      var etime = new Date(time);
      var stime = this.stime;
      var num = (etime.getTime() - stime.getTime()) / 1000 / 60 / 10
      var rs = num * MTLength + this.timeMarginLeft;
      return rs;
    },
    //计算当前页面距离左侧的距
    scrollTime() {
      var get = document.querySelector.bind(document);
      var boxEle1 = get("#ycContent");
      var left = this.getitemLeft(this.xtsj)

      // if (this.minFlag) {
      //   left = left - 100;
      // } else {
      //   left = left - window.innerWidth / 3;
      // }
      var inWidth=get("#gdzyBox").offsetWidth;
      left = left - inWidth / 3;
      boxEle1.scrollLeft = left;
    },
    /* @info  事件处理区-----------------------------------*/
    //股道与时间联动滚动事件
    leftOnscroll() {
      if (!this.isSyncingLeftScroll) {
        this.isSyncingRightScroll = true;
        var get = document.querySelector.bind(document);
        var boxEle1 = get("#gdzyContent");
        var boxEle2 = get("#gdzyTrackName");
        boxEle1.scrollTop = boxEle2.scrollTop;
      }
      this.isSyncingLeftScroll = false;
    },
    rightOnscroll() {
      if (!this.isSyncingRightScroll) {
        this.isSyncingLeftScroll = true;
        var get = document.querySelector.bind(document);
        var boxEle1 = get("#gdzyContent");
        var boxEle2 = get("#gdzyTrackName");
        boxEle2.scrollTop = boxEle1.scrollTop;
      }
      this.isSyncingRightScroll = false;
    },
    setStnSystemParam(rs) {
      // //终到车（相对时间为终到时间
      // KYSC_D_YX:"1800",//隐现提前时间 秒：
      // KYSC_D_XX:"0",//显现提前时间：（秒
      // KYZY_SJJG_JXLZBZ:"",//终到立折判断标志：（接续立折车等的时间间隔标准上限）分钟
      // KYSC_D2_XX:"600",//终到立折车变化滞后时间（秒）-基准时间为终到时间（秒 如果没有该属性，者终到立折车按照普通 终到，始发车处理
      //KYSC_D2_TL //终到车停留显示时间分钟 600 （秒
      // //通过车（相对时间为到达时间）
      // KYSC_T_YX:"1800",//隐现提前时间： （秒
      // KYSC_T_XX:"0",//显现提前时间： （秒
      // //始发车（相对时间为始发时间）
      // KYSC_F_YX:"2400",//隐现提前时间：（秒
      // KYSC_F_XX:"1800",//显现提前时间：（秒
      this.systemParam = {
        KYSC_D_YX: "1800", KYSC_D_XX: "0", KYZY_SJJG_JXLZBZ: "", KYSC_D2_TL: "600", KYSC_T_YX: "1800", KYSC_T_XX: "0", KYSC_F_YX: "2400", KYSC_F_XX: "1800"      };
      rs.forEach((v, i) => {
        this.systemParam[v.KEY] = v.VALUE;
      });
      console.log("立折车判断时间", this.systemParam.KYZY_SJJG_JXLZBZ);
      console.log("终到车滞后时间", this.systemParam.KYSC_D2_TL);
      console.log("始发车提前时间", this.systemParam.KYSC_F_XX);
    },
    /* @info  数据处理区-----------------------------------*/


    /* @info  数据交互区-----------------------------------*/
    getBZTime() {
      var temp = com.getData({
        c: "trdm_xyy_027",
        a: "获取当前时间",
        async: false,
      });
      return temp;
    },
    getTraciDIC() {
      com.getData({
        c: "zydb_xyy_016",
        a: "获取股道字典",
        s: [this.selectTreeNode.zmlm],
      }, (r) => {
        r.forEach(v => {
          v.detail = [];
        })
        this.trackDIC = r;
      })
    },
    getStnSystemParam(stncode, callback) {
      com.getData({
        c: "trdm_lv_615",
        a: "获取车站系统配置",
        s: [stncode],
        async: false,
      }, function (rs) {
        callback(rs);
      });
    },
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {
    contentWidth() {
      var cw = this.tiemLength + this.timeMarginLeft + this.timeMarginRight;
      return cw
    },
    //当前时间轴距离左侧的距离
    timePointLeft() {
      return this.getitemLeft(this.xtsj) - 15 / 2 + "px";
    },
    //当前时间轴长度
    timePointLineHeight() {
      var rs = "calc(100% - 5px)";
      if (this.trackDIC.length > 0) {
        rs = this.trackDIC.length * this.itemOutHeight + 50 + "px";
      }
      return rs;
    },
  },
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.temp {
  width: 100%;
  height: 100%;
  background: #080d2b;

  overflow: hidden;
}
.timeX {
  background: #080d2b;
  position: relative;
  z-index: 5;
}
.contentTop {
  width: 100%;
  height: 40px;
  text-align: left;
  background: #041155;
  border-bottom: 2px solid #0c3182;
  padding-top: 5px;
  display: flex;
  justify-content: space-between;
}
.contentTop > div {
  display: flex;
  height: 100%;
}
.contentTop > div:nth-child(2) {
  justify-content: flex-end;
  align-items: center;
}
.breakLine {
  height: 100%;
  border-right: 2px solid #0c3182;
  padding: 0 15px;
}
.breakLineLeft {
  height: 100%;
  border-left: 2px solid #0c3182;
  padding: 0 15px;
  display: flex;
  align-items: center;
}
/deep/.zydb_top_tree .el-input.is-disabled {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #02eeff !important;
}
/deep/.zydb_top_tree .el-input__inner {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #02eeff !important;
}
/deep/.zydb_top_tree .el-input__suffix {
  background-color: transparent;
  right: 0;
  /* display:none; */
}
.timePoint {
  width: 15px;
  position: absolute;
  top: 5px;
  left: -20px;
  overflow: hidden;
  height: calc(100% - 5px);
  z-index: 6;
}
.timePoint div:nth-child(1) {
  width: 0;
  height: 0;
  border-top: 7px solid #fff;
  border-right: 8px solid transparent;
  border-left: 7px solid transparent;
}
.timePoint div:nth-child(2) {
  width: 1px;
  border-left: 1px solid #fff;
  margin-left: 7px;
  margin-top: 5px;
  height: calc(100% - 20px);
}
.timeItem {
  position: absolute;
  height: 100%;
  padding-top: 10px;
}
.timeItem > div {
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: flex-end;
  color: #383e57;
}
.trackName {
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  letter-spacing: 3px;
  font-weight: bold;
  font-size: 15px;
}
.trackNameItem {
  width: 100%;
  background: rgb(32, 39, 68);
  position: relative;
}
.trainItem {
  height: 23px;
  transform: translateY(-15px);
  position: absolute;
  white-space: nowrap;
  border-bottom: 2px solid;
  /* border-color:#78dcfe; */
}
.itemTotalname {
  white-space: nowrap;
}
.itemTotalname::-webkit-scrollbar {
  display: none;
}
.colorItem {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.divColor {
  display: inline-block;
  vertical-align: top;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-top: 2px;
  border-radius: 100%;
  margin-right: 5px;
}
::-webkit-scrollbar-track {
  background-color: #183b94 !important;
}
::-webkit-scrollbar-thumb {
  background-color: #567ee4 !important;
}
::-webkit-scrollbar-corner {
  background-color: #183b94 !important;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
