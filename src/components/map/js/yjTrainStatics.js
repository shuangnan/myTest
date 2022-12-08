export default {
	generateTrainStaticsData(data) {
		console.log('生成统计数据', data)

		// 获取列车中出现的所有线名
		const lineDic = this.generateLineDic(data)
		console.log('生成线别字典', lineDic)

		let stat = []

		// 生成"全部"线别，包括所有区间和站内车
		stat.push(this.generateAllLinesData(data, '全部'))

		// 按线别生成统计数据
		lineDic.map((line) => {
			stat.push(this.generateLineStaticsData(data, line))
		})

		console.log('完整统计数据', stat)
		return stat
	},
	/**
	 * 生成线别字典
	 * @param data
	 * @returns {*[]}
	 */
	generateLineDic(data) {
		let lines = []
		data.map((train) => {
			lines.push(train.LINE_NAME)
		})
		lines = Array.from(new Set(lines))
		return lines
	},
	/**
	 * 生成区间字典
	 * @param data
	 */
	generateSectionDic(data) {
		let dic = []
		data.map((train) => {
			if (train.LOCAL_FLAG !== 0) {
				// 是区间车
				dic.push(train.CURRNAME + '-' + train.NEXTNAME)
			}
		})
		dic = Array.from(new Set(dic))
		return dic
	},
	/**
	 * 生成站内字典
	 * @param data
	 */
	generateStationDic(data) {
		let dic = []
		data.map((train) => {
			if (train.LOCAL_FLAG === 0) {
				// 是站内车
				dic.push(train.CURRNAME)
			}
		})
		dic = Array.from(new Set(dic))
		return dic
	},
	generateLineStaticsData(data, lineName) {
		const lineTrains = data.filter((train) => {return train.LINE_NAME === lineName})
		return this.generateAllLinesData(lineTrains, lineName)
	},
	generateAllLinesData(data, lineName) {
		const sectionDic = this.generateSectionDic(data)
		const stationDic = this.generateStationDic(data)
		let details = []
		let allPSum = 0
		let allDSum = 0
		let allDEd = 0
		let allPEd = 0

		// 统计区间车
		sectionDic.map((section) => {
			let [curr, next] = section.split('-')
			let dSum = 0
			let pSum = 0
			let dEd = 0
			let pEd = 0
			let sectionTrains = []
			data.map((train) => {
				if (train.CURRNAME === curr && train.NEXTNAME === next && train.LOCAL_FLAG !== 0) {
					// 是该区间的区间车
					sectionTrains.push(train)
					if (train.trainType === 'D') {
						// 是动车
						dSum = dSum + 1
						allDSum = allDSum + 1
						if (parseInt(train.EDTIME) > 5) {
							// 超过5分钟即超时
							dEd = dEd + 1
							allDEd = allDEd + 1
						}
					} else if (train.trainType === 'P') {
						// 是普车
						pSum = pSum + 1
						allPSum = allPSum + 1
						if (parseInt(train.EDTIME) > 5) {
							// 超过5分钟即超时
							pEd = pEd + 1
							allPEd = allPEd + 1
						}
					}
				}
			})
			details.push({
				NAME: section,
				TYPE: '区间',
				COUNT: {
					D_SUM: dSum,
					P_SUM: pSum,
					D_ED: dEd,
					P_ED: pEd
				},
				TRAINS: sectionTrains
			})
		})

		// 统计站内车
		stationDic.map((station) => {
			let dSum, pSum, dEd, pEd = 0
			let stationTrains = []
			data.map((train) => {
				if (train.CURRNAME === station && train.LOCAL_FLAG === 0) {
					// 是该站的站内车
					stationTrains.push(train)
					if (train.trainType === 'D') {
						// 是动车
						dSum = dSum + 1
						allDSum = allDSum + 1
						if (parseInt(train.EDTIME) > 5) {
							// 超过5分钟即超时
							dEd = dEd + 1
							allDEd = allDEd + 1
						}
					} else if (train.trainType === 'P') {
						// 是普车
						pSum = pSum + 1
						allPSum = allPSum + 1
						if (parseInt(train.EDTIME) > 5) {
							// 超过5分钟即超时
							pEd = pEd + 1
							allPEd = allPEd + 1
						}
					}
				}
			})
			details.push({
				NAME: station,
				TYPE: '站内',
				COUNT: {
					D_SUM: dSum,
					P_SUM: pSum,
					D_ED: dEd,
					P_ED: pEd
				},
				TRAINS: stationTrains
			})
		})

		return {
			LINE_NAME: lineName,
			COUNT: {
				D_SUM: allDSum,
				P_SUM: allPSum,
				D_ED: allDEd,
				P_ED: allPEd
			},
			DETAILS: details
		}
	}
}
