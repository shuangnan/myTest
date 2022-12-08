<!-- 
 * @created：	2021年4月22日
 * @author：	ch
 * @version:	v1.0
 * @desc:		列车开行信息
 * @path:		http://10.192.6.155:9090/JFLCMS/vue/#/trainTravelInfo?id=118672757&blue=true
 -->
<template>
  <el-container
    style="width:100%;height:100%;border-bottom-left-radius: 6px;"
    :style="{background:skinBlue?'rgba(67,90,121,0.6)':'aliceblue',color:skinBlue?'white':''}"
  >
    <el-aside style="width:320px;height:100%;">
      <div style="font-size: 12px;padding: 0px 20px 0px 0px;">
        <div class="base-station" :style="{color: skinBlue?'#fafafa':''}" alt="发到站">
          {{base.depStation}}-{{base.arrStation}}
          <span
            class="base-zwd"
            :style="{color: base.lateTime==='正点'?'#92E252':'#F1A1A0'}"
          >{{base.lateTime}}</span>
        </div>

        <div
          style="border-top-right-radius: 15px;border-bottom-right-radius: 15px;padding-left: 15px;padding-top: 3px;padding-bottom: 9px;"
          :style="{background: skinBlue?'rgba(5,23,43,.4)':''}"
        >
          <div class="base-item" style="padding-top: 8px;">
            <label>始发日期</label>
            {{base.startDate}}
          </div>
          <div class="base-item">
            <label>运行状态</label>
            {{base.curStatuStr}}
          </div>
          <div class="base-item">
            <label>运行区间</label>
            {{base.runStation}}
          </div>
          <div class="base-item">
            <label>{{base.timeTitle1}}</label>
            {{base.timeValue1}}
          </div>
          <div v-if="base.timeVisible2" class="base-item">
            <label>{{base.timeTitle2}}</label>
            {{base.timeValue2}}
          </div>
        </div>

        <div class="base-item" style="padding-left: 15px;padding-top: 6px;">
          当前通勤人数：
          <span :style="{color: skinBlue?'white':'#7fadcf'}">{{curNumTQ}}人</span>
        </div>
        <div style="padding-bottom: 5px;padding-left: 15px;padding-top: 6px;">
          <span style="display: inline-block;vertical-align: middle;padding-right: 10px;">三乘人员</span>
          <template v-if="days_sx===''">
            <a class="btn-sc" @click="getData_sc(0)" :class="{active:curBtnSc===0}">今天</a>
            <a class="btn-sc" @click="getData_sc(-1)" :class="{active:curBtnSc===-1}">昨天</a>
            <a class="btn-sc" @click="getData_sc(-2)" :class="{active:curBtnSc===-2}">前天</a>
          </template>
        </div>
        <div style="padding-left: 15px;">
          <table class="list-per" :class="{'blue':skinBlue}" cellpadding="0" cellspacing="0">
            <tbody>
              <tr v-for="item in data_sc">
                <td class="tit" style="width: 50px;">{{item.ZhiWei}}:</td>
                <td>
                  <div class="per" v-for="per in item.children">
                    <span>{{per.E_Name}}（{{per.KYD}}）</span>
                    <label class="tel">TEL:{{per.E_Phone}}</label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-aside>
    <el-main style="padding:0 13px 0px 0px;overflow: hidden;">
      <el-tabs type="card" size="mini" v-model="curTab" class="my-tab" :class="{'blue':skinBlue}">
        <el-tab-pane label="乘客" name="ck" style="height: 100%;">
          <el-table
            :data="data_ck"
            size="mini"
            :stripe="true"
            border
            :highlight-current-row="false"
            height="100%"
          >
            <el-table-column
              label="车站"
              prop="cz"
              align="center"
              min-width="50"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="到点" prop="dd" align="center" min-width="40"></el-table-column>
            <el-table-column label="发点" prop="fd" align="center" min-width="40"></el-table-column>
            <el-table-column label="人数" align="center">
              <el-table-column label="上车" prop="sc" align="center" min-width="40"></el-table-column>
              <el-table-column label="下车" prop="xc" align="center" min-width="40"></el-table-column>
              <el-table-column label="车内" prop="cn" align="center" min-width="40"></el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="运行状况" name="yxzk" style="height: 100%;">
          <el-table
            :data="data_yxzk"
            size="mini"
            :stripe="true"
            border
            :highlight-current-row="false"
            :row-class-name="highlightRow_yxzk"
            height="100%"
          >
            <el-table-column label="序" prop="cxh" width="20" align="center"></el-table-column>
            <el-table-column
              label="站名"
              prop="czm"
              align="center"
              min-width="50"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="到达时间" align="center">
              <el-table-column label="图定" prop="ctddd" align="center" min-width="40"></el-table-column>
              <el-table-column label="实际" prop="csjdd" align="center" min-width="40"></el-table-column>
            </el-table-column>
            <el-table-column label="出发时间" align="center">
              <el-table-column label="图定" prop="ctdcf" align="center" min-width="40"></el-table-column>
              <el-table-column label="实际" prop="csjcf" align="center" min-width="40"></el-table-column>
            </el-table-column>
            <el-table-column label="状态" prop="csjdf" align="center" min-width="40"></el-table-column>
            <el-table-column label="到晚" prop="cdwd" align="center" min-width="50">
              <template slot-scope="p">
                <span v-if="p.row.cdwd==='正点'||p.row.cdwd==='早点'" style="color:#0">{{p.row.cdwd}}</span>
                <span v-else style="color:#F1A1A0">{{p.row.cdwd}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发晚" prop="cfwd" align="center" min-width="50">
              <template slot-scope="p">
                <span v-if="p.row.cfwd==='正点'||p.row.cfwd==='早点'" style="color:#0">{{p.row.cfwd}}</span>
                <span v-else style="color:#F1A1A0">{{p.row.cfwd}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="时刻表" name="skb" style="height: 100%;">
          <el-table
            :data="data_skb"
            size="mini"
            :stripe="true"
            border
            :highlight-current-row="false"
            height="100%"
          >
            <el-table-column label="序" prop="xh" align="center" min-width="20"></el-table-column>
            <el-table-column
              label="车站"
              prop="cz"
              align="center"
              min-width="50"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="到点" prop="dd" align="center" min-width="35"></el-table-column>
            <el-table-column label="发点" prop="fd" align="center" min-width="35"></el-table-column>
            <el-table-column label="天数" prop="ts" align="center" min-width="40">
              <template slot-scope="p">
                <span v-if="p.row.ts==='0'">当天</span>
                <span v-else-if="p.row.ts==='1'">第二天</span>
                <span v-else-if="p.row.ts==='2'">第三天</span>
                <span v-else>第四天</span>
              </template>
            </el-table-column>
            <el-table-column label="历时" prop="ls" align="center" min-width="35"></el-table-column>
            <el-table-column label="里程" prop="lc" align="center" min-width="30"></el-table-column>
            <el-table-column label="区间" align="center">
              <el-table-column label="历时" prop="qjls" align="center" min-width="35"></el-table-column>
              <el-table-column label="匀速" prop="qjys" align="center" min-width="40"></el-table-column>
              <el-table-column label="里程" prop="qjlc" align="center" min-width="30"></el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="交路" name="tq" style="height: 100%;">
          <el-table
            :data="data_jl"
            size="mini"
            :stripe="true"
            border
            :highlight-current-row="false"
            height="100%"
          >
            <el-table-column label="车次" prop="CC" align="center" min-width="50"></el-table-column>
            <el-table-column label="区间" align="center">
              <el-table-column label="始发站" prop="START_STN" align="center" min-width="40"></el-table-column>
              <el-table-column label="终到站" prop="END_STN" align="center" min-width="40"></el-table-column>
            </el-table-column>
            <el-table-column label="时间" align="center">
              <el-table-column label="始发时间" prop="START_DATE" align="center" min-width="40">
                <template slot-scope="{row}">{{row.START_DATE.substring(11,16)}}</template>
              </el-table-column>
              <el-table-column label="终到时间" prop="END_DATE" align="center" min-width="40">
                <template slot-scope="{row}">{{row.END_DATE.substring(11,16)}}</template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="编组" name="bz" style="height: 100%;">
          <el-table
            :data="data_bz"
            size="mini"
            :stripe="true"
            border
            :highlight-current-row="false"
            height="100%"
          >
            <el-table-column label="辆序" prop="bz_lx" align="center" width="30"></el-table-column>
            <el-table-column label="车厢" align="center">
              <el-table-column label="类型" prop="bz_cxlx" align="center" min-width="50"></el-table-column>
              <el-table-column label="编号" prop="bz_cxbh" align="center" min-width="50"></el-table-column>
            </el-table-column>
            <el-table-column label="定员" prop="bz_dy" align="center" min-width="50"></el-table-column>
            <el-table-column label="车型" prop="bz_cx" align="center" min-width="50"></el-table-column>
            <template v-if="bzlx=='K'">
              <el-table-column label="乘务员1" prop="bz_cwy1" align="center" min-width="60"></el-table-column>
              <el-table-column label="乘务员2" prop="bz_cwy2" align="center" min-width="60"></el-table-column>
            </template>
            <template v-else>
              <el-table-column label="饮水设备" prop="bz_yssb" align="center" min-width="50">
                <template slot="header">
                  饮水
                  <br />设备
                </template>
              </el-table-column>
              <el-table-column label="集便" prop="bz_jb" align="center" min-width="50"></el-table-column>
              <el-table-column label="空调" prop="bz_kt" align="center" min-width="50"></el-table-column>
              <el-table-column label="座椅形式" prop="bz_zyxs" align="center" min-width="50">
                <template slot="header">
                  座椅
                  <br />形式
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
// 这里引用各种资源
import C from "../../../../../assets/com.js";
const graphUrl =
  "http://10.192.34.79/GraphH5/services/GeneralTicketStreamServlet"; //在途列车接口地址
const selfUrl = "http://10.192.34.79/TRDM/GeneralProServlet"; //在途列车接口地址
// TC2000 -->kydp_zxy8028
// TC2010 -->kydp_zxy8029
// TC8740 -->kydp_zxy8030
// TC2022 -->kydp_zxy8031
// TC1022 -->kydp_zxy8032
export default {
  // 组件
  components: {},
  // 数据仓库
  data() {
    return {
      skinBlue: true, //蓝色皮肤
      urlP: {},
      // 当前选择的tab
      curTab: "ck",
      // 当前通勤人数
      curNumTQ: 0,
      //车次相关信息
      trainInfo: {
        trainNum: "", //车次
        trainDate: "", //车次日期
        trainOther: "", //
        trainID: "", //车次唯一ID
        sfrq: "" //车次始发日期
      },
      // 表格数据---乘客
      data_ck: [],
      // 表格数据---运行状况
      data_yxzk: [],
      // 表格数据---时刻表
      data_skb: [],
      // 表格数据---编组
      data_bz: [],
      bzlx: "K", //编组类型 默认K
      // 表格数据---交路
      data_jl: [],
      // 基本信息 参数(原运行图车信息)：{id:"118473790",cc:"车次",dwd:"到晚点分钟数",zt:"状态0,1,2,3",dqz:"当前站(中文)",xyz:"下一站(中文)",dqzsj_in:"到达当前站时间",dqzsj_out:"离开当前站时间"}
      base: {
        depStation: "-", //发站---接口查询
        arrStation: "-", //到站---接口查询
        startDate: "-", //始发日期---接口查询

        lateTime: "-", //正晚点情况 由运行状况数据中当前站正晚点数据
        curStatuStr: "-", //当前运行状态文本---传参	zt: 0-在站，1-在途，2-始发，3-终到
        runStation: "-", //运行区间---传参	dqz\xyz: 0-在站(dqz)，1-在途(dqz-xyz)，2-始发(dqz)，3-终到(dqz)
        timeVisible1: true, //时间显隐1---传参 zt: 0-在站(true)，1-在途(true)，2-始发(true)，3-终到(true)
        timeTitle1: "到达时间", //时间标题1---传参	zt:	0-在站(到达时间)，1-在途(出发时间)，2-始发(预计出发时间)，3-终到(到达时间)
        timeValue1: "-", //时间值1---传参	dqzsj_in\dqzsj_out: 0-在站(dqzsj_in)，1-在途(dqzsj_out)，2-始发(dqzsj_out)，3-终到(dqzsj_in)
        timeVisible2: true, //时间显隐2---传参 zt: 0-在站(true)，1-在途(true)，2-始发(false)，3-终到(false)
        timeTitle2: "预计出发时间", //时间标题2---传参	zt:	0-在站(预计出发时间)，1-在途(预计到达时间)，2-始发("")，3-终到("")
        timeValue2: "-" //时间值2---传参	dqzsj_in\dqzsj_out: 0-在站(dqzsj_out)，1-在途(dqzsj_in)，2-始发("")，3-终到("")
      },
      // 三乘信息
      data_sc: [],
      days_sx: "", //三乘天数，1-显示当天、昨天、前开，大于1则不显示
      curBtnSc: 0 //当前选择三乘按钮
    };
  },
  // 属性
  props: {
    "train-id": String,
    blue: {
      type: Boolean,
      default: true
    }
  },
  // 组件挂载完毕
  mounted() {
    document.querySelector("title").innerHTML = "列车开行信息";
    this.getDatas();
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    getDatas() {
      const webP = this.$store.state.params;
      const id = this.trainId || webP.id;
      this.skinBlue = this.blue || webP.blue;
      this.getTrainInfoByTrainid(id, () => {
        const zt = this.urlP.zt;
        this.base.runStation = this.urlP.dqz; //运行区间 默认：dqz
        this.base.timeValue1 = this.urlP.dqzsj_in; //时间值1 默认：dqzsj_in
        if (zt === "0") {
          //在站
          this.base.timeValue2 = this.urlP.dqzsj_out; //时间值2
        } else if (zt === "1") {
          //在途
          this.base.curStatuStr = "在途"; //当前运行状态文本
          this.base.runStation = this.urlP.dqz + " - " + this.urlP.xyz; //运行区间 1-在途(dqz-xyz)
          this.base.timeTitle1 = "出发时间"; //时间标题1
          this.base.timeTitle2 = "预计到达时间"; //时间标题2
          this.base.timeValue2 = this.urlP.dqzsj_in; //时间值2
        } else if (zt === "2") {
          //始发
          this.base.curStatuStr = "始发"; //当前运行状态文本
          this.base.timeTitle1 = "预计出发时间"; //时间标题1
          this.base.timeValue1 = this.urlP.dqzsj_out; //时间值1
          this.base.timeVisible2 = false; //时间显隐2
        } else if (zt === "3") {
          //终到
          this.base.curStatuStr = "终到"; //当前运行状态文本
          this.base.timeValue1 = this.urlP.dqzsj_out; //时间值1
          this.base.timeVisible2 = false; //时间显隐2
        }
        this.getBaseInfo(); //获取数据
        this.getData_yxzk(); //获取运行状态 依赖 this.urlP.id
        this.getData_sc(null); //获取三乘信息 依赖 this.urlP.cc
      });
    },
    openWin(per) {
      console.log("人员信息", per);
      // https://10.192.6.17/webrtc/?meetingNumber=910041248939&username=登录人姓名&userid=登录人身份证
      // pageType=1&UserName=登录人姓名&UserPID=登录人身份证&Oid=登录人单位ID&Oname=登录人单位&userNameList=接收人名,..&userPidList=接收人身份证,..
      const webP = this.$store.state.params;
      const pos =
        "&UserName=" +
        webP.UserName +
        "&UserPID=" +
        webP.UserPID +
        "&Oid=" +
        webP.Oid +
        "&Oname=" +
        webP.Oname;
      const rec = "&userNameList=" + per.E_Name + "&userPidList=" + per.E_Phone;
      const url =
        C.ADDS.url_34_79 + "/JFLCMS/vue/#/XYLink?pageType=1" + pos + rec;
      window.open(url);
    },
    /* @info  数据处理区-----------------------------------*/
    highlightRow_yxzk({ row }) {
      if (row.curStn) {
        return "cur-stn";
      }
      return "";
    },

    /* @info  数据交互区-----------------------------------*/
    getTrainInfoByTrainid(trainid, cb) {
      C.getData(
        {
          c: "kydp_zxy8027", //"trdm_lv_691",
          s: [trainid], //[列车ID]118635092
          url: C.kydUrl,
          a: "【kydp_zxy8027】获取指定在途车基本情况"
        },
        r => {
          //  {"cc":"D1762","xyz":"眉山东","zt":"1","id":"118676621","dqzsj_out":"2021-06-09 18:04:00","dqz":"青神",fcrq:"发车日期"}
          if (r) {
            this.urlP = {
              id: r.id,
              cc: r.cc,
              dwd: 10,
              zt: r.zt,
              dqz: r.dqz,
              xyz: r.xyz,
              dqzsj_in: r.dqzsj_in,
              dqzsj_out: r.dqzsj_out
            };
            this.base.startDate = r.fcrq; //始发日期
            cb();
          } else {
            this.$message.error("获取指定在途车基本情况");
          }
        }
      );
    },
    // 获取数据
    getBaseInfo() {
      var date = new Date().Format("yyyyMMdd");
      C.getData(
        {
          url: C.kydUrl,
          c: "kydp_zxy8028", // TC2000-->kydp_zxy8028
          s: [this.urlP.cc, date],
          url: C.kydUrl,
          a: "【kydp_zxy8028】获取车次信息"
        },
        r => {
          if (r && r.status) {
            //trainMsg msg: ["K177", "20210422", "", "380000K1770B"]
            const trainInfo = {
              trainNum: r.msg[0], //车次
              trainDate: r.msg[1], //车次日期
              trainOther: r.msg[2], //
              trainID: r.msg[3], //车次唯一ID
              sfrq:
                r.msg[1].substring(0, 4) +
                "-" +
                r.msg[1].substring(4, 6) +
                "-" +
                r.msg[1].substring(6) //车次日期
            };
            this.trainInfo = trainInfo;
          } else {
            this.$message.error("获取车次信息失败");
          }
          this.getData_skb(); //获取时刻表---依赖 this.trainInfo.trainDate ，this.trainInfo.trainID
          this.getData_jl(); //获取交路数据---
          this.getData_bz(); //获取编组 依赖 this.urlP.cc, this.base.startDate
        }
      );
    },
    //获取时刻表
    getData_skb() {
      C.getData(
        {
          url: C.kydUrl,
          c: "kydp_zxy8029", // TC2010-->kydp_zxy8029
          s: [this.trainInfo.trainDate, this.trainInfo.trainID],
          a: "【kydp_zxy8029】获取时刻表"
        },
        r => {
          if (r && r.status) {
            // [["76000G871500","G8715/G8718","成都东","万州北","空调高速","成都东","2021-04-22 14:26","万州北","2021-04-22 17:46","564","03:20","[....]"]]
            this.base.depStation = r.msg[0][2];
            this.base.arrStation = r.msg[0][3];
            const data_skb = [];
            try {
              const skb = JSON.parse(r.msg[0][11]); //时刻表
              C.$.each(skb, function(i, v) {
                data_skb.push({
                  xh: v[0],
                  cz: v[1],
                  dd: v[2],
                  fd: v[3],
                  ts: v[4],
                  ls: v[5],
                  lc: v[6],
                  qjls: v[7],
                  qjys: v[8],
                  qjlc: v[9],
                  jm: v[10]
                });
              });
              this.data_ck = data_skb; //表格数据---乘客
              this.data_skb = data_skb; //表格数据---时刻表
            } catch (e) {}
          }
          this.getData_ck_skb(); //乘客+时刻表(用以补充乘客表中的上下车人数信息) 依赖 this.trainInfo.trainDate, this.trainInfo.trainID
        }
      );
    },
    // 获取数据 乘客+时刻表 (用以补充乘客表中的上下车人数信息)
    getData_ck_skb() {
      C.getData(
        {
          url: C.kydUrl,
          c: "kydp_zxy8030", // TC8740 -->kydp_zxy8030
          s: [
            ["3000"],
            [this.trainInfo.trainDate, this.trainInfo.trainID],
            ["3000", "3001", "3002", "3003"]
          ],
          a: "【kydp_zxy8030】乘客+时刻表"
        },
        ck => {
          if (ck && ck.length > 0) {
            let sum = 0;
            const data_skb = C.cloneObj(this.data_skb);
            for (let i = 0; i < ck.length; i++) {
              var d = ck[i];
              let sc =
                parseInt(d[12]) +
                parseInt(d[13]) +
                parseInt(d[4]) +
                parseInt(d[5]) +
                parseInt(d[6]) +
                parseInt(d[7]) +
                parseInt(d[8]) +
                parseInt(d[9]) +
                parseInt(d[10]) +
                parseInt(d[11]);
              if (isNaN(sc)) {
                sc = 0;
              }
              let xc =
                parseInt(d[22]) +
                parseInt(d[23]) +
                parseInt(d[14]) +
                parseInt(d[15]) +
                parseInt(d[16]) +
                parseInt(d[17]) +
                parseInt(d[18]) +
                parseInt(d[19]) +
                parseInt(d[20]) +
                parseInt(ck[i][21]);
              if (isNaN(xc)) {
                xc = 0;
              }
              sum += sc;
              sum -= xc;
              if (i >= data_skb.length) {
                break;
              }
              data_skb[i].sc = sc;
              data_skb[i].xc = xc;
              data_skb[i].cn = sum;
            }
            this.data_ck = data_skb; //表格数据---乘客
            this.data_skb = data_skb; //表格数据---时刻表
          } else {
            console.log("未更新乘客上下车信息");
          }
        }
      );
    },
    // 获取交路数据
    getData_jl() {
      C.getData(
        {
          url: C.kydUrl,
          c: "kydp_zxy2044",
          s: [
            [this.trainInfo.trainNum, this.base.startDate.replace(/-/g, "")]
            // ["G350",this.base.startDate.replace(/-/g,"")],
          ],
          url: "https://10.192.34.79/ky203/GeneralProServlet",
          a: "【kydp_zxy2044】获取交路数据"
        },
        r => {
          if (r.success) {
            this.data_jl = r.data["1"];
          } else {
            console.log("未获取到交路数据");
          }
        }
      );
    },
    //获取运行状况
    getData_yxzk() {
      C.getData(
        {
          url: C.kydUrl,
          c: "kydp_zxy8031", // TC2022 -->kydp_zxy8031
          s: [this.urlP.id],
          a: "【kydp_zxy8031】获取运行状况"
        },
        sk => {
          let zwd_d = "正点";
          let zwd_f = "正点";
          if (sk && sk.length > 0) {
            const data_yxzk = [];
            for (var i = 0; i < sk.length; i++) {
              const obj = {};
              obj.cxh = i + 1;
              obj.czm = sk[i][3];

              obj.csjdd = sk[i][5];
              obj.csjcf = sk[i][6];
              obj.ctddd = sk[i][11];
              obj.ctdcf = sk[i][12];
              obj.csjdf = sk[i][10] >= 1 ? "到达" : "未到";
              // 站码 === 当前站 或者 数据为到达且下一条有数据且为未到
              if (
                obj.czm == this.urlP.dqz ||
                (obj.csjdf === "到达" && sk[i + 1] && sk[i + 1][10] < 1)
              ) {
                obj.curStn = true; //当前站
              }
              // 到达晚点情况
              if (sk[i][13] == 0) {
                obj.cdwd = "正点";
              } else if (sk[i][13] == 1) {
                if (sk[i][14] == "0") {
                  obj.cdwd = "正点";
                } else {
                  obj.cdwd = "晚点: " + sk[i][14];
                  if (obj.curStn) {
                    zwd_d = "晚点: " + sk[i][14] + "分";
                  }
                }
              }
              // 出发晚点情况
              if (sk[i][15] == 0) {
                obj.cfwd = "正点";
              } else if (sk[i][15] == 1) {
                if (sk[i][16] == "0") {
                  obj.cfwd = "正点";
                } else {
                  obj.cfwd = "晚点: " + sk[i][16];
                  if (obj.curStn) {
                    zwd_f = "晚点: " + sk[i][16] + "分";
                  }
                }
              }
              data_yxzk.push(obj);
            }
            this.data_yxzk = data_yxzk;
            // "1" //在途 "2" //始发 "3" //终到
            if (this.urlP.zt === "3") {
              this.base.lateTime = zwd_d;
            } else {
              this.base.lateTime = zwd_f;
            }
          } else {
            console.log("未获取运行状况");
          }
        }
      );
    },
    // 获取编组数据(接口没返回)
    getData_bz() {
      C.getData(
        {
          url: C.kydUrl,
          c: "kydp_zxy8032", //TC1022 -->kydp_zxy8032
          s: [this.urlP.cc, this.base.startDate.replace(/-/g, "")],
          a: "【kydp_zxy8032】获取编组数据"
        },
        sk => {
          if (sk && sk.length > 0) {
            const bzlx = sk[0][0][0]; //编组类型，用于显示隐藏列
            this.bzlx = bzlx;
            const data_bz = []; //编组
            let cxdyIndex = -1; //车型、定员数据开始坐标
            for (var i = 0; i < sk[0].length; i++) {
              obj = {};
              obj.bz_lx = i + 1; //辆序
              obj.bz_cxlx = sk[0][i][2]; //车厢类型
              obj.bz_cxbh = sk[0][i][5]; //车厢编号
              obj.bz_dy = sk[0][i][7]; //定员
              obj.bz_cnrs = sk[0][i][12]; //
              obj.bz_cx = sk[0][i][4]; //车型
              if (bzlx === "K") {
                obj.bz_cwy1 = sk[0][i][8]; //乘务员1
                obj.bz_cwy2 = sk[0][i][9]; //乘务员2
              } else {
                obj.bz_yssb = sk[0][i][12]; //饮水设备
                obj.bz_jb = sk[0][i][10]; //集便
                obj.bz_kt = sk[0][i][11]; //空调
                obj.bz_zyxs = sk[0][i][13]; //座椅形式
              }
              // 值的长度为2位，且车型、定员坐标未找到,且车型、定员都不为空，则记录坐标
              if (
                sk[0][i].length === 2 &&
                cxdyIndex === -1 &&
                sk[0][i][0] !== "" &&
                sk[0][i][1] !== ""
              ) {
                cxdyIndex = i;
              }
              data_bz.push(obj);
            }
            // dyNum = Number(sk[0][cxdyIndex][0]);//定员  要设置？？？
            // cxName = sk[0][cxdyIndex][1];//车型	要设置？？？
            // 设置机械师？？？
            this.data_bz = data_bz;
          } else {
            console.log("未获取到编组数据");
          }
        }
      );
    },
    //获取三乘信息
    getData_sc(ty) {
      if (ty === null) {
        this.curBtnSc = 0;
      } else {
        this.curBtnSc = ty;
      }
      //	[车次（客运车次），开行日期/始发日期（2020-01-10）]
      var now = new Date();
      if (ty === null || ty === 0) {
        now = now.Format("yyyy-MM-dd");
      } else if (ty === -1) {
        now = getDateTimeSub(now, "yyyy-MM-dd", -24);
      } else if (ty === -2) {
        now = getDateTimeSub(now, "yyyy-MM-dd", -48);
      }
      C.getData(
        {
          url: C.kydUrl,
          c: "kydp_zxy8024", // "trdm_lv_647",
          s: [this.urlP.cc, now],
          a: "【kydp_zxy8024】获取三乘信息"
        },
        r => {
          if (r !== "null") {
            // 第一次取数据
            if (ty === null) {
              this.days_sx = Math.abs(
                (Date.parse(new Date(r[0].ZD_date)) / 1000 -
                  Date.parse(new Date(r[0].SF_date)) / 1000) /
                  (3600 * 24)
              );
            }
            var real = [];
            var realJson = {};
            var realJsonIndex = 0;
            C.$.each(r, function(i, v) {
              if (typeof realJson[v.ZhiWei] === "undefined") {
                real.push({
                  ZhiWei: v.ZhiWei,
                  children: [v]
                });
                realJson[v.ZhiWei] = realJsonIndex++;
              } else {
                real[realJson[v.ZhiWei]].children.push(v);
              }
            });
            this.data_sc = real;
          } else {
          }
        }
      );
    }
  },
  // 监视属性
  watch: {
    trainId() {
      this.getDatas();
    }
  },
  // 计算属性
  computed: {}
};
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.base-station {
  padding-bottom: 10px;
  font-size: 14px;
  text-align: center;
  color: #ee4000;
}

.base-zwd {
  padding: 3px 0 3px 10px;
  font-size: 12px;
  text-align: center;
  color: #333333;
}

.base-item {
  padding: 3px 0px;
  font-weight: bold;
}

.base-item > label {
  display: inline-block;
  padding-right: 10px;
  font-size: 12px;
  color: #cfd7db;
  font-weight: normal;
}

.btn-sc {
  border: 1px solid #2ab3df;
  padding: 1px 8px;
  font-size: 12px;
  border-radius: 12px;
  color: #fafafa;
  margin-left: 10px;
  cursor: pointer;
}

.btn-sc.active {
  background: #2ab3df;
  box-shadow: 0px 3px 3px #1a3150;
}

.btn-sc:hover {
  opacity: 0.8;
}

.list-per {
  list-style: none;
  font-size: 12px;
}

.list-per td {
  padding: 3px 5px 2px 0;
}

.list-per .tit {
  text-align: left;
  color: #b0b9bc;
}

.list-per .per {
}

.list-per .tel {
  /* text-decoration: underline;
		color: #00aaff; */
}

.list-per .tel:hover {
  /* text-decoration: underline;
		color: #45b8ff;
		cursor: pointer; */
}

.my-tab {
  height: 100%;
}

/* 选项卡 */
>>> .my-tab .el-tabs__item {
  height: 28px;
  line-height: 28px;
  padding: 0 15px;
}

>>> .my-tab.blue .el-tabs__item {
  color: #0cc5f7;
  font-weight: bold;
}

>>> .my-tab .el-tabs__header {
  margin: 0px;
}

>>> .my-tab.blue .el-tabs__header,
>>> .my-tab.blue .el-tabs__header .el-tabs__nav,
>>> .my-tab.blue .el-tabs__header .el-tabs__item {
  border-color: transparent;
}

>>> .my-tab.blue.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #05172d;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

>>> .my-tab.el-tabs--top.el-tabs--card
  > .el-tabs__header
  .el-tabs__item:nth-child(1) {
  border-top-left-radius: 10px;
}

>>> .my-tab .el-tabs__content {
  height: calc(100% - 38px);
}

/* 表格 */
>>> .el-table--mini td,
>>> .el-table--mini th,
>>> .el-table--border td:first-child .cell,
>>> .el-table--border th:first-child .cell,
>>> .el-table .cell {
  padding: 1px 0px;
  line-height: 16px;
  font-weight: normal;
}

>>> .el-table
  > .el-table__header-wrapper
  > .el-table__header
  > thead
  > tr
  > th
  > .cell {
  line-height: 12px;
}

>>> .el-table--border td .cell.el-tooltip,
>>> .el-table--border th .cell.el-tooltip {
  padding-left: 5px;
}

/* el-tooltip */

>>> .blue .el-table--mini td,
>>> .blue .el-table--mini th,
>>> .blue .el-table--border td:first-child .cell,
>>> .blue .el-table td .cell {
  color: #d8dbdc;
}

>>> .blue .el-table--border th:first-child .cell,
>>> .blue .el-table--mini th,
>>> .blue .el-table th .cell {
  color: #ffffff;
}

>>> .blue .el-table--border th,
>>> .blue .el-table--border td {
  border-right-color: #0f326c;
}

>>> .blue .el-table--border th,
>>> .blue .el-table--border td {
  border-bottom-color: transparent;
}

>>> .el-table--border::after,
>>> .el-table--group::after,
>>> .blue .el-table::before {
  background-color: #091650;
}

>>> .blue .el-table--border {
  border-color: #091650;
  border-top-width: 2px;
}

>>> .blue .el-table {
  background-color: transparent;
}

>>> .el-table thead.is-group th {
  text-align: center;
}

>>> .blue .el-table thead.is-group th {
  background: #203d5d;
  border-bottom: 1px solid #0f326c;
}

>>> .blue .el-table tr.el-table__row {
  background-color: rgb(60, 81, 108, 0.6);
}

>>> .blue .el-table tr.el-table__row.el-table__row--striped,
>>> .blue .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: rgba(46, 67, 94, 0.6);
}

>>> .blue .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #208b78;
}

/* 运行状况中的当前站 */
>>> .blue .el-table tr.el-table__row.cur-stn,
>>> .blue .el-table__row.el-table__row--striped.cur-stn td,
>>> .blue
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped.cur-stn
  td {
  background: #208b78;
  color: white;
}

>>> .el-table tr.el-table__row.cur-stn,
>>> .el-table__row.el-table__row--striped.cur-stn td {
  background: #0081c2;
  color: white;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
