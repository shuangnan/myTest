<template>
  <div
    id="diagram-container"
    style="height: 100vh; width: 100vw; overflow-x: hidden; overflow-style: marquee-block; background-color: #656E77">
    <div style="margin: 10px">
      <el-button size="mini" type="primary" @click="exportDiagram">打印</el-button>
    </div>
    <EffectLine v-for="(line, index) in diagramData" :key="index" :line-data="line" style="margin-bottom: 20px"/>
  </div>
</template>

<script>
import EffectLine from './Line/Index'
import com from '@/assets/com'
import html2canvas from 'html2canvas'

export default {
  name: "Index",
  components: {
    EffectLine
  },
  data () {
    return {
      diagramData: []
    }
  },
  mounted () {
    // this.diagramData = dummy
    this.init()
  },
  methods: {
    init() {
      this.getEffectData()
    },
    getEffectData() {
      const eqid = this.$store.state.params.id
      console.log('EQID', eqid)
      com.getData({
        c: 'eqeh_zxy9010',
        s: [eqid],
        w: ['all'],
        url: 'https://10.192.126.203/GeneralProServlet'
      }, (res) => {
        const r = res.data[0].filter((s) => {
          return s.STATIONS.length !== 0 && s.SECTIONS.length !== 0
        })
        console.log('获取影响范围示意图数据', r)
        this.diagramData = this.transformResponse(r)
      })
    },
    transformResponse(data) {
      return JSON.parse(JSON.stringify(data).replace(/STATIONS/g, 'stations').replace(/SECTIONS/g, 'sections').replace(/TRAINS/g, 'trains'))
    },
    async exportDiagram() {
      this.generatePrintDom().then((dom) => {
        console.log(dom)
        dom.style.height = '400px'
        document.body.appendChild(dom)
        html2canvas(dom, {
          logging: false,
          width: dom.scrollWidth,
          height: dom.scrollHeight,
          windowWidth: dom.scrollWidth,
          windowHeight: dom.scrollHeight
        }).then(function (canvas) {
          console.log(canvas)
          let link = document.createElement('a')
          link.download = 'stage.png'
          link.href = canvas.toDataURL()
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      })
    },
    generatePrintDom() {
      return new Promise((res, rej) => {
        let dataURLArr = []
        this.$children.map((ele) => {
          if (ele.$el.localName !== 'button') {
            dataURLArr.push(ele.exportThisDiagram())
          }
        })
        let dom = document.createElement('div')
        // dom.id = 'beforePrint'
        dataURLArr.map((url) => {
          let canvas = document.createElement('img')
          canvas.src = url
          console.log(canvas)
          dom.appendChild(canvas)
        })
        console.log(dom)
        res(dom)
      })
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 15px !important;
}
</style>
