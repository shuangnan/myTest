<!--
	客运站左上角 收入与发送
-->
<template>
  <div style="width:100%;height:100%;padding:0 16px;" @mouseout="autoChangePageFlag=true" @mouseover="autoChangePageFlag=false">
    <div ref="carouselCon" style="width:100%;height:80%;positon:relative">
      <div
        v-if="stnListData.length>2"
        style="position:absolute;left:50%;top:10px;transform: translateX(-50%);z-index:2"
      >
        <el-popover placement="right" trigger="hover" popper-class="customPopper1">
          <div>
            <div class="stnItem" @click="stnSelect(item.STN_CODE)" v-for="item in stnListData" :key="item.STN_CODE">{{item.STN_NAME}}</div>
          </div>
          <div style="width:100%;" slot="reference">
            <span style="color:#52b1f3">{{stnListData.length}}</span>
          </div>
        </el-popover>
      </div>
      <el-carousel
        ref="carousel"
        indicator-position="none"
        :height="carouselHeight"
        :autoplay="false"
        @change="carouselChange"
        style="width:100%;z-index:1;"
      >
        <el-carousel-item v-for="(item,index) in Math.ceil(stnListData.length/2)" :key="index">
          <div style="width:100%;height:100%;display:flex">
            <div style="width:50%;height:100%;margin-left:10px;">
              <IncomeAndSendPie
                ref="SSS"
                :dataList="[stnListData[2*index].data_fs,stnListData[2*index].data_sr]"
                :srColorList="srColorList"
                :fsColorList="fsColorList"
                :xzFlag="selectIndex===(2*index)"
                :stnCode="stnListData[2*index].STN_CODE"
                @stnSelect="stnSelect"
              ></IncomeAndSendPie>
            </div>
            <div style="width:50%;height:100%;margin-left:-20px;" v-if="stnListData[index*2+1]">
              <IncomeAndSendPie
                ref="SSS"
                :dataList="[stnListData[2*index+1].data_fs,stnListData[2*index+1].data_sr]"
                :srColorList="srColorList"
                :fsColorList="fsColorList"
                :xzFlag="selectIndex===(2*index+1)"
                :stnCode="stnListData[2*index+1].STN_CODE"
                @stnSelect="stnSelect"
              ></IncomeAndSendPie>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div
      style="width:100%;height:20%;background:rgb(30,37,92);padding:0 20px;padding-top:10px;"
      @mouseout="initInterval"
    >
      <div style="width:100%;height:100%;position:relative;">
        <div
          ref="bar"
          style="width:100%;height:10px;background:rgba(184, 100, 90, 1);border-radius:5px;overflow:hidden;"
        >
          <div
            style="height:100%;float:left;"
            v-for="(item,index) in fxData"
            :key="index"
            :style="{width:item.p+'%',background:incomeSendDataColorList[index]}"
            @mouseenter="showTip(item,index)"
          ></div>
        </div>
        <div
          ref="HBarTip"
          class="tip"
          :class="[tip.className]"
          :style="{top:tip.top,left:tip.left,display:tip.display}"
        >
          <div>{{curItem.text}}：{{curItem.value}}（{{Number(curItem.p).toFixed(2)+"%"}}）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IncomeAndSendPie from "./IncomeAndSendPie"; //动车普车 收入发送人数
