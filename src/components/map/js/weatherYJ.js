/**
 * 天气预警
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag: false,// 是否已调用接口
	data: {
		weatherYJLayer: null,
		weatherYJInterval: null,
		yujingImg: require('../img/yujingIcon.png'), //天气预警窗口内图标
		weatherYJOther: {
			layerVisible: true,
		}
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.weatherYJ.register) {
			return;
		}
		// 设置默认值
		this.data.weatherYJOther.layerVisible = $vm.config.weatherYJ.checked;

		this.initData();
		clearInterval(this.data.weatherYJInterval);
		this.data.weatherYJInterval = setInterval(() => this.getweatherYJ(true), 1000 * 60 * 10);
	},
	// 初始化数据
	initData() {
		if (this.data.weatherYJOther.layerVisible) {
			this.getweatherYJ(false);
		}
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 过滤图层元素
	filterLayer() {
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getweatherYJ(false);
			return;
		}
		if (this.data.weatherYJOther.layerVisible) {
			$vm.map.addLayer(this.data.weatherYJLayer);
		} else {
			$vm.map.removeLayer(this.data.weatherYJLayer);
		}
	},
	// 创建marker---天气预警
	creatweatherYJ(source) {
		this.data.weatherYJLayer && $vm.map.removeLayer(this.data.weatherYJLayer);
		this.data.weatherYJLayer = L.layerGroup();
		this.data.weatherYJLayer.addTo($vm.map);
		C.$.each(source, (index, item) => {
			const imgUrl = "https://10.192.34.79/ky3450/SOSE/weather/icons/" + item.level + "预警.png";
			const marker = L.marker([item.LAT, item.LON], {
				icon: L.divIcon({
					className: 'weather-icon-container',
					iconSize: [30, 30],
					popupAnchor: [5, 5],
					html: `<div class="marker-hover marker-weather yujing"><img src="${imgUrl}"/></div>`
				})
			}).on("click", (e) => {
				if ($vm.drawFlag || $vm.rangingFlag) return;
				this.setweatherYJMarkerClick(item, e);
			});
			this.data.weatherYJLayer.addLayer(marker);
		});
		this.filterLayer();
	},
	// 预警点击事件
	setweatherYJMarkerClick(item, param) {
		if ($vm.drawFlag || $vm.rangingFlag) return;
		$vm.detailMarker && $vm.detailMarker.remove(); //删除
		$vm.centerMaker(param.latlng, 130, () => {
			let titColor = "#19A5FF";
			let bgColor = "rgba(102,158,226,.2)";
			if (item.level === "橙色") {
				titColor = "#f9a513";
				bgColor = "rgba(174,116,14,.2)";
			} else if (item.level === "黄色") {
				bgColor = "rgba(221,219,17,.2)";
				titColor = "#eae712";
			} else if (item.level === "红色") {
				titColor = "#de2302";
				bgColor = "rgba(174,52,14,.2)";
			}
			item.startTime = item.startTime.substring(0, 16);
			item.endTime = item.endTime.substring(0, 16);
			const arr = item.title.split("[");
			item.title1 = arr[0];
			item.title2 = "[" + arr[1];
			let divIcon = L.divIcon({
				className: 'detail-pop-container',
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -5px, 0px); bottom: 0px; left:-160px;">
							<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
							<div class = "leaflet-popup-content-wrapper blue">
							<div class="leaflet-popup-content no-padding" style="position:relative;width:320px;height: 250px;border-radius: 10px;background:rgba(0,0,0,.3)">
								<div style="padding-top:20px;">
									<div style="white-space: nowrap;display:inline-block;padding-left:15px;letter-spacing: 2px;font-weight: bold;font-size:16px;height: 30px;color:${titColor}">${item.typeName}${item.level}预警</div>
									<div style="float:right;color:#819dae;padding-right: 25px;margin-top:-5px;">
										<div>${item.startTime}</div>
										<div>${item.endTime}</div>
									</div>
								</div>
								<div style="padding:10px;">
									<div style="font-size:14px;padding-bottom:10px;">
										<img src="${this.data.yujingImg}" style="margin-right:5px;display:inline-block;vertical-align: middle;"/>
										<span style="display:inline-block;vertical-align: middle;width:200px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;color:#00c4ff;" title="${item.title1}">${item.title1}</span>
										<span style="float:right;color:${titColor};">${item.title2}</span>
									</div>
									<p style="height:150px;overflow:auto;margin:0;padding:10px;border-radius: 10px;line-height: 20px;text-indent:24px;background:${bgColor}">${item.text}</p>
								</div>
							</div>
							</div>
							<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
							<div class="leaflet-popup-tip blue"></div></div>
						   </div>`
			});
			setTimeout(() => {
				$vm.detailMarker = L.marker([item.LAT, item.LON], {
					icon: divIcon
				}).addTo($vm.map);
			}, 200);
		});
	},
	// 获取当前天气预警信息
	getweatherYJ(isAuto) {
		// 已获取过数据,但不是自动获取数据,则不执行
		if (this.getDataFlag && !isAuto) {
			return;
		}
		this.getDataFlag = true;
		C.getDataP123({
			c: "kydp_zxy2036",
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			if (r) {
				if (r["1"].length === 0) {} else {
					this.creatweatherYJ(r["1"]);
				}
			} else {
				$vm.$notify.error({
					title: '提示',
					message: '获取当前天气预警信息数据异常'
				});
			}
		});
	},
}
