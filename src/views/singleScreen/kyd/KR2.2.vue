<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		班组考核
 -->
<template>
    <div class="main">
        <div
            style="height:40px;width:100%;line-height:40px;font-size:16px;color:#bad9de;font-weight:bold;"
        >{{dataType=='0'?'班组考核TOP8':'消耗排名'}}</div>
        <div style="width:100%;height:calc(100% - 40px);display:flex;flex-direction:column;justify-content:space-around;">
            <div class="KR22Item" v-for="(item,index) in dataList" :key="index">
                <krbar :title="item.CLASS_NAME" :NUM="Number(item.AMOUNT).toFixed(2)" :ALLNUM="k2Default" dwText="元"></krbar>
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import krbar from "./components/KR2bar.vue";
export default {
    // 组件
    components: {
        krbar
    },
    // 数据仓库
    data() {
        return {
            // dataList: [
            //     { name: '上海南10组', num: 6011.55, allnum: 7000 },
            //     { name: '重广10组', num: 5236, allnum: 7000 },
            //     { name: '环线5组', num: 4452, allnum: 7000 },
            //     { name: '上海南9组', num: 3251, allnum: 7000 },
            //     { name: '重广8组', num: 5784, allnum: 7000 },
            //     { name: '环线4组', num: 2359, allnum: 7000 },
            //     { name: '上海南10组', num: 6854, allnum: 7000 },
            //     { name: '重广7组', num: 4526, allnum: 7000 },
            // ]
        }
    },
    // 属性
    props: {
        dataList: {
            type: Array,
            default: () => { return [] }
        },
        k2Default: {
            type: Number,
            default: 0,
        },
        dataType:{
            type:String,
            default:"",
        },
        
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

        }
    },
    // 监视属性
    watch: {},
    // 计算属性
    computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.main {
    width: 100%;
    height: 100%;
    border-left: 1px solid #242947;
    padding-left: 15px !important;
}
.KR22Item {
    height: 14px;
    width: 100%;
}
.KR22Item + .KR22Item {
    /* margin-top: 17px; */
}

</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
