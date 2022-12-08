<!--
 * @created：	2021年12月24日
 * @author：	ch
 * @version:	v1.0
 * @desc:		聚合地图配置
 -->
<template>
  <el-container style="width: 100%;height: 100%;">
    <el-header style="height: 40px;padding-top: 3px;border-bottom: 1px solid #ddd;">
      <span style="font-size: 16px;padding-right: 20px;">聚合地图配置</span>
      <span style="display: inline-block;width: 200px;">
        当前配置对象：
        <span v-if="saveType!==''" style="color: #0000CC;font-weight: bold;font-size: 20px;">{{saveType==="0"?'单位':'个人'}}</span>
      </span>
      <el-select v-model="saveSys" @change="handleChangeSys" size="small" :disabled="isPrivate">
        <el-option value="kyd" label="客运段安全生产调度指挥中心">客运段安全生产调度指挥中心</el-option>
        <el-option value="kyz" label="客运站安全生产调度指挥中心">客运站安全生产调度指挥中心</el-option>
        <el-option :value="policeFlag?'police':'kygl'" label="列车警务调度指挥系统">列车警务调度指挥系统</el-option>
        <el-option value="yjxy" label="应急响应指挥中心">应急响应指挥中心</el-option>
      </el-select>
      <el-button size="small" type="primary" @click="saveMapConfig" :disabled="saveType===''" style="margin-left: 10px;">保存</el-button>
      <el-button v-if="isClone" size="small" type="warning" @click="isClone=false">取消克隆</el-button>
      <el-button v-else size="small" type="success" @click="isClone=true" :disabled="saveType===''">克隆配置</el-button>
      <span v-if="isClone" style="display: inline-block;padding-left: 10px;">请选择克隆单位或人员(人员可多选)</span>
    </el-header>
    <el-container style="width: 100%;height:100%;">
      <el-aside style="width:410px;height:100%;">
        <div style="position: relative;float:left;width:250px;height:100%;padding-top: 40px;border-right: 1px solid #ddd;">
          <div style="position: absolute;top: 0;left:0;height: 40px;width: 100%;padding: 3px;border-bottom: 1px solid #ddd;">
            <el-input placeholder="输入站名筛选" size="small" v-model="filterText1"></el-input>
          </div>
          <div style="width:100%;height:100%;overflow: auto;">
            <el-tree ref="unitTree" :data="unitData" @node-click="getPerList" :filter-node-method="filterNode" :highlight-current="true"></el-tree>
          </div>
        </div>
        <div style="position: relative;float:left;width:150px;height:100%;padding-top: 40px;border-right: 1px solid #ddd;">
          <div style="position: absolute;top: 0;left:0;height: 40px;width: 100%;padding: 3px;border-bottom: 1px solid #ddd;">
            <el-input placeholder="输入姓名筛选" size="small" v-model="filterText2"></el-input>
          </div>
          <ul class="person-list" style="width:100%;height:100%;overflow: auto;">
            <template v-for="per in personsFilter">
              <li :class="{'active':per.selected===true}" @click="choosePer(per)">{{per.EM_NAME}}</li>
            </template>
          </ul>
        </div>
      </el-aside>
      <el-main style="width: 100%;height: 100%;padding: 0;">
        <div style="width: 100%;height: 100%;overflow: auto;">
          <!-- ============================================== 基础 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">基础</div>
            <el-card class="box-card" :class="{'active':config.superMap.register}">
              <div slot="header">
                地图
                <el-checkbox v-model="config.superMap.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>初始层级:</span>
                <label>
                  <el-input-number size="mini" v-model="config.superMap.zoom" :min="1" :max="19" style="width: 90px;"></el-input-number>
                </label>
              </div>
              <div class="list-item">
                <span>最小层级:</span>
                <label>
                  <el-input-number size="mini" v-model="config.superMap.zoomMin" :min="1" :max="19" style="width: 90px;"></el-input-number>
                </label>
              </div>
              <div class="list-item">
                <span>最大层级:</span>
                <label>
                  <el-input-number size="mini" v-model="config.superMap.zoomMax" :min="1" :max="19" style="width: 90px;"></el-input-number>
                </label>
              </div>
              <div class="list-item">
                <span>四川重庆详图:</span>
                <label>
                  <el-checkbox v-model="config.superMap.sccq"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>亮版地图</span>
                <label>
                  <el-checkbox v-model="config.superMap.lightMode"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.controller.register}">
              <div slot="header">
                控制器
                <el-checkbox v-model="config.controller.register"></el-checkbox>
              </div>
              <div>
                <el-checkbox v-model="config.controller.mini" style="width: 40px;">默认最小化</el-checkbox>
              </div>
              <el-checkbox v-model="config.controller.base" style="width: 40px;">基础</el-checkbox>
              <el-checkbox v-model="config.controller.gongDian" style="width: 40px;">供电</el-checkbox>
              <el-checkbox v-model="config.controller.gongWu" style="width: 40px;">工务</el-checkbox>
              <br />
              <el-checkbox v-model="config.controller.dianWu" style="width: 40px;">电务</el-checkbox>
              <el-checkbox v-model="config.controller.jiWu" style="width: 40px;">机务</el-checkbox>
              <el-checkbox v-model="config.controller.yunShu" style="width: 40px;">运输</el-checkbox>
              <br />
              <el-checkbox v-model="config.controller.cheLiang" style="width: 40px;">车辆</el-checkbox>
              <el-checkbox v-model="config.controller.tuFang" style="width: 40px;">土房</el-checkbox>
              <el-checkbox v-model="config.controller.huoYun" style="width: 40px;">货运</el-checkbox>
              <el-checkbox v-model="config.controller.houQing" style="width: 40px;">后勤</el-checkbox>
              <el-checkbox v-model="config.controller.zaiHai" style="width: 40px;">灾害</el-checkbox>
              <el-checkbox v-model="config.controller.jiaotong" style="width: 40px;">交通</el-checkbox>
              <el-checkbox v-model="config.controller.shiGong" style="width: 40px;">施工</el-checkbox>
              <el-checkbox v-model="config.controller.keYun" style="width: 40px;">客运</el-checkbox>
              <el-checkbox v-model="config.controller.other" style="width: 40px;">其它</el-checkbox>
              <el-checkbox v-model="config.controller.alert" style="width: 40px;">报警</el-checkbox>
            </el-card>
            <el-card class="box-card" :class="{'active':config.trainContextMenu.register}">
              <div slot="header">
                列车右键菜单
                <el-checkbox v-model="config.trainContextMenu.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>发送消息</span>
                <label>
                  <el-checkbox v-model="config.trainContextMenu.sendMsg"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>音视频对讲</span>
                <label>
                  <el-checkbox v-model="config.trainContextMenu.vedio"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>应急呼叫</span>
                <label>
                  <el-checkbox v-model="config.trainContextMenu.phone"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.btns.register}">
              <div slot="header">
                按钮
                <el-checkbox v-model="config.btns.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>框选列车</span>
                <label>
                  <el-checkbox v-model="config.btns.drawRegion"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>指派任务</span>
                <label>
                  <el-checkbox v-model="config.btns.task"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>发送消息</span>
                <label>
                  <el-checkbox v-model="config.btns.sendMsg"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>聚合通信</span>
                <label>
                  <el-checkbox v-model="config.btns.jhtx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>音视频对讲</span>
                <label>
                  <el-checkbox v-model="config.btns.vedio"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>应急呼叫</span>
                <label>
                  <el-checkbox v-model="config.btns.phone"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>地图测距</span>
                <label>
                  <el-checkbox v-model="config.btns.ranging"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>框选列车统计</span>
                <label>
                  <el-checkbox v-model="config.btns.drawRegionCount"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>应急资源统计</span>
                <label>
                  <el-checkbox v-model="config.btns.yjSrc"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.boundRegion.register}">
              <div slot="header">
                管界、区域
                <el-checkbox v-model="config.boundRegion.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>显示管界</span>
                <label>
                  <el-checkbox v-model="config.boundRegion.bound"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>显示区域</span>
                <label>
                  <el-checkbox v-model="config.boundRegion.region"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.qiaoSui.register}">
              <div slot="header">
                桥梁隧道
                <el-checkbox v-model="config.qiaoSui.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示桥梁</span>
                <label>
                  <el-checkbox v-model="config.qiaoSui.ck_qiao"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示隧道</span>
                <label>
                  <el-checkbox v-model="config.qiaoSui.ck_sui"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.video360.register}">
              <div slot="header">
                视频
                <el-checkbox v-model="config.video360.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示全景视频</span>
                <label>
                  <el-checkbox v-model="config.video360.checked"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.station.register}">
              <div slot="header">
                车站
                <el-checkbox v-model="config.station.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示管内全部站</span>
                <label>
                  <el-checkbox v-model="config.station.ck_boundAll"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示管内客站</span>
                <label>
                  <el-checkbox v-model="config.station.ck_boundK"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示管内货站</span>
                <label>
                  <el-checkbox v-model="config.station.ck_boundH"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示管内客、货站</span>
                <label>
                  <el-checkbox v-model="config.station.ck_boundKH"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示管内非营运站</span>
                <label>
                  <el-checkbox v-model="config.station.ck_boundN"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.dk.register}">
              <div slot="header">盯控<el-checkbox v-model="config.dk.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示现场图片</span>
                <label>
                  <el-checkbox v-model="config.dk.pic"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.train.register}">
              <div slot="header">在途车<el-checkbox v-model="config.train.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示动车</span>
                <label>
                  <el-checkbox v-model="config.train.ck_dongche"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示普车</span>
                <label>
                  <el-checkbox v-model="config.train.ck_puche"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示货车</span>
                <label>
                  <el-checkbox v-model="config.train.ck_huoche"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示到站车</span>
                <label>
                  <el-checkbox v-model="config.train.daozhan"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>查看作业信息</span>
                <label>
                  <el-checkbox v-model="config.train.trainDetail"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.dandang.register}">
              <div slot="header">担当车<el-checkbox v-model="config.dandang.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示担当车</span>
                <label>
                  <el-checkbox v-model="config.dandang.checked"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>担当车KEY</span>
                <label>
                  <el-input v-model="config.dandang.key" size="small" style="width: 80px;"></el-input>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.gdcdw.register}">
              <div slot="header">机车定位<el-checkbox v-model="config.gdcdw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示工务轨道车定位</span>
                <label>
                  <el-checkbox v-model="config.gdcdw.gw"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>

          <!-- ============================================== 交通 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">交通</div>
            <el-card class="box-card" :class="{'active':config.jiaotong.register}">
              <div slot="header">交通工具<el-checkbox v-model="config.jiaotong.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>公交</span>
                <label>
                  <el-checkbox v-model="config.jiaotong.gongjiao"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>出租车</span>
                <label>
                  <el-checkbox v-model="config.jiaotong.chuzuche"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>共享单车</span>
                <label>
                  <el-checkbox v-model="config.jiaotong.danche"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>网约车</span>
                <label>
                  <el-checkbox v-model="config.jiaotong.wangyueche"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.jiaotongzhan.register}">
              <div slot="header">公共交通站<el-checkbox v-model="config.jiaotongzhan.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>地铁</span>
                <label>
                  <el-checkbox v-model="config.jiaotong.ditie"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>停车场</span>
                <label>
                  <el-checkbox v-model="config.jiaotong.tingchechang"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 灾害 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">灾害</div>
            <el-card class="box-card" :class="{'active':config.weather.register}">
              <div slot="header">天气<el-checkbox v-model="config.weather.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示天气</span>
                <label>
                  <el-checkbox v-model="config.weather.checked"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.weatherYJ.register}">
              <div slot="header">天气预警<el-checkbox v-model="config.weatherYJ.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示天气预警</span>
                <label>
                  <el-checkbox v-model="config.weatherYJ.checked"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.earthquake.register}">
              <div slot="header">地震<el-checkbox v-model="config.earthquake.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示:</span>
                <label>
                  <el-checkbox v-model="config.earthquake.checked"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>新增地震及相关操作:</span>
                <label>
                  <el-checkbox v-model="config.earthquake.addFlag"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 供电 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">供电</div>
            <el-card class="box-card" :class="{'active':config.gd_sbss.register}">
              <div slot="header">设备设施<el-checkbox v-model="config.gd_sbss.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示供电臂</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_gdb"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示供电段</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_gdd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示变电所</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_bds"></el-checkbox>
                </label>
              </div>
              <!-- <div class="list-item">
								<span>默认显示电分相</span>
								<label>
									<el-checkbox v-model="config.gd_sbss.ck_dfx"></el-checkbox>
								</label>
              </div>-->
              <div class="list-item">
                <span>默认显示应急车</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_yjc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示供电工区</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_gdgq"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示车间</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_cj"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示停电</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_td"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示间接带电</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_jjdd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示远离</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_yl"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示DC600V应急电源</span>
                <label>
                  <el-checkbox v-model="config.gd_sbss.ck_yjdy"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.gd_fw.register}">
              <div slot="header">
                范围
                <el-checkbox v-model="config.gd_fw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示供电臂范围</span>
                <label>
                  <el-checkbox v-model="config.gd_fw.ck_gdb"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示电分相范围</span>
                <label>
                  <el-checkbox v-model="config.gd_fw.ck_dfx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示工区管辖范围</span>
                <label>
                  <el-checkbox v-model="config.gd_fw.ck_gqgx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示无电区范围</span>
                <label>
                  <el-checkbox v-model="config.gd_fw.ck_wdq"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.gd_jcw.register}">
              <div slot="header">
                接触网设备设施
                <el-checkbox v-model="config.gd_jcw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>框选范围</span>
                <label>
                  <el-checkbox v-model="config.gd_fw.drawRegion"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示钢柱</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_gz"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示混凝土柱</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_hntz"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示非绝缘锚段关节</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_fjymdgj"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示绝缘锚段关节</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_jymdgj"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示分项绝缘器</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_fdjyq"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示股道电连接</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_gddlj"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示常开开关</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_ckkg"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示常闭开关</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_cbkg"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示避雷器</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_blq"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示吸上线位置</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_xsxwz"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示关节式电分相</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_gjsdfxc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示器件式电分相</span>
                <label>
                  <el-checkbox v-model="config.gd_jcw.ck_qjsdfxc"></el-checkbox>
                </label>
              </div>
              <!-- <div class="list-item">
								<span>默认显示轨道车视频</span>
								<label>
									<el-checkbox v-model="config.gd_jcw.ck_gdcsp"></el-checkbox>
								</label>
							</div>
							<div class="list-item">
								<span>默认显示轨道车</span>
								<label>
									<el-checkbox v-model="config.gd_jcw.ck_gdc"></el-checkbox>
								</label>
							</div>
							<div class="list-item">
								<span>默认显示轨道车视频</span>
								<label>
									<el-checkbox v-model="config.gd_jcw.ck_gdcsp"></el-checkbox>
								</label>
              </div>-->
            </el-card>
          </div>
          <!-- ============================================== 工务 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">工务</div>
            <el-card class="box-card" :class="{'active':config.gw_sb.register}">
              <div slot="header">
                图例
                <el-checkbox v-model="config.gw_tl.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示桥梁</span>
                <label>
                  <el-checkbox v-model="config.gw_tl.ql"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示隧道</span>
                <label>
                  <el-checkbox v-model="config.gw_tl.sd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示坡道</span>
                <label>
                  <el-checkbox v-model="config.gw_tl.pd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示坡道 (大于20°)</span>
                <label>
                  <el-checkbox v-model="config.gw_tl.pdd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示监控地段</span>
                <label>
                  <el-checkbox v-model="config.gw_tl.jk"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.gw_sb.register}">
              <div slot="header">
                设备设施
                <el-checkbox v-model="config.gw_sb.register"></el-checkbox>
              </div>

              <div class="list-item">
                <span>默认显示I级防洪看守点</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.ksd1"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示II级防洪看守点</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.ksd2"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示III级防洪看守点</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.ksd3"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示防洪抢险材料及机具</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.qx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示防洪供电抢修作业车</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.zyc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示道口</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.dk"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示轨道车</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.gdc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示巡查四轮平车</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.slpc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示巡查两轮小车</span>
                <label>
                  <el-checkbox v-model="config.gw_sb.llxc"></el-checkbox>
                </label>
              </div>
            </el-card>
            <!-- <el-card class="box-card" :class="{'active':config.gw_jh.register}">
              <div slot="header">
                计划
                <el-checkbox v-model="config.gw_jh.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示施工计划</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.sg"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示维修计划</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.wx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示监管计划</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.jg"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示天窗点</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.tc"></el-checkbox>
                </label>
              </div>
            </el-card> -->
            <el-card class="box-card" :class="{'active':config.gw_fw.register}">
              <div slot="header">
                管辖范围
                <el-checkbox v-model="config.gw_fw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示工务段</span>
                <label>
                  <el-checkbox v-model="config.gw_fw.gwd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示工区</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.gq"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示工区车间</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.cj"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 电务 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">电务</div>
            <el-card class="box-card" :class="{'active':config.dw_sb.register}">
              <div slot="header">
                设备设施
                <el-checkbox v-model="config.dw_sb.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示轨道电路设备</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_gdsb"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示有源应答器</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_lksb"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示无源应答器</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_lksb_w"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示4G应急通信设备</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_4g"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示道岔融雪设备</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_dccxsb"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示信号机</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_xhj"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示道岔</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_dx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示备品备料</span>
                <label>
                  <el-checkbox v-model="config.dw_sb.dw_bpbl"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.dw_fw.register}">
              <div slot="header">
                管辖范围
                <el-checkbox v-model="config.dw_fw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示电务段</span>
                <label>
                  <el-checkbox v-model="config.dw_fw.dwd"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 机务 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">机务</div>
            <el-card class="box-card" :class="{'active':config.jw_cx.register}">
              <div slot="header">
                车型
                <el-checkbox v-model="config.jw_cx.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示热备内燃机车</span>
                <label>
                  <el-checkbox v-model="config.jw_cx.rbnrjc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示救援列车</span>
                <label>
                  <el-checkbox v-model="config.jw_cx.jyc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示热备电力机车</span>
                <label>
                  <el-checkbox v-model="config.jw_cx.rbdljc"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.jw_fw.register}">
              <div slot="header">
                管辖范围
                <el-checkbox v-model="config.jw_fw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示公寓</span>
                <label>
                  <el-checkbox v-model="config.jw_fw.gy"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示百吨闸瓦压力列车限速</span>
                <label>
                  <el-checkbox v-model="config.jw_fw.bdz"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示机外大坡道特殊车站</span>
                <label>
                  <el-checkbox v-model="config.jw_fw.jwcz"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.jw_jy.register}">
              <div slot="header">
                救援起复设备
                <el-checkbox v-model="config.jw_jy.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示救援设备</span>
                <label>
                  <el-checkbox v-model="config.jw_jy.jysb"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 运输 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">运输</div>
            <el-card class="box-card" :class="{'active':config.ys_sbss.register}">
              <div slot="header">
                设备设施
                <el-checkbox v-model="config.ys_sbss.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示救援队</span>
                <label>
                  <el-checkbox v-model="config.ys_sbss.ck_jyd"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.ys_fw.register}">
              <div slot="header">
                范围
                <el-checkbox v-model="config.ys_fw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示车务段范围</span>
                <label>
                  <el-checkbox v-model="config.ys_fw.ck_cwd"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.ys_jflc.register}">
              <div slot="header">
                接发列车限制
                <el-checkbox v-model="config.ys_jflc.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示旅客禁止停留限制</span>
                <label>
                  <el-checkbox v-model="config.ys_jflc.ck_lkjz"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示列车禁止停留限制</span>
                <label>
                  <el-checkbox v-model="config.ys_jflc.ck_lcjz"></el-checkbox>
                </label>
              </div>
            </el-card>
            <el-card class="box-card" :class="{'active':config.ys_dcjc.register}">
              <div slot="header">
                调车机车
                <el-checkbox v-model="config.ys_dcjc.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示调度机车</span>
                <label>
                  <el-checkbox v-model="config.ys_dcjc.ck_ddjc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示枢纽小运转机车</span>
                <label>
                  <el-checkbox v-model="config.ys_dcjc.ck_snxyc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示专用调车机车</span>
                <label>
                  <el-checkbox v-model="config.ys_dcjc.ck_zydc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示路用出租机车</span>
                <label>
                  <el-checkbox v-model="config.ys_dcjc.ck_lycz"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 车辆 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">车辆</div>
            <el-card class="box-card" :class="{'active':config.cl.register}">
              <div slot="header">
                车辆
                <el-checkbox v-model="config.cl.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示备品备料</span>
                <label>
                  <el-checkbox v-model="config.cl.bpbl"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示备用车体</span>
                <label>
                  <el-checkbox v-model="config.cl.bycz"></el-checkbox>
                </label>
              </div>

              <!-- <div class="list-item">
								<span>默认显示段</span>
								<label>
									<el-checkbox v-model="config.tf_sbss.d"></el-checkbox>
								</label>
							</div>
							<div class="list-item">
								<span>默认显示车间</span>
								<label>
									<el-checkbox v-model="config.tf_sbss.cj"></el-checkbox>
								</label>
							</div>
							<div class="list-item">
								<span>默认显示工区</span>
								<label>
									<el-checkbox v-model="config.tf_sbss.gq"></el-checkbox>
								</label>
              </div>-->
            </el-card>
          </div>
          <!-- ============================================== 土房 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">土房</div>
            <el-card class="box-card" :class="{'active':config.tf_sbss.register}">
              <div slot="header">
                设备设施
                <el-checkbox v-model="config.tf_sbss.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示生活车</span>
                <label>
                  <el-checkbox v-model="config.tf_sbss.shc"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示应急材料</span>
                <label>
                  <el-checkbox v-model="config.tf_sbss.yjcl"></el-checkbox>
                </label>
              </div>

              <div class="list-item">
                <span>默认卫生监督所</span>
                <label>
                  <el-checkbox v-model="config.tf_sbss.wsjds"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示疾控所</span>
                <label>
                  <el-checkbox v-model="config.tf_sbss.jks"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示送餐点</span>
                <label>
                  <el-checkbox v-model="config.tf_sbss.scd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示公寓</span>
                <label>
                  <el-checkbox v-model="config.tf_sbss.gy"></el-checkbox>
                </label>
              </div>
              <!-- <div class="list-item">
								<span>默认显示段</span>
								<label>
									<el-checkbox v-model="config.tf_sbss.d"></el-checkbox>
								</label>
							</div>
							<div class="list-item">
								<span>默认显示车间</span>
								<label>
									<el-checkbox v-model="config.tf_sbss.cj"></el-checkbox>
								</label>
							</div>
							<div class="list-item">
								<span>默认显示工区</span>
								<label>
									<el-checkbox v-model="config.tf_sbss.gq"></el-checkbox>
								</label>
              </div>-->
            </el-card>
            <el-card class="box-card" :class="{'active':config.tf_fw.register}">
              <div slot="header">
                范围
                <el-checkbox v-model="config.tf_fw.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示车间范围</span>
                <label>
                  <el-checkbox v-model="config.tf_fw.cj"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示工区范围</span>
                <label>
                  <el-checkbox v-model="config.tf_fw.gq"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示重庆建筑段范围</span>
                <label>
                  <el-checkbox v-model="config.tf_fw.cqjzd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示贵阳建筑段范围</span>
                <label>
                  <el-checkbox v-model="config.tf_fw.gyjzd"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示达成合铁公司范围</span>
                <label>
                  <el-checkbox v-model="config.tf_fw.dchtgs"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示成都建筑段范围</span>
                <label>
                  <el-checkbox v-model="config.tf_fw.cdjzd"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 货运子系统 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">货运子系统</div>
            <el-card class="box-card" :class="{'active':config.hy_sbss.register}">
              <div slot="header">
                设施设备
                <el-checkbox v-model="config.hy_sbss.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示有端式站台货运线</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_ydszthwx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示有侧面1.1m站台货运线</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_ycmzthwx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示有端式站台的专用线线路</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_ydsztzyx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示站段货装应急管理固话人员</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_zdhzyjry"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示应急装载站及常用加固材料</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_yjzzjgcl"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示应急装卸劳力</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_yjzxll"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示路外应急抢险机械</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_lwyjqxjx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示危险货运施救信息网路及应急资源</span>
                <label>
                  <el-checkbox v-model="config.hy_sbss.hy_sbss_wxhyshwl"></el-checkbox>
                </label>
              </div>
              <!--              <div class="list-item">-->
              <!--                <span>默认显示货运站</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.hyz"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                <span>默认显示应急人员</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.yjry"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                <span>默认显示机具备料</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.jjbl"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                <span>默认显示应急劳力</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.yjll"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                <span>默认显示应急装卸机械</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.yjzxjx"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                <span>默认显示社会机械资源</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.shjxzy"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                <span>默认显示危险货物办理站</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.wxhwblz"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                <span>默认显示易腐货物办理站</span>-->
              <!--                <label>-->
              <!--                  <el-checkbox v-model="config.hy_sbss.yfhwblz"></el-checkbox>-->
              <!--                </label>-->
              <!--              </div>-->
            </el-card>
          </div>
          <!-- ============================================== 后勤 ==============================================-->
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">后勤</div>
            <el-card class="box-card" :class="{'active':config.houqing_xuexiao.register}">
              <div slot="header">
                学校
                <el-checkbox v-model="config.houqing_xuexiao.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示小学</span>
                <label>
                  <el-checkbox v-model="config.houqing_xuexiao.xiaoxue"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示初中</span>
                <label>
                  <el-checkbox v-model="config.houqing_xuexiao.zhongxue"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示高中</span>
                <label>
                  <el-checkbox v-model="config.houqing_xuexiao.gaozhong"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示九年一贯制学校(中小学)</span>
                <label>
                  <el-checkbox v-model="config.houqing_xuexiao.zhongxiaoxue"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示完全中学(初高中)</span>
                <label>
                  <el-checkbox v-model="config.houqing_xuexiao.chugaozhong"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <!-- ============================================== 其它 ==============================================-->
          <!--					<div class="box-card" style="width: 100%;height: auto;">-->
          <!--						<div class="header">其它</div>-->
          <!--						<el-card class="box-card" :class="{'active':config.others.register}">-->
          <!--							<div slot="header">-->
          <!--								设备设施-->
          <!--								<el-checkbox v-model="config.others.register"></el-checkbox>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示工务工区</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.gongwugongqu"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示涵洞</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.handong"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示接触网</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.jiechuwang"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示入网口</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.ruwangkou"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示隧道</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.suidao"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示探测站</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.tancezhan"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示信号机</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.xinhaoji"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--							<div class="list-item">-->
          <!--								<span>默认显示桥</span>-->
          <!--								<label>-->
          <!--									<el-checkbox v-model="config.others.qiaoliang"></el-checkbox>-->
          <!--								</label>-->
          <!--							</div>-->
          <!--						</el-card>-->
          <!--					</div>-->

          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">施工</div>
            <el-card class="box-card" :class="{'active':config.gw_jh.register}">
              <div slot="header">
                计划
                <el-checkbox v-model="config.gw_jh.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示施工计划</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.sg"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示维修计划</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.wx"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示监管计划</span>
                <label>
                  <el-checkbox v-model="config.gw_jh.jg"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
          <div class="box-card" style="width: 100%;height: auto;">
            <div class="header">客运</div>
            <el-card class="box-card" :class="{'active':config.ky_sb.register}">
              <div slot="header">
                设备设施
                <el-checkbox v-model="config.ky_sb.register"></el-checkbox>
              </div>
              <div class="list-item">
                <span>默认显示医疗资源</span>
                <label>
                  <el-checkbox v-model="config.ky_sb.ky_sb_yl"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示消防站</span>
                <label>
                  <el-checkbox v-model="config.ky_sb.ky_sb_xf"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示派出所</span>
                <label>
                  <el-checkbox v-model="config.ky_sb.ky_sb_pcs"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示应急饮食</span>
                <label>
                  <el-checkbox v-model="config.ky_sb.ky_sb_yjys"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示防冻物资</span>
                <label>
                  <el-checkbox v-model="config.ky_sb.ky_sb_fdwz"></el-checkbox>
                </label>
              </div>
              <div class="list-item">
                <span>默认显示应急疏散场所</span>
                <label>
                  <el-checkbox v-model="config.ky_sb.ky_sb_yjsscs"></el-checkbox>
                </label>
              </div>
            </el-card>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 这里引用各种资源
