<!-- 
 * @created：	2021年4月27日
 * @author：	ch
 * @version:	v1.0
 * @desc:		电话卡片
 -->
<template>
    <ul class="card-list">
        <li v-for="(item,i) in dataSource" :key="i">
            <table style="width:100%;height:100%;" class="pcTab">
                <tr>
                    <td
                        class="textC"
                        style="height:28px;background:#1b396f;font-weight:bold;"
                    >{{item.CC}}</td>
                </tr>
                <tr>
                    <td class="pcTab_xx">
                        <div class="pcTab_spac">
                            <div>{{item.CLASS_NAME}}</div>
                            <div>{{item.TEAM_NAME}}</div>
                            <div>{{item.DEPOT}}</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="pcTab_spac">
                            <div>{{item.PHONE}}</div>
                            <div>{{item.STEWARD_NAME}}</div>
                        </div>
                    </td>
                </tr>
            </table>
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
    display: flex;
    justify-content: space-around;
    padding-bottom: 40px;
}
.card-list > li {
    margin: 10px;
    width: 120px;
    height: 100%;
    padding: 1px;
    background: url(./img/phone-card1.png);
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
    height: calc(100% - 20px);
    padding-top: 5px;
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
    padding-left: 12px;
}
.flexCenter {
    display: flex;
    justify-content: center;
    align-items: center;
}
.textC {
    color: #59e9fa;
}
.pcTab {
    border-collapse: collapse;
    text-align: center;
}
.pcTab_xx {
    border-bottom: 1px dotted #2477f5;
}
.pcTab_spac {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height:100%;
    width:100%;
    padding:8px 0;
}
</style>
