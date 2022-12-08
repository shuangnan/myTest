<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		人员安排
 -->
<template>
    <div style="width:100%;height:100%;padding:5px;display:flex">
        <div style="width:calc(50% - 41px);height:100%;margin:0 20px">
            <div style="height:35px;width:100%;">
                <div class="LW1Title shadow-txt">动车</div>
            </div>
            <div style="height:calc(50% - 25px);width:100%;">
                <LW1Item
                    ref="LW1Item1"
                    title="旅客到发"
                    title1="发送人数"
                    title2="到达人数"
                    :num="DFPNUM"
                    :numD="DFPNUMD"
                    :dataListF="DPeopleDataS"
                    :dataListD="DPeopleDataE"
                ></LW1Item>
            </div>
            <div class="DLCDF" style="height:calc(50% - 25px);width:100%;margin-top:10px;">
                <LW1Item
                    ref="LW1Item2"
                    title="列车到发"
                    title1="发送车数"
                    title2="到达车数"
                    :num="DFTNUM"
                    :numD="DFTNUMD"
                    :dataListF="DTraindataS"
                    :dataListD="DTraindataE"
                ></LW1Item>
            </div>
        </div>
        <div class="LW1LINE_H" style="width:2px;height:100%;"></div>
        <div style="width:calc(50% - 41px);height:100%;margin:0 20px">
            <div style="height:35px;width:100%;">
                <div class="LW1Title shadow-txt">普速</div>
            </div>
            <div style="height:calc(50% - 25px);width:100%;">
                <LW1Item
                    ref="LW1Item3"
                    title="旅客到发"
                    title1="发送人数"
                    title2="到达人数"
                    :num="PFPNUM"
                    :numD="PFPNUMD"
                    :dataListF="PPeopleDataS"
                    :dataListD="PPeopleDataE"
                ></LW1Item>
            </div>
            <div class="PLCDF" style="height:calc(50% - 25px);width:100%;margin-top:10px;">
                <LW1Item
                    ref="LW1Item4"
                    title="列车到发"
                    title1="发送车数"
                    title2="到达车数"
                    :num="PFTNUM"
                    :numD="PFTNUMD"
                    :dataListF="PTraindataS"
                    :dataListD="PTraindataE"
                ></LW1Item>
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import LW1Item from "./LW1Item.vue";
import C from "../../../assets/com.js";
export default {
    // 组件
    components: { LW1Item },
    // 数据仓库
    data() {
        return {
            DTraindataS: [],
            DTraindataE: [],
            DPeopleDataS: [],
            DPeopleDataE: [],
            PTraindataS: [],
            PTraindataE: [],
            PPeopleDataS: [],
            PPeopleDataE: [],
            DFTNUM: 0,
            DFPNUM: 0,
            PFTNUM: 0,
            PFPNUM: 0,
            DFTNUMD: 0,
            DFPNUMD: 0,
            PFTNUMD: 0,
            PFPNUMD: 0,
        }
    },
    // 属性
    props: {
        unitid: {
            type: String,
            default: "",
        }
    },
    // 组件挂载完毕
    mounted() {
        // document.querySelector("title").innerHTML = "页面名称";
        this.getData();
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {
            var sdate = new Date().Format("yyyy-MM-01");
            var edate = new Date().Format("yyyy-MM-dd");
            this.DTraindataS = [];
            this.DTraindataE = [];
            this.DPeopleDataS = [];
            this.DPeopleDataE = [];
            this.PTraindataS = [];
            this.PTraindataE = [];
            this.PPeopleDataS = [];
            this.PPeopleDataE = [];
            this.DFTNUM = 0;
            this.DFPNUM = 0;
            this.PFTNUM = 0;
            this.PFPNUM = 0;
            C.getData({
                c: "trdm_zjm_059",
                s: [edate + " 00:00:00", edate + " 23:59:59"],
                w: [edate + " 00:00:00", edate + " 23:59:59"],
                o: [this.unitid.toUpperCase()],
                a: "【trdm_zjm_059】LW1车数人数统计",
                async: true,
            }, (r) => {
                r.forEach(v => {
                    var trainRow = { name: v.STN, value: v.COUNT };
                    var peopleRow = { name: v.STN, value: v.RS };
                    if (v.TYPE == "11") {//动发
                        this.DFTNUM += Number(v.COUNT);
                        this.DFPNUM += Number(v.RS);
                        this.DTraindataS.push(trainRow);
                        this.DPeopleDataS.push(peopleRow);
                    } else if (v.TYPE == "12") {//动到
                        this.DFTNUMD += Number(v.COUNT);
                        this.DFPNUMD += Number(v.RS);
                        this.DTraindataE.push(trainRow);
                        this.DPeopleDataE.push(peopleRow);
                    } else if (v.TYPE == "21") {//普发
                        this.PFTNUM += Number(v.COUNT);
                        this.PFPNUM += Number(v.RS);
                        this.PTraindataS.push(trainRow);
                        this.PPeopleDataS.push(peopleRow);
                    } else if (v.TYPE == "22") {//普到
                        this.PFTNUMD += Number(v.COUNT);
                        this.PFPNUMD += Number(v.RS);
                        this.PTraindataE.push(trainRow);
                        this.PPeopleDataE.push(peopleRow);
                    }
                });
                this.$nextTick(() => {
                    for (var i = 1; i < 5; i++) {
                        this.$refs['LW1Item' + i].initChartDatda();
                    }
                })
                console.log("【trdm_zjm_059】LW1车数人数统计", r);
            })
        }
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
.LW1_TAB {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
}
.LW1_TAB_BOX1 {
    display: flex;
    border-right: 1px solid #fff;
    height: 80%;
    flex-direction: column;
    justify-content: center;
}
.flexCenter {
    display: flex;
    justify-content: center;
    align-items: center;
}
.flexLeft {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
}
.LW1Title {
    background: url("./img/LW1_1.png") no-repeat;
    background-position: center;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;
}
.DLCDF {
    background: url("./img/LW1_2.png") no-repeat;
    background-position: -10px 10px;
}
.PLCDF {
    background: url("./img/LW1_3.png") no-repeat;
    background-position: -10px 10px;
}
.LW1LINE_H {
    background: linear-gradient(
        to bottom,
        #4d71bd 0%,
        #4d71bd 35%,
        transparent 35%,
        transparent 45%,
        #4d71bd 45%,
        #4d71bd 55%,
        transparent 55%,
        transparent 65%,
        #4d71bd 65%,
        #4d71bd 100%
    );
    background-size: 2px 20px;
    background-repeat: repeat-y;
    box-shadow: 0 0 10px #0000ff, 0 0 10px #fff;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
