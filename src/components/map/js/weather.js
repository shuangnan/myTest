/**
 * 天气情况
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag: false,// 是否已调用接口
	data: {
		weatherLayer: null,
		weatherInterval: null,
		weatherOther: {
			layerVisible: true,
		}
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.weather.register) {
			return;
		}
		// 设置默认值
		this.data.weatherOther.layerVisible = $vm.config.weather.checked;

		this.initData();
		clearInterval(this.data.weatherInterval);
		this.data.weatherInterval = setInterval(() => this.getWeather(true), 1000 * 60 * 10);
	},
	// 初始化数据
	initData() {
		if (this.data.weatherOther.layerVisible) {
			this.getWeather(false);
		}
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 过滤图层元素
	filterLayer() {
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getWeather(false);
			return;
		}
		try{
			if (this.data.weatherOther.layerVisible) {
				$vm.map.addLayer(this.data.weatherLayer);
			} else {
				$vm.map.removeLayer(this.data.weatherLayer);
			}
		}catch(e){
			//TODO handle the exception
		}
	},
	// 创建marker---当前天气
	creatWeather(source) {
		this.data.weatherLayer && $vm.map.removeLayer(this.data.weatherLayer);
		this.data.weatherLayer = L.layerGroup();
		this.data.weatherLayer.addTo($vm.map);
		C.$.each(source, (index, item) => {
			const imgUrl = "https://10.192.34.79/ky3450/SOSE/weather/icons/" + item.ICON + "-fill.svg";
			const marker = L.marker([item.LAT, item.LON], {
				icon: L.divIcon({
					className: 'weather-icon-container',
					iconSize: [30, 30],
					popupAnchor: [5, 5],
					html: `<div class="marker-hover marker-weather"><img src="${imgUrl}"/></div>`
				})
			}).on("click", () => {
				if ($vm.drawFlag || $vm.rangingFlag) return;
				$vm.ctrlFlag = true;
				this.getFutureWeather({
					StnCode: item.STN_CODE,
					StnName: item.STN_NAME,
					latlng: {
						lat: item.LAT,
						lng: item.LON
					}
				});
			});
			this.data.weatherLayer.addLayer(marker);
		});
		this.filterLayer();
	},
	// 获取未来天气
	// 获取数据---未来天气
	getFutureWeather(param) {
		if ($vm.ctrlFlag) {
			$vm.ctrlFlag = false;
			$vm.detailMarker && $vm.detailMarker.remove(); //删除
			$vm.centerMaker(param.latlng, 170, () => {
				const lat = param.latlng.lat;
				const lng = param.latlng.lng;
				const prev = "#/futureWeather";
				const trainInfoPath = prev + "?lat=" + lat + "&lng=" + lng + "&StnCode=" + (param.StnCode ? param.StnCode : "");
				const place = param.StnName ? param.StnName : "";
				let divIcon = L.divIcon({
					className: 'detail-pop-container',
					iconSize: [10, 10],
					popupAnchor: [0, 0],
					html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; bottom: 0px; left:-150px;">
								<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
								<div class = "leaflet-popup-content-wrapper blue">
									<div class="leaflet-popup-content no-padding" style="position:relative;width:300px;height: 330px;border-radius: 10px;background:rgba(0,0,0,.3)">
										<div><h2 style="margin:0;padding-top:5px;font-size:14px;text-align:center;">${place} 天气预报</h2></div>
										<iframe src="${trainInfoPath}" style="height: 300px;width: 100%;margin-left:-1px;border-radius:10px;" frameborder="0"></iframe>
									</div>
								</div>
								<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
								<div class="leaflet-popup-tip blue"></div></div>
							   </div>`
				});
				L.marker(param.latlng, {
					icon: divIcon
				}).addTo($vm.map);
			});
		}
	},
	// 获取当前天气信息
	getWeather(isAuto) {
		// 已获取过数据,但不是自动获取数据,则不执行
		if (this.getDataFlag && !isAuto) {
			return;
		}
		this.getDataFlag = true;
		C.getDataP123({
			c: "kydp_zxy2033",
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			if (r) {
				if (r["1"].length === 0) {} else {
					this.creatWeather(r["1"]);
				}
			} else {
				$vm.$notify.error({
					title: '提示',
					message: '获取当前天气信息数据异常'
				});
			}
		});
	},
}
