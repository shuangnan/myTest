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
			// 物-派出所
			wu_pcs: {
				// wu_pcs_dfpcs: null, // 地方派出所
				wu_pcs_tlpcs: {
					ALL: null, // 全部铁路派出所
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_jjing: {// 进京
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_jjiang: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_jzang: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kysn: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kya: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kyb: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kyc: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_linea: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_lineb: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_linec: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},

			},
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
			// 物-铁路派出所
			wu_pcs: {
				// wu_pcs_dfpcs: null, // 地方派出所
				wu_pcs_tlpcs: {
					ALL: null, // 全部铁路派出所
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_jjing: {// 进京
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_jjiang: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_jzang: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kysn: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kya: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kyb: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_kyc: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_linea: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_lineb: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},
				wu_pcs_linec: {
					ALL: null,
					CD: null,
					CQ: null,
					XC: null,
					GY: null
				},


			},
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
		}
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
		window.mapPCSInfoBtnClick = (ty, code, name) => this.mapPCSInfoBtnClick(ty, code, name);
		// 放置铁路公安图标
		console.log("放置铁路公安图标");
		this.filterLayer('wu_pcs', 'wu_pcs_tlpcs', 'ALL'); // 初始的时候，默认为所有公安处


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
			// 如果subType不是全部，就remove subType为tlpcs的，并且让tlpcs的chebox置false
			// if (subType !== 'wu_pcs_tlpcs') {
			// 	$vm.map.removeLayer( this.data.layers['wu_pcs']['wu_pcs_tlpcs'] );
			// 	config_ga.wu_pcs.wu_pcs_tlpcs = false;
			// }

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

	// 改变了公安处之后,对派出所类别进行调整
	changeGaArea(newGaArea, oldGaArea) {
		// 把已有的marker隐藏了
		for (let subType in this.data.configs.wu_pcs) {
			if (subType === "wu_pcs_dfpcs") {

			} else {
				// console.log("changeGaArea", this.data.configs.wu_pcs[subType]);
				if (this.data.configs.wu_pcs[subType][oldGaArea] === true) {
					this.data.configs.wu_pcs[subType][oldGaArea] = false;
					this.filterLayer('wu_pcs', subType, oldGaArea, 'del'); // 执行removeLayer
					console.log("隐藏了", subType, oldGaArea, '的marker')
				}
			}
		}

		// 显示当前area的marker
		for (let subType in config_ga.wu_pcs) { // 如果是check的，就要显示newGaArea的marker
			if (subType === "wu_pcs_dfpcs") {

			} else {
				if (config_ga.wu_pcs[subType]['check'] === true) {
					// this.data.configs.wu_pcs[subType][oldGaArea] = true;
					this.filterLayer('wu_pcs', subType, newGaArea); // 对每一个有check的进行maker layer加载
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
			// 铁路派出所
			case "wu_pcs_tlpcs": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["ALL", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 地方派出所
			// case 'wu_pcs_dfpcs': {
			// 	return {
			// 		c: 'tyzd_zxy2022@kyz_0001',
			// 		s: isPolice ? [2] : [
			// 			{
			// 				HQ_TYPE: '2'
			// 			}
			// 		],
			// 		url: url
			// 	}
			// }
			// 进京
			case "wu_pcs_jjing": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["BJ", curGaArea],
					url: C.ADDS.servGS
				}
			}

			// 进疆
			case "wu_pcs_jjiang": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["XJ", curGaArea],
					url: C.ADDS.servGS
				}
			}

			// 进藏
			case "wu_pcs_jzang": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["XZ", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 客运枢纽所
			case "wu_pcs_kysn": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["KS", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 客运A类所
			case "wu_pcs_kya": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["KA", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 客运B类所
			case "wu_pcs_kyb": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["KB", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 客运C类所
			case "wu_pcs_kyc": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["KC", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 线路A类所
			case "wu_pcs_linea": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["XA", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 线路B类所
			case "wu_pcs_lineb": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["XB", curGaArea],
					url: C.ADDS.servGS
				}
			}
			// 线路C类所
			case "wu_pcs_linec": {
				return {
					c: "trdm_ga_009@kyz_0001",
					s: ["XC", curGaArea],
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
			case 'ky_sb_xf': {
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
				// console.log(JSON.stringify(item))
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
							html: `<marker-container type="${subType}" marker-data="${attr}" zoom="${subType}">`
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
		} else if (subType.includes('wu_pcs_')) {
			if ($vm.drawFlag || $vm.rangingFlag) return
			$vm.detailMarker && $vm.detailMarker.remove()
			this.getPcsClick(subType, item, param);
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
	getPcsClick(subType, item, param) {
		console.log("派出所信息：==================", item);
		let pcs_id = item.PCS_ID;
		let pcs_name = subType === 'wu_pcs_dfpcs' ? item.DEPOT : item.PCS_NAME;
		let pcs_brief = item.BRIEF;
		// console.log( "当前点击派出所:", pcs_id );
		$vm.detailMarker && $vm.detailMarker.remove(); //删除

		const code = pcs_id;
		// const querys = [];
		// querys.push( this.getStationInfo( code ) ); //站基本信息---0
		C.getData({
			c: "trdm_ga_006@kyz_0001",
			s: [code]
		}, (r) => {
			if (r && r[0])
				console.log("派出所主表 :", r);
			this.policeDetail = r[0];
			console.log("this.policeDetail", this.policeDetail)
			$vm.gaPanelType = 'pcs';
			$vm.policeDetail = this.policeDetail;
		});



		// $vm.centerMaker(param.latlng, 260, () => {
		// 	let nameDivIcon = L.divIcon({
		// 		className: "detail-pop-container",
		// 		iconSize: [10, 10],
		// 		popupAnchor: [0, 0],
		// 		html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(5px, 0px, 0px); bottom: 0px; left:-265px;">
		// 				<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
		// 				<div class="leaflet-popup-content-wrapper blue" style="background:rgba(255,255,255,.85)">
		// 					<div id="popupLoading" style="position:absolute;text-align:center;width:100%;height:100%;left:0;top:0;z-index:10;padding:150px 0;background: rgba(20,20,20,.4);">加载中,请稍候...</div>
		// 					<div class="leaflet-popup-content no-padding marker-station-info" style="position:relative;width:630px;height: 346px;">
		// 						<div class="top">
		// 							<div class="top-left ga" style="width:350px">
		// 								<div class="pic">123</div>
		// 								<div class="text"><h3>${pcs_name}</h3>派出所</div>
		// 							</div>
		// 							<div class="top-right">
		// 								<div class="btns"></div>
		// 							</div>
		// 						</div>
		// 						<div class="chart" id="stationInfoChartCon"></div>
		// 						<div class="bottom" style="display:none;">
		// 							<div class="bottom-left">
		// 								<div class="tit-con">晚点情况</div>
		// 							</div>
		// 							<div class="bottom-right">
		// 								<div class="tit-con">人员安排情况<label>当前工作人数:-人</label></div>
		// 							</div>
		// 						</div>
		// 					</div>
		// 				</div>
		// 				<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
		// 				<div class="leaflet-popup-tip blue"></div></div>
		// 		   </div>`
		// 	});
		// 	$vm.detailMarker = L.marker(param.latlng, {
		// 		icon: nameDivIcon
		// 	}).addTo($vm.map);
		// 	const code = pcs_id;
		// 	// const querys = [];
		// 	// querys.push( this.getStationInfo( code ) ); //站基本信息---0
		// 	C.getData({
		// 		c: "trdm_ga_006@kyz_0001",
		// 		s: [code]
		// 	}, (r) => {
		// 		if (r && r[0])
		// 			console.log("派出所主表 :", r);
		// 		this.policeDetail = r[0];
		// 	});

		// 	var querys = new Promise((rs, rj) => {
		// 		rs()
		// 	})
		// 	// querys.push( this.getFDBBCur( stn ) ); //收入当前------1
		// 	// querys.push( this.getFDBBData( stn, "1" ) ); //收入必保---2
		// 	// querys.push( this.getFDBBData( stn, "3" ) ); //收入奋斗---3
		// 	// querys.push( this.getLateTrain( stn ) ); //正晚点情况---4
		// 	// querys.push( this.getKlqk( stn ) ); //客流情况---5
		// 	// querys.push( this.getPostPerson( stn ) ); //出勤安排---6
		// 	Promise.all([querys]).then((arr) => {
		// 		const r = arr[0] || 0;
		// 		let btns = [];
		// 		btns.push(`<span class="jbqk" onClick="mapPCSInfoBtnClick('jbqk','${code}','${pcs_name}')">基本情况</span>`);
		// 		btns.push(`<span class="ldys" onClick="mapPCSInfoBtnClick('ldys','${code}','${pcs_name}')">两队一室</span>`);
		// 		btns.push(`<span class="zysj" onClick="mapPCSInfoBtnClick('zysj','${code}','${pcs_name}')">主要数据</span>`);
		// 		btns.push(`<span class="jlbs" onClick="mapPCSInfoBtnClick('jlbs','${code}','${pcs_name}')">警力部署</span>`);
		// 		btns = code === "" ? "" : btns.join("");
		// 		// const pic = "https://10.192.6.179:8443/stationImg/IISPWebYJYA/jssource/" + r[8];
		// 		const pic = C.ADDS.url_34_79 + "/JFLCMS/lc1/image/stn/" + code + ".jpg";
		// 		// const pic = "http://10.192.6.80:8080/IISPWebYJYA/jssource/" + r[8];
		// 		const fdbbDemo = '';//this.getFdbbDemo( arr[1], arr[2], arr[3] ); //奋斗必保收入
		// 		const lateDemo = '';//this.getLateDemo( arr[4] ); //正晚点情况
		// 		const ryapDemo = '';//this.getRyapDemo( arr[6] ); //人员安排情况
		// 		// const hrFlag = this.hasHspeedRailway( code ); //是否能点开客运看板
		// 		// const hrFlag = false; //是否能点开客运看板
		// 		// const hrDemo = hrFlag ? `class="top-left has-hr" ` : `class="top-left"`;
		// 		// const picEvent = hrFlag ? `onClick="mapPCSInfoBtnClick('hspeedRailway')"` : ``;
		// 		$vm.detailMarker.options.icon.options.html =
		// 			`<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(5px, 0px, 0px); bottom: 0px; left:-265px;cursor:default;">
		// 					<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
		// 					<div class="leaflet-popup-content-wrapper blue" style="background:rgba(255,255,255,.85)">
		// 						<div class="leaflet-popup-content no-padding marker-station-info" style="position:relative;width:630px;height: 346px;">
		// 							<div class="top">
		// 								<div class="top-left ga">
		// 								<div class="pic-mz"></div>
		// 									<div class="pic"><img src="${pic}"/></div>
		// 									<div class="text"><h3>${pcs_name}</h3>派出所</div>
		// 								</div>

		// 								<div class="top-right">
		// 									${fdbbDemo}
		// 									<div class="btns pcs">${btns}</div>
		// 								</div>
		// 							</div>
		// 							<div class="chart" id="stationInfoChartCon">
		// 								<div style="margin:15px">
		// 								${pcs_brief}
		// 								</div>
		// 							</div>
		// 							<div class="bottom" style="display:none;">
		// 								<div class="bottom-left">
		// 									<div class="tit-con">晚点情况</div>
		// 									${lateDemo}
		// 								</div>
		// 								<div class="bottom-right">
		// 									<div class="tit-con">人员安排情况<label>当前工作人数:${ryapDemo.num}人</label></div>
		// 									${ryapDemo.demo}
		// 								</div>
		// 							</div>
		// 						</div>
		// 					</div>
		// 					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
		// 					<div class="leaflet-popup-tip blue"></div></div>
		// 			   </div>`
		// 		$vm.detailMarker.refreshIconOptions();
		// 		setTimeout(() => {
		// 			// this.initChart( arr[5] );
		// 		}, 500);
		// 		console.log("展示消息框")
		// 	});
		// });
	},

	// 部署修改图片路径
	mapPCSInfoBtnClick(k, code, name, stncode) {
		if (k === "jbqk") {
			$vm.dialog.width = 700;
			$vm.dialog.height = 470;
			// $vm.dialog.src = "http://10.192.6.110:9090/TRDM"+this.policeDetail.PDF1;
			$vm.dialog.src = C.ADDS.url_34_79 + "/TRDM" + this.policeDetail.PDF1;
		} else if (k === "ldys") {
			$vm.dialog.width = 700;
			$vm.dialog.height = 470;
			// $vm.dialog.src = "http://10.192.6.110:9090/TRDM"+this.policeDetail.PDF2;
			$vm.dialog.src = C.ADDS.url_34_79 + "/TRDM" + this.policeDetail.PDF2;
		} else if (k === "zysj") {
			console.log()
			$vm.dialog.isComp = true;
			$vm.dialog.width = 700;
			$vm.dialog.height = 470;
			$vm.dialog.source = {
				code: code,
				// b:2
			};
			$vm.$nextTick(() => {
				$vm.dialog.component = resolve => { require(['../../../views/singleScreen/police/components/policeMainData.vue'], resolve) };
			})

		} else {
			$vm.dialog.isComp = true;
			$vm.dialog.width = 700;
			$vm.dialog.height = 470;
			$vm.dialog.source = {
				PICS: this.policeDetail.PICS,
				// b:2
			};
			$vm.dialog.component = resolve => { require(['../../../views/singleScreen/police/components/policeBS.vue'], resolve) };
		}
		$vm.dialog.title = name;
		$vm.dialog.visible = true;


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
