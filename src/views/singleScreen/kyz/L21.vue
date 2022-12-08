<!-- 
 * @created：	2021年7月19日
 * @author：	ch
 * @version:	v1.0
 * @desc:		综控、乘降风险计划
 -->
<template>
    <div style="width:100%;height:100%;" @mouseenter="boxMouseEnter" @mouseleave="boxMouseLeave">
        <el-carousel
            indicator-position="bottom"
            direction="horizontal"
            :height="boxH"
            :autoplay="false"
            :interval="3000"
            arrow="never"
            ref="L21"
        >
            <el-carousel-item v-for="(item,index) in rows" :key="index">
                <autoScroll
                    ref="autoScroll_fx"
                    :boxHeight="parseInt(boxH)"
                    :scrollAuto="false"
                    :scrollSize="1"
                    @scrollDown="scrollDown"
                    @scrollLeave="scrollLeave"
                >
                    <div
                        v-for="(temp,i) in item.children"
                        :key="'fx'+i"
                        @dblclick="L21ItemClick(temp)"
                        class="L21_item"
                        :class="{'warningLightM':dataType=='zdfx','L21_item_zd':dataType=='zdfx'}"
                    >
                        <div style="width:70px;" class="flexCenter">{{temp.trackName}}</div>
                        <div class="textOver" style="width:70px;" :title="temp.STN_NAME">
                            <!-- <MarqueeText
                                :duration="temp.STN_NAME.length>6?temp.STN_NAME.length*0.2:4"
                                v-if="temp.STN_NAME.length>4"
                            >
                                <div v-html="temp.STN_NAME +'&emsp;&emsp;'"></div>
                            </MarqueeText> -->
                            <!-- <span v-html="temp.STN_NAME" v-if="temp.STN_NAME.length<=4"></!-->
                            {{
                                temp.STN_NAME
                            }}
                        </div>
                        <div class="flexLeftS" style="flex-grow:1">
                            <div style="color: #50b6d3;" v-html="temp.TRAIN"></div>
                            <div class="L2_stns" v-if="dataType!='sg'">
                                <span :title="temp.START_STN">{{temp.START_STN}}</span>
                                <span>-</span>
                                <span :title="temp.END_STN">{{temp.END_STN}}</span>
                            </div>
                            <div class="L2_stns" v-if="dataType=='sg'" style="max-width:140px;">
                                <MarqueeText
                                    :duration="temp.START_STN.length>15?temp.START_STN.length*0.2:10"
                                    v-if="temp.START_STN.length>10"
                                >
                                    <div v-html="temp.START_STN +'&emsp;&emsp;'"></div>
                                </MarqueeText>
                                <div v-html="temp.START_STN" v-if="temp.START_STN.length<=10"></div>
                            </div>
                        </div>
                        <div
                            class="flexRightS"
                            style="overflow:hidden;width: 130px;padding-right: 5px;"
                        >
                            <div v-if="dataType!='sg'">
                                <span
                                    v-show="!(temp.STN_NAME==temp.START_STN)||temp.hxFlag"
                                >到{{temp.arrTime}}</span>
                                &nbsp;
                                <span
                                    v-show="!(temp.STN_NAME==temp.END_STN)||temp.hxFlag"
                                >发{{temp.depTime}}</span>
                            </div>
                            <div v-if="dataType=='sg'">
                                {{temp.arrTime}}
                            </div>
                            <div
                                style="padding-top: 5px;color: #50b6d3;width:130px;height:21px;text-align:right;"
                            >
                                <MarqueeText
                                    :duration="temp.RISK_String.length>15?temp.RISK_String.length*0.2:10"
                                    v-if="temp.RISK_String.length>10"
                                >
                                    <div v-html="temp.RISK_TYPEString +'&emsp;&emsp;'"></div>
                                </MarqueeText>
                                <span
                                    v-html="temp.RISK_TYPEString"
                                    v-if="temp.RISK_String.length<=10"
                                ></span>
                            </div>
                        </div>
                    </div>
                    <!-- <table class="s-table" :class="{'warningLightM':dataType=='zdfx','s-table-zd':dataType=='zdfx'}" cellspacing="0">
            <tbody>
              <tr v-for="(temp,i) in item.children" :key="'fx'+i" @dblclick="L21ItemClick(temp)">
                <th style="width: 70px;min-width:70px;">{{temp.trackName}}</th>
                <th style="width: 70px;text-align: left;padding-left:5px;min-width:70px;">{{temp.STN_NAME}}</th>
                <th style="text-align: left;font-size: 12px;line-height: 15px;">
                  <div style="color: #50b6d3;" v-html="temp.TRAIN"></div>
                  <div class="L2_stns">
                    <span :title="temp.START_STN">{{temp.START_STN}}</span> -
                    <span :title="temp.END_STN">{{temp.END_STN}}</span>
                  </div>
                </th>
                <th style="text-align: right;width: 130px;font-size: 12px;padding-right: 5px;">
                  <div style>
                    <span v-show="!(temp.STN_NAME==temp.START_STN)||temp.hxFlag">到{{temp.arrTime}}</span>
                    &nbsp;
                    <span
                      v-show="!(temp.STN_NAME==temp.END_STN)||temp.hxFlag"
                    >发{{temp.depTime}}</span>
                  </div>
                  <div style="padding-top: 5px;color: #50b6d3;width:130px;height:21px;">
                    <MarqueeText
                      :duration="temp.RISK_String.length>15?temp.RISK_String.length*0.2:10"
                      v-if="temp.RISK_String.length>10"
                    >
                      <div v-html="temp.RISK_TYPEString +'&emsp;&emsp;'"></div>
                    </MarqueeText>
                    <span v-html="temp.RISK_TYPEString" v-if="temp.RISK_String.length<=10"></span>
                  </div>
                </th>
              </tr>
            </tbody>
                    </table>-->
                </autoScroll>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
