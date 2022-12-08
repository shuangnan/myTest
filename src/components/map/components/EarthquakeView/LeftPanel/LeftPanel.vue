<template>
  <div class="left-panel-container">
    <div class="earthquake-brief">
      <earthquake-brief />
    </div>
    <div class="earthquake-effects">
      <earthquake-effects />
    </div>
  </div>
</template>

<script>
import EarthquakeBrief from "@/components/map/components/EarthquakeView/LeftPanel/EarthquakeBrief";
import EarthquakeEffects
  from "@/components/map/components/EarthquakeView/LeftPanel/EarthquakeEffects/EarthquakeEffects";
export default {
  name: "LeftPanel",
  components: {EarthquakeEffects, EarthquakeBrief}
}
</script>

<style scoped>
.left-panel-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.earthquake-brief {
  width: 100%;
  height: 20%;
}

.earthquake-effects {
  width: 100%;
  height: calc(100% - 20%);
}
</style>