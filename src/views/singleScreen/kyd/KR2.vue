<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div class="main">
        <div style="width:100%;height:100%;" v-show="dataType =='0'">
            <div style="height: 55%;width: 100%;">
                <div ref="KR21BOX1" class="view-item" style="width: 65%;height: 100%;">
                    <KR21
                        :num1="khnum1"
                        :num2="khnum2"
                        :num3="khnum3"
                        :num4="khnum4"
                        :dataList="K1DataList"
                        @changeType="changeType"
                        :defaultTabIndex="dataType"
                        :dataType="dataType"
                    ></KR21>
                </div>
                <div class="view-item" style="width: 35%;height: 100%;padding-bottom:20px;">
                    <KR22 :dataList="K2DataList" :k2Default="K2Default" :dataType="dataType"></KR22>
                </div>
            </div>
            <div style="height: 45%;width: 100%;">
                <div class="view-item" style="width: 45%;height: 100%;">
                    <KR23 :xData="K3XList" :yDataList="k3DataList" ref="KR23" :dataType="dataType"></KR23>
                </div>
                <div class="view-item" style="width: 55%;height: 100%;">
                    <KR24 :dataList="K4DataList" ref="KR24" :dataType="dataType"></KR24>
                </div>
            </div>
        </div>
        <div style="width:100%;height:100%;display:flex" v-show="dataType =='1'">
            <div style="width:65%;height:100%;">
                <div ref="KR21BOX2" style="height:55%;width:100%;">
                    <KR21
                        ref="KR21Box"
                        :num1="khnum1"
                        :num2="khnum2"
                        :num3="khnum3"
                        :dataList="K1DataList"
                        @changeType="changeType"
                        :defaultTabIndex="dataType"
                        :dataType="dataType"
                    ></KR21>
                </div>
                <div style="height:45%;width:100%;">
                    <KR25 ref="KR25" :XList="K5XDataList" :YDataList="K5YDataList"></KR25>
                </div>
            </div>
            <div style="width:35%;height:100%;border-left: 1px solid #242947;padding:5px;">
                <div style="width:100%;height:50%;">
                    <KR22 :dataList="K2DataList" :k2Default="K2Default" :dataType="dataType"></KR22>
                </div>
                <div style="width:100%;height:50%;border-top:1px solid #242947;">
                    <KR26 :dataList="K6DataList"></KR26>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import home from './service/home1.js';
