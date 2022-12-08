<template>
	<div class="lay-con">
		<div class="lay" :class="{'big':bigScreen}">
			<div class="log"> </div>
			<!-- 中间主体内容 -->
			<div class="center-con">
				<div class="map-con2">
					<Map ref="myMap" style="background: #272f46;" sys="kygl" :oid="unitselectId" :oname="unitselectName" :toolsConfig="{left:'440px',bottom:'10px',height:'380px',lateRight:'440px'}"></Map>
				</div>
				<!-- 左侧 -->
				<div class="main-box leftMainBG">
				    <div></div>
				</div>
				<div class="main-box left"> </div>
				<!-- 右侧 -->
				<div class="main-box rightMainBG">
				    <div></div>
				</div>
				<div class="main-box right"> </div>
			</div>
			<!-- 左翅膀屏 -->
			<div class="wing-view left" :class="wingView.left" style="z-index:999">
				<div class="wing-view-head" style="text-align: right;">
					<a class="arrow-left" title="点击关闭" @click="openWingView('left','')"></a>
					<a v-show="wingView.left===''" class="arrow-right" title="点击展开" @click="openWingView('left','full')"></a>
				</div>
				<div class="wing-view-body">

				</div>
			</div>
			<!-- 右翅膀屏 -->
			<div class="wing-view right" :class="wingView.right" style="z-index:999">
				<div class="wing-view-head" style="text-align: left;">
					<a class="arrow-right" title="点击关闭" @click="openWingView('right','')"></a>
					<a v-show="wingView.right===''" class="arrow-left" title="点击展开" @click="openWingView('right','full')"></a>
				</div>
				<div class="wing-view-body">
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import Map from "../../../components/map/Index.vue"; //地图
	// import Map from "../../../assets/map/mapTest.vue"; //地图
	import tabs from "../../../components/bigScreen/KydTabs";
	import C from "../../../assets/com.js";
	export default {
		data() {
			return {
				bigScreen: false, //是否为超宽屏
				// 翅膀屏
				wingView: {
					left: "",
					right: ""
				},
				unitselectId: "99990002001499A50004",
				unitselectName: "信息技术所"
			}
		},
		computed: {

		},
		mounted() {
			this.bigScreen = window.innerWidth > 3000;
			document.querySelector("title").innerHTML = "客运站生产指挥中心"; //页面名称
		},
		components: {
			Map,
		},
		methods: {
			// 切换翅膀屏状态
			openWingView(key, cls) {
				this.wingView[key] = cls;
			},
		},
		watch: {}
	}
</script>

