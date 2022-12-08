<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		应急管控
 -->
<template>
    <div class="box">
        <div class="box-item">
            <div class="group-tit">
                <span>晚点列车</span>
            </div>
            <div class="tongji1" style="padding:10px 0">
                <div class="tongji1_bg">
                    <div class="wd">
                        <div>晚点</div>
                        <div>{{wdAll}}列</div>
                    </div>
                    <div class="ty">
                        <div>停运</div>
                        <div>{{tyALL}}列</div>
                    </div>
                    <div class="gd textBtn" @click="openDetail('gdbg')">
                        <div>股道变更</div>
                        <div>122列</div>
                    </div>
                    <div class="zf">
                        <div>折返</div>
                        <div>0列</div>
                    </div>
                </div>
            </div>
            <table class="s-table" cellspacing="0">
                <tbody>
                    <tr v-for="(item,i) in rows" :key="i">
                        <td style="padding-left: 10px;">{{item.name}}</td>
                        <td style="width: 30px;text-align: right;padding-right: 5px;">{{item.num}}</td>
                        <td style="width: 70px;">
                            <div class="percent">
                                <span :style="{width:item.pre+'%'}" :title="parseInt(item.pre)+'%'">
                                    <div class="warning"></div>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <div v-if="view===1" class="box-item">
      <div class="group-tit">
        <span>应急预案</span>
      </div>
      <div class="tongji">
        <div>
          <label>总启动数</label>
          <span class="shadow-txt">{{yjCount}}个</span>
        </div>
        <div class="small">
          <label>本年</label>
          <span class="shadow-txt">{{yjYear}}个</span>
        </div>
        <div class="small">
          <label>本月</label>
          <span class="shadow-txt">{{yjMonth}}个</span>
        </div>
      </div>
      <table class="s-table two" cellspacing="0" style="margin-top: 5px;">
        <tbody v-for="item in rows2">
          <tr>
            <td style="width: 110px;padding-left: 40px;">成灌线</td>
            <td style="font-size: 12px;">
              <div style="color: #CF6051;">受影响车次：3列</div>
              <div>接触网异物</div>
            </td>
          </tr>
        </tbody>
      </table>
        </div>-->
        <div class="box-item" style="overflow:hidden;height:calc(50% - 10px)">
            <div class="group-tit">
                <span>应急预案</span>
            </div>
            <div class="chart">
                <div
                    :class="{'chartItem1':!(yjCount>0),'chartItem2':yjCount>0}"
                    style="width:100%;height:167px;"
                >
                    <div class="btn_ldld" @click="openDetail('ldld')">
                        <div>路地</div>
                        <div>联动</div>
                    </div>
                    <div class="circle"></div>
                    <label @click="openDetail('kzyjgl')" class="textBtn" title="客站应急管理">总启动数</label>
                    <span @click="openDetail('kzyjgl')">
                        <a class="shadow-txt">{{yjCount}}</a>
                        <a style="font-size: 12px;">个</a>
                    </span>
                </div>
            </div>
            <div class="percent2">
                <div>
                    <label>本年</label>
                    <span>
                        {{yjYear}}
                        <a>个/占总数{{yjYearPie}}</a>
                    </span>
                </div>
                <div>
                    <label>本月</label>
                    <span>
                        {{yjMonth}}
                        <a>个/占总数{{yjMonthPie}}</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import C from "../../../assets/com.js";
