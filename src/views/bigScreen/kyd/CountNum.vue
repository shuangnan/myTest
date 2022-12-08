<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
  <div style="width:100%;height:100%;">
    <div style="width:100%;height:15%">{{title}}：</div>
    <div style="width:100%;height:45%;display:flex;justify-content:center;align-items:center;">
      <div v-for="(item,index) in countNum" :key="index" class="countNum">{{item}}</div>
    </div>
    <div style="width:100%;height:40%;display:flex;flex-wrap:wrap;">
      <div style="width:50%;" v-for="item in dataList" :key="item.name">
        <span>{{item.name}}</span>：
        <span style="color:#609eee;">{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {}
  },
  props: {
    title: { type: String, default: "" },
    dataList: { type: Array, default: () => { return [] } },
  },
  // 组件挂载完毕
  mounted() {
    this.initCharts();
  },
  created() {

  },
  // 方法
  methods: {
    /**-------------------------响应事件-------------------------------*/
    /**-------------------------数据展示-------------------------------*/
    /**-------------------------获取数据-------------------------------*/
    // 获取数据
    initCharts(data) {

    },
  },
  // 监视属性
  watch: {
  },
  // 计算属性
  computed: {
    countNum() {
      var rs = 0;
      this.dataList.forEach(v => {
        rs += parseInt(v.value);
      })
      return (rs + "").split("");
    }
  },
  // 组件
  components: {},
}
</script>

<style scoped>
.countNum {
  width: 30px;
  height: 40px;
  border: 2px solid rgb(9, 90, 128);
  font-size: 30px;
  margin-right:5px;
  display:flex;
  align-items: center;
  justify-content: center;
}
</style>
