<!--
	组件说明 页面布局组件(适用页面分组内容)
	@author lc
	@time 2020年8月11日
-->
<template>
  <div
    :id="boxid"
    @mouseenter="scrollAutoFlag = false"
    @mouseleave="scrollLeave"
    @scroll="scrollDrag()"
    style="width:100%;height:100%;overflow:auto;"
    :class="[boxClass]"
  >
    <div :id="boxid+'Content'">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import com from "../../assets/com.js";
export default {
  data() {
    return {
      scrollAutoFlag: true,
      scrollTop: 0,
      boxid: '_' + com.getUuid(),
      intervalItem: "",
    }
  },
  props: {
    boxClass: {
      type: String,
      default: 'itemContent'
    },
    scrollAuto: {
      type: Boolean,
      default: true,
    },
    scrollSize:{
      type: Number,
      default: 0.7,
    }
  },
  // 组件挂载完毕
  mounted() {
    if (this.scrollAuto) {
      this.scrollModule();
    }
  },
  // 方法
  methods: {
    //模块滚动 盒子id，内容id，是否滚动
    scrollModule(boxid, contentid) {
      var boxid = this.boxid;
      var contentid = this.boxid + "Content";
      var get = document.querySelector.bind(document);
      var boxEle1 = get("#" + boxid);
      var outHeight = boxEle1.offsetHeight;
      let maxStop = 0;
      this.scrollTop = 0;
      this.intervalItem = com.setIntervalItem(() => {
        if (this.scrollAutoFlag) {
          boxEle1.scrollTop = this.scrollTop;
          this.scrollTop += this.scrollSize;
          //获得滚动最大高度
          const fxyjTab = get("#" + contentid);
          const inHeight = fxyjTab.offsetHeight;
          maxStop = inHeight - outHeight;
          if (this.scrollTop >= maxStop) {
            this.scrollTop = 0;
            this.$emit("scrollDown")
          }
        }
      }, 50);
      this.intervalItem.start();
    },
    scrollDrag() {
      if (!this.scrollAutoFlag) {
        var get = document.querySelector.bind(document);
        var boxEle1 = get("#" + this.boxid);
        this.scrollTop = boxEle1.scrollTop;
      }
    },
    scrollStop() {
      if (this.intervalItem) {
        this.intervalItem.stop();
      }
    },
    scrollLeave(){
      this.scrollAutoFlag = true
      this.$emit("scrollLeave");
    }
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {},
  // 组件
  components: {},
}
</script>

<style scoped="scoped">
.itemContent::-webkit-scrollbar-track {
  background-color: #183b94 !important;
}
.itemContent::-webkit-scrollbar-thumb {
  background-color: #567ee4 !important;
}
.itemContent::-webkit-scrollbar-corner {
  background-color: #183b94 !important;
}
</style>
