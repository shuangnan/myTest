import mapUnit from "./mapUtil.js"
import mapUtil from "@/components/map/js/mapUtil";
import gongDian from "./gongDian.js"
import yjTrainStatics from "@/components/map/js/yjTrainStatics";
import C from "@/assets/com";
let $vm = null;
export default {
	isTemp: false,
	isYjSrc: false,
	lastPoint: {}, //最后一个点
	points: [], //所有点
	markers: [], //marker层
	lines: null, //实线
	tempLines: null,
	data: {},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if ($vm.config.btns.drawRegion) {
			this.bindEvent();
		}
		if ($vm.config.btns.drawRegionCount) {
			this.bindEvent();
		}
	},
	bindEvent() {
		$vm.map.on("click", (e) => {
			console.log('点击1')
			if ($vm.drawFlag) {
				this.onClick(e);
			}
		}).on("mousemove", (e) => {
			if ($vm.drawFlag) {
				this.onMove(e);
			}
		}).on("dblclick", (e) => {
			if ($vm.drawFlag) {
				this.onDblclick(e);
			}
		});
	},
	//注册点击
	startDraw(temp, isYjSrc = false) {
		this.clearAll(temp);
		this.isTemp = temp
		$vm.drawFlag = true;
		this.isYjSrc = isYjSrc
		// $vm.map.dragging.disable(); //地图禁止拖动
		$vm.map.doubleClickZoom.disable(); //地图禁止双击放大
		// $vm.map.scrollWheelZoom.disable(); //地图禁止鼠标滚轮缩放
		// if (type !== '应急') {
		// 	this.isCount = false
		// 	this.clearAll(false);
		// 	$vm.drawFlag = true;
		// 	// $vm.map.dragging.disable(); //地图禁止拖动
		// 	$vm.map.doubleClickZoom.disable(); //地图禁止双击放大
		// 	// $vm.map.scrollWheelZoom.disable(); //地图禁止鼠标滚轮缩放
		// } else {
		// 	console.log('应急框选列车1')
		// 	this.isCount = true
		// 	this.clearAll(true);
		// 	$vm.drawFlag = true;
		// 	console.log($vm.drawFlag)
		// 	// $vm.map.dragging.disable(); //地图禁止拖动
		// 	$vm.map.doubleClickZoom.disable(); //地图禁止双击放大
		// 	// $vm.map.scrollWheelZoom.disable(); //地图禁止鼠标滚轮缩放
		// }
	},
	// 清除所有记录
	clearAll(isRemoveRegion) {
		// 将已画区域删除
		if (isRemoveRegion) {
			$vm.curTab === "基础" && $vm.boundRegionOther.formQuYu.layer && $vm.boundRegionOther.formQuYu.layer.removeFrom($vm.map);
			$vm.curTab === "供电" && $vm.gongDianOther.regionLayer && $vm.gongDianOther.regionLayer.removeFrom($vm.map);
		}
		$vm.drawFlag = false;
		$vm.map.dragging.enable(); //地图允许拖动
		$vm.map.doubleClickZoom.enable(); //地图允许双击放大
		$vm.map.scrollWheelZoom.enable(); //地图允许鼠标滚轮缩放

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
		console.log('框选点击')
		// 当前点击位置与最后一个点相同
		if (this.lastPoint.lat == e.latlng.lat && this.lastPoint.lng == e.latlng.lng) {
			return;
		}
		this.lastPoint = e.latlng;
		this.points.push(e.latlng);
		this.lines.addLatLng(e.latlng);
		// 小圆点
		const node = L.circle(e.latlng, {
			color: '#ff0000',
			fillColor: 'ff0000',
			fillOpacity: 1
		})
		$vm.map.addLayer(node);
		this.markers.push(node);
	},
	//e：鼠标移动产生的点位
	onMove(e) {
		if (this.points.length > 0) {
			this.tempLines.setLatLngs([this.lastPoint, e.latlng, this.points[0]]);
		}
	},
	onDblclick(e) {
		this.tempLines && this.tempLines.removeFrom($vm.map);
		const _key = (new Date()).Format("yyyyMMddhhmmss");
		const lineObj = this.drawLines(this.points, _key);
		const pointsXY = this.latlngToXY(this.points);
		console.log("pointsXY" + JSON.stringify(pointsXY));
		if ($vm.curTab === "供电") {
			$vm.gongDianOther.regionPoints = pointsXY;
			$vm.gongDianOther.regionLayer = lineObj;
			$vm.$nextTick(() => {
				gongDian.filterLayer("供电_接触网");
			});
			// this.clearAll(true);
		} else {
			$vm.boundRegionOther.formQuYu = {
				"REGION_ID": _key, //id
				"REGION_TYPE": "1", //区域类型（0-不发送警戒消息，1-发送警戒消息）
				"REGION_NAME": "", //区域名称
				"TRAIN_LIST": "", //列车列表
				"WARN_MESSAGE": "", //警戒消息内容
				"DEPOT": $vm.oname, //所属客运段
				"POINT_LIST": pointsXY, //点列表
				visible: true,
				layer: lineObj
			};
			if (this.isTemp && !this.isYjSrc) {
				console.log('框选范围', $vm.boundRegionOther.formQuYu)
				console.log('范围内车次', this.getTrainsInRegion([$vm.boundRegionOther.formQuYu]))
				const selectedTrains = this.getTrainsInRegion([$vm.boundRegionOther.formQuYu])
				const statData = yjTrainStatics.generateTrainStaticsData(selectedTrains)
				$vm.statDialog.visible = true
				$vm.statDialog.statData = statData
				$vm.lightEarthToolbar.current = ''
				$vm.applyStatData(statData)
				// $vm.$refs['stat'].applyData(statData)
			} else if (this.isTemp && this.isYjSrc) {
				console.log('框选范围', $vm.boundRegionOther.formQuYu.POINT_LIST)
				this.getYjSrcs($vm.boundRegionOther.formQuYu.POINT_LIST)
			} else {
				// 区域对象更新到主页面
				$vm.boundRegionOther.formVisible = true;
			}
		}
		this.clearAll(false);
	},
	getYjSrcs(pts) {
		let points = JSON.parse(JSON.stringify(pts))
		$vm.yjDrawRegionPts = points
		$vm.getYjSrcs()
	},
	getTrainsInRegion(_regions) {
		const regions = _regions
		const rsTrains = [];
		$vm.trainOhter.tarinData.forEach(train => {
			regions.forEach(quyu => {
				if (quyu.visible && mapUtil.isPointInPoly(train.pointXY, quyu.POINT_LIST)) {
					rsTrains.push(train);
					// C.$("#" + train.TRAIN_ID).addClass("kuang-xuang").attr("group", quyu.REGION_ID);
				}
			});
		});
		return rsTrains;
	},
	// 绘制线
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
		return antPath.addTo($vm.map);
	},
	latlngToXY(latlngs) {
		return latlngs.map(p => {
			console.log("p.lat" + p.lat);
			return {
				x: p.lat,
				y: p.lng
			};
		});
	}
}
