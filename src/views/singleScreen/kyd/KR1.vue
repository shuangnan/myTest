<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div class="main">
        <div style="width:250px;height:100%;">
            <div style="height:20%;width:100%;" class="KR1_L1">
                <div>
                    <MapTab
                        :dataSource="[{text:'昨日收入',value:'1'},{text:'全年收入',value:'0'}]"
                        type="1"
                        @select="mapTabSelect"
                        style="width:200px;margin: 10px;"
                    ></MapTab>
                </div>
            </div>
            <div style="height:30%;width:100%;" class="KR1_L2" @click="rightDateList('ALL')">
                <div
                    style="width:100%;padding-top:10px;"
                    class="KR1_textc shadow-txt"
                >{{leftData.d1}}{{this.type=='0'?'万元':'元'}}</div>
                <div
                    style="width:100%;font-size:18px;color:#bad9de;padding-top:5px;"
                    class="KR1_textc"
                >
                    同比：
                    <span
                        style="font-size:12px;"
                        :style="{color:leftData.d2<0?'#61c014':'#fa4623'}"
                    >
                        <img src="./img1/CR1_1U.png" v-show="leftData.d2>=0" />
                        <img src="./img1/CR1_1D.png" v-show="leftData.d2<0" />
                        {{Math.abs(leftData.d2)}}%
                    </span>
                </div>
            </div>
            <div style="height:50%;width:100%;" class="KR1_L3">
                <CircleChart43
                    @dataClick="rightDateList"
                    type="blue"
                    chartName="动车"
                    :data-source="dataList_cd"
                    :chartValue="leftData.d3"
                    :selectChartName="selectChartName"
                    style="margin-right:10px;"
                ></CircleChart43>
                <CircleChart43
                    @dataClick="rightDateList"
                    type="green"
                    chartName="普车"
                    :data-source="dataList_pc"
                    :chartValue="leftData.d4"
                    :selectChartName="selectChartName"
                    style="margin-left:10px;"
                ></CircleChart43>
            </div>
        </div>
        <div class="main_C" style="width:5px;height:100%;"></div>
        <div style="width:calc(100% - 255px);height:100%;padding:0 15px;">
            <div style="width:100%;height:80px;display:flex;">
                <div style="height:100%;width:100%;padding-right:15px;">
                    <table style="width:100%;height:100%;">
                        <tr>
                            <td class="KR1_R2_text1">
                                盒饭收入
                                <span style="font-size:12px;margin-left:10px;">同比：</span>
                                <span
                                    class="KR1_R2_tb"
                                    :style="{color:leftData.d2<0?'#61c014':'#fa4623'}"
                                >
                                    <img src="./img1/CR1_1U.png" v-show="rightData.d2>=0" />
                                    <img src="./img1/CR1_1D.png" v-show="rightData.d2<0" />
                                    {{rightData.d2}}%
                                </span>
                            </td>
                            <td
                                rowspan="2"
                                class="KR1TOPTITLE"
                                :class="{'KR1DC':selectChartName=='动车','KR1PC':selectChartName=='普车'}"
                            >
                                <div>{{selectChartName=='ALL'?'总':selectChartName}}情况</div>
                            </td>
                            <td class="KR1_R2_text1" style="text-align:right;">
                                <span style="font-size:12px;margin-left:10px;">同比：</span>
                                <span
                                    class="KR1_R2_tb"
                                    style="margin-right:10px;"
                                    :style="{color:leftData.d2<0?'#61c014':'#fa4623'}"
                                >
                                    <img src="./img1/CR1_1U.png" v-show="rightData.d4>=0" />
                                    <img src="./img1/CR1_1D.png" v-show="rightData.d4<0" />
                                    {{rightData.d4}}%
                                </span>
                                商品收入
                            </td>
                        </tr>
                        <tr>
                            <td class="KR1_R2_text2">
                                {{rightData.d1}}
                                <span>{{type=='0'?'万':''}}元</span>
                            </td>
                            <td class="KR1_R2_text2" style="text-align:right;">
                                {{rightData.d3}}
                                <span>{{type=='0'?'万':''}}元</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <div style="width:100%;height:20px;display:flex;">
                                    <!-- 左侧盒饭收入 -->
                                    <div
                                        style="height:100%;"
                                        :style="{width:'calc('+rightToppie+'% - 3px)'}"
                                    >
                                        <div style="width:100%;height:50%;background:#404559;"></div>
                                        <div style="width:100%;height:50%;display:flex">
                                            <div
                                                style="height:100%;background:#0a3aa5;"
                                                :style="{width:hfsrdcpie+'%'}"
                                            ></div>
                                            <div
                                                style="height:100%;background:#0aa54e;"
                                                :style="{width:100-hfsrdcpie+'%'}"
                                            ></div>
                                        </div>
                                    </div>
                                    <div style="height:100%;width:6px;"></div>
                                    <!-- 右侧商品收入 -->
                                    <div
                                        style="height:100%;"
                                        :style="{width:'calc('+(100-rightToppie)+'% - 3px)'}"
                                    >
                                        <div style="width:100%;height:50%;background:#404559;"></div>
                                        <div style="width:100%;height:50%;display:flex">
                                            <div
                                                style="height:100%;background:#0a3aa5;"
                                                :style="{width:spsrdcpie+'%'}"
                                            ></div>
                                            <div
                                                style="height:100%;background:#0aa54e;"
                                                :style="{width:100-spsrdcpie+'%'}"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div
                style="width:100%;height:calc(100% - 80px);"
                class="KR1_R2"
                @mouseenter="KRQR2MouseEnter"
                @mouseleave="KRQR2MouseLeave"
            >
                <div
                    style="height:30px;width:100%;display:flex;justify-content:space-between;align-items:center;"
                >
                    <div style="color:#bad9de;font-size:16px;font-weight:bold;">{{chartTabName}}</div>
                    <div>
                        <MapTab
                            ref="chartMapTab"
                            :dataSource="KR2DataList"
                            type="1"
                            @select="chartTabSelect"
                            style="width:200px;"
                        ></MapTab>
                    </div>
                </div>
                <div style="height:calc(100% - 35px);width:100%;margin-top:5px;" ref="con">
                    <el-carousel
                        ref="myCarousel"
                        indicator-position="none"
                        :height="carouselHeight"
                        arrow="never"
                        direction="vertical"
                        :autoplay="false"
                    >
                        <el-carousel-item>
                            <YXMX ref="YXMX" :XList="XList" :YDataList="YDataList"></YXMX>
                        </el-carousel-item>
                        <el-carousel-item>
                            <chart1 ref="chart11" :XList="chart1XList" :YDataList="chart1YList"></chart1>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <!-- <div></div> -->
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import MapTab from './components/MapTab.vue';
import YXMX from "./KR1_chart.vue";
import chart1 from "./KR1_chart1.vue";
import CircleChart43 from "./components/CircleChart43.vue";
import home from './service/home1.js';
export default {
    // 组件
    components: {
        MapTab, CircleChart43, YXMX, chart1
    },
    // 数据仓库
    data() {
        return {
            type: '0',//0 年收入，1 昨日收入
            leftData: {
                d1: "",
                d2: "",
                d3: "",
                d4: "",
            },
            rightData: {
                d1: "",
                d2: "",
                d3: "",
                d4: "",
                d5: "",
                d6: "",
            },
            dataList_cd: [100, 100],
            dataList_pc: [100, 100],
            rightToppie: 50,
            hfsrdcpie: 50,
            spsrdcpie: 50,
            XList: [],
            YDataList: [],
            selectChartName: "",
            chartTab: "0",
            chartTabName: "营销明细",
            carouselHeight: "200px",
            loopFlag: true,
            loop: null,
            KR2DataList: [{ text: '营销明细', value: '0' }, { text: '收入排行', value: '1' }],
            chart1XList: [],
            chart1YList: [],
        }
    },
    // 属性
    props: {
        oname: {
            type: String,
            default: "",
        }
    },
    // 组件挂载完毕
    mounted() {
        //document.querySelector("title").innerHTML = "";//页面名称
        // this.getDataList();
        const h = this.$refs.con.offsetHeight;
        this.carouselHeight = h + 10 + "px";
        this.autoChange();
        this.mapTabSelect({ text: '昨日收入', value: '1' });
    },
    // 方法
    methods: {
        KRQR2MouseEnter() {
            this.loopFlag = false;
            if (this.loop) {
                clearTimeout(this.loop)
            }
        },
        KRQR2MouseLeave() {
            this.loopFlag = true;
            this.autoChange();
        },
        autoChange() {
            if (this.loop) {
                clearTimeout(this.loop)
            }
            var loopTime = 0;
            if (this.chartTab != "1") {
                loopTime = this.XList.length * 2000;
            } else {
                loopTime = this.chart1XList.length * 2000;
            }
            if (loopTime <= 1000) {
                return;
            }
            this.loop = setTimeout(() => {
                this.chartTab = Number(this.chartTab) + 1;
                if (this.chartTab >= this.KR2DataList.length) {
                    this.chartTab = 0;
                }
                this.chartTabSelect(this.KR2DataList[this.chartTab]);
                if (this.$refs.chartMapTab) {
                    this.$refs.chartMapTab.setActiveItem(this.chartTab);
                }
                this.autoChange();
            }, loopTime);
        },
        /* @info  事件处理区-----------------------------------*/
        mapTabSelect(v) {
            this.type = v.value;
            this.getDataList();

        },
        chartTabSelect(v) {
            this.chartTab = v.value;
            this.chartTabName = v.text;
            if (v.value == "0") {
                this.$nextTick(() => {
                    if (this.$refs.YXMX) {
                        this.$refs.YXMX.initCharts();
                    }
                })
            } else if (v.value == "1") {
                this.$nextTick(() => {
                    this.$refs.chart11.initCharts();
                })
            }
            if (this.$refs.myCarousel) {
                this.$refs.myCarousel.setActiveItem(v.value);
            }
        },

        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getDataList() {
            this.getLeftDataList();
        },
        getLeftDataList() {
            var t = this;
            home.getBJKH({
                s: ["kyd_in_out_253"],
                w: [[this.oname, this.type]],
                o: [[]],
            }).then(r => {
                if (r) {
                    var data = JSON.parse(r);
                    if (data.kyd_in_out_253) {
                        var itemList = data.kyd_in_out_253;
                        if (itemList[0]) {
                            var d = itemList[0];
                            this.leftData.d1 = (this.type == "0" ? this.initNum(d.YEAR_SR) : d.YEAR_SR);
                            this.leftData.d2 = d.YEAR_SR_RATE;
                            this.leftData.d3 = (this.type == "0" ? this.initNum(d.YEAR_DC_SR) : d.YEAR_DC_SR);
                            this.leftData.d4 = (this.type == "0" ? this.initNum(d.YEAR_PC_SR) : d.YEAR_PC_SR);
                        } else {
                            for (var i in this.leftData) {
                                this.leftData[i] = "";
                            }
                            for (var i in this.rightData) {
                                this.rightData[i] = "";
                            }
                        }
                    }
                    this.rightDateList("ALL")
                    console.log("餐售统计左侧数据kyd_in_out_253", data.kyd_in_out_253);
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '餐售统计',
                    message: '获取餐售统计异常'
                })
            })
        },
        initNum(num) {
            var rs = "";
            if (num) {
                rs = (num / 10000).toFixed(1);
            }
            return rs;
        },
        //动车普车点击事件
        rightDateList(trainType) {
            this.selectChartName = trainType
            this.rightTopData(trainType);
            this.rightBottomData(trainType);
            // if (this.chartTab == "0") {

            // } else if (this.chartTab == "1") {

            // }
        },
        rightTopData(trainType) {
            var t = this;
            home.getBJKH({
                s: ["kyd_in_out_260"],
                w: [[this.oname, trainType, this.type]],
                o: [[]],
            }).then(r => {
                if (r) {
                    var data = JSON.parse(r);
                    if (data.kyd_in_out_260) {
                        var itemList = data.kyd_in_out_260;
                        if (itemList[0]) {
                            var d = itemList[0];
                            this.rightData.d1 = (this.type == "0" ? this.initNum(d.YEAR_TJ_HF) : d.YEAR_TJ_HF);
                            this.rightData.d2 = d.YEAR_TJ_HF_RATE;
                            this.rightData.d3 = (this.type == "0" ? this.initNum(d.YEAR_TJ_SP) : d.YEAR_TJ_SP);
                            this.rightData.d4 = d.YEAR_TJ_SP_RATE;
                            this.rightData.d5 = (this.type == "0" ? this.initNum(d.YEAR_ZC) : d.YEAR_ZC);
                            this.rightData.d6 = d.YEAR_ZC_RATE;
                            this.rightToppie = this.rightData.d1 / (Number(this.rightData.d1) + Number(this.rightData.d3)) * 100;
                            this.hfsrdcpie = d.DC_TJ_HF / (Number(d.DC_TJ_HF) + Number(d.PC_TJ_HF)) * 100;
                            this.spsrdcpie = d.DC_TJ_SP / (Number(d.DC_TJ_SP) + Number(d.PC_TJ_SP)) * 100;
                        } else {
                            for (var i in this.rightData) {
                                this.rightData[i] = "0";
                                this.rightToppie = 50;
                                this.hfsrdcpie = 50;
                                this.spsrdcpie = 50;
                            }
                        }
                    }
                    console.log("餐售统计右上数据kyd_in_out_260", data.kyd_in_out_260);
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '餐售统计',
                    message: '获取餐售统计异常'
                })
            })
        },
        rightBottomData(trainType) {
            var t = this;
            var code = "", text = "";
            if (this.type == "0") {
                code = "kyd_in_out_254";
                text = "年";
            } else if (this.type == "1") {
                code = "kyd_in_out_255";
                text = "日";
            }
            if (!code) {
                return;
            }
            home.getBJKH({
                s: [code, "kyd_in_out_261"],
                w: [[this.oname, trainType], [this.oname, this.type, trainType]],
                o: [[], []],
            }).then(r => {
                if (r) {
                    var data = JSON.parse(r);
                    this.XList = [];
                    this.YDataList = [];
                    var tempList = [["支出", [], "#404559"], ["现金", [], "#f66c44"], ["二维码", [], "#552ebf"], ["川之味", [], "#aba43c"], ["出乘组数", [], "rgb(82,177,243)"]];
                    var itemList = [];
                    if (this.type == "0") {
                        var itemList = data.kyd_in_out_254;
                    } else if (this.type == "1") {
                        var itemList = data.kyd_in_out_255;
                    }
                    itemList.forEach(v => {
                        if (this.type == "0") {
                            this.XList.push(v.MONTH1 + "月");
                        } else if (this.type == "1") {
                            this.XList.push(v.DAYS.split("-")[2] + "日");
                        }
                        tempList[0][1].push(v.ZC);//支出
                        tempList[1][1].push(v.TJ_CASH);//现金
                        tempList[2][1].push(v.TJ_WX);//二维码
                        tempList[3][1].push(v.TJ_CTCZW);//川之味道
                        tempList[4][1].push(v.CLASS_NUM_COUNT);//出乘组数
                    })
                    this.YDataList = tempList;
                    this.$nextTick(() => {
                        this.$refs.YXMX.initCharts();
                        this.autoChange();
                    })
                    console.log("营销明细" + text + code, itemList);
                    this.chart1XList = [];
                    this.chart1YList = [];
                    if (data.kyd_in_out_261) {
                        var itemList = data.kyd_in_out_261;
                        itemList.forEach((v, i) => {
                            if (i < 10) {
                                this.chart1XList.push(v.TRAIN_TEAM);
                                this.chart1YList.push(v.SR);
                            }

                        })
                        this.$nextTick(() => {
                            this.$refs.chart11.initCharts();
                            this.autoChange();
                        })
                        console.log("收入排行kyd_in_out_261", itemList);
                    }
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '餐售统计',
                    message: '获取餐售统计异常'
                })
            })
        },
        getData() {

        }
    },
    // 监视属性
    watch: {
        oname() {
            this.getDataList();
        }
    },
    // 计算属性
    computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.main {
    width: 100%;
    height: 100%;
    display: flex;
}
/* .main>div{
        width:100%;
        height:100%;
        background:url('./img1/KR1.png') no-repeat;
        background-size: auto 100%;
        background-position: center;
    } */
