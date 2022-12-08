<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div ref="con" class="main">
        <div style="text-align: center;">
            <MapTab
                ref="mapTab"
                :dataSource="dataSource"
                type="1"
                @select="mapTabSelect"
                style="width:280px;margin-top: 10px;"
            ></MapTab>
        </div>
        <el-carousel
            ref="myCarousel"
            indicator-position="none"
            :height="carouselHeight"
            arrow="never"
            direction="vertical"
            :autoplay="false"
            :interval="6000"
        >
            <el-carousel-item v-for="item in 2" :key="item">
                <el-carousel
                    indicator-position="outside"
                    :height="carouselHeight2"
                    arrow="never"
                    :autoplay="true"
                    :interval="5000"
                >
                    <el-carousel-item v-for="(item,index) in dataList" :key="index">
                        <div
                            style="height:calc(100% - 0px);width:100%;display: flex;justify-content: space-around;padding: 10px;padding-bottom:0px;"
                        >
                            <div
                                class="card"
                                v-for="(c,it) in item"
                                :key="'card'+it"
                                style="padding-top:9px;padding-bottom:15px;padding-left:10px;padding-right:10px;"
                            >
                                <table
                                    style="height:100%;width:100%;"
                                    cellpadding="0"
                                    cellspacing="0"
                                    v-show="dataType=='0'"
                                >
                                    <tbody>
                                        <tr>
                                            <td
                                                style="font-size: 16px;text-align:left;height:35px;padding-left:8px;color:#00e1ff;font-weight:bold;"
                                            >{{c.CC}}</td>
                                            <td style="text-align:right;padding-right:8px;">
                                                {{c.TRAIN_UNDER}}
                                                <br />
                                                {{c.CLASS_NAME}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="text-align:center;height:69px;">
                                                <div class="cardConent">
                                                    <div>{{c.TYPE}}</div>
                                                    <div>扣{{c.SCORE}}分</div>
                                                    <div>{{c.CREATE_TIME}}</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                colspan="2"
                                                style="padding:5px 25px;color:rgb(89, 233, 251);height:40px;text-align:center;"
                                            >{{c.TEXT}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    v-show="dataType=='1'"
                                    style="text-align:center;width:100%;height:100%;"
                                >
                                    <tbody>
                                        <tr>
                                            <th
                                                style="height: 35px;font-size: 16px;color:#00e1ff;"
                                            >{{c.TRAIN_NUM}}</th>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;height:69px;">
                                                <div class="cardConent">
                                                    <div>{{c.CLASS_NUM}}</div>
                                                    <div>{{c.TRAIN_TEAM}}</div>
                                                    <div>{{c.C_TIME}}</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="height:40px;color:rgb(89, 233, 251)"
                                            >{{c.PROPOSER}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
// 这里引用各种资源
import MapTab from './components/MapTab.vue';
import home from './service/home1.js';
export default {
    // 组件
    components: {
        MapTab
    },
    // 数据仓库
    data() {
        return {
            carouselHeight: "200px",
            carouselHeight2: "200px",
            curItem: {},
            dataSource: [{
                text: '备品耗材签收',
                value: "1",
            },{
                text: '保洁打分',
                value: "0",
            }],
            interval: null,
            dataIndex: 0,
            dataList: [],
            bjdataList: [],
            bpdataList: [],
            dataType: "0",
            p1: 9,
            p2: 15,
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
        const h = this.$refs.con.offsetHeight - 20;
        this.carouselHeight = h - 20 + "px";
        this.carouselHeight2 = h - 40 + "px";
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        mapTabSelect(item) {
            this.dataType = item.value;
            this.curItem = item;
            if (item.text === "保洁打分") {
                this.dataList = this.bjdataList;
                this.$refs.myCarousel.setActiveItem(0);
            } else {
                this.dataList = this.bpdataList;
                this.$refs.myCarousel.setActiveItem(1);
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
        getDataList() {
            this.getDataBJ();
            this.getDataBP();
        },
        getDataBJ() {
            let t = this
            home.getCL3BJ({
                s: [this.oname]
            }).then((r) => {
                if (r) {
                    var itemList = JSON.parse(r);
                    // var itemList = r;
                    itemList.forEach(v => {
                        v.CREATE_TIME = new Date(v.CREATE_TIME).Format("MM/dd hh:mm")
                    })
                    this.bjdataList = this.initDataList(itemList);
                    console.log("保洁打分", this.bjdataList);
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '保洁打分',
                    message: '获取保洁打分异常'
                })
            })
        },
        getDataBP() {
            let t = this
            home.getCL3BP({
                s: [this.oname]
            }).then((r) => {
                if (r) {
                    var itemList = JSON.parse(r);
                    // var itemList = r;
                    itemList.forEach(v => {
                        v.C_TIME = new Date(v.C_TIME).Format("MM/dd hh:mm")
                    })
                    this.bpdataList = this.initDataList(itemList);
                    this.$nextTick(() => {
                        this.mapTabSelect(this.dataSource[0]);
                    })
                    console.log("备品耗材签收", this.bpdataList);
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '备品耗材签收',
                    message: '获取备品耗材签收异常'
                })
            })
        },
        initDataList(dataList) {
            var itemList = [];
            for (var i = 0; i < dataList.length; i++) {
                itemList.push(dataList[i]);
                if (i > 31) {
                    break;
                }
            }
            var tempList = [];
            var rs = [];
            itemList.forEach((v, i) => {
                tempList.push(v);
                if (tempList.length == 2) {
                    rs.push(JSON.parse(JSON.stringify(tempList)));
                    tempList = [];
                } else if (i == (itemList.length - 1)) {
                    rs.push(JSON.parse(JSON.stringify(tempList)));
                    tempList = [];
                }
            })
            return rs;
        },
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
}

.card {
    width: 160px;
    height: auto;
    background: url(img1/CR3_card.png) no-repeat;
    background-size: 100% 100%;
    padding: 0px;
    font-size: 12px;
    color: #ffffff;
}

.card table {
    border-collapse: collapse;
}

.card td {
    /* padding: 5px;
    padding-left: 10px; */
}
.cardConent {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding:5px 0;
}
>>> .el-carousel__button {
    width: 5px;
}
>>> .el-carousel__indicators--horizontal {
    text-align: center;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
