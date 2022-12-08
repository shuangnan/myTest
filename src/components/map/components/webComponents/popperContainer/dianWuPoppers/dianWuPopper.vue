<template>
  <div style="height: 100%; width: 100%">
    <dw-gdsb-popper v-if="type === 'dw_gdsb'" :type="type" :popper-data="popperData" />
    <dw-lksb-popper v-if="type === 'dw_lksb'" :type="type" :popper-data="popperData" />
    <dw-lksbw-popper v-if="type === 'dw_lksb_w'" :type="type" :popper-data="popperData" />
    <dw4g-popper v-if="type === 'dw_4g'" :type="type" :popper-data="popperData" />
    <dw-dccxsb-popper v-if="type === 'dw_dccxsb'" :type="type" :popper-data="popperData" />
    <dw-dx-popper v-if="type === 'dw_dx'" :type="type" :popper-data="popperData" />
    <dw-xhj-popper v-if="type === 'dw_xhj'" :type="type" :popper-data="popperData" />
    <dw-bpbl-popper v-if="type === 'dw_bpbl'" :type="type" :popper-data="popperData" />
  </div>
</template>

<script>
import Dw4gPopper from "./dwsbPopper/dw4gPopper";
import DwGdsbPopper from "./dwsbPopper/dwGdsbPopper";
import DwLksbPopper from "./dwsbPopper/dwLksbPopper";
import DwDccxsbPopper from "./dwsbPopper/dwDccxsbPopper.vue"
import DwLksbwPopper
  from "@/components/map/components/webComponents/popperContainer/dianWuPoppers/dwsbPopper/dwLksbwPopper";
import DwDxPopper from "@/components/map/components/webComponents/popperContainer/dianWuPoppers/dwsbPopper/dwDxPopper";
import DwXhjPopper
  from "@/components/map/components/webComponents/popperContainer/dianWuPoppers/dwsbPopper/dwXhjPopper";
import DwBpblPopper
  from "@/components/map/components/webComponents/popperContainer/dianWuPoppers/dwsbPopper/dwBpblPopper";
export default {
  name: "dianWuPopper",
  components: { DwBpblPopper, DwXhjPopper, DwDxPopper, DwLksbwPopper, Dw4gPopper, DwGdsbPopper, DwLksbPopper, DwDccxsbPopper },
  props: ['type', 'popper-data']
}
</script>

<style scoped>

</style>