.main_C {
    background: url("./img1/KR1_C.png") no-repeat;
    background-size: auto 100%;
    background-position: 0px 20px;
}
.KR1_L1 {
    display: flex;
    justify-content: center;
    padding-top: 10px;
}
.KR1_L2 {
    font-size: 30px;
    color: #bad9de;
}
.KR1_textc {
    display: flex;
    justify-content: center;
    align-items: center;
}
.KR1_L3 {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
}
.KR1_R2 {
    padding-top: 20px;
}
/* .KR1_R2 > div {
    background: url("./img1/KR1_R2.png") no-repeat;
    background-size: auto 100%;
    width: 100%;
    height: 100%;
} */
.KR1_R2_tb {
    color: #fa4623;
    font-size: 12px;
}
.KR1_R2_text1 {
    font-size: 16px;
    color: #bad9de;
}
.KR1_R2_text2 {
    font-size: 30px;
    color: #bad9de;
}
.KR1_R2_text2 > span {
    font-size: 24px;
}
.KR1TOPTITLE {
    width: 250px;
    vertical-align: top;
    background-size: 100% auto;
    background-position: center -10px;
    background-repeat: no-repeat;
}
.KR1DC {
    background-image: url("./img1/KR1_DC.png");
}
.KR1PC {
    background-image: url("./img1/KR1_PC.png");
}
.KR1PC > div {
    /* color: #5be748 !important; */
    color: rgba(255, 255, 255, 0.815) !important;
}
.KR1TOPTITLE > div {
    color: #4894e7;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