import C from "../assets/com.js";
import config from "../components/map/js/config.js";
export default {
  // 组件
  components: {},
  // 数据仓库
  data() {
    return {
      loginOid: this.$store.state.params.Oid,
      isXxs: this.$store.state.params.Oid === "99990002001499A50004", //信息所登录
      isClone: false, //是否为克隆
      saveSys: "kyd", //地图所属系统
      isPrivate: false, //是否为私有定制
      curNode: {},
      curPer: {},
      unitData: [],
      persons: [],
      filterText1: "",
      filterText2: "",
      saveType: "", //0-单位，1-人
      config: C.cloneObj(config),
      policeFlag: false, //是否为公安网
    };
  },
  // 属性
  props: {},
  // 组件挂载完毕
  mounted() {
    if (typeof (this.$store.state.params.sys) !== "undefined") {
      this.saveSys = this.$store.state.params.sys;
      this.isXxs = true;
      this.isPrivate = true;
    }
    if (window.location.pathname.includes('/police.html')) {
      this.policeFlag = true;
    }
    this.getUnitTree();
  },
  // 方法
  methods: {
    /* @info  事件处理区-----------------------------------*/
    // 系统选择
    handleChangeSys(v) {
      if (this.saveType !== "" && this.isClone === false) {
        this.getMapConfig();
      }
    },
    // 人员选择
    choosePer(per) {
      this.saveType = "1";
      if (this.isClone) {
        per.selected = !per.selected;
      } else {
        this.persons.forEach(p => (p.selected = false));
        per.selected = true;
        this.curPer = per;
        this.$nextTick(() => {
          this.getMapConfig();
        });
      }
    },

    /* @info  数据处理区-----------------------------------*/
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    /* @info  数据交互区-----------------------------------*/
    // 新增/更新权限信息
    saveMapConfig() {
      this.loading = this.$loading({
        lock: true,
        text: "正在保存数据...",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)",
        customClass: "loading"
      });
      const rs = {};
      C.$.each(this.config, (k, v) => {
        if (v.register) {
          rs[k] = v;
        }
      });
      const configStr = JSON.stringify(rs);
      console.log(configStr);
      // code	tyzd_zxy3001
      // sql	[["单位/人员id",主体类型：0-单位，1-人,"权限信息"]]
      let sqls = [];

      if (this.isClone) {
        if (this.saveType === "0") {
          sqls.push([
            this.saveSys + "_" + this.curNode.UNIT_ID,
            this.saveType,
            configStr
          ]);
        } else {
          this.persons.forEach(p => {
            if (p.selected) {
              sqls.push([
                this.saveSys + "_" + p.EM_IDCARD,
                this.saveType,
                configStr
              ]);
            }
          });
        }
      } else {
        const _key =
          this.saveType === "0" ? this.curNode.UNIT_ID : this.curPer.EM_IDCARD;
        sqls.push([this.saveSys + "_" + _key, this.saveType, configStr]);
      }
      const querys = sqls.map(sql => this.doSaveConfig(sql));
      Promise.all(querys).then(arr => {
        this.loading.close();
        this.isClone = false;
        if (arr) {
          this.$message({
            message: "数据保存成功",
            type: "success"
          });
          this.getMapConfig();
        } else {
          this.$message({
            message: "数据保存失败",
            type: "error"
          });
        }
      });
    },
    doSaveConfig(sql) {
      return new Promise((resolve, reject) => {
        if (this.policeFlag) {
          C.getData({
            s: sql,
            c: "trdm_lv_855",
            a: "【trdm_lv_855】新增/更新权限信息",
            url: C.ADDS.servGS, //接口地址
            async: true
          },
            r => {
              if (r) {
                resolve(true);
              } else {
                resolve(false);
              }
            }
          );
        } else {
          C.getDataP123({
            s: sql,
            c: "tyzd_zxy3001",
            a: "【tyzd_zxy3001】新增/更新权限信息",
            url: "https://10.192.126.203/GeneralProServlet", //接口地址
            async: true
          },
            r => {
              if (r) {
                resolve(true);
              } else {
                resolve(false);
              }
            }
          );
        }

      });
    },
    // 获取指定单位/人员权限信息
    getMapConfig() {
      if (this.policeFlag) {
        C.getData({
          s: [
            this.saveSys + "_" + this.curNode.UNIT_ID,
            this.saveSys + "_" + this.curPer.EM_IDCARD
          ],
          c: "tyzd_zxy2001@kyz_0001",
          a: "【tyzd_zxy2001】获取指定单位/人员权限信息",
          url: C.ADDS.servGS, //接口地址
          async: true
        },
          r => {
            if (r) {
              const d = r.find(v => v.AUTH_TYPE == this.saveType);
              if (d) {
                this.config = Object.assign({},
                  C.cloneObj(config),
                  JSON.parse(d.AUTH_OBJ)
                );
              } else {
                this.config = Object.assign({}, C.cloneObj(config));
              }
            }
          }
        );
      } else {
        // code	tyzd_zxy2001
        // sql	[["单位id","人员id"]]
        C.getDataP123({
          s: [
            [
              this.saveSys + "_" + this.curNode.UNIT_ID,
              this.saveSys + "_" + this.curPer.EM_IDCARD
            ]
          ],
          c: "tyzd_zxy2001",
          a: "【tyzd_zxy2001】获取指定单位/人员权限信息",
          url: C.ADDS.servGS, //接口地址
          async: true
        },
          r => {
            if (r) {
              const d = r["1"].find(v => v.AUTH_TYPE == this.saveType);
              if (d) {
                this.config = Object.assign({},
                  C.cloneObj(config),
                  JSON.parse(d.AUTH_OBJ)
                );
              } else {
                this.config = Object.assign({}, C.cloneObj(config));
              }
            }
          }
        );
      }

    },
    // 获取单位部门树
    getUnitTree() {
      // 单位+部门树 http://10.192.4.168/SSOP/GeneralProServlet 	code: noms_tyl_001
      C.getData({
        c: "noms_tyl_001@kyz_0002",
        a: "【noms_tyl_001】获取单位部门树",
        url: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet", //接口地址
        // url: C.ADDS.SSOP, //接口地址
        async: true
      },
        r => {
          debugger
          console.log("MaConfig.vue r", r)
          if (r) {
            const realD = C.convertTreeData(
              r,
              "ID",
              "PID",
              "ID",
              "成都局集团公司"
            );
            let unitData = [];
            if (this.isXxs) {
              unitData = realD[0].children;
            }
            // 非信息所，则只显示当前单位下部门
            else {
              realD[0].children.forEach(v => {
                v.children.forEach(vv => {
                  if (vv.UNIT_ID === this.loginOid) {
                    unitData = vv.children;
                  }
                });
              });
            }
            this.unitData = unitData;
            console.log("this.unitData", this.unitData)
          }
        }
      );
    },
    //获取部门人员
    getPerList(node) {
      this.curNode = node;
      this.curPer = {
        EM_IDCARD: ""
      };
      console.log(node);
      // 文件夹
      if (node.UNIT_ID === "") {
        this.saveType = "";
        this.config = Object.assign({}, C.cloneObj(config));
      } else {
        this.saveType = "0";
        this.$nextTick(() => {
          // 非克隆模式，则取单位地图配置
          if (!this.isClone) {
            // && node.UNIT_ID !== this.curNode.UNIT_ID) {
            this.getMapConfig();
          }
          var code = "trdm_ys_472";
          if (this.policeFlag) {
            code = "trdm_lv_854";
          }
          C.getData({
            c: code,
            s: [node.UNIT_ID, node.TYPE === "0" ? "" : node.ID],
            url: C.ADDS.url_34_79 + "/TRDM/GeneralProServlet"
          },
            rs => {
              rs.forEach(v => {
                v.selected = false;
              });
              this.persons = rs;
            }
          );
        });
      }
    }
  },
  // 监视属性
  watch: {
    filterText1(val) {
      this.$refs.unitTree.filter(val);
    }
  },
  // 计算属性
  computed: {
    personsFilter() {
      return this.persons.filter(v => v.EM_NAME.indexOf(this.filterText2) > -1);
    }
  }
};
</script>

<!-- 私有样式 -->
<style scoped="scoped">
>>> .el-card__header {
  padding: 10px;
  font-weight: bold;
  color: #3d99ff;
}

>>> .el-card__header label {
  float: right;
}

>>> .el-card__body {
  padding: 5px 8px;
  height: 160px;
  overflow: auto;
}

>>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #11255d;
  background-color: #abf086;
}

.box-card {
  display: inline-block;
  width: 260px;
  margin: 5px 0 0 5px;
}

.box-card > .header {
  color: #3d99ff;
  font-weight: bold;
  font-size: 16px;
  background: #cfedee;
}

.box-card.active {
  background-color: #abf086;
}

.list-item {
  position: relative;
  padding: 5px;
  padding-right: 100px;
}

.list-item > span {
  display: inline-block;
  width: 120px;
  white-space: nowrap;
}

.list-item > label {
  position: absolute;
  right: 3px;
}

.person-list {
  padding: 0;
  margin: 0;
}

.person-list > li {
  list-style: none;
  padding: 2px 5px;
  margin: 5px;
  background: #d0defc;
}

.person-list > li:hover {
  cursor: pointer;
  background: #bcc9e3;
}

.person-list > li.active {
  /* color: white; */
  background: #abf086;
}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
