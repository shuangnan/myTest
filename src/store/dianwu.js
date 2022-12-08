export default {
	namespaced: true,
	state: {
		currentSelected: {},
		currentSelectedD: [],
		currentSelectedSb: {}
	},
	mutations: {
		updateCurrentSelectItem(state, payload) {
			state.currentSelected = payload
			console.log('选择电务设备', state.currentSelected)
		},
		updateSelectedDwd(state, payload) {
			console.log(payload)
			state.currentSelectedD = payload
		},
		updateCurrentSelectedSb(state, payload) {
			state.currentSelectedSb = payload
		}
	}
}
