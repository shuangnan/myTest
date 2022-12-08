/**
 * 代码分离，单独处理marker图层的逻辑
 * */
//vue实例，在组件created的时候调用setVm传入

let $this = null;


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
	/**--------------------------------------初始化vm-----------------------------------------*/
	setVm(vmParam) {
		if ($this === null) {
			$this = vmParam;
		} else {
			$this.map.eachLayer(function(l) {
				l.removeFrom($this.map)
			})
			$this = null
			$this = vmParam
		}
	},
	/**--------------------------------------map绘制-----------------------------------------*/
	initMap() {
		const mapCenterPoint = [29.9532539232503, 104.449862462555];
		// const mapCenterPoint = [103.9532529232503, 30.761762462555]
		//自定义可缩放比例尺
		// const scaleDenominators = [36978669.43, 27734002.08, 18489334.72, 9244667.36, 4622333.68, 2311166.84, 1155583.42, 577791.71, 288895.85, 144447.93, 72223, 36111.5];
		// const scaleDenominators = $this.scales||[50000000,25000000,12500000,6250000,3125000]
		const scaleDenominators = [36978669, 18489335, 9244667, 4622334, 3081556, 2311167, 1540778, 1155583, 770389, 577792,
			288896, 144448, 72224, 36112, 18056, 9028
		]
		//自定义坐标系
		const crs = L.Proj.CRS("EPSG:3857", {
			origin: mapCenterPoint,
			scaleDenominators: scaleDenominators,
		})
		//边界
		const cornerLeftUp = L.latLng(70, 30);
		const cornerRightDown = L.latLng(-10, 175);
		const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown)
		// const cornerLeftUp = L.latLng(35.940754319438376,95.91098549233627);
		// const cornerRightDown = L.latLng(23.347951478048973,110.96225502691544);
		// const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown)

		// eslint-disable-next-line no-undef
		$this.map = L.map('home-map', {
			// preferCanvas: true,
			// crs : L.CRS.EPSG4326,//坐标系
			// crs : L.CRS.EPSG3857,//坐标系
			crs: crs,
			center: $this.mapCenterPoint || mapCenterPoint, //中心点
			maxZoom: $this.maxZoom || 28, //最大缩放
			minZoom: $this.minZoom || 0, //最小缩放
			zoom: $this.initZoom || 0, //默认缩放
			maxBounds: $this.localBounds || bounds,
			zoomControl: false, //不显示缩放按钮
			logoControl: false, //supermap水印
			attributionControl: false, //水印文本,可以传字符串进行自定义
		});
		//注册地图的缩放事件
		$this.map.on("zoomend", $this.onMapZoom);
		$this.map.on("click", $this.getFutureWeather);

		L.supermap.tiledMapLayer($this.mapUrl, {
			transparent: true
		}).addTo($this.map);

		L.supermap.tiledMapLayer($this.trainLineUrl, {
			transparent: true
		}).addTo($this.map);

	},
	moveTo(target, zoom) {
		$this.map.setView(target, zoom)
	},
	/**--------------------------------------以下为地图事件-----------------------------------------*/
	//////////////////地图框选列车
	// 判断点是否在多边形内
	isPointInPoly(pt, poly) {
		for (var isIn = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
			(poly[i].y <= pt.y && pt.y < poly[j].y || poly[j].y <= pt.y && pt.y < poly[i].y) && pt.x < (poly[j].x - poly[i].x) *
				(pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x && (isIn = !isIn);
		}
		return isIn;
	},
	converLonLatToXY(points) {
		return points.map(p => {
			return {
				x: p[0],
				y: p[1]
			};
		});
	},
	// 开始画多边形
	openEditFlag() {
		$this.map.on('click', (e) => {
			this.mapClick(e)
		}); //点击地图
		$this.map.on('dblclick', (e) => {
			this.mapDoubleClick(e)
		});
		$this.map.on('mousemove', (e) => {
			this.mapMove(e)
		}) //双击地图
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
		$this.map.addLayer(tempLines)
		$this.map.addLayer(lines)
		const node = L.circle(e.latlng, {
			color: '#ff0000',
			fillColor: 'ff0000',
			fillOpacity: 1
		})
		$this.map.addLayer(node)
		geometry.push(node);
	},
	mapDoubleClick() {
		// geometry.push(L.polygon(points).addTo(this.map));
		PolygonPoints = points;
		const _key = (new Date()).Format("yyyyMMddhhmmss");
		this.clearEditcircle();
		const lineObj = this.drawLines(points, _key);
		const pointsXY = this.converLonLatToXY(points);
		const quyuObj = {
			"REGION_ID": _key, //id
			"REGION_TYPE": "1", //区域类型（0-不发送警戒消息，1-发送警戒消息）
			"REGION_NAME": "", //区域名称
			"TRAIN_LIST": "", //列车列表
			"WARN_MESSAGE": "", //警戒消息内容
			"DEPOT": $this.oname, //所属客运段
			"POINT_LIST": pointsXY, //点列表
			visible: true,
			layer: lineObj
		};
		$this.formQuYu = quyuObj;
		$this.visibleQuYu = true;
		return;
		$this.$prompt('请输入区域名称', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			// inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
			// inputErrorMessage: '邮箱格式不正确'
		}).then(({
			value
		}) => {
			const quyuObj = {
				"REGION_ID": _key, //id
				"REGION_TYPE": "1", //区域类型（0-不发送警戒消息，1-发送警戒消息）
				"REGION_NAME": "", //区域名称
				"TRAIN_LIST": "", //列车列表
				"WARN_MESSAGE": "", //警戒消息内容
				"DEPOT": "重庆客运段", //所属客运段
				"POINT_LIST": pointsXY, //点列表
				visible: true,
				layer: lineObj
			}
			$this.endDrawLines(pointsXY, quyuObj); //结束框选
			// $(".marker-tarin[group='" + _key + "']").removeClass("kuang-xuang");
			// dbxLi[d.target.options.myId].removeFrom($this.map);
			this.clearEditLines(true);
		}).catch(() => {
			this.clearEditLines(false);
		});

	},
	clearEditLines() {
		lines.remove();
		tempLines.remove();
		tempLines = new L.polyline([], {
			dashArray: 5
		});
		lines = new L.polyline([])
		points = [];
		this.clearEditcircle();
		$this.map.off("click"); //
		$this.map.off("dblclick"); //
		$this.map.off("mousemove"); //
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
		});
		geometry = [];
	},
	clearEidtAll() {
		this.clearEditLines()
	},
	getPolygonPoints() {
		return PolygonPoints;
	},

	drawLines(obj, _key) {
		var lastPoint = JSON.parse(JSON.stringify(obj[0]));
		obj.push(lastPoint);
		let antPath = L.polyline.antPath(obj, {
			myId: _key,
			"paused": false, //暂停 初始化状态
			"reverse": false, //方向反转
			"delay": 2000, //延迟，值越大越慢
			"dashArray": [10, 20], //间隔样式
			"weight": 1, //线宽
			"color": "gray", //颜色
			"opacity": 1, //透明度
			"pulseColor": "white", //块颜色
			// "fillOpacity" : 1,//
		});

		const a = antPath.addTo($this.map);
		return a;
	},
}
