<template>
  <div :style="eqContainer">
    <p :style="eqText">{{ JSON.parse(markerData.replace(/'/g, '"')).EQ_LOCATION || '' }}</p>
    <p :style="eqText">{{ JSON.parse(markerData.replace(/'/g, '"')).EQ_LEVEL || '' }}</p>
    <div :style="getEqCenter()"></div>
  </div>
</template>

<script>
export default {
  name: "eqMarker.vue",
  props: {
    markerData: {
      type: String,
      default: '{}'
    }
  },
  data() {
    return {
      eqContainer: {
        height: 'auto',
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
      },
      eqText: {
        fontSize: '20px',
        fontWeight: 'bold',
        backgroundImage: '-webkit-linear-gradient(bottom, white, red)',
        webkitBackgroundClip: 'text',
        webkitTextFillColor: 'transparent',
        width: '200px',
        textAlign: 'center',
        margin: '0'
      },
    }
  },
  methods: {
    getEqCenter() {
      // console.log(require('./eqMarkerImgs/EqCenter.png'))
      return {
        backgroundImage: `url(${require('./eqMarkerImgs/EqCenter.png')})`,
        width: '83px',
        height: '40px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat'
      }
    }
  },
  mounted () {
    console.log(this.markerData)
  }
}
</script>

<style scoped>

</style>
