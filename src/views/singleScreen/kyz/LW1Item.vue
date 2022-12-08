<!-- 
 * @created：	2021年3月8日
 * @author：	CH
 * @version:	v1.0
 * @desc:		人员安排
 -->
<template>
    <div style="width:100%;height:100%;display:flex;background:rgba(61,116,180,0.2)">
        <div class="itemTitle">{{title}}</div>
        <div class="itemNum" style="height:100%;width:80px;">
            <div>{{title1}}</div>
            <div style="font-size:18px;color:#00e5ff;font-weight:bold;">{{num}}</div>
        </div>
        <div style="width:calc(50% - 80px);height:100%;display:flex">
            <!-- 旅客发送人数占比（始发车） -->
            <LW1PIE ref="LW1PIErf1" :dataList="dataListF"></LW1PIE>
        </div>
        <div class="itemNum" style="height:100%;width:80px;">
            <div>{{title2}}</div>
            <div style="font-size:18px;color:#00e5ff;font-weight:bold;">{{numD}}</div>
        </div>
        <div style="width:calc(50% - 80px);height:100%;display:flex">
            <!-- 旅客发送人数占比（始发车） -->
            <LW1PIE ref="LW1PIErf2" :dataList="dataListD"></LW1PIE>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import LW1PIE from "./LW1Pie.vue";
export default {
    // 组件
    components: { LW1PIE },
    // 数据仓库
    data() {
        return {

        }
    },
    // 属性
    props: {
        title: {
            type: String,
            default: "",
        },
        title1: {
            type: String,
            default: "",
        },
        title2: {
            type: String,
            default: "",
        },
        num: {
            type: String | Number,
            default: "",
        },
        numD: {
            type: String | Number,
            default: "",
        },
        dataListF: {
            type: Array,
            default: () => { return [] },
        },
        dataListD: {
            type: Array,
            default: () => { return [] },
        },
    },
    // 组件挂载完毕
    mounted() {
        // document.querySelector("title").innerHTML = "页面名称";
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/
        initChartDatda() {
            this.$refs.LW1PIErf1.initCharts();
            this.$refs.LW1PIErf2.initCharts();
        },

        /* @info  数据交互区-----------------------------------*/
        // 获取数据

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
.itemTitle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    background-color: rgba(61, 116, 180, 0.5);
    width: 24px;
    padding:6px;
    font-size:12px;
    color:#dbe2e4;
}
.itemNum{
    display:flex;
    flex-direction: column;
    justify-content: center;
    padding-left:10px;
    font-size:12px;
    color:#dbe2e4;
}
.itemNum>div{
    padding:3px 0;
}
.itemTypeText{
    display:flex;
    justify-content: center;
    align-items:center;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
