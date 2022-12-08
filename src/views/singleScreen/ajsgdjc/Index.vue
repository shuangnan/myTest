<!-- 
 * @created：2022年9月16日	
 * @author：	ch
 * @version:	v1.0
 * @desc:		安监室对轨道检测数据
 -->
<template>
	<div class="b-lay">
		<div class="b-lay-item b-lay-main mini">
			<div class="main-top">
				<div class="main-top-top">
					<div class="log"></div>
				</div>
			</div>
			<div class="main-center">
				<div class="main-center-item map">
					<div class="map-border-top"></div>
					<div class="map-border-right"></div>
					<!-- <div class="map-border-bottom"></div> -->
					<div class="map-border-left"></div>
					<!-- 中间地图 -->
					<!-- <div class="map-con2"> -->
					<Map ref="myMap" style="background: #272f46;" sys="kygl" :oid="unitselectId" :oname="unitselectName" :toolsConfig="{left:'440px',bottom:'10px',height:'380px',lateRight:'440px'}"></Map>
					<!-- </div> -->
					<!-- 顶部 -->
					<div class="main-center-item top w40" style="left: 30%;">
						<div class="view-list">
							<div class="item gw" :class="{active:curSys==='工务'}" @click="chooseSys('工务',1)">工务</div>
							<div class="item dw" :class="{active:curSys==='电务'}" @click="chooseSys('电务',2)">电务</div>
							<div class="item gd" :class="{active:curSys==='供电'}" @click="chooseSys('供电',3)">供电</div>
							<div class="item jw" :class="{active:curSys==='货运'}" @click="chooseSys('货运',4)">货运</div>
							<!-- <div class="item wz" :class="{active:curSys==='物资'}" @click="chooseSys('物资',5)">物资</div> -->
							<!-- <div class="item sg" :class="{active:curSys==='施工'}" @click="chooseSys('施工',6)">施工</div> -->
						</div>
					</div>
					<!-- 左侧 -->
					<div class="main-center-item left w30 h100">
						<div class="left-list" style="padding-top: 30px;height: 50px; -webkit-user-select: none; ">
							<div class="wz" :class="{active:listtype==='I级快速(普速)'}" style="width: 80px;" @click="chooseleft('I级快速(普速)',1)">Ⅰ级普速</div>
							<div class="wz" :class="{active:listtype==='I级快速(高铁)'}" style="width: 80px;" @click="chooseleft('I级快速(高铁)',2)">Ⅰ级高铁</div>
							<div class="wz" :class="{active:listtype==='I级重载'}" style="width: 80px;" @click="chooseleft('I级重载',3)">Ⅰ级重载</div>
							<div class="wz" :class="{active:listtype==='II级'}" style="width: 80px;" @click="chooseleft('II级',4)">Ⅱ级</div>
							<div class="wz" :class="{active:listtype==='III级'}" style="width: 80px;" @click="chooseleft('III级',5)">Ⅲ级</div>
							<div class="wz" :class="{active:listtype==='IV级'}" style="width: 80px;" @click="chooseleft('IV级',6)">Ⅳ级</div>
							<!-- <div class="wz" :class="{active:listtype==='五级'}" style="width: 80px;" @click="chooseleft('五级',6)">Ⅴ级</div> -->
						</div>
						
						
						
						<div class="panel-box2" style="height:22%;">
							<DataPanel alt="线路质量排序">
								<L_1 ref="myL1"></L_1>
							</DataPanel>
						</div>
						<div class="panel-box2" style="height:29%;">
							<DataPanel alt="站段质量排序">
								<L_2 ref="myL2"></L_2>
							</DataPanel>
						</div>
						<div class="panel-box2" style="height:45%;">
							<DataPanel alt="工区质量排序">
								<L_3 ref="myL3"></L_3>
							</DataPanel>
						</div>
					</div>
					
					<div class="main-center-item center">
					</div>
					
					<!-- 右侧 -->
					<div class="main-center-item right w30 h100">
						<!-- 右一 -->
						<div v-if="you1==='1'" class="panel-box" style="height:33%">
							<DataPanel title="病害情况">
								<R_1 @fatherMethod="binghai"></R_1>
							</DataPanel>
						</div>
						<div v-if="you1==='2'" class="panel-box" style="height:33%">
							<DataPanel title="预警与提示(详细)">
								<R_2></R_2>
							</DataPanel>
						</div>
						
						<div v-if="you1==='3'" class="panel-box" style="height:33%">
							<DataPanel title="预警与提示(总数)">
								<R_4></R_4>
							</DataPanel>
						</div>
						
						<div v-if="you1==='4'" class="panel-box" style="height:33%">
							<DataPanel title="重点薄弱设备">
								<R_3></R_3>
							</DataPanel>
						</div>
						
						<div v-if="you1==='5'" class="panel-box" style="height:33%">
							<DataPanel title="施工计划统计">
								<R_9 @fatherMethod="shigong"></R_9>
							</DataPanel>
						</div>
						
						
						
						<div v-if="you1==='6'" class="panel-box" style="height:33%">
							<DataPanel title="2.5级病害统计">
								<R_5></R_5>
							</DataPanel>
						</div>
						
						<div v-if="you1==='7'" class="panel-box" style="height:33%">
							<DataPanel title="TQI变化趋势">
								<R_6></R_6>
							</DataPanel>
						</div>
						
						<div v-if="you1==='8'" class="panel-box" style="height:33%">
							<DataPanel title="TQI质量增幅">
								<R_7></R_7>
							</DataPanel>
						</div>
						
						<div v-if="you1==='9'" class="panel-box" style="height:33%">
							<DataPanel title="TQI质量降幅">
								<R_8></R_8>
							</DataPanel>
						</div>
						
						<!-- 右二 -->
						<div v-if="you2==='1'" class="panel-box" style="height:33%">
							<DataPanel title="病害情况">
								<R_1 @fatherMethod="binghai"></R_1>
							</DataPanel>
						</div>
						<div v-if="you2==='2'" class="panel-box" style="height:33%">
							<DataPanel title="预警与提示(详细)">
								<R_2></R_2>
							</DataPanel>
						</div>
						
						<div v-if="you2==='3'" class="panel-box" style="height:33%">
							<DataPanel title="预警与提示(总数)">
								<R_4></R_4>
							</DataPanel>
						</div>
						
						<div v-if="you2==='4'" class="panel-box" style="height:33%">
							<DataPanel title="重点薄弱设备">
								<R_3></R_3>
							</DataPanel>
						</div>
						
						<div v-if="you2==='5'" class="panel-box" style="height:33%">
							<DataPanel title="施工计划统计">
								<R_9 @fatherMethod="shigong"></R_9>
							</DataPanel>
						</div>
						
						<div v-if="you2==='6'" class="panel-box" style="height:33%">
							<DataPanel title="2.5级病害统计">
								<R_5></R_5>
							</DataPanel>
						</div>
						
						<div v-if="you2==='7'" class="panel-box" style="height:33%">
							<DataPanel title="TQI变化趋势">
								<R_6></R_6>
							</DataPanel>
						</div>
						
						<div v-if="you2==='8'" class="panel-box" style="height:33%">
							<DataPanel title="TQI质量增幅">
								<R_7></R_7>
							</DataPanel>
						</div>
						
						<div v-if="you2==='9'" class="panel-box" style="height:33%">
							<DataPanel title="TQI质量降幅">
								<R_8></R_8>
							</DataPanel>
						</div>
						
						<!-- 右三 -->
						<div v-if="you3==='1'" class="panel-box" style="height:33%">
							<DataPanel title="病害情况">
								<R_1 @fatherMethod="binghai"></R_1>
							</DataPanel>
						</div>
						<div v-if="you3==='2'" class="panel-box" style="height:33%">
							<DataPanel title="预警与提示(详细)">
								<R_2></R_2>
							</DataPanel>
						</div>
						
						<div v-if="you3==='3'" class="panel-box" style="height:33%">
							<DataPanel title="预警与提示(总数)">
								<R_4></R_4>
							</DataPanel>
						</div>
						
						<div v-if="you3==='4'" class="panel-box" style="height:33%">
							<DataPanel title="重点薄弱设备">
								<R_3></R_3>
							</DataPanel>
						</div>
						
						<div v-if="you3==='5'" class="panel-box" style="height:33%">
							<DataPanel title="施工计划统计">
								<R_9 @fatherMethod="shigong" ref="myR9"></R_9>
							</DataPanel>
						</div>
						
						<div v-if="you3==='6'" class="panel-box" style="height:33%">
							<DataPanel title="2.5级病害统计">
								<R_5></R_5>
							</DataPanel>
						</div>
						
						<div v-if="you3==='7'" class="panel-box" style="height:33%">
							<DataPanel title="TQI变化趋势">
								<R_6></R_6>
							</DataPanel>
						</div>
						
						<div v-if="you3==='8'" class="panel-box" style="height:33%">
							<DataPanel title="TQI质量增幅">
								<R_7></R_7>
							</DataPanel>
						</div>
						
						<div v-if="you3==='9'" class="panel-box" style="height:33%">
							<DataPanel title="TQI质量降幅">
								<R_8></R_8>
							</DataPanel>
						</div>
						
					</div>
					<!-- 底部 -->
					<!-- <div class="main-center-item bottom h25">
						<div class="panel-box w25">
							<DataPanel class="h100" title="动静态数据重复分析">
								<B1></B1>
							</DataPanel>
						</div>
						<div class="panel-box w25">
							<DataPanel class="h100" title="病害库">
								<B2></B2>
							</DataPanel>
						</div>
						<div class="panel-box w25">
							<DataPanel class="h100" title="病害分析">
								<B3></B3>
							</DataPanel>
						</div>
						<div class="panel-box w25">
							<DataPanel class="h100" title="考核与激励">
								<B4></B4>
							</DataPanel>
						</div>
					</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import DataPanel from "./DataPanel.vue"; //每个组件的蓝色方框

	import L1 from "./L1.vue"; //站段风险评分
	import L2 from "./L2.vue"; //线路安全等级排行
	import L3 from "./L3.vue"; //晃车排名
	import R1 from "./R1.vue"; //预警与提示
	import R2 from "./R2.vue"; //库存排行
	import B1 from "./B1.vue"; //动静态数据重复分析
	import B2 from "./B2.vue"; //病害库
	import B3 from "./B3.vue"; //病害分析
	import B4 from "./B4.vue"; //考核与激励
	import R_1 from "./R_1.vue"
	import R_2 from "./R_2.vue"
	import R_3 from "./R_3.vue"
	import R_4 from "./R_4.vue"
	import R_5 from "./R_5.vue"
	import R_6 from "./R_6.vue"
	import R_7 from "./R_7.vue"
	import R_8 from "./R_8.vue"
	import R_9 from "./R_9.vue"
	import L_1 from "./L_1.vue"
	import L_2 from "./L_2.vue"
	import L_3 from "./L_3.vue"
	import R_10 from "./R_10.vue"
	
	import Map from "../../../assets/map/mapTest.vue"; //地图
	import Utils from "./js/util.js"
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
				unitselectName: "信息技术所",
				curSys:"工务",
				listtype:"I级快速(普速)",
				you3:'',
				you2:'',
				you1:'',
			}
		},
		components: {
			Map,
			DataPanel,
			L1,
			L2,
			L3,
			R1,
			R2,
			B1,
			B2,
			B3,
			B4,
			R_1,
			R_2,
			R_3,
			L_1,
			L_2,
			L_3,
			R_4,
			R_5,
			R_6,
			R_7,
			R_8,
			R_9,
			R_10,
		},
		created() {
			if(window.localStorage.getItem("you1")){
				// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
				this.$store.commit('ajs/setyou1',JSON.parse(window.localStorage.getItem("you1")))
				// console.log("wjj")
				this.you1=this.$store.state.ajs.you1
			}else{
				this.you1='1'
			}
			if(window.localStorage.getItem("you2")){
				// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
				this.$store.commit('ajs/setyou2',JSON.parse(window.localStorage.getItem("you2")))
				// console.log("wjj")
				this.you2=this.$store.state.ajs.you2
			}else{
				this.you2='2'
			}
			if(window.localStorage.getItem("you3")){
				// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
				this.$store.commit('ajs/setyou3',JSON.parse(window.localStorage.getItem("you3")))
				// console.log("wjj")
				this.you3=this.$store.state.ajs.you3
			}else{
				this.you3='5'
			}
			// console.log(localStorage.getItem("you1"))
			// console.log(this.$store.state)
			
			
			// this.you2=this.$store.state.ajs.you2
		},
		mounted() {
			// var that = this;
			// Utils.$on('you1',function(msg){
			// 	console.log("@@@@789")
			// 	// console.log(msg);
			// 	that.changeyou1(msg);
			// })
		},
		methods: {
			chooseSys(name,seq){
				this.curSys = name;
				this.$refs.myMap.changetype(seq);
			},
			chooseleft(name,seq){
				this.listtype=name;
				this.$refs.myL1.changetype(name);
				this.$refs.myL2.changetype(name);
				this.$refs.myL3.changetype(name);
			},
			shigong(name1,listtype){
				// this.you1=3
				listtype=this.$refs.myR9.getlisttype()
				console.log("施工打点")
				console.log(name1)
				console.log(listtype)
				this.$refs.myMap.shigongmarker(name1,listtype);
				// if(name1===1){
				// 	this.$refs.myMap.shigongmarker(1);
				// }
				// if(name1===2){
				// 	this.$refs.myMap.shigongmarker(2);
				// }
				// if(name1===3){
				// 	this.$refs.myMap.shigongmarker(3);
				// }
				// if(name1===4){
				// 	this.$refs.myMap.shigongmarker(4);
				// }
				// if(name1===5){
				// 	this.$refs.myMap.shigongmarker(5);
				// }
				// if(name1===6){
				// 	this.$refs.myMap.shigongmarker(6);
				// }
			},
			binghai(name1){
				this.$refs.myMap.changetype(1);
			}
			
			
		},
		watch:{
			you1:{
				handler(newValue,oldValue){
					// console.log(newValue)
					// console.log(oldValue)
					
				}
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
		width: 100%;
		height: 72px;
		background: url("./img2/logo.png") no-repeat;
		background-size: 100% 100%;
		background-position: 50% 0;
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
		top: 70px;
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
		right: 30%;
		left: 30%;
		height: 37px;
		background: url(../../bigScreen/kyd2/img/map-box-top.png)repeat-x;
		background-position: 0px -20px;
		z-index: 420;
	}

	.map-border-right {
		position: absolute;
		top: 0px;
		right: 30%;
		bottom: 0%;
		width: 37px;
		background: url(../../bigScreen/kyd2/img/map-box-right.png)repeat-y;
		z-index: 420;
	}

	.map-border-bottom {
		position: absolute;
		right: 30%;
		left: 30%;
		bottom: 25%;
		height: 37px;
		background: url(../../bigScreen/kyd2/img/map-box-bottom.png)repeat-x;
		z-index: 420;
	}

	.map-border-left {
		position: absolute;
		top: 0px;
		left: 30%;
		bottom:0% ;
		width: 37px;
		background: url(../../bigScreen/kyd2/img/map-box-left.png)repeat-y;
		background-position: -20px 0px;
		z-index: 420;
	}

	/* 中间顶部 */
	.main-center-item.top {
		top: 10px;
		z-index: 420;
		overflow: hidden;
	}

	/* 系统按钮组 */
	.view-list {
		position:relative;
		width: 90%;
		height: 100px;
		display: flex;
		margin: 0 auto;
		color: #2dc2fa;
		text-align: center;
		justify-content: space-around;
		background: url(img/sys-bg.png)no-repeat;
		background-size:100% auto;
		background-position:0 45px;
		-webkit-user-select: none;
	}
	
	/* 左侧组件 */
	.left-list {
		position:relative;
		width: 90%;
		height: 100px;
		display: flex;
		color: #0096ff;
		margin: 0 auto;
		text-align: center;
		justify-content: space-around;
	}
	
	.left-list>.wz{
		cursor: pointer;
		font-size: 16px;
		padding-left: 0px;
		padding-top: 10px;
		height: 100px;
		width: 100px;
	}
	.left-list>.wz.active{
		background: url(./img2/jianbian.png)no-repeat;
		background-position: center 5px;
		color: white;
	}

	.view-list>.item {
		display: inline-block;
		width: 16%;
		height:100%;
		padding-top: 80px;
		opacity:0.8;
	}
	.view-list>.item.active,
	.view-list>.item:hover{
		color:#53CEFB;
		cursor:pointer;
		font-weight:bold;
		opacity:1;
	}

	.view-list>.item.gw {
		background: url(img/sys-gw0.png)no-repeat;
		background-size: 70px 70px;
		background-position: center 0px;
	}
	.view-list>.item.gw.active {
		background: url(img/sys-gw1.png)no-repeat;
		background-size: 130px 86px;
		background-position: center -8px;
	}

	.view-list>.item.dw {
		background: url(img/sys-dw0.png)no-repeat;
		background-size: 70px 70px;
		background-position: center 0px;
	}.view-list>.item.dw.active {
		background: url(img/sys-dw1.png)no-repeat;
		background-size: 130px 86px;
		background-position: center -8px;
	}

	.view-list>.item.gd {
		background: url(img/sys-gd0.png)no-repeat;
		background-size: 70px 70px;
		background-position: center 0px;
	}.view-list>.item.gd.active {
		background: url(img/sys-gd1.png)no-repeat;
		background-size: 130px 86px;
		background-position: center -8px;
	}

	.view-list>.item.jw {
		background: url(img/sys-jw0.png)no-repeat;
		background-size: 70px 70px;
		background-position: center 0px;
	}.view-list>.item.jw.active {
		background: url(img/sys-jw1.png)no-repeat;
		background-size: 130px 86px;
		background-position: center -8px;
	}

	.view-list>.item.wz {
		background: url(img/sys-wz0.png)no-repeat;
		background-size: 70px 70px;
		background-position: center 0px;
	}.view-list>.item.wz.active {
		background: url(img/sys-wz1.png)no-repeat;
		background-size: 130px 86px;
		background-position: center -8px;
	}

	.view-list>.item.sg {
		background: url(img/sys-sg0.png)no-repeat;
		background-size: 70px 70px;
		background-position: center 0px;
	}.view-list>.item.sg.active {
		background: url(img/sys-sg1.png)no-repeat;
		background-size: 130px 86px;
		background-position: center -8px;
	}

	/* 中间左侧 */
	.main-center-item.left {
		top: 0px;
		left: 0;
		bottom: 0px;
		background: url(img2/左边框.png) no-repeat  rgba(1, 7, 19, 1);
		background-size: 100% 100%;
		z-index: 420;
		/* opacity: inherit; */
	}

	.main-center-item.left::after {}

	/* 中间右侧 */
	.main-center-item.right {
		top: 0px;
		right: 0;
		bottom: 0px;
		background: rgba(1, 7, 19, 1);
		/* opacity: 10; */
		z-index: 420;
	}

	/* 中间底部 */
	.main-center-item.bottom {
		left: 0;
		bottom: 0px;
		width: 100%;
		background: rgba(1, 7, 19, .9);
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

	.panel-box {
		display: inline-block;
		vertical-align: top;
		width: 100%;
		height: 100%;
		padding: 5px;
	}
	
	.panel-box2 {
		display: inline-block;
		vertical-align: top;
		width: 100%;
		height: 100%;
		padding: 30px;
		margin-top: 8px;
	}

	/* 各种高、宽 百分经*/
	.w100 {
		width: 100%;
	}

	.w50 {
		width: 50%;
	}

	.w40 {
		width: 40%;
	}

	.w30 {
		width: 30%;
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
<style src="../../../assets/css/ELMTblueBox.css"></style>
<style src="../../../assets/css/EchartsBlueAuto.css" scoped></style>
