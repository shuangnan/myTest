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
                v-show="selectValue=='0'"
            >
                <el-table-column label="车次" prop="STATION_TRAIN_CODE" min-width="80" align="center"></el-table-column>
                <el-table-column label="车站" prop="STATION_NAME" min-width="80" align="center"></el-table-column>
                <el-table-column label="始发终到站" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.START_NAME"></span>
                        -
                        <span v-html="scope.row.END_NAME"></span>
                    </template>
                </el-table-column>
                <el-table-column label="始发终到时间" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.text5"></span>
                        <span style="color:#d56c6c;font-size:12px">{{scope.row.text6}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="到达时间" prop="WARN_TIME" min-width="80" align="center"></el-table-column>
                <el-table-column label="出发时间" prop="WARN_TIME_END" min-width="80" align="center"></el-table-column>
                <el-table-column label="上车人数" prop="UP_COUNT" min-width="80" align="center"></el-table-column>
                <el-table-column label="下车人数" prop="DOWN_COUNT" min-width="80" align="center"></el-table-column>
            </el-table>
            <el-table
                :data="tbDataList"
                size="mini"
                border
                highlight-current-row
                height="100%"
                :fit="true"
                v-show="selectValue=='1'"
            >
                <el-table-column label="车次" prop="CC" min-width="80" align="center"></el-table-column>
                <el-table-column label="始发终到站" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.START_STN"></span>
                        -
                        <span v-html="scope.row.END_STN"></span>
                    </template>
                </el-table-column>
                <el-table-column label="始发终到时间" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.text5"></span>
                        <span style="color:#d56c6c;font-size:12px">{{scope.row.text6}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                :data="tbDataList"
                size="mini"
                border
                highlight-current-row
                height="100%"
                :fit="true"
                v-show="selectValue=='2'"
            >
                <el-table-column label="车次" prop="CC" min-width="80" align="center"></el-table-column>
                <el-table-column label="始发终到站" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.START_STN"></span>
                        -
                        <span v-html="scope.row.END_STN"></span>
                    </template>
                </el-table-column>
                <el-table-column label="始发终到时间" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.text5"></span>
                        <span style="color:#d56c6c;font-size:12px">{{scope.row.text6}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="挂" prop="WARN_TIME" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.text2"></span>
                    </template>
                </el-table-column>
                <el-table-column label="甩" prop="WARN_TIME_END" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.text3"></span>
                    </template>
                </el-table-column>
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
            default: () => { return [] },
        }
    },
    data() {
        return {
            TabdataSource: [{
                text: '大客流',
                value: "0",
            }, {
                text: '临客',
                value: "1",
            }, {
                text: '甩挂',
                value: "2",
            }],
            selectValue: "0",
            tbDataList: [],
            trainNumFilter: "",
        }
    },
    created() {

    },
    mounted() {
        this.mapTabSelect({ value: '0' });
    },
    methods: {
        mapTabSelect(item) {
            this.tbDataList = [];
            this.trainNumFilter = "";
            this.selectValue = item.value;
            this.dataList.forEach(v => {
                if (v.type == this.selectValue) {
                    this.tbDataList.push(v);
                }
            })
        },
        filterTrainNum() {
            var dataList = this.dataList.filter(v => {
                return v.type == this.selectValue
            })
            this.tbDataList = dataList.filter(v => {
                var trainNum = v.STATION_TRAIN_CODE || v.CC
                return trainNum.includes(this.trainNumFilter);
            })
        }
    },
    watch: {
        dataList() {
            this.mapTabSelect({ value: '0' });
        }
    },
    computed: {

    }
}
</script>

<style scoped></style>