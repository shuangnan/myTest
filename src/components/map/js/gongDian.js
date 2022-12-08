/**
 * 供电
 */
import C from "../../../assets/com.js";
import mapUtil from "./mapUtil.js";
import ranging from "./ranging.js"; //测距
import drawRegion from "./drawRegion.js"; //画区域
let $vm = null;
export default {
	getDataFlag_getDataList: false, //是否已调用接口--
	getDataFlag_getTrain: false,
	getDataFlag_getZz: false, //是否已调用接口--
	getDataFlag_getWdq: false,
	getDataFlag_getGz: false,
	getDataFlag_getjcwSb171: false, //是否已调用接口--
	getDataFlag_getjcwSb169: false,
	getDataFlag_getjcwSb142: false, //是否已调用接口--
	getDataFlag_getjcwSb143: false,
	getDataFlag_getjcwSb144: false, //是否已调用接口--
	getDataFlag_getjcwSb149: false,
	getDataFlag_getjcwSb180: false, //是否已调用接口--
	getDataFlag_getjcwSb181: false,
	getDataFlag_getjcwSb172: false, //是否已调用接口--
	getDataFlag_getjcwSb173: false,
	getDataFlag_getGddRange: false, // 是否已调用获取管界接口 (by cpy, 2022-08-19)
	tempBoundGdb: L.layerGroup(), //供电臂管辖范围
	data: {
		initeZoom: 5, //接切换显示样式层级
		layer_gbb: null, //图层---供电臂
		layer_bds: null, //图层---变电所
		jymdgj: [],
		fjymdgj: [],
		fdjyq: [],
		fxjyq: [],
		gddlj: [],
		ckkg: [],
		cbkg: [],
		blq: [],
		gjsdfx: [],
		qjsdfx: [],
		xsxwz: [],
		gz: [],
		hntz: [],
		light: false,
		allTrain: [],
		useTrain: [],
		gongDian_layers: {
			gd_sbss: {
				ck_gdb: L.layerGroup(), //显示供电臂
				ck_gdd: [], // 供电系统各单位管辖范围 (by cpy, 2022-08-19)
				ck_jcwg: L.layerGroup(), //显示接触网杆
				ck_bds: L.layerGroup(), //显示变电所
				ck_dfx: L.layerGroup(), //显示电分相
				ck_gdgq: L.layerGroup(), //显示供电工区
				ck_cj: L.layerGroup(), //显示车间
				ck_td: L.layerGroup(), //显示停电
				ck_jjdd: L.layerGroup(), //显示间接带电
				ck_yl: L.layerGroup(), //显示远离
				ck_yjdy: L.layerGroup(), //显示远离
				ck_yjc: L.layerGroup(), //显示远离
			},
			gd_fw: {
				ck_gdb: L.layerGroup(), //显示供电臂范围
				ck_dfx: L.layerGroup(), //显示电分相范围
				ck_gqgx: L.layerGroup(), //显示工区管辖范围
				ck_wdq: L.layerGroup(), //显示无电区范围
			},
			gd_jcw: {
				ck_gz: L.layerGroup(), //显示钢柱
				ck_hntz: L.layerGroup(), //显示混凝土柱
				ck_fjymdgj: L.layerGroup(), //显示非绝缘锚段关节
				ck_jymdgj: L.layerGroup(), //显示绝缘锚段关节
				ck_fdjyq: L.layerGroup(), //显示分段绝缘器
				ck_fxjyq: L.layerGroup(), //显示分项绝缘器
				ck_gddlj: L.layerGroup(), //显示股道电连接
				ck_ckkg: L.layerGroup(), //显示常开开关
				ck_cbkg: L.layerGroup(), //显示常闭开关
				ck_blq: L.layerGroup(), //显示避雷器
				ck_xsxwz: L.layerGroup(), //显示吸上线位置
				ck_gjsdfx: L.layerGroup(),
				ck_qjsdfx: L.layerGroup(),
			}
		},
		gongDianOther: {
			regionPoints: [],
			ck_dfxXb: '', //电分相线别
			ck_yjc: '', //轨道车是否只显示可用
			gd_sbss: {
				ck_gdb: false, //显示供电臂
				ck_gdd: false, //显示供电系统各单位管辖范围 (by cpy, 2022-08-19)
				ck_jcwg: false, //显示接触网杆
				ck_bds: false, //显示变电所
				ck_dfx: false, //显示电分相
				ck_gdgq: false, //显示供电工区
				ck_cj: false, //显示车间
				ck_td: false, //显示停电
				ck_jjdd: false, //显示间接带电
				ck_yl: false, //显示远离
				ck_yjdy: false,
				ck_yjc: false, //应急车
			},
			// 供电——范围
			gd_fw: {
				ck_gdb: false, //显示供电臂范围
				ck_dfx: false, //显示电分相范围
				ck_gqgx: false, //显示工区管辖范围
				ck_wdq: false, //显示无电区范围
			},
			// 供电——接触网
			gd_jcw: {
				drawRegion: false, //框选范围
				ck_gz: false, //显示钢柱
				ck_hntz: false, //显示混凝土柱
				ck_fjymdgj: false, //显示非绝缘锚段关节
				ck_jymdgj: false, //显示绝缘锚段关节
				ck_fdjyq: false, //显示分段绝缘器
				ck_fxjyq: false, //显示分项绝缘器
				ck_gddlj: false, //显示股道电连接
				ck_ckkg: false, //显示常开开关
				ck_cbkg: false, //显示常闭开关
				ck_blq: false, //显示避雷器
				ck_xsxwz: false, //显示吸上线位置
				ck_gjsdfx: false,
				ck_qjsdfx: false,
			},
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		// 供电——设备设施		供电——范围		供电——轨道车
		if (!$vm.config.gd_sbss.register && !$vm.config.gd_fw.register && !$vm.config.gd_jcw.register) {
			return;
		}
		if ($vm.config.gd_jcw.register) {
			if (this.data.gongDianOther.gd_jcw.ck_blq) {
				// this.getjcwSb('143');
			}
		}
		// 设置默认值
		this.data.initeZoom = $vm.config.superMap.zoom;
		this.data.gongDianOther.gd_sbss.ck_gdb = $vm.config.gd_sbss.ck_gdb;
		this.data.gongDianOther.gd_sbss.ck_gdd = $vm.config.gd_sbss.ck_gdd;
		this.data.gongDianOther.gd_sbss.ck_jcwg = $vm.config.gd_sbss.ck_jcwg;
		this.data.gongDianOther.gd_sbss.ck_bds = $vm.config.gd_sbss.ck_bds;
		this.data.gongDianOther.gd_sbss.ck_dfx = $vm.config.gd_sbss.ck_dfx;
		this.data.gongDianOther.gd_sbss.ck_gdgq = $vm.config.gd_sbss.ck_gdgq;
		this.data.gongDianOther.gd_sbss.ck_cj = $vm.config.gd_sbss.ck_cj;
		this.data.gongDianOther.gd_sbss.ck_td = $vm.config.gd_sbss.ck_td;
		this.data.gongDianOther.gd_sbss.ck_jjdd = $vm.config.gd_sbss.ck_jjdd;
		this.data.gongDianOther.gd_sbss.ck_yl = $vm.config.gd_sbss.ck_yl;
		this.data.gongDianOther.gd_sbss.ck_yjdy = $vm.config.gd_sbss.ck_yjdy;
		this.data.gongDianOther.gd_sbss.ck_yjc = $vm.config.gd_sbss.ck_yjc;
		this.data.gongDianOther.ck_yjc = $vm.config.gd_sbss.ck_yjctype;

		this.data.light = $vm.config.superMap.lightMode

		this.data.gongDianOther.gd_fw.ck_gdb = $vm.config.gd_fw.ck_gdb;
		this.data.gongDianOther.gd_fw.ck_dfx = $vm.config.gd_fw.ck_dfx;
		this.data.gongDianOther.gd_fw.ck_gqgx = $vm.config.gd_fw.ck_gqgx;
		this.data.gongDianOther.gd_fw.ck_wdq = $vm.config.gd_fw.ck_wdq;


		this.data.gongDianOther.ck_dfxXb = $vm.config.gd_jcw.ck_dfxXb;
		this.data.gongDianOther.gd_jcw.ck_gz = $vm.config.gd_jcw.ck_gz;
		this.data.gongDianOther.gd_jcw.ck_hntz = $vm.config.gd_jcw.ck_hntz;
		this.data.gongDianOther.gd_jcw.ck_fjymdgj = $vm.config.gd_jcw.ck_fjymdgj;
		this.data.gongDianOther.gd_jcw.ck_jymdgj = $vm.config.gd_jcw.ck_jymdgj;
		this.data.gongDianOther.gd_jcw.ck_fdjyq = $vm.config.gd_jcw.ck_fdjyq;
		this.data.gongDianOther.gd_jcw.ck_fxjyq = $vm.config.gd_jcw.ck_fxjyq;
		this.data.gongDianOther.gd_jcw.ck_gddlj = $vm.config.gd_jcw.ck_gddlj;
		this.data.gongDianOther.gd_jcw.ck_ckkg = $vm.config.gd_jcw.ck_ckkg;
		this.data.gongDianOther.gd_jcw.ck_cbkg = $vm.config.gd_jcw.ck_cbkg;
		this.data.gongDianOther.gd_jcw.ck_blq = $vm.config.gd_jcw.ck_blq;
		this.data.gongDianOther.gd_jcw.ck_xsxwz = $vm.config.gd_jcw.ck_xsxwz;
		this.data.gongDianOther.gd_jcw.ck_gjsdfx = $vm.config.gd_jcw.ck_gjsdfx;
		this.data.gongDianOther.gd_jcw.ck_qjsdfx = $vm.config.gd_jcw.ck_qjsdfx;

		// 默认显示供电系统管辖范围时，加载管界数据
		// by cpy, 2022-08-19
		if ($vm.config.gd_sbss.register && this.data.gongDianOther.gd_sbss.ck_gdd) {
			// this.getDataFlag_getGddRange = true
			this.getGddRange()
		}
		// “1”：工区管辖范围	“2”：变电所  “3”：供电臂  “4”：电分相  "5":DC600V应急电源
		if (($vm.config.gd_sbss.register || $vm.config.gd_fw.register) && (this.data.gongDianOther.gd_fw.ck_gqgx || this.data
				.gongDianOther.gd_sbss.ck_gdb || this.data.gongDianOther.gd_sbss.ck_bds || this.data.gongDianOther.gd_sbss.ck_dfx ||
				this.data.gongDianOther.gd_sbss.ck_yjdy)) {
			this.getDataList();
		}
		if ($vm.config.gd_sbss.register && this.data.gongDianOther.gd_sbss.ck_yjc) {
			this.getTrain(); //获取应急车
		}

		// 		if ($vm.config.gd_jcw.register && this.data.gongDianOther.gd_jcw.ck_gz) {
		// 			this.getZz()
		// 		}
		if ($vm.config.gd_fw.register && this.data.gongDianOther.gd_fw.ck_wdq) {
			this.getWdq();
		}

		if ($vm.config.gd_jcw.register) {
			// 			if ($vm.config.gd_jcw.ck_gz) {
			// 				this.getGz(); //钢柱
			// 			}
			if ($vm.config.gd_jcw.ck_fjymdgj) {
				this.getjcwSb('171'); //非绝缘锚段关节
			}
			if ($vm.config.gd_jcw.ck_jymdgj) {
				this.getjcwSb('169'); //绝缘锚段关节
			}
			if ($vm.config.gd_jcw.ck_fdjyq) {
				this.getjcwSb('142'); //分段绝缘器
			}
			if ($vm.config.gd_jcw.ck_gddlj) {
				this.getjcwSb('145'); //股道点连接
			}
			if ($vm.config.gd_jcw.ck_blq) {
				this.getjcwSb('143'); //避雷器
			}
			if ($vm.config.gd_jcw.ck_xsxwz) {
				this.getjcwSb('144'); //吸上线位置
			}
			if ($vm.config.gd_jcw.ck_fxjyq) {
				// this.getjcwSb('149'); //分相绝缘器
			}
			if ($vm.config.gd_jcw.ck_ckkg) {
				this.getjcwSb('180'); //常开开关
			}
			if ($vm.config.gd_jcw.ck_cbkg) {
				this.getjcwSb('181'); //常闭开关
			}
			if ($vm.config.gd_jcw.ck_gjsdfx) {
				this.getjcwSb('172'); //关节式电分相
			}
			if ($vm.config.gd_jcw.ck_qjsdfx) {
				this.getjcwSb('173'); //器件式电分相
			}
		}
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 地图缩放事件
	onMapZoomend(newZoom, oldZoom, e) {
		this.data.initeZoom = newZoom;
	},
	// 过滤图层元素
	filterLayer(ty, line) {
		if (ty === "供电_设备设施") {
			/**
			 * 显示供电系统管界范围
			 * by cpy, 2022-08-19
			 */
			if (this.data.gongDianOther.gd_sbss.ck_gdd) {
				if (!this.getDataFlag_getGddRange) {
					// 未获取管界数据时先获取数据
					this.getGddRange()
					return;
				}
				// 筛选选定的单位管界
				this.data.gongDian_layers.gd_sbss.ck_gdd.map((layer) => {
					if (layer.show) {
						$vm.map.addLayer(layer.layer)
						$vm.map.addLayer(layer.nameLayer)
					} else {
						$vm.map.removeLayer(layer.layer)
						$vm.map.removeLayer(layer.nameLayer)
					}
				})
			} else {
				this.data.gongDian_layers.gd_sbss.ck_gdd.map((layer) => {
					$vm.map.removeLayer(layer.layer)
					$vm.map.removeLayer(layer.nameLayer)
				})
				// $vm.map.removeLayer(this.data.gongDian_layers.gd_sbss.ck_gdd)
			}
			if (this.getDataFlag_getDataList == false) {
				this.getDataList();
				return
			}
			if (this.data.gongDianOther.gd_sbss.ck_gdb) {
				$vm.map.addLayer(this.data.gongDian_layers.gd_sbss.ck_gdb);
			} else {
				this.tempBoundGdb && this.tempBoundGdb.remove(); //删除
				$vm.map.removeLayer(this.data.gongDian_layers.gd_sbss.ck_gdb);
			}
			if (this.data.gongDianOther.gd_sbss.ck_bds) {
				$vm.map.addLayer(this.data.gongDian_layers.gd_sbss.ck_bds);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_sbss.ck_bds);
			}
			if (this.data.gongDianOther.gd_sbss.ck_dfx) {
				$vm.map.addLayer(this.data.gongDian_layers.gd_sbss.ck_dfx);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_sbss.ck_dfx);
			}
			if (this.data.gongDianOther.gd_sbss.ck_yjdy) {
				$vm.map.addLayer(this.data.gongDian_layers.gd_sbss.ck_yjdy);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_sbss.ck_yjdy);
			}
			if (this.data.gongDianOther.gd_sbss.ck_yjc) {
				if (this.getDataFlag_getTrain == false) {
					this.getTrain();
					return
				}
				$vm.map.removeLayer(this.data.gongDian_layers.gd_sbss.ck_yjc);
				this.creatMarker_Train();
				// $vm.map.addLayer(this.data.gongDian_layers.gd_sbss.ck_yjc);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_sbss.ck_yjc);
			}
		}
		if (ty === "供电_范围") {
			if (this.data.gongDianOther.gd_fw.ck_gqgx) {
				if (this.getDataFlag_getDataList == false) {
					this.getDataList()
					return
				}
				$vm.map.addLayer(this.data.gongDian_layers.gd_fw.ck_gqgx);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_fw.ck_gqgx);
			}
			if (this.data.gongDianOther.gd_fw.ck_wdq) {
				if (this.getDataFlag_getWdq == false) {
					this.getWdq()
					return
				}
				$vm.map.addLayer(this.data.gongDian_layers.gd_fw.ck_wdq);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_fw.ck_wdq);
			}
		}
		if (ty === "供电_接触网") {
			// if (this.data.initeZoom >= 2) {
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_blq);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fjymdgj);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_jymdgj);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fdjyq);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gddlj);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_xsxwz);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_cbkg);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_ckkg);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fxjyq);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_cbkg);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_qjsdfx);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gjsdfx);
			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gz);
			if (this.data.gongDianOther.gd_jcw.ck_blq) {
				if (this.getDataFlag_getjcwSb143 == false) {
					this.getjcwSb('143')
					return
				}
				var arr = [];
				for (var i = 0; i < this.blq.length; i++) {
					if (this.isPointInPoly(this.blq[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.blq[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "blq");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_blq);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_blq);
			}
			if (this.data.gongDianOther.gd_jcw.ck_fjymdgj) {
				if (this.getDataFlag_getjcwSb171 == false) {
					this.getjcwSb('171')
					return
				}
				var arr = [];
				for (var i = 0; i < this.fjymdgj.length; i++) {
					if (this.isPointInPoly(this.fjymdgj[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.fjymdgj[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "fjymdgj");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_fjymdgj);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fjymdgj);
			}
			if (this.data.gongDianOther.gd_jcw.ck_jymdgj) {
				if (this.getDataFlag_getjcwSb169 == false) {
					this.getjcwSb('169')
					return
				}
				var arr = [];
				for (var i = 0; i < this.jymdgj.length; i++) {
					if (this.isPointInPoly(this.jymdgj[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.jymdgj[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "jymdgj");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_jymdgj);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_jymdgj);
			}
			if (this.data.gongDianOther.gd_jcw.ck_fdjyq) {
				if (this.getDataFlag_getjcwSb142 == false) {
					this.getjcwSb('142')
					return
				}
				var arr = [];
				for (var i = 0; i < this.fdjyq.length; i++) {
					if (this.isPointInPoly(this.fdjyq[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.fdjyq[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "fdjyq");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_fdjyq);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fdjyq);
			}
			if (this.data.gongDianOther.gd_jcw.ck_fxjyq) {
				// if (this.getDataFlag_getjcwSb149 == false) {
				if (this.data.gongDianOther.ck_dfxXb != "") {
					this.getjcwSb('173', this.data.gongDianOther.ck_dfxXb)
				}

				// return
				// }
				// 					var arr = [];
				// 					for (var i = 0; i < this.fxjyq.length; i++) {
				// 						if (this.isPointInPoly(this.fxjyq[i], this.data.gongDianOther.regionPoints)) {
				// 							arr.push(this.fxjyq[i]);
				// 						}
				// 					}
				// this.creatMarker_jcwsb(arr, "fxjyq");
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fxjyq);
			}
			if (this.data.gongDianOther.gd_jcw.ck_gddlj) {
				if (this.getDataFlag_getjcwSb145 == false) {
					this.getjcwSb('145')
					return
				}
				var arr = [];
				for (var i = 0; i < this.gddlj.length; i++) {
					if (this.isPointInPoly(this.gddlj[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.gddlj[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "gddlj");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_gddlj);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gddlj);
			}
			if (this.data.gongDianOther.gd_jcw.ck_xsxwz) {
				if (this.getDataFlag_getjcwSb144 == false) {
					this.getjcwSb('144')
					return
				}
				var arr = [];
				for (var i = 0; i < this.xsxwz.length; i++) {
					if (this.isPointInPoly(this.xsxwz[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.xsxwz[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "xsxwz");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_xsxwz);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_xsxwz);
			}
			if (this.data.gongDianOther.gd_jcw.ck_ckkg) {
				if (this.getDataFlag_getjcwSb180 == false) {
					this.getjcwSb('180')
					return
				}
				var arr = [];
				for (var i = 0; i < this.ckkg.length; i++) {
					if (this.isPointInPoly(this.ckkg[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.ckkg[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "ckkg");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_ckkg);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_ckkg);
			}
			if (this.data.gongDianOther.gd_jcw.ck_cbkg) {
				if (this.getDataFlag_getjcwSb181 == false) {
					this.getjcwSb('181')
					return
				}
				var arr = [];
				for (var i = 0; i < this.cbkg.length; i++) {
					if (this.isPointInPoly(this.cbkg[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.cbkg[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "cbkg");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_cbkg);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_cbkg);
			}
			if (this.data.gongDianOther.gd_jcw.ck_gjsdfx) {
				if (this.getDataFlag_getjcwSb172 == false) {
					this.getjcwSb('172')
					return
				}
				var arr = [];
				for (var i = 0; i < this.gjsdfx.length; i++) {
					if (this.isPointInPoly(this.gjsdfx[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.gjsdfx[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "gjsdfx");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_gjsdfx);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gjsdfx);
			}
			if (this.data.gongDianOther.gd_jcw.ck_qjsdfx) {
				if (this.getDataFlag_getjcwSb173 == false) {
					this.getjcwSb('173')
					return
				}
				var arr = [];
				for (var i = 0; i < this.qjsdfx.length; i++) {
					if (this.isPointInPoly(this.qjsdfx[i], this.data.gongDianOther.regionPoints)) {
						arr.push(this.qjsdfx[i]);
					}
				}
				this.creatMarker_jcwsb(arr, "qjsdfx");
				$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_qjsdfx);
			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_qjsdfx);
			}
			if (this.data.gongDianOther.gd_jcw.ck_gz) {
				var arrx = [];
				var arry = [];
				for (var i = 0; i < this.data.gongDianOther.regionPoints.length; i++) {
					var obj = this.data.gongDianOther.regionPoints[i];
					arrx.push(obj.x);
					arry.push(obj.y);
				}
				this.getGz(arry, arrx, 0)

			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gz);
			}
			if (this.data.gongDianOther.gd_jcw.ck_hntz) {
				var arrx = [];
				var arry = [];
				for (var i = 0; i < this.data.gongDianOther.regionPoints.length; i++) {
					var obj = this.data.gongDianOther.regionPoints[i];
					arrx.push(obj.x);
					arry.push(obj.y);
				}
				this.getGz(arry, arrx, 1)

			} else {
				$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_hntz);
			}
		}
		// 		} else {
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_blq);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fjymdgj);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_jymdgj);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fdjyq);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gddlj);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_xsxwz);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_cbkg);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_ckkg);
		// 			// $vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_fxjyq);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_cbkg);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_qjsdfx);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gjsdfx);
		// 			$vm.map.removeLayer(this.data.gongDian_layers.gd_jcw.ck_gz);
		//
		// 		}
	},
	// 判断点是否在多边形内
	isPointInPoly(pt, poly) {
		for (var isIn = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
			(poly[i].y <= pt.LON && pt.LON < poly[j].y || poly[j].y <= pt.LON && pt.LON < poly[i].y) && pt.LAT < (poly[j].x -
					poly[i].x) *
				(pt.LON - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x && (isIn = !isIn);
		}
		return isIn;
	},

	// 创建marker 供电臂
	creatMarker_gdb(source) {
		// 		let layer_gbb = L.layerGroup(); //图层---供电臂
		// 		this.data.layer_gbb = layer_gbb;
		let group = L.layerGroup();
		var body = `<div class="marker-hover gongdian-marker-jcwsb fxjyq1 " style="position:relative"></div>`;
		C.$.each(source, (index, item) => {
			const points = [
				[item.GPS_Y_START, item.GPS_X_START],
				[item.GPS_Y_END, item.GPS_X_END]
			];
			let markerLine = L.polyline(points, {
				color: "#55ffff",
				weight: 2
			});
			if (index % 2 == 0) {
				item.isDouble = true;
				body = `<div class="marker-hover gongdian-marker-jcwsb fxjyq1 " style="position:relative"></div>`;
			} else {
				item.isDouble = false;
				body = `<div class="marker-hover gongdian-marker-jcwsb fxjyq2 " style="position:relative"></div>`;
			}
			let markerS = L.marker({
				lon: item.GPS_X_START,
				lat: item.GPS_Y_START
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: body,
					// `<div class="marker-hover ${this.data.light ? 'gongdian-marker-light' : 'gongdian-marker'} ${this.data.light ? 'gdb-light' : 'gdb'}" style="position:relative"></div>`
				})
			});
			markerS.on("click", (p) => {
				this.creatBound_gdb(item, p); //创建供电臂范围
				this.setMarkerClick("供电臂", item, p);
			});
			group.addLayer(markerS);
			markerS.on("mouseover", (p) => {
				markerLine.setStyle({
					color: "#334df3",
					weight: 4
				});
			}).on("mouseout", (p) => {
				markerLine.setStyle({
					color: "#55ffff",
					weight: 2
				});
			});
			let markerE = L.marker({
				lon: item.GPS_X_END,
				lat: item.GPS_Y_END
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'gongdian-marker-light gdb-light' : 'gongdian-marker gdb'}" style="position:relative"></div>`,
				})
			});
			markerE.on("click", (p) => {
				this.setMarkerClick("供电臂", item, p);
			});
			// group.addLayer(markerLine);
			// group.addLayer(markerS);
		});
		this.data.gongDian_layers.gd_sbss.ck_gdb = group;
		this.filterLayer("供电_设备设施");
		// this.data.layer_gbb = layer_gbb;
	},
	// 创建marker 变电所
	creatMarker_bds(source) {
		let layer_bds = L.layerGroup(); //图层---变电所
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lon: item.GPS_X,
				lat: item.GPS_Y
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'gongdian-marker-light bds-light' : 'gongdian-marker bds'}" style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("变电所", item, p);
			});
			layer_bds.addLayer(marker);
		});
		this.data.gongDian_layers.gd_sbss.ck_bds = layer_bds;
		this.filterLayer("供电_设备设施");
	},
	// 创建marker 工区管辖范围
	creatMarker_gqgxfw(source) {
		let layer_gqfw = L.layerGroup(); //图层---变电所
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lon: item.START_GPS_X,
				lat: item.START_GPS_Y
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover gongdian-marker gqfw " style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("工区范围", item, p);
			});
			layer_gqfw.addLayer(marker);
		});
		this.data.gongDian_layers.gd_fw.ck_gqgx = layer_gqfw;
		this.filterLayer("供电_范围");
	},
	creatMarker_dfx(source) {
		let layer_dfx = L.layerGroup(); //图层---电分相
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lon: item.START_LON,
				lat: item.START_LAT
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'gongdian-marker-light dfx-light' : 'gongdian-marker dfx'} " style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("电分相", item, p);
			});
			layer_dfx.addLayer(marker);
		});
		this.data.gongDian_layers.gd_sbss.ck_dfx = layer_dfx;
		this.filterLayer("供电_设备设施");
	},
	creatMarker_yjdy(source) {
		let layer_yjdy = L.layerGroup(); //图层---DC600V应急电源
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lon: item.GPS_POINT_X,
				lat: item.GPS_POINT_Y
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'gongdian-marker-light yjdy-light' : 'gongdian-marker yjdy'} " style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("DC600V应急电源", item, p);
			});
			layer_yjdy.addLayer(marker);
		});
		this.data.gongDian_layers.gd_sbss.ck_yjdy = layer_yjdy;
		this.filterLayer("供电_设备设施");
	},
	creatMarker_Train() {
		// let layer_yjdy = L.layerGroup(); //图层---应急车
		let layer_yjdy = L.markerClusterGroup({
			zoomToBoundsOnClick: true,
			maxClusterRadius: 20,
			iconCreateFunction: (cluster) => {
				return cluster.getAllChildMarkers()[0].options.icon
			}
		})
		var source = this.allTrain;
		if (this.data.gongDianOther.ck_yjc == '2') {
			source = this.useTrain;
		}
		C.$.each(source, (index, item) => {
			let marker = L.marker({
				lon: item.GPSX,
				lat: item.GPSY
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover ${this.data.light ? 'gongdian-marker-light yjc-light' : 'gongdian-marker yjc'} " style="position:relative"></div>`,
				})
			});
			marker.on("click", (p) => {
				this.setMarkerClick("应急车", item, p);
			});
			layer_yjdy.addLayer(marker);
		});
		this.data.gongDian_layers.gd_sbss.ck_yjc = layer_yjdy;
		$vm.map.addLayer(this.data.gongDian_layers.gd_sbss.ck_yjc);
		// this.filterLayer("供电_设备设施");
	},
	creatMarker_wdq(source) {
		let layer_yjdy = L.layerGroup(); //图层---无电区
		C.$.each(source, (index, item) => {
			const points = [
				[item.LAT, item.LON],
				[item.LAT_E, item.LON_E]
			];

			let markerLine = L.polyline(points, {
				color: "#55ffff",
				weight: 2
			});
			let markerS = L.marker({
				lon: item.LON,
				lat: item.LAT
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover gongdian-marker gdb" style="position:relative"></div>`,
				})
			});
			markerS.on("click", (p) => {
				this.setMarkerClick("无电区", item, p);
			});
			// group.addLayer(markerS);
			markerS.on("mouseover", (p) => {
				markerLine.setStyle({
					color: "#334df3",
					weight: 4
				});
			}).on("mouseout", (p) => {
				markerLine.setStyle({
					color: "#55ffff",
					weight: 2
				});
			});
			let markerE = L.marker({
				lon: item.LON_E,
				lat: item.LAT_E
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: `<div class="marker-hover gongdian-marker gdb" style="position:relative"></div>`,
				})
			});
			markerE.on("click", (p) => {
				this.setMarkerClick("无电区", item, p);
			});
			layer_yjdy.addLayer(markerLine);
			layer_yjdy.addLayer(markerS);
		});
		this.data.gongDian_layers.gd_fw.ck_wdq = layer_yjdy;
		this.filterLayer("供电_范围");
	},

	creatMarker_jcwsb(source, str) {
		let layer_jcwsb = L.layerGroup(); //图层---接触网设施设备
		var body = `<div class="marker-hover gongdian-marker-jcwsb fdjyq " style="position:relative"></div>`;
		if (str == "fjymdgj") {
			body = `<div class="marker-hover gongdian-marker-jcwsb fjymdgj " style="position:relative"></div>`;
		}
		if (str == "jymdgj") {
			body = `<div class="marker-hover gongdian-marker-jcwsb jymdgj " style="position:relative"></div>`;
		}
		if (str == "fdjyq") {
			body = `<div class="marker-hover gongdian-marker-jcwsb fdjyq " style="position:relative"></div>`;
		}
		if (str == "gddlj") {
			body = `<div class="marker-hover gongdian-marker-jcwsb gdljd " style="position:relative"></div>`;
		}
		if (str == "blq") {
			body = `<div class="marker-hover gongdian-marker-jcwsb blq " style="position:relative"></div>`;
		}
		if (str == "xsxwz") {
			body = `<div class="marker-hover gongdian-marker-jcwsb xsxwz " style="position:relative"></div>`;
		}
		if (str == "ckkg") {
			body = `<div class="marker-hover gongdian-marker-jcwsb ckkg " style="position:relative"></div>`;
		}
		if (str == "cbkg") {
			body = `<div class="marker-hover gongdian-marker-jcwsb cbkg " style="position:relative"></div>`;
		}
		if (str == "gz") {
			body = `<div class="marker-hover gongdian-marker-jcwsb gz " style="position:relative"></div>`;
		}
		if (str == "fxjyq") {
			body =
				`<div class="marker-hover ${this.data.light ? 'gongdian-marker-light dfx-light' : 'gongdian-marker-jcwsb fxjyq'} " style="position:relative"></div>`;
		}
		C.$.each(source, (index, item) => {
			// if (str == "fxjyq") {
			// 				if(index%2==0){
			// 					body = `<div class="marker-hover gongdian-marker-jcwsb fxjyq1 " style="position:relative"></div>`;
			// 				}else{
			// 					body = `<div class="marker-hover gongdian-marker-jcwsb fxjyq2 " style="position:relative"></div>`;
			// 				}
			// body = `<div class="marker-hover ${this.data.light ? 'gongdian-marker-light dfx-light' : 'gongdian-marker-jcwsb fxjyq'} " style="position:relative"></div>`;
			// }
			let marker = L.marker({
				lon: item.LON,
				lat: item.LAT
			}, {
				icon: L.divIcon({
					className: "gongdian-icon-container",
					data: item,
					html: body,
				})
			});
			marker.on("click", (p) => {
				if (str == "blq") {
					this.setMarkerClick("避雷器", item, p);
				} else if (str == "fxjyq") {
					this.setMarkerClick("电分相", item, p);
				}
			});
			layer_jcwsb.addLayer(marker);
		});
		// 		171：非绝缘锚段关节
		// 169：绝缘锚段关节
		// 142：分段绝缘器
		// ：分相绝缘器
		// 145：股道点连接
		// ：常开开关
		// ：常闭开关
		// 143：避雷器
		// 144：吸上线位置
		// 		172：关节式电分相
		// 173：器件式电分相
		if (str == "fjymdgj") {
			this.data.gongDian_layers.gd_jcw.ck_fjymdgj = layer_jcwsb;
		}
		if (str == "jymdgj") {
			this.data.gongDian_layers.gd_jcw.ck_jymdgj = layer_jcwsb;
		}
		if (str == "fdjyq") {
			this.data.gongDian_layers.gd_jcw.ck_fdjyq = layer_jcwsb;
		}
		if (str == "gddlj") {
			this.data.gongDian_layers.gd_jcw.ck_gddlj = layer_jcwsb;
		}
		if (str == "blq") {
			this.data.gongDian_layers.gd_jcw.ck_blq = layer_jcwsb;
		}
		if (str == "xsxwz") {
			this.data.gongDian_layers.gd_jcw.ck_xsxwz = layer_jcwsb;
		}

		if (str == "fxjyq") {
			this.data.gongDian_layers.gd_jcw.ck_fxjyq = layer_jcwsb;
		}
		if (str == "ckkg") {
			this.data.gongDian_layers.gd_jcw.ck_ckkg = layer_jcwsb;
		}
		if (str == "cbkg") {
			this.data.gongDian_layers.gd_jcw.ck_cbkg = layer_jcwsb;
		}
		if (str == "gjsdfx") {
			this.data.gongDian_layers.gd_jcw.ck_gjsdfx = layer_jcwsb;
		}
		if (str == "qjsdfx") {
			this.data.gongDian_layers.gd_jcw.ck_qjsdfx = layer_jcwsb;
		}
		if (str == "gz") {
			this.data.gongDian_layers.gd_jcw.ck_gz = layer_jcwsb;
		}
		if (str == "hntz") {
			this.data.gongDian_layers.gd_jcw.ck_hntz = layer_jcwsb;
		}
		$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_fxjyq);
		// this.filterLayer("供电_接触网");
	},
	// 绑定marker点击事件---供电臂 变电所
	setMarkerClick(type, data, marker) {
		console.log(marker)
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
		if (type === "变电所") {
			lay = {
				x: 95,
				w: 350,
				h: 200
			};
			demo =
				`<i class="marker-gongdian-info-tip bds"></i>
					<div class="marker-gongdian-info">
						<div class="top">
							<div class="pic bds">${data.BDS_NAME}</div>
							<div class="tit"><h3>变电所信息</h3><h4>线名:${data.LINE_NAME}</h4></div>
						</div>
						<div class="list-item"><span>所属段:</span><label class="blue">${data.DEPOT}</label></div>
						<div class="list-item"><span>行别:</span><label class="orange">${data.LINE_DIRECT}</label></div>
					</div>`;
			addPop(demo);
		} else if (type === "供电臂") {
			lay = {
				x: 95,
				w: 350,
				h: 260
			};
			demo =
				`<i class="marker-gongdian-info-tip gdb"></i>
					<div class="marker-gongdian-info">
						<div class="top">
							<div class="pic gdb">${data.BDS}</div>
							<div class="tit"><h3>供电臂信息</h3><h4>线别:${data.LINE}</h4></div>
						</div>
						<div class="list-item"><span>所属段:</span><label class="blue">${data.DEPOT}</label></div>
						<div class="list-item"><span>供电臂名称:</span><label class="orange">${data.GDB}</label></div>
						<div class="list-item"><span>起止范围:</span><label class="blue">${data.MILEAGE_START}至${data.MILEAGE_END}</label></div>
						<div class="list-item"><span>停电影响:</span><label class="blue">${data.AREA}</label></div>
					</div>`;
			addPop(demo);
		} else if (type === "工区范围") {
			lay = {
				x: 95,
				w: 350,
				h: 240
			};
			demo =
				`<i class="marker-gongdian-info-tip gqfw"></i>
					<div class="marker-gongdian-info gqfw">
						<div class="top">
							<div class="pic gqfw"></div>
							<div class="tit"><h3>工区详细内容</h3><h4>线别:${data.LINE}</h4></div>
						</div>
						<div class="list-item"><span>站点:</span><label class="blue">${data.DEP}</label></div>
						<div class="list-item"><span>检修项目:</span><label class="orange">${data.PROFESS}</label></div>
					</div>`;
			addPop(demo);
		} else if (type === "电分相") {
			lay = {
				x: 95,
				w: 340,
				h: 240
			};
			demo =
				`<i class="marker-gongdian-info-tip dfx"></i>
					<div class="marker-gongdian-info">
						<div class="top">
							<div class="pic dfx"></div>
							<div class="tit"><h3>电分相信息</h3><h4>线别:${data.NAME}</h4></div>
						</div>
						<div class="list-item "><span>施工单位:</span><label class="orange">${data.CONSTRUCTION_TYPE}</label></div>
						<div class="list-item "><span>设备编号:</span><label class="orange">${data.CODE}</label></div>
						<div class="list-item inline"><span>是否高铁:</span><label class="orange">${data.IS_HIGHRAIL=='0'?'否':'是'}</label></div>
						<div class="list-item inline"><span>投用日期:</span><label class="orange">${data.USEDATE}</label></div>
						<div class="list-item inline"><span>质量鉴定等级:</span><label class="orange">${data.DEVICE_LEVEL}</label></div>
						<div class="list-item inline"><span>长度:</span><label class="orange">${data.LENGTH}</label></div>
						<div class="list-item inline"><span>行别:</span><label class="orange">${data.ROW_TYPE}</label></div>
						<div class="list-item inline"><span>支柱号:</span><label class="orange">${data.START_PILLAR_ID}</label></div>
					</div>`;
			addPop(demo);
		} else if (type === "DC600V应急电源") {
			lay = {
				x: 95,
				w: 340,
				h: 240
			};
			demo =
				`<i class="marker-gongdian-info-tip yjdy"></i>
					<div class="marker-gongdian-info">
						<div class="top">
							<div class="pic yjdy"></div>
							<div class="tit"><h3>应急电源信息</h3><h4>线别:${data.LINE_NAME}</h4></div>
						</div>
						<div class="list-item inline"><span>所属段:</span><label class="orange">${data.DEPOT}</label></div>
						<div class="list-item inline"><span>信息:</span><label class="blue">${data.NOTE}</label></div>
						<div class="list-item inline"><span>站名:</span><label class="orange">${data.STN_NAME}</label></div>
					</div>`;
			addPop(demo);
		} else if (type === "应急车") {
			lay = {
				x: 95,
				w: 340,
				h: 440
			};
			C.getDataP123({
				c: "tyzd_ggy2051",
				s: [
					[data.PK_ID]
				],
				a: "救援列车详情",
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
			}, (r) => {
				if (r["1"].length > 0) {
					demo =
						`<i class="marker-gongdian-info-tip yjdy"></i>
					<div class="marker-gongdian-info">
						<div class="top">
							<div class="pic yjc"></div>
							<div class="tit"><h3>${r["1"][0].WORKTRAIN_NAME}</h3><h4>线别:${r["1"][0].LINE_NAME}</h4></div>
						</div>
						<div class="list-item inline"><span>所属段:</span><label class="orange">${r["1"][0].DUAN_NAME}</label></div>
						<div class="list-item inline"><span>工作范围:</span><label class="blue">${r["1"][0].WORK_RANGE}</label></div>
						<div class="list-item inline"><span>工区:</span><label class="orange">${r["1"][0].PARK_PLACE}</label></div>
						<div class="list-item inline"><span>停驻站点:</span><label class="orange">${r["1"][0].STATION}</label></div>
						<div class="list-item inline"><span>司机:</span><label class="orange">${r["1"][0].SJ_NAME}</label></div>
						<div class="list-item inline"><span>司机电话:</span><label class="orange">${r["1"][0].SJ_PHONE}</label></div>
						<div class="list-item inline"><span>管理人员:</span><label class="orange">${r["1"][0].GL_NAME}</label></div>
						<div class="list-item inline"><span>管理人员电话:</span><label class="orange">${r["1"][0].GL_PHONE}</label></div>
						<div class="list-item inline"><span>可用状态:</span><label class="orange">${r["1"][0].TRAIN_STATES === '1' ? '可用' : '不可用'}</label></div>
						<div class="list-item inline"><span>不可用原因:</span><label class="orange">${r["1"][0].REASON}</label></div>
						<div class="list-item inline"><span>机车型号:</span><label class="orange">${r["1"][0].WORKTRAIN_TYPE}</label></div>
						<div class="list-item inline"><span>更新时间:</span><label class="orange">${r["1"][0].INPUT_DATE}</label></div>
					</div>`;
					addPop(demo);
				}
			})

		}
	},

	// 获取供电相关设施
	getDataList() {
		if (this.getDataFlag_getDataList) {
			return;
		}
		this.getDataFlag_getDataList = true
		C.getDataP123({
			c: "eqeh_zxy2009",
			a: "获取供电相关设施",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				// “1”：工区管辖范围	“2”：变电所  “3”：供电臂  “4”：电分相  "5":DC600V应急电源
				this.creatMarker_gqgxfw(r["1"]); //工区管辖范围
				this.creatMarker_bds(r["2"]); //变电所
				this.creatMarker_gdb(r["3"]); //供电臂
				this.creatMarker_dfx(r["4"]); //电分相
				this.creatMarker_yjdy(r["5"]); //DC600V应急电源
				this.filterLayer("供电_设备设施");
				this.filterLayer("供电_范围");
				// this.filterLayer("供电_接触网");
			} else {
				this.$notify.error({
					title: '提示',
					message: '获取供电相关设施信息数据异常'
				});
			}
		});
	},
	getjcwSb(sType, line) {
		if (this.getDataFlag_getjcwSb171 && sType == '171') {
			return;
		}
		if (this.getDataFlag_getjcwSb169 && sType == '169') {
			return;
		}
		if (this.getDataFlag_getjcwSb142 && sType == '142') {
			return;
		}
		if (this.getDataFlag_getjcwSb143 && sType == '143') {
			return;
		}
		if (this.getDataFlag_getjcwSb144 && sType == '144') {
			return;
		}
		if (this.getDataFlag_getjcwSb145 && sType == '145') {
			return;
		}
		// 		if (this.getDataFlag_getjcwSb149 && sType == '149') {
		// 			return;
		// 		}
		if (this.getDataFlag_getjcwSb180 && sType == '180') {
			return;
		}
		if (this.getDataFlag_getjcwSb181 && sType == '181') {
			return;
		}
		if (this.getDataFlag_getjcwSb172 && sType == '172') {
			return;
		}
		// 		if (this.getDataFlag_getjcwSb173 && sType == '173') {
		// 			return;
		// 		}
		C.getDataP123({
			c: "eqeh_zxy2019",
			a: "查询接触网设备",
			s: [
				[sType, line]
			],
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				if (sType == "171") { //非绝缘锚段关节
					this.fjymdgj = r[1];
					this.getDataFlag_getjcwSb171 = true
					// this.creatMarker_jcwsb(r[1], 'fjymdgj');
				}
				if (sType == "169") { //绝缘锚段关节
					this.jymdgj = r[1];
					this.getDataFlag_getjcwSb169 = true
					// this.creatMarker_jcwsb(r[1], 'jymdgj');
				}
				if (sType == "142") { //分段绝缘器
					this.fdjyq = r[1];
					this.getDataFlag_getjcwSb142 = true
					// this.creatMarker_jcwsb(r[1], 'fdjyq');
				}
				if (sType == "173") { //分相绝缘器 原149
					this.fxjyq = r[1];
					this.getDataFlag_getjcwSb149 = true
					this.creatMarker_jcwsb(r[1], 'fxjyq');
				}
				if (sType == "145") { //股道点连接
					this.gddlj = r[1];
					this.getDataFlag_getjcwSb171 = true
					// this.creatMarker_jcwsb(r[1], 'gddlj');
				}
				if (sType == "180") { //常开开关
					this.ckkg = r[1];
					this.getDataFlag_getjcwSb180 = true
					// this.creatMarker_jcwsb(r[1], 'ckkg');
				}
				if (sType == "181") { //常闭开关
					this.cbkg = r[1];
					this.getDataFlag_getjcwSb181 = true
					// this.creatMarker_jcwsb(r[1], 'cbkg');
				}
				if (sType == "143") { //避雷器
					this.blq = r[1];
					this.getDataFlag_getjcwSb143 = true
					// this.creatMarker_jcwsb(r[1], 'blq');
				}
				if (sType == "144") { //吸上线位置
					this.xsxwz = r[1];
					this.getDataFlag_getjcwSb144 = true
					// this.creatMarker_jcwsb(r[1], 'xsxwz');
				}
				if (sType == "172") { //关节式电分相
					this.gjsdfx = r[1];
					this.getDataFlag_getjcwSb172 = true
					// this.creatMarker_jcwsb(r[1], 'gjsdfx');
				}
				// 				if (sType == "173") { //器件式电分相
				// 					this.qjsdfx = r[1];
				// 					this.getDataFlag_getjcwSb173 = true
				// 					// this.creatMarker_jcwsb(r[1], 'qjsdfx');
				// 				}
				// this.filterLayer("供电_接触网");
			} else {
				this.$notify.error({
					title: '提示',
					message: '获取接触网设备信息数据异常'
				});
			}
		});
	},
	getTrain() {
		if (this.getDataFlag_getTrain) {
			return
		}
		this.getDataFlag_getTrain = true;
		C.getDataP123({
			c: "tyzd_ggy2050",
			a: "获取供电作业车",
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				// “1”：工区管辖范围	“2”：变电所  “3”：供电臂  “4”：电分相  "5":DC600V应急电源
				this.allTrain = r["1"];
				this.useTrain = [];
				var use = [];
				for (var i = 0; i < this.allTrain.length; i++) {
					var obj = this.allTrain[i]
					if (obj.TRAIN_STATES == '1') {
						use.push(obj);
					}
				}
				this.useTrain = use;
				this.creatMarker_Train(); //工区管辖范围
				this.filterLayer("供电_设备设施");
			} else {
				this.$notify.error({
					title: '提示',
					message: '获取供电相关设施信息数据异常'
				});
			}
		});
	},
	getZz() {
		C.getDataP123({
			c: "eqeh_zxy2021",
			a: "查询支柱设备",
			s: [
				[1]
			], //0-钢柱,1-混凝土柱
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				// “1”：工区管辖范围	“2”：变电所  “3”：供电臂  “4”：电分相  "5":DC600V应急电源
				this.gz = r[1];
				this.creatMarker_jcwsb(r[1], 'gz');
			} else {
				this.$notify.error({
					title: '提示',
					message: '获取供电相关支柱设备异常'
				});
			}
		});
	},
	getGz(arrx, arry, type) {
		C.getDataP123({
			c: "eqeh_zxy9009",
			a: "查询支柱设备",
			o: ["eqeh_zxy2021"],
			s: [
				[type]
			],
			w: [arrx, arry], //0-钢柱,1-混凝土柱
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				// “1”：工区管辖范围	“2”：变电所  “3”：供电臂  “4”：电分相  "5":DC600V应急电源
				// 				var arr = [];
				// 				for (var i = 0; i < this.gz.length; i++) {
				// 					if (this.isPointInPoly(this.gz[i], this.data.gongDianOther.regionPoints)) {
				// 						arr.push(this.gz[i]);
				// 					}
				// 				}
				if (type == 1) { //混凝土柱
					this.hntz = r;
					this.creatMarker_jcwsb(r, 'hntz');
					$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_hntz);
				} else {
					this.gz = r;
					this.creatMarker_jcwsb(r, 'gz');
					$vm.map.addLayer(this.data.gongDian_layers.gd_jcw.ck_gz);
				}

				// this.creatMarker_jcwsb(arr, "ck_gz");

			} else {
				this.$notify.error({
					title: '提示',
					message: '获取供电相关支柱设备异常'
				});
			}
		});
	},
	getWdq() {
		if (this.getDataFlag_getWdq) {
			return
		}
		this.getDataFlag_getWdq = true;
		C.getDataP123({
			c: "eqeh_zxy2022",
			a: "查询无电区",
			s: [], //0-钢柱,1-混凝土柱
			url: "https://10.192.126.203/GeneralProServlet", //接口地址
		}, (r) => {
			if (r) {
				this.creatMarker_wdq(r[1]);
			} else {
				this.$notify.error({
					title: '提示',
					message: '获取供电相关支柱设备异常'
				});
			}
		});
	},
	/**
	 * 获取供电系统管界
	 */
	getGddRange() {
		/**
		 * 供电系统单位字典
		 * @type {[{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},{oname: string, oid: string, fill: string},null,null,null]}
		 */
		const gddList = [{
				oid: '19B8C3534E355665E0539106C00A58FD', // 单位Oid
				oname: '成都供电段', // 单位名
				fill: '#9900CC' // 管界范围图例颜色
			},
			{
				oid: '19B8C3534E345665E0539106C00A58FD',
				oname: '达州供电段',
				fill: '#CC0033'
			},
			{
				oid: '19B9D8D920D5589FE0539106C00A1189',
				oname: '重庆供电段',
				fill: '#CC9900'
			},
			{
				oid: '19B8C3534E335665E0539106C00A58FD',
				oname: '贵阳供电段',
				fill: '#33CC00'
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
			console.log('获取供电系统管辖范围', res)
			let renderPromise = []
			res.map((oRange) => {
				renderPromise.push(this.renderGddRange(oRange))
			})
			// 绘制所有单位管界多边形
			Promise.all(renderPromise).then((layers) => {
				this.data.gongDian_layers.gd_sbss.ck_gdd = layers
				this.filterLayer('供电_设备设施')
			})
		})
	},
	/**
	 * 绘制供电系统单位管界多边形
	 * @param range
	 * @returns {Promise}
	 */
	renderGddRange(range = {
		oname: '',
		range: [],
		fill: ''
	}) {
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
			let unitnamePt = this.getRectCenterPt(pts[0])
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
	// 创建供电臂范围
	creatBound_gdb(item, p) {
		this.tempBoundGdb && this.tempBoundGdb.remove(); //删除
		this.tempBoundGdb = L.layerGroup();
		C.getData({
			c: 'eqeh_zxy2054',
			s: [{"PKID":"2201070909181021867"}],
			s: [{"PKID":item.PKID}],
			async: true,
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			const color = item.isDouble ? "#E1CD49" : "#D83C3C";
			const polygonPoints = r.data[2].map(v => [v.LAT, v.LON]);
			let polygonLayer = new L.Polygon(polygonPoints, {
				color: color,
				// fillColor: item.isDouble?"#E1CD49":"#D83C3C",
			});
			this.tempBoundGdb.addLayer(polygonLayer);
			r.data[1].forEach(v => {
				let marker = L.marker({
					lon: v.GPS_POINT_X,
					lat: v.GPS_POINT_Y
				}).bindTooltip(v.STN_NAME, {
					offset: L.point([-15, -12]),
					direction: "top",
					permanent: true
				}).openTooltip();
				// }).bindTooltip(v.STN_NAME).openTooltip();
				// }).bindPopup(v.STN_NAME).openPopup();
				this.tempBoundGdb.addLayer(marker);
			});
			this.tempBoundGdb.addTo($vm.map);
		});
	}
}
