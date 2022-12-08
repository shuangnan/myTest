<template>
  <div style="height: 100%; width: 100%">
    <hy-sbss-yydszthwx v-if="type === 'hy_sbss_ydszthwx'" :type="type" :popper-data="popperData" />
    <hy-sbss-ycmzthwx v-if="type === 'hy_sbss_ycmzthwx'" :type="type" :popper-data="popperData" />
    <hy-sbss-ydsztzyx v-if="type === 'hy_sbss_ydsztzyx'" :type="type" :popper-data="popperData" />
    <hy-sbss-yjzzjgcl v-if="type === 'hy_sbss_yjzzjgcl'" :type="type" :popper-data="popperData" />
    <hy-sbss-yjzxll v-if="type === 'hy_sbss_yjzxll'" :type="type" :popper-data="popperData" />
    <hy-sbss-wjj v-if="type === 'hy_sbss_wjj'" :type="type" :popper-data="popperData" />
    <hy-sbss-zzj v-if="type === 'hy_sbss_zzj'" :type="type" :popper-data="popperData" />
    <hy-sbss-qzj v-if="type === 'hy_sbss_qzj'" :type="type" :popper-data="popperData" />
    <hy-sbss-lwyjqxjx v-if="type === 'hy_sbss_lwyjqxjx'" :type="type" :popper-data="popperData" />
    <hy-sbss-wxhyshwl v-if="type === 'hy_sbss_wxhyshwl'" :type="type" :popper-data="popperData" />
  </div>
</template>

<script>
import HySbssYcmzthwx
  from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssYcmzthwx";
import HySbssYydszthwx
  from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssYydszthwx";
import HySbssYdsztzyx
  from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssYdsztzyx";
import HySbssYjzzjgcl
  from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssYjzzjgcl";
import HySbssYjzxll
  from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssYjzxll";
import HySbssWjj from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssWjj";
import HySbssZzj from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssZzj";
import HySbssQzj from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssQzj";
import HySbssLwyjqxjx
  from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssLwyjqxjx";
import HySbssWxhyshwl
  from "@/components/map/components/webComponents/popperContainer/huoYunPoppers/huoYunPopper/hySbssWxhyshwl";
export default {
  name: "huoYunPopper",
  components: { HySbssWxhyshwl, HySbssLwyjqxjx, HySbssQzj, HySbssZzj, HySbssWjj, HySbssYjzxll, HySbssYjzzjgcl, HySbssYdsztzyx, HySbssYydszthwx, HySbssYcmzthwx },
  props: ['type', 'popper-data']
}
</script>

<style scoped>

</style>
