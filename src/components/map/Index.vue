<!--
 * @created：	2021年12月8日
 * @author：	ch
 * @version:	v1.0
 * @desc:		地图组件
 -->
<template>
  <div class="lay map-blue" @keydown.17="ctrlFlag = true" @keyup.17="ctrlFlag = false">
    <!-- 二级页面弹框 -->
    <div v-if="dialog.visible" :style="{
				width: dialog.width + 'px',
				height: dialog.height + 'px',
				marginTop: -dialog.height / 2 + 'px',
				marginLeft: -dialog.width / 2 + 'px',
			}" :class="{
						'p-dialog': !isPolice,
						'p-dialog-light': isPolice && !isGaBridge,
            'p-dialog-bridge-light': isPolice && isGaBridge
					}">

      <div class="head">
        <label v-if="!isGaBridge" class="tit">{{ dialog.title }}</label>
        <!-- 还原 站内、组件标志 -->
        <i class="el-icon-close" @click="dialog.visible = false;dialog.iszn=false;dialog.isComp=false;isGaBridge=false"></i>
      </div>

      <div v-if="dialog.iszn" style="height: 100%">
        <el-button v-for="(item, index) in dialog.arr" @click="changeUrl(index)">{{ item.name }}</el-button>
        <iframe v-if="dialog.src !== ''" :src="dialog.src" height="100%" style="border: 0" width="100%"></iframe>
      </div>
      <div v-else-if="dialog.isComp" style="height: 100%">
        <component :is="dialog.component" :source="dialog.source"></component>
      </div>
      <div v-else style="height: 100%">
        <iframe :src="dialog.src" height="100%" style="border: 0" width="100%"></iframe>
      </div>
    </div>
    <!-- 地图 -->
    <div id="home-map" oncontextmenu="return false" style="height: 100%; width: 100%; background: transparent"></div>
    <div v-if="config.superMap.register && !isLight && isPolice">

      <div style="vertical-align: middle;padding-left: 10px;position: absolute;left:35%;width:100px;z-index: 530;top:80px">
        <el-select class="select-area" v-model="curGaArea" placeholder="请选择" @change="changeGaArea">
          <el-option v-for="item in gaAreaMenu" :key="item.ID" :label="item.GaAreaName" :value="item.ID"></el-option>
        </el-select>
      </div>
      <!-- 警用地理信息系统 -->

      <div class="gaSearch" v-if="config.superMap.register && !isLight && isPolice " style="vertical-align: middle;position: absolute;margin-left:calc(35% + 140px);width: 500px;z-index: 530;top:80px" @keyup.enter="''">
        <el-select class="select-area" slot="prepend" v-model="gaSearchType" placeholder="类型" style="width: 140px;" size="mini" @change="handlePoliceSelect">
          <el-option v-for="item in gaLargeCategory" :key="item.KEY_NAME" :label="item.value" :value="item"></el-option>
        </el-select>

        <!-- <el-autocomplete ref="autocomplete1" v-if="this.sys === 'police'" v-model="gaFilterStr" :clearable="false" :fetch-suggestions="gaFilterSearch" style="width:180px" placeholder="请输入内容" size="mini" :popper-append-to-body="false" popper-class="white-gapopper" @select="handlePoliceSelect">
          <template slot="prepend">类型</template>
        </el-autocomplete> -->
        <el-autocomplete ref="autocomplete2" v-if="this.sys === 'police'" v-model="gaFilterStr2" :clearable="false" :fetch-suggestions="gaFilterSearch2" style="width:150px; margin-left:0px" placeholder=" 请输入内容" popper-class="white-gapopper" size="mini" @select="handlePoliceSelect2" :popper-append-to-body="false" @keyup.enter.native="handlePoliceSubmit2">
        </el-autocomplete>
      </div>
    </div>

    <div v-if="config.superMap.register && !isLight && !isPolice " style="position: absolute;top:80px;left:50%;margin-left:-250px;width: 300px;z-index: 410;" @keyup.enter="globalFilterType !== 'dm'&& this.sys !== 'police' ? globalFilter('btn') : ''">
      <el-autocomplete v-model="globalFilterStr" :clearable="false" :fetch-suggestions="globalFilterSearch" :placeholder="globalFilterType==='cc'?'请输入车次':globalFilterType==='cz'?'请输入站名略码/站名':'请输入地名'" hide-loading popper-class="blue-popper" size="mini">
        <el-select slot="prepend" v-model="globalFilterType" placeholder="请选择" style="width: 80px;">
          <el-option label="列车" value="cc"></el-option>
          <el-option label="车站" value="cz"></el-option>
          <el-option label="地名" value="dm"></el-option>
        </el-select>
        <i slot="append" class="el-icon-close" @click="removeDmCircle"></i>
        <template slot-scope="{ item }">
          <div v-if="globalFilterType==='cc'" class="name" @click="globalFilter(item)">{{ item.value }}</div>
          <div v-else-if="globalFilterType==='cz'" class="name" @click="globalFilter(item)">{{ item.STN_NAME }}</div>
          <div v-else-if="globalFilterType==='dm'" class="name" style="width: 400px" @click="globalFilter(item)">{{ item.name }}</div>
        </template>
      </el-autocomplete>
    </div>

    <!-- 滑块缩放 -->
    <div v-if="this.sys === 'police'" style="position: absolute;right:300px;bottom:2%;width: 300px;z-index: 410;">
      <el-slider show-input size="small" input-size="small" show-stops v-model="sliderScale" @change="setScale($event)" :min="config.superMap.zoomMmin || 1" :max="config.superMap.zoomMax || 15"></el-slider>
    </div>

    <!-- 地图元素控制面板 -->
    <!-- <div
      @click="darkPanelHide = !darkPanelHide"
      v-if="config.controller.register && !isLight && !hasCurrentEarthquake && isPolice"
      class="{ 'hide-switch': !darkPanelHide, 'unhide-switch': darkPanelHide }"
      :class="{show:config.controller.mini}"
    ></div>-->

    <!-- <div
      v-if="config.controller.register && !isLight && !hasCurrentEarthquake"
      :class="{ big: !config.controller.mini, 'policeMin': isPolice}"
      :style="{
				height: config.controller.mini ? '26px' : toolOpt.height,
				width: config.controller.mini ? '80px' : toolOpt.width,
				left: toolOpt.left,
				bottom: toolOpt.bottom,
			}"
      class="filter-con"
    >-->
    <!-- 左面板收缩 -->
    <div v-if="isPolice" @click="darkPanelHideLeft = !darkPanelHideLeft" :class="{
						'hide-police-left-switch': darkPanelHideLeft,
						'unhide-police-left-switch': !darkPanelHideLeft
					}" class="light-switch left-switch" style="cursor: pointer; z-index: 1000"></div>
    <!-- 右面板收缩 -->
    <div v-if="isPolice" @click="darkPanelHideRight = !darkPanelHideRight" :class="{
						'hide-police-right-switch': darkPanelHideRight,
						'unhide-police-right-switch': !darkPanelHideRight
					}" class="light-switch" style="cursor: pointer; z-index: 1000"></div>

    <div v-if="config.controller.register && !isLight && !hasCurrentEarthquake && !isPolice" v-show="!darkPanelHide" :class="{ big: !config.controller.mini || isPolice}" :style="isPolice?{
				height: toolOpt.height,
				width: toolOpt.width,
				left: toolOpt.left,
				bottom: toolOpt.bottom,
			}:{
				height: config.controller.mini ? '26px' : toolOpt.height,
				width: config.controller.mini ? '80px' : toolOpt.width,
				left: toolOpt.left,
				bottom: toolOpt.bottom,
			}" class="filter-con">
      <div class="filter-change-tool" @click="config.controller.mini = !config.controller.mini">
        <span v-if="!isPolice" :style="{color:msgStatu?'green':'red'}" style="position: absolute;left: 0;">消息</span>
        <div v-if="!isPolice" style="display:block">
          <i v-if="config.controller.mini" class="el-icon-s-tools" style="font-size: 16px"></i>
          <i v-else class="el-icon-d-arrow-right" style="
						font-size: 16px;
						cursor: pointer;
						transform: rotate(90deg);
						margin-top: -2px;
					"></i>
        </div>
      </div>
      <div v-if="!singleTab" class="tab">
        <div v-if="config.controller.zaiHai" :class="{ active: curTab === '灾害' }" @click="changeFilterTab('灾害')">
          <span>地震</span>
        </div>
        <div v-if="config.controller.alert" :class="{ active: curTab === '报警' }" @click="changeFilterTab('报警')">
          <span>报警</span>
        </div>
        <div :class="{ active: curTab === '基础' }" @click="changeFilterTab('基础')">
          <span>基础</span>
        </div>
        <div v-if="config.controller.gongDian" :class="{ active: curTab === '供电' }" @click="changeFilterTab('供电')">
          <span>供电</span>
        </div>
        <div v-if="config.controller.gongWu" :class="{ active: curTab === '工务' }" @click="changeFilterTab('工务')">
          <span>工务</span>
        </div>
        <div v-if="config.controller.dianWu" :class="{ active: curTab === '电务' }" @click="changeFilterTab('电务')">
          <span>电务</span>
        </div>
        <div v-if="config.controller.jiWu" :class="{ active: curTab === '机务' }" @click="changeFilterTab('机务')">
          <span>机务</span>
        </div>
        <div v-if="config.controller.yunShu" :class="{ active: curTab === '运输' }" @click="changeFilterTab('运输')">
          <span>运输</span>
        </div>
        <div v-if="config.controller.cheLiang" :class="{ active: curTab === '车辆' }" @click="changeFilterTab('车辆')">
          <span>车辆</span>
        </div>
        <div v-if="config.controller.tuFang" :class="{ active: curTab === '土房' }" @click="changeFilterTab('土房')">
          <span>后勤保障</span>
        </div>
        <div v-if="config.controller.huoYun" :class="{ active: curTab === '货运' }" @click="changeFilterTab('货运')">
          <span>货运</span>
        </div>
        <div v-if="config.controller.houQing" :class="{ active: curTab === '后勤' }" @click="changeFilterTab('后勤')">
          <span>地方资源</span>
        </div>
        <div v-if="config.controller.shiGong" :class="{ active: curTab === '施工' }" @click="changeFilterTab('施工')">
          <span>施工</span>
        </div>
        <div v-if="config.controller.jiaotong" :class="{ active: curTab === '交通' }" @click="changeFilterTab('交通')">
          <span>交通</span>
        </div>
        <div v-if="config.controller.keYun" :class="{ active: curTab === '客运' }" @click="changeFilterTab('客运')">
          <span>客运</span>
        </div>
        <!--        <div-->
        <!--            v-if="config.controller.other"-->
        <!--            :class="{ active: curTab === '其它' }"-->
        <!--            @click="changeFilterTab('其它')"-->
        <!--        >-->
        <!--          <span>其它</span>-->
        <!--        </div>-->
      </div>
      <div class="filter-body">
        <div v-show="curTab === '基础'">
          <div v-if="config.qiaoSui.register && !isPolice">
            <div class="group-title">基础</div>
            <div class="group-body">
              <el-checkbox v-model="qiaoSuiOther.qiaoVisible" v-if="!isPolice" @change="filterLayers('桥隧')">
                <i class="filter-icon qiaoliang"></i>
                <span v-if="!isPolice" @click.prevent="handleCheckItemClick('桥梁')">桥梁</span>
                <span v-if="isPolice">桥梁</span>
              </el-checkbox>
              <el-checkbox v-model="qiaoSuiOther.suiVisible" v-if="!isPolice" @change="filterLayers('桥隧')">
                <i class="filter-icon suidao"></i>隧道
              </el-checkbox>
              <el-checkbox disabled v-if="!isPolice">
                <span style="cursor: pointer; color: white" @click="openJsGz">
                  <i class="filter-icon gd-bds"></i>技术规章
                </span>
              </el-checkbox>
            </div>
          </div>
          <div v-if="config.gdcdw.register">
            <div v-if="!isPolice">
              <div class="group-title">机车定位</div>
              <div class="group-body">
                <el-checkbox v-model="guiDaoCheOther.guiDaoCheVisible_gw" @change="filterLayers('轨道车定位_工务')" style="width: 150px;">
                  <i class="filter-icon gw_sb_gdcdw"></i>
                  <span>工务轨道车定位</span>
                </el-checkbox>
                <el-button @click="rightInfoWin.visible=!rightInfoWin.visible" size="mini" type="primary" style="margin-left: 5px;padding: 5px 10px;">查看台帐</el-button>
              </div>
            </div>
          </div>
          <div v-if="config.station.register">
            <div class="group-title">车站</div>
            <div class="group-body">
              <el-checkbox v-model="showAllStns" @change="handleShowAllStns">
                <i class="filter-icon kezhan"></i>
                <span>全部</span>
              </el-checkbox>
              <el-checkbox v-model="stationOther.boundK" @change="function(val) {showAllStns = false; stationOther.boundK = val; filterLayers('车站')}">
                <i class="filter-icon kezhan"></i>
                <span v-if="!isPolice" @click.prevent="handleCheckItemClick('客站')">客站</span>
                <span v-if="isPolice">客站</span>
              </el-checkbox>
              <el-checkbox v-model="stationOther.boundH" @change="function(val) {showAllStns = false; stationOther.boundH = val; filterLayers('车站')}">
                <i class="filter-icon huozhan"></i>
                <span v-if="!isPolice" @click.prevent="handleCheckItemClick('货站')">货站</span>
                <span v-if="isPolice">货站</span>
              </el-checkbox>
              <el-checkbox v-model="stationOther.boundKH" @change="function(val) {showAllStns = false; stationOther.boundKH = val; filterLayers('车站')}">
                <i class="filter-icon huozhan"></i>
                <span>客货站</span>
              </el-checkbox>
              <el-checkbox v-model="stationOther.boundN" @change="function(val) {showAllStns = false; stationOther.boundN = val; filterLayers('车站')}">
                <i class="filter-icon huozhan"></i>
                <span>非营业站</span>
              </el-checkbox>
            </div>
          </div>
          <div v-if="config.dk.register">
            <div class="group-title">盯控</div>
            <div class="group-body">
              <el-checkbox v-model="showVideoVR" @change="handleShowVideoVR">
                <i class="filter-icon video-marker video-player"></i>
                360°轨道视频
              </el-checkbox>
              <br />
              <el-checkbox v-model="showLineVideo" @change="handleShowLineVideo">
                <i class="filter-icon video-marker video-player-line"></i>
                轨道视频
              </el-checkbox>
              <br />
              <el-checkbox v-model="config.dk.pic" @change="showUploadPic">
                <i class="filter-icon gw_sb_ksd2"></i>
                <span>现场图片</span>
              </el-checkbox>
              <el-select v-model="filterPic" :disabled="!config.dk.pic" size="mini" style="margin-left: 5px; width: 110px" @change="filterUploadPicLayer">
                <el-option label="当天" value="0"></el-option>
                <el-option label="三天内" value="3"></el-option>
                <el-option label="一周内" value="7"></el-option>
                <el-option label="半个月内" value="15"></el-option>
              </el-select>
              <br />
              <el-button size="mini" type="primary" @click="jumpToUploadPicsReport">查看全部</el-button>
              <br />
            </div>
          </div>
          <div v-if="config.train.register || config.dandang.register">
            <div class="group-title">列车</div>
            <div class="group-body">
              <el-checkbox v-model="trainOhter.dongche" @change="filterLayers('列车')">
                <i class="filter-icon dongche"></i>动车
              </el-checkbox>
              <el-checkbox v-model="trainOhter.puche" @change="filterLayers('列车')">
                <i class="filter-icon puche"></i>普客
              </el-checkbox>
              <el-checkbox v-model="trainOhter.huoche" @change="filterLayers('列车')">
                <i class="filter-icon puche"></i>货车
              </el-checkbox>
              <el-checkbox v-model="trainOhter.daozhan" @change="filterLayers('到站车')">
                <i class="filter-icon dzc"></i>终到车
              </el-checkbox>
              <el-checkbox v-if="config.dandang.register" v-model="trainOhter.dandang" @change="filterLayers('列车')">
                <i class="filter-icon dandang"></i>担当车
              </el-checkbox>
              <!-- <el-button size="mini" type="primary" @click="showQjZtcReport">区间在途车查询</el-button> -->
              <div v-show="trainOhter.dongche">
                <div class="late-train-link" @click="toolClick('openLate')">动车晚点</div>
                <el-checkbox v-model="trainOhter.late_d1" label="5-120分钟" @change="filterLayers('列车')">
                  <i class="filter-late wd1"></i>5-120分
                </el-checkbox>
                <el-checkbox v-model="trainOhter.late_d2" label="120-240分钟" @change="filterLayers('列车')">
                  <i class="filter-late wd2"></i>120-240分
                </el-checkbox>
                <el-checkbox v-model="trainOhter.late_d3" label="240-360分钟" @change="filterLayers('列车')">
                  <i class="filter-late wd3"></i>240-360分
                </el-checkbox>
                <el-checkbox v-model="trainOhter.late_d4" label="360分钟以上" @change="filterLayers('列车')">
                  <i class="filter-late wd4"></i>360分以上
                </el-checkbox>
              </div>
              <div v-show="trainOhter.puche">
                <div class="late-train-link" @click="toolClick('openLate')">普车晚点</div>
                <el-checkbox v-model="trainOhter.late_p1" label="5-240分钟" @change="filterLayers('列车')">
                  <i class="filter-late wd1"></i>5-240分
                </el-checkbox>
                <el-checkbox v-model="trainOhter.late_p2" label="240-480分钟" @change="filterLayers('列车')">
                  <i class="filter-late wd2"></i>240-480分
                </el-checkbox>
                <el-checkbox v-model="trainOhter.late_p3" label="480-720分钟" @change="filterLayers('列车')">
                  <i class="filter-late wd3"></i>480-720分
                </el-checkbox>
                <el-checkbox v-model="trainOhter.late_p4" label="720分钟以上" @change="filterLayers('列车')">
                  <i class="filter-late wd4"></i>720分以上
                </el-checkbox>
              </div>
            </div>
          </div>
          <div v-if="config.video360.register">
            <div class="group-title">全景视频</div>
            <div class="group-body">
              <el-checkbox v-model="panoramicVideo.visible" @change="filterLayers('全景视频')">
                <i class="filter-icon suidao"></i>全景视频
              </el-checkbox>
            </div>
          </div>
          <div v-if="
							config.boundRegion.register &&
							config.boundRegion.region
						">
            <div class="group-title">
              区域
              <i v-if="boundRegionOther.region.length > 0" class="el-icon-edit" style="margin-left: 10px; cursor: pointer" title="编辑区域" @click="
									boundRegionOther.quyuEdit =
										!boundRegionOther.quyuEdit
								"></i>
            </div>
            <div class="group-body">
              <template v-for="(qy, index) in boundRegionOther.region">
                <span v-if="boundRegionOther.quyuEdit">
                  <el-input v-model="qy.REGION_NAME" size="mini" style="width: 200px"></el-input>
                  <i class="el-icon-circle-check" style="margin: 0 5px; cursor: pointer" title="保存" @click="handleSaveQuyu(qy, false)"></i>
                  <el-popconfirm title="确定删除此区域？" @onConfirm="handleDeletQuyu(qy, index)">
                    <i slot="reference" class="el-icon-delete" style="color: red; cursor: pointer" title="删除"></i>
                  </el-popconfirm>
                </span>
                <el-checkbox v-else v-model="qy.visible" :label="qy.REGION_NAME" @change="filterLayers('区域', qy)"></el-checkbox>
              </template>
            </div>
          </div>
          <div v-if="
								config.weather.register ||
								config.weatherYJ.register
							">
            <div class="group-title">天气</div>
            <div class="group-body">
              <el-checkbox v-model="weatherOther.layerVisible" @change="filterLayers('天气')">
                <i class="filter-icon tianqi"></i>天气情况
              </el-checkbox>
              <el-checkbox v-model="weatherYJOther.layerVisible" @change="filterLayers('天气预警')">
                <i class="filter-icon tianqi"></i>天气预警
              </el-checkbox>
            </div>
          </div>
          <div v-if="handleFlag">
            <div class="group-title">操作</div>
            <div class="group-body" style="line-height: 40px; text-align: left; padding-left: 25px; padding-right: 25px; margin-top: 15px">
              <el-button size="mini" type="primary" @click="hideMap" style="width: 100%">{{ mapVisible ? '隐藏地图' : '显示地图' }}</el-button>
              <el-button v-if="config.btns.ranging" icon="el-icon-news" size="mini" type="primary" @click="startRanging" style="width: 100%">开始测距</el-button>
              <template v-if="config.btns.drawRegion">
                <el-button v-if="drawFlag" icon="el-icon-news" size="mini" type="info" style="width: 100%" @click="changeDrawFlag(true)">取消框选</el-button>
                <el-button v-else icon="el-icon-news" size="mini" type="primary" style="width: 100%" @click="changeDrawFlag(false)">框选列车</el-button>
              </template>
              <template v-if="config.btns.drawRegionCount">
                <el-button v-if="drawFlag" icon="el-icon-news" size="mini" type="info" style="width: 100%" @click="changeDrawCountFlag(true)">取消框选</el-button>
                <el-button v-else icon="el-icon-news" size="mini" type="primary" style="width: 100%" @click="changeDrawCountFlag(false)">框选列车统计</el-button>
              </template>
              <template v-if="config.btns.yjSrc">
                <el-button v-if="drawFlag" icon="el-icon-news" size="mini" type="info" style="width: 100%" @click="changeYjSrcDrawFlag(true)">取消框选</el-button>
                <el-button v-else icon="el-icon-document" size="mini" type="primary" style="width: 100%" @click="changeYjSrcDrawFlag(false)">应急资源统计</el-button>
              </template>
              <template v-if="config.btns.task">
                <el-button icon="el-icon-document" size="mini" type="primary" style="width: 100%" @click="toolClick('openTask')">指派任务</el-button>
                <br />
                <br />
              </template>
            </div>
            <div class="group-body flex" style="height: 60px">
              <el-image v-if="config.btns.sendMsg" :src="msgPic" class="tool-img-btn" title="发送消息" @click="toolClick('openMsg')"></el-image>
              <el-image v-if="config.btns.jhtx" :src="vidioPic" class="tool-img-btn" title="聚合通信" @click="toolClick('openJhtx')"></el-image>
              <el-image v-if="config.btns.vedio" :src="vidioPic" class="tool-img-btn" title="音视频对讲" @click="toolClick('openXiaoYu')"></el-image>
              <el-image v-if="config.btns.phone" :src="phonePic" class="tool-img-btn" title="应急呼叫" @click="toolClick('openPhone')"></el-image>
            </div>
            <!-- <el-button size="mini" @click="saveCanvas">快照</el-button> -->
          </div>
          <!-- 列车飞行图时间段控制 -->
          <div v-if="config.trainFly.register">
            <div>当前查看时间：{{ trainFlyOther.flyHours }}点</div>
            <el-slider v-model="trainFlyOther.flyHours" :max="23" :show-tooltip="false" show-stops></el-slider>
          </div>
        </div>
        <template v-if="config.controller.gongDian">
          <div v-show="curTab === '供电'">
            <div v-if="config.gd_sbss.register">
              <div class="group-title">设备设施</div>
              <div class="group-body">
                <el-checkbox v-model="gongDianOther.gd_sbss.ck_gdb" style="height: 3px" @change="filterLayers('供电_设备设施')">
                  <i class="filter-icon gd-gdb"></i>
                  <span @click.prevent="handleCheckItemClick('供电臂')">供电臂</span>
                </el-checkbox>

                <el-checkbox v-model="gongDianOther.gd_sbss.ck_bds" style="height: 3px" @change="filterLayers('供电_设备设施')">
                  <i class="filter-icon gd-bds"></i>
                  <span @click.prevent="handleCheckItemClick('变电所')">变电所</span>
                </el-checkbox>
                <!-- <el-checkbox style="height: 5px;"  v-model="gongDianOther.gd_sbss.ck_dfx" @change="filterLayers('供电_设备设施')"><i class="filter-icon gd-dfx"></i>电分相</el-checkbox> -->
                <!-- <el-checkbox style="height: 3px" v-model="gongDianOther.gd_sbss.ck_td" @change="filterLayers('供电_设备设施')"><i
                class="filter-icon gd-td"></i>停电</el-checkbox>-->
                <!-- 	<el-checkbox style="height: 3px" v-model="gongDianOther.gd_sbss.ck_jjdd" @change="filterLayers('供电_设备设施')"><i
                class="filter-icon gd-jjdd"></i>间接带电</el-checkbox>-->
                <!-- <el-checkbox style="height: 3px" v-model="gongDianOther.gd_sbss.ck_yl" @change="filterLayers('供电_设备设施')"><i
                class="filter-icon gd-yl"></i>远离</el-checkbox>-->
                <el-checkbox v-model="gongDianOther.gd_sbss.ck_yjdy" style="height: 3px" @change="filterLayers('供电_设备设施')">
                  <i class="filter-icon gd-yl"></i>
                  <span @click.prevent="handleCheckItemClick('应急电源')">应急电源</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="gongDianOther.gd_sbss.ck_yjc" style="height: 3px" @change="filterLayers('供电_设备设施')">
                  <i class="filter-icon gd-yjc"></i>
                  <span @click.prevent="handleCheckItemClick('供电轨道车')">供电轨道车</span>
                </el-checkbox>
                <br />
                <el-select v-if="gongDianOther.gd_sbss.ck_yjc" size="mini" v-model="gongDianOther.ck_yjc" style="width: 160px;color: #000000;margin-top: 10px;" @change="filterLayers('供电_设备设施')" clearable>
                  <el-option value="全部" label="全部" key="全部" selected></el-option>
                  <el-option label="可用" key="可用" value="2"></el-option>
                </el-select>
                <!-- <el-checkbox style="height: 3px" v-model="gongDianOther.gd_fw.ck_wdq" @change="filterLayers('供电_范围')"><i class="filter-icon gd-wdqfw"></i>无电区</el-checkbox> -->

                <el-checkbox v-model="gongDianOther.gd_jcw.ck_fxjyq" style="height: 3px;margin-right: 10px" @change="filterLayers('供电_接触网')">
                  <i class="filter-icon-jcw gd-fxjyq"></i>
                  <span @click.prevent="handleCheckItemClick('电分相')">电分相</span>
                </el-checkbox>
                <br />
                <el-autocomplete v-if="gongDianOther.gd_jcw.ck_fxjyq" v-model="gongDianOther.ck_dfxXb" :fetch-suggestions="querySearch" class="inline-input" placeholder="请选择线别" size="mini" style="width: 160px;margin-top: 10px;" value-key="NAME" @select="filterLayers('供电_接触网')">
                  <!-- <el-option v-for="(item) in lines" :label="item.NAME" :key="item.PKID" :value="item.PKID"></el-option> -->
                </el-autocomplete>
              </div>
            </div>
            <!-- <div v-if="config.gd_jcw.register">
							<div class="group-title">接触网设备设施</div>
							<div class="group-body">
								<div class="group-body flex" style="height: 50px">
									<template>
										<el-button v-if="drawFlag" type="info" size="small" icon="el-icon-news" @click="changeDrawFlag(true, false)">取消框选</el-button>
										<el-button v-else type="primary" size="small" icon="el-icon-news" @click="changeDrawFlag(false)">框选范围</el-button>
									</template>
								</div>
								<el-checkbox style="height: 0px" v-model="gongDianOther.gd_jcw.ck_gz" @change="filterLayers('供电_接触网')"><i class="filter-icon-jcw gd-gz"></i>钢柱</el-checkbox><br />
								<el-checkbox style="height: 0px" size="mini" v-model="gongDianOther.gd_jcw.ck_hntz" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-hntz"></i>混凝土柱</el-checkbox><br />
								<el-checkbox style="height: 0px" v-model="gongDianOther.gd_jcw.ck_fjymdgj" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-fjymdgj"></i>非绝缘锚段关节</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_jymdgj" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-jymdgj"></i>绝缘锚段关节</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_fdjyq" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-fdjyq"></i>分段绝缘器</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_gddlj" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-gddlj"></i>股道电连接</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_ckkg" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-ckkg"></i>常开开关</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_cbkg" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-cbkg"></i>常闭开关</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_blq" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-blq"></i>避雷器</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_xsxwz" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-xsxwz"></i>吸上线位置</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_gjsdfx" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-fxjyq"></i>关节式电分相</el-checkbox><br />
								<el-checkbox style="height: 3px" v-model="gongDianOther.gd_jcw.ck_qjsdfx" @change="filterLayers('供电_接触网')"><i
									 class="filter-icon-jcw gd-fxjyq"></i>器件式电分相</el-checkbox>
							</div>
            </div>-->
            <div v-if="config.gd_fw.register">
              <div class="group-title">管辖范围</div>
              <div class="group-body">
                <el-checkbox v-model="gongDianOther.gd_sbss.ck_gdd" style="height: 3px" @change="filterLayers('供电_设备设施')">
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span @click.prevent="handleOpenRangeGraph('供电')">供电段</span>
                </el-checkbox>
                <!-- 筛选单位管界范围显示 -->
                <el-select collapse-tags size="mini" v-if="gongDianOther.gd_sbss.ck_gdd" v-model="showGddRange" multiple placeholder="选择段" @change="filterGddRangeLayer">
                  <el-option v-for="(gdd, index) in gongDian_layers.gd_sbss.ck_gdd" :key="index" :label="gdd.oname" :value="gdd.oname">
                    <div style="display: flex; flex-direction: row; align-content: center; align-items: center">
                      <div :style="{
                        color: gdd.fill,
                        fontSize: '24px'
                      }">&#9679</div>
                      <div>{{ gdd.oname }}</div>
                    </div>
                  </el-option>
                </el-select>
                <!-- 	<el-checkbox style="height: 3px" v-model="gongDianOther.gd_sbss.ck_gdgq" @change="filterLayers('供电_设备设施')"><i
                class="filter-icon gd-gdb"></i>供电工区</el-checkbox>-->
                <!--                <el-checkbox v-model="gongDianOther.gd_sbss.ck_cj" style="height: 3px"-->
                <!--                             @change="filterLayers('供电_设备设施')"><i-->
                <!--                  class="filter-icon gd-cj"></i>车间-->
                <!--                </el-checkbox>-->
                <!-- <el-checkbox style="height: 3px;" v-model="gongDianOther.gd_fw.ck_gdb" @change="filterLayers('供电_范围')"><i class="filter-icon gd-gdbfw"></i>供电臂范围</el-checkbox> -->
                <!-- <el-checkbox style="height: 3px;" v-model="gongDianOther.gd_fw.ck_dfx" @change="filterLayers('供电_范围')"><i class="filter-icon gd-dfxfw"></i>电分相范围</el-checkbox> -->
                <!--                <el-checkbox v-model="gongDianOther.gd_fw.ck_gqgx" style="height: 3px;" @change="filterLayers('供电_范围')">-->
                <!--                  <i-->
                <!--                    class="filter-icon gd-gqgxfw"></i>供电工区-->
                <!--                </el-checkbox><br />-->
                <!--                <el-button type="primary" size="mini" @click="handleOpenRangeGraph('供电')">管辖范围图</el-button>-->
                <!-- <el-checkbox style="height: 3px;" v-model="gongDianOther.gd_fw.ck_gqgx" @change="filterLayers('供电_范围')"><i
                class="filter-icon gd-gqgxfw"></i>工区管辖范围</el-checkbox>-->
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.keYun">
          <div v-show="curTab === '客运'">
            <div v-if="config.ky_sb.register">
              <div class="group-title">设备设施</div>
              <div class="group-body">
                <el-checkbox v-model="config.ky_sb.ky_sb_yl" @change="filterLayers('客运_医疗')">
                  <i class="filter-icon ky_sb_yl"></i>
                  <span v-if="!isPolice" @click.prevent="handleCheckItemClick('医疗资源')">医疗资源</span>
                  <span v-if="isPolice">医疗资源</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.ky_sb.ky_sb_xf" @change="filterLayers('客运_消防')">
                  <i class="filter-icon ky_sb_xf"></i>
                  <span v-if="!isPolice" @click.prevent="handleCheckItemClick('消防站')">消防站</span>
                  <span v-if="isPolice">消防站</span>
                </el-checkbox>
                <br />
                <el-checkbox v-if="!isPolice" v-model="config.ky_sb.ky_sb_pcs" @change="filterLayers('客运_派出所')">
                  <i class="filter-icon ky_sb_pcs"></i>
                  <span @click.prevent="handleCheckItemClick('派出所')">派出所</span>
                </el-checkbox>
                <el-checkbox v-if="isPolice" v-model="config.ky_sb.ky_sb_local_pcs" @change="filterLayers('客运_地方派出所')">
                  <i class="filter-icon ky_sb_pcs"></i>
                  <span>地方派出所</span>
                </el-checkbox>
                <br />
                <el-checkbox v-if="!isPolice" v-model="config.ky_sb.ky_sb_yjys" @change="filterLayers('客运_应急饮食')">
                  <i class="filter-icon ky_sb_yjys"></i>
                  <span @click.prevent="handleCheckItemClick('应急饮食')">应急饮食</span>
                </el-checkbox>
                <br v-if="!isPolice" />
                <el-checkbox v-if="!isPolice" v-model="config.ky_sb.ky_sb_fdwz" @change="filterLayers('客运_防冻物资')">
                  <i class="filter-icon ky_sb_fdwz"></i>
                  <span @click.prevent="handleCheckItemClick('防冻物资')">防冻物资</span>
                </el-checkbox>
                <br v-if="!isPolice" />
                <el-checkbox v-model="config.ky_sb.ky_sb_yjsscs" @change="filterLayers('客运_应急疏散场所')">
                  <i class="filter-icon ky_sb_yjsscs"></i>
                  <span v-if="!isPolice" @click.prevent="handleCheckItemClick('应急疏散场所')">应急疏散场所</span>
                  <span v-if="isPolice">应急疏散场所</span>
                </el-checkbox>
                <br />
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.gongWu">
          <div v-show="curTab === '工务'">
            <div v-if="config.gw_tl.register" class="filter-group">
              <div class="group-title">设备设施</div>
              <div class="group-body">
                <el-checkbox v-model="config.gw_tl.ql" @change="filterLayers('工务_桥梁')">
                  <i class="filter-icon gw_tl_ql"></i>
                  <span @click.prevent="handleCheckItemClick('桥梁')">桥梁</span>
                </el-checkbox>
                <el-checkbox v-model="config.gw_tl.sd" @change="filterLayers('工务_隧道')">
                  <i class="filter-icon gw_tl_sd"></i>
                  <span @click.prevent="handleCheckItemClick('隧道')">隧道</span>
                </el-checkbox>
                <!--                <el-checkbox v-model="config.gw_tl.pd" @change="filterLayers('工务_坡道')"><i-->
                <!--                  class="filter-icon gw_tl_pd"></i>-->
                <!--                  <span @click.prevent="handleCheckItemClick('坡道')">坡道</span>-->
                <!--                </el-checkbox>-->
                <el-checkbox v-if="!isPolice" v-model="config.gw_tl.pdd" @change="filterLayers('工务_坡道大')">
                  <i class="filter-icon gw_tl_pdd"></i>
                  <span @click.prevent="handleCheckItemClick('坡道')">坡道(>20°)</span>
                </el-checkbox>
                <el-checkbox v-model="config.gw_sb.dk" @change="filterLayers('工务_道口')">
                  <i class="filter-icon gw_sb_dk"></i>
                  <span @click.prevent="handleCheckItemClick('道口')">道口</span>
                </el-checkbox>
                <el-checkbox v-if="!isPolice" v-model="config.gw_sb.gdc" @change="showGwDgc">
                  <i class="filter-icon gw_sb_gdc"></i>
                  <span @click.prevent="handleCheckItemClick('工务轨道车')">工务轨道车</span>
                </el-checkbox>
                <el-select v-if="!isPolice" v-model="filterGwGdc" :disabled="!config.gw_sb.gdc" size="mini" style="margin-left: 5px; width: 90px" @change="filterGwGdcLayer">
                  <el-option label="可用" value="可用"></el-option>
                  <el-option label="不可用" value="不可用"></el-option>
                  <el-option label="备用" value="备用"></el-option>
                  <el-option label="全部" value="全部"></el-option>
                </el-select>
                <el-checkbox v-if="!isPolice" v-model="config.gw_sb.slpc" @change="filterLayers('工务_巡查四轮平车')">
                  <i class="filter-icon gw_sb_slpc"></i>
                  <span @click.prevent="handleCheckItemClick('巡查四轮平车')">巡查四轮平车</span>
                </el-checkbox>
                <br />
                <el-checkbox v-if="!isPolice" v-model="config.gw_sb.llxc" @change="filterLayers('工务_巡查两轮小车')">
                  <i class="filter-icon gw_sb_llxc"></i>
                  <span @click.prevent="handleCheckItemClick('巡查两轮小车')">巡查两轮小车</span>
                </el-checkbox>

                <!--                <el-checkbox v-model="config.gw_tl.jk" @change="filterLayers('工务_监控地段')"><i-->
                <!--                  class="filter-icon gw_tl_jk"></i>-->
                <!--                  <span @click.prevent="handleCheckItemClick('监控地段')">监控地段</span>-->
                <!--                </el-checkbox>-->
              </div>
            </div>
            <div v-if="config.gw_sb.register" class="filter-group">
              <div class="group-title">其他</div>
              <div class="group-body">
                <el-checkbox v-model="config.gw_sb.ksd" @change="showKsd">
                  <i class="filter-icon gw_sb_ksd2"></i>
                  <span v-if="!isPolice" @click.prevent="handleCheckItemClick('防洪看守点')">防洪看守点</span>
                  <span v-if="isPolice">防洪看守点</span>
                </el-checkbox>
                <el-select v-model="filterKsd" :disabled="!config.gw_sb.ksd" size="mini" style="margin-left: 5px; width: 90px" @change="filterKsdLayer">
                  <el-option label="Ⅰ级" value="工务_I级防洪看守点"></el-option>
                  <el-option label="Ⅱ级" value="工务_II级防洪看守点"></el-option>
                  <el-option label="Ⅲ级" value="工务_III级防洪看守点"></el-option>
                  <el-option label="全部" value="全部"></el-option>
                </el-select>
                <br />
                <el-checkbox v-model="config.gw_sb.qx" @change="
										filterLayers('工务_防洪抢险材料及机具')
									">
                  <i class="filter-icon gw_sb_qx"></i>
                  <span v-if="!isPolice" @click.prevent="handleCheckItemClick('防洪抢险材料及机具')">防洪抢险材料及机具</span>
                  <span v-if="isPolice">防洪抢险材料及机具</span>
                </el-checkbox>
                <br />
                <el-checkbox v-if="!isPolice" v-model="showGraphs" disabled>
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span style="cursor: pointer" @click.prevent="handleCheckItemClick('水害')">水害信息速报表</span>
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.gw_fw.register" class="filter-group">
              <div class="group-title">管辖范围</div>
              <div class="group-body">
                <el-checkbox v-model="gongWuOther.gw_fw.gwd" style="height: 3px" @change="filterLayers('工务_工务段')">
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span @click.prevent="handleOpenRangeGraph('工务')">工务段</span>
                </el-checkbox>
                <!-- 筛选单位管界范围显示 -->
                <el-select collapse-tags size="mini" v-if="gongWuOther.gw_fw.gwd" v-model="showGwdRange" multiple placeholder="选择段" @change="filterGwdRangeLayer">
                  <el-option v-for="(gdd, index) in gongWuLayers.gw_fw.gwd" :key="index" :label="gdd.oname" :value="gdd.oname">
                    <div style="display: flex; flex-direction: row; align-content: center; align-items: center">
                      <div :style="{color: gdd.fill,fontSize: '24px'}">&#9679</div>
                      <div>{{ gdd.oname }}</div>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.dianWu">
          <div v-show="curTab === '电务'">
            <div class="filter-group" v-if="config.dw_sb.register">
              <div class="group-title">设备设施</div>
              <div class="group-body">
                <el-checkbox v-model="config.dw_sb.dw_4g" @change="filterLayers('电务_4G')">
                  <i class="filter-icon dw_4g"></i>
                  <span @click.prevent="handleCheckItemClick('4G应急通信设备')">4G应急通信设备</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.dw_sb.dw_gdsb" @change="filterLayers('电务_轨道设备')">
                  <i class="filter-icon dw_gdsb"></i>
                  <span @click.prevent="handleCheckItemClick('轨道电路设备')">轨道电路设备</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.dw_sb.dw_lksb" @change="filterLayers('电务_列控设备')">
                  <i class="filter-icon dw_lksb"></i>
                  <span @click.prevent="handleCheckItemClick('有源应答器')">有源应答器</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.dw_sb.dw_lksb_w" @change="filterLayers('电务_列控设备无')">
                  <i class="filter-icon dw_lksb_w"></i>
                  <span @click.prevent="handleCheckItemClick('无源应答器')">无源应答器</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.dw_sb.dw_dccxsb" @change="filterLayers('电务_道岔融雪设备')">
                  <i class="filter-icon dw_dccxsb"></i>
                  <span @click.prevent="handleCheckItemClick('道岔融雪设备')">道岔融雪设备</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.dw_sb.dw_xhj" @change="filterLayers('电务_信号机')">
                  <i class="filter-icon dw_xhj"></i>
                  <span @click.prevent="handleCheckItemClick('信号机')">信号机</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.dw_sb.dw_dx" @change="filterLayers('电务_道岔')">
                  <i class="filter-icon dw_dx"></i>
                  <span @click.prevent="handleCheckItemClick('道岔')">道岔</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="config.dw_sb.dw_bpbl" @change="filterLayers('电务_备品备料')">
                  <i class="filter-icon dw_bpbl"></i>
                  <span @click.prevent="handleCheckItemClick('电务_备品备料')">备品备料</span>
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.dw_fw.register" class="filter-group">
              <div class="group-title">管辖范围</div>
              <div class="group-body">
                <el-checkbox v-model="dianWuOther.dw_fw.dwd" style="height: 3px" @change="filterLayers('电务_电务段')">
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span @click.prevent="handleOpenRangeGraph('电务')">电务段</span>
                </el-checkbox>
                <!-- 筛选单位管界范围显示 -->
                <el-select collapse-tags size="mini" v-if="dianWuOther.dw_fw.dwd" v-model="showDwdRange" multiple placeholder="选择段" @change="filterDwdRangeLayer">
                  <el-option v-for="(gdd, index) in dianWuLayers.dw_fw.dwd" :key="index" :label="gdd.oname" :value="gdd.oname">
                    <div style="display: flex; flex-direction: row; align-content: center; align-items: center">
                      <div :style="{color: gdd.fill,fontSize: '24px'}">&#9679</div>
                      <div>{{ gdd.oname }}</div>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.shiGong">
          <div v-show="curTab === '施工'">
            <div class="group-title">计划</div>
            <div class="group-body">
              <el-checkbox v-model="config.gw_jh.sg" @change="filterLayers('工务_施工计划')">
                <i class="filter-icon gw_jh_sg"></i>
                <span @click.prevent="handleCheckItemClick('施工计划')">施工计划</span>
              </el-checkbox>
              <el-checkbox v-model="config.gw_jh.wx" @change="filterLayers('工务_维修计划')">
                <i class="filter-icon gw_jh_wx"></i>
                <span @click.prevent="handleCheckItemClick('维修计划')">维修计划</span>
              </el-checkbox>
              <!--              <el-checkbox-->
              <!--                v-model="config.gw_jh.jg"-->
              <!--                @change="filterLayers('工务_监管计划')"-->
              <!--              ><i class="filter-icon gw_jh_jg"></i-->
              <!--              >监管计划-->
              <!--              </el-checkbox-->
              <!--              >-->
            </div>
          </div>
        </template>
        <template v-if="config.controller.jiWu">
          <div v-show="curTab === '机务'">
            <div v-if="config.jw_cx.register">
              <div class="group-title">车型</div>
              <div class="group-body">
                <el-checkbox v-model="jiWuOther.jw_cx.jyc" @change="filterLayers('机务_车型')">
                  <i class="filter-icon jw-jw_cx_jyc"></i>
                  <span @click.prevent="handleCheckItemClick('救援列车')">救援列车</span>
                </el-checkbox>
                <el-checkbox v-model="jiWuOther.jw_cx.rbnrjc" @change="filterLayers('机务_车型')">
                  <i class="filter-icon jw-jw_cx_rbnrjc"></i>
                  <span @click.prevent="handleCheckItemClick('热备内燃机车')">热备内燃机车</span>
                </el-checkbox>
                <el-checkbox v-model="jiWuOther.jw_cx.rbdljc" @change="filterLayers('机务_车型')">
                  <i class="filter-icon jw-jw_cx_rbdljc"></i>
                  <span @click.prevent="handleCheckItemClick('热备电力机车')">热备电力机车</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="showGraphs" disabled>
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span style="cursor:pointer;" @click.prevent="handleCheckItemClick('机车参数')">机车参数</span>
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.jw_fw.register">
              <div class="group-title">列车运行限制</div>
              <div class="group-body">
                <el-checkbox v-model="jiWuOther.jw_fw.bdz" @change="filterLayers('机务_范围')">
                  <i class="filter-icon jw-jw_fw_bdz"></i>
                  <span @click.prevent="handleCheckItemClick('百吨闸瓦压力列车限速')">百吨闸瓦压力列车限速</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="jiWuOther.jw_fw.jwcz" @change="filterLayers('机务_范围')">
                  <i class="filter-icon jw-jw_fw_jwcz"></i>
                  <span @click.prevent="handleCheckItemClick('机外大坡道特殊车站')">机外大坡道特殊车站</span>
                </el-checkbox>
                <!--								<el-checkbox v-model="jiWuOther.jw_fw.bdz" @change="filterLayers('机务_范围')"><i class="filter-icon jw-jw_fw_bdz"></i>百吨闸瓦压力列车限速</el-checkbox><br />-->
                <!--								<el-checkbox v-model="jiWuOther.jw_fw.jwcz" @change="filterLayers('机务_范围')"><i class="filter-icon jw-jw_fw_jwcz"></i>机外大坡道特殊车站</el-checkbox>-->
              </div>
            </div>
            <!--            <div>-->
            <!--              <div class="group-title">范围</div>-->
            <!--              <div class="group-body">-->
            <!--                <el-checkbox>-->
            <!--                  <i class="filter-icon gw_fw_cj"></i>-->
            <!--                  <span @click.prevent="handleOpenRangeGraph('机务')">机务段</span>-->
            <!--                </el-checkbox>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div v-if="config.jw_jy.register">-->
            <!--              <div class="group-title">救援起复设备</div>-->
            <!--              <div class="group-body">-->
            <!--                <el-checkbox v-model="jiWuOther.jw_jy.jysb" @change="filterLayers('机务_救援')"><i-->
            <!--                  class="filter-icon jw-jw_jy_jysb"></i>救援设备-->
            <!--                </el-checkbox>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </template>

        <template v-if="config.controller.yunShu">
          <div v-show="curTab === '运输'">
            <div v-if="config.ys_sbss.register">
              <div class="group-title">设备设施</div>
              <div class="group-body">
                <!-- <el-checkbox v-model="yunShuOther.ys_sbss.ck_cwd" @change="filterLayers('运输_设备设施')"><i class="filter-icon ys-cwd"></i>车务段</el-checkbox> -->
                <el-checkbox v-model="yunShuOther.ys_sbss.ck_jyd" @change="filterLayers('运输_设备设施')">
                  <i class="filter-icon ys-jyd"></i>
                  <span @click.prevent="handleCheckItemClick('救援队及设备')">救援队及设备</span>
                </el-checkbox>
                <!-- <el-checkbox v-model="yunShuOther.ys_sbss.ck_jysb" @change="filterLayers('运输_设备设施')"><i class="filter-icon ys-jysb"></i>救援设备</el-checkbox> -->
              </div>
            </div>
            <div v-if="config.ys_fw.register">
              <div class="group-title">管辖范围</div>
              <div class="group-body">
                <el-checkbox v-model="showYsRange" @change="handleShowYsUnitList">
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span style="cursor: pointer" @click.prevent="handleOpenRangeGraph('运输')">车务站段</span>
                </el-checkbox>
                <el-select size="mini" v-if="showYsRange" collapse-tags multiple v-model="yunshuSelectedUnits" @change="handleHighLightStations">
                  <el-option v-for="(unit, index) in yunshuSelectUnitList" :key="index" :value="unit.UNIT">
                    <div style="display: flex; flex-direction: row; align-content: center; align-items: center">
                      <div :style="{color: unit.COLOR ,fontSize: '24px'}">&#9679;</div>
                      <div>{{ unit.UNIT }}</div>
                    </div>
                  </el-option>
                </el-select>
                <!--                <template v-for="(qy, index) in yunShuOther.bounds">-->
                <!--                  <el-checkbox v-model="qy.visible" :label="qy.AREA_ONAME" @change="filterLayers('运输_范围', qy)"><i-->
                <!--                    class="filter-icon ys-cwdfw"></i>{{ qy.AREA_ONAME }}-->
                <!--                  </el-checkbox>-->
                <!--                </template>-->
              </div>
            </div>
            <div v-if="config.ys_jflc.register">
              <div class="group-title" style="cursor: pointer" @click.prevent="handleCheckItemClick('接发列车限制')">接发列车限制</div>
              <div class="group-body">
                <el-checkbox v-model="yunShuOther.ys_jflc.ck_lkjz" @change="filterLayers('运输_接发列车限制')">
                  <i class="filter-icon ys-lkjz"></i>旅客列车禁止停留
                </el-checkbox>
                <br />
                <el-checkbox v-model="yunShuOther.ys_jflc.ck_lcjz" @change="filterLayers('运输_接发列车限制')">
                  <i class="filter-icon ys-lcjz"></i>列车禁止停留
                </el-checkbox>
                <!-- <el-checkbox v-model="yunShuOther.ys_jflc.ck_xdfx" @change="filterLayers('运输_接发列车限制')"><i class="filter-icon ys-jflcxz1"></i>相对方向同时接车限制</el-checkbox><br />
                <el-checkbox v-model="yunShuOther.ys_jflc.ck_tfx" @change="filterLayers('运输_接发列车限制')"><i class="filter-icon ys-jflcxz2"></i>同方向同时发接列车限制</el-checkbox>-->
              </div>
            </div>
            <div v-if="config.ys_dcjc.register">
              <div class="group-title">调车机车</div>
              <div class="group-body">
                <el-checkbox v-model="yunShuOther.ys_dcjc.ck_ddjc" @change="filterLayers('运输_调车机车')">
                  <i class="filter-icon ys-ddjc"></i>
                  <span style="color: white;" @click.prevent="handleCheckItemClick('调度机车')">调度机车</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="yunShuOther.ys_dcjc.ck_zydc" @change="filterLayers('运输_调车机车')">
                  <i class="filter-icon ys-zydc"></i>
                  <span style="color: white" @click.prevent="handleCheckItemClick('专用调车机车')">专用调车机车</span>
                </el-checkbox>
                <br />
                <el-checkbox disabled v-model="yunShuOther.ys_dcjc.ck_snxyc" @change="filterLayers('运输_调车机车')">
                  <i class="filter-icon ys-snxyc"></i>
                  <span style="color: white; cursor: pointer; margin-left: 0px" @click.prevent="handleCheckItemClick('枢纽小运转机车')">枢纽小运转机车</span>
                </el-checkbox>
                <br />
                <!--                <el-checkbox v-model="yunShuOther.ys_dcjc.ck_lycz" @change="filterLayers('运输_调车机车')"><i-->
                <!--                  class="filter-icon ys-lycz"></i>路用出租机车-->
                <!--                </el-checkbox>-->
                <br />
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.cheLiang">
          <div v-show="curTab === '车辆'">
            <div class="filter-group" v-if="config.cl.register">
              <div class="group-title">车辆</div>
              <div class="group-body">
                <el-checkbox v-model="cheLiangOther.bpbl" @change="filterLayers('车辆_备品备料')">
                  <i class="filter-icon ys-bpbl"></i>
                  <span @click.prevent="handleCheckItemClick('备品备料')">备品备料</span>
                </el-checkbox>
                <br />
                <el-checkbox v-model="cheLiangOther.bycz" @change="filterLayers('车辆_备用车组')">
                  <i class="filter-icon cl-byct"></i>
                  <span @click.prevent="handleCheckItemClick('备用车体')">备用车体</span>
                </el-checkbox>
                <br />
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.tuFang">
          <div v-show="curTab === '土房'">
            <div v-if="config.tf_sbss.register">
              <div class="filter-group">
                <div class="group-title">设备设施</div>
                <div class="group-body">
                  <el-checkbox v-model="tuFangOther.sbss.shc" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-shc"></i>
                    <span @click.prevent="handleCheckItemClick('生活车')">生活车</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.yjcl" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-yjcl"></i>应急材料
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.wsjds" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-wsjds"></i>
                    <span @click.prevent="handleCheckItemClick('卫生监督所')">卫生监督所</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.jks" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-jks"></i>
                    <span @click.prevent="handleCheckItemClick('疾控所')">疾控所</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.scd" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-scd"></i>
                    <span @click.prevent="handleCheckItemClick('送餐点')">送餐点</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.gy" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon jw-jw_fw_gy"></i>
                    <span @click.prevent="handleCheckItemClick('公寓')">公寓</span>
                  </el-checkbox>
                  <br />
                  <!-- <el-checkbox v-model="tuFangOther.sbss.gq" @change="filterLayers('土房_设备设施')"><i class="filter-icon tufang-sbss-gq"></i>工区</el-checkbox> -->
                </div>
              </div>
            </div>
            <div v-if="config.tf_fw.register">
              <div class="filter-group">
                <div class="group-title">管辖范围</div>
                <div class="group-body">
                  <!-- <el-checkbox v-model="tuFangOther.fw.cj" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-cj"></i>车间范围</el-checkbox>
                  <el-checkbox v-model="tuFangOther.fw.gq" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-gq"></i>工区范围</el-checkbox>-->
                  <!-- <el-checkbox v-model="tuFangOther.fw.d" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-d"></i>全部站</el-checkbox><br/> -->
                  <el-checkbox v-model="tuFangOther.fw.cqjzd" @change="filterLayers('土房_范围')">
                    <i class="filter-icon tufang-fw-d"></i>重庆建筑段
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="tuFangOther.fw.gyjzd" @change="filterLayers('土房_范围')">
                    <i class="filter-icon tufang-fw-d"></i>贵阳建筑段
                  </el-checkbox>
                  <br />
                  <!-- <el-checkbox v-model="tuFangOther.fw.dchtgs" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-d"></i>达成合铁公司</el-checkbox><br /> -->
                  <el-checkbox v-model="tuFangOther.fw.cdjzd" @change="filterLayers('土房_范围')">
                    <i class="filter-icon tufang-fw-d"></i>成都建筑段
                  </el-checkbox>
                  <br />
                  <!--                  <el-button type="primary" size="mini" @click="handleOpenRangeGraph('运输')">管辖范围图</el-button>-->
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.huoYun">
          <div v-show="curTab === '货运'">
            <div v-if="config.hy_sbss.register">
              <div class="filter-group">
                <div class="group-title">设备设施</div>
                <div class="group-body">
                  <!-- <el-checkbox v-model="huoYunOther.sbss.hyz" @change="filterLayers('货运')"><i
                    class="filter-icon huoyun-hyz"></i>货运站
                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <!--                  <el-checkbox v-model="huoYunOther.sbss.yjry" @change="filterLayers('货运')">-->
                  <!--                    <i class="filter-icon huoyun-yjry"></i>应急人员-->
                  <!--                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <!--                  <el-checkbox v-model="huoYunOther.sbss.jjbl" @change="filterLayers('货运')">-->
                  <!--                    <i class="filter-icon huoyun-jjbl"></i>机具备料-->
                  <!--                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <!--                  <el-checkbox v-model="huoYunOther.sbss.yjll" @change="filterLayers('货运')">-->
                  <!--                    <i class="filter-icon huoyun-yjll"></i>应急劳力-->
                  <!--                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <!--                  <el-checkbox v-model="huoYunOther.sbss.yjzxjx" @change="filterLayers('货运')">-->
                  <!--                    <i class="filter-icon huoyun-yjzxjx"></i>应急装卸机械-->
                  <!--                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <!--                  <el-checkbox v-model="huoYunOther.sbss.shjxzy" @change="filterLayers('货运')">-->
                  <!--                    <i class="filter-icon huoyun-shjxzy"></i>社会机械资源-->
                  <!--                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <!--                  <el-checkbox v-model="huoYunOther.sbss.wxhwblz" @change="filterLayers('货运')">-->
                  <!--                    <i class="filter-icon huoyun-wxhwblz"></i>危险货物办理站-->
                  <!--                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <!--                  <el-checkbox v-model="huoYunOther.sbss.yfhwblz" @change="filterLayers('货运')">-->
                  <!--                    <i class="filter-icon huoyun-yfhwblz"></i>易腐货物办理站-->
                  <!--                  </el-checkbox>-->
                  <!--                  <br/>-->
                  <el-checkbox v-model="hy_sbss_ydszthwx.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_ydszthwx"></i>
                    <span style="margin-left: -4px;" @click.prevent="handleCheckItemClick('有端式站台货运线')">有端式站台货物线</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="hy_sbss_ycmzthwx.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_ycmzthwx"></i>
                    <span @click.prevent="handleCheckItemClick('有侧面1.1m站台货物线')">有侧面1.1m站台货物线</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="hy_sbss_ydsztzyx.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_ydsztzyx"></i>
                    <span @click.prevent="handleCheckItemClick('有端式站台的专用线线路')">有端式站台的专用线线路</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox disabled v-model="hy_sbss_zdhzyjry.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_zdhzyjry"></i>
                    <span style="color: white; cursor: pointer;" @click.prevent="handleCheckItemClick('站段货装应急管理固话人员')">站段货装应急管理固话人员</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="hy_sbss_yjzzjgcl.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_yjzzjgcl"></i>
                    <span @click.prevent="handleCheckItemClick('应急装载站及常用加固材料')">应急装载站及常用加固材料</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="hy_sbss_yjzxll.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_yjzxll"></i>
                    <span @click.prevent="handleCheckItemClick('应急装卸劳力')">应急装卸劳力</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="hy_sbss_lwyjqxjx.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_lwyjqxjx"></i>
                    <span @click.prevent="handleCheckItemClick('路外应急抢险机械')">路外应急抢险机械</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="hy_sbss_wxhyshwl.visible" @change="filterLayers('货运')">
                    <i class="filter-icon hy_sbss_wxhyshwl"></i>
                    <span @click.prevent="handleCheckItemClick('危险货运施救信息网络及应急资源')">危险货运施救信息网络及应急资源</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="hy_lntjqxjx" @change="filterQxjxLayer">
                    <i class="filter-icon hy_sbss_lwyjqxjx"></i>
                    <span @click.prevent="handleCheckItemClick('路内应急抢险机械')">路内应急抢险机械</span>
                  </el-checkbox>
                  <el-select v-model="filterQxjx" :disabled="!hy_lntjqxjx" size="mini" class="ownSelect" style="margin-left: 40px; width: 77px;" @change="filterQxjxLayer">
                    <el-option label="起重机" value="货运_起重机"></el-option>
                    <el-option label="挖掘机" value="货运_挖掘机"></el-option>
                    <el-option label="装载机" value="货运_装载机"></el-option>
                    <el-option label="全部" value="货运_全部抢险机械"></el-option>
                  </el-select>
                  <br />
                  <!-- <el-checkbox v-model="tuFangOther.sbss.gq" @change="filterLayers('土房_设备设施')"><i class="filter-icon tufang-sbss-gq"></i>工区</el-checkbox> -->
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.houQing">
          <div v-show="curTab === '后勤'">
            <div v-if="config.houqing_xuexiao.register">
              <div class="filter-group">
                <div class="group-title">学校</div>
                <div class="group-body">
                  <el-checkbox v-model="houQingOther.xiaoxue" @change="filterLayers('后勤_学校')">
                    <i class="filter-icon houqing-xiaoxue"></i>小学
                  </el-checkbox>
                  <el-checkbox v-model="houQingOther.zhongxue" @change="filterLayers('后勤_学校')">
                    <i class="filter-icon houqing-zhongxue"></i>中学
                  </el-checkbox>
                  <el-checkbox v-model="houQingOther.gaozhong" @change="filterLayers('后勤_学校')">
                    <i class="filter-icon houqing-zhongxue"></i>高中
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="houQingOther.zhongxiaoxue" @change="filterLayers('后勤_学校')">
                    <i class="filter-icon houqing-xiaoxue"></i>九年一贯制学校(中小学)
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="houQingOther.chugaozhong" @change="filterLayers('后勤_学校')">
                    <i class="filter-icon houqing-zhongxue"></i>完全中学(初高中)
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.zaiHai">
          <div v-show="curTab === '灾害'">
            <div v-if="config.earthquake.register">
              <div class="group-title">地震</div>
              <div class="group-body">
                <el-checkbox v-model="eqOther.layerVisible" @change="filterLayers('地震')">
                  <i class="filter-icon dizhen"></i>地震源
                </el-checkbox>
                <!--                <el-checkbox disabled>-->
                <!--                  <span style="cursor: pointer; color: white" @click="openXxfa">-->
                <!--                    <i class="filter-icon gd-bds"></i>枢纽巡线方案-->
                <!--                  </span>-->
                <!--                </el-checkbox>-->
              </div>
              <div class="group-title">操作</div>
              <div class="group-body" style="padding-left: 30px; padding-right: 30px">
                <el-button @click="handleEqCommand('IMPORT')" style="margin-bottom: 10px; width: 100%; margin-top: 25px" size="mini" type="primary">地震导入</el-button>
                <el-dropdown style="width: calc(50% - 5px); margin-right: 10px" @command="$emit('markerClick', $event)">
                  <el-button style="margin-bottom: 10px; width: 100%" size="mini" type="primary">
                    地震图示
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(eq, index) in nowEqs" :key="index" :command="eq">{{ eq.EQ_LOCATION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown style="width: calc(50% - 5px)" @command="handleEqCommand('INFO', $event)">
                  <el-button style="margin-bottom: 10px; width: 100%" size="mini" type="primary">
                    信息通报
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(eq, index) in nowEqs" :key="index" :command="eq">{{ eq.EQ_LOCATION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown style="width: 100%" @command="handleEqCommand('PLANS', $event)">
                  <el-button style="margin-bottom: 10px; width: 100%" size="mini" type="primary">
                    巡线方案填报
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(eq, index) in nowEqs" :key="index" :command="eq">{{ eq.EQ_LOCATION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!--                <el-button @click="handleEqCommand('INFO')" style="margin-bottom: 10px" size="mini" type="primary">信息通报</el-button>-->
                <!--                <el-button @click="handleEqCommand('PLANS')" style="margin-bottom: 10px" size="mini" type="primary">巡线方案</el-button>-->
                <el-dropdown style="width: calc(50% - 5px); margin-right: 10px" @command="handleEqCommand('DIAGRAM', $event)">
                  <el-button style="margin-bottom: 10px; width: 100%" size="mini" type="primary">
                    影响范围
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(eq, index) in nowEqs" :key="index" :command="eq">{{ eq.EQ_LOCATION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown style="width: calc(50% - 5px)" @command="handleEqCommand('REPORT', $event)">
                  <el-button style="margin-bottom: 10px; width: 100%" size="mini" type="primary">
                    速报
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(eq, index) in nowEqs" :key="index" :command="eq">{{ eq.EQ_LOCATION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown style="width: calc(50% - 5px); margin-right: 10px" @command="handleEqCommand('FORM', $event)">
                  <el-button style="margin-bottom: 10px; width: 100%" size="mini" type="primary">
                    报表
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(eq, index) in nowEqs" :key="index" :command="eq">{{ eq.EQ_LOCATION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown style="width: calc(50% - 5px);" @command="handleEqCommand('CMD', $event)">
                  <el-button style="margin-bottom: 25px; width: 100%" size="mini" type="primary">
                    命令
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(eq, index) in nowEqs" :key="index" :command="eq">{{ eq.EQ_LOCATION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!--                <el-button @click="handleEqCommand('REPORT')" style="margin-bottom: 10px" size="mini" type="primary">速报</el-button>-->
                <!--                <el-button size="mini" type="primary" @click="handleEqJumpScreen('值班表')">应急值班表</el-button>-->
                <!--                <el-button size="mini" type="primary" @click="handleEqJumpScreen('速报')">应急速报大屏</el-button>-->
              </div>
              <div class="group-title">巡线方案</div>
              <div class="group-body" style="padding-left: 30px; padding-right: 30px">
                <el-button @click="openXxfa" size="mini" type="primary" style="margin-bottom: 10px; margin-top: 20px; width: 100%">巡线方案示意图</el-button>
                <el-button @click="handleEqCommand('GX_PLAN')" size="mini" type="primary" style="margin-bottom: 10px; width: 100%">高铁干线巡线方案</el-button>
                <el-dropdown style="width: 100%" @command="handleEqCommand('SN_PLAN', $event)">
                  <el-button size="mini" type="primary" style="margin-bottom: 10px; width: 100%">
                    枢纽巡线方案
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="成都">成都</el-dropdown-item>
                    <el-dropdown-item command="重庆">重庆</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!--                <el-button @click="handleEqCommand('REPORT')" style="margin-bottom: 10px" size="mini" type="primary">速报</el-button>-->
                <!--                <el-button size="mini" type="primary" @click="handleEqJumpScreen('值班表')">应急值班表</el-button>-->
                <!--                <el-button size="mini" type="primary" @click="handleEqJumpScreen('速报')">应急速报大屏</el-button>-->
              </div>
            </div>
          </div>
        </template>
        <template v-if="config.controller.jiaotong">
          <div v-show="curTab === '交通'">
            <div v-if="config.jiaotong.register">
              <div class="group-title">交通工具</div>
              <div class="group-body">
                <el-checkbox v-model="jiaotongLayerVisibility.gongjiao" @change="filterLayers('公交')">
                  <i class="filter-icon gongjiao"></i>公交
                </el-checkbox>
                <el-checkbox v-model="jiaotongLayerVisibility.chuzuche" @change="filterLayers('出租车')">
                  <i class="filter-icon chuzuche"></i>出租车
                </el-checkbox>
                <el-checkbox v-model="jiaotongLayerVisibility.danche" @change="filterLayers('共享单车')">
                  <i class="filter-icon gongxiangdanche"></i>共享单车
                </el-checkbox>
                <el-checkbox v-model="jiaotongLayerVisibility.wangyueche" @change="filterLayers('网约车')">
                  <i class="filter-icon wangyueche"></i>网约车
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.jiaotongzhan.register">
              <div class="group-title">公共交通站</div>
              <div class="group-body">
                <el-checkbox v-model="jiaotongLayerVisibility.ditie" @change="filterLayers('地铁')">
                  <i class="filter-icon ditie"></i>地铁
                </el-checkbox>
                <el-checkbox v-model="
										jiaotongLayerVisibility.tingchechang
									" @change="filterLayers('停车场')">
                  <i class="filter-icon tingchechang"></i>停车场
                </el-checkbox>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="gaPanelType==='pcs'" class="ga-return" @click="gaReturn()">返回公安处</div>
    <GaPanelLeft v-if="!isLight && !hasCurrentEarthquake && isPolice" :isPolice="isPolice" :darkPanelHideLeft="darkPanelHideLeft" :toolOpt="toolOpt" :showAllStns="showAllStns" :curGaArea="curGaArea" :policeDetail="policeDetail" :gaPanelType=" gaPanelType"></GaPanelLeft>

    <GaPanelRight v-if="!isLight && !hasCurrentEarthquake && isPolice" :isPolice="isPolice" :darkPanelHideRight="darkPanelHideRight" :toolOpt="toolOpt" :showAllStns="showAllStns" :curGaArea="curGaArea" :policeDetail="policeDetail" :gaPanelType="gaPanelType"></GaPanelRight>

    <!-- <GaPanelLeft v-if="config.controller.register && !isLight && !hasCurrentEarthquake && isPolice" :isPolice="isPolice" :darkPanelHideLeft="darkPanelHideLeft" :toolOpt="toolOpt" :showAllStns="showAllStns"></GaPanelLeft>

    <GaPanelRight v-if="config.controller.register && !isLight && !hasCurrentEarthquake && isPolice" :isPolice="isPolice" :darkPanelHideRight="darkPanelHideRight" :toolOpt="toolOpt" :showAllStns="showAllStns"></GaPanelRight> -->

    <!-- 亮版地图收藏&地图操作抽屉 -->
    <div v-show="isLight && !hasCurrentEarthquake" :class="{'light-panel': panel.hide, 'light-panel-show': !panel.hide}">
      <div :class="{'hide-switch': !panel.hide, 'unhide-switch': panel.hide}" @click="panel.hide = !panel.hide"></div>
      <div v-show="isLight && !panel.hide">
        <div style="width: 100%; height: 100%">
          <div class="favorite-filters">
            <div style="padding-top: 15px; display: flex; align-content: center; align-items: center; justify-content: center">
              <span style="color: #5EB0F3; font-size: 18px; font-weight: bold">我的收藏</span>
            </div>
          </div>
          <div class="other-ops">
            <div style="padding-top: 15px; display: flex; align-content: center; align-items: center; justify-content: center">
              <span style="color: #5EB0F3; font-size: 18px; font-weight: bold">设置</span>
            </div>
            <div style="padding: 15px; display: flex">
              <el-button size="mini" type="primary" @click="hideMap">{{ mapVisible ? '隐藏地图' : '显示地图' }}</el-button>
              <el-button size="mini" type="primary">编辑收藏项</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    亮版地图元素控制-->
    <div v-if="config.controller.register && isLight && !hasCurrentEarthquake" class="light-filter-con">
      <div style="height: 100%; width: 100%; display: flex; align-content: center; justify-content: flex-start; align-items: center">
        <!--        <div class="light-logo"></div>-->
        <!--        <div class="light-title">-->
        <!--          <span style="color: white; font-size: 18px;">中国铁路成都局集团有限公司</span>-->
        <!--          <span style="color: white; font-size: 18px; font-weight: bold; margin-left: 10px">应急指挥中心</span>-->
        <!--        </div>-->
        <div class="light-navbar">
          <div :class="{'selected': panelLight.current === '基础'}" class="light-navbar-item" @click="setPanelLight('基础', true, $event)">
            <span>基础</span>
          </div>
          <div v-if="config.controller.gongDian" :class="{ 'selected': panelLight.current === '供电' }" class="light-navbar-item" @click="setPanelLight('供电', true, $event)">
            <span>供电</span>
          </div>
          <div v-if="config.controller.gongWu" :class="{ 'selected': panelLight.current === '工务' }" class="light-navbar-item" @click="setPanelLight('工务', true, $event)">
            <span>工务</span>
          </div>
          <div v-if="config.controller.shiGong" :class="{ 'selected': panelLight.current === '施工' }" class="light-navbar-item" @click="setPanelLight('施工', true, $event)">
            <span>施工</span>
          </div>
          <div v-if="config.controller.dianWu" :class="{ 'selected': panelLight.current === '电务' }" class="light-navbar-item" @click="setPanelLight('电务', true, $event)">
            <span>电务</span>
          </div>
          <div v-if="config.controller.jiWu" :class="{ 'selected': panelLight.current === '机务' }" class="light-navbar-item" @click="setPanelLight('机务', true, $event)">
            <span>机务</span>
          </div>
          <div v-if="config.controller.yunShu" :class="{ 'selected': panelLight.current === '运输' }" class="light-navbar-item" @click="setPanelLight('运输', true, $event)">
            <span>运输</span>
          </div>
          <div v-if="config.controller.cheLiang" :class="{ 'selected': panelLight.current === '车辆' }" class="light-navbar-item" @click="setPanelLight('车辆', true, $event)">
            <span>车辆</span>
          </div>
          <div v-if="config.controller.tuFang" :class="{ 'selected': panelLight.current === '土房' }" class="light-navbar-item" @click="setPanelLight('土房', true, $event)">
            <span>后勤保障</span>
          </div>
          <div v-if="config.controller.huoYun" :class="{ 'selected': panelLight.current === '货运' }" class="light-navbar-item" @click="setPanelLight('货运', true, $event)">
            <span>货运</span>
          </div>
          <div v-if="config.controller.houQing" :class="{ 'selected': panelLight.current === '后勤' }" class="light-navbar-item" @click="setPanelLight('后勤', true, $event)">
            <span>地方资源</span>
          </div>
          <div v-if="config.controller.zaiHai" :class="{'selected': panelLight.current === '灾害' }" class="light-navbar-item" @click="setPanelLight('灾害', true, $event)">
            <span>灾害</span>
          </div>
          <div v-if="config.controller.jiaotong" :class="{'selected': panelLight.current === '交通' }" class="light-navbar-item" @click="setPanelLight('交通', true, $event)">
            <span>交通</span>
          </div>
          <div v-if="config.controller.other" :class="{ 'selected': panelLight.current === '其它' }" class="light-navbar-item" @click="setPanelLight('其它', true, $event)">
            <span>其它</span>
          </div>
        </div>
        <!--        全局车次搜索 (亮)-->

        <div class="light-user">
          <el-switch v-model="lightOverride" active-icon-class="el-icon-sunny" inactive-icon-class="el-icon-moon" style="margin-right: 10px" @change="changeMapThemeOverride"></el-switch>
          <div :class="{'light-user-messageon': msgStatu, 'light-user-messageoff': !msgStatu}" :title="msgStatu ? '消息服务器已连接' : '消息服务器未连接'"></div>
          <div class="light-username">{{ username }}</div>
        </div>
      </div>
    </div>

    <!-- 	<el-collapse-transition>
			<div style="height: 100%; width: 250px" v-show="panelLight.current === '电务'">
			</div>
		</el-collapse-transition>
		
		<el-collapse-transition>
			<div style="height: 100%; width: 250px" v-show="panelLight.current === '运输'">
			</div>
    </el-collapse-transition>-->
    <el-collapse-transition>
      <div v-show="panelLight.display && !hasCurrentEarthquake" :style="{'left': panelLight.x + 'px'}" class="light-filter-panel">
        <el-collapse-transition>
          <div v-show="panelLight.current === '工务'" style="height: 100%; width: 250px">
            <div class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">设备设施</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="config.gw_tl.ql" @change="filterLayers('工务_桥梁')">
                  <i class="filter-icon gw_tl_ql"></i>
                  <span @click.prevent="handleCheckItemClick('桥梁')">桥梁</span>
                </el-checkbox>
                <el-checkbox v-model="config.gw_tl.sd" @change="filterLayers('工务_隧道')">
                  <i class="filter-icon gw_tl_sd"></i>
                  <span @click.prevent="handleCheckItemClick('隧道')">隧道</span>
                </el-checkbox>
                <!--                <el-checkbox v-model="config.gw_tl.pd" @change="filterLayers('工务_坡道')">-->
                <!--                  <i class="filter-icon gw_tl_pd"></i>-->
                <!--                  <span @click.prevent="handleCheckItemClick('坡道')">坡道</span>-->
                <!--                </el-checkbox>-->
                <el-checkbox v-model="config.gw_tl.pdd" @change="filterLayers('工务_坡道大')">
                  <i class="filter-icon gw_tl_pdd_light"></i>
                  <span @click.prevent="handleCheckItemClick('坡道')">坡道 (>20°)</span>
                </el-checkbox>
                <el-checkbox v-model="config.gw_sb.dk" @change="filterLayers('工务_道口')">
                  <i class="filter-icon gw_sb_dk_light"></i>
                  <span @click.prevent="handleCheckItemClick('道口')">道口</span>
                </el-checkbox>
                <el-checkbox v-model="config.gw_sb.gdc" @change="filterLayers('工务_轨道车')">
                  <i class="filter-icon gw_sb_gdc_light"></i>
                  <span @click.prevent="handleCheckItemClick('工务轨道车')">工务轨道车</span>
                </el-checkbox>
                <!--                <el-checkbox v-model="config.gw_tl.jk" @change="filterLayers('工务_监控地段')">-->
                <!--                  <i class="filter-icon gw_tl_jk"></i>-->
                <!--                  <span @click.prevent="handleCheckItemClick('监控地段')">监控地段</span>-->
                <!--                </el-checkbox>-->
              </div>
            </div>
            <div class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">其他</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="config.gw_sb.ksd" @change="showKsd">
                  <i class="filter-icon gw_sb_ksd2_light"></i>
                  <span style="margin-left: 5px" @click.prevent="handleCheckItemClick('防洪看守点')">防洪看守点</span>
                </el-checkbox>
                <el-select v-model="filterKsd" :disabled="!config.gw_sb.ksd" size="mini" style="margin-left: 5px; width: 90px" @change="filterKsdLayer">
                  <el-option label="Ⅰ级" value="工务_I级防洪看守点"></el-option>
                  <el-option label="Ⅱ级" value="工务_II级防洪看守点"></el-option>
                  <el-option label="Ⅲ级" value="工务_III级防洪看守点"></el-option>
                  <el-option label="全部" value="全部"></el-option>
                </el-select>
                <el-checkbox v-model="config.gw_sb.qx" style="margin-right: 10px" @change="filterLayers('工务_防洪抢险材料及机具')">
                  <i class="filter-icon gw_sb_qx_light"></i>
                  <span @click.prevent="handleCheckItemClick('防洪抢险材料及机具')">防洪抢险材料及机具</span>
                </el-checkbox>
                <el-checkbox v-if="!isPolice" v-model="showGraphs" disabled>
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span style="cursor: pointer" @click.prevent="handleCheckItemClick('水害')">水害信息速报表</span>
                </el-checkbox>
              </div>
            </div>
            <div class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">管辖范围</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="config.gw_fw.gwd" @change="filterLayers('工务_工务段')">
                  <i class="filter-icon gw_fw_gwd_light"></i>
                  <span @click.prevent="handleOpenRangeGraph('工务')">工务段</span>
                </el-checkbox>
                <!--                <el-checkbox v-model="config.gw_fw.gq" @change="filterLayers('工务_工区')">-->
                <!--                  <i class="filter-icon gw_fw_gq_light"></i>-->
                <!--                  工区-->
                <!--                </el-checkbox>-->
                <!--                <el-checkbox v-model="config.gw_fw.cj" @change="filterLayers('工务_工区车间')">-->
                <!--                  <i class="filter-icon gw_fw_cj_light"></i>-->
                <!--                  工区车间-->
                <!--                </el-checkbox>-->
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '车辆'" style="height: 100%; width: 250px">
            <div class="light-filter-area">
              <div class="light-filter-area-title">车辆</div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="cheLiangOther.bpbl" @change="filterLayers('车辆_备品备料')">
                  <i class="filter-icon ys-bpbl"></i>备品备料
                </el-checkbox>
                <br />
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '运输'" style="height: 100%; width: 250px">
            <div v-if="config.ys_sbss.register" class="light-filter-area">
              <div class="light-filter-area-title">设备设施</div>
              <div class="light-filter-area-content">
                <!-- <el-checkbox v-model="yunShuOther.ys_sbss.ck_cwd" @change="filterLayers('运输_设备设施')"><i class="filter-icon ys-cwd"></i>车务段</el-checkbox> -->
                <el-checkbox v-model="yunShuOther.ys_sbss.ck_jyd" @change="filterLayers('运输_设备设施')">
                  <i class="filter-icon ys-jyd-light"></i>
                  <span @click.prevent="handleCheckItemClick('救援队及设备')">救援队及设备</span>
                </el-checkbox>
                <!-- <el-checkbox v-model="yunShuOther.ys_sbss.ck_jysb" @change="filterLayers('运输_设备设施')"><i class="filter-icon ys-jysb"></i>救援设备</el-checkbox> -->
              </div>
            </div>
            <div v-if="config.ys_fw.register" class="light-filter-area">
              <div class="light-filter-area-title">管辖范围</div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="showGraphs" disabled>
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span style="cursor: pointer" @click.prevent="handleOpenRangeGraph('运输')">车务站段</span>
                </el-checkbox>
                <!--                <template v-for="(qy, index) in yunShuOther.bounds">-->
                <!--                  <el-checkbox v-model="qy.visible" :label="qy.AREA_ONAME" @change="filterLayers('运输_范围', qy)"><i-->
                <!--                    class="filter-icon ys-cwdfw"></i>{{ qy.AREA_ONAME }}-->
                <!--                  </el-checkbox>-->
                <!--                </template>-->
              </div>
            </div>
            <div v-if="config.ys_jflc.register" class="light-filter-area">
              <div class="light-filter-area-title">接发列车限制</div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="yunShuOther.ys_jflc.ck_lkjz" style="margin-right: 10px" @change="filterLayers('运输_接发列车限制')">
                  <i class="filter-icon ys-lkjz-light"></i>旅客列车禁止停留
                </el-checkbox>
                <el-checkbox v-model="yunShuOther.ys_jflc.ck_lcjz" @change="filterLayers('运输_接发列车限制')">
                  <i class="filter-icon ys-lcjz-light"></i>列车禁止停留
                </el-checkbox>
                <!-- <el-checkbox v-model="yunShuOther.ys_jflc.ck_xdfx" @change="filterLayers('运输_接发列车限制')"><i class="filter-icon ys-jflcxz1"></i>相对方向同时接车限制</el-checkbox><br />
                <el-checkbox v-model="yunShuOther.ys_jflc.ck_tfx" @change="filterLayers('运输_接发列车限制')"><i class="filter-icon ys-jflcxz2"></i>同方向同时发接列车限制</el-checkbox>-->
              </div>
            </div>
            <div v-if="config.ys_dcjc.register" class="light-filter-area">
              <div class="light-filter-area-title">调车机车</div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="yunShuOther.ys_dcjc.ck_ddjc" style="margin-right: 10px" @change="filterLayers('运输_调车机车')">
                  <i class="filter-icon ys-ddjc-light"></i>调度机车
                </el-checkbox>
                <el-checkbox v-model="yunShuOther.ys_dcjc.ck_snxyc" style="margin-right: 10px" @change="filterLayers('运输_调车机车')">
                  <i class="filter-icon ys-snxyc-light"></i>枢纽小运转机车
                </el-checkbox>
                <el-checkbox v-model="yunShuOther.ys_dcjc.ck_zydc" style="margin-right: 10px" @change="filterLayers('运输_调车机车')">
                  <i class="filter-icon ys-zydc-light"></i>专用调车机车
                </el-checkbox>
                <!--                <el-checkbox v-model="yunShuOther.ys_dcjc.ck_lycz" @change="filterLayers('运输_调车机车')"><i-->
                <!--                  class="filter-icon ys-lycz-light"></i>路用出租机车-->
                <!--                </el-checkbox>-->
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '货运'" style="height: 100%; width: 250px">
            <div v-if="config.hy_sbss.register">
              <div class="light-filter-area">
                <div class="light-filter-area-title">设备设施</div>
                <div class="light-filter-area-content">
                  <!-- <el-checkbox v-model="huoYunOther.sbss.hyz" @change="filterLayers('货运')"><i
                    class="filter-icon huoyun-hyz"></i>货运站
                  </el-checkbox>-->
                  <el-checkbox v-model="huoYunOther.sbss.yjry" @change="filterLayers('货运')">
                    <i class="filter-icon huoyun-yjry-light"></i>应急人员
                  </el-checkbox>
                  <el-checkbox v-model="huoYunOther.sbss.jjbl" @change="filterLayers('货运')">
                    <i class="filter-icon huoyun-jjbl-light"></i>机具备料
                  </el-checkbox>
                  <el-checkbox v-model="huoYunOther.sbss.yjll" @change="filterLayers('货运')">
                    <i class="filter-icon huoyun-yjll-light"></i>应急劳力
                  </el-checkbox>
                  <el-checkbox v-model="huoYunOther.sbss.yjzxjx" style="margin-right: 10px" @change="filterLayers('货运')">
                    <i class="filter-icon huoyun-yjzxjx-light"></i>应急装卸机械
                  </el-checkbox>
                  <el-checkbox v-model="huoYunOther.sbss.shjxzy" style="margin-right: 10px" @change="filterLayers('货运')">
                    <i class="filter-icon huoyun-shjxzy-light"></i>社会机械资源
                  </el-checkbox>
                  <el-checkbox v-model="huoYunOther.sbss.wxhwblz" style="margin-right: 10px" @change="filterLayers('货运')">
                    <i class="filter-icon huoyun-wxhwblz-light"></i>危险货物办理站
                  </el-checkbox>
                  <el-checkbox v-model="huoYunOther.sbss.yfhwblz" @change="filterLayers('货运')">
                    <i class="filter-icon huoyun-yfhwblz-light"></i>易腐货物办理站
                  </el-checkbox>
                  <!-- <el-checkbox v-model="tuFangOther.sbss.gq" @change="filterLayers('土房_设备设施')"><i class="filter-icon tufang-sbss-gq"></i>工区</el-checkbox> -->
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '机务'" style="height: 100%; width: 250px">
            <div v-if="config.jw_cx.register" class="light-filter-area">
              <div class="light-filter-area-title">车型</div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="jiWuOther.jw_cx.jyc" @change="filterLayers('机务_车型')">
                  <i class="filter-icon jw-jw_cx_jyc"></i>
                  <span @click.prevent="handleCheckItemClick('救援列车')">救援列车</span>
                </el-checkbox>
                <el-checkbox v-model="jiWuOther.jw_cx.rbnrjc" @change="filterLayers('机务_车型')">
                  <i class="filter-icon jw-jw_cx_rbnrjc"></i>
                  <span @click.prevent="handleCheckItemClick('热备内燃机车')">热备内燃机车</span>
                </el-checkbox>
                <el-checkbox v-model="jiWuOther.jw_cx.rbdljc" @change="filterLayers('机务_车型')">
                  <i class="filter-icon jw-jw_cx_rbdljc"></i>
                  <span @click.prevent="handleCheckItemClick('热备电力机车')">热备电力机车</span>
                </el-checkbox>
                <el-checkbox v-model="showGraphs" disabled>
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span style="cursor: pointer" @click.prevent="handleCheckItemClick('机车参数')">机车参数</span>
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.jw_fw.register" class="light-filter-area">
              <div class="light-filter-area-title" @click.prevent="handleCheckItemClick('列车运行限制')">列车运行限制</div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="jiWuOther.jw_fw.bdz" style="margin-right: 10px" @change="filterLayers('机务_范围')">
                  <i class="filter-icon jw-jw_fw_bdz"></i>百吨闸瓦压力列车限速
                </el-checkbox>
                <br />
                <el-checkbox v-model="jiWuOther.jw_fw.jwcz" @change="filterLayers('机务_范围')">
                  <i class="filter-icon jw-jw_fw_jwcz"></i>机外大坡道特殊车站
                </el-checkbox>
                <!--								<el-checkbox v-model="jiWuOther.jw_fw.bdz" @change="filterLayers('机务_范围')"><i class="filter-icon jw-jw_fw_bdz"></i>百吨闸瓦压力列车限速</el-checkbox><br />-->
                <!--								<el-checkbox v-model="jiWuOther.jw_fw.jwcz" @change="filterLayers('机务_范围')"><i class="filter-icon jw-jw_fw_jwcz"></i>机外大坡道特殊车站</el-checkbox>-->
              </div>
            </div>
            <!--            <div v-if="config.jw_jy.register" class="light-filter-area">-->
            <!--              <div class="light-filter-area-title">救援起复设备</div>-->
            <!--              <div class="light-filter-area-content">-->
            <!--                <el-checkbox v-model="jiWuOther.jw_jy.jysb" @change="filterLayers('机务_救援')"><i-->
            <!--                  class="filter-icon jw-jw_jy_jysb"></i>救援设备-->
            <!--                </el-checkbox>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '土房'" style="height: 100%; width: 250px">
            <div class="light-filter-area">
              <div v-if="config.tf_sbss.register">
                <div class="light-filter-area-title">设备设施</div>
                <div class="light-filter-area-content">
                  <el-checkbox v-model="tuFangOther.sbss.shc" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-shc-light"></i>
                    <span @click.prevent="handleCheckItemClick('生活车')">生活车</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.yjcl" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-yjcl-light"></i>
                    <span>应急材料</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.wsjds" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-wsjds-light"></i>
                    <span @click.prevent="handleCheckItemClick('卫生监督所')">卫生监督所</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.jks" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-jks-light"></i>
                    <span @click.prevent="handleCheckItemClick('疾控所')">疾控所</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.scd" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon tufang-sbss-scd-light"></i>
                    <span @click.prevent="handleCheckItemClick('送餐点')">送餐点</span>
                  </el-checkbox>
                  <el-checkbox v-model="tuFangOther.sbss.gy" @change="filterLayers('土房_设备设施')">
                    <i class="filter-icon jw-jw_fw_gy-light"></i>
                    <span @click.prevent="handleCheckItemClick('公寓')">公寓</span>
                  </el-checkbox>
                  <br />
                  <!-- <el-checkbox v-model="tuFangOther.sbss.gq" @change="filterLayers('土房_设备设施')"><i class="filter-icon tufang-sbss-gq"></i>工区</el-checkbox> -->
                </div>
              </div>
              <div v-if="config.tf_fw.register">
                <div class="light-filter-area-title">范围</div>
                <div class="light-filter-area-content">
                  <!-- <el-checkbox v-model="tuFangOther.fw.cj" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-cj"></i>车间范围</el-checkbox>
                  <el-checkbox v-model="tuFangOther.fw.gq" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-gq"></i>工区范围</el-checkbox>-->
                  <!-- <el-checkbox v-model="tuFangOther.fw.d" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-d"></i>全部站</el-checkbox><br/> -->
                  <el-checkbox v-model="tuFangOther.fw.cqjzd" @change="filterLayers('土房_范围')">
                    <i class="filter-icon tufang-fw-d"></i>重庆建筑段
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="tuFangOther.fw.gyjzd" @change="filterLayers('土房_范围')">
                    <i class="filter-icon tufang-fw-d"></i>贵阳建筑段
                  </el-checkbox>
                  <br />
                  <!-- <el-checkbox v-model="tuFangOther.fw.dchtgs" @change="filterLayers('土房_范围')"><i class="filter-icon tufang-fw-d"></i>达成合铁公司</el-checkbox><br /> -->
                  <el-checkbox v-model="tuFangOther.fw.cdjzd" @change="filterLayers('土房_范围')">
                    <i class="filter-icon tufang-fw-d"></i>成都建筑段
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '供电'" style="height: 100%; width: 250px">
            <div class="light-filter-area">
              <div v-if="config.gd_sbss.register">
                <div class="light-filter-area-title">设备设施</div>
                <div class="light-filter-area-content">
                  <el-checkbox v-model="gongDianOther.gd_sbss.ck_gdb" @change="filterLayers('供电_设备设施')">
                    <i class="filter-icon gd-gdb-light"></i>
                    <span @click.prevent="handleCheckItemClick('供电臂')">供电臂</span>
                  </el-checkbox>

                  <el-checkbox v-model="gongDianOther.gd_sbss.ck_bds" @change="filterLayers('供电_设备设施')">
                    <i class="filter-icon gd-bds-light"></i>
                    <span @click.prevent="handleCheckItemClick('变电所')">变电所</span>
                  </el-checkbox>
                  <!-- <el-checkbox style="height: 5px;"  v-model="gongDianOther.gd_sbss.ck_dfx" @change="filterLayers('供电_设备设施')"><i class="filter-icon gd-dfx"></i>电分相</el-checkbox> -->
                  <!-- <el-checkbox v-model="gongDianOther.gd_sbss.ck_td" @change="filterLayers('供电_设备设施')"><i
										 class="filter-icon gd-td"></i>停电</el-checkbox>
									<el-checkbox v-model="gongDianOther.gd_sbss.ck_jjdd" @change="filterLayers('供电_设备设施')"><i
										 class="filter-icon gd-jjdd"></i>间接带电</el-checkbox>
									<el-checkbox v-model="gongDianOther.gd_sbss.ck_yl" @change="filterLayers('供电_设备设施')"><i
                  class="filter-icon gd-yl"></i>远离</el-checkbox>-->
                  <el-checkbox v-model="gongDianOther.gd_sbss.ck_yjdy" @change="filterLayers('供电_设备设施')">
                    <i class="filter-icon gd-yjdy-light"></i>
                    <span @click.prevent="handleCheckItemClick('应急电源')">应急电源</span>
                  </el-checkbox>
                  <br />
                  <el-checkbox v-model="gongDianOther.gd_sbss.ck_yjc" style="height: 5px;margin-right: 10px" @change="filterLayers('供电_设备设施')">
                    <i class="filter-icon gd-yjc-light"></i>
                    <span @click.prevent="handleCheckItemClick('供电轨道车')">供电轨道车</span>
                  </el-checkbox>
                  <br />
                  <el-select v-if="gongDianOther.gd_sbss.ck_yjc" size="mini" v-model="gongDianOther.ck_yjc" style="width: 160px;color: #000000;margin-top: 10px;" @change="filterLayers('供电_设备设施')" clearable>
                    <!-- <el-option  label="全部" key="全部" value="1"></el-option> -->
                    <el-option label="可用" key="可用" value="1"></el-option>
                  </el-select>
                  <!-- <el-checkbox v-model="gongDianOther.gd_fw.ck_wdq" @change="filterLayers('供电_范围')"><i class="filter-icon gd-wdqfw"></i>无电区</el-checkbox><br/> -->
                  <el-checkbox v-model="gongDianOther.gd_jcw.ck_fxjyq" style="height: 3px;margin-right: 10px" @change="filterLayers('供电_接触网')">
                    <i class="filter-icon gd-dfx-light"></i>
                    <span @click.prevent="handleCheckItemClick('电分相')">电分相</span>
                  </el-checkbox>
                  <br />

                  <el-autocomplete v-if="gongDianOther.gd_jcw.ck_fxjyq" v-model="gongDianOther.ck_dfxXb" :fetch-suggestions="querySearch" class="inline-input" placeholder="请选择线别" size="mini" style="width: 160px;margin-top: 10px;" value-key="NAME" @select="filterLayers('供电_接触网')">
                    <!-- <el-option v-for="(item) in lines" :label="item.NAME" :key="item.PKID" :value="item.PKID"></el-option> -->
                  </el-autocomplete>

                  <!-- 	<el-select v-if="gongDianOther.gd_jcw.ck_fxjyq" size="mini" v-model="gongDianOther.ck_dfxXb" style="width: 160px;color: #000000;margin-top: 10px;" @change="filterLayers('供电_接触网')" placeholder="请选择线别" >
										<el-option v-for="(item) in lines" :label="item.NAME" :key="item.PKID" :value="item.PKID"></el-option>
                  </el-select>-->
                  <!-- 	<el-checkbox v-model="gongDianOther.gd_jcw.ck_fxjyq" ><i
                  class="filter-icon-jcw gd-fxjyq"></i>电分相</el-checkbox><br />-->
                </div>
              </div>
              <!-- <div v-if="config.gd_jcw.register">
								<div class="light-filter-area-title">接触网设备设施</div>
								<div class="light-filter-area-content">
									<div class="group-body flex" style="height: 50px">
										<template>
											<el-button v-if="drawFlag" type="info" size="small" icon="el-icon-news" @click="changeDrawFlag(true, false)">取消框选</el-button>
											<el-button v-else type="primary" size="small" icon="el-icon-news" @click="changeDrawFlag(false)">框选范围</el-button>
										</template>
									</div>
									<el-checkbox v-model="gongDianOther.gd_jcw.ck_gz" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-gz"></i>钢柱</el-checkbox><br />
									<el-checkbox size="mini" v-model="gongDianOther.gd_jcw.ck_hntz" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-hntz"></i>混凝土柱</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_fjymdgj" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-fjymdgj"></i>非绝缘锚段关节</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_jymdgj" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-jymdgj"></i>绝缘锚段关节</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_fdjyq" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-fdjyq"></i>分段绝缘器</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_gddlj" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-gddlj"></i>股道电连接</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_ckkg" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-ckkg"></i>常开开关</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_cbkg" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-cbkg"></i>常闭开关</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_blq" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-blq"></i>避雷器</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_xsxwz" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-xsxwz"></i>吸上线位置</el-checkbox><br />
									<el-checkbox style="margin-right: 10px" v-model="gongDianOther.gd_jcw.ck_gjsdfx" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-fxjyq"></i>关节式电分相</el-checkbox><br />
									<el-checkbox v-model="gongDianOther.gd_jcw.ck_qjsdfx" @change="filterLayers('供电_接触网')"><i
										 class="filter-icon-jcw gd-fxjyq"></i>器件式电分相</el-checkbox>
              </div>-->
              <!-- </div> -->
              <div v-if="config.gd_fw.register">
                <div class="light-filter-area-title">管辖范围</div>
                <div class="light-filter-area-content">
                  <el-checkbox disabled>
                    <i class="filter-icon gw_fw_gwd"></i>
                    <span @click.prevent="handleOpenRangeGraph('供电')">供电段</span>
                  </el-checkbox>
                  <!--                  <el-checkbox v-model="gongDianOther.gd_fw.ck_gqgx" style="" @change="filterLayers('供电_范围')"><i-->
                  <!--                    class="filter-icon gd-gqgxfw"></i>供电工区-->
                  <!--                  </el-checkbox>-->
                  <!-- <el-checkbox style="height: 3px" v-model="gongDianOther.gd_sbss.ck_gdgq" @change="filterLayers('供电_设备设施')"><i
                  class="filter-icon gd-gdb"></i>供电工区</el-checkbox>-->
                  <!--                  <el-checkbox v-model="gongDianOther.gd_sbss.ck_cj" @change="filterLayers('供电_设备设施')"><i-->
                  <!--                    class="filter-icon gd-cj"></i>车间-->
                  <!--                  </el-checkbox>-->
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '基础'" style="height: 100%; width: 250px">
            <div v-if="config.qiaoSui.register" class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">桥隧</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="qiaoSuiOther.qiaoVisible" @change="filterLayers('桥隧')">
                  <i class="filter-icon qiaoliang"></i>
                  桥梁
                </el-checkbox>
                <el-checkbox v-model="qiaoSuiOther.suiVisible" @change="filterLayers('桥隧')">
                  <i class="filter-icon suidao"></i>
                  隧道
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.station.register" class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">车站</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="showAllStns" @change="handleShowAllStns">
                  <i class="filter-icon kezhan"></i>
                  <span>全部</span>
                </el-checkbox>
                <el-checkbox v-model="stationOther.boundK" @change="function(val) {showAllStns = false; stationOther.boundK = val; filterLayers('车站')}">
                  <i class="filter-icon kezhan"></i>
                  <span @click.prevent="handleCheckItemClick('客站')">客站</span>
                </el-checkbox>
                <el-checkbox v-model="stationOther.boundH" @change="function(val) {showAllStns = false; stationOther.boundH = val; filterLayers('车站')}">
                  <i class="filter-icon huozhan"></i>
                  <span @click.prevent="handleCheckItemClick('货站')">货站</span>
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.dk.register" class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">盯控</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="showVideoVR" @change="handleShowVideoVR">
                  <i class="filter-icon gd-bds"></i>
                  360°轨道视频
                </el-checkbox>
                <div style="width: 50px; height: auto"></div>
                <br />
                <el-checkbox v-model="config.dk.pic" @change="showUploadPic">
                  <i class="filter-icon gw_sb_ksd2"></i>
                  <span>现场图片</span>
                </el-checkbox>
                <el-select v-model="filterPic" :disabled="!config.dk.pic" size="mini" style="margin-left: 5px; width: 110px" @change="filterUploadPicLayer">
                  <el-option label="当天" value="1"></el-option>
                  <el-option label="三天内" value="3"></el-option>
                  <el-option label="一周内" value="7"></el-option>
                  <el-option label="半个月内" value="15"></el-option>
                </el-select>
                <el-button size="mini" type="primary" @click="jumpToUploadPicsReport">查看全部</el-button>
              </div>
            </div>
            <div v-if="config.train.register || config.dandang.register" class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">列车</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="trainOhter.dongche" @change="filterLayers('列车')">
                  <i class="filter-icon dongche"></i>
                  动车
                </el-checkbox>
                <el-checkbox v-model="trainOhter.puche" @change="filterLayers('列车')">
                  <i class="filter-icon puche"></i>
                  普客
                </el-checkbox>
                <el-checkbox v-model="trainOhter.huoche" @change="filterLayers('列车')">
                  <i class="filter-icon puche"></i>
                  货车
                </el-checkbox>
                <el-checkbox v-model="trainOhter.daozhan" @change="filterLayers('到站车')">
                  <i class="filter-icon dzc"></i>
                  终到车
                </el-checkbox>
                <el-checkbox v-if="config.dandang.register" v-model="trainOhter.dandang" @change="filterLayers('列车')">
                  <i class="filter-icon dandang"></i>
                  担当车
                </el-checkbox>
                <div v-show="trainOhter.dongche">
                  <div class="late-train-link" style="color: #656E77" @click="toolClick('openLate')">动车晚点</div>
                  <el-checkbox v-model="trainOhter.late_d1" label="5-120分钟" @change="filterLayers('列车')">
                    <i class="filter-late wd1"></i>
                    <span style="color: #656E77">5-120分</span>
                  </el-checkbox>
                  <el-checkbox v-model="trainOhter.late_d2" label="120-240分钟" @change="filterLayers('列车')">
                    <i class="filter-late wd2"></i>
                    <span style="color: #656E77">120-240分</span>
                  </el-checkbox>
                  <el-checkbox v-model="trainOhter.late_d3" label="240-360分钟" @change="filterLayers('列车')">
                    <i class="filter-late wd3"></i>
                    <span style="color: #656E77">240-360分</span>
                  </el-checkbox>
                  <el-checkbox v-model="trainOhter.late_d4" label="360分钟以上" @change="filterLayers('列车')">
                    <i class="filter-late wd4"></i>
                    <span style="color: #656E77">360分以上</span>
                  </el-checkbox>
                </div>
                <div v-show="trainOhter.puche">
                  <div class="late-train-link" style="color: #656E77" @click="toolClick('openLate')">普车晚点</div>
                  <el-checkbox v-model="trainOhter.late_p1" label="5-240分钟" @change="filterLayers('列车')">
                    <i class="filter-late wd1"></i>
                    <span style="color: #656E77">5-240分</span>
                  </el-checkbox>
                  <el-checkbox v-model="trainOhter.late_p2" label="240-480分钟" @change="filterLayers('列车')">
                    <i class="filter-late wd2"></i>
                    <span style="color: #656E77">240-480分</span>
                  </el-checkbox>
                  <el-checkbox v-model="trainOhter.late_p3" label="480-720分钟" @change="filterLayers('列车')">
                    <i class="filter-late wd3"></i>
                    <span style="color: #656E77">480-720分</span>
                  </el-checkbox>
                  <el-checkbox v-model="trainOhter.late_p4" label="720分钟以上" @change="filterLayers('列车')">
                    <i class="filter-late wd4"></i>
                    <span style="color: #656E77">720分以上</span>
                  </el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="config.boundRegion.register && config.boundRegion.region" class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">
                  区域
                  <i v-if="boundRegionOther.region.length > 0" class="el-icon-edit" style="margin-left: 10px; cursor: pointer" title="编辑区域" @click="boundRegionOther.quyuEdit = !boundRegionOther.quyuEdit"></i>
                </span>
              </div>
              <div class="light-filter-area-content">
                <template v-for="(qy, index) in boundRegionOther.region">
                  <span v-if="boundRegionOther.quyuEdit">
                    <el-input v-model="qy.REGION_NAME" size="mini" style="width: 200px"></el-input>
                    <i class="el-icon-circle-check" style="margin: 0 5px; cursor: pointer" title="保存" @click="handleSaveQuyu(qy, false)"></i>
                    <el-popconfirm title="确定删除此区域？" @onConfirm="handleDeletQuyu(qy, index)">
                      <i slot="reference" class="el-icon-delete" style="color: red; cursor: pointer" title="删除"></i>
                    </el-popconfirm>
                  </span>
                  <el-checkbox v-else v-model="qy.visible" :label="qy.REGION_NAME" @change="filterLayers('区域', qy)"></el-checkbox>
                </template>
              </div>
            </div>
            <div v-if="handleFlag" class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">操作</span>
              </div>
              <div class="light-filter-area-content">
                <el-button size="mini" type="primary" @click="hideMap">{{ mapVisible ? '隐藏地图' : '显示地图' }}</el-button>
                <el-button v-if="config.btns.ranging" icon="el-icon-news" size="mini" type="primary" @click="startRanging">开始测距</el-button>
                <template v-if="config.btns.drawRegion">
                  <el-button v-if="drawFlag" icon="el-icon-news" size="mini" type="info" @click="changeDrawFlag(true)">取消框选</el-button>
                  <el-button v-else icon="el-icon-news" size="mini" type="primary" @click="changeDrawFlag(false)">框选列车</el-button>
                </template>
                <template v-if="config.btns.task">
                  <el-button icon="el-icon-document" size="mini" type="primary" @click="toolClick('openTask')">指派任务</el-button>
                  <br />
                  <br />
                </template>
              </div>
              <div class="light-filter-area-content" style="height: 60px">
                <el-image v-if="config.btns.sendMsg" :src="msgPic" class="tool-img-btn" title="发送消息" @click="toolClick('openMsg')"></el-image>
                <el-image v-if="config.btns.jhtx" :src="vidioPic" class="tool-img-btn" title="聚合通信" @click="toolClick('openJhtx')"></el-image>
                <el-image v-if="config.btns.vedio" :src="vidioPic" class="tool-img-btn" title="音视频对讲" @click="toolClick('openXiaoYu')"></el-image>
                <el-image v-if="config.btns.phone" :src="phonePic" class="tool-img-btn" title="应急呼叫" @click="toolClick('openPhone')"></el-image>
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '灾害'" style="height: 100%; width: 250px">
            <div class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">天气</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="weatherOther.layerVisible" @change="filterLayers('天气')">
                  <i class="filter-icon tianqi"></i>
                  天气情况
                </el-checkbox>
                <el-checkbox v-model="weatherYJOther.layerVisible" @change="filterLayers('天气预警')">
                  <i class="filter-icon tianqi"></i>
                  天气预警
                </el-checkbox>
              </div>
            </div>
            <div v-if="config.earthquake.register" class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">地震</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="eqOther.layerVisible" style="margin-right: 10px" @change="filterLayers('地震')">
                  <i class="filter-icon dizhen"></i>
                  地震源
                </el-checkbox>
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '施工'" style="height: 100%; width: 250px">
            <div class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">计划</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="config.gw_jh.sg" @change="filterLayers('工务_施工计划')">
                  <i class="filter-icon gw_jh_sg_light"></i>
                  <span @click.prevent="handleCheckItemClick('施工计划')">施工计划</span>
                </el-checkbox>
                <el-checkbox v-model="config.gw_jh.wx" @change="filterLayers('工务_维修计划')">
                  <i class="filter-icon gw_jh_wx_light"></i>
                  <span @click.prevent="handleCheckItemClick('维修计划')">维修计划</span>
                </el-checkbox>
                <!--                <el-checkbox v-model="config.gw_jh.jg" @change="filterLayers('工务_监管计划')">-->
                <!--                  <i class="filter-icon gw_jh_jg_light"></i>-->
                <!--                  监管计划-->
                <!--                </el-checkbox>-->
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="panelLight.current === '电务'" style="height: 100%; width: 250px">
            <div class="light-filter-area">
              <div class="light-filter-area-title">
                <span style="color: white">管辖范围</span>
              </div>
              <div class="light-filter-area-content">
                <el-checkbox v-model="showGraphs" disabled>
                  <i class="filter-icon gw_fw_gwd"></i>
                  <span @click.prevent="handleOpenRangeGraph('电务')">电务段</span>
                </el-checkbox>

                <!--                <el-checkbox v-model="config.gw_jh.jg" @change="filterLayers('工务_监管计划')">-->
                <!--                  <i class="filter-icon gw_jh_jg_light"></i>-->
                <!--                  监管计划-->
                <!--                </el-checkbox>-->
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </el-collapse-transition>
    <!-- 在途车统计 -->
    <div v-if="config.train.register && !isLight && !hasCurrentEarthquake && (trainOhter.dongche || trainOhter.puche || trainOhter.huoche || trainOhter.daozhan)" :class="{ min: trainOhter.total_min }" :style="{ right: toolOpt.lateRight, bottom: toolOpt.lateBottom }" class="total-con" @click="trainOhter.total_min = !trainOhter.total_min">
      <i>统计</i>
      <div>
        <span>晚点车：</span>
        <label style="
						color: #DD2C0D;
						cursor: pointer;
						border-bottom: 2px solid #DD2C0D;
					" @click="toolClick('openLate')">
          {{
          trainOhter.dandang
          ? trainOhter.total_ddwd
          : trainOhter.total_wd
          }}
        </label>
      </div>
      <div v-if="config.dandang.register">
        <span>担当车：</span>
        <label style="color: #00AA00">{{ trainOhter.total_dd }}</label>
      </div>
      <div>
        <span>总列数：</span>
        <label style="color: #55FFFF">
          {{
          trainOhter.total_all
          }}
        </label>
      </div>
    </div>

    <div v-if="config.superMap.register && isLight && !hasCurrentEarthquake" class="light-general-search" @keyup.enter="globalFilterType !== 'dm' ? globalFilter('btn') : ''">
      <el-autocomplete v-model="globalFilterStr" :clearable="false" :fetch-suggestions="globalFilterSearch" :placeholder="globalFilterType==='cc'?'请输入车次':globalFilterType==='cz'?'请输入站名略码/站名':'请输入地名'" hide-loading size="mini">
        <el-select slot="prepend" v-model="globalFilterType" placeholder="请选择" style="width: 80px;">
          <el-option label="列车" value="cc"></el-option>
          <el-option label="车站" value="cz"></el-option>
          <el-option label="地名" value="dm"></el-option>
        </el-select>
        <i slot="append" class="el-icon-search" @click="globalFilter('btn')"></i>
        <template slot-scope="{ item }">
          <div v-if="globalFilterType==='cc'" class="name" @click="globalFilter(item)">{{ item.value }}</div>
          <div v-else-if="globalFilterType==='cz'" class="name" @click="globalFilter(item)">{{ item.STN_NAME }}</div>
          <div v-else-if="globalFilterType==='dm'" class="name" style="width: 400px" @click="globalFilter(item)">{{ item.name }}</div>
        </template>
      </el-autocomplete>
    </div>
    <!--		新增地震点 (亮版)-->
    <template v-if="config.earthquake.register && isLight && !hasCurrentEarthquake">
      <div class="light-earthquake-toolbar">
        <div class="toolbar-ops">
          <div :class="{'toolbar-btn-select': lightEarthToolbar.current !== '框选列车统计', 'toolbar-btn-select-enable': lightEarthToolbar.current === '框选列车统计'}" title="框选列车统计" @click="handleLightEarthquakeToolbarChange('框选列车统计')"></div>
          <div :class="{'toolbar-btn-upload': lightEarthToolbar.current !== '上传范围', 'toolbar-btn-upload-enable': lightEarthToolbar.current === '上传范围'}" title="上传范围" @click="handleLightEarthquakeToolbarChange('上传范围')"></div>
          <div :class="{'toolbar-btn-pointer': lightEarthToolbar.current !== '地震源输入', 'toolbar-btn-pointer-enable': lightEarthToolbar.current === '地震源输入'}" title="地震源输入" @click="handleLightEarthquakeToolbarChange('地震源输入')"></div>
        </div>
        <div class="toolbar-content">
          <div v-if="lightEarthToolbar.current === ''">
            <span style="color: #656E77">从右侧选择一项操作...</span>
          </div>
          <div v-if="lightEarthToolbar.current === '框选列车统计'">
            <span style="color: #656E77">在地图中用鼠标绘制范围...</span>
          </div>
          <div v-if="lightEarthToolbar.current === '上传范围' && eqOther.addFlag" class="light-upload-panel" style="display: flex; flex-direction: row">
            <span style="color: #656E77; margin-right: 5px">
              文件:
              <el-input v-model="eqUploader.filename" disabled size="mini" style="width: 200px"></el-input>
            </span>
            <el-upload ref="uploadL" :auto-upload="true" :before-upload="handleBeforeUpload" :data="uploadParams" :limit="1" :on-success="handleFileUploadSuccess" :show-file-list="false" action="https://10.192.6.233:19060/FileUpload/services/UploadFile">
              <el-button size="mini" type="primary">选择文件</el-button>
            </el-upload>
            <el-button :disabled="eqUploader.filename === ''" size="mini" style="margin-left: -5px" type="primary" @click="uploadEarthquake">导入</el-button>
          </div>
          <div v-if="lightEarthToolbar.current === '地震源输入' && eqOther.addFlag" class="light-pointer-panel" style="display: flex; flex-direction: row">
            <span style="color: #656E77">
              经度:
              <el-input v-model="eqCreater.srcLongitude" size="mini" style="width: 60px"></el-input>
            </span>
            <span style="color: #656E77; margin-left: 5px">
              纬度:
              <el-input v-model="eqCreater.srcLatitude" size="mini" style="width: 60px"></el-input>
            </span>
            <span style="color: #656E77; margin-left: 5px">
              等级:
              <el-input v-model="eqCreater.srcLevel" size="mini" style="width: 60px"></el-input>
            </span>
            <!--            <span style="color: #656E77; margin-left: 5px">地点: <el-input v-model="eqCreater.EQ_LOCATION" size="mini" style="width: 110px"></el-input></span>-->
            <el-button :disabled="
							eqCreater.srcLatitude === '' ||
							eqCreater.srcLongitude === '' ||
							eqCreater.srcLevel === ''
						" size="mini" style="margin-left: 5px" type="primary" @click="addEarthquake">输入信息</el-button>
          </div>
        </div>
      </div>
    </template>
    <!-- 新增地震点 -->
    <template v-if="config.earthquake.register && !isLight && !hasCurrentEarthquake">
      <div v-if="eqOther.addFlag" class="earthquake-toolbar-btn" @click="changeEarthquakeToolbar">
        <span style="margin-left: 5px">坐标拾取</span>
      </div>
      <!--      <div-->
      <!--        v-if="eqOther.addFlag"-->
      <!--        class="earthquake-upload-toolbar-btn"-->
      <!--        style="display: flex; justify-content: center"-->
      <!--        @click="changeEarthquakeUploadToolbar"-->
      <!--      >-->
      <!--        <span>选择范围</span>-->
      <!--      </div>-->
      <!-- <div class="earthquake-toolbar-btn" @click="eqOther.effectShow=!eqOther.effectShow">地震源输入</div> -->
      <div v-if="eqOther.addFlag" :class="{ show: eqOther.addShow }" class="earthquake-toolbar">
        <span class="earthquake-search-item">
          经度：
          <el-input v-model="eqCreater.srcLongitude" size="small" style="width: 160px"></el-input>
        </span>
        <span class="earthquake-search-item">
          纬度：
          <el-input v-model="eqCreater.srcLatitude" size="small" style="width: 160px"></el-input>
        </span>
        <!--        <span class="earthquake-search-item">-->
        <!--          等级：-->
        <!--          <el-input v-model="eqCreater.srcLevel" maxlength="3" size="small" style="width: 100px"></el-input>-->
        <!--        </span>-->
        <!--        <span class="earthquake-search-item">-->
        <!--          地点：-->
        <!--          <el-input v-model="eqCreater.EQ_LOCATION" size="small" style="width: 120px"></el-input>-->
        <!--        </span>-->
        <!--        <span class="earthquake-search-item">-->
        <!--          <el-button-->
        <!--            :disabled="-->
        <!--							eqCreater.srcLatitude === '' ||-->
        <!--							eqCreater.srcLongitude === '' ||-->
        <!--							eqCreater.srcLevel === ''-->
        <!--						"-->
        <!--            size="small"-->
        <!--            type="primary"-->
        <!--            @click="addEarthquake"-->
        <!--          >输入信息</el-button>-->
        <!--        </span>-->
        <!--        <span class="earthquake-search-item">-->
        <!--          <el-button size="small" type="text">录入历史</el-button>-->
        <!--        </span>-->
      </div>

      <div v-if="eqOther.addFlag" :class="{ show: eqOther.uploadShow }" class="earthquake-toolbar">
        <span class="earthquake-search-item">
          文件：
          <el-input v-model="eqUploader.filename" size="small" style="width: 160px"></el-input>
        </span>
        <span class="earthquake-search-item">
          <el-upload ref="upload" :auto-upload="true" :before-upload="handleBeforeUpload" :data="uploadParams" :limit="1" :on-success="handleFileUploadSuccess" :show-file-list="false" action="https://10.192.6.233:19060/FileUpload/services/UploadFile">
            <el-button size="mini" type="primary">选择文件</el-button>
          </el-upload>
        </span>
        <span class="earthquake-search-item">
          <el-button size="small" type="primary" @click="uploadEarthquake">导入</el-button>
        </span>
      </div>
    </template>
    <!-- 地震影响线路 -->
    <template v-if="config.earthquake.register && !hasCurrentEarthquake">
      <div :class="{ show: eqOther.effectShow }" class="earthquake-effect-line">
        <div class="tit shadow-txt">地震影响图示</div>
        <EarthquakeEffectLine v-if="eqOther.effectShow" :earthID="eqOther.curEarthId" :edit="eqOther.isNow" :effectFiled="eqOther.effectGlb" :effectLines="eqOther.effectLines" :lid="eqOther.effectLineId" :lno="eqOther.curEffectKey"></EarthquakeEffectLine>
      </div>
    </template>

    <!-- <template v-if="eqOther.addShow">
			<div class="earthquake-effect-line" :class="{'show':eqOther.effectShow}">
				<div class="tit shadow-txt">地震影响图示</div>
				<EarthquakeEffectLine></EarthquakeEffectLine>
			</div>
    </template>-->
    <!-- 列车右键菜单 -->
    <TrainContextMenu v-if="visibleTrainContextMenu" :cc="contextMenuData.TRAIN" :contextMenu="config.trainContextMenu" :style="trainContextMenuStyle" @callPer="voiceCall"></TrainContextMenu>
    <!-- 指派任务 -->
    <el-dialog :append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true" :lock-scroll="true" :visible.sync="taskVisible" title="指派任务" width="700px">
      <div style="height: 500px">
        <Task v-if="taskVisible" :selectedTrains="boxSelectedTrains" :trainList="allTrains"></Task>
      </div>
    </el-dialog>
    <!-- 发送消息 -->
    <el-dialog :append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true" :lock-scroll="true" :visible.sync="sendMsgVisible" title="发送消息" width="700px">
      <div style="height: 500px">
        <SendMsg v-if="sendMsgVisible" :selectedTrains="boxSelectedTrains" :trainList="allTrains"></SendMsg>
      </div>
    </el-dialog>
    <!-- 视频通话 -->
    <el-dialog :append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true" :lock-scroll="true" :visible.sync="visibleXiaoYu" title="音视频对讲" top="20px" width="80%">
      <div style="height: 800px">
        <iframe v-if="visibleXiaoYu" :src="xiaoYuUrl" height="100%" style="border: 0" width="100%"></iframe>
      </div>
    </el-dialog>
    <!-- 聚合通信 -->
    <el-dialog :append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true" :lock-scroll="true" :visible.sync="visibleJhtx" custom-class="mini-header-dialog" title="聚合通信" top="20px" width="80%">
      <div style="height: 800px">
        <iframe v-if="visibleJhtx" :src="JhtxUrl" height="100%" style="border: 0" width="100%"></iframe>
      </div>
    </el-dialog>
    <!-- 拨打电话组件 -->
    <template v-if="
				(config.btns.phone || config.trainContextMenu.phone) &&
				initGroupNo !== ''
			">
      <Call ref="call" :initGroupNo="initGroupNo" :initPosition="ipos" :prefix="prefix" :targetNumber="targetNumber" :visibleController="false" style="z-index: 9000"></Call>
    </template>
    <!-- 晚点信息 -->
    <el-dialog :append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true" :visible.sync="visibleLate" title="晚点信息" width="800px">
      <div style="height: 600px">
        <MapTrainLate v-if="visibleLate" :bounds="boundRegionOther.bounds" :dandang="trainOhter.dandang" :showdd="config.dandang.register" :trains="trainOhter.tarinData"></MapTrainLate>
      </div>
    </el-dialog>
    <!-- 区域编辑 -->
    <template v-if="config.boundRegion.region && boundRegionOther.formVisible">
      <RegionForm :formData="boundRegionOther.formQuYu" @cancel="changeDrawFlag(true)" @save="handleSaveQuyu"></RegionForm>
    </template>
    <!-- 列车作业信息窗口 -->
    <el-dialog :append-to-body="false" :close-on-click-modal="false" :visible.sync="trainDetailVisible" title="作业信息" top="3vh" width="1200px">
      <TrainDetail v-if="trainDetailVisible" :train="trainOhter.curTrain" @lczEvent="voiceCall"></TrainDetail>
    </el-dialog>
    <!-- 车站客运看板层 -->
    <div v-if="hspeedRailwayUrl" class="hspeed-railway-win">
      <div class="log"></div>
      <div class="close" @click="hspeedRailwayUrl = ''">
        <el-button icon="el-icon-close" size="small" type="danger">关闭</el-button>
      </div>
      <iframe :src="hspeedRailwayUrl" frameborder="0" style="height: 100%; width: 100%"></iframe>
    </div>
    <el-dialog v-el-drag-dialog :append-to-body="false" :close-on-click-modal="false" :visible.sync="statDialog.visible" title="框选列车统计" top="3vh" width="1100px" @close="clearDrawRegion">
      <TrainStat ref="stat" />
    </el-dialog>
    <el-dialog v-el-drag-dialog :append-to-body="false" :close-on-click-modal="false" :visible.sync="showUploadPics" title="查看图片" top="3vh" width="1100px">
      <pic-swiper :detail="uploadPics" />
    </el-dialog>
    <el-dialog :visible.sync="videoPlayer.visible" destroy-on-close title="视频" width="1200px" @close="videoPlayer.src=''">
      <iframe :src="videoPlayer.src" style="width: 100%;height: 800px;"></iframe>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog" destroy-on-close title="范围示意图" width="900px" @close="previewUrl=''">
      <iframe :src="previewUrl" style="width: 100%; height: 800px"></iframe>
    </el-dialog>
    <z-dialog :title="gwPxtDialog.title" :show.sync="gwPxtDialog.visible" z-dialog-ref="xxfaDialog" :is-footer="false">
      <div slot="body">
        <gwpxt :pxt="gwPxtDialog.pxt" style="height:900px" />
      </div>
    </z-dialog>
    <el-dialog :title="rangeGraphDialog.type" :visible.sync="rangeGraphDialog.visible" destroy-on-close width="1700px" @close="rangeGraphDialog.visible = false; rangeGraphDialog.graphs = []">
      <gwpxt :pxt="rangeGraphDialog.graphs" />
    </el-dialog>
    <el-dialog :title="panoramicVideo.videoTitle" :visible.sync="panoramicVideo.videoVisible" width="1000px">
      <iframe v-if="panoramicVideo.videoVisible" :src="panoramicVideo.videoSrc" style="width: 100%;height: 600px;"></iframe>
    </el-dialog>
    <el-dialog title="应急资源统计" :visible.sync="yjSrcDialog" destroy-on-close width="1850px" @close="clearDrawRegion">
      <emergency-sources />
    </el-dialog>
    <z-dialog :title="eqDialog.command" :show.sync="eqDialog.visible" z-dialog-ref="eqDialog" :is-footer="false">
      <div slot="body">
        <iframe :src="eqDialog.iframeSrc" v-if="
            eqDialog.visible &&
            eqDialog.command !== '影响列车统计' &&
            eqDialog.command !== '命令' &&
            eqDialog.command !== '高铁干线巡线方案' &&
            !eqDialog.command.includes('枢纽巡线方案')
          " :style="{
            height: '900px',
            width: '100%'
          }"></iframe>
        <eq-status v-if="eqDialog.command === '影响列车统计'" style="height: 900px" :data="eqDialog.dialogComponentParams.uploadStatus"></eq-status>
        <order-generator v-if="eqDialog.command === '命令'" style="height: 900px" :effect="eqDialog.dialogComponentParams.orderEffect" :earthquake="eqDialog.dialogComponentParams.orderEarthquake"></order-generator>
        <gwpxt style="height: 900px" v-if="eqDialog.command === '高铁干线巡线方案' || eqDialog.command.includes('枢纽巡线方案')" :pxt="eqDialog.dialogComponentParams.fileList" />
      </div>
    </z-dialog>
    <!--    <el-dialog-->
    <!--      :title="eqDialog.command"-->
    <!--      :visible.sync="eqDialog.visible"-->
    <!--      destroy-on-close-->
    <!--      width="1850px"-->
    <!--      custom-class="eqDialog"-->
    <!--    >-->
    <!--      <iframe-->
    <!--        :src="eqDialog.iframeSrc"-->
    <!--        v-if="eqDialog.visible && eqDialog.command !== '影响列车统计' && eqDialog.command !== '命令'"-->
    <!--        :style="{-->
    <!--        height: eqDialog.height,-->
    <!--        width: '100%'-->
    <!--      }"-->
    <!--      ></iframe>-->
    <!--      <eq-status v-if="eqDialog.command === '影响列车统计'" :data="eqDialog.dialogComponentParams.uploadStatus"></eq-status>-->
    <!--      <order-generator v-if="eqDialog.command === '命令'" :effect="eqDialog.dialogComponentParams.orderEffect" :earthquake="eqDialog.dialogComponentParams.orderEarthquake"></order-generator>-->
    <!--    </el-dialog>-->
    <div class="right-info-win" :class="{visible:rightInfoWin.visible}">
      <div class="close" @click="rightInfoWin.visible=false">
        <i class="el-icon-close"></i>
      </div>
      <div class="main">
        <GuiDaoCheList :source="guiDaoCheOther.list_gw"></GuiDaoCheList>
      </div>
    </div>
  </div>
