<template>
	<div class="b-lay">
		<div class="b-lay-item b-lay-left" :class="{'mini':isMini,'opened':visibleLeft}">
			<div class="view">
				<div v-if="isMini" class="close-arrow" @click="changeView('visibleLeft')">收起</div>
				<div v-if="isMini" class="view-tit" @click="changeView('visibleLeft')">更<br />多</div>
				<div class="view-box">
					<div class="box-item w50 h100">
						<DataPanel type="border" title="数据容器1" @titleClick="dataPanelTitleClick"></DataPanel>
					</div>
					<div class="box-item w50 h100" style="border: none;">
						<div class="box-item w100 h33">
							<DataPanel type="border" title="数据容器2" @titleClick="dataPanelTitleClick"></DataPanel>
						</div>
						<div class="box-item w100 h33">
							<DataPanel type="border" title="数据容器3" @titleClick="dataPanelTitleClick"></DataPanel>
						</div>
						<div class="box-item w100 h33">
							<DataPanel type="border" title="数据容器4" @titleClick="dataPanelTitleClick"></DataPanel>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="b-lay-item b-lay-main" :class="{'mini':isMini}">
			<div class="main-top">
				<div class="main-top-top">
					<div class="log"></div>
				</div>
			</div>
			<div class="main-center">
				<div class="main-center-item map">
					<div class="main-top-nums">
						<NumberBox label="数字" :num="myNum"></NumberBox>
						<NumberBox label="数字" :num="myNum"></NumberBox>
						<NumberBox label="数字" :num="myNum"></NumberBox>
					</div>
					<div class="main-center-item left w25">
						<div class="w100 h50">
							<DataPanel type="line" title="数据容器5" subTitle="PositiveDelay" more @titleClick="dataPanelTitleClick" @moreClick="dataPanelTitleClick"></DataPanel>
						</div>
						<div class="w100 h50">
							<DataPanel type="line" title="数据容器6" subTitle="TrainOperation" @titleClick="dataPanelTitleClick"></DataPanel>
						</div>
					</div>
					<div class="main-center-item right w25">
						<div class="w100 h50">
							<DataPanel type="line" title="数据容器7" subTitle="AtStationBox" @titleClick="dataPanelTitleClick"></DataPanel>
						</div>
						<div class="w100 h50">
							<DataPanel type="line" title="数据容器8" subTitle="OnRoadBox" @titleClick="dataPanelTitleClick"></DataPanel>
						</div>
					</div>
					<div class="main-center-item bottom border">
						<div class="h100">
							<BottomStatistic></BottomStatistic>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="b-lay-item b-lay-right" :class="{'mini':isMini,'opened':visibleRight}">
			<div class="view">
				<div v-if="isMini" class="close-arrow" @click="changeView('visibleRight')">收起</div>
				<div v-if="isMini" class="view-tit" @click="changeView('visibleRight')">更<br />多</div>
				<div class="view-box">
					<div class="box-item w50 h50">
						<DataPanel type="border" title="数据容器9" @titleClick="dataPanelTitleClick"></DataPanel>
					</div>
					<div class="box-item w50 h50">
						<DataPanel type="border" title="数据容器10" @titleClick="dataPanelTitleClick"></DataPanel>
					</div>
					<div class="box-item w50 h50">
						<DataPanel type="border" title="数据容器11" @titleClick="dataPanelTitleClick"></DataPanel>
					</div>
					<div class="box-item w50 h50">
						<DataPanel type="border" title="数据容器12" @titleClick="dataPanelTitleClick"></DataPanel>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import DataPanel from "../../../components/bigScreen/DataPanel"; //每个组件的蓝色方框
	import NumberBox from '../../../components/bigScreen/NumberBox.vue'; //顶部统计

	export default {
		data() {
			return {
				// 是否为小屏模式
				isMini: true,
				visibleLeft: false,
				visibleRight: false,
				myNum: "0000"
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
		},
		methods: {
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
				alert(title);
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
	
	.b-lay-item.mini.opened>.view {
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
		width: 1920px;
		height: 51px;
		background: url("../../../assets/imgs/bigScreen/log.png") no-repeat;
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
		top: 60px;
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
		top: 10px;
		left: 0;
		bottom: 10px;
		z-index: 420;
	}
	
	.main-center-item.right {
		top: 10px;
		right: 0;
		bottom: 10px;
		z-index: 420;
	}
	
	.main-center-item.bottom {
		left: 0;
		bottom: 10px;
		width: 100%;
		height: 90px;
		text-align: center;
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
		transition: right .3s;
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
	
	.border {
		border: 1px solid red;
	}
</style>
<!-- el-table 蓝色样式 -->
<style src="../../../assets/css/blueTable.css"></style>
