<template>
    <div style="height:100%;width:100%;background:#010713;display:flex">
        <div style="width:248px;height:100%;margin-right:2px">
            <div class="leftTitle">
                <div>
                    <el-popover
                        placement="bottom"
                        trigger="hover"
                        :disabled="treeDisabled"
                        ref="popover"
                    >
                        <span slot="reference" style="text-decoration: underline;color: #2a95fa;">
                            {{curUnit.TEXT}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-tree
                            ref="unitTree"
                            :data="unitData"
                            @node-click="handelNodeClick"
                            node-key="ID"
                            :highlight-current="true"
                            :default-expand-all="false"
                            :expand-on-click-node="true"
                            :render-after-expand="true"
                            :show-checkbox="false"
                            style="background: transparent;overflow-y: scroll;max-height: 300px;"
                            :default-expanded-keys="firstExpanded"
                        ></el-tree>
                    </el-popover>
                </div>
                <div></div>
            </div>
            <div style="height:calc(100% - 40px);width:100%;overflow:auto;">
                <el-tree
                    class="filter-tree"
                    :props="defaultProps"
                    ref="depTree"
                    :data="depData"
                    @node-click="handelDepNodeClick"
                    node-key="ID"
                    :highlight-current="true"
                    :default-expand-all="false"
                    :expand-on-click-node="true"
                    :render-after-expand="true"
                    :show-checkbox="false"
                    :default-expanded-keys="depExpandedKeys"
                    style="background: transparent;color:white"
                ></el-tree>
            </div>
        </div>
        <div style="width:calc(100% - 250px);height:100%;">
            <div
                :style="{height:editFlag?'40px':'0px'}"
                style="width:100%;background:#525c75;display:flex;align-items:center;justify-content:space-between;padding-right:10px;overflow:hidden"
            >
                <div>
                    <el-button
                        size="mini"
                        type="primary"
                        style="margin-left:10px;"
                        @click="reloadData()"
                    >??????</el-button>
                    <el-button
                        size="mini"
                        style="margin-left:10px;"
                        :class="{offBtnSelect:!eidtFlag,btnSelect:eidtFlag}"
                        @click="editMap()"
                    >??????</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        style="margin-left:10px;"
                        @click="clearMap()"
                    >??????</el-button>
                </div>
                <div style="display:flex;color:#fff;">
                    <span style="display:flex;align-items: center;margin-right:10px;">
                        ????????????
                        <el-color-picker
                            title="????????????"
                            v-model="bgColor"
                            color-format="hex"
                            :show-alpha="false"
                            size="mini"
                            :predefine="predefineColors"
                        ></el-color-picker>
                    </span>
                    <span style="display:flex;align-items: center;">
                        ????????????
                        <el-color-picker
                            title="????????????"
                            v-model="bdColor"
                            color-format="hex"
                            :show-alpha="false"
                            size="mini"
                            :predefine="predefineColors"
                        ></el-color-picker>
                    </span>
                    <el-button
                        size="mini"
                        :type="editDataFlag?'danger':'primary'"
                        style="margin-left:10px;"
                        :class="{SSlight:editDataFlag}"
                        @click="saveMap()"
                    >??????</el-button>
                </div>
            </div>
            <div :style="{height:editFlag?'calc(100% - 40px)':'100%'}" style="width:100%;">
                <areaMap
                    ref="areaMap"
                    :bgColor="bgColor"
                    :bdColor="bdColor"
                    :colorOpacity="colorOpacity"
                    :editFlag="editFlag"
                    @changeEditDataFlag="changeEditDataFlag"
                ></areaMap>
            </div>
        </div>
    </div>
</template>

<script>
import areaMap from './areaMap.vue';
import C from "../../../assets/com.js";
export default {
    components: {
        areaMap,
    },
    data() {
        return {
            webParam: null,//url??????
            unitData: null, //???????????????
            unitselect: "",//?????????????????????
            treeDisabled: false, //?????????????????????
            curUnit: {}, //????????????
            curDep: {}, //????????????
            firstExpanded: [], //?????????????????????
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            depData: null, //???????????????
            depExpandedKeys: [],//??????????????????

            eidtFlag: false,//??????????????????
            predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff'],//?????????????????????????????????

            bgColor: "#1e90ff",
            bdColor: "#ff8c00",
            colorOpacity: "7c",

            pointList: [],

            editDataFlag:false,//?????????????????????

            editFlag:false,//????????????
        }
    },
    created() {
        this.webParam = this.$store.state.params;
        this.curUnit.TEXT = this.webParam.Oname
        this.curUnit.label = this.webParam.Oname
        this.curUnit.ID = this.webParam.Oid
        this.curUnit.UNIT_ID = this.webParam.Oid
        this.curDep.ID = this.webParam.DepId
        this.curDep.TEXT = this.webParam.DepName
        this.getUnitTree();//???????????????
        this.getDepTree(this.curUnit.ID);//???????????????
        if (!['19B8C3534E455665E0539106C00A58FD','99990002001499A50004'].includes(this.webParam.Oid)) {
            this.treeDisabled = true
        }
        if(this.webParam.UserMType.includes("?????????????????????")){
            this.editFlag=true;
        }
    },
    methods: {
        refreshData() {
            this.$refs.areaMap.clearEidtAll();
            this.getPolygonPoints();
        },
        editMap() {
            this.eidtFlag = !this.eidtFlag;
            if (this.eidtFlag) {
                this.$refs.areaMap.openEditFlag();
            } else {
                this.$refs.areaMap.closeEditFlag();
            }

        },
        clearMap() {
            this.$refs.areaMap.delTarget();
        },
        saveMap() {
            var delList = [];
            this.pointList.forEach(v => {
                delList.push([this.curDep.ID, v.AREA_NUM])
            })
            if (delList.length > 0) {
                C.getData({
                    c: "trdm_lv_755",
                    s: delList,
                    async: false,
                    a: "trdm_lv_755????????????GIS?????????????????????"
                }, (rs) => {

                })
            }
            //[
            //    [[????????????ID????????????????????????1-??????]]]???
            //  [[AREA_OID???????????????OID??????AREA_ONAME???????????????????????????AREA_TYPE????????????????????????1-?????????AREA_X???AREA_Y?????????????????????????????????????????????????????????????????????????????????????????????]]]
            var points = this.$refs.areaMap.getPolygonPoints();
            console.log("????????????", points);
            var sql = [[[this.curDep.ID, "1"]]];
            var tempSql = [];
            points.forEach((v, i) => {
                v.forEach((t, index) => {
                    var row=[this.curDep.ID, this.curDep.TEXT, "1", t[0], t[1], index, this.bgColor + this.colorOpacity, this.bdColor + this.colorOpacity, i];
                    tempSql.push(row)
                    
                });
            })
            sql.push(tempSql);

            console.log("??????sql", sql);
            C.getData({
                c: "trdm_lv_693",
                s: sql,
                async: true,
                a: "trdm_lv_693????????????????????????GIS?????????????????????"
            }, (rs) => {
                if (rs[0] == "true") {
                    this.$message.success("????????????");
                    this.$refs.areaMap.saveEdit(points);
                    this.$refs.areaMap.closeEditFlag();
                    this.eidtFlag = false;
                    this.changeEditDataFlag(false);
                } else {
                    this.$message.error("????????????");
                }
                console.log(rs);
            });
        },
        getPolygonPoints(depid) {
            this.editDataFlag=false;
            this.eidtFlag=false;
            if(this.$refs.areaMap){
                this.$refs.areaMap.closeEditFlag();
            }
            C.getData({
                c: "trdm_lv_692",
                s: [depid, "1"],
                async: true,
                a: "????????????????????????GIS?????????????????????",
              url: 'https://10.192.34.79/TRDM/GeneralProServlet'
            }, (rs) => {
                this.pointList = rs;
                console.log("????????????", rs);
                var points = [];
                var groupList = [];
                rs.forEach(v => {
                    if (!groupList.includes(v.AREA_NUM)) {
                        groupList.push(v.AREA_NUM);
                    }
                    this.bdColor = v.LINE_COLOR;
                    this.bgColor = v.INNER_COLOR;
                })
                groupList.forEach(t => {
                    var rowList = [];
                    rs.forEach(v => {
                        if (v.AREA_NUM == t) {
                            rowList.push([v.AREA_X, v.AREA_Y])
                        }
                    })
                    points.push(rowList);
                })
                if (this.bdColor.length > 7) {
                    this.bdColor = this.bdColor.substring(0, this.bdColor.length - 2);
                }
                if (this.bgColor.length > 7) {
                    this.bgColor = this.bgColor.substring(0, this.bgColor.length - 2);
                }
                console.log("??????", this.bdColor, this.bgColor);
                this.$nextTick(() => {
                    this.$refs.areaMap.saveEdit(points);
                })
            });
        },
        //?????????????????????
        handelNodeClick(data) {
            this.queryName = ''
            this.queryDep = ''
            console.log(data)
            if (typeof (data.children) === 'undefined') {
                this.curUnit = JSON.parse(JSON.stringify(data))
                this.curDep.ID = ''
                this.getDepTree(data.UNIT_ID);
            }
        },
        //???????????????
        getUnitTree() {
            C.getData({
                c: '11186',
                url: 'https://10.192.6.179:8168/SSOP/GeneralProServlet'
            }, rs => {
                var treeData = C.convertTreeData(rs, "ID", "PID", "ID");
                this.unitData = treeData;
                console.log("???????????????", JSON.parse(JSON.stringify(treeData)));
            })
        },
        //??????????????????
        getDepTree(id) {
            C.getData({
                c: '1119',
                url: 'https://10.192.6.179:8168/SSOP/GeneralProServlet',
                w: [id]
            }, rs => {
                var treeData = C.convertTreeData(rs, "ID", "PID", "ID");
                var curUnit=JSON.parse(JSON.stringify(this.curUnit));
                curUnit.ID=curUnit.UNIT_ID;
                let dd = [curUnit]
                dd[0].children = treeData
                this.depData = dd;
                if (this.depData.length > 0) {
                    this.depExpandedKeys = [this.depData[0].ID];
                    this.$nextTick(() => {
                        this.$refs.depTree.setCurrentKey(this.depData[0].ID);
                    })
                    this.handelDepNodeClick(this.depData[0]);
                }
                console.log('treeData', this.depData)
            })
        },
        //???????????????????????????
        handelDepNodeClick(data) {
            if(this.editDataFlag){
                this.$confirm('???????????????????????????????', '??????', {
                    confirmButtonText: '??????',
                    cancelButtonText: '??????',
                    type: 'warning'
                }).then(() => {
                     this.curDep = data;
                        this.getPolygonPoints(this.curDep.ID);
                }).catch(() => { });
            }else{
                 this.curDep = data;
                    this.getPolygonPoints(this.curDep.ID);
            }
           
        },
        reloadData(){
            if(this.editDataFlag){
                this.$confirm('???????????????????????????????', '??????', {
                    confirmButtonText: '??????',
                    cancelButtonText: '??????',
                    type: 'warning'
                }).then(() => {
                    this.getPolygonPoints(this.curDep.ID);
                }).catch(() => { });
            }else{
                this.getPolygonPoints(this.curDep.ID);
            }
        },
        changeEditDataFlag(flag){
            this.editDataFlag=flag;
        }
    },
    watch: {
        unitselect(val) {
            this.refreshData();
        },
        bgColor(val) {
            this.$nextTick(() => {
                this.$refs.areaMap.reloadDraw();
            })
        },
        bdColor(val) {
            this.$nextTick(() => {
                this.$refs.areaMap.reloadDraw();
            })
        }
    }
}
</script>

<style scoped>
.leftTitle {
    height: 40px;
    width: 100%;
    background: #525c75;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}
.offBtnSelect {
    background: #8a8888b0;
    border-color: #8a8888b0;
}
.btnSelect {
    background: #f37a18;
    color: #fff;
    border-color: #f37a18;
}
>>> .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #464f64 !important;
    color: rgb(42, 149, 250);
}
>>> .el-tree-node__content:hover {
    background-color: #464f64 !important;
}
>>> .el-color-picker {
    overflow: hidden;
    border-radius: 7px;
}
>>> .el-color-picker__trigger {
    width: 100%;
    min-width: 28px;
    border-color: transparent;
}
>>> .el-color-picker__trigger {
    padding: 0px;
}
>>> .el-color-picker__color {
    border: none;
}
/* ????????? */
.SSlight {
  animation: SSlightDo 3s infinite;
  animation-timing-function: linear;
}

@keyframes SSlightDo {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
>>> .el-tree-node:focus > .el-tree-node__content,
>>> .el-tree-node__content:hover {
    background-color: #525c75;
    color: #9ac0ec;
}
>>> .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #525c75;
    color: #9ac0ec;
}
</style>