</template>

<script>
// 这里引用各种资源
import elDragDialog from "@/directive/el-dragDialog";
import C from "../../assets/com.js";
import html2canvas from "html2canvas";
import config from "./js/config.js";
import mapUtil from "./js/mapUtil.js";
import ranging from "./js/ranging.js"; //测距
import drawRegion from "./js/drawRegion.js"; //画区域
import websoketMsg from "./js/websoketMsg.js"; //消息
import boundRegion from "./js/boundRegion.js"; //管界、区域
import stations from "./js/stations.js"; //车站
import weather from "./js/weather.js"; //天气
import weatherYJ from "./js/weatherYJ.js"; //天气预警
import qiaoSui from "./js/qiaoSui.js"; //桥遂
import train from "./js/train.js"; //在途车
import trainFly from "./js/trainFly.js"; //列车飞行图
import earthquake from "./js/earthquake.js"; //地震
import gongDian from "./js/gongDian.js"; //供电
import jiWu from "./js/jiWu.js"; //机务
import yunShu from "./js/yunShu.js"; //运输
import tuFang from "./js/tuFang.js"; //土房
import cheLiang from "./js/cheLiang.js"; //土房
import keYun from "./js/keYun.js"; // 客运
import video360 from "./js/video360.js"; //全景视频
import dianWu from "./js/dianWu.js";
import huoYunN from "./js/huoYunN.js";
import huoYun from "./js/huoYun.js"; //货运子系统
import jiaotong from "./js/jiaotong.js"; //交通
import houqing from "./js/houQing.js"; //后勤
import equipment from "./js/equipment.js"; //设备设施
import gongWu from "./js/gongWu.js"; //工务
import dk from "./js/dk.js";
import guiDaoChe from "./js/guiDaoChe.js"; //轨道车

