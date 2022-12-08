<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		股道占用、车辆段库面情况
 -->
<template>
  <div class="temp">
    <div style="width:100%;height:30px;">
      <tabs :tabsList="buttons" @titleClick="InfoClick"></tabs>
    </div>

    <div style="width:100%;height:calc(100% - 30px);">
      <!-- <img src="./img/gdzyqk.png" style="width:100%;height:105%;" /> -->
      <GDZY></GDZY>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import tabs from "../../../components/bigScreen/KydTabs";
import GDZY from "./GDZY.vue";
export default {
  // 组件
  components: {
    tabs,
    GDZY
  },
  // 数据仓库
  data() {
    return {
      buttons: [
        { id: 0, text: '股道占用情况' },
        { id: 1, text: '<div class="cr2_cldknqk">车辆段库内情况<div>1</div></div>' },
      ]
    }
  },
  // 属性
  props: {

  },
  // 组件挂载完毕
  mounted() {

  },
  // 方法
  methods: {
    InfoClick(item) {

    }
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
  /* background: url(img/cr2.png) no-repeat;
		background-size: 100% 100%; */
}
>>> .cr2_cldknqk {
  position: relative;
}
>>> .cr2_cldknqk div {
  border-radius: 100%;
  font-size: 12px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #f52323;
  /* transform: scale(0.8); */
  right: -5px;
  top: -5px;
  position: absolute;
  z-index: 5;
  font-weight: bold;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
