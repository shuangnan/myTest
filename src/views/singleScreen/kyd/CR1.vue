<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div class="main">
        <div style="width:100%;height:calc(50% - 20px);" class="CR1_FC">
            <table class="CR1_TAB">
                <tr>
                    <td
                        @click="openMLView('JS')"
                        class="shadow-txt fsqb_bg"
                        style="font-size:24px;font-weight:bold;cursor:pointer"
                    >{{num1}}</td>
                    <td
                        @click="openMLView('CL')"
                        class="shadow-txt qsqb_bg"
                        style="font-size:24px;font-weight:bold;cursor:pointer"
                    >{{num2}}</td>
                    <!-- <td rowspan="2">
                        <div style="font-size:16px;">命令总数</div>
                        <div style="font-size:14px;margin-top:5px;">
                            同比：
                            <img src="./img1/CR1_1U.png" v-show="num3>=0" />
                            <img src="./img1/CR1_1D.png" v-show="num3<0" />
                            <span :style="{color:num3<0?'#61c014':'#fa4623'}">{{Math.abs(num3)}}%</span>
                        </div>
                    </td>-->
                </tr>
                <tr>
                    <td style="height:24px;">当日接收</td>
                    <td>当日处理</td>
                </tr>
            </table>
        </div>
        <div style="width:100%;height:50%;" ref="con">
            <el-carousel
                indicator-position
                :height="carouselHeight"
                arrow="never"
                :autoplay="true"
                :interval="6000"
            >
                <el-carousel-item v-for="(item,index) in dataList" :key="index">
                    <div class="s-div">
                        <div
                            v-for="(temp,i) in item"
                            :key="i"
                            class="CR1_FG"
                            @dblclick="openDDMLDetail(temp.order_number)"
                        >
                            <div>{{temp.order_type}}</div>
                            <div>命令号：{{temp.order_number}}</div>
                            <div style="color:#ffb102;">签收情况：{{temp.recv}}/{{temp.all_recv}}</div>
                        </div>
                        <div></div>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div></div>
    </div>
</template>

<script>
// 这里引用各种资源

import C from "../../../assets/com.js";
import home from './service/home1.js';
export default {
    // 组件
    components: {},
    // 数据仓库
    data() {
        return {
            rows: 2,
            carouselHeight: "200px",
            num1: 0,
            num2: 0,
            num3: 0,
            dataList: [],
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
        const h = this.$refs.con.offsetHeight + 30;
        this.carouselHeight = h + "px";
        setInterval(() => {
            this.getDataList();
        }, 1000 * 60 * 10);
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
            this.getQBData();
        },
        getQBData() {
            var t = this;
            home.getCR12({
                s: [this.oname]
            }).then((r) => {
                var rs = JSON.parse(r);
                // var rs = r;
                console.log("命令电报总数kydp_zxy8018", rs);
                var nth = 0, lth = 0;
                rs.forEach(v => {
                    if (v.stat_type == "order_num") {
                        this.num1 = v.order_count;
                    } else if (v.stat_type == "recv_num") {
                        this.num2 = v.order_count;
                    } else if (v.stat_type == "this_month") {
                        nth = v.order_count;
                    } else if (v.stat_type == "last_month") {
                        lth = v.order_count;
                    }
                })
                if (Number(lth)) {
                    this.num3 = parseInt((nth - lth) / lth * 100);
                } else {
                    this.num3 = 0;
                }
            }, error => {
                t.$notify.error({
                    title: '命令电报总数',
                    message: '获取命令电报总数异常'
                })
            })
            home.getCR11({
                s: [this.oname]
            }).then((r) => {
                if (r) {
                    var rs = JSON.parse(r);
                    // var rs = r;
                    rs.forEach(v => {
                        v.order_type = v.order_type.replace(/命令/, '');
                        v.bin_obj = JSON.parse(v.bin_obj);
                    })
                    this.dataList = [];
                    var dataList = [];
                    rs.forEach((v, i) => {
                        if (i < 10) {
                            dataList.push(v);
                        }
                    });
                    var itemList = [];
                    var conH = this.$refs.con.offsetHeight;
                    var size = parseInt(conH / 32);
                    dataList.forEach((v, i) => {
                        itemList.push(v);
                        if (itemList.length == size) {
                            this.dataList.push(JSON.parse(JSON.stringify(itemList)));
                            itemList = [];
                        }
                        else if (i == (dataList.length - 1)) {
                            this.dataList.push(JSON.parse(JSON.stringify(itemList)));
                            itemList = [];
                        }
                    })
                    console.log("命令电报详情kydp_zxy8017", this.dataList);
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '命令电报详情',
                    message: '获取命令电报详情异常'
                })
            })
        },
        openDDMLDetail(orderNum) {
            this.$emit("openOrderDetail", orderNum);
        },
        openMLView(type) {
            this.$emit("openOrderView", type);
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
    padding: 10px;
}
/* .main>div{
        width:100%;
        height:100%;
        background:url('./img1/CR1.png') no-repeat;
        background-size: 100% auto;
        background-position: center;
    } */
.CR1_FC {
    display: flex;
    justify-content: center;
    align-items: center;
}
.CR1_TAB {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 12px;
    color: #c2ccf5;
}
.s-table {
    width: 100%;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 0px 10px;
    text-align: center;
}

.s-table > tbody > tr {
    height: 62px;
    background: url("./img1/CR1_2.png") no-repeat;
    background-size: 100% 46px;
    background-position: 0px 8px;
}
.fsqb_bg {
    vertical-align: top;
    background: url("./img1/CR1_qb1.gif") no-repeat;
    background-position: center bottom;
    background-size: auto 80%;
}
.qsqb_bg {
    vertical-align: top;
    background: url("./img1/CR1_qb2.gif") no-repeat;
    background-position: center bottom;
    background-size: auto 80%;
}
.s-div {
    margin: 0 auto;
    width: 90%;
    color: #fff;
    font-size: 12px;
    padding: 0px 10px;
    text-align: center;
    background: rgba(44, 55, 92, 0.5);
    border-radius: 3px;
}
.s-div > div {
    /* width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding:3px 0; */
}
.CR1_FG {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
}
.CR1_FG + .CR1_FG {
    border-top: 1px solid rgba(170, 170, 170, 0.199);
}
/* >>> .el-carousel__button {
  width: 10px;
} */
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
