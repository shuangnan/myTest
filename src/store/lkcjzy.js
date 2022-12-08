// 旅客乘降作业
export default {
	namespaced: true,
	state: {
		// 表格选择行
		selectedRows: [],
		// 是否为 预设规则
		isYuSheGuiZe: false,
		// 保存类型 新增规则\修改规则
		savetype:"新增规则",
		// 地标颜色
		dic_surfaceMark:[],
		// 进站方向
		dic_aspect:[],
	},
	mutations: {
		updateOpts(state, payload) {
			state[payload.key] = payload.value;
		}
	}
}
