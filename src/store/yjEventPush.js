export default {
	namespaced: true,
	state: {
		events: []
	},
	mutations: {
		updateEvents(state, payload) {
			if (payload.type == '1') {
				// 应急响应启动
				state.events.push(payload)
			} else {
				// 应急响应结束, 更新id指定的响应事件
				let eventId = payload.id
				let targetIndex = -1
				state.events.map((e, index) => {
					if (e.id === eventId) {
						// e = JSON.parse(JSON.stringify(payload))
						targetIndex = index
					}
				})
				if (targetIndex !== -1) {
					state.events.splice(targetIndex, 1)
				}
			}
			console.log('应急响应更新', state.events, payload)
		},
		initEvents(state, payload) {
			state.events = payload
			console.log('应急响应初始化', state.events)
		}
	}
}