import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import "echarts/lib/chart/line";
import "echarts/lib/chart/scatter";
import ecStat from "echarts-stat";

import EmergencySources from "./components/emergencySources/index.vue";
import TrainContextMenu from "./components/TrainContextMenu.vue"; //列车右键菜单
import Task from "./components/Task.vue"; //指派任务
import TrainStat from "./components/TrainStat";
import SendMsg from "./components/SendMsg.vue"; //发送消息
import Call from "liuzb-anycall"; //拨打电话
import MapTrainLate from "./components/MapTrainLate.vue"; //晚点车列表
import RegionForm from "./components/RegionForm.vue"; //区域编辑表单
import TrainDetail from "./components/TrainDetail.vue"; //列车详情
import EarthquakeEffectLine from "./components/EarthquakeEffectLine.vue"; //地震影响区段
import picSwiper from "@/views/showUploadPics/picSwiper.vue";
import com from "../../assets/com.js";
import previewPDF from "../../assets/pdfPreviewer.js";
import gwpxt from "../../views/gwPxt/gwPxt.vue";
import EarthquakeView from "@/components/map/components/EarthquakeView/EarthquakeView";
import GuiDaoCheList from "@/components/map/components/EarthquakeView/GuiDaoCheList"; //工务轨道车台账
import { faker } from "@faker-js/faker";
import yjSrcDic from "./js/yjSrcDic.js";

