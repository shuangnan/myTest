<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		人员安排
 -->
<template>
  <!-- <div class="test">

  </div>-->
  <div style="width:100%;height:100%;display:flex;">
    <div
      class="titleBG"
      style="width:40px;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;"
    >
      <div v-for="(item,index) in title.split('')" :key="index">{{item}}</div>
    </div>
    <div style="width:170px;height:100%;display:flex;align-items:center;justify-content:center;">
      <div style="height:35px;">
        <NumScroll :num="'135795'" type="1"></NumScroll>
      </div>
    </div>
    <div style="width:300px;height:100%">
      <ryapItemPie :dataList="ryapTootalData" :colorList="colorList"></ryapItemPie>
    </div>
    <div class="titleBG" style="width:calc(100% - 510px);height:100%;padding:5px;">
      <div ref="ryapCirList" class="ryapCirList">
        <div
          class="ryapCir"
          v-for="(item,index) in ryapTootalData"
          :key="index"
          :style="{width:ryapCirWidth}"
        >
          <div></div>
          <div :style="{borderColor:colorList[index]}"></div>
          <div></div>
          <div :style="{borderColor:colorList[index]}"></div>
          <div class="ryapCirText">{{item.value}}</div>
          <div class="ryapCirName">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
// import InterFace from "../../service/index.js";
import NumScroll from "../../bigScreen/kyz/NumScroll";
import ryapItemPie from "./ryapItemPie";
export default {
  // 组件
  components: {
    NumScroll,
    ryapItemPie,

  },
  // 数据仓库
  data() {
    return {
      ryapTootalData: [
        { name: "乘务人员", value: "2000" }, { name: "餐饮人员", value: "1562" }, { name: "司机", value: "825" },
      ],
      ryapCirWidth: "200px;",
      colorList: ["rgb(31,171,232)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)", "rgb(0,255,255)",
        "rgb(247,161,148)", "rgb(172,80,67)", "rgb(109,35,24)", "rgb(74,29,23)", "rgb(248,204,201)"]
    }
  },
  // 属性
  props: {
    title: { type: String, default: "" },
    countNum: { type: Array, default: () => { return [] } },
  },
  // 组件挂载完毕
  mounted() {
    // document.querySelector("title").innerHTML = "页面名称";
    this.ryapCirWidth = this.$refs.ryapCirList.offsetHeight + "px";
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/


    /* @info  数据处理区-----------------------------------*/


    /* @info  数据交互区-----------------------------------*/
    // 获取数据
    getData() {

    }
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {},
}
</script>
<style>
</style>
<!-- 私有样式 -->
<style scoped="scoped">
.ryapCirList {
  width: 100%;
  height: calc(100% - 20px);
  display: flex;
}
.ryapCir {
  height: 100%;
  margin-left: 15px;
  position: relative;
  padding: 8px;
}
.ryapCir > div {
  float: left;
  width: 50%;
  height: 50%;
}
.ryapCir > div:nth-child(1) {
  border-top: 7px solid #557a753a;
  border-left: 7px solid #557a753a;
  border-top-left-radius: 100%;
}
.ryapCir > div:nth-child(2) {
  border-top: 7px solid #3999b6e8;
  border-right: 7px solid #3999b6e8;
  border-top-right-radius: 100%;
}
.ryapCir > div:nth-child(3) {
  border-bottom: 7px solid #557a753a;
  border-left: 7px solid #557a753a;
  border-bottom-left-radius: 100%;
}
.ryapCir > div:nth-child(4) {
  border-bottom: 7px solid #3999b6e8;
  border-right: 7px solid #3999b6e8;
  border-bottom-right-radius: 100%;
}
.ryapCir > .ryapCirText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
}
.ryapCir > .ryapCirName {
  position: absolute;
  top: calc(100% - 5px);
  left: 0;
  text-align: center;
  width: 100%;
  height: auto;
}
.titleBG {
  background: #15293f7a;
}
</style>
<!-- 公有样式（会影响全局） -->

