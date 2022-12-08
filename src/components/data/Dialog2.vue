<!--
	组件说明 页面布局组件(适用页面分组内容)
	@author lc
	@time 2020年8月11日
-->
<template>
  <div
    class="dialog_main"
    v-if="dialogVisible"
    :style="{width:startW,height:dialogH,left:dialogLeft,top:dialogY,right:dialogRight}"
    v-loading="loadFlag" element-loading-text="拼命加载中"
				 element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,0.8)"
  >
    <div class="dialog_title" v-show="title">
      <div class="dialog_title_text">
        <span class="dialog_title_text_cur" @click="changeTitle(title)" :style="{color:selectTitle==title?'':'#aaa'}">{{title}}</span>
        <span class="dialog_title_text_cur" v-if="title1" @click="changeTitle(title1)" :style="{color:selectTitle==title1?'':'#aaa'}" style="margin-left:30px">{{title1}}</span>
      </div>
      <div class="dialog_title_close" @click="closeDialog" :style="{color:closeColor}">X</div>
    </div>
    <div class="dialog_title_close_p" :class="[closeClass]" v-show="!title" :style="{color:closeColor}" @click="closeDialog">X</div>
    <div class="dialog_content" :style="{height:contentH}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import com from "../../assets/com.js";
export default {
  data() {
    return {
      startW: "0px",
      dialogVisible: false,
      loadFlag:true,
      selectTitle:"",
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    title1: {
      type: String,
      default: ''
    },
    dialogW: {
      type: String,
      default: "60%",
    },
    dialogH: {
      type: String,
      default: "100%",
    },
    dialogX: {
      type: String,
      default: "0px",
    },
    dialogY: {
      type: String,
      default: "0px",
    },
    positionType:{
      type:String,
      default:"left",
    },
    closeColor:{
      type:String,
      default:"#fff",
    },
    closeClass:{
      type:String,
      default:"",
    },
  },
  // 组件挂载完毕
  mounted() {
    this.selectTitle=this.title;
  },
  // 方法
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.loadFlag=true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.startW = this.dialogW;
          setTimeout(() => {
            this.loadFlag=false;
          }, 600);
        }, 100);
      })
    },
    closeDialog() {
      this.startW = "0px";
      setTimeout(() => {
        this.dialogVisible = false;
      }, 600);
    },
    changeTitle(text){
      this.selectTitle=text;
      this.$emit("titleClick",text);
      this.loadFlag=true;
      this.$nextTick(()=>{
        setTimeout(() => {
          this.loadFlag=false;
        }, 2000);
      })
    },
  },
  // 监视属性
  watch: {
    title(){
      this.selectTitle=this.title;
    }
  },
  // 计算属性
  computed: {
    contentH() {
      var rs = "100%";
      if (this.title) {
        rs = "calc(100% - 40px)";
      }
      return rs;
    },
    dialogLeft(){
      var rs=this.dialogX;
      if(this.positionType=="right"){
        rs="unset";
      }
      return rs;
    },
    dialogRight(){
      var rs=this.dialogX;
      if(this.positionType=="left"){
        rs="unset";
      }
      return rs;
    },
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
  background: rgba(0, 0, 0, 0.8);
}
.dialog_main {
  position: absolute;
  z-index: 9999;
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
  /* color: #fff; */
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
.dialog_title_close_p{
  padding-right: 20px;
  cursor: pointer;
  position:absolute;
  top:10px;
  right:0px;
  color:#fff;
  z-index: 5;
}
.dialog_content {
  width: 100%;
  background: #ffffffce;
  overflow: hidden;
  position:relative;
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
.dialog_title_text_cur{
  cursor:pointer;
}
.dciClose{
  display:flex;
  justify-content: center;
  align-items:center;
  width:40px;
  height:35px;
  background:#fff;
  top:0;
  margin-right:10px;
  padding-right:0;
}
</style>
