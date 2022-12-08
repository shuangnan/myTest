<template>
  <div
    style="position:absolute;top:calc(50% - 300px);left:calc(50% - 400px);font-size: 30px;color:#658bef;font-weight: bold"
  >
    <img
      src="http://10.192.4.168/SSOP/publicRack/img/building.jpg"
      style="width:800px;height:600px;"
      :style="{opacity:opacity}"
    />
  </div>
</template>

<script>
export default {
  created() {

  },
  props: {
    opacity: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {

    };
  },
  methods: {

  },
  computed: {},
  components: {
  }
};
</script>
<style scoped>
</style>