<style scoped="scoped">
	.lay-con {
		position: relative;
		width: 100%;
		height: 100%;
		background: #01081b;
	}

	.lay {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		color: white;
	}

	/* 顶部logo标题 */
	.log {
		position: fixed;
		top: 0;
		left: 0;
		height: 72px;
		width: 100%;
		background: url(../../../assets/imgs/bigScreen/log.png) no-repeat;
		background-position: center;
		z-index: 520;
	}

	/* 中间 地图容器 其它元素的层级必须大于400*/
	.center-con {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.center-con.hidden {
		display: none;
	}

	/* 页面容器 */
	.frame-con {
		position: absolute;
		top: 120px;
		left: 0px;
		right: 0px;
		bottom: 0px;
	}

	.frame-con>.img-con {
		position: fixed;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		padding-top: 50px;
		overflow: auto;
		z-index: 400;
	}

	.lay.big .center-con {
		width: 50%;
		margin: 0 auto;
	}

	.lay.big .frame-con {
		width: 50%;
		margin: 0 auto;
	}

	.main-box {
		position: absolute;
		z-index: 410;
	}

	/* 左上角菜单 */
	.top-menu {
		top: 5px;
		left: 10px;
	}

	/* 左上角统计 */
	.main-box.top-left {
		top: 42px;
		left: 20px;
		width: 546px;
		height: 72px;
	}

	/* 右上角统计 */
	.main-box.top-right {
		top: 42px;
		right: 20px;
		width: 546px;
		height: 72px;
	}

	/* 中间地图 */
	.map-con {
		position: absolute;
		top: 80px;
		left: 450px;
		right: 450px;
		bottom: 0;
	}

	.map-con2 {
		position: absolute;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0;
	}

	/* 中间左侧 */
	.main-box.left {
		top: 55px;
		left: 10px;
		bottom: 5px;
		width: 425px;
		padding: 0px;
		transition: all 0.3s;
		padding-bottom: 10px;
		z-index: 530;
	}
	.main-box.leftMainBG {
	    top: 0px;
	    left: 0px;
	    bottom: 0px;
	    width: 435px;
	    background: url("../../singleScreen/kyd/img1/home1boxW.png") no-repeat;
	    background-size: 100% 100%;
	    padding-top: 90px;
	    padding-bottom: 20px;
	    padding-left: 10px;
	}
	.main-box.leftMainBG > div {
	    height: 100%;
	    width: 100%;
	    background: url("../../singleScreen/kyd/img1/home1box.png") no-repeat;
	    background-size: 100% 100%;
	    box-shadow: 0 0 100px #00000066;
	}

	/* 中间右侧 */
	.main-box.right {
		top: 55px;
		right: 10px;
		bottom: 5px;
		width: 425px;
		padding: 0px;
		transition: all 0.3s;
		padding-bottom: 10px;
	}

	.main-box.rightMainBG {
	    top: 0px;
	    right: 0px;
	    bottom: 0px;
	    width: 435px;
	    background: url("../../singleScreen/kyd/img1/home1boxW.png") no-repeat;
	    background-size: 100% 100%;
	    padding-top: 90px;
	    padding-bottom: 20px;
	    padding-left: 10px;
	    transform: rotateY(180deg);
	}
	.main-box.rightMainBG > div {
	    height: 100%;
	    width: 100%;
	    background: url("../../singleScreen/kyd/img1/home1box.png") no-repeat;
	    background-size: 100% 100%;
	    box-shadow: 0 0 100px #00000066;
	}

	/* 扩展屏 、翅膀屏*/
	.extend-view,
	.wing-view {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		padding-top: 34px;
		border: 1px solid #122d56;
		background: rgba(5, 11, 47, 0.8);
		z-index: 550;
	}

	.extend-view {
		top: 73px;
	}

	/* 超宽屏下的扩展屏 */
	.lay.big .extend-view {
		width: 50%;
	}

	/* 翅膀屏 */
	.wing-view {
		width: 50%;
		border: 1px solid #122d56;
		background: rgba(5, 11, 47, 0.9);
	}

	/* 超宽屏下的翅膀屏 */
	.lay.big .wing-view {
		top: 50px;
		width: 25%;
		padding-top: 0px;
		border-radius: 20px;
		border: 0px solid #122d56;
		background: rgba(5, 11, 47, 0.1);
		z-index: 490;
		height: calc(100% - 50px);
	}

	.extend-view-head,
	.wing-view-head {
		position: absolute;
		top: 0px;
		width: 100%;
		padding: 5px;
	}

	.extend-view-head>a,
	.wing-view-head>a {
		display: inline-block;
		padding: 0 15px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		color: #20c8d5;
	}

	/* 超宽屏下的翅膀屏头部按钮 */
	.lay.big .wing-view>.wing-view-head>a {
		display: none;
	}

	.extend-view-head>a:hover,
	.wing-view-head>a:hover {
		cursor: pointer;
		text-shadow: 0 0 10px #0000ff, 0 0 10px #fff;
	}

	.extend-view-head>a.arrow-left,
	.wing-view-head>a.arrow-left {
		display: inline-block;
		height: 20px;
		width: 22px;
		background: url("../../../assets/imgs/bigScreen/arrow-left.png") no-repeat;
		background-position: 0 2px;
	}

	.extend-view-head>a.arrow-right,
	.wing-view-head>a.arrow-right {
		display: inline-block;
		height: 20px;
		width: 22px;
		background: url("../../../assets/imgs/bigScreen/arrow-right.png") no-repeat;
		background-position: right 2px;
	}

	/* 左翅膀屏的展开按钮 */
	.wing-view.left>.wing-view-head>a.arrow-right {
		position: absolute;
		top: calc(50vh);
		right: -10px;
		transition: right 0.3s;
	}

	.wing-view.left>.wing-view-head>a.arrow-right:hover {
		right: -20px;
	}

	/* 右翅膀屏的展开按钮 */
	.wing-view.right>.wing-view-head>a.arrow-left {
		position: absolute;
		top: calc(50vh);
		left: -11px;
		transition: left 0.3s;
	}

	.wing-view.right>.wing-view-head>a.arrow-left:hover {
		left: -20px;
	}

	.extend-view-body,
	.wing-view-body {
		height: 100%;
		width: 100%;
	}

	/* 左侧屏 */
	.extend-view.left {
		left: -100%;
		transition: left 0.3s;
	}

	.extend-view.left.half {
		left: -50%;
	}

	.extend-view.left.full {
		left: 0%;
	}

	/* 超宽屏下的左扩展屏 */
	.lay.big .extend-view.left {
		left: -50%;
		transition: left 0.3s;
	}

	.lay.big .extend-view.left.half {
		left: -25%;
	}

	.lay.big .extend-view.left.full {
		left: 0%;
	}

	/* 右侧屏 */
	.extend-view.right {
		right: -100%;
		transition: right 0.3s;
	}

	.extend-view.right.half {
		right: -50%;
	}

	.extend-view.right.full {
		right: 0%;
	}

	/* 超宽屏下的右展屏 */
	.lay.big .extend-view.right {
		right: -50%;
		transition: right 0.3s;
	}

	.lay.big .extend-view.right.half {
		right: -25%;
	}

	.lay.big .extend-view.right.full {
		right: 0%;
	}

	/* 左翅膀 */
	.wing-view.left {
		left: -50%;
		transition: left 0.3s;
	}

	.wing-view.left.full {
		left: 0%;
	}

	/* 超宽屏下的左翅膀 */
	.lay.big .wing-view.left {
		left: 0%;
	}

	/* 左翅膀 */
	.wing-view.right {
		right: -50%;
		transition: right 0.3s;
	}

	.wing-view.right.full {
		right: 0%;
	}

	/* 超宽屏下的右翅膀 */
	.lay.big .wing-view.right {
		right: 0%;
	}

	/* 盒子窗口 */
	.box {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.box.has-tit {
		padding-top: 30px;
	}

	.box-tit {
		position: absolute;
		top: 6px;
		width: 100%;
		font-size: 14px;
		font-weight: bold;
		text-align: center;
	}

	/* 纯容器 */
	.con {
		width: 100%;
		height: 100%;
		border-radius: 20px;
		border: 1px solid #122d56;
		background: rgba(5, 11, 47, 0.9);
	}
</style>
<style>
	.no-padding-popper {
		padding: 0;
		border-color: rgba(67, 90, 121, .9);
	}

	/* 发光字体 */
	.shadow-txt {
		color: #d0c5e3;
		text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
	}
</style>
