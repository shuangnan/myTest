<template>
  <div style="height: 100%; width: 100%; cursor: pointer">
    <div :style="dw_4g" v-if="type.includes('dw_4g')" @click="handleMarkerClick"></div>
    <div :style="dw_gdsb" v-if="type.includes('dw_gdsb')" @click="handleMarkerClick"></div>
    <div :style="dw_lksb" v-if="type === 'dw_lksb'" @click="handleMarkerClick"></div>
    <div :style="dw_lksb_w" v-if="type.includes('dw_lksb_w')" @click="handleMarkerClick"></div>
    <div :style="dw_dccxsb" v-if="type.includes('dw_dccxsb')" @click="handleMarkerClick"></div>
    <div :style="dw_xhj" v-if="type.includes('dw_xhj')" @click="handleMarkerClick" />
    <div :style="dw_dx" v-if="type.includes('dw_dx')" @click="handleMarkerClick"></div>
    <div :style="dw_bpbl" v-if="type.includes('dw_bpbl')" @click="handleMarkerClick"></div>
  </div>
</template>

<script>
import dianwuMarkerStyles
  from "@/components/map/components/webComponents/markerContainer/dianWuMarkers/dianwuMarkerStyles";
import store from '@/store/index'
export default {
  name: "dianWuMarker",
  props: ['type', 'marker-data'],
  data() {
    return {
      ...dianwuMarkerStyles
    }
  },
  methods: {
    handleMarkerClick() {
      let mData = this.markerData.replace( /'/g, '"' )
      console.log(mData, this.type)
      switch (this.type) {
        case 'dw_lksb': {
          store.commit('dianwu/updateCurrentSelectItem', JSON.parse(mData))
          store.commit('dianwu/updateCurrentSelectedSb', JSON.parse(mData))
        } break
        case 'dw_lksb_w': {
          store.commit('dianwu/updateCurrentSelectItem', JSON.parse(mData))
          store.commit('dianwu/updateCurrentSelectedSb', JSON.parse(mData))
        } break
        default: {
          store.commit('dianwu/updateCurrentSelectedSb', JSON.parse(mData))
        } break
      }
      // store.commit('dianwu/updateCurrentSelectItem', JSON.parse(mData))
    }
  }
}
</script>

<style>
</style>