export default {
    // 组件
    components: {},
    // 数据仓库
    data() {
        return {
            view: 2,
            wdAll: "",
            tyALL: "",
            rows: [{ id: "WD_DEP", name: "始发晚点", num: 0, pre: 0 }, { id: "WD_TG", name: "通过晚点", num: 0, pre: 0 }, { id: "WD_ARR", name: "终到晚点", num: 0, pre: 0 },
            { id: "TY_TG", name: "通过停运", num: 0, pre: 0 }, { id: "TY_ARR", name: "终到停运", num: 0, pre: 0 }],
            rows2: 3,
            yjCount: "",
            yjYear: "",
            yjMonth: "",
            yjCountALL:"",
        }
    },
    // 属性
    props: {
        webParam: {
            type: Object,
            default: () => { return {} }
        },
        unitid: {
            type: String,
            default: "",
        }
    },
    created() {
        this.getData();
    },
    // 组件挂载完毕
    mounted() {
        //document.querySelector("title").innerHTML = "";//页面名称

    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {
            var date = new Date().Format("yyyy-MM-dd");
            var p01 = new Promise((resolve, reject) => {
                C.getData({
                    c: "trdm_ys_337",
                    s: [date],
                    o: [this.unitid.toUpperCase()],
                    a: "【trdm_ys_337】晚点停运统计",
                    async: true,
                }, (r) => {
                    resolve(r);
                })
            });
            var p02 = new Promise((resolve, reject) => {
                C.getData({
                    c: "trdm_zjm_137",
                    o: [this.unitid.toUpperCase()],
                    a: "【trdm_zjm_137】当日列车停用数量",
                    async: true,
                }, (r) => {
                    resolve(r);
                })
            });
            Promise.all([p01, p02]).then((result) => {
                var r = result[0];
                var r1 = result[1];
                var all = { "WD_ALL": 0, "TY_ALL": 0 }
                r.forEach(v => {
                    if (v.TYPE == "WD_ALL") {
                        all["WD_ALL"] = v.COUNT;
                        this.wdAll = v.COUNT;
                    }
                    if (v.TYPE == "TY_ALL") {
                        all["TY_ALL"] = v.COUNT;
                        this.tyALL = v.COUNT;
                    }
                })
                this.rows.forEach(v => {
                    r.forEach(m => {
                        if (v.id == m.TYPE) {
                            v.num = m.COUNT;
                            var type = m.TYPE.split("_")[0];
                            v.pre = v.num / all[type + "_ALL"] * 100;
                        }
                    })
                });
                if (r1[0]) {
                    this.tyALL = r1[0].COUNT;
                }
                console.log("晚点停运统计", r);
            })
            // C.getData({
            //     c: "trdm_ys_337",
            //     s: [date],
            //     o: [this.unitid.toUpperCase()],
            //     a: "【trdm_ys_337】晚点停运统计",
            //     async: true,
            // }, (r) => {
            //     var all = { "WD_ALL": 0, "TY_ALL": 0 }
            //     r.forEach(v => {
            //         if (v.TYPE == "WD_ALL") {
            //             all["WD_ALL"] = v.COUNT;
            //             this.wdAll = v.COUNT;
            //         }
            //         if (v.TYPE == "TY_ALL") {
            //             all["TY_ALL"] = v.COUNT;
            //             this.tyALL = v.COUNT;
            //         }
            //     })
            //     this.rows.forEach(v => {
            //         r.forEach(m => {
            //             if (v.id == m.TYPE) {
            //                 v.num = m.COUNT;
            //                 var type = m.TYPE.split("_")[0];
            //                 v.pre = v.num / all[type + "_ALL"] * 100;
            //             }
            //         })
            //     })
            //     console.log("晚点停运统计", r);
            // });
            // var month = new Date().Format("yyyy-MM");
            // C.getData({
            //   c: "trdm_ys_338",
            //   s: [this.unitid.toUpperCase(), month],
            //   o: [this.unitid.toUpperCase()],
            //   a: "应急预案统计",
            //   async: true,
            // }, (r) => {
            //   if (r[0]) {
            //     this.yjCount = r[0].ALLCOUNT;
            //     this.yjYear = r[0].YEAR;
            //     this.yjMonth = r[0].MONTH;
            //   }
            //   console.log("应急预案统计", r);
            // })
            var date = new Date();
            var sYear = date.Format("yyyy");
            var nYear = Number(sYear) + 1;
            var sMonth = date.Format("yyyy-MM");
            date.setMonth(date.getMonth() + 1);
            var nMonth = date.Format("yyyy-MM");
            C.getData({
                c: "trdm_zjm_135",
                s: [this.unitid.toUpperCase(), sYear, nYear, sMonth, nMonth],
                a: "应急预案统计",
                async: true,
            }, (r) => {
                if (r && r[0]) {
                    this.yjCount = r[0].NUM1;
                    this.yjYear = r[0].NUM2;
                    this.yjMonth = r[0].NUM3;
                    this.yjCountALL= r[0].NUM4;
                }
                // NUM1：总数量 NUM2：年数量 NUM3：月数量 NUM4：年百分比 NUM5：月百分比

                console.log("应急预案统计", r);
                //     this.yjCount = r[0].ALLCOUNT;
                //     this.yjYear = r[0].YEAR;
                //     this.yjMonth = r[0].MONTH;
            })
        },
        openDetail(type) {
			if(type==="ldld"){
				window.open("http://192.167.128.169:7001/share/85b82386-9cf4-4f46-bd93-f5ed818ef249")
			}else{
				this.$emit("openDetail", type);
			}
        }
    },
    // 监视属性
    watch: {
        unitid() {
            this.getData();
        }
    },
    // 计算属性
    computed: {
        yjYearPie() {
            if (!this.yjCountALL || this.yjCountALL == "0") {
                return "0%";
            }
            return parseInt(this.yjYear / this.yjCountALL * 100) + "%";
        },
        yjMonthPie() {
            if (!this.yjCountALL || this.yjCountALL == "0") {
                return "0%";
            }
            return parseInt(this.yjMonth / this.yjCountALL * 100) + "%";
        }
    },
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.box {
    width: 100%;
    height: 100%;
    font-weight: bold;
    background: url(img/picR21.png) no-repeat;
}

.box-item {
    height: 50%;
    display: flex;
}

.box-item > div {
}

.group-tit {
    width: 50px;
    padding: 8px 12px;
    text-align: center;
}

.group-tit > span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3px;
    width: 24px;
    height: 100%;
    color: #d0c5e3;
    font-size: 12px;
    background: #09295a;
}

