
<template>
  <div class="box-div">
      <slot></slot>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  props: {
    
  },
  // 组件挂载完毕
  mounted() {
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
.box-div {
  height: 100%;
  width: 100%;
  border:2px solid #113457;
  border-radius: 10px;
  /* background:rgb(7, 13, 34); */
  background:rgb(7, 14, 52);
}

</style>