import C from '../../../assets/com'
// import L from '../../../../public/js/superMap/leaflet/leaflet'
let $vm = null

export default {
	/**
	 * 工务相关Layer、显隐配置项及绘制参数
	 */
	data: {
		dkLayers: {
			pic: null
		},
		dkOther: {
			pic: false,
		},
		lastTy: 1,
		gongWuLayers: {             // Layers
			gw_tl: {                  // 图例
				sd: null,     // 隧道         (line)
				ql: null,     // 桥梁         (line)
				pd: null,     // 坡道         (line)
				pdd: null,    // 坡道(大于20°) (line)
				jk: null,     // 监控         (line)
			},
			gw_sb: {                  // 设备设施
				dk: null,
				gdc: null,    // 轨道车            (marker)
				ksd1: null,   // I级防洪看守点      (line)
				ksd2: null,   // II级防洪看守点     (line)
				ksd3: null,   // III级防洪看守点    (line)
				qx: null,     // 防洪抢险材料及机具  (marker)
				zyc: null     // 防洪供电抢修作业车  (marker)
			},
			gw_jh: {                  // 计划
				sg: null,     // 施工计划  (marker)
				wx: null,     // 维修计划  (marker)
				jg: null,     // 监管计划  (marker)
				tc: null      // 天窗点    (marker)
			},
			gw_fw: {                  // 范围
				gwd: null,    // 车务段    (marker + polygon)
				gq: null,     // 工区     (marker + polygon)
				cj: null      // 工区车间  (marker + polygon)
			}
		},
		gongWuOther: {              // 显隐配置
			gw_tl: {                  // 图例
				sd: false,              // 隧道     (line)
				ql: false,              // 桥梁     (line)
				pd: false,              // 坡道     (line)
				pdd: false,             // 坡道(大于20°) (line)
				jk: false,              // 监控     (line)
			},
			gw_sb: {                  // 设备设施
				dk: false,              // 道口
				gdc: false,             // 轨道车
				ksd1: false,            // I级防洪看守点      (line)
				ksd2: false,            // II级防洪看守点     (line)
				ksd3: false,            // III级防洪看守点    (line)
				qx: false,              // 防洪抢险材料及机具  (marker)
				zyc: false              // 防洪供电抢修作业车  (marker)
			},
			gw_jh: {                  // 计划
				tc: false,              // 天窗点
				sg: false,              // 施工计划  (marker)
				wx: false,              // 维修计划  (marker)
				jg: false               // 监管计划  (marker)
			},
			gw_fw: {                  // 范围
				gwd: false,             // 车务段    (marker + polygon)
				gq: false,              // 工区     (marker + polygon)
				cj: false               // 工区车间  (marker + polygon)
			}
		},
		layerRecipes: {             // 绘图参数
			gw_tl: {                  // 图例
				sd: {                   // 隧道
					type: 'line',
					width: 3,
					color: '#14C8C6'
				},
				ql: {                   // 桥梁
					type: 'line',
					width: 3,
					color: '#00B4FF'
				},
				pd: {                   // 坡道
					type: 'line',
					width: 3,
					color: '#FFB676'
				},
				pdd: {                  // 坡道(大于20°)
					type: 'line',
					width: 5,
					color: '#C78733'
				},
				jk: {                   // 监控地段
					type: 'line',
					width: 3,
					color: '#F24747'
				},
			},
			gw_sb: {                  // 设备设施
				gdc: {                  // 轨道车
					type: 'marker',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker sb_gdc" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_gdc_light" style="position: relative" />`
				},
				dk: {                   // 道口
					type: 'marker',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker sb_dk" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_dk_light" style="position: relative" />`
				},
				ksd1: {                 // I级防洪看守点
					type: 'marker',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker sb_ksd1" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_ksd1_light" style="position: relative" />`
				},
				ksd2: {                 // II级防洪看守点
					type: 'marker',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker sb_ksd2" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_ksd2_light" style="position: relative" />`
				},
				ksd3: {                 // III级防洪看守点
					type: 'markercluster',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker sb_ksd3" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_ksd3_light" style="position: relative" />`
				},
				qx: {                   // 防洪抢险材料及机具
					type: 'marker',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker sb_qx" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_qx_light" style="position: relative" />`
				},
				zyc: {                  // 防洪供电抢修作业车
					type: 'marker',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker sb_zyc" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_zyc_light" style="position: relative" />`
				}
			},
			gw_jh: {                  // 计划
				tc: {                   // 天窗点
					type: 'marker',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker jh_tc" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker sb_qx_light" style="position: relative" />`
				},
				sg: {                   // 施工计划
					type: 'markercluster',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker jh_sg" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker jh_sg_light" style="position: relative" />`
				},
				wx: {                   // 维修计划
					type: 'markercluster',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker jh_wx" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker jh_wx_light" style="position: relative" />`
				},
				jg: {                   // 监管计划
					type: 'markercluster',
					className: 'gongwu-icon-container',
					html: `<div class="marker-hover gongwu-marker jh_jg" style="position: relative" />`,
					lightHtml: `<div class="marker-hover gongwu-marker jh_jg_light" style="position: relative" />`
				}
			},
			gw_fw: {                  // 范围
				gwd: L.layerGroup(),    // 车务段    (marker + polygon)
				gq: L.layerGroup(),     // 工区     (marker + polygon)
				cj: L.layerGroup()      // 工区车间  (marker + polygon)
			}
		},
		popperRecipes: {            // popper绘制参数
			gw_tl: {
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
					descriptions: [
						{
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
									case '0': return '上行'
									case '1': return '下行'
									case '2': return '单线'
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
					descriptions: [
						{
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
									case '0': return '上行'
									case '1': return '下行'
									case '2': return '单线'
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
				},
				pd: {
					c: 'tyzd_ggy2047',
					x: 20,
					w: 300,
					h: 270,
					tipClass: 'marker-gongwu-info-tip pd',
					logoClass: 'log pd',
					titString: '坡道',
					subTit: '',
					tit2: 'DUAN_NAME',
					descriptionsSpan: 1,
					descriptions: [
						{
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
							label: '线别',
							key: 'LINE_TYPE',
							formatter: (value) => {
								switch (value) {
									case '0': return '上行'
									case '1': return '下行'
									case '2': return '单线'
								}
							},
							labelClass: 'orange'
						},
						{
							label: '起点里程',
							key: 'STARTING_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '终点里程',
							key: 'END_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '坡道长度',
							key: 'SLOPE_LENGTH',
							labelClass: 'orange'
						},
						{
							label: '坡度',
							key: 'SLOPE',
							labelClass: 'orange'
						}
					]
				},
				pdd: {
					c: 'tyzd_ggy2047',
					x: 20,
					w: 300,
					h: 270,
					tipClass: 'marker-gongwu-info-tip pd',
					logoClass: 'log pd',
					titString: '坡道',
					subTit: '',
					tit2: 'DUAN_NAME',
					descriptionsSpan: 1,
					descriptions: [
						{
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
							label: '线别',
							key: 'LINE_TYPE',
							formatter: (value) => {
								switch (value) {
									case '0': return '上行'
									case '1': return '下行'
									case '2': return '单线'
								}
							},
							labelClass: 'orange'
						},
						{
							label: '起点里程',
							key: 'STARTING_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '终点里程',
							key: 'END_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '坡道长度',
							key: 'SLOPE_LENGTH',
							labelClass: 'orange'
						},
						{
							label: '坡度',
							key: 'SLOPE',
							labelClass: 'orange'
						}
					]
				},
				jk: {
					c: 'tyzd_ggy2057',
					x: 20,
					w: 400,
					h: 200,
					tipClass: 'marker-gongwu-info-tip jk',
					logoClass: 'log jk',
					titString: '监控地段',
					subTit: '',
					tit2: 'DUAN_NAME',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
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
									case '0': return '上行'
									case '1': return '下行'
									case '2': return '单线'
								}
							},
							labelClass: 'orange'
						},
						{
							label: '起点里程',
							key: 'STARTING_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '终点里程',
							key: 'END_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '起点经度',
							key: 'BEGIN_GPSX',
							labelClass: 'orange',
							formatter: (value) => {
								return value.substring(0, 6)
							}
						},
						{
							label: '起点纬度',
							key: 'BEGIN_GPSY',
							labelClass: 'orange',
							formatter: (value) => {
								return value.substring(0, 6)
							}
						},
						{
							label: '终点经度',
							key: 'END_GPSX',
							labelClass: 'orange',
							formatter: (value) => {
								return value.substring(0, 6)
							}
						},
						{
							label: '终点纬度',
							key: 'END_GPSY',
							labelClass: 'orange',
							formatter: (value) => {
								return value.substring(0, 6)
							}
						}
					]
				}
			},
			gw_sb: {
				dk: {
					c: 'tyzd_ggy2045',
					x: 20,
					w: 350,
					h: 200,
					overflowTooltip: true,
					// labelWidth: 120,
					tipClass: 'marker-gongwu-info-tip dk',
					logoClass: 'log dk',
					tit: 'LEVELCROSSING_NAME',
					tit2: 'DUAN_NAME',
					descriptionsSpan: 2,
					descriptions: [
						{
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
									case '0': return '上行'
									case '1': return '下行'
									case '2': return '单线'
								}
							},
							labelClass: 'orange'
						},
						{
							label: '道口名',
							key: 'LEVELCROSSING_NAME',
							labelClass: 'orange'
						},
						{
							label: '隧道编号',
							key: 'LEVELCROSSING_CODE',
							labelClass: 'orange'
						},
						{
							label: '中心里程',
							key: 'CORE_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '道口类别',
							key: 'ROAD_TYPE',
							labelClass: 'orange'
						},
						{
							label: '站间 (站名)',
							key: 'STATION_NAME',
							labelClass: 'orange'
						},
						{
							label: '是否道机联控',
							key: 'ROADMACHINE_CONTROL',
							labelClass: 'orange'
						},
						{
							label: '呼叫名称',
							key: 'CALL_NAME',
							labelClass: 'orange'
						}
					]
				},
				ksd1: {
					c: 'tyzd_ggy2049',
					x: 20,
					w: 400,
					h: 210,
					tipClass: 'marker-gongwu-info-tip ksd',
					logoClass: 'log ksd',
					titString: '防洪看守点',
					subTit: '防洪等级: I',
					tit2: 'LINE_NAME',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
							label: '单位',
							key: 'DEPOT',
							labelClass: 'orange'
						},
						{
							label: '线别',
							key: 'LINE_TYPE',
							labelClass: 'orange'
						},
						{
							label: '行别',
							key: 'LINE_DIRECT',
							labelClass: 'orange'
						},
						{
							label: '侧别',
							key: 'LINE_SIDE',
							labelClass: 'orange'
						},
						{
							label: '起始车站',
							key: 'START_STN',
							labelClass: 'orange'
						},
						{
							label: '起始里程',
							key: 'START_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '终止车站',
							key: 'END_STN',
							labelClass: 'orange'
						},
						{
							label: '终点里程',
							key: 'END_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '长度',
							key: 'LINE_LENGTH',
							labelClass: 'orange'
						},
						{
							label: '编号',
							key: 'NO',
							labelClass: 'orange'
						}
					]
				},
				ksd2: {
					c: 'tyzd_ggy2049',
					x: 20,
					w: 400,
					h: 210,
					tipClass: 'marker-gongwu-info-tip ksd',
					logoClass: 'log ksd',
					titString: '防洪看守点',
					subTit: '防洪等级: II',
					tit2: 'LINE_NAME',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
							label: '单位',
							key: 'DEPOT',
							labelClass: 'orange'
						},
						{
							label: '线别',
							key: 'LINE_TYPE',
							labelClass: 'orange'
						},
						{
							label: '行别',
							key: 'LINE_DIRECT',
							labelClass: 'orange'
						},
						{
							label: '侧别',
							key: 'LINE_SIDE',
							labelClass: 'orange'
						},
						{
							label: '起始车站',
							key: 'START_STN',
							labelClass: 'orange'
						},
						{
							label: '起始里程',
							key: 'START_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '终止车站',
							key: 'END_STN',
							labelClass: 'orange'
						},
						{
							label: '终点里程',
							key: 'END_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '长度',
							key: 'LINE_LENGTH',
							labelClass: 'orange'
						},
						{
							label: '编号',
							key: 'NO',
							labelClass: 'orange'
						}
					]
				},
				ksd3: {
					c: 'tyzd_ggy2049',
					x: 20,
					w: 400,
					h: 210,
					tipClass: 'marker-gongwu-info-tip ksd',
					logoClass: 'log ksd',
					titString: '防洪看守点',
					subTit: '防洪等级: III',
					tit2: 'LINE_NAME',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
							label: '单位',
							key: 'DEPOT',
							labelClass: 'orange'
						},
						{
							label: '线别',
							key: 'LINE_TYPE',
							labelClass: 'orange'
						},
						{
							label: '行别',
							key: 'LINE_DIRECT',
							labelClass: 'orange'
						},
						{
							label: '侧别',
							key: 'LINE_SIDE',
							labelClass: 'orange'
						},
						{
							label: '起始车站',
							key: 'START_STN',
							labelClass: 'orange'
						},
						{
							label: '起始里程',
							key: 'START_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '终止车站',
							key: 'END_STN',
							labelClass: 'orange'
						},
						{
							label: '终点里程',
							key: 'END_MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '长度',
							key: 'LINE_LENGTH',
							labelClass: 'orange'
						},
						{
							label: '编号',
							key: 'NO',
							labelClass: 'orange'
						}
					]
				},
				zyc: {
					c: 'tyzd_ggy2051',
					x: 20,
					w: 450,
					h: 210,
					// labelWidth: 120,
					tipClass: 'marker-gongwu-info-tip zyc',
					logoClass: 'log zyc',
					tit: 'WORKTRAIN_NAME',
					subTit: '',
					tit2: 'DUAN_NAME',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
							label: '线名',
							key: 'LINE_NAME',
							labelClass: 'orange'
						},
						{
							label: '机车型号',
							key: 'WORKTRAIN_TYPE',
							labelClass: 'orange'
						},
						{
							label: '配属地点',
							key: 'PARK_PLACE',
							labelClass: 'orange'
						},
						{
							label: '工作范围',
							key: 'WORK_RANGE',
							labelClass: 'orange'
						},
						{
							label: '司机',
							key: 'SJ_NAME',
							labelClass: 'orange'
						},
						{
							label: '司机电话',
							key: 'SJ_PHONE',
							labelClass: 'orange'
						},
						{
							label: '管理人员',
							key: 'GL_NAME',
							labelClass: 'orange'
						},
						{
							label: '管理人员电话',
							key: 'GL_PHONE',
							labelClass: 'orange'
						},
						{
							label: '当前停留点',
							key: 'STATION',
							labelClass: 'orange'
						},
						{
							label: '当前状态',
							key: 'TRAIN_STATES',
							labelClass: 'orange',
							formatter: (value) => {
								if (value === '1') {
									return '可用'
								} else if (value === '2') {
									return '不可用'
								} else {
									return ''
								}
							}
						},
						{
							label: '不可用原因',
							key: 'REASON',
							labelClass: 'orange'
						},
						{
							label: '更新时间',
							key: 'INPUT_DATE',
							labelClass: 'orange'
						}
					]
				},
				qx: {
					c: 'tyzd_ggy2053',
					x: 20,
					w: 500,
					h: 450,
					tipClass: 'marker-gongwu-info-tip qx',
					logoClass: 'log qx',
					titString: '防洪抢险材料及机具',
					// labelWidth: 150,
					subTit: '',
					tit2: 'DUAN_NAME',
					descriptionsSpan: 2,
					descriptions: [
						{
							label: '线名',
							key: 'LINE_NAME',
							labelClass: 'orange'
						},
						{
							label: '存放地点',
							key: 'SAVE_PLACE',
							labelClass: 'orange'
						},
						{
							label: '里程',
							key: 'MILEAGE',
							labelClass: 'orange'
						},
						{
							label: '钢轨 (根)',
							key: 'RAIL',
							labelClass: 'orange'
						},
						{
							label: '木枕 (根)',
							key: 'WOODEN_SLEEPER',
							labelClass: 'orange'
						},
						{
							label: '废砼枕 (根)',
							key: 'WASTE_SLEEPER',
							labelClass: 'orange'
						},
						{
							label: '道渣 (方)',
							key: 'BALLAST',
							labelClass: 'orange'
						},
						{
							label: '片石 (方)',
							key: 'RUBBLE',
							labelClass: 'orange'
						},
						{
							label: '铺便线木枕及扣件 (米)',
							labelWidth: 150,
							key: 'TEMPORARY_SLEEPER',
							labelClass: 'orange'
						},
						{
							label: '施工便梁 (孔) (8m)',
							labelWidth: 150,
							key: 'CONSTRUCTION_BEAM8',
							labelClass: 'orange'
						},
						{
							label: '施工便梁 (孔) (16m)',
							labelWidth: 150,
							key: 'CONSTRUCTION_BEAM16',
							labelClass: 'orange'
						},
						{
							label: '施工便梁 (孔) (24m)',
							labelWidth: 150,
							key: 'CONSTRUCTION_BEAM24',
							labelClass: 'orange'
						},
						{
							label: '战备梁 (孔) (16m)',
							labelWidth: 150,
							key: 'PREPAREWAR_BEAM16',
							labelClass: 'orange'
						},
						{
							label: '战备梁 (孔) (32m)',
							labelWidth: 150,
							key: 'PREPAREWAR_BEAM32',
							labelClass: 'orange'
						},
						{
							label: '装载机 (台)',
							key: 'LOADER',
							labelClass: 'orange'
						},
						{
							label: '挖掘机 (台)',
							key: 'DIGGER',
							labelClass: 'orange'
						},
						{
							label: '钢拱架 (榀)',
							key: 'STEEL_ARCH',
							labelClass: 'orange'
						},
						{
							label: '隧道引水板 (块)',
							labelWidth: 120,
							key: 'WATER_FRAME',
							labelClass: 'orange'
						},
						{
							label: '防护网被动网 (㎡)',
							labelWidth: 150,
							key: 'PASSIVE_NET',
							labelClass: 'orange'
						},
						{
							label: '防护网主动网 (㎡)',
							labelWidth: 150,
							key: 'ACTIVE_NET',
							labelClass: 'orange'
						},
						{
							label: 'W钢带 (米)',
							labelWidth: 120,
							key: 'STEEL_STRIP',
							labelClass: 'orange'
						},
						{
							label: '自进式锚杆 (套)',
							labelWidth: 150,
							key: 'ANCHOR',
							labelClass: 'orange'
						},
						{
							label: '推土机 (台)',
							key: 'BULLDOZER',
							labelClass: 'orange'
						},
						{
							label: '备注',
							key: 'REMARKS',
							labelClass: 'orange'
						},
					]
				},
				gdc: {
					c: 'tyzd_ggy2070',
					x: 20,
					w: 450,
					h: 200,
					// labelWidth: 120,
					tipClass: 'marker-gongwu-info-tip gdc',
					logoClass: 'log gdc',
					tit: 'TRAIN_NO',
					subTit: '',
					tit2: 'DW',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
							label: '停驻站点',
							key: 'PLACE',
							labelClass: 'orange'
						},
						{
							label: '司机',
							key: 'PERSON_NAME',
							labelClass: 'orange'
						},
						{
							label: '司机电话',
							key: 'PERSON_PHONE',
							labelClass: 'orange'
						},
						{
							label: '管理人员',
							key: 'CJ_NAME',
							labelClass: 'orange'
						},
						{
							label: '管理人员电话',
							key: 'CJ_PHONE',
							labelClass: 'orange'
						},
						{
							label: '机车型号',
							key: 'TRAIN_TYPE',
							labelClass: 'orange'
						},
						{
							label: '当前停留点',
							key: 'STATION',
							labelClass: 'orange'
						},
						{
							label: '当前状态',
							key: 'TRAIN_STATES',
							labelClass: 'orange',
							formatter: (value) => {
								if (value === '1') {
									return '可用'
								} else if (value === '2') {
									return '不可用'
								} else {
									return ''
								}
							}
						},
						{
							label: '不可用原因',
							key: 'REASON',
							labelClass: 'orange'
						},
						{
							label: '更新时间',
							key: 'INPUT_DATE',
							labelClass: 'orange'
						}
					]
				}
			},
			gw_jh: {
				sg: {
					c: 'tyzd_ggy2062',
					x: 20,
					w: 400,
					h: 200,
					tipClass: 'marker-gongwu-info-tip sg',
					logoClass: 'log sg',
					titString: '施工计划信息',
					tit2: 'TYPE',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
							label: '施工位置',
							key: 'LOCATION',
							labelClass: 'orange'
						},
						{
							label: '施工类型',
							key: 'TYPE',
							labelClass: 'orange',
							overflowTooltip: true
						},
						{
							label: '施工单位',
							key: 'DO_UNIT',
							labelClass: 'orange',
							overflowTooltip: true
						},
						{
							label: '施工线名',
							key: 'ROUTE',
							labelClass: 'orange'
						},
						{
							label: '施工日期',
							key: 'DO_DATE',
							labelClass: 'orange'
						},
						{
							label: '开始时间',
							key: 'BEGIN_TIME',
							labelClass: 'orange'
						},
						{
							label: '结束时间',
							key: 'END_TIME',
							labelClass: 'orange'
						},
						{
							label: '天窗',
							key: 'MINUTES',
							labelClass: 'orange'
						},
						{
							label: '施工等级',
							key: 'GRADE',
							labelClass: 'orange'
						},
						{
							label: '施工条件',
							key: 'CONDITION',
							labelClass: 'orange',
							overflowTooltip: true
							// formatter: (value) => {
							// 	return `<span style="width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">${value}</span>`
							// }
						}
					]
				},
				wx: {
					c: 'tyzd_ggy2065',
					x: 20,
					w: 400,
					h: 210,
					tipClass: 'marker-gongwu-info-tip wx',
					logoClass: 'log wx',
					titString: '维修计划信息',
					subTit: '',
					tit2: 'REPAIR_PROJECT',
					descriptionsSpan: 2,
					overflowTooltip: true,
					descriptions: [
						{
							label: '作业单元',
							key: 'WORK_UNIT_NAME',
							labelClass: 'orange',
						},
						{
							label: '作业日期',
							key: 'WORK_DATE',
							labelClass: 'orange'
						},
						{
							label: '维修项目',
							key: 'REPAIR_PROJECT',
							labelClass: 'orange'
						},
						{
							label: '线别',
							key: 'LINE_NAME',
							labelClass: 'orange'
						},
						{
							label: '天窗点起',
							key: 'WORK_START_TIME',
							labelClass: 'orange'
						},
						{
							label: '天窗点止',
							key: 'WORK_END_TIME',
							labelClass: 'orange'
						},
						{
							label: '天窗停电标准分钟数',
							key: 'ALLOW_MINUTE',
							labelClass: 'orange'
						},
						{
							label: '需求分钟数',
							key: 'NEED_MINUTE',
							labelClass: 'orange'
						},
						{
							label: '维修等级',
							key: 'REPAIR_LEVEL',
							labelClass: 'orange'
						},
						{
							label: '负责人姓名',
							key: 'CONSTRUCT_PERSON_NAME',
							labelClass: 'orange'
						},
						{
							label: '负责人电话',
							key: 'CONSTRUCT_PERSON_PHONE',
							labelClass: 'orange'
						},
						{
							label: '维修内容',
							key: 'REPAIR_CONTENT',
							labelClass: 'orange',
						}
					]
				},
				jg: {

				}
			}
		}
	},
	/**
	 * 初始化工务绘图模块
	 * @param vmParam 电子地图Vue实例
	 */
	init ( vmParam ) {
		if ($vm === null) {
			$vm = vmParam
		}
		// if (!$vm.config.gw_tl.register && !$vm.config.gw_sb.register && !$vm.config.gw_jh.register && !$vm.config.gw_fw.register) {
		// 	return
		// }
		if (!$vm.config.dk.register) {
			return
		}
		// 设置默认值
		for (let key in this.data.dkOther) {
			for (let subKey in this.data.dkOther[key]) {
				this.data.dkOther[key][subKey] = $vm.config[key][subKey]
			}
		}
		if ($vm.config.dk.register) {
			this.getData_pic()
		}
		// if ($vm.config.gw_tl.register) {
		// 	// 获取图例信息
		// 	this.getData_tl()
		// }
		// if ($vm.config.gw_sb.register) {
		// 	// 获取设备设施信息
		// 	this.getData_sb()
		// }
		// if ($vm.config.gw_jh.register) {
		// 	// 获取计划信息
		// 	this.getData_jh()
		// }
		// if ($vm.config.gw_fw.register) {
		// 	// 获取管辖范围信息
		// 	this.getData_fw()
		// }
	},
	getData_pic(ty = 1) {
		console.log('获取现场图片', ty)
		let current = C.formatDate(new Date(), 'yyyy-MM-dd')
		let start = C.getDateTimeSub(new Date(), 'yyyy-MM-dd', -ty * 24)
		C.getData({
			c: 'tyzd_ggy2146',
			s: {
				'BEGIN_DATE': start,
				'END_DATE': current
			},
			url: 'https://10.192.126.203/GeneralProServlet'
		}, (res) => {
			console.log(res)
			this.createUploadPicLayer(ty, res.data['1'])
		})
	},
	createUploadPicLayer(ty, data) {
		if (this.data.dkLayers.pic !== null) {
			$vm.map.removeLayer(this.data.dkLayers.pic)
		}
		let group = L.layerGroup()
		this.data.dkLayers.pic = group
		let markerGroup = L.layerGroup()
		data.map((item) => {
			let marker = L.marker({
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon({
					className: 'dk-icon-container',
					data: item,
					html: `<div class="marker-hover dk-marker pic" style="position: relative" />`
				})
			})
			marker.on('click', (p) => {
				this.showUploadDetail(p)
			})
			markerGroup.addLayer(marker)
		})
		group = markerGroup
		this.data.dkLayers.pic = group
		this.filterLayers(ty)
	},
	showUploadDetail(p) {
		console.log('展示上传图片', p)
		const images = p.target.options.icon.options.data.FILES
		let pics = []
		images.map((i) => {
			pics.push(i.IN_URL)
		})
		$vm.uploadPics = p.target.options.icon.options.data
		$vm.showUploadPics = true
	},
	getData(mainType) {
		if (mainType === 'gw_tl') {
			this.getData_tl()
		} else if (mainType === 'gw_sb') {
			this.getData_sb()
		} else if (mainType === 'gw_jh') {
			this.getData_jh()
		} else if (mainType === 'gw_fw') {
			this.getData_fw()
		}
	},
	/**
	 * 筛选图例
	 * @param ty 图例类型
	 */
	filterLayers ( ty = 0 ) {
		if ($vm.config.dk.pic) {
			if (this.data.dkLayers.pic === null || ty !== this.data.lastTy) {
				this.data.dkOther.pic = $vm.config.dk.pic
				this.getData_pic(ty)
			} else {
				$vm.map.addLayer(this.data.dkLayers.pic)
			}
		} else {
			$vm.map.removeLayer(this.data.dkLayers.pic)
		}
		this.data.lastTy = ty
		// if (this.data.tyDic[ty] !== undefined) {
		// 	if (ty === '工务_天窗点') {
		// 		// 勾选天窗点时，查看施工计划和维修计划
		// 		// this.filterLayers('工务_施工计划')
		// 		// this.filterLayers('工务_维修计划')
		// 	} else {
		// 		console.log( '工务筛选图例', ty, $vm.config[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] )
		// 		if ($vm.config[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType]) {
		// 			// 勾选对应图例时，如果没有图层数据，需要调接口获取
		// 			if (this.data.gongWuLayers[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] === null) {
		// 				// 获取数据绘制图层
		// 				this.data.gongWuOther[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] = $vm.config[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType]
		// 				console.log('初始化图层数据', ty, $vm.config[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType])
		// 				this.getData(this.data.tyDic[ty].mainType)
		// 			} else {
		// 				console.log('从缓存加载图层', ty, $vm.config[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType])
		// 				$vm.map.addLayer( this.data.gongWuLayers[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] )
		// 			}
		// 		} else {
		// 			$vm.map.removeLayer( this.data.gongWuLayers[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] )
		// 		}
		// 		// $vm.config[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] ?
		// 		// 		$vm.map.addLayer( this.data.gongWuLayers[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] ) :
		// 		// 		$vm.map.removeLayer( this.data.gongWuLayers[this.data.tyDic[ty].mainType][this.data.tyDic[ty].subType] )
		// 	}
		// }
	},
	/**
	 * 获取图例信息
	 */
	getData_tl () {
		if (this.data.gongWuOther.gw_tl.ql && this.data.gongWuLayers.gw_tl.ql === null) {
			this.getData_tl_ql().then( ( qlData ) => {
				console.log( '获取桥梁信息', qlData )
				this.createLayer( '工务_桥梁', 'gw_tl', 'ql', qlData )
			} )
		}
		if (this.data.gongWuOther.gw_tl.pdd && this.data.gongWuLayers.gw_tl.pdd === null)
			this.getData_tl_pdd().then( ( pddData ) => {
				console.log( '获取大坡道信息', pddData )
				this.createLayer( '工务_坡道大', 'gw_tl', 'pdd', pddData )
			} )
		if (this.data.gongWuOther.gw_tl.pd && this.data.gongWuLayers.gw_tl.pd === null) {
			this.getData_tl_pd().then( ( pdData ) => {
				console.log( '获取坡道信息', pdData )
				this.createLayer( '工务_坡道', 'gw_tl', 'pd', pdData )
			} )
		}
		if (this.data.gongWuOther.gw_tl.sd && this.data.gongWuLayers.gw_tl.sd === null) {
			this.getData_tl_sd().then((sdData) => {
				console.log( '获取隧道信息', sdData )
				this.createLayer( '工务_隧道', 'gw_tl', 'sd', sdData )
			})
		}
		if (this.data.gongWuOther.gw_tl.jk && this.data.gongWuLayers.gw_tl.jk === null) {
			this.getData_tl_jk().then((jkData) => {
				console.log('获取监控地段信息', jkData)
				this.createLayer('工务_监控地段', 'gw_tl', 'jk', jkData)
			})
		}
	},
	/**
	 * 图例-获取桥梁信息
	 * @returns {Promise}
	 */
	getData_tl_ql () {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: $vm.sys==="police"? 'trdm_lv_860':'yjcz_ggy9003',
				url: C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( JSON.parse( res.data ) )
				} else {
					reject( '获取桥梁信息失败' )
				}
			} )
		} )
	},
	/**
	 * 图例-获取隧道信息
	 * @returns {Promise}
	 */
	getData_tl_sd () {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: $vm.sys==="police"? 'trdm_lv_863':'yjcz_ggy9005',
				url: C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( JSON.parse( res.data ) )
				} else {
					reject( '获取隧道信息失败' )
				}
			} )
		} )
	},
	/**
	 * 图例-获取大坡道信息
	 * @returns {Promise}
	 */
	getData_tl_pdd () {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: 'yjcz_ggy9008',
				url: 'https://10.192.126.203/GeneralProServlet'
			}, ( res ) => {
				if (res.success) {
					resolve( JSON.parse( res.data ) )
				} else {
					reject( '获取大坡道信息失败' )
				}
			} )
		} )
	},
	/**
	 * 图例-获取坡道信息
	 * @returns {Promise}
	 */
	getData_tl_pd () {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: 'yjcz_ggy9007',
				url: 'https://10.192.126.203/GeneralProServlet'
			}, ( res ) => {
				if (res.success) {
					resolve( JSON.parse( res.data ) )
				} else {
					reject( '获取坡道信息失败' )
				}
			} )
		} )
	},
	/**
	 * 图例-获取监控地段信息
	 * @returns {Promise}
	 */
	getData_tl_jk () {
		return new Promise((resolve, reject) => {
			C.getData({
				c: 'tyzd_ggy2056',
				url:  C.ADDS.servGS
			}, (res) => {
				if ($vm.sys==="police"||res.success) {
					let resData = []
					let list = $vm.sys==="police"?res:res.data['1'];
					list.map( ( r ) => {
						resData.push({
							PK_ID: r.PK_ID,
							POINTS: [
								{
									GPSY: r.BEGIN_GPSY,
									GPSX: r.BEGIN_GPSX
								},
								{
									GPSY: r.END_GPSY,
									GPSX: r.END_GPSX
								}
							]
						})
					})
					resolve(resData)
				} else {
					reject('获取监控地段信息失败')
				}
			})
		})
	},
	/**
	 * 获取设备设施信息
	 */
	getData_sb () {
		if (this.data.gongWuOther.gw_sb.dk && this.data.gongWuLayers.gw_sb.dk === null) {
			this.getData_sb_dk().then( ( dkData ) => {
				console.log( '获取道口信息', dkData )
				this.createLayer( '工务_道口', 'gw_sb', 'dk', dkData )
			} )
		}
		if (this.data.gongWuOther.gw_sb.ksd1 && this.data.gongWuLayers.gw_sb.ksd1 === null) {
			this.getData_sb_ksd1().then( ( ksdData ) => {
				console.log( '获取I级防洪看守点信息', ksdData )
				this.createLayer( '工务_I级防洪看守点', 'gw_sb', 'ksd1', ksdData )
			} )
		}
		if (this.data.gongWuOther.gw_sb.ksd2 && this.data.gongWuLayers.gw_sb.ksd2 === null) {
			this.getData_sb_ksd2().then( ( ksdData ) => {
				console.log( '获取II级防洪看守点信息', ksdData )
				this.createLayer( '工务_II级防洪看守点', 'gw_sb', 'ksd2', ksdData )
			} )
		}
		if (this.data.gongWuOther.gw_sb.ksd3 && this.data.gongWuLayers.gw_sb.ksd3 === null) {
			this.getData_sb_ksd3().then( ( ksdData ) => {
				console.log( '获取III级防洪看守点信息', ksdData )
				this.createLayer( '工务_III级防洪看守点', 'gw_sb', 'ksd3', ksdData )
			} )
		}
		if (this.data.gongWuOther.gw_sb.zyc && this.data.gongWuLayers.gw_sb.zyc === null) {
			this.getData_sb_zyc().then((zycData) => {
				console.log('获取防洪供电抢修作业车信息', zycData)
				this.createLayer('工务_防洪供电抢修作业车', 'gw_sb', 'zyc', zycData)
			})
		}
		if (this.data.gongWuOther.gw_sb.qx && this.data.gongWuLayers.gw_sb.qx === null) {
			this.getData_sb_qx().then((qxData) => {
				console.log('获取防洪抢险器具信息', qxData)
				this.createLayer('工务_防洪抢险材料及机具', 'gw_sb', 'qx', qxData)
			})
		}
		if (this.data.gongWuOther.gw_sb.gdc && this.data.gongWuLayers.gw_sb.gdc === null) {
			this.getData_sb_gdc().then((gdcData) => {
				console.log('获取工务轨道车信息', gdcData)
				this.createLayer('工务_轨道车', 'gw_sb', 'gdc', gdcData)
			})
		}
	},
	/**
	 * 设备设施-获取道口信息
	 * @returns {Promise}
	 */
	getData_sb_dk () {
		return new Promise( ( resolve, reject ) => {
			C.getData( {
				c: 'tyzd_ggy2044',
				url: C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取道口信息失败' )
				}
			} )
		} )
	},
	/**
	 * 设备设施-获取I级防洪看守点
	 * @returns {Promise}
	 */
	getData_sb_ksd1 () {
		return new Promise((resolve, reject) => {
			C.getData( {
				c: 'tyzd_ggy2059',
				s: $vm.sys==="police"?["Ⅰ"]:[["Ⅰ"]],
				url:  C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取I级防洪看守点信息失败' )
				}
			} )
		})
	},
	/**
	 * 设备设施-获取II级防洪看守点
	 * @returns {Promise}
	 */
	getData_sb_ksd2 () {
		return new Promise((resolve, reject) => {
			C.getData( {
				c: 'tyzd_ggy2059',
				s: $vm.sys==="police"?["Ⅱ"]:[["Ⅱ"]],
				url:  C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取II级防洪看守点信息失败' )
				}
			} )
		})
	},
	/**
	 * 设备设施-获取III级防洪看守点
	 * @returns {Promise}
	 */
	getData_sb_ksd3 () {
		return new Promise((resolve, reject) => {
			C.getData( {
				c: 'tyzd_ggy2059',
				s: $vm.sys==="police"?["Ⅲ"]:[["Ⅲ"]],
				url:  C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取III级防洪看守点信息失败' )
				}
			} )
		})
	},
	/**
	 * 设备设施-获取防洪供电抢修作业车
	 * @returns {Promise}
	 */
	getData_sb_zyc () {
		return new Promise((resolve, reject) => {
			C.getData( {
				c: 'tyzd_ggy2050',
				url:  C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取防洪抢险供电作业车信息失败' )
				}
			} )
		})
	},
	/**
	 * 设备设施-获取防洪抢险材料及机具信息
	 * @returns {Promise}
	 */
	getData_sb_qx () {
		return new Promise((resolve, reject) => {
			C.getData( {
				c: 'tyzd_ggy2052',
				url:  C.ADDS.servGS
			}, ( res ) => {
				if($vm.sys==="police"){
					resolve(res)
				}else if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取防洪抢险材料及机具信息失败' )
				}
			} )
		})
	},
	/**
	 * 设备设施-获取工务轨道车信息
	 * @returns {Promise}
	 */
	getData_sb_gdc () {
		return new Promise((resolve, reject) => {
			C.getData({
				c: 'tyzd_ggy2069',
				url: 'https://10.192.126.203/GeneralProServlet'
			}, (res) => {
				if (res.success) {
					resolve(res['data']['1'])
				} else {
					reject('获取工务轨道车信息失败')
				}
			})
		})
	},
	/**
	 * 获取计划信息
	 */
	getData_jh () {
		if (this.data.gongWuOther.gw_jh.sg && this.data.gongWuLayers.gw_jh.sg === null) {
			this.getData_jh_sg().then( ( sgData ) => {
				console.log( '获取施工计划位置信息', sgData )
				this.createLayer( '工务_施工计划', 'gw_jh', 'sg', sgData )
			} )
		}
		if (this.data.gongWuOther.gw_jh.wx && this.data.gongWuLayers.gw_jh.wx === null) {
			this.getData_jh_wx().then( ( wxData ) => {
				console.log( '获取施工计划位置信息', wxData )
				this.createLayer( '工务_维修计划', 'gw_jh', 'wx', wxData )
			} )
		}
	},
	/**
	 * 获取施工计划信息
	 * @returns {Promise}
	 */
	getData_jh_sg() {
		return new Promise((resolve, reject) => {
			C.getData( {
				c: 'tyzd_ggy2061',
				url: 'https://10.192.126.203/GeneralProServlet'
			}, ( res ) => {
				if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取施工计划位置信息失败' )
				}
			} )
		})
	},
	/**
	 * 获取维修计划信息
	 * @returns {Promise}
	 */
	getData_jh_wx() {
		return new Promise((resolve, reject) => {
			C.getData( {
				c: 'tyzd_ggy2064',
				url: 'https://10.192.126.203/GeneralProServlet'
			}, ( res ) => {
				if (res.success) {
					resolve( res['data']['1'] )
				} else {
					reject( '获取施工计划位置信息失败' )
				}
			} )
		})
	},
	/**
	 * 获取管辖范围信息
	 */
	getData_fw () {

	},
	/**
	 * 创建某种图例的全部Layer
	 * @param ty        图例类型
	 * @param mainType  类型解码大类
	 * @param subType   类型解码小类
	 * @param source    绘图数据源
	 */
	createLayer ( ty, mainType, subType, source ) {
		let group = L.layerGroup()
		this.data.gongWuLayers[mainType][subType] = group
		console.log( '创建Layer', this.data.layerRecipes[mainType][subType] )
		switch (this.data.layerRecipes[mainType][subType].type) {
			case 'line' :
				group = this.createLine( this.data.layerRecipes[mainType][subType], source, ty );
				break;
			case 'marker':
				group = this.createMarker( this.data.layerRecipes[mainType][subType], source, ty );
				break;
			case 'markercluster' :
				group = this.createMarkerCluster(this.data.layerRecipes[mainType][subType], source, ty);
				break;
		}
		console.log( 'Layer绘制完成', group )
		this.data.gongWuLayers[mainType][subType] = group
		this.filterLayers( ty )
	},
	/**
	 * 绘制线段
	 * @param recipe  线段绘制配置
	 * @param source  线段数据源
	 * @param ty      图例类型
	 * @returns {*}   绘制好的线段
	 */
	createLine ( recipe, source, ty ) {
		console.log( '绘制line', recipe, source )
		let group = L.layerGroup()
		source.map( ( item ) => {
			let pts = []
			let points = item.POINTS;
			if($vm.sys==="police"){
				points = item.points
				points=JSON.parse(points);
			}
			points.map( ( pt ) => {
				pts.push( [pt.GPSY, pt.GPSX] )
			} )
			let line = L.polyline( pts, {
				width: recipe.width,
				color: recipe.color
			} )
			line.on('click', (p) => {
				this.setMarkerClick(ty, item, p)
			})
			group.addLayer( line )
		} )
		return group
	},
	/**
	 * 绘制图标
	 * @param recipe  图标绘制配置
	 * @param source  图标数据源
	 * @param ty      图例类型
	 * @returns {*}   绘制好的图标
	 */
	createMarker ( recipe, source, ty ) {
		let isLight = $vm.config.superMap.lightMode === undefined ? false : $vm.config.superMap.lightMode
		console.log( '绘制marker', recipe, source )
		let group = L.layerGroup()
		source.map( ( item ) => {
			let marker = L.marker( {
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon( {
					className: recipe.className,
					data: item,
					html: isLight ? recipe.lightHtml : recipe.html
				} )
			} )
			marker.on('click', (p) => {
				this.setMarkerClick(ty, item, p)
			})
			group.addLayer( marker )
		} )
		return group
	},
	/**
	 * 绘制可聚合marker簇
	 * @param recipe  图标绘制配置
	 * @param source  图标数据源
	 * @param ty      图例类型
	 * @returns {*}   绘制好的图标Cluster
	 */
	createMarkerCluster(recipe, source, ty) {
		let isLight = $vm.config.superMap.lightMode === undefined ? false : $vm.config.superMap.lightMode
		console.log('绘制markerCluster', recipe, source)
		let group = L.markerClusterGroup({
			zoomToBoundsOnClick: false,
			maxClusterRadius: 20,
			disableClusteringAtZoom: 6,
			iconCreateFunction: (cluster) => {
				return cluster.getAllChildMarkers()[0].options.icon
			}
		})
		source.map((item) => {
			let marker = L.marker( {
				lat: item.GPSY,
				lng: item.GPSX
			}, {
				icon: L.divIcon( {
					className: recipe.className,
					data: item,
					html: isLight? recipe.lightHtml : recipe.html
				} )
			} )
			marker.on('click', (p) => {
				this.setMarkerClick(ty, item, p)
			})
			group.addLayer(marker)
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
		console.log('显示详情', item)
		this.createPopper(type, item, p)
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
	 * 生成popper弹框内容HTML
	 * @param type    图例类型
	 * @param item    图例数据
	 * @param marker  图标marker对象
	 */
	createPopper(type, item, marker) {
		const recipe = this.data.popperRecipes[this.data.tyDic[type].mainType][this.data.tyDic[type].subType]
		C.getData({
			c: recipe.c,
			s: $vm.sys==="police"?[item.PK_ID]:[[item.PK_ID]],
			url: C.ADDS.servGS
		}, (res) => {
			if ($vm.sys==="police"||res.success) {
				const info = $vm.sys==="police"?res[0]:res.data['1'][0];
				const popperTip = `<i class="${recipe.tipClass}"></i>`
				// 显示防洪抢险材料信息时，使用自定义渲染函数
				const popperBody =
						type !== '工务_防洪抢险材料及机具' ? `<div class="marker-gongwu-info" style="width: ${recipe.w}">
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
				     </div>` : this.generateQxTable(recipe, info)
				// console.log((popperTip + popperBody), {x: recipe.x, w: recipe.w, h: recipe.h})
				this.addPop(popperTip + '\n' + popperBody, marker, {x: recipe.x, w: recipe.w, h: recipe.h})
			} else {
				$vm.message.error('未查询到详情')
			}
		})
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
		let _style = recipe.overflowTooltip ? ('width: ' + (recipe.descriptionsSpan === 1 ? recipe.w : recipe.w * 0.45) + 'px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle') : ''
		recipe.descriptions.map((desc) => {
			item.push(`<div class="${_class}" style="${_style}" title="${desc.formatter === undefined ? info[desc.key] : desc.formatter(info[desc.key])}">
								   <span>${desc.label}: <label class="${desc.labelClass ? desc.labelClass : ''}">${desc.formatter === undefined ? info[desc.key] : desc.formatter(info[desc.key])}</label></span>
								 </div>`)
		})
		return item.join('')
	},
	/**
	 * 防洪抢险机具-生成备品清单表
	 * @param recipe      渲染配置
	 * @param info        清单信息
	 * @returns {string}  表格HTML
	 */
	generateQxTable(recipe, info) {
		let tbody = []
		// 接口返回字段名字典
		let keyDic = {
			RAIL: {
				name: '钢轨',
				unit: '根'
			},
			WOODEN_SLEEPER: {
				name: '木枕',
				unit: '根'
			},
			WASTE_SLEEPER: {
				name: '废砼枕',
				unit: '根'
			},
			BALLAST: {
				name: '道渣',
				unit: '方'
			},
			RUBBLE: {
				name: '片石',
				unit: '方'
			},
			TEMPORARY_SLEEPER: {
				name: '铺便线木枕及扣件',
				unit: '米'
			},
			CONSTRUCTION_BEAM8: {
				name: '施工便梁 (8m)',
				unit: '孔'
			},
			CONSTRUCTION_BEAM16: {
				name: '施工便梁 (16m)',
				unit: '孔'
			},
			CONSTRUCTION_BEAM24: {
				name: '施工便梁 (24m)',
				unit: '孔'
			},
			PREPAREWAR_BEAM16: {
				name: '战备梁 (16m)',
				unit: '孔'
			},
			PREPAREWAR_BEAM32: {
				name: '战备梁 (32m)',
				unit: '孔'
			},
			LOADER: {
				name: '装载机',
				unit: '台'
			},
			DIGGER: {
				name: '挖掘机',
				unit: '台'
			},
			STEEL_ARCH: {
				name: '钢拱架',
				unit: '榀'
			},
			WATER_FRAME: {
				name: '隧道引水板',
				unit: '块'
			},
			PASSIVE_NET: {
				name: '防护网被动网',
				unit: '㎡'
			},
			ACTIVE_NET: {
				name: '防护网主动网',
				unit: '㎡'
			},
			STEEL_STRIP: {
				name: 'W钢带',
				unit: '米'
			},
			ANCHOR: {
				name: '自进式锚杆',
				unit: '套'
			},
			BULLDOZER: {
				name: '推土机',
				unit: '台'
			}
		}
		for (let key in info) {
			if (key !== 'REMARKS' && key !== 'DUAN_NAME' && key !== 'LINE_NAME' && key !== 'PK_ID' && key !== 'SAVE_PLACE' && key !== 'MILEAGE') {
				console.log(key)
				if (info[key] !== '无') {
					tbody.push(`<tr><td>${keyDic[key].name}</td><td>${keyDic[key].unit}</td><td>${info[key]}</td></tr>`)
				}
			}
		}
		return `<div class="marker-gongwu-info" style="width: ${recipe.w}">
				       <table border="0" cellpadding="0" cellspacing="0">
					       <tbody>
					         <tr>
					           <td style="width: 120px">
					             <div class="${recipe.logoClass}"></div>
					             <div class="sub-tit">${recipe.subTit === undefined ? '' : recipe.subTit}</div>
					           </td>
					           <td style="display: flex; flex-direction: row; align-content: center; justify-content: center; align-items: center">
					             <div class="tit">${recipe.titString === undefined ? info[recipe.tit] : recipe.titString}</div>
					             <div class="tit2">${info[recipe.tit2]}</div>
					           </td>
							     </tr>
							     <tr>
							       <td colspan="2">
							         <div id="qxDetailTitle" style="width: 100%; height: 20px; display: flex; flex-direction: row; justify-content: space-evenly">
							           <span>线名: <label class="blue">${info.LINE_NAME}</label></span>
							           <span>里程: <label class="blue">${info.MILEAGE}</label></span>
							           <span>存放地点: <label class="blue">${info.SAVE_PLACE}</label></span>
											 </div>
											 <div id="qxTable" style="height: calc(100% - 40px)">
											   <table class="detail-table" cellpadding="0" cellspacing="0">
											     <thead><tr><th>名称</th><th>计量单位</th><th>数量</th></tr></thead>
											     <tbody>
											       ${tbody.join('')}
													 </tbody>
												 </table>
											 </div>
											 <div id="qxMemo">
											   <span>备注: ${info.REMARKS}</span>
											 </div>
										 </td>
							     </tr>
						     </tbody>
					     </table>
				     </div>`
	}
}
