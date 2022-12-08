/**
 * 管界\区域
 */
import C from "../../../assets/com.js";
import drawRegion from "./drawRegion.js";
let $vm = null;
export default {
	data: {
		boundLayer: null, //管界
		boundLayer2:null,//管界内铁路线
		regionLayer: null, //区域
		boundRegionOther: {
			bounds: [], //管界列表
			quyuEdit: false, //区域列表编辑状态
			region: [], //区域列表
			formQuYu: {}, //区域表单
			formVisible: false, //区域表单可见性
		},
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		if (!$vm.config.boundRegion.register) {
			return;
		}
		if ($vm.config.boundRegion.bound) {
			this.getBound(); //查询管界
		}
		if ($vm.config.boundRegion.region) {
			this.getRegion(); //查询区域
		}
	},
	// 地图点击事件
	handleMapClick(e) {},
	// 过滤图层元素
	filterLayer(qu) {
		if (qu.visible) {
			qu.layer.addTo($vm.map);
			$vm.kuanXuangTrainsCls([qu]);
		} else {
			$(".marker-tarin[group='" + qu.REGION_ID + "']").removeClass("kuang-xuang");
			qu.layer.removeFrom($vm.map);
		}
	},
	// 获取管界
	getBound() {
		this.data.boundRegionOther.bounds = [];
		this.data.boundLayer && $vm.map.removeLayer(this.data.boundLayer); //删除管界
		if ($vm.sys === "kyz") {
			// 查询管界
			C.getData({
				c: "trdm_lv_692",
				s: [$vm.oid.toUpperCase(), "1"],
				url: 'https://10.192.34.79/TRDM/GeneralProServlet'
				// s: ["99990002001499A50004AAAA", "1"],
				// url:"http://10.192.6.110:9090/TRDM/GeneralProServlet"
			}, (r) => {
				if(r.length===0){
					this.data.boundRegionOther.bounds = [];
					C.$(".marker-tarin.in-bound").removeClass("in-bound");
					// 未取到管界数据,则使用全部晚点信息
					$vm.trainOhter.total_wd = $vm.trainOhter.totals.wd; //数量统计-晚点
					$vm.trainOhter.total_ddwd = $vm.trainOhter.totals.ddwd; //数量统计-担当晚点
					return;
				}
				let lineColor = "#b0d7e1"; //INNER_COLOR: ""
				let fillColor = "#101C30"; //LINE_COLOR: ""
				const bounds = [];
				const boundsJson = {};
				let boundsIndex = 0;
				r.forEach((v, i) => {
					const point = [parseFloat(v.AREA_X), parseFloat(v.AREA_Y)];
					// 用以判断点是否在几何图形内
					const pointXY = {
						x: parseFloat(v.AREA_X),
						y: parseFloat(v.AREA_Y)
					};
					if (typeof(boundsJson["bound_" + v.AREA_NUM]) === "undefined") {
						bounds.push([point]);
						this.data.boundRegionOther.bounds.push([pointXY]);
						boundsJson["bound_" + v.AREA_NUM] = boundsIndex++;
					} else {
						this.data.boundRegionOther.bounds[boundsJson["bound_" + v.AREA_NUM]].push(pointXY);
						bounds[boundsJson["bound_" + v.AREA_NUM]].push(point);
					}
					if (i === 0) {
						lineColor = v.LINE_COLOR === "" ? lineColor : v.LINE_COLOR;
						fillColor = v.INNER_COLOR === "" ? fillColor : v.INNER_COLOR;
					}
				});
				if (bounds.length > 0) {
					this.data.boundLayer = L.layerGroup(); //图层
					this.data.boundLayer.addTo($vm.map);
					bounds.forEach(points => {
						let antPath = new L.Polygon(points, {
							"weight": 1, //线宽
							"color": lineColor, //颜色
							"opacity": 0.5, //透明度
							"fillColor": fillColor,
							"fillOpacity": 0.4
						});
						this.data.boundLayer.addLayer(antPath);
					});
					$vm.setBoundsTrainEffect();
				}
			});
		} else {
			const boundUrl1 =
				"https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChengDuCheZhanGuanXiaFanWeiDiYuBianJie/rest/maps/成都车站管辖范围_地域边界"; //管界有颜色
			// const boundUrl1 =
			// 	"https://10.192.125.55:8443/iserver/services/map-ugcv5-ChengDuCheZhanGuanXiaFanWeiDiYuBianJie/rest/maps/成都车站管辖范围_地域边界"; //管界有颜色
				const boundUrl2 =
					"https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChengDuCheZhanGuanXiaFanWeiTieLuBianJie/rest/maps/成都车站管辖范围_铁路边界"; //铁路线颜色
			this.data.boundLayer2 && $vm.map.removeLayer(this.data.boundLayer2); //删除管界
			this.data.boundLayer2 = L.supermap.tiledMapLayer(boundUrl2, {
				transparent: true
			}).addTo($vm.map);
			this.data.boundLayer = L.supermap.tiledMapLayer(boundUrl1, {
				transparent: true
			}).addTo($vm.map);
		}
	},
	// 查询区域
	getRegion() {
		$(".marker-tarin.kuang-xuang").removeClass("kuang-xuang"); //移除区域内车动画
		this.data.boundRegionOther.region.forEach(reg => { //移除地图中区域对象
			reg.layer && reg.layer.removeFrom($vm.map);
		});
		C.getDataP123({
			c: "kydp_zxy2043",
			s: [
				[$vm.$store.state.params.UserPID]
			],
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			if (r) {
				let realD = r["1"];
				realD.forEach(v => {
					v.visible = true;
					let points = [];
					let pointsXY = [];
					JSON.parse(v.POINT_LIST).forEach(p => {
						points.push([p.lat, p.lon]);
						pointsXY.push({
							x: p.lat,
							y: p.lon
						});
					});
					v.POINT_LIST = pointsXY;
					if (pointsXY.length > 0) {
						points = points.splice(0, points.length - 1);
						v.layer = drawRegion.drawLines(points, v.REGION_ID);
					}
				});
				this.data.boundRegionOther.region = realD;
				$vm.kuanXuangTrainsCls();
			} else {
				$vm.$notify.error({
					title: '提示',
					message: '获取警戒区域数据异常'
				})
			}
		});
	},
	// 新增/修改区域
	handleSaveQuyu(f, add, kxTrains) {
		// //sql [区域id,"区域名称",区域类型（0-不发送警戒消息，1-发送警戒消息）,"警戒消息内容","列车列表","点列表","客运段"]
		let sql = [];
		if (add) {
			const points = this.data.boundRegionOther.formQuYu.POINT_LIST.map(p => {
				return {
					"lat": p.x,
					"lon": p.y
				}
			});
			sql = [f.REGION_ID, f.REGION_NAME, f.REGION_TYPE, f.WARN_MESSAGE, kxTrains, points, $vm.$store.state.params.UserPID];
		} else {
			sql = [f.REGION_ID, f.REGION_NAME, f.REGION_TYPE, f.WARN_MESSAGE, "", "", $vm.$store.state.params.UserPID];

		}
		C.getDataP123({
			c: "kydp_zxy4015",
			s: sql,
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			if (r) {
				if (add) {
					this.data.boundRegionOther.quyuEdit = false;
					$vm.changeDrawFlag(true, true);
					this.getRegion();
				}
				$vm.$message({
					message: '操作成功',
					type: 'success'
				});
			} else {
				$vm.$notify.error({
					title: '提示',
					message: '保存区域数据异常'
				})
			}
		});
	},
	// 删除区域
	handleDeletQuyu(qu, index) {
		// sql [[[区域id1],[区域id2],....]]
		C.getDataP123({
			c: "kydp_zxy5002",
			s: [
				[
					[qu.REGION_ID]
				]
			],
			url: C.ADDS.servGS, //接口地址
		}, (r) => {
			if (r) {
				this.getRegion();
				$vm.$message({
					message: '删除成功',
					type: 'success'
				});
			} else {
				$vm.$notify.error({
					title: '提示',
					message: '删除警戒区域异常'
				})
			}
		})
	}
}
