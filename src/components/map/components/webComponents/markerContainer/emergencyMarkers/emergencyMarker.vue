<template>
  <div style="height: 100%; width: 100%; cursor: pointer">
    <div :style="getStyle()"></div>
  </div>
</template>

<script>
export default {
  name: "emergencyMarker",
  data() {
    return {
    
    }
  },
  methods: {
    imageLoader(filename) {
      return require(__dirname + '/' + filename)
    },
    getStyle() {
      return {
        height: '83px',
        width: '83px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url('${this.imageLoader('emergencyMarkerN.png')}')`
      }
    }
  }
}
</script>

<style scoped>

</style>
