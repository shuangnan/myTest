<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div class="CL21main" style="width:100%;height:100%;" ref="CL21">
        <!-- 头部总收入 -->
        <div class="csphTop" :style="{marginTop:top1+'px'}">
            {{title}}总收入
            <span>{{dataSource.TOTAL_SALE}}</span>
            <span>
                <label v-show="wyFlag">万</label>元
            </span>
        </div>
        <!-- 百分占比条 -->
        <div class="csphbar" :style="{marginTop:top2+'px'}">
            <div class="csphbar1" style="margin-bottom:6px">
                <div class="csphbar1Bottom" :style="{width:dWidth}">
                    <div class="csphbar1Bottom" :style="{width:dWidthP}">
                        <div class="csphbar1Item Top" style="background:rgba(21,107,246,0.65);"></div>
                        <img
                            src="./img1/D_P.png"
                            class="csphbar1BottomPIC"
                            style="left:0;height:17px;"
                        />
                    </div>
                    <div class="csphbg"></div>
                    <div class="csphbar1Bottom" :style="{width:dWidthC}">
                        <div class="csphbar1Item Top" style="background:rgba(21,107,246,0.45);"></div>
                        <img
                            src="./img1/D_C.png"
                            class="csphbar1BottomPIC"
                            style="left:0;height:17px;"
                        />
                    </div>
                </div>
                <div class="csphbg"></div>
                <div class="csphbar1Bottom" :style="{width:pWidth}">
                    <div class="csphbar1Bottom" :style="{width:pWidthP}">
                        <div class="csphbar1Item Top" style="background:rgba(92,161,25,0.65);"></div>
                        <img
                            src="./img1/P_P.png"
                            class="csphbar1BottomPIC"
                            style="left:0;height:17px;"
                        />
                    </div>
                    <div class="csphbg"></div>
                    <div class="csphbar1Bottom" :style="{width:pWidthC}">
                        <div class="csphbar1Item Top" style="background:rgba(92,161,25,0.45);"></div>
                        <img
                            src="./img1/P_C.png"
                            class="csphbar1BottomPIC"
                            style="left:0;height:17px;"
                        />
                    </div>
                </div>
            </div>
            <div class="csphbar1">
                <div class="csphbar1Bottom" :style="{width:dWidth}">
                    <div class="csphbar1Item" style="background:rgb(21,107,246)"></div>
                    <img src="./img1/D.png" class="csphbar1BottomPIC" style="left:0;height:20px;top:-3px;" />
                </div>
                <div class="csphbg"></div>
                <div class="csphbar1Bottom" :style="{width:pWidth}">
                    <div class="csphbar1Item" style="background:rgb(92,161,25)"></div>
                    <img src="./img1/P.png" class="csphbar1BottomPIC" style="right:0;" />
                </div>
            </div>
        </div>
        <!-- 动普车总收入 -->
        <div class="csphZPSR" :style="{marginTop:top3+'px'}">
            <div class="csphZPSRItem">
                <div style="font-size:14px;">
                    <span>动车 </span>
                    <span style="font-size:18px;color:#1594f6;">{{dataSource.D_SALE}}</span>
                    <span style="font-size:12px;">
                        <label v-show="wyFlag"> 万</label>
                        元/{{Dpie}}%
                    </span>
                </div>
                <!-- <div style="font-size:14px;">
                    <span style="font-size:12px;">请领</span>
                    {{dataSource.D_APPLY}}
                    <span style="font-size:12px;">
                        <label v-show="wyFlag">万</label>份
                    </span>
                    销售 {{dataSource.D_QTY}}
                    <span style="font-size:12px;">
                        <label v-show="wyFlag">万</label>份
                    </span>
                </div>-->
            </div>
            <span class="csphZPSRItem" style="text-align:right">
                <div style="font-size:14px;">
                    <span style="font-size:14px;">普车 </span>
                    <span style="font-size:18px;color:#78d220">{{dataSource.P_SALE}}</span>
                    <span style="font-size:12px;">
                        <label v-show="wyFlag"> 万</label>
                        元/{{100-Dpie}}%
                    </span>
                </div>
                <!-- <span style="font-size:14px;">
                    <span style="font-size:12px;">请领</span>
                    {{dataSource.P_APPLY}}
                    <span style="font-size:12px;">
                        <label v-show="wyFlag">万</label>份
                    </span>
                    销售 {{dataSource.P_QTY}}
                    <span style="font-size:12px;">
                        <label v-show="wyFlag">万</label>份
                    </span>
                </span>-->
            </span>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
