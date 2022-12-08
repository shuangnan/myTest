<template>
  <v-group>
    <!--    区间范围-->
    <v-line :config="{
      points: [
        config.start,
        config.metaData.DIRECTION === '上' ? (99 / 300) * 200 : (202 / 300) * 200,
        config.start,
        config.metaData.DIRECTION === '上' ? (49 / 300) * 200 : (252 / 300) * 200,
        config.end,
        config.metaData.DIRECTION === '上' ? (49 / 300) * 200 : (252 / 300) * 200,
        config.end,
        config.metaData.DIRECTION === '上' ? (99 / 300) * 200 : (202 / 300) * 200,
      ],
      closed: true,
      fill: config.metaData.TYPE === '0' ? 'rgba(251, 221, 31, 0.6)' : 'rgba(225, 81, 59, 0.6)',
      stroke: 'white'
    }"></v-line>
    <!--    起点公里标指示-->
    <v-text :config="{
      x: config.start,
      y: config.metaData.DIRECTION === '上' ? (50 / 300) * 200 : (236 / 300) * 200,
      text: config.metaData.S_MILE,
      fontSize: 16,
      fill: '#62829D'
    }"></v-text>
    <!--    终点公里标指示-->
    <v-text :config="{
      x: config.end - 58,
      y: config.metaData.DIRECTION === '上' ? (50 / 300) * 200 : (236 / 300) * 200,
      text: config.metaData.E_MILE,
      fontSize: 16,
      fill: '#62829D'
    }"></v-text>
    <v-text :config="{
      x: (config.start + config.end) / 2,
      y: config.metaData.DIRECTION === '上' ? (65 / 300) * 200 : (220 / 300) * 200,
      text: config.metaData.ENVIRONMENT,
      fontSize: 20,
      fill: '#62829D',
      fontStyle: 'bold'
    }">
    </v-text>
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
  }
}
</script>

<style scoped>

</style>
