<template>
	<div class="b-lay">
		<div class="b-lay-item b-lay-main" :class="{'mini':isMini}">
			<div class="main-top">
				<div class="main-top-top">
					<div class="log"></div>
				</div>
			</div>
			<div class="main-center">
				<div class="main-center-item map">
					<div class="main-center-item left w30" :class="{'hidden':bigMap}">
						<div class="w100 h100">
							<!-- 旅客发送及收入情况 -->
							<ItemBox>
								<div style="height: 32%;width:100%;">
									<div class="shadow-txt" style="text-align: center;">旅客发送及收入情况</div>
									<CL1></CL1>
								</div>
								<div style="height: 38%;width:100%;">
									<tabs :tabsList="[{id:0,text:'预计客流情况(上车)'}]" style="height: 30px;"></tabs>
									<CL2></CL2>
								</div>
								<div style="height: 30%;width:100%;">
									<tabs :tabsList="[{id:0,text:'旅客发送分析TOP8'}]" style="height: 30px;"></tabs>
									<CL3></CL3>
								</div>
							</ItemBox>
						</div>
					</div>
					<!-- 地图 -->
					<div class="main-center-item map-con" :class="{'full':bigMap}">
						<div class="map-border-top"></div>
						<div class="map-border-right"></div>
						<div class="map-border-bottom"></div>
						<div class="map-border-left"></div>
						<div class="map-view-icon"  @click="changeMapView">
							<a v-if="bigMap" class="icon iconfont icon-msnui-fullsceen-exit"></a>
							<a v-else class="icon iconfont icon-msnui-fullscreen"></a>
						</div>
						<!-- 地图 -->
						<iframe :src="mapWebUrl" style="width: 100%;height: 100%;"></iframe>
					</div>
					<div class="main-center-item right w30" :class="{'hidden':bigMap}">
						<div class="w100 h100">
							<ItemBox>
								<div style="height: 50%;width:100%;" >
									<div class="shadow-txt" style="text-align: center;">客运车站股道占用</div>
									<CR1></CR1>
								</div>
								<div style="height: 50%;width:100%;">
									<CR2></CR2>
								</div>
							</ItemBox>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import tabs from "../../../components/bigScreen/KydTabs";
	import ItemBox from "./ItemBox.vue"; //
	import DataPanel from "../../../components/bigScreen/DataPanel1.vue"; //每个组件的蓝色方框
	// import IndexMap from './IndexMap.vue';

	import CL1 from './CL1.vue'; //旅客发送及收入
	import CL2 from './CL2.vue'; //客流分析
	import CL3 from './CL3.vue'; //旅客发送分析
	import CR1 from './CR1.vue'; //客运车站股道占用
	import CR2 from './CR2.vue'; //设备故障分析

	// 遵义车务段管辖站：	["遵义","遵义南","息烽","桐梓北","桐梓东","娄山关南","修文县"]
	// 					["ZYE","ZNE","XFW","TBE","TDE","LSE","XW0"]
	const url = "http://10.192.6.176:9090/TRDM/GeneralProServlet";

	export default {
		components: {
			tabs,
			// IndexMap,
			DataPanel,
			ItemBox,
			CL1,
			CL2,
			CL3,
			CR1,
			CR2,
		},
		data() {
			return {
				urlP: this.$store.state.params,
				bigMap:false,//是否为大地图模式
				// 是否为小屏模式
				isMini: true,
				mapWebUrl: "http://10.192.6.155:9090/JFLCMS/tempZYMAP/index-safety.html#/pages/khztfbSafety?init_type=1&lon=27.641135909266257&lat=106.76613823823502&zoom=7&isKy=1",
			}
		},
		created() {
			// 组件创建完毕后，将当前地图模块设置为 default
			this.isMini = window.innerWidth < 3000;
			// setInterval(() => {
			// 	this.myNum = "" + Math.floor(Math.random() * 10000);
			// }, 1000 * 5);
		},
		mounted() {

		},
		methods: {
			/* @info  事件处理区-----------------------------------*/
			changeMapView(){
				this.bigMap = !this.bigMap;
			},
			// 切换左右视图
			changeView(k) {
				this[k] = !this[k];
				// 左右屏打开且未取过数据，则通知对应屏下子组件取数据
				if (this[k] && !this[k + "_flag"]) {
					this[k + "_flag"] = true;
				}
			},
			// 切换身份
			dataPanelTitleClick(title) {
				console.log(title);
			},
			//打开或者关闭 收入发送详情
			changeInfoDetailFlag() {
				this.infoDetailFlag = !this.infoDetailFlag;
			},
			/* @info  数据处理区-----------------------------------*/

			/* @info  数据交互区-----------------------------------*/
			
		}
	}
