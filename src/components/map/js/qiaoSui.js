/**
 * 桥梁/隧道
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag: false, // 是否已调用接口
	data: {
		qiaoLiangLayer: null,
		suiDaoLayer: null,
		qiaoSuiOther: {
			qiaoVisible: true,
			suiVisible: true,
		},
		recipe: {
			ql: {
				c: 'tyzd_ggy2040',
				x: 20,
				w: 300,
				h: 270,
				tipClass: 'marker-gongwu-info-tip ql',
				logoClass: 'log ql',
				titKey: '',
				titString: '桥梁详细信息',
				tit2: 'LINE_NAME',
				descriptionsSpan: 1,
				descriptions: [{
						label: '线名',
						key: 'LINE_NAME',
						labelClass: 'orange'
					},
					{
						label: '线编号',
						key: 'LINE_CODE',
						labelClass: 'orange'
					},
					{
						label: '行别',
						key: 'LINE_TYPE',
						formatter: (value) => {
							switch (value) {
								case '0':
									return '上行'
								case '1':
									return '下行'
								case '2':
									return '单线'
							}
						},
						labelClass: 'orange'
					},
					{
						label: '桥名',
						key: 'BRIDGE_NAME',
						labelClass: 'orange'
					},
					{
						label: '桥编号',
						key: 'BRIDGE_CODE',
						labelClass: 'orange'
					},
					{
						label: '中心里程',
						key: 'CORE_MILEAGE',
						labelClass: 'orange'
					},
					{
						label: '全长',
						key: 'OVERALL_LENGTH',
						labelClass: 'orange'
					}
				]

			},
			sd: {

				c: 'tyzd_ggy2043',
				x: 20,
				w: 300,
				h: 270,
				tipClass: 'marker-gongwu-info-tip sd',
				logoClass: 'log sd',
				tit: 'TUNNEL_NAME',
				tit2: 'DUAN_NAME',
				descriptionsSpan: 1,
				descriptions: [{
						label: '线名',
						key: 'LINE_NAME',
						labelClass: 'orange'
					},
					{
						label: '线编号',
						key: 'LINE_CODE',
						labelClass: 'orange'
					},
					{
						label: '行别',
						key: 'LINE_TYPE',
						formatter: (value) => {
							switch (value) {
								case '0':
									return '上行'
								case '1':
									return '下行'
								case '2':
									return '单线'
							}
						},
						labelClass: 'orange'
					},
					{
						label: '隧道名',
						key: 'TUNNEL_NAME',
						labelClass: 'orange'
					},
					{
						label: '隧道编号',
						key: 'TUNNEL_CODE',
						labelClass: 'orange'
					},
					{
						label: '中心里程',
						key: 'CORE_MILEAGE',
						labelClass: 'orange'
					},
					{
						label: '全长',
						key: 'OVERALL_LENGTH',
						labelClass: 'orange'
					}
				]

			}
		}
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.qiaoSui.register) {
			return;
		}
		// 设置默认值
		this.data.qiaoSuiOther.qiaoVisible = $vm.config.qiaoSui.ck_qiao;
		this.data.qiaoSuiOther.suiVisible = $vm.config.qiaoSui.ck_sui;
		this.initData();
	},
	// 初始化数据
	initData() {
		if (this.data.qiaoSuiOther.qiaoVisible ||
			this.data.qiaoSuiOther.suiVisible) {
			this.getQiaoSui();
		}
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {
		if (!$vm.config.qiaoSui.register) {
			return;
		}
		// 桥遂三角形图标缩放
		if (newZoom > 3) {
			C.$(".marker-qiaosui").addClass("big");
		} else {
			C.$(".marker-qiaosui").removeClass("big");
		}
	},
	// 过滤图层元素
	filterLayer() {
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getQiaoSui();
			return;
		}
		if (this.data.qiaoSuiOther.qiaoVisible) {
			this.data.qiaoLiangLayer && $vm.map.addLayer(this.data.qiaoLiangLayer);
		} else {
			this.data.qiaoLiangLayer && $vm.map.removeLayer(this.data.qiaoLiangLayer);
		}
		if (this.data.qiaoSuiOther.suiVisible) {
			this.data.suiDaoLayer && $vm.map.addLayer(this.data.suiDaoLayer);
		} else {
			this.data.suiDaoLayer && $vm.map.removeLayer(this.data.suiDaoLayer);
		}
	},
	// 创建marker---桥遂
	creatQiaoSui(source) {
		let qiaoLiangGroup = L.layerGroup();
		let suiDaoGroup = L.layerGroup();
		C.$.each(source, (index, item) => {
			const points = JSON.parse(item.ALL_COORD);
			item.lonlats = [];
			points.forEach(p => {
				const temp = p.split(",");
				item.lonlats.push([temp[1], temp[0]]);
			});
			// 只有3个点，且全部相同
			item.singleFlag = points.length === 3 && points[0] === points[1] && points[1] === points[2];
			// 桥梁
			if (item.BRI_HOLE_TYPE === "0") {
				let marker = null;
				if (item.singleFlag) {
					marker = L.marker([item.lonlats[0][0], item.lonlats[0][1]], {
						icon: L.divIcon({
							className: 'qiao-icon-container',
							iconSize: [10, 10],
							popupAnchor: [5, 5],
							html: `<div class="marker-qiaosui" style="color:#FF9966;transform:scale(0.7)">▲</div>`
						})
					});
				} else {
					marker = L.polyline(item.lonlats, {
						color: "#FF9966",
						weight: 5
					});
					qiaoLiangGroup.addLayer(marker);
					marker = L.polyline(item.lonlats, {
						color: "#FF9966",
						weight: 20,
						opacity: 0.01
					});
				}
				this.setMarkerClick_qiaoSui(marker, item);
				qiaoLiangGroup.addLayer(marker);
			}
			// 隧道
			else if (item.BRI_HOLE_TYPE === "1") {
				let marker = null;
				if (item.singleFlag) {
					marker = L.marker([item.lonlats[0][0], item.lonlats[0][1]], {
						icon: L.divIcon({
							className: 'sui-icon-container',
							iconSize: [10, 10],
							popupAnchor: [5, 5],
							html: `<div class="marker-qiaosui" style="color:#6c00d8;transform:scale(0.7)">▲</div>`
						})
					});
				} else {
					marker = L.polyline(item.lonlats, {
						color: "#6c00d8",
						weight: 5
					});
					suiDaoGroup.addLayer(marker);
					marker = L.polyline(item.lonlats, {
						color: "#6c00d8",
						weight: 20,
						opacity: 0.01
					});
				}
				this.setMarkerClick_qiaoSui(marker, item);
				suiDaoGroup.addLayer(marker);
			}
		});
		this.data.qiaoLiangLayer = qiaoLiangGroup;
		this.data.suiDaoLayer = suiDaoGroup;
		this.filterLayer();
	},
	// 绑定marker点击事件---桥遂
	setMarkerClick_qiaoSui(marker, data) {
		marker.on("click", (param) => {
			if ($vm.drawFlag || $vm.rangingFlag) return;
			$vm.detailMarker && $vm.detailMarker.remove(); //删除
			$vm.centerMaker(param.latlng, 170, () => {
				const prev = '#/QiaoSuiInfo';
				const trainInfoPath = prev + '?name=' + data.BRI_HOLE_NAME + '&line=' + data.LINE_NAME;
				let nameDivIcon = L.divIcon({
					className: 'detail-pop-container',
					iconSize: [10, 10],
					popupAnchor: [0, 0],
					html: `<div id="qiaoSuiDetailInfo" class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(0px, -0px, 0px); bottom: 0px; left:-350px;">
								<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
								<div class = "leaflet-popup-content-wrapper blue">
								<div class="leaflet-popup-content no-padding" style="width:700px;height: 325px;">
									<div><h2 style="margin:0;padding-left:5px;">${data.BRI_HOLE_NAME}<span style="font-weight:400;font-size:14px;margin-left:10px;"></span></h2></div>
									<div id="popupLoading" style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:0;padding:150px 300px;">加载中,请稍候...</div>
									<iframe src="${trainInfoPath}" style="height: 300px;width: 100%;margin-left:-1px;border-radius:10px;" frameborder="0"></iframe>
								</div>
								</div>
								<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
								<div class="leaflet-popup-tip blue"></div></div>
							</div>`
				});
				setTimeout(() => {
					$vm.detailMarker = L.marker(param.latlng, {
						icon: nameDivIcon
					}).addTo($vm.map);
					setTimeout(() => {
						C.$("#popupLoading").remove();
					}, 1000);
				}, 200);
			});
		});
	},
	/**
	 * 创建某种图例的全部Layer
	 * @param ty        图例类型
	 * @param source    绘图数据源
	 */
	createLayer(ty, source) {
		let group = this.createLine(source, ty);
		if(ty==="ql"){
			this.data.qiaoLiangLayer = group;
		}else{
			this.data.suiDaoLayer = group;
		}
		this.filterLayer()
	},
	/**
	 * 绘制线段
	 * @param source  线段数据源
	 * @param ty      图例类型
	 * @returns {*}   绘制好的线段
	 */
	createLine(source, ty) {
		let group = L.layerGroup()
		source.map((item) => {
			let pts = []
			let points = item.POINTS
			if($vm.sys=="police"){
				points = item.points
				points=JSON.parse(points);
			}
			points.map((pt) => {
				pts.push([pt.GPSY, pt.GPSX])
			})
			let line = L.polyline(pts, {
				color: ty === "ql" ? "#FF9966" : "#6c00d8",
				width: 3
			});

			line.on('click', (p) => {
				this.setMarkerClick(ty, item, p)
			})
			group.addLayer(line)
		})
		return group
	},
	/**
	 * 设置图例点击事件
	 * @param type  图例类型
	 * @param item  点击的图例数据
	 * @param p     图标marker对象
	 */
	setMarkerClick(type, item, p) {
		if ($vm.drawFlag || $vm.rangingFlag) return
		$vm.detailMarker && $vm.detailMarker.remove()
		this.createPopper(type, item, p)
	},
	/**
	 * 生成popper弹框内容HTML
	 * @param type    图例类型
	 * @param item    图例数据
	 * @param marker  图标marker对象
	 */
	createPopper(type, item, marker) {
		const recipe = this.data.recipe[type];
		C.getData({
			c: recipe.c,
			s: $vm.sys==="police"?[item.PK_ID]:[
				[item.PK_ID]
			],
			url: C.ADDS.servGS
		}, (res) => {
			if ($vm.sys==="police"||res.success) {
				const info = $vm.sys==="police"?res[0]:res.data['1'][0]
				const popperTip = `<i class="${recipe.tipClass}"></i>`
				// 显示防洪抢险材料信息时，使用自定义渲染函数
				const popperBody =
					`<div class="marker-gongwu-info" style="width: ${recipe.w}">
				       <table border="0" cellpadding="0" cellspacing="0">
					       <tbody>
					         <tr>
					           <td style="width: 120px">
					             <div class="${recipe.logoClass}"></div>
					             <div class="sub-tit">${recipe.subTit === undefined ? '' : recipe.subTit}</div>
					           </td>
					           <td style="display: flex; flex-direction: column; align-content: center; justify-content: center; align-items: center">
					             <div class="tit">${recipe.titString === undefined ? info[recipe.tit] : recipe.titString}</div>
					             <div title="${info[recipe.tit2]}" class="tit2">${info[recipe.tit2]}</div>
					           </td>
							     </tr>
							     <tr>
							       <td colspan="2"><div class="detail-item show">
							         ${this.generateDescriptions(recipe, info)}
								     </div></td>
							     </tr>
						     </tbody>
					     </table>
				     </div>`;
				this.addPop(popperTip + '\n' + popperBody, marker, {
					x: recipe.x,
					w: recipe.w,
					h: recipe.h
				})
			} else {
				$vm.message.error('未查询到详情')
			}
		})
	},
	/**
	 * 显示popper弹框
	 * @param content          popper内容HTML
	 * @param marker           显示popper的图标
	 * @param {Object} size    popper大小参数 (x: 横向偏移; w: popper宽度; h: popper高度)
	 */
	addPop(content, marker, size) {
		console.log(content)
		let nameDivIcon = L.divIcon({
			className: "detail-pop-container",
			iconSize: [10, 10],
			popupAnchor: [0, 0],
			html: `<div class="leaflet-popup leaflet-zoom-animated " style="opacity: 1; transform: translate3d(${size.x}px, ${size.h-40}px, 0px); bottom: 0px;">
					<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
					<div class = "leaflet-popup-content-wrapper marker-houqing-info-popup">
						<div class="leaflet-popup-content no-padding" style="position:relative;width:${size.w}px;height: ${size.h}px;">
							${content}
						</div>
					</div>
					<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
			   </div>`
		});
		$vm.detailMarker = L.marker(marker.latlng, {
			icon: nameDivIcon
		}).addTo($vm.map);
	},
	/**
	 * 生成popper内容中的描述部分
	 * @param recipe      生成配置
	 * @param info        描述内容
	 * @returns {string}  描述内容部分HTML
	 */
	generateDescriptions(recipe, info) {
		let item = []
		// 分两列展示且隐藏过长内容时不适用预置class
		let _class = recipe.overflowTooltip ? '' : (recipe.descriptionsSpan === 1 ? 'list-item auto' : 'list-item two_rows')
		// 需要隐藏过长内容时使用对应style
		let _style = recipe.overflowTooltip ? ('width: ' + (recipe.descriptionsSpan === 1 ? recipe.w : recipe.w * 0.45) +
			'px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle'
		) : ''
		recipe.descriptions.map((desc) => {
			item.push(
				`<div class="${_class}" style="${_style}" title="${desc.formatter === undefined ? info[desc.key] : desc.formatter(info[desc.key])}">
				   <span>${desc.label}: <label class="${desc.labelClass ? desc.labelClass : ''}">${desc.formatter === undefined ? info[desc.key] : desc.formatter(info[desc.key])}</label></span>
				 </div>`
			)
		})
		return item.join('')
	},
	// 获取桥遂数据
	getQiaoSui() {
		if (this.getDataFlag) {
			return;
		}
		this.getDataFlag = true;
		this.getData_tl_ql().then((r) => {
			this.createLayer('ql', r)
		});
		this.getData_tl_sd().then((r) => {
			this.createLayer('sd', r)
		});
		return;
		C.getDataP123({
			c: "kydp_zxy8020",
			s: ["ALL", "ALL"],
			a: "获取桥遂数据",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				const d = JSON.parse(r);
				this.creatQiaoSui(d);
			} else {
				this.$notify.error({
					title: '提示',
					message: '获取桥遂数据信息数据异常'
				});
			}
		});
	},
	/**
	 * 图例-获取桥梁信息
	 * @returns {Promise}
	 */
	getData_tl_ql() {
		return new Promise((resolve, reject) => {
			C.getData({
				c:$vm.sys==="police"? 'trdm_lv_860':'yjcz_ggy9003',
				url: C.ADDS.servGS
			}, (res) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve(JSON.parse(res.data))
				} else {
					reject('获取桥梁信息失败')
				}
			})
		})
	},
	/**
	 * 图例-获取隧道信息
	 * @returns {Promise}
	 */
	getData_tl_sd() {
		return new Promise((resolve, reject) => {
			C.getData({
				c: $vm.sys==="police"? 'trdm_lv_863':'yjcz_ggy9005',
				url: C.ADDS.servGS
			}, (res) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve(JSON.parse(res.data))
				} else {
					reject('获取隧道信息失败')
				}
			})
		})
	},
}
