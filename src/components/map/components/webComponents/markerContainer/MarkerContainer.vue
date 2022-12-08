<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-22 15:05:50
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-23 10:53:53
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\markerContainer\MarkerContainer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :style="markerContainer">
    <dian-wu-marker @click="handleMarkerClick('dw')" v-if="type.includes('dw_')" :type="type" :marker-data="markerData" />
    <ke-yun-marker v-if="type.includes('ky_')" :type="type" :marker-data="markerData" />
    <eq-marker v-if="type === 'eq'" :type="type" :marker-data="markerData" />
    <huo-yun-marker v-if="type.includes('hy_')" :type="type" :marker-data="markerData" />
    <emergency-marker v-if="type === 'emergency'" />
    <eq-effect-marker v-if="type === 'eqEffect'" :name="markerData" :section="section" />
    <gong-wu-marker v-if="type.includes('gw_')" :type="type" />
    <gong-an-marker @click="handleMarkerClick('pcs')" v-if="type.includes('wu_pcs') || type.includes('wu_yxjg') || type.includes('wu_sb')" :type="type" :marker-data="markerData" :zoom="zoom" />
    <single-marker v-if="type.includes('single_marker')" :type="type" :marker-data="markerData" />
  </div>
</template>

<script>
import DianWuMarker from "./dianWuMarkers/dianWuMarker.vue";
import markerContainerStyles from "@/components/map/components/webComponents/markerContainer/markerContainerStyles";
import KeYunMarker from "./keYunMarkers/keYunMarker";
import EqMarker from "./eqMarkers/eqMarker";
import HuoYunMarker from "@/components/map/components/webComponents/markerContainer/huoYunMarkers/huoYunMarker";
import EmergencyMarker from "@/components/map/components/webComponents/markerContainer/emergencyMarkers/emergencyMarker";
import EqEffectMarker from "@/components/map/components/webComponents/markerContainer/eqEffectMarkers/eqEffectMarker";
import GongWuMarker from "@/components/map/components/webComponents/markerContainer/gongWuMarkers/gongWuMarker";
import store from "../../../../../store/index";
import GongAnMarker from "@/components/map/components/webComponents/markerContainer/gongAnMarkers/gongAnMarker";
import SingleMarker from "@/components/map/components/webComponents/markerContainer/gongAnMarkers/singleMarker";

export default {
  name: "MarkerContainer",
  components: {
    GongWuMarker,
    EqEffectMarker,
    EmergencyMarker,
    HuoYunMarker,
    EqMarker,
    KeYunMarker,
    DianWuMarker,
    GongAnMarker,
    SingleMarker
  },
  props: ["type", "marker-data", "section", "zoom"],
  data() {
    return {
      ...markerContainerStyles
    };
  },
  methods: {
    handleMarkerClick(type) {
      console.log("MARKER CLICK", type, this.markerData);
      switch (type) {
        case "dw":
          {
            store.commit("dianwu/updateCurrentSelectedSb", this.markerData);
          }
          break;
        case "pcs":
          console.log("zoom", this.zoom);
          break;
      }
    }
  }
};
</script>

<style>
</style>
