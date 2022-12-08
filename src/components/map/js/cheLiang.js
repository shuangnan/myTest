/**
 * 车辆
 * djm
 * 22.01.20
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag_getBpbl: false, // 是否已调用接口-车型
	getDataFlag_getBycz: false,
	data: {
		cheLiang_layers: {
			bpbl: L.layerGroup(), // 备品备料
			bycz: L.layerGroup(), // 备用车组
		},
		cheLiangOther: {
			bpbl: false, //备品备料
			bycz: false
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.cl.register) {
			return;
		}
		// 设置默认值
		this.data.cheLiangOther.bpbl = $vm.config.cl.bpbl; //备品备料
		this.data.cheLiangOther.bycz = $vm.config.cl.bycz
		this.initData();
		// 绑定marker中tab切换事件
		window.chooseJwTab = (el, ty) => this.chooseJwTab(el, ty);
	},
	// 初始化数据
	initData() {
		if ($vm.config.cl.register && this.data.cheLiangOther.bpbl) {
			this.getBpbl(); //查询车型
		}
		if ($vm.config.cl.register && this.data.cheLiangOther.bycz) {
			this.getBycz(); // 查询备用车组
		}
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 过滤图层元素
	filterLayer(ty) {
		if (ty === "车辆_备品备料") {
			// 若未获取过数据,则先获取数据
			if (this.getDataFlag_getBpbl === false) {
				this.getBpbl();
				return;
			}
			if (this.data.cheLiangOther.bpbl) {
				$vm.map.addLayer(this.data.cheLiang_layers.bpbl);
			} else {
				$vm.map.removeLayer(this.data.cheLiang_layers.bpbl);
			}
		} else if (ty === "车辆_备用车组") {
			if (this.getDataFlag_getBycz === false) {
				this.getBycz()
				return;
			}
			if (this.data.cheLiangOther.bycz) {
				console.log('BYCZ', this.data.cheLiang_layers.bycz)
				$vm.map.addLayer(this.data.cheLiang_layers.bycz)
			} else {
				$vm.map.removeLayer(this.data.cheLiang_layers.bycz)
			}
		}
	},
	creatMarker_bpbl(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover jiwu-marker cx_bpbl" style="position:relative"></div>`,
				})
			}); //TRAIN_NAME
			marker.on("click", (p) => {
				this.setMarkerClick("备品备料", item, p);
			});
			group.addLayer(marker);
		});
		this.data.cheLiang_layers.bpbl = group;
		this.filterLayer("车辆_备品备料");
	},
	createMarker_bycz(source) {
		let group = L.markerClusterGroup( {
			zoomToBoundsOnClick: true,
			maxClusterRadius: 20,
			iconCreateFunction: ( cluster ) => {
				return cluster.getAllChildMarkers()[0].options.icon
			}
		} )
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPS_POINT_Y,
				lng: item.GPS_POINT_X
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover jiwu-marker byct" style="position: relative"></div>`
				})
			})
			marker.on("click", (p) => {
				this.setMarkerClick('备用车组', item, p)
			})
			group.addLayer(marker)
		})
		this.data.cheLiang_layers.bycz = group
		console.log(group)
		this.getDataFlag_getBycz = true
		this.filterLayer("车辆_备用车组")
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
		if (type === "备品备料") {
			lay = {
				x: 95,
				w: 420,
				h: 270
			}
			C.getDataP123({
				c: "tyzd_ggy2120",
				s: [
					[data.STATION]
				],
				a: "备品备料详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					var rdata = r['1'];
					const tbody = rdata.map((v, i) =>
						`<tr><td>${v.DEPOT}</td><td>${v.NAME}</td><td>${v.PLACE}</td><td>${v.INPUT_DATE}</td></tr>`).join("");
					demo =
						`<i class="marker-tufang-info-tip bpbl"></i>
						<div class="marker-tufang-info bpbl" style="width:${lay.w}px;">
							<table border="0" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td><div class="log"></div><!--<div class="sub-tit">123123</div>--></td>
										<td><div class="tit">备品备料</div><div class="tit2"></div></td>
									</tr>
									<tr>
									<td  colspan="2">
									<table class="detail-table" cellpadding="0" cellspacing="0">
										<thead><tr><th>部门</th><th>备品备料名称</th><th>地点</th><th>录入更新时间</th></tr></thead>
										<tbody>${tbody}</tbody>
									</table>
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
			});
		} else if (type === "备用车组") {
			lay = {
				x: 95,
				w: 420,
				h: 270
			}
			demo =
					`<i class="marker-gongdian-info-tip dfx"></i>
					<div class="marker-gongdian-info">
						<div class="top">
							<div class="pic dfx"></div>
							<div class="tit"><h3>备用车体</h3><h4>配属所:${data.S_BELONGPLACE}</h4></div>
						</div>
						<div class="list-item "><span>车型:</span><label class="orange">${data.S_MODEL}</label></div>
						<div class="list-item "><span>车号:</span><label class="orange">${data.S_CARNUM}</label></div>
						<div class="list-item inline"><span>状态:</span><label class="orange">${data.S_DETAIL_STATUS}</label></div>
						<div class="list-item inline"><span>速度等级:</span><label class="orange">${data.ZGYYSD}</label></div>
						<div class="list-item inline"><span>日期:</span><label class="orange">${data.S_DATE}</label></div>
						<div class="list-item inline"><span>备注:</span><label class="orange">${data.S_EXPLAIN}</label></div>
					</div>`;
			addPop(demo)
		}
	},
	chooseJwTab(el, elid) {
		if (elid === "电力车运行情况" || elid === "内燃车运行情况" || elid === "内燃车机车参数") {
			$(".jw_cx_dljc_yxqk_detail").removeClass("show");
			$("#jw_cx_dljc_yxqk_detail_" + el).addClass("show");
			return;
		}
		$(el).siblings().removeClass("active");
		$(el).addClass("active");
		$(".marker-jiwu-info .detail-item").removeClass("show");
		$("#" + elid).addClass("show");
	},
	//查询车型
	getBpbl() {
		if (this.getDataFlag_getBpbl) {
			return;
		}
		this.getDataFlag_getBpbl = true;
		C.getDataP123({
			c: "tyzd_ggy2119",
			a: "备品备料位置",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r["1"].length > 0) {
				this.creatMarker_bpbl(r['1'])
			}
		});
	},
	getBycz() {
		if (this.getDataFlag_getBycz) {
			return;
		}
		C.getDataP123({
			c: "tyzd_zxy2018",
			s: [
				{
					S_DATE: C.formatDate(new Date, 'yyyy-MM-dd')
				}
			],
			a: "备用车组位置",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r['1'].length > 0) {
				this.createMarker_bycz(r['1'])
			}
		})
	}
}
