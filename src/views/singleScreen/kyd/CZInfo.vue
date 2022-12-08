<template>
    <div style="width:100%;height:100%;">
        <div style="height:40px;width:100%;padding-left:10px;display:flex;align-items:center;">
            <MapTab
                ref="mapTab"
                :dataSource="TabdataSource"
                type="3"
                @select="mapTabSelect"
                style="width:180px;"
            ></MapTab>
            <el-input
                prefix-icon="el-icon-search"
                style="width:150px;margin-left:10px;"
                size="mini"
                v-model="trainNumFilter"
                @change="filterTrainNum"
                placeholder="请输入车次"
                class="blue-input"
            ></el-input>
        </div>
        <div style="height:calc(100% - 40px);height:100%;" class="blue-table">
            <el-table
                :data="tbDataList"
                size="mini"
                border
                highlight-current-row
                height="100%"
                :fit="true"
            >
                <el-table-column label="始发时间" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.START_DATE.substring(0,scope.row.START_DATE.length-3)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="车次" prop="CC" min-width="80" align="center"></el-table-column>
                <el-table-column label="列车长1" prop="STEWARD_NAME" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.STEWARD_NAME}}</span>
                        <span class="phoneBtn" title="拨打电话" @click="phoneDo(scope.row.PHONE)">{{scope.row.PHONE}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="列车长2" prop="STEWARD_NAME1" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.STEWARD_NAME1}}</span>
                        <span
                            class="phoneBtn"
                            title="拨打电话"
                            @click="phoneDo(scope.row.PHONE1)"
                        >{{scope.row.PHONE1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="列车长3" prop="STEWARD_NAME2" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.STEWARD_NAME2}}</span>
                        <span
                            class="phoneBtn"
                            title="拨打电话"
                            @click="phoneDo(scope.row.PHONE2)"
                        >{{scope.row.PHONE2}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="班组" prop="CLASS_NAME" min-width="80" align="center"></el-table-column>
                <el-table-column label="车队" prop="TEAM_NAME" min-width="80" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import MapTab from './components/MapTab.vue';
export default {
    components: {
        MapTab,
    },
    props: {
        dataList: {
            type: Array,
            default: () => { return [[], []] },
        }
    },
    data() {
        return {
            TabdataSource: [{
                text: '今日',
                value: "0",
            }, {
                text: '次日',
                value: "1",
            }],
            selectValue: "0",
            tbDataList: [],
            trainNumFilter: "",
        }
    },
    created() {

    },
    mounted() {
        this.tbDataList = this.dataList[this.selectValue];
    },
    methods: {
        mapTabSelect(item) {
            this.selectValue = item.value;
            if (item.value === "0") {
                this.tbDataList = this.dataList[item.value];
            } else if (item.value === "1") {
                this.tbDataList = this.dataList[item.value];
            }
        },
        filterTrainNum() {
            var dataList = this.dataList[this.selectValue];
            this.tbDataList = dataList.filter(v => {
                return v.CC.includes(this.trainNumFilter) || v.STEWARD_NAME.includes(this.trainNumFilter) || v.PHONE.includes(this.trainNumFilter) || v.CLASS_NAME.includes(this.trainNumFilter) || v.TEAM_NAME.includes(this.trainNumFilter);
            })
        },
        phoneDo(num) {
            this.$emit("phoneDo", num);
        }
    },
    watch: {
        dataList() {
            this.tbDataList = this.dataList[this.selectValue];
        }
    },
    computed: {

    }
}
</script>

<style scoped>
.phoneBtn {
    color: #5bf388;
    cursor: pointer;
    margin-left: 5px;
}
</style>