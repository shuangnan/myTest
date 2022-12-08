<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-20 08:41:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-08 12:24:19
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\markerContainer\keYunMarkers\keYunMarker.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: 100%; width: 100%; cursor: pointer">
    <div :style="ky_sb_yl" v-if="type.includes('ky_sb_yl')" @click="handleMarkerClick"></div>
    <div :style="ky_sb_xf" v-if="type.includes('ky_sb_xf')"></div>
    <div :style="ky_sb_pcs" v-if="type.includes('ky_sb_pcs')"></div>
    <div :style="ky_sb_local_pcs" v-if="type.includes('ky_sb_local_pcs')"></div>
    <div :style="ky_sb_yjys" v-if="type.includes('ky_sb_yjys')"></div>
    <div :style="ky_sb_fdwz" v-if="type.includes('ky_sb_fdwz')"></div>
    <div :style="ky_sb_yjsscs" v-if="type.includes('ky_sb_yjsscs')"></div>
  </div>
</template>

<script>
import keYunMarkerStyles from "./keYunMarkerStyles";
export default {
  name: "keYunMarker",
  props: ["type", "marker-data"],
  data() {
    return {
      ...keYunMarkerStyles
    };
  },
  methods: {
    handleMarkerClick() {
      console.log(this.markerData);
    }
  }
};
</script>

<style>
</style>
