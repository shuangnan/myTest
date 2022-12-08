/**
 * 货运子系统
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	getDataFlag_getHyz: false, // 是否已调用接口-货运站
	getDataFlag_getYjry: false, // 是否已调用接口-应急人员
	getDataFlag_getJjbl: false, // 是否已调用接口-车站
	getDataFlag_getYjll: false, // 是否已调用接口-车站
	getDataFlag_getYjzxjx: false, // 是否已调用接口-车站
	getDataFlag_getShjxzy: false, //是否已调用接口-疾控所
	getDataFlag_getWxhwblz: false, // 是否已调用接口-生活车
	getDataFlag_getYfhwblzy: false, // 是否已调用接口-应急材料
	data: {
		light: false,
		huoYun_layers: {
			sbss: {
				hyz: L.layerGroup(), //生活车
				yjry: L.layerGroup(), //应急材料
				jjbl:L.layerGroup(),//机具备料
				yjll:L.layerGroup(),//应急劳力
				yjzxjx:L.layerGroup(),//应急装卸机械
				shjxzy:L.layerGroup(),//社会机械资源
				wxhwblz:L.layerGroup(),//危险货物办理站
				yfhwblz:L.layerGroup(),//易腐货物办理站
			},
		},
		huoYunOther: { 
			sbss: {
				hyz: false, //货运站
				yjry: false, //应急人员
				jjbl: false, //机具备料
				yjll: false, //应急劳力
				yjzxjx: false, //应急装卸机械
				shjxzy: false, //社会机械资源
				wxhwblz: false, //危险货物办理站
				yfhwblz: false, //易腐货物办理站
			},
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.tf_sbss.register && !$vm.config.tf_fw.register) {
			return;
		}
		// 设置默认值
		this.data.huoYunOther.sbss.hyz = $vm.config.hy_sbss.hyz; //生活车
		this.data.huoYunOther.sbss.yjry = $vm.config.hy_sbss.yjry; //应急材料
		this.data.huoYunOther.sbss.jjbl = $vm.config.hy_sbss.jjbl; //机具备料
		this.data.huoYunOther.sbss.yjll = $vm.config.hy_sbss.yjll; //应急劳力
		this.data.huoYunOther.sbss.yjzxjx = $vm.config.hy_sbss.yjzxjx; //应急装卸机械
		this.data.huoYunOther.sbss.shjxzy = $vm.config.hy_sbss.shjxzy; //社会机械资源
		this.data.huoYunOther.sbss.wxhwblz = $vm.config.hy_sbss.wxhwblz; //危险货物办理站
		this.data.huoYunOther.sbss.yfhwblz = $vm.config.hy_sbss.yfhwblz; //易腐货物办理站
		this.data.light = $vm.config.superMap.lightMode
		if ($vm.config.tf_sbss.register) {
			if (this.data.huoYunOther.sbss.hyz) {
				this.getHyz();
			}
			if (this.data.huoYunOther.sbss.yjry) {
				this.getYjry();
			}
			if (this.data.huoYunOther.sbss.jjbl) {
				this.getJjbl();
			}
			if (this.data.huoYunOther.sbss.yjll) {
				this.getYjll();
			}
			if (this.data.huoYunOther.sbss.yjzxjx) {
				this.getYjzxjx();
			}
			if (this.data.huoYunOther.sbss.shjxzy) {
				this.getShjxzy();
			}
			if (this.data.huoYunOther.sbss.wxhwblz) {
				this.getWxhwblz();
			}
			if (this.data.huoYunOther.sbss.yfhwblz) {
				this.getYfhwblzy();
			}
		}

		// 绑定marker中tab切换事件
		window.chooseTfTab = (el, ty) => this.chooseTfTab(el, ty);
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 过滤图层元素
	filterLayer(ty) {
		if (ty === "货运") {
			if (this.data.huoYunOther.sbss.hyz) {
				if (this.getDataFlag_getHyz === false) {
					this.getHyz();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.hyz);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.hyz);
			}
			if (this.data.huoYunOther.sbss.yjry) {
				if (this.getDataFlag_getYjry === false) {
					this.getYjry();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.yjry);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.yjry);
			}
			
			if (this.data.huoYunOther.sbss.jjbl) {
				if (this.getDataFlag_getJjbl === false) {
					this.getJjbl();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.jjbl);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.jjbl);
			}
			if (this.data.huoYunOther.sbss.yjll) {
				if (this.getDataFlag_getYjll === false) {
					this.getYjll();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.yjll);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.yjll);
			}
			if (this.data.huoYunOther.sbss.yjzxjx) {
				if (this.getDataFlag_getYjzxjx === false) {
					this.getYjzxjx();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.yjzxjx);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.yjzxjx);
			}
			if (this.data.huoYunOther.sbss.shjxzy) {
				if (this.getDataFlag_getShjxzy === false) {
					this.getShjxzy();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.shjxzy);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.shjxzy);
			}
			if (this.data.huoYunOther.sbss.wxhwblz) {//危险货物办理站
				if (this.getDataFlag_getWxhwblz === false) {
					this.getWxhwblz();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.wxhwblz);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.wxhwblz);
			}
			if (this.data.huoYunOther.sbss.yfhwblz) {//易腐货物办理站
				if (this.getDataFlag_getYfhwblzy === false) {
					this.getYfhwblzy();
					return;
				}
				$vm.map.addLayer(this.data.huoYun_layers.sbss.yfhwblz);
			} else {
				$vm.map.removeLayer(this.data.huoYun_layers.sbss.yfhwblz);
			}
		}
	},
	// 创建marker 货运站
	creatMarker_hyz(source) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "huoyun-icon-container",
					data: item,
					html: `<div class="marker-hover huoyun-marker hyz" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("货运站", item, p);
			});
			group.addLayer(marker);
		});
		this.data.huoYun_layers.sbss.hyz = group;
		this.filterLayer("货运");
	},
	// 创建marker 
	creatMarker_marker(source,type) {
		let group = L.layerGroup();
		C.$.each(source, (index, item) => {
			var str = "";
			var html = `<div class="marker-hover ${this.data.light ? 'huoyun-marker-light' : 'huoyun-marker'} jjbl" style="position:relative"></div>`
			if(type=="jjbl"){//机具备料
				str = "机具备料";
			}else if(type=="yjll"){ //应急劳力
			str = "应急劳力";
			html = `<div class="marker-hover ${this.data.light ? 'huoyun-marker-light' : 'huoyun-marker'} yjll" style="position:relative"></div>`
			}else if(type=="yjzxjx"){//应急装卸机械
				str = "应急装卸机械";
				html = `<div class="marker-hover ${this.data.light ? 'huoyun-marker-light' : 'huoyun-marker'} yjzxjx" style="position:relative"></div>`
			}else if(type=="shjxzy"){//社会机械资源
				str = "社会机械资源";
				html = `<div class="marker-hover ${this.data.light ? 'huoyun-marker-light' : 'huoyun-marker'} shjxzy" style="position:relative"></div>`
			}else if(type=="wxhwblz"){//危险货物办理站
				str = "危险货物办理站";
				html = `<div class="marker-hover ${this.data.light ? 'huoyun-marker-light' : 'huoyun-marker'} wxhwblz" style="position:relative"></div>`
			}else if(type=="yfhwblz"){ //易腐货物办理站
				str = "易腐货物办理站";
				html = `<div class="marker-hover ${this.data.light ? 'huoyun-marker-light' : 'huoyun-marker'} yfhwblz" style="position:relative"></div>`
			}else if(type=="yjry"){ //易腐货物办理站
				str = "应急人员";
				html = `<div class="marker-hover ${this.data.light ? 'huoyun-marker-light' : 'huoyun-marker'} yjry" style="position:relative"></div>`
			}
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: "huoyun-icon-container",
					data: item,
					html: html,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick(str, item, p);
			});
			group.addLayer(marker);
		});
		if(type=="jjbl"){//机具备料
			this.data.huoYun_layers.sbss.jjbl = group;
		}else if(type=="yjll"){ //应急劳力
			this.data.huoYun_layers.sbss.yjll = group;
		}else if(type=="yjzxjx"){//应急装卸机械
			this.data.huoYun_layers.sbss.yjzxjx = group;
		}else if(type=="shjxzy"){//社会机械资源
			this.data.huoYun_layers.sbss.shjxzy = group;
		}else if(type=="wxhwblz"){//危险货物办理站
			this.data.huoYun_layers.sbss.wxhwblz = group;
		}else if(type=="yfhwblz"){ //易腐货物办理站
			this.data.huoYun_layers.sbss.yfhwblz = group;
		}else if(type=="yjry"){ //易腐货物办理站
			this.data.huoYun_layers.sbss.yjry = group;
		}
		this.filterLayer("货运");
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
		if (type === "货运站") {
			lay = {
				x: 95,
				w: 420,
				h: 340
			};
			C.getDataP123({
				c: "tyzd_ggy2086",
				s: [
					[data.PK_ID]
				],
				a: "货运站基本情况详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					demo =
						`<i class="marker-huoyun-info-tip hyz"></i>
							<div class="marker-huoyun-info">
								<div class="top">
									<div class="pic hyz"></div>
									<div class="tit"><h3>货运站基本情况</h3><h4>站名:${rdata[0].STATION}</h4></div>
								</div>
								<div class="list-item auto "><span>所属段:</span><label class="blue">${rdata[0].DW}</label></div>
								<div class="list-item auto "><span>营业办理限制:</span><label class="orange">${rdata[0].YYXZ}</label></div>
								<div class="list-item auto"><span>货运人数:</span><label class="blue">${rdata[0].HYRY}</label></div>
								<div class="list-item auto"><span>铁路装卸人数:</span><label class="blue">${rdata[0].ZXRY}</label></div>
								<div class="list-item auto"><span>仓库:</span><label class="blue">${rdata[0].CK}</label></div>
								<div class="list-item auto"><span>雨棚:</span><label class="orange">${rdata[0].YP}</label></div>
								<div class="list-item auto"><span>货物线:</span><label class="blue">${rdata[0].HWX}</label></div>
								<div class="list-item auto"><span>端式站台货物线:</span><label class="blue">${rdata[0].DSHWX}</label></div>
								<div class="list-item auto"><span>侧面1.1m站台货物线:</span><label class="blue">${rdata[0].CMHWX}</label></div>
								<div class="list-item auto"><span>起重能力:</span><label class="orange">${rdata[0].QZNL}</label></div>
								<div class="list-item auto"><span>装卸机械概况:</span><label class="blue">${rdata[0].ZXJ}</label></div>
								<div class="list-item auto"><span>接轨专用线:</span><label class="blue">${rdata[0].ZYX}</label></div>
								<div class="list-item auto"><span>专用线有端式站台线路:</span><label class="blue">${rdata[0].DSZYX}</label></div>
								<div class="list-item auto"><span>所属市县区:</span><label class="orange">${rdata[0].SXQ}</label></div>
								<div class="list-item auto"><span>省域:</span><label class="blue">${rdata[0].SY}</label></div>
								<div class="list-item auto"><span>备注:</span><label class="blue">${rdata[0].BZ}</label></div>
							</div>`;;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}else if(type === "应急人员"){
			lay = {
				x: 95,
				w: 420,
				h: 300
			};
			C.getDataP123({
				c: "tyzd_ggy2088",
				s: [
					[data.DW]
				],
				a: "站段应急人员详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					const tbody = rdata.map((v, i) =>
						`<tr><td>${v.NAME}</td><td>${v.SEX}</td><td>${v.JOB}</td><td>${v.TELEPHONE}</td><td>${v.PHONE}</td></tr>`).join("");
					demo =
						`<i class="marker-huoyun-info-tip yjry"></i>
							<div class="marker-huoyun-info">
								<div class="top">
									<div class="pic yjry"></div>
									<div class="tit"><h3>站段应急人员基本情况</h3><h4>站名:${rdata[0].DW}</h4></div>
								</div>
							<div id="tf_sbss_yjcl1" class="detail-item show"  style="height:160px;overflow:auto">
								<table class="detail-table" cellpadding="0" cellspacing="0">
									<thead><tr><th>姓名</th><th>性别</th><th>职务</th><th>路电</th><th>手机</th></tr></thead>
									<tbody>${tbody}</tbody>
								</table>
							</div>
							</div>`;;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}else if(type === "机具备料"){
			lay = {
				x: 95,
				w: 420,
				h: 340
			};
			C.getDataP123({
				c: "tyzd_ggy2090",
				s: [
					[data.STATION],[data.STATION]
				],
				a: "机具备料详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					const tbody = r["2"].map((v, i) =>
						`<tr><td>${v.JGCL}</td><td>${v.CLDW}</td><td>${v.SL}</td><td>${v.JGGJ}</td></tr>`).join("");
					demo =
						`<i class="marker-huoyun-info-tip jjbl"></i>
							<div class="marker-huoyun-info jjbl">
								<table border="0" cellpadding="0" cellspacing="0">
									<tbody>
										<tr>
											<td><div class="log"></div><!--<div class="sub-tit">123123</div>--></td>
											<td><div class="top"><div class="tit">机具备料</div><div class="tit2"></div></div></td>
										</tr>
										<tr><td colspan="3" class="line-v">
											<div class="tab">
												<span class="active" onclick="chooseTfTab(this,'tf_sbss_yjcl1')">站段信息</span>
												<span class="" onclick="chooseTfTab(this,'tf_sbss_yjcl2')">材料信息</span>
											</div>
										</td></tr>
										<tr><td colspan="3">
											<div id="tf_sbss_yjcl1" class="detail-item show"  >
												<div class="list-item auto"><span>站段:</span><label class="blue">${rdata[0].DW}</label></div>
												<div class="list-item auto"><span>装车站:</span><label class="blue">${rdata[0].STATION}</label></div>
												<div class="list-item auto"><span>货装领导路电:</span><label class="orange">${rdata[0].HZLD}</label></div>
												<div class="list-item auto"><span>货运管理部部长路电:</span><label class="blue">${rdata[0].HYGL}</label></div>
												<div class="list-item auto"><span>装载加固主管路电:</span><label class="blue">${rdata[0].ZZJG}</label></div>
												<div class="list-item auto"><span>装卸管理部部长:</span><label class="blue">${rdata[0].ZXGL}</label></div>
												<div class="list-item auto"><span>车务段（站）值班室:</span><label class="blue">${rdata[0].ZBS}</label></div>
												<div class="list-item auto"><span>车站备注:</span><label class="blue">${rdata[0].CZBZ}</label></div>
											</div>
											<div id="tf_sbss_yjcl2" class="detail-item" style="height:190px;overflow:auto">
												<table class="detail-table" cellpadding="0"  cellspacing="0">
													<thead><tr><th>加固材料名称</th><th>单位</th><th>数量</th><th>加固工具</th></tr></thead>
													<tbody>${tbody}</tbody>
												</table>
											</div>
										</td></tr>
									</tbody>
								</table>
							</div>`;;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}else if(type === "应急劳力"){
			lay = {
				x: 95,
				w: 420,
				h: 340
			};
			C.getDataP123({
				c: "tyzd_ggy2092",
				s: [
					[data.PK_ID]
				],
				a: "应急劳力详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					demo =
						`<i class="marker-huoyun-info-tip yjll"></i>
							<div class="marker-huoyun-info">
								<div class="top">
									<div class="pic yjll"></div>
									<div class="tit"><h3>应急劳力详情</h3><h4>站名:${rdata[0].DW}</h4></div>
								</div>
								<div class="list-item  "><span>装卸应急负责人姓名:</span><label class="blue">${rdata[0].FZR_NAME}</label></div>
								<div class="list-item  "><span>装卸应急负责人部门:</span><label class="orange">${rdata[0].FZR_BM}</label></div>
								<div class="list-item "><span>装卸应急负责人职务:</span><label class="blue">${rdata[0].FZR_ZW}</label></div>
								<div class="list-item "><span>装卸应急负责人联系电话:</span><label class="blue">${rdata[0].FZR_DH}</label></div>
								<div class="list-item "><span>车站数:</span><label class="blue">${rdata[0].STATION_SUM}</label></div>
								<div class="list-item "><span>人员合计:</span><label class="orange">${rdata[0].PEOPLE_SUM}</label></div>
								<div class="list-item "><span>人数及分布地点:</span><label class="blue">${rdata[0].PEOPLE_NUM}</label></div>
							</div>`;;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}else if(type === "应急装卸机械"){
			lay = {
				x: 95,
				w: 420,
				h: 340
			};
			C.getDataP123({
				c: "tyzd_ggy2094",
				s: [
					[data.PK_ID]
				],
				a: "应急装卸机械详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					demo =
						`<i class="marker-huoyun-info-tip yjzxjx"></i>
							<div class="marker-huoyun-info">
								<div class="top">
									<div class="pic yjzxjx"></div>
									<div class="tit"><h3>应急装卸机械详情</h3><h4>站名:${rdata[0].DW}</h4></div>
								</div>
								<div class="list-item auto "><span>装卸应急负责人姓名:</span><label class="blue">${rdata[0].FZR_NAME}</label></div>
								<div class="list-item auto "><span>装卸应急负责人部门:</span><label class="orange">${rdata[0].FZR_BM}</label></div>
								<div class="list-item auto"><span>装卸应急负责人职务:</span><label class="blue">${rdata[0].FZR_JOB}</label></div>
								<div class="list-item auto"><span>装卸应急负责人手机号:</span><label class="blue">${rdata[0].FZR_PHONE}</label></div>
								<div class="list-item auto"><span>机械名称:</span><label class="blue">${rdata[0].MACHINE_NAME}</label></div>
								<div class="list-item auto"><span>规格型号:</span><label class="orange">${rdata[0].MACHINE_TYPE}</label></div>
								<div class="list-item auto"><span>作业站:</span><label class="blue">${rdata[0].WORK_STATION}</label></div>
								<div class="list-item auto"><span>主要用途:</span><label class="orange">${rdata[0].MACHINE_USE}</label></div>
								<div class="list-item auto"><span>台数:</span><label class="blue">${rdata[0].MACHINE_NUM}</label></div>
							</div>`;;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}else if(type === "社会机械资源"){
			lay = {
				x: 95,
				w: 420,
				h: 360
			};
			C.getDataP123({
				c: "tyzd_ggy2096",
				s: [
					[data.PK_ID]
				],
				a: "社会机械资源详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					demo =
						`<i class="marker-huoyun-info-tip shjxzy"></i>
							<div class="marker-huoyun-info">
								<div class="top">
									<div class="pic shjxzy"></div>
									<div class="tit"><h3>社会机械资源详情</h3><h4>${rdata[0].DW}</h4></div>
								</div>
								<div class="list-item  "><span>车站:</span><label class="blue">${rdata[0].STATION}</label></div>
								<div class="list-item  "><span>车站联系人姓名:</span><label class="orange">${rdata[0].STATION_PEOPLE}</label></div>
								<div class="list-item "><span>车站联系人手机号:</span><label class="blue">${rdata[0].STATION_PHONE}</label></div>
								<div class="list-item "><span>配合单位名称:</span><label class="blue">${rdata[0].SOCIAL_DW}</label></div>
								<div class="list-item "><span>可配合汽车吊联系人:</span><label class="blue">${rdata[0].SOCIAL_PEOPLE}</label></div>
								<div class="list-item "><span>可配合汽车吊联系人手机号:</span><label class="orange">${rdata[0].SOCIAL_PHONE}</label></div>
								<div class="list-item "><span>汽车吊规格型号:</span><label class="blue">${rdata[0].MACHIEN_TYPE}</label></div>
								<div class="list-item "><span>台数:</span><label class="orange">${rdata[0].MACHINE_NUM}</label></div>
								<div class="list-item "><span>起重能力:</span><label class="blue">${rdata[0].MACHINE_USE}</label></div>
								<div class="list-item "><span>配合单位离联系车站距离（km）:</span><label class="blue">${rdata[0].DISTANCE}</label></div>
								<div class="list-item "><span>录入时间:</span><label class="orange">${rdata[0].INPUT_DATE}</label></div>
							</div>`;;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}else if(type === "危险货物办理站"){
			lay = {
				x: 95,
				w: 540,
				h: 540
			};
			C.getDataP123({
				c: "tyzd_ggy2098",
				s: [
					[data.STATION]
				],
				a: "危险货物办理站详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					const options = rdata.map((v, i) => `<option value="${v.ZM+i}">${v.ZYX}</option>`).join("");
					const htmls = rdata.map((v, i) =>
						`<div id="hy_cx_dljc_yxqk_detail_${v.ZM+i}" class="hy_cx_dljc_yxqk_detail" style="height:400px;overflow:auto">
							<div class="list-item auto"><span>站段:</span><label class="orange">${v.ZD}</label></div>
							<div class="list-item auto"><span>站名:</span><label class="orange">${v.ZM}</label></div>
							<div class="list-item auto"><span>行政区域所属:</span><label class="orange">${v.XZQY}</label></div>
							<div class="list-item auto"><span>危险货物到发主要品名:</span><label class="orange">${v.WXHW}</label></div>
							<div class="list-item auto"><span>车站（专用线）值班路电:</span><label class="orange">${v.CZLD}</label></div>
							<div class="list-item auto"><span>车站（专用线）值班市电:</span><label class="orange">${v.CZSD}</label></div>
							<div class="list-item auto inline"><span>站长（主管站长）姓名:</span><label class="orange">${v.ZZXM}</label></div>
							<div class="list-item auto"><span>站长（主管站长）路电:</span><label class="orange">${v.ZZLD}</label></div>
							<div class="list-item auto"><span>站长（主管站长）市电:</span><label class="orange">${v.ZZSD}KM</label></div>
							<div class="list-item auto"><span>站长（主管站长）手机号:</span><label class="orange">${v.ZZSJ}</label></div>
							<div class="list-item auto"><span>货运负责人姓名:</span><label class="orange">${v.HYXM}</label></div>
							<div class="list-item auto"><span>货运负责人路电:</span><label class="orange">${v.HYLD}</label></div>
							<div class="list-item auto"><span>货运负责人市电:</span><label class="orange">${v.HYSD}</label></div>
							<div class="list-item auto inline"><span>货运负责人手机号:</span><label class="orange">${v.HYSJ}</label></div>
							<div class="list-item auto"><span>货运负责人姓名:</span><label class="orange">${v.ZYXXM}</label></div>
							<div class="list-item auto"><span>货运负责人市电:</span><label class="orange">${v.ZYXSD}KM</label></div>
							<div class="list-item auto"><span>货运负责人手机号:</span><label class="orange">${v.ZYXSJ}</label></div>
							<div class="list-item "><span>应急备品种类及数量:</span><label class="orange">${v.YJBP}</label></div>
							<div class="list-item "><span>专业救援队伍名称及联系电话:</span><label class="orange">${v.JYD}</label></div>
							<div class="list-item "><span>录入时间:</span><label class="orange">${v.INPUT_DATE}</label></div>
						</div>`
					).join("");
					demo =
						`<i class="marker-huoyun-info-tip wxhwblz"></i>
							<div class="marker-huoyun-info">
								<div class="top">
									<div class="pic wxhwblz"></div>
									<div class="tit"><h3>危险货物办理站详情</h3><h4>${rdata[0].ZD}</h4></div>
								</div>
								<div class="list-item"><span>专用线:</span><select class="select-item" onChange="chooseTfTab(this.value,'危险货物办理站详情')">${options}</select></div>
								${htmls}
							</div>`;;
					addPop(demo)
					chooseTfTab(rdata[0].ZM+0,'危险货物办理站详情')
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}else if(type === "易腐货物办理站"){
			lay = {
				x: 95,
				w: 420,
				h: 240
			};
			C.getDataP123({
				c: "tyzd_ggy2100",
				s: [
					[data.PK_ID]
				],
				a: "易腐货物办理站详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					const rdata = r["1"];
					demo =
						`<i class="marker-huoyun-info-tip yfhwblz"></i>
							<div class="marker-huoyun-info">
								<div class="top">
									<div class="pic yfhwblz"></div>
									<div class="tit"><h3>易腐货物办理站详情</h3><h4></h4></div>
								</div>
								<div class="list-item auto "><span>车站:</span><label class="blue">${rdata[0].STATION}</label></div>
								<div class="list-item auto "><span>专用线类型:</span><label class="orange">${rdata[0].ZYX_TYPE}</label></div>
								<div class="list-item auto"><span>专用线:</span><label class="blue">${rdata[0].ZYX}</label></div>
								<div class="list-item auto"><span>40（45）英尺箱:</span><label class="blue">${rdata[0].BOX}</label></div>
								<div class="list-item "><span>录入时间:</span><label class="blue">${rdata[0].INPUT_DATE}</label></div>
							</div>`;;
					addPop(demo)
				} else {
					$vm.$message({
						message: '未查询到相关数据',
						type: 'warning'
					});
				}
			})
		}
	},
	chooseTfTab(el, elid) {
		if ( elid === "危险货物办理站详情") {
			$(".hy_cx_dljc_yxqk_detail").removeClass("show");
			$("#hy_cx_dljc_yxqk_detail_" + el).addClass("show");
			return;
		}
		$(el).siblings().removeClass("active");
		$(el).addClass("active");
		$(".marker-huoyun-info .detail-item").removeClass("show");
		$("#" + elid).addClass("show");
	},

	getHyz() {
		if (this.getDataFlag_getHyz) {
			return
		}
		this.getDataFlag_getHyz = true
		C.getDataP123({
			c: "tyzd_ggy2085",
			a: "货运站基本情况位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_hyz(r[1]); //创建车站
		});
	},
	getYjry() {
		if (this.getDataFlag_getYjry) {
			return
		}
		this.getDataFlag_getYjry = true
		C.getDataP123({
			c: "tyzd_ggy2087",
			a: "站段应急人员位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_marker(r[1],'yjry'); //创建车站
		});
	},
	
	getJjbl() {
		if (this.getDataFlag_getJjbl) {
			return
		}
		this.getDataFlag_getJjbl = true
		C.getDataP123({
			c: "tyzd_ggy2089",
			a: "机具备料位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_marker(r[1],'jjbl'); //创建车站
		});
	},
	getYjll() {
		if (this.getDataFlag_getYjll) {
			return
		}
		this.getDataFlag_getYjll = true
		C.getDataP123({
			c: "tyzd_ggy2091",
			a: "应急劳力位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_marker(r[1],'yjll'); //创建车站
		});
	},
	getYjzxjx() {
		if (this.getDataFlag_getYjzxjx) {
			return
		}
		this.getDataFlag_getYjzxjx = true
		C.getDataP123({
			c: "tyzd_ggy2093",
			a: "应急装卸机械位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_marker(r[1],'yjzxjx'); //创建车站
		});
	},
	getShjxzy() {
		if (this.getDataFlag_getShjxzy) {
			return
		}
		this.getDataFlag_getShjxzy = true
		C.getDataP123({
			c: "tyzd_ggy2095",
			a: "社会机械资源位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_marker(r[1],'shjxzy'); //创建车站
		});
	},
	getWxhwblz() {
		if (this.getDataFlag_getWxhwblz) {
			return
		}
		this.getDataFlag_getWxhwblz = true
		C.getDataP123({
			c: "tyzd_ggy2097",
			a: "危险货物办理站位置",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_marker(r[1],'wxhwblz'); //创建车站
		});
	},
	getYfhwblzy() {
		if (this.getDataFlag_getYfhwblzy) {
			return
		}
		this.getDataFlag_getYfhwblzy = true
		C.getDataP123({
			c: "tyzd_ggy2099",
			a: "易腐货物办理站",
			s: [],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			this.creatMarker_marker(r[1],'yfhwblz'); //创建车站
		});
	},
	
	
	
}
