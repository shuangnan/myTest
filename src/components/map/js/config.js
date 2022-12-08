// 配置文件
export default {
	// 地图配置
	superMap: {
		register: true, //是否注册
		// register: false, //是否注册
		zoom: 1, //当前层级
		zoomMin: 1, //最小层
		zoomMax: 15, //最大层
		center: [30.629280172126524, 104.13989732474064], //成都东
		sccq: false, //是否加载四川重庆详图
		lightMode: false, // 黑版白版切换 (默认黑版)
	},
	// 控制面板
	controller: {
		register: false, //是否注册
		mini: false, //默认最小化
		base: false, //基础
		gongDian: false, //供电
		gongWu: false, //工务
		shiGong: false, // 施工
		dianWu: false, //电务
		jiWu: false, //机务
		yunShu: false, //运输
		cheLiang: false, //车辆
		tuFang: false, //土房
		huoYun: false, //货运子系统
		houQing: false, //后勤保障
		zaiHai: false, //自然灾害
		jiaotong: false, //交通
		keYun: false, // 客运
		other: false, //其它
		alert: false
	},
	// 地震
	earthquake: {
		register: false, //是否注册
		checked: false, //默认选中
		addFlag: false, //是否可新增地震点位
	},
	// 初始管界、区域
	boundRegion: {
		register: false, //是否注册
		bound: false, //是否有管界
		region: false, //是否有区域
	},
	// 桥遂
	qiaoSui: {
		register: false, //是否注册
		ck_qiao: false, //显示桥梁
		ck_sui: false //显示隧道
	},
	// 车站
	station: {
		register: false, //是否注册
		ck_boundK: false, //显示管内客站
		ck_boundH: false, //显示管内货站
		ck_boundKH: false,
		ck_boundAll: false,
		ck_boundN: false
	},
	dk: {
		register: false,
		pic: false,
	},
	// 天气
	weather: {
		register: false, //是否注册
		checked: false, //显示天气图标
	},
	// 天气预警
	weatherYJ: {
		register: false, //是否注册
		checked: false, //显示天气预警图标
	},
	// 全景视频
	video360: {
		register: false, //是否注册
		checked: false, //显示全景视频图标
	},
	// 在途车
	train: {
		register: false, //是否注册
		ck_dongche: false, //显示动车
		ck_puche: false, //显示普车
		ck_dandang: false, //显示担当车
		ck_huoche: false, //显示货车
		daozhan: false, // 显示到站车
		trainDetail: false, //是否可看列车作业信息
	},

	// 担当车(若注册会替换 train 中的 担当车(checked.dandang)过滤)
	dandang: {
		register: false, //是否注册
		checked: false, //默认选中
		key: "DEPOT", //担当车对比字段(与组件props参数oname作对比)
	},
	// 轨道车定位
	gdcdw: {
		register: false,
		gw: false,//轨道车定位---公务
	},

	// 供电——设备设施
	gd_sbss: {
		ck_yjctype: '全部',
		register: false, //是否注册
		ck_gdb: false, //显示供电臂
		ck_gdd: false, //显示供电段
		ck_jcwg: false, //显示接触网杆
		ck_yjc: false,//应急车
		ck_bds: false, //显示变电所
		ck_dfx: false, //显示电分相
		ck_gdgq: false, //显示供电工区
		ck_cj: false, //显示车间
		ck_td: false, //显示停电
		ck_jjdd: false, //显示间接带电
		ck_yl: false, //显示远离
		ck_yjdy: false,//显示DC600V应急电源
	},
	// 供电——范围
	gd_fw: {
		register: false, //是否注册
		ck_gdb: false, //显示供电臂范围
		ck_dfx: false, //显示电分相范围
		ck_gqgx: false, //显示工区管辖范围
		ck_wdq: false, //显示无电区范围
	},
	// 供电——接触网设施设备
	gd_jcw: {
		register: false, //是否注册
		ck_dfxXb: "",
		drawRegion: false, //框选区域
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
		ck_gjsdfxc: false,//关节式电分相
		ck_qjsdfxc: false,//器件式电分相
	},

	// 机务-车型
	jw_cx: {
		register: false, //是否注册
		rbnrjc: false, //热备内燃机车
		jyc: false, //救援车
		rbdljc: false, //热备电力机车
	},
	// 机务-管辖范围
	jw_fw: {
		register: false, //是否注册
		gy: false, //公寓
		bdz: false, //百吨闸瓦力列车限速
		jwcz: false, //机外大坡道特殊车站
	},
	// 机务-救援起复设备
	jw_jy: {
		register: false, //是否注册
		jysb: false, //救援设备
	},

	// 运输——设备设施
	ys_sbss: {
		register: false, //是否注册
		ck_jyd: false, //显示救援队
	},
	// 运输——范围
	ys_fw: {
		register: false, //是否注册
		ck_cwd: false, //显示车务段范围
	},
	// 运输——接发列车限制
	ys_jflc: {
		register: false, //是否注册
		ck_lkjz: false,//旅客禁止停留
		ck_lcjz: false,//旅客列车禁止停留
		// 		ck_xdfx: false, //显示相对方向同时接车限制
		// 		ck_tfx: false, //显示同方向同时发接列车限制
	},
	// 运输——调车机车
	ys_dcjc: {
		register: false, //是否注册
		ck_ddjc: false, //显示调度机车
		ck_snxyc: false, //显示枢纽小运车机车
		ck_zydc: false, //显示专用调车机车
		ck_lycz: false, //显示路用出租机车
	},
	// 土房——设备设施
	tf_sbss: {
		register: false, //是否注册
		shc: false, //生活车
		yjcl: false, //应急材料
		wsjds: false,//卫生监督所
		jks: false,//疾控所
		scd: false,//送餐点
		gy: false,//公寓
		// 		d: false, //段
		// 		cj: false, //车间
		// 		gq: false, //工区
	},
	// 土房——范围
	tf_fw: {
		register: false, //是否注册
		// d: false, //段范围
		cj: false, //车间范围
		gq: false, //工区范围
		cqjzd: false, //重庆建筑段段范围
		gyjzd: false, //贵阳建筑段段范围
		dchtgs: false, //达成合铁公司范围
		cdjzd: false, //成都建筑段范围
	},

	// 列车飞行图
	trainFly: {
		register: false, //是否注册
		checked: false, //默认选中
	},
	// 列车右键菜单
	trainContextMenu: {
		register: false, //是否注册
		sendMsg: false, //文本聊天
		vedio: false, //视频通话
		phone: false, //拨打电话
	},
	// 按钮
	btns: {
		register: false, //是否注册
		ranging: false, //地图测距
		drawRegion: false, //框选区域
		drawRegionCount: false, // 应急框选统计列车
		task: false, //指派任务
		sendMsg: false, //文本聊天
		vedio: false, //视频通话
		jhtx: false, //聚合通信
		phone: false, //拨打电话
		yjSrc: false, // 应急资源统计
	},

	//交通工具
	jiaotong: {
		register: false, //是否注册
		gongjiao: false, //公交
		chuzuche: false, //出租车
		danche: false, //共享单车
		wangyueche: false, //网约车
	},

	//公共交通站
	jiaotongzhan: {
		register: false, //是否注册
		ditie: false, //地铁
		tingchechang: false, //停车场
	},
	// 后勤-学校
	houqing_xuexiao: {
		register: false, //是否注册
		xiaoxue: false, //小学
		zhongxue: false, //初中
		gaozhong: false, //高中
		zhongxiaoxue: false, //九年一贯制学校(中小学)
		chugaozhong: false, //完全中学(初高中)
	},
	// 其它
	others: {
		register: false, //是否注册
		gongwugongqu: false, //工务工区
		handong: false, //涵洞
		jiechuwang: false, //接触网
		ruwangkou: false, //入网口
		suidao: false, //隧道
		tancezhan: false, //探测站
		xinhaoji: false, //信号机
		qiaoliang: false, //桥梁
	},
	gw_tl: {
		register: false,
		sd: false,              // 隧道     (line)
		ql: false,              // 桥梁     (line)
		pd: false,              // 坡道     (line)
		pdd: false,             // 坡道 (大于20°) (line)
		jk: false,              // 监控     (line)
	},
	gw_sb: {
		register: false,
		dk: false,              // 道口     (marker)
		gdc: false,             // 轨道车    (marker)
		ksd: false,				// 看守点
		ksd1: false,            // I级防洪看守点      (line)
		ksd2: false,            // II级防洪看守点     (line)
		ksd3: false,            // III级防洪看守点    (line)
		qx: false,              // 防洪抢险材料及机具  (marker)
		zyc: false,              // 防洪供电抢修作业车  (marker)
		llxc: false,
		slpc: false
	},
	gw_jh: {
		register: false,
		tc: false,              // 天窗点    (marker)
		sg: false,              // 施工计划  (marker)
		wx: false,              // 维修计划  (marker)
		jg: false               // 监管计划  (marker)
	},
	// 工务-范围
	gw_fw: {
		register: false,
		gwd: false,             // 车务段    (marker + polygon)
		gq: false,              // 工区     (marker + polygon)
		cj: false               // 工区车间  (marker + polygon)
	},
	// 货运子系统
	hy_sbss: {
		register: false,
		hyz: false,//货运站
		yjry: false,//应急人员
		jjbl: false,//机具备料
		yjll: false,//应急劳力
		yjzxjx: false,//应急装卸机械
		shjxzy: false,//社会机械资源
		wxhwblz: false,//危险货物办理站
		yfhwblz: false,//易腐货物办理站
		hy_sbss_ydszthwx: false,
		hy_sbss_ycmzthwx: false,
		hy_sbss_ydsztzyx: false,
		hy_sbss_zdhzyjry: false,
		hy_sbss_yjzzjgcl: false,
		hy_sbss_yjzxll: false,
		hy_sbss_wjj: false,
		hy_sbss_zzj: false,
		hy_sbss_qzj: false,
		hy_sbss_lwyjqxjx: false,
		hy_sbss_wxhyshwl: false
	},
	// 车辆
	cl: {
		register: false,
		bpbl: false,//备品备料
		bycz: false, // 备用车组
	},
	shiGong: {
		register: false,
		sg: false,
		wx: false,
		jg: false
	},
	// 电务-设备
	dw_sb: {
		register: false,
		dw_gdsb: false,
		dw_lksb: false,
		dw_lksb_w: false,
		dw_dccxsb: false,
		dw_4g: false,
		dw_xhj: false,
		dw_dx: false
	},
	// 电务-范围
	dw_fw: {
		register: false,
		dwd: false,
	},
	ky_sb: {
		register: false,
		ky_sb_yl: false,
		ky_sb_xf: false,
		ky_sb_pcs: false,
		ky_sb_yjys: false,
		ky_sb_fdwz: false,
		ky_sb_yjsscs: false
	},
	alert: {
		register: false
	}
}
