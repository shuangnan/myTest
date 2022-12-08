<template>
  <v-group>
    <!--    站内范围-->
<!--    <v-line :config="{-->
<!--      points: config.points,-->
<!--      closed: true,-->
<!--      fill: '#CEE7FC'-->
<!--    }"></v-line>-->
    <!-- 站名 -->
    <v-text :config="{
      x: ((config.points[0] + config.points[2]) / 2 + (config.points[4] + config.points[6]) / 2) / 2 - 35,
      y: 200 / 3 - 5,
      text: config.metaData.STATION,
      fill: '#0F50B1',
      fontSize: 20,
      fontStyle: 'bold'
    }"></v-text>
    <!--    人员-->
    <v-text :config="{
      x: ((config.points[0] + config.points[2]) / 2 + (config.points[4] + config.points[6]) / 2) / 2 - 40,
      y: 200 / 2 - 20,
      text: stationText,
      fill: '#0F50B1',
      fontSize: 14
    }"></v-text>
    <!--    中心里程指示线 (上行部分)-->
    <v-line :config="{
      points: [config.center, (25 / 300) * 200, config.center, 200 / 3],
      stroke: '#62829D',
      strokeWidth: 2
    }"></v-line>
    <!--    中心里程指示线 (下行部分)-->
    <v-line :config="{
      points: [config.center, (200 / 300) * 200, config.center, (275 / 300) * 200],
      stroke: '#62829D',
      strokeWidth: 2
    }"></v-line>
    <!--    中心里程指示 (上行部分)-->
    <v-text :config="{
      x: config.center - 29,
      y: 10,
      text: config.metaData.CENTER_MILE,
      fill: '#62829D',
      fontSize: 16
    }"></v-text>
    <!--    中心里程指示 (下行部分)-->
    <v-text :config="{
      x: config.center - 29,
      y: (275 / 300) * 200 - 10,
      text: config.metaData.CENTER_MILE,
      fill: '#62829D',
      fontSize: 16
    }"></v-text>
<!--    &lt;!&ndash;    上行进站信号机指示线&ndash;&gt;-->
<!--    <v-line :config="{-->
<!--      points: [config.points[0], (25 / 300) * 200, config.points[0], 200 / 3],-->
<!--      stroke: '#62829D',-->
<!--      strokeWidth: 2-->
<!--    }"></v-line>-->
<!--    &lt;!&ndash;    下行进站信号机指示线&ndash;&gt;-->
<!--    <v-line :config="{-->
<!--      points: [config.points[6], (200 / 300) * 200, config.points[6], (275 / 300) * 200],-->
<!--      stroke: '#62829D',-->
<!--      strokeWidth: 2-->
<!--    }"></v-line>-->
<!--    &lt;!&ndash;    上行出站信号机指示线&ndash;&gt;-->
<!--    <v-line :config="{-->
<!--      points: [config.points[2], (25 / 300) * 200, config.points[2], 200 / 3],-->
<!--      stroke: '#62829D',-->
<!--      strokeWidth: 2-->
<!--    }"></v-line>-->
<!--    &lt;!&ndash;    下行出站信号机指示线&ndash;&gt;-->
<!--    <v-line :config="{-->
<!--      points: [config.points[4], (200 / 300) * 200, config.points[4], (275 / 300) * 200],-->
<!--      stroke: '#62829D',-->
<!--      strokeWidth: 2-->
<!--    }"></v-line>-->
<!--    &lt;!&ndash;    上行进站信号机公里标&ndash;&gt;-->
<!--    <v-text :config="{-->
<!--      x: config.points[0] - 29,-->
<!--      y: 10,-->
<!--      text: config.metaData.TOP_IN_BORDER,-->
<!--      fill: '#62829D',-->
<!--      fontSize: 16-->
<!--    }"></v-text>-->
<!--    &lt;!&ndash;    下行进站信号机公里标&ndash;&gt;-->
<!--    <v-text :config="{-->
<!--      x: config.points[4] - 29,-->
<!--      y: (275 / 300) * 200 - 10,-->
<!--      text: config.metaData.DOWN_IN_BORDER,-->
<!--      fill: '#62829D',-->
<!--      fontSize: 16-->
<!--    }"></v-text>-->
<!--    &lt;!&ndash;    上行出站信号机公里标&ndash;&gt;-->
<!--    <v-text :config="{-->
<!--      x: config.points[2] - 29,-->
<!--      y: 10,-->
<!--      text: config.metaData.TOP_OUT_BORDER,-->
<!--      fill: '#62829D',-->
<!--      fontSize: 16-->
<!--    }"></v-text>-->
<!--    &lt;!&ndash;    下行出站信号机公里标&ndash;&gt;-->
<!--    <v-text :config="{-->
<!--      x: config.points[6] - 29,-->
<!--      y: (275 / 300) * 200 - 10,-->
<!--      text: config.metaData.DOWN_OUT_BORDER,-->
<!--      fill: '#62829D',-->
<!--      fontSize: 16-->
<!--    }"></v-text>-->
  </v-group>
</template>

<script>
export default {
  name: "Index",
  props: {
    config: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    stationText() {
      let texts = []
      if (this.config.metaData.RAIL_TRAIN_NUM != 0) {
        texts.push(`轨道车${this.config.metaData.RAIL_TRAIN_NUM}台`)
      }
      if (this.config.metaData.staff) {
        if (this.config.metaData.staff.dw != 0) {
          texts.push(`电务${this.config.metaData.staff.dw}人`)
        }
        if (this.config.metaData.staff.gw != 0) {
          texts.push(`工务${this.config.metaData.staff.gw}人`)
        }
        if (this.config.metaData.staff.gd != 0) {
          texts.push(`供电${this.config.metaData.staff.gd}人`)
        }
      }
      return texts.join('\n')
    }
  }
}
</script>

<style scoped>

</style>
