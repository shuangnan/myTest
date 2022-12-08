import c from "../../../../assets/com.js"
export default {
	//获取车辆信息(任务模板)
	getModelTrains(p) {
		p.module = "execute"
		p.c = "kydp_zxy2039";
		// p.c = "kydp_zxy2007"
		return c.getPromiseData(p)
	},

	// 获取警戒区域
	getRegionList(p) {
		//sql [["客运段|身份证"]]	
		p.module = "execute";
		p.c = "kydp_zxy2043";
		return c.getPromiseData(p);
	},
	// 保存警戒区域
	saveRegion(p) {
		//sql [区域id,"区域名称",区域类型（0-不发送警戒消息，1-发送警戒消息）,"警戒消息内容","列车列表","点列表","客运段|身份证"]	
		p.module = "execute";
		p.c = "kydp_zxy4015";
		return c.getPromiseData(p);
	},
	// 删除警戒区域
	deleteRegion(p) {
		// sql [[[区域id1],[区域id2],....]]	
		p.module = "execute";
		p.c = "kydp_zxy5002";
		return c.getPromiseData(p);
	},

	//获取车辆信息
	getTrains(p) {
		p.module = "execute"
		p.url = c.ADDS.serv + "/admin/dlmo/onRoadTrainData";
		p.c = "dlmo_zxy2004";
		// p.c = "kydp_zxy2007"
		return c.getPromiseData(p)
	},
	//获取运营情况
	getYyqk(p) {
		p.module = "execute"
		p.c = "kydp_zxy2005"
		return c.getPromiseData(p)
	},
	//获取组织机构
	getZzjg(p) {
		p.module = "execute"
		p.c = "kydp_zxy2004"
		return c.getPromiseData(p)
	},
	//获取车队字典
	getCdzd(p) {
		p.module = "execute"
		p.c = "kydp_zxy2011"
		return c.getPromiseData(p)
	},
	//获取车站字典
	getCzzd(p) {
		p.module = "execute"
		p.c = "zwdms_wangyy2001"
		return c.getPromiseData(p)
	},
	//获取班组情况
	getBzqk(p) {
		p.module = "execute"
		p.c = "kydp_zxy2002"
		return c.getPromiseData(p)
	},
	//获取计划
	getPlan(p) {
		p.module = "execute"
		p.c = "kydp_zxy2003"
		return c.getPromiseData(p)
	},
	//获取正晚点列车
	getZwd(p) {
		p.module = "execute"
		p.c = "kydp_zxy2006"
		return c.getPromiseData(p)
	},
	//获取车辆详情
	getClxq(p) {
		p.module = "execute"
		p.c = "kydp_zxy9002"
		return c.getPromiseData(p)
	},
	//获取编组信息
	getBz(p) {
		p.module = "execute"
		p.c = "kydp_zxy2013"
		return c.getPromiseData(p)
	},
	// 根据车次日期渠道获取销售详细
	getDetailByQD(p) {
		// ["车次","开行日期(yyyy/mm/dd)","渠道名称"]
		p.module = "execute"
		p.c = "kydp_zxy8007"
		return c.getPromiseData(p)
	},
	// 根据车次日期类型获取销售详细
	getDetailByLX(p) {
		// ["车次","开行日期(yyyy/mm/dd)","商品大类","商品小类"]
		p.module = "execute"
		p.c = "kydp_zxy8008"
		return c.getPromiseData(p)
	},
	//获取应急救援通道
	getExit(p) {
		p.module = "execute"
		p.c = "kydp_zxy2015"
		return c.getPromiseData(p)
	},
	//获取人员信息
	getUserInfo(p) {
		p.module = "execute"
		// p.c = "kydp_tjx9003"
		p.c = "kydp_chenpy2001"
		return c.getPromiseData(p)
	},
	getSelectOname(p) {
		p.module = "execute"
		p.c = "kydp_zxy2022"
		return c.getPromiseData(p)
	},
	createAuth(p, callback) {
		var params = {}
		c.getData({
			c: "kydp_zxy8021",
			s: [p.SSOA],
			a: "获取统一身份参数",
			async: true,
		}, (r) => {
			if (r.success) {
				let d = JSON.parse(r.data);
				let pp = JSON.parse(d.data);
				for (var i in pp) {
					params[i] = pp[i];
				}
			}
			callback(params)
		});

	},

	//发送消息
	sendMsg(p) {
		p.module = "execute"
		p.c = "kydp_tjx9017"
		return c.getPromiseData(p)
	},
	//根据车次查询出对应的列车长信息
	findUserByCc(p) {
		p.module = "execute"
		p.c = "kydp_cll9010"
		return c.getPromiseData(p)
	},
	//查询双方的聊天信息
	findChatMsg(p) {
		p.module = "execute"
		p.c = "kydp_tjx2025"
		return c.getPromiseData(p)
	},
	//获取预警信息
	getYuJing(p) {
		p.module = "execute"
		p.c = "kydp_zxy2036"
		return c.getPromiseData(p)
	}, //获取当前天气
	getCurWeather(p) {
		p.module = "execute"
		p.c = "kydp_zxy2033"
		return c.getPromiseData(p)
	},
	//获取未来天气
	getFutureWeather(p) {
		// code	kydp_zxy7002	
		// sql	["经度","纬度"]	
		p.module = "execute"
		p.c = "kydp_zxy7002"
		return c.getPromiseData(p)
	},

}
