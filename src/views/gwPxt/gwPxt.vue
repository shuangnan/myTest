<template>
  <div style="width: 100%; height: 100%; display: flex; background: white">
    <div style="width: 20%; height: 100%; display: flex; flex-direction: column; align-items: flex-start; align-content: flex-start; margin-top: 20px">
      <div v-for="(file, index) in pxt" :key="index">
        <div style="background-color: white; height: 40px; display: flex; align-items: center; width: auto">
          <span style="cursor: pointer; font-size: 16px;" :style="{fontWeight: selectedIndex === index ? 'bold' : 'normal'}" @click="changePreview(file.FILE_URL, index)">
            <i class="el-icon-document"></i>
            {{ file.FILE_NAME }}
          </span>
        </div>
      </div>
    </div>
    <div style="width: 80%; height: 100%">
      <iframe :src="url" style="width: 100%; height: 100%"></iframe>
    </div>
  </div>
</template>

<script>
import pdfUtil from '../../assets/pdfPreviewer.js'
export default {
  props: {
    pxt: Array
  },
  data() {
    return {
      url: '',
      selectedIndex: 0
    }
  },
  mounted() {
    if (this.pxt[0].FILE_URL === undefined) {
      this.$message.warning('未查询到配线图信息')
    }
    let first = this.pxt[0].FILE_URL
    this.changePreview(first)
    this.selectedIndex = 0
  },
  methods: {
    changePreview(url, index) {
      this.selectedIndex = index
      console.log(url)
      pdfUtil.getPDFPreviewBlob(url).then((r) => {
        this.url = r
        console.log(this.url)
      })
    }
  },
  watch: {
    'pxt': {
      handler: function(newVal) {
        if (newVal === undefined) {
          return
        }
        if (newVal[0].FILE_URL === undefined) {
          this.$message.warning('未查询到配线图信息')
        }
        this.changePreview(newVal[0].FILE_URL.replace('http://10.192.6.233:9090', 'https://10.192.6.233:19090'))
        this.selectedIndex = 0
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
