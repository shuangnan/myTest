/**
 * 设备设施
 */
import C from "../../../assets/com.js";
let $vm = null;
export default {
	data: {
		equipmentLayer: null,
		equipmentLayer_qiao:null,
		equipmentLayer_sui:null,
		iconUrl: {
			gongwugongqu: require("../img/equipment/工务工区.png"), //工务工区
			handong: require("../img/equipment/涵洞.png"), //涵洞
			jiechuwang: require("../img/equipment/接触网杆.png"), //接触网
			ruwangkou: require("../img/equipment/入网口.png"), //入网口
			suidao: require("../img/equipment/隧道.png"), //隧道
			tancezhan: require("../img/equipment/探测站.png"), //探测站
			xinhaoji: require("../img/equipment/信号机.png"), //信号机
		},
		otherTest: {
			gongwugongqu: true,//工务工区
			handong: true,//涵洞
			jiechuwang: true,//接触网
			ruwangkou: true,//入网口
			suidao: true,//隧道
			tancezhan: true,//探测站
			xinhaoji: true,//信号机
			qiaoliang:true,//桥梁
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.others.register) {
			return;
		}
		// 设置默认值
		this.data.otherTest.gongwugongqu = $vm.config.others.gongwugongqu;//工务工区
		this.data.otherTest.handong = $vm.config.others.handong;//涵洞
		this.data.otherTest.jiechuwang = $vm.config.others.jiechuwang;//接触网
		this.data.otherTest.ruwangkou = $vm.config.others.ruwangkou;//入网口
		this.data.otherTest.suidao = $vm.config.others.suidao;//隧道
		this.data.otherTest.tancezhan = $vm.config.others.tancezhan;//探测站
		this.data.otherTest.xinhaoji = $vm.config.others.xinhaoji;//信号机
		this.data.otherTest.qiaoliang = $vm.config.others.qiaoliang;//桥梁
		
		this.getEquipment();
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {
		// if (!$vm.config.qiaoSui.register) {
		// 	return;
		// }
	},
	// 过滤图层元素
	filterLayer() {
		const ks = ["gongwugongqu","handong","jiechuwang","ruwangkou","tancezhan","xinhaoji"];
		$.each(ks,(i,v)=>{
			if (this.data.otherTest[v]) {
				$(".equipment."+v).show();
			} else {
				$(".equipment."+v).hide();
			}
		});
		
		if (this.data.otherTest.suidao) {
			$vm.map.addLayer(this.data.equipmentLayer_sui);
		} else {
			$vm.map.removeLayer(this.data.equipmentLayer_sui);
		}
		if (this.data.otherTest.qiaoliang) {
			$vm.map.addLayer(this.data.equipmentLayer_qiao);
		} else {
			$vm.map.removeLayer(this.data.equipmentLayer_qiao);
		}
	},
	// 创建marker
	creatMarker(source) {
		this.data.equipmentLayer = L.layerGroup();
		this.data.equipmentLayer_qiao = L.layerGroup();
		this.data.equipmentLayer_sui = L.layerGroup();
		this.data.equipmentLayer.addTo($vm.map);
		this.data.equipmentLayer_qiao.addTo($vm.map);
		this.data.equipmentLayer_sui.addTo($vm.map);
		const suidao = [];
		const qiao = [];
		C.$.each(source, (index, item) => {
			item.LAT = parseFloat(item.LAT);
			item.LON = parseFloat(item.LON);
			 this.setEquipmentType(item);
			if (item.CENTER_MILES.indexOf("隧道") > -1) {
				suidao.push(item);
			} else if (item.CENTER_MILES.indexOf("桥头") > -1) {
				qiao.push(item);
			}
			if (item.CENTER_MILES.indexOf("桥头") < 0) {
				let marker = null;
				if (item.type === "") {
					marker = L.marker([item.LAT, item.LON]).bindPopup(item.CENTER_MILES);
				} else {
					marker = L.marker([item.LAT, item.LON], {
						icon: L.icon({
							className: "equipment "+item.type,
							iconUrl: this.data.iconUrl[item.type],
							iconSize: [30, 30],
							iconAnchor: [15, 30], //marker偏移
							popupAnchor: [-15, -30], //提示内容偏移
							data: item
						})
					}).bindPopup(item.CENTER_MILES);
				}
				if(item.type==="suidao"){
					this.data.equipmentLayer_sui.addLayer(marker);
				}else{
					// this.data.equipmentLayer.addLayer(marker);
				}
			}
		});
		
		// 桥
		for (let i = 0; i < qiao.length; i++) {
			if (i % 2 === 0) {
				let marker = L.polyline([
					[qiao[i].LAT, qiao[i].LON],
					[qiao[i + 1].LAT, qiao[i + 1].LON]
				], {
					color: "#FF9966",
					weight: 5
				}).bindPopup(qiao[i].CENTER_MILES + "<br/>" + qiao[i + 1].CENTER_MILES);
				this.data.equipmentLayer_qiao.addLayer(marker);
			}
		}
		// 隧道
		for (let i = 0; i < suidao.length; i++) {
			if (i % 2 === 0) {
				let marker = L.polyline([
					[suidao[i].LAT, suidao[i].LON],
					[suidao[i + 1].LAT, suidao[i + 1].LON]
				], {
					color: "#6c00d8",
					weight: 5
				}).bindPopup(suidao[i].CENTER_MILES + "<br/>" + suidao[i + 1].CENTER_MILES);

				this.data.equipmentLayer_sui.addLayer(marker);
			}
		}
		this.filterLayer();
	},
	// 绑定marker点击事件---桥遂
	setMarkerClick_qiaoSui(marker, data) {},
	setEquipmentType(data) {
		if (data.CENTER_MILES.indexOf("工务工区") > -1) {
			data.type = "gongwugongqu";
		} else if (data.CENTER_MILES.indexOf("涵洞") > -1) {
			data.type = "handong";
		} else if (data.CENTER_MILES.indexOf("接触网") > -1) {
			data.type = "jiechuwang";
		} else if (data.CENTER_MILES.indexOf("入网口") > -1) {
			data.type = "ruwangkou";
		} else if (data.CENTER_MILES.indexOf("隧道") > -1) {
			data.type = "suidao";
		} else if (data.CENTER_MILES.indexOf("探测站") > -1) {
			data.type = "tancezhan";
		} else if (data.CENTER_MILES.indexOf("信号机") > -1) {
			data.type = "xinhaoji";
		} else {
			data.type = "";
		}
	},
	// 获取设备
	getEquipment() {
		C.getDataP123({
			c: "eqeh_zxy2012",
			a: "获取设备",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				// const d = JSON.parse(r);
				this.creatMarker(r["1"]);
			} else {
				this.$notify.error({
					title: '提示',
					message: '获取设备信息数据异常'
				});
			}
		});
	},
}