import policeCreateLayer from "./js/policeCreateLayer.js";
import EqStatus from "@/components/map/components/EqStatus";
import OrderGenerator from "@/views/earthquake/components/OrderGenerator/OrderGenerator.vue";
import eqObj from "@/components/map/js/earthquake"; // 警用系统
import ZDialog from "@/components/ZDialog";
import GaPanelLeft from "@/components/map/components/GaPanelLeft.vue"; // 公安面板
import GaPanelRight from "@/components/map/components/GaPanelRight.vue"; // 公安面板
import gongAnPcs from "./js/gongAnPcs";
import gongAnQita from "./js/gongAnQita"
import gongAnSelf from "./js/gongAnSelf"

export default {
  // 组件
  components: {
    OrderGenerator,
    EqStatus,
    GuiDaoCheList,
    EarthquakeView,
    Task,
    Call,
    SendMsg,
    RegionForm,
    TrainDetail,
    EarthquakeEffectLine,
    MapTrainLate,
    TrainContextMenu,
    TrainStat,
    cheLiang,
    picSwiper,
    gwpxt,
    video360,
    EmergencySources,
    ZDialog,
    GaPanelLeft,
    GaPanelRight
  },
  directives: {
    elDragDialog
  },
  // 数据仓库
  data() {
    return Object.assign(
      {
        lines: [], //线别字典
        msgStatu: false, //消息服务器连接状态
        ctrlFlag: false, //Ctrl键是否按下
        ownerStations: {}, //单位管辖车站(用于判断用户是否可从车站详情中查看客运看板)
        hspeedRailwayUrl: "", //客运看板地址
        hspeedRailwayUrlTemp: "", //客运看板地址临时
        //sip params
        targetNumber: "",
        prefix: "",
        initGroupNo: "", //1002',
        vc: false,
        ipos: "bottom",
        //sip params
        // ==============图层控制相关
        config: config,
        toolOpt: {
          width: "260px",
          height: "750px",
          left: "20px",
          bottom: "20px",
          lateBottom: "10px",
          lateRight: "840px"
        },
        // ==============图层控制相关
        rangingFlag: false, //是否正在测距
        drawFlag: false, //是否正在框选
        allTrains: [], //所有列车
        boxSelectedTrains: [], //框选的列车
        showVideoVR: false,
        showLineVideo: false,
        loading: null, //等待遮罩层
        detailMarker: null, //地图pop弹窗层
        //				1   2    3    4    5     6    7     8	  9		10	  11
        markerDiff: [
          "",
          6,
          2.5,
          1.6,
          1.1,
          0.9,
          0.55,
          0.42,
          0.3,
          0.22,
          0.11,
          0.055
        ], //桥隧、天气、预警、车信息marker向下偏移量
        visibleTrainContextMenu: false, //列车右键菜单
        trainContextMenuStyle: {}, //列车右键菜单位置
        globalFilterType: "cc", //全局搜索类型
        globalFilterStr: "", //全局搜索内容

        // 批派任务
        taskVisible: false,
        // 发送消息
        sendMsgVisible: false,
        // 单视频对讲(小鱼视频)
        visibleXiaoYu: false,
        xiaoYuUrl: "",
        // 聚合通信
        visibleJhtx: false,
        JhtxUrl: "",
        phonePic: require("./img/phone.png"), //语音通话
        vidioPic: require("./img/vidio.png"), //视频通话
        msgPic: require("./img/msg.png"), //发送消息
        intervalTrainInfo: null, //循环获取列车长的定时器
        // 晚点信息
        visibleLate: false,
        // 列车详情
        trainDetailVisible: false,
        // 图层控制面板
        handlePanelClass: "",
        curTab: "基础",
        // 公共iframe弹窗口
        dialog: {
          visible: false,
          width: 1700,
          height: 860,
          title: "窗口",
          src: "",
          selectedIndex: 0
        },
        statDialog: {
          visible: false,
          statData: []
        },
        phoneLocationNotify: null,
        uploadParams: {
          code: "upFile", // upFile
          system: "NOFFI_XX", // 上传的系统
          per: "UserName", // 上传人
          author: "['10.298.220.126','ALLAuthor6FGW','all@32899@FGW']",
          folder: "RPMS", // 图片文件夹
          fileNameType: 5 // 文件名称
        },
        hy_lntjqxjx: false,
        filterQxjx: "",
        filterKsd: "",
        filterPic: "0",
        showUploadPics: false,
        uploadPics: {},
        panelLight: {
          display: false,
          x: 0,
          current: ""
        },
        lightEarthToolbar: {
          current: ""
        },
        panel: {
          hide: true
        },
        mapVisible: true,
        lightOverride: false,
        videoPlayer: {
          visible: false,
          src: "http://10.192.6.110:9090/JFLCMS/vueYTH/#/videoVR?videoSrc="
        },
        previewUrl: "",
        previewDialog: false,
        showAllStns: false,
        showGraphs: false,
        gwPxtDialog: {
          visible: false,
          pxt: [],
          title: ""
        },
        rangeGraphDialog: {
          visible: false,
          graphs: [],
          type: ""
        },

        // 警用
        darkPanelHideLeft: false,
        darkPanelHideRight: false,
        gaLargeCategory: [],
        gaSmallCategory: [],
        gaFilterStr: "",
        gaFilterStr2: "",
        gaLargeType: "",
        gaLargeCode: "",
        timeout: null,
        sliderScale: 1,
        // sliderScale: this.config.superMap.zoom,
        gaFirstChoise: "", // 第一个候选项，enter之后直接选中
        gaSearchResults: [],
        gaAreaMenu: [
          {
            ID: "ALL",
            GaAreaName: "全部公安处",
            // center: [30.80871610603349, 104.10672769022798]
            center: [29.879568388334146, 103.05204011697964]
          },
          {
            ID: "CD",
            GaAreaName: "成都公安处",
            center: [31.872134309166395, 102.61258696145948]
          },
          {
            ID: "CQ",
            GaAreaName: "重庆公安处",
            center: [29.38299210083473, 105.22733323680436]
          },
          {
            ID: "GY",
            GaAreaName: "贵阳公安处",
            // center: [26.834711007897468, 107.00711851666094]
            center: [26.785684212278458, 106.79471615815955]
          },
          {
            ID: "XC",
            GaAreaName: "西昌公安处",
            center: [29.37341860856299, 101.98636621484327]
          }
        ],
        curMenu: {
          ID: "ALL",
          GaAreaName: "全部公安处",
          center: [30.80871610603349, 104.10672769022798]
        },
        curGaArea: "ALL",
        window: window,
        gaSearchType: "",
        gaPanelType: "gac", // 公安处gac或者派出所pcs
        policeDetail: {}, //当前选中的派出所
        isGaBridge: false, // 是否是警用系统的桥梁弹框

        filterGwGdc: "全部",
        isPolice: window.location.pathname.includes("/police.html"),
        showGddRange: [], //供电-范围
        showGwdRange: [], //工务-范围
        showDwdRange: [], //电务-范围
        showYsRange: false,
        yunshuSelectedUnits: [],
        yunshuSelectUnitList: [],
        yunshuCurrentHighLightStations: [],
        railwayMarkers: null,
        yjDrawRegionPts: [],
        yjSrcSources: {},
        yjSrcDialog: false,
        // 右侧详细信息窗口 ---start
        rightInfoWin: {
          visible: false
        },
        eqDialog: {
          command: "",
          iframeSrc: "",
          visible: false,
          height: "800px",
          dialogComponentParams: {
            uploadStatus: null,
            orderEffect: null,
            orderEarthquake: null,
            fileList: []
          }
        }
        // 右侧详细信息窗口 ---end
      },

      stations.data, //注入车站数据仓库
      boundRegion.data, //注入管界、区域数据仓库
      weather.data, //注入天气数据仓库
      weatherYJ.data, //注入气数预警据仓库
      qiaoSui.data, //注入桥遂数据仓库
      train.data, //注入列车数据仓库
      trainFly.data, //注入列车飞行图数据仓库
      earthquake.data, //注入地震数据仓库
      gongDian.data, //注入供电数据仓库
      jiWu.data, //注入机务数据仓库
      yunShu.data, //注入运输数据仓库
      tuFang.data, //注入土房数据仓库
      cheLiang.data,
      jiaotong.data, //注入交通数据仓库
      houqing.data, //注入后勤数据仓库
      equipment.data, //注入设备设施数据仓库
      gongWu.data,
      dianWu.data,
      // dk.data,
      huoYun.data, //注入货运子系统数据仓库
      video360.data,
      keYun.data,
      huoYunN.data,
      guiDaoChe.data //注入轨道车数据仓库
    );
  },
  // 属性
  props: {
    // 所属系统，用于加载对应系统地图配置
    // kyd:客运段安全生产调度指挥中心
    // kyz:客运站安全生产调度指挥中心
    // kygl:客运管理(对外)
    // yjxy:应急响应指挥中心
    sys: {
      type: String,
      default: "kyd"
    },
    // 单位id
    oid: {
      type: String,
      default: function () {
        return "19B8C3534E125665E0539106C00A58FD"; //成都车站
        // return this.$store.state.params.Oid
      }
    },
    // 单位
    oname: {
      type: String,
      default: "成都客运段"
    },
    // 工具面板位置
    toolsConfig: {
      type: Object,
      default: function () {
        return {
          width: "260px",
          height: "750px",
          left: "20px",
          bottom: "20px"
        };
      }
    },
    // 地图配置
    mapConfig: {
      type: Object,
      default: function () {
        return {
          center: "", //中心点  "29.9532539232503, 104.449862462555"
          zoom: "" //初始层级
        };
      }
    },
    // 是否白版地图
    lightSkin: {
      type: Boolean,
      default: false
    }
  },
  // 计算属性
  computed: {
    // 是否有操作子面板
    handleFlag() {
      const c = this.config;
      return (
        c.btns.drawRegionCount ||
        c.btns.drawRegion ||
        c.btns.task ||
        c.btns.sendMsg ||
        c.btns.vedio ||
        c.btns.phone ||
        c.btns.ranging
      );
    },
    // 是否只有一个面板
    singleTab() {
      let tabCounts = 0;
      const c = this.config;
      c.controller.base && tabCounts++;
      c.controller.gongDian && tabCounts++;
      c.controller.gongWu && tabCounts++;
      c.controller.dianWu && tabCounts++;
      c.controller.jiWu && tabCounts++;
      c.controller.yunShu && tabCounts++;
      c.controller.cheLiang && tabCounts++;
      c.controller.tuFang && tabCounts++;

      c.controller.houQing && tabCounts++;
      c.controller.zaiHai && tabCounts++;
      c.controller.jiaotong && tabCounts++;
      c.controller.huoYun && tabCounts++;
      return tabCounts === 1;
    },

    username() {
      return (
        this.$store.state.params.Oname +
        " (" +
        this.$store.state.params.UserName +
        ")"
      );
    },
    isLight() {
      if (this.config.superMap.lightMode === undefined) {
        return false;
      } else {
        return this.config.superMap.lightMode;
      }
    },
    hasCurrentEarthquake() {
      if (
        JSON.stringify(this.$store.state.earthquake.currentEarthquake) !== "{}"
      ) {
        if (this.$store.state.earthquake.hidePanelOverRide) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    nowEqs() {
      return this.$store.state.earthquake.eqList;
    }
  },
  // 组件挂载完毕
  mounted() {
    this.toolOpt = Object.assign({}, this.toolOpt, this.toolsConfig);
    const winH = document.body.offsetHeight;
    if (winH - this.toolOpt.height.replace("px", "") < 160) {
      this.toolOpt.height = winH - 160 + "px";
    }
    console.log("POLICE", this.isPolice);
    if (this.isPolice) {
      this.darkPanelHideLeft = false;
      this.darkPanelHideRight = false;
    } else {
      this.darkPanelHide = false;
    }
    // 鼠标点击时，将自定义右键菜单关闭
    document.body.addEventListener("click", () => {
      this.visibleTrainContextMenu = false;
    });
    // this.loading = this.$loading({
    // 	lock: true,
    // 	text: '正在加载地图数据...',
    // 	spinner: 'el-icon-loading',
    // 	background: 'rgba(0,0,0,0.7)',
    // 	customClass: 'loading'
    // });
    this.getMapConfig(() => {
      const _this = this;
      // console.log(this.config, this.config.superMap.darkMode);
      this.getPhoneGroupNo(); //获取个人软电话号码
      try {
        this.getOwnerStations(this.oid.toUpperCase()); //获取单位管辖站
      } catch (e) {
        //TODO handle the exception
      }

      this.getLines();
      if (this.sys != "police") {
        this.initYjEvents();
      } else {
        console.log("111111")
        this.loadLargeData();
        this.sliderScale = parseInt(this.config.superMap.zoom);
        this.config.superMap.zoomGA = this.config.superMap.zoom;
      }
      mapUtil.init(this); // 实例化地图
      // console.log("实例化地图的this，$vm", this);

      if (this.isPolice) {
        // this.gaFilterSearch(); // 获取公安搜索类型
        console.log("默认公安管界", this.curGaArea)
        this.changeGaArea(this.curGaArea); //默认公安管界
      } else {
        ranging.init(this); //初始化测距功能
        drawRegion.init(this); //初始化框选区域功能
        this.lightOverride = this.isLight;
      }


      console.log("注入所有脚本")
      this.injectionScript(); // 注入所有脚本
      // console.log(this.yunshuUnitList)
      // 实例化消息
      websoketMsg.init({
        onmessage: (type, msg) => {
          if (type === "train") {
            train.messageArrive(msg);
          } else if (type === "earthquake") {
            earthquake.messageArrive(msg);
          } else if (type === "earthquake_phone") {
            if (_this.sys === "yjxy") {
              earthquake.handlePhoneUploadLocation(msg);
              _this.$emit("phoneUploadLocation");
            }
          } else if (type === "earthquake_phone_callin") {
            if (_this.sys === "yjxy") {
              earthquake.handlePhoneCallIn(msg);
              _this.$emit("phoneCallIn");
            }
          } else if (type === "yj_event_push") {
            if (_this.sys === "yjxy") {
              // 处理应急响应推送
              _this.handleYjEventPush(msg);
            }
          } else if (type === "earthquake_update") {
            if (_this.sys === "yjxy") {
              // _this.handleEarthquakeInfoUpdate( msg );
            }
          } else if (type === "earthquake_line_train_update") {
            if (_this.sys === "yjxy") {
              _this.handleEartquakeUpdateLineTrainPlans(msg);
            }
          } else if (type === "earthquake_report_update") {
            if (_this.sys === "yjxy") {
              _this.handleEarthquakeReportsUpdate();
            }
          }
        },
        onopen: () => {
          this.msgStatu = true;
        },
        onclose: () => {
          this.msgStatu = false;
        }
      });
    });
  },
  // 方法
  methods: {
    openJsGz() {
      // let targetUrl = 'http://10.3.102.111/cdyj/cdCas/authenticate?Control=1111&UserEncode=31A3E6DC372543FB8B1FB69603E7DEFF&UserName=%E9%99%88%E4%BF%90%E4%BC%B6&UserPID=513922199009243326&idCard=513922199009243326&idCardString=513922199009243326&idcard=513922199009243326&Oid=99990002001499A50004&Oname=%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E6%89%80&DepId=99990002001499A50004000A&DepName=%E7%A0%94%E5%8F%91%E4%B8%80%E5%AE%A4&UserMType=%E8%BF%90%E8%BE%93%E9%83%A8%E9%AB%98%E8%B4%A8%E7%BC%96%E7%BB%84%E5%AE%A1%E6%A0%B8,%E5%BA%94%E6%80%A5%E7%B3%BB%E7%BB%9F%E7%AE%A1%E7%90%86%E5%91%98&UserType=1&UserID=453FCDE828646998E0534720C00AC819&UserGW=&UserLevel=%E5%89%AF%E7%A7%91%E7%BA%A7&OnameFull=%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E6%89%80&Osystem=%E7%BB%BC%E5%90%88&Otype=0&Olevel=&StnCode=&CWCode=&ZJCode=&Deptype=4&ManagerType=&UserPosition=%E5%89%AF%E4%B8%BB%E4%BB%BB&Org_id=&UserTel=13618081295&UserBgTel=061-32005&MessageID=M092716145578&HashVersion=0.bb93c21449daa&Positionlevel=%E5%89%AF%E7%A7%91%E7%BA%A7&userpid=513922199009243326'
      // window.open(decodeURI(targetUrl), '_blank')
      window.open(
        "http://10.192.32.119:8889/remoteView?type=technologyRegulationSearch&idCardString=1dd1528b71dcd9be8056e8077eaa66bed88dc81725a9cf5b773d84e820cb9393ed3d8236ba9cfc4c"
      );
    },
    openXxfa() {
      // previewPDF.getPDFPreviewBlob('https://10.192.6.233:19090/group3/20220927/data/20220927-%E6%88%90%E9%83%BD%E5%92%8C%E9%87%8D%E5%BA%86%E6%9E%A2%E7%BA%BD%E5%9C%B0%E9%9C%87%E5%B7%A1%E7%BA%BF%E6%96%B9%E6%A1%88.pdf').then((url) => {
      //   this.gwPxtDialog.title = '枢纽巡线方案'
      //   this.gwPxtDialog.pxt = [{
      //     FILE_URL: 'https://10.192.6.233:19090/group3/20220927/data/20220927-%E6%88%90%E9%83%BD%E5%92%8C%E9%87%8D%E5%BA%86%E6%9E%A2%E7%BA%BD%E5%9C%B0%E9%9C%87%E5%B7%A1%E7%BA%BF%E6%96%B9%E6%A1%88.pdf'
      //   }]
      //   this.gePxtDialog.visible: true
      //   // window.open(url)
      // })
      this.gwPxtDialog.title = "枢纽巡线方案";
      this.gwPxtDialog.pxt = [
        {
          FILE_URL:
            "https://10.192.6.233:19090/group3/20220927/data/20220927-%E6%88%90%E9%83%BD%E5%92%8C%E9%87%8D%E5%BA%86%E6%9E%A2%E7%BA%BD%E5%9C%B0%E9%9C%87%E5%B7%A1%E7%BA%BF%E6%96%B9%E6%A1%88.pdf",
          FILE_NAME: "20220927-成都和重庆枢纽地震巡线方案.pdf"
        }
      ];
      this.gwPxtDialog.visible = true;
      // window.open(url)
    },
    handleHighLightStations() {
      let currentSelectedUnits = JSON.parse(
        JSON.stringify(this.yunshuSelectedUnits)
      );
      console.log(
        "高亮运输管辖范围站点",
        currentSelectedUnits,
        this.config.station.register
      );
      // if (!this.config.station.register || !this.showAllStns) {
      //   console.log( "未注册车站模块" );
      //   // 如果没有注册基础模块，先获取车站数据
      //   this.config.station.register = true;
      //   this.showAllStns = true;
      //   this.handleShowAllStns( true );
      //   this.handleShowAllStns(false)
      // }
      let getHighLightStationsPromises = [];
      currentSelectedUnits.map(unitname => {
        getHighLightStationsPromises.push(
          new Promise((resolve, reject) => {
            C.getDataP123(
              {
                c: "eqeh_zxy2003",
                s: [
                  {
                    DEPOT: unitname
                  }
                ],
                url: "https://10.192.126.203/GeneralProServlet"
              },
              res => {
                try {
                  let targets = res["1"].filter(s => {
                    return s.HIGHLIGHT_FLAG == 1;
                  });
                  resolve(targets);
                } catch (e) {
                  reject(e);
                }
              }
            );
          })
        );
      });
      Promise.all(getHighLightStationsPromises).then(highlightStations => {
        const _this = this;
        this.$nextTick(() => {
          let targetStations = [];
          highlightStations.map(s => {
            s.map(ss => {
              let color = this.yunshuSelectUnitList.find(su => {
                return su.UNIT === ss.DEPOT;
              }).COLOR;
              ss.COLOR = color;
              targetStations.push(ss);
            });
          });
          console.log(targetStations);
          _this.yunshuCurrentHighLightStations = JSON.parse(
            JSON.stringify(targetStations)
          );
          stations.createStationsWithColor(
            _this.yunshuCurrentHighLightStations
          );
          // _this.highlightStations()
        });
      });
    },
    handleEqCommand(op = "", eq = {}) {
      let userParams = this.generateUserParams();
      switch (op) {
        case "REPORT":
          {
            this.eqDialog.command = "速报";
            const url = this.$router.resolve({
              path: "/ExportReport"
            });
            this.eqDialog.iframeSrc = `${url.href}?id=${eq.EQ_ID}`;
            // this.eqDialog.iframeSrc = 'https://10.192.126.27/eqeh/#/ExportReport'
          }
          break;
        case "IMPORT":
          {
            this.eqDialog.command = "地震导入";
            this.eqDialog.iframeSrc = `https://10.192.126.27/hqbz/#/earthquakeReport?${userParams}`;
            this.eqDialog.height = "900px";
          }
          break;
        case "INFO":
          {
            this.eqDialog.command = "信息通报";
            this.eqDialog.iframeSrc = `https://10.192.126.27/hqbz/#/czxxsb?${userParams}&eid=${eq.EQ_ID}`;
            this.eqDialog.height = "900px";
          }
          break;
        case "PLANS":
          {
            this.eqDialog.command = "巡线方案上报";
            this.eqDialog.iframeSrc = `https://10.192.126.27/hqbz/#/patrolPlanReport?${userParams}&eid=${eq.EQ_ID}`;
            this.eqDialog.height = "900px";
          }
          break;
        case "DIAGRAM":
          {
            this.eqDialog.command = "影响范围示意图";
            const url = this.$router.resolve({
              path: "/EarthquakeEffectDiagram"
            });
            this.eqDialog.iframeSrc = `${url.href}?id=${eq.EQ_ID}`;
            this.eqDialog.height = "900px";
            // this.eqDialog.iframeSrc = 'https://10.192.126.27/eqeh/#/ExportReport'
          }
          break;
        case "FORM":
          {
            this.eqDialog.command = "影响列车统计";
            // const _this = this
            let loading = this.$loading({
              lock: true,
              text: "正在获取影响列车信息...",
              spinner: "el-icon-loading",
              background: "rgba(0,0,0,0.7)",
              customClass: "loading"
            });
            C.getDataP123(
              {
                c: "eqeh_zxy2024",
                s: [[eq.EQ_ID]],
                url: "https://10.192.126.203/GeneralProServlet" //接口地址
              },
              res => {
                if (res["1"].length !== 0) {
                  this.eqDialog.dialogComponentParams.uploadStatus = res["1"];
                  loading.close();
                  // this.uploadStatus = true;
                }
              }
            );
          }
          break;
        case "CMD":
          {
            this.eqDialog.command = "命令";
            let loading = this.$loading({
              lock: true,
              text: "正在加列车数据...",
              spinner: "el-icon-loading",
              background: "rgba(0,0,0,0.7)",
              customClass: "loading"
            });
            this.getEarthquakeEffect(eq).then(effect => {
              this.eqDialog.dialogComponentParams.orderEarthquake = eq;
              this.eqDialog.dialogComponentParams.orderEffect = effect;
              loading.close();
            });
          }
          break;
        case "GX_PLAN":
          {
            this.eqDialog.command = "高铁干线巡线方案";
            let fileList = [
              {
                FILE_URL:
                  "http://10.192.6.233:9090/group3/20221102/data/高铁干线巡线方案.pdf",
                FILE_NAME: "高铁干线巡线方案.pdf"
              }
            ];
            this.eqDialog.dialogComponentParams.fileList = fileList;
            this.eqDialog.height = "900px";
          }
          break;
        case "SN_PLAN":
          {
            this.eqDialog.command = `枢纽巡线方案-${eq}`;
            let fileList = [
              {
                FILE_URL: `http://10.192.6.233:9090/group3/20221102/data/${eq}枢纽巡线方案.pdf`,
                FILE_NAME: `${eq}枢纽巡线方案.pdf`
              }
            ];
            this.eqDialog.dialogComponentParams.fileList = fileList;
            this.eqDialog.height = "900px";
          }
          break;
      }
      this.eqDialog.visible = true;
    },
    getEarthquakeEffect(row) {
      return new Promise((resolve, reject) => {
        console.log("影响范围", row.IMPORT_TYPE);
        // earthquake.updateEarthquakeEffects(row)
        if (row.IMPORT_TYPE == "0") {
          C.getDataP123(
            {
              s: [[row.EQ_ID]],
              c: "eqeh_zxy2008",
              a: "【eqeh_zxy2008】获取地震影响范围",
              url: "https://10.192.126.203/GeneralProServlet", //接口地址
              async: true
            },
            r => {
              console.log(r);
              if (r && r["1"][0].EQ_INFLUENCE !== "") {
                const source = JSON.parse(r["1"][0].EQ_INFLUENCE);
                const effectD = [];
                source.forEach((row, index) => {
                  if (row.RECOVERY === 0) {
                    const d = row.DATA["1"]; //影响线路
                    row.seq = row.NO;
                    row.glbS = d[0];
                    row.glbTextS = d[0].LINE_KM_DIS;
                    row.glbE = d[1];
                    row.glbTextE = d[1].LINE_KM_DIS;
                    if (this.earthquakeNowFlag) {
                      row.jdq =
                        row.LEVEL === "1"
                          ? row.DATA["2"].filter(j => j.RECOVERY === "0")
                          : []; //继电器
                    } else {
                      row.jdq = row.DATA["2"]; //继电器(历史，则所有都看)
                    }
                    row.clickable = true;
                    effectD.push(row);
                  }
                });
                resolve(effectD);
                // this.effectData = effectD;
              } else {
                resolve([]);
              }
            }
          );
        } else if (row.IMPORT_TYPE == "1") {
          console.log("获取文件导入地震影响区段数据");
          C.getDataP123(
            {
              s: [[row.EQ_ID]],
              c: "eqeh_zxy2023",
              url: "https://10.192.34.79/ky203/GeneralProServlet", //接口地址
              async: true
            },
            r => {
              if (r["1"].length === 0) {
                resolve([]);
              } else {
                const source = r["1"];
                let effectD = [];
                console.log("获取影响范围", source);
                source.map(s => {
                  s.seq = "";
                  s.glbS = "";
                  s.glbTextS = s["O_KM"];
                  s.glbTextE = s["E_KM"];
                  s.glbE = "";
                  s.jdq = [];
                  s["LINE_NAME"] = s["L_NAME"];
                  s["clickable"] = false;
                  effectD.push(s);
                });
                resolve(effectD);
                // this.effectData = effectD;
              }
            }
          );
        }
      });
    },
    highlightStations() {
      let targetStations = this.yunshuCurrentHighLightStations;

      console.log("需高亮车站", targetStations);
      console.log("全部车站marker");
      // stations.creatStation(targetStations)
      if (targetStations.length === 0) {
        return;
      }
      targetStations.map(station => {
        let color = this.yunshuSelectUnitList.find(s => {
          return s.UNIT === station.DEPOT;
        }).COLOR;
        let background = $("#station_" + station.STN_CODE).css(
          "background-image"
        );
        console.log(background);
        // $('#station_' + station.STN_CODE).css('background-image', 'none')
        $("#station_" + station.STN_CODE).attr("style", function () {
          let style = $("#station_" + station.STN_CODE).attr("style");
          return (
            style +
            `; background-image: ${background.split(", ")[0]
            }, linear-gradient(${color}, ${color})`
          );
        });
      });
      // setTimeout( () => {
      //   // console.log($('.station-icon-station-name'))
      //
      //   // console.log(allStations)
      // }, 100 )
    },
    handleShowYsUnitList(newVal) {
      let colorDic = [
        "AF847E",
        "CA5DF8",
        "25C045",
        "ABCC8E",
        "F8A472",
        "738CD3",
        "5FB4D1",
        "EEE7B4",
        "61C8AC",
        "FE91A1",
        "CAE4E4",
        "88918A",
        "B37F9E",
        "FF00C7",
        "FDC50C",
        "FEC7EB",
        "F9FF00",
        "D2BE8B",
        "AA94AF",
        "B3CAE9",
        "4CBAB3",
        "897FF6",
        "F9563E",
        "C487C8",
        "E3588F",
        "B9850E",
        "18B2EF",
        "F9E0AE",
        "DDC2EC",
        "E3A15F",
        "81F5E4",
        "DBED52",
        "E8AD97"
      ];
      if (newVal) {
        com.getDataP123(
          {
            c: "tyzd_zxy2015",
            s: [
              {
                system: "车务"
              }
            ],
            url: "https://10.192.126.203/GeneralProServlet"
          },
          res => {
            let unitList = JSON.parse(JSON.stringify(res["2"]));
            // let usedColor = []
            unitList.map((unit, index) => {
              // let randomColor = faker.color.rgb()
              unit.COLOR = "#" + colorDic[index];
            });
            this.yunshuSelectUnitList = JSON.parse(
              JSON.stringify(
                unitList.filter(u => {
                  return u.UNIT.includes("车");
                })
              )
            );
          }
        );
      }
    },
    handleEarthquakeReportsUpdate() {
      if (
        JSON.stringify(this.$store.state.earthquake.currentEarthquake) !==
        "{}" &&
        !this.$store.state.earthquake.hidePanelOverRide
      ) {
        // console.log('接收到地震大屏数据更新')
        com.getData(
          {
            c: "eqeh_zxy2056",
            s: [
              {
                E_ID: this.$store.state.earthquake.currentEarthquake.EQ_ID
              }
            ],
            url: "https://10.192.126.203/GeneralProServlet"
          },
          reports => {
            this.$store.commit("earthquake/updateReports", reports.data);
          }
        );
      }
    },
    handleEarthquakeInfoUpdate() {
      if (
        JSON.stringify(this.$store.state.earthquake.currentEarthquake) !==
        "{}" &&
        !this.$store.state.earthquake.hidePanelOverRide
      ) {
        // console.log('接收到地震大屏数据更新')
        this.$store.commit("earthquake/updateCount");
      }
    },
    handleEartquakeUpdateLineTrainPlans() {
      if (
        JSON.stringify(this.$store.state.earthquake.currentEarthquake) !==
        "{}" &&
        !this.$store.state.earthquake.hidePanelOverRide
      ) {
        com.getData(
          {
            c: "eqeh_zxy2057",
            s: [
              {
                DDT: "all",
                E_ID: this.$store.state.earthquake.currentEarthquake.EQ_ID
              }
            ],
            url: "https://10.192.126.203/GeneralProServlet"
          },
          res => {
            this.$store.commit(
              "earthquake/updateLineTrainPlans",
              res.data["1"]
            );
          }
        );
      }
    },
    /**
     * 获取正在发生的应急响应事件
     */
    initYjEvents() {
      C.getDataP123(
        {
          c: "eqeh_zxy2049",
          url: C.ADDS.servGS //接口地址
        },
        res => {
          console.log("获取进行中的应急响应", res["1"]);
          this.$store.commit("yjEventPush/initEvents", res["1"]);
        }
      );
    },
    /**
     * 处理应急响应推送
     */
    handleYjEventPush(msg) {
      let msgBody = JSON.parse(msg.messageData);
      this.$store.commit("yjEventPush/updateEvents", msgBody[0]);
    },
    handleShowAllStns(val) {
      this.showAllStns = val;
      console.log("handleShowAllStns val:", val);
      if (val) {
        this.stationOther.boundK = false;
        this.stationOther.boundH = false;
        this.stationOther.boundN = false;
        this.stationOther.boundKH = false;
        this.filterLayers("全局车站");
      } else {
        this.filterLayers("C_全局车站");
      }
    },
    handleOpenRangeGraph(type) {
      // this.rangeGraphDialog.type = type + '管辖范围图'
      // this.rangeGraphDialog.graphs = this.getRangeGraphFileUrl(type)
      // this.rangeGraphDialog.visible = true
      // previewPDF.previewPDFNative(this.getRangeGraphFileUrl(type))
      let target = this.$router.resolve({
        path: "/pxt",
        params: {
          type: type
        }
      });
      window.open(target.href + "?type=" + type, "_blank");
    },
    getRangeGraphFileUrl(type) {
      switch (type) {
        case "运输":
          return [
            {
              FILE_NAME: "0_20220620全局示意图.pdf",
              FILE_URL:
                "https://10.192.6.233:19090/group3/20220601/data/0_20220620全局示意图.pdf"
            }
          ];
        case "供电":
          return [
            {
              FILE_NAME: "成都铁路局集团公司供电管辖示意图（20211122）.pdf",
              FILE_URL:
                "https://10.192.6.233:19090/group3/20211122/data/成都铁路局集团公司供电管辖示意图（20211122）.pdf"
            },
            {
              FILE_URL:
                "https://10.192.6.233:19090/group3/20211215/data/成都局供电示意图（枢纽放大图）.pdf",
              FILE_NAME: "成都局供电示意图（枢纽放大图）.pdf"
            }
          ];
        case "电务":
          return [
            {
              FILE_URL:
                "https://10.192.6.233:19090/group3/20211123/data/0_成都局电务系统管辖示意图20211123.pdf",
              FILE_NAME: "0_成都局电务系统管辖示意图20211123.pdf"
            }
          ];
        case "工务":
          return [
            {
              FILE_URL:
                "https://10.192.6.233:19090/group3/20210211/data/成都局示意图202005(工务段).pdf",
              FILE_NAME: "成都局示意图202005(工务段).pdf"
            }
          ];
        default:
          return [];
      }
    },
    handleCheckItemClick(type) {
      console.log("handle checkbox label click", type);
      // const targetHost = "https://10.192.126.27/hqbz/#/mainIndex?";
      const page = this.encodeCheckBoxLabel(type);
      const targetHost = `https://10.192.126.27/hqbz/#/basicDataMaintain/${page}?`;
      let targetUrl = window.location.href;
      let params = this.generateUserParams();
      targetUrl =
        targetHost +
        params +
        // "selectedPage=" +
        // this.encodeCheckBoxLabel(type) +
        "&selectedType=" +
        this.encodeCheckBoxSubMenu(type);
      console.log(targetUrl);
      window.open(targetUrl);
    },
    generateUserParams() {
      let userencode = this.$store.state.params.UserEncode;
      let username = this.$store.state.params.UserName;
      let userpid = this.$store.state.params.UserPID;
      let oid = this.$store.state.params.Oid;
      let oname = this.$store.state.params.Oname;
      let depid = this.$store.state.params.DepId;
      let depname = this.$store.state.params.DepName;
      let usermtype = this.$store.state.params.UserMType;
      let olevel = this.$store.state.params.Olevel;
      let deptype = this.$store.state.params.Deptype;
      return `UserEncode=${userencode}&UserName=${username}&UserPID=${userpid}&Oid=${oid}&Oname=${oname}&DepId=${depid}&DepName=${depname}&UserMType=${usermtype}&Olevel=${olevel}&Deptype=${deptype}&`;
    },
    encodeCheckBoxLabel(t) {
      switch (t) {
        case "防洪看守点":
          return "publicWorks/2-1";
        case "防洪抢险材料及机具":
          return "publicWorks/2-2";
        case "桥梁":
          return "publicWorks/2-3";
        case "隧道":
          return "publicWorks/2-4";
        case "工区":
          return "publicWorks/2-5";
        case "坡道":
          return "publicWorks/2-7";
        case "监控地段":
          return "publicWorks/2-8";
        case "施工计划":
          return "shigong/12-1";
        case "维修计划":
          return "shigong/12-2";
        case "道口":
          return "publicWorks/2-12";
        // case "自动检测地段":          //维护页面取消显示了
        //  return "publicWorks/2-13";
        case "供电轨道车":
          return "basicData/1-1";
        case "工务轨道车":
          return "basicData/1-1";
        case "客站":
          return "basicData/1-4";
        case "货站":
          return "basicData/1-4";
        case "救援列车":
          return "engineAffairs/jylc";
        case "热备内燃机车":
          return "engineAffairs/3-5";
        case "热备电力机车":
          return "engineAffairs/3-6";
        case "生活车":
          return "logistics/5-2";
        case "卫生监督所":
          return "logistics/5-3";
        case "疾控所":
          return "logistics/5-3";
        case "送餐点":
          return "logistics/5-5";
        case "公寓":
          return "logistics/5-4";
        case "救援队及设备":
          return "transportation/6-4";
        case "救援起复设备":
          return "transportation/6-2";
        case "接发列车限制":
          return "transportation/6-3";
        case "供电臂":
          return "powerSupply/7-1";
        case "应急电源":
          return "powerSupply/7-2";
        case "电分相":
          return "powerSupply/7-3";
        case "变电所":
          return "powerSupply/7-5";
        case "机车参数":
          return "engineAffairs/jscs";
        case "水害":
          return "publicWorks/2-6";
        case "站段货装应急管理固话人员":
          return "huoyun/1-5";
        case "调度机车":
          return "transportation/6-6";
        case "专用调车机车":
          return "transportation/6-5";
        case "枢纽小运转机车":
          return "transportation/6-7";
        case "百吨闸瓦压力列车限速":
          return "engineAffairs/3-8";
        case "机外大坡道特殊车站":
          return "engineAffairs/3-9";
        case "备品备料":
          return "vehicle/1-7";
        case "备用车体":
          return "vehicle/1-3";
        case "有端式站台货运线":
          return "huoyun/1-2";
        case "有侧面1.1m站台货物线":
          return "huoyun/1-3";
        case "有端式站台的专用线线路":
          return "huoyun/1-4";
        case "应急装载站及常用加固材料":
          return "huoyun/1-6";
        case "应急装卸劳力":
          return "huoyun/1-7";
        case "路外应急抢险机械":
          return "huoyun/1-9";
        case "危险货运施救信息网络及应急资源":
          return "huoyun/1-10";
        case "路内应急抢险机械":
          return "huoyun/1-8";
        case "医疗资源":
          return "passengerTransport/5-2";
        case "消防站":
          return "passengerTransport/5-2";
        case "派出所":
          return "passengerTransport/5-2";
        case "应急饮食":
          return "passengerTransport/5-3";
        case "防冻物资":
          return "passengerTransport/5-3";
        case "应急疏散场所":
          return "passengerTransport/5-3";
        case "4G应急通信设备":
          return "electricity/9-2";
        case "轨道电路设备":
          return "electricity/9-3";
        case "有源应答器":
          return "electricity/9-4";
        case "无源应答器":
          return "electricity/9-4";
        case "道岔融雪设备":
          return "electricity/9-5";
        case "信号机":
          return "electricity/9-6";
        case "道岔":
          return "electricity/9-7";
        case "电务_备品备料":
          return "electricity/9-8";
        default:
          return "";
      }
    },
    encodeCheckBoxSubMenu(t) {
      switch (t) {
        case "工务轨道车":
          return "1";
        case "供电轨道车":
          return "2";
        case "救援列车":
          return "1";
        case "热备内燃机车":
          return "2";
        case "热备电力机车":
          return "3";
        case "卫生监督所":
          return "2";
        case "疾控所":
          return "4";
        default:
          return "";
      }
    },
    handleShowVideoVR(val) {
      this.showVideoVR = val;
      if (val) {
        this.initVideoPlayer();
      } else {
        $(".railway-video-player").remove();
      }
    },
    handleShowLineVideo(val) {
      this.showLineVideo = val;
      if (val) {
        if (this.railwayMarkers) {
          this.map.addLayer(this.railwayMarkers);
        } else {
          this.initLineVideoPlayer();
        }
      } else {
        this.map.removeLayer(this.railwayMarkers);
      }
    },
    handleEqJumpScreen(type = "") {
      // let url = ''
      switch (type) {
        case "值班表":
          {
            const { href } = this.$router.resolve({
              name: "yjzbryxx"
            });
            window.open(href, "_blank");
          }
          break;
        case "速报": {
          const { href } = this.$router.resolve({
            name: "yjddinfo"
          });
          window.open(href, "_blank");
        }
      }
    },
    initLineVideoPlayer() {
      com.getData(
        {
          c: "eqeh_zxy2063",
          url: "https://10.192.126.203/GeneralProServlet"
        },
        res => {
          let r = JSON.parse(JSON.stringify(res.data["1"]));
          const _this = this;
          let nodeCluster = L.markerClusterGroup({
            zoomToBoundsOnClick: false, //点击集聚区域,是否缩放到全部显示层
            maxClusterRadius: 20,
            disableClusteringAtZoom: 10, //8层及以后不集聚
            // 集聚图标
            iconCreateFunction: cluster => {
              return cluster.getAllChildMarkers()[0].options.icon;
            }
          });
          r.map(p => {
            let node = L.marker(
              {
                lon: parseFloat(p.GPS_POINT_X),
                lat: parseFloat(p.GPS_POINT_Y)
              },
              {
                icon: L.divIcon({
                  className: "railline-video-player",
                  html: `<div class="video-marker video-player-line" title="${p.LINK_NAME}"></div>`
                })
              }
            );
            node.on("click", function () {
              // let url = "https://10.192.126.27/vueYTH/#/videoVR?videoSrc=";
              // let video = encodeURIComponent(p.src);
              _this.videoPlayer.src = `https://10.192.6.179:8443/2CMPV/2CVideo/${p.LINK_URL}`;
              _this.videoPlayer.visible = true;
            });
            nodeCluster.addLayer(node);
          });
          this.railwayMarkers = nodeCluster;
          this.map.addLayer(this.railwayMarkers);
        }
      );
    },
    showUploadPic(e) {
      dk.filterLayers();
      this.config.dk.pic = e;
    },
    filterUploadPicLayer(e) {
      dk.filterLayers(e);
      this.filterPic = e;
    },
    jumpToUploadPicsReport() {
      let url = this.$router.resolve({
        path:
          "/ShowUploadPics?UserName=" +
          this.$store.state.params.UserName +
          "&UserPID=" +
          this.$store.state.params.UserPID
      });
      window.open(url.href, "_blank");
    },
    reloadMap() {
      return new Promise((res, rej) => {
        this.map.remove();
        setTimeout(() => {
          earthquake.inited = false;
          earthquake.getDataFlag = false;
          this.getMapConfig(() => {
            console.log(this.config, this.config.superMap.lightMode);
            this.getPhoneGroupNo(); //获取个人软电话号码
            try {
              this.getOwnerStations(this.oid.toUpperCase()); //获取单位管辖站
              mapUtil.init(this); // 实例化地图

              ranging.init(this); //初始化测距功能
              drawRegion.init(this); //初始化框选区域功能
              this.initYjEvents();
              this.lightOverride = this.isLight;
              this.injectionScript(); // 注入所有脚本
              this.panelLight.display = false;
              this.panelLight.x = 0;
              this.panelLight.current = "";
              this.lightEarthToolbar.current = "";
              this.panel.hide = true;
              this.mapVisible = true;
            } catch (e) {
              //TODO handle the exception
              console.log("THEME ERR", e);
              res();
            }
            res();
          });
        }, 3000);
      });
    },
    // 注入脚本
    injectionScript() {
      stations.init(this); //初始化车站---已优化
      gongDian.init(this); //初始化供电---已优化
      jiWu.init(this); //初始化机务---已优化
      yunShu.init(this); //初始化运输---已优化
      tuFang.init(this); //初始化土房---已优化
      cheLiang.init(this); //初始化土房---已优化

      // huoYun.init(this); //初始化货运子系统---已优化
      huoYunN.init(this);
      earthquake.init(this); //初始化地震---已优化
      boundRegion.init(this); //初始化管界、区域
      qiaoSui.init(this); //初始化桥遂---已优化
      weather.init(this); //初始化天气---已优化
      weatherYJ.init(this); //初始化天气预警---已优化
      train.init(this); //初始化在途车---已优化
      // trainFly.init(this); //初始化列车飞行图
      // jiaotong.init(this); //初始化交通情况
      houqing.init(this); //初始化后勤情况---已优化
      // equipment.init(this); //初始化设备设施
      gongWu.init(this); //初始化工务
      video360.init(this); //初始化全景视频
      if (!this.isPolice) {
        guiDaoChe.init(this); //初始轨道车定位

      }
      dianWu.init(this);
      keYun.init(this);

      if (this.isPolice) {
        console.log("this", this)
        gongAnPcs.init(this); // 公安派出所
        gongAnQita.init(this);
        gongAnSelf.init(this);
        policeCreateLayer.init(this);
      }
      dk.init(this);
      if (this.showVideoVR) {
        this.initVideoPlayer();
      }
      console.log("MAP INSTANCE", this.map);
    },
    // 地图点击事件
    handleMapClick(e) {
      console.log(e);
      this.panelLight.current = "";
      this.panelLight.display = false;
      // this.panelLight.x = 0
      // $( ".phone-location" ).remove()
      // $( ".phone-location-center" ).remove()
      // this.detailMarker.remove()
      // $( ".phone-location-start-point" ).remove()
      // $( ".phone-location-end-point" ).remove()
      if (this.config.earthquake.register) {
        earthquake.handleMapClick(e);
      }
    },
    hideMap() {
      this.mapVisible = !this.mapVisible;
      mapUtil.toggleBaseLayerVisible();
    },
    changeMapThemeOverride(val) {
      const loading = this.$loading({
        lock: true,
        text: "正在切换主题...",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.9)",
        customClass: "loading"
      });
      console.log("切换主题");
      if (val) {
        // 切换至亮版地图
        let newConfig = JSON.parse(JSON.stringify(config));
        newConfig.superMap.lightMode = true;
        console.log(newConfig);

        C.getDataP123(
          {
            c: "tyzd_zxy3001",
            s: [
              "yjxy_" + this.$store.state.params.UserPID,
              "1",
              JSON.stringify(newConfig)
            ],
            url: "https://10.192.126.203/GeneralProServlet"
          },
          r => {
            console.log(r);
            // debugger
            // location.reload(true)
            this.reloadMap().then(() => {
              loading.close();
            });
          }
        );
        // location.reload(true)
      } else {
        let newConfig = JSON.parse(JSON.stringify(config));
        newConfig.superMap.lightMode = false;
        console.log(newConfig);

        C.getDataP123(
          {
            c: "tyzd_zxy3001",
            s: [
              "yjxy_" + this.$store.state.params.UserPID,
              "1",
              JSON.stringify(newConfig)
            ],
            url: "https://10.192.126.203/GeneralProServlet"
          },
          r => {
            console.log(r);
            // debugger
            // location.reload(true)
            this.reloadMap().then(() => {
              loading.close();
            });
          }
        );
      }
    },
    /**
     * 亮版地图点击菜单栏显示子菜单
     * @param {String} type 类别
     * @param {Boolean} display 是否显示菜单
     * @param {MouseEvent} e 点击事件
     */
    setPanelLight(type, display, e) {
      let x = 0;
      e.path.map(ele => {
        if (ele.className === "light-navbar-item") {
          x = ele.offsetLeft;
        }
      });
      console.log("X", e.clientX, e, x);
      this.$emit("controllerTabChange", type);
      console.log("显示面板");
      if (type === this.panelLight.current || display === false) {
        // 当前点击的菜单已显示时关闭
        this.panelLight.display = false;
        this.panelLight.current = "";
        this.$emit("lightPanelChange", "");
      } else {
        // 切换显示当前菜单项
        this.panelLight.display = display;
        this.panelLight.current = type;
        this.panelLight.x = x;
        this.$emit("lightPanelChange", type);
      }
      if (type !== "灾害") {
        this.handleLightEarthquakeToolbarChange("");
      }
      // 根据点击的菜单项控制弹出菜单位置在对应菜单项下方

      // switch (type) {
      // 	case '基础':
      // 		this.panelLight.x = 454 - 24;
      // 		break;
      // 	case '供电':
      // 		this.panelLight.x = 554 - 24;
      // 		break;
      // 	case '工务':
      // 		this.panelLight.x = 654 - 24;
      // 		break;
      // 	case '电务':
      // 		this.panelLight.x = 754 - 24;
      // 		break;
      // 	case '机务':
      // 		this.panelLight.x = 854 - 24;
      // 		break;
      // 	case '运输':
      // 		this.panelLight.x = 954 - 24;
      // 		break;
      // 	case '车辆':
      // 		this.panelLight.x = 1054 - 24;
      // 		break;
      // 	case '后勤保障':
      // 		this.panelLight.x = 1154 - 24;
      // 		break;
      // 	case '货运':
      // 		this.panelLight.x = 1254 - 24;
      // 		break;
      // 	case '地方资源':
      // 		this.panelLight.x = 1354 - 24;
      // 		break;
      // 	case '灾害':
      // 		this.panelLight.x = 1454 - 24;
      // 		break;
      // 	case '交通':
      // 		this.panelLight.x = 1554 - 24;
      // 		break;
      // }
    },
    handleLightEarthquakeToolbarChange(type) {
      if (type === this.lightEarthToolbar.current) {
        // 重复点击相同按钮，取消当前选中状态
        this.lightEarthToolbar.current = "";
        if (type === "框选列车统计") {
          this.changeDrawCountFlag(true);
        }
      } else {
        // 切换功能
        this.lightEarthToolbar.current = type;
        if (type === "框选列车统计") {
          this.changeDrawCountFlag(false);
        }
      }
    },
    // 地图鼠标右键按下事件
    onRightMouseDown(param) {
      if (window.event.button === 2) {
        this.visibleTrainContextMenu = false;
        this.trainContextMenuStyle = {
          top: window.event.y + "px",
          left: window.event.x + "px"
        };
        this.contextMenuData = param.target.options.icon.options.data;
        this.$nextTick(() => {
          this.visibleTrainContextMenu = true;
        });
      } else {
        this.visibleTrainContextMenu = false;
      }
    },
    showGwDgc(e) {
      this.config.gw_sb.gdc = e;
      this.filterLayers("工务_全部轨道车");
    },
    filterGwGdcLayer() {
      switch (this.filterGwGdc) {
        case "可用":
          {
            this.filterLayers("工务_可用轨道车");
          }
          break;
        case "不可用":
          {
            this.filterLayers("工务_不可用轨道车");
          }
          break;
        case "备用":
          {
            this.filterLayers("工务_备用轨道车");
          }
          break;
        case "全部": {
          this.filterLayers("工务_全部轨道车");
        }
      }
    },
    showKsd(e) {
      this.config.gw_sb.ksd = e;
      if (this.config.gw_sb.ksd) {
        this.filterKsdLayer();
      } else {
        this.config.gw_sb.ksd1 = false;
        this.config.gw_sb.ksd2 = false;
        this.config.gw_sb.ksd3 = false;
        this.filterLayers("工务_I级防洪看守点");
        this.filterLayers("工务_II级防洪看守点");
        this.filterLayers("工务_III级防洪看守点");
      }
    },
    filterKsdLayer() {
      if (this.filterKsd === "工务_I级防洪看守点") {
        this.config.gw_sb.ksd1 = true;
        this.config.gw_sb.ksd2 = false;
        this.config.gw_sb.ksd3 = false;
        this.filterLayers("工务_I级防洪看守点");
        this.filterLayers("工务_II级防洪看守点");
        this.filterLayers("工务_III级防洪看守点");
        // this.filterLayers( "工务_全部防洪看守点" )
        console.log(this.config.gw_sb);
      } else if (this.filterKsd === "工务_II级防洪看守点") {
        this.config.gw_sb.ksd1 = false;
        this.config.gw_sb.ksd2 = true;
        this.config.gw_sb.ksd3 = false;
        this.filterLayers("工务_I级防洪看守点");
        this.filterLayers("工务_II级防洪看守点");
        this.filterLayers("工务_III级防洪看守点");
        // this.filterLayers( "工务_全部防洪看守点" )
        console.log(this.config.gw_sb);
      } else if (this.filterKsd === "工务_III级防洪看守点") {
        this.config.gw_sb.ksd1 = false;
        this.config.gw_sb.ksd2 = false;
        this.config.gw_sb.ksd3 = true;
        this.filterLayers("工务_I级防洪看守点");
        this.filterLayers("工务_II级防洪看守点");
        this.filterLayers("工务_III级防洪看守点");
        // this.filterLayers( "工务_全部防洪看守点" )
        console.log(this.config.gw_sb);
      } else if (this.filterKsd === "全部") {
        this.config.gw_sb.ksd1 = true;
        this.config.gw_sb.ksd2 = true;
        this.config.gw_sb.ksd3 = true;
        this.filterLayers("工务_全部防洪看守点");
        // this.filterLayers( "工务_II级防洪看守点" )
        // this.filterLayers( "工务_III级防洪看守点" )
      }
    },
    filterEarthquakeViewMarker() {
      // 显示在途车
      this.trainOhter.dongche = true;
      this.trainOhter.puche = true;
      // this.trainOhter.huoche = true
      this.filterLayers("列车");
      console.log("显示在途车");

      // 显示工务轨道车
      this.config.gw_sb.gdc = true;
      this.filterGwGdc = "全部";
      this.$nextTick(() => {
        this.filterGwGdcLayer();
      });
      console.log("显示工务轨道车");

      // 显示供电轨道车
      this.gongDianOther.gd_sbss.ck_yjc = true;
      this.filterLayers("供电_设备设施");
      console.log("显示供电轨道车");

      // 显示车站
      this.showAllStns = true;
      this.handleShowAllStns();
      console.log("显示车站");
    },
    hideGdc(visible) {
      this.config.gw_sb.gdc = visible;
      this.filterGwGdc = "全部";
      this.$nextTick(() => {
        this.filterGwGdcLayer();
      });
      console.log("隐藏工务轨道车");

      // 显示供电轨道车
      this.gongDianOther.gd_sbss.ck_yjc = visible;
      this.filterLayers("供电_设备设施");
      console.log("隐藏供电轨道车");
    },
    //显示路内应急抢险机械
    filterQxjxLayer() {
      if (this.hy_lntjqxjx) {
        if (this.filterQxjx === "货运_起重机") {
          this.hy_sbss_qzj.visible = true;
          this.hy_sbss_wjj.visible = false;
          this.hy_sbss_zzj.visible = false;
          this.filterLayers("货运");
        } else if (this.filterQxjx === "货运_挖掘机") {
          this.hy_sbss_qzj.visible = false;
          this.hy_sbss_wjj.visible = true;
          this.hy_sbss_zzj.visible = false;
          this.filterLayers("货运");
        } else if (this.filterQxjx === "货运_装载机") {
          this.hy_sbss_qzj.visible = false;
          this.hy_sbss_wjj.visible = false;
          this.hy_sbss_zzj.visible = true;
          this.filterLayers("货运");
        } else if (this.filterQxjx === "货运_全部抢险机械") {
          this.hy_sbss_qzj.visible = true;
          this.hy_sbss_wjj.visible = true;
          this.hy_sbss_zzj.visible = true;
          this.filterLayers("货运");
        }
      } else {
        this.filterQxjx = "";
        this.hy_sbss_qzj.visible = false;
        this.hy_sbss_wjj.visible = false;
        this.hy_sbss_zzj.visible = false;
        this.filterLayers("货运");
      }
    },
    /**
     * 筛选供电管界单位
     * @param val
     */
    filterGddRangeLayer(val) {
      console.log("筛选供电范围单位", val, this.showGddRange);

      // 控制图层显隐
      this.gongDian_layers.gd_sbss.ck_gdd.map(layer => {
        if (val.includes(layer.oname)) {
          layer.show = true;
        } else {
          layer.show = false;
        }
      });
      this.filterLayers("供电_设备设施");
    },
    /**
     * 筛选工务管界单位
     * @param val
     */
    filterGwdRangeLayer(val) {
      console.log("筛选工务范围单位", val, this.showGwdRange);
      // 控制图层显隐
      this.gongWuLayers.gw_fw.gwd.map(layer => {
        if (val.includes(layer.oname)) {
          layer.show = true;
        } else {
          layer.show = false;
        }
      });
      this.filterLayers("工务_工务段");
    },
    /**
     * 筛选电务管界单位
     * @param val
     */
    filterDwdRangeLayer(val) {
      console.log("筛选电务范围单位", val, this.showDwdRange);
      this.$store.commit("dianwu/updateSelectedDwd", val);
      // 控制图层显隐
      this.dianWuLayers.dw_fw.dwd.map(layer => {
        if (val.includes(layer.oname)) {
          layer.show = true;
        } else {
          layer.show = false;
        }
      });
      this.filterLayers("电务_电务段");
    },
    // 图层过滤
    filterLayers(ty, data) {
      if (ty.includes("工务_")) {
        console.log(ty);
        // if (ty === '工务_天窗点') {
        //   // 勾选天窗点 = 勾选施工计划 + 维修计划
        //   this.config.gw_jh.wx = !this.config.gw_jh.wx
        //   this.config.gw_jh.sg = !this.config.gw_jh.sg
        // }
        gongWu.filterLayers(ty);
      } else {
        switch (ty) {
          case "轨道车定位_工务":
            guiDaoChe.filterLayer(ty);
            break;
          case "到站车":
            train.filterLayer();
            break;
          case "区域":
            boundRegion.filterLayer(data);
            break;
          case "车站":
            stations.filterLayer();
            break;
          case "全景视频":
            video360.filterLayer();
            break;
          case "全局车站":
            stations.filterLayer(true);
            break;
          case "C_全局车站":
            stations.filterLayer("clear");
            break;
          case "供电_设备设施":
          case "供电_范围":
          case "供电_接触网":
            gongDian.filterLayer(ty);
            break;
          case "机务_车型":
          case "机务_范围":
          case "机务_救援":
            jiWu.filterLayer(ty);
            break;
          case "运输_设备设施":
          case "运输_范围":
          case "运输_接发列车限制":
          case "运输_调车机车":
            yunShu.filterLayer(ty, data);
            break;
          case "土房_设备设施":
          case "土房_范围":
            tuFang.filterLayer(ty, data);
            break;
          case "货运":
            huoYunN.filterLayer();
            break;
          case "车辆_备品备料":
            cheLiang.filterLayer(ty, data);
            break;
          case "车辆_备用车组":
            cheLiang.filterLayer(ty, data);
            break;
          case "桥隧":
            qiaoSui.filterLayer();
            break;
          case "天气":
            weather.filterLayer();
            break;
          case "天气预警":
            weatherYJ.filterLayer();
            break;
          case "地震":
            earthquake.filterLayer();
            break;
          case "列车":
            train.filterLayer();
            break;
          case "公交":
          case "出租车":
          case "停车场":
          case "地铁":
          case "共享单车":
          case "网约车":
            jiaotong.filterLayer(ty);
            break;
          case "后勤_学校":
            houqing.filterLayer(ty);
            break;
          case "其它测试设备":
            equipment.filterLayer();
            break;

          case "电务_电务段":
            dianWu.filterLayer("电务_电务段", "电务_电务段");
            break;
          case "电务_4G": {
            dianWu.filterLayer("dw_sb", "dw_4g");
            break;
          }
          case "电务_轨道设备": {
            dianWu.filterLayer("dw_sb", "dw_gdsb");
            break;
          }
          case "电务_列控设备": {
            dianWu.filterLayer("dw_sb", "dw_lksb");
            break;
          }
          case "电务_列控设备无": {
            dianWu.filterLayer("dw_sb", "dw_lksb_w");
            break;
          }
          case "电务_道岔融雪设备":
            {
              dianWu.filterLayer("dw_sb", "dw_dccxsb");
            }
            break;
          case "电务_信号机":
            {
              dianWu.filterLayer("dw_sb", "dw_xhj");
            }
            break;
          case "电务_道岔":
            {
              dianWu.filterLayer("dw_sb", "dw_dx");
            }
            break;
          case "电务_备品备料":
            {
              dianWu.filterLayer("dw_sb", "dw_bpbl");
            }
            break;
          case "客运_医疗": {
            keYun.filterLayer("ky_sb", "ky_sb_yl");
            break;
          }
          case "客运_消防": {
            keYun.filterLayer("ky_sb", "ky_sb_xf");
            break;
          }
          case "客运_派出所": {
            keYun.filterLayer("ky_sb", "ky_sb_pcs");
            break;
          }
          case "客运_地方派出所": {
            keYun.filterLayer("ky_sb", "ky_sb_local_pcs");
            break;
          }
          case "客运_应急饮食": {
            keYun.filterLayer("ky_sb", "ky_sb_yjys");
            break;
          }
          case "客运_防冻物资": {
            keYun.filterLayer("ky_sb", "ky_sb_fdwz");
            break;
          }
          case "客运_应急疏散场所": {
            keYun.filterLayer("ky_sb", "ky_sb_yjsscs");
            break;
          }
          // 警用地图
        }
      }
    },
    // 地图缩放事件
    onMapZoomend(newZoom, oldZoom, e) {
      this.config.superMap.zoom = newZoom;
      this.sliderScale = newZoom;
      train.onMapZoomend(newZoom, oldZoom, e); //列车
      qiaoSui.onMapZoomend(newZoom, oldZoom, e); //桥遂
      // trainFly.onMapZoomend(newZoom, oldZoom, e); //飞行图
      earthquake.onMapZoomend(newZoom, oldZoom, e); //地震
      // gongDian.onMapZoomend(newZoom, oldZoom, e); //供电
    },
    querySearch(query, cb) {
      let d = [];
      if (query) {
        d = this.lines.filter(v => v.NAME.indexOf(query) > -1);
      } else {
        d = this.lines;
      }
      cb(d);
    },
    /* @info  事件处理区-----------------------------------*/
    // 车站 站内综合图 特殊处理
    changeUrl(index) {
      if (index !== this.dialog.selectedIndex) {
        this.dialog.selectedIndex = index;
        this.dialog.src = "";
        this.$nextTick(() => {
          this.dialog.src = this.dialog.arr[this.dialog.selectedIndex].path;
        });
      }
    },
    // 全局搜索---匹配车次/车站
    globalFilterSearch(query, cb) {
      let d = [];
      if (query) {
        query = query.toUpperCase();
        if (this.globalFilterType === "cc") {
          d = this.trainOhter.tarinData.filter(
            v => v.TRAIN.indexOf(query) > -1
          );
          cb(d);
        } else if (this.globalFilterType === "cz") {
          d = stations.allStations.filter(
            v =>
              v.STN_NAME.indexOf(query) > -1 || v.STN_CODE.indexOf(query) > -1
          );
          cb(d);
        } else if (this.globalFilterType === "dm") {
          // 地名模糊搜索
          com.getDataP123(
            {
              c: "eqeh_zxy2030",
              s: [[query]],
              url: "https://10.192.126.203/GeneralProServlet"
            },
            res => {
              console.log("地名模糊搜索", query, res["1"]);
              d = res["1"];
              cb(d);
            }
          );
        }
      }
      // cb(d);
    },

    // 警用地理信息系统相关
    gaFilterSearch(queryString, cb) {
      let gaLargeCategory = this.gaLargeCategory;
      let results = gaLargeCategory;

      // let results = queryString
      //   ? gaLargeCategory.filter(this.createFilter(queryString))
      //   : gaLargeCategory;
      // 调用callback返回建议列表的数据
      cb(results);
    },

    // chooseMenu(key, keyPath) {
    //   console.log("选择管辖区菜单");
    //   this.curMenu = this.gaAreaMenu.filter(item => item.ID === key);
    //   console.log("this.curMenu", this.curMenu);
    // },

    createFilter(queryString) {
      return gaLargeCategory => {
        return (
          gaLargeCategory.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1 // 不只能匹配开头的字符
        );
      };
    },

    gaFilterSearch2(queryString, cb) {
      let gaSmallCategory = this.gaSmallCategory;

      this.gaSearchResults = queryString
        ? gaSmallCategory.filter(this.createFilter2(queryString))
        : gaSmallCategory;

      this.gaFirstChoise = this.gaSearchResults[0];

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // 调用callback返回建议列表的数据
        cb(this.gaSearchResults);
      }, 3000 * Math.random());
    },

    createFilter2(queryString) {
      return gaSmallCategory => {
        return (
          gaSmallCategory.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1 // 不只能匹配开头的字符
        );
      };
    },

    loadLargeData() {
      // console.log("获取大类");
      C.getData(
        {
          s: [],
          c: "trdm_ga_010@kyz_0001",
          a: "获取模糊搜索大类",
          url: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet", //接口地址
          // url: C.ADDS.servGS, //接口地址
          async: true
        },
        r => {
          if (r && r[0]) {
            let gaLargeCategory = r;
            // console.log(
            //   "获取公安模糊搜索大类：gaLargeCategory111111111111111111111 ",
            //   gaLargeCategory
            // );

            // el-autocomplete只能使用value作为显示的键
            //转换
            this.gaLargeCategory = gaLargeCategory.map(item => {
              return {
                value: item.RESOURCE_NAME,
                RESOURCE_NAME: item.RESOURCE_NAME,
                BZ: item.BZ,
                KEY_NAME: item.KEY_NAME
              };
            });
            console.log(
              "this.gaLargeCategory22222222222222222222222222",
              this.gaLargeCategory
            );
            // debbuger;
          } else {
          }
        }
      );
    },

    handlePoliceSelect(item) {
      console.log("============handlePoliceSelect, item", item);
      let nameCode = {
        station: 1,
        levelcross: 2,
        floodplace1: "3a",
        floodplace2: "3b",
        floodplace3: "3c",
        floodprepare: 4,
        school: 5,
        hospital: 6,
        fire: 7,
        emergency1: 8,
        emergency2: 8,
        emergency3: 8,
        police: 9
      };
      this.gaLargeCode = nameCode[item.KEY_NAME];
      // 为了marker保存类型
      this.gaLargeType = item.RESOURCE_NAME;
      console.log(
        "============handlePoliceSelect, this.gaLargeCode",
        this.gaLargeCode
      );
      this.loadSmallData();
    },

    loadSmallData(queryString) {
      C.getData(
        {
          // s: [this.gaLargeCode, queryString], // 后端执行模糊搜索
          // s: [this.gaLargeCode], // 后端返回所有，前端进行模糊搜索
          s: ["9"], // 后端返回所有，前端进行模糊搜索
          c: "trdm_ga_012@kyz_0001",
          a: "获取公安模糊搜索",
          url: C.ADDS.servGS, //接口地址
          async: true
        },
        r => {
          if (r && r[0]) {
            let gaSmallCategory = r;
            console.log(
              "获取公安模糊搜索小类：gaSmallCategory111111111111111111111 ",
              gaSmallCategory
            );

            // 添加value属性，赋值FUZZY
            gaSmallCategory.forEach(item => {
              item.value = item.FUZZY;
            });
            this.gaSmallCategory = gaSmallCategory;
            console.log(
              "this.gaSmallCategory22222222222222222222222222",
              this.gaSmallCategory
            );
            this.gaFilterStr2 = "";
          } else {
          }
        }
      );
    },

    handlePoliceSelect2(item) {
      console.log("*********************handlePoliceSelect2, item", item);
      console.log("*********************this.gaLargeType", this.gaLargeType);
      this.createSinglePointLayer(item);
    },
    handlePoliceSubmit2() {
      let item = this.gaSearchResults[0];
      this.gaFilterStr2 = item.FUZZY;
      // 下拉表置空
      this.$refs.autocomplete2.suggestions = [];
      console.log("*********************handlePoliceSubmit2, item", item);
      console.log("*********************this.gaLargeType", this.gaLargeType);
      this.createSinglePointLayer(item);
    },
    createSinglePointLayer(item) {
      // 这里只用创建marker，然后铺到地图上
      // 仿照keYun.js的createLayer，还是要传mainType和subType才行
      // 而点击图标时间仍然使用setMarkerClickHandler，这里需要使用到subType。

      //先定义每一种类型的mainType和subType
      let mainType = "";
      let subType = "";
      let ty = "";
      if (this.gaLargeType === "铁路公安 - 派出所") {
        subType = "wu_pcs_tlpcs";
        policeCreateLayer.createPcsLayer([item], subType);
        this.map.setView([item.GPS_POINT_Y, item.GPS_POINT_X], 10);
      }
      // if (this.gaLargeType === "基础 - 车站") {
      //   // stations.js 118
      //   policeCreateLayer.createStationLayer([item]);
      //   this.map.setView([item.GPS_POINT_Y, item.GPS_POINT_X], 10);
      // } else if (this.gaLargeType === "后勤 - 学校") {
      //   mainType = "";
      //   subType = "";
      //   policeCreateLayer.createXuexiaoLayer([item]);
      //   this.map.setView([item.GPS_POINT_Y, item.GPS_POINT_X], 10);
      // } else if (this.gaLargeType.includes("工务 -")) {
      //   mainType = "gw_sb";
      //   switch (this.gaLargeType) {
      //     case "工务 - 防洪抢险材料及机具":
      //       subType = "qx";
      //       ty = "工务_防洪抢险材料及机具";
      //       break;
      //     case "工务 - 道口":
      //       subType = "dk";
      //       ty = "工务_道口";
      //       break;
      //     case "工务 - 防洪看守点I级":
      //       subType = "ksd1";
      //       ty = "工务_I级防洪看守点";
      //       break;
      //     case "工务 - 防洪看守点Ⅱ级":
      //       subType = "ksd2";
      //       ty = "工务_II级防洪看守点";
      //       break;
      //     case "工务 - 防洪看守点Ⅲ级":
      //       subType = "ksd3";
      //       ty = "工务_III级防洪看守点";
      //       break;
      //   }
      //   policeCreateLayer.createGWLayer(ty, mainType, subType, [item]);
      //   this.map.setView([item.GPS_POINT_Y, item.GPS_POINT_X], 10);
      // } else if (this.gaLargeType.includes("客运 -")) {
      //   mainType = "ky_sb";
      //   if (this.gaLargeType === "客运 - 派出所") {
      //     subType = "wu_pcs_tlpcs";
      //     policeCreateLayer.createPcsLayer([item], subType);
      //   } else {
      //     switch (this.gaLargeType) {
      //       case "客运 - 医疗":
      //         subType = "ky_sb_yl";
      //         break;
      //       case "客运 - 消防站":
      //         subType = "ky_sb_xf";
      //         break;
      //       // case "客运 - 派出所":
      //       //   subType = "ky_sb_pcs";
      //       //   break;
      //       case "客运 - 应急饮食":
      //         subType = "ky_sb_yjys";
      //         break;
      //       case "客运 - 应急防冻物资":
      //         subType = "ky_sb_fdwz";
      //         break;
      //       case "客运 - 应急疏散场所":
      //         subType = "ky_sb_yjsscs";
      //         break;
      //     }
      //     policeCreateLayer.createKeYunLayer([item], subType);
      //   }

      //   this.map.setView([item.GPS_POINT_Y, item.GPS_POINT_X], 10);
      // }
    },

    changeGaArea(key) {
      this.curMenu = this.gaAreaMenu.find(item => item.ID === key);
      mapUtil.changePoliceBond(this.curMenu);
      // this.curGaArea = item.GaAreaName;
      // 只显示当前公安处的内容

    },
    // 比例尺缩放事件
    setScale(val) {
      console.log("缩放比例尺到级别：", val);
      this.map.setZoom(val);
    },

    gaReturn() {
      this.gaPanelType = "gac"; //返回公安处
      console.log("点击返回公安处", this.gaPanelType)
    },




    jumpToStn(stnname) {
      let d = stations.allStations.find(v => v.STN_NAME.includes(stnname));
      if (d) {
        const toZoom =
          this.config.superMap.zoom < 10 ? 10 : this.config.superMap.zoom;
        this.map.setView([d.GPS_POINT_Y, d.GPS_POINT_X], toZoom); //平移地图
      }
    },
    // 全局搜索---地图定位车次/车站
    globalFilter(p) {
      let d = p;
      if (this.globalFilterType === "cc") {
        if (p === "btn") {
          d = this.trainOhter.tarinData.find(
            v => v.TRAIN.indexOf(this.globalFilterStr) > -1
          );
        }
        if (d) {
          C.$(".filtered").removeClass("filtered");
          const toZoom =
            this.config.superMap.zoom < 10 ? 10 : this.config.superMap.zoom;
          this.map.setView([d.LAT, d.LON], toZoom); //平移地图
          setTimeout(() => {
            C.$("#" + d.TRAIN_ID).addClass("filtered");
          }, 200);
          setTimeout(() => {
            C.$(".filtered").removeClass("filtered");
          }, 6000);
        } else {
          this.$message.error("未找到指定车次！");
        }
      } else if (this.globalFilterType === "cz") {
        if (p === "btn") {
          d = stations.allStations.find(
            v =>
              v.STN_NAME.indexOf(this.globalFilterStr) > -1 ||
              v.STN_CODE.indexOf(this.globalFilterStr) > -1
          );
        }
        if (d) {
          C.$(".filtered").removeClass("filtered");
          const toZoom =
            this.config.superMap.zoom < 10 ? 10 : this.config.superMap.zoom;
          this.map.setView([d.GPS_POINT_Y, d.GPS_POINT_X], toZoom); //平移地图
          setTimeout(() => {
            C.$("#station_" + d.STN_CODE).addClass("filtered");
          }, 200);
          setTimeout(() => {
            C.$(".filtered").removeClass("filtered");
          }, 6000);
        } else {
          this.$message.error("未找到指定车站！");
        }
      } else if (this.globalFilterType === "dm") {
        let targetPoint = {};
        if (p === "btn") {
          console.log("搜索地名", this.globalFilterStr);
          com.getDataP123(
            {
              c: "eqeh_zxy2029",
              s: [[this.globalFilterStr]],
              url: "https://10.192.126.203/GeneralProServlet"
            },
            res => {
              console.log("搜索地名范围", res["1"]);
              res["1"].map(pt => {
                if (
                  pt.GPS_POINT_X_1 !== "" &&
                  pt.GPS_POINT_X_2 !== "" &&
                  pt.GPS_POINT_Y_1 !== "" &&
                  pt.GPS_POINT_Y_2 !== ""
                ) {
                  targetPoint = JSON.parse(JSON.stringify(pt));
                }
              });
              console.log("目标范围", targetPoint);
              if (JSON.stringify(targetPoint) !== "{}") {
                earthquake.createRangeCircle(targetPoint, this.globalFilterStr);
                // rangeLayer.addTo(this.map)
              } else {
                this.$message.warning("未查询到地名!");
              }
            }
          );
        } else {
          com.getDataP123(
            {
              c: "eqeh_zxy2029",
              s: [[p.name]],
              url: "https://10.192.126.203/GeneralProServlet"
            },
            res => {
              console.log("搜索地名范围", res["1"]);
              res["1"].map(pt => {
                if (
                  pt.GPS_POINT_X_1 !== "" &&
                  pt.GPS_POINT_X_2 !== "" &&
                  pt.GPS_POINT_Y_1 !== "" &&
                  pt.GPS_POINT_Y_2 !== ""
                ) {
                  targetPoint = JSON.parse(JSON.stringify(pt));
                }
              });
              console.log("目标范围", targetPoint);
              if (JSON.stringify(targetPoint) !== "{}") {
                earthquake.createRangeCircle(targetPoint, p.name);
                // rangeLayer.addTo(this.map)
              } else {
                this.$message.warning("未查询到地名!");
              }
            }
          );
        }
      }
    },
    showQjZtcReport() {
      window.open(
        "https://10.192.34.105:8443/webroot/decision/view/report?viewlet=YJCZ/xd_train_tt_query.cpt&op=view"
      );
    },
    initVideoPlayer() {
      let videoPoints = [
        {
          lng: 105.80115720722019,
          lat: 32.42011666218073,
          src: "https://10.192.126.27/files/1.mp4"
        },
        {
          lng: 104.73329416033091,
          lat: 31.714302391375128,
          src: "https://10.192.126.27/files/2.mp4"
        },
        {
          lng: 104.70512022269145,
          lat: 31.46207905932618,
          src: "https://10.192.126.27/files/3.mp4"
        },
        {
          lng: 104.50009206264188,
          lat: 31.31214846261611,
          src: "https://10.192.126.27/files/4.mp4"
        },
        {
          lng: 104.60012778029244,
          lat: 28.723340553392543,
          src: "https://10.192.126.27/files/4.mp4"
        },
        {
          lng: 104.92641330637446,
          lat: 28.599072513341152,
          src: "https://10.192.126.27/files/2.mp4"
        },
        {
          lng: 105.24523155880948,
          lat: 28.599072513341152,
          src: "https://10.192.126.27/files/1.mp4"
        }
      ];
      const _this = this;
      videoPoints.map(p => {
        let node = L.marker(
          {
            lon: p.lng,
            lat: p.lat
          },
          {
            icon: L.divIcon({
              className: "railway-video-player",
              html: `<div class="video-marker video-player"></div>`
            })
          }
        );
        node.on("click", function () {
          let url = "https://10.192.126.27/vueYTH/#/videoVR?videoSrc=";
          let video = encodeURIComponent(p.src);
          _this.videoPlayer.src = url + video;
          _this.videoPlayer.visible = true;
        });
        this.map.addLayer(node);
      });
    },

    // 工具栏点击事件
    toolClick(ty) {
      if (ty === "openPhone") {
        if (this.initGroupNo === "") {
          this.$message.error("应急呼叫号码未注册！");
          return;
        }
        this.$refs.call.visibleWindow();
        return;
      }
      // 聚合通信
      if (ty === "openJhtx") {
        const { UserName, UserPID } = this.$store.state.params;
        this.JhtxUrl = `https://10.192.34.79/JFLCMS/vueEDMS/#/yjzbManage?pageType=3&openType=${this.sys
          }&Oid=${this.oid.toUpperCase()}&Oname=${this.oname
          }&UserName=${UserName}&UserPID=${UserPID}&UserMType=客运短信通知,客运语音呼叫,客运电话会议,客运音视频`;
        this.visibleJhtx = true;
        return;
      }
      const trains = train.getBoxSelectedTrains();
      if (ty === "openXiaoYu") {
        let trainCount = trains.length;
        if (trainCount > 0) {
          var real = [];
          trains.forEach(train => {
            var now = new Date();
            now = now.Format("yyyy-MM-dd");
            try {
              C.getData(
                {
                  url: "https://10.192.126.203/GeneralProServlet", //接口地址
                  c: "kydp_zxy8024",
                  s: [train.TRAIN, now],
                  a: "【kydp_zxy8024】获取三乘信息"
                },
                r => {
                  trainCount--;
                  if (r !== "null") {
                    C.$.each(r, function (i, v) {
                      if (v.ZhiWei === "列车长") {
                        real.push(v);
                      }
                    });
                  }
                }
              );
            } catch (e) {
              trainCount--;
            }
          });
          this.intervalTrainInfo = setInterval(() => {
            if (trainCount === 0) {
              this.voiceCall(real, "xiaoyu");
              clearInterval(this.intervalTrainInfo);
            }
          }, 1000);
        } else {
          this.voiceCall([], "xiaoyu");
        }
      }
      // 正晚点信息
      else if (ty === "openLate") {
        window.event.stopPropagation();
        this.visibleLate = true;
      }
      // 旅服信息
      else if (ty === "openTravel") {
        this.visibleTravel = true;
      }
      // 批派任务
      else if (ty === "openTask") {
        this.boxSelectedTrains = trains;
        this.taskVisible = true;
      }
      // 文本聊天
      else if (ty === "openMsg") {
        this.boxSelectedTrains = trains;
        this.sendMsgVisible = true;
      }
    },

    /**
     * 拨打电话、音视频、发送消息
     * @param {Object} per
     * @param {Object} ty
     */
    voiceCall(per, ty) {
      if (ty === "phone") {
        if (this.initGroupNo === "") {
          this.$message.error("应急呼叫号码未注册！");
          return;
        }
        this.$refs.call.ringup(per.E_Phone);
      } else if (ty === "msg") {
        this.boxSelectedTrains = [this.trainOhter.curTrain];
        this.sendMsgVisible = true;
      } else if (ty === "xiaoyu") {
        // 有选择的人员,则打开小鱼视频
        if (per.length > 0) {
          const xiaoYuUrl =
            "https://10.192.34.79/JFLCMS/vue/#/XYLink?UserMType=客运短信通知,客运语音呼叫,客运电话会议,客运音视频&";
          let url =
            xiaoYuUrl + "unitFlag=1&Oname=" + this.oname + "&Oid=" + this.oid;
          const userNameList = [];
          const userPidList = [];
          per.forEach(item => {
            userNameList.push(item.E_Name);
            userPidList.push(item.E_Phone);
          });
          this.loading = this.$loading({
            lock: true,
            text: "正在与 " + userNameList.join("、") + " 建立视频链接",
            spinner: "el-icon-loading",
            background: "rgba(0,0,0,0.7)",
            customClass: "loading1"
          });
          const webP = this.$store.state.params;
          const pos =
            "&UserName=" +
            webP.UserName +
            "&UserPID=" +
            webP.UserPID +
            "&Oid=" +
            webP.Oid +
            "&Oname=" +
            webP.Oname; //发起人
          const rec =
            "&userNameList=" +
            userNameList.join(",") +
            "&userPidList=" +
            userPidList.join(","); //接收人
          url = xiaoYuUrl + "pageType=1" + pos + rec;
          setTimeout(
            () => {
              this.xiaoYuUrl = url;
              this.visibleXiaoYu = true;
              //window.open(url);
              this.loading.close();
            },
            per.length > 0 ? 3000 : 1
          );
        }
        // 无选择人员，则打开聚合通信
        else {
          this.toolClick("openJhtx");
        }
      }
    },
    removeDmCircle() {
      $(".range-circle").remove();
      $(".range-center").remove();
    },
    testGeoBuffer(msg) {
      console.log("空间分析服务");
      const _this = this;
      const latlng = [msg.lat, msg.lon];
      mapUtil.geoBufferAnalystProcess(latlng, 5, "1", p => {
        console.log(latlng, p);
        // 更新影响范围坐标后绘制影响范围
        com.getDataP123(
          {
            c: "eqeh_zxy9012",
            s: [msg.pkid],
            w: p.map(pp => {
              return [pp[0], pp[1], pp[2]];
            }),
            url: "https://10.192.126.203/GeneralProServlet"
          },
          () => {
            console.log("更新影响范围成功");
            // 绘制影响范围图示
            $(".phone-location").remove();
            $(".phone-location-center").remove();
            this.detailMarker && this.detailMarker.remove();
            $(".phone-location-start-point").remove();
            $(".phone-location-end-point").remove();
            let circle = L.circle([msg.lat, msg.lon], {
              color: "yellow",
              className: "phone-location",
              fillColor: "yellow",
              opacity: 0.3,
              fillOpacity: 0.2,
              radius: 5000
            });
            let node = L.marker(
              {
                lon: msg.lon,
                lat: msg.lat
              },
              {
                icon: L.divIcon({
                  className: "phone-location-center",
                  html: `<div class="range-marker range-center">
	                   
	                   </div>
	                   <div style="margin-left: 5px; z-index: 1">
	                     <span style="font-weight: bold; font-size: 18px">${msg.lon}, ${msg.lat}</span>
	                   </div>`
                })
              }
            );
            circle.on("click", () => {
              // 获取影响区段信息并显示Popper
              com.getDataP123(
                {
                  c: "eqeh_zxy2033",
                  s: [[msg.pkid]],
                  url: "https://10.192.126.203/GeneralProServlet"
                },
                res => {
                  let influence = JSON.parse(res["1"][0].INFLUENCE);
                  console.log("点击报点位置", msg.pkid, influence);
                  let influencePopperTable = influence.map((i, index) => {
                    let startPoint = L.marker(
                      {
                        lon: i.DATA[0].GPS_X,
                        lat: i.DATA[0].GPS_Y
                      },
                      {
                        icon: L.divIcon({
                          className: "phone-location-start-point",
                          html: `<span style="background:aqua;color:black;width:18px;height:18px;display:inline-block;border-radius:18px;margin-left:2px;">${i.LINE_NAME.substr(
                            0,
                            1
                          )}</span>`
                        })
                      }
                    );
                    let endPoint = L.marker(
                      {
                        lon: i.DATA[1].GPS_X,
                        lat: i.DATA[1].GPS_Y
                      },
                      {
                        icon: L.divIcon({
                          className: "phone-location-end-point",
                          html: `<span style="background:mediumpurple;color:black;width:18px;height:18px;display:inline-block;border-radius:18px;margin-left:2px;">${i.LINE_NAME.substr(
                            0,
                            1
                          )}</span>`
                        })
                      }
                    );
                    _this.map.addLayer(startPoint);
                    _this.map.addLayer(endPoint);
                    _this.map.setView([i.DATA[1].GPS_Y, i.DATA[1].GPS_X], 10);
                    return `<tr><td>${i.LINE_NAME}</td><td>${i.DATA[0].LINE_KM_DIS}</td><td>${i.DATA[1].LINE_KM_DIS}</td></tr>`;
                  });
                  let popper = L.divIcon({
                    className: "detail-pop-container",
                    iconSize: [10, 10],
                    popupAnchor: [500, 500],
                    html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(10px, 260px, 0px); bottom: 0px;">
						              <a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
						              <div class = "leaflet-popup-content-wrapper marker-houqing-info-popup">
							                <div class="leaflet-popup-content no-padding" style="position:relative;width:300px;height: 300px;">
								                <i class="marker-gongwu-info-tip zyc"></i>
								                <div class="marker-gongwu-info" style="width: 300px">
								                  <table border="0" cellpadding="0" cellspacing="0">
								                    <tbody>
								                      <tr>
								                        <td colspan="2">
								                          <div id="qxDetailTitle" style="width: 100%; height: 20px; display: flex; flex-direction: row; justify-content: space-evenly">
								                            <div style="display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">经度: <br /><label class="blue">${parseFloat(
                      msg.lon
                    ).toFixed(4)}</label></div>
								                            <div style="display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">纬度: <br /><label class="blue">${parseFloat(
                      msg.lat
                    ).toFixed(4)}</label></div>
								                            <div style="display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">上报电话: <br /><label class="blue">${msg.phone
                      }</label></div>
												                  </div>
												                  <div id="qxTable" style="height: calc(100% - 40px); margin-top: 40px">
												                    <table class="detail-table" cellpadding="0" cellspacing="0">
												                      <thead><tr><th>线别</th><th>起点</th><th>终点</th></tr></thead>
												                      <tbody>
												                        ${influencePopperTable.join("")}
														                  </tbody>
													                  </table>
												                  </div>
											                  </td>
								                      </tr>
							                      </tbody>
	                                </table>
	                              </div>
							                </div>
						              </div>
				                </div>`
                  });
                  _this.detailMarker = L.marker(
                    {
                      lon: parseFloat(msg.lon) + 0.03,
                      lat: msg.lat
                    },
                    {
                      icon: popper
                    }
                  );
                  _this.map.addLayer(this.detailMarker);
                }
              );
            });
            this.map.addLayer(circle);
            this.map.addLayer(node);
            this.map.setView([msg.lat, msg.lon], 12);
            this.phoneLocationNotify.close();
            this.$emit("phoneUploadLocation");
            // this.$notify.close()
          }
        );
      });
    },
    renderInfluenceRange(pkid) {
      C.getDataP123(
        {
          c: "eqeh_zxy2033",
          s: [[pkid]],
          url: "https://10.192.126.203/GeneralProServlet"
        },
        res => {
          let latlng = [res["1"][0].LAT, res["1"][0].LON];
          $(".phone-location").remove();
          $(".phone-location-center").remove();
          this.detailMarker && this.detailMarker.remove();
          $(".phone-location-start-point").remove();
          $(".phone-location-end-point").remove();
          let circle = L.circle(latlng, {
            color: "yellow",
            className: "phone-location",
            fillColor: "yellow",
            opacity: 0.3,
            fillOpacity: 0.2,
            radius: 5000
          });
          let node = L.marker(
            {
              lon: res["1"][0].LON,
              lat: res["1"][0].LAT
            },
            {
              icon: L.divIcon({
                className: "phone-location-center",
                html: `<div class="range-marker range-center">
	                   
	                   </div>
	                   <div style="margin-left: 5px; z-index: 1">
	                     <span style="font-weight: bold; font-size: 18px">${res["1"][0].LON}, ${res["1"][0].LAT}</span>
	                   </div>`
              })
            }
          );
          node.on("click", () => {
            $(".phone-location").remove();
            $(".phone-location-center").remove();
            this.detailMarker.remove();
            $(".phone-location-start-point").remove();
            $(".phone-location-end-point").remove();
          });
          circle.on("click", e => {
            // console.log(e)
            // e.originalEvent.preventDefault()
            let influence = JSON.parse(res["1"][0].INFLUENCE);
            console.log("点击报点位置", pkid, influence);
            let influencePopperTable = influence.map((i, index) => {
              let startPoint = L.marker(
                {
                  lon: i.DATA[0].GPS_X,
                  lat: i.DATA[0].GPS_Y
                },
                {
                  icon: L.divIcon({
                    className: "phone-location-start-point",
                    html: `<span style="background:aqua;color:black;width:18px;height:18px;display:inline-block;border-radius:18px;margin-left:2px;">${i.LINE_NAME.substr(
                      0,
                      1
                    )}</span>`
                  })
                }
              );
              let endPoint = L.marker(
                {
                  lon: i.DATA[1].GPS_X,
                  lat: i.DATA[1].GPS_Y
                },
                {
                  icon: L.divIcon({
                    className: "phone-location-end-point",
                    html: `<span style="background:mediumpurple;color:black;width:18px;height:18px;display:inline-block;border-radius:18px;margin-left:2px;">${i.LINE_NAME.substr(
                      0,
                      1
                    )}</span>`
                  })
                }
              );
              this.map.addLayer(startPoint);
              this.map.addLayer(endPoint);
              // this.map.setView([i.DATA[1].GPS_Y, i.DATA[1].GPS_X], 10)
              return `<tr><td>${i.LINE_NAME}</td><td>${i.DATA[0].LINE_KM_DIS}</td><td>${i.DATA[1].LINE_KM_DIS}</td></tr>`;
            });
            let popper = L.divIcon({
              className: "detail-pop-container",
              iconSize: [10, 10],
              popupAnchor: [500, 500],
              html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(10px, 260px, 0px); bottom: 0px;">
						              <a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
						              <div class = "leaflet-popup-content-wrapper marker-houqing-info-popup">
							                <div class="leaflet-popup-content no-padding" style="position:relative;width:300px;height: 300px;">
								                <i class="marker-gongwu-info-tip zyc"></i>
								                <div class="marker-gongwu-info" style="width: 300px">
								                  <table border="0" cellpadding="0" cellspacing="0">
								                    <tbody>
								                      <tr>
								                        <td colspan="2">
								                          <div id="qxDetailTitle" style="width: 100%; height: 20px; display: flex; flex-direction: row; justify-content: space-evenly">
								                            <div style="display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">经度: <br /><label class="blue">${parseFloat(
                res["1"][0].LON
              ).toFixed(4)}</label></div>
								                            <div style="display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">纬度: <br /><label class="blue">${parseFloat(
                res["1"][0].LAT
              ).toFixed(4)}</label></div>
								                            <div style="display: flex; flex-direction: column; align-content: center; align-items: center; justify-content: center">上报电话: <br /><label class="blue">${res["1"][0].PHONE
                }</label></div>
												                  </div>
												                  <div id="qxTable" style="height: calc(100% - 40px); margin-top: 40px">
												                    <table class="detail-table" cellpadding="0" cellspacing="0">
												                      <thead><tr><th>线别</th><th>起点</th><th>终点</th></tr></thead>
												                      <tbody>
												                        ${influencePopperTable.join("")}
														                  </tbody>
													                  </table>
												                  </div>
											                  </td>
								                      </tr>
							                      </tbody>
	                                </table>
	                              </div>
							                </div>
						              </div>
				                </div>`
            });
            this.detailMarker = L.marker(
              {
                lon: parseFloat(res["1"][0].LON) + 0.03,
                lat: res["1"][0].LAT
              },
              {
                icon: popper
              }
            );
            this.map.addLayer(this.detailMarker);
          });
          this.map.addLayer(circle);
          this.map.addLayer(node);
          this.map.setView(latlng, 12);
        }
      );
    },
    // 切换控制面板
    changeFilterTab(name) {
      this.curTab = name;
      if (name !== "基础" || name !== "灾害") {
        this.eqOther.effectShow = false;
      }
      if (name !== "灾害") {
        // 清除所有地震影响图示的图层
        console.log("清除地震图层");
        this.eqOther.layerVisible = false;
        if (this.config.earthquake.register) {
          earthquake.hideEqLayers();
        }
      }
      this.$emit("controllerTabChange", name);
    },
    //==================== 地震相关 开始 ========================//
    // 添加一个地震点
    addEarthquake() {
      earthquake.addEarthquake();
    },
    changeEarthquakeToolbar() {
      this.eqOther.addShow = !this.eqOther.addShow;
      this.eqOther.uploadShow = false;
      this.eqOther.effectShow = false;
    },
    changeEarthquakeUploadToolbar() {
      this.eqOther.uploadShow = !this.eqOther.uploadShow;
      this.eqOther.addShow = false;
      this.eqOther.effectShow = false;
    },
    //==================== 地震相关 结束 ========================//

    //==================== 区域相关 开始 ========================//
    // 新增、修改区域
    handleSaveQuyu(qy, add) {
      let trains = "";
      if (add) {
        trains = this.kuanXuangTrainsCls([qy]);
      }
      boundRegion.handleSaveQuyu(qy, add, trains);
    },
    // 删除区域
    handleDeletQuyu(qy, index) {
      boundRegion.handleDeletQuyu(qy, index);
    },
    //==================== 区域相关 结束 ========================//
    // 设置地图位置(提供给外部调用)
    setMapView(latlng, zoom) {
      this.map.setView(latlng, zoom || this.config.superMap.zoom);
    },
    // 开始测距
    startRanging() {
      ranging.startDraw();
    },
    // 切换框选列车状态
    changeDrawFlag(isCancel, isAdd) {
      if (isCancel) {
        this.boundRegionOther.formVisible = false; //关闭区域窗口
        if (isAdd) {
          drawRegion.clearAll(false); //新增区域后状况，则不删除已绘制区域
        } else {
          drawRegion.clearAll(true); //删除所有记录，包括最新绘制区域
        }
      } else {
        drawRegion.startDraw(false);
      }
    },
    changeDrawCountFlag(isCancel, isAdd) {
      if (isCancel) {
        this.boundRegionOther.formVisible = false; //关闭区域窗口
        if (isAdd) {
          drawRegion.clearAll(false); //新增区域后状况，则不删除已绘制区域
        } else {
          drawRegion.clearAll(true); //删除所有记录，包括最新绘制区域
        }
      } else {
        console.log("应急框选列车");
        drawRegion.startDraw(true);
      }
    },
    changeYjSrcDrawFlag(isCancel, isAdd) {
      if (isCancel) {
        this.boundRegionOther.formVisible = false;
        if (isAdd) {
          drawRegion.clearAll(false); //新增区域后状况，则不删除已绘制区域
        } else {
          drawRegion.clearAll(true); //删除所有记录，包括最新绘制区域
        }
      } else {
        console.log("框选应急资源范围");
        drawRegion.startDraw(true, true);
      }
    },
    clearDrawRegion() {
      // console.log('关闭框选窗口')
      drawRegion.clearAll(true);
    },
    // 添加框选车效果
    kuanXuangTrainsCls(_regions) {
      const regions = _regions ? _regions : this.boundRegionOther.region;
      const rsTrains = [];
      this.trainOhter.tarinData.forEach(train => {
        regions.forEach(quyu => {
          if (
            quyu.visible &&
            mapUtil.isPointInPoly(train.pointXY, quyu.POINT_LIST)
          ) {
            rsTrains.push(train.TRAIN_ID);
            C.$("#" + train.TRAIN_ID)
              .addClass("kuang-xuang")
              .attr("group", quyu.REGION_ID);
          }
        });
      });
      return rsTrains;
    },
    getYjSrcs() {
      let selectedItems = [];
      for (let key in yjSrcDic.emergencyResourcesDic) {
        let visibleKeys = yjSrcDic.emergencyResourcesDic[key].visible.split(
          "."
        );
        let ifVisible = this;
        visibleKeys.map(k => {
          ifVisible = ifVisible[k];
        });
        // console.log('资源选定情况', yjSrcDic.emergencyResourcesDic[key].name, ifVisible)
        if (ifVisible) {
          selectedItems.push(key);
        }
      }
      const loading = this.$loading({
        lock: true,
        text: "正在获取应急资源数据...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // console.log('获取绘制边缘点', this.yjDrawRegionPts, selectedItems)
      yjSrcDic
        .queryEmergencyResources(selectedItems, this.yjDrawRegionPts)
        .then(data => {
          this.yjSrcSources = data;
          console.log(this.yjSrcSources);
          this.$store.commit(
            "earthquake/updateEmergencySources",
            this.yjSrcSources
          );
          this.yjSrcDialog = true;
          loading.close();
        })
        .catch(e => {
          this.$message.warning("获取应急资源信息失败", e);
          loading.close();
        });
    },
    /**添加管界车效果
     * @param {Object} trains
     * @param {Object} bounds
     */
    setBoundsTrainEffect(_trains, _bounds) {
      const trains = _trains ? _trains : this.trainOhter.tarinData;
      const bounds = _bounds ? _bounds : this.boundRegionOther.bounds;
      // 显示管界，且有车有管界
      if (config.boundRegion.bound && trains.length > 0 && bounds.length > 0) {
        let wd = 0;
        let ddwd = 0;
        trains.forEach(train => {
          train.inBound = false;
          bounds.forEach(bound => {
            if (mapUtil.isPointInPoly(train.pointXY, bound)) {
              train.inBound = true;
              C.$("#" + train.TRAIN_ID).addClass("in-bound");
              if (parseInt(train.EDTIME) >= 5) {
                wd++;
                if (train.dandang) {
                  ddwd++;
                }
              }
            }
          });
        });
        this.trainOhter.total_wd = wd; //数量统计-晚点
        this.trainOhter.total_ddwd = ddwd; //数量统计-担当晚点
      }
    },
    /**
     * 将点击marker弹出的popu居中
     * @param {Object} latlng 点击经纬度
     * @param {Object} diff 距顶部偏移相素(number)
     * @param {Object} cb 回调函数
     */
    centerMaker(latlng, diff, cb) {
      this.map.setView(latlng);
      setTimeout(() => {
        let transform = $(".leaflet-pane.leaflet-map-pane")
          .css("transform")
          .split(",");
        transform[5] = parseInt(transform[5].split(")")[0]) + diff + ")";
        transform = transform.join(",");
        $(".leaflet-pane.leaflet-map-pane").css("transform", transform);
        cb();
      }, 400);
    },
    saveCanvas() {
      let a = document.createElement("a");
      const opts = {
        trainttest: true,
        useCORS: true
      };
      html2canvas(document.body, opts).then(canvas => {
        let dom = document.body.appendChild(canvas);
        // dom.style.diaplay = "none";
        a.style.diaplay = "none";
        // document.body.removeChild(dom);
      });
    },
    /* @info  数据交互区-----------------------------------*/
    // 获取地图配置
    getMapConfig(cb) {
      // code	tyzd_zxy2001
      // sql	[["单位id","人员id"]]

      const _sys = this.sys;
      if (this.sys === "police") {
        console.log("")
        console.log("C.ADDS.servGS", C.ADDS.servGS)
        C.getData(
          {
            s: [
              //列车警务调度指挥系统 则 使用 信息技术所单位配置
              _sys + "_" + this.$store.state.params.Oid,
              _sys + "_" + this.$store.state.params.UserPID
            ],
            // c: "tyzd_zxy2001",
            c: "tyzd_zxy2001@kyz_0001",
            a: "【tyzd_zxy2001】获取指定单位/人员权限信息",
            url: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet", //接口地址
            // url: C.ADDS.servGS, //接口地址
            async: true
          },
          r => {
            console.log("调用tyzd_zxy2001", r)
            this.getMapConfigInit({ "1": r }, cb);
          }
        );
      } else {
        C.getDataP123(

          {
            s: [
              [
                //列车警务调度指挥系统 则 使用 信息技术所单位配置
                _sys +
                "_" +
                (_sys === "kygl"
                  ? "99990002001499A50004"
                  : this.$store.state.params.Oid),
                _sys + "_" + this.$store.state.params.UserPID
              ]
            ],
            c: "tyzd_zxy2001",
            a: "【tyzd_zxy2001】获取指定单位/人员权限信息",
            url: C.ADDS.servGS, //接口地址
            async: true
          },
          r => {
            this.getMapConfigInit(r, cb);
          }
        );
      }
    },
    getMapConfigInit(r, cb) {
      if (r) {
        let myConfig0 = ""; //单位
        let myConfig1 = ""; //个人
        r["1"].forEach(v => {
          if (v.AUTH_OBJ !== "{}") {
            if (v.AUTH_TYPE === "1") {
              myConfig1 = v;
            } else {
              myConfig0 = v;
            }
          }
        });
        let myConfig = myConfig1 !== "" ? myConfig1 : myConfig0; //优先使用个人
        console.info("获取到地图配置信息", myConfig);
        if (myConfig) {
          const remoteConfig = JSON.parse(myConfig.AUTH_OBJ);
          this.config = Object.assign(this.config, remoteConfig);
          if (this.mapConfig.center) {
            const _center = this.mapConfig.center.split(",");
            this.config.superMap.center = [
              parseFloat(_center[0]),
              parseFloat(_center[1])
            ]; // 外部自定义地图中心点
          }
          this.mapConfig.zoom
            ? (this.config.superMap.zoom = this.mapConfig.zoom)
            : null; // 外部自定义地图当前层级
          cb();
        } else {
          this.$alert("您单位或个人未注册地图服务，请联系管理员", "提示", {
            confirmButtonText: "确定"
          });
        }
      }
    },
    // 获取个人软电话号码
    getPhoneGroupNo() {
      if (config.btns.phone || config.trainContextMenu.phone) {
        C.getDataP123(
          {
            s: [[this.$store.state.params.UserEncode]],
            c: "eqeh_zxy2004@kyz_0001",
            a: "【eqeh_zxy2004】获取个人软电话号码",
            url: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet", //接口地址
            // url: C.ADDS.servGS, //接口地址

            async: true
          },
          r => {
            // {CDR_TEL: "34465",VIRTUAL_TEL: "1001"}
            if (r["1"].length > 0) {
              this.prefix = r["1"][0].CDR_TEL;
              this.initGroupNo = r["1"][0].VIRTUAL_TEL;
            }
          }
        );
      }
    },
    // 获取单位管辖车站
    getOwnerStations(_oid) {
      const oid = _oid.toUpperCase();
      if (
        oid !== "99990002001499A50004" &&
        typeof this.ownerStations[oid] === "undefined"
      ) {
        C.getData(
          {
            url: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet", //接口地址
            // url: C.origin + "/PTMS/GeneralProServlet", //接口地址
            c: "0695@kyz_0001",
            s: [oid],
            a: "【0695】获取单位管辖车站"
          },
          r => {
            this.ownerStations[oid] = r;
          }
        );
      }
    },
    // 获取线别
    getLines() {
      C.getData(
        {
          url: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet", //接口地址
          // url: C.ADDS.servGS, //接口地址
          c: "tyzd_zxy2006@kyz_0001",
          s: [],
          a: "获取线别字典"
        },
        r => {
          if (this.sys != "police") {
            this.lines = r.data[1];
          } else {
            this.lines = r;
          }
        }
      );
    },
    applyStatData(data) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs["stat"].applyData(data);
        });
      }, 100);
    },
    handleBeforeUpload(file) {
      this.eqUploader.filename = file.name;
    },
    handleFileUploadSuccess(res, file, fileList) {
      file.remoteURL = res["info"][0]["fileUrl"];
      this.eqUploader.url = file.remoteURL;
      console.log("文件已上传", this.eqUploader.filename, this.eqUploader.url);
      console.log(this.$refs["upload"], this.$refs["uploadL"]);
      if (this.$refs["uploadL"] !== undefined) {
        this.$refs["uploadL"].clearFiles();
      } else {
        this.$refs["upload"].clearFiles();
      }
    },
    uploadEarthquake() {
      console.log("上传地震", this.eqUploader.url);
      const loading = this.$loading({
        lock: true,
        text: "正在上传...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      C.getDataP123(
        {
          c: "eqeh_zhaoyue9001",
          s: [this.eqUploader.url],
          url: "https://10.192.126.203/GeneralProServlet"
        },
        res => {
          earthquake.getEarthquake(true, "");
          this.$emit("controllerTabChange", "灾害");
          loading.close();
        }
      );
    },
    jumpToReport() {
      let url = this.$router.resolve({
        path: "/Reports"
      });
      window.open(url.href, "_blank");
    }
  },
  // 监视属性
  watch: {
    // 全局搜索车次
    globalFilterStr(v) {
      if (this.globalFilterType === "cc") {
        this.globalFilterStr = C.parseTrainCode(v);
      } else if (this.globalFilterType === "cz") {
        this.globalFilterStr = v
          .toUpperCase()
          .replace(/[^\A-\Z\u4E00-\u9FA5]/g, "");
      }
    },
    // 单位发生改变
    oid(v) {
      this.getOwnerStations(v);
      // 注册在途车，
      if (this.config.train.register) {
        // 注册了担当车
        if (this.config.dandang.register) {
          train.creatTrain(this.allTrains); //重新绘制在途车（修改车上的担当单位数据）
        }
      }
      // 注册管界、区域
      if (this.config.boundRegion.register) {
        if (this.config.boundRegion.bound) {
          boundRegion.getBound(); //获取管界
        }
      }
    },
    // 地图中心点改变
    "mapConfig.center"(v) {
      const _center = v.split(",");
      this.map &&
        this.map.setView([parseFloat(_center[0]), parseFloat(_center[1])], 10); //平移地图
    },
    // 右侧信息窗口隐藏事件
    "rightInfoWin.visible"(v) {
      if (!v) {
        guiDaoChe.drawHistory({}, "全部");
      }
    }
  }
};
</script>

<!-- 私有样式 -->
<style scoped="scoped">
>>> .ownSelect .el-input__inner {
  padding: 0 5px;
}

>>> .group-body .el-checkbox {
  margin: 5px 0;
  width: 50%;
}

>>> .light-filter-area-content .el-checkbox {
  margin: 5px 0;
  width: 50%;
}

>>> .el-checkbox__label {
  padding-left: 0px;
}

>>> .el-checkbox__inner {
  background-color: #cfcfcf;
  border-radius: 4px;
}

>>> .el-button {
  margin-left: unset;
  margin-right: 10px;
}

.lay {
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.filter-con {
  background-blend-mode: normal, normal;
  background-image: linear-gradient(-3deg, #0e1331 0%, #0d1567 100%),
    linear-gradient(#0e1743, #0e1743);
  border-image-slice: 1;
  border-image-source: linear-gradient(-2deg, #2d82cd 0%, #08233b 100%);

  border-style: solid;
  border-width: 1px;
  opacity: 0.89;
  overflow: hidden;
  padding: 26px 0px 0px 0px;
  position: absolute;
  z-index: 400;
  /* transition: height .3s,width .3s; */
}

.policeMin {
  display: none;
}

.light-filter-con {
  background-color: #0f50b1;
  height: 60px;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100vw;
  z-index: 400;
}

.light-filter-panel {
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 60px;
  width: 250px;
  z-index: 990;
}

.light-filter-panel .light-filter-area {
  width: 250px;
}

.light-filter-panel .light-filter-area .light-filter-area-title {
  align-content: center;
  align-items: center;
  background: rgba(15, 80, 177, 0.7);
  display: flex;
  height: 33px;
  justify-content: center;
  width: 250px;
}

.light-filter-panel .light-filter-area .light-filter-area-content {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /*align-content: center;*/
  padding: 10px;
  width: 250px;
}

.light-filter-panel .light-filter-area .light-filter-area-content > label {
  /*margin-right: 10px;*/
  color: #656e77;
}

.light-logo {
  background: url(../../components/map/img/wayLog.png) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  height: 37px;
  margin-left: 15px;
  width: 33px;
  z-index: 401;
}

.light-title {
  margin-left: 10px;
}

.light-navbar {
  display: flex;
  margin-left: 430px;
  max-width: 60vw;
}

.light-navbar .light-navbar-item {
  align-content: center;
  align-items: center;
  display: flex;
  height: 60px;
  justify-content: center;
  width: 100px;
}

.light-navbar .light-navbar-item > span {
  font-size: 16px;
  text-align: center;
}

.light-navbar .light-navbar-item:hover {
  background-color: #14304d;
  cursor: pointer;
}

.light-navbar .light-navbar-item.selected {
  background-color: #14304d;
}

.light-navbar .light-navbar-item.selected > span {
  font-weight: bolder;
}

.light-navbar .light-navbar-item:hover > span {
  font-weight: bolder;
}

.light-general-search {
  display: flex;
  left: calc(50% - 250px);
  position: absolute;
  top: 80px;
  z-index: 900;
}

>>> .light-general-search .el-input-group__prepend {
  background-color: white;
  border-bottom: 1px solid #bdc5cc;
  border-left: 1px solid #bdc5cc;
  border-right: 1px solid #bdc5cc;
  border-top: 1px solid #bdc5cc;
}

>>> .light-general-search .el-input__inner {
  background-color: white;
  border-bottom: 1px solid #bdc5cc;
  border-left: 1px solid white;
  border-right: 1px solid #bdc5cc;
  border-top: 1px solid #bdc5cc;
  color: #656e77;
}

>>> .light-general-search .el-input-group__append {
  background-color: white;
  border-bottom: 1px solid #bdc5cc;
  border-left: 0;
  border-right: 1px solid #bdc5cc;
  border-top: 1px solid #bdc5cc;
}

.light-user {
  display: flex;
  position: absolute;
  right: 30px;
}

.light-user .light-avatar {
  background: url(../../components/map/img/light/avatar.png);
  background-size: 100% 100%;
  display: inline-block;
  height: 18px;
  width: 15px;
  z-index: 401;
}

.light-user .light-user-messageoff {
  background: url(../../components/map/img/light/avatar.png);
  background-size: 100% 100%;
  display: inline-block;
  filter: invert(11%) sepia(94%) saturate(5837%) hue-rotate(343deg)
    brightness(105%) contrast(108%);
  height: 18px;
  width: 15px;
  z-index: 401;
}

.light-user .light-user-messageon {
  background: url(../../components/map/img/light/avatar.png);
  background-size: 100% 100%;
  display: inline-block;
  filter: invert(58%) sepia(81%) saturate(3321%) hue-rotate(83deg)
    brightness(121%) contrast(122%);
  height: 18px;
  width: 15px;
  z-index: 401;
}

.light-earthquake-toolbar {
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  height: 40px;
  left: 40px;
  position: absolute;
  top: 120px;
  width: 500px;
  z-index: 450;
}

.light-earthquake-toolbar .toolbar-content {
  align-content: center;
  align-items: center;
  border-left: 2px solid #656e77;
  display: flex;
  height: 40px;
  padding: 5px;
  width: 420px;
}

.light-earthquake-toolbar .toolbar-ops {
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 40px;
  justify-content: space-between;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  width: 90px;
}

>>> .el-autocomplete {
  width: 500px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-select {
  background: url(./img/earthquake/select_normal.png);
  background-size: 100% 100%;
  height: 14px;
  width: 12px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-select:hover {
  background: url(./img/earthquake/select_enable.png);
  background-size: 100% 100%;
  cursor: pointer;
  height: 14px;
  width: 12px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-select-enable {
  background: url(./img/earthquake/select_enable.png);
  background-size: 100% 100%;
  height: 14px;
  width: 12px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-select-enable:hover {
  background: url(./img/earthquake/select_enable.png);
  background-size: 100% 100%;
  cursor: pointer;
  height: 14px;
  width: 12px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-upload {
  background: url(./img/earthquake/upload_normal.png);
  background-size: 100% 100%;
  height: 13px;
  width: 14px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-upload:hover {
  background: url(./img/earthquake/upload_enable.png);
  background-size: 100% 100%;
  cursor: pointer;
  height: 13px;
  width: 14px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-upload-enable {
  background: url(./img/earthquake/upload_enable.png);
  background-size: 100% 100%;
  height: 13px;
  width: 14px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-upload-enable:hover {
  background: url(./img/earthquake/upload_enable.png);
  background-size: 100% 100%;
  cursor: pointer;
  height: 13px;
  width: 14px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-pointer {
  background: url(./img/earthquake/pointer_normal.png);
  background-size: 100% 100%;
  height: 14px;
  width: 14px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-pointer:hover {
  background: url(./img/earthquake/pointer_enable.png);
  background-size: 100% 100%;
  cursor: pointer;
  height: 14px;
  width: 14px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-pointer-enable {
  background: url(./img/earthquake/pointer_enable.png);
  background-size: 100% 100%;
  height: 14px;
  width: 14px;
}

.light-earthquake-toolbar .toolbar-ops .toolbar-btn-pointer-enable:hover {
  background: url(./img/earthquake/pointer_enable.png);
  background-size: 100% 100%;
  cursor: pointer;
  height: 14px;
  width: 14px;
}

>>> .light-upload-panel .el-input__inner {
  color: #656e77 !important;
}

>>> .light-upload-panel .el-input.is-disabled .el-input__inner {
  color: #656e77 !important;
}

>>> .light-upload-panel .el-textarea__inner {
  color: #656e77 !important;
}

>>> .light-pointer-panel .el-input__inner {
  color: #656e77 !important;
  padding-left: 1px;
  padding-right: 1px;
}

>>> .light-pointer-panel .el-input.is-disabled .el-input__inner {
  color: #656e77 !important;
  padding-left: 1px;
  padding-right: 1px;
}

>>> .light-pointer-panel .el-textarea__inner {
  color: #656e77 !important;
  padding-left: 1px;
  padding-right: 1px;
}

>>> .gaSearch .el-autocomplete {
  position: relative;
  display: inline-block;
  background: rgba(255, 255, 255, 0.9) !important;
}

>>> .gaSearch .el-autocomplete .el-input__inner {
  color: #000;
  border: 0.1px solid #999999;
  caret-color: #007aff;
  border-radius: 0%;
  height: 30px;
}

/* >>> .el-slider {
  background: transparent !important;
  color: #000000 !important;
} */

>>> .el-slider__bar {
  background: #007aff;
}

>>> .el-slider__input {
  background-color: #2d82cd;
  color: #000;
}

.light-user .light-username {
  margin-left: 5px;
}

.filter-con.big {
  overflow: visible;
  /* height: 750px; */
  /*与 filter-body 高度一致*/
}

.filter-change-tool {
  cursor: pointer;
  height: 26px;
  left: 0;
  line-height: 26px;
  position: absolute;
  text-align: center;
  top: 0px;
  width: 100%;
}

.filter-change-tool:hover {
  opacity: 0.8;
}

.tab {
  bottom: 0px;
  max-height: 800px;
  overflow-y: scroll;
  position: absolute;
  right: -35px;
  top: 10px;
  width: 35px;
}

.tab::-webkit-scrollbar {
  width: 0px;
}

.tab > div {
  color: #1e797f;
  font-size: 16px;
  height: auto;
  line-height: 16px;
  margin-top: -10px;
  padding: 22px 0;
  position: relative;
  width: 100%;
  z-index: 1;
}

.tab > div > span {
  background: url(img/tabDefault.png) no-repeat 1px -50px;
  background-size: 34px 200px;
  display: block;
  height: auto;
  padding: 0 5px 0px 6px;
  width: 100%;
}

.tab > div::before {
  background: url(img/tabDefault.png) no-repeat center 0px;
  content: "";
  height: 22px;
  left: 0;
  position: absolute;
  right: 0px;
  top: 0;
}

.tab > div::after {
  background: url(img/tabDefault.png) no-repeat center -76px;
  bottom: 0;
  content: "";
  height: 22px;
  left: 0;
  position: absolute;
  right: 0px;
}

.tab > div.active {
  color: #20d0db;
  z-index: 2;
}

.tab > div.active > span {
  background: url(img/tabActive.png) no-repeat 1px -50px;
  background-size: 34px 200px;
}

.tab > div.active::before {
  background: url(img/tabActive.png) no-repeat center 0px;
}

.tab > div.active::after {
  background: url(img/tabActive.png) no-repeat center -76px;
}

.tab > div:hover {
  cursor: pointer;
  opacity: 0.8;
}

.filter-body {
  height: 0px;
  overflow: hidden;
  width: 100%;
}

.filter-con.big > .filter-body {
  height: 100%;
  overflow: auto;
}

.group-title {
  background: rgba(255, 255, 255, 0.09);
  font-weight: bold;
  padding: 5px;
  text-align: center;
}

.group-body {
  line-height: 26px;
  padding: 10px;
}

.group-body.flex {
  display: flex;
  justify-content: space-between;
}

.tool-img-btn {
  height: 40px;
  vertical-align: middle;
  width: 40px;
}

.tool-img-btn:hover {
  cursor: pointer;
  opacity: 0.9;
}

/* 公共iframe 弹窗口 */
.p-dialog {
  background: #0f1542;
  left: 50%;
  padding-top: 30px;
  position: absolute;
  top: 50%;
  z-index: 800;
}

.p-dialog > .head {
  border-bottom: 1px solid #696655;
  font-weight: bold;
  height: 30px;
  left: 0px;
  line-height: 30px;
  padding-left: 10px;
  position: absolute;
  top: 0px;
  width: 100%;
}

.p-dialog > .head > i {
  color: red;
  cursor: pointer;
  float: right;
  margin: 7px;
}
/* 公安iframe弹窗口 */
.p-dialog-light {
  background: #2d82cd;
  left: 50%;
  padding-top: 30px;
  position: absolute;
  top: 50%;
  z-index: 800;
}

.p-dialog-light > .head {
  border-bottom: 1px solid #696655;
  font-weight: bold;
  height: 30px;
  left: 0px;
  line-height: 30px;
  padding-left: 10px;
  position: absolute;
  top: 0px;
  width: 100%;
}

.p-dialog-light > .head > i {
  color: red;
  cursor: pointer;
  float: right;
  margin: 7px;
}

.p-dialog-bridge-light {
  background: #fff;
  left: 50%;
  padding-top: 30px;
  position: absolute;
  top: 50%;
  z-index: 800;
  border: black solid 1px;
}

.p-dialog-bridge-light > .head {
  height: 30px;
  left: 0px;
  line-height: 30px;
  padding-left: 10px;
  position: absolute;
  top: 0px;
  width: 100%;
}

.p-dialog-bridge-light > .head > i {
  color: rgb(38, 42, 43);
  font-weight: bold;
  cursor: pointer;
  float: right;
  margin: 12px;
}

.light-panel {
  background-color: transparent;
  height: calc(100vh - 60px);
  left: 0;
  position: absolute;
  top: 60px;
  transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
  width: 50px;
  z-index: 451;
}

.light-panel-show {
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.7);
  height: calc(100vh - 60px);
  left: 0;
  position: absolute;
  top: 60px;
  transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
  width: 500px;
  z-index: 451;
}

.hide-switch {
  background: url(./img/switch.png);
  background-size: 100% 100%;
  display: inline-block;
  height: 56px;
  left: 471px;
  position: absolute;
  top: 440px;
  transform: rotate(180deg);
  transition: left 0.4s ease-in-out;
  width: 29px;
  z-index: 451;
}

.unhide-switch {
  background: url(./img/switch.png);
  background-size: 100% 100%;
  display: inline-block;
  height: 56px;
  left: 0;
  position: absolute;
  top: 440px;
  transition: left 0.4s ease-in-out;
  width: 29px;
  z-index: 451;
}

.light-panel-show .favorite-filters {
  background: white;
  border-radius: 15px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  height: 75vh;
  margin: 30px;
  width: 440px;
  /* transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out; */
}

.light-panel-show .other-ops {
  background: white;
  border-radius: 15px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  height: 10vh;
  margin: 30px;
  width: 440px;
  /* transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out; */
}

.light-user .switch-light-icon {
}

.light-user .switch-dark-icon {
}

.phone-location-marker {
  background: url("");
}

>>> .el-switch__label {
  color: #8c8c8c !important;
}

>>> .el-switch__label * {
  font-size: 20px;
}

>>> .el-switch__label.is-active {
  color: white !important;
  text-shadow: 0px 0px 10px white;
}

.light-filter-panel
  .light-filter-area
  .light-filter-area-content
  >>> .el-input__inner::placeholder {
  color: black !important;
}

.light-filter-panel
  .light-filter-area
  .light-filter-area-content
  >>> .el-input__inner {
  color: black !important;
}

div.lay-main
  > div.map-con
  > div
  > div:nth-child(20)
  > div
  > div.el-dialog__body
  > div
  >>> .detail
  > h3 {
  color: white;
}

div.lay-main
  > div.map-con
  > div
  > div:nth-child(20)
  > div
  > div.el-dialog__body
  > div
  >>> .detail
  > p {
  color: white;
}

.hide-switch {
  background: url(./img/switch.png);
  width: 29px;
  height: 56px;
  background-size: 100% 100%;
  display: inline-block;
  z-index: 451;
  position: absolute;
  right: 471px;
  top: 440px;
  transition: right 0.4s ease-in-out;
}

.hide-switch.dark-switch {
  right: 405px !important;
  transition: none !important;
}

.unhide-switch {
  background: url(./img/switch.png);
  transform: rotate(180deg);
  width: 29px;
  height: 56px;
  background-size: 100% 100%;
  display: inline-block;
  z-index: 451;
  position: absolute;
  right: 0;
  top: 440px;
  transition: right 0.4s ease-in-out;
}

.unhide-switch.dark-switch {
  transition: none !important;
}

.hide-police-left-switch {
  background: url(./img/switch_ga.png);
  width: 14px;
  height: 14px;
  background-size: 100% 100%;
  display: inline-block;
  z-index: 451;
  position: absolute;
  left: 0;
  top: 440px;
  transition: left 0.4s ease-in-out;
}

.hide-police-right-switch {
  background: url(./img/switch_ga.png);
  transform: rotate(180deg);
  width: 14px;
  height: 14px;
  background-size: 100% 100%;
  display: inline-block;
  z-index: 451;
  position: absolute;
  right: 0;
  top: 440px;
  transition: right 0.4s ease-in-out;
}

.hide-police-left-switch.light-switch {
  transition: none !important;
}

.hide-police-right-switch.light-switch {
  transition: none !important;
}

.unhide-police-left-switch {
  background: url(./img/switch_ga.png);
  transform: rotate(180deg);
  width: 14px;
  height: 14px;
  background-size: 100% 100%;
  display: inline-block;
  z-index: 451;
  position: absolute;
  left: 260px;
  top: 440px;
  transition: left 0.4s ease-in-out;
}

.unhide-police-right-switch {
  background: url(./img/switch_ga.png);
  width: 14px;
  height: 14px;
  background-size: 100% 100%;
  display: inline-block;
  z-index: 451;
  position: absolute;
  right: 260px;
  top: 440px;
  transition: right 0.4s ease-in-out;
}

.unhide-police-left-switch.light-switch {
  left: 265px !important;
  transition: none !important;
}

.unhide-police-right-switch.light-switch {
  right: 270px !important;
  transition: none !important;
}

.select-area {
  width: 120px;
  background: rgba(255, 255, 255, 0.9);
}

.select-area >>> .el-input__inner {
  color: #000;
  height: 30px;
  border: 0.1px solid #999999;
  border-radius: 0%;
}
.select-area >>> .el-input__suffix {
  top: 5px;
}
.select-area >>> .el-input__icon {
  line-height: inherit;
}
.select-area >>> .el-input__suffix-inner {
  display: inline-block;
}

.ga-return {
  position: absolute;
  top: 63px;
  width: auto;
  height: auto;
  left: 200px;
  color: black;
  background: rgb(105, 146, 206);
  padding: 2px;
  /* z-index: 400;
  border:#cfcfcf 0.5px; */
}
.ga-return:hover {
  cursor: pointer;
}

/* .light-panel .favorite-filters {
			height: 75vh;
			width: 0px;
			margin: 30px;
			background: white;
			border-radius: 15px;
			box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
			transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
		  }

		  .light-panel .other-ops {
			height: 10vh;
			width: 0px;
			margin: 30px;
			background: white;
			border-radius: 15px;
			box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
			transition: width 0.4s ease-in-out, background-color 0.4s ease-in-out;
		  } */
</style>
<style scoped="scoped" src="./css/onWayTrainTotal.css"></style><!-- 在途车数量统计 -->

<!-- 公有样式（会影响全局） -->
<style src="./css/blue.css"></style><!-- 蓝色调 -->
<style src="./css/Index.css"></style><!-- 本组件 -->
<style src="./css/station.css"></style><!-- 车站 -->
<style src="./css/gongDian.css"></style><!-- 供电 -->
<style src="./css/jiWu.css"></style><!-- 机务 -->
<style src="./css/yunShu.css"></style><!-- 运输 -->
<style src="./css/tuFang.css"></style><!-- 土房 -->
<style src="./css/jiaotong.css"></style><!-- 交通 -->
<style src="./css/earthquake.css"></style><!-- 地震 -->
<style src="./css/weather.css"></style><!-- 天气 、天气预警-->
<style src="./css/qiaoSui.css"></style><!-- 桥遂 -->
<style src="./css/houQing.css"></style><!-- 后勤 -->
<style src="./css/huoYun.css"></style><!-- 后勤 -->
<style src="./css/train.css"></style><!-- 列车样式 -->
<style src="./css/gongWu.css"></style>
<style src="./css/dk.css"></style>
<style src="./css/dianWu.css"></style>
<style src="./css/keYun.css"></style>
<style src="./css/gongAn.css"></style>
<style>
.eqDialog {
  margin-top: 1vh !important;
}
</style>
