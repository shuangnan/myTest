<!-- 
 * @created：	2021年7月19日
 * @author：	ch
 * @version:	v1.0
 * @desc:		生产管控
 -->
<template>
    <div style="width: 100%;height: 100%;padding:0px 15px;">
        <div class="box">
            <div
                id="R1EchartBox"
                class="top-info"
                @mouseover="R1ToolTip.showFlag=false"
                @mouseout="R1ToolTip.showFlag=true"
            >
                <R1Chart :chartData="chartData"></R1Chart>
                <div
                    class="gradientLeftR1"
                    :style="{width:R1ToolTip.left+'px',height:R1ToolTip.height}"
                    v-show="R1ToolTip.showFlag"
                    style
                >
                    <div style="padding-right:10px;color:#eee;">
                        <div>{{R1ToolTip.name}}</div>
                        <div>进站：{{R1ToolTip.jz}}</div>
                        <div>出站：{{R1ToolTip.cz}}</div>
                        <div>到达：{{R1ToolTip.dd}}</div>
                        <div>出发：{{R1ToolTip.cf}}</div>
                    </div>
                </div>
            </div>
            <div class="other-info" :style="{backgroundImage: 'url('+require('./img/picR13.png')}">
                <div class="sg" @click="openSGJH">
                    <div class="shadow-txt">62</div>
                    <div class="tit">施工计划</div>
                </div>
                <div class="yx textBtn" @click="openTYRW">
                    <div class="shadow-txt">{{tyrwNum}}</div>
                    <div class="tit">统一任务</div>
                </div>
                <div class="xc textBtn" @click="openXCDDML">
                    <div class="shadow-txt">62</div>
                    <div class="tit">客调命令</div>
                </div>
            </div>
            <div class="other-info" :style="{backgroundImage: 'url('+require('./img/picR14.png')}">
                <!-- <div class="wx">
          <div class="shadow-txt">{{wxpNum}}</div>
          <div class="tit">危险品查堵</div>
                </div>-->
                <div class="ys">
                    <div class="shadow-txt">{{ysNum}}</div>
                    <div class="tit">遗失物品处理</div>
                </div>
                <div class="lk">
                    <div class="shadow-txt">{{qzNum}}</div>
                    <div class="tit">旅客投诉求助</div>
                </div>
                <div class="zd">
                    <div class="shadow-txt">{{zdNum}}</div>
                    <div class="tit">重点旅客数量</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import R1Chart from './R1Chart.vue';
