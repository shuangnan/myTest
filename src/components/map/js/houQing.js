/**
 * 后勤
 */
import C from "../../../assets/com.js";
let $vm = null;
const isPolice = window.location.pathname.includes("/police.html")
export default {
	getDataFlag: false, // 是否已调用接口
	data: {
		houQing_layers: {
			xiaoxue: L.layerGroup(), //小学
			zhongxue: L.layerGroup(), //中学
			gaozhong: L.layerGroup(), //高中
			zhongxiaoxue: L.layerGroup(), //九年一贯制学校(中小学)
			chugaozhong: L.layerGroup(), //完全中学(初高中)
		},
		houQingOther: {
			xiaoxue: false,
			zhongxue: false,
			gaozhong: false,
			zhongxiaoxue: false,
			chugaozhong: false,
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.houqing_xuexiao.register) {
			return;
		}
		// 设置默认值
		this.data.houQingOther.xiaoxue = $vm.config.houqing_xuexiao.xiaoxue; //后勤-小学
		this.data.houQingOther.zhongxue = $vm.config.houqing_xuexiao.zhongxue; //后勤-中学
		this.data.houQingOther.gaozhong = $vm.config.houqing_xuexiao.gaozhong; //后勤-高中
		this.data.houQingOther.zhongxiaoxue = $vm.config.houqing_xuexiao.zhongxiaoxue; //后勤-九年一贯制学校(中小学)
		this.data.houQingOther.chugaozhong = $vm.config.houqing_xuexiao.chugaozhong; //后勤-完全中学(初高中)
		this.initData();
	},
	// 初始化数据
	initData() {
		if (this.data.houQingOther.xiaoxue ||
			this.data.houQingOther.zhongxue ||
			this.data.houQingOther.gaozhong ||
			this.data.houQingOther.zhongxiaoxue ||
			this.data.houQingOther.chugaozhong) {
			this.getData_xueXiao();
		}
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 过滤图层元素
	filterLayer(qu) {
		// 若未获取过数据,则先获取数据
		if (this.getDataFlag === false) {
			this.getData_xueXiao();
			return;
		}
		if (this.data.houQingOther.xiaoxue) {
			$vm.map.addLayer(this.data.houQing_layers.xiaoxue);
		} else {
			$vm.map.removeLayer(this.data.houQing_layers.xiaoxue);
		}
		if (this.data.houQingOther.zhongxue) {
			$vm.map.addLayer(this.data.houQing_layers.zhongxue);
		} else {
			$vm.map.removeLayer(this.data.houQing_layers.zhongxue);
		}
		if (this.data.houQingOther.gaozhong) {
			$vm.map.addLayer(this.data.houQing_layers.gaozhong);
		} else {
			$vm.map.removeLayer(this.data.houQing_layers.gaozhong);
		}
		if (this.data.houQingOther.zhongxiaoxue) {
			$vm.map.addLayer(this.data.houQing_layers.zhongxiaoxue);
		} else {
			$vm.map.removeLayer(this.data.houQing_layers.zhongxiaoxue);
		}
		if (this.data.houQingOther.chugaozhong) {
			$vm.map.addLayer(this.data.houQing_layers.chugaozhong);
		} else {
			$vm.map.removeLayer(this.data.houQing_layers.chugaozhong);
		}
	},
	creatMarker_xuexiao(source) {
		this.data.houQing_layers.xiaoxue = L.layerGroup();
		this.data.houQing_layers.zhongxue = L.layerGroup();
		this.data.houQing_layers.gaozhong = L.layerGroup();
		this.data.houQing_layers.zhongxiaoxue = L.layerGroup();
		this.data.houQing_layers.chugaozhong = L.layerGroup();
		this.data.houQing_layers.xiaoxue.addTo($vm.map);
		this.data.houQing_layers.zhongxue.addTo($vm.map);
		this.data.houQing_layers.gaozhong.addTo($vm.map);
		this.data.houQing_layers.zhongxiaoxue.addTo($vm.map);
		this.data.houQing_layers.chugaozhong.addTo($vm.map);
		source.forEach(item => {
			// PKID: "2203070909141171873"
			// SCHOOL_ADDRESS: "都江堰市永丰路218号"
			// SCHOOL_LAT: "30.980186"
			// SCHOOL_LON: "103.66185"
			// SCHOOL_NAME: "都江堰市嘉祥外国语学校"
			let cls = "zhongxue";
			let group = this.data.houQing_layers.xiaoxue;
			if (item.SCHOOL_KIND === "小学") {
				cls = "xiaoxue";
				this.data.houQing_layers.xiaoxue;
			} else if (item.SCHOOL_KIND === "初中") {
				group = this.data.houQing_layers.zhongxue;
			} else if (item.SCHOOL_KIND === "高中") {
				group = this.data.houQing_layers.gaozhong;
			} else if (item.SCHOOL_KIND === "九年一贯制学校（中小学校）") {
				group = this.data.houQing_layers.zhongxiaoxue;
			} else if (item.SCHOOL_KIND === "完全中学（初中、高中）") {
				group = this.data.houQing_layers.chugaozhong;
			}
			const marker = L.marker([item.SCHOOL_LAT, item.SCHOOL_LON], {
				icon: L.divIcon({
					className: "houqing-icon-container",
					data: item,
					html: isPolice?`<div class="marker-hover houqing-marker-ga  ${cls}" style="position:relative"></div>`:`<div class="marker-hover houqing-marker  ${cls}" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("学校", item, p);
			})
			group.addLayer(marker);
		});
		this.filterLayer();
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
		if (type === "学校") {
			const cls = data.SCHOOL_NAME.indexOf("小") > -1 ? "xiaoxue" : "zhongxue";
			demo =
				`<i class="marker-houqing-info-tip ${cls}"></i>
				<div class="marker-houqing-info xuexiao">
					<table border="0" cellpadding="0" cellspacing="0">
						<tbody>
							<tr>
								<td><div class="pic ${cls}"></div></td>
								<td>
									<div class="tit">${data.SCHOOL_NAME}</div>
									<div class="sub-tit">${data.SCHOOL_ADDRESS}</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>`
			addPop(demo);
		}
	},
	// 查询学校
	getData_xueXiao() {
		if (this.getDataFlag) {
			return;
		}
		this.getDataFlag = true;
		if($vm.sys==="police"){
			C.getData({
				c: "eqeh_zxy2017",
				a: "查询学校",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				this.creatMarker_xuexiao(r); // 创建marker 学校
			});
		}else{
			C.getDataP123({
				c: "eqeh_zxy2017",
				a: "查询学校",
				url: C.ADDS.servGS, //接口地址
			}, (r) => {
				this.creatMarker_xuexiao(r["1"]); // 创建marker 学校
			});
		}
	},
}
