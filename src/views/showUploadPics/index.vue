<template>
  <div style="height: 100%; width: 100%">
    <div class="header">
      <el-date-picker
        v-model="dateRange"
        range-separator="-"
        size="mini"
        type="daterange"
        value-format="yyyy-MM-dd"
        @change="getData"
      ></el-date-picker>
    </div>
    <div class="table">
      <div v-for="(col, index) in tableData" :key="index" class="date-container">
        <div class="date-title">
          <span
            style="color: white; text-align: center; font-weight: bold; font-size: 20px"
          >{{ col.DATES }}</span>
        </div>
        <div
          v-for="(pic, index) in col.DETAILS"
          :key="index"
          class="pic-container"
          @click="preview(pic)"
        >
          <div class="detail-container">
            <span style="font-size: 18px">{{ pic.UPLOAD_DESCRIBE }}</span>
          </div>
          <div class="photos">
            <div v-for="(p, index) in pic.FILES" :key="index">
              <img
                v-if="getFileType(p.IN_URL) === 'image'"
                :src="p.IN_URL"
                style="height: 50px; width: 50px; margin-right: 10px"
              />
              <video
                v-if="getFileType(p.IN_URL) === 'video'"
                :src="p.IN_URL"
                height="50px"
                style="margin-right: 10px"
                width="50px"
              />
            </div>
          </div>
        </div>
      </div>
      <!--      <el-table :data="tableData" border height="100%" size="mini" stripe>-->
      <!--        <el-table-column v-for="(col, index) in tableData" :row-key="index" :key="index" :label="col.DATES" align="center">-->
      <!--          <el-table v-if="col.DETAILS.length !== 0" :data="col.DETAILS" :show-header="false" border size="mini" stripe>-->
      <!--            <el-table-column align="center">-->
      <!--              <template slot-scope="pic">-->
      <!--                <div style="display: flex; flex-direction: row" @click="preview(pic.row)">-->
      <!--                  <div v-for="(p, index) in pic.row.FILES" :key="index">-->
      <!--                    <img v-if="getFileType(p.IN_URL) === 'image'" :src="p.IN_URL"-->
      <!--                         style="height: 50px; width: 50px; margin-right: 10px"/>-->
      <!--                    <video v-if="getFileType(p.IN_URL) === 'video'" :src="p.IN_URL" height="50px"-->
      <!--                           style="margin-right: 10px" width="50px"/>-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--          </el-table>-->
      <!--        </el-table-column>-->
      <!--        &lt;!&ndash;        <el-table-column label="上传人" prop="EM_NAME" align="center"></el-table-column>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <el-table-column label="上传日期" width="150px" prop="UPLOAD_DATE" align="center"></el-table-column>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <el-table-column label="上传人电话" prop="EM_PHONE" align="center"></el-table-column>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <el-table-column label="经度" prop="GPSY" align="center"></el-table-column>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <el-table-column label="纬度" prop="GPSX" align="center"></el-table-column>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <el-table-column label="描述" show-overflow-tooltip prop="UPLOAD_DESCRIBE" align="center"></el-table-column>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <el-table-column label="图片" align="center">&ndash;&gt;-->
      <!--        &lt;!&ndash;          <template slot-scope="pic">&ndash;&gt;-->
      <!--        &lt;!&ndash;            <div style="display: flex; flex-direction: row" @click="preview(pic.row)">&ndash;&gt;-->
      <!--        &lt;!&ndash;              <div v-for="(p, index) in pic.row.FILES" :key="index">&ndash;&gt;-->
      <!--        &lt;!&ndash;                <img v-if="getFileType(p.IN_URL) === 'image'" :src="p.IN_URL" style="height: 50px; width: 50px; margin-right: 10px" />&ndash;&gt;-->
      <!--        &lt;!&ndash;                <video v-if="getFileType(p.IN_URL) === 'video'" :src="p.IN_URL" style="margin-right: 10px" height="50px" width="50px" />&ndash;&gt;-->
      <!--        &lt;!&ndash;              </div>&ndash;&gt;-->
      <!--        &lt;!&ndash;            </div>&ndash;&gt;-->
      <!--        &lt;!&ndash;          </template>&ndash;&gt;-->
      <!--        &lt;!&ndash;        </el-table-column>&ndash;&gt;-->
      <!--      </el-table>-->
    </div>
    <el-dialog :visible.sync="previewDialog" title="查看图片" top="3vh" width="1100px">
      <pic-swiper :detail="detail" />
    </el-dialog>
  </div>
