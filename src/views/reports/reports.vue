<template>
  <div style="width: 100%; height: 100vh; display: flex; flex-direction: row">
    <div style="width: 300px; height: 100vh; background-color: #545c64;">
      <el-menu active-text-color="#ffd04b"
               background-color="#545c64"
               text-color="#fff"
               default-active="0-0"
               >
        <el-submenu v-for="(menu, index) in menuData" :key="index" :index="index.toString()">
          <template slot="title">
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item v-for="(submenu, i) in menu.children" :key="i" :index="index + '-' + i"
                        @click="clickItem(submenu)">
            <span>{{ submenu.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div style="width: 88%; height: 100vh">
      <iframe v-if="frameUrl !== ''" :src="frameUrl" style="height: 100%; width: 100%"></iframe>
    </div>
  </div>
</template>

<script>
export default {
	// http://10.192.34.105:8080----->https://10.192.34.105:8443/
  name: "reports",
  data () {
    return {
      menuData: [
        {
          title: '工务',
          children: [
            {
              name: '轨道车',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_railtrain.cpt'
            },
            {
              name: '隧道',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_sd.cpt'
            },
            {
              name: '桥梁',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_ql.cpt'
            },
            {
              name: '道口',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_dk.cpt'
            },
            {
              name: '坡道',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_pd.cpt'
            },
            {
              name: '防洪看守点',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_fhksd.cpt'
            },
            {
              name: '防洪抢险材料及机具',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_fhcl.cpt'
            },
            {
              name: '线路障碍自动检测地段',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_line_c.cpt'
            },
            {
              name: '施工计划',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_sgPlan.cpt'
            },
            {
              name: '维修计划',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_wxPlan.cpt'
            }
          ]
        },
        {
          title: '机务',
          children: [
            {
              name: '机务操纵示意图',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/JW_Model/JW_CZSYT.cpt'
            }
          ]
        },
        {
          title: '运输',
          children: [
            {
              name: '接发列车限制',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/YS_Model/YS_JFLC.cpt'
            },
            {
              name: '全局慢行情况',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/YS_Model/YS_QJMX.cpt'
            },
            {
              name: '应急救援队',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/YS_Model/YS_YJJY.cpt'
            }
          ]
        }
      ],
      frameUrl: ''
    }
  },
  methods: {
    clickItem ( menu ) {
      console.log( '选定菜单', menu )
      this.frameUrl = menu.url
    }
  },
  mounted() {
    this.clickItem( {
              name: '轨道车',
              url: 'https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/gw_railtrain.cpt&op=view'
            } )
  }
}
</script>

<style scoped>

</style>
