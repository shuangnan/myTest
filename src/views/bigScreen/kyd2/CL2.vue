<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		今日车补餐补收入
 -->
<template>
  <div class="temp">
    <div class="srBGitem" :style="{transform: 'translateX('+transX+')'}"></div>
    <div class="srItem" style="width:100%;height:50%;">
      <div class="srItem1">
        <CL2Cir :colorList="colorList1"></CL2Cir>
      </div>
      <div class="srItem2">
        <img src="./img/chebsr.png" style="width:100%" />
      </div>
      <!-- 名称 -->
      <div class="srTitleItem">今日车补收入情况</div>
      <!-- 收入 -->
      <div class="srTextItem">
        <span>321</span>万元
      </div>
      <!-- 同比 -->
      <div class="tbItem">
        12%
        <img src="../../../assets/imgs/h-speedRailway/down.png" />
      </div>
    </div>
    <div class="srItem" style="width:100%;height:50%;">
      <div class="srItem1">
        <CL2Cir :colorList="colorList2" type="2"></CL2Cir>
      </div>
      <div class="srItem2">
        <img src="./img/canbsr.png" style="width:100%" />
      </div>
      <!-- 名称 -->
      <div class="srTitleItem">今日餐补收入情况</div>
      <!-- 收入 -->
      <div class="srTextItem">
        <span>321</span>万元
      </div>
      <!-- 同比 -->
      <div class="tbItem">
        12%
        <img src="../../../assets/imgs/h-speedRailway/down.png" />
      </div>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import CL2Cir from "./CL2Cir.vue";
export default {
  // 组件
  components: {
    CL2Cir
  },
  // 数据仓库
  data() {
    return {
      colorList1: ["rgb(169,152,106)", "rgb(43,38,61)"],
      colorList2: ["rgb(166,104,27)", "rgb(43,38,61)"],
      transX: "0%",
    }
  },
  // 属性
  props: {

  },
  // 组件挂载完毕
  mounted() {
	  setTimeout(() => {
		  this.transX = "100%";
	  }, 100);
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/


    /* @info  数据处理区-----------------------------------*/


    /* @info  数据交互区-----------------------------------*/
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.temp {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.srItem {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.srItem2 {
  width: 45%;
  height: 100%;
  padding-top: 4%;
}
.srTitleItem {
  position: absolute;
  width: 25%;
  height: 30px;
  right: 0px;
  top: 10%;
  text-align: left;
  text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
  color: #c2ccf5;
  font-size: 12px;
}
.srTextItem {
  position: absolute;
  width: 25%;
  height: 30px;
  right: 0px;
  top: 36%;
  text-align: left;
  text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
  color: #c2ccf5;
  font-size: 12px;
}
.srTextItem span {
  font-size: 24px;
  padding: 0 3px;
  letter-spacing: 2px;
  font-weight: bold;
}
.tbItem {
  position: absolute;
  background: #070e34;
  width: 25%;
  height: 30px;
  right: 0px;
  top: 66%;
  text-align: left;
  line-height: 30px;
  font-size: 14px;
  color: #c2ccf5;
  text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
}
.srItem1 {
  width: 28.5%;
  height: 100%;
}
.srBGitem {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgb(7, 14, 52);
  z-index: 2;
  transition: all 2s;
  
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
