<template>
  <div style="margin-top: 20px">
    <tabs
      ref="fhHisTab"
      :tabs-list="[{ id: 0, text: '手机呼入' }]"
    ></tabs>
    <div class="history-upload-locations">
      <table
        style="
									width: 100%;
									text-align: center;
									font-size: 12px;
								"
        cellpadding="0"
        cellspacing="0"
        border="0"
      >
        <colgroup>
          <col name="eq_2_column_1" width="65" />
          <col name="eq_2_column_2" width="70" />
          <col name="eq_2_column_3" width="70" />
          <col name="eq_2_column_4" width="70" />
        </colgroup>
        <thead>
        <tr style="color: #5b96ef">
          <th class="eq_2_column_1">电话号</th>
          <th class="eq_2_column_2">呼入时间</th>
          <th class="eq_2_column_3">
            发送短信次数
          </th>
          <th class="eq_2_column_4">操作</th>
        </tr>
        </thead>
      </table>
      <div style="height: 370px; overflow-y: auto">
        <table
          style="
										width: 100%;
										text-align: center;
										font-size: 12px;
									"
          cellpadding="0"
          cellspacing="0"
        >
          <colgroup>
            <col name="eq_2_column_1" width="65" />
            <col name="eq_2_column_2" width="70" />
            <col name="eq_2_column_3" width="70" />
            <col name="eq_2_column_4" width="70" />
          </colgroup>
          <tbody>
          <tr
            v-for="(row,
											index) in historyCallInData"
            :key="index"
            class="table-row-bg"
            style="height: 40px"
          >
            <td
              style
              class="eq_2_column_1"
              :style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
            >
              {{ row.PHONE }}
            </td>
            <td
              style
              class="eq_2_column_2"
              :style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
            >
              <!-- <div>成都东-昆明</div> -->
              {{ row.CTIME }}
            </td>
            <td
              style
              class="eq_2_column_3"
              :style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
            >
              {{ row.SEND_COUNT }}
            </td>
            <td style="" class="eq_2_column_3">
              <el-button
                type="primary"
                size="mini"
                @click="sendMsgToPhone(row)"
                v-if="
														config.earthquake
															.addFlag && ifToday(row.CTIME)
													"
                title="仅当日手机呼入可发送短信"
              >发送短信
              </el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <tabs
      ref="fhHisTab"
      :tabs-list="[{ id: 0, text: '上报历史' }]"
      style="margin-top: 20px;"
    ></tabs>
    <div class="history-upload-locations">
      <table
        style="
									width: 100%;
									text-align: center;
									font-size: 12px;
								"
        cellpadding="0"
        cellspacing="0"
        border="0"
      >
        <colgroup>
          <col name="eq_2_column_1" width="65" />
          <col name="eq_2_column_2" width="70" />
          <col name="eq_2_column_3" width="70" />
          <col name="eq_2_column_4" width="40" />
        </colgroup>
        <thead>
        <tr style="color: #5b96ef">
          <th class="eq_2_column_1">经度</th>
          <th class="eq_2_column_2">纬度</th>
          <th class="eq_2_column_3">上报电话</th>
          <th class="eq_2_column_4">上报时间</th>
        </tr>
        </thead>
      </table>
      <div style="height: 370px; overflow-y: auto">
        <table
          style="
										width: 100%;
										text-align: center;
										font-size: 12px;
									"
          cellpadding="0"
          cellspacing="0"
        >
          <colgroup>
            <col name="eq_2_column_1" width="65" />
            <col name="eq_2_column_2" width="70" />
            <col name="eq_2_column_3" width="70" />
            <col name="eq_2_column_4" width="40" />
          </colgroup>
          <tbody>
          <tr
            v-for="(row,
											index) in historyLocationUploads"
            :key="index"
            class="table-row-bg"
            @click="
												clickHistoryInfluenceData(row)
											"
            :style="{
												background:
													currentSelectedInfluenceData.PKID ===
													row.PKID
														? '#0E307E'
														: ''
											}"
          >
            <td
              style
              class="eq_2_column_1"
              :style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
            >
              {{
                parseFloat(row.LON).toFixed(
                  5
                )
              }}
            </td>
            <td
              style
              class="eq_2_column_2"
              :style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
            >
              <!-- <div>成都东-昆明</div> -->
              {{
                parseFloat(row.LAT).toFixed(
                  5
                )
              }}
            </td>
            <td
              style
              class="eq_2_column_3"
              :style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
            >
              {{ row.PHONE }}
            </td>
            <td
              style
              class="eq_2_column_4"
              :style="{
													fontWeight:
														index === 0
															? 'bold'
															: 'normal',
													fontSize:
														index === 0
															? '13px'
															: '12px',
													color:
														index === 0
															? '#9FA94C'
															: 'white'
												}"
            >
              {{ row.CTIME.substr(0, 16) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from "@/views/singleScreen/kyd/components/KydTabs";
import C from "@/assets/com";
import dayjs from 'dayjs'
import eqObj from "@/components/map/js/earthquake";
import config from '../../../components/map/js/config'
export default {
  name: "Alert",
  components: {
    tabs
  },
  data() {
    return {
      historyCallInData: [],
      historyLocationUploads: [],
      currentSelectedInfluenceData: {},
      config: config
    }
  },
  mounted () {
    this.getPhoneCallIn()
  },
  methods: {
    getPhoneCallIn() {
      C.getDataP123(
        {
          c: "eqeh_zxy2036",
          s: [["all"]],
          url: "https://10.192.126.203/GeneralProServlet"
        },
        res => {
          console.log("查询呼入记录", res["1"]);
          this.historyCallInData = res["1"];
          C.getDataP123(
            {
              c: "eqeh_zxy2033",
              s: [[0]],
              url: "https://10.192.126.203/GeneralProServlet"
            },
            res => {
              console.log("获取险情上报历史", res["1"]);
              this.historyLocationUploads = res["1"];
              if (this.historyLocationUploads.length !== 0) {
                // 选择第一个获取影响范围
              }
            }
          );
        }
      );
    },
    sendMsgToPhone(row) {
      C.getDataP123(
        {
          c: "eqeh_zxy9014",
          s: [row.PKID, row.PHONE],
          url: "https://10.192.126.203/GeneralProServlet"
        },
        () => {
          this.$message.success("已发送短信");
          this.getPhoneCallIn()
          // this.earthquakeTypeChange({ id: 2, text: "86433333报警" });
        }
      );
    },
    ifToday(date) {
      let current = dayjs().format('YYYY-MM-DD')
      let test = dayjs(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
      // console.log(test, current)
      if (current === test) {
        return true
      } else {
        return false
      }
    },
    clickHistoryInfluenceData(row) {
      this.currentSelectedInfluenceData = row;
      if (row.INFLUENCE !== "") {
        this.currentInfluenceTableData = JSON.parse(row.INFLUENCE);
        eqObj.handleRenderLocation(row.PKID);
        console.log(this.currentInfluenceTableData);
      }
    },
  }
}
</script>

<style scoped>
.history-upload-locations >>> .el-table .el-table__expanded-cell {
  background-color: transparent;
}

.history-upload-locations >>> .el-table th {
  background-color: rgba(0, 0, 0, 0) !important;
  z-index: 0 !important;
}

.history-upload-locations >>> .el-table tr {
  background-color: transparent !important;
  z-index: 0 !important;
  color: white;
}

.history-upload-locations >>> .el-table .el-table__expanded-cell {
  background-color: transparent;
}

.table-row-bg {
  background: url(../img/2.png) no-repeat;
  background-size: 100% 36px;
  background-position: 0px 3px;
}
</style>
