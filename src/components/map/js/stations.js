/**
 * 车站
 */
import C from "../../../assets/com.js";
import weiXinUrl from "../../../assets/map/weixingdituData.js"
let $vm = null;
const isPolice = window.location.pathname.includes("/police.html")
export default {
	getDataFlag: false, // 是否已调用接口
	pages: {
		// zx: "http://10.192.6.80:8080/IISPWebYJYA/zxsource/@stncode@.pdf", //站细
		// xc: "http://10.192.6.80:8080/IISPWeb/StatiBusi/stsNowCarAll.html?cbshow=1&cz=@stncode@", //车站现车
		// syt: "http://10.192.34.175:9090/map-html5/mapView/mapView.html?khbz=h&zmlm=@stncode@", //站场示意图
		// sp: "http://10.192.6.156:9090/PTMS/Views/video/easyVideoCz.html?StnCode=@stncode@", //车站视频

		// 天津客运段使用???
		// syt: "https://10.192.6.179:8175/map-html5/mapView/mapView.html?khbz=h&zmlm=@stncode@", //站场示意图
		// // sp: "https://10.192.6.179:8443/ky6156/PTMS/Views/video/easyVideoCz.html?StnCode=@stncode@", //车站视频
		// sp: "https://10.192.34.79/JFLCMS/vue/index2.html#/JKVideo?type=1&Oid=@Oid@&UserPID=@UserPID@&searchText=", //车站视频
		// zx: "https://10.192.34.79/stationImg/IISPWebYJYA/zxsource/@stncode@.pdf", //站细
		// xc: "https://10.192.34.79/stationImg/IISPWeb/StatiBusi/stsNowCarAll.html?cbshow=1&cz=@stncode@", //车站现车
		// yj: "https://10.192.34.79/JFLCMS/vue/#/yjyatsb_tab?StnCode=@stncode@", //应急预案
		// zht: "https://10.192.125.61/gddl/#/wd?stnCode=@stncode@", //站内综合图


		syt: "https://10.192.6.179:8175/map-html5/mapView/mapView.html?khbz=h&zmlm=@stncode@", //站场示意图
		// sp: "https://10.192.6.179:8443/ky6156/PTMS/Views/video/easyVideoCz.html?StnCode=@stncode@", //车站视频
		sp: "http://10.192.34.79/JFLCMS/vue/index2.html#/JKVideo?type=1&Oid=@Oid@&UserPID=@UserPID@&searchText=", //车站视频
		zx: "https://10.192.6.179:8443/stationImg/IISPWebYJYA/zxsource/@stncode@.pdf", //站细
		xc: "https://10.192.6.179:8443/stationImg/IISPWeb/StatiBusi/stsNowCarAll.html?cbshow=1&cz=@stncode@", //车站现车
		yj: "https://10.192.34.79/JFLCMS/vue/#/yjyatsb_tab?StnCode=@stncode@", //应急预案
		zht: "https://10.192.125.61/gddl/#/wd?stnCode=@stncode@", //站内综合图
	},
	stationUrl: "https://10.192.34.79/JFLCMS/vue/#/HSPEED_RAILWAY?type=1&stime=-6&etime=30&UserName=@UserName@&UserPID=@UserPID@&Oid=99990002001499A50004&DepId=23012134BF4A1580E053BC04C00A22C4&StnCode=@StnCode@",
	allStations: [], //全部车站
	boundStationsK: [], //管内客车
	boundStationsH: [], //管内货车
	boundStationsKH: [],  // 客货站
	boundStationsN: [], // 非营业站
	otherStationsK: [], //管外客车
	otherStationsH: [], //管外货车
	data: {
		stationLayer: null,
		stationOther: {
			boundK: false, //管内客站
			boundH: false, //管内货站
			boundKH: false,
			boundN: false,
			boundAll: false,
		},
	},
	policeDetail:{},


	init ( vmParam ) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.station.register) {
			return;
		}
		// 设置默认值
		this.data.stationOther.boundK = $vm.config.station.ck_boundK;
		this.data.stationOther.boundH = $vm.config.station.ck_boundH;
		this.data.stationOther.boundKH = $vm.config.station.ck_boundKH
		this.data.stationOther.boundN = $vm.config.station.ck_boundN
		this.data.stationOther.boundAll = $vm.config.station.ck_boundAll
		if (this.data.stationOther.boundAll) {
			$vm.showAllStns = true
		}
		// 绑定车站详情中按钮点击事件
		window.mapStationInfoBtnClick = ( ty, code, name ) => this.mapStationInfoBtnClick( ty, code, name );
		this.initData();
	},
	// 初始化数据
	initData () {
		if (this.data.stationOther.boundK ||
				this.data.stationOther.boundH || this.data.stationOther.boundKH || this.data.stationOther.boundN) {
			this.getStations();
		} else if (this.data.stationOther.boundAll) {
			this.getStations(false, true)
		}
	},
	// 地图点击事件
	handleMapClick ( e ) {
	},
	// 过滤图层元素
	filterLayer ( all = false ) {
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getStations( false, all );
			return;
		}
		let stations = [];
		if (all === false) {
			if (this.data.stationOther.boundK) {
				stations = stations.concat( this.boundStationsK );
			}
			if (this.data.stationOther.boundH) {
				stations = stations.concat( this.boundStationsH );
			}
			if (this.data.stationOther.boundKH) {
				stations = stations.concat( this.boundStationsKH )
			}
			if (this.data.stationOther.boundN) {
				stations = stations.concat( this.boundStationsN )
			}
		} else if (all === true) {
			stations = this.allStations.filter( ( station ) => {
				return station.BUREAU === '成都铁路局'
			} )
		} else if (all === 'clear') {
			stations = []
		}
		console.log("SSSSSSSSSSSSSSSSSSstation:", stations)
		this.creatStation( stations );
	},
	// 创建车站marker
	creatStation ( source ) {
		//初始下图标集合图层
		this.data.stationLayer && $vm.map.removeLayer( this.data.stationLayer );
		this.data.stationLayer = L.markerClusterGroup( {
			zoomToBoundsOnClick: false, //点击集聚区域,是否缩放到全部显示层
			maxClusterRadius: 20,
			disableClusteringAtZoom: 10, //8层及以后不集聚
			// 集聚图标
			iconCreateFunction: ( cluster ) => {
				return cluster.getAllChildMarkers()[0].options.icon
			}
		} );
		$vm.map.addLayer( this.data.stationLayer );
		C.$.each( source, ( index, stn ) => {
			const marker = this.creatStationSingle( stn );
			this.data.stationLayer.addLayer( marker );
		} );
	},
	createStationsWithColor(source) {
		this.data.stationLayer && $vm.map.removeLayer( this.data.stationLayer );
		this.data.stationLayer = L.markerClusterGroup( {
			zoomToBoundsOnClick: false, //点击集聚区域,是否缩放到全部显示层
			maxClusterRadius: 20,
			disableClusteringAtZoom: 10, //8层及以后不集聚
			// 集聚图标
			iconCreateFunction: ( cluster ) => {
				return cluster.getAllChildMarkers()[0].options.icon
			}
		} );
		$vm.map.addLayer( this.data.stationLayer );
		C.$.each( source, ( index, stn ) => {
			const marker = this.creatStationSingleWithColor( stn, stn.COLOR );
			this.data.stationLayer.addLayer( marker );
		} );
		$vm.map.setView([source[source.length - 1].GPS_POINT_Y, source[source.length - 1].GPS_POINT_X], 8)
	},
	// 创建单个车站marker
	creatStationSingle ( stn, color = '' ) {
		// let img = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAADU0lEQVQ4jZVUXWgTWRj92iQziZ00k2TTpNpJk9YY3bXUn4qkrJa1rCD+vIguS10VQRBBUBeU7rKLPw+l4s+DIvooVBZExd1Vi6zGYjVqjYLFmjTZprGTVG3GZppMMplJ0sgXGqlVEO/LfPdwz+HMd893ywqFAsxYKgBYAAA2ADAAgBoAMgAwDgBhAPABQHY6RTlDwAEArn3dQ/PdIb5qZEKiUnJeVUEoslYdKayqo8dOran3A8BDAAiWSNOdNHX2suu6no8xg1yaptVK5YWNzsbV9Xqre5hn2/8b9vW/SaWc38zitzRWsQdXMNcBwDtdxNHZy7YdfxBxZnKT6s7V9nnbFpkdFYRClZTyMkUoiLIyAM9I4nXbZf9TQc4L+5trAu0rmS50hCLYg58bzjxtCfMZQ8+ORtciS0VV1/OxwAlPJOSPpUWbXk3+2lxj37HE4mQnJKHp3LOeai3xbmBPUy8A/FUOAM4Dt0JO/IWjrbb6pbMp82+3w96dfwcGUABthuMZac+N//1br/o9tTRZeXhVbX3wnUgfuBXCHjpQxHYnxJvw8ObvTLZBLh0/5YmwaL/ZWlm5aaHJhF/cXxngYtif9U6jFc9P8Wx4O/pIQqIQrNYS2ke+RAjrg98ztiOttiWlrp/tG3259+aQ3xsV4j/Y6RrE2Ikiz4BO1EkpTyA4LmZFM0VgLsDPiUI0ISWxjqWyYoATi7VxlpLI5CZzWAtykUeiiEQRChnBu8P86LI5WrNdr1Zf83Hc1iuDfYjvvh58crZvNKpRlZevnWeo8UaTMcSneBKKjDM6UkDwaM9IMDdZmLz007fLTBUqlS+WTiM+HM+Ieo1S2f1Lw3ILRVB/ul9haoHRkSnko0i4tY4uKiNp1z/Bxw6jhl7jMBi5dLYY72y+UFhRq9Ohy9OPRwcesYkE4q119BjyP+Rk4RlvS4AT6akGE28EWd6+2FJ9foPDdew+23/I/WpISyoUcTFX7Mdco4Z/OZWTD4ntuMe2nfREnC5Ga+n40d7A6NRUJakgS7eTkvPZ10lZ+MMdfnF7iI/udc0J/N5ivQgAgY9mp+Meu+5i/1um5Ohzy2HU8FsazZH2lcy/M2fnkym+E+KrMAdfO8WlVXpP7BjEL74nAPAed7iO53pO5LYAAAAASUVORK5CYII=")`
		let marker = L.marker( {
			lon: stn.GPS_POINT_X,
			lat: stn.GPS_POINT_Y
		}, {
			icon: L.divIcon( {
				iconSize: [100, 50],
				className: "station-icon-container",
				data: stn,
				html: isPolice?(`<div id="station_${ stn.STN_CODE }" title="${ stn.STN_NAME }" class="${ $vm.sys } marker-hover station-marker ga K" style="position:relative;" ></div>
							 <span class="station-icon-station-name" style="display: ${ $vm.config.superMap.zoom >= 10 ? 'block' : 'none' }; color: ${ stn.COLLECT_FLAG === '1' ? '#FFD500' : 'white' }"></span>`):
							 (`<div id="station_${ stn.STN_CODE }" title="${ stn.STN_NAME }" class="${ $vm.sys } marker-hover station-marker K" style="position:relative;" ></div>
							 <span class="station-icon-station-name" style="display: ${ $vm.config.superMap.zoom >= 10 ? 'block' : 'none' }; color: ${ stn.COLLECT_FLAG === '1' ? '#FFD500' : 'white' }"></span>`),
			} )
		} );
		marker.on( "click", ( p ) => {
			// 应急响应指挥中心
			if ($vm.sys === "yjxy") {
				this.setStationMarkerClick_yjxy( p );
			} else {
				this.setStationMarkerClick( p );
			}
		} );
		return marker;
	},
	creatStationSingleWithColor ( stn, color = '' ) {
		let img = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAADU0lEQVQ4jZVUXWgTWRj92iQziZ00k2TTpNpJk9YY3bXUn4qkrJa1rCD+vIguS10VQRBBUBeU7rKLPw+l4s+DIvooVBZExd1Vi6zGYjVqjYLFmjTZprGTVG3GZppMMplJ0sgXGqlVEO/LfPdwz+HMd893ywqFAsxYKgBYAAA2ADAAgBoAMgAwDgBhAPABQHY6RTlDwAEArn3dQ/PdIb5qZEKiUnJeVUEoslYdKayqo8dOran3A8BDAAiWSNOdNHX2suu6no8xg1yaptVK5YWNzsbV9Xqre5hn2/8b9vW/SaWc38zitzRWsQdXMNcBwDtdxNHZy7YdfxBxZnKT6s7V9nnbFpkdFYRClZTyMkUoiLIyAM9I4nXbZf9TQc4L+5trAu0rmS50hCLYg58bzjxtCfMZQ8+ORtciS0VV1/OxwAlPJOSPpUWbXk3+2lxj37HE4mQnJKHp3LOeai3xbmBPUy8A/FUOAM4Dt0JO/IWjrbb6pbMp82+3w96dfwcGUABthuMZac+N//1br/o9tTRZeXhVbX3wnUgfuBXCHjpQxHYnxJvw8ObvTLZBLh0/5YmwaL/ZWlm5aaHJhF/cXxngYtif9U6jFc9P8Wx4O/pIQqIQrNYS2ke+RAjrg98ztiOttiWlrp/tG3259+aQ3xsV4j/Y6RrE2Ikiz4BO1EkpTyA4LmZFM0VgLsDPiUI0ISWxjqWyYoATi7VxlpLI5CZzWAtykUeiiEQRChnBu8P86LI5WrNdr1Zf83Hc1iuDfYjvvh58crZvNKpRlZevnWeo8UaTMcSneBKKjDM6UkDwaM9IMDdZmLz007fLTBUqlS+WTiM+HM+Ieo1S2f1Lw3ILRVB/ul9haoHRkSnko0i4tY4uKiNp1z/Bxw6jhl7jMBi5dLYY72y+UFhRq9Ohy9OPRwcesYkE4q119BjyP+Rk4RlvS4AT6akGE28EWd6+2FJ9foPDdew+23/I/WpISyoUcTFX7Mdco4Z/OZWTD4ntuMe2nfREnC5Ga+n40d7A6NRUJakgS7eTkvPZ10lZ+MMdfnF7iI/udc0J/N5ivQgAgY9mp+Meu+5i/1um5Ohzy2HU8FsazZH2lcy/M2fnkym+E+KrMAdfO8WlVXpP7BjEL74nAPAed7iO53pO5LYAAAAASUVORK5CYII=)'
		// let img = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAADU0lEQVQ4jZVUXWgTWRj92iQziZ00k2TTpNpJk9YY3bXUn4qkrJa1rCD+vIguS10VQRBBUBeU7rKLPw+l4s+DIvooVBZExd1Vi6zGYjVqjYLFmjTZprGTVG3GZppMMplJ0sgXGqlVEO/LfPdwz+HMd893ywqFAsxYKgBYAAA2ADAAgBoAMgAwDgBhAPABQHY6RTlDwAEArn3dQ/PdIb5qZEKiUnJeVUEoslYdKayqo8dOran3A8BDAAiWSNOdNHX2suu6no8xg1yaptVK5YWNzsbV9Xqre5hn2/8b9vW/SaWc38zitzRWsQdXMNcBwDtdxNHZy7YdfxBxZnKT6s7V9nnbFpkdFYRClZTyMkUoiLIyAM9I4nXbZf9TQc4L+5trAu0rmS50hCLYg58bzjxtCfMZQ8+ORtciS0VV1/OxwAlPJOSPpUWbXk3+2lxj37HE4mQnJKHp3LOeai3xbmBPUy8A/FUOAM4Dt0JO/IWjrbb6pbMp82+3w96dfwcGUABthuMZac+N//1br/o9tTRZeXhVbX3wnUgfuBXCHjpQxHYnxJvw8ObvTLZBLh0/5YmwaL/ZWlm5aaHJhF/cXxngYtif9U6jFc9P8Wx4O/pIQqIQrNYS2ke+RAjrg98ztiOttiWlrp/tG3259+aQ3xsV4j/Y6RrE2Ikiz4BO1EkpTyA4LmZFM0VgLsDPiUI0ISWxjqWyYoATi7VxlpLI5CZzWAtykUeiiEQRChnBu8P86LI5WrNdr1Zf83Hc1iuDfYjvvh58crZvNKpRlZevnWeo8UaTMcSneBKKjDM6UkDwaM9IMDdZmLz007fLTBUqlS+WTiM+HM+Ieo1S2f1Lw3ILRVB/ul9haoHRkSnko0i4tY4uKiNp1z/Bxw6jhl7jMBi5dLYY72y+UFhRq9Ohy9OPRwcesYkE4q119BjyP+Rk4RlvS4AT6akGE28EWd6+2FJ9foPDdew+23/I/WpISyoUcTFX7Mdco4Z/OZWTD4ntuMe2nfREnC5Ga+n40d7A6NRUJakgS7eTkvPZ10lZ+MMdfnF7iI/udc0J/N5ivQgAgY9mp+Meu+5i/1um5Ohzy2HU8FsazZH2lcy/M2fnkym+E+KrMAdfO8WlVXpP7BjEL74nAPAed7iO53pO5LYAAAAASUVORK5CYII=")`
		let marker = L.marker( {
			lon: stn.GPS_POINT_X,
			lat: stn.GPS_POINT_Y
		}, {
			icon: L.divIcon( {
				iconSize: [100, 50],
				className: "station-icon-container",
				data: stn,
				html: `<div id="station_${ stn.STN_CODE }" title="${ stn.STN_NAME }" class="${ $vm.sys } marker-hover station-marker" style="position:relative; background-image: ${img + ',linear-gradient(' + color + ',' + color + ')'}; background-repeat: no-repeat; background-size: 100% 100%; background-blend-mode: lighten; border-radius: 20px"></div>
							 <span class="station-icon-station-name" style="display: ${ $vm.config.superMap.zoom >= 10 ? 'block' : 'none' }; color: ${ stn.COLLECT_FLAG === '1' ? '#FFD500' : 'white' }"></span>`,
			} )
		} );
		marker.on( "click", ( p ) => {
			// 应急响应指挥中心
			if ($vm.sys === "yjxy") {
				this.setStationMarkerClick_yjxy( p );
			} else {
				this.setStationMarkerClick( p );
			}
		} );
		return marker;
	},
	// 应急响应
	setStationMarkerClick_yjxy ( param ) {
		if ($vm.drawFlag || $vm.rangingFlag) return;
		$vm.detailMarker && $vm.detailMarker.remove(); //删除
		let stn = param.target.options.icon.options.data;
		const code = stn.STN_CODE;
		const type = stn.GIS_KHTYPE === '客运' ? 'kgd' : 'hgd'
		let demo = '';
		let lay = {
			x: 20,
			w: 650,
			h: 160
		}

		function showGwPxt ( source ) {
			console.log( '查看工务配线图', source )
		}

		const pic = "https://10.192.34.79/JFLCMS/lc1/image/stn/" + code + ".jpg";
		const querys = [];
		querys.push( this.getStationInfo( code ) ); //站基本信息---0
		querys.push( this.getStationPhones( stn.STN_NAME ) ); //站联系电话---1
		Promise.all( querys ).then( ( arr ) => {
			let gwpxt = JSON.stringify( arr[1][3] )
			console.log( "STATION ARR", gwpxt )
			// 0站名略码，1站名，2是否有电子沙盘，3客货标志，4?站细，5?车站平面图，6营业办理限制，7车站概况，8车站介绍图，9?是否有视频
			// <span onClick="mapStationInfoBtnClick('xc','${code}')">车站现车</span>
			let btns = code === "" ? "" : `<span class="zx" onClick="mapStationInfoBtnClick('zx','${ code }','${ stn.STN_NAME }','')">站细</span>
						<span class="syt" onClick="mapStationInfoBtnClick('syt','${ code }','${ stn.STN_NAME }','')">平面示意图</span>
						<span class="sp" onClick="mapStationInfoBtnClick('sp','${ code }','${ stn.STN_NAME }','')">视频监控</span>
						<span class="zht" onClick="mapStationInfoBtnClick('zht','${ code }','${ stn.STN_NAME }','${ stn.STN_CODE }')">站内综合图</span>
						<span class="gd" onClick="mapStationInfoBtnClick('${ type }','${ code }','${ stn.STN_NAME }','abc')">股道占用</span>
						<span class="gd" onClick="mapStationInfoBtnClick('pxt','${ code }','${ stn.STN_NAME }')">配线图</span>`;
			const phones = arr[1]["1"].length > 0 ? arr[1]["1"][0] : {
				XCS: "",
				ZZS: ""
			};
			const zhanzhang = arr[1]["2"].length > 0 ? arr[1]["2"][0] : {
				EM_NAME: "",
				EM_MOBILE1: ""
			};
			const code2 = "DDC"; //站内综合图 需要的码
			demo =
					`<i class="marker-station-info-ys-tip"></i>
				<div class="marker-station-info-ys">
					<table border="0" cellpadding="0" cellspacing="0">
						<tbody>
							<tr>
								<td rowspan="2"><div class="pic-con"><div class="pic"><img src="${ pic }"/></div></div></td>
								<td rowspan="2" class="line-h"><div class="tit">${ stn.STN_NAME }</div><div class="sub-tit">-</div></td>
								<td class="line-v">
									<div class="btns">
										${ btns }
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="list-item"><div>行车室</div><div class="dianhua">${ phones.XCS }</div></div>
									<div class="list-item"><div>站长室</div><div class="dianhua">${ phones.ZZS }</div></div>
									<div class="list-item zhanzhang"><div class="zhanzhang">站长(${ zhanzhang.EM_NAME })</div><div class="shouji">${ zhanzhang.EM_MOBILE1 }</div></div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>`;
			let nameDivIcon = L.divIcon( {
				className: "detail-pop-container",
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${ lay.x }px, ${ lay.h - 40 }px, 0px); bottom: 0px;">
					<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class = "leaflet-popup-content-wrapper marker-yunshu-info-popup">
						<div class="leaflet-popup-content no-padding" style="position:relative;width:${ lay.w }px;height: ${ lay.h }px;">
							${ demo }
						</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
			   </div>`
			} );
			$vm.detailMarker = L.marker( param.latlng, {
				icon: nameDivIcon
			} ).addTo( $vm.map );
		} );
	},
	setStationMarkerClick ( param ) {
		if ($vm.drawFlag || $vm.rangingFlag) return;
		let stn = param.target.options.icon.options.data;
		console.log( "当前点击站:", stn );
		$vm.detailMarker && $vm.detailMarker.remove(); //删除
		$vm.centerMaker( param.latlng, 260, () => {
			let nameDivIcon = L.divIcon( {
				className: "detail-pop-container",
				iconSize: [10, 10],
				popupAnchor: [0, 0],
				html: `<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(5px, 0px, 0px); bottom: 0px; left:-265px;">
					<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class="leaflet-popup-content-wrapper blue" style="background:rgba(24,36,71,.7)">
						<div id="popupLoading" style="position:absolute;text-align:center;width:100%;height:100%;left:0;top:0;z-index:10;padding:250px 0;background: rgba(20,20,20,.4);">加载中,请稍候...</div>
						<div class="leaflet-popup-content no-padding marker-station-info" style="position:relative;width:530px;height: 530px;">
							<div class="top">
								<div class="top-left">
									<div class="pic"></div>
									<div class="text"><h3>${ stn.STN_NAME }</h3>${ stn.GIS_GRADE }站</div>
								</div>
								<div class="top-right">
									<div class="btns"></div>
								</div>
							</div>
							<div class="chart" id="stationInfoChartCon"></div>
							<div class="bottom">
								<div class="bottom-left">
									<div class="tit-con">晚点情况</div>
								</div>
								<div class="bottom-right">
									<div class="tit-con">人员安排情况<label>当前工作人数:-人</label></div>
								</div>
							</div>
						</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
					<div class="leaflet-popup-tip blue"></div></div>
			   </div>`
			} );
			$vm.detailMarker = L.marker( param.latlng, {
				icon: nameDivIcon
			} ).addTo( $vm.map );
			const code = stn.STN_CODE;
			const querys = [];
			querys.push( this.getStationInfo( code ) ); //站基本信息---0
			querys.push( this.getFDBBCur( stn ) ); //收入当前------1
			querys.push( this.getFDBBData( stn, "1" ) ); //收入必保---2
			querys.push( this.getFDBBData( stn, "3" ) ); //收入奋斗---3
			querys.push( this.getLateTrain( stn ) ); //正晚点情况---4
			querys.push( this.getKlqk( stn ) ); //客流情况---5
			querys.push( this.getPostPerson( stn ) ); //出勤安排---6
			Promise.all( querys ).then( ( arr ) => {
				const r = arr[0] || 0;
				// 0站名略码，1站名，2是否有电子沙盘，3客货标志，4?站细，5?车站平面图，6营业办理限制，7车站概况，8车站介绍图，9?是否有视频
				// <span onClick="mapStationInfoBtnClick('xc','${code}')">车站现车</span>
				let btns = [];
				btns.push( `<span class="zx" onClick="mapStationInfoBtnClick('yj','${ code }','${ stn.STN_NAME }')">应急预案</span>` );
				if (r[4] !== "" && r !== 0) {
					btns.push( `<span class="zx" onClick="mapStationInfoBtnClick('zx','${ code }','${ stn.STN_NAME }')">站细</span>` );
				}
				if (r[5] !== "" && r !== 0) {
					btns.push( `<span class="syt" onClick="mapStationInfoBtnClick('syt','${ code }','${ stn.STN_NAME }')">站场图</span>` );
				}
				if (r[9] !== "" && r !== 0) {
					btns.push( `<span class="sp" onClick="mapStationInfoBtnClick('sp','${ code }','${ stn.STN_NAME }')">视频监控</span>` );
				}
				btns = code === "" ? "" : btns.join( "" );
				// const pic = "https://10.192.6.179:8443/stationImg/IISPWebYJYA/jssource/" + r[8];
				const pic = "https://10.192.34.79/JFLCMS/lc1/image/stn/" + code + ".jpg";
				// const pic = "http://10.192.6.80:8080/IISPWebYJYA/jssource/" + r[8];
				const fdbbDemo = this.getFdbbDemo( arr[1], arr[2], arr[3] ); //奋斗必保收入
				const lateDemo = this.getLateDemo( arr[4] ); //正晚点情况
				const ryapDemo = this.getRyapDemo( arr[6] ); //人员安排情况
				const hrFlag = this.hasHspeedRailway( code ); //是否能点开客运看板
				const hrDemo = hrFlag ? `class="top-left has-hr" ` : `class="top-left"`;
				const picEvent = hrFlag ? `onClick="mapStationInfoBtnClick('hspeedRailway')"` : ``;
				const hasWeiXing = typeof(weiXinUrl[stn.STN_NAME])==="undefined"?"gray":"orange";//是否有卫星地图
				$vm.detailMarker.options.icon.options.html =
						`<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(5px, 0px, 0px); bottom: 0px; left:-265px;cursor:default;">
						<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
						<div class="leaflet-popup-content-wrapper blue" style="background:rgba(24,36,71,.7)">
							<div class="leaflet-popup-content no-padding marker-station-info" style="position:relative;width:530px;height: 530px;">
								<div class="top">
									<div ${hrDemo}>
										<div class="pic" ${picEvent}><img src="${pic}"/></div>
										<span onclick="mapStationInfoBtnClick('xiaoyu','${code}')" title="发起单视频对讲" style="float:right;margin-top:-15px;margin-right:10px;cursor:pointer;color:orange;" class="icon iconfont icon-zuoji"></span>
										<span onclick="mapStationInfoBtnClick('weixing','${code}','${stn.STN_NAME}')" title="卫星地图" style="float:right;margin-top:-15px;margin-right:10px;cursor:pointer;color:${hasWeiXing};" class="icon iconfont icon-diqiu5"></span>
										<div class="text"><h3>${stn.STN_NAME}</h3>${stn.GIS_GRADE}站</div>
									</div>
									<div class="top-right">
										${ fdbbDemo }
										<div class="btns">${ btns }</div>
									</div>
								</div>
								<div class="chart" id="stationInfoChartCon"></div>
								<div class="bottom">
									<div class="bottom-left">
										<div class="tit-con">晚点情况</div>
										${ lateDemo }
									</div>
									<div class="bottom-right">
										<div class="tit-con">人员安排情况<label>当前工作人数:${ ryapDemo.num }人</label></div>
										${ ryapDemo.demo }
									</div>
								</div>
							</div>
						</div>
						<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
						<div class="leaflet-popup-tip blue"></div></div>
				   </div>`
				$vm.detailMarker.refreshIconOptions();
				setTimeout( () => {
					this.initChart( arr[5] );
				}, 500 );
			} );
		} );
	},
	
	getFdbbDemo ( _cur, _curBb, _curFd ) {
		const cur = _cur.length > 0 ? (_cur[0].DATA_NUM / 10000).toFixed( 2 ) : 0;
		const curBb = _curBb.length > 0 ? _curBb[0].ZB_PLAN : 0;
		const curFd = _curFd.length > 0 ? _curFd[0].ZB_PLAN : 0;
		const maxTotal = curFd * 1.3;
		return (
				`<div class="fdbbPress">
				<div class="press-left">
				  <div class="press-pic"></div>
				  <div class="press-text">
					<div>已完成收入</div>
					<div class="total-con"><span class="press-total">${ cur }</span>万元</div>
				  </div>
				</div>
				<div class="press-right">
				  <div class="press-con">
					<div class="press-item back"></div>
					<div class="press-item cur SSlight" style="width:${ cur / maxTotal * 100 }%"></div>
					<div class="press-item bb" style="width:${ curBb / maxTotal * 100 }%">
						<div class="bb_icon"><div title="必保: ${ curBb } 万元"></div></div>
					</div>
					<div class="press-item fd" style="width:${ curFd / maxTotal * 100 }%">
						<div class="fd_icon"><div title="奋斗: ${ curBb } 万元"></div></div>
					</div>
				  </div>
				</div>
			</div>`
		);
	},
	// 正晚点情况
	getLateDemo ( data ) {
		let rs = `<div class="no-data">暂无数据</div>`;
		if (data.length > 0) {
			const temp = [`<ul class="late-list">`];
			data.forEach( v => {
				if (v.LATE_ARR > 0) {
					const arrTime = v.ARR_TIME_SCH.substring( 11, 16 );
					const depTime = v.DEP_TIME_SCH.substring( 11, 16 );
					const fTxt = v.LATE_DEP > 0 ? v.LATE_DEP + "min" : "待定";
					temp.push(
							`<li>
						<div><span class="train">${ v.TRAIN_NUM }</span><label>到:${ arrTime }<i>(${ v.LATE_ARR }min)</i></label></div>
						<div><span>${ v.START_STN }-${ v.END_STN }</span><label>发:${ depTime }<i>(${ fTxt })</i></label></div>
					</li>`
					);
				}
			} );
			temp.push( `</ul>` );
			rs = temp.join( "" );
		}
		return rs;
	},
	// 出勤情况
	getRyapDemo ( data ) {
		const gw_lsit = [{
			title: "出站口",
			postcode: "CZK"
		}, {
			title: "进站口",
			postcode: "YZYP"
		},
			{
				title: "站台值班",
				postcode: "ZTZBY"
			},
			{
				title: "检票口",
				postcode: "GJHC"
			},
			{
				title: "站台",
				postcode: "ZT"
			},
			// {
			// 	title: "综控",
			// 	tbNum: 0,
			// 	peoples: "0",
			// 	pie: "0",
			// 	postcode: "ZK"
			// },
		]
		gw_lsit.forEach( m => {
			m.total = 0; //总派人
			m.cur = 0; //当前在岗
			m.just = 0; //应派人数
			m.picC = 0; //图标个数
			m.percent = 0; //百分比
		} )
		var count = 0, //总人数
				curNum = 0; //总在岗
		data.forEach( v => {
			gw_lsit.forEach( m => {
				if (v.POST_CODE == m.postcode) {
					count += Number( v.COUNT1 );
					curNum += Number( v.COUNT2 );
					m.total = v.COUNT2; //总派出人数
					m.just = Number( v.COUNT1 ); //应派人数
					m.cur = Number( v.COUNT2 ); //在岗人数
					m.percent = v.COUNT2 / v.COUNT1;
					// m.percent = m.total / count;
					const picC = parseInt( m.percent * 10 );
					m.picC = picC >= 6 ? 6 : (picC === 0 ? 1 : picC);
					m.picC = m.cur === 0 ? 0 : m.picC;
					m.percent = m.percent === 0 ? 0 : parseInt( m.percent * 100 );
				}
			} )
		} )
		let rs = {
			demo: `<div class="no-data">暂无数据</div>`,
			num: curNum
		};
		let trs = [];
		gw_lsit.forEach( v => {
			let els = ``;
			for (var i = 0; i < v.picC; i ++) {
				els += `<i></i>`;
			}
			trs.push(
					`<tr><td>${ v.title }</td><td><div class="per-con">${ els }</div></td><td>${ v.cur }/${ v.just }<span>人</span></td><td>${ v.percent }%</td></tr>`
			);
		} );
		trs = trs.join( "" );
		rs.demo =
				`<table class="person-table" cellpadding="0" cellspacing="0">
				<tbody>
					${ trs }
				</tbody>
			</table>`;
		return rs;
	},
	initChart ( data ) {
		const now = (new Date()).getHours() * 2;
		let indexS = now; // - 4; //前2小时
		indexS = indexS > 38 ? 38 : indexS;
		let indexE = now + 9; //后4小时
		// indexS = indexS < 0 ? 0 : indexS;
		// indexE = indexE > 47 ? 47 : indexE;
		const timeData = []; //时间
		const xiaData = []; //下车
		const shangData = []; //上车
		const realD = data.slice( indexS, indexE );
		realD.forEach( v => {
			timeData.push( v.ETIME.substring( 11, 16 ) );
			xiaData.push( parseInt( v.BZXC ) );
			shangData.push( parseInt( v.BZSC ) );
		} );
		this.myChart = $vm.$echarts.init( $( "#stationInfoChartCon" )[0] );
		this.myChart.resize();
		let option = {
			tooltip: {
				trigger: 'axis',
				backgroundColor: "rgba(50, 50, 50, 0.7)",
				borderColor: "rgba(50, 50, 50, 0.7)",
				textStyle: {
					color: '#FFF',
				}
			},
			grid: {
				top: "45px",
				left: "50px",
				right: "20px",
				bottom: "20px",
				// containLabel: true
			},
			legend: {
				data: ['下车人数', "上车人数"],
				textStyle: {
					color: "#AAA"
				},
				top: "10px"
			},
			xAxis: {
				// name: "时间",
				// type: "category",
				data: timeData,
				nameTextStyle: {
					color: '#AAA'
				},
				axisLine: {
					lineStyle: {
						color: '#3E55BB'
					}
				},
				axisTick: {
					inside: true
				},
			},
			yAxis: [{
				name: "高峰情况",
				type: 'value',
				// interval: 20000,
				scale: true, //根据数据自动调整Y轴刻度
				splitLine: {
					lineStyle: {
						color: '#3E55BB'
					}
				}
			}],
			series: [{
				name: '下车人数',
				type: 'line',
				smooth: true,
				stack: '下车',
				data: xiaData,
				symbolSize: 0,
				showSymbol: false,
				// barWidth: 13,
				barMaxWidth: 15,
				itemStyle: {
					color: '#42BBF2',
					barBorderRadius: 2,
				},
				areaStyle: {
					color: new $vm.$echarts.graphic.LinearGradient( 0, 0, 0, 1, [{
						offset: 1,
						color: '#42BAF215'
					}, {
						offset: 0,
						color: '#42BAF28F'
					}] )
				},
			}, {
				name: '上车人数',
				type: 'line',
				smooth: true,
				stack: '上车',
				data: shangData,
				symbolSize: 0,
				showSymbol: false,
				// barWidth: 13,
				barMaxWidth: 15,
				itemStyle: {
					color: '#F89F93',
					barBorderRadius: 2,
				},
				areaStyle: {
					color: new $vm.$echarts.graphic.LinearGradient( 0, 0, 0, 1, [{
						offset: 1,
						color: '#F89F9315'
					}, {
						offset: 0,
						color: '#F89F938F'
					}] )
				},
			}],
			textStyle: {
				color: '#EEE'
			},
		};
		this.myChart.setOption( option );
	},
	mapStationInfoBtnClick ( k, code, name, stncode ) {
		if(k==="jbqk"||k==="ldys"||k==="zysj"||k==="jlbs"){

			if(k==="jbqk"){
				$vm.dialog.width = 1500;
				$vm.dialog.height = 400;
				// $vm.dialog.src = "http://10.192.6.110:9090/TRDM"+this.policeDetail.PDF1;
				$vm.dialog.src =  C.ADDS.url_34_79+"/TRDM"+this.policeDetail.PDF1;
			}else if(k==="ldys"){
				$vm.dialog.width = 1000;
				$vm.dialog.height = 800;
				// $vm.dialog.src = "http://10.192.6.110:9090/TRDM"+this.policeDetail.PDF2;
				$vm.dialog.src =  C.ADDS.url_34_79+"/TRDM"+this.policeDetail.PDF2;
			}else if (k==="zysj"){
				$vm.dialog.isComp = true;
				$vm.dialog.width = 700;
				$vm.dialog.height = 470;
				$vm.dialog.source = {
					code:code,
					// b:2
				};
				$vm.$nextTick(()=>{
					$vm.dialog.component = resolve=>{require(['../../../views/singleScreen/police/components/policeMainData.vue'],resolve)};
				}) 
				
			} else {
				$vm.dialog.isComp = true;
				$vm.dialog.width =1300;
				$vm.dialog.height = 800;
				$vm.dialog.source = {
					PICS:this.policeDetail.PICS,
					// b:2
				};
				$vm.dialog.component = resolve=>{require(['../../../views/singleScreen/police/components/policeBS.vue'],resolve)};
			}
			$vm.dialog.title = name;
			$vm.dialog.visible = true;
		}
		// 音视频对讲(向综控发起视频)
		else if (k === "xiaoyu") {
			// 接口取综控人员
			C.getData( {
				c: "trdm_wyh_036",
				// url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, ( r ) => {
				console.log( "应急综控电话查询 :", r );
				// KEY: "YJ_ZK_TEL" MEMO: "应急综控电话" STN_CODE: "ZZZ" VALUE: "18080925919
				const phone = r.filter( v => v.STN_CODE === code && v.KEY === "YJ_ZK_TEL" ).map( v => {
					return {
						E_Name: v.MEMO,
						E_Phone: v.VALUE
					}
				} );
				if (phone.length === 0) {
					$vm.$message.error( '综控室电话未配置！' );
				} else {
					$vm.voiceCall( phone, 'xiaoyu' );
				}
			} );
		}
		// 卫星地图
		else if(k==="weixing"){
			if(typeof(weiXinUrl[name])==="undefined"){
				// $vm.$message.error(name+' 卫星地图未配置！');
			}else{
				$vm.dialog.iszn = false;
				$vm.dialog.src = "#/MapWxICW?name=" + name;
				$vm.dialog.title = name + "卫星地图";
				$vm.dialog.visible = true;
			}
		}
		// 客运看板
		else if (k === "hspeedRailway") { //99990002001499A50004
			$vm.hspeedRailwayUrl = $vm.hspeedRailwayUrlTemp;
		} else if (k === "syt") {//平面示意图
			C.getDataP123( {
				c: "tyzd_ggy2019",
				s: [
					[name]
				],
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, ( r ) => {
				if (r["1"].length > 0) {
					let url = r["1"][0].ENCLOSURE_ADDRESS;
					// const src = 'http://10.192.6.226:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(url));
					// window.open(src);
					// return;
					url = url.replace( "http://10.192.6.233:9090", "https://10.192.6.233:19090" );
					$vm.dialog.src = 'https://10.192.6.179:8443/fileview/onlinePreview?url=' + encodeURIComponent( Base64.encode( url ) );
					// $vm.dialog.src = 'https://10.192.34.79/fileview/onlinePreview?url=' + encodeURIComponent( Base64.encode( url ) );
					$vm.dialog.title = name + "平面示意图";
					$vm.dialog.visible = true;
					$vm.dialog.iszn = false;
					console.log( "示意图地址:", $vm.dialog.src )
				}else{
					$vm.$message.error( name + '站未配置平面示意图！' );
				}
			} );
		} else if (k === "zht") {//站内综合图
			C.getDataP123( {
				c: "eqeh_zxy9005",
				s: [
					[code]
				],
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, ( r ) => {
				if (r.length > 0) {
					// const url = r["1"][0].ENCLOSURE_ADDRESS;  STN_NAME
					var arr = [];
					for (var i = 0; i < r.length; i ++) {
						var obj = r[i];
						arr.push( {
							name: obj.STN_NAME,
							path: 'https://10.192.125.61/gddl/#/wd?stnCode=' + obj.STN_CODE
						} );
					}
					$vm.dialog.arr = arr;
					$vm.dialog.iszn = true;
					$vm.dialog.src = 'https://10.192.125.61/gddl/#/wd?stnCode=' + r[0].STN_CODE;
					$vm.dialog.title = r[0].STN_NAME + "平面示意图";
					$vm.dialog.visible = true;
				}
			} );
		} else if (k === 'kgd') {
			// 查看股道占用
			console.log( '查看股道占用', k, code, name, stncode )
			window.open( 'https://10.192.34.79/JFLCMS/vue/#/zydb?viewType=v1&Oid=99990002001499A50004&StnCode=' + code )
			// window.open('')
		} else if (k === 'hgd') {
			console.log( '查看股道占用', k, code, name, stncode )
			// 货运股道
			window.open( 'http://10.192.34.125:9090/TpmsWeb/cx/stsNowCar.html?' + code + '&' + name )
		} else if (k === 'pxt') {
			console.log( '查看工务配线图', k, name )
			C.getDataP123( {
				c: 'eqeh_zxy2044',
				s: [[name]],
				url: 'https://10.192.126.203/GeneralProServlet'
			}, ( res ) => {
				console.log( '查询工务配线图', res['1'] )
				let gwpxt = res['1']
				// gwpxt = gwpxt.replace('http://10.192.6.233:9090', 'https://10.192.6.233:19090')
				$vm.gwPxtDialog.title = name
				$vm.gwPxtDialog.pxt = gwpxt
				$vm.gwPxtDialog.visible = true
			} )
		} else {
			let url = this.pages[k].replace( "@stncode@", code );
			if (k === "zx") {//站细
				console.log( "站细原地址", url )
				// $vm.dialog.src = 'https://10.192.34.79/fileview/onlinePreview?url=' + encodeURIComponent( Base64.encode( url ) );
				$vm.dialog.src = 'https://10.192.6.179:8443/fileview/onlinePreview?url=' + encodeURIComponent( Base64.encode( url ) );
			} else if (k === "sp") {//视频监控
				window.open(url.replace( "@Oid@", $vm.$store.state.params.Oid ).replace( "@UserPID@", $vm.$store.state.params.UserPID ))
			} else {
				$vm.dialog.src = url;
			}
			if (k !== 'sp') {
				$vm.dialog.title = name;
				$vm.dialog.visible = true;
				$vm.dialog.iszn = false;
			}
		}
	},
	hasHspeedRailway ( code ) {
		let flag = false;
		// 客运看板(只有客运站才用)
		if ($vm.sys === "kyz") { //99990002001499A50004
			let url = this.stationUrl;
			// UserName=@UserName@&UserPID=@UserPID@&Oid=99990002001499A50004&DepId=23012134BF4A1580E053BC04C00A22C4&StnCode=@StnCode@",
			const {
				Oid,
				UserName,
				UserPID
			} = $vm.$store.state.params;
			if (Oid === "99990002001499A50004") {
				flag = true;
			} else {
				const ownerStations = $vm.ownerStations[$vm.oid.toUpperCase()] || [];
				flag = ownerStations.find( v => v.ZMLM === code );
			}
			if (flag) {
				url = url.replace( "@UserName@", UserName ).replace( "@UserPID@", UserPID ).replace( "@StnCode@", code );
				$vm.hspeedRailwayUrlTemp = url;
			}
		}
		return flag;
	},
	// 获取车站(有回调则纯取数据)
	getStations ( cb, showAll = false ) {
		if (this.getDataFlag) {
			return;
		}
		this.getDataFlag = true;
		const response = ( source ) => {
			if (cb) {
				cb.call( null, source );
			} else {
				source.forEach( s => {
					s.value = s.STN_NAME;
					if (s.BUREAU === "成都铁路局") {
						// console.log(s)
						// if (s.GIS_KHTYPE.indexOf("客运") > -1) {
						// 	s.khType = "K";
						// 	this.boundStationsK.push(s);
						// }
						// if (s.GIS_KHTYPE.indexOf("货运") > -1) {
						// 	s.khType = "H";
						// 	this.boundStationsH.push(s);
						// }
						if (s.GIS_KHTYPE === '客运') {
							s.khType = "K"
							this.boundStationsK.push( s )
						} else if (s.GIS_KHTYPE === '货运') {
							s.khType = "H"
							this.boundStationsH.push( s )
						} else if (s.GIS_KHTYPE.includes( '客运' ) && s.GIS_KHTYPE.includes( '货运' )) {
							s.khType = "KH"
							this.boundStationsKH.push( s )
						} else {
							s.khType = ''
							this.boundStationsN.push( s )
						}
					} else {
						if (s.GIS_KHTYPE.indexOf( "客运" ) > - 1) {
							s.khType = "K";
							this.otherStationsK.push( s );
						}
						if (s.GIS_KHTYPE.indexOf( "货运" ) > - 1) {
							s.khType = "H";
							this.otherStationsH.push( s );
						}
					}
				} );
				this.allStations = source;
				this.filterLayer( showAll );
			}
		}
		// 仓库中有数据
		if ($vm.$store.state.dicAllStation.length > 0) {
			response( $vm.$store.state.dicAllStation );
		} else {
			// 客运站/公安
			if ($vm.sys === "kyz"||$vm.sys === "kygl"||$vm.sys === "police") {
				var code="kydp_zhoujiaming8002";
				if($vm.sys === "police"){
					code="eqeh_zxy2003";
				}
				C.getData( {
					c: code,
					url: C.ADDS.servGS, //接口地址
				}, ( r ) => {
					window.console.log("kydp_zhoujiaming8002",r);
					let d = [];
					if($vm.sys === "police"){
						d=r;
					}else{
						d = JSON.parse( r.data );
					}
					$vm.$store.commit( "updateDicAllStation", d ); //存入仓库
					response( d );
				} );
			} else {
				C.getDataP123( {
					c: "eqeh_zxy2003",
					url: C.ADDS.servGS, //接口地址
				}, ( r ) => {
					$vm.$store.commit( "updateDicAllStation", r["1"] ); //存入仓库
					response( r["1"] );
				} );
			}
		}
	},
	// 获取车站信息
	getStationInfo ( stncode ) {
		//1240 where: ["GWW"]
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: "1240",
				w: [stncode],
				url: "https://10.192.34.79/PTMS/GeneralProServlet", //接口地址
			}, ( rs ) => {
				resolve( rs );
			} );
		} );
	},
	// 车站联系电话
	getStationPhones ( stnname ) {
		return new Promise( ( resolve, reject ) => {
			C.getDataP123( {
				c: "tyzd_ggy2007",
				s: [
					[stnname],
					[stnname],
					[stnname]
				],
				a: "查询车站联系电话",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, ( rs ) => {
				resolve( rs );
			} );
		} );
	},
	//获取收入发送当前值
	getFDBBCur ( stn ) {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: "trdm_lv_626",
				s: [stn.STN_CODE, "2", new Date().Format( "yyyyMM01" ), new Date().Format( "yyyyMMdd" )],
				a: "获取收入发送当前值",
				async: true,
			}, function ( rs ) {
				resolve( rs );
			} );
		} );
	},
	//获取奋斗必保指标情况
	getFDBBData ( stn, ty ) {
		// { id: "1", text: "必保收入（万元）", value: "" },
		// { id: "3", text: "奋斗收入（万元）", value: "" },
		return new Promise( ( resolve, reject ) => { //查询主表数据
			C.getData( {
				c: "trdm_lv_608",
				a: "获取指定指标情况",
				s: [stn.STN_CODE, ty, new Date().Format( "yyyyMM" )],
			}, function ( rs ) {
				resolve( rs );
			} );
		} );
	},
	// 获取正晚点情况
	getLateTrain ( stn ) {
		return new Promise( ( resolve, reject ) => { //查询主表数据
			C.getData( {
				// url: "http://10.192.34.84:9090/TRDM/GeneralProServlet",
				c: "trdm_zjm_133",
				a: "获取正晚点情况",
				s: [stn.STN_CODE, new Date().Format( "yyyy-MM-dd hh:mm:ss" ), C.getDateTimeSub( new Date(), "yyyy-MM-dd hh:mm:ss",
						2 )],
				// s: [stn.STN_CODE, "2022-01-27 00:00:00", C.getDateTimeSub(new Date(), "yyyy-MM-dd hh:mm:ss", 8)],
			}, function ( rs ) {
				resolve( rs );
			} );
		} );
	},
	//获取客流情况
	getKlqk ( stn ) {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: "trdm_ys_242",
				s: [stn.STN_CODE, new Date().Format( "yyyy-MM-dd" )],
				a: "获取客流情况",
				async: true,
			}, function ( rs ) {
				resolve( rs );
			} );
		} );
	},
	//获取出勤安排
	getPostPerson ( stn ) {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: "trdm_ys_208",
				s: [stn.STN_CODE, new Date().Format( "yyyy-MM-dd" )],
				a: "获取出勤安排",
				async: true,
			}, function ( rs ) {
				resolve( rs );
			} );
		} );
	},
}
