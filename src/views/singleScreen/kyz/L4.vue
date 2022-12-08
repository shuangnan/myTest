<template>
    <div class="L4_main">
        <div class="aj" @click="openDetail('A')">
            <div style="position:relative;display:inline-block;height:100%;">
                <img :src="require('./img/aj2.gif')" style="height:100%;" />
                <div class="L4NUM">
                    <div class="shadow-txt">安检</div>
                    <div class="L4NUM_CIR">{{wxpNum}}</div>
                </div>
            </div>
            <!-- <div class="shadow-txt l4_txt">安检</div> -->
        </div>
        <div class="bj" @click="openDetail('B')">
            <div style="position:relative;display:inline-block;height:100%;">
                <img :src="require('./img/bj2.gif')" style="height:100%;" />
                <div class="L4NUM">
                    <div class="shadow-txt">保洁</div>
                    <div class="L4NUM_CIR">90分</div>
                </div>
            </div>
            <!-- <div class="shadow-txt l4_txt">保洁</div> -->
        </div>
    </div>
</template>
<script>
import C from "../../../assets/com.js";
export default {
    data() {
        return {
            wxpNum: "0",
        }
    },
    props: {
        unitid: {
            type: String,
            default: "",
        },
    },
    mounted() {
        this.getData();
    },
    methods: {
        openDetail(type) {
            this.$emit("openDetail", type);
        },
        getData() {
            this.wxpNum = "0";
            var sdate = new Date().Format("yyyy-MM-01");
            var date = new Date().Format("yyyy-MM-dd");
            this.getWXPCD(sdate, date, rs => {
                if (rs[0]) {
                    this.wxpNum = rs[0].COUNT;
                }
                console.log("危险品查堵trdm_zjm_060", rs);
            })
        },
        getWXPCD(sdate, edate, callback) {
            C.getData({
                c: "trdm_zjm_060",
                s: [sdate, edate],
                o: [this.unitid.toUpperCase()],
                a: "【trdm_zjm_060】危险品查堵",
                async: true,
            }, (r) => {
                callback(r);
            })
        }
    },
    watch: {
        unitid() {
            this.getData();
        }
    },
}
</script>

<style scoped="scoped">
.L4_main {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 5px 0 30px;
}
.L4_main > div {
    width: 50%;
    height: 100%;
    text-align: center;
    position: relative;
}
/* .L4_main > .bj {
    background: url(img/bj2.gif) no-repeat;
    background-position: center;
    background-size: auto 100%;
    position: relative;
    cursor: pointer;
} */
/* .L4_main > .aj {
    background: url(img/aj2.gif) no-repeat;
    background-position: center;
    background-size: auto 100%;
    position: relative;
    cursor: pointer;
} */
.l4_txt {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -20px;
}
.L4NUM {
    position: absolute;
    top: 50%;
    right: 5px;
    color: rgba(238, 238, 238, 0.87);
    transform: translateY(-50%);
    width:50px;
    text-align: center;
}
.L4NUM>div:nth-child(1){
    letter-spacing: 2px;
    margin-bottom:7px
}
.L4NUM_CIR{
    height:37px;
    width:37px;
    border-radius: 100%;
    border:1px solid #67a2f2;
    box-shadow: 0px 0px 5px 5px #003ba8cc,0px 0px 5px 5px #003ba8cc inset;
    /* box-shadow: 0px 0px 10px #003ba8cc,0px 0px 10px #003ba8cc inset; */
    /* box-shadow: 0px 0px 10px red,0px 0px 10px red inset; */
    display:flex;
    align-items: center;
    justify-content: center;
    margin:0 auto;
}
</style>
