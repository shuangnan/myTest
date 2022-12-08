import mapUnit from "./mapUtil.js"
let $vm = null;
export default {
	lastPoint: {}, //最后一个点
	points: [], //所有点
	markers: [], //marker层
	lines: null, //实线
	tempLines: null,
	distanceV: 0, //距离
	tempDistanceV: 0, //
	distanceT: "", //距离
	data: {},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if ($vm.config.btns.ranging) {
			this.bindEvent();
		}
	},
	bindEvent() {
		$vm.map.on("click", (e) => {
			if ($vm.rangingFlag) {
				this.onClick(e);
			}
		});
		$vm.map.on("mousemove", (e) => {
			if ($vm.rangingFlag) {
				this.onMove(e);
			}
		});
		$vm.map.on("mousedown", (e) => {
			if ($vm.rangingFlag) {
				this.onMousedown(e);
			}
		});
	},
	//注册点击，创建临线
	startDraw() {
		this.clearAll();
		$vm.rangingFlag = true;
		// $vm.map.dragging.disable(); //地图禁止拖动
		$vm.map.doubleClickZoom.disable(); //地图禁止双击放大
		// $vm.map.scrollWheelZoom.disable(); //地图禁止鼠标滚轮缩放
	},
	// 清除所有记录
	clearAll() {
		$vm.rangingFlag = false;
		$vm.map.dragging.enable(); //地图允许拖动
		$vm.map.doubleClickZoom.enable(); //地图允许双击放大
		$vm.map.scrollWheelZoom.enable(); //地图允许鼠标滚轮缩放
		if ($("#rangingDistanseResult").length === 1) {
			$("#rangingDistanseResult").html("<span>单击确定起点</span><div>右键结束测距</div>").css({
				top: -100,
				left: -100
			});
		} else {
			$("body").append(`<div id="rangingDistanseResult"><span>单击确定起点</span><div>右键结束测距</div></div>`);
		}
		$("#rangingDistanseResult").css({
			top: -100,
			left: -100
		});
		this.distanceV = 0;
		this.tempDistanceV = 0;
		this.distanceT = "起点";
		this.points = [];
		// 清空小圆点
		this.markers.forEach(v => {
			v.remove();
		});
		this.lines && this.lines.removeFrom($vm.map);
		this.tempLines && this.tempLines.removeFrom($vm.map);
		this.lines = new L.polyline([]);
		this.tempLines = new L.polyline([], { //临时虚线
			dashArray: 5
		});
		$vm.map.addLayer(this.tempLines);
		$vm.map.addLayer(this.lines);
	},

	onClick(e) {
		// 当前点击位置与最后一个点相同
		if (this.lastPoint.lat == e.latlng.lat && this.lastPoint.lng == e.latlng.lng) {
			return;
		}
		this.lastPoint = e.latlng;
		this.points.push(e.latlng);
		this.lines.addLatLng(e.latlng);
		this.distanceV += this.tempDistanceV;
		// 小圆点 + 信息框
		const node = L.marker(e.latlng, {
			icon: L.divIcon({
				className: "ranging-circle-container",
				html: `<div class="ranging-box"><i></i><span>${this.distanceT}</span></div>`,
			})
		}).on("click",(e)=>{
			$vm.eqCreater.srcLongitude = e.target._latlng.lng;
			$vm.eqCreater.srcLatitude = e.target._latlng.lat;
		});
		$vm.map.addLayer(node);
		this.markers.push(node);
	},
	//e：鼠标移动产生的点位
	onMove(e) {
		$("#rangingDistanseResult").css({
			top: window.event.clientY + 10,
			left: window.event.clientX + 10
		});
		if (this.points.length > 0) {
			this.tempDistanceV = mapUnit.getDistance(e.latlng, this.lastPoint);
			let n = this.distanceV + this.tempDistanceV;
			this.distanceT = n < 1000 ? Math.floor(n) + "米" : (n / 1000).toFixed(1) + "公里";
			$("#rangingDistanseResult>span").html(this.distanceT);
			this.tempLines.setLatLngs([this.lastPoint, e.latlng]);
		}
	},
	onMousedown() {
		if (window.event.button === 2) {
			$vm.rangingFlag = false;
			$vm.map.dragging.enable(); //地图允许拖动
			$vm.map.doubleClickZoom.enable(); //地图允许双击放大
			$vm.map.scrollWheelZoom.enable(); //地图允许鼠标滚轮缩放
			this.tempLines.removeFrom($vm.map); //删除临时线
			$("#rangingDistanseResult").css({
				top: -100,
				left: -100
			});
			const node = L.marker(this.lastPoint, {
				icon: L.divIcon({
					popupAnchor: [110, 110],
					className: "ranging-remove-container",
					html: `<div class="ranging-remove" title="清除本次测距">×</div>`,
				})
			}).on("click", () => {
				this.clearAll();
			});
			$vm.map.addLayer(node);
			this.markers.push(node);
		}
	}
}
