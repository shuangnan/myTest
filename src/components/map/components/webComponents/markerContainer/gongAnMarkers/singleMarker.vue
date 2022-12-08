<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-20 08:41:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-22 17:33:19
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\markerContainer\keYunMarkers\keYunMarker.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: 100%; width: 100%; cursor: pointer">
    <div :style="single_marker" v-if="type.includes('single_marker')" @click="handleMarkerClick"></div>
    <!-- 把label定成200px，然后margin-left:-100+图片的一半！保证居中  -->
    <label style="color:black; width:200px; display:inline-block;text-align:center;margin: -81px;font-weight:bold;">{{markerData}}</label>
  </div>
</template>

<script>
import GongAnMarkerStyles from "./gongAnMarkerStyles";
export default {
  name: "PcsMarker",
  props: ["type", "marker-data"],
  data() {
    return {
      ...GongAnMarkerStyles
    };
  },

  methods: {
    handleMarkerClick() {
      console.log("this.markerData", this.markerData);
    }
  }
};
</script>

<style>
</style>
