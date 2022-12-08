/**
 * 机务
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag_cx: false, // 是否已调用接口-车型
	getDataFlag_fw: false, // 是否已调用接口-范围
	getDataFlag_jy: false, // 是否已调用接口-救援
	data: {
		jiWu_layers: {
			jw_cx: {
				rbnrjc: L.layerGroup(), //热备内燃机车
				jyc: L.layerGroup(), //救援车
				rbdljc: L.layerGroup(), //热备电力机车
			},
			jw_fw: {
				gy: L.layerGroup(), //公寓
				bdz: L.layerGroup(), //百吨闸瓦力列车限速
				jwcz: L.layerGroup(), //机外大坡道特殊车站
			},
			jw_jy: {
				jysb: L.layerGroup(), //救援设备
			}
		},
		jiWuOther: {
			jw_cx: {
				rbnrjc: false, //热备内燃机车
				jyc: false, //救援车
				rbdljc: false, //热备电力机车
			},
			jw_fw: {
				gy: false, //公寓
				bdz: false, //百吨闸瓦力列车限速
				jwcz: false, //机外大坡道特殊车站
			},
			jw_jy: {
				jysb: false, //救援设备
			}
		},
    light: false
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.jw_cx.register && !$vm.config.jw_fw.register && !$vm.config.jw_jy.register) {
			return;
		}
		// 设置默认值
		this.data.jiWuOther.jw_cx.rbnrjc = $vm.config.jw_cx.rbnrjc; //热备内燃机车
		this.data.jiWuOther.jw_cx.jyc = $vm.config.jw_cx.jyc; //救援车
		this.data.jiWuOther.jw_cx.rbdljc = $vm.config.jw_cx.rbdljc; //热备电力机车

  this.data.light = $vm.config.superMap.lightMode;
		this.data.jiWuOther.jw_fw.gy = $vm.config.jw_fw.gy; //公寓
		this.data.jiWuOther.jw_fw.bdz = $vm.config.jw_fw.bdz; //百吨闸瓦力列车限速
		this.data.jiWuOther.jw_fw.jwcz = $vm.config.jw_fw.jwcz; //机外大坡道特殊车站

		this.data.jiWuOther.jw_jy.jysb = $vm.config.jw_jy.jysb; //救援设备
		this.initData();
		// 绑定marker中tab切换事件
		window.chooseJwTab = (el, ty) => this.chooseJwTab(el, ty);
	},
	// 初始化数据
	initData() {
		if ($vm.config.jw_cx.register &&
			(this.data.jiWuOther.jw_cx.rbnrjc ||
				this.data.jiWuOther.jw_cx.jyc ||
				this.data.jiWuOther.jw_cx.rbdljc)) {
			this.getData_cx(); //查询车型
		}
		if ($vm.config.jw_fw.register &&
			(this.data.jiWuOther.jw_fw.gy ||
				this.data.jiWuOther.jw_fw.bdz ||
				this.data.jiWuOther.jw_fw.jwcz)) {
			this.getData_fw(); //查询范围
		}
		if ($vm.config.jw_jy.register &&
			(this.data.jiWuOther.jw_jy.jysb)) {
			this.getData_jy(); //查询救援
		}
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 过滤图层元素
	filterLayer(ty) {
		if (ty === "机务_车型") {
			// 若未获取过数据,则先获取数据
			if (this.getDataFlag_cx === false) {
				this.getData_cx();
				return;
			}
			if (this.data.jiWuOther.jw_cx.rbnrjc) {
				$vm.map.addLayer(this.data.jiWu_layers.jw_cx.rbnrjc);
			} else {
				$vm.map.removeLayer(this.data.jiWu_layers.jw_cx.rbnrjc);
			}
			if (this.data.jiWuOther.jw_cx.jyc) {
				$vm.map.addLayer(this.data.jiWu_layers.jw_cx.jyc);
			} else {
				$vm.map.removeLayer(this.data.jiWu_layers.jw_cx.jyc);
			}
			if (this.data.jiWuOther.jw_cx.rbdljc) {
				$vm.map.addLayer(this.data.jiWu_layers.jw_cx.rbdljc);
			} else {
				$vm.map.removeLayer(this.data.jiWu_layers.jw_cx.rbdljc);
			}
		}
		if (ty === "机务_范围") {
			// 若未获取过数据,则先获取数据
			if (this.getDataFlag_fw === false) {
				this.getData_fw();
				return;
			}
			if (this.data.jiWuOther.jw_fw.gy) {
				$vm.map.addLayer(this.data.jiWu_layers.jw_fw.gy);
			} else {
				$vm.map.removeLayer(this.data.jiWu_layers.jw_fw.gy);
			}
			if (this.data.jiWuOther.jw_fw.bdz) {
				$vm.map.addLayer(this.data.jiWu_layers.jw_fw.bdz);
			} else {
				$vm.map.removeLayer(this.data.jiWu_layers.jw_fw.bdz);
			}
			if (this.data.jiWuOther.jw_fw.jwcz) {
				$vm.map.addLayer(this.data.jiWu_layers.jw_fw.jwcz);
			} else {
				$vm.map.removeLayer(this.data.jiWu_layers.jw_fw.jwcz);
			}
		}
		if (ty === "机务_救援") {
			// 若未获取过数据,则先获取数据
			if (this.getDataFlag_jy === false) {
				this.getData_jy();
				return;
			}
			if (this.data.jiWuOther.jw_jy.jysb) {
				$vm.map.addLayer(this.data.jiWu_layers.jw_jy.jysb);
			} else {
				$vm.map.removeLayer(this.data.jiWu_layers.jw_jy.jysb);
			}
		}
	},
	creatMarker_jyc(source) {
		let group = L.layerGroup();
		this.data.jiWu_layers.jw_cx.jyc = group; //图层---救援车
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover jiwu-marker cx_jyc" style="position:relative"></div>`,
				})
			}); //TRAIN_NAME
			marker.on("click", (p) => {
				this.setMarkerClick("救援列车", item, p);
			});
			group.addLayer(marker);
		});
		this.data.jiWu_layers.jw_cx.jyc = group;
		this.filterLayer("机务_车型");
	},
	creatMarker_nrc(source) {
		let group = L.layerGroup();
		this.data.jiWu_layers.jw_cx.rbnrjc = group; //图层---内燃车
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover jiwu-marker cx_rbnrjc" style="position:relative"></div>`,
				})
			}); //TRAIN_NAME
			marker.on("click", (p) => {
				this.setMarkerClick("内燃机车", item, p);
			});
			group.addLayer(marker);
		});
		this.data.jiWu_layers.jw_cx.rbnrjc = group;
		this.filterLayer("机务_车型");
	},
	creatMarker_dlc(source) {
		let group = L.layerGroup();
		this.data.jiWu_layers.jw_cx.rbdljc = group; //图层---电力车
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover jiwu-marker cx_rbdljc" style="position:relative"></div>`,
				})
			}); //TRAIN_NAME
			marker.on("click", (p) => {
				this.setMarkerClick("电力机车", item, p);
			});
			group.addLayer(marker);
		});
		this.data.jiWu_layers.jw_cx.rbdljc = group;
		this.filterLayer("机务_车型");
	},
	creatMarker_gy(source) {
		let group = L.layerGroup();
		this.data.jiWu_layers.jw_fw.gy = group; //图层---公寓
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover jiwu-marker fw_gy" style="position:relative"></div>`,
				})
			}); //TRAIN_NAME
			marker.on("click", (p) => {
				this.setMarkerClick("公寓", item, p);
			});
			group.addLayer(marker);
		});
		this.data.jiWu_layers.jw_fw.gy = group;
		this.filterLayer("机务_范围");
	},
	creatMarker_tszd(source) {
		let group = L.layerGroup();
		this.data.jiWu_layers.jw_fw.jwcz = group; //图层---特殊站点
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY, //31.025497745267685,
				lng: item.GPSX //100.20658093498668
			}, {
				icon: L.divIcon({
					className: "jiwu-icon-container",
					data: item,
					html: `<div class="marker-hover jiwu-marker fw_jwcz" style="position:relative"></div>`,
				})
			}).bindPopup(`<p style="font-weight: bold; font-size: 20px;">${item.DUAN_NAME}</p>` + `<p style="font-size: 16px">${item.LINE_NAME}</p><p style="font-size: 16px">${item.STATION_NAME}</p>`); //TRAIN_NAME
			// marker.on("click", (p) => {
			// 	this.setMarkerClick("特殊站点", item, p);
			// });
			group.addLayer(marker);
		});
		this.data.jiWu_layers.jw_fw.jwcz = group;
		this.filterLayer("机务_范围");
	},
	creatMarker_yllc(source) {
		let group = L.layerGroup();
		this.data.jiWu_layers.jw_fw.bdz = group; //图层---压力列车
		C.$.each(source, (index, item) => {
			const pointS = [item.START_GPSY, item.START_GPSX];
			const pointE = [item.END_GPSY, item.END_GPSX];
			let marker = L.polyline([pointS, pointE], {
				width: 12,
				weight: 6,
				color: "#f89808"
			}).bindPopup(`<p style="font-weight: bold; font-size: 20px;">${item.LINE_NAME}</p>` + `<p style="font-size: 16px">速度: ${item.SPEED}</p><p style="font-size: 16px">坡度：${item.SLOPE}</p>`); //TRAIN_NAME
			// marker.on("click", (p) => {
			// 	this.setMarkerClick("特殊站点", item, p);
			// });
			group.addLayer(marker);
		});
		this.data.jiWu_layers.jw_fw.bdz = group;
		this.filterLayer("机务_范围");
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
		if (type === "救援列车") {
			lay = {
				x: 95,
				w: 420,
				h: 270
			}
			// [[救援列车主键id]，[救援列车主键id]，[救援列车主键id]，[救援列车主键id]]
			C.getDataP123({
				c: "tyzd_ggy2021",
				s: [
					[data.PKID],
					[data.PKID],
					[data.PKID],
					[data.PKID]
				],
				a: "救援列车详情",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const d1 = r["1"][0];
					const d2 = r["2"][0];
					const d3 = r["3"][0];
					const d4 = r["4"];
					const options = d4.map((v, i) => `<option value="${v.QD+i}">${v.QD}</option>`).join("");
					const htmls = d4.map((v, i) =>
						`<div id="jw_cx_dljc_yxqk_detail_${v.QD+i}" class="jw_cx_dljc_yxqk_detail">
							<div class="list-item auto"><span>救援起点:</span><label class="orange">${v.RESCUE_STRAT}</label></div>
							<div class="list-item auto"><span>救援终点:</span><label class="orange">${v.RESCUE_END}</label></div>
							<div class="list-item auto"><span>覆盖距离:</span><label class="orange">${v.COVER_DISTANCE}KM</label></div>
							<div class="list-item auto inline"><span>备注:</span><label class="orange">${v.REMARKS}</label></div>
						</div>`
					).join("");
					demo =
						`<i class="marker-jiwu-info-tip jyc"></i>
						<div class="marker-jiwu-info jyc" style="width:${lay.w}px;">
							<table border="0" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td style="width:120px"><div class="log"></div><div class="sub-tit"></div></td>
										<td><div class="tit">救援列车</div><div class="tit2">${d1.DEPOT}</div></td>
									</tr>
									<tr><td colspan="2" class="line-v">
										<div class="tab">
											<span class="active" onclick="chooseJwTab(this,'jw_cx_jcxx')">基本信息</span>
											<span  onclick="chooseJwTab(this,'jw_cx_jysb')">救援设备</span>
											<span  onclick="chooseJwTab(this,'jw_cx_jyzyc')">救援专用车信息</span>
											<span  onclick="chooseJwTab(this,'jw_cx_yxqk')">主救区段</span>
										</div>
									</td></tr>
									<tr><td colspan="2">
										<div id="jw_cx_jcxx" class="detail-item show">
											<div class="list-item auto"><span>救援列车名称:</span><label class="orange">${d1.TRAIN_NAME}</label></div>
											<div class="list-item auto"><span>主救方向:</span><label class="orange">${d1.DIRECTION}</label></div>
											<div class="list-item auto"><span>起重机型号:</span><label class="orange">${d1.CRANE_MODEL}(最大吊重${d1.TONNAGE}吨)</label></div>
											<div class="list-item auto"><span>车辆限速:</span><label class="orange">${d1.TRAIN_SPEED}KM/H</label></div>
											<div class="list-item auto"><span>起重机限速:</span><label class="orange">${d1.CRANE_SPEED}KM/H</label></div>
											<div class="list-item auto"><span>担当机务段:</span><label class="orange">${d1.DEPOT}</label></div>
											<div class="list-item auto"><span>设置地点:</span><label class="orange">${d1.PLACE}</label></div>
											<div class="list-item auto"><span>列车编组:</span><label class="orange">${d1.NUM}/${d1.TRAIN_WEIGHT}/${d1.HC}</label></div>
											<div class="list-item auto inline"><span>备注:</span><label class="orange">${d1.REMARKS}</label></div>
										</div>
										<div id="jw_cx_jysb" class="detail-item">
											<div class="list-item auto"><span>发电机组功率:</span><label class="orange">${d2.POWER_GENERATE}</label></div>
											<div class="list-item auto"><span>切割设备动力源:</span><label class="">${d2.POWER_SUPPLY}</label></div>
											<div class="list-item auto"><span>电焊机:</span><label class="blue">${d2.PHASE}</label></div>
											<div class="list-item auto"><span>起重机车号:</span><label class="blue">${d2.CRANE_NUM}</label></div>
											<div class="list-item auto"><span>氧气瓶数量:</span><label class="">${d2.OX_BOTTLE_NUM} 瓶</label></div>
											<div class="list-item auto"><span>乙炔瓶数量:</span><label class="">${d2.AC_BOTTLE_NUM} 瓶</label></div>
											<div class="list-item auto inline"><span>复轨器有效距离:</span><label class="">${d2.EFFECTIVE_DISTANCE} mm</label></div>
											<div class="list-item auto inline"><span>纤维吊装带材质类型:</span><label class="">${d2.MATERIAL_TYPE}</label></div>
											<div class="list-item auto inline"><span>组合台车允许速度:</span><label class="">${d2.MAX_SPEED} KM/H</label></div>
											<div class="list-item auto inline"><span>是否客货通用:</span><label class="">${d2.IF_VAN}</label></div>
										</div>
										<div id="jw_cx_jyzyc" class="detail-item">
											<div class="list-item auto"><span>用途:</span><label class="orange">${d3.CAR_USE}</label></div>
											<div class="list-item auto"><span>批准文号:</span><label class="orange">${d3.CAR_APP_NUM}</label></div>
											<div class="list-item auto"><span>自重:</span><label class="orange">${d3.CAR_WEIGHT}</label></div>
											<div class="list-item auto"><span>载重:</span><label class="orange">${d3.CAR_LOAD}</label></div>
											<div class="list-item auto"><span>原车种:</span><label class="orange">${d3.CAR_TYPE}</label></div>
											<div class="list-item auto"><span>原车号:</span><label class="orange">${d3.CAR_NUM}</label></div>
											<div class="list-item auto"><span>投入使用年月:</span><label class="orange">${d3.CAR_COM_DATE}</label></div>
										</div>
										<div id="jw_cx_yxqk" class="detail-item">
										 <div class="list-item auto"><span>线别:</span><select class="select-item" onChange="chooseJwTab(this.value,'救援列车')">${options}</select></div>
											${htmls}
										</div>
									</td></tr>
								</tbody>
							</table>
						</div>`;
					addPop(demo)
					chooseJwTab(d4[0].QD + 0, "救援列车");
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			});
		} else if (type === "内燃机车") {
			lay = {
				x: 95,
				w: 420,
				h: 360
			}
			// [[热备内燃机车主键id]，[热备内燃机车主键id]]
			C.getDataP123({
				c: "tyzd_ggy2023",
				s: [
					[data.PKID],
					[data.PKID],
				],
				a: "热备内燃机车详情",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const d1 = r["1"][0];
					const d4 = r["2"].length > 0 ? r["2"] : [];
					const options = d4.map((v, i) => `<option value="${v.QD+i}">${v.QD}</option>`).join("");
					const htmls = d4.map((v, i) =>
						`<div id="jw_cx_dljc_yxqk_detail_${v.QD+i}" class="jw_cx_dljc_yxqk_detail">
							<div class="list-item auto"><span>救援起终点:</span><label class="orange">${v.RESCUE_STRAT} - ${v.RESCUE_END}</label></div>
							<div class="list-item auto"><span>测算走行时间:</span><label class="orange">${v.COVER_TIME}</label></div>
							<div class="list-item auto"><span>覆盖距离:</span><label class="orange">${v.COVER_DISTANCE}KM</label></div>
							<div class="list-item auto"><span>出动走行径路:</span><label class="orange">${v.OUT_ROUTE}</label></div>
							<div class="list-item auto"><span>出动测算走行距离:</span><label class="orange">${v.OUT_DISTANCE}</label></div>
							<div class="list-item auto"><span>出动测算走行时间:</span><label class="orange">${v.OUT_TIME}</label></div>
							<div class="list-item auto inline"><span>备注:</span><label class="orange">${v.REMARKS}</label></div>
						</div>`
					).join("");
					var htmls_jccs = "";
					C.getDataP123({
						c: "tyzd_ggy2067",
						a: "查询机务内燃机车参数",
						s: [
							[d1.HOT_MODEL]
						],
						url: C.ADDS.servGS, //接口地址
					}, (r) => {
						var v = r[1][0];
						htmls_jccs =
							`
										<div class="list-item auto"><span>轨距（mm）:</span><label class="orange">${v.GAUGE}</label></div>
										<div class="list-item auto"><span>车体底架长（mm）:</span><label class="orange">${v.BODY_LENGTH}</label></div>
										<div class="list-item auto"><span>车体宽（mm）:</span><label class="orange">${v.BODY_WIDE}</label></div>
										<div class="list-item auto"><span>车顶至轨面（mm）:</span><label class="orange">${v.BODY_HEIGHT}</label></div>
										<div class="list-item auto"><span>车钩中心距（mm）:</span><label class="orange">${v.COUPLER_SPACE}</label></div>
										<div class="list-item auto"><span>轴式:</span><label class="orange">${v.SHAFT_STYLE}</label></div>
										<div class="list-item auto"><span>动轮直径（mm）:</span><label class="orange">${v.WHEEL_DIAMETER}</label></div>
										<div class="list-item auto"><span>整备质量（t）:</span><label class="orange">${v.CURB_WEIGHT}</label></div>
										<div class="list-item auto"><span>轴重（t）:</span><label class="orange">${v.SHAFT_WEIGHT}</label></div>
										<div class="list-item auto"><span>最小曲线半径（m）:</span><label class="orange">${v.MINI_RADIUS}</label></div>
										<div class="list-item auto"><span>持续速度(km/h):</span><label class="orange">${v.CONTINUE_SPEED}</label></div>
										<div class="list-item auto"><span>持续牵引力(KN):</span><label class="orange">${v.CONTINUE_POWER}</label></div>
										<div class="list-item auto"><span>最大速度（km/h）:</span><label class="orange">${v.MAX_SPEED}</label></div>
										<div class="list-item auto"><span>起动牵引力(KN):</span><label class="orange">${v.START_POWER}</label></div>
										<div class="list-item auto"><span>转向架外形尺寸(mm):</span><label class="orange">${v.BOGIE_SIZE}</label></div>
										<div class="list-item auto"><span>内燃轮对质量（kg）:</span><label class="orange">${v.WHEELSET_WEIGHT}</label></div>
										<div class="list-item auto"><span>牵引力传递方式:</span><label class="orange">${v.POWER_TRANSMODE}</label></div>
										<div class="list-item auto"><span>牵引电机悬挂方式:</span><label class="orange">${v.MOTOR_HANGMODEL}</label></div>
										<div class="list-item auto"><span>转向架质量:</span><label class="orange">${v.BOGLE_WEIGHT}</label></div>
										<div class="list-item auto"><span>牵引电机型号:</span><label class="orange">${v.MOTOR_TYPE}</label></div>
										<div class="list-item auto"><span>牵引电机额定功率（KW）:</span><label class="orange">${v.MOTOR_RATEDWORK}</label></div>
										<div class="list-item auto"><span>牵引电机最高电压（V）内燃:</span><label class="orange">${v.MOTOR_MAXV}</label></div>
										<div class="list-item auto"><span>牵引电机最高电流（A）:</span><label class="orange">${v.MOTOR_MAXA}</label></div>
										<div class="list-item auto"><span>牵引电机质量（KG）:</span><label class="orange">${v.MOTOR_WEIGHT}</label></div>
										
										<div class="list-item auto"><span>主压缩机型号:</span><label class="orange">${v.COMPRESS_TYPE}</label></div>
										<div class="list-item auto"><span>主压缩机排气压力（KPA）:</span><label class="orange">${v.COMPRESS_PRESSURE}</label></div>,
										<div class="list-item auto"><span>主压缩机排气压力:</span><label class="orange">${v.COMPRESS_EXHAUST}</label></div>
										<div class="list-item auto"><span>供风:</span><label class="orange">${v.AIR_SUPPLY}</label></div>
										<div class="list-item auto"><span>标称功率(KW):</span><label class="orange">${v.NOMINAL_POWER}</label></div>
										<div class="list-item auto"><span>燃油装载量(L):</span><label class="orange">${v.LOAD_FUEL}</label></div>
										<div class="list-item auto"><span>机油装载量(KG):</span><label class="orange">${v.LOAD_OIL}</label></div>
										<div class="list-item auto"><span>水装载量(KG):</span><label class="orange">${v.LOAD_WATER}</label></div>
										<div class="list-item auto"><span>砂装载量(KG):</span><label class="orange">${v.LOAD_SAND}</label></div>
										<div class="list-item auto"><span>柴油机型号:</span><label class="orange">${v.ENGINE_TYPE}</label></div>
										<div class="list-item auto"><span>柴油机长宽高（mm）:</span><label class="orange">${v.ENGINE_SIZE}</label></div>
										<div class="list-item auto"><span>柴油机标定功率（KW）:</span><label class="orange">${v.ENGINE_POWER}</label></div>,
										
										<div class="list-item auto"><span>柴油机最大运用功率（KW）:</span><label class="orange">${v.ENGINE_MAXPOWER}</label></div>
										<div class="list-item auto"><span>柴油机质量（KG）:</span><label class="orange">${v.ENGINE_WEIGHT}</label></div>
										<div class="list-item auto"><span>主发电机型号:</span><label class="orange">${v.ALTERNATOR_TYPE}</label></div>
										<div class="list-item auto"><span>主发电机质量（KG）:</span><label class="orange">${v.ALTERNATOR_WEIGHT}</label></div>
										<div class="list-item auto"><span>类型:</span><label class="orange">${v.TRAIN_TYPE}</label></div>
									`;
						demo =
							`<i class="marker-jiwu-info-tip nrjc"></i>
										<div class="marker-jiwu-info" style="width:${lay.w}px;">
											<table border="0" cellpadding="0" cellspacing="0">
												<tbody>
													<tr>
														<td style="width:120px"><div class="log nrjc"></div><div class="sub-tit"></div></td>
														<td><div class="tit">${d1.TRAIN_NAME}热备内燃机车</div><div class="tit2">${d1.DEPOT}</div></td>
													</tr>
													<tr><td colspan="2" class="line-v">
														<div class="tab">
															<span class="active" onclick="chooseJwTab(this,'jw_cx_jcxx')">机车信息</span>
															<span  onclick="chooseJwTab(this,'jw_cx_yxqk')">救援范围</span>
															<span  onclick="chooseJwTab(this,'jw_cx_jccs')">机车参数</span>
														</div>
													</td></tr>
													<tr><td colspan="2">
														<div id="jw_cx_jcxx" class="detail-item show">
															<div class="list-item auto"><span>机车名称:</span><label class="orange">${d1.TRAIN_NAME}</label></div>
															<div class="list-item auto"><span>热备机型:</span><label class="orange">${d1.HOT_MODEL}</label></div>
															<div class="list-item auto"><span>热备时间:</span><label class="orange">${d1.HTIME_BEGIN}-${d1.HTIME_END}</label></div>
															<div class="list-item auto"><span>担当机务段:</span><label class="orange">${d1.DEPOT}</label></div>
															<div class="list-item auto"><span>设置地点:</span><label class="orange">${d1.PLACE}</label></div>
															<div class="list-item auto inline"><span>备注:</span><label class="orange">${d1.REMARKS}</label></div>
														</div>
														<div id="jw_cx_yxqk" class="detail-item">
															<div class="list-item auto"><span>区段:</span><select class="select-item" onChange="chooseJwTab(this.value,'内燃车运行情况')">${options}</select></div>
															${htmls}
														</div>
														<div id="jw_cx_jccs" class="detail-item" style="overflow:auto;height:240px">
															${htmls_jccs}
														</div>
													</td></tr>
												</tbody>
											</table>
										</div>`;
						addPop(demo);
						chooseJwTab(d4[0].QD + 0, "内燃车运行情况");
					});

				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			});
		} else if (type === "电力机车") {
			lay = {
				x: 95,
				w: 420,
				h: 360
			}
			// [[热备电力机车主键id]，[热备电力机车主键id]]
			C.getDataP123({
				c: "tyzd_ggy2025",
				s: [
					[data.PKID],
					[data.PKID],
				],
				a: "热备电力机车详情",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				const d1 = r["1"].length > 0 ? r["1"][0] : {
					TRAIN_NAME: "",
					DIRECTION: "",
					HOT_MODEL: "",
					HTIME_BEGIN: "",
					HTIME_END: "",
					DEPOT: "",
					PLACE: "",
					REMARKS: "",
				};
				const d4 = r["2"].length > 0 ? r["2"] : [];
				const options = d4.map(v => `<option value="${v.QD}">${v.QD}</option>`).join("");
				const htmls = d4.map(v =>
					`<div id="jw_cx_dljc_yxqk_detail_${v.QD}" class="jw_cx_dljc_yxqk_detail">
						<div class="list-item auto"><span>救援区段:</span><label class="orange">${v.RESCUE_STRAT}-${v.RESCUE_END}</label></div>
						<div class="list-item auto inline"><span>备注:</span><label class="orange">${v.REMARKS}</label></div>
					</div>`
				).join("");
				var htmls_jccs = "";
				C.getDataP123({
					c: "tyzd_ggy2068",
					a: "查询机务电力机车参数",
					s: [
						[d1.HOT_MODEL]
					],
					url: C.ADDS.servGS, //接口地址
				}, (r) => {
					var v = r[1][0];
					htmls_jccs =
						`
									<div class="list-item auto"><span>轨距（mm）:</span><label class="orange">${v.GAUGE}</label></div>
									<div class="list-item auto"><span>车体底架长（mm）:</span><label class="orange">${v.BODY_LENGTH}</label></div>
									<div class="list-item auto"><span>车体宽（mm）:</span><label class="orange">${v.BODY_WIDE}</label></div>
									<div class="list-item auto"><span>车顶至轨面（mm）:</span><label class="orange">${v.BODY_HEIGHT}</label></div>
									<div class="list-item auto"><span>车钩中心距（mm）:</span><label class="orange">${v.COUPLER_SPACE}</label></div>
									<div class="list-item auto"><span>轴式:</span><label class="orange">${v.SHAFT_STYLE}</label></div>
									<div class="list-item auto"><span>动轮直径（mm）:</span><label class="orange">${v.WHEEL_DIAMETER}</label></div>
									<div class="list-item auto"><span>整备质量（t）:</span><label class="orange">${v.CURB_WEIGHT}</label></div>
									<div class="list-item auto"><span>轴重（t）:</span><label class="orange">${v.SHAFT_WEIGHT}</label></div>
									<div class="list-item auto"><span>最小曲线半径（m）:</span><label class="orange">${v.MINI_RADIUS}</label></div>
									<div class="list-item auto"><span>持续速度(km/h):</span><label class="orange">${v.CONTINUE_SPEED}</label></div>
									<div class="list-item auto"><span>持续牵引力(KN):</span><label class="orange">${v.CONTINUE_POWER}</label></div>
									<div class="list-item auto"><span>最大速度（km/h）:</span><label class="orange">${v.MAX_SPEED}</label></div>
									<div class="list-item auto"><span>起动牵引力(KN):</span><label class="orange">${v.START_POWER}</label></div>
									<div class="list-item auto"><span>转向架外形尺寸(mm):</span><label class="orange">${v.BOGIE_SIZE}</label></div>
									<div class="list-item auto"><span>内燃轮对质量（kg）:</span><label class="orange">${v.WHEELSET_WEIGHT}</label></div>
									<div class="list-item auto"><span>牵引力传递方式:</span><label class="orange">${v.POWER_TRANSMODE}</label></div>
									<div class="list-item auto"><span>牵引电机悬挂方式:</span><label class="orange">${v.MOTOR_HANGMODEL}</label></div>
									<div class="list-item auto"><span>转向架质量:</span><label class="orange">${v.BOGLE_WEIGHT}</label></div>
									<div class="list-item auto"><span>牵引电机型号:</span><label class="orange">${v.MOTOR_TYPE}</label></div>
									<div class="list-item auto"><span>牵引电机额定功率（KW）:</span><label class="orange">${v.MOTOR_RATEDWORK}</label></div>
									<div class="list-item auto"><span>牵引电机最高电压（V）内燃:</span><label class="orange">${v.MOTOR_MAXV}</label></div>
									<div class="list-item auto"><span>牵引电机最高电流（A）:</span><label class="orange">${v.MOTOR_MAXA}</label></div>
									<div class="list-item auto"><span>牵引电机质量（KG）:</span><label class="orange">${v.MOTOR_WEIGHT}</label></div>
									
									<div class="list-item auto"><span>主压缩机型号:</span><label class="orange">${v.COMPRESS_TYPE}</label></div>
									<div class="list-item auto"><span>主压缩机排气压力（KPA）:</span><label class="orange">${v.COMPRESS_PRESSURE}</label></div>,
									<div class="list-item auto"><span>主压缩机排气压力:</span><label class="orange">${v.COMPRESS_EXHAUST}</label></div>
									<div class="list-item auto"><span>供风:</span><label class="orange">${v.AIR_SUPPLY}</label></div>
									<div class="list-item auto"><span>供电:</span><label class="orange">${v.POWER_SUPPLY}</label></div>
									<div class="list-item auto"><span>降弓滑板距轨面（mm）:</span><label class="orange">${v.LOWBOW_SPACE}</label></div>
									<div class="list-item auto"><span>最低电压（KV）:</span><label class="orange">${v.MIN_V}</label></div>
									<div class="list-item auto"><span>持续功率（KW）:</span><label class="orange">${v.COP}</label></div>
									<div class="list-item auto"><span>停放制动方式:</span><label class="orange">${v.BRAKING_MODE}</label></div>
									<div class="list-item auto"><span>受电弓型号:</span><label class="orange">${v.PTGH_TYPE}</label></div>
									<div class="list-item auto"><span>受电弓额定电流(A):</span><label class="orange">${v.PTGH_A}</label></div>
									<div class="list-item auto"><span>受电弓最高运行速度（km/h）:</span><label class="orange">${v.PTGH_MAXSPEED}</label></div>,
									
									<div class="list-item auto"><span>受电弓工作高度(mm):</span><label class="orange">${v.PTGH_HEIGHT}</label></div>
									<div class="list-item auto"><span>受电弓质量(KG):</span><label class="orange">${v.PTGH_WEIGHT}</label></div>
									<div class="list-item auto"><span>主断路器型号:</span><label class="orange">${v.BREAKER_TYPE}</label></div>
									<div class="list-item auto"><span>主变压器型号:</span><label class="orange">${v.TRANS_TYPE}</label></div>
									<div class="list-item auto"><span>主变压器冷却方式:</span><label class="orange">${v.TRANS_COOLMODE}</label></div>,
									
									<div class="list-item auto"><span>主变压器质量（t）:</span><label class="orange">${v.TRANS_WEIGHT}</label></div>
									<div class="list-item auto"><span>电气制动方式:</span><label class="orange">${v.ELECTRIC_BRAKING}</label></div>
									<div class="list-item auto"><span>轴距（mm）:</span><label class="orange">${v.WHEELBASE}</label></div>
									<div class="list-item auto"><span>转向架中心距（mm）:</span><label class="orange">${v.BOGIE_CENTERDIS}</label></div>
									<div class="list-item auto"><span>主变压器冷却方式:</span><label class="orange">${v.TRANS_COOLMODE}</label></div>
								`;

					demo =
						`<i class="marker-jiwu-info-tip nrjc"></i>
						<div class="marker-jiwu-info" style="width:${lay.w}px;">
							<table border="0" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td style="width:120px"><div class="log nrjc"></div><div class="sub-tit"></div></td>
										<td><div class="tit">${d1.TRAIN_NAME}热备电力机车</div><div class="tit2">${d1.DEPOT}</div></td>
									</tr>
									<tr><td colspan="2" class="line-v">
										<div class="tab">
											<span class="active" onclick="chooseJwTab(this,'jw_cx_jcxx')">机车信息</span>
											<span onclick="chooseJwTab(this,'jw_cx_yxqk')">救援范围</span>
											<span onclick="chooseJwTab(this,'jw_cx_jccs')">机车参数</span>
										</div>
									</td></tr>
									<tr><td colspan="2">
										<div id="jw_cx_jcxx" class="detail-item show">
											<div class="list-item auto"><span>机车名称:</span><label class="orange">${d1.TRAIN_NAME}</label></div>
											<div class="list-item auto"><span>热备机型:</span><label class="orange">${d1.HOT_MODEL}</label></div>
											<div class="list-item auto"><span>热备时间:</span><label class="orange">${d1.HTIME_BEGIN}-${d1.HTIME_END}</label></div>
											<div class="list-item auto"><span>担当机务段:</span><label class="orange">${d1.DEPOT}</label></div>
											<div class="list-item auto"><span>设置地点:</span><label class="orange">${d1.PLACE}</label></div>
											<div class="list-item auto inline"><span>备注:</span><label class="orange">${d1.REMARKS}</label></div>
										</div>
										<div id="jw_cx_yxqk" class="detail-item">
											<div class="list-item auto"><span>救援线别:</span><select class="select-item" onChange="chooseJwTab(this.value,'电力车运行情况')">${options}</select></div>
											${htmls}
										</div>
										<div id="jw_cx_jccs" class="detail-item" style="overflow:auto;height:240px">
											${htmls_jccs}
										</div>
									</td></tr>
								</tbody>
							</table>
						</div>`;
					addPop(demo);
					chooseJwTab(d4[0].QD, "电力车运行情况");
				});
			});
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
				url: C.ADDS.servGS, //接口地址
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
		}
	},
	chooseJwTab(el, elid) {
		if (elid === "电力车运行情况" || elid === "内燃车运行情况" || elid === "内燃车机车参数"||elid === "救援列车") {
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
	getData_cx() {
		if(this.getDataFlag_cx){
			return;
		}
		this.getDataFlag_cx = true;
		const q_jyc = () => {
			C.getDataP123({
				c: "tyzd_ggy2020",
				a: "救援列车位置",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				this.creatMarker_jyc(r["1"]); // 创建marker 救援车
			});
		}
		const q_nrc = () => {
			C.getDataP123({
				c: "tyzd_ggy2022",
				a: "热备内燃机车位置",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				this.creatMarker_nrc(r["1"]); // 创建marker 内燃机车
			});
		}
		const q_dlc = () => {
			C.getDataP123({
				c: "tyzd_ggy2024",
				a: "热备电力机车位置",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				this.creatMarker_dlc(r["1"]); // 创建marker 力机车
			});
		}
		q_jyc();
		q_nrc();
		q_dlc();
	},
	getNrjcJccs(type) {
		C.getDataP123({
			c: "tyzd_ggy2067",
			a: "查询机务内燃机车参数",
			s: [
				[type]
			],
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			var v = r[1][0];
			var html =
				`<div id="jw_cx_dljc_yxqk_detail_jccs" class="jw_cx_dljc_yxqk_detail">
							<div class="list-item auto"><span>轨距（mm）:</span><label class="orange">${v.GAUGE}</label></div>
							<div class="list-item auto"><span>车体底架长（mm）:</span><label class="orange">${v.BODY_LENGTH}</label></div>
							<div class="list-item auto"><span>覆盖距离:</span><label class="orange">${v.COVER_DISTANCE}</label></div>
							<div class="list-item auto"><span>出动走行径路:</span><label class="orange">${v.OUT_ROUTE}</label></div>
							<div class="list-item auto"><span>出动测算走行距离:</span><label class="orange">${v.OUT_DISTANCE}</label></div>
							<div class="list-item auto"><span>出动测算走行时间:</span><label class="orange">${v.OUT_TIME}</label></div>
							<div class="list-item auto inline"><span>备注:</span><label class="orange">${v.REMARKS}</label></div>
						</div>`;
			return html;
		});
	},

	//查询范围
	getData_fw() {
		if(this.getDataFlag_fw){
			return;
		}
		this.getDataFlag_fw = true;
		const q_gy = () => {
			C.getDataP123({
				c: "tyzd_ggy2030",
				a: "公寓位置",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				this.creatMarker_gy(r["1"]); // 创建marker 公寓
				console.log("公寓位置", r)
			});
		}
		const q_yllc = () => {
			C.getDataP123({
				c: "tyzd_ggy2026",
				a: "压力列车限速位置",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				this.creatMarker_yllc(r["1"]); // 创建marker 压力列车
				console.log("压力列车限速位置", r)
			});
		}
		const q_tszd = () => {
			C.getDataP123({
				c: "tyzd_ggy2027",
				a: "特殊坡道站点",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				this.creatMarker_tszd(r["1"]); // 创建marker 特殊站点
				console.log("特殊坡道站点", r)
			});
		}
		q_gy();
		q_yllc();
		q_tszd();
	},
	//查询救援
	getData_jy() {
		if(this.getDataFlag_jy){
			return;
		}
		this.getDataFlag_jy = true;
	},
}
