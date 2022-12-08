<template>
  <div style="height:100%;width:100%;background:#010713;position:relative">
    <div class="queryTop ELMTblue3" style="position:absolute;left;10px;top:10px;z-index:500">
      <el-select size="mini" v-model="unitselect" style="width:130px;" :disabled="unitFlag">
        <el-option
          v-for="(item,index) in unitList"
          :key="index"
          :label="item.text"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button size="mini" type="primary" style="margin-left:10px;" @click="editMap()">编辑</el-button>
      <el-button size="mini" type="primary" style="margin-left:10px;" @click="clearMap()">清除</el-button>
      <el-button size="mini" type="primary" style="margin-left:10px;" @click="saveMap()">保存</el-button>
    </div>
    <areaMap ref="areaMap"></areaMap>
  </div>
</template>

<script>
import areaMap from './areaMap.vue';
import unitTreeData from '../../../assets/unitTreeData.js';
import C from "../../../assets/com.js";
export default {
  components: {
    areaMap,
  },
  data() {
    return {
      webParam: null,//url参数
      unitList: [],//单位列表
      unitselect: "",//单位树选中数据
    }
  },
  created() {
    this.webParam = this.$store.state.params;
    var sData = unitTreeData.getSelectOname(this.webParam);
    this.unitList = sData.selectData;
    this.unitselect = sData.value;
    this.unitFlag = !sData.flag;
  },
  methods: {
    refreshData() {
      this.$refs.areaMap.clearEidtAll();
      this.getPolygonPoints();
    },
    editMap() {
      this.$refs.areaMap.openEditFlag();
    },
    clearMap() {
      this.$refs.areaMap.clearEidtAll();
    },
    saveMap() {
      var points = this.$refs.areaMap.getPolygonPoints();
      var unitName = this.getUnitName(this.unitselect);
      var unitId = this.unitselect.toUpperCase();
      var sql1 = [];
      points.forEach((v, index) => {
        sql1.push([unitId, unitName, "1", v[0], v[1], index]);
      })
      C.getData({
        c: "trdm_lv_693",
        s: [[[unitId, "1"]], sql1],
        async: true,
        a: "trdm_lv_693更新指定组织机构GIS范围坐标点集合"
      }, (rs) => {
        if (rs[0] == "true") {
          this.$message.success("保存成功");
          if (sql1.length > 0) {
            this.$refs.areaMap.saveEdit(points);
          }
        } else {
          this.$message.error("保存失败");
        }
        console.log(rs);
      });
    },
    getUnitName(unitid) {
      var rs = "";
      this.unitList.forEach(v => {
        if (v.id == unitid) {
          rs = v.text;
        }
      })
      return rs;
    },
    getPolygonPoints() {
      var unitId = this.unitselect.toUpperCase();
      C.getData({
        c: "trdm_lv_692",
        s: [unitId, "1"],
        async: true,
        a: "获取指定组织机构GIS范围坐标点集合",
        url: 'https://10.192.34.79/TRDM/GeneralProServlet'
      }, (rs) => {
        var points = [];
        rs.forEach(v => {
          points.push([v.AREA_X, v.AREA_Y]);
        })
        if (points.length > 0) {
          this.$refs.areaMap.drawLines(points);
        }
      });
    },
  },
  watch: {
    unitselect(val) {
      this.refreshData();
    }
  }
}
</script>

<style scoped>
</style>
