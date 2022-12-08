<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div ref="con" class="main">
        <div class="nullData" v-if="fxyjDataList.length==0">
            <img :src="require('./img1/CR4_3.gif')" style="width:100%;">
            <div>无风险预警</div>
        </div>
        <autoScroll boxid="home1fxyj_box" v-if="fxyjDataList.length!==0">
            <template v-for="(item,i) in fxyjDataList">
                <table
                    class="table-list"
                    :class="{'table_dkl':item.type=='0','table_jk':item.type=='1','table_sg':item.type=='2'}"
                    style="width: 100%;"
                    :key="i"
                >
                    <tbody>
                        <tr>
                            <td
                                style="width:60px;text-align: center;font-weight:bold;"
                            >{{item.title_text}}</td>
                            <td style="text-align: center;;font-weight:bold;">{{item.text1}}</td>
                            <!-- 大客流 -->
                            <td style="text-align: left;" v-if="item.type=='0'">
                                <div v-html="item.text2"></div>
                                <div v-html="item.text3"></div>
                            </td>
                            <!-- 临客 -->
                            <td style="text-align: left;" v-if="item.type=='1'">
                                <div v-html="item.text2"></div>
                                <div v-html="item.text3"></div>
                            </td>
                            <!-- 甩挂 -->
                            <td style="text-align: left;" v-if="item.type=='2'">
                                <div style="display:flex;width:100%;">
                                    <div style="width:50%;" v-html="item.text2"></div>
                                    <div style="width:50%;" v-html="item.text3"></div>
                                </div>
                            </td>
                            <td style="width:120px;">
                                <div
                                    style="text-align:right;padding-right:5px;"
                                    v-html="item.text4"
                                ></div>
                                <div style="padding-top:2px;text-align:right;padding-right:5px;">
                                    {{item.text5}}
                                    <span
                                        style="color:#d56c6c;font-size:12px"
                                    >{{item.text6}}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </autoScroll>
        <!-- <el-carousel
            ref="myCarousel"
            :height="carouselHeight"
            arrow="never"
            :autoplay="true"
            :interval="6000"
        >
            <el-carousel-item v-for="(c,index) in fxyjDataList" :key="index">
                <template v-for="(item,i) in c"></template>
            </el-carousel-item>
        </el-carousel>-->
    </div>
</template>

