<template>
  <div class="earthquake-brief-container">
    <el-tooltip placement="top" content="点击手动同步数据">
      <div class="earthquake-level" @click="handleRefresh">
<!--        <p>{{ currentEarthquake.EQ_LOCATION }}</p>-->
        <p>{{ currentEarthquake.EQ_LEVEL }}</p>
      </div>
    </el-tooltip>
    <div class="earthquake-info">
      <div class="earthquake-info-title">
        <p>发生时间</p>
        <p>震中</p>
<!--        <p>震级</p>-->
      </div>
      <div class="earthquake-info-split"></div>
      <div class="earthquake-info-content">
        <p>{{ earthquakeBrief.C_TIME }}</p>
        <p>{{ earthquakeBrief.E_PLACE }}</p>
<!--        <p>{{ currentEarthquake.EQ_LEVEL }}</p>-->
      </div>
    </div>
    <z-dialog title="更新地震信息" :show.sync="editEarthquake.visible" :is-footer="false">
      <div slot="body">
        <p style="color: white">
          应急响应等级:
          <el-input size="mini" v-model="editEarthquake.form.ulevel"></el-input>
        </p>
        <p style="color: white">
          震中经度:
          <el-input size="mini" v-model="editEarthquake.form.jingdu"></el-input>
        </p>
        <p style="color: white">
          震中纬度:
          <el-input size="mini" v-model="editEarthquake.form.weidu"></el-input>
        </p>
        <el-button type="primary" size="mini" @click="handleSaveEarthquake">保存</el-button>
      </div>
    </z-dialog>
  </div>
</template>

<script>
import ZDialog from "@/components/ZDialog";
import com from "@/assets/com";
export default {
  name: "EarthquakeBrief",
  components: {ZDialog},
  computed: {
    currentEarthquake() {
      return this.$store.state.earthquake.currentEarthquake
    },
    earthquakeBrief() {
      return this.$store.state.earthquake.currentEarthquakeInfo
    }
  },
  mounted() {
    console.log('CURRENT EARTHQUAKE', this.currentEarthquake)
    // this.setAutoRefresh()
  },
  data() {
    return {
      editEarthquake: {
        visible: false,
        form: {
          ulevel: '',
          jingdu: '',
          weidu: ''
        }
      },
      autoRefreshTimer: null
    }
  },
  methods: {
    setAutoRefresh() {
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer)
      }
      this.autoRefreshTimer = setInterval(() => {
        this.handleRefresh()
      }, 30000)
    },
    handleEditEarthquake() {
      this.editEarthquake.visible = true
    },
    handleSaveEarthquake() {
      com.getData({
        c: 'eqeh_zxy3009',
        s: [
          {
            E_ID: this.currentEarthquake.ED_ID,
            U_LEVEL: this.editEarthquake.form.ulevel,
            EQ_LON: this.editEarthquake.form.jingdu,
            EQ_LAT: this.editEarthquake.form.weidu
          }
        ],
        url: 'https://10.192.126.203/GeneralProServlet'
      }, (res) => {
        if (res) {
          com.getData({
            c: 'eqeh_zxy9010',
            s: [this.currentEarthquake.EQ_ID],
            w: ['all'],
            url: 'https://10.192.126.203/GeneralProServlet'
          }, (r) => {
            this.$store.commit('earthquake/updateCurrentEarthquakeInfo', r.data[1])
            this.$message.success('更新信息成功！')
            this.editEarthquake.visible = false
          })
        } else {
          this.$message.success('更新信息失败！')
        }
      })
    },
    handleRefresh() {
      com.getData({
        c: 'eqeh_zxy9010',
        s: [this.currentEarthquake.EQ_ID],
        w: ['all'],
        url: 'https://10.192.126.203/GeneralProServlet'
      }, (r) => {
        try {
          this.$store.commit('earthquake/updateCurrentEarthquakeInfo', r.data[1])
          console.log('同步完成')
        } catch (e) {
          this.$message.warning('同步失败，请重试！')
        }
      })
    }
  }
}
</script>

<style scoped>
.earthquake-brief-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-around;
}

.earthquake-level {
  width: 162px;
  height: 147px;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  background: url("../imgs/EarthquakeLevelBackground.png")no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.earthquake-level > p {
  font-size: 30px;
  font-weight: bold;
  text-shadow: 0 0 .1em, 0 0 .3em;
  color: #ffc86d;
  margin: 1px;
}

.earthquake-info {
  width: 223px;
  height: 148px;
  background: url("../imgs/EarthquakeBriefBackground.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}

.earthquake-info-title {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.earthquake-info-title > p {
  font-weight: bold;
  font-size: 14px;
  color: #b4cefd;
  margin-top: 8px;
  margin-bottom: 8px;
}

.earthquake-info-split {
  background: url("../imgs/EarthquakeBriefSplit.png")no-repeat;
  height: 130px;
  width: 11px;
  background-size: 100% 100%;
}

.earthquake-info-content {
  width: calc(100% - 30% - 11px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.earthquake-info-content > p {
  font-weight: bold;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
