<template>
  <div style="width: 100%; height: 100%">
    <gw-pxt v-if="pxts.length !== 0" :pxt="pxts" />
    <h1 v-else>未指定业务系统</h1>
  </div>
</template>

<script>
import GwPxt from "@/views/gwPxt/gwPxt";
export default {
  name: "index.vue",
  components: { GwPxt },
  data() {
    return {
      pxts: []
    }
  },
  mounted () {
    let type = this.$store.state.params.type
    this.pxts = this.getRangeGraphFileUrl(type)
  },
  methods: {
    getRangeGraphFileUrl ( type ) {
      switch (type) {
        case '运输':
          return [
            {
              FILE_NAME: '0_20220620全局示意图.pdf',
              FILE_URL: 'https://10.192.6.233:19090/group3/20220601/data/0_20220620全局示意图.pdf'
            }
          ]
        case '供电':
          return [
            {
              FILE_NAME: '成都铁路局集团公司供电管辖示意图（20211122）.pdf',
              FILE_URL: 'https://10.192.6.233:19090/group3/20211122/data/成都铁路局集团公司供电管辖示意图（20211122）.pdf'
            },
            {
              FILE_URL: 'https://10.192.6.233:19090/group3/20211215/data/成都局供电示意图（枢纽放大图）.pdf',
              FILE_NAME: '成都局供电示意图（枢纽放大图）.pdf'
            }
          ]
        case '电务':
          return [
            {
              FILE_URL: 'https://10.192.6.233:19090/group3/20211123/data/0_成都局电务系统管辖示意图20211123.pdf',
              FILE_NAME: '0_成都局电务系统管辖示意图20211123.pdf'
            }
          ]
        case '工务':
          return [
            {
              FILE_URL: 'https://10.192.6.233:19090/group3/20210211/data/成都局示意图202005(工务段).pdf',
              FILE_NAME: '成都局示意图202005(工务段).pdf'
            }
          ]
        default:
          return []
      }
    },
  }
}
</script>

<style scoped>

</style>
