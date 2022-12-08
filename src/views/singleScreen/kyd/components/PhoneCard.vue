<!-- 
 * @created：	2021年4月27日
 * @author：	ch
 * @version:	v1.0
 * @desc:		电话卡片
 -->
<template>
    <ul class="card-list">
        <li v-for="(item,i) in dataSource" :key="i">
            <div class="head">
                <div>
                    <div class="cardItem" style="font-weight:bold;color:#59e9fa">{{item.CC}}</div>
                    <div class="cardItem" style="width:65%;">{{item.CLASS_NAME}}</div>
                </div>
            </div>
            <div class="content">
                <div class="content_item" style="color:#fff;">
					<div class="cardItem">{{item.STEWARD_NAME}}</div>
                    <div class="cardItem" style="width:65%;">{{item.PHONE}}</div>
				</div>
                <div class="content_item">
					<div class="cardItem">{{item.TEAM_NAME}}</div>
                    <div class="cardItem" style="width:65%;color:#59e9fa">{{item.DEPOT}}</div>
				</div>
            </div>
        </li>
    </ul>
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
        }
    },
    // 属性
    props: {
        dataSource: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    // 组件挂载完毕
    mounted() {
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/

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
.card-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
	font-size: 12px;
}
.card-list > li {
    display: inline-block;
    vertical-align: top;
    margin: 10px;
    width: 172px;
    height: 80px;
    padding: 1px;
    background: url(./img/phone-card.png);
    background-size: 100% 100%;
}
.head {
    position: relative;
    color: #ffffff;
    background: #222c3c;
    font-size: 12px;
}
.head > div {
    background: #234271;
    width: 100%;
    line-height: 20px;
}
.head.empty > div {
    height: 8px;
    margin-bottom: 2px;
}

.content {
    color: #6093ee;
    text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
    padding-bottom: 5px;
	height:calc(100% - 20px);
	padding-top:5px;
}
.content.empty {
    line-height: 20px;
}
.content_item {
    width: 100%;
    height: 50%;
    display: flex;
}
.cardItem {
    display: inline-block;
    width: 35%;
    padding-left:12px;
}
</style>
