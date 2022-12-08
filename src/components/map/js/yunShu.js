/**
 * 运输
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag_sbss: false, // 是否已调用接口-设备设施
	getDataFlag_jflc1: false, // 是否已调用接口-接发列车限制
	getDataFlag_jflc2: false, // 是否已调用接口-接发列车限制
	getDataFlag_dcjc: false, // 是否已调用接口-调车机车
	data: {
		light: false,
		// 图层
		yunShu_layers: {
			// 运输——设备设施
			ys_sbss: {
				ck_cwd: L.layerGroup(), //显示车务段
				ck_jyd: L.layerGroup(), //显示救援队
			},
			// 运输——范围
			ys_fw: {
				ck_cwd: L.layerGroup(), //显示车务段范围
			},
			// 运输——接发列车限制
			ys_jflc: {
				ck_xdfx: L.layerGroup(), //显示相对方向同时接车限制
				ck_tfx: L.layerGroup(), //显示同方向同时发接列车限制
			},
			// 运输——调车机车
			ys_dcjc: {
				ck_ddjc: L.layerGroup(), //显示调度机车
				ck_snxyc: L.layerGroup(), //显示枢纽小运车机车
				ck_zydc: L.layerGroup(), //显示专用调车机车
				ck_lycz: L.layerGroup(), //显示专用线调车机车
			},
		},
		// 绑定数据
		yunShuOther: {
			// 运输——设备设施
			ys_sbss: {
				ck_jyd: false, //显示救援队
			},
			// 运输——范围
			ys_fw: {
				ck_cwd: false, //显示车务段范围
			},
			// 运输——接发列车限制
			ys_jflc: {
				ck_lkjz: false, //旅客列车禁止停留接车限制
				ck_lcjz: false, //显示列车禁止停留列车限制
// 				ck_xdfx: false, //显示相对方向同时接车限制
// 				ck_tfx: false, //显示同方向同时发接列车限制
			},
			// 运输——调车机车
			ys_dcjc: {
				ck_ddjc: false, //显示调度机车
				ck_snxyc: false, //显示枢纽小运车机车
				ck_zydc: false, //显示专用调车机车
				ck_lycz: false, //显示专用线调车机车
			},
			bounds: []
		},
		yunshuUnitList: []
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		// 运输——设备设施		运输——范围		运输——接发列车限制		运输-调车机车
		if (!$vm.config.ys_sbss.register && !$vm.config.ys_fw.gd_fw && !$vm.config.ys_jflc.gd_gdc && !$vm.config.ys_dcjc.gd_gdc) {
			return;
		}
		// 设置默认值
		this.data.yunShuOther.ys_sbss.ck_jyd = $vm.config.ys_sbss.ck_jyd; //设备设施-救援队
		this.data.light = $vm.config.superMap.lightMode

		this.data.yunShuOther.ys_fw.ck_cwd = $vm.config.ys_fw.ck_cwd; //范围-车务段范围

		this.data.yunShuOther.ys_jflc.ck_lkjz = $vm.config.ys_jflc.ck_lkjz; //接发列车限制-显示旅客禁止停留列车限制
		this.data.yunShuOther.ys_jflc.ck_lcjz = $vm.config.ys_jflc.ck_lcjz; //接发列车限制-显示列车禁止停留列车限制

		this.data.yunShuOther.ys_jflc.ck_xdfx = $vm.config.ys_jflc.ck_xdfx; //接发列车限制-相对方向同时接车限制
		this.data.yunShuOther.ys_jflc.ck_tfx = $vm.config.ys_jflc.ck_tfx; //接发列车限制-同方向同时发接列车限制

		this.data.yunShuOther.ys_dcjc.ck_ddjc = $vm.config.ys_dcjc.ck_ddjc; //调车机车-调度机车
		this.data.yunShuOther.ys_dcjc.ck_snxyc = $vm.config.ys_dcjc.ck_snxyc; //调车机车-枢纽小运车机车
		this.data.yunShuOther.ys_dcjc.ck_zydc = $vm.config.ys_dcjc.ck_zydc; //调车机车-专用调车机车
		this.data.yunShuOther.ys_dcjc.ck_lycz = $vm.config.ys_dcjc.ck_lycz; //调车机车-路用出租机车

		this.initData();
		// 绑定调车机车marker中事件
		window.chooseYsJcTab = (el, ty) => this.chooseYsJcTab(el, ty);
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 初始化数据
	initData() {
		if ($vm.config.ys_fw.register) {
			this.getData_fw(); //查询车务段管界
			this.getData_unitList()
		}
		if ($vm.config.ys_sbss.register && this.data.yunShuOther.ys_sbss.ck_jyd) {
			this.getData_sbss(); //查询设备设施
		}
		if ($vm.config.ys_jflc.register &&
			(this.data.yunShuOther.ys_jflc.ck_xdfx || this.data.yunShuOther.ys_jflc.ck_tfx)) {
			this.getData_jflc(); //查询接发列车限制
		}
		if ($vm.config.ys_jflc.register &&this.data.yunShuOther.ys_jflc.ck_lkjz) {
			this.getData_jflc('1'); //查询接发列车限制
		}
		if ($vm.config.ys_jflc.register &&this.data.yunShuOther.ys_jflc.ck_tfx) {
			this.getData_jflc('2'); //查询接发列车限制
		}
		if ($vm.config.ys_dcjc.register &&
			(this.data.yunShuOther.ys_dcjc.ck_ddjc ||
				this.data.yunShuOther.ys_dcjc.ck_snxyc ||
				this.data.yunShuOther.ys_dcjc.ck_zydc ||
				this.data.yunShuOther.ys_dcjc.ck_lycz)) {
			this.getData_dcjc(); //查询调车机车
		}
	},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {},
	// 过滤图层元素
	filterLayer(ty, obj) {
		if (ty === "运输_设备设施") {
			// 若未获取过数据,则先获取数据
			if (this.getDataFlag_sbss === false) {
				this.getData_sbss();
				return;
			}
			if (this.data.yunShuOther.ys_sbss.ck_jyd) {
				$vm.map.addLayer(this.data.yunShu_layers.ys_sbss.ck_jyd);
			} else {
				$vm.map.removeLayer(this.data.yunShu_layers.ys_sbss.ck_jyd);
			}
		} else if (ty === "运输_范围") {
			if (obj.visible) {
				obj.layers.addTo($vm.map);
			} else {
				obj.layers.removeFrom($vm.map);
			}
		} else if (ty === "运输_接发列车限制") {
			// 若未获取过数据,则先获取数据


			if (this.data.yunShuOther.ys_jflc.ck_lkjz) {
				if (this.getDataFlag_jflc1 === false) {
					this.getData_jflc('1');
					return;
				}
				$vm.map.addLayer(this.data.yunShu_layers.ys_jflc.ck_lkjz);
			} else {
				if (this.data.yunShu_layers.ys_jflc.ck_lkjz) {
					$vm.map.removeLayer(this.data.yunShu_layers.ys_jflc.ck_lkjz);
				}
			}
			if (this.data.yunShuOther.ys_jflc.ck_lcjz) {
				if (this.getDataFlag_jflc2 === false) {
					this.getData_jflc('2');
					return;
				}
				$vm.map.addLayer(this.data.yunShu_layers.ys_jflc.ck_lcjz);
			} else {
				if ($vm.map.removeLayer(this.data.yunShu_layers.ys_jflc.ck_lcjz)) {
					$vm.map.removeLayer(this.data.yunShu_layers.ys_jflc.ck_lcjz);
				}
			}

// 			if (this.data.yunShuOther.ys_jflc.ck_xdfx) {
// 				$vm.map.addLayer(this.data.yunShu_layers.ys_jflc.ck_xdfx);
// 			} else {
// 				$vm.map.removeLayer(this.data.yunShu_layers.ys_jflc.ck_xdfx);
// 			}
// 			if (this.data.yunShuOther.ys_jflc.ck_tfx) {
// 				$vm.map.addLayer(this.data.yunShu_layers.ys_jflc.ck_tfx);
// 			} else {
// 				$vm.map.removeLayer(this.data.yunShu_layers.ys_jflc.ck_tfx);
// 			}
		} else if (ty === "运输_调车机车") {
			// 若未获取过数据,则先获取数据
			if (this.getDataFlag_dcjc === false) {
				this.getData_dcjc();
				return;
			}
			if (this.data.yunShuOther.ys_dcjc.ck_ddjc) {
				$vm.map.addLayer(this.data.yunShu_layers.ys_dcjc.ck_ddjc);
			} else {
				$vm.map.removeLayer(this.data.yunShu_layers.ys_dcjc.ck_ddjc);
			}
			if (this.data.yunShuOther.ys_dcjc.ck_snxyc) {
				$vm.map.addLayer(this.data.yunShu_layers.ys_dcjc.ck_snxyc);
			} else {
				$vm.map.removeLayer(this.data.yunShu_layers.ys_dcjc.ck_snxyc);
			}
			if (this.data.yunShuOther.ys_dcjc.ck_zydc) {
				$vm.map.addLayer(this.data.yunShu_layers.ys_dcjc.ck_zydc);
			} else {
				$vm.map.removeLayer(this.data.yunShu_layers.ys_dcjc.ck_zydc);
			}
			if (this.data.yunShuOther.ys_dcjc.ck_lycz) {
				$vm.map.addLayer(this.data.yunShu_layers.ys_dcjc.ck_lycz);
			} else {
				$vm.map.removeLayer(this.data.yunShu_layers.ys_dcjc.ck_lycz);
			}
		}
	},
	// 创建marker 救援队
	creatMarker_jyd(source) {
		let ck_jyd = L.layerGroup(); //图层---救援队
		this.data.yunShu_layers.ys_sbss.ck_jyd = ck_jyd;
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "yunshu-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'yunshu-marker-light' : 'yunshu-marker'} sbss-jyd" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("救援队", item, p);
			});
			ck_jyd.addLayer(marker);
		});
		this.data.yunShu_layers.ys_sbss.ck_jyd = ck_jyd;
		this.filterLayer("运输_设备设施");
	},
	// 创建marker 接发列车
	creatMarker_jflc(source,type) {
		let ck_lkjz = L.layerGroup(); //图层---相对方向同时接车
		let ck_lcjz = L.layerGroup(); //图层---同方向同时接车
		// this.data.yunShu_layers.ys_jflc.ck_lkjz = ck_lkjz;
		// this.data.yunShu_layers.ys_jflc.ck_lcjz = ck_lcjz;
		C.$.each(source, (index, item) => {
			// 类型(1：禁止同方向同时发接的车站2：禁止相对方向同时接车的车站)
			// const cls = item.TYPE == "2" ? "jflc-xdfx" : "jflc-tfx";
			const cls = type == "2" ? "jflc-lcjz" : "jflc-lkjz";
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "yunshu-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'yunshu-marker-light' : 'yunshu-marker'} ${cls}" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("列车限制", item, p);
			});
			if (type === "1") {
				ck_lkjz.addLayer(marker);
			} else {
				ck_lcjz.addLayer(marker);
			}
		});
		if (type === "1") {
			this.data.yunShu_layers.ys_jflc.ck_lkjz = ck_lkjz;
		} else {
			this.data.yunShu_layers.ys_jflc.ck_lcjz = ck_lcjz;
		}
// 		this.data.yunShu_layers.ys_jflc.ck_xdfx = ck_xdfx;
// 		this.data.yunShu_layers.ys_jflc.ck_tfx = ck_tfx;
		this.filterLayer("运输_接发列车限制");
	},
	// 创建marker 调车机车
	creatMarker_dcjc(source) {
		// 类型（1：专调机车 2：小运转 3：调度机车 4：路用、出租机车
		const pics = ["", "zydc", "snxyc", "ddjc", "lycz"];
		let ck_ddjc = L.layerGroup();
		let ck_snxyc = L.layerGroup();
		let ck_zydc = L.layerGroup();
		let ck_lycz = L.layerGroup();
		this.data.yunShu_layers.ys_dcjc.ck_ddjc = ck_ddjc; //图层---调度机车
		this.data.yunShu_layers.ys_dcjc.ck_snxyc = ck_snxyc; //图层---枢纽小运车机车
		this.data.yunShu_layers.ys_dcjc.ck_zydc = ck_zydc; //图层---专用调车机车
		this.data.yunShu_layers.ys_dcjc.ck_lycz = ck_lycz; //图层---路用出租机车
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "yunshu-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'yunshu-marker-light' : 'yunshu-marker'} dcjc-${pics[item.TYPE]}" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("调车机车", item, p);
			});
			// 类型（1：专调机车 2：小运转 3：调度机车 4：路用、出租机车）
			if (item.TYPE === "1") {
				ck_zydc.addLayer(marker);
			} else if (item.TYPE === "2") {
				ck_snxyc.addLayer(marker);
			} else if (item.TYPE === "3") {
				ck_ddjc.addLayer(marker);
			} else if (item.TYPE === "4") {
				ck_lycz.addLayer(marker);
			}
		});
		this.data.yunShu_layers.ys_dcjc.ck_ddjc = ck_ddjc;
		this.data.yunShu_layers.ys_dcjc.ck_snxyc = ck_snxyc;
		this.data.yunShu_layers.ys_dcjc.ck_zydc = ck_zydc;
		this.data.yunShu_layers.ys_dcjc.ck_lycz = ck_lycz;
		this.filterLayer("运输_调车机车");
	},
	// 绑定marker点击事件---
	setMarkerClick(type, data, marker) {
		if ($vm.drawFlag || $vm.rangingFlag) return;
		$vm.detailMarker && $vm.detailMarker.remove(); //删除
		let lay = {
			x: 20,
			w: 300,
			h: 340
		};
		const addPop = (content) => {
			let nameDivIcon = L.divIcon({
				className: "detail-pop-container",
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${lay.x}px, ${lay.h-40}px, 0px); bottom: 0px;">
					<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class = "leaflet-popup-content-wrapper marker-yunshu-info-popup">
						<div class="leaflet-popup-content no-padding" style="position:relative;width:${lay.w}px;height: ${lay.h}px;">
							${content}
						</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
			   </div>`
			});
			$vm.detailMarker = L.marker(marker.latlng, {
				icon: nameDivIcon
			}).addTo($vm.map);
		}
		let demo = '';
		if (type === "救援队") {
			lay = {
				x: 20,
				w: 430,
				h: 320
			};
			C.getDataP123({
				c: "tyzd_ggy2014",
				s: [
					[data.PKID]
				],
				a: "查询救援队详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const d = r["1"][0]
					demo =
						`<i class="marker-yunshu-info-tip"></i>
					<div class="marker-yunshu-info jyd" style="width:${lay.w}px">
						<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
							<tbody>
								<tr><td><div class="tit">${d.DEPOT}</div><div class="sub-tit">${d.STATION}</div></td></tr>
								<tr><td>
									<div class="line-v"></div>
									<div class="list-item inline"><span style="width:110px;text-align:left">设备配置地点:</span><label class="blue">${d.SB_LOCATION}</label></div>
									<div class="list-item inline"><span style="width:110px;text-align:left">设备存放地点:</span><label class="blue">${d.SB_SAVEPLACE}</label></div>
									<div class="list-item inline"><span style="width:130px;text-align:left">设备日常管理部门:</span><label class="blue">${d.SB_BM}</label></div>
									<div class="list-item inline"><span style="width:110px;text-align:left">设备生产厂家:</span><label class="blue">${d.SB_FACTORY}</label></div>
									<div class="list-item inline"><span>设备型号:</span><label class="blue">${d.SB_TYPE}</label></div>
									<div class="list-item auto"><span>设备动力:</span><label class="blue">${d.SB_POWER}</label></div>
									<div class="list-item auto"><span>设备数量:</span><label class="blue">${d.SB_NUM}</label></div>
									<div class="list-item auto"><span>设备状态:</span><label class="blue">${d.SB_STATUS}</label></div>,
									<div class="list-item auto"><span>备注:</span><label class="blue">${d.REMARKS}</label></div>
								</td></tr>
							</tbody>
						</table>
					</div>`
					addPop(demo);
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			});
		} else if (type === "接发列车") {
			lay = {
				x: 20,
				w: 500,
				h: 400
			}
			C.getDataP123({
				c: "tyzd_ggy2011",
				s: [
					[data.STATION, data.TYPE]
				],
				a: "查询接发列车限制车站详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const d = r["1"];
					let thead =
						`<tr><th style="width:60px">线路</th><th>接入列车<br/>种类</th><th>接入的列车<br/>发出股道</th><th>禁止同时接入的<br/>列车种类</th><th>禁止同时接入的<br/>列车接入股道</th><th>备注</th></tr>`;
					if (data.TYPE === '2') {
						thead =
							`<tr><th style="width:60px">线路</th><th>接入经由<br/>线路</th><th>接入的列车<br/>接入股道</th><th>禁止同时接入的<br/>经由线路</th><th>禁止同时接入的<br/>列车接入股道</th><th>备注</th></tr>`;
					}
					let trs = d.map(v => {
						return `<tr><td>${v.LINE}</td><td>${v.LINK}</td><td>${v.TRACK}</td><td>${v.LINK_BAN}</td><td>${v.TRACK_BAN}</td><td>${v.REMARKS}</td></tr>`
					});
					trs.unshift(thead);
					trs = trs.join("");
					demo =
						`<i class="marker-yunshu-info-tip"></i>
						<div class="marker-yunshu-info jflc" style="height:${lay.h-10}px;margin-top:20px;overflow:auto;">
							<table border="1" cellpadding="0" cellspacing="0" style="width:100%">
								<tbody>
									${trs}
								</tbody>
							</table>
						</div>`
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			});
		}else if(type === "列车限制"){
			lay = {
				x: 95,
				w: 320,
				h: 320
			}
			C.getDataP123({
				c: "tyzd_ggy2123",
				s: [
					[data.PKID]
				],
				a: "查询水害风险详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const d = r["1"][0]
					var cls = d.TYPE=="1"?'lkjz':'lcjz'
					demo =
						`<i class="marker-yunshu-info-tip lcxz"></i>
					<div class="marker-yunshu-info ${cls}">
						<table border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
								<td><div class="log"></div><!--<div class="sub-tit">123123</div>--></td>
								<td><div class="tit">${d.ZM}</div><div class="sub-tit">${d.XM}</div></td></tr>
								<tr><td>
									<div class="line-v"></div>
									<div class="list-item"><span>中心里程:</span><label class="blue">${d.ZXLC}</label></div>
									<div class="list-item"><span>禁停股道:</span><label class="blue">${d.JTGD}</label></div>
									<div class="list-item"><span>风险类型:</span><label class="blue">${d.RISK}</label></div>
									<div class="list-item"><span>禁止停留客车条件:</span><label class="blue">${d.TJ}</label></div>
									<div class="list-item"><span>备注:</span><label class="blue">${d.BZ}</label></div>
									<div class="list-item"><span>类型:</span><label class="blue">${d.TYPE=="1"?'旅客列车禁止停留':'列车禁止停留'}</label></div>
									<div class="list-item"><span>录入时间:</span><label class="blue">${d.INPUT_DATE}</label></div>
								</td></tr>
							</tbody>
						</table>
					</div>`
					addPop(demo);
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			});
		} else if (type === "调车机车") {
			lay = {
				x: 95,
				w: 420,
				h: 280
			}
			C.getDataP123({
				c: "tyzd_ggy2012",
				s: [
					[data.PKID]
				],
				a: "查询调车机车详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
				async: false
			}, (r) => {
				// 类型（1：专调机车 2：小运转 3：调度机车 4：路由、出租机车）
				const d = r["1"][0];
				let cwd = '';
				let jch = "";
				let jclx = "";
				let items = '';
				if (data.TYPE === "1") {
					cwd = d.ZD_DEPOT;
					jch = d.ZD_CODE;
					jclx = "专用调车机车";
					items =
						`<div class="list-item auto"><span>专调机车段别:</span><label class="orange">${d.ZD_DEPOT}</label></div>
					<div class="list-item auto"><span>专调机车车站:</span><label class="orange">${d.ZD_STATION}</label></div>
					<div class="list-item auto"><span>专调机车车型:</span><label class="orange">${d.ZD_TYPE}</label></div>`;
				} else if (data.TYPE === "2") {
					cwd = d.XYZ_DEPOT;
					jch = d.XYZ_CODE;
					jclx = "枢纽小运车机车";
					items =
						`<div class="list-item auto inline"><span>小运转段别:</span><label class="orange">${d.XYZ_DEPOT}</label></div>
					<div class="list-item auto inline"><span>小运转交路区段:</span><label class="orange">${d.XYZ_ROUTE}</label></div>
					<div class="list-item auto inline"><span>小运转机型:</span><label class="orange">${d.XYZ_TYPE}</label></div>
					<div class="list-item auto inline"><span>小运转作业范围:</span><label class="orange">${d.XYZ_RANGE}</label></div>`;
				} else if (data.TYPE === "3") {
					cwd = d.DD_DEPOT;
					jch = d.DD_CODE;
					jclx = "调度机车";
					items =
						`<div class="list-item auto inline"><span>调度机车段别:</span><label class="orange">${d.DD_DEPOT}</label></div>
					<div class="list-item auto inline"><span>调度机车车站:</span><label class="orange">${d.DD_STATION}</label></div>
					<div class="list-item auto inline"><span>调度机车机型:</span><label class="orange">${d.DD_TYPE}</label></div>
					<div class="list-item auto inline"><span>调度机车作业范围:</span><label class="orange">${d.DD_RANGE}</label></div>`;
				} else if (data.TYPE === "4") {
					cwd = d.LY_DEPOT;
					jclx = "路用出租机车";
					items =
						`<div class="list-item auto inline"><span>路用出租机车段别:</span><label class="orange">${d.LY_DEPOT}</label></div>
					<div class="list-item auto inline"><span>路用出租机车车站:</span><label class="orange">${d.LY_STATION}</label></div>
					<div class="list-item auto inline"><span>路用出租机车机型:</span><label class="orange">${d.LY_TYPE}</label></div>`;
				}
				// <div class="list-item auto"><span>主救方向:</span><label class="orange">成都-贵阳</label></div>
				// <div class="list-item auto"><span>起重机限速:</span><label class="">20KM/H</label></div>
				// <div class="list-item auto"><span>车辆限速:</span><label class="blue">5KM/h</label></div>
				// <div class="list-item auto"><span>起重机型号:</span><label class="blue">QT1001</label></div>
				// <div class="list-item auto"><span>热备机型:</span><label class="">20KM/H</label></div>
				// <div class="list-item auto inline"><span>热备开始时间:</span><label class="">2022-12-12 12:13</label></div>
				// <div class="list-item auto inline"><span>热备结束时间:</span><label class="">2022-12-12 12:13</label></div>
				// <span onclick="chooseYsJcTab(this,'yxxx')">运行信息</span>
				demo =
					`<i class="marker-yunshu-info-tip jctype${data.TYPE}"></i>
					<div class="marker-yunshu-info jc">
						<table border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td><div class="log"></div><div class="sub-tit">${jch}</div></td>
									<td><div class="tit">${jclx}</div><div class="tit2">${cwd}</div></td>
									<td class="line-h">
										
									</td>
								</tr>
								<tr><td colspan="3" class="line-v">
									<div class="tab">
										<span class="active" onclick="chooseYsJcTab(this,'jcxx')">机车信息</span>
									</div>
								</td></tr>
								<tr><td colspan="3">
									<div id="ys_djjc_jcxx" class="detail-item show">
										${items}
									</div>
									<div id="ys_djjc_yxxx" class="detail-item">暂无数据</div>
								</td></tr>
							</tbody>
						</table>
					</div>`;
				addPop(demo)
			});
		}
	},
	chooseYsJcTab(el, ty) {
		$(el).siblings().removeClass("active");
		$(el).addClass("active");
		if (ty === "jcxx") {
			$("#ys_djjc_jcxx").addClass("show");
			$("#ys_djjc_yxxx").removeClass("show");
		} else {
			$("#ys_djjc_jcxx").removeClass("show");
			$("#ys_djjc_yxxx").addClass("show");
		}
	},
	// 查询设备设施
	getData_sbss() {
		if(this.getDataFlag_sbss){
			return;
		}
		this.getDataFlag_sbss = true;
		const q_jyd = () => {
			C.getDataP123({
				c: "tyzd_ggy2013",
				a: "查询救援队",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				this.creatMarker_jyd(r[1]); // 创建marker 救援队
			});
		}
		q_jyd();
	},
	//查询车务段管界
	getData_fw() {
		C.getDataP123({
			c: "eqeh_zxy9006",
			a: "查询车务段管界",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			r.forEach(v => {
				v.visible = this.data.yunShuOther.ys_fw.ck_cwd;
				v.layers = L.layerGroup(); //图层
				v.AREA_LIST.forEach(vv => {
					const points = vv.POINT_LIST.map(p => [p.AREA_X, p.AREA_Y]);
					let antPath = new L.Polygon(points, {
						"weight": 1, //线宽
						"color": vv.LINE_COLOR, //颜色
						"opacity": 0.5, //透明度
						"fillColor": vv.INNER_COLOR,
						"fillOpacity": 0.4
					});
					v.layers.addLayer(antPath);
				});
				if (v.visible) {
					v.layers.addTo($vm.map);
				}
			});
			this.data.yunShuOther.bounds = r;
		});
	},
	getData_unitList() {
		C.getDataP123({
			c: 'tyzd_zxy2015',
			s: [
				{
					system: '车务'
				}
			],
			url: "https://10.192.126.203/GeneralProServlet"
		}, (res) => {
			// console.log('运输子系统_查询车务单位信息', res)
			this.data.yunshuUnitList = JSON.parse(JSON.stringify(res['2']))
		})
	},
	// 查询接发列车限制车站===查询水害风险的位置
	getData_jflc(type) {
		if(type=='1'){
			if(this.getDataFlag_jflc1){
				return;
			}
			this.getDataFlag_jflc1 = true;
		}else{
			if(this.getDataFlag_jflc2){
				return;
			}
			this.getDataFlag_jflc2 = true;
		}
		C.getDataP123({
			c: "tyzd_ggy2122",
			a: "查询接发列车限制车站",
			s:[[type]],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_jflc(r["1"],type); // 创建marker 接发列车
		});
	},

	// 查询接发列车限制车站
// 	getData_jflc() {
// 		if(this.getDataFlag_jflc){
// 			return;
// 		}
// 		this.getDataFlag_jflc = true;
// 		C.getDataP123({
// 			c: "tyzd_ggy2008",
// 			a: "查询接发列车限制车站",
// 			url: "https://10.192.126.203/GeneralProServlet", //接口地址
// 		}, (r) => {
// 			this.creatMarker_jflc(r["1"].concat(r["2"])); // 创建marker 接发列车
// 		});
// 	},
	// 查询调车机车
	getData_dcjc() {
		if(this.getDataFlag_dcjc){
			return;
		}
		this.getDataFlag_dcjc = true;
		C.getDataP123({
			c: "tyzd_ggy2010",
			a: "查询调车机车",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_dcjc(r["1"].concat(r["2"]).concat(r["3"]).concat(r["4"])); // 创建marker 调车机车
		});
	}
}
