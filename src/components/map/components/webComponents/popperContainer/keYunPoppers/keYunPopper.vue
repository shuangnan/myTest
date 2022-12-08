<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-20 08:41:12
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-08 12:23:55
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\popperContainer\keYunPoppers\keYunPopper.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: 100%; width: 100%">
    <ky-sb-yl-popper v-if="type === 'ky_sb_yl'" :type="type" :popper-data="popperData" />
    <ky-sb-xf-popper v-if="type === 'ky_sb_xf'" :type="type" :popper-data="popperData" />
    <ky-sb-pcs-popper v-if="type === 'ky_sb_pcs'" :type="type" :popper-data="popperData" />
    <ky-sb-pcs-popper v-if="type === 'ky_sb_local_pcs'" :type="type" :popper-data="popperData" />
    <ky-sb-yjys-popper v-if="type === 'ky_sb_yjys'" :type="type" :popper-data="popperData" />
    <ky-sb-fdwz-popper v-if="type === 'ky_sb_fdwz'" :type="type" :popper-data="popperData" />
    <ky-sb-yjsscs-popper v-if="type === 'ky_sb_yjsscs'" :type="type" :popper-data="popperData" />
  </div>
</template>

<script>
import KySbYlPopper from "./kysbPopper/kySbYlPopper";
import KySbXfPopper from "./kysbPopper/kySbXfPopper";
import KySbPcsPopper from "./kysbPopper/kySbPcsPopper";
import KySbYjysPopper from "@/components/map/components/webComponents/popperContainer/keYunPoppers/kysbPopper/kySbYjysPopper";
import KySbFdwzPopper from "@/components/map/components/webComponents/popperContainer/keYunPoppers/kysbPopper/kySbFdwzPopper";
import KySbYjsscsPopper from "@/components/map/components/webComponents/popperContainer/keYunPoppers/kysbPopper/kySbYjsscsPopper";
export default {
  name: "keYunPopper",
  components: {
    KySbYjsscsPopper,
    KySbFdwzPopper,
    KySbYjysPopper,
    KySbPcsPopper,
    KySbXfPopper,
    KySbYlPopper
  },
  props: ["type", "popper-data"]
};
</script>

<style scoped>
</style>
