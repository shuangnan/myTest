/**
 * 土房
 */
import C from "../../../assets/com.js";
import flyUnil from "./trainFlyUtil.js";
let $vm = null;
export default {
	getDataFlag_getStationcq: false, // 是否已调用接口-车站
	getDataFlag_getStationgy: false, // 是否已调用接口-车站
	getDataFlag_getStationdc: false, // 是否已调用接口-车站
	getDataFlag_getStationcd: false, // 是否已调用接口-车站
	getDataFlag_fw: false,
	getDataFlag_getWsjds: false, //是否已调用接口-卫生监督所
	getDataFlag_getJks: false, //是否已调用接口-疾控所
	getDataFlag_getShc: false, // 是否已调用接口-生活车
	getDataFlag_getYjcl: false, // 是否已调用接口-应急材料
	getDataFlag_getScd: false, //是否已调用接口-送餐点
	data: {
		light: false,
		tuFang_layers: {
			sbss: {
				shc: L.layerGroup(), //生活车
				yjcl: L.layerGroup(), //应急材料
				cz: L.layerGroup(), //段
				cqjzd: L.layerGroup(), //重庆建筑段
				gyjzd: L.layerGroup(),
				dchtgs: L.layerGroup(),
				cdjzd: L.layerGroup(),
				trainFlyLayer: null, //飞行线
				wsjds: L.layerGroup(),//卫生监督所
				jks: L.layerGroup(),//疾控所
				scd: L.layerGroup(),//送餐点
				gy: L.layerGroup(),//公寓
			},
			fw: {
				d: L.layerGroup(), //段范围
				cj: L.layerGroup(), //车间范围
				gq: L.layerGroup(), //工区范围

			},
		},
		tuFangOther: {
			sbss: {
				shc: false, //生活车
				yjcl: false, //应急材料
				cz: false, //段
				wsjds: false, //卫生监督所
				jks: false, //疾控所
				scd: false, //送餐点
				gy: false,
				// 				cj: false, //车间
				// 				gq: false, //工区
			},
			fw: {
				d: false, //段范围
				cj: false, //车间范围
				gq: false, //工区范围
				cqjzd: false, //重庆建筑段
				gyjzd: false,
				dchtgs: false,
				cdjzd: false,
			},
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.tf_sbss.register && !$vm.config.tf_fw.register) {
			return;
		}
		// 设置默认值
		this.data.tuFangOther.sbss.shc = $vm.config.tf_sbss.shc; //生活车
		this.data.tuFangOther.sbss.yjcl = $vm.config.tf_sbss.yjcl; //应急材料
		this.data.tuFangOther.sbss.wsjds = $vm.config.tf_sbss.wsjds; //卫生监督所
		this.data.tuFangOther.sbss.jks = $vm.config.tf_sbss.jks; //疾控所
		this.data.tuFangOther.sbss.scd = $vm.config.tf_sbss.scd; //送餐点
		this.data.tuFangOther.sbss.gy = $vm.config.tf_sbss.gy; //公寓
		this.data.light = $vm.config.superMap.lightMode
		this.data.tuFangOther.fw.d = $vm.config.tf_fw.d; //段范围
		this.data.tuFangOther.fw.cqjzd = $vm.config.tf_fw.cqjzd; //段范围
		this.data.tuFangOther.fw.gyjzd = $vm.config.tf_fw.gyjzd; //段范围
		this.data.tuFangOther.fw.dchtgs = $vm.config.tf_fw.dchtgs; //段范围
		this.data.tuFangOther.fw.cdjzd = $vm.config.tf_fw.cdjzd; //段范围
		this.data.tuFangOther.fw.gq = $vm.config.tf_fw.gq; //工区范围
		if ($vm.config.tf_sbss.register) {
			if (this.data.tuFangOther.sbss.shc) {
				this.getShc();
			}
			if (this.data.tuFangOther.sbss.yjcl) {
				this.getYjcl();
			}
			if (this.data.tuFangOther.sbss.wsjds) {
				this.getWsjds();
			}
			if (this.data.tuFangOther.sbss.jks) {
				this.getJks();
			}
			if (this.data.tuFangOther.sbss.scd) {
				this.getScd();
			}
		}
		if ($vm.config.tf_fw.register) {
			if (this.data.tuFangOther.fw.cqjzd) {
				this.getStation('重庆建筑段'); //查询所有车站
			}
			if (this.data.tuFangOther.fw.gyjzd) {
				this.getStation('贵阳建筑段'); //查询所有车站
			}
			if (this.data.tuFangOther.fw.dchtgs) {
				this.getStation('达成合铁公司'); //查询所有车站
			}
			if (this.data.tuFangOther.fw.cdjzd) {
				this.getStation('成都建筑段'); //查询所有车站
			}

		}
		// 绑定marker中tab切换事件
		window.chooseTfTab = (el, ty) => this.chooseTfTab(el, ty);
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 过滤图层元素
	filterLayer(ty) {
		if (ty === "土房_设备设施") {
			if (this.data.tuFangOther.sbss.shc) {
				if (this.getDataFlag_getShc === false) {
					this.getShc();
					return;
				}
				$vm.map.addLayer(this.data.tuFang_layers.sbss.shc);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.shc);
			}
			if (this.data.tuFangOther.sbss.yjcl) {
				if (this.getDataFlag_getYjcl === false) {
					this.getYjcl();
					return;
				}
				$vm.map.addLayer(this.data.tuFang_layers.sbss.yjcl);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.yjcl);
			}
			if (this.data.tuFangOther.sbss.gy) {
				if (this.getDataFlag_fw === false) {
					this.getData_fw();
					return;
				}
				$vm.map.addLayer(this.data.tuFang_layers.sbss.gy);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.gy);
			}

			if (this.data.tuFangOther.sbss.wsjds) {
				if (this.getDataFlag_getWsjds === false) {
					this.getWsjds();
					return;
				}
				$vm.map.addLayer(this.data.tuFang_layers.sbss.wsjds);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.wsjds);
			}
			if (this.data.tuFangOther.sbss.jks) {
				if (this.getDataFlag_getJks === false) {
					this.getJks();
					return;
				}
				$vm.map.addLayer(this.data.tuFang_layers.sbss.jks);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.jks);
			}
			if (this.data.tuFangOther.sbss.scd) {
				if (this.getDataFlag_getScd === false) {
					this.getScd();
					return;
				}
				$vm.map.addLayer(this.data.tuFang_layers.sbss.scd);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.scd);
			}

		}
		if (ty === "土房_范围") {
			if (this.data.tuFangOther.sbss.d) {
				this.data.tuFangOther.sbss.d = false;
			} else {
				this.data.tuFangOther.sbss.d = true;
			}
			if (this.data.tuFangOther.sbss.cj) {
				this.data.tuFangOther.sbss.cj = false;
			} else {
				this.data.tuFangOther.sbss.cj = true;
			}
			if (this.data.tuFangOther.sbss.gq) {
				this.data.tuFangOther.sbss.gq = false;
			} else {
				this.data.tuFangOther.sbss.gq = true;
			}
			// 			if (this.data.tuFangOther.fw.d) {
			// 				$vm.map.addLayer(this.data.tuFang_layers.sbss.cz);
			// 			} else {
			// 				$vm.map.removeLayer(this.data.tuFang_layers.sbss.cz);
			// 			}

			if (this.data.tuFangOther.fw.cqjzd) {
				if (this.getDataFlag_getStationcq == false) {
					this.getStation('重庆建筑段')
					return
				}
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.cz);
				$vm.map.addLayer(this.data.tuFang_layers.sbss.cqjzd);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.cqjzd);
			}
			if (this.data.tuFangOther.fw.gyjzd) {
				if (this.getDataFlag_getStationgy == false) {
					this.getStation('贵阳建筑段')
					return
				}
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.cz);
				$vm.map.addLayer(this.data.tuFang_layers.sbss.gyjzd);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.gyjzd);
			}
			if (this.data.tuFangOther.fw.dchtgs) {
				if (this.getDataFlag_getStationdc == false) {
					this.getStation('达成合铁公司')
					return
				}
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.cz);
				$vm.map.addLayer(this.data.tuFang_layers.sbss.dchtgs);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.dchtgs);
			}
			if (this.data.tuFangOther.fw.cdjzd) {
				if (this.getDataFlag_getStationcd == false) {
					this.getStation('成都建筑段')
					return
				}
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.cz);
				$vm.map.addLayer(this.data.tuFang_layers.sbss.cdjzd);
			} else {
				$vm.map.removeLayer(this.data.tuFang_layers.sbss.cdjzd);
			}
		}
	},
	// 创建marker 生活车
	creatMarker_shc(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "tufang-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'tufang-marker-light' : 'tufang-marker'} sbss-shc" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("生活车", item, p);
			});
			group.addLayer(marker);
		});
		this.data.tuFang_layers.sbss.shc = group;
		this.filterLayer("土房_设备设施");
	},
	// 创建marker 应急材料
	creatMarker_yjcl(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "tufang-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'tufang-marker-light' : 'tufang-marker'} sbss-yjcl" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("应急材料", item, p);
			});
			group.addLayer(marker);
		});
		this.data.tuFang_layers.sbss.yjcl = group;
		this.filterLayer("土房_设备设施");
	},
	// 创建marker 段
	creatMarker_cz(source, type) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "tufang-icon-container",
					data: item,
					html: `<div class="marker-hover tufang-marker sbss-cz" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("段", item, p);
			});
			group.addLayer(marker);
		});
		if (type == '') {
			this.data.tuFang_layers.sbss.cz = group;
		} else if (type == 'cqjzd') {
			this.data.tuFang_layers.sbss.cqjzd = group;
		} else if (type == 'gyjzd') {
			this.data.tuFang_layers.sbss.gyjzd = group;
		} else if (type == 'dchtgs') {
			this.data.tuFang_layers.sbss.dchtgs = group;
		} else if (type == 'cdjzd') {
			this.data.tuFang_layers.sbss.cdjzd = group;
		}
		this.filterLayer("土房_范围");
	},
	// 公寓
	creatMarker_gy(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'tufang-marker-light' : 'jiwu-marker'} fw_gy" style="position:relative"></div>`,
				})
			}); //TRAIN_NAME
			marker.on("click", (p) => {
				this.setMarkerClick("公寓", item, p);
			});
			group.addLayer(marker);
		});
		this.data.tuFang_layers.sbss.gy = group;
		this.filterLayer("土房_设备设施");
	},
	// 创建marker 卫生监督所
	creatMarker_wsjds(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "tufang-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'tufang-marker-light' : 'tufang-marker'} sbss-wsjds" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("卫生监督所", item, p);
			});
			group.addLayer(marker);
		});
		this.data.tuFang_layers.sbss.wsjds = group;
		this.filterLayer("土房_设备设施");
	},
	// 创建marker 疾控所
	creatMarker_jks(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "tufang-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'tufang-marker-light' : 'tufang-marker'} sbss-jks" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("疾控所", item, p);
			});
			group.addLayer(marker);
		});
		this.data.tuFang_layers.sbss.jks = group;
		this.filterLayer("土房_设备设施");
	},

	// 创建marker 送餐点
	creatMarker_scd(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "tufang-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'tufang-marker-light' : 'tufang-marker'} sbss-scd" style="position:relative"><span></span><label></label></div>`,
				})
			});
			group.addLayer(marker);
		});
		this.data.tuFang_layers.sbss.scd = group;
		$vm.map.addLayer(this.data.tuFang_layers.fw.d);
		this.filterLayer("土房_设备设施");
	},

	// 绑定marker点击事件---
	setMarkerClick(type, data, marker) {
		if ($vm.drawFlag || $vm.rangingFlag) return;
		$vm.detailMarker && $vm.detailMarker.remove(); //删除
		let lay = {
			x: 20,
			w: 300,
			h: 120
		};
		const addPop = (content) => {
			let nameDivIcon = L.divIcon({
				className: "detail-pop-container",
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${lay.x}px, ${lay.h-40}px, 0px); bottom: 0px;">
					<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class = "leaflet-popup-content-wrapper marker-houqing-info-popup">
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
		if (type === "生活车") {
			lay = {
				x: 95,
				w: 380,
				h: 300
			};
			C.getDataP123({
				c: "tyzd_ggy2036",
				s: [
					[data.PKID]
				],
				a: "救援列车详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					// 					C.$.each(r["1"], (index, item) => {
					// 						tbody += '<tr><td>'+item.NAME+'</td><td>222</td><td>222</td><td>222</td></tr>';
					// 					})
					const rdata = r["1"];
					const tbody = rdata.map((v, i) =>
						`<tr><td>${v.NAME}</td><td>${v.TYPE}</td><td>${v.UNIT}</td><td>${v.AMOUNT}</td></tr>`).join("");
					demo =
						`<i class="marker-tufang-info-tip shc"></i>
						<div class="marker-tufang-info shc" style="width:${lay.w}px;">
							<table border="0" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td><div class="log"></div><div class="sub-tit"></div></td>
										<td><div class="tit">生活车</div><div class="tit2">成都土房处</div></td>
										<td>
											<div style="width:160px;">
												<div class="list-item inline"><span>设置地点:</span><label class="blue">${rdata[0].LOCATION}</label></div>
												<!--<div class="list-item inline"><span>线别:</span><label class="">宝成线</label></div>-->
												<!--<div class="list-item inline"><span>起终点:</span><label class="orange">成都-宝鸡</label></div>-->
											</div>
										</td>
									</tr>
									<tr><td colspan="3" class="line-v">
										<div class="tab"><span class="active" onclick="chooseTfTab(this,'tf_sbss_shc')">物资信息</span></div>
									</td></tr>
									<tr><td colspan="3">
										<div id="tf_sbss_shc" class="detail-item show">
											<table class="detail-table" cellpadding="0" cellspacing="0">
												<thead><tr><th>名称</th><th>规格型号</th><th>计量单位</th><th>数量</th></tr></thead>
												<tbody>${tbody}</tbody>
											</table>
										</div>
									</td></tr>
								</tbody>
							</table>
						</div>`;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		} else if (type === "应急材料") {
			lay = {
				x: 20,
				w: 380,
				h: 300
			};
			C.getDataP123({
				c: "tyzd_ggy2034",
				s: [
					[data.LOCATION]
				],
				a: "土房器具详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					const tbody = rdata.map((v, i) =>
						`<tr><td>${v.NAME}</td><td>${v.TYPE}</td><td>${v.UNIT}</td><td>${v.AMOUNT}</td></tr>`).join("");
					const area = rdata.map((v, i) =>
						`${v.STATION_AREA}`).join("、");
					demo =
						`<i class="marker-tufang-info-tip yjcl"></i>
						<div class="marker-tufang-info yjcl" style="width:${lay.w}px;">
							<table border="0" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td><div class="log"></div><!--<div class="sub-tit">123123</div>--></td>
										<td><div class="tit">应急材料</div><div class="tit2">成都土房处</div></td>
										<td>
											<div style="width:160px;">
												<div class="list-item inline"><span>设置地点:</span><label class="blue">${rdata[0].LOCATION}</label></div>
												<!--<div class="list-item inline"><span>线别:</span><label class="">${rdata[0].AMOUNT}</label></div>-->
												<!--<div class="list-item inline"><span>起终点:</span><label class="orange">${rdata[0].AMOUNT}</label></div>-->
											</div>
										</td>
									</tr>
									<tr><td colspan="3" class="line-v">
										<div class="tab">
											<span class="active" onclick="chooseTfTab(this,'tf_sbss_yjcl1')">应急机具</span>
											<span class="" onclick="chooseTfTab(this,'tf_sbss_yjcl2')">应急辐射站区</span>
										</div>
									</td></tr>
									<tr><td colspan="3">
										<div id="tf_sbss_yjcl1" class="detail-item show"  style="height:160px;overflow:auto">
											<table class="detail-table" cellpadding="0" cellspacing="0">
												<thead><tr><th>名称</th><th>规格型号</th><th>计量单位</th><th>数量</th></tr></thead>
												<tbody>${tbody}</tbody>
											</table>
										</div>
										<div id="tf_sbss_yjcl2" class="detail-item">
										${rdata[0].STATION_AREA}
										</div>
									</td></tr>
								</tbody>
							</table>
						</div>`;
					addPop(demo)
					// ===获取辐射范围
					C.getDataP123({
						c: "tyzd_ggy2038",
						s: [
							[rdata[0].PKID]
						],
						a: "土房器具辐射范围",
						url: "https://10.192.126.203/GeneralProServlet", //接口地址
					}, (r) => {
						var dataarea = r[1];
						const curData = [];
						dataarea.forEach(item => {
							curData.push([{
								name: data.LOCATION
							}, {
								name: item.STATION,
								value: 1,
								meta: item
							}]);
						});
						const geoData = {};
						dataarea.forEach(item => {
							geoData[item.STATION] = [item.GPSX, item.GPSY];
						})
						// 						let options = flyUnil.getFlyOpts([curData], geoData);
						// 						this.data.tuFang_layers.sbss.trainFlyLayer = L.supermap.echartsLayer(options);
						// 						this.data.tuFang_layers.sbss.trainFlyLayer.addTo($vm.map);
						// $vm.map.addLayer(this.data.tuFang_layers.sbss.trainFlyLayer);
						// this.data.trainFlyLayer.addTo(this.map);
						// this.drawFly();
					})
				}
			})
		} else if (type === "段") {
			var cz = ""; //车站
			var cj = ""; //车间
			var gq = ""; //工区
			// if (this.data.tuFangOther.fw.d) {
			cz = data.DW
			// }
			if (this.data.tuFangOther.fw.cj) {
				cj = data.CJ
			}
			if (this.data.tuFangOther.fw.gq) {
				gq = data.GQ
			}
			C.getDataP123({
				c: "tyzd_ggy2031",
				s: [
					[cz, cj, gq]
				],
				a: "站详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					$vm.map.removeLayer(this.data.tuFang_layers.sbss.cz);
					this.creatMarker_cz(r[1], ''); //创建车站
					$vm.map.addLayer(this.data.tuFang_layers.sbss.cz);
					if (this.data.tuFangOther.fw.cqjzd) {
						$vm.map.removeLayer(this.data.tuFang_layers.sbss.cqjzd);
						// 						this.creatMarker_cz(r[1], 'cqjzd'); //创建车站
						// 						$vm.map.addLayer(this.data.tuFang_layers.sbss.cqjzd);
					}
					if (this.data.tuFangOther.fw.dchtgs) {
						$vm.map.removeLayer(this.data.tuFang_layers.sbss.dchtgs);
						// 						this.creatMarker_cz(r[1], 'dchtgs'); //创建车站
						// 						$vm.map.addLayer(this.data.tuFang_layers.sbss.dchtgs);
					}
					if (this.data.tuFangOther.fw.gyjzd) {
						$vm.map.removeLayer(this.data.tuFang_layers.sbss.gyjzd);
						// 						this.creatMarker_cz(r[1], 'gyjzd'); //创建车站
						// 						$vm.map.addLayer(this.data.tuFang_layers.sbss.gyjzd);
					}
					if (this.data.tuFangOther.fw.cdjzd) {
						$vm.map.removeLayer(this.data.tuFang_layers.sbss.cdjzd);
						// 						this.creatMarker_cz(r[1], 'cdjzd'); //创建车站
						// 						$vm.map.addLayer(this.data.tuFang_layers.sbss.cdjzd);
					}

					// 					if (this.data.tuFangOther.fw.gyjzd) {
					// 						$vm.map.addLayer(this.data.tuFang_layers.sbss.gyjzd);
					// 					} else {
					// 						$vm.map.removeLayer(this.data.tuFang_layers.sbss.gyjzd);
					// 					}
					// 					if (this.data.tuFangOther.fw.dchtgs) {
					// 						$vm.map.addLayer(this.data.tuFang_layers.sbss.dchtgs);
					// 					} else {
					// 						$vm.map.removeLayer(this.data.tuFang_layers.sbss.dchtgs);
					// 					}
					// 					if (this.data.tuFangOther.fw.cdjzd) {
					// 						$vm.map.addLayer(this.data.tuFang_layers.sbss.cdjzd);
					// 					} else {
					// 						$vm.map.removeLayer(this.data.tuFang_layers.sbss.cdjzd);
					// 					}
					// 
				}
			})
			this.getData_fw(type);
			lay = {
				x: 20,
				w: 250,
				h: 150
			};
			demo =
				`<i class="marker-tufang-info-tip d"></i>
				<div class="marker-tufang-info d" style="width:${lay.w}px;">
					<table border="0" cellpadding="0" cellspacing="0">
						<tbody>
							<tr >
							<td class="line-v" style="width:120px"><div class="log"></div><div class="sub-tit"></div></td>
							<td class="line-v"><div class="tit">${data.CZ}</div><div class="tit2"></div></td>
							</tr>
							<tr>
							<td colspan="2" >
							<div class="list-item auto inline" ><span>所属段:</span><label class="">${data.DW}</label></div>
							</td>
							</tr>
							<tr>
							<td colspan="2">
							<div class="list-item auto inline" ><span>所属车间:</span><label class="">${data.CJ}</label></div>
							</td>
							</tr>
							<tr>
							<td colspan="2">
							<div class="list-item auto inline" ><span>所属单位:</span><label class="">${data.DW}</label></div>
							</td>
							</tr>
						</tbody>
					</table>
				</div>`;
			addPop(demo)
		} else if (type === "公寓") {
			lay = {
				x: 20,
				w: 140,
				h: 160
			}
			C.getDataP123({
				c: "yjcz_ggy9001",
				s: [data.PK_ID],
				a: "公寓详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				const d1 = r.data;
				demo =
					`<i class="marker-jiwu-info-tip gy"></i>
					<div class="marker-jiwu-info" style="width:${lay.w}px;">
						<table border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td style="width:120px"><div class="log gy"></div></td>
									<td><div class="tit" style="width:60px;">公寓</div></td>
								</tr>
								<tr>
									<td colspan="2"><div class="sub-tit" style="padding-bottom:10px;">${data.NAME}</div></td>
								</tr>
								<tr><td colspan="2" style="padding-left:10px;">
										<div class="list-item auto inline"><span>空余房间:</span><label class="orange">${d1.freeRoomNum}</label></div>
										<div class="list-item auto inline"><span>公寓容量:</span><label class="orange">${d1.allRoomNum}</label></div>
								</td></tr>
							</tbody>
						</table>
					</div>`;
				addPop(demo);
			});
		} else if (type === "卫生监督所") {
			lay = {
				x: 20,
				w: 280,
				h: 250
			};
			demo =
				`<i class="marker-tufang-info-tip wsjds"></i>
					<div class="marker-tufang-info wsjds" style="width:${lay.w}px;">
					<table border="0" cellpadding="0" cellspacing="0">
						<tbody>
							<tr >
							<td class="line-v" style="width:120px"><div class="log"></div><div class="sub-tit"></div></td>
							<td class="line-v"><div class="tit">${data.NAME}</div><div class="tit2"></div></td>
							</tr>
							<tr>
							<td colspan="2" >
							<div class="list-item auto inline" ><span>人数:</span><label class="">${data.PEOPLE}</label></div>
							</td>
							</tr>
							<tr>
							<td colspan="2">
							<div class="list-item auto inline" ><span>工作:</span><label class="">${data.JOB}</label></div>
							</td>
							</tr>
						</tbody>
					</table>
				</div>`;
			addPop(demo)
		} else if (type === "疾控所") {
			lay = {
				x: 20,
				w: 280,
				h: 250
			};
			demo =
				`<i class="marker-tufang-info-tip jks"></i>
					<div class="marker-tufang-info jks" style="width:${lay.w}px;">
					<table border="0" cellpadding="0" cellspacing="0">
						<tbody>
							<tr >
							<td class="line-v" style="width:120px"><div class="log"></div><div class="sub-tit"></div></td>
							<td class="line-v"><div class="tit">${data.NAME}</div><div class="tit2"></div></td>
							</tr>
							<tr>
							<td colspan="2" >
							<div class="list-item auto inline" ><span>人数:</span><label class="">${data.PEOPLE}</label></div>
							</td>
							</tr>
							<tr>
							<td colspan="2">
							<div class="list-item auto inline" ><span>工作:</span><label class="">${data.JOB}</label></div>
							</td>
							</tr>
						</tbody>
					</table>
				</div>`;
			addPop(demo)
		}
	},
	chooseTfTab(el, elid) {
		$(el).siblings().removeClass("active");
		$(el).addClass("active");
		$(".marker-tufang-info .detail-item").removeClass("show");
		$("#" + elid).addClass("show");
	},
	getStation(str) {
		if (str == "成都建筑段") {
			if (this.getDataFlag_getStationcd) {
				return
			}
			this.getDataFlag_getStationcd = true
		}
		if (str == "重庆建筑段") {
			if (this.getDataFlag_getStationcq) {
				return
			}
			this.getDataFlag_getStationcq = true
		}
		if (str == "贵阳建筑段") {
			if (this.getDataFlag_getStationgy) {
				return
			}
			this.getDataFlag_getStationgy = true
		}
		if (str == "达成合铁公司") {
			if (this.getDataFlag_getStationdc) {
				return
			}
			this.getDataFlag_getStationdc = true
		}
		C.getDataP123({
			c: "tyzd_ggy2031",
			a: "土房站区车站位置",
			s: [
				[str, "", ""]
			],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (str == "成都建筑段") {
				this.creatMarker_cz(r[1], 'cdjzd'); //创建车站
			}
			if (str == "重庆建筑段") {
				this.creatMarker_cz(r[1], 'cqjzd'); //创建车站
			}
			if (str == "贵阳建筑段") {
				this.creatMarker_cz(r[1], 'gyjzd'); //创建车站
			}
			if (str == "达成合铁公司") {
				this.creatMarker_cz(r[1], 'dchtgs'); //创建车站
			}
		});
	},

	//查询范围
	getData_fw() {
		if (this.getDataFlag_fw) {
			return;
		}
		this.getDataFlag_fw = true;
			C.getDataP123({
				c: "tyzd_ggy2030",
				a: "公寓位置",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				this.creatMarker_gy(r["1"]); // 创建marker 公寓
				console.log("公寓位置", r)
			});
	},
	getYjcl() { //应急设备
		if (this.getDataFlag_getYjcl) {
			return
		}
		this.getDataFlag_getYjcl = true
		C.getDataP123({
			c: "tyzd_ggy2033",
			a: "土房器具位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_yjcl(r[1]); //创建应急设备
		});
	},
	getShc() { //获取生活车
		if (this.getDataFlag_getShc) {
			return
		}
		this.getDataFlag_getShc = true
		C.getDataP123({
			c: "tyzd_ggy2035",
			a: "生活车位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_shc(r[1]); //创建车站
		});
	},

	getWsjds() {
		if (this.getDataFlag_getWsjds) {
			return
		}
		this.getDataFlag_getWsjds = true
		C.getDataP123({
			c: "tyzd_ggy2077",
			a: "卫生监督所位置与详情",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_wsjds(r[1]); //创建车站
		});
	},
	getJks() {
		if (this.getDataFlag_getJks) {
			return
		}
		this.getDataFlag_getJks = true
		C.getDataP123({
			c: "tyzd_ggy2078",
			a: "疾控所位置与详情",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_jks(r[1]); //创建车站
		});
	},
	getScd() {
		if (this.getDataFlag_getScd) {
			return
		}
		this.getDataFlag_getScd = true
		C.getDataP123({
			c: "tyzd_ggy2076",
			a: "送餐点位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_scd(r[1]); //创建车站
		});
	},
}
