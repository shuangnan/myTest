<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		保洁数据、备品数据
 -->
<template>
    <div class="main">
        <div style="height:50px;width:100%;padding-top:10px;">
            <MapTab
                ref="mapTab"
                :dataSource="dataSource"
                type="2"
                @select="mapTabSelect"
                :defaultTabIndex="defaultTabIndex"
                style="width:180px;margin-bottom: 5px;margin-top: 10px;"
            ></MapTab>
        </div>
        <div style="height:calc(100% - 50px);width:100%;" class="KR2_1">
            <table style="width:100%;text-align:center;height:80px;" v-show="dataType=='0'">
                <tr class="KR1_R2_text1">
                    <td>今日考核</td>
                    <td>月度考核</td>
                    <td>年度考核</td>
                    <td>年考核率</td>
                </tr>
                <tr class="KR1_R2_text2 shadow-txt">
                    <td style="color:#9bc8d1;">
                        {{num3}}
                        <span>元</span>
                    </td>
                    <td style="color:#aaed9a;">
                        {{num2}}
                        <span>元</span>
                    </td>
                    <td style="color:#e8ed9a;">
                        {{num1}}
                        <span>元</span>
                    </td>
                    <td style="color:#9bc8d1;">
                        {{num4}}
                        <span>%</span>
                    </td>
                </tr>
            </table>
            <table style="width:100%;text-align:center;height:80px;" v-show="dataType=='1'">
                <tr class="KR1_R2_text1">
                    <td>年入库</td>
                    <td>年出库</td>
                </tr>
                <tr class="KR1_R2_text2 shadow-txt">
                    <td style="color:#e8ed9a;">
                        {{num1}}
                        <span>元</span>
                    </td>
                    <td style="color:#aaed9a;">
                        {{num2}}
                        <span>元</span>
                    </td>
                </tr>
            </table>
            <div ref="CR21" style="width:100%;height:calc(100% - 80px)">
                <el-carousel indicator-position :height="carouselHeight" :autoplay="true">
                    <el-carousel-item v-for="(item,index) in dataList" :key="index">
                        <div style="width:100%;height:100%;padding-bottom:20px;">
                            <table style="width:100%;" class="CR21_tab" v-show="dataType=='0'">
                                <thead>
                                    <tr>
                                        <th>车次</th>
                                        <th>车号</th>
                                        <th>保洁类型</th>
                                        <th style="max-width:230px;">保洁项目</th>
                                        <th>班组</th>
                                        <th>考核扣分</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(temp,t) in item" :key="t">
                                        <td style="max-height:30px;color:#09f6ff;">{{temp.CC}}</td>
                                        <td>{{temp.TRAIN_UNDER}}</td>
                                        <td>{{temp.TYPE}}</td>
                                        <td :title="temp.TEXT" class="k2td">{{temp.TEXT}}</td>
                                        <td>{{temp.CLASS_NAME}}</td>
                                        <td style="position:relative;">
                                            <div class="tab_tdfg"></div>
                                            {{temp.K_SCORE}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                style="width:100%;height:100%;"
                                class="CR21_tab"
                                v-show="dataType=='1'"
                            >
                                <thead>
                                    <tr>
                                        <th>车型</th>
                                        <th>车队</th>
                                        <th>班组</th>
                                        <th>车次</th>
                                        <th>签收人</th>
                                        <th>签收状态</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(temp,t) in item" :key="t">
                                        <td
                                            style="max-height:30px;color:#09f6ff;"
                                        >{{temp.TRAIN_MODEL}}</td>
                                        <td>{{temp.TRAIN_TEAM}}</td>
                                        <td>{{temp.CLASS_NUM}}</td>
                                        <td>{{temp.DEP_NUM}}</td>
                                        <td>{{temp.OP_NAME}}</td>
                                        <td style="position:relative;">
                                            <div class="tab_tdfg"></div>
                                            {{temp.GA_STATUS_TXT}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import MapTab from './components/MapTab.vue';
export default {
    // 组件
    components: { MapTab },
    // 数据仓库
    data() {
        return {
            curItem: {},
            dataSource: [{
                text: '保洁数据',
                value: "0"
            }, {
                text: '仓储数据',
                value: "1"
            }],
            carouselHeight: "200px",
        }
    },
    // 属性
    props: {
        num1: {
            type: String,
            default: "",
        },
        num2: {
            type: String,
            default: "",
        },
        num3: {
            type: String,
            default: "",
        },
        num4: {
            type: String,
            default: "",
        },
        dataList: {
            type: Array,
            default: () => { return [] }
        },
        dataType: {
            type: String,
            default: "",
        },
        defaultTabIndex: {
            type: String,
            default: "",
        }
    },
    // 组件挂载完毕
    mounted() {
        //document.querySelector("title").innerHTML = "";//页面名称
        this.carouselHeight = this.$refs.CR21.offsetHeight + "px";
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        mapTabSelect(item) {
            this.curItem = item;
            this.$emit("changeType", item.value);
            // if (item.text === "高铁") {
            // 	this.$refs.myCarousel.setActiveItem(0);
            // } else if (item.text === "普速") {
            // 	this.$refs.myCarousel.setActiveItem(1);
            // } else {
            // 	this.$refs.myCarousel.setActiveItem(2);
            // }
        },

        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {

        },
        setCarouseHeight() {
            this.carouselHeight = this.$refs.CR21.offsetHeight + "px";
        }
    },
    // 监视属性
    watch: {

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
    padding-right: 15px !important;
}
.KR2_1 {
    padding-top: 0px;
}

.KR1_R2_text1 {
    font-size: 16px;
    color: #bad9de;
}
.KR1_R2_text2 {
    font-size: 24px;
    color: #bad9de;
    font-weight: bold;
}
.KR1_R2_text2 span {
    font-size: 18px;
}
.CR21_tab {
    text-align: center;
    border-collapse: collapse;
}
.CR21_tab th {
    /* color: #284d7d; */
    color: #417dba;
    font-size: 14px;
}
.CR21_tab td {
    color: #d0c5e3;
    font-size: 12px;
    height: 30px;
}
.CR21_tab > tbody > tr {
    background: url("./img1/KR21_1.png") no-repeat;
    background-size: 100% 100%;
}
.tab_tdfg {
    border-left: 1px solid rgb(132, 200, 247);
    position: absolute;
    left: 0;
    top: 2px;
    bottom: 2px;
    width: 1px;
}
.k2td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
