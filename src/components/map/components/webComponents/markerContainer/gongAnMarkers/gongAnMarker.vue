<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-20 08:41:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-23 10:56:17
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\markerContainer\keYunMarkers\keYunMarker.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: 100%; width: 100%; cursor: pointer">
    <div :style="wu_pcs_dfpcs" v-if="type.includes('wu_pcs_dfpcs')"></div>
    <div :style="wu_pcs_tlpcs" v-if="type.includes('wu_pcs_tlpcs')"></div>
    <div :style="wu_pcs_jjing" v-if="type.includes('wu_pcs_jjing')" @click="handleMarkerClick"></div>
    <div :style="wu_pcs_jjiang" v-if="type.includes('wu_pcs_jjiang')"></div>
    <div :style="wu_pcs_jzang" v-if="type.includes('wu_pcs_jzang')"></div>
    <div :style="wu_pcs_kysn" v-if="type.includes('wu_pcs_kysn')"></div>
    <div :style="wu_pcs_kya" v-if="type.includes('wu_pcs_kya')"></div>
    <div :style="wu_pcs_kyb" v-if="type.includes('wu_pcs_kyb')"></div>
    <div :style="wu_pcs_kyc" v-if="type.includes('wu_pcs_kyc')"></div>
    <div :style="wu_pcs_linea" v-if="type.includes('wu_pcs_linea')"></div>
    <div :style="wu_pcs_lineb" v-if="type.includes('wu_pcs_lineb')"></div>
    <div :style="wu_pcs_linec" v-if="type.includes('wu_pcs_linec')"></div>

    <div :style="wu_yxjg_dfpcs" v-if="type.includes('wu_yxjg_dfpcs')"></div>
    <div :style="wu_yxjg_hospital" v-if="type.includes('wu_yxjg_hospital')"></div>
    <div :style="wu_yxjg_school" v-if="type.includes('wu_yxjg_school')"></div>
    <div :style="wu_yxjg_tlnb" v-if="type.includes('wu_yxjg_tlnb')"></div>
    <div :style="wu_sb_bridge" v-if="type.includes('wu_sb_bridge')"></div>

    <!-- <div :style="wu_sb_bridge" v-if="type.includes('wu_sb_bridge')"></div> -->
  </div>
</template>

<script>
import GongAnMarkerStyles from "./gongAnMarkerStyles";
export default {
  name: "PcsMarker",
  props: ["type", "marker-data", "zoom"],
  data() {
    return {
      ...GongAnMarkerStyles
    };
  },
  methods: {
    handleMarkerClick() {
      console.log("this.markerData", this.markerData);
      console.log("zoom", this.zoom);
      console.log("type", this.type);
    }
  }
};
</script>

<style>
</style>
