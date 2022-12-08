<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		已完成发送、收入
 -->
<template>
  <div class="con">
    <div>
      <Progress
        :imgurl="require('../../../assets/imgs/h-speedRailway/wc_l.png')"
        :imgurl1="require('../../../assets/imgs/h-speedRailway/wc_l1.png')"
        text1="已完成发送(月)"
        text2="342,万人次"
        text2Color="#23f9fb"
        pgColor="#093972"
        pgWCColor="#09bef7"
        :wcNum="fswc"
        :bbNum="fsbb"
        :fdNum="fsfd"
        ydColor="#0c8ac9"
      ></Progress>
    </div>
    <div>
      <Progress
        :imgurl="require('../../../assets/imgs/h-speedRailway/wc_r.png')"
        :imgurl1="require('../../../assets/imgs/h-speedRailway/wc_r1.png')"
        text1="已完成收入(月)"
        text2="342,万元"
        text2Color="#f89f93"
        pgColor="#39335d"
        pgWCColor="#f89f93"
        :wcNum="srwc"
        :bbNum="srbb"
        :fdNum="srfd"
        ydColor="#c46d62"
      ></Progress>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import Progress from "./Progress.vue";
import IData from './InitData.js'
export default {
  // 组件
  components: {
    Progress
  },
  // 数据仓库
  data() {
    return {
      fswc: "500",
      fsbb: "600",
      fsfd: "800",
      srwc: "300",
      srbb: "400",
      srfd: "500"
    }
  },
  // 属性
  props: {
	  stnCode: '',//登录人当前车站
  },
  // 组件挂载完毕
  mounted() {
	// document.querySelector("title").innerHTML = "页面名称";
	this.queryWCFDBB();
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/


    /* @info  数据处理区-----------------------------------*/


    /* @info  数据交互区-----------------------------------*/
    // 获取数据
    queryWCFDBB() {
      const date = new Date().Format("yyyy-MM-dd");
      var sdate = date.substring(0, 8) + "01";
      let dateMonth = sdate.replace(/-/g, "").substring(0, 6);
      IData.queryStnWCTotal(this.stnCode, "1", sdate.replace(/-/g, ""), date.replace(/-/g, ""), this.queryStnWCTotal);//获取本月已完成发送人数
      IData.queryStnWCTotal(this.stnCode, "2", sdate.replace(/-/g, ""), date.replace(/-/g, ""), this.queryStnWCTotal);//获取本月已完成收入

      IData.queryHYNum_J(this.stnCode, dateMonth, 1, this.queryBBFD);//获取必保收入
      IData.queryHYNum_J(this.stnCode, dateMonth, 5, this.queryBBFD);//获取必保发送
      IData.queryHYNum_J(this.stnCode, dateMonth, 3, this.queryBBFD);//获取奋斗收入
      IData.queryHYNum_J(this.stnCode, dateMonth, 4, this.queryBBFD);//获取奋斗发送
    },
    queryStnWCTotal(rs, type, stnString) {
      var datatype = "", queryZD = [];
      if (type == "1") {//发送
        datatype = "fswc";
      } else if (type == "2") {//收入
        datatype = "srwc";
	  }
	  var num="0";
      if (rs.length > 0) {
        var num = rs[0].DATA_NUM;
        if (!rs[0].DATA_NUM) {
          num = "0";
		}
		num=(num/10000).toFixed(3)+"";
	  }
	  this[datatype]=num;
    },
    queryBBFD(data, type, stnString) {
      this.stnListIndex += 1;
      let datatype = "";
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
	  var num = "0";
      if (data.length > 0) {
        num = data[0].ZB_PLAN;
        if (type == "5") {
          num = data[0].ZB_PLAN / 10000+"";
        }
        if (type == "4") {
          num = data[0].ZB_PLAN / 10000+"";
        }
	  }
	  this[datatype]=num;
    },
  },
  // 监视属性
  watch: {
	  "stnCode": function () {
      this.queryWCFDBB();
    }
  },
  // 计算属性
  computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.con {
  display: inline-block;
  width: 900px;
  height: 100%;
}

.con > div {
  display: inline-block;
  width: 44%;
  height: 100%;
  padding: 10px;
  margin: 0 3%;
  border: 2px solid #06315b;
  background: rgba(6, 23, 95, 0.8);
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
