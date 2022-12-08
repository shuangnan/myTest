
<template>
    <div style="width:100%;height:100%;display:flex;align-items:center;font-size:12px;">
        <div style="height:100%;" :style="{width:'calc(100% - '+rightWidth+'px)'}" :title="NUM">
            <div class="kr2barItem warning" :style="{width:NUM/ALLNUM*100+'%'}"></div>
        </div>
        <div :style="{width:rightWidth+'px'}" style="text-align:right;">{{title}}
            <div class="pieNum">{{NUM}}<span>{{dwText}}</span></div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
        }
    },
    props: {
        title: {
            type: String,
            required: true
        },
        rightWidth: {
            type: String,
            default: "160"
        },
        ALLNUM: {
            type: Number,
            default: 0
        },
        NUM: {
            type: String|Number,
            default: "0"
        },
        dwText:{
            type:String,
            default:"",
        }
    },
    // 组件挂载完毕
    mounted() {
    },
    // 方法
    methods: {
        /**-------------------------响应事件-------------------------------*/
        /**-------------------------数据展示-------------------------------*/
        /**-------------------------获取数据-------------------------------*/
    },
    // 监视属性
    watch: {
    },
    // 计算属性
    computed: {

    },
    // 组件
    components: {
    },
}
</script>

<style scoped>
.kr2barItem {
    height: 100%;
    background: rgb(106, 203, 248);
    text-align: right;
    color: #272625;
    padding-right: 5px;
    font-size: 12px;
    font-weight: bold;
}
.warning {
    position: relative;
    background-color: #4db1df;
    border: 1px solid #4db1df;
    border-radius: 10px;
    box-shadow: 1px 3px 10px rgba(106, 203, 248, 0.8);
    background-size: 3em 3em;
    background-image: linear-gradient(
        -45deg,
        transparent 0em,
        transparent 0.8em,
        #3d9ecb 0.9em,
        #3d9ecb 2.1em,
        transparent 2.1em,
        transparent 2.9em,
        #3d9ecb 3.1em
    );
    -webkit-animation: warning-animation 750ms infinite linear;
    -moz-animation: warning-animation 750ms infinite linear;
    animation: warning-animation 750ms infinite linear;
}

@-webkit-keyframes warning-animation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 3em 0;
    }
}

@-moz-keyframes warning-animation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 3em 0;
    }
}

@keyframes warning-animation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 3em 0;
    }
}

.warning:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    border-radius: 10px;
    background-image: linear-gradient(
        to bottom,
        #6acbf8,
        rgba(106, 203, 248, 0.6) 15%,
        transparent 60%,
        #6acbf8
    );
}
.pieNum{
    display:inline-block;
    vertical-align: middle;
    border:1px solid #6acbf8;
    border-radius: 10px;
    padding:1px 3px;
}
</style>