import KR21 from "./KR2.1.vue";
import KR22 from "./KR2.2.vue";
import KR23 from "./KR2.3.vue";
import KR24 from "./KR2.4.vue";
import KR25 from "./KR2.5.vue";
import KR26 from "./KR2.6.vue";
export default {
    // 组件
    components: {
        KR21,
        KR22,
        KR23,
        KR24,
        KR25,
        KR26,
    },
    // 数据仓库
    data() {
        return {
            khnum1: "",
            khnum2: "",
            khnum3: "",
            khnum4: "",
            K1DataList: [],
            K2DataList: [],
            K2Default: 0,
            k3DataList: [],
            K3XList: [],
            K4DataList: [],
            dataType: "0",// 0保洁数据,1备品数据
            K5XDataList: [],
            K5YDataList: [],
            K6DataList: [],
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

    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {

        },
        getDataList() {
            if (this.dataType == "0") {
                this.getBJKH();//获取保洁考核
                this.getBJDataTBList();
            } else {
                this.getBPData();//获取备品数据
            }
        },
        getBJKH() {//获取保洁考核
            this.khnum1 = "-"
            this.khnum2 = "-"
            this.khnum3 = "-"
            this.khnum4 = "-"
            var t = this;
            var year = new Date().Format("yyyy");
            var month = new Date().Format("yyyy-MM");
            var date = new Date().Format("yyyy-MM-dd");
            home.getBJKH({
                s: ["kyd_zl_059", "kyd_zl_060", "kyd_zl_062", "kyd_zl_063"],
                w: [[this.oname, year], [this.oname, year], [this.oname, year, month, date], [this.oname, year]],
                o: [[], [], [], []]
            }).then(r => {
                if (r) {
                    var data = JSON.parse(r);
                    if (data.kyd_zl_059) {//保洁支出分析
                        var itemList = data.kyd_zl_059;
                        var k3DataList = [];
                        this.K3XList = [];
                        this.k3DataList = [];
                        if (itemList[0]) {
                            var nameList = itemList[0].CC_NAME.split(",");
                            nameList.forEach(v => {
                                k3DataList.push([v, []]);
                            })
                        }
                        itemList.forEach(v => {
                            var amountList = v.AMOUNT.split(",");
                            amountList.forEach((t, i) => {
                                if (k3DataList[i]) {
                                    k3DataList[i][1].push(Number(t));
                                }
                            })
                            this.K3XList.push(v.MONTH + '月');
                        });
                        k3DataList.forEach(v => {
                            var flag = false;
                            v[1].forEach(m => {
                                if (m !== 0) {
                                    flag = true;
                                }
                            });
                            if (flag) {
                                var list = JSON.parse(JSON.stringify(v[1]));
                                list.forEach((v, i) => {
                                    if (v === 0) {
                                        list[i] = 0.001;
                                    }
                                })
                                v[1] = list;
                                this.k3DataList.push(v);
                            }
                        })
                        this.$nextTick(() => {
                            this.$refs.KR23.initCharts();
                        })
                    }
                    if (data.kyd_zl_060) {//考核金额分析
                        var itemList = data.kyd_zl_060;
                        this.K4DataList = [];
                        itemList.forEach((v, i) => {
                            if (i < 7) {
                                this.K4DataList.push({ name: v.TEAM_NAME, value: v.AMOUNT });
                            }
                        })
                        this.$nextTick(() => {
                            this.$refs.KR24.initCharts();
                        })
                    }
                    if (data.kyd_zl_062) {//考核汇总
                        var itemList = data.kyd_zl_062;
                        if (itemList[0]) {
                            this.khnum1 = this.initNumber(itemList[0].YEAR_AMOUNT, 2);
                            this.khnum2 = this.initNumber(itemList[0].MONTH_AMOUNT, 2);
                            this.khnum3 = this.initNumber(itemList[0].DAY_AMOUNT, 2);
                            this.khnum4 = this.initNumber(itemList[0].NKHL * 100, 2);
                        }
                    }
                    if (data.kyd_zl_063) {//班组考核top
                        var itemList = data.kyd_zl_063;
                        this.K2DataList = [];
                        var t = 0;
                        for (var i = (itemList.length - 1); i >= 0; i--) {
                            this.K2DataList.push(itemList[i]);
                            t++;
                            if (t > 7) {
                                break;
                            }
                        }
                        this.K2Default = 0;
                        this.K2DataList.forEach(v => {
                            if (v.AMOUNT > this.K2Default) {
                                this.K2Default = Number(v.AMOUNT);
                            }
                        });
                    }
                    console.log("大屏右侧扩展 保洁数据kydp_zxy8015", data);
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '保洁数据',
                    message: '获取保洁统计异常'
                })
            })
        },
        getBJDataTBList() {
            var t = this;
            var date = new Date().Format("yyyy-MM-dd");
            home.getBJKH({
                s: ["kyd_in_out_179"],
                w: [[this.oname, date]],
                o: [[]],
            }).then(r => {
                if (r) {
                    var data = JSON.parse(r);
                    if (data.kyd_in_out_179) {
                        var itemList = data.kyd_in_out_179;
                        this.K1DataList = [];
                        var K1DataList = [];
                        itemList.forEach((v, i) => {
                            if (i < 20) {
                                K1DataList.push(v);
                            }
                        });
                        var itemList = [];
                        var size = parseInt((this.$refs.KR21BOX1.offsetHeight - 180) / 30);
                        K1DataList.forEach((v, i) => {
                            itemList.push(v);
                            if (itemList.length == size) {
                                this.K1DataList.push(JSON.parse(JSON.stringify(itemList)));
                                itemList = [];
                            }
                            else if (i == (K1DataList.length - 1)) {
                                this.K1DataList.push(JSON.parse(JSON.stringify(itemList)));
                                itemList = [];
                            }
                        })
                    }
                    console.log("保洁表格数据kyd_in_out_179", this.K1DataList);
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
        getBPData() {
            this.khnum1 = "-";
            this.khnum2 = "-";
            var t = this;
            home.getBJKH({
                s: ["kyd_in_out_129", "kyd_in_out_258", "kyd_zxy03", "kyd_zxy04", "kyd_zxy05"],
                w: [[this.oname, "ALL"], [this.oname], [this.oname], [this.oname], [this.oname]],
                o: [[], [], [], [], []]
            }).then(r => {
                if (r) {
                    var data = JSON.parse(r);
                    console.log("大屏右侧扩展 备品数据kydp_zxy8015", data);
                    // if (data.kyd_zl_072) {//服务耗材消耗分析
                    //     var itemList = data.kyd_zl_072;
                    //     var k3DataList = [["金额（元）", []]];
                    //     this.K3XList = [];
                    //     this.k3DataList = [];
                    //     itemList.forEach(v => {
                    //         k3DataList[0][1].push(Number(v.AMOUNT));
                    //         this.K3XList.push(v.DATES + '月');
                    //     });
                    //     k3DataList.forEach(v => {
                    //         var flag = false;
                    //         v[1].forEach(m => {
                    //             if (m !== 0) {
                    //                 flag = true;
                    //             }
                    //         });
                    //         if (flag) {
                    //             var list = JSON.parse(JSON.stringify(v[1]));
                    //             list.forEach((v, i) => {
                    //                 if (v === 0) {
                    //                     list[i] = 0.001;
                    //                 }
                    //             })
                    //             v[1] = list;
                    //             this.k3DataList.push(v);
                    //         }
                    //     })
                    //     this.$nextTick(() => {
                    //         console.log("服务耗材消耗分析", this.k3DataList);
                    //         this.$refs.KR23.initCharts();
                    //         this.$refs.KR25.initCharts();
                    //     })
                    // }

                    // if (data.kyd_zl_070) {//成本核算
                    //     var itemList = data.kyd_zl_070;
                    //     this.K4DataList = [];
                    //     itemList.forEach((v, i) => {
                    //         if (i < 7 && v.AMOUNT > 0) {
                    //             this.K4DataList.push({ name: v.MAT_CATE, value: v.AMOUNT });
                    //         }
                    //     })
                    //     this.$nextTick(() => {
                    //         this.$refs.KR24.initCharts();
                    //     })
                    // }
                    if (data.kyd_in_out_258) {//出入库汇总
                        var itemList = data.kyd_in_out_258;
                        if (itemList[0]) {
                            this.khnum1 = this.initNumber(itemList[0].YEAR_RK_AMOUNT, 2);
                            this.khnum2 = this.initNumber(itemList[0].YEAR_CK_AMOUNT, 2);
                            this.khnum3 = "-";
                        }
                    }
                    // if (data.kyd_in_out_259) {//耗材回收top
                    //     var itemList = data.kyd_in_out_259;
                    //     this.K2DataList = [];
                    //     var t = 0;
                    //     for (var i = 0; i < itemList.length; i++) {
                    //         itemList[i].CLASS_NAME = itemList[i].MAT_NAME;
                    //         itemList[i].AMOUNT = itemList[i].MAT_QTY;
                    //         this.K2DataList.push(itemList[i]);
                    //         t++;
                    //         if (t > 7) {
                    //             break;
                    //         }
                    //     }
                    //     this.K2Default = 0;
                    //     this.K2DataList.forEach(v => {
                    //         if (v.AMOUNT > this.K2Default) {
                    //             this.K2Default = Number(v.AMOUNT);
                    //         }
                    //     });
                    // }
                    if (data.kyd_in_out_129) {//当日服务耗材签收状态
                        var itemList = data.kyd_in_out_129;
                        this.K1DataList = [];
                        var K1DataList = [];
                        itemList.forEach((v, i) => {
                            if (i < 20) {
                                K1DataList.push(v);
                            }
                        });
                        var itemList = [];
                        var size = parseInt((this.$refs.KR21BOX2.offsetHeight - 180) / 30);
                        K1DataList.forEach(v => {
                            itemList.push(v);
                            if (itemList.length == size) {
                                this.K1DataList.push(JSON.parse(JSON.stringify(itemList)));
                                itemList = [];
                            }
                        })
                    }
                    if (data.kyd_zxy03) {//库存排行
                        var itemList = data.kyd_zxy03;
                        this.K5XDataList = [];
                        this.K5YDataList = [];
                        for (var i = 0; i < itemList.length; i++) {
                            var v = itemList[i];
                            this.K5XDataList.push(v.MAT_NAME);
                            var color = "#2b6a09";
                            if (Number(v.KC_QTY) < Number(v.ALERT_QTY)) {
                                color = "#844008";
                            }
                            if (Number(v.KC_QTY) > Number(v.ALERT_QTY_HI)) {
                                color = "#948208";
                            }
                            this.K5YDataList.push({ value: v.KC_QTY, itemStyle: { color: color } });
                            if (i > 10) {
                                break;
                            }
                        }
                        console.log("库存排行", itemList);
                        this.$nextTick(() => {
                            this.$refs.KR25.initCharts();
                        })
                    }
                    if (data.kyd_zxy04) {//消耗排行
                        var itemList = data.kyd_zxy04;
                        itemList.forEach(v => {
                            v.AMOUNT = v.SEND_QTY;
                            v.CLASS_NAME = v.TRAIN_TEAM
                        })
                        this.K2DataList = [];
                        var t = 0;
                        for (var i = 0; i < itemList.length; i++) {
                            this.K2DataList.push(itemList[i]);
                            t++;
                            if (t > 7) {
                                break;
                            }
                        }
                        this.K2Default = 0;
                        this.K2DataList.forEach(v => {
                            if (v.AMOUNT > this.K2Default) {
                                this.K2Default = Number(v.AMOUNT);
                            }
                        });
                    }
                    if (data.kyd_zxy05) {//备品报警
                        var itemList = data.kyd_zxy05;
                        console.log("备品报警", itemList);
                        this.K6DataList = [];
                        itemList.forEach(v => {
                            v.lowFlag = false;
                            v.hiFlag = false;
                            v.bgColor = "";
                            if (Number(v.KC_QTY) < Number(v.ALERT_QTY)) {
                                v.lowFlag = true;
                                v.bgColor = "#f5d77d";
                            }
                            if (Number(v.KC_QTY) > Number(v.ALERT_QTY_HI)) {
                                v.hiFlag = true;
                                v.bgColor = "#a65b60";
                            }
                            v.maxNum = v.ALERT_QTY_HI * 1.1;
                            v.lowPie = v.ALERT_QTY / v.maxNum * 100;
                            v.hiPie = v.ALERT_QTY_HI / v.maxNum * 100;
                            v.kcPie = v.KC_QTY / v.maxNum * 100;
                        });
                        this.K6DataList = [];
                        var size = 5;
                        // if(document.getElementsByTagName("body")[0].offsetHeight>=1080){
                        //     size=6;
                        // }
                        for (var i = 0; i < itemList.length; i++) {
                            if (i > size) {
                                break;
                            }
                            this.K6DataList.push(itemList[i]);
                        }
                    }

                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '备品数据',
                    message: '获取备品统计异常'
                })
            })
        },
        changeType(type) {
            this.dataType = type;
            if (type == "1") {
                this.$nextTick(() => {
                    this.$refs.KR21Box.setCarouseHeight();
                })
            }
            this.getDataList();
        },
        initNumber(number, size) {
            var rs = "";
            if (number) {
                rs = Number(number).toFixed(size);
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
    padding: 0 10px 10px 10px;
}
.view-item {
    display: inline-block;
    vertical-align: top;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
