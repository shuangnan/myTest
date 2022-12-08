<template>
  <div style="height: 600px; width: 100%; display: flex; flex-direction: row">
    <div style="height: 600px; width: 100%">
      <el-carousel trigger="click" height="600px" :autoplay="false">
        <el-carousel-item v-for="(pic, index) in imgs" :key="index">
          <div style="display: flex; height: 100%; width: 100%">
            <div v-if="getFileType(pic) === 'image'" style="height: 100%; width: 75%; display: flex; align-items: center; justify-content: center">
              <img :src="getPreviewPic(pic)" style="height: auto; width: auto; max-height: 100%; max-width: 100%" />
            </div>
            <div v-else style="width: 75%; height: 100%; display: flex; align-items: center; justify-content: center">
              <video :src="pic" style="width: auto; height: auto; max-width: 100%; max-height: 100%" controls></video>
            </div>
            <div style="height: 600px; width: 25%; padding: 10px" class="detail">
              <h3>详细信息</h3>
              <p>上传描述: {{ detail.UPLOAD_DESCRIBE }}</p>
              <p>上传人: {{ detail.EM_NAME }}</p>
              <p>上传人电话: {{ detail.EM_PHONE }}</p>
              <p>上传时间: {{ detail.UPLOAD_DATE }}</p>
              <p>文件类型: {{ getFileType(pic) === 'image' ? '图片' : '视频' }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: "picSwiper",
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imgs: [],
      desc: {}
    }
  },
  watch: {
    'detail': {
      handler: function (newVal) {
        if (JSON.stringify(newVal) === '{}') {
          return
        }
        let imgs = []
        newVal.FILES.map((f) => {
          imgs.push(f.IN_URL)
        })
        this.imgs = imgs
        this.detail = newVal
        console.log(this.imgs, this.detail)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getFileType(filename) {
      filename = filename.toUpperCase()
      if (
        filename.includes('.MPG') ||
        filename.includes('.MPEG') ||
        filename.includes('.MP4') ||
        filename.includes('.AVI') ||
        filename.includes('.RM') ||
        filename.includes('.RMVB') ||
        filename.includes('.MOV') ||
        filename.includes('.WMV') ||
        filename.includes('.ASF') ||
        filename.includes('.M4V') ||
        filename.includes('.MPE') ||
        filename.includes('.MPA')
      ) {
        return 'video'
      } else {
        return 'image'
      }
    },
    getPreviewPic(url) {
      let preViewHost = window.location.protocol.includes('https') ? 'https://10.192.6.233:19060/FileUpload/services/LoadPDFFile?fileUrl=' : 'http://10.192.6.233:9060/FileUpload/services/LoadPDFFile?fileUrl='
      let target = preViewHost + btoa(url) + '&mark=' + this.$store.state.params.UserName + '-' + this.$store.state.params.UserPID.substr(14, 4)
      // console.log('http://10.192.6.233:9060/FileUpload/services/LoadPDFFile?fileUrl=' + btoa(url) + '&mark=123456789')
      console.log(target)
      return target
    }
  }
}
</script>

<style scoped>

</style>
