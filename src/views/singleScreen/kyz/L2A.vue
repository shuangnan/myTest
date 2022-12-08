<!-- 
 * @created：	2021年7月19日
 * @author：	ch
 * @version:	v1.0
 * @desc:		综控、乘降风险计划
 -->
<template>
    <div ref="con" style="width: 100%;height:100%; padding-top: 8px;">
        <L21
            ref="L2zd"
            :boxH="carouselHeight"
            v-show="fxjhSelectType===0"
            :rows="zdDataList"
            :showNum="showNum"
            @changeFXJHTab="changeFXJHTab"
            @openDialogC="openDialogC"
            data-type="zdfx"
        ></L21>
        <L21
            ref="L2zk"
            :boxH="carouselHeight"
            v-show="fxjhSelectType===1"
            :rows="zkDataList"
            :showNum="showNum"
            @changeFXJHTab="changeFXJHTab"
            @openDialogC="openDialogC"
            data-type="zk"
        ></L21>
        <L21
            ref="L2cj"
            :boxH="carouselHeight"
            v-show="fxjhSelectType===2"
            :rows="cjDataList"
            :showNum="showNum"
            @changeFXJHTab="changeFXJHTab"
            @openDialogC="openDialogC"
            data-type="cj"
        ></L21>
        <L21
            ref="L2sg"
            :boxH="carouselHeight"
            v-show="fxjhSelectType===3"
            :rows="sgDataList"
            :showNum="showNum"
            @changeFXJHTab="changeFXJHTab"
            @openDialogC="openDialogC"
            data-type="sg"
        ></L21>
    </div>
</template>

