//绘制多边形
var PolygonPoints = []; //最终的多边形点位信息
var points = [],
	geometry = [],
	dbxLi = [];
var lines = new L.polyline([])
var tempLines = new L.polyline([], {
	dashArray: 5
});
export default {
	// 调用者vm对象
	vm: null,
	// 天地图图层
	baseLayers: null,
	// 天地图地址
	baseLayersUrl: "http://10.3.102.92:8081/iserver/services/map-all13/rest/maps/jzxdp",
	// 天地图中心点
	mapCenterPoint: [37.9532529232503, 104.449862462555], //北京
	// 可缩放比例尺
	scaleDenominators: [36978669.43, 27734002.08, 18489334.72, 9244667.36, 4622333.68, 2311166.84, 1155583.42,
		577791.71, 288895.85, 144447.93, 72223, 36111.5
	],

	zoom: 1, //默认缩放倍数
	maxZoom: 28, //最大缩放
	minZoom: 1, //最小缩放
	// 初始化vue实例为vm
	setVue(v) {
		this.vm = this.vm ? this.vm : v;
	},
	/**
	 * 初始化天地图
	 * @param {Object} p
	 * @param {Object} p.mapCenterPoint 天地图中心点
	 * @param {Object} p.scaleDenominators 可缩放比例尺
	 * @param {Object} p.maxZoom 最大缩放
	 * @param {Object} p.minZoom 最小缩放
	 * @param {Object} p.zoom 默认缩放倍数
	 * @param {Object} p.baseLayersUrl 天地图地址
	 */
	initMap(vue, p, callback) {
		// 无地图对象，则实例化
		if (vue.map === null) {
			//自定义坐标系
			const crs = L.Proj.CRS(p.CRS || "EPSG:3857", {
				// const crs = L.Proj.CRS("EPSG:4326", {
				origin: p.mapCenterPoint || this.mapCenterPoint,
				scaleDenominators: p.scaleDenominators || this.scaleDenominators,
			})
			//边界
			const cornerLeftUp = L.latLng(70, 30);
			const cornerRightDown = L.latLng(-10, 175);
			const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown);
			vue.map = L.map(p.el, {
				crs: crs,
				center: p.mapCenterPoint || this.mapCenterPoint, //中心点
				maxZoom: p.maxZoom || this.maxZoom, //最大缩放
				minZoom: p.minZoom || this.minZoom, //最小缩放
				zoom: p.zoom || this.zoom, //默认缩放
				maxBounds: bounds,
				zoomControl: false, //显示缩放按钮
				logoControl: false, //supermap水印
				attributionControl: false, //水印文本,可以传字符串进行自定义
			});
			// vm.map.on("zoomend", this.onMapZoom);
		}
		this.baseLayers = L.supermap.tiledMapLayer(p.baseLayersUrl || this.baseLayersUrl, {
			transparent: true
		}).addTo(vue.map);
		callback && callback.call();
	},
	// 判断点是否在多边形内
	isPointInPoly(pt, poly) {
		for (var isIn = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
			(poly[i].y <= pt.y && pt.y < poly[j].y || poly[j].y <= pt.y && pt.y < poly[i].y) && pt.x < (poly[j].x - poly[i].x) *
				(pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x && (isIn = !isIn);
		}
		return isIn;
	},
	converLonLatToXY(points){
		return points.map(p=>{
			return {x:p[0],y:p[1]};
		});
	},
	// 开始画多边形
	openEditFlag() {
		this.vm.map.on('click', (e)=>{this.mapClick(e)}); //点击地图
		this.vm.map.on('dblclick', (e)=>{this.mapDoubleClick(e)});
		this.vm.map.on('mousemove', (e)=>{this.mapMove(e)}) //双击地图
	},
	mapClick(e) {
		if (points.length > 0) {
			var lastPoint = points[points.length - 1];
			if (lastPoint[0] == e.latlng.lat && lastPoint[1] == e.latlng.lng) {
				return;
			}
		}
		points.push([e.latlng.lat, e.latlng.lng])
		lines.addLatLng(e.latlng)
		this.vm.map.addLayer(tempLines)
		this.vm.map.addLayer(lines)
		const node = L.circle(e.latlng, {
			color: '#ff0000',
			fillColor: 'ff0000',
			fillOpacity: 1
		})
		this.vm.map.addLayer(node)
		geometry.push(node);
	},
	mapDoubleClick() {
		// geometry.push(L.polygon(points).addTo(this.map));
		PolygonPoints = points;
		this.drawLines(points);
		this.vm.endDrawLines(this.converLonLatToXY(points));//结束框选
		points = []
		lines.remove()
		tempLines.remove()
		lines = new L.polyline([])
		this.vm.map.off("click"); //
		this.vm.map.off("dblclick"); //
		this.vm.map.off("mousemove"); //
	},
	mapMove(e) {
		if (points.length > 0) {
			let ls = [points[points.length - 1],
				[e.latlng.lat, e.latlng.lng], points[0]
			]
			tempLines.setLatLngs(ls)
		}
	},
	clearEditcircle() {
		geometry.forEach(v => {
			v.remove();
		})
	},
	clearEidtAll() {
		geometry.forEach(v => {
			v.remove();
		})
		dbxLi.forEach(v => {
			v.remove();
		})
	},
	getPolygonPoints() {
		return PolygonPoints;
	},
	saveEdit(ppoints) {
		// this.addPolygon(ppoints);
		this.clearEditcircle();
	},
	addPolygon(polyInt) {
		var latlngs = [
			[70, 30],
			[70, 175],
			[-10, 175],
			[-10, 30]
		]; //先纬度，再经度 横经竖维 左上角顺时针
		var plyall = new L.Polygon([latlngs, polyInt], {
			color: 'transparent',
			opacity: 0.2,
			fillColor: '#aaa',
			fillOpacity: 0.4
		});
		plyall.addTo(this.vm.map);
		dbxLi.push(plyall);
	},
	drawLines(obj) {
		var lastPoint = JSON.parse(JSON.stringify(obj[0]));
		obj.push(lastPoint);
		let antPath = L.polyline.antPath(obj, {
			"paused": false, //暂停 初始化状态
			"reverse": false, //方向反转
			"delay": 400, //延迟，值越大越慢
			"dashArray": [10, 20], //间隔样式
			"weight": 1, //线宽
			"color": "gray", //颜色
			"opacity": 1, //透明度
			"pulseColor": "white", //块颜色
			// "fillOpacity" : 1,//
		});
		dbxLi.push(antPath.addTo(this.vm.map));
	},
}
