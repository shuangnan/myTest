<template>
    <div style="width:100%;height:100%;">
        <div style="height:40px;width:100%;padding-left:10px;display:flex;align-items:center;">
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
                <el-table-column label="车次" prop="TRAIN" min-width="80" align="center"></el-table-column>
                <el-table-column label="车站" prop="CURRNAME" min-width="80" align="center"></el-table-column>
                <el-table-column label="始发终到站" prop="START_DATE" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-html="scope.row.STARTNAME"></span>
                        -
                        <span v-html="scope.row.ENDNAME"></span>
                    </template>
                </el-table-column>
                <el-table-column label="始发时间" prop="text5" min-width="80" align="center">
                </el-table-column>
                <el-table-column label="终到时间" prop="text6" min-width="80" align="center">
                </el-table-column>
                <el-table-column label="担当局" prop="BUREAU" min-width="80" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    components: {
    },
    props: {
        dataList: {
            type: Array,
            default: () => { return [] },
        }
    },
    data() {
        return {
            tbDataList: [],
            trainNumFilter: "",
        }
    },
    created() {
        this.tbDataList=this.dataList;
    },
    mounted() {
    },
    methods: {
        filterTrainNum() {
            this.tbDataList = this.dataList.filter(v => {
                var trainNum = v.TRAIN;
                return trainNum.includes(this.trainNumFilter);
            })
        }
    },
    watch: {
        dataList() {
            this.tbDataList=this.dataList;
        }
    },
    computed: {

    }
}
</script>

<style scoped></style>