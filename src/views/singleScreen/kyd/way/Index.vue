<template>
  <div
    style="
      width: 100%;
      height: calc(100vh - 60px);
      
      padding: 0;
      margin: 0;
    "
  >
    <div class="box">
      <div class="menu">
        <el-select
          v-if="dwCheck"
          @change="initCdzd('dw')"
          size="small"
          style="width: 120px; margin-right: 10px"
          clearable
          v-model="opt.kyd"
        >
          <el-option label="信息技术所" value="信息技术所"
            >信息技术所</el-option
          >
          <el-option label="重庆客运段" value="重庆客运段"
            >重庆客运段</el-option
          >
          <el-option label="成都客运段" value="成都客运段"
            >成都客运段</el-option
          >
          <el-option label="贵阳客运段" value="贵阳客运段"
            >贵阳客运段</el-option
          >
        </el-select>
        <el-select
          v-model="opt.cd"
          size="small"
          @change="filterData"
          placeholder="担当车队"
        >
          <el-option value="" label="全部车队">全部车队</el-option>
          <el-option
            v-for="(item, i) in cd"
            :value="item.TEAM_NAME"
            :label="item.TEAM_NAME"
          >
          </el-option>
        </el-select>
        <div class="pan">
          <label class="title">总担当</label>
          <label class="value">{{ total.ZS }}列</label>
        </div>
        <div class="pan">
          <label class="title">在途列车</label>
          <label class="value">{{ total.ZT }}列</label>
        </div>
        <div class="pan">
          <label class="title">待出乘</label>
          <label class="value">{{ total.WCC }}列</label>
        </div>
        <div class="pan">
          <label class="title">已退乘</label>
          <label class="value">{{ total.YCC }}列</label>
        </div>
        <div style="position: fixed; right: 100px; top: 10px">
          <el-button type="text" @click="taskWinVisible = true"
            >任务配置→</el-button
          >
        </div>
      </div>
      <div ref="timeCon" class="time">
        <ul class="list list-time">
          <li
            v-for="(item, index) in numX"
            :style="{ width: 6 * xSpace + 'px' }"
          >
            {{ index }}
          </li>
        </ul>
      </div>
      <div ref="teamCon" class="team" id="teamCon" @mouseover="function () {currentArea = 1}">
        <ul class="list list-team" id="teamChild">
          <li
            v-for="item in datasource"
            style="
              line-height: 15px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            {{ item.CLASS_NAME }}
          </li>
          <li
            style="
              line-height: 15px;
              display: flex;
              padding: 0;
              justify-content: center;
              align-items: center;
            "
          ></li>
        </ul>
      </div>
      <div ref="mainCon" class="content" @scroll="handleContentScroll" id="mainCon" @mouseover="function () {currentArea = 2}">
        <div
          ref="main"
          style="position: relative; min-height: 100%"
          :style="{ width: mainWidth, height: mainHeight }"
          id="contentChild"
        >
          <div class="cur-time-line" :style="{ width: curTimeX + 'px' }"></div>
          <ul class="list list-main">
            <li v-for="(item, index) in numX">
              <ul class="sec list-main">
                <li v-for="(sec, idx) in 6" :style="{ width: xSpace + 'px' }">
                  <!-- <li v-for="(sec,idx) in 6" :style="{width:xSpace+'px'}" :class="(((index<10?'0'+index:index)+'')+((idx*10<10?'0'+(idx*10):idx*10)+''))<curTime?'done':''"> -->
                </li>
              </ul>
            </li>
          </ul>
          <ul class="list list-draw">
            <li v-for="item in datasource">
              <template v-for="plan in item.CC_LIST">
                <el-popover
                  trigger="hover"
                  :v-model="true"
                  placement="right-start"
                  popper-class="poper-time"
                >
                  <div class="top-content">
                    <span>
                      <h2>{{ plan.CC }}</h2>
                      <span>
                        <label
                          >({{ plan.START_STN }} - {{ plan.END_STN }})</label
                        >
                        <label>
                          <template v-for="l in item.PER_LEADER">
                            {{ l.STEWARD_NAME }}
                          </template>
                        </label>
                      </span>
                    </span>
                    <span><label>开始时间：</label>{{ plan.CC_KSSJ }}</span>
                    <span><label>结束时间：</label>{{ plan.CC_JSSJ }}</span>
                  </div>
                  <div class="space"></div>
                  <el-timeline style="width: 240px; padding: 5px">
                    <el-timeline-item
                      v-for="(atl, i) in plan.ALL_TASK_LIST"
                      :icon="atl.FUTURE == 1 ? 'el-icon-time' : atl.STATUS == 1 ? alt.FLAG_TIMEOUT == 1 ? 'el-icon-warning' : 'el-icon-check' : 'el-icon-close'"
                      :type="atl.FUTURE == 1 ? 'info' : atl.STATUS == 1 ? alt.FLAG_TIMEOUT == 1 ? 'warning' : 'success' : 'danger'"
                      :timestamp="atl.S_TIME"
                    >
                      {{ atl.TASK_NAME }}
                      <h6 style="margin: 0 5px">{{ atl.TASK_CONTENT }}</h6>
                    </el-timeline-item>
                  </el-timeline>
                  <div
                    @dblclick="showDetail(plan)"
                    slot="reference"
                    :class="{
                      'type-dc': getStatus(plan.CC_KSSJ, plan.CC_JSSJ) == 'dc',
                      'type-upcomingdc':
                        getStatus(plan.CC_KSSJ, plan.CC_JSSJ) == 'upcoming',
                      'type-overdc':
                        getStatus(plan.CC_KSSJ, plan.CC_JSSJ) == 'over',
                    }"
                    :style="{
                      left: getStart(plan) + 'px',
                      width: getEnd(plan) + 'px',
                    }"
                  >
                    <div class="memo">
                      <i
                        v-if="plan.LEFT_CROSS"
                        class="el-icon-right cross-flag"
                      ></i>
                      <label>{{ plan.CC }}</label>
                      <!-- <div v-if="plan.NEXT_TASK&&plan.NEXT_TASK.length>0" class="memo"> -->
                      <el-popover trigger="click" v-for="p in plan.NEXT_TASK">
                        <div class="con">
                          <label>下一项任务</label>
                          <span><label>录入部门：</label>{{ p.oragin }}</span>
                          <span><label>执行时间：</label>{{ p.S_TIME }}</span>
                          <span
                            ><label>任务类型：</label>{{ p.TASK_NAME }}</span
                          >
                          <span
                            ><label>任务内容：</label>{{ p.TASK_CONTENT }}</span
                          >
                        </div>
                        <div
                          slot="reference"
                          class="dot"
                          :style="{
                            background: '#3451ff',
                            left:
                              getLeft(p.S_TIME) - getStart(plan) - 10 + 'px',
                          }"
                        ></div>
                      </el-popover>
                      <!-- </div> -->
                      <!-- <div v-if="plan.WARN_TASK&&plan.WARN_TASK.length>0" class="memo"> -->
                      <el-popover trigger="click" v-for="w in plan.WARN_TASK">
                        <div class="con">
                          <label class="warning">任务超时预警</label>
                          <span><label>录入部门：</label>{{ w.oragin }}</span>
                          <span><label>执行时间：</label>{{ w.S_TIME }}</span>
                          <span
                            ><label>任务类型：</label>{{ w.TASK_NAME }}</span
                          >
                          <span
                            ><label>任务内容：</label>{{ w.TASK_CONTENT }}</span
                          >
                        </div>
                        <div
                          slot="reference"
                          class="dot"
                          :style="{
                            background: '#ff2c2d',
                            left: getEnd(plan) - 40 - 10 + 'px',
                          }"
                        ></div>
                      </el-popover>
                      <!-- </div> -->
                      <!-- <el-tooltip class="warn-late" :value="true" effect="light" placement="top-end" :manual="true">
											<label slot="content">{{plan.WARN_TITLE}}</label>
											<span class="el-icon-caret-top"></span>
										</el-tooltip> -->
                      <i
                        v-if="plan.RIGHT_CROSS"
                        class="el-icon-right cross-flag right-cross"
                      ></i>
                    </div>
                  </div>
                </el-popover>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      v-if="visible"
      :visible.sync="visible"
      title="车次信息"
      width="1200px"
      :detroy-on-close="true"
      :append-to-body="true"
      top="3vh"
      style="overflow: hidden; top: -60px"
    >
      <div style="height: calc(100vh - 100px)">
        <detail :datasource="detail" :detailSql="detailSql"></detail>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="taskWinVisible"
      custom-class="lock-scroll"
      title="任务配置"
      width="1000px"
      :detroy-on-close="true"
      :append-to-body="false"
      :lock-scroll="true"
    >
      <div style="height: 700px">
        <rwmb></rwmb>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import rwmb from "../rwmb/model.vue"; //任务模板
