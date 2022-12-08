<!--
	在站箱情况
	@author djm
	@time 2020年6月4日18:17:54
-->
<template>
    <div id="LW2TJ" ref="chart" style="width:100%;height:100%" @click="LW2Click()">
        <kygzsbblPie ref="LW2pie" :dataList="dataList"></kygzsbblPie>
    </div>
</template>

<script>
import kygzsbblPie from "./kygzsbblPie";
import C from "../../../assets/com.js";
export default {
    data() {
        return {
            colorList: ["rgb(31,171,232)", "rgb(14,106,147)", "rgb(31,67,83)", "rgb(25,42,58)", "rgb(0,255,255)",
                "rgb(247,161,148)", "rgb(172,80,67)", "rgb(109,35,24)", "rgb(74,29,23)", "rgb(248,204,201)"],
            dataList: [
                { name: "安检系统", value: "120" }, { name: "客票系统", value: "80" }, { name: "旅服系统", value: "67" },
                { name: "电梯系统", value: "23" }, { name: "暖通系统", value: "86" }, { name: "上水设施", value: "45" },
                { name: "机电系统", value: "102" }, { name: "保洁设备", value: "89" }, { name: "站台客运设施", value: "56" },
                { name: "其他设备设置", value: "54" }, { name: "巡视系统", value: "38" }, { name: "行包设备", value: "62" },
                { name: "吸污设施", value: "43" },
            ],
        }
    },
    props: {
        unitid: {
            type: String,
            default: "",
        }
    },
    // 组件挂载完毕
    mounted() {
        this.getDataList();
    },
    created() {

    },
    // 方法
    methods: {
        LW2Click() {
            this.$emit("openDetail");
        },
        getDataList() {
            var sdate = new Date().Format("yyyy-MM-01");
            var edate = new Date().Format("yyyy-MM-dd");
            this.dataList = [];
            C.getData({
                c: "trdm_ys_339",
                s: [sdate, edate],
                o: [this.unitid.toUpperCase()],
                a: "【trdm_ys_339】LW2设备统计数据",
                async: true,
            }, (r) => {
                r.forEach(v => {
                    v.name = v.KIND_NAME;
                    v.value = v.ALL_COUNT;
                });
                this.dataList = r;
                this.$nextTick(() => {
                    this.$refs.LW2pie.initCharts();
                })
                console.log("【trdm_ys_339】LW2设备统计数据", r, this.$refs.LW2pie);
            })
        }
    },
    // 监视属性
    watch: {
        unitid() {
            this.getDataList();
        }
    },
    // 计算属性
    computed: {},
    // 组件
    components: {
        kygzsbblPie
    },
}
</script>

<style scoped>
</style>
