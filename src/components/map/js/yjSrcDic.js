import com from '../../../assets/com'
export default {
	/**
	 * 应急资源字典
	 */
	emergencyResourcesDic: {

		/**
		 * 字典条目格式
		 * 条目名称: 模块_资源项目名称 (如: 供电模块-供电臂 —— gd_gdb)
		 * visible: 控制该项是否显示的字段
		 * api: 查询该项资源使用的接口号
		 * sql: 调用查询接口的传参，如不需要传参则填写 []
		 * j: 资源位置经度字段，默认为 GPS_POINT_X
		 * w: 资源位置纬度字段，默认为 GPS_POINT_Y
		 * name: 应急资源名称
		 * desc: 应急资源统计表中显示的字段，key为字段名，text为字段含义
		 */

		'gd_gdb': {
			visible: 'gongDianOther.gd_sbss.ck_gdb',
			api: 'tyzd_zxy2002',
			sql: [['all', 'all', 'all']],
			j: 'GPS_POINT_X',
			w: 'GPS_POINT_Y',
			name: '供电臂',
			desc: [
				{
					key: 'LINE',
					text: '线别'
				},
				{
					key: 'DEPOT',
					text: '所属段'
				},
				{
					key: 'STN',
					text: '车站'
				},
				{
					key: 'BDS',
					text: '变电所',
				},
				{
					key: 'GDB',
					text: '供电臂'
				},
				{
					key: 'AREA',
					text: '停电影响范围'
				},
				{
					key: 'MILEAGE_START',
					text: '停电起始公里标'
				},
				{
					key: 'MILEAGE_END',
					text: '停电结束公里标'
				}
			]
		},
		'gd_bds': {
			visible: 'gongDianOther.gd_sbss.ck_bds',
			api: 'eqeh_zxy2034',
			sql: [['all', 'all']],
			j: 'GPS_POINT_X',
			w: 'GPS_POINT_Y',
			name: '变电所',
			desc: [
				{
					key: 'LINE_NAME',
					text: '线名'
				},
				{
					key: 'LINE_DIRECT',
					text: '行别'
				},
				{
					key: 'DEPOT',
					text: '所属单位'
				},
				{
					key: 'BDS_NAME',
					text: '变电所名称'
				},
				{
					key: 'GLB_MARK',
					text: '公里标'
				}
			]
		},
		'gd_yjdy': {
			visible: 'gongDianOther.gd_sbss.ck_yjdy',
			api: 'tyzd_zxy2003',
			sql: [['all']],
			j: 'GPS_POINT_X',
			w: 'GPS_POINT_Y',
			name: '应急电源',
			desc: [
				{
					key: 'LINE_NAME',
					text: '线别'
				},
				{
					key: 'STN_NAME',
					text: '设置地点'
				},
				{
					key: 'DEPOT',
					text: '设备管理单位'
				},
				{
					key: 'KVA',
					text: '变压器容量'
				},
				{
					key: 'TRACK',
					text: '接触网接入地点'
				},
				{
					key: 'GDB',
					text: '接触网连接支柱号'
				},
				{
					key: 'NOTE',
					text: '备注'
				}
			]
		},
		'gd_gdgdc': {
			visible: 'gongDianOther.gd_sbss.ck_yjc',
			api: 'tyzd_ggy2075',
			sql: [['', '']],
			j: 'GPS_POINT_X',
			w: 'GPS_POINT_Y',
			name: '供电轨道车',
			desc: [
				{
					key: 'LINE_NAME',
					text: '线名'
				},
				{
					key: 'DUAN_NAME',
					text: '段名'
				},
				{
					key: 'CJ',
					text: '车间'
				},
				{
					key: 'GQ',
					text: '工区'
				},
				{
					key: 'WORKTRAIN_TYPE',
					text: '车型'
				},
				{
					key: 'WORKTRAIN_NAME',
					text: '车号'
				},
				{
					key: 'TRAIN_STATES',
					text: '轨道车状态',
					formatter: (row, col, val, index) => {
						switch (val) {
							case '1': return '可用'
							case '2': return '不可用'
							case '3': return '备用'
							default: return '/'
						}
					}
				},
				{
					key: 'REASON',
					text: '不可用原因'
				},
				{
					key: 'PARK_PLACE',
					text: '日常停驻地点'
				},
				{
					key: 'WORK_RANGE',
					text: '主要抢修范围'
				},
				{
					key: 'STATION',
					text: '当前停留点'
				},
				{
					key: 'SJ_NAME',
					text: '司机姓名'
				},
				{
					key: 'SJ_PHONE',
					text: '司机电话'
				},
				{
					key: 'GL_NAME',
					text: '管理人员'
				},
				{
					key: 'GL_PHONE',
					text: '管理人员电话'
				},
				{
					key: 'SPEED',
					text: '构造速度'
				},
				{
					key: 'POWER',
					text: '功率'
				}
			]
		},
		'gd_dfx': {
			visible: 'gongDianOther.gd_jcw.ck_fxjyq',
			api: 'tyzd_zxy2004',
			sql: [],
			j: 'GPS_POINT_X',
			w: 'GPS_POINT_Y',
			name: '电分相',
			desc: [
				{
					key: 'NAME',
					text: '线名'
				},
				{
					key: 'ROW_TYPE',
					text: '行别',
					formatter: (row, col, val, index) => {
						switch (val) {
							case '8': return '上'
							case '9': return '下'
							case '10': return '单'
							default: return '/'
						}
					}
				},
				{
					key: 'CONSTRUCTION_TYPE',
					text: '施工单位'
				},
				// {
				// 	key: 'FK_DEVICE_TYOE_ID',
				// 	text: '设备类型',
				// 	formatter: (row, col, val, index) => {
				// 		switch (val) {
				// 			case '173': return '器件式'
				// 			case '174': return '关节式'
				// 			default: return '/'
				// 		}
				// 	}
				// },
				{
					key: 'IS_HIGHRAIL',
					text: '是否高铁设备',
					formatter: (row, col, val, index) => {
						switch (val) {
							case '0': return '否'
							case '1': return '是'
							default: return '/'
						}
					}
				},
				{
					key: 'DEVICE_LEVEL',
					text: '设备等级',
					formatter: (row, col, val, index) => {
						switch (val) {
							case '0': return '优良'
							case '1': return '合格'
							case '2': return '不合格'
							default: return '/'
						}
					}
				},
				{
					key: 'LENGTH',
					text: '长度'
				},
				{
					key: 'START_PILLAR_ID',
					text: '支柱号'
				},
				{
					key: 'USEDATE',
					text: '投用日期'
				}
			]
		},
		'gw_gwgdc': {
			visible: 'config.gw_sb.gdc',
			api: 'tyzd_ggy2072',
			sql: [['', '']],
			j: 'GPS_POINT_X',
			w: 'GPS_POINT_Y',
			name: '工务轨道车',
			desc: [
				{
					key: 'LINE',
          text: '线路名称'
				},
        {
          key: 'DW',
          text: '所属站段'
        },
        {
          key: 'CJ',
          text: '所属车间'
        },
        {
          key: 'GQ',
          text: '所属工区'
        },
        {
          key: 'TRAIN_NO',
          text: '轨道车号'
        },
        {
          key: 'TYPE',
          text: '轨道车种类'
        },
        {
          key: 'TRAIN_TYPE',
          text: '轨道车型号'
        },
        {
          key: 'PLACE',
          text: '日常停驻地点'
        },
        {
          key: 'GPS',
          text: '当前停留点'
        },
        {
          key: 'TRAIN_STATES',
          text: '轨道车状态',
          formatter: (row, col, val, index) => {
            switch (val) {
              case '1': return '可用'
              case '2': return '不可用'
              case '3': return '备用'
              default: return '/'
            }
          }
        },
        {
          key: 'REASON',
          text: '不可用原因'
        },
        {
          key: 'BEGIN_DATE',
          text: '值守开始日期'
        },
        {
          key: 'END_DATE',
          text: '值守结束日期'
        },
        {
          key: 'SPEED',
          text: '构造速度'
        },
        {
          key: 'POWER',
          text: '功率'
        },
        {
          key: 'PERSON_NAME',
          text: '联系人'
        },
        {
          key: 'PERSON_PHONE',
          text: '联系人电话'
        },
        {
          key: 'CJ_NAME',
          text: '综合机修车间值班人员'
        },
        {
          key: 'CJ_PHONE',
          text: '综合机修车间值班人员联系电话'
        }
			]
		},
    'gw_fhksd': {
      visible: 'config.gw_sb.ksd',
      api: 'tyzd_ggy2083',
      sql: [['', '1']],
      j: 'GPS_POINT_X',
      w: 'GPS_POINT_Y',
      name: '防洪看守点',
      desc: [
        {
          key: 'LINE_NAME',
          text: '线名'
        },
        {
          key: 'LINE_TYPE',
          text: '线别'
        },
        {
          key: 'LINE_DIRECT',
          text: '行别'
        },
        {
          key: 'LINE_SIDE',
          text: '侧别'
        },
        {
          key: 'FLOOD_LEVEL',
          text: '防洪等级'
        },
        {
          key: 'START_STN',
          text: '起始车站'
        },
        {
          key: 'END_STN',
          text: '终止车站'
        },
        {
          key: 'START_MILEAGE',
          text: '起始里程'
        },
        {
          key: 'END_MILEAGE',
          text: '终点里程'
        },
        {
          key: 'LINE_LENGTH',
          text: '长度'
        },
        {
          key: 'DEV_NAME',
          text: '设备名称'
        },
        {
          key: 'RISK',
          text: '预计风险'
        },
        {
          key: 'MEASURE',
          text: '预防措施'
        },
        {
          key: 'CALL_NO',
          text: '呼叫编号'
        },
        {
          key: 'GUARD',
          text: '看守期间'
        },
        {
          key: 'KSDDH',
          text: '看守点电话'
        },
        {
          key: 'KSDSH',
          text: '看守点市话'
        },
        // {
        //   key: 'LXD',
        //   text: '联系点职工姓名'
        // },
        // {
        //   key: 'LXDDH',
        //   text: '联系点职工电话'
        // },
        // {
        //   key: 'KSG1',
        //   text: '看守工姓名'
        // },
        // {
        //   key: 'KSGDH1',
        //   text: '看守工电话'
        // },
        // {
        //   key: 'KSG2',
        //   text: '看守工姓名'
        // },
        // {
        //   key: 'KSGDH2',
        //   text: '看守工电话'
        // },
        // {
        //   key: 'KSG3',
        //   text: '看守工姓名'
        // },
        // {
        //   key: 'KSGDH3',
        //   text: '看守工电话'
        // },
        // {
        //   key: 'ZD',
        //   text: '最近站点'
        // },
        // {
        //   key: 'ZDDH',
        //   text: '最近站点电话'
        // }
      ]
    },
		'gw_fhqxcljjj': {
			visible: 'config.gw_sb.qx',
			api: 'tyzd_ggy2125',
			sql: [['', '']],
			j: 'GPS_POINT_X',
			w: 'GPS_POINT_Y',
			name: '防洪抢险材料及机具',
			desc: [
				{
					key: 'LINE_NAME',
					text: '线名'
				},
				{
					key: 'SAVE_PLACE',
					text: '存放地点'
				},
				{
					key: 'MILEAGE',
					text: '里程'
				},
				{
					key: 'DUAN_NAME',
					text: '联系单位'
				},
				{
					key: 'RAIL',
					text: '钢轨（根）'
				},
				{
					key: 'WOODEN_SLEEPER',
					text: '木枕（根）'
				},
				{
					key: 'WASTE_SLEEPER',
					text: '废砼枕（根）'
				},
				{
					key: 'BALLAST',
					text: '道渣（方）'
				},
				{
					key: 'RUBBLE',
					text: '片石（方）'
				},
				{
					key: 'TEMPORARY_SLEEPER',
					text: '铺便线木枕及扣件（米）'
				},
				{
					key: 'CONSTRUCTION_BEAM8',
					text: '施工便梁（孔）（8m）'
				},
				{
					key: 'CONSTRUCTION_BEAM16',
					text: '施工便梁（孔）（16m）'
				},
				{
					key: 'CONSTRUCTION_BEAM24',
					text: '施工便梁（孔）（24m）'
				},
				{
					key: 'PREPAREWAR_BEAM16',
					text: '战备梁（孔）（16m）'
				},
				{
					key: 'PREPAREAWR_BEAM32',
					text: '战备梁（孔）（32m）'
				},
				{
					key: 'LOADER',
					text: '装载机（台）'
				},
				{
					key: 'DIGGER',
					text: '挖掘机（台）'
				},
				{
					key: 'STEEL_ARCH',
					text: '钢拱架（榀）'
				},
				{
					key: 'WATER_FRAME',
					text: '隧道引水板（块）'
				},
				{
					key: 'PASSIVE_NET',
					text: '防护网被动网（m2）'
				},
				{
					key: 'ACTIVE_NET',
					text: '防护网主动网（m2）'
				},
				{
					key: 'STEEL_STRIP',
					text: 'W钢带（米）'
				},
				{
					key: 'ANCHOR',
					text: '自进式锚杆（套）'
				},
				{
					key: 'BULLDOZER',
					text: '推土机（台）'
				},
				{
					key: 'REMARKS',
					text: '备注'
				}
			]
		}
	},
	/**
	 * 根据框选范围查询应急资源
	 * @param {Array} queryMatrix 查询条目矩阵 
	 * @param {Array} queryRegion 查询区域范围
	 * @returns {Promise}
	 */
	queryEmergencyResources(queryMatrix = [], queryRegion = []) {
		return new Promise((resolve, reject) => {
			// 未选定查询资源或无查询范围时
			if (queryMatrix.length === 0 || queryRegion.length === 0) {
				reject('未选择任何应急资源或未划定查询范围')
			}
			console.log('查询应急资源范围', queryRegion)
			console.log('查询应急资源条目', queryMatrix)
			this.generateApiQueryParams(queryMatrix, queryRegion).then((p) => {
				com.getData(p, (res) => {
					try {
						console.log('查询应急资源结果', res.data)
						let response = {}
						for (let i in res.data) {
							let itemName = queryMatrix[parseInt(i)-1]
							let itemDic = this.emergencyResourcesDic[itemName]
							console.log(itemDic)
							response[itemName] = {
								...itemDic,
								source: res.data[i]
							}
						}
						resolve(response)
					} catch (e) {
						reject(e)
					}
				})
			})
		})
	},
	/**
	 * 生成应急资源查询接口传参
	 * @param {Array} queryMatrix 
	 * @param {Array} queryRegion 
	 * @returns {Promise}
	 */
	generateApiQueryParams(queryMatrix = [], queryRegion = []) {
		return new Promise((resolve, reject) => {
			try {
				let sql = []
				let where = []
				let order = []
				queryMatrix.map((item) => {
					sql.push(this.emergencyResourcesDic[item].sql)
					where.push(this.emergencyResourcesDic[item].api)
					order.push({
						LON_KEY: this.emergencyResourcesDic[item].j,
						LAT_KEY: this.emergencyResourcesDic[item].w,
						TYPE: '1',
						POINT_LIST: queryRegion.map((pt) => {
							return [pt.y, pt.x]
						}),
						RADIUS: '10'
					})
				})
				resolve({
					c: 'eqeh_zxy9021',
					s: sql,
					w: where,
					o: order,
					url: 'https://10.192.126.203/GeneralProServlet'
				})
			} catch (e) {
				reject(e)
			}
		})
	}
}
