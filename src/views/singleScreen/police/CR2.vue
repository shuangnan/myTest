<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div class="main" ref="CR2">
        <el-carousel indicator-position :height="carouselHeight" :autoplay="true" :interval="6000">
            <el-carousel-item v-for="(item,index) in dataList" :key="index">
                <pCard :data-source="item"></pCard>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
// 这里引用各种资源
// import pCard from "./components/PhoneCard.vue";
import pCard from "../kyd/components/PhoneCard1.vue";
import home from '../kyd/service/home1.js';
export default {
    // 组件
    components: { pCard },
    // 数据仓库
    data() {
        return {
            data_xy: [],
            carouselHeight: "200px",
            dataList: [],
            dataListAll: [],
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
        this.carouselHeight = this.$refs.CR2.offsetHeight - 20 + "px";
        const d1 = [];
        for (let i = 0; i < 4; i++) {
            d1.push({
                name: i + 1,
                value: "成都" + i
            });
        }
        this.data_xy = d1;
        setInterval(() => {
            this.filterDataList();
        }, 1000 * 3600);
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
            var t = this;
            home.getCZInfo({
                s: [[this.oname],[this.oname]],
            }).then(r => {
                if (r) {
                    var rs = r[1];
                    this.dataListAll = r[1];
                    console.log("车长信息kydp_zxy2030", r);
                    this.$nextTick(() => {
                        this.filterDataList();
                    });
                    this.$emit("setCZDataList",[r[1],r[2]])
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '车长信息',
                    message: '获取车长信息异常'
                })
            })
        },
        filterDataList() {
            var dataList = [];
            var nowTime = new Date();
            var stime = nowTime.getTime() - 1000 * 60 * 30;
            var etime = nowTime.getTime() + 1000 * 60 * 90;
            dataList = this.dataListAll.filter(v => {
                var flag = false;
                if (v.START_DATE) {
                    var times = new Date(v.START_DATE).getTime();
                    if (times > stime && times < etime) {
                        flag = true;
                    }
                }
                if (v.END_DATE) {
                    var times = new Date(v.END_DATE).getTime();
                    if (times > stime && times < etime) {
                        flag = true;
                    }
                }
                return flag;
            })
            this.initDataList(dataList);
        },
        initDataList(dataList) {
            this.dataList = [];
            var itemList = [];
            dataList.forEach((v, i) => {
                itemList.push(v);
                if (itemList.length == 3) {
                    this.dataList.push(JSON.parse(JSON.stringify(itemList)));
                    itemList = [];
                } else if (i == (dataList.length - 1)) {
                    this.dataList.push(JSON.parse(JSON.stringify(itemList)));
                    itemList = [];
                }
            })
            console.log("车长信息显示", this.dataList);
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
    padding: 20px;
}
>>> .el-carousel__button {
    width: 5px;
}
>>> .el-carousel__indicators--horizontal {
    width: 70%;
    text-align: center;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
