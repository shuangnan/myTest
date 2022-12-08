<!-- 
 * @created：	2022年10月12日
 * @author：	ch
 * @version:	v1.0
 * @desc:		公安基础数据维护
 -->
<template>
  <el-container style="width: 100%;height:100%;">
    <el-header style="height: 40px;padding-top: 7px;border-bottom: 1px solid #ddd;">
      <span style="font-size: 16px;padding-right: 20px;">公安基础数据维护</span>
    </el-header>
    <el-container style="width: 100%;height:100%;">
      <el-aside style="width:300px;height:100%;">
        <div style="position: relative;width:100%;height:100%;padding-top: 44px;border-right: 1px solid #ddd;">
          <div style="position: absolute;top: 0;left:0;height: 44px;width: 100%;padding: 6px;border-bottom: 1px solid #ddd;">
            <el-input placeholder="输入名称筛选" size="small" v-model="filterText1" @change="filterNode"></el-input>
          </div>
          <div style="width:100%;height:100%;overflow: auto;">
            <el-tree ref="unitTree" :data="unitData" @node-click="handleClickNode" :filter-node-method="doFilterNode" :highlight-current="true">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-aside>
      <el-main style="width: 100%;height: 100%;padding: 0;">
        <el-card class="box-card" style="width: 220px;">
          <div slot="header"><label class="group-tit">单位编码</label>
            <!-- <div class="tools">
							<el-button :disabled="!curNode.id || orgCode!==''" @click="orgCode_edit=orgCode;orgName_edit=orgName;unitNoVisible=true"
							 size="mini" type="primary" icon="el-icon-edit">设置</el-button>
						</div> -->
          </div>
          <div style="height: 30px;">{{orgCode}}</div>
        </el-card>
        <el-card class="box-card no-pading" style="width: 220px;">
          <div slot="header"><label class="group-tit">地理位置</label>
            <div class="tools">
              <el-button :disabled="orgCode===''" @click="pointX_edit=pointX;pointY_edit=pointY;positionVisible=true" size="mini" type="primary" icon="el-icon-edit">设置</el-button>
            </div>
          </div>
          <div style="height: 70px;padding-left:20px;">
            <div style="height:30px;line-height:30px;">经度：{{pointX}}</div>
            <div style="height:30px;line-height:30px;">纬度：{{pointY}}</div>
          </div>
        </el-card>
        <el-card class="box-card" style="width: 220px;">
          <div slot="header"><label class="group-tit">基本情况</label>
            <div class="tools">
              <el-upload :disabled="!canDo" ref="upload_jbqk" class="avatar-uploader" accept=".pdf" :show-file-list="false" :on-success="(response, file)=>handelSuccess(response, file,'jbqk')" :data="params" :action="action" :before-upload="(file)=>handleBeforeUpload(file,'jbqk')">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </div>
          <div style="height: 30px;">
            <label v-if="files.jbqk===''">您还未上传数据</label>
            <el-button v-else type="text" style="padding: 0;" @click="viewFile('jbqk')">点击查看文件</el-button>
          </div>
        </el-card>
        <el-card class="box-card" style="width: 220px;">
          <div slot="header"><label class="group-tit">两队一室</label>
            <div class="tools">
              <el-upload :disabled="!canDo" ref="upload_ldys" class="avatar-uploader" accept=".pdf" :show-file-list="false" :on-success="(response, file)=>handelSuccess(response, file,'ldys')" :data="params" :action="action" :before-upload="(file)=>handleBeforeUpload(file,'ldys')">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </div>
          <div style="height: 30px;">
            <label v-if="files.ldys===''">您还未上传数据</label>
            <el-button v-else type="text" style="padding: 0;" @click="viewFile('ldys')">点击查看文件</el-button>
          </div>
        </el-card>
        <el-card class="box-card no-pading" style="width: 300px;">
          <div slot="header"><label class="group-tit">简介</label>
            <div class="tools">
              <el-button :disabled="orgCode===''" @click="brief_edit=brief;briefVisible=true" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            </div>
          </div>
          <div style="height: 70px;padding:5px;">
            <div style="height: 60px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;text-indent: 28px;">{{brief}}</div>
          </div>
        </el-card>
        <el-card class="box-card" style="width:calc(100% - 10px)">
          <div slot="header"><label class="group-tit">警力部署</label></div>
          <div style="">
            <el-upload :disabled="!canDo || orgCode===''" ref="upload_jlbs" list-type="picture-card" accept=".jpg,.jpeg,.png" :multiple="false" :file-list="files.jlbs_full" :data="params" :action="action" :on-preview="(file)=>viewFile('jlbs',file)" :before-remove="beforeRemove" :on-remove="handleRemove" :on-success="(response, file)=>handelSuccess(response, file,'jlbs')" :before-upload="(file)=>handleBeforeUpload(file,'jlbs')">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-card>
        <el-card class="box-card no-pading" style="width:calc(100% - 10px);">
          <div slot="header">
            <label class="group-tit">主要数据</label>
            <span style="margin-left: 20px;">
              日期范围：<el-date-picker v-model="date" size="mini" :clearable="false" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 220px;"></el-date-picker>
              <el-button @click="getDetails();" :disabled="!canDo" size="mini" type="primary" style="margin-left: 10px;" icon="el-icon-search">查询</el-button>
              <el-button @click="openSetCaseNumsWin('add')" :disabled="!canDo" size="mini" type="success" style="margin-left: 10px;" icon="el-icon-plus">新增</el-button>
              <el-upload ref="upload_more" accept=".xlsx,.xls" :show-file-list="false" :on-success="(response, file)=>handelSuccess(response, file,'more')" :data="params" :action="actionMore" :before-upload="(file)=>handleBeforeUpload(file,'more')" style="display: inline-block;margin-left: 10px;">
                <el-button size="mini" type="success" icon="el-icon-upload">批量导入</el-button>
              </el-upload>
              <a :href="downSrc" download="主要数据批量导入模板" style="margin-left: 10px;" icon="el-icon-download">批量导入模板下载</a>
            </span>
          </div>
          <div style="" :style="{height:tableH}">
            <el-table :data="gridList" border size="mini" stripe height="100%" style="width: 100%;">
              <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
              <el-table-column label="接处警数" prop="TYPE1" align="center" width="100"></el-table-column>
              <el-table-column label="治安案件" prop="TYPE2" align="center" width="100"></el-table-column>
              <el-table-column label="治安罚款" prop="TYPE3" align="center" width="100"></el-table-column>
              <el-table-column label="治安拘留" prop="TYPE4" align="center" width="100"></el-table-column>
              <el-table-column label="刑事案件" prop="TYPE5" align="center" width="100"></el-table-column>
              <el-table-column label="记录日期" prop="Date" align="center" width="150"></el-table-column>
              <el-table-column label="操作" prop="cz" align="center" width="150">
                <template slot-scope="{row}">
                  <el-button type="text" style="padding: 3px;" @click="openSetCaseNumsWin('upd',row)">修改</el-button>
                  <el-popover placement="top" width="160" v-model="row.visible" popper-class="map-blue">
                    <p>确认删除该记录吗？</p>
                    <div style="text-align: right;margin: 0;">
                      <el-button size="mini" type="text" style="color: red;" @click="row.visible = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="deleteCaseNum(row)">确定</el-button>
                    </div>
                    <el-button type="text" slot="reference" style="padding: 3px;color: red;">删除</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-main>
    </el-container>
    <el-dialog title="设置单位编码" :visible.sync="unitNoVisible" width="320px" :close-on-click-modal="false">
      <div style="padding: 20px;">
        <div style="color: red;text-align: center;">请设置您单位编码</div>
        <div style="padding:5px 10px;">单位名称：{{wps.Oname}}</div>
        <div style="padding:5px 10px;">部门名称：{{curNode.label}}</div>
        <div style="padding:5px 10px;">派出所编码：<el-input v-model="orgCode_edit" size="mini" placeholder="请输入编码" style="width: 150px;"></el-input>
        </div>
        <div style="padding:5px 10px;">派出所名称：<el-input v-model="orgName_edit" size="mini" placeholder="请输入名称" style="width: 150px;"></el-input>
        </div>
      </div>
      <span slot="footer">
        <el-button size="mini" @click="unitNoVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="orgCode_edit===''||orgName_edit===''" @click="saveBaseInfo('单位编码')">确
          定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置地理位置" :visible.sync="positionVisible" width="320px" :close-on-click-modal="false">
      <div style="padding: 20px 0px 20px 20px;">
        <div style="padding:5px 10px;">
          经度：<el-input v-model="pointX_edit" size="mini" placeholder="请输入经度如：104.30324" style="width: 180px;"></el-input>
        </div>
        <div style="padding:5px 10px;">
          纬度：<el-input v-model="pointY_edit" size="mini" placeholder="请输入纬度如：32.24215" style="width: 180px;"></el-input>
        </div>
      </div>
      <span slot="footer">
        <el-button size="mini" @click="positionVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="pointX_edit===''||pointY_edit===''" @click="saveBaseInfo('地理位置')">确
          定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="警局简介" :visible.sync="briefVisible" width="320px" :close-on-click-modal="false">
      <div style="padding: 5px;">
        <el-input v-model="brief_edit" type="textarea" :rows="5" placeholder="请输入简介"></el-input>
      </div>
      <span slot="footer">
        <el-button size="mini" @click="briefVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="brief_edit===''" @click="saveBaseInfo('简介')">确
          定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置案件数量" :visible.sync="caseNumVisible" width="350px" :close-on-click-modal="false">
      <div style="padding: 20px;">
        <div style="padding:3px 35px;">记录日期：<el-date-picker v-model="caseNums.Date" :clearable="false" :disabled="saveCaseNumType==='upd'" type="date" size="mini" :picker-options="dateOptions" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 150px;"></el-date-picker>
        </div>
        <div style="padding:3px 35px;">接处警数：<el-input-number v-model="caseNums.TYPE1" :min="0" size="mini" style="width: 150px;"></el-input-number>
        </div>
        <div style="padding:3px 35px;">治安案件：<el-input-number v-model="caseNums.TYPE2" :min="0" size="mini" style="width: 150px;"></el-input-number>
        </div>
        <div style="padding:3px 35px;">治安罚款：<el-input-number v-model="caseNums.TYPE3" :min="0" size="mini" style="width: 150px;"></el-input-number>
        </div>
        <div style="padding:3px 35px;">治安拘留：<el-input-number v-model="caseNums.TYPE4" :min="0" size="mini" style="width: 150px;"></el-input-number>
        </div>
        <div style="padding:3px 35px;">刑事案件：<el-input-number v-model="caseNums.TYPE5" :min="0" size="mini" style="width: 150px;"></el-input-number>
        </div>
      </div>
      <span slot="footer">
        <el-button size="mini" @click="caseNumVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveDetailInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog title="批量导入" :visible.sync="moreUploadVisible" width="320px" :close-on-click-modal="false">
			<div style="padding:30px;">
				<div style="padding:3px">导入日期：
					<el-date-picker v-model="moreDate" :clearable="false" type="date" size="mini" :picker-options="dateOptions" format="yyyy-MM-dd"
					 value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				</div>
				<div style="padding:3px">导入文件：
					<el-upload ref="upload_more" accept=".xlsx,.xls" :show-file-list="false" :on-success="(response, file)=>handelSuccess(response, file,'more')"
					 :data="params" :action="action" :before-upload="(file)=>handleBeforeUpload(file,'more')" style="display: inline-block;">
						<el-button size="mini" type="success" icon="el-icon-upload">请选择文件</el-button>
					</el-upload>
				</div>
			</div>
			<span slot="footer">
				<el-button size="mini" @click="moreUploadVisible = false">取 消</el-button>
			</span>
		</el-dialog> -->
  </el-container>
