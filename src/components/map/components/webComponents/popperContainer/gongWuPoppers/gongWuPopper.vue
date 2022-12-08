<template>
  <div style="height: 100%; width: 100%">
    <gw-llxc-popper v-if="type==='gw_llxc'" :popper-data="popperData" />
    <gw-splc-popper v-if="type==='gw_slpc'" :popper-data="popperData" />
  </div>
</template>

<script>
import GwLlxcPopper from "@/components/map/components/webComponents/popperContainer/gongWuPoppers/gwLlxcPopper";
import GwSplcPopper from "@/components/map/components/webComponents/popperContainer/gongWuPoppers/gwSlpcPopper";
export default {
  name: "gongWuPopper",
  components: { GwSplcPopper, GwLlxcPopper },
  props: ['type', 'popper-data']
}
</script>

<style scoped>

</style>
