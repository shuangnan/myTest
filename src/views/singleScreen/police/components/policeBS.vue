<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-21 16:18:58
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-10-25 17:51:49
 * @FilePath: \JFLCMS_MAP\src\views\singleScreen\police\components\policeMainData.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div style="height:100%;">
      <!-- 图片轮播 -->
      <el-carousel height="500px" indicator-position="outside">
        <el-carousel-item v-for="item in pics" :key="item.id" width="100%" height="100%">
          <img margin-left="30px" :src="item.src" width="1000px" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

  

<script>
import C from "../../../../assets/com.js";

export default {
  data() {
    return {
      pics: [], // 图片路径地址
      bannerH: 800
    };
  },

  props: {
    source: {
      type: Object,
      default: () => {
        return {};
      }
    }
    // this.source.PICS
  },

  created() {
    // 获取图像列表

    // "http://10.192.6.110:9090/TRDM"+
    this.pics = [];
    let picture = this.source.PICS.split("@");
    // console.log("#######################pictrue：", picture);
    let len = picture.length;
    for (let i = 0; i < len; i++) {
      let pict = {
        id: String(i),
        src: C.ADDS.url_34_79 + "/TRDM" + picture[i]
      };

      this.pics.push(pict);
    }
    // picture.forEach(item => {
    //   this.pics.push("http://10.192.6.110:9090/TRDM" + item);
    // });
    console.log("#######################pictrue：", this.pics);
  },

  methods: {
    setBannerH() {
      this.bannerH = document.body.clientWidth;
    }
  },

  watch: {},

  mounted() {
    // window.addEventListener(
    //   "resize",
    //   () => {
    //     this.setBannerH();
    //   },
    //   false
    // );
  }
};
</script>

<style scoped="scoped">
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
