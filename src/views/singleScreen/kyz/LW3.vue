<!-- 
 * @created：	2021年7月27日
 * @author：	ch
 * @version:	v1.0
 * @desc:		生产管控-左翅膀3
 -->
<template>
    <div style="width: 100%;height: 100%;padding: 15px">
        <div class="top-info">
            <div class="leftBox" :class="{'log':sgRWList.length===0}">
                <div class="logItem" v-for="(item,i) in sgRWList" :key="i" :title="item.TASK_INFO1.ALL_INFO">
                    <span>{{item.STN_NAME}}</span>
                    <span>{{item.P_NUM}}</span>
                    <span>{{item.FINISH}}/{{item.ALL}}</span>
                </div>
            </div>
            <div class="content" style>
                <div class="info-item one">
                    <label>维修计划</label>
                    <span class="shadow-txt">0</span>
                </div>
                <div class="info-item two">
                    <label>监管施工计划</label>
                    <span class="shadow-txt">0</span>
                </div>
                <div class="info-item three">
                    <label>施工计划</label>
                    <span class="shadow-txt">{{threeData+twoData+oneData}}</span>
                    <div class="info-item2">
                        <div>
                            Ⅲ级
                            <div class="shadow-txt">{{threeData}}</div>
                        </div>
                        <div>
                            Ⅱ级
                            <div class="shadow-txt">{{twoData}}</div>
                        </div>
                        <div>
                            Ⅰ级
                            <div class="shadow-txt">{{oneData}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 这里引用各种资源
import C from "../../../assets/com.js";
export default {
    // 组件
    components: {},
    // 数据仓库
    data() {
        return {
            sgRWList: [],
            oneData:0,
            twoData:0,
            threeData:0,
        }
    },
    // 属性
    props: {
        unitid: {
            type: String,
            default: "",
        },
        stnCodeDic:{
          type:Array,
          default:()=>{return []}
        }
    },
    // 组件挂载完毕
    mounted() {
        //document.querySelector("title").innerHTML = "";//页面名称
        this.getData();
        //施工统计接口 kydp_zxy2057
        // sql[[施工位置]]
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/


        /* @info  数据处理区-----------------------------------*/


        /* @info  数据交互区-----------------------------------*/
        // 获取数据
        getData() {
            var sdate = new Date().Format("yyyy-MM-01");
            var edate = new Date().Format("yyyy-MM-dd");
            this.dataList = [];
            C.getData({
                c: "trdm_ys_487",
                s: [this.unitid.toUpperCase(), "", "", edate + " 00:00:00", edate + " 23:59:59"],
                a: "【trdm_ys_487】LW3施工任务数据",
                async: true,
            }, (r) => {
                if (r[0] != "false") {
                    var FINISHARRAY=JSON.parse(r.FINISHARRAY);
                    var UNFINISHARRAY = JSON.parse(r.UNFINISHARRAY);
                    var rwList=FINISHARRAY.concat(UNFINISHARRAY);
                    rwList.forEach(v => {
                        v.TASK_INFO1 = JSON.parse(v.TASK_INFO1);
                        v.USERLIST = JSON.parse(v.USERLIST);
                        v.STN_NAME="";
                        this.stnCodeDic.forEach(t=>{
                          if(t.STN_CODE==v.STN_CODE){
                            v.STN_NAME=t.STN_NAME;
                          }
                        })
                        
                    });
                    this.sgRWList = rwList;
                    console.log("【trdm_ys_487】LW3施工任务数据", r, JSON.parse(JSON.stringify(rwList)));

                } else {
                    this.sgRWList = []
                }
            })
            this.oneData=0;
            this.twoData=0;
            this.threeData=0;
            C.getDataP123({
                c: "kydp_zxy2057",
                s: [["成都"]],
                // s: [[1, "", "20220101", sdate, "成都"]],
                url: C.kydUrl,
                a: "施工统计kydp_zxy2057",
            }, (rs) => {
                var dataList=rs[1];
                dataList.forEach(v=>{
                  if(v.GRADE=="Ⅲ"){
                    this.threeData+=Number(v.NUM);
                  }
                  if(v.GRADE=="Ⅱ"){
                    this.twoData+=Number(v.NUM);
                  }
                  if(v.GRADE=="Ⅰ"){
                    this.oneData+=Number(v.NUM);
                  }
                })
                console.log("施工统计kydp_zxy2057", rs);
            })

        },
        upDataItem(item){
          this.sgRWList.forEach(v=>{
            v.USERLIST.forEach(p=>{
              p.forEach(t=>{
                if(t.PD_ID==item[0]){
                  v.FINISH=Number(v.FINISH)+1;
                }
              })
            })
          })
          console.log(JSON.parse(JSON.stringify(this.sgRWList)))
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
.top-info {
    position: relative;
    height: 100%;
    padding-left: 170px;
    padding-top: 5px;
    height: 100%;
}
.top-info > .leftBox {
    position: absolute;
    left: -15px;
    top: 50%;
    width: 186px;
    height: 100%;
    transform: translateY(-50%);
    padding:0 5px;
    overflow:auto;
}
.top-info > .log {
    background: url(./img/picLW31.gif) no-repeat;
    background-size: 100% 100%;
    width: 186px;
    height: 200px;
}
.logItem {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 35px;
    /* background: rgba(61, 116, 180, 0.2); */
    background: url('./img/lw31.png');
    background-size: 100% 100%;
    color:#77e6f2;
}
.logItem+.logItem{
  margin-top:10px;
}
.top-info > .content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.info-item {
    padding: 17px 35px;
    margin-bottom: 10px;
    height: 50px;
}

.info-item.one {
    background: url(img/picLW32.png) no-repeat;
    background-size: 100% 100%;
}

.info-item.two {
    background: url(img/picLW33.png) no-repeat;
    background-size: 100% 100%;
}

.info-item.three {
    height: 115px;
    background: url(img/picLW34.png) no-repeat;
    background-size: 100% 100%;
}

.info-item label {
    display: inline-block;
}

.info-item span {
    font-size: 28px;
    font-weight: bold;
    float: right;
    margin-top: -5px;
}

.info-item2 {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding-top: 25px;
}
.info-item2 > div > div {
    font-size: 16px;
    font-weight: bold;
    display:flex;
    justify-content: center;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
