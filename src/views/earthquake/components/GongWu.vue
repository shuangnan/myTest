<!--
 * @created：	2022年3月9日
 * @author：	ch
 * @version:	v1.0
 * @desc:		机务
 -->
<template>
  <div>
    <div v-if="!isLight">
      <tabs ref="myTabs" :tabsList="[{id:0,text:'工务信息'}]" style="height: 30px;"></tabs>
      <div style="height: 260px;">
        <div style="display: inline-block;" class="eq-log"> </div>
        <div style="display: inline-block;text-align: center;width: calc(100% - 150px);padding: 0 10px;color: #CDC3E1;">
          <div style="color: #CD7E15;font-size: 30px;font-weight: bold;padding: 16px;">工务</div>
          <div style="width: 260px;display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 60px;">
            <div style="width: 50%; border-right: 1px solid #000000;">
              <div>施工计划</div>
              <div style="color: #0BCCDC;padding-top:5px;">{{sgPlan}}个</div>
            </div>
            <div style="width: 50%;border-right: 1px solid #000000;">
              <div>维修计划</div>
              <div style="color: #0BCCDC;padding-top:5px;">{{ wxPlan }}个</div>
            </div>
<!--            <div style="width: 33%;">-->
<!--              <div>监管计划</div>-->
<!--              <div style="color: #0BCCDC;padding-top:5px;">{{ jgPlan }}个</div>-->
<!--            </div>-->
          </div>
          <div style="width: 260px; display: flex;justify-content: space-around;align-items: center;background: rgba(7,13,35,.5);height: 60px;">
            <div style="width: 33%; border-right: 1px solid #000000;">
              <div>天窗</div>
              <div style="color: #0BCCDC;padding-top:5px;">{{ parseInt(sgPlan) + parseInt(wxPlan) }}个</div>
            </div>
            <div style="width: 33%; border-right: 1px solid #000000;">
              <div>防洪备料</div>
              <div style="color: #0BCCDC;padding-top:5px;">{{ bl }}份</div>
            </div>
            <div style="width: 33%;">
              <div>防洪看守点</div>
              <div style="color: #0BCCDC;padding-top:5px;">{{ ksd }}个</div>
            </div>
          </div>
        </div>
      </div>
      <table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
        <colgroup>
          <col name="" width="100">
          <col name="eq_1_column_2" width="120">
          <col name="eq_1_column_3" width="100">
        </colgroup>
        <thead>
        <tr style="color: #5B96EF;">
          <th class="" style="padding: 10px 0;">工务段</th>
          <th class="eq_1_column_2">防洪备料份数</th>
          <th class="eq_1_column_3">防洪看守点个数</th>
        </tr>
        </thead>
      </table>
      <div style="overflow-y: auto;">
        <table style="width: 100%;text-align: center;font-size: 12px;" cellpadding="0" cellspacing="0" border="0">
          <colgroup>
            <col name="" width="100">
            <col name="eq_1_column_2" width="120">
            <col name="eq_1_column_3" width="100">
          </colgroup>
          <tbody style="background: rgba(21,42,99,.8);">
          <tr v-for="(row,indexRow) in dataList" :key="indexRow">
            <td class="eq_1_column_1" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.DEPOT}}</td>
            <td class="eq_1_column_2" style="border-bottom: 1px solid #293D72;height: 29px;color: #f0ce43;">{{row.PREPARE}}</td>
            <td class="eq_1_column_3" style="border-bottom: 1px solid #293D72;height: 29px;">{{row.PLACE}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="gongwu-light-panel" v-if="isLight">
      <div class="brief-area">
        <div class="light-gongwu-logo">
          <div>
            <span style="color: #5EB0F3; font-size: 36px; font-weight: bolder">工务</span>
          </div>
          <div class="eq-log-light"></div>
        </div>
        <div class="light-gongwu-status">
          <div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
            <div style="color: #656E77; font-weight: bold; display: flex; align-items: flex-end; flex-direction: column">
              <p>施工计划</p>
              <p>维修计划</p>
              
              <p>天窗</p>
              <p>防洪备料</p>
              <p>防洪看守点</p>
            </div>
          </div>
          <div style="width: 100px; height: 100%; display: flex; align-content: center; align-items: center; justify-content: center">
            <div style="color: #04B5AF; font-weight: bold; display: flex; align-items: flex-start; flex-direction: column">
              <p>{{ sgPlan }}个</p>
              <p>{{ wxPlan }}个</p>
              
              <p>{{ parseInt(sgPlan) + parseInt(wxPlan) }}个</p>
              <p>{{ bl }}份</p>
              <p>{{ ksd }}个</p>
            </div>
          </div>
        </div>
      </div>
      <div class="table-area">
        <div style="width: 100%; height: 100%; padding: 5px">
          <el-table height="515px" style="width: 100%; height: 100%; border-radius: 15px" :data="dataList" :border="false" :stripe="false" size="mini">
            <el-table-column width="200" prop="DEPOT" label="工务段" align="center"></el-table-column>
            <el-table-column width="100" prop="PREPARE" label="防洪备料份数" align="center">
              <template slot-scope="bl">
                <span style="color: #5EB0F3">{{ bl.row.PREPARE }}</span>
              </template>
            </el-table-column>
            <el-table-column width="125" prop="PLACE" label="防洪看守点个数" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- <div style="position: absolute; margin-top: 10px; right: 31%">
      <el-button size="mini" type="primary" @click="jumpToReport">查看工务报表</el-button>
    </div> -->
  </div>
</template>

<script>
// 这里引用各种资源
// import InterFace from "../../service/index.js";
import C from "../../../assets/com.js"
import tabs from "../../../components/bigScreen/KydTabs.vue";
import config from "../../../components/map/js/config.js"
export default {
  // 组件
  components: {
    tabs
  },
  // 数据仓库
  data() {
    return {
      totals: {
        all: 0,
        dong: 0,
        pu: 0
      },
      dataList: [],
      dataMx: [],
      dataMxCur: [],
      value:"",
      options:[],
      sgPlan: '',
      wxPlan: '',
      jgPlan: '',
      ksd: '',
      bl: '',
      tc: '',
      config: config
    }
  },
  // 属性
  props: {
  
  },
  // 组件挂载完毕
  mounted() {
    this.getData();
    // this.getData_mx();
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    
    
    /* @info  数据处理区-----------------------------------*/
    getCurDataMx(type) {
      this.dataMxCur = this.dataMx.filter(v=>v.DIRECTION===type);
    },
    
    /* @info  数据交互区-----------------------------------*/
    // 查询所有段供电设备统计数据
    getData() {
      C.getData({
        c: 'tyzd_ggy2058',
        url: 'https://10.192.126.203/GeneralProServlet'
      }, (res) => {
        // console.log(res)
        if (res.success) {
          console.log('获取工务防洪资源概要', res.data)
          this.dataList = res.data['1']
          this.sgPlan = res.data['2'][0].SG_NUM
          this.wxPlan = res.data['3'][0].WX_NUM
          this.ksd = res.data['4'][0].KSD_NUM
          this.bl = res.data[5][0].BL_NUM
          // C.getData({
          //   c: 'yjcz_ggy9013',
          //   // url: 'https://10.192.126.203/GeneralProServlet',
          //   url: 'https://10.192.34.79/ky203/GeneralProServlet'
          // }, (res) => {
          //   if (res.success) {
          //     this.jgPlan = res.data
          //   }
          // })
        }
      })
    },
    jumpToReport() {
      let url = this.$router.resolve({
        path: '/Reports'
      })
      window.open(url .href, '_blank')
    }
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {
    isLight() {
      if (config.superMap.lightMode === undefined) {
        return false
      } else {
        return config.superMap.lightMode
      }
    }
  },
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.gongwu-light-panel {
  padding: 30px;
  height: 100%;
  width: 100%;
}

.gongwu-light-panel .brief-area {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.gongwu-light-panel .brief-area .light-gongwu-logo {
  width: 40%;
  height: 100%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.gongwu-light-panel .brief-area .light-gongwu-status {
  width: 220px;
  height: 100%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
}

.gongwu-light-panel .table-area {
  height: 520px;
  width: 100%;
  display: flex;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  border-radius: 15px;
  margin-top: 50px;
}

.eq-log {
  vertical-align: top;
  width: 150px;
  height: 100%;
  background: url(../img/gongwu.gif) no-repeat;
  background-size: 200px 200px;
  background-position: -20px 15px;
  text-align: center;
}

.eq-log-light {
  vertical-align: top;
  width: 200px;
  height: 200px;
  background: url(../img/gongwuLight.gif) no-repeat;
  background-size: 200px 200px;
  background-position: 0px 0px;
  text-align: center;
}

.table-row-bg {
  background: url(../img/2.png) no-repeat;
  background-size: 100% 36px;
  background-position: 0px 3px;
}

.split {
  position: absolute;
  left: 0;
  height: 30px;
  width: 1px;
  margin-top: -6px;
  border-left: 1px solid #71AFDC;
}

>>>.el-pager li,
>>>.el-pagination button:disabled,
>>>.el-pagination .btn-next,
>>>.el-pagination .btn-prev {
  background: transparent;
  color: white;
}
>>>.blue-select .el-input__inner{
  padding: 0 0 0 5px;
  height: 20px;
  line-height: 20px;
  color: #5B96EF;
  background-color: transparent;
  border-color: #71AFDC;
}
>>>.blue-select .el-input__suffix{
  display: none;
}

>>>.el-table td {
  border: 0;
}

>>>.el-table th {
  border: 0;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
.blue-select.el-select-dropdown{
  background-color: #4D5670;
}
.blue-select .el-select-dropdown__item{
  color: #FAFAFA;
}
.blue-select .el-select-dropdown__item.hover, .blue-select .el-select-dropdown__item:hover{
  background-color: #7C87A5;
  color: #FAFAFA;
}
</style>
