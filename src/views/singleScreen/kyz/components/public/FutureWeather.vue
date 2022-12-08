<!-- 
 * @created：	2021年11月18日
 * @author：	ch
 * @version:	v1.0
 * @desc:		经纬度示来24小时、7天天气，及预警信息
 -->
<template>
	<div style="color:white;background:transparent;">
		<div class="tq-list">
			<el-scrollbar style="height: 100%;padding: 0px;">
				<div v-for="item in today24" class="tq-list-item">
					<div>{{item.showTime}}</div>
					<div style="padding:10px 0;"><img class="weather-icon" :src="weatherIcon+item.icon+'-fill.svg'"/></div>
					<div>{{item.temp}}℃</div>
				</div>
			</el-scrollbar>
		</div>
		<div style="padding: 0px 10px;">
			<el-scrollbar style="height: 200px;padding: 0px;">
				<table class="tq-weather" style="width:100%;padding:10px;" cellspacing="0" cellpadding="0">
					<tbody>
						<tr v-for="(item,index) in futures">
							<template v-if="index>0">
								<td style="width:140px;">{{item.showDate}} {{item.showWeek}}</td>
								<td style="text-align:center;"><img class="weather-icon" :src="weatherIcon+item.iconDay+'-fill.svg'"/></td>
								<td style="text-align:right;">{{item.tempMax}}℃ <span style="color:#bcbcbc;">/ {{item.tempMin}}℃</span></td>
							</template>
						</tr>
					</tbody>
				</table>
			</el-scrollbar>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../../../assets/com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				weatherIcon:C.weatherUrl,
				activeName: "first",
				today24: [],
				futures: [],
				warning: []
			}
		},
		// 组件挂载完毕
		mounted() {
			this.getData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			// 24小时天气
			// cloud: "27"
			// dew: "6"
			// fxTime: "2021-11-18T13:00+08:00"
			// humidity: "61"
			// icon: "100"
			// pop: "7"
			// precip: "0.0"
			// pressure: "907"
			// temp: "14"
			// text: "晴"
			// wind360: "78"
			// windDir: "东北风"
			// windScale: "1-2"
			// windSpeed: "7"

			// 示来7天
			// cloud: "25"
			// fxDate: "2021-11-18"
			// humidity: "92"
			// iconDay: "101"
			// iconNight: "154"
			// moonPhase: "盈凸月"
			// moonPhaseIcon: "803"
			// moonrise: "17:37"
			// moonset: "07:18"
			// precip: "0.0"
			// pressure: "906"
			// sunrise: "07:35"
			// sunset: "18:11"
			// tempMax: "15"
			// tempMin: "9"
			// textDay: "多云"
			// textNight: "阴"
			// uvIndex: "4"
			// vis: "24"
			// wind360Day: "0"
			// wind360Night: "0"
			// windDirDay: "北风"
			// windDirNight: "北风"
			// windScaleDay: "1-2"
			// windScaleNight: "1-2"
			// windSpeedDay: "3"
			// windSpeedNight: "3"
			// 获取数据
			getData() {
				this.loading = this.$loading({
					lock: true,
					text: '正在获取天气数据...',
					spinner: 'el-icon-loading',
					background: 'rgba(0,0,0,0.1)',
					customClass: 'loading1'
				});
				// 有灾害预警的经纬度：["121.61","38.91"]
				const webP = this.$store.state.params;
				// const webP = {
				// 	lng: "121.61",
				// 	lat: "38.91",
				// 	StnCode: ""
				// }
				C.getDataP123({
					c: webP.StnCode === "" ? "kydp_zxy7002" : "kydp_zxy2035",
					s: webP.StnCode === "" ? [webP.lng, webP.lat] : [
						[webP.StnCode],
						[webP.StnCode],
						[webP.StnCode]
					],
					url:C.kydUrl,
					a: "获取未来天气信息",
				},(r) => {
					this.loading.close();
					if (r) {
						let d = [];
						if (webP.StnCode === "") {
							d = JSON.parse(r);
						} else {
							d = [r["1"], r["2"], r["3"]]
						}
						if (d.length === 0) {
							this.$message('未获取到天气信息');
						} else {
							const today24 = d[0];
							const futures = d[1];
							today24.forEach(item => {
								item.showTime = (new Date(item.fxTime)).Format("hh:mm");
							});
							futures.forEach((item, index) => {
								const dt = webP.StnCode === "" ? item.fxDate.split("-") : item.fxDate.split(" ")[0].split("-");
								const date = new Date(dt[0], parseInt(dt[1] - 1), dt[2]);
								const week = "星期" + "日一二三四五六".charAt(date.getDay());
								item.showDate = dt[1] + "月" + dt[2] + "日";
								item.showWeek = index === 1 ? "明天" : week;
							});
							this.today24 = today24;
							this.futures = futures;
							this.warning = d[2];
						}
						console.log("获取未来天气信息", d);
					} else {
						this.$message('接口错误')
					}

				});
			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.tq-list {
		padding: 0px;
		white-space: nowrap;
		height: 100px;
	}

	.tq-list-item {
		display: inline-block;
		padding: 10px;
		text-align: center;
	}


	.tq-weather {}

	.tq-weather td {
		padding: 5px;
		border-bottom: 1px solid #333;
	}
	/*天气*/
	.weather-icon {
		width: 20px;
	}

	>>>.el-tabs__header {
		margin: 0;
	}

	>>>.el-tabs__item {
		color: #c1c1c1;
	}

	>>>.el-tabs__item.is-active {
		color: #409EFF;
	}

	>>>.el-tabs__nav-wrap::after {
		background-color: transparent;
	}

	>>>.el-scrollbar__wrap::-webkit-scrollbar {
		/*滚动条两端块*/
		width: 0px;
		height: 0px;
		border-radius: 0px;
		background-color: transparent !important;
	}

	>>>.el-scrollbar__wrap::-webkit-scrollbar-track {
		/*滚动条滑槽*/
		border-radius: 0px;
		background-color: transparent !important;
		-webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .0) !important;
	}

	>>>.el-scrollbar__wrap::-webkit-scrollbar-thumb {
		/*滚动条滑动条*/
		border-radius: 0px;
		background-color: transparent !important;
		-webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .0) !important;
	}

	>>>.el-scrollbar__wrap::-webkit-scrollbar-thumb:hover {
		background-color: transparent !important;
	}

	>>>.el-scrollbar__wrap::-webkit-scrollbar-thumb:active {
		background-color: transparent !important
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
	#app{
		background: transparent!important;
	}
</style>
