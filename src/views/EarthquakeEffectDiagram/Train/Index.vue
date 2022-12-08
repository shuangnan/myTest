<template>
  <v-group @mousedown="handleTrainHover">
    <v-rect :config="{
      x: config.metaData.DIRECTION === '上' ? (config.point - (config.metaData.TRAIN.length * 10) / 2 + 29 * 1) : (config.point - (config.metaData.TRAIN.length * 10) / 2),
      y: config.metaData.DIRECTION === '上' ? (82 / 300) * 200 : (200 / 300) * 200,
      scaleX: config.metaData.DIRECTION === '上' ? -1 : 1,
      fill: 'rgba(255, 255, 255, 0.9)',
      width: 29 * 2,
      height: 11 * 1
    }"></v-rect>
    <v-image :config="{
      image: trainIcon,
      x: config.metaData.DIRECTION === '上' ? (config.point - (config.metaData.TRAIN.length * 10) / 2 + 29 * 1) : (config.point - (config.metaData.TRAIN.length * 10) / 2),
      y: config.metaData.DIRECTION === '上' ? (82 / 300) * 200 : (200 / 300) * 200,
      scaleX: config.metaData.DIRECTION === '上' ? -1 : 1,
      height: 11 * 1,
      width: 29 * 1
    }"></v-image>
    <v-text :config="{
      x: config.metaData.DIRECTION === '上' ? (config.point - (config.metaData.TRAIN.length * 10) / 2 - 29 * 1 - 3) : (config.point - (config.metaData.TRAIN.length * 10) / 2 + 29 * 1) ,
      y: config.metaData.DIRECTION === '上' ? (85 / 300) * 200 : (203 / 300) * 200,
      text: config.metaData.TRAIN,
      fontSize: 12,
      fill: '#0F50B1',
      fontStyle: 'bold'
    }"></v-text>
    <v-line v-if="trainHover" :config="{
      points: [
        config.point - (config.metaData.TRAIN.length * 10) / 2 - 5,
        105 - 50,
        config.point - (config.metaData.TRAIN.length * 10) / 2 - 5 + 300,
        105 - 50,
        config.point - (config.metaData.TRAIN.length * 10) / 2 - 5 + 300,
        195 - 50,
        config.point - (config.metaData.TRAIN.length * 10) / 2 - 5,
        195 - 50,
      ],
      closed: true,
      lineJoin: 'round',
      lineCap: 'round',
      fill: 'rgba(0, 0, 0, 0.7)',
      stroke: 'white',
      tension: '0'
    }"></v-line>
    <v-text v-if="trainHover" :config="{
      x: config.point - (config.metaData.TRAIN.length * 10),
      y: (105 / 300) * 200 - 25,
      text: getTrainInfo(),
      fontSize: 14,
      fill: 'white'
    }"></v-text>
  </v-group>
</template>

<script>
export default {
  name: 'Train',
  props: {
    config: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      trainHover: false,
      clicked: false,
      trainIcon: null
    }
  },
  methods: {
    handleTrainHover () {
      this.clicked = !this.clicked
      this.trainHover = this.clicked
    },
    getTrainInfo () {
      return `
      状态：${ this.config.metaData.LOCAL_FLAG === '1' ? '区间' : '在站' }\n
      运行区间：${ this.config.metaData.CURRNAME }(${ this.config.metaData.O_KM }) - ${ this.config.metaData.NEXTNAME }(${ this.config.metaData.E_KM })\n
      下一站预计到达：${ this.config.metaData.NEXTDDSJ }
      `
    }
  },
  mounted () {
    let image = new window.Image()
    // let src = `../img/train${this.config.metaData.TRAIN_TYPE}.png`
    image.src = require( "../img/train" + this.config.metaData.TRAIN_TYPE + ".png" )
    this.trainIcon = image
  }
}
</script>