// 这里引用各种资源
import autoScroll from "../../../components/data/AutoScroll.vue";
import MarqueeText from 'vue-marquee-box';
import C from "../../../assets/com.js";
export default {
    // 组件
    components: {
        autoScroll, MarqueeText
    },
    // 数据仓库
    data() {
        return {
            carouselActiveItem: 0,//当前显示的
            mouseEnterFlag: false,//鼠标是否再当前区域
            activeIngFlag: false,//停止滚动的时候是否正在切换
            setTimeOut1: null,
            setTimeOut2: null,
        }
    },
    // 属性
    props: {
        boxH: {
            type: String,
            default: "200px"
        },
        rows: {
            type: Array,
            default: () => { return [] }
        },
        showNum: {
            type: Number,
            default: 3
        },
        dataType: {
            type: String,
            default: "qt"
        }
    },
    created() {

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
        scrollDown() {
            if (this.mouseEnterFlag) {
                return;
            }
            if (this.dataType == "zdfx" && this.rows.length > 0) {
                // return; 重大风险有值就不切换
            }
            this.endScroll();
            var dataItem = this.rows[this.carouselActiveItem];
            if (dataItem.children.length > this.showNum * 1.5) {
                this.changeActive(dataItem);
            } else {
                var timeOut = this.showNum;
                if (dataItem.children.length < this.showNum) {
                    timeOut = dataItem.children.length;
                }
                if (timeOut < 2) {
                    timeOut = 2;
                }
                this.setTimeOut1 = setTimeout(() => {
                    if (this.mouseEnterFlag) {
                        this.activeIngFlag = true;
                        return;
                    }
                    this.changeActive(dataItem);
                }, timeOut * 1000);
            }
        },
        changeActive(dataItem) {
            this.carouselActiveItem += 1;
            if (this.carouselActiveItem == this.rows.length) {
                this.carouselActiveItem = 0;
                this.$emit("changeFXJHTab");
            }
            this.$refs.L21.setActiveItem(this.carouselActiveItem);
            if (!dataItem) {
                return;
            }
            this.$refs.autoScroll_fx[this.carouselActiveItem].scrollModule();

        },
        startScroll() {
            if (this.$refs.autoScroll_fx) {
                this.$refs.autoScroll_fx[0].scrollModule();
            } else {
                if (!this.mouseEnterFlag) {
                    this.setTimeOut2 = setTimeout(() => {
                        this.$emit("changeFXJHTab");
                    }, 2000);
                }
            }
        },
        endScroll() {
            if (this.$refs.autoScroll_fx) {
                this.$refs.autoScroll_fx.forEach((v, i) => {
                    v.scrollStop();
                });
            }

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
        scrollLeave() {
            this.$refs.L21.setActiveItem(this.carouselActiveItem);
        },
        L21ItemClick(item) {
            this.$emit("openDialogC", item,this.dataType);
        },
        boxMouseEnter() {
            this.mouseEnterFlag = true;
            if (this.$refs.autoScroll_fx && this.$refs.autoScroll_fx[this.carouselActiveItem]) {
                this.$refs.autoScroll_fx[this.carouselActiveItem].scrollAutoFlag = false;
            }
        },
        boxMouseLeave() {
            this.mouseEnterFlag = false;
            this.$refs.autoScroll_fx && this.$refs.autoScroll_fx[this.carouselActiveItem] && (this.$refs.autoScroll_fx[this.carouselActiveItem].scrollAutoFlag = true);
            if (this.activeIngFlag) {
                this.$refs.autoScroll_fx[this.carouselActiveItem].scrollModule();
            }
            this.activeIngFlag = false;
        },
        clearSettimeOut() {
            clearTimeout(this.setTimeOut1);
            clearTimeout(this.setTimeOut2);
        },
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
.s-table-zd > tbody > tr {
    background-image: url(img/picL211.png);
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
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.L21_item {
    width: 100%;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 2px;
    height: 60px;
    background: url(img/picL21.png) no-repeat;
    background-size: 100% 48px;
    background-position: 0px 6px;
    display: flex;
}
.L21_item_zd {
    background-image: url(img/picL211.png);
}
.flexCenter {
    display: flex;
    align-items: center;
    justify-content: center;
}
.flexLeftS {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
}
.flexRightS {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: column;
}
.textOver{
    line-height: 60px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
