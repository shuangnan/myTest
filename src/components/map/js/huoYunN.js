import com from '@/assets/com'

let $vm = null

let url = 'https://10.192.126.203/GeneralProServlet'

export default {
	data: {
		/**
		 * 有端式站台货物线
		 */
		hy_sbss_ydszthwx: {
			/**
			 * 是否勾选可见
			 */
			visible: false,
			/**
			 * 是否已缓存
			 */
			cached: false,
			/**
			 * marker图层
			 */
			layers: null,
			/**
			 * 资源源数据
			 */
			source: [],
			/**
			 * 应急资源查询接口
			 */
			api: 'tyzd_zxy2008',
			/**
			 * 查询接口传参
			 */
			sql: [
				{
					LINE_TYPE: '0'
				}
			],
			name: '有端式站台货物线',
			popperSize: {
				width: 450,
				height: 450
			}
		},
		/**
		 * 有侧面1.1m站台货物线
		 */
		hy_sbss_ycmzthwx: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2008',
			sql: [
				{
					LINE_TYPE: '1'
				}
			],
			name: '有侧面1.1m站台货物线',
			popperSize: {
				width: 450,
				height: 450
			}
		},
		/**
		 * 有端式站台的专用线线路
		 */
		hy_sbss_ydsztzyx: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2008',
			sql: [
				{
					LINE_TYPE: '2'
				}
			],
			name: '有端式站台的专用线线路',
			popperSize: {
				width: 450,
				height: 450
			}
		},
		/**
		 * 站段货装应急管理固话人员
		 */
		hy_sbss_zdhzyjry: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2009',
			name: '站段货装应急管理固话人员',
			popperSize: {
				width: 450,
				height: 450
			}
		},
		/**
		 * 应急装载站及常用加固材料
		 */
		hy_sbss_yjzzjgcl: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'eqeh_zxy2064',
			name: '应急装载站及常用加固材料',
			popperSize: {
				width: 700,
				height: 450
			}
		},
		/**
		 * 应急装卸劳力
		 */
		hy_sbss_yjzxll: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2011',
			name: '应急装卸劳力',
			popperSize: {
				width: 450,
				height: 300
			}
		},
		/**
		 * 路内应急抢险机械-挖掘机
		 */
		hy_sbss_wjj: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2012',
			sql: [
				{
					DW: 'all',
					WORK_STATION: 'all',
					MACHINE_NAME: '挖掘机'
				}
			],
			name: '挖掘机',
			popperSize: {
				width: 400,
				height: 300
			}
		},
		/**
		 * 路内应急抢险机械-装载机
		 */
		hy_sbss_zzj: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2012',
			sql: [
				{
					DW: 'all',
					WORK_STATION: 'all',
					MACHINE_NAME: '装载机'
				}
			],
			name: '装载机',
			popperSize: {
				width: 400,
				height: 300
			}
		},
		/**
		 * 路内应急抢险机械-汽车起重机
		 */
		hy_sbss_qzj: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2012',
			sql: [
				{
					DW: 'all',
					WORK_STATION: 'all',
					MACHINE_NAME: '汽车起重机'
				}
			],
			name: '汽车起重机',
			popperSize: {
				width: 400,
				height: 300
			}
		},
		/**
		 * 路外应急抢险机械
		 */
		hy_sbss_lwyjqxjx: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2013',
			name: '路外应急抢险机械',
			popperSize: {
				width: 450,
				height: 450
			}
		},
		/**
		 * 危险货运施救信息网络及应急资源
		 */
		hy_sbss_wxhyshwl: {
			visible: false,
			cached: false,
			layers: null,
			source: [],
			api: 'tyzd_zxy2014',
			name: '危险货运施救信息网络及应急资源',
			popperSize: {
				width: 550,
				height: 650
			}
		}
	},
	init(vm) {
		if ($vm === null) {
			$vm = vm
		}
		if (!$vm.config.hy_sbss.register) {
			return
		}
		for (let key in $vm.config.hy_sbss) {
			// this.data[key].visible = $vm.config.hy_sbss[key] || false
			if (this.data[key] !== undefined) {
				this.data[key].visible = $vm.config.hy_sbss[key]
			}
		}
		this.filterLayer()
		console.log('huoyunN', $vm)
	},
	filterLayer() {
		for (let key in this.data) {
			console.log(key, this.data[key].visible)
			if (this.data[key].visible) {
				if (!this.data[key].cached) {
					// 未缓存的先获取源数据
					this.getLayerSource(key).then((src) => {
						this.data[key].cached = true
						// 渲染图层
						this.renderMarkerLayers(src, key).then(() => {
							this.filterLayer()
						})
					})
				} else {
					$vm.map.addLayer(this.data[key].layers)
				}
			} else {
				if (this.data[key].layers) {
					$vm.map.removeLayer(this.data[key].layers)
				}
			}
		}
	},
	getLayerSource(type = '') {
		return new Promise((resolve, reject) => {
			if (type === '') {
				reject(false)
			}
			com.getData({
				c: this.data[type].api,
				s: this.data[type].sql || '',
				url: url
			}, (res) => {
				if (res.success) {
					resolve(res.data['1'])
				} else {
					reject(res.errorMessage)
				}
			})
		})
	},
	renderMarkerLayers(src = [], type = '') {
		return new Promise((resolve, reject) => {
			if (src.length === 0 || type === '') {
				reject(false)
			}
			try {
				let markerCluster = L.markerClusterGroup({
					zoomToBoundsOnClick: false,
					maxClusterRadius: 20,
					disableClusteringAtZoom: 10,
					iconCreateFunction: ( cluster ) => {
						return cluster.getAllChildMarkers()[0].options.icon
					}
				})
				// console.log(src)
				src.map((s) => {
					let m = this.renderSingleMarker(s, type)
					console.log(m)
					if (m !== undefined) {
						markerCluster.addLayer(m)
					}
				})
				this.data[type].layers = markerCluster
				resolve()
			} catch (e) {
				reject(e)
			}
			// $vm.map.addLayer(this.data[type].layers)
		})
	},
	renderSingleMarker(src = {}, type = '') {
		if (JSON.stringify(src) === '{}' || type === '') {
			return
		}
		if (src.GPS_POINT_Y === '' || src.GPS_POINT_X === '') {
			return
		}
		// console.log(src)
		let attrs = JSON.stringify(src).replace( /"/g, '\'' )
		let marker = L.marker({
			lng: parseFloat(src.GPS_POINT_X),
			lat: parseFloat(src.GPS_POINT_Y)
		}, {
			icon: L.divIcon({
				className: 'marker-huoyun-container',
				data: src,
				html: `<marker-container type="${type}" marker-data="${attrs}"></marker-container>`
			})
		})
		marker.on('click', (p) => {
			this.setClickPopper(src, type)
		})
		return marker
	},
	setClickPopper(src = [], type = '') {
		if (src.length === 0 || type === '') {
			return
		}
		if ($vm.drawFlag || $vm.rangingFlag) {
			return
		}
		$vm.detailMarker && $vm.detailMarker.remove()
		let attrs = JSON.stringify(src).replace( /"/g, '\'' )
		let size = this.data[type].popperSize
		let popper = L.divIcon( {
			className: 'detail-pop-container',
			iconSize: [10, 10],
			popupAnchor: [0, 0],
			html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${ 20 }px, ${ size.height - 40 }px, 0px); bottom: 0px;">
					<a class="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class="leaflet-popup-content-wrapper marker-houqing-info-popup">
						<div class="leaflet-popup-content no-padding" style="position:relative;width:${ size.width }px;height: ${size.height }px;">
							<i class="${ 'marker-huoyun-info-tip ' + type }"></i>
							<popper-container type="${ type }" popper-data="${ attrs }" popper-width="${size.width}" popper-height="${size.height}"></popper-container>
						</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
			   </div>`
		} )
		$vm.detailMarker = L.marker( {
			lat: parseFloat(src.GPS_POINT_Y),
			lng: parseFloat(src.GPS_POINT_X)
		}, {
			icon: popper
		} ).addTo( $vm.map )
	}
}