<script>
// 这里引用各种资源
import MapTab from './components/MapTab.vue';
import home from './service/home1.js';
import C from "../../../assets/com.js";
import autoScroll from "../../../components/AutoScroll.vue"
export default {
    // 组件
    components: {
        MapTab, autoScroll
    },
    // 数据仓库
    data() {
        return {
            carouselHeight: "200px",
            curItem: {},
            TabdataSource: [{
                text: '高铁',
                value: "0",
            }, {
                text: '普速',
                value: "1",
            }, {
                text: '动车',
                value: "2",
            }],
            interval: null,
            dataIndex: 0,
            gtDataList: [],
            psDataList: [],
            dcDataList: [],
            dataSource: [],
            station: "",
            dataType: "0",
            dicStation: [],
            fxyjDataList: [],
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
        const h = this.$refs.con.offsetHeight;
        this.carouselHeight = h + "px";
        this.curItem = this.TabdataSource[0];
        setInterval(() => {
            this.getDataList();
        }, 1000 * 60 * 30);
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        mapTabSelect(item) {
            this.curItem = item;
            this.dataType = item.value;
            if (item.text === "高铁") {
                this.$refs.myCarousel.setActiveItem(0);
                this.dataSource = this.gtDataList;
            } else if (item.text === "普速") {
                this.$refs.myCarousel.setActiveItem(1);
                this.dataSource = this.psDataList;
            } else {
                this.$refs.myCarousel.setActiveItem(2);
                this.dataSource = this.dcDataList;
            }
        },
        stopInterval() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        },
        setInterval() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            // this.interval = setInterval(() => {
            // 	const targetData = this.curItem.text==="保洁打分"?this.dataSource[1]:this.dataSource[0];
            // 	this.$refs.mapTab.selectItem(targetData);
            // },3000);
        },
        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {

        },
        getDataList() {
            // this.getZwd();
            this.getFXYJDataList();
        },
        getFXYJDataList() {
            var p1 = new Promise((resolve, reject) => {
                home.getCR42({
                    s: [[this.oname], [this.oname], [this.oname]]
                }).then((r) => {
                    console.log("风险预警大客流kydp_zxy2034", r);
                    resolve([r["1"], r["2"], r["3"]]);
                }, error => {
                    t.loading = false
                    t.$notify.error({
                        title: '风险预警',
                        message: '获取风险预警大客流异常'
                    })
                    resolve([[], []]);
                })
            })
            // var p2 = new Promise((resolve, reject) => {
            //     home.getCR41({
            //         s: [this.oname]
            //     }).then((r) => {
            //         var rs = JSON.parse(r);
            //         // var rs = r;
            //         console.log("风险预警临客加开kydp_zxy8019", rs);
            //         resolve(rs);
            //     }, error => {
            //         t.loading = false
            //         t.$notify.error({
            //             title: '风险预警',
            //             message: '获取风险预警临客加开异常'
            //         })
            //         resolve([]);
            //     })
            // });
            Promise.all([p1]).then(result => {
                var dataList = [];
                var dklList = JSON.parse(JSON.stringify(result[0][0]));
                var sgList = JSON.parse(JSON.stringify(result[0][1]));
                var lkList = JSON.parse(JSON.stringify(result[0][2]));
                dklList.forEach(v => {
                    v.type = "0";
                    v.title_text = "大客流";
                    v.text1 = v.STATION_TRAIN_CODE;
                    v.text2 = "<span>" + v.STATION_NAME + 
                    "</span> <span style='color:"+(v.UP_COUNT=='0'?'#999':'#64dcfa')+"'><span class='iconfont shangcheren'></span>" + v.UP_COUNT + "</span>"+
                    "<span style='color:"+(v.DOWN_COUNT=='0'?'#999':'#24c768')+";margin-left:5px;'><span class='iconfont xiacheren'></span>"+v.DOWN_COUNT+"</span>";
                    v.text3 = this.initDate(v.WARN_TIME, "hh:mm") + " - " + this.initDate(v.WARN_TIME_END, "hh:mm");
                    v.text4 = "<span style='color:#50b6d3'>" + v.START_NAME + " - " + v.END_NAME + "</span>";
                    v.text5 = this.initDate(v.START_TIME, "hh:mm") + " - " + this.initDate(v.END_TIME, "hh:mm");
                    v.text6 = this.initDays(v.START_TIME, v.END_TIME);
                    dataList.push(v);
                })
                sgList.forEach(v => {
                    v.title_text = "甩挂";
                    v.type = "2";
                    v.text1 = v.CC;
                    v.text2 = "<span style='color:#eeb715'>挂</span> +" + v.HANG_NUM;
                    v.text3 = "<span style='color:#eeb715'>甩</span> +" + v.SWING_NUM;
                    v.text4 = "<span style='color:#50b6d3'>" + v.START_STN + " - " + v.END_STN + "</span>";
                    v.text5 = this.initDate(v.START_DATE, "hh:mm") + " - " + this.initDate(v.END_DATE, "hh:mm");
                    v.text6 = this.initDays(v.START_DATE, v.END_DATE);
                    dataList.push(v);
                })
                lkList.forEach(v => {
                    v.title_text = "临客";
                    v.type = "1";
                    v.text1 = v.CC;
                    v.text2 = v.START_DATE?v.START_DATE.split(" ")[0]:"";
                    v.text3 = ""
                    v.text4 = "<span style='color:#50b6d3'>" + v.START_STN + " - " + v.END_STN + "</span>";
                    v.text5 = this.initDate(v.START_DATE, "hh:mm") + " - " + this.initDate(v.END_DATE, "hh:mm");
                    v.text6 = this.initDays(v.START_DATE, v.END_DATE);
                    dataList.push(v);
                })
                // var date = new Date().Format("yyyy-MM-dd hh:mm:ss")
                // var row = {
                //     type: "0",
                //     title_text: "大客流",
                //     DATE: this.initDate(date, "yyyy/MM/dd"),
                //     topText: "发：" + this.initDate(date, "hh:mm"),
                //     bottomText: "客流量：" + 10 + "人",
                // }
                // dataList.push(row);
                // dataList.push(row);
                // dataList.push(row);
                // dataList.push(row);
                // dataList.push(row);
                // this.fxyjDataList = this.initDataList(dataList);
                this.fxyjDataList = dataList;
                console.log("风险预警", this.fxyjDataList);
                this.$emit("setFXDataList",dataList)
            })
        },
        getZwd() {
            let t = this
            t.datasource = [];
            t.dcDataList = [];
            t.gtDataList = [];
            t.psDataList = [];
            home.getZWDInfo({
                s: [[this.oname], [t.oname]]
            }).then((r) => {
                if (r) {
                    r["1"].forEach(v => {
                        if (v.CC.includes("D")) {
                            t.dcDataList.push(v);
                        } else {
                            t.gtDataList.push(v);
                        }
                    })
                    t.psDataList = r["2"];
                    t.psDataList = this.initDataList(t.psDataList);
                    t.dcDataList = this.initDataList(t.dcDataList);
                    t.gtDataList = this.initDataList(t.gtDataList);
                    t.mapTabSelect(t.TabdataSource[0]);
                    console.log("正晚点数据", r);
                } else {
                    this.$message('接口错误')
                }
                t.loading = false
            }, error => {
                t.loading = false
                t.$notify.error({
                    title: '正晚点列车',
                    message: '获取正晚点列车异常'
                })
            })
        },
        initDataList(dataList) {
            var h = this.$refs.con.offsetHeight;
            var size = 4;
            if (h > 280) {
                size = 5;
            }
            var itemList = [];
            dataList.forEach((v, i) => {
                if (i < 30) {
                    itemList.push(v);
                }
            });
            var tempList = [];
            var rs = [];
            itemList.forEach((v, i) => {
                tempList.push(v);
                if (tempList.length == size) {
                    rs.push(JSON.parse(JSON.stringify(tempList)));
                    tempList = [];
                } else if (i == (itemList.length - 1)) {
                    rs.push(JSON.parse(JSON.stringify(tempList)));
                    tempList = [];
                }
            })
            return rs;
        },
        initDate(time, ftStr) {
            var rs = "";
            if (time) {
                rs = new Date(time).Format(ftStr);
            }
            return rs;
        },
        initDays(stime, etime) {
            var rs = "";
            if (stime && etime) {
                var sdate = new Date(stime.split(" ")[0]);
                var edate = new Date(etime.split(" ")[0]);
                rs = parseInt((edate.getTime() - sdate.getTime()) / (1000 * 3600 * 24));
                if (rs === 0) {
                    rs = "";
                } else {
                    rs = "+" + rs;
                }
            }
            return rs;
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
    padding: 0 20px;
    overflow: auto;
}

.card {
    width: 100%;
    padding: 10px;
    background: rgba(13, 23, 55, 0.6);
    border: 1px solid #151d33;
    border-radius: 5px;
}

.table-list {
    font-size: 12px;
    margin-top: 6px;
}
.table_dkl {
    background-image: url("./img1/CR4_3.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
}
.table_jk {
    background-image: url("./img1/CR4_2.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
}
.table_sg {
    background-image: url("./img1/CR4_1.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
}
.table-list.no-border {
    border-bottom: none;
}
.table-list td {
    padding: 4px;
}
.late {
    display: inline-block;
    vertical-align: middle;
    line-height: 40px;
    height: 30px;
    text-indent: 40px;
    color: #ea2222;
    background: url(img1/CR3_late.png) no-repeat;
    margin-top: -10px;
}
.cfdd {
    display: inline-block;
    color: #05d1cb;
    transform: rotate(-90deg);
}
>>> .el-carousel__button {
    width: 15px;
}
.nullData {
    width: 100%;
    /* height: 100%;
    background: url("./img1/CR4_3.gif") no-repeat;
    background-position: center;
    background-size: 100% auto; */
    /* display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 15px; */
}
.nullData > div {
    color: #216b9b;
    font-size: 36px;
    font-weight: bold;
    display: flex;
    justify-content: center;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
