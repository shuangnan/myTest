<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		
 -->
<template>
    <div ref="con" class="main">
        <div style="text-align: right;">
            <MapTab
                ref="mapTab"
                :dataSource="TabdataSource"
                type="3"
                @select="mapTabSelect"
                style="width:180px;margin-bottom: 5px;margin-top: 5px;"
            ></MapTab>
        </div>
        <el-carousel
            ref="myCarousel"
            indicator-position="none"
            direction="vertical"
            :height="carouselHeight"
            arrow="never"
            :autoplay="false"
            :interval="6000"
        >
            <el-carousel-item v-for="item in dataSource" :key="item.text">
                <div class="card" style="height:calc(100% - 40px);">
                    <el-carousel
                        indicator-position="outside"
                        :height="carouselHeight2"
                        arrow="never"
                        :autoplay="true"
                        :interval="5000"
                    >
                        <template>
                            <el-carousel-item v-for="(c,index) in dataSource" :key="index">
                                <template v-for="(d,i) in c">
                                    <table
                                        class="table-list"
                                        :class="{'no-border':i===2}"
                                        style="width: 100%;"
										:key="i"
                                    >
                                        <tbody>
                                            <tr>
                                                <td>{{d.CC}}</td>
                                                <td rowspan="2" style="text-align: center;">
                                                    <span class="late">晚点{{d.DFD_FLAG=='2'?d.FZWD:d.DZWD}}min</span>
                                                </td>
                                                <td style="text-align: right;">{{d.CFSJ}}</td>
                                                <td>
                                                    <span class="cfdd">▲</span>出发
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{{d.START_STN}}-{{d.END_STN}}</td>
                                                <td style="text-align: right;">{{d.DDSJ}}</td>
                                                <td>
                                                    <span class="cfdd">▲</span>到达
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </template>
                            </el-carousel-item>
                        </template>
                    </el-carousel>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
// 这里引用各种资源
import MapTab from './components/MapTab.vue';
import home from './service/home1.js';
export default {
    // 组件
    components: {
        MapTab
    },
    // 数据仓库
    data() {
        return {
            carouselHeight: "200px",
            carouselHeight2: "200px",
            curItem: {},
            TabdataSource: [{
                text: '高铁',
                value: "0",
            }, {
                text: '普速',
                value: "1",
            }, {
                text: '动车',
                value: "2",
            }],
            interval: null,
            dataIndex: 0,
            gtDataList: [],
            psDataList: [],
            dcDataList: [],
            dataSource: [],
            station: "",
            dataType: "0",
            dicStation: [],
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
        const h = this.$refs.con.offsetHeight;
        this.carouselHeight = h - 28 + "px";
        this.carouselHeight2 = h - 78 + "px";
        this.curItem = this.TabdataSource[0];
        setInterval(() => {
            this.getDataList();
        }, 1000*60*30);
    },
    // 方法
    methods: {
        /* @info  事件处理区-----------------------------------*/
        mapTabSelect(item) {
            this.curItem = item;
            this.dataType = item.value;
            if (item.text === "高铁") {
				this.$refs.myCarousel.setActiveItem(0);
				this.dataSource=this.gtDataList;
            } else if (item.text === "普速") {
				this.$refs.myCarousel.setActiveItem(1);
				this.dataSource=this.psDataList;
            } else {
				this.$refs.myCarousel.setActiveItem(2);
				this.dataSource=this.dcDataList;
            }
        },
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
        getData() {

        },
        getDataList() {
            this.getZwd();
        },
        getZwd() {
            let t = this
            t.datasource = [];
            t.dcDataList = [];
            t.gtDataList = [];
            t.psDataList = [];
            home.getZWDInfo({
                s: [[this.oname], [t.oname]]
            }).then((r) => {
                if (r) {
                    r["1"].forEach(v => {
                        if (v.CC.includes("D")) {
                            t.dcDataList.push(v);
                        } else {
                            t.gtDataList.push(v);
                        }
                    })
                    t.psDataList = r["2"];
                    t.psDataList=this.initDataList(t.psDataList);
					t.dcDataList=this.initDataList(t.dcDataList);
                    t.gtDataList=this.initDataList(t.gtDataList);
                    t.mapTabSelect(t.TabdataSource[0]);
                    console.log("正晚点数据",r);
                } else {
                    this.$message('接口错误')
                }
                t.loading = false
            }, error => {
                t.loading = false
                t.$notify.error({
                    title: '正晚点列车',
                    message: '获取正晚点列车异常'
                })
            })
        },
        initDataList(dataList) {
            var itemList = [];
            dataList.forEach((v, i) => {
                if (i < 30) {
                    itemList.push(v);
                }
            });
			var tempList = [];
			var rs=[];
            itemList.forEach((v,i) => {
                tempList.push(v);
                if (tempList.length == 3) {
                    rs.push(JSON.parse(JSON.stringify(tempList)));
                    tempList = [];
                }else if(i==(itemList.length-1)){
                    rs.push(JSON.parse(JSON.stringify(tempList)));
                    tempList = [];
                }
			})
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
    padding: 0 20px;
}

.card {
    width: 100%;
    padding: 10px;
    background: rgba(13, 23, 55, 0.6);
    border: 1px solid #151d33;
    border-radius: 5px;
}

.table-list {
    font-size: 12px;
    border-bottom: 1px solid #2f3957;
}
.table-list.no-border {
    border-bottom: none;
}
.table-list td {
    padding: 4px;
}
.late {
    display: inline-block;
    vertical-align: middle;
    line-height: 40px;
    height: 30px;
    text-indent: 40px;
    color: #ea2222;
    background: url(img1/CR3_late.png) no-repeat;
    margin-top: -10px;
}
.cfdd {
    display: inline-block;
    color: #05d1cb;
    transform: rotate(-90deg);
}
>>> .el-carousel__button {
  width: 15px;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
