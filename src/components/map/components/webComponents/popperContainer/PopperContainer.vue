<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-20 08:41:12
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-08 12:24:10
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\popperContainer\PopperContainer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :style="{height: popperHeight + 'px', width: popperWidth + 'px'}">
    <dian-wu-popper v-if="type.includes('dw_')" :type="type" :popper-data="popperData" />
    <ke-yun-popper v-if="type.includes('ky_')" :type="type" :popper-data="popperData"></ke-yun-popper>
    <huo-yun-popper v-if="type.includes('hy_')" :type="type" :popper-data="popperData" />
    <emergency-popper v-if="type === 'emergency'" :popper-data="popperData" />
    <gong-wu-popper v-if="type.includes('gw_')" :type="type" :popper-data="popperData" />
  </div>
</template>

<script>
import popperContainerStyles from "./popperContainerStyles";
import DianWuPopper from "./dianWuPoppers/dianWuPopper.vue";
import KeYunPopper from "./keYunPoppers/keYunPopper";
import HuoYunPopper from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper";
import EmergencyPopper from "@/components/map/components/webComponents/popperContainer/emergencyPopper/emergencyPopper";
import GongWuPopper from "@/components/map/components/webComponents/popperContainer/gongWuPoppers/gongWuPopper";

export default {
  name: "PopperContainer",
  components: {
    GongWuPopper,
    EmergencyPopper,
    HuoYunPopper,
    KeYunPopper,
    DianWuPopper
  },
  props: ["type", "popper-data", "popper-width", "popper-height"],
  data() {
    return {
      ...popperContainerStyles
    };
  },
  methods: {}
};
</script>

<style scoped>
</style>