import IData from './InitData.js'
export default {
  data() {
    return {
      stnListData: [],
      stnListIndex: 0,
      incomeSendDataColorList: ["rgb(31,171,232)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)", "rgb(0,255,255)",
        "rgb(247,161,148)", "rgb(172,80,67)", "rgb(109,35,24)", "rgb(74,29,23)", "rgb(248,204,201)"],
      srColorList: ["rgb(118,64,150)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)"],
      fsColorList: ["rgb(81,104,200)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)"],
      carouselHeight: "200px",
      stnList: ["成都", "贵阳", "眉山东", "重庆北"],
      fxData: [
        { text: "成都", value: "325", p: "" },
        { text: "贵阳", value: "260", p: "" },
        { text: "眉山东", value: "210", p: "" },
        { text: "重庆北", value: "230", p: "" },
      ],
      tip: {
        left: -100,
        top: "15px",
        className: 'tipTop',
      },
      curItem: {},
      interVal: null,
      dataIndex: 0,
      selectIndex: -1,//当前选中站
      autoChangePageFlag:true,//是否允许页面自动切换
    }
  },
  props: {
    stnCode: '',//登录人当前车站
  },
  // 组件挂载完毕
  mounted() {
    this.carouselHeight = this.$refs.carouselCon.offsetHeight - 8 + "px";
    this.initInterval();
  },
  created() {
    this.fxData.forEach(v => {
      v.p = v.value / this.fxCount * 100;
    });
    this.getGLStnList();
  },
  // 方法
  methods: {
    /**-------------------------响应事件-------------------------------*/
    /**-------------------------数据展示-------------------------------*/
    /**-------------------------获取数据-------------------------------*/
    showTip(item, index, auto) {
      let leftP = 0;
      this.fxData.forEach((v, i) => {
        if (i < index) {
          leftP += Number(v.p);
        }
      });
      leftP = leftP + item.p / 2;
      if(!this.$refs.bar){
        return;
      }
      var widthAll = this.$refs.bar.offsetWidth;
      this.curItem = item;
      var realLeft = widthAll * leftP / 100;
      this.tip.left = realLeft + "px";
      this.tip.display = "block";
      if (!auto) {
        if (this.interVal) {
          clearInterval(this.interVal);
        }
      }
    },
    initInterval() {
      if (this.interVal) {
        clearInterval(this.interVal);
      }
      this.interVal = setInterval(() => {
        const tempItem = this.fxData[this.dataIndex];
        this.showTip(tempItem, this.dataIndex, true);
        if (this.dataIndex === 0&&this.autoChangePageFlag) {
          this.selectIndex += 1;
          if (this.selectIndex >= this.stnListData.length) {
            this.selectIndex = 0;
          }
        }
        this.dataIndex++;
        if (this.dataIndex >= this.fxData.length) {
          this.dataIndex = 0;
        }
      }, 2000);
    },
    changeShowStn() {
      this.$refs.carousel.setActiveItem(parseInt(this.selectIndex / 2));
      this.stnListData.forEach((v, i) => {
        if (this.selectIndex <= i && i <= this.selectIndex + 1 && v.queryZD.length === 0 && this.selectIndex % 2 === 0) {
          console.log("翻页", this.selectIndex)
          this.queryWCFDBB(v.STN_CODE);
        }
      })
    },
    // 获取数据
    getGLStnList() {
      if (this.stnCode) {
        const date = new Date().Format("yyyy-MM-dd");
        IData.getGLStnList(this.stnCode, date, 'stnname', (rs) => {
          rs.forEach(v => {
            v.fswc = 0;
            v.fsbb = 0;
            v.fsfd = 0;
            v.srwc = 0;
            v.srbb = 0;
            v.srfd = 0;
            v.data_sr = [];
            v.data_fs = [];
            v.queryZD = [];
          })
          this.stnListData = rs;
          this.selectIndex=-1;
          this.dataIndex=0
        })
      }
    },
    queryWCFDBB(stncode) {
      const date = new Date().Format("yyyy-MM-dd");
      var sdate = date.substring(0, 8) + "01";
      let dateMonth = sdate.replace(/-/g, "").substring(0, 6);
      this.stnListIndex = 0;
      IData.queryStnWCTotal(stncode, "1", sdate.replace(/-/g, ""), date.replace(/-/g, ""), this.queryStnWCTotal);//获取本月已完成发送人数
      IData.queryStnWCTotal(stncode, "2", sdate.replace(/-/g, ""), date.replace(/-/g, ""), this.queryStnWCTotal);//获取本月已完成收入

      IData.queryHYNum_J(stncode, dateMonth, 1, this.queryBBFD);//获取必保收入
      IData.queryHYNum_J(stncode, dateMonth, 5, this.queryBBFD);//获取必保发送
      IData.queryHYNum_J(stncode, dateMonth, 3, this.queryBBFD);//获取奋斗收入
      IData.queryHYNum_J(stncode, dateMonth, 4, this.queryBBFD);//获取奋斗发送
    },
    queryStnWCTotal(rs, type, stnString) {
      this.stnListIndex += 1;
      var datatype = "", queryZD = [];
      if (type == "1") {//发送
        datatype = "fswc";
      } else if (type == "2") {//收入
        datatype = "srwc";
      }
      this.stnListData.forEach(v => {
        if (v.STN_CODE == stnString) {
          v.queryZD.push(datatype);
          queryZD = v.queryZD;
        }
      });
      if (rs.length > 0) {
        var num = rs[0].DATA_NUM;
        if (!rs[0].DATA_NUM) {
          num = 0;
        }
        this.stnListData.forEach(v => {
          if (v.STN_CODE == stnString) {
            v[datatype] = Number(num);
          }
        });
      }
      if (queryZD.length === 6) {
        this.initFSSRPieData();
      }
    },
    queryBBFD(data, type, stnString) {
      this.stnListIndex += 1;
      let datatype = "", queryZD = [];
      if (type == "1") {
        datatype = "srbb";
      }
      if (type == "5") {
        datatype = "fsbb";
      }
      if (type == "3") {
        datatype = "srfd";
      }
      if (type == "4") {
        datatype = "fsfd";
      }
      this.stnListData.forEach(v => {
        if (v.STN_CODE == stnString) {
          v.queryZD.push(datatype);
          queryZD = v.queryZD;
        }
      });
      if (data.length > 0) {
        var num = "";
        num = data[0].ZB_PLAN;
        if (type == "1") {
          num = data[0].ZB_PLAN * 10000;
        }
        if (type == "3") {
          num = data[0].ZB_PLAN * 10000;
        }
        this.stnListData.forEach(v => {
          if (v.STN_CODE == stnString) {
            v[datatype] = Number(num);
          }
        });
      }
      if (queryZD.length === 6) {
        this.initFSSRPieData();
      }
    },
    initFSSRPieData() {
      //计算 必保，奋斗，空白 在饼图中的数据
      this.stnListData.forEach((v, i) => {
        //收入计算
        let data_sr = [];
        data_sr.push({ name: "收入", value: v.srwc });
        var srbb = v.srbb - v.srwc;
        srbb = srbb <= 0 ? 0 : srbb;
        data_sr.push({ name: "必保", value: srbb });
        var srfd = v.srfd - srbb - v.srwc;
        srfd = srfd <= 0 ? 0 : srfd;
        data_sr.push({ name: "奋斗", value: srfd });
        var srK = v.srfd / 3 * 4 - srfd - srbb - v.srwc;
        srK = srK <= 0 ? 0 : srK;
        if(v.srfd===0){
          srK=v.srwc/3;
        }
        data_sr.push({ name: "", value: srK });
        v.data_sr = data_sr;
        //发送计算
        let data_fs = [];
        data_fs.push({ name: "发送", value: v.fswc });
        var fsbb = v.fsbb - v.fswc;
        fsbb = fsbb <= 0 ? 0 : fsbb;
        data_fs.push({ name: "必保", value: fsbb });
        var fsfd = v.fsfd - fsbb - v.fswc;
        fsfd = fsfd <= 0 ? 0 : fsfd;
        data_fs.push({ name: "奋斗", value: fsfd });
        var fsK = v.fsfd / 3 * 4 - fsfd - fsbb - v.fswc;
        fsK = fsK <= 0 ? 0 : fsK;
        if(v.fsfd===0){
          fsK=v.fswc/3;
        }
        data_fs.push({ name: "", value: fsK });
        v.data_fs = data_fs;
        this.$set(this.stnListData, i, v);
      })
      console.log("管理车站", this.stnListData);
      this.$nextTick(() => {
        this.$refs.SSS.forEach(v => {
          v.initCharts();
        });
      });
    },
    carouselChange(activeindex, oldindex) {
      this.selectIndex = activeindex * 2;
    },
    stnSelect(stncode) {
      this.stnListData.forEach((v, i) => {
        if (v.STN_CODE == stncode) {
          this.selectIndex = i;
        }
      });
    }
  },
  // 监视属性
  watch: {
    "selectIndex": function () {
      this.changeShowStn();
    },
    "stnCode": function () {
      this.getGLStnList();
    }
  },
  // 计算属性
  computed: {
    fxCount: function () {
      var rs = 0;
      this.fxData.forEach(v => {
        rs += parseInt(v.value);
      })
      return rs;
    }
  },
  // 组件
  components: {
    IncomeAndSendPie,
  },
}
</script>

