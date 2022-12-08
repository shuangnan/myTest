<template>
  <div style="height: 100%; width: 100%; cursor: pointer">
    <div v-if="type === 'gw_llxc'" :style="gw_llxc"></div>
    <div v-if="type === 'gw_slpc'" :style="gw_slpc"></div>
  </div>
</template>

<script>
import gongWuMarkerStyles
  from "@/components/map/components/webComponents/markerContainer/gongWuMarkers/gongWuMarkerStyles";
export default {
  name: "gongWuMarker",
  props: ['type'],
  data() {
    return {
      ...gongWuMarkerStyles
    }
  }
}
</script>

<style scoped>

</style>
