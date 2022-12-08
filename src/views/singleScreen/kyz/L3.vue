<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		设备管控
 -->
<template>
  <div ref="con" style="width: 100%;height:100%;color: #aec0f2;font-weight: bold;">
    <el-carousel
      indicator-position="bottom"
      direction="horizontal"
      :height="carouselHeight"
      :autoplay="true"
      :interval="4000"
      arrow="never"
    >
      <el-carousel-item v-for="(arr,index) in rows" :key="index">
        <div class="listBox" >
          <div class="listItem" v-for="item in arr" :style="{height:liHeight}" :key="item.k">
            <img :src="icons[item.k]" style="height:25px;" />
            <div style="font-weight:bold;color:#fff;">
              {{icons[item.k+'_n']}}
            </div>
            <div>
              总数：{{item.ALL_COUNT}}
            </div>
            <div>
              <div class="gzbxBox">
              <div style="color:#b76c3e">
                故障：{{item.BREAK_COUNT}}
              </div>
              <div style="color:#88d54f">
                维修：{{item.FIX_COUNT}}
              </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <ul class="list">
          <li v-for="item in arr" :style="{height:liHeight}" :key="item.k">
            <div class="pic-con">
              <img :src="icons[item.k]" style="height:25px;" />
              <div :style="{top:zsTop}">总数：{{item.ALL_COUNT}}</div>
            </div>
            <div class="tit" :style="{top:titleTop}">{{icons[item.k+'_n']}}</div>
            <div class="gz-wx" :style="{top:gzwxTop}">
              <div class="gz">故障：{{item.BREAK_COUNT}}</div>
              <div class="wx">维修：{{item.FIX_COUNT}}</div>
            </div>
          </li>
        </ul> -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