</template>

<script>
// 这里引用各种资源
import C from "../../../assets/com.js";
export default {
  // 组件
  components: {},
  // 数据仓库
  data() {
    return {
      wps: {},
      filterText1: "",
      unitData: [],
      curNode: {},
      unitNoVisible: false,
      positionVisible: false,
      briefVisible: false,
      canDo: false, //是否能操作
      //-------------文件上传
      //最大文件大小M, -1不限制
      'maxFileSize': {
        type: Number,
        default: 150
      },
      //最大图片大小M, -1不限制
      'maxFileSizePic': {
        type: Number,
        default: 10
      },
      action: C.ADDS.serv + "/FileUploadGaServlet",
      actionMore: C.ADDS.serv + "/FileUploadGaServlet2",
      params: {
        code: "upFile",
      },
      // 主表数据
      orgCode: "", //派出所编码
      orgName: "", //派出所名称
      orgCode_edit: "", //派出所编码，用于编辑使用
      orgName_edit: "", //派出所名称，用于编辑使用
      pointX: "", //经度100
      pointY: "", //纬度30
      pointX_edit: "", //经度100，用于编辑使用
      pointY_edit: "", //纬度30，用于编辑使用
      brief: "", //简介
      brief_edit: "", //简介，用于编辑使用
      files: {
        jbqk: "", //基本情况
        ldys: "", //两队一室
        jlbs: [], //警力部署
        jlbs_full: [] //警力部署//全路径
      },
      // 从表数据
      date: ["", ""],
      tableH: "400px",
      gridList: [],
      curDetailRow: {},
      saveCaseNumType: 'add',
      caseNumVisible: false, //从表窗口
      caseNums: {
        Date: "",
        TYPE1: 0,
        TYPE2: 0,
        TYPE3: 0,
        TYPE4: 0,
        TYPE5: 0,
      },
      dateOptions: { //今天之后不能选择
        disabledDate(time) {
          return time.getTime() > Date.now() - 86400000; //86400000 一天的毫秒
        }
      },
      // 批量导入数据
      downSrc: process.env.BASE_URL + "static/主要数据批量导入模板.xlsx",
      moreUploadVisible: true,
      moreDate: ""
    }
  },
  // 属性
  props: {

  },
  // 组件挂载完毕
  mounted() {
    this.wps = this.$store.state.params;
    this.date = [C.getDateTimeSub(new Date(), "yyyy-MM-dd", -24 * 7), (new Date()).Format("yyyy-MM-dd")];
    this.tableH = document.body.offsetHeight - 500 + "px";
    document.querySelector("title").innerHTML = "公安基础数据维护";
    this.getUnitTree();
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    //树节点选择事件
    handleClickNode(node) {
      this.curNode = node;
      this.getBaseInfo();
    },
    // 删除前询问---警力部署
    beforeRemove(file, fileList) {
      return this.$confirm(`此操作将永久删除该文件, 是否继续？`);
    },
    // 删除照片---警力部署
    handleRemove(file, fileList) {
      this.files.jlbs = fileList.map(v => v.response);
      this.$message.success('删除成功!');
      this.saveBaseInfo();
    },
    // 上传前设置
    handleBeforeUpload(file, key) {
      if (file.type === "application/x-msdownload") {
        alert("禁止上传此文件类型");
        return false
      }
      // if (this.maxFileSizePic && this.maxFileSizePic !== -1) {
      // 	if (file.type === "image/jpeg" || file.type === "image/gif" || file.type === "image/png") {
      // 		if (file.size / 1024 / 1024 > this.maxFileSizePic) {
      // 			this.$message.error("上传图片大小不能超过" + this.maxFileSizePic + "MB");
      // 			return false
      // 		}
      // 	}
      // }

      // if (this.maxFileSize && this.maxFileSize !== -1) {
      // 	if (file.size / 1024 / 1024 > this.maxFileSize) {
      // 		this.$message.error("文件上传大小不能超过" + this.maxFileSize + "MB");
      // 		return false
      // 	}
      // }
    },
    // 上传成功
    handelSuccess(response, file, key) {
      // response:/tomcat/apache-tomcat-9.0.65/webapps/TRDM/FileSaves/33.png
      // http://10.192.6.110:9090/TRDM/FileSaves/33.png
      // C.ADDS.serv + 
      if (key === "more") {
        if (typeof (response) === "string") {
          this.$message.error(response);
        } else {
          this.$message.success("数据导入成功");
        }
        // this.getDetails()
        return;
      }

      const path = response;
      // 警力部署
      if (key === "jlbs") {
        this.files[key].push(path);
      } else {
        this.files[key] = path;
      }
      this.saveBaseInfo(); // 更新主表
      this.$message.success("文件上传成功");
      // this.$refs['upload_' + key].clearFiles();
    },
    // 查看文件
    viewFile(key, file) {
      const url = key === "jlbs" ? file.url : C.ADDS.serv + this.files[key];
      window.open(url);
    },
    // 打开设置数量窗口
    openSetCaseNumsWin(ty, row) {
      this.saveCaseNumType = ty;
      if (ty === "add") {
        this.caseNums = {
          Date: C.getDateTimeSub(new Date(), "yyyy-MM-dd", -24),
          TYPE1: 0,
          TYPE2: 0,
          TYPE3: 0,
          TYPE4: 0,
          TYPE5: 0,
        };
      } else {
        this.curDetailRow = row;
        this.caseNums = C.cloneObj(row);
      }
      this.caseNumVisible = true;
    },
    /* @info  数据处理区-----------------------------------*/
    filterNode(val) {
      this.$refs.unitTree.filter(val);
    },
    doFilterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    /* @info  数据交互区-----------------------------------*/
    // 修改基本信息
    saveBaseInfo(ty) {
      const orgCode = ty === "单位编码" ? this.orgCode_edit : this.orgCode;
      const orgName = ty === "单位编码" ? this.orgName_edit : this.orgName;
      const pointX = ty === "地理位置" ? this.pointX_edit : this.pointX; //经度
      const pointY = ty === "地理位置" ? this.pointY_edit : this.pointY; //纬度
      const brief = ty === "简介" ? this.brief_edit : this.brief; //简介
      const PDF1 = this.files.jbqk;
      const PDF2 = this.files.ldys;
      const PICS = this.files.jlbs.join("@");
      // [PCS_ID(派出所id),PCS_NAME(派出所名称),PDF1(基本情况pdf路径),PDF2(两队一室pdf路径),PICS(图片路径,@分隔),
      // UNIT_ID(单位id),UNIT_NAME(单位名称),DEP_ID(部门id),DEP_NAME(部门名称),GPS_POINT_X(经纬度X坐标),GPS_POINT_Y(经纬度Y坐标,BRIEF(简介)]
      const doSave = () => {
        C.getData({
          c: "trdm_ga_003",
          s: [orgCode, orgName, PDF1, PDF2, PICS, this.wps.Oid, this.wps.Oname, this.curNode.id, this.curNode.label,
            pointX, pointY, brief
          ],
          a: "【trdm_ga_003】修改主表信息",
          url: C.ADDS.servGS,
        }, r => {
          if (r[0] === "true") {
            this.$message.success("数据已更新");
            if (ty === "单位编码") {
              this.orgCode = this.orgCode_edit;
              this.orgName = this.orgName_edit;
              this.unitNoVisible = false;
            } else if (ty === "地理位置") {
              this.pointX = this.pointX_edit;
              this.pointY = this.pointY_edit;
              this.positionVisible = false;
            } else if (ty === "简介") {
              this.brief = this.brief_edit;
              this.briefVisible = false;
            }
            this.canDo = true;
          } else {
            this.$message.error(r[1]);
          }
        });
      }
      if (ty === "单位编码") {
        this.$confirm('编码 ' + orgCode + ' 只允许设置一次，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          doSave();
        }).catch(() => { });
      } else {
        doSave();
      }
    },
    // 保存从表信息
    saveDetailInfo() {
      // [["派出所id","时间","类型","数量"],["派出所id","时间","类型","数量"]....]
      // 1-接处警数 2-治安案件 3-治安罚款 4-治安拘留 5-刑事案件
      const sql = [1, 2, 3, 4, 5].map(v => [this.orgCode, this.caseNums.Date, v, this.caseNums["TYPE" + v]]);
      const doSave = () => {
        C.getData({
          c: "trdm_ga_004",
          s: sql,
          a: "【trdm_ga_004】保存从表信息",
          url: C.ADDS.servGS,
        }, r => {
          if (r[0] === "true") {
            if (this.saveCaseNumType === "upd") {
              this.curDetailRow = Object.assign(this.curDetailRow, this.caseNums);
            } else {
              this.getDetails();
            }
            this.$message.success("数据保存成功");
          } else {
            this.$message.error(r[1]);
          }
          this.caseNumVisible = false;
        });
      }
      if (this.saveCaseNumType === "add") {
        const ext = this.gridList.find(v => v.Date === this.caseNums.Date);
        if (ext) {
          this.$confirm('当前设置日期已存在, 是否覆盖已有数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            doSave();
          }).catch(() => { });
        } else {
          doSave();
        }
      } else {
        doSave();
      }
    },
    // 删除从表信息
    deleteCaseNum(row) {
      C.getData({
        c: "trdm_ga_005",
        s: [this.orgCode, row.Date],
        a: "【trdm_ga_005】删除从表信息",
        url: C.ADDS.servGS,
      }, r => {
        if (r[0] === "true") {
          this.getDetails();
          this.$message.success("数据删除成功");
        } else {
          this.$message.error(r[1]);
        }
      });
    },
    // 获取基本信息
    getBaseInfo() {
      C.getData({
        c: "trdm_ga_001",
        s: [this.curNode.id],
        a: "【trdm_ga_001】获取基本信息",
        url: C.ADDS.servGS,
      }, r => {
        if (r.length === 0) {
          this.canDo = false;
          this.orgCode = "";
          this.orgName = this.curNode.label;
          this.pointX = "";
          this.pointY = "";
          this.brief = "";
          this.files = {
            jbqk: "", //基本情况
            ldys: "", //两队一室
            jlbs: [] //警力部署
          };
          this.gridList = [];
          this.orgName_edit = this.curNode.label;
          // this.unitNoVisible = true;
          this.$alert('您所选节点非派出所，或未配置派出所编码', '提示', {
            confirmButtonText: '确定',
          });
        } else {
          this.canDo = true;
          // [{"PCS_ID":"派出所id","UNIT_ID":"单位id","PDF2":"两队一室pdf路径","UNIT_NAME":"单位名称","PCS_NAME":"派出所名称","PDF1":"基本信息pdf路径","PICS":"警力部署图片路径","DEP_ID":"部门id","DEP_NAME:"部门名称","GPS_POINT_X":"经纬度X坐标","GPS_POINT_Y":"经纬度Y坐标","BRIEF":"简介"}]
          const d = r[0];
          this.orgCode = d.PCS_ID; //编码
          this.orgName = d.PCS_NAME; //名称
          this.pointX = d.GPS_POINT_X;
          this.pointY = d.GPS_POINT_Y;
          this.brief = d.BRIEF;
          const pics = d.PICS === "" ? [] : d.PICS.split("@"); //警力部署
          const files = {
            jbqk: d.PDF1, //基本情况
            ldys: d.PDF2, //两队一室
            jlbs: pics, //警力部署
            jlbs_full: [] //警力部署
          };
          files.jlbs_full = pics.map(v => {
            return {
              response: v,
              url: C.ADDS.serv + v
            }
          })
          this.files = files;
          this.getDetails();
        }
      });
    },
    // 获取从表信息
    getDetails() {
      // ["派出所id","开始时间","结束时间"]
      C.getData({
        c: "trdm_ga_002",
        s: [this.orgCode, this.date[0], this.date[1]],
        a: "【trdm_ga_002】获取从表信息",
        url: C.ADDS.servGS,
      }, r => {
        console.log("获取从表信息", r)
        r.forEach(v => v.visible = false);
        // [{Date: "日期",PCS_ID: "派出所id",PK_ID: "从表主键",TYPE1: "接警处数",TYPE2: "治安案件",TYPE3: "治安罚款",TYPE4: "治安拘留",TYPE5: "刑事案件"}]
        // 若当前时间范围或派出所id下没有记录,则显示[{"flag":"0","msg":"该时间范围或派出所id下未查询到相关数据."]
        this.gridList = r;
      });
    },

    // 获取单位部门树
    getUnitTree() {
      // C.getData({
      // 		c: "1119",
      // 		w: [this.wps.Oid],
      // 		a: "【1119】获取单位下部门树",
      // 		url: C.ADDS.SSOP, //接口地址
      // 	},
      C.getData({
        c: "noms_tyl_001@kyz_0002",
        a: "【noms_tyl_001】获取所有单位部门树",
        url: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet", //接口地址
        // url: C.ADDS.SSOP, //接口地址
        async: true
      },
        r => {
          if (r) {
            const realD = C.convertTreeData(
              r,
              "ID",
              "PID",
              "ID",
              "成都局集团公司"
            );
            this.unitData = realD[0].children;
          }
        }
      );
    },
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {},
}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.box-card {
  display: inline-block;
  vertical-align: top;
  /* width: 260px; */
  margin: 5px 0 0 5px;
}

>>> .el-card__header {
  padding: 10px;
}

>>> .box-card.no-pading .el-card__body {
  padding: 0;
}

.box-card > .header {
  color: #3d99ff;
  font-weight: bold;
  font-size: 16px;
  background: #cfedee;
}

.group-tit {
  font-weight: bold;
  color: #3d99ff;
  font-size: 16px;
  line-height: 16px;
  display: inline-block;
  padding-left: 5px;
  border-left: 2px solid #ff557f;
}

.tools {
  float: right;
  margin-top: -6px;
  margin-right: -5px;
}

>>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #aed3ff;
}

>>> .el-table--mini td,
.el-table--mini th {
  padding: 3px;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
}
</style>
