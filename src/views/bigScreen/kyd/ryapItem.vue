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
      style="width:40px;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;background:rgb(41,55,120);"
    >
      <div v-for="(item,index) in title.split('')" :key="index">{{item}}</div>
    </div>
    <div style="width:160px;height:100%;display:flex;align-items:center;justify-content:center;">
      <div style="height:35px;">
        <NumScroll :num="'13579'" type="1"></NumScroll>
      </div>
    </div>
    <div style="width:260px;height:100%">
        <ryapItemPie :dataList="ryapTootalData"></ryapItemPie>
    </div>
    <div style="width:calc(100% - 460px);height:100%;" :class="[title=='动车'?'ryap1':'ryap2']"></div>
  </div>
</template>

<script>
// 这里引用各种资源
// import InterFace from "../../service/index.js";
import NumScroll from "./NumScroll";
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
        ryapTootalData:[
            {name:"乘务人员",value:"2000"},{name:"餐饮人员",value:"1562"},{name:"司机",value:"825"},
        ]
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

<!-- 私有样式 -->
<style scoped="scoped">
.ryap1 {
  background: url(./img/ryap1.jpg) no-repeat;
}
.ryap2 {
  background: url(./img/ryap2.jpg) no-repeat;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
