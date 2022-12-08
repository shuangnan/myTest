<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		横向柱状图
 -->
<template>
  <div ref="HBar" class="h-bar" @mouseout="initInterval">
    <div class="unit-leg-con">
      <div class="unit">{{unit}}</div>
      <div v-if="legs.length>0" class="leg">
        <a>
          <span class="leg-point short"></span>
          {{legs[0]}}
        </a>
        <a>
          <span class="leg-point long"></span>
          {{legs[1]}}
        </a>
      </div>
    </div>
    <ul class="list">
      <li v-for="(item,index) in list" :key="index" @mouseenter="showTip(item,index)">
        <div class="seq">{{item.i}}</div>
        <div class="detail">
          <div class="t-v">
            <label>{{item.t}}</label>
            <span>{{item.total}}</span>
          </div>
          <div v-if="item.p===0" class="ps" style="width:0px;">
            <i style="width:0px;"></i>
          </div>
          <div v-else class="ps" :style="{width:item.psw}">
            <i :style="{width:item.p}"></i>
          </div>
        </div>
      </li>
    </ul>
    <div
      ref="HBarTip"
      class="tip"
      :class="[tip.className]"
      :style="{top:tip.top,left:tip.left,display:tip.display}"
    >
      <div style="font-weight: bold;">{{curItem.t}}</div>
      <div>{{totlaText[0]}}：{{curItem.total}}</div>
      <div>{{totlaText[1]}}：{{curItem.per}}（{{curItem.p}}）</div>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
export default {
  // 组件
  components: {},
  // 数据仓库
  data() {
    return {
      list: [],
      tip: {
        left: -100,
        top: -100,
        className: 'tipTop',
      },
      curItem: {},
      interVal: null,
      dataIndex: 4,
    }
  },
  // 属性
  props: {
    unit: String, //单位
    //比较项名称
    legs: {
      type: Array,
      default: function () {
        return []
      }
    },
    dataSource: Array,
    totlaText: {
      type: Array,
      default: function () {
        return ["总计", "实际"]
      }
    }
  },
  // 组件挂载完毕
  mounted() {

    this.list = this.dataSource;
    this.list.forEach(item => {
      item.p = 0;
    });
    setTimeout(() => {
      if (this.dataSource.length > 0) {
        let temp = this.dataSource;
        const f = this.dataSource[0].total;
        temp.forEach((item, index) => {
          item.p = ((item.per / item.total) * 100).toFixed(2) + "%";
          item.fullP = ((item.per / f) * 100).toFixed(2) + "%";
          if (index > 0) {
            item.psw = ((item.total / f) * 100).toFixed(2) + "%";
          } else {
            item.psw = "100%";
          }
        });
        this.$set(this.list, 0, temp[0]); //强制对象数组更新
        this.initInterval();
      }
    }, 500);

  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    showTip(item, index, auto) {
      this.curItem = item;
      var fullP = item.fullP.substring(0, item.fullP.length - 1) / 100;
      if(!this.$refs.HBar){
        return;
      }
      var realWidth = (this.$refs.HBar.offsetWidth - 20 - 10 - 20) * fullP;
      var realLeft = realWidth + 20 + 10;
      this.tip.left = realLeft + "px";
      //   this.tip.left=item.fullP
      this.tip.top = (index + 1) * 36+5 + "px";
      this.tip.className = "tipTop";
      if (((index + 1) * 36 + this.$refs.HBarTip.offsetHeight) > this.$refs.HBar.offsetHeight) {
        this.tip.top = (index + 1) * 36 - this.$refs.HBarTip.offsetHeight - 15 + "px";
        this.tip.className = "tipBottom";
      }
      this.tip.display = "block";
      if (!auto) {
        if (this.interVal) {
          clearInterval(this.interVal);
        }
      }
    },
    initInterval() {
      if (this.interVal) {
        clearInterval(this.interVal);
      }
      this.interVal = setInterval(() => {
        const tempItem = this.list[this.dataIndex];
        this.showTip(tempItem, this.dataIndex, true);
        this.dataIndex++;
        if (this.dataIndex >= this.list.length) {
          this.dataIndex = 0;
        }
      }, 2000);
    }
    /* @info  数据处理区-----------------------------------*/


    /* @info  数据交互区-----------------------------------*/
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.h-bar {
  position: relative;
  padding: 10px;
  height: 100%;
}

.unit-leg-con {
  position: relative;
  height: 30px;
}

.unit {
  padding: 5px;
}

.leg {
  position: absolute;
  right: 0;
  top: 2px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
}

.list > li {
  padding: 5px;
  height: 36px;
  transition: all 0.3s;
}

.list > li:hover {
  background-color: rgba(101, 155, 207, 0.2);
}

.seq {
  display: inline-block;
  vertical-align: middle;
  padding: 3px;
  width: 20px;
}

.detail {
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 20px);
}

.t-v {
  padding: 2px 0;
}

.t-v > span {
  float: right;
}

.leg-point {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid transparent;
  margin: 0 2px 0 5px;
}

.leg-point.long {
  border-color: rgba(184, 100, 90, 1);
}

.leg-point.short {
  border-color: rgba(155, 206, 248, 1);
}

.ps {
  position: relative;
  height: 4px;
  background-color: rgba(184, 100, 90, 1);
  transition: all 0.8s;
}

.ps > i {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: rgba(155, 206, 248, 1);
  transition: all 1.5s;
}

.ps > i::after {
  content: "";
  position: absolute;
  right: 0;
  width: 2px;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 0 5px 2px #fafafa;
}

.tip {
  position: absolute;
  display: none;
  min-width: 100px;
  min-height: 50px;
  padding: 5px;
  background-image: linear-gradient(
    to right,
    rgba(62, 130, 196, 0.9),
    rgba(62, 130, 196, 0.4)
  );
  transition: all 0.3s;
  transform: translate(-50%, 36px);
}

.tipTop::before {
  content: "";
  position: absolute;
  width: 0px;
  height: 0px;
  border: 5px solid transparent;
  border-bottom: 8px solid rgba(62, 130, 196, 0.5);
  /* border-right: 5px solid rgba(62, 130, 196, .8); */
  left: 50%;
  top: -12px;
  /* transform: rotate(45deg); */
  z-index: -1;
  /* background-image: linear-gradient(to right, rgba(62, 130, 196, .8), rgba(62, 130, 196, .2)); */
}
.tipBottom::after {
  content: "";
  position: absolute;
  width: 0px;
  height: 0px;
  border: 5px solid transparent;
  border-top: 8px solid rgba(62, 130, 196, 0.5);
  left: 50%;
  bottom: -12px;
  z-index: -1;
}

.tip > div {
  white-space: nowrap;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