</template>

<script>
import com from "@/assets/com";
import picSwiper from "@/views/showUploadPics/picSwiper";

export default {
  name: "index",
  components: { picSwiper },
  data() {
    return {
      dateRange: [],
      tableData: [],
      previewDialog: false,
      previewUrls: [],
      detail: {},
      tableCols: []
    };
  },
  methods: {
    init() {
      let startDate = com.getDateTimeSub(new Date(), "yyyy-MM-dd", -24 * 4);
      let endDate = com.formatDate(new Date(), "yyyy-MM-dd");
      this.dateRange = [startDate, endDate];
      this.getData();
    },
    getData() {
      com.getData(
        {
          c: "tyzd_ggy2147",
          s: {
            BEGIN_DATE: this.dateRange[0],
            END_DATE: this.dateRange[1]
          },
          url: "https://10.192.34.79/ky203/GeneralProServlet"
        },
        res => {
          console.log("查询数据", res.data["1"]);
          this.tableData = res.data["1"];
          // let dateDic = this.getBetweenDates(this.dateRange[0], this.dateRange[1])
          // let target = []
          // dateDic.map((d) => {
          //   let detail = []
          //   this.tableData.map((t) => {
          //     if (t.UPLOAD_DATE.includes(d)) {
          //       detail.push(t)
          //     }
          //   })
          //   target.push({
          //     DATE: d,
          //     DETAIL: detail
          //   })
          // })
          // console.log('ARR', target)
        }
      );
    },
    preview(row) {
      let images = [];
      row.FILES.map(i => {
        images.push(i.IN_URL);
      });
      this.detail = row;
      this.previewDialog = true;
    },
    processSpan({ row, col, rowIndex, colIndex }) {},
    getFileType(filename) {
      filename = filename.toUpperCase();
      if (
        filename.includes(".MPG") ||
        filename.includes(".MPEG") ||
        filename.includes(".MP4") ||
        filename.includes(".AVI") ||
        filename.includes(".RM") ||
        filename.includes(".RMVB") ||
        filename.includes(".MOV") ||
        filename.includes(".WMV") ||
        filename.includes(".ASF") ||
        filename.includes(".M4V") ||
        filename.includes(".MPE") ||
        filename.includes(".MPA")
      ) {
        return "video";
      } else {
        return "image";
      }
    },
    getBetweenDates(start, end) {
      let result = [];
      let beginDay = start.split("-");
      let endDay = end.split("-");
      let diffDay = new Date();
      let dateList = [];
      let i = 0;
      diffDay.setDate(beginDay[2]);
      diffDay.setMonth(beginDay[1] - 1);
      diffDay.setFullYear(beginDay[0]);
      result.push(start);
      while (i == 0) {
        let countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
        diffDay.setTime(countDay);
        dateList[2] = diffDay.getDate();
        dateList[1] = diffDay.getMonth() + 1;
        dateList[0] = diffDay.getFullYear();
        if (String(dateList[1]).length == 1) {
          dateList[1] = "0" + dateList[1];
        }
        if (String(dateList[2]).length == 1) {
          dateList[2] = "0" + dateList[2];
        }
        result.push(dateList[0] + "-" + dateList[1] + "-" + dateList[2]);
        if (
          dateList[0] == endDay[0] &&
          dateList[1] == endDay[1] &&
          dateList[2] == endDay[2]
        ) {
          i = 1;
        }
      }
      console.log(result);
      return result;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.header {
  align-items: center;
  background-color: rgb(245, 247, 250);
  display: flex;
  height: 40px;
  padding: 5px;
}

.table {
  display: flex;
  height: calc(100% - 40px);
  width: 100%;
}

.table .date-container {
  border-radius: 15px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 400px;
  margin-right: 10px;
}

.date-container .date-title {
  align-content: center;
  align-items: center;
  border-bottom: 1px grey solid;
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #409eff;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}

.date-container .pic-container {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: calc(100% - 20px);
  border-radius: 15px;
  margin: 10px;
  background-color: #f5f7fa;
}

.pic-container .photos {
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.pic-container .detail-container {
  margin-bottom: 10px;
}
</style>
