<template>
  <div
    v-loading="isMapLoading"
    style="height: 100%; width: 100%; background: #010713; position: relative"
  >
    <div class="queryTop ELMTblue3" style="position:absolute;left;10px;top:10px;z-index:500">
      <el-select size="mini" v-model="unitselect" style="width: 130px" :disabled="unitFlag">
        <el-option
          v-for="(item, index) in unitList"
          :key="index"
          :label="item.text"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button size="mini" type="primary" style="margin-left: 10px" @click="editMap()">编辑</el-button>
      <el-button size="mini" type="primary" style="margin-left: 10px" @click="clearMap()">清除</el-button>
      <el-button size="mini" type="primary" style="margin-left: 10px" @click="saveMap()">保存</el-button>
    </div>
    <areaMap @click-area="onClickArea" @finish-area-select="onFinishAreaSelect" ref="areaMap"></areaMap>
    <area-save-dialog
      :dialogVisible="areaSaveDialogVisible"
      @area-save-cancelled="areaSaveDialogVisible = false"
      @area-saved="onAreaSave"
      :treeData="unitList"
    ></area-save-dialog>
  </div>
</template>

<script>
const areaURL = "https://10.192.34.79/ky203/GeneralProServlet";
import areaMap from "./areaMap.vue";
import unitTreeData from "../../../assets/unitTreeData.js";
import C from "../../../assets/com.js";
import AreaSaveDialog from "@/components/bigScreen/AreaSaveDialog.vue";
import message from "@/assets/message";
export default {
  components: {
    areaMap,
    AreaSaveDialog
  },
  data() {
    return {
      isMapLoading: false,
      webParam: null, //url参数
      unitList: [], //单位列表
      unitselect: "", //单位树选中数据

      areaSaveDialogVisible: false,
      //已经建立的区域对象列表
      areaDataList: [],
      //
      allStationList: [],
      //待保存的已划区域
      selectedArea: null,

      //已经选择的现有划定区域
      selectedExistedArea: null,
      selectedExistedColor: ""
    };
  },
  created() {
    this.webParam = this.$store.state.params;
    var sData = unitTreeData.getSelectOname(this.webParam);
    this.unitList = sData.selectData;
    this.unitselect = sData.value;
    this.unitFlag = !sData.flag;

    //创建时先获取一下全国车站列表
    if (this.$store.state.dicAllStation.length === 0) {
      C.getDataP123(
        {
          url: "http://10.192.126.203:9088/admin/kydp/execute",
          c: "kydp_zxy2023"
        },
        r => {
          this.$store.commit("updateDicAllStation", r["1"]);
        }
      );
    }
  },

  mounted: function() {
    this.displayAllAreas();
  },

  methods: {
    //当点击某个区域时的操作
    onClickArea: function(polygon) {
      if (this.selectedExistedArea !== null) {
        this.selectedExistedArea.setStyle({ color: this.selectedExistedColor });
        this.selectedExistedArea = polygon;
      }
      (this.selectedExistedColor = polygon.options.color),
        polygon.setStyle({ color: "#FFF" });
    },

    displayAllAreas: function() {
      let that = this;
      this.requestAllAreas()
        .then(r => {
          that.areaDataList = r;
        })
        .catch(e => {
          this.$message.error("获取所有区域失败");
          throw e;
        });
    },

    requestAllAreas: function() {
      return new Promise((resolve, reject) => {
        C.getData(
          {
            c: "tyzd_ggy2003",
            s: [],
            a: "获取所有区域",
            url: areaURL
          },
          rs => {
            if (rs.success) {
              resolve(rs.data[1]);
            } else {
              reject(rs);
            }
          }
        );
      });
    },

    requestSaveArea: function(danwei, colorString) {
      let pointString = JSON.stringify(this.selectedArea);
      return new Promise((resolve, reject) => {
        C.getData(
          {
            c: "tyzd_ggy4002",
            s: [danwei.id, danwei.code, pointString, "", colorString],
            a: "保存区域",
            url: areaURL
          },
          rs => {
            if (rs.success) {
              resolve();
            } else {
              reject(rs);
            }
          }
        );
      });
    },

    onAreaSave: function(obj) {
      this.requestSaveArea(obj.selectedDanwei, obj.selectedColor)
        .then(() => {
          this.$message.success("保存成功");
          this.areaSaveDialogVisible = false;
          this.displayAllAreas();
        })
        .catch(e => {
          this.$message.error("保存失败");
          throw e;
        });
    },

    //当框选组件框选完成后
    //要去调用接口查询一下当前框选范围内存在的车站
    //获取完成后弹出保存对话框
    //20220125
    onFinishAreaSelect: function(pointList) {
      this.isMapLoading = true;
      this.selectedArea = pointList;
      this.areaSaveDialogVisible = true;
      // this.overlayAnalystProcess(pointList);
      this.getStationListInArea(pointList).then(data => {});
      // console.log(pointList);
    },

    // overlayAnalystProcess(pointList) {
    //   let polygon = L.polygon(pointList);
    //   let geometry = L.Util.transform(polygon,L.CRS.EPSG4326,L.CRS.EPSG3857)
    //   var serveUel =
    //     "http://10.194.72.181:8090/iserver/services/spatialAnalysis-TieLuTu-2/restjsr/spatialanalyst";
    //   // var serveUel = "http://10.194.72.181:8090/iserver/services/spatialAnalysis-WeiXingDiTu/restjsr/spatialanalyst";
    //   const overlayAnalystService = L.supermap.spatialAnalystService(serveUel);
    //   const datasetOverlayAnalystParameters = new SuperMap.DatasetOverlayAnalystParameters(
    //     {
    //       sourceDataset: "全国铁路线_1@kfknew",
    //       operateRegions: [geometry],
    //       tolerance: 0.000001,
    //       operation: SuperMap.OverlayOperationType.CLIP,
    //     }
    //   );
    //   console.log(
    //     "datasetOverlayAnalystParameters" + datasetOverlayAnalystParameters
    //   );
    //   overlayAnalystService.overlayAnalysis(
    //     datasetOverlayAnalystParameters,
    //     (serviceResult) => {
    //       // var result = serviceResult.result;
    //       console.log(serviceResult);
    //       // resultLayer = L.geoJSON(result.recordset.features).addTo(this.map);
    //     }
    //   );
    // },

    //获取划定范围内的车站列表
    getStationListInArea: function(pointList) {
      return new Promise((resolve, reject) => {
        let polygon = L.polygon(pointList);
        let geometry = L.Util.transform(
          polygon,
          L.CRS.EPSG4326,
          L.CRS.EPSG3857
        );

        let queryService = L.supermap.featureService(
          "http://10.194.72.181:8090/iserver/services/data-WeiXingDiTu/rest/data/"
        );
        let queryParams = new SuperMap.GetFeaturesByGeometryParameters({
          datasetNames: ["kfknew:成都局车站字典3857"],
          geometry: geometry,
          spatialQueryMode: "CONTAIN"
        });

        queryService.getFeaturesByGeometry(queryParams, result => {
          resolve(result.features);
        });
      });
    },

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
      });
      C.getData(
        {
          c: "trdm_lv_693",
          s: [[[unitId, "1"]], sql1],
          async: true,
          a: "trdm_lv_693更新指定组织机构GIS范围坐标点集合"
        },
        rs => {
          if (rs[0] == "true") {
            this.$message.success("保存成功");
            if (sql1.length > 0) {
              this.$refs.areaMap.saveEdit(points);
            }
          } else {
            this.$message.error("保存失败");
          }
          console.log(rs);
        }
      );
    },
    getUnitName(unitid) {
      var rs = "";
      this.unitList.forEach(v => {
        if (v.id == unitid) {
          rs = v.text;
        }
      });
      return rs;
    },
    getPolygonPoints() {
      var unitId = this.unitselect.toUpperCase();
      C.getData(
        {
          c: "trdm_lv_692",
          s: [unitId, "1"],
          async: true,
          a: "获取指定组织机构GIS范围坐标点集合",
          url: 'https://10.192.34.79/TRDM/GeneralProServlet'
        },
        rs => {
          var points = [];
          rs.forEach(v => {
            points.push([v.AREA_X, v.AREA_Y]);
          });
          if (points.length > 0) {
            this.$refs.areaMap.drawLines(points);
          }
        }
      );
    }
  },
  watch: {
    unitselect(val) {
      this.refreshData();
    },

    areaDataList: function(newValue) {
      //根据获取到的所有已划分区在地图上绘制多边形
      let polygonData = [];
      for (let i = 0; i < newValue.length; i++) {
        try {
          let item = newValue[i];
          let obj = {
            points: JSON.parse(item.POINTS),
            color: item.COLOR,
            dwName: item.DW_NAME,
            dwId: item.DW_ID,
            id: item.PK_ID
          };
          polygonData.push(obj);
        } catch (e) {
          continue;
        }
      }
      this.$refs.areaMap.drawPolygons(polygonData);
    }
  }
};
</script>

<style scoped>
</style>
