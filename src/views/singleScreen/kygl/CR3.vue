<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div ref="con" class="main">
        <div class="main_item" style="margin-left:10px;" @click="setDataList('D')">
            <div class="main_item_box main_item_D">
                <span class="shadow-txt" style="font-size:30px;font-weight:bold;color:rgb(0,255,255)">{{DCList.length}}</span>
            </div>
            <div class="shadow-txt" style="margin-top:-20px;">动车数量</div>
        </div>
        <div class="main_item" style="margin-left:-20px;" @click="setDataList('P')">
            <div class="main_item_box main_item_P">
                <span class="shadow-txt" style="font-size:30px;font-weight:bold;color:rgb(76,253,164)">{{PCList.length}}</span>
            </div>
            <div class="shadow-txt" style="margin-top:-20px;">普车数量</div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import home from '../kyd/service/home1.js';
export default {
    // 组件
    components: {
    },
    // 数据仓库
    data() {
        return {
            DCList: [],
            PCList: [],
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

    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        stopInterval() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        },
        setInterval() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            // this.interval = setInterval(() => {
            // 	const targetData = this.curItem.text==="保洁打分"?this.dataSource[1]:this.dataSource[0];
            // 	this.$refs.mapTab.selectItem(targetData);
            // },3000);
        },
        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getDataList() {
            this.getDataDPC();
        },
        setDataList(type){
            var list=[];
            if(type=="D"){
                list=this.DCList;
            }else if(type=="P"){
                list=this.PCList;
            }
            this.$emit("setTrainDataList",list);
        },
        getDataDPC() {
            let t = this;
            this.DCList=[];
            this.PCList=[];
            home.getTrainNum({
                s: [[this.oname]]
            }).then((r) => {
                console.log("动普车数量kydp_zxy2064", JSON.parse(JSON.stringify(r)));
                if (r) {
                    r[1].forEach(v => {
                        v.text5=new Date(v.START_DATE).Format("MM-dd hh:mm");
                        v.text6=new Date(v.END_DATE).Format("MM-dd hh:mm");
                        if (v.TRAIN_LEVEL == "P") {
                            this.PCList.push(v);
                        } else if (v.TRAIN_LEVEL == "D") {
                            this.DCList.push(v);
                        }
                    })
                } else {
                    this.$message('接口错误')
                }
            }, error => {
                t.$notify.error({
                    title: '动普车数量',
                    message: '获取动普车数量收异常'
                })
            })
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
    display: flex;
}
.main_item {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.main_item_box {
    margin-top: -20px;
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.main_item_D {
    background-image: url("./img/CR3_D.gif");
}
.main_item_P {
    background-image: url("./img/CR3_P.gif");
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
