<template>
  <div :style="getEqEffectMarkerContainer()" :title="name">
    <div>
      <span style="font-weight: bold; font-size: 16px">{{ name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "eqEffectMarker",
  data() {
    return {
    
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    section: {
      type: String,
      default: 'xs'
    }
  },
  methods: {
    getEqEffectMarkerContainer() {
      return {
        height: '18px',
        width: '65px',
        backgroundImage: `url(${require('./eqEffectMarkerImgs/' + this.section + 'Marker.png')})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'flex-start'
      }
    }
  }
}
</script>

<style scoped>

</style>
