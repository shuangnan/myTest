import C from '@/assets/com.js'

let $vm = null;

export default {
	getDataFlag_getGddRange: false, // 是否已调用获取管界接口
	data: {
		// 渲染的图层
		layers: {
			// 电务-设备设施
			dw_sb: {
				dw_gdsb: null,    // 轨道设备
				dw_lksb: null,    // 列控设备
				dw_4g: null,      // 4G应急通信设备
				dw_lksb_w: null,  // 有源应答器
				dw_dccxsb: null,  // 无源应答器
				dw_xhj: null,     // 信号机
				dw_dx: null,      // 道岔
				dw_bpbl: null,    // 备品备料
			}
		},
		// 图层显隐控制
		configs: {
			// 电务-设备设施
			dw_sb: {
				dw_gdsb: null,    // 轨道设备
				dw_lksb: null,    // 列控设备
				dw_4g: null,      // 4G应急通信设备
				dw_lksb_w: null,  // 无源应答器
				dw_dccxsb: null,  // 有源应答器
				dw_xhj: null,     // 信号机
				dw_dx: null,      // 道岔
				dw_bpbl: null,    // 备品备料
			},
		},
		dianWuLayers: {
			dw_fw: {
				dwd:[]
			}
		},
		dianWuOther:{
			// 电务-管辖范围
			dw_fw:{
				dwd:false
			}
		}
	},
	/**
	 * 初始化电务模块
	 * @param vmParam SuperMap实例
	 */
	init ( vmParam ) {
		if ($vm === null) {
			$vm = vmParam
		}
		// 地图实例中未注册电务模块停止初始化
		if (!$vm.config.dw_sb.register&&!$vm.config.dw_fw.register) {
			return
		}
		// 获取地图实例中电务模块配置
		for (let key in this.data.configs) {
			for (let sub in this.data.configs[key]) {
				this.data.configs[key][sub] = $vm.config[key][sub]
				if ($vm.config[key][sub]) {
					// 设置默认显示的在初始化时获取数据并生成图层
					this.getData( sub ).then( ( arr ) => {
						this.createLayer( arr, key, sub )
					} )
				}
			}
		}
		// 默认显示电务系统管辖范围时，加载管界数据
		if ($vm.config.dw_fw.register && this.data.dianWuOther.dw_fw.dwd) {
			this.getData_fw()
		}
	},
	/**
	 * 图层显示控制
	 * @param mainType 图层大类
	 * @param subType  图层小类
	 */
	filterLayer ( mainType = '', subType = '' ) {

		if (mainType === '' || subType === '') {
			return
		}
		console.log(mainType, subType)
		if(mainType=== "电务_电务段"){
			/**
			 * 显示供电系统管界范围
			 * by cpy, 2022-08-19
			 */
			if (this.data.dianWuOther.dw_fw.dwd) {
				if (!this.getDataFlag_getGddRange) {
					// 未获取管界数据时先获取数据
					this.getData_fw()
					return;
				}
				// 筛选选定的单位管界
				this.data.dianWuLayers.dw_fw.dwd.map((layer) => {
					if (layer.show) {
						$vm.map.addLayer(layer.layer)
						$vm.map.addLayer(layer.nameLayer)
					} else {
						$vm.map.removeLayer(layer.layer)
						$vm.map.removeLayer(layer.nameLayer)
					}
				})
			} else {
				this.data.dianWuLayers.dw_fw.dwd.map((layer) => {
					$vm.map.removeLayer(layer.layer)
					$vm.map.removeLayer(layer.nameLayer)
				})
			}
			return;
		}
		// 同步筛选面板的选择值
		this.data.configs[mainType][subType] = $vm.config[mainType][subType]
		if (this.data.configs[mainType][subType]) {
			// 选择显示
			if (this.data.layers[mainType][subType] === null) {
				// 图层未生成，获取数据加载图层并显示
				this.getData( subType ).then( ( arr ) => {
					this.createLayer( arr, mainType, subType )
				} )
			} else {
				$vm.map.addLayer( this.data.layers[mainType][subType] )
			}
		} else {
			// 选择不显示
			$vm.map.removeLayer( this.data.layers[mainType][subType] )
		}
	},
	/**
	 * 获取指定类型图层数据
	 * @param dataType 图层小类
	 */
	getData ( dataType = '' ) {
		if (dataType === '') {
			return
		} else {
			return new Promise( ( resolve, reject ) => {
				C.getData( this.decodeDataTypeApi( dataType ), ( res ) => {
					if (res.success) {
						if (dataType === 'dw_lksb') {
							// 有源应答器
							resolve( res.data['1'].filter((r) => {
								return JSON.stringify(r).includes('有源')
							}) )
						} else if (dataType === 'dw_lksb_w') {
							// 无源应答器
							resolve( res.data['1'].filter((r) => {
								return JSON.stringify(r).includes('无源')
							}) )
						} else {
							resolve( res.data['1'] )
						}
					} else {
						reject( '获取' + this.decodeDataType( dataType ) + '失败' )
						$vm.$message.error( '获取' + this.decodeDataType( dataType ) + '失败' )
					}
				} )
			} )
		}
	},
	/**
	 * 图层类别解析
	 * @param dataType 图层小类
	 * @returns {string} 图层名称
	 */
	decodeDataType ( dataType ) {
		switch (dataType) {
			case 'dw_gdsb':
				return '轨道电路设备'
			case 'dw_lksb':
				return '有源列控设备'
			case 'dw_4g':
				return '4G应急通信设备'
			case 'dw_lksb_w':
				return '无源列控设备'
			case 'dw_dccxsb':
				return '道岔除雪设备'
			case 'dw_xhj':
				return '信号机'
			case 'dw_dx':
				return '道岔'
			case 'dw_bpbl':
				return '备品备料'
		}
	},
	/**
	 * 获取图层查询接口
	 * @param dataType 图层小类
	 * @returns {{c: string, url: string}|{}} 接口调用JSON
	 */
	decodeDataTypeApi ( dataType ) {
		let url = 'https://10.192.34.79/ky203/GeneralProServlet'
		switch (dataType) {
			case 'dw_gdsb': {
				return {
					c: 'eqeh_zxy2046',
					s: [['0']],
					url: url,
				}
			}
			case 'dw_4g': {
				return {
					c: 'eqeh_zxy2050',
					url: url
				}
			}
			case 'dw_lksb': {
				return {
					c: 'eqeh_zxy2052',
					url: url,
				}
			}
			case 'dw_lksb_w': {
				return {
					c: 'eqeh_zxy2052',
					url: url,
				}
			}
			case 'dw_dccxsb': {
				return {
					c: 'tyzd_zxy2033',
					s: [{
            LINE_NAME: 'all',
            DEPOT: 'all',
            STATION: 'all',
            PSB_NO: 'all',
            CONTROL_NAME: 'all',
            CONTROL_NO: 'all'
          }],
					url: url
				}
			}
			case 'dw_xhj':
				return {
					c: 'eqeh_zxy2046',
					s: [['2']],
					url: url
				}
			case 'dw_dx':
				return {
					c: 'eqeh_zxy2046',
					s: [['3']],
					url: url
				}
			case 'dw_bpbl':
				return {
					c: 'eqeh_zxy2071',
					url: url
				}
			default:
				return {}
		}
	},
	/**
	 * 创建图层
	 * @param source   图层源数据
	 * @param mainType 图层大类
	 * @param subType  图层小类
	 */
	createLayer ( source = [], mainType = '', subType = '' ) {
		if (source.length === 0 || mainType === '' || subType === '') {
			return
		} else {
			let layerGroup = L.markerClusterGroup( {
				zoomToBoundsOnClick: true,
				maxClusterRadius: 20,
				iconCreateFunction: ( cluster ) => {
					return cluster.getAllChildMarkers()[0].options.icon
				}
			} )
			source.map( ( item ) => {
				// console.log(JSON.stringify(item))
				let attr = JSON.stringify( item )
				attr = attr.replace( /"/g, '\'' )
				console.log( attr )
				let marker = L.marker( {
					lat: item.LAT === undefined ? item.GPS_POINT_Y : item.LAT,
					lng: item.LON === undefined ? item.GPS_POINT_X : item.LON
				}, {
					icon: L.divIcon( {
						className: 'marker-dianwu-container',
						data: item,
						html: `<marker-container type="${ subType }" marker-data="${ attr }">`
					} )
				} )
				marker.on( 'click', ( p ) => {
					// 设置点击事件
					this.setMarkerClickHandler( subType, item, p )
				} )
				layerGroup.addLayer( marker )
			} )
			this.data.layers[mainType][subType] = layerGroup
			this.filterLayer( mainType, subType )
		}
	},
	/**
	 * 为图层中marker设置点击事件
	 * @param subType 图层小类
	 * @param item    图层marker数据
	 * @param p       点击事件Event
	 */
	setMarkerClickHandler ( subType = '', item, p ) {
		if (subType === '') {
			return
		} else {
			if ($vm.drawFlag || $vm.rangingFlag) return
			$vm.detailMarker && $vm.detailMarker.remove()
			console.log( '显示详情', item )
			let attr = JSON.stringify( item )
			attr = attr.replace( /"/g, '\'' )
			let size = this.getPopperSize(subType)
			// Popper弹框图层
			let popper = L.divIcon( {
				className: 'detail-pop-container',
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${ 20 }px, ${ size.height - 40 }px, 0px); bottom: 0px;">
					<a class="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class="leaflet-popup-content-wrapper marker-houqing-info-popup">
						<div class="leaflet-popup-content no-padding" style="position:relative;width:${ size.width }px;height: ${size.height }px;">
							<i class="${ 'marker-dianwu-info-tip ' + subType }"></i>
							<popper-container type="${ subType }" popper-data="${ attr }" popper-width="${size.width}" popper-height="${size.height}"></popper-container>
						</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
			   </div>`
			} )
			$vm.detailMarker = L.marker( {
				lat: item.LAT === undefined ? item.GPS_POINT_Y : item.LAT,
				lng: item.LON === undefined ? item.GPS_POINT_X : item.LON
			}, {
				icon: popper
			} ).addTo( $vm.map )
		}
	},
	getPopperSize(subType = '') {
		if (subType === '') {
			return
		}
		switch (subType) {
			case 'dw_gdsb': {
				return {
					width: 350,
					height: 250
				}
			}
			case 'dw_4g': {
				return {
					width: 350,
					height: 400
				}
			}
			case 'dw_lksb': {
				return {
					width: 350,
					height: 250
				}
			}
			case 'dw_lksb_w': {
				return {
					width: 350,
					height: 250
				}
			}
			case 'dw_dccxsb': {
				return {
					width: 350,
					height: 300
				}
			}
			case 'dw_xhj': {
				return {
					width: 350,
					height: 300
				}
			}
			case 'dw_dx': {
				return {
					width: 350,
					height: 300
				}
			}
			case 'dw_bpbl': {
				return {
					width: 550,
					height: 400
				}
			}
		}
	},
	/**
	 * 获取管辖范围信息
	 */
	getData_fw () {
		/**
		 * 供电系统单位字典
		 * @type {[{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},null,null,null]}
		 */
		const gddList = [
			{
				oid: '19B8C3534E075665E0539106C00A58FD',  // 单位Oid
				oname: '成都电务段',                       // 单位名
				fill: '#9900CC'                           // 管界范围图例颜色
			},
			{
				oid: '19B9D8D920DC589FE0539106C00A1189',
				oname: '达州电务段',
				fill: '#CC0033'
			},
			{
				oid: '19B8C3534E175665E0539106C00A58FD',
				oname: '重庆电务段',
				fill: '#CC9900'
			},
			{
				oid: '19B8C3534E3A5665E0539106C00A58FD',
				oname: '贵阳电务段',
				fill: '#cc6108'
			},
			{
				oid: '99990002001499A20007',
				oname: '成都电务维修段',
				fill: '#bcaccc'
			},
			{
				oid: '99990002001499A10010',
				oname: '重庆工电段',
				fill: '#0099CC'
			},
			{
				oid: '99990002001499A10012',
				oname: '宜宾工电段',
				fill: '#CC0099'
			},
			{
				oid: '99990002001499A10013',
				oname: '六盘水工电段',
				fill: '#47ffce'
			},
			{
				oid: '99990002001499A10015',
				oname: '西昌工电段',
				fill: '#FF6947'
			}
		]

		let getRangePromises = []
		gddList.map((gdd) => {
			getRangePromises.push(new Promise((resolve, reject) => {
				C.getData({
					c: 'trdm_lv_692',
					s: [gdd.oid, '1'],
					async: true,
					url: 'https://10.192.34.79/TRDM/GeneralProServlet'
				}, (res) => {
					console.log(`获取${gdd.oname}管辖范围`, res)
					resolve({
						oname: gdd.oname,
						range: res,
						fill: gdd.fill
					})
				})
			}))
		})
		// 获取所有单位管界
		Promise.all(getRangePromises).then((res) => {
			this.getDataFlag_getGddRange = true
			console.log('获取电务系统管辖范围', res)
			let renderPromise = []
			res.map((oRange) => {
				renderPromise.push(this.renderGddRange(oRange))
			})
			// 绘制所有单位管界多边形
			Promise.all(renderPromise).then((layers) => {
				this.data.dianWuLayers.dw_fw.dwd = layers
				this.filterLayer('电务_电务段','电务_电务段')
			})
		})
	},
	/**
	 * 绘制供电系统单位管界多边形
	 * @param range
	 * @returns {Promise}
	 */
	renderGddRange(range = {oname: '', range: [], fill: ''}) {
		return new Promise((resolve, reject) => {
			let rangePts = range.range
			let pts = []
			let groupList = []
			rangePts.forEach(v => {
				if (!groupList.includes(v.AREA_NUM)) {
					groupList.push(v.AREA_NUM)
				}
			})
			groupList.forEach(t => {
				let rowList = []
				rangePts.forEach(v => {
					if (v.AREA_NUM == t) {
						rowList.push([v.AREA_X, v.AREA_Y])
					}
				})
				pts.push(rowList)
			})
			let polygonLayer = new L.Polygon(pts, {
				color: range.fill,
				fillColor: range.fill
			})
			if (pts.length === 0) {
				resolve({
					...range,
					layer: L.layerGroup(),
					nameLayer: L.layerGroup(),
					show: false
				})
			}
			let unitnamePt = this.getRectCenterPt(pts.length === 0 ? [[]] : pts[0])
			console.log('管界范围中心点', unitnamePt)
			let unitname = L.marker(unitnamePt, {
				icon: L.divIcon({
					className: 'range-center-name',
					html: `<span style="font-weight: bold; font-size: 20px; color: ${range.fill}; -webkit-text-stroke: 0.25px rgba(255, 255, 255, 0.4)">${ range.oname }</span>`
				})
			})
			resolve({
				...range,
				layer: polygonLayer,
				nameLayer: unitname,
				show: false
			})
		})
	},
	getRectCenterPt(pts) {
		let xDic = []
		let yDic = []
		pts.map((p) => {
			xDic.push(p[1])
			yDic.push(p[0])
		})
		// console.log(xDic, yDic)
		xDic = xDic.sort((a, b) => {
			return parseFloat(a) - parseFloat(b)
		})
		yDic = yDic.sort((a, b) => {
			return parseFloat(a) - parseFloat(b)
		})
		let xMin = xDic[0]
		let xMax = xDic[xDic.length - 1]
		let yMin = yDic[0]
		let yMax = yDic[yDic.length - 1]
		let centerX = (parseFloat(xMin) + parseFloat(xMax)) / 2
		let centerY = (parseFloat(yMin) + parseFloat(yMax)) / 2
		return [centerY, centerX]
	},
}
