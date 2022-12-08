<!-- 
 *公安辖区
 -->
<template>
  <div style="color:white;background:transparent;"></div>
</template>

<script>
// 这里引用各种资源
import C from "../../../assets/com.js";
export default {
  // 组件
  components: {},
  // 属性
  props: {},
  // 数据仓库
  data() {},
  // 组件挂载完毕
  mounted() {},
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    /* @info  数据处理区-----------------------------------*/
    /* @info  数据交互区-----------------------------------*/
    // 获取数据
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {}
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
</style>
<!-- 公有样式（会影响全局） -->
<style>
#app {
  background: transparent !important;
}
</style>