import detail from "./detail.vue";
import home from "../../service/home.js";
import monitor from "../../service/monitor.js";
export default {
  components: {
    rwmb,
    detail,
  },
  data() {
    return {
      currentArea: null,
      currentPage: null,
      queryRows: null,
      taskWinVisible: false,
      loading: null,
      curTime: echarts.format.formatTime("hh:mm", new Date().getTime()),
      detail: null, //车次详细数据
      detailSql: null,
      curTimeX: 0, //当前时间轴x
      dwCheck: false, //是否显示单位切换
      teamCheck: false, //是否显示单位切换
      opt: {
        kyd: "",
        cd: "",
        curDate: echarts.format.formatTime("yyyyMMdd", new Date().getTime()),
      },
      visible: false,
      numX: 24,
      numY: 10,
      xSpace: 12,
      ySpace: 50,
      mainWidth: "100%",
      mainHeight: "100%",
      cd: [],
      total: {
        ZS: "--",
        ZT: "--",
        WCC: "--",
        YCC: "--",
      }, //统计信息
      datasource: [],
      loadingEnable: true
    };
  },
  props: {},
  mounted() {
    if (this.$store.state.user.u_DEPOT.indexOf("信息技术所") > -1) {
      this.dwCheck = true;
    }
    if (this.$store.state.user.u_type == "2") {
      //客运段管理员
      this.teamCheck = true;
    }
    let t = this;
    t.opt.kyd = t.$store.state.user.u_DEPOT;
    this.mainWidth = this.numX * 6 * this.xSpace + "px";

    this.initDragScroll();
    //init data
    t.drawTimeline();

    t.initCdzd();

    // t.initTotal()

    // t.initData()

    setInterval(() => {
      t.drawTimeline();
    }, 1000);
  },
  // 方法
  methods: {
    /**
     * 滚动懒加载
     */
    handleContentScroll(e) {
      let team = document.getElementById("teamCon")
      let content = document.getElementById("mainCon")
      let teamChild = document.getElementById("teamChild")
      let contentChild = document.getElementById("contentChild")
      // let scale = (contentChild.offsetHeight - content.offsetHeight)/(teamChild.offsetHeight - team.offsetHeight)
      // 鼠标在main区域时连带滚动纵轴
      if (this.currentArea === 2) {
        team.scrollTop = content.scrollTop
      }
      console.log("CONTENT SCROLL", e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight)
      // 滚动到底时懒加载数据
      if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight == 0 && this.loadingEnable) {
        console.log("LOAD NEEDED")
        this.constLoading()
        let oldData = this.datasource
        this.currentPage = this.currentPage + 1
        monitor.getRwjk({
          s: {
            DEPOT: this.opt.kyd,
            RUNDAY: this.opt.curDate,
            ROW: this.queryRows,
            PAGE: this.currentPage
          }
        }).then((r) => {
          if (r) {
            if (r.length < this.queryRows) {
              // 接口返回数据少于ROW, 判断数据全部读取完成
              this.loadingEnable = false
            }
            r.map((item) => {
              oldData.push(item)
            })
            this.datasource = oldData
            this.mainHeight = this.datasource.length * this.ySpace + "px";
            this.loading.close()
          }else {
            this.$message("接口错误");
            this.loading.close()
          }
        },
        (error) => {
            this.loading.close();
            this.$notify.error({
              title: "任务监控",
              message: "获取任务监控初始数据异常",
            });
          })
      }
    },
    constLoading() {
      this.loading = null;
      this.loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)",
        customClass: "loading1",
      });
    },
    initDragScroll() {
      let x = 0;
      let y = 0;
      let isCanMove = false;
      this.Tools.$(this.$refs.main)
        .bind("mousedown", function () {
          x = event.clientX;
          y = event.clientY;
          isCanMove = true;
        })
        .bind("mousemove", () => {
          if (isCanMove) {
            var sx = event.clientX - x;
            var sy = event.clientY - y;
            x = event.clientX;
            y = event.clientY;
            var scrollObjMain = this.Tools.$(this.$refs.mainCon);
            var scrollObjTime = this.Tools.$(this.$refs.timeCon);
            var scrollObjTeam = this.Tools.$(this.$refs.teamCon);
            const scrollLeft = scrollObjMain.scrollLeft() - sx;
            const scrollTop = scrollObjMain.scrollTop() - sy;
            scrollObjMain.scrollLeft(scrollLeft); //主体左右滚动
            scrollObjMain.scrollTop(scrollTop); //主本上下滚动
            scrollObjTime.scrollLeft(scrollLeft); //时间左右滚动
            scrollObjTeam.scrollTop(scrollTop); //类型上下滚动
          }
        })
        .bind("mouseup", function () {
          isCanMove = false;
        });
    },
    checkTime(h, s) {
      h = (h < 12 ? "0" + h : h) + "";
      s = (s * 10 < 10 ? "0" + s * 10 : s * 10) + "";
      const c = echarts.format.formatTime("hhmm", new Date().getTime());
      if (h + s < c) {
        return "done";
      }
    },
    getLeft(time) {
      let t = this;
      var start = 0;
      var h = echarts.format.formatTime("hh", new Date(time).getTime());
      var m = echarts.format.formatTime("mm", new Date(time).getTime());
      start += parseInt(h) * 6 * t.xSpace;
      start += parseInt(parseInt(m) / 10) * t.xSpace;
      start += ((parseInt(m) % 10) / 10) * t.xSpace;
      return start;
    },
    getStart(item) {
      let t = this;
      var c = t.opt.curDate; //echarts.format.formatTime('yyyyMMdd',new Date().getTime())
      // var pattern = /(\d{4})(\d{2})(\d{2})/
      // item.PLANDAY = item.PLANDAY.replace(pattern,"$1-$2-$3")
      var s = echarts.format.formatTime(
        "yyyyMMdd",
        new Date(item.CC_KSSJ).getTime()
      );
      var start = 0;
      if (s == c) {
        var h = echarts.format.formatTime(
          "hh",
          new Date(item.CC_KSSJ).getTime()
        );
        var m = echarts.format.formatTime(
          "mm",
          new Date(item.CC_KSSJ).getTime()
        );
        start += parseInt(h) * 6 * t.xSpace;
        start += parseInt(parseInt(m) / 10) * t.xSpace;
        start += ((parseInt(m) % 10) / 10) * t.xSpace;
      } else if (s < c) {
        //跨天
        item.LEFT_CROSS = true;
      }
      item.left = start;
      return item.left;
    },
    getEnd(item) {
      let t = this;
      var c = t.opt.curDate; //echarts.format.formatTime('yyyyMMdd',new Date().getTime())
      // var pattern = /(\d{4})(\d{2})(\d{2})/
      // item.PLANDAY = item.PLANDAY.replace(pattern,"$1-$2-$3")
      var s = echarts.format.formatTime(
        "yyyyMMdd",
        new Date(item.CC_JSSJ).getTime()
      );
      var end = 24 * 6 * t.xSpace;
      if (s == c) {
        end = 0;
        var h = echarts.format.formatTime(
          "hh",
          new Date(item.CC_JSSJ).getTime()
        );
        var m = echarts.format.formatTime(
          "mm",
          new Date(item.CC_JSSJ).getTime()
        );
        end += parseInt(h) * 6 * t.xSpace;
        end += parseInt(parseInt(m) / 10) * t.xSpace;
        end += ((parseInt(m) % 10) / 10) * t.xSpace;
      } else if (s > c) {
        item.RIGHT_CROSS = true;
      }
      item.width = end - item.left;
      return item.width;
    },
    showDetail(plan) {
      this.visible = true;
      this.detail = null;
      this.getClxq(plan);
    },
    getClxq(item) {
      // [["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"],["车次","开行日期(yyyymmdd)"]]
      let t = this;
      const p = [
        item.CC,
        echarts.format.formatTime("yyyyMMdd", new Date(item.CC_KSSJ).getTime()),
      ];
      this.detailSql = p
      home
        .getClxq({
          s: [p, p, p, p, p, p],
        })
        .then(
          (r) => {
            if (r) {
              t.detail = r;
              // t.visible = true
            } else {
              this.$message({
                type: "error",
                message: "接口错误",
              });
            }
          },
          (error) => {
            t.$notify.error({
              title: "任务监控",
              message: "获取车辆详情异常",
            });
          }
        );
    },
    //车队字典
    initCdzd() {
      let t = this;
      home
        .getCdzd({
          s: [[this.opt.kyd]],
        })
        .then(
          (r) => {
            if (r) {
              t.cd = r["1"];
              t.opt.cd = "";
              t.initTotal();
              t.initData();
            } else {
              this.$message("接口错误");
            }
          },
          (error) => {
            t.$notify.error({
              title: "任务监控",
              message: "获取车队数据异常",
            });
          }
        );
    },
    //统计信息
    initTotal() {
      let t = this;
      monitor
        .getTotalInfo({
          s: {
            DEPOT: t.opt.kyd,
            RUNDAY: t.opt.curDate,
          },
        })
        .then(
          (r) => {
            if (r) {
              t.total = r[0];
            } else {
              this.$message("接口错误");
            }
          },
          (error) => {
            t.$notify.error({
              title: "任务监控",
              message: "获取统计信息异常",
            });
          }
        );
    },
    //整体数据
    initData() {
      let t = this;
      // return false
      t.constLoading();
      t.currentPage = 1
      t.queryRows = 20
      var s = {
        DEPOT: t.opt.kyd,
        RUNDAY: t.opt.curDate,
        ROW: t.queryRows,
        PAGE: t.currentPage
      };
      if (t.opt.cd != "") {
        s.TEAM = t.opt.cd;
      }
      monitor
        .getRwjk({
          s: s,
        })
        .then(
          (r) => {
            if (r) {
              console.log("DATASOURCE", t.datasource)
              console.log("RES", r)
              t.datasource = r;
              this.mainHeight = this.datasource.length * this.ySpace + "px";
            } else {
              this.$message("接口错误");
            }
            t.loading.close();
          },
          (error) => {
            t.loading.close();
            t.$notify.error({
              title: "任务监控",
              message: "获取任务监控初始数据异常",
            });
          }
        );
    },
    //按车队筛选整体数据
    filterData() {
      this.initData();
    },
    drawTimeline() {
      let t = this;
      t.curTime = echarts.format.formatTime("hhmm", new Date().getTime());
      var start = 0;
      var h = t.curTime.substring(0, 2);
      var m = t.curTime.substring(2);
      start += parseInt(h) * 6 * t.xSpace;
      start += parseInt(parseInt(m) / 10) * t.xSpace;
      start += ((parseInt(m) % 10) / 10) * t.xSpace;
      t.curTimeX = start;
    },
    getStatus(startTime, endTime) {
      // console.log(startTime)
      // console.log(endTime)
      // const currentTime = echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', new Date().getTime()))
      // console.log( currentTime - endTime )

      const currentTime = echarts.format.formatTime(
        "yyyy-MM-dd hh:mm:ss",
        new Date().getTime()
      );
      const currentTimeObject = Date.parse(new Date(currentTime));
      const startTimeObject = Date.parse(new Date(startTime));
      const endTimeObject = Date.parse(new Date(endTime));
      // console.log(Date.parse(new Date(endTime)) - currentTimeObject);
      if (currentTimeObject < startTimeObject) {
        return "upcoming";
      } else if (currentTimeObject < endTimeObject) {
        return "dc";
      } else {
        return "over";
      }
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped="scoped">
>>> .el-dialog__wrapper {
  overflow: hidden;
}
.box {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  padding-top: 75px;
  padding-left: 100px;
  border-top: 1px solid #1f2638;
  user-select: none;
}

.box .menu {
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 15px;
}

.box .menu .pan {
  padding: 2px 15px;
  border: 1px solid #3862bf;
  background: #4b6693;
  border-radius: 20px;
  width: 150px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0 15px;
}

.box .menu .pan .title {
  color: #f0f0f0;
  font-size: 14px;
}

.box .menu .pan .value {
  color: #0beff0;
  font-size: 16px;
}

.time {
  position: absolute;
  top: 58px;
  left: 100px;
  right: 0px;
  /* height: 70px; */
  overflow: hidden;
  /* border: 1px solid black; */
}

.team {
  position: absolute;
  top: 75px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100px;
  overflow: hidden;
  border-right: 1px solid #676d7e;
  /* border: 1px solid blue; */
}

.team::-webkit-scrollbar {
  display: none;
}

.content::-webkit-scrollbar {
  display: none;
}

.content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list > li {
  display: inline-block;
}

.list-time,
.list-main {
  height: 100%;
  white-space: nowrap;
  padding: 0;
}

/* 图例 */
.list-tip {
  position: absolute;
  top: 5px;
  right: 10px;
}

.list-tip > li {
  width: 80px;
}

.list-tip > li > i {
  display: inline-block;
  vertical-align: text-bottom;
  margin-right: 5px;
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

/* 时间轴 */
.list-time > li {
  height: 100%;
  /* padding-top: 40px; */
  text-indent: -5px;
}

.list-time > li:first-child {
  text-indent: 0px;
}

/* 主体 */
.list-main > li {
  height: 100%;
  list-style-type: none;
  /* border-right: 3px solid #484E62; */
}

.sec {
  width: 100%;
  display: -webkit-box;
}

.sec > li {
  border-right: 0.5px solid #484e62;
}

.sec > li:last-child {
  border-right: 3px solid #484e62;
}

.done {
  background: #1f2437;
}

/* Y轴 */
.list-team {
  width: 100%;
  text-align: right;
  display: flex;
  flex-direction: column;
}

.list-team > li {
  width: 100%;
  height: 50px;
  line-height: 46px;
  padding-right: 10px;
  /* border: 1px solid red; */
}

/* 绘制内容 */
.list-draw {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-draw > li {
  position: relative;
  width: 100%;
  height: 50px;
  min-height: 50px;
  /* border: 1px solid red; */
}

.list-draw > li div.type-dc,
.list-draw > li div.type-upcomingdc,
.list-draw > li div.type-overdc,
.list-draw > li div.type-xx {
  position: absolute;
  top: 11px;
  height: 24px;
  padding: 3px 5px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 6px;
}

.list-draw .memo {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
  position: relative;
}

.con {
  color: #f0f0f0;
  display: flex;
  flex-direction: column;
}

.con > label {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.warning {
  color: #ff2c2d;
}

.list-draw .memo .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  top: -8px;
}

/*动车*/
.type-dc {
  background: rgba(45, 184, 239, 1);
  display: flex;
  flex-direction: row;
  z-index: 1;
}

.type-overdc {
  background: rgba(45, 184, 239, 0.35);
  display: flex;
  flex-direction: row;
  z-index: 1;
}

.type-upcomingdc {
  background: rgba(45, 184, 239, 0.65);
  display: flex;
  flex-direction: row;
  z-index: 1;
}

/*普速*/
.type-ps {
  background: #7e7cfc;
}

/*热备*/
.type-rb {
  background: #ff8685;
}

/*休息*/
.type-xx {
  background: #fecf9b;
  display: flex;
  flex-direction: row;
}

.cross-flag {
  font-size: 20px;
}

.right-cross {
  position: absolute;
  right: 0;
}

.warn-late {
  color: #ff2c2d;
  font-size: 20px;
  width: 20px;
  animation: ssA 2s infinite;
}

@-webkit-keyframes ssA {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
  }
}

@keyframes ssA {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
  }
}

.cur-time-line {
  width: 1px;
  height: 100%;
  background: #000000;
  filter: opacity(0.5);
  border-right: 1px solid red;
  padding: 0;
  margin: 0;
  position: absolute;
  z-index: 1;
}

.top-content {
  display: flex;
  flex-direction: column;
}

.top-content > span {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.top-content > span > span {
  display: flex;
  flex-direction: column;
}

.top-content > span > span > label:nth-child(2) {
  margin-left: 5px;
}

.top-content > span > label {
  text-align: right;
}

.top-content > span > h2 {
  margin: 0;
  margin-right: 10px;
  text-align: left;
}

.space {
  height: 1px;
  width: 100%;
  margin: 5px 0;
  border-bottom: 1px solid #d8d8d8;
}

>>> .el-tooltip__popper {
  color: #ff2c2d;
}

>>> .el-dialog {
  margin-top: 5% !important;
}

>>> .el-popover--plain {
  padding: 0;
}

>>> .el-popover {
  min-width: auto;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
.poper-time {
  max-height: 500px;
  width: 260px;
}

.poper-time ul {
  max-height: 350px;
  overflow-y: auto;
  padding: 0;
  display: block;
}
</style>
