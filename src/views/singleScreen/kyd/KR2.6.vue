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
        >备品报警</div>
        <div style="width:100%;height:calc(100% - 40px);display:flex;flex-direction:column;">
            <div class="KR22Item" v-for="(item,index) in dataList" :key="index">
                <div class="KR22ItemTiele" :title="item.MAT_NAME">{{item.MAT_NAME}}</div>
                <div style="width:calc(100% - 130px);height:100%;padding:0 5px;">
                    <div class="KR26Bar" :title="item.KC_QTY">
                        <div
                            style="height:100%;border-radius:10px;"
                            :style="{backgroundColor:item.bgColor,width:item.kcPie+'%'}"
                        ></div>
                        <div
                            style="height:100%;background:red;width:1px"
                            :style="{left:'calc('+item.lowPie+'% - 1px)'}"
                        ></div>
                        <div
                            style="height:100%;background:red;width:1px"
                            :style="{left:'calc('+item.hiPie+'% - 1px)'}"
                        ></div>
                        <!-- <div style="height:100%;width:100%;" class="KR22ItemText">{{item.KC_QTY}}</div> -->
                    </div>
                </div>
                <div style="width:60px;height:100%;color:rgba(255,255,255,0.5);">
                    {{item.KC_QTY}}
                </div>
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
    height: 30px;
    width: 100%;
    display: flex;
    font-size: 12px;
    align-items: center;
}
.KR22Item > div {
    display: flex;
    align-items: center;
}
.KR22Item + .KR22Item {
    margin-top: 7px;
}
.KR26Bar {
    width: 100%;
    height: 14px;;
    position: relative;
    border-radius: 10px;
    background-color: #192f4b;
    overflow: hidden;
}
.KR26Bar > div {
    position: absolute;
}
.KR22ItemText {
    font-size: 12px;
    color: #070d2d;
    text-shadow: 0 0 10px #fff;
    left: 5px;
}
.KR22ItemTiele {
    text-align: left;
    width: 70px;
    height: 100%;
    /* overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    height:100%;
    /* display:inline-block !important; */
    display:flex;
    align-items: center;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
