<template>
  <div style="height: 100%; width: 100%; display: flex; flex-direction: row">
    <div class="effect-stns-list">
      <div>
        <h2 style="color: white">封锁区间</h2>
<!--        <div v-for="(stn, index) in stn_fs_list" :key="index">-->
<!--          <el-checkbox v-model="stn.selected" @change="handleStnCheck($event, stn)" :disabled="stn.used">-->
<!--            <span :style="{color: stn.used ? 'orange' : 'white'}">{{ stn.O_STATION }} - {{ stn.E_STATION }}</span>-->
<!--          </el-checkbox>-->
<!--          <br/>-->
<!--        </div>-->
        <div v-for="(ddt, index) in fsSections" :key="index">
          <div>
            <h3 style="color: white">{{ ddt.DDT }}</h3>
            <div v-for="(section, i) in ddt.SEGMENTS" :key="i">
              <el-checkbox v-model="section.selected" @change="handleStnCheck($event, section)" :disabled="section.used">
                <span :style="{color: section.used ? 'orange' : 'white'}">{{ section.O_STATION }} - {{ section.E_STATION }}</span>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 style="color: white">限速区间</h2>
<!--        <div v-for="(stn, index) in stn_xs_list" :key="index">-->
<!--          <el-checkbox v-model="stn.selected" @change="handleStnCheck($event, stn)" :disabled="stn.used">-->
<!--            <span :style="{color: stn.used ? 'orange' : 'white'}">{{ stn.O_STATION }} - {{ stn.E_STATION }}</span>-->
<!--          </el-checkbox>-->
<!--          <br/>-->
<!--        </div>-->
        <div v-for="(ddt, index) in xsSections" :key="index">
          <div>
            <h3 style="color: white">{{ ddt.DDT }}</h3>
            <div v-for="(section, i) in ddt.SEGMENTS" :key="i">
              <el-checkbox v-model="section.selected" @change="handleStnCheck($event, section)" :disabled="section.used">
                <span :style="{color: section.used ? 'orange' : 'white'}">{{ section.O_STATION }} - {{ section.E_STATION }}</span>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-panel">
      <div style="height: 60px; width: 100%; padding: 5px; display: flex; align-items: center; align-content: center">
        <el-select v-model="selectedOrderType" size="mini" placeholder="选择命令号">
          <el-option v-for="(order, index) in orderTypeDic" :key="index" :label="order.type" :value="order.type"
                     :title="order.desc"></el-option>
        </el-select>
        <div>
          <el-button size="mini" type="primary" style="margin-left: 10px" @click="generateOrderContent">预览</el-button>
        </div>
        <h4 v-show="selectedOrderType !== ''" style="color: white; margin-left: 10px">
          当前选择： {{selectedOrderType }}（{{ selectedOrderDesc }}）
        </h4>
      </div>
      <div style="height: calc(70vh - 60px); width: 100%; padding: 5px" class="order-tabs">
        <el-tabs type="card" v-model="currentTab">
          <el-tab-pane v-for="(tab, index) in orderTabs" :key="index" :label="tab.type + '（' + tab.units + '）'"
                       :name="tab.tabId">
            <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
              <div style="height: 40px; width: 100%">
                <el-button type="primary" size="mini" @click="handleSaveOrder(index)">保存</el-button>
                <el-button type="danger" size="mini" style="margin-left: 10px" @click="handleOrderTabEdit(index)">删除
                </el-button>
              </div>
              <div style="height: calc(100% - 40px); width: 100%">
                <ue style="width: 1250px; height: 550px; overflow-y: scroll" :editortext="tab.content"
                    :editor-id="'orderEditor' + index.toString()" :config="{
                  initialFrameWidth: 1250,
                  initialFrameHeight: 550
                }"/>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import C from '../../../../assets/com.js'
import Ue from "../../../../components/UE";

