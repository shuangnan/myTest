<template>
  <div class="report-card-container">
    <div class="time-line"></div>
    <div class="content">
      <div class="title">
        <div class="index">
          <span :style="{
            fontSize: bigger ? '25px' : '16px',
          }" style="color: white">{{ index + 1 }}</span>
        </div>
        <div class="title-content">
          <span :style="{
            fontSize: bigger ? '25px' : '14px'
          }">{{ content.UNIT_NAME }} - {{ content.DEP_NAME }}</span>
          <div :style="{
            width: bigger ? '400px' : '150px'
          }" style="display: flex; align-items: center; align-content: center; justify-content: center">
            <span style="color: #538FED" :style="{
            fontSize: bigger ? '25px' : '16px'
          }">{{ content.E_TIME }}</span>
          </div>
        </div>
      </div>
      <div class="report-content">
        <span style="color: white" :style="{
            fontSize: bigger ? '25px' : '16px'
          }">
          <span>有无震感: {{ content.QUAKE_FLAG === '0' ? '无' : '有' }} <br /></span>
          <span v-if="content.QUAKE_STATION_LIST !== ''">有震感车站: {{ content.QUAKE_STATION_LIST }}<br /></span>
          <span v-if="content.CONTENT !== ''">人员受灾情况: {{content.CONTENT}} <br /></span>
          <span v-if="content.CONTENT2 !== ''">设备受灾情况: {{content.CONTENT2}} <br /></span>
          <span v-if="content.NUM_RAIL !== ''">出动巡查车台数: {{content.NUM_RAIL}}<br /></span>
          <span v-if="content.NUM_PEO !== ''">出动巡查人员数: {{content.NUM_PEO}} <br /></span>
          <span v-if="content.CONTENT3 !== ''">其他说明: {{content.CONTENT3}}</span>
          <!-- {{ [content.CONTENT, content.CONTENT2, content.CONTENT3].join('，') }} -->
        </span>
      </div>
    </div>
    <z-dialog ref="dialog2" title="编辑速报" :show.sync="editReport.visible" :is-footer="false">
      <div slot="body">
        <el-input type="textarea" v-model="editReport.content" placeholder="输入速报内容..."></el-input>
        <el-button style="margin-top: 10px" type="primary" size="mini" @click="handleEditReport">确定</el-button>
        <el-button style="margin-top: 10px" type="danger" size="mini" @click="handleDeleteReport">删除速报</el-button>
      </div>
    </z-dialog>
  </div>
</template>

<script>
import com from "@/assets/com";
import ZDialog from "@/components/ZDialog";

export default {
  name: "ReportCard",
  components: {ZDialog},
  props: {
    content: {
      type: Object,
      default: () => {
        return {
          PKID: '',
          E_ID: '',
          EM_ID: '',
          EM_NAME: '',
          UNIT_ID: '',
          UNIT_NAME: '',
          DEP_ID: '',
          DEP_NAME: '',
          CONTENT: '',
          DELETE_FLAG: ''
        }
      },
    },
    index: {
      type: Number,
      default: 1
    },
    bigger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentReport: {
        PKID: '',
        E_ID: '',
        EM_ID: '',
        EM_NAME: '',
        UNIT_ID: '',
        UNIT_NAME: '',
        DEP_ID: '',
        DEP_NAME: '',
        CONTENT: '',
        DELETE_FLAG: ''
      },
      editReport: {
        visible: false,
        content: ''
      }
    }
  },
  methods: {
    showReportEdit(report) {
      console.log('编辑速报', report)
      this.currentReport = JSON.parse(JSON.stringify(report))
      this.editReport.content = this.currentReport.CONTENT
      this.editReport.visible = true
    },
    handleEditReport() {
      this.currentReport.CONTENT = this.editReport.content
      com.getData({
        c: 'eqeh_zxy9018',
        s: [
          JSON.parse(JSON.stringify(this.currentReport))
        ]
      }, (res) => {
        if (res) {
          com.getData({
            c: 'eqeh_zxy2056',
            s: [
              {
                E_ID: this.$store.state.earthquake.currentEarthquake.EQ_ID
              }
            ]
          }, (r) => {
            this.$store.commit('earthquake/updateReports', r.data['1'])
            this.$message.success('编辑速报成功！')
            this.editReport.visible = false
            this.editReport.content = ''
          })
        } else {
          this.$message.error('编辑速报失败！')
        }
      })
    },
    handleDeleteReport() {
      this.currentReport.DELETE_FLAG = '1'
      com.getData({
        c: 'eqeh_zxy9018',
        s: [
          JSON.parse(JSON.stringify(this.currentReport))
        ]
      }, (res) => {
        if (res) {
          com.getData({
            c: 'eqeh_zxy2056',
            s: [
              {
                E_ID: this.$store.state.earthquake.currentEarthquake.EQ_ID
              }
            ]
          }, (r) => {
            this.$store.commit('earthquake/updateReports', r.data['1'])
            this.$message.success('删除速报成功！')
            this.editReport.visible = false
            this.editReport.content = ''
          })
        } else {
          this.$message.error('删除速报失败！')
        }
      })
    }
  }
}
</script>

<style scoped>
.report-card-container {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  background: url("../imgs/TimeLinePoint.png")no-repeat;
  background-position: left 10px top 50%;
  /*background-size: 100% 100%*/
}

.time-line {
  width: 23px;
  height: 100%;
  border-right: 1px dotted #b4cefd;
}

.content {
  width: calc(100% - 38px);
  height: 100%;
  margin-left: 15px;
  background-image: linear-gradient(to right, #24396A, #18233E);
  /*border-bottom: 10px solid #18233E;*/
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  /*border: 1px solid purple;*/
}

.title {
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}

.title .index {
  width: 25px;
  height: 25px;
  border-radius: 5px;
  background: #24396A;
  border: 1px solid #b4cefd;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  margin-right: 5px;
}

.index > span {
  font-weight: bold;
  color: white !important;
}

.title .title-content {
  width: calc(100% - 10px - 25px);
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
}

.title-content > span {
  font-weight: bold;
  color: #538FED;
  font-size: 16px;
  text-shadow: 0 0 .1em, 0 0 .1em;
}

.report-content {
  height: calc(100% - 40px);
  width: 100%;
  padding: 8px;
}
</style>