export default {
    // 组件
    components: {},
    // 数据仓库
    data() {
        return {
            dWidth: 'calc(40% - 2px)',
            pWidth: 'calc(60% - 2px)',
            top1: "15",
            top2: "15",
            top3: "5",
            defaultH: "144",
        }
    },
    // 属性
    props: {
        title: {
            type: String,
            default: ""
        },
        countNUM: {
            type: String,
            default: ""
        },
        dataSource: {
            type: Object,
            default: () => { return {} }
        }
    },
    // 组件挂载完毕
    mounted() {
        //document.querySelector("title").innerHTML = "";//页面名称

    },
    // 方法
    methods: {
        initDefaultSize() {
            var height = this.$refs.CL21.offsetHeight;
            var pie = height / this.defaultH;
            this.top1 = this.top1 * pie;
            this.top2 = this.top2 * pie;
            this.top3 = this.top3 * pie;
        },
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {

        }
    },
    // 监视属性
    watch: {},
    // 计算属性
    computed: {
        wyFlag() {
            var flag = false;
            if (this.title == '全年销售') {
                flag = true;
            }
            return flag;
        },
        Dpie() {
            var rs = 0;
            if (this.dataSource.TOTAL_SALE) {
                var rs = parseInt(this.dataSource.D_SALE / this.dataSource.TOTAL_SALE * 100);
            }
            this.dWidth = 'calc(' + rs + '% - 2px)';
            this.pWidth = 'calc(' + (100 - rs) + '% - 2px)';
            return rs;
        },
        DQLpie() {
            var rs = 0;
            if (this.dataSource.D_QTY || this.dataSource.D_APPLY) {
                rs = parseInt(this.dataSource.D_APPLY / (this.dataSource.D_QTY + this.dataSource.D_APPLY) * 100);
            }
            return rs;
        },
        dWidthP() {
            var rs = this.DQLpie;
            return 'calc(' + rs + '% - 2px)';
        },
        dWidthC() {
            var rs = this.DQLpie;
            return 'calc(' + (100 - rs) + '% - 2px)';
        },
        PQLpie() {
            var rs = 0;
            if (this.dataSource.P_QTY || this.dataSource.P_APPLY) {
                rs = parseInt(this.dataSource.P_APPLY / (this.dataSource.P_QTY + this.dataSource.P_APPLY) * 100);
            }
            return rs;
        },
        pWidthP() {
            var rs = this.PQLpie;
            return 'calc(' + rs + '% - 2px)';
        },
        pWidthC() {
            var rs = this.PQLpie;
            return 'calc(' + (100 - rs) + '% - 2px)';
        }
    },
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.CL21main{
    display:flex;
    flex-direction: column;
    justify-content: space-around;
}
.csphTop {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #aec0f2;
    margin-top: 5px;
}
.csphTop span:nth-child(1) {
    font-size: 30px;
    margin-left: 7px;
    margin-right: 5px;
    color: #f2c7ae;
}
.csphTop span:nth-child(2) {
    font-size: 20px;
}
.csphbar {
    border: 1px solid #595d8c;
    border-radius: 5px;
    height: 60px;
    width: 100%;
    margin-top: 20px;
    padding: 2px 5px;
    min-height: 60px;
}
.csphbar1 {
    width: 100%;
    height: 50%;
    padding: 3px 0px;
    display: flex;
}
.csphbar1Bottom {
    height: 100%;
    position: relative;
    display: flex;
    overflow: hidden;
}
.csphbg {
    height: 100%;
    width: 4px;
}
.csphbar1BottomPIC {
    position: absolute;
    top: 1px;
    z-index: 5;
}
.csphbar1Item {
    height: 10px;
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 1;
}
.Top {
    /* top: 7px; */
    bottom:0px;
}
.csphZPSR {
    width: 100%;
    /* border:1px solid red; */
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-weight: bold;
}
.csphZPSRItem {
    line-height: 25px;
    letter-spacing: 2px;
    font-weight: bold;
}

</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
