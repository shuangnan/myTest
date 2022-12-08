/**
 * 在途车
 */
import C from "../../../assets/com.js";
import mapUtil from "./mapUtil.js"
import earthquakeObj from "./earthquake.js"
let $vm = null;
export default {
	// 消息车处理情况,以 TRAIN_ID 为 key
	msgTrainDone: {},
	getDataFlag: false, // 是否已调用接口
	data: {
		trainLayer: null,
		trainChangeZoom: 5, //列车切换显示样式层级
		trainInterval: null,
		tarinDataPoint: {}, //所有列车点位数据
		trainDetail: true, //是否可查看列车作业详情
		arrivedTrainsLayer: null,
		trainOhter: {
			dongche: true, //动车
			puche: true, //普车
			dandang: true, //担当车
			daozhan: true, // 到站车
			huoche: true, // 货车
			// 动车晚点筛选
			late_d1: false,
			late_d2: false,
			late_d3: false,
			late_d4: false,
			// 普车晚点筛选
			late_p1: false,
			late_p2: false,
			late_p3: false,
			late_p4: false,

			tarinData: [], //所有列车数据
			// 在途车数量统计
			totals: {},
			total_min: false, //统计面板样式
			total_wd: "-", //统计---晚点车
			total_ddwd: "-", //统计---担当晚点车
			total_dd: "-", //统计---担当车
			total_all: "-", //统计---全部车
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		// 若未注册在途车,则取消担当车的注册
		if (!$vm.config.train.register) {
			$vm.config.dandang.register = false;
			return;
		}
		// 设置默认值

		this.data.trainDetail = $vm.config.train.trainDetail;
		this.data.trainOhter.dongche = $vm.config.train.ck_dongche;
		this.data.trainOhter.puche = $vm.config.train.ck_puche;
		this.data.trainOhter.daozhan = $vm.config.train.daozhan;
		this.data.trainOhter.huoche = $vm.config.train.ck_huoche
		// 若已注册担当车,则用担当车初始值,否则用在途车中的初始值
		this.data.trainOhter.dandang = $vm.config.dandang.register ? $vm.config.dandang.checked : $vm.config.train.ck_dandang;

		this.initData();
		clearInterval(this.data.trainInterval);
		this.data.trainInterval = setInterval(() => {
			this.getOnRoadTrains(true)
		}, 1000 * 60 * 5);
		// 绑定列车marker中查看列车详情的方法
		window.openTrainDetail = (trainid, openType, p1) => this.openTrainDetail(trainid, openType, p1);
	},
	// 初始化数据
	initData() {
		if (this.data.trainOhter.dongche ||
			this.data.trainOhter.puche ||
			this.data.trainOhter.daozhan) {
			this.getOnRoadTrains(false);
		}
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {
		if (!$vm.config.train.register) {
			return;
		}
		if (newZoom !== oldZoom) {
			if (newZoom >= this.data.trainChangeZoom && oldZoom < this.data.trainChangeZoom) { //放大
				C.$(".marker-tarin").removeClass("min");
			} else if (newZoom < this.data.trainChangeZoom && oldZoom >= this.data.trainChangeZoom) { //缩小
				C.$(".marker-tarin").addClass("min");
			}
		}
	},
	arrivedTrainsVisible() {
		// console.log('显示到站车', this.data.trainOhter.daozhan)
		this.data.trainOhter.daozhan ? $vm.map.addLayer(this.data.arrivedTrainsLayer) : $vm.map.removeLayer(this.data.arrivedTrainsLayer)
	},
	// 过滤图层元素
	filterLayer() {
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getOnRoadTrains(false);
			return;
		}

		let elD = []; //动车
		let elP = []; //普车
		let elH = []; //货车
		// 动车
		if (this.data.trainOhter.dongche) {
			C.$(".marker-tarin.type-D").each((_, el) => elD.push(el));
		}
		// 普车
		if (this.data.trainOhter.puche) {
			C.$(".marker-tarin.type-P").each((_, el) => elP.push(el));
		}
		// 货车
		if (this.data.trainOhter.huoche) {
			C.$(".marker-tarin.type-H").each((_, el) => elH.push(el))
		}
		// 担当车
		if (this.data.trainOhter.dandang) {
			elD = elD.filter(el => C.$(el).attr("dandang") === $vm.oname);
			elP = elP.filter(el => C.$(el).attr("dandang") === $vm.oname);
			elH = elH.filter(el => C.$(el).attr("dandang") === $vm.oname);
		}
		// 到站车
		if (this.data.trainOhter.daozhan) {
			C.$(".marker-tarin.type-DZC").each((_, el) => elP.push(el))
		}
		let rsEl = [];
		const {
			// 动车
			late_d1,
			late_d2,
			late_d3,
			late_d4,
			// 普车,
			late_p1,
			late_p2,
			late_p3,
			late_p4
		} = this.data.trainOhter;
		// 动车晚点筛选
		if (late_d1 || late_d2 || late_d3 || late_d4) {
			C.$.each(elD, (i, el) => {
				if (late_d1 && C.$(el).hasClass("wd1")) {
					rsEl.push(el);
				}
				if (late_d2 && C.$(el).hasClass("wd2")) {
					rsEl.push(el);
				}
				if (late_d3 && C.$(el).hasClass("wd3")) {
					rsEl.push(el);
				}
				if (late_d4 && C.$(el).hasClass("wd4")) {
					rsEl.push(el);
				}
			});
		} else {
			rsEl = rsEl.concat(elD);
		}
		// 普车晚点
		if (late_p1 || late_p2 || late_p3 || late_p4) {
			C.$.each(elD, (i, el) => {
				if (late_p1 && C.$(el).hasClass("wd1")) {
					rsEl.push(el);
				}
				if (late_p2 && C.$(el).hasClass("wd2")) {
					rsEl.push(el);
				}
				if (late_p3 && C.$(el).hasClass("wd3")) {
					rsEl.push(el);
				}
				if (late_p4 && C.$(el).hasClass("wd4")) {
					rsEl.push(el);
				}
			});
		} else {
			rsEl = rsEl.concat(elP);
		}
		// 货车晚点
		if (late_p1 || late_p2 || late_p3 || late_p4) {
			C.$.each(elH, (i, el) => {
				if (late_p1 && C.$(el).hasClass("wd1")) {
					rsEl.push(el);
				}
				if (late_p2 && C.$(el).hasClass("wd2")) {
					rsEl.push(el);
				}
				if (late_p3 && C.$(el).hasClass("wd3")) {
					rsEl.push(el);
				}
				if (late_p4 && C.$(el).hasClass("wd4")) {
					rsEl.push(el);
				}
			});
		} else {
			rsEl = rsEl.concat(elH);
		}
		C.$(".train-icon-container").addClass("hiden"); //将所有车隐藏
		// 将匹配到的车显示
		C.$.each(rsEl, (i, el) => {
			C.$(el).parent().removeClass("hiden");
		});
		this.setTrainCount();
	},
	/**
	 * 在途列车消息处理
	 * @param {Object} msgTrain
	 */
	messageArrive(msgTrain) {
		if (!$vm.config.train.register) {
			return;
		}
		if (this.data.trainLayer === null) {
			return;
		}
		// 正在处理该车消息
		// if (this.msgTrainDone[msgTrain.TRAIN_ID]) {
		// 	return;
		// }
		// this.msgTrainDone[msgTrain.TRAIN_ID] = 1;
		if (msgTrain.LAT === "" || msgTrain.LON === "") {
			return;
		}
		msgTrain.pointXY = {
			x: msgTrain.LAT,
			y: msgTrain.LON
		};
		let train = msgTrain
		// console.warn("收到列车状态消息webSocket:",train, train.TRAIN, `\n始发: ${train.STARTNAME}\n终到: ${train.ENDNAME}\n当前: ${train.CURRNAME}\n位置: ${train.LAT}, ${train.LON}`, `\n状态: ${train.LOCAL_FLAG == 0 ? '在站' : '区间'}`, `\n时间: ${C.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}`)
		const el = C.$("#" + msgTrain.TRAIN_ID);
		// 当前站===终到站，为终到车，则延迟从地图中移除
		const isEnd = msgTrain.CURRNAME === msgTrain.ENDNAME;
		// 5层上 图标车
		const existTrains = this.data.tarinDataPoint[msgTrain.LAT + "|" + msgTrain.LON];
		if (el) {
			const layers = this.data.trainLayer._layers;
			C.$.each(layers, (_key, layer) => {
				const options = layer.options.icon.options;
				// 消息车ID在地图中存在
				if (options.data.TRAIN_ID === msgTrain.TRAIN_ID) {
					const oldTrain = C.cloneObj(options.data);
					if (options.data.LAT === msgTrain.LAT && options.data.LON === msgTrain.LON) {
						// console.warn(msgTrain.TRAIN+"：收到列车消息【动车】，但位置未发生改变"+ (new Date()).Format("hh:mm:ss"),msgTrain)
					} else {
						el.addClass("filtered");
						setTimeout(() => {
							el.removeClass("filtered");
						}, 6000);
						// console.warn(msgTrain.TRAIN + " 更新车位置:" + options.data.LAT + "→" + msgTrain.LAT + " | " + options.data.LON +
						//"→" + msgTrain.LON);
						this.updateTrainCountNum(oldTrain, msgTrain); //更新列车堆叠数字
						options.data.LAT = msgTrain.LAT;
						options.data.LON = msgTrain.LON;
						layer.setLatLng([msgTrain.LAT, msgTrain.LON]); //修改车位置
						// 若注册地震,则判断该车是否进入地震区域
						if ($vm.config.earthquake.register) {
							const inEarthQuake = this.isTrainInEarthquake(msgTrain);
							const oldFlag = el.hasClass("quake1") || el.hasClass("quake0");
							// if (inEarthQuake === "" && oldFlag) {
							// 	console.log("车次[" + msgTrain.TRAIN + "]离开地震区域", msgTrain);
							// } else if (inEarthQuake !== "" && !oldFlag) {
							// 	console.error("车次[" + msgTrain.TRAIN + "]进入地震区域", msgTrain);
							// }
							el.removeClass("quakeold1 quakeold0 quake1 quak0"); //先删除地震标志
							el.addClass(inEarthQuake);
							if (!$vm.eqOther.layerVisible) {
								el.removeClass("quake1 quak0"); //当前不显示地震,则将闪烁类删除
							}
						}

						delete this.msgTrainDone[msgTrain.TRAIN_ID]; //该消息已处理完毕
					}
					// 终到车
					if (isEnd) {
						// console.warn(msgTrain.TRAIN + " 终到车：" + msgTrain.TRAIN, msgTrain);
						setTimeout(() => {
							delete layers[_key];
							C.$("#" + msgTrain.TRAIN_ID).parent().remove();
							layer.removeFrom($vm.map);
							const oldTrain = C.cloneObj(options.data);
							this.updateTrainCountNum(oldTrain, msgTrain, true); //更新列车堆叠数字
						}, 1000 * 60 * 5); //5分钟后再删除(列车自动刷新也是5分钟,是否可不设置?)
					}
					return false; //地图中找到有车,则跳出循环
				}
			});
		} else {
			// 地图中没有此车,先将自定义属性加到车上
			console.log('添加列车', msgTrain.TRAIN)
			msgTrain.inBound = true; //默认在管界内
			msgTrain.value = msgTrain.TRAIN;
			msgTrain.trainType = this.getTrainType(msgTrain.TRAIN); //列车类型---D P
			// 若注册地震,则判断该车是否进入地震区域
			if ($vm.config.earthquake.register) {
				this.isTrainInEarthquake(msgTrain);
			}
			this.data.trainOhter.tarinData.push(msgTrain); //将消息车加入到数据仓库
			// console.warn(msgTrain.TRAIN + " 始发车：" + msgTrain.TRAIN, msgTrain);
			const marker = this.creatTrainSingle(msgTrain); //TZKYGDC0 P
			this.data.trainLayer.addLayer(marker);
			this.updateTrainCountNum({}, msgTrain); //更新列车堆叠数字
			// if (typeof(existTrains) === "undefined") {
			// 	this.data.tarinDataPoint[msgTrain.LAT + "|" + msgTrain.LON] = [msgTrain];
			// } else {
			// 	this.data.tarinDataPoint[msgTrain.LAT + "|" + msgTrain.LON].push(msgTrain);
			// 	this.setTrainCount();
			// }
		}
		// 若注册管界,且有管界数据,则判断该车是否进入管界
		if ($vm.config.boundRegion.bound && $vm.boundRegionOther.bounds.length > 0) {
			this.isTrainInBounds(msgTrain);
		}
		// delete this.msgTrainDone[msgTrain.TRAIN_ID]; //该消息已处理完毕
	},
	// 更新列车堆叠数字
	updateTrainCountNum(old, msgTrain, isRemove) {
		const existTrains = this.data.tarinDataPoint[msgTrain.LAT + "|" + msgTrain.LON];
		// 始发车,则加入坐标
		if (typeof(existTrains) === "undefined") {
			msgTrain.single = false;
			this.data.tarinDataPoint[msgTrain.LAT + "|" + msgTrain.LON] = [msgTrain];
		} else if (isRemove) { //定时移除终到车,则删除点数据
			let oldTrains = this.data.tarinDataPoint[msgTrain.LAT + "|" + msgTrain.LON];
			if (oldTrains) {
				oldTrains = oldTrains.filter(v => v.TRAIN_ID !== msgTrain.TRAIN_ID);
			}
			this.setTrainCount();
		} else { //已有车位置改变
			//先删除原来位置
			let oldTrains = this.data.tarinDataPoint[old.LAT + "|" + old.LON];
			if (oldTrains) {
				oldTrains = oldTrains.filter(v => v.TRAIN_ID !== old.TRAIN_ID);
			}
			// 加入新位置
			msgTrain.single = false;
			this.data.tarinDataPoint[msgTrain.LAT + "|" + msgTrain.LON].push(msgTrain);
			this.setTrainCount();
		}
	},
	// 判断列车是否在地震区域内
	isTrainInEarthquake(train) {
		const latlng = {
			lat: train.LAT,
			lng: train.LON
		};
		train.inQuake = "";
		if ($vm.eqOther.list.length > 0) {
			$vm.eqOther.list.forEach(eq => {
				if (train.inQuake === "") {
					const eqLatLng = {
						lat: eq.srcLatitude,
						lng: eq.srcLongitude
					};
					const dis = mapUtil.getDistance(eqLatLng, latlng);
					if (eq.radiusOne * 1000 - dis >= 0) {
						train.inQuake = "0"; //一级
					}
					if (eq.radiusTwo * 1000 - dis >= 0) {
						train.inQuake = "1"; //二级
					}
				}
			});
		}
		// return "";
		return train.inQuake ? "quakeold" + train.inQuake + " quake" + train.inQuake : ""; //在地震区域
	},
	// 判断列车是否在管界内
	isTrainInBounds(train) {
		let isOut = true;
		$vm.boundRegionOther.bounds.forEach(bound => {
			if (mapUtil.isPointInPoly(train.pointXY, bound)) {
				C.$("#" + train.TRAIN_ID).addClass("in-bound");
				isOut = false;
			}
		});
		if (isOut) {
			train.inBound = true;
			C.$("#" + train.TRAIN_ID).removeClass("in-bound");
		}
	},
	// 处理列车数据
	convertTrainData(d) {
		$vm.allTrains = d; //所有列车存入主页面,包括无坐标点车
		const noLatLon = [];
		d = d.filter(v => {
			const flag = v.LAT !== "" && v.LON !== "";
			if (flag) {
				return true;
			} else {
				noLatLon.push(v);
			}
		});
		noLatLon.length > 0 ? console.log("无坐标点车：", noLatLon) : null;
		const realTrains = [];
		let trainPointObj = {};
		let tempObj = {};
		const total = {
			wd: 0,
			ddwd: 0,
			all: 0,
			dd: 0
		}
		let noId = [];
		let trainids = {};
		d.forEach(train => {
			if (typeof(tempObj[train.TRAIN_ID]) === "undefined") {
				train.pointXY = {
					x: train.LAT,
					y: train.LON
				};
				train.inBound = true; //添加属性:是否在管界内
				train.value = train.TRAIN;
				train.trainType = train.TRAIN_TYPE == 'H' ? 'H' : this.getTrainType(train.TRAIN); //列车类型---D P
				const dddw = train[$vm.config.dandang.key]; //担当单位
				train.dandang = dddw === $vm.oname ? 1 : 0; //是否为担当车(用于晚点列车列表中担当车筛选)
				if (parseInt(train.EDTIME) >= 5) {
					total.wd++;
					if (train.dandang) {
						total.ddwd++;
					}
				}
				if (train.dandang) {
					total.dd++;
				}
				// 地震车特殊处理,将车进入的地震区域标识出来
				if ($vm.config.earthquake.register) {
					this.setEarthquakeMark(train);
				}
				tempObj[train.TRAIN_ID] = 1;
				const _key = train.LAT + "|" + train.LON;
				if (typeof(trainPointObj[_key]) === "undefined") {
					trainPointObj[_key] = [train];
				} else {
					trainPointObj[_key].push(train);
				}
				realTrains.push(train);
			} else {
				tempObj[train.TRAIN_ID]++;
				noId.push(train)
			}
		});
		// console.log("TRAIN_ID重复",tempObj)
		total.all = realTrains.length;
		this.data.trainOhter.totals = total;
		this.data.trainOhter.total_wd = total.wd; //数量统计-晚点
		this.data.trainOhter.total_ddwd = total.ddwd; //数量统计-担当晚点
		this.data.trainOhter.total_dd = total.dd; //数量统计-担当
		this.data.trainOhter.total_all = total.all; //数量统计-全部

		this.data.trainOhter.tarinData = realTrains; //真实列车数据
		this.data.tarinDataPoint = trainPointObj; //列车位置相关数据
	},
	// 设置地震车辆标志
	setEarthquakeMark(v) {
		if (v.INQUAKELIST === undefined || v.INQUAKELIST.length === 0) {
			v.inQuake = "";
		} else {
			v.inQuake = v.INQUAKELIST[0].EQ_LEVEL;
		}
	},
	// 创建列车marker
	creatTrain(source) {
		if (source.length === 0) {
			$vm.$notify.error({
				title: '提示',
				message: '获取在途车数据异常'
			});
			return;
		}
		this.convertTrainData(source); // 处理列车数据
		this.data.trainLayer && $vm.map.removeLayer(this.data.trainLayer);
		this.data.trainLayer = L.layerGroup();
		this.data.trainLayer.addTo($vm.map);
		C.$.each(source, (index, train) => {
			const marker = this.creatTrainSingle(train);
			this.data.trainLayer.addLayer(marker);
		});
		this.filterLayer();
		// 要显示管界,则将区域中的车闪烁
		if ($vm.config.boundRegion.register && $vm.config.boundRegion.bound) {
			$vm.setBoundsTrainEffect();
		}
		// 要显示区域,则将区域中的车闪烁
		if ($vm.config.boundRegion.register && $vm.config.boundRegion.region) {
			$vm.kuanXuangTrainsCls();
		}
		// 注册了地震,且地震图层不显示,则取消闪烁地震车
		if ($vm.config.earthquake.register && !$vm.eqOther.layerVisible) {
			earthquakeObj.filterLayer();
		}
	},
	// 创建单个列车marker
	creatTrainSingle(train) {
		let marker = null;
		const minClass = $vm.config.superMap.zoom < this.data.trainChangeZoom ? "min" : "";
		let p = this.getMarkerIconImage(train);
		const quakeCls = train.inQuake ? "quakeold" + train.inQuake + " quake" + train.inQuake : ""; //是否在地震区域
		const dandang = train[$vm.config.dandang.key]; //担当单位
		marker = L.marker({
			lon: train.LON,
			lat: train.LAT
		}, {
			icon: L.divIcon({
				className: "train-icon-container",
				data: train,
				html: `<div id="${train.TRAIN_ID}" dandang="${dandang}" class="${$vm.sys} marker-hover marker-tarin type-${train.trainType} ${minClass} ${p.lateCls} ${p.trainType} ${quakeCls}" style="position:relative">
						<span class="pic"></span>
						<span class="num">${train.TRAIN}</span>
						<span class="count"></span>
						<span class="cover"></span>
					</div>`,
			})
		});
		marker.on("click", (p) => {
			this.setTrainMarkerClick(p);
		});
		if ($vm.config.trainContextMenu.register) {
			marker.on("mousedown", (param) => {
				$vm.onRightMouseDown(param);
			});
		}
		return marker;
	},
	// 创建到站列车marker
	creatTrain_DZ(trains) {
		// console.log('绘制到站车', trains)
		this.data.arrivedTrainsLayer && $vm.map.removeLayer(this.data.arrivedTrainsLayer)
		this.data.arrivedTrainsLayer = L.layerGroup()
		// this.data.arrivedTrainsLayer = L.markerClusterGroup({
		// 	zoomToBoundsOnClick: false,
		// 	maxClusterRadius: 15,
		// 	disableClusteringAtZoom: 5,
		// 	iconCreateFunction: (cluster) => {
		// 		return cluster.getAllChildMarkers()[0].options.icon
		// 	}
		// })
		this.data.arrivedTrainsLayer.addTo($vm.map)
		trains.map((train) => {
			const marker = this.createTrainSingle_DZ(train)
			this.data.arrivedTrainsLayer.addLayer(marker)
		})
		console.log('到站车绘制完成', this.data.arrivedTrainsLayer)
		// this.arrivedTrainsVisible()
		this.filterLayer()
	},
	createTrainSingle_DZ(train) {
		// console.log('绘制到站车marker', train)
		let marker = null;
		const minClass = $vm.config.superMap.zoom < this.data.trainChangeZoom ? "min" : "";
		marker = L.marker({
			lon: train.LON,
			lat: train.LAT
		}, {
			icon: L.divIcon({
				className: "train-icon-container",
				data: train,
				html: `<div id="${train.TRAIN_ID}" class="marker-hover marker-tarin DZC type-DZC ${minClass}" style="position:relative">
						<span class="pic"></span>
						<span class="num">${train.TRAIN}</span>
						<span class="count"></span>
						<span class="cover"></span>
					</div>`,
			})
		});
		marker.on("click", (p) => {
			this.setTrainMarkerClick(p);
		});
		if ($vm.config.trainContextMenu.register) {
			marker.on("mousedown", (param) => {
				$vm.onRightMouseDown(param);
			});
		}
		return marker;
	},
	// 绑定marker点击事件---列车
	setTrainMarkerClick(param) {
		if ($vm.drawFlag || $vm.rangingFlag) return;
		let train = param.target.options.icon.options.data;
		this.data.trainOhter.curTrain = train;
		const count = C.$("#" + train.TRAIN_ID).find("span.count").html();
		if (count !== "") {
			// 已展开的对象,CSS会隐藏数字
			// const isSingle = C.$("#" + train.TRAIN_ID).hasClass("single-train");
			C.$("#" + train.TRAIN_ID).addClass("single-train");
			let trains = this.data.tarinDataPoint[train.LAT + "|" + train.LON] || [];
			const notExpend = trains.filter(v => !v.single).length; //未展开个数
			if (notExpend > 0) { //存在未展开车
				C.$.each(trains, (i, d) => {
					d.single = true; //标记展开
					C.$("#" + d.TRAIN_ID).addClass("single-train");
					if (i > 0) {
						let mtop = -6 + "px";
						if ($vm.config.superMap.zoom >= 5) {
							mtop = -i * 26 - 6 + "px";
						} else {
							mtop = -i * 15 - 6 + "px";
						}
						C.$("#" + d.TRAIN_ID).parent().css("margin-top", mtop);
					}
				});
				return;
			}
		}
		$vm.detailMarker && $vm.detailMarker.remove(); //删除
		$vm.centerMaker(param.latlng, 200, () => {
			const {
				UserName,
				UserPID,
				Oid,
				Oname
			} = $vm.$store.state.params;
			const prev = "#/trainTravelInfo";
			const trainInfoPath = prev + "?UserName=" + UserName + "&UserPID=" + UserPID + "&Oid=" + Oid + "&Oname=" +
				Oname + '&id=' + train.TRAIN_ID + '&cc=' + train.TRAIN + '&ccAll=' + train.CC;
			let tools = "";
			if (this.data.trainDetail) {
				tools = `<a onclick="window.openTrainDetail('${train.TRAIN_ID}','作业信息')">作业信息</a>`;
				if (1 === 2) {
					tools =
						`<a>操作</a>
							<ul>
								<li onclick="window.openTrainDetail('${train.TRAIN_ID}','作业信息')">作业信息</li>
							</ul>`;
				}
			}
			let nameDivIcon = L.divIcon({
				className: "detail-pop-container",
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(-5px, -10px, 0px); bottom: 0px; left:-340px;">
					<div class="leaflet-popup-tools" style="margin-right:5px;">${tools}</div>
					<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class = "leaflet-popup-content-wrapper blue">
					<div class="leaflet-popup-content no-padding" style="position:relative;width:700px;height: 400px;">
						<div><h2 style="margin:0;padding-left:110px;font-size:14px;color:#00B2FF;">${train.TRAIN}</h2></div>
						<div class="traininfo-cdjl" onclick="openTrainDetail('${train.TRAIN_ID}','车底交路','${train.TRAIN}')">车底交路</div>
						<div id="popupLoading" style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:0;padding:150px 300px;">加载中,请稍候...</div>
						<iframe src="${trainInfoPath}" style="height: 380px;width: 100%;margin-left:-1px;border-radius:10px;" frameborder="0"></iframe>
					</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
					<div class="leaflet-popup-tip blue"></div></div>
				   </div>`
			});
			$vm.detailMarker = L.marker([train.LAT, train.LON], {
				icon: nameDivIcon
			}).addTo($vm.map);
			setTimeout(() => {
				C.$("#popupLoading").remove();
			}, 1000);
		});
	},
	// 获取晚点样式
	getLateClass(train, ty) {
		let lateCls = "";
		let times = parseInt(train.EDTIME);
		// 动车：0-5分钟不算晚点，5-120分钟，120-240分钟，240-360分钟，360分钟以上
		// 普车：0-5分钟不算晚点，240-480分钟，480-720分钟，720分钟以上
		// times = Math.random() * 1000;
		if (ty === "D") {
			if (times >= 5 && times < 120) {
				lateCls = "wd-train wd1";
			} else if (times >= 120 && times < 240) {
				lateCls = "wd-train wd2";
			} else if (times >= 240 && times < 360) {
				lateCls = "wd-train wd3";
			} else if (times >= 360) {
				lateCls = "wd-train wd4";
			}
		} else if (ty === "P") {
			if (times >= 5 && times < 240) {
				lateCls = "wd-train wd1";
			} else if (times >= 240 && times < 480) {
				lateCls = "wd-train wd2";
			} else if (times >= 480 && times < 720) {
				lateCls = "wd-train wd3";
			} else if (times >= 720) {
				lateCls = "wd-train wd4";
			}
		} else if (ty === "H") {
			if (times >= 5 && times < 240) {
				lateCls = "wd-train wd1";
			} else if (times >= 240 && times < 480) {
				lateCls = "wd-train wd2";
			} else if (times >= 480 && times < 720) {
				lateCls = "wd-train wd3";
			} else if (times >= 720) {
				lateCls = "wd-train wd4";
			}
		}
		return {
			lateCls: lateCls,
			// cls : "wd-train wd4"
		};
	},
	// 获取列车对应图标
	getMarkerIconImage(data, isMini) {
		let iconUrl = "";
		let lateObj = {};
		// const qsFlag = this.isNearQiaoSui(data);//判断是否在桥隧上
		const qFlag = Math.random() > 0.8;
		const sFlag = Math.random() > 0.6;
		if (data.trainType === "D") {
			lateObj = this.getLateClass(data, "D");
			lateObj.trainType = "DC";
			// if (qFlag) {
			// 	lateObj.trainType = "DQ";
			// } else if (sFlag) {
			// 	lateObj.trainType = "DS";
			// }
		} else if (data.trainType === "P") {
			// this.isNearQiaoSui(data)
			lateObj = this.getLateClass(data, "P");
			lateObj.trainType = "PC";
			// if (qFlag) {
			// 	lateObj.trainType = "PQ";
			// } else if (sFlag) {
			// 	lateObj.trainType = "PS";
			// }
		} else if (data.trainType === "H") {
			lateObj = this.getLateClass(data, "H")
			lateObj.trainType = "HC"
		}
		data.lateObj = lateObj;
		return {
			iconUrl: iconUrl,
			...lateObj
		};
	},
	// 判断列车类型
	getTrainType(txt) {
		// const typeStr = "TZKYGDC0"; //特快、直达、快速、旅游、高铁、动车、城际列车、空送/动检车
		return txt.includes("D") || txt.includes("G") || txt.includes("C") ? "D" : "P";
	},

	// 设置列车重叠数量
	setTrainCount() {
		// setTimeout(() => {
		// C.$("span.count").html("");
		setTimeout(() => {
			C.$.each(this.data.tarinDataPoint, (k, v) => {
				let arr = this.data.trainOhter.dandang ? v.filter(t => t[$vm.config.dandang.key] === $vm.oname) : v;
				let len = arr.length;
				if (len > 1) {
					let firstCount = C.$("#" + arr[0].TRAIN_ID + ">.count").html();
					// 原数据与新数量不相等,则更新
					if (firstCount - len !== 0) {
						const names = arr.map(n => n.TRAIN).join(",")
						arr.forEach((train, trainI) => {
							// if(trainI===0 && len-firstCount>0){
							// 	C.$("#" + train.TRAIN_ID).removeClass("single-train");
							// }
							C.$("#" + train.TRAIN_ID + ">.count").html(len);
							// console.error("车辆堆叠数量改变:" + firstCount + "→" + len, names)
							if (len > 5) {
								console.log("重叠车超过5辆>>>>>>>", names)
							}
						});
					}
				} else if (len === 1) {
					C.$("#" + arr[0].TRAIN_ID + ">.count").html("");
				}
			});
		}, 50)
		// }, 20)
	},

	// 获取地图上框选的列车
	getBoxSelectedTrains() {
		const trainids = [];
		C.$(".kuang-xuang").each(function() {
			const id = C.$(this).attr("id");
			// 担当车选中,则只取框选区域中的担当车
			if ($vm.trainOhter.dandang) {
				if (C.$(this).attr("dandang") === $vm.oname) {
					trainids.push(id);
				}
			} else {
				trainids.push(id);
			}
			trainids.push(C.$(this).attr("id"));
		});
		const cks = this.data.trainOhter.tarinData.filter(train => trainids.indexOf(train.TRAIN_ID) > -1);
		return cks;
	},

	// 打开列车详情窗口
	openTrainDetail(trainid, openType, p1) {
		if (openType === "作业信息") {
			$vm.trainDetailVisible = true;
		} else if (openType === "车底交路") {
			$vm.dialog.src = "#/cdjl?ccId=" + trainid;
			$vm.dialog.title = p1 + "车底交路";
			$vm.dialog.visible = true;
			$vm.dialog.iszn = false;
		}
	},

	// 获取在途列车
	getOnRoadTrains(isAuto) {
		// 已获取过数据,但不是自动获取数据,则不执行
		if (this.getDataFlag && !isAuto) {
			return;
		}
		// 未获取过数据,则加等待层
		if (this.getDataFlag === false) {
			$vm.loading = $vm.$loading({
				lock: true,
				text: '正在加列车数据...',
				spinner: 'el-icon-loading',
				background: 'rgba(0,0,0,0.7)',
				customClass: 'loading'
			});
		}
		this.msgTrainDone = {};
		// 注册了地震服务,则用地震在途车
		if ($vm.config.earthquake.register) {
			this.getOnRoadTrains_earthauake((r) => {
				$vm.loading.close();
				this.creatTrain(r);
				this.getArrivedTrains((r) => {
					this.creatTrain_DZ(r)
				})
			});
		} else { // 客运段/客运站 用同一个接口
			this.getOnRoadTrains_kydz((r) => {
				$vm.loading.close();
				this.creatTrain(r);
				this.getArrivedTrains((r) => {
					this.creatTrain_DZ(r)
				})
			});
		}
	},
	// 获取在途车---地震
	getOnRoadTrains_earthauake(cb) {
		C.getDataP123({
			c: "eqeh_zxy9001",
			a: "【eqeh_zxy9001】在途车地震",
			url: C.ADDS.servGS, //接口地址
			async: true,
		}, (r) => {
			let d = [];
			if (r) {
				d = r["1"].concat(r["2"]).concat(r["3"]).concat(r["4"]);
				d.forEach(v => {
					if (v.INQUAKELIST === undefined || v.INQUAKELIST.length === 0) {
						v.inQuake = "";
					} else {
						if (v.INQUAKELIST.filter(q => q.EQ_LEVEL == "0").length > 0) {
							v.inQuake = "0";
						} else {
							v.inQuake = "1";
						}
					}
				});
			}
			this.getDataFlag = true;
			cb(d);
		});
	},
	// 获取在途车---客运段/站
	getOnRoadTrains_kydz(cb) {
		C.getDataP123({
			c: "eqeh_zxy2002",
			a: "【eqeh_zxy2002】在途车客运段站",
			url: C.ADDS.servGS, //接口地址
			async: true,
		}, (r) => {
			let d = [];
			if (r) {
				d = r["1"].concat(r["2"]).concat(r["3"]); //.concat(r["4"]).concat(r["5"]).concat(r["8"]);
			}
			this.getDataFlag = true;
			cb(d);
		});
	},
	getArrivedTrains(cb) {
		C.getDataP123({
			c: 'eqeh_zxy2020',
			a: '[eqeh_zxy2020] 获取到站车',
			url: 'https://10.192.34.79/ky203/GeneralProServlet',
			async: true
		}, (r) => {
			let d = []
			if (r) {
				d = r['1']
			}
			cb(d)
		})
	}
}
