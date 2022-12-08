<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div class="main">
        <div ref="CL1Item" class="CL1_Item shadow-txt">
            <div class="item1" :style="{top:top1+'px',left:left1+'%'}">
                <span style="font-weight:bold;">全程旅客量 </span>
                <span class="textC1" style="font-size:24px">{{dataItem.KLK}}</span> 万次
            </div>
            <div class="item2" :style="{top:top2+'px',left:left2+'%'}">
                动车旅客量
                <span style="font-size:24px" class="textC2">{{dataItem.DCLKL}}</span> 万次
            </div>
            <div class="item3" :style="{top:top3+'px',left:left3+'%'}">
                普车旅客量
                <span style="font-size:24px" class="textC3">{{dataItem.PCLKL}}</span> 万次
            </div>
        </div>
        <div style="width:100%;height:20px;"></div>
        <div class="CL1_Item shadow-txt">
            <div class="item1" :style="{top:top1+'px',left:left1+'%'}">
                <span style="font-weight:bold;">车补收入 </span>
                <span style="font-size:24px" class="textC1">{{dataItem.JRCBSR}}</span> 万
            </div>
            <div class="item2" :style="{top:top2+'px',left:left2+'%'}">
                今日动车收入
                <span style="font-size:24px" class="textC2">{{dataItem.JRDCSR}}</span> 万
            </div>
            <div class="item3" :style="{top:top3+'px',left:left3+'%'}">
                今日普车收入
                <span style="font-size:24px" class="textC3">{{dataItem.JRPKSR}}</span> 万
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import home from './service/home1.js';
export default {
    // 组件
    components: {},
    // 数据仓库
    data() {
        return {
            defaultH: 88,
            top1: "3",
            top2: "31",
            top3: "54",
            left1: "40",
            left2: "56",
            left3: "56",
            dataItem: {},
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
        var height = this.$refs.CL1Item.offsetHeight;
        var pie = height / this.defaultH;
        this.top1 = pie * this.top1;
        this.top2 = pie * this.top2;
        this.top3 = pie * this.top3;
        // this.left1 = pie * this.left1;
        // this.left2 = pie * this.left2;
        // this.left3 = pie * this.left3;
        if (this.left2 > 69) {
            this.left2 = "69";
        }
        if (this.left3 > 69) {
            this.left3 = "69";
        }
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
            let t = this
            home.getCL1({
                s: [[this.oname]],
            }).then((r) => {
                if (r) {
                    if (r[1] && r[1].length > 0) {
                        r[1][0].KLK=Number(r[1][0].PCLKL)+Number(r[1][0].DCLKL);
                        this.dataItem = r[1][0];
                        this.dataItem.KLK=this.initNumberW(this.dataItem.KLK);
                        this.dataItem.DCLKL=this.initNumberW(this.dataItem.DCLKL);
                        this.dataItem.PCLKL=this.initNumberW(this.dataItem.PCLKL);

                        console.log("生产日况", this.dataItem);
                    }else{
                        this.dataItem ={}
                    }

                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '生产日况',
                    message: '获取生产日况异常'
                })
            })
        },
        initNumberW(num){
            var rs=num;
            if(rs){
                rs=(rs/10000).toFixed(1);
            }
            return rs;

        },
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
    padding: 20px 10px;
    color: #c2ccf5;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.CL1_Item {
    height: calc(50% - 10px);
    width: 100%;
    position: relative;
    letter-spacing: 1px;
}
.main > div:nth-child(1) {
    background: url("./img1/CL1_1.png") no-repeat;
    background-size: auto 100%;
    max-height: 92px;
}
.main > div:nth-child(3) {
    background: url("./img1/CL1_2.png") no-repeat;
    background-size: auto 100%;
    max-height: 92px;
}
.item1 {
    position: absolute;
    left: 40%;
}
.item2 {
    position: absolute;
    left: 60%;
}
.item3 {
    position: absolute;
    left: 60%;
}
.textC1{
    color:#eeb715;
    font-weight: bold;
}
.textC2{
    color:#1594f6;
    font-weight: bold;
}
.textC3{
    color:#7bd220;
    font-weight: bold;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
