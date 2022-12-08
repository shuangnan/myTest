
<template>
  <div class="out-div" @click="()=>this.$emit('titleClick',this.title)">
    <div class="out-div-title">
      <div class="out-div-title-left">
        <span class="shadow-txt">{{title}}</span>
      </div>
      <div class="out-div-title-right"></div>
    </div>
    <div class="out-div-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
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
.out-div {
  height: 100%;
  width: 100%;
  padding-top:10px;
  padding-left:20px;
  padding-right:20px;
}
.out-div-title {
  width: 100%;
  height: 40px;
  display: flex;
  padding-top: 20px;
}
.out-div-title-left {
  position: relative;
  padding-left: 20px;
  height: 19px;
  background: url("../../assets/imgs/bigScreen/key2_title2.png");
  width: 264px;
}
.out-div-title-right {
  height: 19px;
  background: url("../../assets/imgs/bigScreen/key2_title1.png");
  position: relative;
  width: calc(100% - 264px);
}
.out-div-title-left span{
    font-size: 16px;
    display:inline-block;
    margin-top:-10px;
    vertical-align: top;
    font-weight: bold;
    color:#d0c5e3;
    letter-spacing: 2px;
}
.out-div-content {
  width: 100%;
  height: calc(100% - 40px);
}
</style>