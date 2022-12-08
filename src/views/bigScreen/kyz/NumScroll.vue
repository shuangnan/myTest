<!-- 
 * @created：	2020年8月7日
 * @author：	ch
 * @version:	v1.0
 * @desc:		高铁中心站-首页-数字滚动切换
 -->
<template>
  <div style="height: 100%;display:inline-block;vertical-align:top">
    <div :class="[getNumClass()]" v-for="(item,index) in numList" :key="index">
      <transition>
        <span :class="item.showFlag?'hs_UpScroll':''" style="display:inline-block;height:100%;">
          <table class="sp_tabX">
            <tr>
              <td>{{item.oldval}}</td>
            </tr>
            <tr>
              <td>{{item.val}}</td>
            </tr>
          </table>
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
export default {
  // 组件
  components: {
  },
  // 数据仓库
  data() {
    return {
      numList: [],
    }
  },
  // 属性
  props: {
    num: {
      type: String,
      default: "",
    },
    type: {//数字样式
      type: String,
      default: "1",
    }
  },
  // 组件挂载完毕
  mounted() {
    var numList = [];
    var list = this.num.split("");
    list.forEach((v, i) => {
      var row = { showFlag: true, val: this.v, oldval: v, equalFlag: true };
      numList.push(row);
    })
    this.numList = numList;
  },
  // 方法
  methods: {
    getNumClass() {
      var rs = "";
      if (this.type == "1") {
        rs = "topLeftNum"
      } else if (this.type == "2") {
        rs = "defaultNum";
      } else if (this.type == "3") {
        rs = "defaultNum3";
      }
      return rs;
    },
    /* @info  事件处理区-----------------------------------*/
    // 行点击事件


    /* @info  数据处理区-----------------------------------*/


    /* @info  数据交互区-----------------------------------*/
    // 获取数据
    getData() {

    }
  },
  // 监视属性
  watch: {
    "num": function (val, oldval) {
      if (val.length > oldval.length) {
        var lt = val.length - oldval.length;
        for (var i = 0; i < lt; i++) {
          oldval = "0" + oldval;
        }
      }
      if (oldval.length > val.length) {
        var lt = oldval.length - val.length;
        for (var i = 0; i < lt; i++) {
          val = "0" + val;
        }
      }
      if (val != oldval) {
        var numList = [];
        var list = (val + "").split("");
        var olist = (oldval + "").split("");
        list.forEach((v, i) => {
          var equalFlag = false;
          if (v == olist[i]) {
            equalFlag = true;
          }
          var row = { showFlag: true, val: v, oldval: olist[i], equalFlag: equalFlag };
          numList.push(row);
        });
        this.numList = numList;
        this.numList.forEach(v => {
          if (!v.equalFlag) {
            v.showFlag = false;
            setTimeout(() => {
              v.showFlag = true;
            }, 10);
          }
        })
        setTimeout(() => {
          this.numList.forEach(v => {
            if (!v.equalFlag) {
              v.oldval = v.val;
            }
          })
        }, 1000);
      }
    },
  },
  // 计算属性
  computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.topLeftNum {
  display: inline-block;
  vertical-align: top;
  background: url(../../../assets/imgs/h-speedRailway/num.png) no-repeat;
  height: 100%;
  width: 22px;
  text-align: center;
  margin-left: 5px;
  color: #23f9fb;
  overflow: hidden;
  background-size:100% 100%;
  font-size:20px;
  line-height: 32px;
}
.defaultNum {
  display: inline-block;
  vertical-align: top;
  height: 29px;
  overflow: hidden;
}
.defaultNum3 {
  display: inline-block;
  vertical-align: top;
  height: 17px;
  overflow: hidden;
}
.hs_UpScroll {
  animation: hs_numScroll-enter 1s;
  animation-timing-function: linear;
}
.hs_numScroll-enter-active {
  animation: hs_numScroll-enter 1s;
  animation-timing-function: linear;
}
@keyframes hs_numScroll-enter {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}
.sp_tabX {
  border-collapse: collapse;
  height:100%;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
