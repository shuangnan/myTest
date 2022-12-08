<template>
    <div style="width: 100%;height:100%;overflow: hidden;padding:0;margin:0;background:#2a3252">
        <div class="content">
            <span class="option">
                <label :class="dataType=='1'?'title active':'title'" @click="checkPlan('1')">当日计划</label>
                <label class="char">/</label>
                <label :class="dataType=='2'?'title active':'title'" @click="checkPlan('2')">次日计划</label>
            </span>
            <div style="position: absolute;right: 0px;top:10px;">
                <el-button size="small" type="primary" @click="visiblePB=true">派班比对</el-button>
            </div>
            <div class="opa">
                <span>
                    <label>车次</label>
                    <el-input size="mini" style="width: 100px;" v-model="opt.cc" clearable></el-input>
                </span>
                <span>
                    <label>班组</label>
                    <el-input size="mini" style="width: 100px;" v-model="opt.bz" clearable></el-input>
                </span>
                <span>
                    <label>车队</label>
                    <el-input size="mini" style="width: 100px;" v-model="opt.cd" clearable></el-input>
                </span>
                <!-- <el-button size="mini" type="primary" @click="search">筛选</el-button> -->
            </div>
            <el-table
                style="width:100%;"
                height="300"
                size="mini"
                :data="datasource.filter(data => {
					return (opt.cc?data.CC.indexOf(opt.cc)>-1:true)&&
							(opt.bz?data.CLASS_NAME.indexOf(opt.bz)>-1:true)&&
							(opt.cd?data.TEAM_NAME.indexOf(opt.cd)>-1:true)
				})"
                :border="false"
                v-loading="loading"
                element-loading-background="rgba(0,0,0,.5)"
                element-loading-text="loading"
                tooltip-effect="light"
                :highlight-current-row="false"
            >
                <!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column> -->
                <el-table-column label="客运段" align="center" prop="DEPOT"></el-table-column>
                <el-table-column label="车次" align="center" prop="CC"></el-table-column>
                <el-table-column label="始发终到" align="center" width="100">
                    <template scope="scope">
                        <label>{{scope.row.START_STN}} - {{scope.row.END_STN}}</label>
                    </template>
                </el-table-column>
                <el-table-column label="班组" align="center" prop="CLASS_NAME"></el-table-column>
                <el-table-column label="车队" align="center" prop="TEAM_NAME"></el-table-column>
                <el-table-column
                    label="成员"
                    align="center"
                    prop="STEWARD_NAME"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="工作情况" align="center" prop="TASK_NAME">
                    <!-- <template scope="scope">
						<label v-if="scope.row.gzqk==1" class="dcf">待出发</label>
						<label v-if="scope.row.gzqk==0" class="wdw">未到位</label>
						<el-popover v-else trigger="click" placement="left">
							<div class="con">								
								<span v-for="(item,index) in scope.row.data"><label>{{index+1}}：</label>{{item.name}}</span>
								
							</div>
							<label v-if="scope.row.gzqk==2" slot="reference" class="ycc">已出乘</label>
							<label v-if="scope.row.gzqk==3" slot="reference" class="ytc">已退乘</label>
						</el-popover>
                    </template>-->
                </el-table-column>
            </el-table>
            <el-dialog
                v-if="visiblePB"
                :visible.sync="visiblePB"
                title="派班对比"
                fullscreen
                :append-to-body="true"
            >
                <div style="width: 100%;height: calc(100vh - 50px);">
                    <iframe :src="pbUrl" frameborder="0" style="width: 100%;height:100%;"></iframe>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import home from './service/home.js'
export default {
    props: {
        oname: {
            type: String,
            default: "",
        }
    },
    data() {
        return {
            pbUrl: "http://10.192.34.105/webroot/decision/view/report?viewlet=keyun/pb_kydp.cpt&op=write",
            visiblePB: false,
            loading: false,
            logo: require('../../images/yyqk.png'),
            datasource: [],
            dataType: "1",//1当日 2次日
            opt: {
                cc: null,//车次
                bz: null,//班组
                cd: null,//车队
            },
            user: {
                oName: null
            }
        }
    },
    mounted() {
        this.user.oName = this.$store.state.user.u_DEPOT
        this.initPlan()
    },
    methods: {
        checkPlan(dataType) {
            this.dataType = dataType
            this.loading = true
            //数据变动频繁，直接从数据库拿
            this.initPlan()
        },
        initPlan() {
            let t = this
            home.getPlan({
                s: [[t.oname], [t.oname]]
            }).then((r) => {
                if (r) {
                    t.datasource = r[t.dataType]
                } else {
                    this.$message('接口错误')
                }
                t.loading = false
            }, error => {
                t.loading = false
                t.$notify.error({
                    title: '当日/次日计划',
                    message: '获取计划数据异常'
                })
            })
        }
    },
    watch: {
        oname() {
            this.initPlan();
        },
    }
}
</script>

<style scoped="scoped">
.content {
    display: flex;
    flex-direction: column;
    color: #f0f0f0;
    width: 100%;
    height: 100%;
}

.content .opa {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 15px;
}
.content .opa > span {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    align-items: center;
    margin-right: 15px;
}
.content .opa > span > label {
    padding: 0 5px 0 0;
    font-size: 16px;
}

.content .option {
    display: flex;
    flex-direction: row;
}

.content .option .active {
    background: #217ffe;
}

.content .option .title {
    font-size: 22px;
    margin: 15px 0 0 0;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
}
.content .option .title:nth-child(1) {
    margin: 15px 0 0 15px;
}
.content .option .char {
    font-size: 24px;
    padding: 20px 10px 0 10px;
}

.content .time {
    width: 100%;
    text-align: center;
    font-size: 16px;
    margin: 10px 0;
}

.content .center {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.content .center .logo {
    width: 50px;
    height: 50px;
}

.content .center .left {
    display: flex;
    flex-direction: column;
}

.content .center .right {
    display: flex;
    flex-direction: column;
}

.content .center .right span {
    width: 100%;
    display: flex;
    align-items: center;
}

.content .center .right span label:nth-child(1) {
    width: 100px;
    text-align: right;
}

.content .center .space {
    width: 1px;
    height: 70px;
    background: #222222;
}

.font-blue {
    color: #2b97ff;
    font-size: 18px;
}

.font-white {
    color: #f0f0f0;
    font-size: 14px;
}
.con {
    color: #f0f0f0;
    display: flex;
    flex-direction: column;
}
.con > span > label {
    min-width: 10px;
    text-align: right;
    display: inline-block;
}
.wdw {
    color: #ca7d86;
}
.dcf {
    color: #dfad63;
}
.ycc {
    color: #78d695;
}
.ytc {
    color: #f0f0f0;
}
</style>
