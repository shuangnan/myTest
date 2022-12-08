<!--
	组件说明 页面布局组件(适用页面分组内容)
	@author lc
	@time 2020年8月11日
-->
<template>
  <div class="dialog_1" v-if="dialogVisible">
    <div class="dialog_bg"></div>
    <div class="dialog_main" :style="{width:startW,height:startH,left:startL,top:startT}">
      <div class="dialog_title" v-show="title">
        <div class="dialog_title_text">{{title}}</div>
        <div class="dialog_title_close" @click="closeDialog">X</div>
      </div>
      <div class="dialog_content" :style="{height:contentH}">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import com from "../../assets/com.js";
export default {
  data() {
    return {
      startW: "0px",
      startH: "0px",
      dialogVisible: false,
      startL: "0px",
      startT: "0px",
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    dialogW: {
      type: String,
      default: "60%",
    },
    dialogH: {
      type: String,
      default: "60%",
    },
    dialogX_S: {
      type: String,
      default: "0px",
    },
    dialogY_S: {
      type: String,
      default: "0px",
    },
    dialogX_E: {
      type: String,
      default: "50%",
    },
    dialogY_E: {
      type: String,
      default: "50%",
    },
  },
  // 组件挂载完毕
  mounted() {

  },
  // 方法
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.startL = this.dialogX_S;
      this.startT = this.dialogY_S;
      this.$nextTick(() => {
        setTimeout(() => {
          this.startW = this.dialogW;
          this.startH = this.dialogH;
          this.startL = this.dialogX_E;
          this.startT = this.dialogY_E;
        }, 100);
      })
    },
    closeDialog() {
      this.startW = "0px";
      this.startH = "0px";
      // this.startL = this.dialogX_S;
      // this.startT = this.dialogY_S;
      setTimeout(() => {
        this.dialogVisible = false;
      }, 600);
    },
  },
  // 监视属性
  watch: {

  },
  // 计算属性
  computed: {
    contentH() {
      var rs = "100%";
      if (this.title) {
        rs = "calc(100% - 40px)";
      }
      return rs;
    }
  },
  // 组件
  components: {},
}
</script>

<style scoped="scoped">
.dialog_1 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}
.dialog_bg {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  background: rgba(0, 0, 0, 0.329);
}
.dialog_main {
  position: absolute;
  z-index: 999;
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition: all 0.5s;
  /* background: #82a5d3; */
  background: rgba(5, 11, 47, 0.9);
  padding: 5px;
  padding-top: 0px;
}
.dialog_main_end {
  left: 50% !important;
  top: 50% !important;
}
.dialog_title {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #26bdf8ce;
}
.dialog_title_text {
  font-size: 18px;
  font-weight: bold;
  padding-left: 20px;
}
.dialog_title_close {
  padding-right: 20px;
  cursor: pointer;
}
.dialog_content {
  width: 100%;
  background: #ffffffce;
  overflow: hidden;
}
::-webkit-scrollbar-track {
  background-color: #183b94 !important;
}
::-webkit-scrollbar-thumb {
  background-color: #567ee4 !important;
}
::-webkit-scrollbar-corner {
  background-color: #183b94 !important;
}
</style>