.tongji {
    width: 120px;
    color: #bad9de;
    text-align: center;
}

.tongji > div {
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
}

.tongji > div.small {
    height: 20%;
    padding-top: 10px;
    line-height: 26px;
}

.tongji label {
    display: block;
    font-size: 16px;
    width: 100%;
}

.tongji span {
    display: block;
    font-size: 24px;
    width: 100%;
}

.tongji > div.small label {
    font-size: 14px;
    display: inline-block;
    padding-right: 5px;
}

.tongji > div.small span {
    font-size: 18px;
    display: inline-block;
}

.s-table {
    width: calc(100% - 170px);
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 2px;
    padding: 0px 10px;
    height: 100%;
}

.s-table > tbody > tr {
    background: url(img/picR22.png) no-repeat;
    background-size: 100% 100%;
}

.s-table.two > tbody > tr {
    height: 56px;
    background: url(img/picR23.png) no-repeat;
    background-size: 100% 46px;
    background-position: 0px 5px;
}

.percent {
    display: inline-block;
    height: 8px;
    width: 100%;
}

.percent > span {
    display: inline-block;
    height: 100%;
    background: #6acbf8;
}

.chart {
    position: relative;
    display: flex;
    width: 250px;
    height: 100%;
    text-align: center;
    font-size: 12px;
    color: #aec0f2;
    align-items: center;
}
.chartItem1 {
    background: url(img/picR24.gif) no-repeat;
    background-size: 160px auto;
    background-position: 20px 25px;
    position: relative;
}
.chartItem2{
    background: url(img/picR24C.gif) no-repeat;
    background-size: 160px auto;
    background-position: 20px 25px;
    position: relative;
}
.chart > div {
}
.chart .circle {
    position: absolute;
    top: 30px;
    left: 50px;
    width: 102px;
    height: 102px;
    /* border: 10px solid #3692dd; */
    border-radius: 50%;
    border-top-color: transparent;
    transform: rotate(45deg);
}

.chart label {
    position: absolute;
    width: 80px;
    top: 59px;
    left: 61px;
    display: inline-block;
    font-size: 14px;
    color: #bad9de;
    /* border: 1px solid red; */
}

.chart span {
    position: absolute;
    width: 80px;
    top: 80px;
    left: 61px;
    display: inline-block;
    font-size: 18px;
    /* border: 1px solid red; */
}

.percent2 {
    display: inline-block;
    width: 50%;
    height: 100%;
    color: #aec0f2;
    text-align: center;
}
.percent2 > div {
    height: 50%;
    padding: 10px 0;
    line-height: 30px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    /* border: 1px solid red; */
}
.percent2 label {
    display: block;
    font-size: 16px;
    color: #bad9de;
}

.percent2 span {
    display: block;
    font-size: 18px;
}
.percent2 span > a {
    margin-left: 5px;
    font-size: 12px;
}

/* 进度条动画 */
.warning {
    height: 100%;
}
.warning {
    position: relative;
    /* background-size: 10px 10px; */
    background-size: 1em 10px;
    /* background-image: linear-gradient(-90deg, transparent 0em, transparent 0.8em, #96D923 0.9em, #96D923 2.1em, transparent 2.1em, transparent 2.9em, #96D923 3.1em); */
    background-image: linear-gradient(
        -270deg,
        transparent 10px,
        #273bad49 10px,
        transparent 20px
    );
    animation: warning-animation 2s infinite linear;
}
.warning:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    border-radius: 10px;
}
@keyframes warning-animation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 3em 0;
    }
}
.itemCenter {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn_ldld {
    position: absolute;
    right: 0px;
    top: 20px;
    background: url("./img/R2_ldld.gif") no-repeat;
    width: 100px;
    height: 80px;
    background-size: 100% auto;
    cursor: pointer;
    font-size: 12px;
    color: #fff;
    display: flex;
}
.btn_ldld > div:nth-child(1) {
    position: absolute;
    top: 30%;
    left: 30%;
}
.btn_ldld > div:nth-child(2) {
    position: absolute;
    top: 45%;
    left: 55%;
}
.tongji1 {
    width: 120px;
    color: #bad9de;
    text-align: center;
}
.tongji1_bg {
    background: url("./img/R2_wd.gif") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    font-size: 12px;
    position: relative;
}
.tongji1_bg > div {
    cursor: pointer;
}
.tongji1_bg > .wd {
    position: absolute;
    color: #ff6062;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
}
.tongji1_bg > .ty {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0px;
    line-height: 28px;
    color: rgb(255, 124, 254);
}
.tongji1_bg > .gd {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5px;
    color: rgb(129, 251, 252);
}
.tongji1_bg > .zf {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0px;
    line-height: 28px;
    color: rgb(136, 147, 237);
}

</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
