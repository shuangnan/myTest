<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
    <div :style="logoContainerStyle">
      <div :style="getLogoStyle()"></div>
      <div :style="titleContainerStyle">
        <span style="font-size: 16px; font-weight: bold">有端式站台货物线</span>
        <span style="margin-top: 5px; font-weight: bold">{{ content.DW }}</span>
      </div>
    </div>
    <div :style="contentContainerStyle">
      <div v-for="(desc, index) in descDic" :key="index" style="font-size: 14px; display: flex">
        <div style="width: 50%">{{ desc.text }}</div>
        <div style="color: #FDA629; width: 50%">{{ content[desc.key] === '' ? '暂无' : content[desc.key] }}</div>
      </div>
      <div style="width: 100%; height: auto; display: flex;">
        <div v-for="(image, i) in photoList" :key="'image' + i" style="margin-left: 5px" @click="handleImagePreview(image)">
          <img style="height: 100px; width: auto" :src="image" />
        </div>
      </div>
    </div>
    <el-dialog
      v-el-drag-dialog
      :append-to-body="true"
      :visible.sync="showPhotoPreview"
      title="查看图片"
      top="3vh"
      width="1100px"
    >
      <div style="height: 600px; width: 100%; display: flex; flex-direction: row">
        <div style="height: 600px; width: 100%">
          <el-carousel trigger="click" height="600px" :autoplay="false">
            <el-carousel-item v-for="(pic, index) in photoList" :key="index">
              <div style="display: flex; height: 100%; width: 100%">
                <div style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center">
                  <img :src="pic" style="height: auto; width: auto; max-height: 100%; max-width: 100%" />
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-dragDialog";
export default {
  name: "hySbssYydszthwx",
  props: ['type', 'popper-data'],
  directives: {
    elDragDialog
  },
  data() {
    return {
      commonStyles: {
        height: '78px',
        width: '85.3px',
        backgroundSize: '100% 100%',
        backgroundColor: 'none',
        backgroundRepeat: 'no-repeat'
      },
      logoContainerStyle: {
        height: '78px',
        width: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row'
      },
      titleContainerStyle: {
        height: '100%',
        width: 'calc(100% - 85.3px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      contentContainerStyle: {
        height: 'calc(100% - 78px)',
        width: 'calc(100% - 20px)',
        padding: '10px',
        borderTop: '1px solid gray',
      },
      descDic: [
        {
          key: 'STATION',
          text: '站名'
        },
        {
          key: 'LOCATION',
          text: '所属行政区域'
        },
        {
          key: 'LINE',
          text: '线路名称'
        },
        {
          key: 'ENABLE_LENGTH',
          text: '有效长(m)'
        },
        {
          key: 'CAR_CAPACITY',
          text: '客车数(辆)'
        }
      ],
      content: {},
      firstImage: '',
      photos: [],
      showPhotoPreview: false
    }
  },
  computed: {
    firstPhoto() {
      if (this.photos.length === 0) {
        return ''
      } else {
        console.log('HAS PHOTO')
        return this.photos[0]
      }
    },
    photoList() {
      return this.photos
    }
  },
  mounted () {
    if (this.popperData === '' || this.popperData === undefined) {
      return
    } else {
      this.initData()
      // this.logo = require(__dirname, '/dwsbPopperLogos/天窗-大.png')
    }
  },
  methods: {
    getLogoStyle() {
      return {
        ...this.commonStyles,
        backgroundImage: `url('${this.loadImage(this.type + '.png')}')`
      }
    },
    loadImage(filename) {
      return require(__dirname + '/huoYunPopperLogos/' + filename)
    },
    initData() {
      let popperStr = this.popperData.replace( /'/g, '"' )
      console.log( '获取信息', popperStr )
      let popper = JSON.parse( popperStr )
      this.content = popper
      this.getPhotos()
    },
    getPhotos() {
      if (this.content.PHOTO === undefined) {
        return []
      } else {
        let photos = this.content.PHOTO
        let photoUrls = photos.split('@@@')
        let images = []
        photoUrls.map((u) => {
          images.push(u.split('|')[2])
        })
        console.log(images)
        // this.firstImage = images[0]
        this.photos = images
        // return images
      }
    },
    handleImagePreview() {
      this.showPhotoPreview = true
    }
  }
}
</script>

<style scoped>
>>>.el-image__inner {
  width: 100px !important;
}
</style>