<script>
// 这里引用各种资源
import autoScroll from "../../../components/data/AutoScroll.vue";
import MarqueeText from 'vue-marquee-box';
import C from "../../../assets/com.js";
// import L21 from "./L21.vue";
import L21 from "./L21A.vue";
let RISK_TYPES = {
    // "1": "同站台大客流",
    // "2": "上水吸污作业邻线有车作业",
    // "3": "大客流车次",
};
const RISK_TYPECOLOR = {
    "1": "#f89f93",//红
    "2": "rgb(248,201,85)",//黄
    "3": "#a76431",//暗黄
}
export default {
    // 组件
    components: {
        autoScroll, MarqueeText, L21
    },
    // 数据仓库
    data() {
        return {
            carouselHeight: "200px",
            loadIndex: 0,
            zdDataList: [
                {                    children: [
                        { trackName: "10道", STN_NAME: "成都东", TRAIN: "D5102（CRH2A）", START_STN: "成都东", END_STN: "重庆北", depTime: "10:56", RISK_TYPEString: "<span style='color:#f89f93'>错办：客票/班计划不符</span>", RISK_String: "错办：客票/班计划不符" },
                        { trackName: "16道", STN_NAME: "成都东", TRAIN: "D1825（CRH380D）", START_STN: "成都东", END_STN: "广州南", depTime: "12:34", RISK_TYPEString: "<span style='color:#f89f93'>禁行：成贵客专高坡度限制车型</span>", RISK_String: "禁行：成贵客专高坡度限制车型" }
                    ]                }
            ],
            zkDataList: [],
            cjDataList: [],
            sgDataList: [],//等级，施工地点，日计划号  线路，施工项目，施工日期（施工时间），施工类型。点开显示施工详情 
            showNum: 3,
        }
    },
    // 属性
    props: {
        fxjhSelectType: {
            type: Number,
            default: 0,
        },
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
        this.getDICData();
        this.getData();
        setInterval(() => {
            this.loadIndex = 0;
            this.getData();
        }, 1000 * 1800);
    },
    // 组件挂载完毕
    mounted() {
        //document.querySelector("title").innerHTML = "";//页面名称
        const h = this.$refs.con.offsetHeight - 40;
        this.carouselHeight = h + "px";
        this.showNum = parseInt(h / 55);
        console.log("显示个数", this.showNum);
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {
            var nowDate = new Date();
            // var nowDate = new Date("2021-08-02 00:00:00");
            var stime = nowDate.Format("yyyy-MM-dd 00:00:00");
            var etime = nowDate.Format("yyyy-MM-dd 23:59:59");
            // var etime = new Date(nowDate.getTime() + 1000 * 3600 * 2).Format("yyyy-MM-dd hh:mm:ss");
            // var stime = nowDate.Format("yyyy-MM-dd 00:00:00");
            // var etime = nowDate.Format("yyyy-MM-dd hh:mm:ss");
            this.getDataZK(stime, etime);
            this.getDataCJ(stime, etime);
            this.getDataSG();
        },
        getDataZK(stime, etime) {
            C.getData({
                c: "trdm_ys_340",
                s: [stime, etime],
                o: [this.unitid.toUpperCase()],
                a: "综控风险计划",
                async: true,
            }, (r) => {
                r.forEach(v => {
                    v.trackName = this.initItemBQ(v.TRACK_NAME)[0].replace(/股/, '');
                    v.arrTime = this.initItemBQ(v.ARR_TIME)[0];
                    v.depTime = this.initItemBQ(v.DEP_TIME)[0];
                    v.seqTime = stime.split(" ")[0] + " " + v.ARR_TIME + ":00";
                    v.TRAINKIND = v.TRAINKIND.replace(/darkred/g, "#f89f93");
                    v.CHECK_PLATFORM_LIST = this.initItemBQ(v.CHECK_PLATFORM);
                    v.TRACK_NAME_LIST = this.initItemBQ(v.TRACK_NAME);
                    v.TRAIN_CARS_UP_LIST = this.initItemBQ(v.TRAIN_CARS_UP);
                    v.RISK_TYPEString = [];
                    if (["加开", "停运"].includes(v.DATATYPE)) {
                        v.RISK_TYPEString.push(v.DATATYPE);
                    }
                    if (v.TRACK_NAME_LIST.length > 1) {
                        v.RISK_TYPEString.push(`<span>${v.TRACK_NAME_LIST[0]}</span>/<span style="color:#f89f93">${v.TRACK_NAME_LIST[1]}</span>`)
                    }
                    if (v.TRAIN_CARS_UP_LIST.length > 1) {
                        v.RISK_TYPEString.push(`<span>${v.TRAIN_CARS_UP_LIST[0]}</span>/<span style="color:#f89f93">${v.TRAIN_CARS_UP_LIST[1]}</span>`);
                    }
                    if (v.CHECK_PLATFORM_LIST.length > 1) {
                        v.RISK_TYPEString.push(`<span>${v.CHECK_PLATFORM_LIST[0]}</span>/<span style="color:#f89f93">${v.CHECK_PLATFORM_LIST[1]}</span>`);
                    }
                    if (v.TRAINKIND.includes("/")) {
                        v.RISK_TYPEString.push(v.TRAINKIND);
                    }
                    if (v.ARR_TIME.includes("/")) {
                        v.RISK_TYPEString.push(v.ARR_TIME.replace(/darkred/g, "#f89f93"));
                    }
                    if (v.DEP_TIME.includes("/")) {
                        v.RISK_TYPEString.push(v.DEP_TIME.replace(/darkred/g, "#f89f93"));
                    }
                    v.RISK_TYPEString = v.RISK_TYPEString.join("&emsp;");
                    v.RISK_String = v.RISK_TYPEString.replace(/<\/?.+?\/?>/g, '');
                    v.RISK_String = v.RISK_String.replace(/\&emsp;/g, '');
                    v.hxFlag = (v.STN_NAME == v.START_STN) && (v.STN_NAME == v.END_STN);
                })
                var dataList = C.creatJsonArrByKey(r, "STN_CODE");
                this.zkDataList = dataList;
                this.$nextTick(() => {
                    this.loadDataList();
                })
                console.log("综控风险计划", dataList);
            })
        },
        getDataCJ(stime, etime) {

            C.getData({
                c: "trdm_ys_341",
                s: [stime, etime],
                o: [this.unitid.toUpperCase()],
                a: "乘降风险计划",
                async: true,
            }, (r) => {
                r.forEach(t => {
                    t.trackName = this.initItemBQ(t.TRACK_NAME)[0].replace(/股/, '');
                    // t.TRACK_NAME = t.TRACK_NAME.replace(/股/, '');
                    t.arrTime = this.ft_time(t.ARR_TIME, "hh:mm");
                    t.depTime = this.ft_time(t.DEP_TIME, "hh:mm");
                    t.seqTime = t.ARR_TIME;
                    let typeList = t.RISK_TYPES.split("-");
                    var typeSList = [];
                    typeList.forEach(v => {
                        if(RISK_TYPES[v]){
                            typeSList.push(`<span style='color:${RISK_TYPES[v].color}'>${RISK_TYPES[v].text}</span>`)
                        }
                        
                    });
                    t.RISK_TYPEString = typeSList.join("，");
                    t.RISK_String = t.RISK_TYPEString.replace(/<\/?.+?\/?>/g, '');
                    t.hxFlag = (t.STN_NAME == t.START_STN) && (t.STN_NAME == t.END_STN);
                })
                var dataList = C.creatJsonArrByKey(r, "STN_CODE");
                this.cjDataList = dataList;
                this.$nextTick(() => {
                    this.loadDataList();
                })
                console.log("乘降风险计划", JSON.parse(JSON.stringify(dataList)));
            })
        },
        getDataSG() {
            var date = new Date();
            var sdate = date.Format("yyyyMMdd");
            C.getDataP123({
                c: "kydp_zxy2056",
                s: [[1, "", sdate, sdate, "成都"]],
                // s: [[1, "", "20220101", sdate, "成都"]],
                url: C.kydUrl,
                a: "施工风险计划kydp_zxy2056",
            }, (rs) => {
                var r = rs[1];
                r.forEach(v => {
                    v.trackName = v.GRADE;
                    v.STN_NAME = v.LOCATION;
                    v.TRAIN = v.CODE + " " + v.ROUTE;
                    v.START_STN = v.TYPE;
                    v.arrTime = v.DO_DATE + "(" + v.DO_TIME + ")"
                    v.seqTime = v.DO_DATE.substring(0, 4) + "-" + v.DO_DATE.substring(4, 6) + "-" + v.DO_DATE.substring(6) + " " + v.DO_TIME.split("-")[0] + ":00";
                    v.RISK_String = v.CONDITION_LIMIT;
                    v.RISK_TYPEString = v.CONDITION_LIMIT;
                });
                var dataList = C.creatJsonArrByKey(r, "GRADE");
                this.sgDataList = dataList;//等级，施工地点，日计划号  线路，施工项目，施工日期（施工时间），施工类型。点开显示施工详情 
                console.log("施工风险计划kydp_zxy2056", dataList);
            })
        },
        changeFXJHTab() {
            this.$emit("changeFXJHTab");
            this.$nextTick(() => {
                var changeDataList = [];
                if (this.fxjhSelectType === 0) {
                    changeDataList = this.zkDataList;
                } else if (this.fxjhSelectType === 1) {
                    changeDataList = this.cjDataList;
                } else if (this.fxjhSelectType === 2) {
                    changeDataList = this.sgDataList;
                } else if (this.fxjhSelectType === 3) {
                    changeDataList = this.zdDataList;
                }
                // if (changeDataList.length === 0) {
                //   setTimeout(() => {
                //     this.$emit("changeFXJHTab");
                //     console.log("L2ST切换");
                //   }, 1500);
                // }
            })
        },
        //综控加载完成事件
        loadDataList() {
            this.loadIndex += 1;
            if (this.loadIndex == 2) {
                this.startScroll();
            }
        },
        startScroll() {
            this.$refs.L2zd.startScroll();
        },
        ft_time(date, ft_str) {
            let rs = "";
            if (date) {
                rs = new Date(date).Format(ft_str);
            }
            return rs;
        },
        initItemBQ(value) {
            value = value.replace(/<\/?.+?\/?>/g, "");
            var ss = value.split("/");
            return ss;
        },
        openDialogC(item, type) {
            this.$emit("openDialogC", item, type);
        },
        clearSetTimeOut() {
            if (this.$refs.L2zk) {
                this.$refs.L2zk.clearSettimeOut();
            }
            if (this.$refs.L2cj) {
                this.$refs.L2cj.clearSettimeOut();
            }
            if (this.$refs.L2sg) {
                this.$refs.L2sg.clearSettimeOut();
            }
            if (this.$refs.L2zd) {
                this.$refs.L2zd.clearSettimeOut();
            }
        },
        getDICData() {
            C.getData({
                c: "trdm_zjm_147",
                s: ["ALL", "'KYFX_FXLX_CC','KYFX_FXLX_FCC'"],
                a: "获取客运风险类型",
                async: true,
            }, (r) => {
                if(r[0]){
                    var tempList=r[0].VALUE.split(",");
                    tempList.forEach(v=>{
                        var item=v.split("@");
                        var row={text:item[2],color:RISK_TYPECOLOR[item[0]]};
                        RISK_TYPES[item[1]]=row;
                    })
                }
            })
        },
    },
    // 监视属性
    watch: {
        unitid() {
            this.loadIndex = 0;
            this.getData();
        },
        fxjhSelectType(val) {
            setTimeout(() => {
                if (val === 0) {
                    this.$refs.L2zd.startScroll();
                } else if (val === 1) {
                    this.$refs.L2zk.startScroll();
                } else if (val === 2) {
                    this.$refs.L2cj.startScroll();
                } else if (val === 3) {
                    this.$refs.L2sg.startScroll();
                }
            }, 500);
        }
    },
    // 计算属性
    computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.s-table {
    width: 100%;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 2px;
    padding: 0px 10px;
}

.s-table > tbody > tr {
    height: 60px;
    background: url(img/picL21.png) no-repeat;
    background-size: 100% 48px;
    background-position: 0px 6px;
}

.s-table > tbody > tr > th {
    /* border: 1px solid red; */
}
>>> .el-carousel__item {
    height: 100%;
    white-space: nowrap;
}
.L2_stns > span {
    white-space: nowrap;
    display: inline-block;
    vertical-align: top;
    max-width: 55px;
    overflow: hidden;
    text-overflow: ellipsis;
}
>>> .el-carousel__indicators--horizontal {
    width: 70%;
    text-align: center;
}
>>> .el-carousel__button {
    width: 10px;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
