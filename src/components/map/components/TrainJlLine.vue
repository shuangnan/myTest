<template>
    <div style="height: 100%; width: 100%" id="container">
        <span v-if="jl.length === 0">暂无交路数据</span>
        <v-stage
            v-else
            :config="lineCanvas.config"
            @mousedown="enableScroll"
            @mousemove="scroll"
            @mouseup="disableScroll"
        >
            <v-layer :config="lineCanvas.config" ref="line">
                <v-rect :config="lineCanvas.rail"></v-rect>
                <v-group v-for="stn in lineCanvas.stns" :key="stn.SEQ">
                    <v-text :ref="'stnName' + stn.SEQ" :config="stn.stnName"></v-text>
                    <v-text :ref="'stnTime' + stn.SEQ" :config="stn.stnTime"></v-text>
                    <v-image :ref="'stnIcon' + stn.SEQ" :config="stn.stnIcon"></v-image>
                </v-group>
                <v-group v-for="train in lineCanvas.trains" :key="train.SEQ">
                    <v-text :ref="'trainStnDash' + train.SEQ" :config="train.trainStnDash"></v-text>
                    <!-- <v-text
						:ref="'trainTime' + train.SEQ"
						:config="train.trainTime"
                    ></v-text>-->
                    <v-image :ref="'trainIcon' + train.SEQ" :config="train.trainIcon"></v-image>
                    <v-text :ref="'trainName' + train.SEQ" :config="train.trainName"></v-text>
                    <v-text :ref="'depStn' + train.SEQ" :config="train.depStn"></v-text>
                    <v-text :ref="'arrStn' + train.SEQ" :config="train.arrStn"></v-text>
                    <v-text :ref="'timeDash' + train.SEQ" :config="train.timeDash"></v-text>
                    <v-text :ref="'depTime' + train.SEQ" :config="train.depTime"></v-text>
                    <v-text :ref="'arrTime' + train.SEQ" :config="train.arrTime"></v-text>
                    <v-text :ref="'depOverDay' + train.SEQ" :config="train.depOverDay"></v-text>
                    <v-text :ref="'arrOverDay' + train.SEQ" :config="train.arrOverDay"></v-text>
                </v-group>
            </v-layer>
        </v-stage>
    </div>
</template>

