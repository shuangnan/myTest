
<template>
  <div ref="csph" style="width:100%;height:100%;padding-top:20px;overflow:hidden;color:#aec0f2">
    <!-- 头部总收入 -->
    <div class="csphTop">
      今日餐售总收入
      <span>122</span>
      <span>万元</span>
    </div>
    <!-- 百分占比条 -->
    <div class="csphbar">
      <div class="csphbar1" style="border-bottom:1px solid #aec0f2;">
        <div class="csphbar1Bottom" :style="{width:dWidth}">
          <div class="csphbar1Bottom" :style="{width:dWidthP}">
            <div class="csphbar1Item Top" style="background:rgb(12,46,108);"></div>
            <img src="./img/D_P.png" class="csphbar1BottomPIC" style="left:0;height:17px;" />
          </div>
          <div class="csphbg"></div>
          <div class="csphbar1Bottom" :style="{width:dWidthC}">
            <div class="csphbar1Item Top" style="background:rgb(10,32,76);"></div>
            <img src="./img/D_C.png" class="csphbar1BottomPIC" style="left:0;height:17px;" />
          </div>
        </div>
        <div class="csphbg"></div>
        <div class="csphbar1Bottom" :style="{width:pWidth}">
          <div class="csphbar1Bottom" :style="{width:pWidthP}">
            <div class="csphbar1Item Top" style="background:rgb(51,90,29);"></div>
            <img src="./img/P_P.png" class="csphbar1BottomPIC" style="left:0;height:17px;" />
          </div>
          <div class="csphbg"></div>
          <div class="csphbar1Bottom" :style="{width:pWidthC}">
            <div class="csphbar1Item Top" style="background:rgb(26,46,32);"></div>
            <img src="./img/P_C.png" class="csphbar1BottomPIC" style="left:0;height:17px;" />
          </div>
        </div>
      </div>
      <div class="csphbar1">
        <div class="csphbar1Bottom" :style="{width:dWidth}">
          <div class="csphbar1Item" style="background:rgb(21,107,246)"></div>
          <img src="./img/D.png" class="csphbar1BottomPIC" style="left:0;height:20px;" />
        </div>
        <div class="csphbg"></div>
        <div class="csphbar1Bottom" :style="{width:pWidth}">
          <div class="csphbar1Item" style="background:rgb(92,161,25)"></div>
          <img src="./img/P.png" class="csphbar1BottomPIC" style="right:0;" />
        </div>
      </div>
    </div>
    <!-- 动普车总收入 -->
    <div class="csphZPSR">
      <div class="csphZPSRItem">
        <div style="font-size:14px;">动车</div>
        <div style="font-size:18px;">
          100
          <span style="font-size:12px;">万元/40%</span>
        </div>
      </div>
      <span class="csphZPSRItem" style="text-align:right">
        <div style="font-size:14px;">普车</div>
        <span style="font-size:18px;">
          150
          <span style="font-size:12px;">万元/60%</span>
        </span>
      </span>
    </div>
    <div class="csphContent">
      <el-carousel indicator-position="" :height="carouselHeight">
        <el-carousel-item v-for="(item,index) in 3" :key="index">
          <div style="height:100%;width:100%;">
            <div v-for="(item,index) in dataList" :key="index" class="csphContentItem">
              <div style="width:80px;">{{item.PM}}</div>
              <div style="width:100px;">{{item.trainNum}}</div>
              <div style="width:100px;">
                <span style="font-size:14px;color:#2888d7">{{item.count}}</span>
                <span style="font-size:12px;margin-left:2px;">万元</span>
              </div>
              <div style="flex-grow:1;padding-right:15px;">
                <div
                  style="height:5px;"
                  :style="{width:item.pre,background:item.type=='D'?'rgb(21,107,246)':'rgb(92,161,25)'}"
                ></div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dWidth: 'calc(40% - 2px)',
      pWidth: 'calc(60% - 2px)',
      dWidthP: 'calc(40% - 2px)',
      dWidthC: 'calc(60% - 2px)',
      pWidthP: 'calc(40% - 2px)',
      pWidthC: 'calc(60% - 2px)',
      carouselHeight: "200px",
      dataList: [
        { type: "D", trainNum: "D6954", count: "40", pre: "99%", PM: 'NO.1' },
        { type: "P", trainNum: "K4", count: "34", pre: "80%", PM: 'NO.2' },
        { type: "D", trainNum: "D8765", count: "32", pre: "76%", PM: 'NO.3' },
        { type: "P", trainNum: "K221", count: "28", pre: "74%", PM: 'NO.4' },
        { type: "P", trainNum: "K232", count: "27", pre: "73%", PM: 'NO.5' }
      ]
    }
  },
  props: {

  },
  // 组件挂载完毕
  mounted() {
    this.carouselHeight = this.$refs.csph.offsetHeight - 200 + "px";
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
.csphTop {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}
.csphTop span:nth-child(1) {
  font-size: 30px;
  margin-left: 7px;
  margin-right: 5px;
  color: #f2c7ae;
}
.csphTop span:nth-child(2) {
  font-size: 20px;
}
.csphbar {
  border: 1px solid #393c66;
  border-radius: 5px;
  height: 54px;
  width: 100%;
  margin-top: 20px;
  padding: 2px 5px;
}
.csphbar1 {
  width: 100%;
  height: 50%;
  padding: 3px 0px;
  display: flex;
}
.csphbar1Bottom {
  height: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
}
.csphbg {
  height: 100%;
  width: 4px;
}
.csphbar1BottomPIC {
  position: absolute;
  top: 1px;
  z-index: 5;
}
.csphbar1Item {
  height: 10px;
  width: 100%;
  position: absolute;
  left: 0;
  z-index: 1;
}
.Top {
  top: 7px;
}
.csphZPSR {
  width: 100%;
  /* border:1px solid red; */
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-weight: bold;
}
.csphZPSRItem {
  line-height: 25px;
  letter-spacing: 2px;
}
.csphContent {
  width: 100%;
  /* height: calc(100% - 190px); */
}
.csphContentItem {
  margin-bottom: 7px;
  width: 100%;
  height: 26px;
  display: flex;
  background: rgb(5, 10, 26);
  color: #aec0f2;
  font-weight: bold;
}
.csphContentItem div {
  display: flex;
  align-items: center;
  padding-left: 15px;
}
</style>