export default {
  name: "OrderGenerator.vue",
  components: { Ue },
  props: {
    earthquake: {
      type: Object,
      default: () => {
      }
    },
    effect: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      stn_xs_list: [],              // 限速区间列表
      stn_fs_list: [],              // 封锁区间列表
      xsSections: [],               // 限速区间（含调度台）
      fsSections: [],               // 封锁区间（含调度台）
      selectedStns: [],             // 选择的区间
      selectedOrderType: 'D02',    // 选定命令号
      orderTypeDic: [               // 命令号字典
        // {
        //   type: 'D107',
        //   desc: '普速-封锁开通'
        // },
        // {
        //   type: 'D111',
        //   desc: '普速-加开救援列车'
        // },
        // {
        //   type: 'D137',
        //   desc: '普速-临时降弓运行'
        // },
        // {
        //   type: 'D138',
        //   desc: '普速-站内或区间临时限速'
        // },
        // {
        //   type: 'D154',
        //   desc: '普速-运行揭示调度命令与实际限速、行车方式或设备不符时'
        // },
        {
          type: 'D02',
          desc: '高速-封锁区间或车站线路（不开路用列车）',
          availableType: '1'
        },
        {
          type: 'D04',
          desc: '高速-应急处置封锁并开行路用列车',
          availableType: '1'
        },
        {
          type: 'D06',
          desc: '高速-封锁开通',
          availableType: '1'
        },
        // {
        //   type: 'D15',
        //   desc: '高速-临时降弓运行'
        // },
        {
          type: 'D16',
          desc: '高速-站内或区间临时限速及取消临时限速',
          availableType: '0'
        },
        {
          type: 'D38',
          desc: '高速-临时加开列车',
          availableType: 'any'
        }
        // {
        //   type: 'D17',
        //   desc: '高速-列车临时限速'
        // },
        // {
        //   type: 'D19',
        //   desc: '高速-双线反方向行车'
        // },
        // {
        //   type: 'D20',
        //   desc: '高速-双线改单线行车'
        // },
        // {
        //   type: 'D39',
        //   desc: '高速-加开救援列车'
        // },
        // {
        //   type: 'D41',
        //   desc: '高速-动车组在区间被迫停车后退行至后方站'
        // }
      ],
      orderTabs: [],                // 生成的命令Tabs
      currentTab: '0'               // 当前选中Tab
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    /**
     * 获取当前选定命令号描述
     * @returns {string|*}
     */
    selectedOrderDesc () {
      if (this.selectedOrderType === '') {
        return ''
      } else {
        let type = this.selectedOrderType
        return this.orderTypeDic.find( ( o ) => {
          return o.type === type
        } ).desc
      }
    }
  },
  methods: {
    init () {
      if (JSON.stringify( this.earthquake ) === '{}' || this.earthquake === undefined || this.effect === [] || this.effect === undefined) {
        return
      } else {
        console.log( 'ORDER', this.earthquake, this.effect )
        this.generateStnList( this.effect )
      }
      C.getData({
        c: 'eqeh_zxy2053',
        s: [{
          E_ID: this.earthquake.EQ_ID
        }],
        url: "https://10.192.126.203/GeneralProServlet",
      }, (res) => {
        console.log('查询影响范围(新)', res.data['1'])
        this.generateSectionList(res.data['1'])
      })
    },
    generateSectionList(source) {
      let xs = source.find((s) => {return s.ATTRIBUTE == 0}) || {DDT: []}
      let fs = source.find((s) => {return s.ATTRIBUTE == 1}) || {DDT: []}
      let xsList = []
      xs.DDT.map((ddt) => {
        ddt.SEGMENTS.map((section) => {
          section.used = false
          section.id = C.getUuid()
          section.selected = false
        })
        xsList.push(ddt)
      })
      let fsList = []
      
      fs.DDT.map((ddt) => {
        ddt.SEGMENTS.map((section) => {
          section.used = false
          section.id = C.getUuid()
          section.selected = false
        })
        fsList.push(ddt)
      })
      this.fsSections = fsList
      this.xsSections = xsList
      this.getOrders()
    },
    /**
     * 生成限速区间、封锁区间选项，初始化灾害命令
     * @param source 地震影响范围
     */
    generateStnList ( source ) {
      console.log( "STN", source )
      this.stn_fs_list = []
      this.stn_xs_list = []
      this.selectedStns = []
      this.selectedOrderType = 'D02'
      this.orderTabs = []
      let stn_fs = []
      let stn_xs = []
      source.map( ( e ) => {
        if (e.ATTRIBUTE == 0) {
          // 限速区间
          stn_xs.push( {
            ...e,
            used: false,          // 区间是否被用来生成命令
            id: C.getUuid(),
            selected: false       // 区间是否被选择
          } )
        } else {
          // 封锁区间
          stn_fs.push( {
            ...e,
            used: false,
            id: C.getUuid(),
            selected: false
          } )
        }
      } )
      this.stn_xs_list = stn_xs
      this.stn_fs_list = stn_fs
      this.getOrders()
    },
    /**
     * 选择区间
     * @param checked 是否选中
     * @param stn 区间对象
     */
    handleStnCheck ( checked, stn ) {
      console.log( checked, stn )
      if (stn.used) {
        return
      } else {
        if (checked) {
          this.selectedStns.push( stn )
        } else {
          let tIndex = this.selectedStns.findIndex( ( s ) => {
            return s === stn
          } )
          this.selectedStns.splice( tIndex, 1 )
        }
        console.log( this.selectedStns )
      }
    },
    /**
     * 判断选择的区间是否按站序连续
     * @param effects
     * @returns {boolean}
     */
    ifEffectsContinuous ( effects = [] ) {
      let ifContinuous = true
      for (let i = 0; i < effects.length; i ++) {
        if (i !== 0 && i !== effects.length) {
          if (effects[i - 1].E_STATION !== effects[i].O_STATION) {
            ifContinuous = false
            break
          }
        }
      }
      return ifContinuous
    },
    /**
     * 判断选择的区间类型和选择的命令是否匹配
     * @param effects
     * @param type
     * @returns {boolean}
     */
    ifEffectsTypeCorrect ( effects = [], type = 'D02' ) {
      let orderType = this.orderTypeDic.find( ( order ) => {
        return order.type === type
      } ).availableType
      if (orderType === 'any') {
        return true
      } else {
        let ifCorrect = true
        for (let i = 0; i < effects.length; i ++) {
          if (effects[i].ATTRIBUTE !== orderType) {
            ifCorrect = false
            break
          }
        }
        return ifCorrect
      }
    },
    /**
     * 生成命令内容
     */
    generateOrderContent () {
      let type = this.selectedOrderType
      let effects = this.selectedStns.filter( ( e ) => {
        return e.used === false
      } )
      if (type === '' || effects.length === 0) {
        this.$message.error( '请选择命令号和区间!' )
        return
      }
      if (!this.ifEffectsContinuous( effects )) {
        this.$message.error( '请按站序选择连续的区间' )
        return
      }
      if (!this.ifEffectsTypeCorrect( effects, type )) {
        this.$message.error( '选择的区间类型与命令内容不符' )
        return
      }
      let loading = this.$loading( {
        lock: true,
        text: "正在获取数据...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      } )
      console.log( '生成命令', type, effects )
      C.getDataP123( {
        c: 'eqeh_zxy2024',
        s: [[this.earthquake.EQ_ID]],
        url: "https://10.192.126.203/GeneralProServlet",
      }, ( res ) => {
        if (res['1'].length !== 0) {
          console.log( '获取影响列车', res['1'] )
          let trains = []
          res['1'].map( ( train ) => {
            if (this.ifTrainInSelectedSections( effects, train ) && train.TRAIN !== '') {
              // 车次在选定的区间内
              trains.push( train )
            }
          } )
          const unlink = ( arr, key ) => {
            let obj = {}
            return arr.filter( ( item, index, array ) => {
              return obj.hasOwnProperty( typeof item[key] + JSON.stringify( item[key] ) ) ? false : (obj[typeof item[key] + JSON.stringify( item[key] )] = true)
            } )
          }
          // 去掉相同车次
          trains = unlink( trains, 'TRAIN' )
          console.log( '受影响车次', trains )
          let content = this.getOrderContent( effects, trains )
          console.log( '命令内容\n', content )
          this.orderTabs.push( {
            type: type,
            content: content.content,
            effects: effects,
            units: content.units,
            tabId: C.getUuid()
          } )
          this.selectedStns.map( ( e ) => {
            if (!e.used) {
              e.used = true
            }
          } )
          this.currentTab = this.orderTabs[this.orderTabs.length - 1].tabId
          loading.close()
        }
      } )
    },
    /**
     * 判断列车是否在选定的影响区间中
     * @param effects 选择的影响区间
     * @param train 车次
     * @returns {boolean}
     */
    ifTrainInSelectedSections ( effects, train ) {
      let section = train.SECTION
      let flag = false
      for (let i = 0; i < effects.length; i ++) {
        // effects[i].used = true
        if (section.includes( effects[i].O_STATION ) && section.includes( effects[i].E_STATION )) {
          train.SPEED = effects[i].SPEED
          flag = true
          break
        }
      }
      return flag
    },
    /**
     * 根据命令号生成命令内容
     * @param effects 选择的影响区间
     * @param trains 命令涉及车次
     * @returns {{units: string, content: string}}
     */
    getOrderContent ( effects, trains ) {
      
      /**
       * effects: 已选的用来生成命令的区间数组。
       * 部分成员：
       * ATTRIBUTE: 区间类型（1-封锁、0-限速）
       * ENVIRONMENT：区间地形环境
       * E_KM/O_LM：区间终点/起点公里标（xx.xxx）
       * E/O_LAT、E/O_LON：区间终点/起点经纬度
       * E_STATION/O_STATION：区间终点/起点站
       * LINE_NAME：线名
       * ROW_OTHER：行别
       *
       * trains：在以上区间中的影响列车数组。
       * 部分成员：
       * CURRNAME：当前站
       * START_STN：出发站
       * END_STN：到达站
       * EDTIME：晚点时间（分钟）
       * START_DATE：出发时间
       * END_DATE：到达时间
       * TRAIN：车次号
       * TRAIN_TYPE：车类型（H-货车、其他为客车）
       * SECTION：运行区间（格式：'区间起点站(xx.xxx)-区间终点站(xx.xxx)'）
       * SPEED: 列车限速速度
       */
      
      let tabSpace = '&nbsp;&nbsp;&nbsp;&nbsp;'
      let receivers = []
      effects.map( ( e ) => {
        receivers.push( e.O_STATION + '站' )
        receivers.push( e.E_STATION + '站' )
      } )
      receivers = Array.from( new Set( receivers ) )
      switch (this.selectedOrderType) {
        case 'D107': {
          // 普速-封锁开通
          let contentP1 = []
          effects.map( ( e ) => {
            contentP1.push( `${ tabSpace }根据______站报告，${ e.O_STATION }站（含、___道、___号道岔）至${ e.E_STATION }站（含、___道、___号道岔）间${ e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER }行线施工（维修、救援、故障处置、应急处置）完毕，（区间已空闲，）自接令时起开通。` )
          } )
          let contentP2 = []
          if (trains.length !== 0) {
            trains.map( ( t, index ) => {
              let startStn = t.SECTION.split( '-' )[0].split( '(' )[0]
              let endStn = t.SECTION.split( '-' )[1].split( '(' )[0]
              let startMile = t.SECTION.split( '-' )[0].split( '(' )[1].split( ')' )[0]
              let endMile = t.SECTION.split( '-' )[1].split( '(' )[1].split( ')' )[0]
              contentP2.push( `${ tabSpace }${ index === 0 ? '首列' : '第' + (index + 1) + '列' }${ t.TRAIN === '' ? '______' : t.TRAIN }次列车运行至${ startStn }站（含、___道、___号道岔）至${ endStn }站（含、___道、___号道岔）间___行线${ startMile.split( '.' )[0] }km${ startMile.split( '.' )[1] }m至${ endMile.split( '.' )[0] }km${ endMile.split( '.' )[1] }m处限速____km/h。` )
            } )
          }
          let contentP3 = `\n${ tabSpace }由______站交施工（维修、救援、应急处置、工务、电务、供电）负责人，`
          let contentP4 = []
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              contentP4.push( `______站交${ t.TRAIN === '' ? '______' : t.TRAIN }次司机` )
            } )
          }
          let contentP5 = trains.length === 0 ? '' : `由______站与首列${ trains[0].TRAIN === '' ? '______' : trains[0].TRAIN }次司机${ trains.length > 1 ? ('、______站与第二列' + (trains[1].TRAIN === '' ? '______' : trains[1].TRAIN) + '次司机') : '' }核对限速内容`
          let p1Html = `<p>${ receivers.join( '、' ) }：</p>`
          let p2Html = contentP1.map( ( str ) => {
            return `<p>${ str }</p>`
          } ).join( '' )
          let p3Html = contentP2.map( ( str ) => {
            return `<p>${ str }</p>`
          } ).join( '' )
          let p4Html = `<p>${ contentP3 }${ contentP4.join( '、' ) + '。' }${ contentP5 + '。' }</p>`
          return {
            content: p1Html + p2Html + p3Html + p4Html,
            units: receivers.join( '、' )
          }
        }
        case 'D111': {
          // 普速-加开救援列车
          let contentP1 = `<p>${ tabSpace }______站至______站间加开______次列车，（限速____km/h）______站____时____分开，按现时分办理。</p>`
          let contentP2 = `<p>${ tabSpace }由______站交______次列车司机。</p>`
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1 + contentP2,
            units: receivers.join( '、' )
          }
        }
        case 'D137': {
          // 普速-临时降弓运行
          let contentP1 = []
          effects.map( ( e ) => {
            contentP1.push( `<p>${ tabSpace }自接令时起，${ e.O_STATION }站至${ e.E_STATION }站间${ e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER }行线（站内____道）${ e.O_KM.split( '.' )[0] }km${ e.O_KM.split( '.' )[1] }m至${ e.E_KM.split( '.' )[0] }km至${ e.E_KM.split( '.' )[1] }m处，降弓（限速____km/h）运行。</p>` )
          } )
          let contentP2 = `<p>${ tabSpace }由______站交供电负责人及____行各次列车司机，______站交____行各次列车司机。</p>`
          return {
            content: `<p>${ receivers.join( '、' ) }、供电调度员：</p>` + contentP1.join( '' ) + contentP2,
            units: receivers.join( '、' ) + '、供电调度员'
          }
        }
        case 'D138': {
          // 普速-站内或区间临时限速
          let contentP1 = []
          effects.map( ( e ) => {
            contentP1.push( `<p>${ tabSpace }自接令时（____时____分）起至另有命令时（____时____分）止，${ e.O_STATION }站（含、___道、___号道岔）至${ e.E_STATION }站（含、___道、___号道岔）间${ e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER }行线${ e.O_KM.split( '.' )[0] }km${ e.O_KM.split( '.' )[1] }m至${ e.E_KM.split( '.' )[0] }km至${ e.E_KM.split( '.' )[1] }m处（站内___道）限速____km/h。</p>` )
          } )
          let contentP2 = []
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              let startStn = t.SECTION.split( '-' )[0].split( '(' )[0]
              let endStn = t.SECTION.split( '-' )[1].split( '(' )[0]
              let startMile = t.SECTION.split( '-' )[0].split( '(' )[1].split( ')' )[0]
              let endMile = t.SECTION.split( '-' )[1].split( '(' )[1].split( ')' )[0]
              contentP2.push( `<p>${ tabSpace }${ t.TRAIN }次列车运行至${ startStn }站（含、___道、___号道岔）至${ endStn }站（含、___道、___号道岔）间___行线${ startMile.split( '.' )[0] }km${ startMile.split( '.' )[1] }m至${ endMile.split( '.' )[0] }km${ endMile.split( '.' )[1] }m处（站内___道）限速___km/h。</p>` )
            } )
          }
          let contentP3 = `<p>${ tabSpace }由___站交___负责人及___次列车司机（___行各次列车司机、___站交___行各次列车司机，反方向或改按单线行车时由___站交___行各次列车司机）；由___站与上行、___站与下行各次列车司机核对限速内容。</p>`
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1.join( '' ) + contentP2.join( '' ) + contentP3,
            units: receivers.join( '、' )
          }
        }
        case 'D02': {
          // 高速-封锁-封锁区间或车站线路（不开路用列车）
          let contentP1 = ''
          let contentP2 = ''
          let startStn = effects[0].O_STATION
          let endStn = effects[effects.length - 1].E_STATION
          contentP1 = `<p>${ tabSpace }因______，自接令时起至___时___分（另有命令）时止，${ startStn }站（含、___道、___号道岔）至${ endStn }站（含、___道、___号道岔）间___行线封锁。</p>`
          contentP2 = `<p>${ tabSpace }由${ startStn }站交（工务、电务、供电）负责人。</p>`
          // effects.map((e) => {
          //   contentP1.push(
          //     `<p>${tabSpace}因______，自接令时起至___时___分（另有命令）时止，${e.O_STATION}站（含、___道、___号道岔）至${e.E_STATION}站（含、___道、___号道岔）间${e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER}行线封锁。</p>`
          //   )
          //   contentP2.push(
          //     `<p>${tabSpace}由${e.O_STATION}站交（工务、电务、供电）负责人。</p>`
          //   )
          // })
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1 + contentP2,
            units: receivers.join( '、' )
          }
        }
        case 'D04': {
          // 高速-封锁-应急处置封锁并开行路用列车
          let contentP1 = ''
          let contentP2 = ''
          let contentP3 = ''
          let startStn = effects[0].O_STATION
          let endStn = effects[effects.length - 1].E_STATION
          contentP1 = `<p>${ tabSpace }因应急处置作业，自接令时起至另有命令时（___时___分）止，${ startStn }站（含、___道、___号道岔）至${ endStn }站（含、___道、___号道岔）间___行线封锁。</p>`
          contentP2 = `<p>${ tabSpace }准许${ startStn }站开____次列车，进入___行线封锁区间___km___m处停车，按___负责人的指示进行作业，（返回开____次列车，）限___时___分前到达${ endStn }站。</p>`
          contentP3 = `<p>${ tabSpace }由${ startStn }站交应急处置负责人及____次列车司机。</p>`
          // effects.map((e) => {
          //   contentP1.push(
          //     `<p>
          //        ${tabSpace}因应急处置作业，自接令时起至另有命令时（___时___分）止，${e.O_STATION}站（含、___道、___号道岔）至${e.E_STATION}站（含、___道、___号道岔）间${e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER}行线封锁。
          //      </p>`
          //   )
          //   contentP2.push(
          //     `
          //     <p>
          //       ${tabSpace}准许${e.O_STATION}站开____次列车，进入___行线封锁区间___km___m处停车，按___负责人的指示进行作业，（返回开____次列车，）限___时___分前到达${e.E_STATION}站。
          //     </p>
          //     `
          //   )
          //   contentP3.push(
          //     `
          //     <p>
          //       ${tabSpace}由${e.O_STATION}站交应急处置负责人及____次列车司机。
          //     </p>
          //     `
          //   )
          // })
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1 + contentP2 + contentP3,
            units: receivers.join( '、' )
          }
        }
        case 'D06': {
          // 高速-封锁-封锁开通
          let startStn = effects[0].O_STATION
          let endStn = effects[effects.length - 1].E_STATION
          let contentP1 = ''
          contentP1 = `<p>${ tabSpace }根据${ startStn }站报告，${ startStn }站（含、___道、___号道岔）至${ endStn }站（含、___道、___号道岔）间___行线区间施工（维修、救援、故障处置、应急处置）完毕，（区间已空闲，）自接令时起开通。</p>`
          // effects.map((e) => {
          //   contentP1.push(`${tabSpace}根据______站报告，${e.O_STATION}站（含、___道、___号道岔）至${e.E_STATION}站（含、___道、___号道岔）间${e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER}行线施工（维修、救援、故障处置、应急处置）完毕，（区间已空闲，）自接令时起开通。`)
          // })
          let contentP2 = ''
          if (trains.length !== 0) {
            // trains.map((t, index) => {
            //   let startStn = t.SECTION.split('-')[0].split('(')[0]
            //   let endStn = t.SECTION.split('-')[1].split('(')[0]
            //   let startMile = t.SECTION.split('-')[0].split('(')[1].split(')')[0]
            //   let endMile = t.SECTION.split('-')[1].split('(')[1].split(')')[0]
            //   contentP2.push(`${tabSpace}${index === 0 ? '首列' : '第' + (index + 1) + '列'}${t.TRAIN === '' ? '______' : t.TRAIN}次列车运行至${startStn}站（含、___道、___号道岔）至${endStn}站（含、___道、___号道岔）间___行线${startMile.split('.')[0]}km${startMile.split('.')[1]}m至${endMile.split('.')[0]}km${endMile.split('.')[1]}m处限速____km/h。`)
            // })
            let fTrain = trains[0]
            contentP2 = `<p>${ tabSpace }首列${ fTrain.TRAIN }次列车运行至${ fTrain.SECTION.split( '-' )[0].split( '(' )[0] }站（含、___道、___号道岔）至${ fTrain.SECTION.split( '-' )[1].split( '(' )[0] }站（含、___道、___号道岔）间___行线${ fTrain.SECTION.split( '-' )[0].split( '(' )[1].split( ')' )[0].split( '.' )[0] }km${ fTrain.SECTION.split( '-' )[0].split( '(' )[1].split( ')' )[0].split( '.' )[1] }m至${ fTrain.SECTION.split( '-' )[1].split( '(' )[1].split( ')' )[0].split( '.' )[0] }km${ fTrain.SECTION.split( '-' )[1].split( '(' )[1].split( ')' )[0].split( '.' )[1] }m处限速${ fTrain.SPEED }km/h。</p>`
          }
          let contentP3 = `<p>${ tabSpace }由${ startStn }站交施工（维修、救援、应急处置、工务、电务、供电）负责人${ trains.length !== 0 ? ('，' + startStn + '站交' + trains[0].TRAIN + '次列车司机') : '' }。</p>`
          // let contentP3 = `\n${tabSpace}由______站交施工（维修、救援、应急处置、工务、电务、供电）负责人，`
          // let contentP4 = []
          // if (trains.length !== 0) {
          //   trains.map((t) => {
          //     contentP4.push(`______站交${t.TRAIN === '' ? '______' : t.TRAIN}次司机`)
          //   })
          // }
          // let contentP5 = `由______站与首列${trains[0].TRAIN === '' ? '______' : trains[0].TRAIN}次司机${trains.length > 1 ? ('、______站与第二列' + (trains[1].TRAIN === '' ? '______' : trains[1].TRAIN) + '次司机') : ''}核对限速内容`
          // let p1Html = `<p>${receivers.join('、')}：</p>`
          // let p2Html = contentP1.map((str) => {return `<p>${str}</p>`}).join('')
          // let p3Html = contentP2.map((str) => {return `<p>${str}</p>`}).join('')
          // let p4Html = `<p>${contentP3}${contentP4.join('、') + '。'}${contentP5 + '。'}</p>`
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1 + contentP2 + contentP3,
            units: receivers.join( '、' )
          }
        }
        case 'D16': {
          // 高速-限速-站内或区间临时限速及取消临时限速
          let startStn = effects[0].O_STATION
          let endStn = effects[effects.length - 1].E_STATION
          let startMile = effects[0].O_KM
          let endMile = effects[effects.length - 1].E_KM
          let contentP1 = `<p>${ tabSpace }自接令时（____时____分）起至另有命令时（____时____分）止，${ startStn }站（含、___道、___号道岔）至${ endStn }站（含、___道、___号道岔）间___行线${ startMile.split( '.' )[0] }km${ startMile.split( '.' )[1] }m至${ endMile.split( '.' )[0] }km至${ endMile.split( '.' )[1] }m处（站内___道）限速${ effects[0].SPEED }km/h。</p>`
          let contentP2 = []
          let contentP3 = []
          let contentP4 = []
          let contentP5 = []
          let contentP6 = `<p>${ tabSpace }前发____月____日____号调度命令限速废止。</p>`
          let contentP7 = `<p>${ tabSpace }由____站交____负责人。</p>`
          effects.map( ( e, index ) => {
            // contentP1.push(
            //   `<p>${tabSpace}自接令时（____时____分）起至另有命令时（____时____分）止，${e.O_STATION}站（含、___道、___号道岔）至${e.E_STATION}站（含、___道、___号道岔）间${e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER}行线${e.O_KM.split('.')[0]}km${e.O_KM.split('.')[1]}m至${e.E_KM.split('.')[0]}km至${e.E_KM.split('.')[1]}m处（站内___道）限速____km/h。</p>`
            // )
            if (index === 0) {
              contentP2.push(
                `<p>${ tabSpace }自接令时起至另有命令时止，${ e.O_STATION }____道限速${ e.SPEED }km/h。</p>`
              )
              contentP5.push(
                `<p>${ tabSpace }自接令时起，${ e.O_STATION }____道限速取消。</p>`
              )
            }
            contentP2.push(
              `<p>${ tabSpace }自接令时起至另有命令时止，${ e.E_STATION }____道限速${ e.SPEED }km/h</p>`
            )
            contentP4.push(
              `<p>${ tabSpace }自接令时起，${ e.O_STATION }站（含、___道、___号道岔）至${ e.E_STATION }站（含、___道、___号道岔）间${ e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER }行线${ e.O_KM.split( '.' )[0] }km${ e.O_KM.split( '.' )[1] }m至${ e.E_KM.split( '.' )[0] }km至${ e.E_KM.split( '.' )[1] }m处限速取消。</p>`
            )
            contentP5.push(
              `<p>${ tabSpace }自接令时起，${ e.E_STATION }____道限速取消。</p>`
            )
          } )
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              contentP3.push(
                `<p>${ tabSpace }由____站交____负责人及${ t.TRAIN }次列车司机（____行各次列车司机、____站交____行各次列车司机）。</p>`
              )
            } )
          }
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1 + contentP2.join( '' ) + contentP3.join( '' ) + contentP4.join( '' ) + contentP5.join( '' ) + contentP6 + contentP7,
            units: receivers.join( '、' )
          }
        }
        case 'D17': {
          // 高速-列车临时限速
          let contentP1 = []
          let contentP2 = []
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              let startStn = t.SECTION.split( '-' )[0].split( '(' )[0]
              let endStn = t.SECTION.split( '-' )[1].split( '(' )[0]
              // let startMile = t.SECTION.split('-')[0].split('(')[1].split(')')[0]
              // let endMile = t.SECTION.split('-')[1].split('(')[1].split(')')[0]
              contentP1.push(
                `<p>${ tabSpace }${ t.TRAIN }次列车因______，（${ startStn }站至${ endStn }站间）限速____km/h运行。</p>`
              )
              contentP2.push(
                `<p>${ tabSpace }由${ startStn }站交${ t.TRAIN }次列车司机。</p>`
              )
            } )
          }
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1.join( '' ) + contentP2.join( '' ),
            units: receivers.join( '、' )
          }
        }
        case 'D154': {
          // 普速-运行揭示调度命令与实际限速、行车方式或设备不符时
          let contentP1 = []
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              let startStn = t.SECTION.split( '-' )[0].split( '(' )[0]
              let endStn = t.SECTION.split( '-' )[1].split( '(' )[0]
              let startMile = t.SECTION.split( '-' )[0].split( '(' )[1].split( ')' )[0]
              let endMile = t.SECTION.split( '-' )[1].split( '(' )[1].split( ')' )[0]
              let textP1 = `<p>${ tabSpace }${ t.TRAIN }次列车前发____月____日____号运行揭示调度命令取消，运行条件如下：</p>`
              let textP2 = `<p>${ tabSpace }(1)${ startStn }站（含、____道、____号道岔）至${ endStn }站（含、____道、____号道岔）间___行线${ startMile.split( '.' )[0] }km${ startMile.split( '.' )[1] }m至${ endMile.split( '.' )[0] }km${ endMile.split( '.' )[1] }m处限速____km/h。</p>`
              let textP3 = `<p>${ tabSpace }(2)${ startStn }站至${ endStn }站间___行线按基本闭塞法行车。</p>`
              let textP4 = `<p>${ tabSpace }(3)施工结束后设备变化情况......。</p>`
              let textP5 = `<p>${ tabSpace }由___站交施工负责人及（${ t.TRAIN }次）___行各次列车司机，___站交___行各次列车司机。</p>`
              contentP1.push( textP1 + textP2 + textP3 + textP4 + textP5 )
            } )
          }
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1.join( '' ),
            units: receivers.join( '、' )
          }
        }
        case 'D15': {
          // 高速-临时降弓运行
          let contentP1 = []
          effects.map( ( e ) => {
            contentP1.push( `<p>${ tabSpace }自接令时起，${ e.O_STATION }站至${ e.E_STATION }站间${ e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER }行线（站内____道）${ e.O_KM.split( '.' )[0] }km${ e.O_KM.split( '.' )[1] }m至${ e.E_KM.split( '.' )[0] }km至${ e.E_KM.split( '.' )[1] }m处，降弓（限速____km/h）运行。</p>` )
          } )
          let contentP2 = `<p>${ tabSpace }由______站交供电负责人及____行各次列车司机，______站交____行各次列车司机。</p>`
          return {
            content: `<p>${ receivers.join( '、' ) }、供电调度员：</p>` + contentP1.join( '' ) + contentP2,
            units: receivers.join( '、' ) + '、供电调度员'
          }
        }
        case 'D19': {
          // 高速-双线反方向行车
          let contentP1 = []
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              let startStn = t.SECTION.split( '-' )[0].split( '(' )[0]
              let endStn = t.SECTION.split( '-' )[1].split( '(' )[0]
              let startMile = t.SECTION.split( '-' )[0].split( '(' )[1].split( ')' )[0]
              let endMile = t.SECTION.split( '-' )[1].split( '(' )[1].split( ')' )[0]
              let textP1 = `<p>${ tabSpace }自接令时起，准许${ t.TRAIN }次列车在${ startStn }站至${ endStn }站间利用___行线反方向运行。</p>`
              let textP2 = `<p>${ tabSpace }${ t.TRAIN }次列车运行至${ startStn }站（含、____道、____号道岔）至${ endStn }站（含、____道、____号道岔）间___行线${ startMile.split( '.' )[0] }km${ startMile.split( '.' )[1] }m至${ endMile.split( '.' )[0] }km${ endMile.split( '.' )[1] }m处限速____km/h。</p>`
              let textP3 = `<p>${ tabSpace }由${ startStn }站交${ t.TRAIN }次列车司机。</p>`
              contentP1.push( textP1 + textP2 + textP3 )
            } )
          }
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1.join( '' ),
            units: receivers.join( '、' )
          }
        }
        case 'D20': {
          // 高速-双线改单线行车
          let contentP1 = []
          let contentP2 = []
          let contentP3 = ''
          effects.map( ( e ) => {
            contentP1.push(
              `<p>${ tabSpace }自接令时起，${ e.O_STATION }站至${ e.E_STATION }站间${ e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER }行线改按单线行车。</p>`
            )
            contentP2.push(
              `<p>${ tabSpace }上下行各次列车运行至${ e.O_STATION }站（含、____道、____号道岔）至${ e.E_STATION }站（含、____道、____号道岔）间${ e.ROW_OTHER === '双' ? '上、下' : e.ROW_OTHER }行线${ e.O_KM.split( '.' )[0] }km${ e.O_KM.split( '.' )[1] }m至${ e.E_KM.split( '.' )[0] }km${ e.E_KM.split( '.' )[1] }m处（站内____道）限速____km/h。</p>`
            )
          } )
          let effectedTrains = []
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              effectedTrains.push( `${ t.TRAIN }次` )
            } )
          }
          contentP3 = `<p>${ tabSpace }由____站交${ effectedTrains.join( '、' ) }列车司机。</p>`
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1.join( '' ) + contentP2.join( '' ) + contentP3,
            units: receivers.join( '、' )
          }
        }
        case 'D38': {
          // 高速-？？-临时加开列车
          let startStn = effects[0].O_STATION
          let endStn = effects[effects.length - 1].E_STATION
          let contentP1 = `<p>${ tabSpace }准许${ startStn }至${ endStn }站间加开____次列车，按现时分运行。</p>`
          let contentP2 = `<p>${ tabSpace }由${ startStn }站交____次列车司机。</p>`
          // effects.map((e) => {
          //   contentP1.push(
          //     `
          //     <p>${tabSpace}准许${e.O_STATION}至${e.E_STATION}间加开____次列车，按现时分运行。</p>
          //     `
          //   )
          //   contentP2.push(
          //     `
          //     <p>${tabSpace}由${e.O_STATION}交____次列车司机。</p>
          //     `
          //   )
          // })
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1 + contentP2,
            units: receivers.join( '、' )
          }
        }
        case 'D39': {
          // 高速-加开救援列车
          let contentP1 = `<p>${ tabSpace }______站至______站间加开______次列车，（限速____km/h）______站____时____分开，按现时分办理。</p>`
          let contentP2 = `<p>${ tabSpace }由______站交______次列车司机。</p>`
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1 + contentP2,
            units: receivers.join( '、' )
          }
        }
        case 'D41': {
          // 高速-动车组在区间被迫停车后退行至后方站
          let contentP1 = []
          if (trains.length !== 0) {
            trains.map( ( t ) => {
              let startStn = t.SECTION.split( '-' )[0].split( '(' )[0]
              let endStn = t.SECTION.split( '-' )[1].split( '(' )[0]
              // let startMile = t.SECTION.split('-')[0].split('(')[1].split(')')[0]
              // let endMile = t.SECTION.split('-')[1].split('(')[1].split(')')[0]
              let textP1 = `<p>${ tabSpace }准许${ t.TRAIN }次列车退行至${ startStn }站，并将列控车载设备转入隔离模式，区间限速15km/h.（到${ endStn }站后推出隔离模式，转换为列控车载设备方式行车。）</p>`
              let textP2 = `<p>${ tabSpace }由${ startStn }站交${ t.TRAIN }次列车司机。</p>`
              contentP1.push( textP1 + textP2 )
            } )
          }
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>` + contentP1.join( '' ),
            units: receivers.join( '、' )
          }
        }
        default: {
          return {
            content: `<p>${ receivers.join( '、' ) }：</p>`,
            units: receivers.join( '、' )
          }
        }
      }
    },
    /**
     * 删除命令
     * @param target 命令数组索引
     */
    handleOrderTabEdit ( target ) {
      this.$confirm( '确认删除吗？', '删除命令', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      } ).then( () => {
        if (this.orderTabs[target].pk === undefined) {
          // 未保存的草稿命令直接删除
          let effects = this.orderTabs[target].effects
          effects.map( ( e ) => {
            let id = e.id
            this.selectedStns.map( ( s, index, arr ) => {
              if (s.id === id) {
                arr.splice( index, 1 )
              }
            } )
            // 恢复该命令涉及的区间为可选择
            this.stn_fs_list.map( ( s ) => {
              if (s.id === id) {
                s.used = false
                s.selected = false
              }
            } )
            this.stn_xs_list.map( ( s ) => {
              if (s.id === id) {
                s.used = false
                s.selected = false
              }
            } )
          } )
          this.orderTabs.splice( target, 1 )
          this.currentTab = this.orderTabs[this.orderTabs.length - 1].tabId
        } else {
          let effects = this.orderTabs[target].effects
          effects.map( ( e ) => {
            this.stn_xs_list.map( ( s ) => {
              if (e.O_STATION === s.O_STATION && e.E_STATION === s.E_STATION && e.O_KM === s.O_KM && e.E_KM === s.E_KM) {
                s.used = false
                s.selected = false
              }
            } )
            this.stn_fs_list.map( ( s ) => {
              if (e.O_STATION === s.O_STATION && e.E_STATION === s.E_STATION && e.O_KM === s.O_KM && e.E_KM === s.E_KM) {
                s.used = false
                s.selected = false
              }
            } )
          } )
          // 保存过的命令调接口删除
          C.getDataP123( {
            c: 'eqeh_zxy5002',
            s: [[[this.orderTabs[target].pk]]],
            url: "https://10.192.126.203/GeneralProServlet",
          }, () => {
            this.getOrders()
          } )
        }
      } ).catch( () => {
        return
      } )
    },
    /**
     * 保存命令
     * @param index 命令数组索引
     */
    handleSaveOrder ( index ) {
      let content = window.UE.getEditor( 'orderEditor' + index )
      let editContent = content.getContent()
      let tab = this.orderTabs[index]
      tab.content = editContent
      C.getDataP123( {
        c: 'eqeh_zxy4010',
        s: [[[tab.pk === undefined ? '0' : tab.pk, this.earthquake.EQ_ID, tab.type, tab.units, JSON.stringify( tab )]]],
        url: "https://10.192.126.203/GeneralProServlet",
      }, () => {
        this.$message.success( '保存成功！' )
        this.getOrders()
      } )
      // console.log(editContent)
    },
    /**
     * 获取命令
     */
    getOrders () {
      C.getDataP123( {
        c: 'eqeh_zxy2051',
        s: [[this.earthquake.EQ_ID]],
        url: "https://10.192.126.203/GeneralProServlet",
      }, ( res ) => {
        this.orderTabs = []
        if (res['1'].length === 0) {
          return
        }
        res['1'].map( ( o ) => {
          this.orderTabs.push( {
            ...JSON.parse( o.CMD_CONTENT ),
            pk: o.PKID
          } )
          let effects = JSON.parse( o.CMD_CONTENT ).effects
          // 禁用已经被生成命令的区间
          effects.map( ( e ) => {
            this.stn_xs_list.map( ( s ) => {
              if (e.O_STATION === s.O_STATION && e.E_STATION === s.E_STATION && e.O_KM === s.O_KM && e.E_KM === s.E_KM) {
                s.used = true
                s.selected = true
              }
            } )
            this.stn_fs_list.map( ( s ) => {
              if (e.O_STATION === s.O_STATION && e.E_STATION === s.E_STATION && e.O_KM === s.O_KM && e.E_KM === s.E_KM) {
                s.used = true
                s.selected = true
              }
            } )
            this.xsSections.map((ddt) => {
              ddt.SEGMENTS.map((s) => {
                if (e.O_STATION === s.O_STATION && e.E_STATION === s.E_STATION && e.O_KM === s.O_KM && e.E_KM === s.E_KM) {
                  s.used = true
                  s.selected = true
                }
              })
            })
            this.fsSections.map((ddt) => {
              ddt.SEGMENTS.map((s) => {
                if (e.O_STATION === s.O_STATION && e.E_STATION === s.E_STATION && e.O_KM === s.O_KM && e.E_KM === s.E_KM) {
                  s.used = true
                  s.selected = true
                }
              })
            })
          } )
        } )
        this.currentTab = this.orderTabs[this.orderTabs.length - 1].tabId
      } )
    }
  },
  watch: {
    'effect': {
      deep: true,
      handler: function ( newVal ) {
        this.init()
      }
    },
    'earthquake': {
      deep: true,
      handler: function ( newVal ) {
        this.init()
      }
    }
  }
}
</script>

<style scoped>
.effect-stns-list {
  width:      15%;
  height:     70vh;
  overflow-y: scroll;
}

.order-panel {
  width:          85%;
  height:         70vh;
  display:        flex;
  flex-direction: column;
}

.order-tabs >>> .el-tabs__item {
  background: white;
}
</style>
