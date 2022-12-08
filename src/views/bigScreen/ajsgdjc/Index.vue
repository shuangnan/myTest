<!-- 
 * @created：2022年9月16日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		安监室对轨道检测数据
 -->
<template>
	<div class="b-lay">
		<div class="b-lay-item b-lay-main">
			<div class="main-top">
				<div class="main-top-top">
					<div class="log"></div>
				</div>
			</div>
			<div class="main-center">
				<div class="main-center-item map">
					<div class="map-border-top"></div>
					<div class="map-border-right"></div>
					<div class="map-border-bottom"></div>
					<div class="map-border-left"></div>
					
					<div class="main-center-item left w25">
					</div>
					<div class="main-center-item center">
						<div class="w100 h100">
						</div>
					</div>
					<div class="main-center-item right w25" :class="[isMini?'pw20':'pl40']">
						<div class="w100 h100">
							
						</div>
					</div>

					<div class="main-center-item bottom"></div>
					<!-- 地图 -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ItemBox from "./ItemBox.vue"; //
	import DataPanel from "../../../components/bigScreen/DataPanel1.vue"; //每个组件的蓝色方框


	export default {
		components: {
			DataPanel,
			ItemBox,
		},
		data() {
			return {
			}
		},
		created() {
		},
		mounted() {

		},
		methods: {
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
		background:#010713;
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
		background: url("./img/kyd2_logo.png") -583.5px 0 no-repeat;
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
	
	.map-border-top{
		position: absolute;
		top:0;
		right:25%;
		left:25%;
		height: 37px;
		background: url(img/map-box-top.png)repeat-x;
		background-position:0px -20px;
		z-index: 420;
	}
	.map-border-right{
		position: absolute;
		top:0px;
		right:25%;
		bottom: 10px;
		width: 37px;
		height: 100%;
		background: url(img/map-box-right.png)repeat-y;
		z-index: 420;
	}
	.map-border-bottom{
		position: absolute;
		right:25%;
		left:25%;
		bottom: 0px;
		height: 37px;
		background: url(img/map-box-bottom.png)repeat-x;
		z-index: 420;
	}
	.map-border-left{
		position: absolute;
		top:0px;
		left:25%;
		bottom: 10px;
		width: 37px;
		height: 100%;
		background: url(img/map-box-left.png)repeat-y;
		background-position:-20px 0px;
		z-index: 420;
	}
	
	/* 中间左侧 */
	.main-center-item.left {
		top: 0px;
		left: 0;
		bottom: 0px;
		padding-bottom: 10px;
		padding-right: 0px;
		background: rgba(1,7,19,.8);
		z-index: 420;
	}
	.main-center-item.left::after{
		
	}
	/* 中间右侧 */
	.main-center-item.right {
		top: 0px;
		right: 0;
		bottom: 0px;
		padding-bottom: 10px;
		padding-left: 0px;
		background: rgba(1,7,19,.8);
		z-index: 420;
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

	.w50 {
		width: 50%;
	}

	.w50 {
		width: 50%;
	}

	.w25 {
		width: 25%;
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
	.center{
		left:25%;
	}
</style>
<style>
	/* 标题字体颜色 */
	:root{--kyd2_tcolor:#D0C5E3;}
	/* 发光字体 */
	.shadow-txt{
		color: #D0C5E3;
		text-shadow: 0 0 10px #0000FF,0 0 20px #fff;
	}
</style>
<!-- el-table 蓝色样式 -->
<style src="../../../assets/css/blueTable.css"></style>
<style src="../../../assets/css/EchartsBlue.css" scoped></style>
