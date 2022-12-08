import C from '@/assets/com.js'
import keYun from "./keYun.js"
import station from "./stations.js"
import gongWu from "./gongWu.js"
import houQing from "./houQing.js"
import gongAnPcs from './gongAnPcs.js'

let $vm = null;

export default {
	data: {
		hasSingleLayer: false,
		SingleLayer:L.layerGroup(),

		layerRecipes: { // 工务 绘图参数
			dk: {                   // 道口
				type: 'marker',
				className: 'gongwu-icon-container',
				html: `<div class="marker-hover gongwu-marker sb_dk" style="position: relative" />`,
				lightHtml: `<div class="marker-hover gongwu-marker-light-ga sb_dk_light_ga" style="position: relative" />`
			},
			ksd1: {                 // I级防洪看守点
				type: 'marker',
				className: 'gongwu-icon-container',
				html: `<div class="marker-hover gongwu-marker sb_ksd1" style="position: relative" />`,
				lightHtml: `<div class="marker-hover gongwu-marker-light-ga sb_ksd1_light_ga" style="position: relative" />`
			},
			ksd2: {                 // II级防洪看守点
				type: 'marker',
				className: 'gongwu-icon-container',
				html: `<div class="marker-hover gongwu-marker sb_ksd2" style="position: relative" />`,
				lightHtml: `<div class="marker-hover gongwu-marker-light-ga sb_ksd2_light_ga" style="position: relative" />`
			},
			ksd3: {                 // III级防洪看守点
				type: 'markercluster',
				className: 'gongwu-icon-container',
				html: `<div class="marker-hover gongwu-marker sb_ksd3" style="position: relative" />`,
				lightHtml: `<div class="marker-hover gongwu-marker-light-ga sb_ksd3_light_ga" style="position: relative" />`
			},
			qx: {                   // 防洪抢险材料及机具
				type: 'marker',
				className: 'gongwu-icon-container',
				html: `<div class="marker-hover gongwu-marker sb_qx" style="position: relative" />`,
				lightHtml: `<div class="marker-hover gongwu-marker-light-ga sb_qx_light_ga" style="position: relative" />`
			},
		}
    },
		
	/**
	 * 初始化客运模块
	 * @param vmParam SuperMap实例
	 */
	init ( vmParam ) {
		if ($vm === null) {
			$vm = vmParam
		}
		// 绑定派出所详情中按钮点击事件
		// window.mapPCSInfoBtnClick = ( ty, code, name ) => this.mapPCSInfoBtnClick( ty, code, name );
	},

        

	/**
	 * 图层类别解析
	 * @param dataType 图层小类
	 * @returns {string} 图层名称
	 */
	decodeDataType ( dataType ) {
		switch (dataType) {
			case 'ky_sb_yl':
				return '医疗资源'
			case 'ky_sb_xf':
				return '消防资源'
			case 'ky_sb_pcs':
				return '派出所'
			case 'ky_sb_yjys':
				return '应急饮食'
			case 'ky_sb_fdwz':
				return '防冻物资'
			case 'ky_sb_yjsscs':
				return '应急疏散场所'
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
			case 'ky_sb_yl': {
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
			case 'ky_sb_pcs': {
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
	createKeYunLayer ( source = [],  subType = '' ) {
		if (this.hasSingleLayer) {
			$vm.map.removeLayer(this.SingleLayer);
			this.hasSingleLayer = false;
		} 
			if (source.length === 0 || subType === '') {
				return
			} else {
				console.log("进policecreateLayer了");
				this.SingleLayer = L.layerGroup();

				source.map( ( item ) => {
					// console.log(JSON.stringify(item))
					if (item.GPS_POINT_Y !== '' && item.GPS_POINT_X !== '') {
						let y = parseFloat(item.GPS_POINT_Y) + parseFloat(keYun.getKySbMarkerOffset(subType).y)
						let x = parseFloat(item.GPS_POINT_X) + parseFloat(keYun.getKySbMarkerOffset(subType).x)
						console.log(item.GPS_POINT_Y, item.GPS_POINT_X, y, x)
						let attr = JSON.stringify( item )
						attr = attr.replace( /"/g, '\'' )
						// console.log( attr )
						let marker = L.marker( {
							lat: y,
							lng: x
						}, {
							icon: L.divIcon( {
								className: 'marker-keyun-container',
								data: item,
								html: `<marker-container type="${ subType }" marker-data="${ attr }">`
							} )
						} )
						marker.on( 'click', ( p ) => {
							// 设置点击事件
							keYun.setMarkerClickHandler( subType, item, p )
						} )
						this.SingleLayer.addLayer( marker );
						$vm.map.addLayer( this.SingleLayer);
						
						this.hasSingleLayer = true
					}
				} )
			}
		
	},

	createPcsLayer ( source = [],  subType = '' ) {
		if (this.hasSingleLayer) {
			$vm.map.removeLayer(this.SingleLayer);
			this.hasSingleLayer = false;
		} 
			if (source.length === 0 || subType === '') {
				return
			} else {
				console.log("进policecreateLayer了");
				this.SingleLayer = L.layerGroup();

				source.map( ( item ) => {
					console.log("source.item",JSON.stringify(item))
					if (item.GPS_POINT_Y !== '' && item.GPS_POINT_X !== '') {
						let y = parseFloat(item.GPS_POINT_Y) + parseFloat(keYun.getKySbMarkerOffset(subType).y)
						let x = parseFloat(item.GPS_POINT_X) + parseFloat(keYun.getKySbMarkerOffset(subType).x)
						console.log(item.GPS_POINT_Y, item.GPS_POINT_X, y, x)
						let attr = JSON.stringify( item )
						let pcs_name = item.PCS_NAME;
						console.log("pcs_name ", pcs_name)
						attr = attr.replace( /"/g, '\'' )
						// console.log( attr )
						let marker = L.marker( {
							lat: y,
							lng: x
						}, {
							icon: L.divIcon( {
								className: 'marker-keyun-container',
								data: item,
								// 单独的marker样式
								html: `<marker-container type="single_marker" marker-data="${ pcs_name }" >`
							} )
						} )
						marker.on( 'click', ( p ) => {
							// 设置点击事件
							gongAnPcs.setMarkerClickHandler( subType, item, p )
						} )
						this.SingleLayer.addLayer( marker );
						$vm.map.addLayer( this.SingleLayer);
						
						this.hasSingleLayer = true
					}
				} )
			}
		
	},

	createStationLayer(source) {
		console.log("车站元素：source", source)
		if (this.hasSingleLayer) {
			$vm.map.removeLayer(this.SingleLayer);
			this.hasSingleLayer = false;
		} 
		
		this.SingleLayer = L.layerGroup()

		$vm.map.addLayer( this.SingleLayer );
		C.$.each( source, ( index, stn ) => {
			const marker = station.creatStationSingle( stn );
			this.SingleLayer.addLayer( marker );
		} );
		
		this.hasSingleLayer = true;
		
	},

	createGWLayer (ty, mainType, subType, source ) {
		console.log("ty subType==========", ty, subType)
		if (this.hasSingleLayer) {
			$vm.map.removeLayer(this.SingleLayer);
			this.hasSingleLayer = false;
		} 
		let qxRecipe = this.data.layerRecipes[subType]
		let group = L.layerGroup();
		
		
		switch (qxRecipe.type) {
			// case 'line' :
			// 	group = this.createLine( this.data.layerRecipes[subType], source, ty );
			// 	break;
			case 'marker':
				group = this.createMarker( this.data.layerRecipes[subType], source, ty );
				break;
			case 'markercluster' :
				group = this.createMarkerCluster( this.data.layerRecipes[subType], source, ty );
				break;
		}	
		this.SingleLayer = group;
		$vm.map.addLayer(this.SingleLayer);
		this.hasSingleLayer = true;
	},

	createMarker ( recipe, source, ty ) {
		console.log( '绘制marker', recipe, source )
		let group = L.layerGroup()
		source.map( ( item ) => {
				let y = parseFloat(item.GPS_POINT_Y)
			let x = parseFloat(item.GPS_POINT_X)
			let attr = JSON.stringify( item )
			attr = attr.replace( /"/g, '\'' )
			let marker = L.marker( {
				lat: y,
				lng: x
			}, {
				icon: L.divIcon( {
					className: recipe.className,
					data: item,
					// html: isLight ? recipe.lightHtml : recipe.html
					html: recipe.lightHtml
				} )
			} )
			marker.on( 'click', ( p ) => {
				gongWu.setMarkerClick( ty, item, p )
			} )

			group.addLayer( marker )
		} )
		return group
	},

	createMarkerCluster ( recipe, source, ty ) {
		console.log( '绘制markerCluster', recipe, source )
		let group = L.markerClusterGroup( {
			zoomToBoundsOnClick: true,
			maxClusterRadius: 20,
			iconCreateFunction: ( cluster ) => {
				return cluster.getAllChildMarkers()[0].options.icon
			}
		} )
		// let arr = ['1', '2', '3']
		source.map( ( item ) => {
			let y = parseFloat(item.GPS_POINT_Y)
			let x = parseFloat(item.GPS_POINT_X)
			let attr = JSON.stringify( item )
			attr = attr.replace( /"/g, '\'' )
			let marker = L.marker( {
				lat: y,
				lng: x
			}, {
				icon: L.divIcon( {
					className: recipe.className,
					data: item,
					// html: isLight ? recipe.lightHtml : recipe.html
					html: recipe.lightHtml
				} )
			} )
			marker.on( 'click', ( p ) => {
				gongWu.setMarkerClick( ty, item, p )
			} )
			group.addLayer( marker )
		} )
		return group
	},


	createXuexiaoLayer(source) {
		// let XuexiaoSingerLayer = L.layerGroup();
		if (this.hasSingleLayer) {
			$vm.map.removeLayer(this.SingleLayer);
			this.hasSingleLayer = false;
		} 
		this.SingleLayer = L.layerGroup();
		source.forEach(item => {
			let cls = "zhongxue";
			console.log("后勤_学校： item", item)
			if (item.SCHOOL_KIND === "小学") {
				cls = "xiaoxue";
			} 
			const marker = L.marker([item.SCHOOL_LAT, item.SCHOOL_LON], {
				icon: L.divIcon({
					className: "houqing-icon-container",
					data: item,
					html: `<div class="marker-hover houqing-marker ${cls}" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				houQing.setMarkerClick("学校", item, p);
			})
			this.SingleLayer.addLayer(marker);
			$vm.map.addLayer(this.SingleLayer);
			this.hasSingleLayer = true;
		});
	},

}
