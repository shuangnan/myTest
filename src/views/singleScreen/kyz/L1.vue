<!-- 
 * @created：	2021年7月19日
 * @author：	ch
 * @version:	v1.0
 * @desc:		风险管控
 -->
<template>
    <div class="L1_main" id="R1_UL">
        <div class="L1_top" :style="{width:moreVisible?'120px':'20px'}" @click="moreClick">
            <div class="L1_more" v-show="!moreVisible">
                <i class="el-icon-more"></i>
            </div>
            <div class="L1_select" v-show="moreVisible">
                <el-select
                    ref="l1_more_stn"
                    size="mini"
                    v-model="selectStn"
                    popper-class="blue-control"
                    class="blue-control"
                    style="width:100px"
                    @change="moreChange"
                >
                    <el-option
                        v-for="item in rows"
                        :key="item.stnName"
                        :label="item.stnName"
                        :value="item.stnName"
                    ></el-option>
                </el-select>
                <i class="el-icon-d-arrow-left" style="margin-left:5px;" @click="moreClose($event)"></i>
            </div>
        </div>
        <el-carousel
            indicator-position="bottom"
            direction="horizontal"
            :height="carouselHeight"
            :autoplay="true"
            :interval="4000"
            arrow="never"
            ref="elcarousel"
        >
            <el-carousel-item v-for="(arr,index) in rows" :key="index">
                <div style="width:100%;height:100%;display:flex">
                    <div
                        style="width:30px;height:100%;"
                        class="itemTitle shadow-txt"
                    >{{arr.stnName}}</div>
                    <div style="width:calc(100% - 30px);height:100%;">
                        <ul class="list shadow-txt">
                            <li class="item1">
                                <div class="item1BG"></div>
                                <div class="txt" :style="{top:textY,left:textX}">晚到岗人员数量</div>
                                <div class="num" :style="{top:numY,left:textX}">
                                    {{arr.num1}}
                                    <span>人</span>
                                </div>
                            </li>
                            <li class="item2">
                                <div class="item2BG warningLight" v-if="arr.num2>0"></div>
                                <div class="item2BG1" v-if="arr.num2<=0"></div>
                                <div class="txt" :style="{top:textY,left:textX}">异常行为分析数</div>
                                <div class="num" :style="{top:numY,left:textX}">
                                    {{arr.num2}}
                                    <span>个</span>
                                </div>
                            </li>
                            <li class="item3">
                                <div class="item3BG"></div>
                                <!-- <div class="txt" :style="{top:textY,left:textX}">进站风险(闸机)</div> -->
                                <div class="txt" :style="{top:textY,left:textX}">未盯控风险</div>
                                <div class="num" :style="{top:numY,left:textX}">
                                    {{arr.num3}}
                                    <span>个</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
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
            num1: 0,
            num2: 62,
            num3: 48,
            textY: "90px",
            textX: "40px",
            numY: "120px",
            numX: "40px",
            rows: [
                // { stnName: "成都东", num1: 3, num2: 1, num3: 48 },
                // { stnName: "成都南", num1: 0, num2: 0, num3: 9 },
                // { stnName: "成都西", num1: 1, num2: 0, num3: 11 },
            ],
            carouselHeight: "200px",
            selectStn: "",
            moreVisible: false,
        }
    },
    // 属性
    props: {
        unitid: {
            type: String,
            default: "",
        }
    },
    created() {
        this.getData();
        setInterval(() => {
            this.getData();
        }, 1000 * 60 * 30);
    },
    // 组件挂载完毕
    mounted() {
        //document.querySelector("title").innerHTML = "";//页面名称
        var box = document.getElementById("R1_UL");
        const h = box.offsetHeight;
        this.carouselHeight = h + "px";
        var boxH = box.offsetHeight;
        var boxW = box.offsetWidth;
        var Hpid = boxH / 102;
        this.textY = 60 * Hpid + "px";
        this.numY = 78 * Hpid + "px";
        this.textX = 28 * Hpid + "px";
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {
            C.getData({
                c: "trdm_zjm_058",
                o: [this.unitid.toUpperCase()],
                a: "【trdm_zjm_058】晚到岗人数",
                async: true,
            }, (r) => {
                // if (r[0]) {
                //   this.num1 = r[0].COUNT;
                // }
                r.forEach(v => {
                    v.stnName = v.STN_NAME;
                    v.num1 = v.COUNT;
                    v.num2 = parseInt(Math.random() * 2);
                    v.num3 = parseInt(Math.random() * 4);
                })
                if (r.length === 0) {
                    r = [{stnName:"",num1:"",num2:"",num3:""}]

                }
                this.rows = r;
                console.log("晚到岗人数trdm_zjm_058", r);
            })
        },
        moreMouseLeave() {
            this.$refs.l1_more_stn.blur();
        },
        moreClick() {
            this.moreVisible = true;
        },
        moreClose(e) {
            e.preventDefault();
            e.stopPropagation();
            this.moreVisible = false;
            this.$refs.l1_more_stn.blur();
        },
        moreChange(val) {
            this.rows.forEach((v, i) => {
                if (v.stnName == val) {
                    this.$refs.elcarousel.setActiveItem(i);
                }
            })
            this.moreClose();
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
.list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    height: calc(100% - 15px);
    font-weight: bold;
}
.list > li {
    position: relative;
    flex-grow: 1;
    font-size: 12px;
}
.list > li > div:nth-child(1) {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-size: auto 100%;
}
.list > li > .item1BG {
    background: url(img/picL11.png) no-repeat;
}
.list > li > .item2BG {
    background: url(img/picL12.png) no-repeat;
}
.list > li > .item2BG1 {
    background: url(img/picL121.png) no-repeat;
}
.list > li > .item3BG {
    background: url(img/picL13.png) no-repeat;
}
.list > li > .txt {
    position: absolute;
    top: 75px;
    left: 40px;
}
.list > li > .num {
    position: absolute;
    top: 95px;
    left: 40px;
    font-size: 24px;
    letter-spacing: 3px;
}
.list > li > .num > span {
    font-size: 12px;
}
.L1_main {
    width: 100%;
    height: 100%;
    position: relative;
}
.L1_top {
    position: absolute;
    left: 5px;
    top: -30px;
    height: 30px;
    transition: all 0.5s;
    width: 20px;
    overflow: hidden;
}
/* .L1_top:hover {
  width: 120px;
} */
/* .L1_select {
  display: none;
} */
/* .L1_top:hover .L1_more {
  display: none;
}
.L1_top:hover .L1_select {
  display: block;
} */
>>> .el-carousel__indicators--horizontal {
    width: 70%;
    text-align: center;
    display: none;
}
>>> .el-carousel__indicator--horizontal {
    padding: 0 4px;
}
>>> .el-carousel__button {
    width: 10px;
}
.itemTitle {
    display: flex;
    flex-direction: column;
    padding: 5px;
    align-items: center;
    justify-content: center;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
