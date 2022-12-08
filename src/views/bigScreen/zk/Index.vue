<template>
	<div class="b-lay">
		<div class="b-lay-item b-lay-main" :class="{'mini':isMini}">
			<div class="main-top">
				<div class="main-top-top">
					<div class="log"></div>
				</div>
			</div>
			<div class="main-center">
				<div class="main-center-item map" style="padding: 0 25px;background: rgb(0, 9, 66)">
						<zk3 @changeStation="handleChangeStation"></zk3>
				</div>
			</div>
		</div>
		<div v-show="!rightVisible" class="b-lay-item b-lay-right" :class="{'mini':isMini,'half':curRightView==='half','full':curRightView==='full'}">
			<div class="view">
				<template v-if="isMini">
					<div v-if="curRightView==='mini'" class="view-tit" @click="changeView('half')">更<br />多</div>
					<div v-else-if="curRightView==='half'" class="view-tit" @click="changeView('full')">全<br />屏</div>
					<div v-if="curRightView!=='mini'" class="close-arrow" @click="changeView('mini')">收起</div>
					<div v-if="curRightView==='full'" class="view-tit" @click="changeView('mini')">收起</div>
				</template>
				<div class="view-box">
					<div style="width: 100%;height: 100%;border: 1px solid green;">内容</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import DataPanel from "../../../components/bigScreen/DataPanel"; //每个组件的蓝色方框
	import NumberBox from '../../../components/bigScreen/NumberBox.vue'; //顶部统计

	import StationDraw from './StationDraw.vue';
	import zk3 from '../../zydb/home/zydb.vue';


	import C from "../../../assets/com.js";

	export default {
		data() {
			return {
				rightVisible:false,
				// 是否为小屏模式
				isMini: true,
				curRightView:"mini",//当前右屏视图 mini	half full
				myNum: "0000",
				curStnCode: "ICW"
			}
		},
		created() {
			// 组件创建完毕后，将当前地图模块设置为 default
			this.isMini = window.innerWidth < 3000;
			setInterval(() => {
				this.myNum = "" + Math.floor(Math.random() * 10000);
			}, 1000 * 5);
		},
		mounted() {
	
		},
		components: {
			DataPanel,
			NumberBox,
			StationDraw,
			zk3
		},
		methods: {
			handleChangeStation(flag){
				this.rightVisible = flag;
			},
			// 切换右视图
			changeView(nextView) {
				this.curRightView = nextView;
			},
			// 面板标题点击事件
			dataPanelTitleClick(title) {
				// alert(title);
			},
		}
	}
</script>

<style scoped="scoped">
	.b-lay {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-image: url("../../../assets/imgs/bigScreen/back.jpg");
		background-size: cover;
		background-position: center;
		color: white;
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
		padding: 15px;
	}

	.b-lay-item.mini>.view {
		padding-top: 40px;
	}

	.b-lay-item.mini.half>.view,
	.b-lay-item.mini.full>.view{
		background: #1E255C;
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
		transition: left .3s;
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
		height: 60px;
	}

	.main-top-top {
		height: 60px;
	}

	.main-top-top>.log {
		width: 1070px;
		height: 56px;
		/* background: url("../../../assets/imgs/bigScreen/log.png") no-repeat; */
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
		top: 0px;
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

	.main-center-item.left {
		top: 120px;
		left: 0;
		bottom: 20px;
	}

	.main-center-item.right {
		top: 120px;
		right: 0;
		bottom: 20px;
	}

	/* 右 */
	.b-lay-right {
		width: 50%;
		padding: 0px;
		z-index: 410;
	}

	.b-lay-right.mini {
		position: absolute;
		width: 100%;
		right: -100%;
		z-index: 420;
		transition: right .3s;
	}

	/* 展开一半 */
	.b-lay-right.mini.half {
		right: -50%;
	}
	/* 全展开 */
	.b-lay-right.mini.full {
		padding-left: 35px;
		right: 0;
	}

	/* 折叠按钮标题 */
	.view-tit {
		position: absolute;
		top: 0px;
		width: 35px;
		height: 184px;
		color: #20C8D5;
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
		left: -40px;
		background: url("../../../assets/imgs/bigScreen/lock-right.png") no-repeat;
	}

	.b-lay-right.mini.half .view-tit {
		left: -34px;
	}
	.b-lay-right.mini.full .view-tit {
		left: -35px;
	}

	/* 收起 */
	.close-arrow {
		position: absolute;
		height: 40px;
		line-height: 40px;
		top: 0px;
		color: #20C8D5;
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
	.b-lay-right.half .close-arrow {
		right: 50%;
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

	.w25 {
		width: 25%;
	}

	.h100 {
		height: 100%;
	}

	.h50 {
		height: 50%;
	}

	.h33 {
		height: 33.4%;
	}
</style>
