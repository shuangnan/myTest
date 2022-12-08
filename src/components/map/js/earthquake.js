/**
 * 地震
 */
import C from "../../../assets/com.js";
import configs from '../js/config.js'
import mapUtil from "./mapUtil.js";
import trainObj from "./train.js";
let $vm = null;
const radius = {

};
export default {
	$vm,
	getDataFlag: false,// 是否已调用接口
	DIC_COLORS: {
		one: "#df990c", //封锁 RADIUS_BLOCK
		two: "#ff0000", //检查 RADIUS_CHECK
		thr: "#55aaff", //限速 RADIUS_LIMIT
	},
	eqPulse: [],
	inited: false, //是否已初始化
	data: {
		eqLayer: null,
		eqLayerTemp: null,//历史地震
		eqLayerTempPulse: null,//历史地震游乐园
		eqInterval: null,
		eqOther: {
			layerVisible: true, //图层可见性
			list: [], //地震列表
			listOld: [], //地震列表-历史
			curEarthId: "",//当前选择地震ID
			addFlag: true, //是否可新增地震点
			addShow: false, //是否显示新增地震点容器
			uploadShow: false, // 是否显示上传地震点容器
			effectShow: false, //是否显示影响区段
			effectLineId: "20022", //当前显示线路ID
			curEffectKey: "",//当前显示线路key
			effectGlb: [], //当前显示线路公里标
			effectLines: [], //当前所有线路
			isNow: true,//是否为最新地震,false-历史
		},
		eqCreater: {
			srcLongitude: "", //经度
			srcLatitude: "", //纬度
			srcLevel: "", //等级
			EQ_LOCATION: "", //地点
		},
		eqUploader: {
			filename: '',
			url: ''
		}
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.earthquake.register) {
			return;
		}
		// 设置默认值
		this.data.eqOther.layerVisible = $vm.config.earthquake.checked;
		this.data.eqOther.addFlag = $vm.config.earthquake.addFlag;

		this.initData();
		this.inited = true;
		// clearInterval(this.data.eqInterval);
		// this.data.eqInterval = setInterval(() => this.getEarthquake("-1"), 1000 * 2);
	},
	// 初始化数据
	initData() {
		if (this.data.eqOther.layerVisible) {
			this.getEarthquake(false, "");
		}
	},
	// 地图点击事件
	handleMapClick(e) {
		this.data.eqCreater.srcLongitude = e.latlng.lng;
		this.data.eqCreater.srcLatitude = e.latlng.lat;
	},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {
		if (!$vm.config.earthquake.register) {
			return;
		}
		if (newZoom > 10) {
			$(".earth-text-container").css("fontSize", 18);
		} else if (newZoom > 8) {
			$(".earth-text-container").css("fontSize", 16);
		} else if (newZoom > 6) {
			$(".earth-text-container").css("fontSize", 14);
		} else {
			$(".earth-text-container").css("fontSize", 12);
		}
		if (this.data.eqOther.isNow) {
			if (this.data.eqOther.layerVisible) {
				setTimeout(() => {
					this.creatEqPulse();
				}, 1);
			}
		} else {
			setTimeout(() => {
				const row = this.data.eqOther.listOld.find(v => v.earthId === this.data.eqOther.curEarthId);
				this.creatEqPulseSingle(row, true);
			}, 1);
		}
	},
	// 过滤图层元素
	filterLayer() {
		const isLight = configs.superMap.lightMode === undefined ? false : configs.superMap.lightMode
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getEarthquake(false, "");
			return;
		}
		if (this.data.eqOther.layerVisible) {
			$vm.map.addLayer(this.data.eqLayer);
			if (isLight) {
				$vm.$emit('lightShowEffect', true)
			}
			if (this.eqPulse.length !== 0) {
				this.creatEqPulse()
			}
			this.filterQuakeTrains(true)
			// C.$(".marker-tarin.quakeold1").addClass("quake1");
			// C.$(".marker-tarin.quakeold2").addClass("quake2");
			// C.$(".marker-tarin.quakeold3").addClass("quake3");
		} else {
			C.$("earth-text-container").remove()
			this.removeTempLayer()
			$vm.map.removeLayer(this.data.eqLayer);
			if (isLight) {
				$vm.$emit('lightShowEffect', false)
			}
			this.filterQuakeTrains(false)
			// C.$(".marker-tarin").removeClass("quake1").removeClass("quake2").removeClass("quake3");
		}
	},
	filterQuakeTrains(ifShow) {
		if (ifShow) {
			C.$(".marker-tarin.quakeold1").addClass("quake1");
			C.$(".marker-tarin.quakeold2").addClass("quake2");
			C.$(".marker-tarin.quakeold3").addClass("quake3");
		} else {
			C.$(".marker-tarin").removeClass("quake1").removeClass("quake2").removeClass("quake3");
		}
	},
	// 收到消息
	messageArrive(msg) {
		if (!$vm.config.earthquake.register) {
			return;
		}
		console.log('接收地震更新消息', msg)
		if (this.data.eqOther.layerVisible) {
			this.getEarthquake(true, (msg === undefined ? '' : msg[0]));
		}
	},
	handlePhoneUploadLocation(msg) {
		console.log( '接收手机定位消息', msg )
		$vm.phoneLocationNotify = $vm.$notify( {
			type: 'warning',
			message: msg.phone + '上报了一条险情信息',
			title: '险情信息上报',
			duration: 0,
			position: 'top-right',
			showClose: true,
			onClick: function () {
				$vm.testGeoBuffer( msg )
			}
		} )
	},
	handlePhoneCallIn(msg) {
		console.log('接收手机呼入消息', msg)
		$vm.$notify({
			type:"warning",
			message: msg.phone + '电话呼入',
			title: '险情信息上报',
			position: 'top-right'
		})
	},
	handleRenderLocation(id) {
		$vm.renderInfluenceRange(id)
	},
	// 获取地震数据
	getEarthquake(isAuto, earthId) {
		// 已获取过数据,但不是自动获取数据,则不执行
		if (this.getDataFlag && !isAuto) {
			return;
		}
		this.getDataFlag = true;
		C.getDataP123({
			c: "eqeh_zxy2001",
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			if (r) {
				let realD = [];
				let oldD = [];
				r["1"].forEach(v => {
					if (v.RADIUS_GRAPH !== "0") {
						console.log('EQ', v)
						v.visible = false;
						v.earthId = v.EQ_ID;
						v.cTime = v.EQ_CTIME;
						v.srcLongitude = v.EQ_LON;
						v.srcLatitude = v.EQ_LAT;
						v.radiusOne = parseInt(v.RADIUS_BLOCK);//检查 RADIUS_CHECK
						v.radiusTwo = parseInt(v.RADIUS_CHECK);//封锁 RADIUS_BLOCK
						v.radiusThr = parseInt(v.RADIUS_LIMIT);//限速 RADIUS_LIMIT
						v.srcLevel = v.EQ_LEVEL;
						v.eqDate = v.cTime.split(" ")[0];
						v.eqTime = v.cTime.split(" ")[1];
						v.eqLatShort = v.srcLatitude === '' ? '' : parseFloat(v.srcLatitude).toFixed(2).toString()
						v.eqLngShort = v.srcLongitude === '' ? '' : parseFloat(v.srcLongitude).toFixed(2).toString()
						// v.eqLatShort = (v.srcLatitude + "").substring(0, 5);
						// v.eqLngShort = (v.srcLongitude + "").substring(0, 5);
						v.import = v.IMPORT_TYPE
						// 0-当前，1-历史
						if (v.EQ_STATUS == 0) {
							realD.push(v);
						} else {
							oldD.push(v);
						}
					}
				});
				this.data.eqOther.list = realD;
				this.data.eqOther.listOld = oldD;
				this.creatEarthquakePoints(realD);
				console.log('MSG UPDATE EQ', realD)
				$vm.$store.commit('earthquake/updateEqList', realD)
				$vm.$emit("reloadData", realD, earthId); //将数据传至父页面(应急大屏)
				// 脚本已初始化,则要重新获取在途车数据
				if (this.inited) {
					trainObj.getOnRoadTrains(true);
				}
				// 无地震数据,则将影响线路窗口隐藏
				if (realD.length === 0) {
					this.data.eqOther.effectShow = false;
				}
			}
		});
	},



	// 创建地震区域
	creatEarthquakePoints(data) {
		this.data.eqLayer && $vm.map.removeLayer(this.data.eqLayer);
		this.data.eqLayer = L.layerGroup();
		this.data.eqLayer.addTo($vm.map);
		data.forEach(item => {
			if (item.IMPORT_TYPE == 0) {
				try {
					this.creatEarthquakeMarker(item);
				} catch (e) {
					//TODO handle the exception
				}
			} else {
				console.log('从文件中地震绘制marker', item)
				// this.createEarthquakeMarkerFromUpload(item, false)
			}
		});
		this.creatEqPulse();
		this.filterLayer();
	},
	createEarthquakeMarkerFromUpload(item, isOld) {
		let isLight = true
		if (configs.superMap.lightMode === undefined) {
			isLight = true
		} else {
			isLight = configs.superMap.lightMode
		}
		this.getEffectFromUpload(item.EQ_ID).then((data) => {
			console.log('GET EFFECT FROM UPLOAD', data)
			let effect = data['1']
			let renderEffect = []
			let lineDic = []
			effect.map((e) => {
				lineDic.push(e.L_NAME)
			})
			lineDic = Array.from(new Set(lineDic))
			lineDic.map((l) => {
				const sectionSet = effect.filter((e)=> { return e.L_NAME === l })
				let ele = sectionSet[0]
				ele.E_LAT = sectionSet[sectionSet.length - 1].E_LAT
				ele.E_LON = sectionSet[sectionSet.length - 1].E_LON
				renderEffect.push(ele)
			})
			let points = L.layerGroup()
			renderEffect.map((section, index) => {
				if (section['O_LAT'] !== '' && section['O_LON'] !== '' && section['E_LAT'] !== '' && section['E_LON'] !== '') {
					let type = ''
					if (!isLight) {
						type = section.ATTRIBUTE == '0' ? 'xs-marker' : 'fs-marker'
					} else {
						type = section.ATTRIBUTE == '0' ? 'xs-marker-light' : 'fs-marker-light'
					}
					// const type = section.ATTRIBUTE == '0' ? 'xs-marker' : 'fs-marker'
					let startMarker = L.marker({
						lat: parseFloat(section['O_LAT']),
						lng: parseFloat(section['O_LON'])
					}, {
						icon: L.divIcon({
							className: 'earth-icon-container',
							iconSize: [25, 50],
							data: section,
							html: `<marker-container type="eqEffect" marker-data="${section.L_NAME}" section="${section.ATTRIBUTE == '0' ? 'xs' : 'fs'}"></marker-container>`
							// html: `<div id="${item.EQ_ID + index.toString() + 'start'}" class="marker-hover earth-marker ${type} ${isLight ? 'start-light' : ''}" style="position: relative ; display: flex; align-items: center; flex-direction: column; justify-content: flex-start"><div style="margin-top: 2px"><span style="color: white; font-size: 10px;">${section.L_NAME.substring(0, 1)}</span></div></div>`
						})
					})
					let endMarker = L.marker({
						lat: parseFloat(section['E_LAT']),
						lng: parseFloat(section['E_LON'])
					}, {
						icon: L.divIcon({
							className: 'earth-icon-container',
							iconSize: [25, 50],
							data: section,
							html: `<marker-container type="eqEffect" marker-data="${section.L_NAME}" section="${section.ATTRIBUTE == '0' ? 'xs' : 'fs'}"></marker-container>`
							// html: `<div id="${item.EQ_ID + index.toString() + 'end'}" class="marker-hover earth-marker ${type} ${isLight ? 'end-light' : ''}" style="position: relative ; display: flex; align-items: center; flex-direction: column; justify-content: flex-start"><div style="margin-top: 2px"><span style="color: white; font-size: 10px;">${section.L_NAME.substring(0, 1)}</span></div></div>`
						})
					})
					startMarker.on('click', (e) => {
						let eles = document.elementsFromPoint(e.originalEvent.clientX, e.originalEvent.clientY)
						console.log('ETH PT CLICK', eles)
						eles.map((e) => {
							e.dispatchEvent(new MouseEvent('click', {
								bubbles: true,
								cancelable: true,
								view: window
							}))
						})
						this.disableBreathe()
						C.$('#' + item.EQ_ID + index.toString() + 'start').addClass('breathe').parent().css('z-index', 999)
						C.$('#' + item.EQ_ID + index.toString() + 'end').addClass('breathe').parent().css('z-index', 999)
						$vm.$emit('clickEarthquakeEffectPoint', { row: section, index: index, eq: effect, eqb: item })
					})
					endMarker.on('click', (e) => {
						let eles = document.elementsFromPoint(e.originalEvent.clientX, e.originalEvent.clientY)
						console.log('ETH PT CLICK', eles)
						eles.map((e) => {
							e.dispatchEvent(new MouseEvent('click', {
								bubbles: true,
								cancelable: true,
								view: window
							}))
						})
						this.disableBreathe()
						C.$('#' + item.EQ_ID + index.toString() + 'end').addClass('breathe').parent().css('z-index', 999)
						C.$('#' + item.EQ_ID + index.toString() + 'start').addClass('breathe').parent().css('z-index', 999)
						$vm.$emit('clickEarthquakeEffectPoint', { row: section, index: index, eq: effect, eqb: item })
					})
					points.addLayer(startMarker)
					points.addLayer(endMarker)
					// if (isLight) {
					// 	points.addLayer(endMarker)
					// }
					// if (index === 0) {
					// 	// 视角移动到第一个点
					// 	$vm.map.setView([parseFloat(section['O_LAT']), parseFloat(section['O_LON'])], 10)
					// }
				}
			})
			console.log(points)
			if (isOld) {
				this.data.eqLayerTemp.addLayer(points)
				this.createEqCenter(item)
			} else {
				this.data.eqLayer.addLayer(points)
			}
		})
	},
	disableBreathe() {
		document.querySelectorAll('.earth-marker').forEach((ele) => {
			ele.classList.remove('breathe')
		})
	},
	getEffectFromUpload(id) {
		return new Promise((resolve, reject) => {
			C.getDataP123({
				c: 'eqeh_zxy2023',
				s: [[id]],
				url: C.ADDS.servGS, //接口地址
				async: true,
			}, (res) => {
				console.log('获取影响范围', res)
				resolve(res)
			})
		})
	},
	// 新增地震点位
	addEarthquake() {
		if(this.data.eqCreater.srcLongitude<73.33 || this.data.eqCreater.srcLongitude>135.05){
			 $vm.$message.error("经度范围超界(73.33~135.05)！");
			 return;
		}
		if(this.data.eqCreater.srcLatitude<3.51 || this.data.eqCreater.srcLatitude>53.33){
			 $vm.$message.error("纬度范围超界(3.51~53.33)！");
			 return;
		}
		function existChinese(str) {
			if (/[\u4E00-\u9FA5\uFE30-\uFFA0]/.test(str)) {
				return true
			} else {
				return false
			}
		}
		if(existChinese(this.data.eqCreater.srcLatitude) || existChinese(this.data.eqCreater.srcLongitude)) {
			$vm.$message.error("经纬度不能包括汉字！")
			return;
		}
		$vm.loading = $vm.$loading({
			lock: true,
			text: '正在计算影响范围...',
			spinner: 'el-icon-loading',
			background: 'rgba(0,0,0,0.7)',
			customClass: 'loading'
		});
		C.getDataP123({
			//[["地震等级","震中经度","震中纬度","地点"]]
			s: [
				[
					this.data.eqCreater.srcLevel,
					this.data.eqCreater.srcLongitude + "",
					this.data.eqCreater.srcLatitude + "",
					this.data.eqCreater.EQ_LOCATION
				]
			],
			c: "eqeh_zxy6001",
			a: "【eqeh_zxy6001】新增地震点位",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
			async: true,
		}, (r) => {
			if (r) { //[地震ID,封锁半径1,检查半径2,限速半径3,最大半径]
				r = JSON.parse(r["1"]);

				mapUtil.geoBufferAnalystProcess([this.data.eqCreater.srcLatitude, this.data.eqCreater.srcLongitude], r[1], 1, (p1) => {
					mapUtil.geoBufferAnalystProcess([this.data.eqCreater.srcLatitude, this.data.eqCreater.srcLongitude], r[2], 2, (p2) => {
						mapUtil.geoBufferAnalystProcess([this.data.eqCreater.srcLatitude, this.data.eqCreater.srcLongitude], r[3], 3, (p3) => {
							this.doSaveEffectLinePoints(r[0], p1.concat(p2).concat(p3));
						});
					});
				});
			}
		});
	},
	updateEarthquakeEffects(earthquake) {
		// $vm.loading = $vm.$loading({
		// 	lock: true,
		// 	text: '正在计算影响范围...',
		// 	spinner: 'el-icon-loading',
		// 	background: 'rgba(0,0,0,0.7)',
		// 	customClass: 'loading'
		// });
		// mapUtil.geoBufferAnalystProcess([earthquake.srcLatitude, earthquake.srcLongitude], earthquake.radiusOne, 1, (p1) => {
		// 	mapUtil.geoBufferAnalystProcess([earthquake.srcLatitude, earthquake.srcLongitude], earthquake.radiusTwo, 2, (p2) => {
		// 		mapUtil.geoBufferAnalystProcess([earthquake.srcLatitude, earthquake.srcLongitude], earthquake.radiusThr, 3, (p3) => {
		// 			console.log('EFFECT', p1.concat(p2).concat(p3))
		// 			// this.doSaveEffectLinePoints(earthquake.EQ_ID, p1.concat(p2).concat(p3));
		// 		});
		// 	});
		// });

		// C.getDataP123({
		// 	//[["地震等级","震中经度","震中纬度","地点"]]
		// 	s: [
		// 		[
		// 			earthquake.EQ_LEVEL,
		// 			earthquake.srcLongitude + "",
		// 			earthquake.srcLatitude + "",
		// 			earthquake.EQ_LOCATION
		// 		]
		// 	],
		// 	c: "eqeh_zxy6001",
		// 	a: "【eqeh_zxy6001】新增地震点位",
		// 	url: "https://10.192.126.203/GeneralProServlet", //接口地址
		// 	async: true,
		// }, (r) => {
		// 	if (r) { //[地震ID,封锁半径1,检查半径2,限速半径3,最大半径]
		// 		r = JSON.parse(r["1"]);

		// 		mapUtil.geoBufferAnalystProcess([earthquake.srcLatitude, earthquake.srcLongitude], r[1], 1, (p1) => {
		// 			mapUtil.geoBufferAnalystProcess([earthquake.srcLatitude, earthquake.srcLongitude], r[2], 2, (p2) => {
		// 				mapUtil.geoBufferAnalystProcess([earthquake.srcLatitude, earthquake.srcLongitude], r[3], 3, (p3) => {
		// 					// this.doSaveEffectLinePoints(r[0], p1.concat(p2).concat(p3));
		// 				});
		// 			});
		// 		});
		// 	}
		// });
	},
	doSaveEffectLinePoints(earthId, points) {
		console.log('DO SAVE EFFECTS', earthId, points)
		if (points.length === 0) {
			return
		}
		C.getDataP123({
			s: points,
			w: [earthId],
			c: "eqeh_zxy9003",
			a: "【eqeh_zxy9003】地震点影响铁路线坐标",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
			async: true,
		}, (r2) => {
			$vm.loading.close();
			this.getEarthquake(true, earthId); //temp 接入消息后,使用消息触发获取数据接口
		});
	},
	// 恢复地震点位
	huiFuEarthquake(row, effects) {
		// code	eqeh_zxy3001
		// sql	[预警id,启用/停用（0-启用，2-停用）]
		if (row.IMPORT_TYPE == '0') {
			console.log(row, effects)
			// debugger
			let jdqs = []
			effects.map((e) => {
				e.jdq.map((j) => {
					jdqs.push(j.CODE)
				})
			})
			C.getDataP123({
				s: [row.earthId, "2", '0', jdqs.join(',')],
				c: "eqeh_zxy9004",
				a: "【eqeh_zxy9004】恢复地震",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
				async: true,
			}, (r) => {
				if (r) {
					this.removeTempLayer()
					this.getEarthquake(row.earthId); //temp 接入消息后,使用消息触发获取数据接口
				}
			});
		} else if (row.IMPORT_TYPE == '1') {
			C.getDataP123({
				s: [[[1, row.EQ_ID]]],
				c: 'eqeh_zhaoyue3001',
				url: 'https://10.192.126.203/GeneralProServlet',
				async: true
			}, (r) => {
				if (r) {
					this.removeTempLayer()
					this.getEarthquake(true)
				}
			})
		}
	},
	removeEqLayer() {
		this.data.eqLayer && $vm.map.removeLayer(this.data.eqLayer)
		this.data.eqLayer = L.layerGroup()
		this.data.eqLayer.addTo($vm.map)
	},
	removeTempLayer() {
		this.data.eqLayerTemp && $vm.map.removeLayer(this.data.eqLayerTemp);
		this.data.eqLayerTemp = L.layerGroup();
		this.data.eqLayerTemp.addTo($vm.map);
	},
	createEqCenter(row) {
		this.removeTempLayer()
		const centerPoint = L.marker([row.srcLatitude, row.srcLongitude], {
			className: "eq_" + row.earthId,
			data: row,
			icon: L.divIcon({
				className: "earth-text-container",
				html: `<marker-container type="eq" marker-data="${JSON.stringify(row).replace( /"/g, '\'' )}"></marker-container>`
			})
		})
		this.data.eqLayerTemp.addLayer(centerPoint)
		$vm.setMapView([parseFloat(row.srcLatitude), parseFloat(row.srcLongitude)], 5)
	},
	// 创建地震点
	creatEarthquakeMarker(row, isFromOld) {
		// 历史,则将临时地震删除
		if (isFromOld) {
			this.removeTempLayer();
		}
		// $(".earthquake")[0].getBBox()   获取SVG尺寸
		const _creat = (color, radius, flag) => {
			const node = L.circle([row.srcLatitude, row.srcLongitude], {
				className: "eq_" + row.earthId,
				data: row,
				color: color,
				opacity: 0.3,
				fillColor: color,
				fillOpacity: 0.2,
				radius: radius * 1000 //公里*1000 除2（米/2）
			});
			if (isFromOld) {
				this.data.eqLayerTemp.addLayer(node);
			} else {
				this.data.eqLayer.addLayer(node);
			}
		}
		row.radiusThr && _creat(this.DIC_COLORS.thr, row.radiusThr); //创建圆-限速3-大
		row.radiusOne && _creat(this.DIC_COLORS.one, row.radiusOne); //创建圆-封锁1-中
		row.radiusTwo && _creat(this.DIC_COLORS.two, row.radiusTwo); //创建圆-检查2-小
		const _creatLine = (color, rice) => {
			const a = C.latlngRiceExchange(rice * 1000, 'latlng');
			const p1 = [parseFloat(row.srcLatitude) + a.lat, row.srcLongitude];
			const p2 = [row.srcLatitude, row.srcLongitude];
			var lines = new L.polyline([p1, p2], {
				width: 1,
				color: color
			});
			if (isFromOld) {
				this.data.eqLayerTemp.addLayer(lines);
			} else {
				this.data.eqLayer.addLayer(lines);
			}
			// 公里
			const showRice = rice;//.toFixed(2);
			const text = L.marker({
				lon: p1[1],
				lat: p1[0]
			}, {
				icon: L.divIcon({
					className: "earth-text-container",
					html: `<span style="background:transparent;margin-left:8px;" title="${rice}公里">${showRice}</span>`,
				})
			});
			if (isFromOld) {
				this.data.eqLayerTemp.addLayer(text);
			} else {
				this.data.eqLayer.addLayer(text);
			}
		}
		row.radiusThr && _creatLine(this.DIC_COLORS.thr, row.radiusThr); //创建半径-限速3-大
		row.radiusOne && _creatLine(this.DIC_COLORS.one, row.radiusOne); //创建半径-封锁1-中
		row.radiusTwo && _creatLine(this.DIC_COLORS.two, row.radiusTwo); //创建半径-检查2-小
		// 地震等级文字
		const text = L.marker({
			lon: parseFloat(row.srcLongitude),
			lat: parseFloat(row.srcLatitude)
		}, {
			icon: L.divIcon({
				className: "earth-text-container",
				html: `<span style="background:transparent;padding-left:10px;white-space: nowrap;" title="${row.srcLevel} 级">${row.srcLevel} 级</span>`,
			})
		});
		// 创建中心点
		const centerP = L.marker({
			lon: row.srcLongitude,
			lat: row.srcLatitude
		}, {
			icon: L.divIcon({
				className: "earth-text-container",
				html: `<span style="background:black;width:8px;height:8px;display:inline-block;border-radius:8px;margin-left:2px;"> </span>`,
			})
		});
		if (isFromOld) {
			this.data.eqLayerTemp.addLayer(centerP);
			this.data.eqLayerTemp.addLayer(text);
			setTimeout(() => {
				this.creatEqPulseSingle(row, isFromOld);
			}, 1);
		} else {
			this.data.eqLayer.addLayer(centerP);
			this.data.eqLayer.addLayer(text);
		}
		$vm.setMapView([parseFloat(row.srcLatitude), parseFloat(row.srcLongitude)], 5)
	},
	createRangeCircle(pts, position) {
		$(".range-circle").remove()
		$(".range-center").remove()
		let pA = {
			lng: parseFloat(pts.GPS_POINT_X_1),
			lat: parseFloat(pts.GPS_POINT_Y_1)
		}
		let pB = {
			lng: parseFloat(pts.GPS_POINT_X_2),
			lat: parseFloat(pts.GPS_POINT_Y_2)
		}
		let radius = parseFloat(mapUtil.getDistance(pA, pB)) / 2
		let midPoint = {
			lng: (pA.lng + pB.lng) / 2,
			lat: (pA.lat + pB.lat) / 2
		}
		console.log('中点', midPoint, '半径', radius)

		let circle = L.circle([midPoint.lat, midPoint.lng], {
			color: 'green',
			className: 'range-circle',
			fillColor: 'green',
			opacity: 0.3,
			fillOpacity: 0.2,
			radius: radius
		})
		let node = L.marker({
			lon: midPoint.lng,
			lat: midPoint.lat
		}, {
			icon: L.divIcon({
				className: "range-center",
				html: `<div class="range-marker range-center">
                   
                   </div>
                   <div style="margin-left: 5px; width: 100px">
                     <span style="font-weight: bold; font-size: 18px">${position}</span>
                   </div>`
			})
		})

		$vm.map.addLayer(circle)
		$vm.map.addLayer(node)
		$vm.map.setView([midPoint.lat, midPoint.lng], 10)
	},
	hideEqLayers() {
		if (this.data.eqLayer) {
			$vm.map.removeLayer(this.data.eqLayer)
		}
		if (this.data.eqLayerTemp) {
			$vm.map.removeLayer(this.data.eqLayerTemp)
		}
		this.removeEqPulse()
	},
	// 创建地震环波
	creatEqPulse() {
		$(".earthquake-pulse").remove();
		this.eqPulse.forEach(pulse => {
			this.data.eqLayer.removeLayer(pulse);
		});
		this.eqPulse = [];
		this.data.eqOther.list.forEach(row => {
			this.creatEqPulseSingle(row, false);
		});
	},
	removeEqPulse() {
		$(".earthquake-pulse").remove();
		this.eqPulse.forEach(pulse => {
			this.data.eqLayer.removeLayer(pulse);
		});
		this.eqPulse = [];
	},
	filterEarthquakeMarkers() {
		console.log('显示Marker')
		$vm.filterEarthquakeViewMarker()
	},
	// 创建地震光圈动画
	creatEqPulseSingle(row, isFromOld) {
		const scPoint = [row.srcLatitude, row.srcLongitude];
		// const scPoint = [30.406855416973606,102.46975861306832];
		if (!$(".eq_" + row.earthId)[0]) {
			return;
		}
		const box = $(".eq_" + row.earthId)[0].getBBox()
		const pulseIcon = L.icon.pulse({
			className: "earthquake-pulse",
			// iconSize:[42,42],
			iconSize: [box.width, box.width],
			color: this.DIC_COLORS.radiusTwo
		});
		const node = L.marker(scPoint, {
			icon: pulseIcon
		});
		if (isFromOld) {
			this.data.eqLayerTempPulse && $vm.map.removeLayer(this.data.eqLayerTempPulse);
			this.data.eqLayerTempPulse = L.layerGroup();
			this.data.eqLayerTempPulse.addTo($vm.map);
			this.data.eqLayerTempPulse.addLayer(node);
		} else {
			node.on("click", (e) => {
				try {
					$vm.$emit("markerClick", row);
				} catch (e) {
					//TODO handle the exception
				}
			});
			this.eqPulse.push(node);
			this.data.eqLayer.addLayer(node);
		}
	},
	// 获取地震半径
	getEqRadiu(v) {
		const _v = parseFloat(v);
		let _k = 0;
		if (3 <= _v && _v < 4) {
			_k = 20;
		} else if (4 <= _v && _v < 5) {
			_k = 50;
		} else if (5 <= _v && _v < 6) {
			_k = 100;
		} else if (6 <= _v && _v < 7) {
			_k = 250;
		} else if (7 <= _v) {
			_k = 600;
		}
		return _k;
	},
}
