<template>
  <div style="height: 100%; width: 100%; cursor: pointer; z-index: 30">
    <div :style="getStyle()"></div>
  </div>
</template>

<script>
export default {
  name: "huoYunMarker",
  props: ['type', 'marker-data'],
  data() {
    return {
      commonStyles: {
        height: '35px',
        width: '30px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat',
      }
    }
  },
  methods: {
    getStyle() {
      return {
        ...this.commonStyles,
        backgroundImage: `url('${this.loadImage(this.type + '.png')}')`
      }
    },
    loadImage(imageName) {
      let img = require(__dirname + '/huoYunMarkerImgs/' + imageName)
      // console.log(img)
      return img
    }
  }
}
</script>

<style scoped>

</style>
