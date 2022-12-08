/**
 * 全景视频
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag: false, // 是否已调用接口
	data: {
		panoramicVideo: {
			videoTitle: "全景视频",
			videoVisible: false,
			videoSrc: "",
			layers: null,
			visible: false
		}
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.video360.register) {
			return;
		}
		// 设置默认值
		this.data.panoramicVideo.visible = $vm.config.video360.checked;
		this.initData();
	},
	// 初始化数据
	initData() {
		if (this.data.panoramicVideo.visible) {
			this.getDatas(false);
		}
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 过滤图层元素
	filterLayer() {
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getDatas(false);
			return;
		}
		try {
			if (this.data.panoramicVideo.visible) {
				$vm.map.addLayer(this.data.panoramicVideo.layers);
			} else {
				$vm.map.removeLayer(this.data.panoramicVideo.layers);
			}
		} catch (e) {
			//TODO handle the exception
		}
	},
	// 创建marker---当前天气
	creatMarkers(source) {
		this.data.panoramicVideo.layers && $vm.map.removeLayer(this.data.panoramicVideo.layers);
		this.data.panoramicVideo.layers = L.layerGroup();
		// this.data.panoramicVideo.layers.addTo($vm.map);
		C.$.each(source, (index, item) => {
			const latlngs = item.children.map(v => [v.POINT_X, v.POINT_Y]);
			if (latlngs.length === 1) {
				const marker = L.marker(latlngs[0], {
					icon: L.divIcon({
						className: "",
						html: `<div style="background:#1e90ff;width:14px;height:14px;border-radius:50%;font-size:12px;text-align:center;">${item.PATH_NUM}</div>`,
					})
				});
				marker.on("click", () => {
					this.playTrainLineVideo(item);
				});
				this.data.panoramicVideo.layers.addLayer(marker);
			} else {
				const marker1 = L.polyline(latlngs, {
					color: "#1e90ff",
					weight: 5
				});
				this.data.panoramicVideo.layers.addLayer(marker1);
				const marker2 = L.polyline(latlngs, {
					color: "#1e90ff",
					weight: 20,
					opacity: 0.01
				});
				marker2.on("click", () => {
					this.playTrainLineVideo(item);
				})
				// .on("mouseover", (p) => {
				// 	marker2.setStyle({
				// 		opacity: 0.4
				// 	});
				// }).on("mouseout", (p) => {
				// 	marker2.setStyle({
				// 		opacity: 0.01
				// 	});
				// });
				this.data.panoramicVideo.layers.addLayer(marker2);
			}
		});
		this.filterLayer();
	},
	// 播放铁路沿线视频
	playTrainLineVideo(row) {
		const url = "https://10.192.34.85:8443/JFLCMS/vueYTH/#/videoVR?videoSrc=";
		const path = encodeURIComponent(row.G_CONTENT);
		this.data.panoramicVideo.videoTitle = row.G_NAME+" ("+row.LINE_NAME+")";
		this.data.panoramicVideo.videoSrc = url + path;
		this.data.panoramicVideo.videoVisible = true;
	},
	// 获取已配置指定类型元素（含视频）的线路列表
	getDatas(isAuto) {
		// 已获取过数据,但不是自动获取数据,则不执行
		if (this.getDataFlag && !isAuto) {
			return;
		}
		this.getDataFlag = true;
		C.getData({
			c: "trdm_lv_833", //param1 [分组类型（1-全景视频）] return [[LINE_ID（线路ID），LINE_NAME（线路名称）]
			s: ["1"],
		}, (r) => {
			const querys = r.map(v => {
				return new Promise((resolve, reject) => {
					C.getData({
						c: "trdm_lv_834", //param1 [线路ID，分组类型（1-全景视频）]
						s: [v.LINE_ID, 1],
					}, (rs) => {
						resolve(rs);
					});
				});
			})
			Promise.all(querys).then((arr) => {
				let real = [];
				arr.forEach(v => {
					const t = C.creatJsonArrByKey(v, "G_ID");
					real = real.concat(t);
				});
				this.creatMarkers(real);
			});
		});
	},
	// 获取线
	// 获取指定线路指定类型分组与分组详情
	getStationInfo(stncode) {
		//1240 where: ["GWW"]
		return new Promise((resolve, reject) => {
			C.getData({
				c: "1240",
				w: [stncode],
				url: "https://10.192.6.179/PTMS/GeneralProServlet", //接口地址
			}, (rs) => {
				resolve(rs);
			});
		});
	},
}
