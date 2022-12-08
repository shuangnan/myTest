
<template>
  <div style="width:100%;height:100%;padding-top:15px;padding-left:20px;" :style="{paddingLeft:boxPL}">
    <div style="width:100%;height:35px;padding-bottom:5px;" class="top_tree">
      <selectTree
        :options="st_list"
        :value="st_valueId"
        :disabled="st_isDisabled"
        :filterable="st_filterFlag"
        selectWidth="150px"
        size="mini"
        @getValue="st_getValue($event)"
        selectTreeClass="selectTreeOne"
      ></selectTree>
    </div>
    <div id="resIframe" style="width:100%;height:calc(100% - 30px);display:flex;">
      <iframe v-show="iframeVisible" style="height:100%;width:100%;border:none" :src="src"></iframe>
      <div v-show="!iframeVisible" class="tilpText">请联系管理员配置显示视频！</div>
    </div>
  </div>
</template>

<script>
import C from "../../../assets/com.js";
import selectTree from "../../../components/data/selectTree.vue";
import unitTreeData from "../../../assets/unitTreeData.js";
export default {
  data() {
    return {
      // resids: ["6171041201002C01", "617104120100200A", "6171041201000C02", "6171041201001C07", "6171041201001A02", "6171031201003801", "6171061201007001", "6171021203000B01"],
      // nameList: ["成都东", "成都东", "成都东", "成都东", "成都东", "成都东", "成都东", "成都东"],
      resids: [],
      nameList: [],
      src: "",
      /*********下拉树*** */
      st_isDisabled: false, //禁用
      st_filterFlag: true, //可以进行搜搜
      st_valueId: "", //初始值 可选
      st_list: [], //列表项 必选
      selectTreeNode: "",//车站下拉树选择的车站
      treeParam: {},
      iframeVisible: true,
      boxPL:"",
    }
  },
  props: {
    webParam: {
      type: Object,
      default: () => { return {} }
    },
    unitid: {
      type: String,
      default: "",
    }
  },
  created() {
  },
  // 组件挂载完毕
  mounted() {
    this.treeParam = C.cloneObj(this.webParam);
    this.getData();
    this.getTreeData();
  },
  // 方法
  methods: {
    /**-------------------------响应事件-------------------------------*/
    /**-------------------------数据展示-------------------------------*/
    getData() {
      C.getData({
        c: "trdm_lv_119",
        s: [this.unitid.toUpperCase(), "SCZHZXDP_VIDEOS"],
        a: "【trdm_lv_119】获取生产指挥中心大屏摄像头配置",
        async: true,
      }, (r) => {
        if (r[0]) {
          this.iframeVisible = true;
          this.resids = [];
          this.nameList = [];
          var rsList = r[0].VALUE.split(",");
          rsList.forEach(v => {
            var item = v.split("@");
            this.nameList.push(item[0]);
            this.resids.push(item[1].split(":")[1]);
          })
          setTimeout(() => {
            this.setIfromeItem();
          }, 100);
        } else {
          this.iframeVisible = false;
        }
        console.log("生产指挥中心大屏摄像头配置", r);
      })
    },
    getTreeData() {
      this.treeParam.Oid = this.unitid.toUpperCase();
      var treeData = unitTreeData.getData_tree(this.treeParam,true);
      // this.st_isDisabled = !treeData.flag;
      // this.st_isDisabled = true;
      this.st_list = treeData.treeData;
      if (treeData.value) {
        // this.st_valueId = treeData.value;
      }
      if (this.st_list.length > 0) {
        //根据id找到对应的树选项
        var item = unitTreeData.getTreeNodeByid(treeData.value, this.st_list);
        item.zmlm = item.zmlm.toUpperCase();
        this.selectTreeNode = item;
      } else {
        // this.$message.error("没有查询到单位树");
        // return;
      }
    },
    /**-------------------------获取数据-------------------------------*/
    setIfromeItem() {
      var box = document.getElementById("resIframe");
      // var itemW = (box.offsetWidth - 80) / 4 + "px";
      var itemH = (box.offsetHeight - 30) / 2;
      var itemW=itemH*2;
      var marginX=(box.offsetWidth-itemW*4-1)/5;
      if(marginX<10){
        marginX=10;
        itemW = (box.offsetWidth - 52) / 4;
      }
      itemW=itemW-1;
      this.boxPL=marginX+"px";
      var residString = this.resids.join(",");
      this.src = "";
      setTimeout(() => {
        // this.src = "http://localhost:8080/index2.html#/JKItems?resid=6102001202000234,6199001204009501&closeFlag=false&fullFlag=1&UserPID=10000000000000000X&width=600px&height=400px&margin=20px,40px&nameList=成都东,重庆北";
        this.src = C.origin + "/JFLCMS/vue/index2.html#/JKItems?closeFlag=false&refreshBtn=1&fullFlag=1&resid=" + residString + "&UserPID=10000000000000000X&width=" + itemW + "px&height=" + itemH + "px&margin="+marginX+"px,10px&nameList=" + this.nameList.join(",");
      }, 100);
    },
    //车站选择事件
    st_getValue(node) {
      if (node&&node.zmlm) {
        this.$emit("openLW4Detail", node);
      }else{
        this.$message.warning("请选择车站");
      }
    },
  },
  // 监视属性
  watch: {
    unitid() {
      this.getData();
      this.getTreeData();
    }
  },
  // 计算属性
  computed: {

  },
  // 组件
  components: {
    selectTree
  },
}
</script>

<style scoped>
.videoItem {
  height: 100px;
  width: 200px;
  margin-right: 10px;
}
/deep/.top_tree .el-input.is-disabled {
  background-color: transparent !important;
  border-color: #3d3c6d !important;
  color: #02eeff !important;
}
/deep/.top_tree .el-input__inner {
  background-color: transparent !important;
  border-color: #3d3c6d !important;
  color: #02eeff !important;
}
/deep/.top_tree .el-input__suffix {
  background-color: transparent;
  right: 0;
}
.tilpText{
  font-size: 16px;
  color:#4177c7;
}
>>>.el-select-dropdown__wrap{
  max-height: 300px;
}
</style>