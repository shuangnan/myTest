<!--
 * @created：
 * @author：
 * @version:	v1.0
 * @desc:		标签页
 -->
<template>
    <div class="temp">
        <div style="width:100%;height:27px;display:flex">
            <div class="brbtn_bottom brbtn_bottom_grow"></div>
            <div
                v-for="(item,index) in tabsList"
                :key="index"
                class="brBtn_textBox brbtn_bottom"
                :class="{'brBtn_select':item.id==selectType}"
                @click="titleClick(item)"
                @dblclick="titleDblClick(item)"
            >
                <div class="brbtn_centerTop" v-html="item.text" :style="{minWidth:itemWidth}"></div>
            </div>
            <div class="brbtn_bottom brbtn_bottom_grow"></div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
// import InterFace from "../../service/index.js";
export default {
    // 组件
    components: {},
    // 数据仓库
    data() {
        return {
            selectType: "",
        }
    },
    // 属性
    props: {
        tabsList: {
            type: Array,
            required: true,
            default: () => { return [] }//{id:"1",text:""}
        },
        itemWidth: {
            type: String,
            // default: "110px"
            default: 'auto'
        }
    },
    // 组件挂载完毕
    mounted() {
        this.selectType = this.tabsList[0].id;
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        titleClick(item) {
            this.selectType = item.id;
            this.$nextTick(() => {
                this.$emit("titleClick", item);
            })
        },
        titleDblClick(item){
            this.$emit("titleDblclick", item);
        },
        setActiveItem(id) {
            this.selectType = id;
        }

        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
    },
    // 监视属性
    watch: {},
    // 计算属性
    computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.temp {
    width: 100%;
    height: 100%;
}
.brbtn_bottom {
    border-bottom: 2px solid #38333a;
    height: 100%;
}
.brbtn_bottom_grow {
    flex-grow: 1;
}
.brbtn_centerTop {
    margin: 0 12px;
    /* min-width: 110px; */
    padding: 0 3px;
    height: 100%;
    border-top: 2px solid #38333a;
    position: relative;
    font-size: 14px;
    color: #d0c5e3;
    text-align: center;
    line-height: 25px;
}
.brbtn_centerTop::before {
    content: "";
    width: 30px;
    height: 2px;
    background: #38333a;
    transform: rotate(-60deg);
    position: absolute;
    left: -21px;
    top: 10px;
    z-index: 1;
}
.brbtn_centerTop::after {
    content: "";
    width: 30px;
    height: 2px;
    background: #38333a;
    transform: rotate(60deg);
    position: absolute;
    right: -21px;
    top: 10px;
    z-index: 1;
}
.brBtn_textBox {
    margin-right: -5px;
    margin-left: -5px;
    cursor: pointer;
}
.brBtn_select {
    border-bottom: none;
    text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
    position: relative;
}
.brBtn_select > div {
    background: rgb(7, 14, 52);
}
.brBtn_select::before {
    content: "";
    height: 0;
    width: 0px;
    position: absolute;
    left: 0px;
    top: 2px;
    border-bottom: 25px solid rgb(7, 14, 52);
    border-left: 14px solid transparent;
    z-index: 2;
}
.brBtn_select::after {
    content: "";
    height: 0;
    width: 0px;
    position: absolute;
    right: 0px;
    top: 2px;
    border-bottom: 25px solid rgb(7, 14, 52);
    border-right: 14px solid transparent;
    z-index: 2;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
