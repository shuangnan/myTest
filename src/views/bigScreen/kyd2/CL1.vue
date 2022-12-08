<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		旅客发送及收入
 -->
<template>
  <div class="temp">
    <div class="shadow-txt srtitle">旅客发送及收入情况</div>
    <div class="sr_fdbb">
      <div style="width:155px;" class="fdbbPress">
        <div style="display:flex">
          <div style="width:65px;text-align:center;">
            <img src="./img/lkfs.png" />
          </div>
          <div>
            <div>旅客发送量</div>
            <div style="margin-top:5px;">
              <span>{{lkfsl}}</span>万次
            </div>
          </div>
        </div>
        <div style="padding:5px 10px;">
          <div style="width:100%;height:10px;position:relative">
            <div class="fdBarMax"></div>
            <div class="bbBarMax" :style="{width:fdNumFS/fdMaxNumFS*100+'%'}"></div>
            <div class="bbBarMin" :style="{width:bbNumFS/fdMaxNumFS*100+'%'}"></div>
            <div class="fsBar" :style="{width:lkfsl/fdMaxNumFS*100+'%'}"></div>
          </div>
        </div>
      </div>
      <div style="width:155px;" class="fdbbPress">
        <div style="display:flex;justify-content:flex-end;">
          <div>
            <div>已完成收入</div>
            <div style="margin-top:5px;">
              <span>{{wcsr}}</span>万元
            </div>
          </div>
		   <div style="width:65px;text-align:center;">
            <img src="./img/wcsr.png" />
          </div>
        </div>
        <div style="padding:5px 10px;transform:rotateY(180deg)">
          <div style="width:100%;height:10px;position:relative">
            <div class="fdBarMax"></div>
            <div class="bbBarMax" :style="{width:fdNumSR/fdMaxNumSR*100+'%'}"></div>
            <div class="bbBarMin" :style="{width:bbNumSR/fdMaxNumSR*100+'%'}"></div>
            <div class="fsBar" :style="{width:wcsr/fdMaxNumSR*100+'%'}"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="srbtn">
      <tabs :tabsList="[{id:0,text:infoBtn}]" @titleClick='InfoClick'></tabs>
    </div>
    <div class="srchart">
		<chart></chart>
	</div>
  </div>
</template>

<script>
// 这里引用各种资源
import tabs from "../../../components/bigScreen/KydTabs";
import chart from "./CL1Chart.vue";
export default {
  // 组件
  components: {
	tabs,
	chart
  },
  // 数据仓库
  data() {
    return {
      selectType: "",
      infoBtn: "",
    }
  },
  // 属性
  props: {
    lkfsl: {
      type: String,
      default: "324",
    },
    bbNumFS: {
      type: String,
      default: "700",
    },
    fdNumFS: {
      type: String,
      default: "1300",
    },
    wcsr: {
      type: String,
      default: "324",
    },
    bbNumSR: {
      type: String,
      default: "700",
    },
    fdNumSR: {
      type: String,
      default: "1300",
    },
  },
  // 组件挂载完毕
  mounted() {
    this.infoBtn = "<div class='CL1infoBtn'>详情</div>"
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
	InfoClick(item){
		this.$emit("changeInfoDetailFlag");
	},

    /* @info  数据处理区-----------------------------------*/


    /* @info  数据交互区-----------------------------------*/
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {
    fdMaxNumFS() {
      return this.fdNumFS * 1.3
    },
    fdMaxNumSR() {
      return this.fdNumSR * 1.3
    },
  },
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.temp {
  width: 100%;
  height: 100%;
}
.srtitle {
  text-align: center;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}
.sr_fdbb {
  height: 75px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  position:relative;
  z-index: 3;
}
.sr_fdbb span {
  font-size: 24px;
  color: #fefffa;
  display: inline-block;
  width: 55px;
}
.fdbbPress {
  color: #959fa2;
  font-size: 12px;
}
>>> .CL1infoBtn {
  background: url("./img/btn.png");
  background-size: 100% 100%;
  font-size: 18px;
  height: 40px;
  line-height: 40px;
  width: 120px;
  margin-left: -5px;
  margin-right:-5px;
  position: relative;
  z-index: 3;
}
.fdBarMax {
  width: calc(100%);
  height: 10px;
  background: #3d3425;
  border: 1px solid #5c6375;
  border-radius: 3px;
  transform: skew(-40deg);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}
.bbBarMax {
  height: 10px;
  background: #3c4228;
  border: 1px solid #5c6375;
  border-radius: 3px;
  transform: skew(-40deg);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  border-right: 3px solid #070e34;
}
.bbBarMin {
  height: 10px;
  background: #3c4258;
  border: 1px solid #5c6375;
  border-radius: 3px;
  transform: skew(-40deg);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  border-right: 3px solid #070e34;
}
.fsBar {
  height: 10px;
  background: #fefffa;
  border-radius: 3px;
  transform: skew(-40deg);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 4;
  box-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
}
.srbtn {
  margin-top: -25px;
}
.srchart{
	margin:10px;
	width:calc(100% - 20px);
	height:calc(100% - 140px);
	background:url("./img/fssrtab.png");
	background-size: 100% 100%;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
