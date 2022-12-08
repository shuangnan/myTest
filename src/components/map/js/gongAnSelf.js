import C from '@/assets/com.js'
// import C from "../../../assets/com.js";
import config_ga from "../js/config_ga"
import config from "../js/config.js";
import index from "../Index.vue"
import mapUtil from "./mapUtil"

let $vm = null;
// 独立不注册
export default {
	getDataFlag_getGddRange: false, // 是否已调用获取管界接口
	data: {
		// 渲染的图层
		layers: {

			wu_yxjg: {
				// 沿线机构
				// wu_yxjg_tlpcs: true,
				wu_yxjg_dfpcs: null,
				wu_yxjg_tlnb: null,
				wu_yxjg_town: null,
				wu_yxjg_hospital: null,
				wu_yxjg_school: null,
				wu_yxjg_danger: null,
				wu_yxjg_special: null,
			},

			wu_sb: {
				wu_sb_complex: null, // 重点复杂区段
				wu_sb_bridge: {
					ALL: null, // 全部桥梁
					CD: null,
					CQ: null,
					XC: null,
					GY: null,
				},
				wu_sb_tunnel: null, // 隧道
				wu_sb_culvert: null, // 涵洞
				wu_sb_bds: null, // 变电所
				wu_sb_pds: null, // 配电所
				wu_sb_at: null, // AT所
				wu_sb_sxjk: null, // 三线接口
				wu_sb_gktq: null, // 公跨铁桥
				wu_sb_sktq: null, // 上跨铁桥
			},
			// 客运-设备设施
			ky_sb: {
				ky_sb_yl: null,     // 医疗
				ky_sb_xf: null,     // 消防
				ky_sb_pcs: null,    // 铁路派出所
				ky_sb_local_pcs: null,    // 地方派出所
				ky_sb_yjys: null,   // 应急饮食
				ky_sb_fdwz: null,   // 防冻物资
				ky_sb_yjsscs: null, // 应急疏散场所
			}
		},
		// 图层显隐控制
		configs: {

			wu_yxjg: {
				// 沿线机构
				// wu_yxjg_tlpcs: true,
				wu_yxjg_dfpcs: null,
				wu_yxjg_tlnb: null,
				wu_yxjg_town: null,
				wu_yxjg_hospital: null,
				wu_yxjg_school: null,
				wu_yxjg_danger: null,
				wu_yxjg_special: null,
			},

			wu_sb: {
				wu_sb_complex: null, // 重点复杂区段
				wu_sb_bridge: {
					ALL: null, // 全部桥梁
					CD: null,
					CQ: null,
					XC: null,
					GY: null,
				},
				wu_sb_tunnel: null, // 隧道
				wu_sb_culvert: null, // 涵洞
				wu_sb_bds: null, // 变电所
				wu_sb_pds: null, // 配电所
				wu_sb_at: null, // AT所
				wu_sb_sxjk: null, // 三线接口
				wu_sb_gktq: null, // 公跨铁桥
				wu_sb_sktq: null, // 上跨铁桥
			},
			// 客运-设备设施
			ky_sb: {
				ky_sb_yl: null,     // 医疗
				ky_sb_xf: null,     // 消防
				ky_sb_pcs: null,    // 派出所
				ky_sb_yjys: null,   // 应急饮食
				ky_sb_fdwz: null,   // 防冻物资
				ky_sb_yjsscs: null, // 应急疏散场所
			}
		},
		policeDetail: {},

		// 公安处对应Type：
		gacType: {
			'成都铁路公安局贵阳公安处': 'GY',
			'成都铁路公安局西昌公安处': 'XC',
			'成都铁路公安局重庆公安处': 'CQ',
			'成都铁路公安局成都公安处': 'CD'
		},

		iconURL: {
			danwei: require("../img/gongAn/danwei.png"),
			commander: require("../img/gongAn/commander.png"),
			leaderphone: require("../img/gongAn/leader-phone.png"),
			dibiaoguanli: require("../img/gongAn/dibiaoguanli.png"),
			tupiantianchong: require("../img/gongAn/tupiantianchong.png"),
		},
	},
	/**
	 * 初始化客运模块
	 * @param vmParam SuperMap实例
	 */
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam
		}
		// 绑定派出所详情中按钮点击事件
		window.bridgeImgClick = (bridge_name, bridge_pcs, bridge_pics) => this.bridgeImgClick(bridge_name, bridge_pcs, bridge_pics);
	},
	/**
	 * 图层显示控制
	 * @param mainType 图层大类
	 * @param subType  图层小类
	 */
	filterLayer(mainType = '', subType = '', curGaArea = 'ALL', del = '') {
		if (mainType === '' || subType === '') {
			return
		}
		// mainType = "ky_sb"
		// subType = "ky_sb_pcs"
		console.log(mainType, subType, curGaArea)
		// console.log("this.data.configs[mainType][subType][curGaArea]", this.data.configs[mainType][subType]['XC'])

		// 同步筛选面板的选择值
		// this.data.configs[mainType][subType] = $vm.config[mainType][subType]
		// this.data.configs[mainType][subType] = config_ga[mainType][subType][curGaArea];
		if (del === '') { // 如果是正常的就执行，不正常的话（即只改变了公安处），那么默认为false，跳过此处赋值。直接removeLayer ：oldGaArea的marker

			this.data.configs[mainType][subType][curGaArea] = config_ga[mainType][subType]['check'];

		}

		console.log("$$$$$$$$$$$$$$$filterLayer：$vm.config", $vm.config);
		console.log("$$$$$$$$$$$$$$$filterLayer：mainType, subType,curGaArea", mainType, subType, curGaArea);
		console.log("$$$$$$$$$$$$$$$filterLayer: this.data.configs[mainType][subType][curGaArea] = config_ga[mainType][subType][curGaArea];", this.data.configs[mainType][subType][curGaArea])
		console.log("$$$$$$$$$$$$$$$filterLayer: this.data.layers[mainType][subType][curGaArea]", mainType, subType, curGaArea, this.data.layers[mainType][subType], this.data.layers[mainType][subType][curGaArea])
		// debugger
		if (this.data.configs[mainType][subType][curGaArea]) {
			// 选择显示
			if (this.data.layers[mainType][subType][curGaArea] === null) {
				// 图层未生成，获取数据加载图层并显示
				this.getData(subType, curGaArea).then((arr) => {
					console.log("filterLayer, pcs,curGaArea ,arr,", curGaArea, arr)
					this.createLayer(arr, mainType, subType, curGaArea)
				})
			} else {
				$vm.map.addLayer(this.data.layers[mainType][subType][curGaArea])
			}
		} else {
			// 选择不显示
			$vm.map.removeLayer(this.data.layers[mainType][subType][curGaArea])
		}
	},
	/**
	 * 获取指定类型图层数据
	 * @param dataType 图层小类
	 */
	getData(dataType = '', curGaArea = 'ALL') {
		if (dataType === '' || dataType === undefined) {
			return
		} else {
			return new Promise((resolve, reject) => {
				C.getData(this.decodeDataTypeApi(dataType, curGaArea), (res) => {
					if ($vm.sys === "police") {
						resolve(res)
					} else if (res.success) {
						resolve(res.data['1'])
					} else {
						reject('获取' + this.decodeDataType(dataType) + '失败')
						$vm.$message.error('获取' + this.decodeDataType(dataType) + '失败')
					}
				})
			})
		}
	},

	// 改变了公安处之后
	changeGaArea(newGaArea, oldGaArea) {
		// 把已有的marker隐藏了,目前只对设施设备_桥梁有筛选
		for (let subType in this.data.configs.wu_sb) {
			if (subType === 'wu_sb_bridge') {
				console.log("changeGaArea", this.data.configs.wu_sb[subType]);
				if (this.data.configs.wu_sb[subType][oldGaArea] === true) {
					this.data.configs.wu_sb[subType][oldGaArea] = false;
					this.filterLayer('wu_sb', subType, oldGaArea, 'del'); // 执行removeLayer
					console.log("隐藏了", subType, oldGaArea, '的marker')
				}
			}

		}

		// 显示当前area的marker
		for (let subType in config_ga.wu_sb) { // 如果是check的，就要显示newGaArea的marker
			if (subType === 'wu_sb_bridge') {
				if (config_ga.wu_sb[subType]['check'] === true) {
					// this.data.configs.wu_pcs[subType][oldGaArea] = true;
					this.filterLayer('wu_sb', subType, newGaArea); // 对每一个有check的进行maker layer加载
					console.log("加载了", subType, newGaArea, '的marker')
				}
			}

		}
	},
	/**
	 * 图层类别解析
	 * @param dataType 图层小类
	 * @returns {string} 图层名称
	 */
	decodeDataType(dataType) {
		switch (dataType) {

			case 'ky_sb_yl':
				return '医疗资源'
			case 'ky_sb_xf':
				return '消防资源'
			case 'ky_sb_pcs':
				return '派出所'
			case 'ky_sb_local_pcs':
				return '地方派出所'
			case 'ky_sb_yjys':
				return '应急饮食'
			case 'ky_sb_fdwz':
				return '防冻物资'
			case 'ky_sb_yjsscs':
				return '应急疏散场所'
		}
	},
	/**
	 * 获取图层查询接口
	 * @param dataType 图层小类
	 * @returns {{c: string, url: string}|{}} 接口调用JSON
	 */
	decodeDataTypeApi(dataType, curGaArea) {
		let url = C.ADDS.servGS;
		const isPolice = $vm.sys === "police";
		switch (dataType) {
			// 桥梁
			case "wu_sb_bridge": {
				return {
					c: "trdm_ga_015@kyz_0001",
					s: [curGaArea],
					url: C.ADDS.servGS
				}
			}

			// 医院
			case 'wu_yxjg_hospital': {
				// case 'ky_sb_yl': {
				return {
					c: 'tyzd_zxy2022@kyz_0001',
					s: isPolice ? [0] : [
						{
							HQ_TYPE: '0'
						}
					],
					url: url
				}
			}
			// 消防
			case 'ky_sb_xf': {
				return {
					c: 'tyzd_zxy2022@kyz_0001',
					s: isPolice ? [1] : [
						{
							HQ_TYPE: '1'
						}
					],
					url: url
				}
			}

			case 'ky_sb_local_pcs': {
				// 地方派出所
				return {
					c: 'tyzd_zxy2022@kyz_0001',
					s: isPolice ? [2] : [
						{
							HQ_TYPE: '2'
						}
					],
					url: url
				}
				// 铁路派出所
				// return {
				// 	c: 'trdm_ga_009',
				// 	s:isPolice?[]:[
				// 		{
				// 			HQ_TYPE:'2'
				// 		}
				// 	],
				// 	url:url
				// }
			}
			// 应急饮食
			case 'ky_sb_yjys': {
				return {
					c: 'tyzd_zxy2027',
					s: isPolice ? ["all", "all"] : [
						{
							DW_NAME: 'all',
							STATION_NAME: 'all'
						}
					],
					url: url
				}
			}
			// 防冻物质
			case 'ky_sb_fdwz': {
				return {
					c: 'tyzd_zxy2027',
					s: isPolice ? ["all", "all"] : [
						{
							DW_NAME: 'all',
							STATION_NAME: 'all'
						}
					],
					url: url
				}
			}
			// 应急疏散场所
			case 'ky_sb_yjsscs': {
				return {
					c: 'tyzd_zxy2027',
					s: isPolice ? ["all", "all"] : [
						{
							DW_NAME: 'all',
							STATION_NAME: 'all'
						}
					],
					url: url
				}
			}
			default:
				return {}
		}
	},
	getKySbMarkerOffset(subType = '') {
		if (subType === '') {
			return {
				x: 0,
				y: 0
			}
		}
		switch (subType) {
			case 'wu_yxjg_hospital': {
				// case 'ky_sb_yl': {
				return {
					x: 0,
					y: 0
				}
			}
			case 'wu_sb_bridge': {
				return {
					x: 0,
					y: 0.01
				}
			}
			// 铁路公安
			case 'ky_sb_pcs': {
				return {
					x: 0.01,
					y: 0
				}
			}
			// 地方公安
			case 'ky_sb_local_pcs': {
				return {
					x: 0.01,
					y: 0
				}
			}
			case 'ky_sb_yjys': {
				return {
					x: 0,
					y: -0.01
				}
			}
			case 'ky_sb_fdwz': {
				return {
					x: -0.01,
					y: 0
				}
			}
			case 'ky_sb_yjsscs': {
				return {
					x: -0.01,
					y: 0.01
				}
			}
			default: {
				return {
					x: 0,
					y: 0
				}
			}
		}
	},
	/**
	 * 创建图层
	 * @param source   图层源数据
	 * @param mainType 图层大类
	 * @param subType  图层小类
	 */
	createLayer(source = [], mainType = '', subType = '', curGaArea = 'ALL') {
		console.log("createLayer  source::::", source)
		console.log("createLayer config 》》》》》》》》》》》》》》》》》》", config)
		console.log(">>>>>>>>>>>>>mapUtil.curZoom", mapUtil.curZoom)
		console.log(">>>>>>>>>>>>> subType", subType)
		if (source.length === 0 || mainType === '' || subType === '') {
			return
		} else {
			let layerGroup = L.markerClusterGroup({
				zoomToBoundsOnClick: true,
				maxClusterRadius: 20,
				iconCreateFunction: (cluster) => {
					return cluster.getAllChildMarkers()[0].options.icon
				}
			})
			source.map((item) => {
				console.log(JSON.stringify(item))
				if (item.GPS_POINT_Y !== '' && item.GPS_POINT_X !== '') {
					let y = parseFloat(item.GPS_POINT_Y) + parseFloat(this.getKySbMarkerOffset(subType).y)
					let x = parseFloat(item.GPS_POINT_X) + parseFloat(this.getKySbMarkerOffset(subType).x)
					// console.log(item.GPS_POINT_Y, item.GPS_POINT_X, y, x)
					let attr = JSON.stringify(item)
					attr = attr.replace(/"/g, '\'')
					// console.log( attr )
					let marker = L.marker({
						lat: y,
						lng: x
					}, {
						icon: L.divIcon({
							className: 'marker-keyun-container', // 还没改
							data: item,
							html: `<marker-container type="${subType}" marker-data="${attr}">`
						})
					})
					marker.on('click', (p) => {
						// 设置点击事件
						this.setMarkerClickHandler(subType, item, p)
					})
					layerGroup.addLayer(marker)
				}
			})

			this.data.layers[mainType][subType][curGaArea] = layerGroup

			this.filterLayer(mainType, subType, curGaArea)
		}
	},
	/**
	 * 为图层中marker设置点击事件
	 * @param subType 图层小类
	 * @param item    图层marker数据
	 * @param p       点击事件Event
	 */
	setMarkerClickHandler(subType = '', item, param) {
		if (subType === '') {
			return
		} else if (subType.includes('wu_sb_bridge')) {
			if ($vm.drawFlag || $vm.rangingFlag) return
			$vm.detailMarker && $vm.detailMarker.remove()
			this.getBridgeClick(subType, item, param);
		} else {
			if ($vm.drawFlag || $vm.rangingFlag) return
			$vm.detailMarker && $vm.detailMarker.remove()
			// console.log( '显示详情', item )
			let attr = JSON.stringify(item)
			attr = attr.replace(/"/g, '\'')
			let size = this.getPopperSize(subType)
			// Popper弹框图层
			let popper = L.divIcon({
				className: 'detail-pop-container',
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${20}px, ${size.height - 40}px, 0px); bottom: 0px;">
					<a class="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class="leaflet-popup-content-wrapper marker-houqing-info-popup">
						<div class="leaflet-popup-content no-padding" style="position:relative;width:${size.width}px;height: ${size.height}px;">
							<i class="${'marker-keyun-info-tip ' + subType}"></i>
							<popper-container type="${subType}" popper-data="${attr}" popper-width="${size.width}" popper-height="${size.height}"></popper-container>
						</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
			   </div>`
			})
			$vm.detailMarker = L.marker({
				lat: item.GPS_POINT_Y,
				lng: item.GPS_POINT_X
			}, {
				icon: popper
			}).addTo($vm.map)
		}
	},
	getBridgeClick(subType, item, param) {
		console.log("桥梁信息：==================", item);
		let bridge_sid = item.SID;
		let bridge_name = item.NAME;
		let bridge_address = item.ADDRESS;
		let bridge_zrdw = item.ZR_DW;
		let bridge_zrp = item.ZR_PEOPLE;
		let bridge_zrphone = item.ZR_PHONE;
		let bridge_glb = item.GLB;
		let bridge_pcs = item.PCS_NAME;
		let bridge_pics = item.PICS;
		$vm.detailMarker && $vm.detailMarker.remove(); //删除
		// $vm.gaPanelType = 'pcs';
		// !!!!!!
		console.log("bridge_name", bridge_name);

		$vm.centerMaker(param.latlng, 260, () => {
			let nameDivIcon = L.divIcon({
				className: "detail-pop-container",
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(5px, 0px, 0px); bottom: 0px; left:-265px;">
						<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
						<div class="leaflet-popup-content-wrapper blue" style="background:#5684c8">
							<div id="popupLoading" style="position:absolute;text-align:center;width:100%;height:100%;left:0;top:0;z-index:10;padding:150px 0;background: rgba(20,20,20,.4);">加载中,请稍候...</div>
							
						</div>
						<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
						<div class="leaflet-popup-tip blue"></div></div>
				   </div>`
			});
			$vm.detailMarker = L.marker(param.latlng, {
				icon: nameDivIcon
			}).addTo($vm.map);

			$vm.detailMarker.options.icon.options.html =
				`<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(5px, 0px, 0px); bottom: 0px; left:-265px;cursor:default;z-index:10">
							<a class ="leaflet-popup-close-button" style="z-index:11;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
							<div class="leaflet-popup-content-wrapper blue" style="background:#5684c8;border-radius:7px">
								<div class="leaflet-popup-content no-padding marker-bridge-info" style="position:relative;width:367px;height: 273px;">
									<div class="top" >
										<div style="font-size:30px;font-weight:750;">No:${bridge_sid}</div>
										<div style="font-size:28px;font-weight:550;margin-top:-2px;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;" title="${bridge_name}">${bridge_name}</div>
										<div style="font-size: 16px;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;" title="${bridge_address}">${bridge_address}</div>
									</div>
									<div class="bottom" >
										<div class="detail-info">
											<div class="detail-info-item">
											<div class="detail-img">
									  			<img src="${this.data.iconURL.danwei}">
												  </div>
									  			<div class="detail-left">责任单位：</div>
									  			<div class="detail-right" title="${bridge_zrdw}">${bridge_zrdw}</div>
											</div>
											<div class="detail-info-item">
												<div class="detail-img"><img src="${this.data.iconURL.commander}"></div>
									  			<div class="detail-left">委任人：</div>
									  			<div class="detail-right">${bridge_zrp}</div>
											</div>
											<div class="detail-info-item">
												<div class="detail-img"><img src="${this.data.iconURL.leaderphone}"></div>
									  			<div class="detail-left">电话号码：</div>
									  			<div class="detail-right">${bridge_zrphone}</div>
											</div>
											<div class="detail-info-item">
												<div class="detail-img"><img src="${this.data.iconURL.dibiaoguanli}"></div>
									  			<div class="detail-left">公里标：</div>
									  			<div class="detail-right">${bridge_glb}</div>
											</div>
											
											<div class="bottom-right" onClick="bridgeImgClick('${bridge_name}', '${bridge_pcs}', '${bridge_pics}')" style="z-index:10;">
										  		<img src="${this.data.iconURL.tupiantianchong}">
									  		</div>
								  		</div>
										
									</div>
								</div>
							</div>
							<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
							<div class="leaflet-popup-tip blue"></div></div>
					   </div>`
			$vm.detailMarker.refreshIconOptions();
			setTimeout(() => {
				// this.initChart( arr[5] );
			}, 500);
			console.log("展示消息框")
		});

		// !!!!
	},

	// 部署修改图片路径
	bridgeImgClick(bridge_name, bridge_pcs, bridge_pics) {
		console.log("bridgeImgClick bridge_name", bridge_name)
		console.log("bridgeImgClick bridge_pcs", bridge_pcs)
		console.log("bridgeImgClick bridge_pics", bridge_pics)
		$vm.dialog.title = bridge_name;
		$vm.dialog.visible = true;
		$vm.isGaBridge = true; // 打开桥梁弹框
		$vm.dialog.isComp = true;
		$vm.dialog.width = 1426;
		$vm.dialog.height = 898;
		$vm.dialog.source = {
			name: bridge_name,
			gxUnit: bridge_pcs, // 管辖单位
			PICS: bridge_pics,
			// b:2
		};
		$vm.dialog.component = resolve => { require(['../../../views/singleScreen/police/components/bridgeImg.vue'], resolve) };
		// if (k === "jbqk") {
		// 	$vm.dialog.width = 700;
		// 	$vm.dialog.height = 470;
		// 	// $vm.dialog.src = "http://10.192.6.110:9090/TRDM"+this.policeDetail.PDF1;
		// 	$vm.dialog.src = C.ADDS.url_34_79 + "/TRDM" + this.policeDetail.PDF1;
		// } else if (k === "ldys") {
		// 	$vm.dialog.width = 700;
		// 	$vm.dialog.height = 470;
		// 	// $vm.dialog.src = "http://10.192.6.110:9090/TRDM"+this.policeDetail.PDF2;
		// 	$vm.dialog.src = C.ADDS.url_34_79 + "/TRDM" + this.policeDetail.PDF2;
		// } else if (k === "zysj") {
		// 	console.log()
		// 	$vm.dialog.isComp = true;
		// 	$vm.dialog.width = 700;
		// 	$vm.dialog.height = 470;
		// 	$vm.dialog.source = {
		// 		code: code,
		// 		// b:2
		// 	};
		// 	$vm.$nextTick(() => {
		// 		$vm.dialog.component = resolve => { require(['../../../views/singleScreen/police/components/policeMainData.vue'], resolve) };
		// 	})

		// } else {
		// 	$vm.dialog.isComp = true;
		// 	$vm.dialog.width = 700;
		// 	$vm.dialog.height = 470;
		// 	$vm.dialog.source = {
		// 		PICS: this.policeDetail.PICS,
		// 		// b:2
		// 	};
		// 	$vm.dialog.component = resolve => { require(['../../../views/singleScreen/police/components/policeBS.vue'], resolve) };
		// }


	},

	getPopperSize(subType = '') {
		if (subType === '') {
			return
		}
		switch (subType) {
			case 'wu_yxjg_hospital': {
				// case 'ky_sb_yl': {
				return {
					width: 450,
					height: 175
				}
			}
			case 'ky_sb_xf': {
				return {
					width: 450,
					height: 175
				}
			}
			case 'ky_sb_pcs': {
				return {
					width: 450,
					height: 175
				}
			}
			case 'ky_sb_local_pcs': {
				return {
					width: 450,
					height: 175
				}
			}
			case 'ky_sb_yjys': {
				return {
					width: 450,
					height: 220
				}
			}
			case 'ky_sb_fdwz': {
				return {
					width: 450,
					height: 220
				}
			}
			case 'ky_sb_yjsscs': {
				return {
					width: 450,
					height: 280
				}
			}
		}
	},
}
