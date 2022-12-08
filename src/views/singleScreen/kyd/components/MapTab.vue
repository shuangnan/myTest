<!-- 
 * @created：	2021年11月1日
 * @author：	ch
 * @version:	v1.0
 * @desc:		地图tab切换组件
 -->
<template>
    <div ref="tabCon" class="tab-list" :class="'cls'+type">
        <template v-for="item in dataSource">
            <div
                :style="{width:itemWidth}"
                :class="{active:curItem.text===item.text,'shadow-txt':curItem.text===item.text}"
                @click="selectItem(item)"
            >{{item.text}}</div>
        </template>
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
            curItem: {},
            itemWidth: "50%"
        }
    },
    // 属性
    props: {
        type: {
            type: String,
            default: "1"
        },
        dataSource: {
            type: Array,
            default: function () {
                return [];
            }
		},
		defaultTabIndex:{
			type: String,
            default: ""
		}
    },
    // 组件挂载完毕
    mounted() {
		this.curItem = this.dataSource[0];
		if(this.defaultTabIndex){
			this.curItem = this.dataSource[this.defaultTabIndex];
		}
        this.itemWidth = 100 / this.dataSource.length + '%';
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        selectItem(item) {
            this.curItem = item;
            this.$emit("select", item);
        },

        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {

        },
        setActiveItem(index) {
            this.curItem = this.dataSource[index];
        }
    },
    // 监视属性
    watch: {
		defaultTabIndex(){
			this.curItem = this.dataSource[this.defaultTabIndex];
		}
	},
    // 计算属性
    computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.tab-list {
    position: relative;
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 1px;
    border-radius: 3px;
}
.tab-list > div {
    display: inline-block;
    cursor: pointer;
}

.tab-list.cls1 {
    color: #b5adc9;
    border: 1px solid #0f2280;
}
.tab-list.cls1 > div {
    padding: 3px;
}
.tab-list.cls1 > div.active {
    background: #0f2280;
}

.tab-list.cls2 {
    color: #bad9de;
    border: 1px solid #20448e;
}
.tab-list.cls2 > div {
    padding: 3px;
}
.tab-list.cls2 > div.active {
    background: #20448e;
}

.tab-list.cls3 {
    background: #091549;
    border: 1px solid transparent;
}
.tab-list.cls3 > div {
    padding: 3px;
}
.tab-list.cls3 > div.active {
    background: #0f2280;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
