/**
 * 轨道车定位
 */
import C from "../../../assets/com.js";
import msg from "../../../assets/message.js"; //消息
let $vm = null;
export default {
	getDataFlag: false, // 是否已调用接口
	msgStatu: false, //消息连接状态
	historyLine: [], //历史轨迹线
	historyColor: ["#da9100", "#edd4a2", "#805b11", "#784d46"],
	historyIndex: 0,
	data: {
		guiDaoCheLayer_gw: null, //工务
		// 图例控制器
		guiDaoCheOther: {
			guiDaoCheVisible_gw: false,
			list_gw: [], //轨道车台账
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.gdcdw.register) { //用工务脚本配置里的注册开关
			return;
		}
		// 设置默认值
		this.data.guiDaoCheOther.guiDaoCheVisible_gw = $vm.config.gdcdw.gw; //用工务脚本配置里的属性
		this.data.guiDaoCheLayer_gw = L.layerGroup();
		// this.data.guiDaoCheLayer = L.markerClusterGroup({
		// 	zoomToBoundsOnClick: true,
		// 	maxClusterRadius: 20,
		// 	iconCreateFunction: (cluster) => {
		// 		return cluster.getAllChildMarkers()[0].options.icon
		// 	}
		// })
		// 实例化消息 TOPIC_YJCZ_GDC
		msg.init({
			topic: "TOPIC_YJCZ_GDC",
			onmessage: (msg, topic) => {
				if (topic === "TOPIC_YJCZ_GDC") {
					msg.data = JSON.parse(msg.data);
					this.getMsg(msg);
				}
			},
			onopen: () => {
				this.msgStatu = true;
			},
			onclose: () => {
				this.msgStatu = false;
			}
		});
		this.initData();
	},
	getMsg(msg) {
		let flag = false;
		this.data.guiDaoCheOther.list_gw.forEach(train => {
			if (train.SN_NUM === msg.sn) {
				flag = true;
				train.latlng = [msg.data.f4, msg.data.f5];
				if (msg.data.f4 === "" || msg.data.f5 === "") {
					console.warn("收到轨道车定位消息,但无坐标数据", train, msg);
					return;
				}
				// 已创建，则移动位置
				if (train.created) {
					console.warn("收到轨道车定位消息,更新车位置", train, msg);
					const layers = this.data.guiDaoCheLayer_gw._layers;
					C.$.each(layers, (_key, layer) => {
						const options = layer.options.icon.options;
						// 消息ID在地图中存在
						if (options.data.SN_NUM === msg.sn) {
							if (train.isOld) {
								train.isOld = false;
								layer.remove();
								this.creatMarkerSingle_gw(train, false);
							} else {
								options.data.latlng = train.latlng;
								layer.setLatLng(train.latlng); //修改车位置
							}
							return false; //地图中找到有车,则跳出循环
						}
					});
				} else {
					console.warn("收到轨道车定位消息,创建车", train, msg);
					train.created = true;
					this.creatMarkerSingle_gw(train, false);
				}
			}
		});
		if (flag) {
			console.warn("收到轨道车定位消息,但未匹配台账", msg);
		}
	},
	// 初始化数据
	initData() {
		this.getGuiDaoCheList_gw();
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {},
	// 过滤图层元素
	filterLayer(ty) {
		if (ty === "轨道车定位_工务") {
			if (this.data.guiDaoCheOther.guiDaoCheVisible_gw) {
				this.data.guiDaoCheLayer_gw && $vm.map.addLayer(this.data.guiDaoCheLayer_gw);
			} else {
				this.data.guiDaoCheLayer_gw && $vm.map.removeLayer(this.data.guiDaoCheLayer_gw);
			}
		}
	},
	// 创建marker---轨道车
	creatMarker_gw(source) {
		source.forEach(item => {
			this.creatMarkerSingle_gw(item);
		});
		this.filterLayer("轨道车定位_工务");
		
		// setTimeout(()=>{
		// 	this.getMsg({sn:"M9142739",data:{f4:25.414355233960396, f5: 107.51248964550912}});
		// },5000)
	},
	creatMarkerSingle_gw(item) {
		const oldClass = item.isOld ? "is-old" : "";
		const marker = L.marker(item.latlng, {
			icon: L.divIcon({
				className: 'gongwu-icon-container',
				data: item,
				html: `<div id="gwgdc_${item.SN_NUM}" class="marker-hover gongwu-marker sb_gdcdw ${oldClass}" style="position: relative">${item.CAR_NUM}<div>`
			})
		});
		this.setMarkerClick_gw(marker, item);
		this.data.guiDaoCheLayer_gw.addLayer(marker);
	},
	// 绑定marker点击事件---轨道车
	setMarkerClick_gw(marker, data) {
		marker.on("click", (param) => {
			if ($vm.drawFlag || $vm.rangingFlag) return;
			console.log(data)
			$vm.detailMarker && $vm.detailMarker.remove(); //删除
			const size = {
				x: 115,
				w: 420,
				h: 230,
			};
			const demo =
				`<i class="marker-gongwu-info-tip gdc"></i>
				<div class="marker-gongwu-info" style="width:${ size.w }px;">
					<table border="0" cellpadding="0" cellspacing="0">
						<tbody>
							<tr>
								<th style="width:100px;text-align:center;">
									<div class="log gdcdw"></div><div class="sub-tit">${data.CAR_NUM}</div>
								</th>
								<th style="width:130px"class="line-h">
									<div class="tit">轨道车</div><div class="tit2">${data.O_NAME}</div>
								</th>
								<th class="line-h">
									<div class="list-item" style="padding-bottom:10px;"><span>车间:</span><label class="blue">${data.DEP_NAME}</label></div>
									<div class="list-item"><span>班组:</span><label>${data.CLASS_NAME}</label></div>
								</th>
							</tr>
							<tr><td colspan="3" class="line-v">
								<div class="tab orange">
									<span class="active">机车信息</span>
								</div>
							</td></tr>
							<tr><td colspan="3">
								<div class="detail-item show" style="width:100%">
									<div class="list-item two_rows"><span>车型:</span><label class="">${data.CAR_TYPE}</label></div>
									<div class="list-item two_rows"><span>SN号:</span><label class="">${data.SN_NUM}</label></div>
									<div class="list-item two_rows"><span>联系人:</span><label class="">${data.C_NAME}</label></div>
									<div class="list-item two_rows"><span>内网卡号:</span><label class="">${data.P_NUM}</label></div>
									<div class="list-item two_rows"><span>联系电话:</span><label class="">${data.C_PHONE}</label></div>
								</div>
							</td></tr>
						</tbody>
					</table>
				</div>`;
			let nameDivIcon = L.divIcon({
				className: 'detail-pop-container',
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${ size.x }px, ${ size.h - 70 }px, 0px); bottom: 0px;">
							<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
							<div class = "leaflet-popup-content-wrapper marker-houqing-info-popup">
								<div class="leaflet-popup-content no-padding" style="position:relative;width:${ size.w }px;height: ${ size.h }px;">
									${demo}
								</div>
							</div>
							<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
					   </div>`
			});
			$vm.detailMarker = L.marker(data.latlng, {
				icon: nameDivIcon
			}).addTo($vm.map);
		});
	},
	moveToPoint(latlng) {
		if (!this.data.guiDaoCheOther.guiDaoCheVisible_gw) {
			this.data.guiDaoCheOther.guiDaoCheVisible_gw = true;
			this.filterLayer("轨道车定位_工务");
		}
		$vm.map.setView(latlng, 10); //平移地图
	},
	// 绘制历史轨迹
	drawHistory(row, clearType) {
		if (clearType) {
			this.historyLine.forEach(v => {
				if (clearType === "全部") {
					v.remove();
				} else if (v.data.SN_NUM === row.SN_NUM) {
					v.remove();
				}
			});
			if (clearType === "全部") {
				this.historyIndex = 0;
				const source = C.cloneObj(this.data.guiDaoCheOther.list_gw);
				source.forEach(v => {
					v.geted = false;
					v.details = [];
				});
				this.data.guiDaoCheOther.list_gw = source;
			} else {
				this.historyIndex--;
				this.data.guiDaoCheOther.list_gw.forEach(v => {
					if (row.SN_NUM === v.SN_NUM) {
						v.geted = false;
						v.details = [];
					}
				});
			}

		} else {
			let antPath = L.polyline.antPath(row.points, {
				data: row,
				"paused": false, //暂停 初始化状态
				"reverse": false, //方向反转
				"delay": 500, //延迟，值越大越慢
				"dashArray": [10, 20], //间隔样式
				"weight": 4, //线宽
				"color": this.historyColor[this.historyIndex], //颜色
				"opacity": 1, //透明度
				"pulseColor": "white", //块颜色
				// "fillOpacity" : 1,//
			});
			antPath.data = row;
			this.historyLine.push(antPath.addTo($vm.map));
			this.historyIndex++;
			if (this.historyIndex >= 4) {
				this.historyIndex = 0;
			}
		}
	},
	// 获取轨道车列表
	getGuiDaoCheList_gw() {
		if (this.getDataFlag) {
			return;
		}
		// this.getDataFlag = true;
		C.getData({
			c: "trdm_lv_865",
			s: ["1"],
			a: "获取轨道车列表",
			url: C.ADDS.url_34_79 + "/TRDM/GeneralProServlet", //接口地址
		}, (r) => {
			const drawSource = []; //可绘制车
			r.forEach(item => {
				item.LAST_TIME__str = item.LAST_TIME.substring(0, 19);
				item.details = [];
				// 有定位最后更新时间,且有经纬度
				if (item.LAST_TIME !== "" && item.LONGITUDE !== "" && item.LATITUDE !== "") {
					item.created = true;
					var t0 = new Date(); //当前时间
					var t1 = new Date(item.LAST_TIME); //后更新时间
					item.isOld = t0.getTime() - t1.getTime() > 1000 * 60 * 60 * 6; //离当前时间大于6小时
					item.latlng = [item.LATITUDE, item.LONGITUDE];
					item.hasPoint = true;
					drawSource.push(item);
				}
			});
			this.data.guiDaoCheOther.list_gw = r;
			this.creatMarker_gw(drawSource);
			console.log("轨道车定位数据列表已获取：", r)
		});
	},
}