<script>
import com from "../../../assets/com.js";
export default {
    data() {
        return {
            jl: [
                {
                    TYPE: "STN",
                    STN_NAME: "A站",
                    ARRIVE_TIME: "",
                    DEPARTURE_TIME: "00:00",
                    SEQ: "1",
                },
                {
                    TYPE: "TRAIN",
                    CC: "G1",
                    ARRIVE_STN: "B站",
                    DEPARTURE_STN: "A站",
                    ARRIVE_TIME: "01:00",
                    DEPARTURE_TIME: "00:00",
                    SEQ: "2",
                },
                {
                    TYPE: "STN",
                    STN_NAME: "B站",
                    ARRIVE_TIME: "01:00",
                    DEPARTURE_TIME: "",
                    SEQ: "3",
                },
                {
                    TYPE: "STN",
                    STN_NAME: "C站",
                    ARRIVE_TIME: "",
                    DEPARTURE_TIME: "01:30",
                    SEQ: "4",
                },
                {
                    TYPE: "TRAIN",
                    CC: "G2",
                    ARRIVE_STN: "D站",
                    DEPARTURE_STN: "C站",
                    ARRIVE_TIME: "02:30",
                    DEPARTURE_TIME: "01:30",
                    SEQ: "5",
                },
                {
                    TYPE: "STN",
                    STN_NAME: "D站",
                    ARRIVE_TIME: "02:30",
                    DEPARTURE_TIME: "03:00",
                    SEQ: "6",
                },
                {
                    TYPE: "TRAIN",
                    CC: "G3",
                    ARRIVE_STN: "E站",
                    DEPARTURE_STN: "D站",
                    ARRIVE_TIME: "04:00",
                    DEPARTURE_TIME: "03:00",
                    SEQ: "7",
                },
                {
                    TYPE: "STN",
                    STN_NAME: "E站",
                    ARRIVE_TIME: "",
                    DEPARTURE_TIME: "04:00",
                    SEQ: "8",
                },
            ],
            railImage: null,
            stnImage: null,
            trainImage: null,
            lineCanvas: {
                config: {
                    x: 0,
                    y: 0,
                    width: 700 - 10,
                    height: 100 - 10,
                },
                rail: {},
                stns: [],
                trains: [],
            },
            scrollAble: false,
            scrollStartPoint: 0,
            layerPosition: 0,
            interval: 95,
            jl_cid: "",
			whiteFlag: false,//是否白色版本
			textColor:'white',
        };
    },
    methods: {
        highlightCC(cc) {
            this.lineCanvas.trains.map((train) => {
                train.trainIcon.shadowEnabled = false;
                if (train.trainId == cc) {
                    this.$nextTick(() => {
                        train.trainIcon.shadowEnabled = true;
                        console.log(
                            "HIGHLIGHT",
                            cc,
                            train.trainIcon.shadowEnabled
                        );
                    });
                }
            });
        },
        moveToCC(cc) {
            console.log(
                "MOVE TO CC",
                this.lineCanvas.trains.find((train) => {
                    return (train.trainId == cc);
                }).trainIcon.x
            );
            this.$refs["line"].getNode().x(
                -this.lineCanvas.trains.find((train) => {
                    return train.trainId == cc;
                }).trainIcon.x + 250
            );
        },
        initImages() {
            const rail = new window.Image();
            const stn = new window.Image();
            const train = new window.Image();
            rail.src = require("../img/railXS.png");
            stn.src = require("../img/station.png");
            train.src = require("../img/cc.png");
            this.railImage = rail;
            this.stnImage = stn;
            this.trainImage = train;
        },
        createStn(stn) {
            const stnName = {
                align: "center",
                fill: "white",
                x: 250 * parseInt(stn.SEQ - 1),
                y: 60,
                text: stn.STN_NAME,
            };
            const stnTime = {
                align: "center",
                fill: "white",
                x: 250 * parseInt(stn.SEQ - 1),
                y: 20,
                text: this.createStnTime(stn),
            };
            const stnIcon = {
                image: this.stnImage,
                x: 250 * parseInt(stn.SEQ - 1),
                y: 33,
                height: 20,
                width: 20,
            };
            return {
                stnName: stnName,
                stnTime: stnTime,
                stnIcon: stnIcon,
            };
        },
        createStnTime(stn) {
            if (stn.ARRIVE_TIME === "") {
                return stn.DEPARTURE_TIME;
            }
            if (stn.DEPARTURE_TIME === "") {
                return stn.ARRIVE_TIME;
            }
            if (stn.ARRIVE_TIME !== "" && stn.DEPARTURE_TIME !== "") {
                return stn.ARRIVE_TIME + " - " + stn.DEPARTURE_TIME;
            }
        },
        createTrainTime(train) {
            if (train.ARRIVE_TIME === "") {
                return train.DEPARTURE_TIME;
            }
            if (train.DEPARTURE_TIME === "") {
                return train.ARRIVE_TIME;
            }
            if (train.ARRIVE_TIME !== "" && train.DEPARTURE_TIME !== "") {
                return train.DEPARTURE_TIME + " - " + train.ARRIVE_TIME;
            }
        },
        createTrain(train) {
            const trainStnDash = {
                align: "center",
                fill: this.textColor,
                x: this.interval * parseInt(train.SEQ - 1) + 8,
                y: 50,
                text: "-",
            };
            const depStn = {
                align: "center",
                fill: this.textColor,
                x: this.interval * parseInt(train.SEQ - 1) - (10 * train.DEPARTURE_STN.length),
                y: 50,
                text: train.DEPARTURE_STN,
            }
            const arrStn = {
                align: "center",
                fill: this.textColor,
                x: this.interval * parseInt(train.SEQ - 1) + 14,
                y: 50,
                text: train.ARRIVE_STN,
            }
            const trainTime = {
                align: "center",
                fill: "white",
                x: this.interval * parseInt(train.SEQ - 1),
                y: 65,
                text: this.createTrainTime(train),
            };
            const timeDash = {
                align: "center",
                fill: this.textColor,
                x: this.interval * parseInt(train.SEQ - 1) + 8,
                y: 65,
                text: "-",
            }
            const depTime = {
                align: "center",
                fill: this.textColor,
                x: this.interval * parseInt(train.SEQ - 1) - (5 * train.DEPARTURE_TIME.length),
                y: 65,
                text: train.DEPARTURE_TIME,
            }
            const depOverDay = {
                align: "center",
                fill: "#16E0D6",
                x: this.interval * parseInt(train.SEQ - 1) - (6.5 * train.DEP_OVERDAY.length),
                y: 80,
                text: train.DEP_OVERDAY,
            }
            const arrOverDay = {
                align: "center",
                fill: "#16E0D6",
                x: this.interval * parseInt(train.SEQ - 1) + 14,
                y: 80,
                text: train.ARR_OVERDAY,
            }
            const arrTime = {
                align: "center",
                fill: this.textColor,
                x: this.interval * parseInt(train.SEQ - 1) + 14,
                y: 65,
                text: train.ARRIVE_TIME,
            }
            const trainIcon = {
                image: this.trainImage,
                x: this.interval * parseInt(train.SEQ - 1),
                y: 23,
                height: 20,
                width: 20,
                shadowColor: "red",
                shadowBlur: 20,
                shadowEnabled: false,
            };
            const trainName = {
                align: "center",
                fill: this.textColor,
                x: this.interval * parseInt(train.SEQ - 1) - (0.5 * 5 * train.CC.length),
                y: 5,
                text: train.CC,
                fontSize: 14
            };
            return {
                trainStnDash: trainStnDash,
                depStn: depStn,
                arrStn: arrStn,
                depTime: depTime,
                arrTime: arrTime,
                depOverDay: depOverDay,
                arrOverDay: arrOverDay,
                trainTime: trainTime,
                trainIcon: trainIcon,
                trainName: trainName,
                timeDash: timeDash,
                trainId: train.GLOBAL_ID
            };
        },
        createTrainStns(train) {
            if (train.ARRIVE_STN === "") {
                return train.DEPARTURE_STN;
            }
            if (train.DEPARTURE_STN === "") {
                return train.ARRIVE_STN;
            }
            if (train.ARRIVE_STN !== "" && train.DEPARTURE_STN !== "") {
                return train.DEPARTURE_STN + " - " + train.ARRIVE_STN;
            }
        },
        drawJlLine() {
            if (this.jl.length !== 0) {
                let rail = {
                    x: 0,
                    y: 30,
                    height: 10,
                    width: this.interval * (this.jl.length - 1),
                    fillPatternImage: this.railImage,
                    fillPatternRepeat: "repeat-x",
                };
                this.lineCanvas.rail = rail;
                const stns = this.jl.filter((element) => {
                    return element.TYPE === "STN";
                });
                const trains = this.jl.filter((element) => {
                    return element.TYPE === "TRAIN";
                });
                stns.map((stn) => {
                    this.lineCanvas.stns.push(this.createStn(stn));
                });
                trains.map((train) => {
                    this.lineCanvas.trains.push(this.createTrain(train));
                });
                console.log("CONFIGS", this.lineCanvas);
                setTimeout(() => {
                    this.moveToCC(this.jl_cid);
                    this.highlightCC(this.jl_cid);
                }, 500);
            }
        },
        getJl() {
            com.getPromiseData({
                c: "kydp_ggy2027",
                s: [[this.jl_cid], [this.jl_cid]],
            }).then((res) => {
                this.jl = [];
                const route = res["1"]
                let seq = 1;
                console.log("查询交路数据", route);
                // let dayCount = 1
                route.map((r, index, l) => {
                    // let startStn = {
                    // 	TYPE: "STN",
                    // 	STN_NAME: r.START_STATION,
                    // 	ARRIVE_TIME: "",
                    // 	DEPARTURE_TIME: r.START_DATE.substring(0, 16),
                    // 	SEQ: seq.toString(),
                    // };
                    // seq++;
                    const arrOverDay = r.TYPE !== "不跨天"
                    let depOverDay = false
                    if (index > 0) {
                        const lastR = l[index - 1]
                        let lastRArr = "2021-01-01 " + lastR.END_DATE
                        let dep = "2021-01-01 " + r.START_DATE
                        if (new Date(dep).getTime() < new Date(lastRArr).getTime()) {
                            depOverDay = true
                        }
                    }
                    console.log("到点跨天", arrOverDay, "发点跨天", depOverDay)
                    // if (depOverDay) {
                    // 	dayCount = dayCount + 1
                    // }
                    // if (arrOverDay) {

                    // }
                    let train = {
                        TYPE: "TRAIN",
                        CC: r.CC,
                        ARRIVE_STN: r.END_STATION,
                        DEPARTURE_STN: r.START_STATION,
                        ARRIVE_TIME: r.END_DATE.substring(0, 5),
                        DEPARTURE_TIME: r.START_DATE.substring(0, 5),
                        SEQ: seq.toString(),
                        GLOBAL_ID: r.GLOBAL_ID,
                        DEP_OVERDAY: depOverDay ? "(跨天)" : "",
                        ARR_OVERDAY: arrOverDay ? "(跨天)" : ""
                    };
                    seq++;
                    // let endStn = {
                    // 	TYPE: "STN",
                    // 	STN_NAME: r.END_STATION,
                    // 	ARRIVE_TIME: r.END_DATE.substring(0, 16),
                    // 	DEPARTURE_TIME: "",
                    // 	SEQ: seq.toString(),
                    // };
                    // seq++;
                    // this.jl.push(startStn);
                    this.jl.push(train);
                    // this.jl.push(endStn);
                });
                console.log("解析交路数据", this.jl);
                this.jl.map((j, index, l) => {
                    if (index < l.length - 1) {
                        const last = j;
                        const next = l[index + 1];
                        if (last.TYPE == next.TYPE) {
                            if (
                                last.STN_NAME != undefined &&
                                next.STN_NAME != undefined &&
                                last.STN_NAME == next.STN_NAME
                            ) {
                                last.DEPARTURE_TIME = next.DEPARTURE_TIME;
                                l.splice(index + 1, 1);
                                l.map((a, i) => {
                                    if (i >= index + 1) {
                                        a.SEQ = (
                                            parseInt(a.SEQ) - 1
                                        ).toString();
                                    }
                                });
                            }
                        }
                    }
                });
                this.drawJlLine();
            });
        },
        enableScroll(e) {
            // console.log("ENABLE SCROLL", e)
            this.scrollAble = true;
            this.scrollStartPoint = e.evt.layerX;
            this.layerPosition = this.$refs["line"].getNode().position().x;
        },
        scroll(e) {
            if (this.scrollAble) {
                const delta = e.evt.layerX - this.scrollStartPoint;
                var left=this.layerPosition + delta;
                var minLeft=this.lineCanvas.config.width-(this.lineCanvas.rail.width+100);
                if(left<minLeft){
                    left=minLeft;
                }
                if(left>100){
                    left=100;
                }
                this.$refs["line"].getNode().x(left);
            }
        },
        disableScroll(e) {
            this.scrollAble = false;
        },
    },
    mounted() {
        this.jl_cid = this.ccId;
        if (this.$store.state.params.jlcid) {
            this.jl_cid = this.$store.state.params.jlcid;
		}
		if(this.bgWhiteFlag){
			this.whiteFlag = true;
			this.textColor="#555";
		}else{
			this.whiteFlag = false;
			this.textColor="white";
		}
        if (this.$store.state.params.whiteFlag=='1') {
			this.whiteFlag = true;
			this.textColor="#555";
        }else{
			this.whiteFlag = false;
			this.textColor="white";
		}
        this.lineCanvas.config.width=window.document.body.offsetWidth-10;
        this.$nextTick(() => {
            this.initImages();
            this.getJl();
        })
        // this.drawJlLine();
    },
    watch: {
        ccId(newVal) {
            debugger;
            console.log("车次ID变更");
            this.jl_cid = newVal;
            this.$nextTick(() => {
                this.getJl();
            })
		},
    },
    props: {
        ccId: {
            type: String,
        },
        cc: {
            type: String,
		},
		bgWhiteFlag:{
			type:Boolean,
			default:false,
		}
    },
};
</script>

<style scoped>
</style>