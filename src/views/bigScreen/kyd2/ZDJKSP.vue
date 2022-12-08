
<template>
  <div style="width:100%;height:100%;display:flex;padding-top:20px;">
    <iframe
      style="height:120px;width:100%;border:none"
      :src="src"
    ></iframe>
    <!-- <div class="videoItem" v-for="(item,index) in dataList" :key="index"></div> -->
  </div>
</template>

<script>

export default {
  data() {
    return {
      resids: ["6171041201002C01", "617104120100200A", "6171041201000C02", "6171041201001C07"],
      src:"",
    }
  },
  props: {
    dataList: {
      type: Array,

      default: () => {        return [
          { id: 0, name: "成都东站" },
          { id: 1, name: "成都东站" },
          { id: 2, name: "成都东站" },
          { id: 3, name: "成都东站" },
          { id: 4, name: "成都东站" },
        ]      }
    }
  },
  // 组件挂载完毕
  mounted() {
    var residString = this.resids.join(",");
    this.src="http://10.192.6.177:9090/JFLCMS/vue/index2.html#/JKItems?closeFlag=false&resid="+residString+"&UserPID=10000000000000000X&width=200px&height=120px&margin=10px";
  },
  // 方法
  methods: {
    /**-------------------------响应事件-------------------------------*/
    /**-------------------------数据展示-------------------------------*/
    /**-------------------------获取数据-------------------------------*/
  },
  // 监视属性
  watch: {
  },
  // 计算属性
  computed: {

  },
  // 组件
  components: {
  },
}
</script>

<style scoped>
.videoItem {
  height: 100px;
  width: 200px;
  margin-right: 10px;
}
</style>