import C from "../../../assets/com.js";
export default {
    // 组件
    components: {
        R1Chart
    },
    // 数据仓库
    data() {
        return {
            dataList: [],//图标数据
            R1ToolTip: {//客流情况滚动显示数据
                showFlag: true,//是否显示
                left: 0,//距离左侧距离
                name: "",//名称
                jz: "",//进站
                cz: "",//出站
                dd: "",//到达
                cf: "",//出发
                height: "calc(100% - 70px)",
            },
            systemTime: "",
            chartData: [[], [], [], []],
            ysNum: "0",
            qzNum: "0",
            zdNum: "0",
            wxpNum: "0",
            tyrwNum: "0",
        }
    },
    // 属性
    props: {
        unitid: {
            type: String,
            default: "",
        },
        unitselectName: {
            type: String,
            default: "",
        }
    },
    created() {
        this.getData();
    },
    // 组件挂载完毕
    mounted() {
        var myChartH = document.getElementById("R1EchartBox").offsetHeight;
        if (myChartH > 160) {
            this.R1ToolTip.height = "calc(100% - 80px)";
        }
        //document.querySelector("title").innerHTML = "";//页面名称
        setInterval(() => {
            this.countKLQKToolTip();
        }, 1000);
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        openSGJH() {
            this.$emit("openDetail", "sgjh");
        },
        openTYRW() {
            this.$emit("openDetail", "tyrw");
        },
        openXCDDML() {
            this.$emit("openDetail", "XCDDML");
        },
        /* @info  数据处理区-----------------------------------*/
        initNum(val) {
            if (val) {
                return Number(val);
            } else {
                return 0
            }
        },
        //计算滚动显示数据
        countKLQKToolTip() {
            if (this.dataList.length == 0) {
                return;
            }
            this.systemTime = new Date();
            var nowTime = this.systemTime;
            var hm = nowTime.Format("hh:mm");
            this.R1ToolTip.left = this.countKLQKToolTipLeft(this.systemTime.Format("yyyy-MM-dd hh:mm:ss"));
            this.R1ToolTip.name = hm;
            var nowTimes = nowTime.getTime();
            this.dataList.forEach(v => {
                var stime = new Date(v.STIME).getTime();
                var etime = new Date(v.ETIME).getTime();
                if (stime < nowTimes && nowTimes <= etime) {
                    this.R1ToolTip.jz = this.initNum(v.BZSC);
                    this.R1ToolTip.cz = this.initNum(v.BZXC);
                    this.R1ToolTip.dd = this.initNum(v.DDCC);
                    this.R1ToolTip.cf = this.initNum(v.CFCC);
                }
            })
        },
        //根据时间获取滚动显示数据距离左侧
        countKLQKToolTipLeft(time) {
            var boxWidth = 394;
            if (document.getElementById("R1EchartBox")) {
                boxWidth = document.getElementById("R1EchartBox").offsetWidth;
            }
            var timeWidth = boxWidth - 90;
            var nowDay = new Date(time.split(" ")[0] + " 00:00:00");
            var nowTime = new Date(time);
            var toolTipWIdth = (nowTime.getTime() - nowDay.getTime()) / (3600 * 24 * 1000) * timeWidth - 5;
            return toolTipWIdth;
        },

        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {
            var date = new Date().Format("yyyy-MM-dd");
            C.getData({
                c: "trdm_ys_336",
                s: [date],
                o: [this.unitid.toUpperCase()],
                a: "【trdm_ys_336】到达出发车辆数与人数",
                async: true,
            }, (r) => {
                this.dataList = r;
                var chartData = [[], [], [], []];
                r.forEach(v => {
                    chartData[0].push(this.initNum(v.BZSC));//进站
                    chartData[1].push(this.initNum(v.BZXC));//出站
                    chartData[2].push(this.initNum(v.DDCC));//到达
                    chartData[3].push(this.initNum(v.CFCC));//出发
                });
                this.chartData = chartData;
                console.log("到达出发车辆数与人数", r, chartData);
            })
            var sdate = new Date().Format("yyyy-MM-01");
            this.getYSTSZDData(sdate, date, (rs) => {
                if (rs[0]) {
                    this.ysNum = rs[0].COUNT1;
                    this.qzNum = rs[0].COUNT2;
                    this.zdNum = rs[0].COUNT3;
                }
                console.log("遗失物品，求助投诉，重点旅客", rs);
            })
            this.getTYRWData(date + " 00:00:00", date + " 23:59:59", (rs) => {
                console.log("生成管控 统一任务统计 trdm_ys_500", rs);
                if (rs[0]) {
                    this.tyrwNum = rs[0].COUNT;
                }
            });

        },
        getYSTSZDData(sdate, edate, callback) {
            C.getData({
                c: "trdm_ys_343",
                s: [this.unitselectName, sdate, edate],
                a: "【trdm_ys_343】遗失物品，求助投诉，重点旅客",
                async: true,
            }, (r) => {
                callback(r);
            })
        },
        getTYRWData(sdate, edate, callback) {
            C.getData({
                c: "trdm_ys_500",
                s: [this.unitid, sdate, edate],
                a: "【trdm_ys_500】统一任务统计",
                async: true,
            }, (r) => {
                callback(r);
            })
        },

    },
    // 监视属性
    watch: {
        unitid() {
            this.getData();
        }
    },
    // 计算属性
    computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.box {
    width: 100%;
    height: 100%;
    /* background: url(img/picR11.png) no-repeat; */
    /* background-size: 100% 100%; */
    color: #c2ccf5;
}

.top-info {
    position: relative;
    height: 60%;
    background: url(img/picR12.png) no-repeat;
    background-size: 100% 100%;
}

.other-info {
    width: 100%;
    height: 20%;
    padding: 0px 30px;
    display: flex;
    text-align: center;
    justify-content: space-between;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    align-items: center;
}
.other-info > div {
    background: url(img/picR12.gif) no-repeat;
    background-position: center;
    height: 87px;
    min-width: 72px;
}
.other-info > div.warning {
    background: url(img/picR13.gif) no-repeat;
    background-position: center;
}
.other-info > div.yx {
    background: url(img/ml3.gif) no-repeat;
    background-position: center;
}
.other-info > div.sg {
    background: url(img/ml2.gif) no-repeat;
    background-position: center;
}
.other-info > div.xc {
    background: url(img/ml1.gif) no-repeat;
    background-position: center;
}
.other-info > div.wx {
    background: url(img/ml6.gif) no-repeat;
    background-position: center;
}
.other-info > div.ys {
    background: url(img/ml4.gif) no-repeat;
    background-position: center;
}
.other-info > div.lk {
    background: url(img/ml5.gif) no-repeat;
    background-position: center;
}
.other-info > div.zd {
    background: url(img/ml9.gif) no-repeat;
    background-position: center;
}
.other-info .shadow-txt {
    padding-top: 8px;
    font-size: 28px;
    font-weight: bold;
}
.other-info .tit {
    padding: 18px 0px;
    line-height: 30px;
    font-size: 12px;
}
.gradientLeftR1 {
    position: absolute;
    top: 40px;
    height: calc(100% - 70px);
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    left: 55px;
    min-width: 80px;
    border-right: 3px solid #5d95b8;
    background-image: repeating-linear-gradient(
        270deg,
        rgba(62, 130, 196, 0.9),
        rgba(62, 130, 196, 0.4) 30%,
        rgba(62, 130, 196, 0)
    );
    font-size: 12px;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