// 这里引用各种资源
import C from "../../../assets/com.js";
export default {
  // 组件
  components: {},
  // 数据仓库
  data() {
    return {
      icons: {
        anjian_n: "安检系统",
        baojie_n: "保洁设备",
        dianti_n: "电梯系统",
        xingbao_n: "行包系统",
        jidian_n: "机电系统",
        kepiao_n: "客票系统",
        nvfu_n: "旅服系统",
        luantong_n: "暖通系统",
        qita_n: "其它设备",
        shangshui_n: "上水设施",
        xiwu_n: "吸污设备",
        xunshi_n: "巡视系统",
        zhantai_n: "站台系统",
        // 小图标
        anjian0: require("./img/icon_anjian0.png"), //安检系统
        baojie0: require("./img/icon_baojie0.png"), //保洁系统
        dianti0: require("./img/icon_dianti0.png"), //电梯系统
        xingbao0: require("./img/icon_xingbao0.png"), //行包系统
        jidian0: require("./img/icon_jidian0.png"), //机电系统
        kepiao0: require("./img/icon_kepiao0.png"), //客票系统
        nvfu0: require("./img/icon_nvfu0.png"), //旅服系统
        luantong0: require("./img/icon_luantong0.png"), //暖通系统
        qita0: require("./img/icon_qita0.png"), //其它设备
        shangshui0: require("./img/icon_shangshui0.png"), //上水系统
        xiwu0: require("./img/icon_xiwu0.png"), //吸污设备
        xunshi0: require("./img/icon_xunshi0.png"), //巡视系统
        zhantai0: require("./img/icon_zhantai0.png"), //站台系统
        // 大图标
        anjian: require("./img/icon_anjian.png"), //安检系统
        baojie: require("./img/icon_baojie.png"), //保洁系统
        dianti: require("./img/icon_dianti.png"), //电梯系统
        xingbao: require("./img/icon_xingbao.png"), //行包系统
        jidian: require("./img/icon_jidian.png"), //机电系统
        kepiao: require("./img/icon_kepiao.png"), //客票系统
        nvfu: require("./img/icon_nvfu.png"), //旅服系统
        luantong: require("./img/icon_luantong.png"), //暖通系统
        qita: require("./img/icon_qita.png"), //其它设备
        shangshui: require("./img/icon_shangshui.png"), //上水系统
        xiwu: require("./img/icon_xiwu.png"), //吸污设备
        xunshi: require("./img/icon_xunshi.png"), //巡视系统
        zhantai: require("./img/icon_zhantai.png"), //站台系统
      },
      carouselHeight: "200px",
      total: 100,
      rows: [],
      liHeight: "80px",
      zsTop: "13px",
      titleTop: "38px",
      gzwxTop: "55px",
    }
  },
  // 属性
  props: {
    unitid: {
      type: String,
      default: "",
    }
  },
  created() {
    this.getData();
  },
  // 组件挂载完毕
  mounted() {
    //document.querySelector("title").innerHTML = "";//页面名称
    const h = this.$refs.con.offsetHeight - 5;
    this.carouselHeight = h + "px";
    var Hpid = h /122;
    this.liHeight = 105 * Hpid + "px";
    this.zsTop = 13 * Hpid + "px";
    this.titleTop = 35 * Hpid + "px";
    this.gzwxTop = 55 * Hpid + "px";
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/


    /* @info  数据处理区-----------------------------------*/
    sliceArr(array, size) {
      var result = [];
      for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
      }
      return result;
    },

    /* @info  数据交互区-----------------------------------*/
    // 获取数据
    getData() {
      const dicKeys = [
        { k: "anjian", xind: 'x1' },
        { k: "baojie", xind: 'x8' },
        { k: "dianti", xind: 'x4' },
        { k: "jidian", xind: 'x7' },
        { k: "kepiao", xind: 'x2' },
        { k: "nvfu", xind: 'x3' },
        { k: "luantong", xind: 'x5' },
        { k: "shangshui", xind: 'x6' }
      ];
      var sdate = new Date().Format("yyyy-MM-01");
      var edate = new Date().Format("yyyy-MM-dd");
      C.getData({
        c: "trdm_ys_339",
        s: [sdate, edate],
        o: [this.unitid.toUpperCase()],
        a: "【trdm_ys_339】设备管控数据",
        async: true,
      }, (r) => {
        r.forEach(v => {
          dicKeys.forEach(m => {
            if (v.KIND == m.xind) {
              v.k = m.k;
            }
          });
        });
        this.rows = this.sliceArr(r, 4);
        console.log("设备管控数据", r);
      })
    }
  },
  // 监视属性
  watch: {
    unitid(){
      this.getData();
    }
  },
  // 计算属性
  computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}
.list > li {
  position: relative;
  display: inline-block;
  width: 150px;
  height: 110px;
  margin-top: 25px;
  background: url(img/picL31.png) no-repeat;
  background-size: 100% 100%;
}
.pic-con {
  margin-top: -18px;
}
.pic-con > div {
  position: absolute;
  text-align: center;
  left: 0;
  width: 100%;
}
.tit {
  color: #fafafa;
  letter-spacing: 2px;
  font-size: 14px;
  position: absolute;
  left: 0px;
  width: 100%;
  text-align: center;
}
.gz-wx {
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  width: 100%;
  position: absolute;
  left: 0px;
}
.gz-wx > .gz {
  color: #b76c3e;
}
.gz-wx > .wx {
  color: #88d54f;
}
>>> .el-carousel__indicators--horizontal {
  width: 70%;
  text-align: center;
}
>>> .el-carousel__button {
  width: 10px;
}
>>>.el-carousel__indicator--horizontal{
  padding:10px 4px;
}
.listBox{
  display:flex;
  align-items: center;
  justify-content: space-around;
  padding:5px 0px;
  font-size: 12px;
  font-weight: normal;
}
.listItem{
  height:100%;
  width:calc(25% - 10px);
  background:url('./img/L3_box.png') no-repeat;
  background-size: 100% 100%;
  display:flex;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
  flex-direction: column;
  padding:10px 0;
}
.gzbxBox{
  background:url('./img/L3_box1.png') no-repeat;
  background-size: 100% 100%;
  padding:5px 10px;
  margin-top:3px;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