<style scoped>
>>> .el-icon-arrow-left {
  font-weight: bold;
  font-size: 20px;
  color: #52b1f3;
}
>>> .el-icon-arrow-right {
  font-weight: bold;
  font-size: 20px;
  color: #52b1f3;
}

.tip {
  position: absolute;
  display: none;
  min-width: 100px;
  padding: 5px;
  background-image: linear-gradient(
    to right,
    rgba(62, 130, 196, 0.9),
    rgba(62, 130, 196, 0.4)
  );
  transition: all 0.3s;
  transform: translateX(-50%);
  font-size: 12px;
  white-space: nowrap;
}
.tipTop::before {
  content: "";
  position: absolute;
  width: 0px;
  height: 0px;
  border: 5px solid transparent;
  border-bottom: 8px solid rgba(62, 130, 196, 0.5);
  /* border-right: 5px solid rgba(62, 130, 196, .8); */
  left: 50%;
  top: -12px;
  /* transform: rotate(45deg); */
  z-index: -1;
  /* background-image: linear-gradient(to right, rgba(62, 130, 196, .8), rgba(62, 130, 196, .2)); */
}
.stnItem{
  color:#fff;
  padding:5px;
  cursor: pointer;
}
.stnItem:hover{
  background-color: #52b1f3;
}
</style>
