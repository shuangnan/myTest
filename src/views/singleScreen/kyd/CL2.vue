<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div class="main" @mouseenter="CL2MouseEnter" @mouseleave="CL2MouseLeave">
        <div class="main_btn">
            <MapTab
                ref="chartMapTab"
                :dataSource="tabData"
                type="1"
                @select="mapTabSelect"
                style="width:300px;margin: 10px;"
            ></MapTab>
        </div>
        <div ref="CL2" style="height:75%;width:100%;color:#aec0f2;">
            <el-carousel
                ref="myCarousel"
                indicator-position="none"
                :height="carouselHeight"
                arrow="never"
                :autoplay="false"
            >
                <el-carousel-item>
                    <CL21 ref="CL211" title="今日餐售" :dataSource="dataSource" countNUM="122"></CL21>
                </el-carousel-item>
                <el-carousel-item>
                    <CL21 ref="CL212" title="全年销售" :dataSource="dataSource" countNUM="56400"></CL21>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import MapTab from './components/MapTab.vue'
import CL21 from './CL21.vue';
import home from './service/home1.js';
export default {
    // 组件
    components: {
        MapTab, CL21
    },
    // 数据仓库
    data() {
        return {
            loopAuto: true,
            loop: null,
            chartTab: 0,
            carouselHeight: "200px",
            yearData: {},
            dayData: {},
            dataSource: {},
            tabData: [{ text: '今日销售收入' }, { text: '全年总销售收入' }],
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
        this.carouselHeight = this.$refs.CL2.offsetHeight + "px";
        this.$nextTick(() => {
            this.$refs.CL211.initDefaultSize();
            this.$refs.CL212.initDefaultSize();
        })
        this.autoChange();
    },
    // 方法
    methods: {
        CL2MouseEnter() {
            this.loopFlag = false;
            if (this.loop) {
                clearTimeout(this.loop)
            }
        },
        CL2MouseLeave() {
            this.loopFlag = true;
            this.autoChange();
        },
        autoChange() {
            if (this.loop) {
                clearTimeout(this.loop)
            }
            this.loop = setTimeout(() => {
                this.chartTab = Number(this.chartTab) + 1;
                if (this.chartTab >= this.tabData.length) {
                    this.chartTab = 0;
                }
                if (this.$refs.chartMapTab) {
                    this.$refs.chartMapTab.setActiveItem(this.chartTab);
                }
                if (this.$refs.myCarousel) {
                    this.$refs.myCarousel.setActiveItem(this.chartTab);
                }
                this.mapTabSelect(this.tabData[this.chartTab]);
                this.autoChange();
            }, 10000);
        },
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {

        },
        mapTabSelect(item) {
            if (item.text === "今日销售收入") {
                if (this.$refs.myCarousel) {
                    this.$refs.myCarousel.setActiveItem(0);
                }
                this.dataSource = this.dayData;
            } else {
                this.$refs.myCarousel.setActiveItem(1);
                this.dataSource = this.yearData;
            }
        },
        getDataList() {
            let t = this
            home.getCL2({
                s: [this.oname]
            }).then((r) => {
                if (r) {
                    var year = r.YEAR;
                    for (var i in year) {
                        year[i] = this.initNumberW(year[i]);
                    }
                    this.yearData = year;
                    this.dayData = r.DAY;
                    console.log("餐售情况", r);
                    this.mapTabSelect(this.tabData[0]);
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '餐售情况',
                    message: '获取餐售情况异常'
                })
            })
        },
        initNumberW(num) {
            var rs = num;
            if (rs) {
                rs = (rs / 10000).toFixed(0);
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
    padding: 10px;
    padding-top: 5px;
}
.main_btn {
    width: 100%;
    /* height: 50px; */
    height: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.csphTop {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #aec0f2;
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
    height: 54px;
    width: 100%;
    margin-top: 20px;
    padding: 2px 5px;
    min-height: 54px;
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
    top: 7px;
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
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
