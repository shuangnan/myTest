<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		旅客发送及收入
 -->
<template>
  <div class="temp">
    <div style="float:left;width:50%;height:100%;border-right:2px solid #38333a">
        <div class="infoItem">
            <InfoItem title="旅客输送量" dwText="万人"></InfoItem>
        </div>
        <div class="infoItem">
            <InfoItem title="动普车旅客运输量" dwText="万车"></InfoItem>
        </div>
        <div class="infoItem">
            <InfoItem title="动车组车底上线" dwText="万车"></InfoItem>
        </div>
    </div>
    <div style="float:left;width:50%;height:100%;">
        <div class="infoItem">
            <InfoItem title="车补收入" dwText="万元"></InfoItem>
        </div>
        <div class="infoItem">
            <InfoItem title="餐营收入" dwText="万元"></InfoItem>
        </div>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import InfoItem from "./InfoItem.vue";
export default {
  // 组件
  components: {
    InfoItem,
  },
  // 数据仓库
  data() {
    return {

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
.temp {
  width: 100%;
  height: 100%;
}
.infoItem{
    width:100%;
    height:33%;
    padding-top:15px;
    min-width: 470px;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
