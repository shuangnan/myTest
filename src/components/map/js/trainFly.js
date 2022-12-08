/**
 * 列车飞行图
 */
import C from "../../../assets/com.js";
import stations from "./stations.js";
import flyUnil from "./trainFlyUtil.js";
let $vm = null;
export default {
	flyInterval: null,
	allFlayOptions: [],
	data: {
		trainFlyLayer: null,
		trainFlyOther: {
			flyHours: (new Date()).getHours(),
			layerVisible: true, //图层可见性
			list: [], //数据
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.trainFly.register) {
			return;
		}
		// 设置默认值
		this.data.trainFlyOther.layerVisible = $vm.config.trainFly.checked;
		stations.getStations(() => {
			this.getTrainFlyData();
		});
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {
		if (!$vm.config.trainFly.register) {
			return;
		}
		this.data.trainFlyOther.layerVisible = newZoom <= 2;
		this.filterLayer();
	},
	// 过滤图层元素
	filterLayer() {
		if (this.data.trainFlyOther.layerVisible) {
			this.data.trainFlyLayer.addTo($vm.map);
		} else {
			$vm.map.removeLayer(this.data.trainFlyLayer);
		}
	},
	// 绘制飞行图
	drawFly() {
		const options = this.allFlayOptions[this.data.trainFlyOther.flyHours];
		this.data.trainFlyLayer && $vm.map.removeLayer(this.data.trainFlyLayer); //删除飞行图
		this.data.trainFlyLayer = L.supermap.echartsLayer(options);
		this.filterLayer();
	},
	// 获取飞行图数据
	getTrainFlyData() {
		const oid = $vm.oid === "c73b368ba6f9702fe0534820c00a00a8" ? "99990002001499A50004" : $vm.oid.toUpperCase();
		C.getData({
			c: "trdm_ys_347",
			s: [(new Date()).Format("yyyy-MM-dd"), 24],
			o: [oid],
			a: "获取飞行图列车数据"
		}, (r) => {
			// {"START_STN":"重庆西","ARR_TIME":"2021-09-01 00:00:00","TRAIN_NUM_SCH":"0G8511","END_STN":"重庆西动车所","LEV":"0"}
			// console.log("所有车站坐标",this.$store.state.dicAllStationGEO)
			const allData = [];
			r.forEach((data, index) => {
				allData.push(JSON.parse(data));
			});
			const allFlayOptions = []; //所有飞行线数据，分时段
			const geo = $vm.$store.state.dicAllStationGEO;
			console.log("this.$store.state.dicAllStation", $vm.$store.state.dicAllStation.length)
			allData.forEach(data => {
				const curData = [];
				data.forEach(item => {
					item.ARR_TIME = item.ARR_TIME.split(" ")[0];
					if (typeof(geo[item.START_STN]) === "undefined" || typeof(geo[item.END_STN]) === "undefined") {} else {
						curData.push([{
							name: item.START_STN
						}, {
							name: item.END_STN,
							value: 1,
							meta: item
						}]);
					}
				});
				let options = flyUnil.getFlyOpts([curData], geo);
				allFlayOptions.push(options);
			});
			this.allFlayOptions = allFlayOptions;
			console.log("获取飞行图列车数据", allFlayOptions)
			// 每隔5分钟设置当前显示飞行图时间段
			this.drawFly();
			if (this.flyInterval) {
				clearInterval(this.flyInterval);
			}
			this.flyInterval = setInterval(() => {
				const newHour = (new Date()).getHours();
				if (this.data.trainFlyOther.flyHours !== newHour) {
					this.data.trainFlyOther.flyHours = newHour;
					this.drawFly();
				}
			}, 1000 * 60 * 5);
		});
	},
}