</script>

<style scoped="scoped">
	.b-lay {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		/* background-image: url("../../../assets/imgs/bigScreen/back.jpg"); */
		background-size: cover;
		background-position: center;
		color: white;
		background: #010713;
	}

	.b-lay-item {
		position: relative;
		display: inline-block;
		height: 100%;
		vertical-align: top;
		box-sizing: border-box;
	}

	.b-lay-item>.view {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 10px;
		padding-top: 80px;
	}

	.b-lay-item.mini>.view {
		padding-top: 40px;
	}

	.b-lay-item.mini.opened>.view {
		background: rgb(1, 7, 19);
	}

	/* 左 */
	.b-lay-left {
		width: 25%;
		padding: 0px;
		z-index: 410;
	}

	.b-lay-left.mini {
		position: absolute;
		width: 50%;
		left: -50%;
		z-index: 420;
		padding-right: 35px;
		transition: left 0.3s;
	}

	.b-lay-left.mini.opened {
		left: 0;
	}

	/* 中 */
	.b-lay-main {
		position: relative;
		width: 50%;
	}

	.b-lay-main.mini {
		width: 100%;
	}

	.main-top {
		position: relative;
		height: 72px;
	}

	.main-top-top {
		height: 72px;
	}

	.main-top-top>.log {
		width: 1920px;
		height: 72px;
		background: url("./img/logo.png") no-repeat;
		/*logo 是否居中*/
		margin: 0 auto;
	}

	/* 顶部数字 */
	.main-top-nums {
		position: absolute;
		padding-top: 40px;
		text-align: center;
		width: 100%;
		z-index: 410;
	}

	.main-center {
		position: absolute;
		top: 80px;
		left: 0px;
		right: 0px;
		bottom: 0px;
	}

	.main-center-item {
		position: absolute;
		z-index: 410;
	}

	.main-center-item.map {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.map-border-top {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 37px;
		background: url(img/map-box-top.png)repeat-x;
		background-position: 0px -20px;
		z-index: 420;
	}

	.map-border-right {
		position: absolute;
		top: 0px;
		right: 0;
		bottom: 0px;
		width: 37px;
		height: 100%;
		background: url(img/map-box-right.png)repeat-y;
		z-index: 420;
		transition: all .3s;
	}

	.map-border-bottom {
		position: absolute;
		left: 0;
		bottom: 0px;
		height: 37px;
		width: 100%;
		background: url(img/map-box-bottom.png)repeat-x;
		z-index: 420;
	}

	.map-border-left {
		position: absolute;
		top: 0px;
		left: 0;
		bottom: 0px;
		width: 37px;
		height: 100%;
		background: url(img/map-box-left.png)repeat-y;
		background-position: -20px 0px;
		z-index: 420;
		transition: all .3s;
	}
	
	.map-view-icon{
		position: absolute;
		top: 5px;
		right: 5px;
		z-index: 421;
		width: 50px;
		height: 28px;
		font-size: 22px;
		text-align: center;
		background: url(../../../assets/imgs/h-speedRailway/btn2.png)no-repeat;
		background-size: 100% 100%;
		color: white;
		cursor: pointer;
	}

	/* 中间左侧 */
	.main-center-item.left {
		top: 0px;
		left: 0;
		bottom: 0px;
		padding-bottom: 10px;
		padding-right: 0px;
		background: rgba(1, 7, 19, .8);
		z-index: 420;
		transition: all .3s;
	}
	.main-center-item.left.hidden{
		left: -50%;
	}

	/* 中间右侧 */
	.main-center-item.right {
		top: 0px;
		right: 0;
		bottom: 0px;
		padding-bottom: 10px;
		padding-left: 0px;
		background: rgba(1, 7, 19, .8);
		z-index: 420;
		transition: all .3s;
	}
	.main-center-item.right.hidden{
		right: -50%;
	}
	/* 中间底部 */
	.main-center-item.bottom {
		left: 0;
		bottom: 10px;
		width: 100%;
		height: 90px;
		text-align: center;
	}

	/* 收入发送详情 */
	.main-center-item.center {
		top: 10px;
		left: 25%;
		bottom: 10px;
		z-index: 420;
		transition: width 0.3s;
		overflow: hidden;
	}

	/* 地图容器 */
	.main-center-item.map-con {
		top: 0px;
		left: 30%;
		right: 30%;
		bottom: 0px;
		z-index: 420;
	}
	.main-center-item.map-con.full{
		left: 0;
		right: 0;
	}
	/* 右 */
	.b-lay-right {
		width: 25%;
		padding: 0px;
		z-index: 410;
	}

	.b-lay-right.mini {
		position: absolute;
		width: 50%;
		right: -50%;
		z-index: 420;
		padding-left: 35px;
		transition: right 0.3s;
	}

	.b-lay-right.mini.opened {
		right: 0;
	}

	/* 折叠按钮标题 */
	.view-tit {
		position: absolute;
		top: 0px;
		width: 35px;
		height: 184px;
		color: #20c8d5;
		font-size: 16px;
		text-align: center;
		padding-top: 70px;
		cursor: pointer;
	}

	.b-lay-left .view-tit {
		padding-right: 6px;
		right: -65px;
		background: url("../../../assets/imgs/bigScreen/lock-left.png") no-repeat;
	}

	.b-lay-left.mini.opened .view-tit {
		right: -35px;
	}

	.b-lay-right .view-tit {
		padding-left: 6px;
		left: -65px;
		background: url("../../../assets/imgs/bigScreen/lock-right.png") no-repeat;
	}

	.b-lay-right.mini.opened .view-tit {
		left: -35px;
	}

	/* 收起 */
	.close-arrow {
		position: absolute;
		height: 40px;
		line-height: 40px;
		top: 0px;
		color: #20c8d5;
		font-size: 16px;
		cursor: pointer;
	}

	.close-arrow:hover {
		font-weight: bold;
	}

	.b-lay-left .close-arrow {
		left: 10px;
		padding-left: 30px;
		background: url("../../../assets/imgs/bigScreen/arrow-left.png") no-repeat;
		background-position: 5px 10px;
	}

	.b-lay-right .close-arrow {
		right: 10px;
		padding-right: 30px;
		background: url("../../../assets/imgs/bigScreen/arrow-right.png") no-repeat;
		background-position: right 5px top 10px;
	}

	/* 左右视图容器 */
	.view-box {
		width: 100%;
		height: 100%;
	}

	.box-item {
		display: inline-block;
		vertical-align: top;
	}

	/* 各种高、宽 百分经*/
	.w100 {
		width: 100%;
	}

	.w25 {
		width: 25%;
	}

	.w30 {
		width: 30%;
	}

	.w35 {
		width: 35%;
	}

	.w50 {
		width: 50%;
	}

	.w75 {
		width: 75%;
	}

	.h100 {
		height: 100%;
	}

	.h80 {
		height: 80%;
	}

	.h60 {
		height: 60%;
	}

	.h75 {
		height: 75%;
	}

	.h50 {
		height: 50%;
	}

	.h40 {
		height: 40%;
	}

	.h20 {
		height: 20%;
	}

	.h25 {
		height: 25%;
	}

	.h30 {
		height: 30%;
	}

	.h33 {
		height: 33.33%;
	}

	.pw20 {
		padding: 0 20px;
	}

	.pr40 {
		padding-right: 40px;
	}

	.pl40 {
		padding-left: 40px;
	}

	.pw40 {
		padding: 0 40px;
	}

	.pt10 {
		padding-top: 10px;
	}

	.border {
		border: 1px solid red;
	}

	.center {
		left: 25%;
	}
</style>
<style>
	/* 标题字体颜色 */
	:root {
		--kyd2_tcolor: #D0C5E3;
	}

	/* 发光字体 */
	.shadow-txt {
		color: #D0C5E3;
		text-shadow: 0 0 10px #0000FF, 0 0 20px #fff;
	}
</style>
<!-- el-table 蓝色样式 -->
<style src="../../../assets/css/blueTable.css"></style>
<style src="../../../assets/css/EchartsBlue.css" scoped></style>
