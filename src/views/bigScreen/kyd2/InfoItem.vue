<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		旅客发送及收入
 -->
<template>
  <div class="temp">
    <div style="width:100%;height:30px;">
        <tabs :tabsList="[{id:0,text:title}]"></tabs>
    </div>
    <div style="width:100%;height:calc(100% - 30px);">
        <chart :dwText="dwText"></chart>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import tabs from "../../../components/bigScreen/KydTabs";
import chart from "./InfoChart.vue";
export default {
  // 组件
  components: {
	tabs,
	chart
  },
  // 数据仓库
  data() {
    return {
      
    }
  },
  // 属性
  props: {
    title:{
        type:String,
        default:"",
    },
    dwText:{
        type:String,
        default:"",
    }
  },
  // 组件挂载完毕
  mounted() {

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
  computed: {
    
  },
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
    .temp{
        width:100%;
        height:100%;
    }
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
