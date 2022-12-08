// 客运一体化仓库
export default {
	namespaced: true,
	state: {
		// CTC转入
		dicCTCZr: [{
				text: "确认揭示“值守”状态牌（非集控站除外）",
				check:false,
				memo:""
			},
			{
				text: "值班干部到岗（遇危及行车安全时，可按规定先行处置，再确认值班干部到岗）",
				check:false,
				memo:""
			},
			{
				text: "确认符合转入非常站控（车站操作）的情况，并向列车调度员报到。",
				check:false,
				memo:""
			},
			{
				text: "向站段指挥中心报告",
				check:false,
				memo:""
			},
			{
				text: "确认放置CTC作业提示牌（非集控站除外）",
				check:false,
				memo:""
			},
			{
				text: "与列车调度员核对设备情况",
				check:false,
				memo:""
			},
			{
				text: "与列车调度员核对站内停留车（非集控站除外）",
				check:false,
				memo:""
			},
			{
				text: "与列车调度员核对列车运行计划（非集控站除外）",
				check:false,
				memo:""
			},
			{
				text: "与列车调度员核对邻站控制模式",
				check:false,
				memo:""
			},
			{
				text: "与列车调度员核对与本站有关调度命令（非集控站除外）",
				check:false,
				memo:""
			},
			{
				text: "确认按压“非常站控（操作方式转换）”按钮，转入非常站控（车站操作）",
				check:false,
				memo:""
			},
			{
				text: "确认登记《CTC控制模式转换登记簿》",
				check:false,
				memo:""
			},
		],
		// CTC转回
		dicCTCZh: [{
				text: "确认转入非常站控（车站操作）的原因已消除，申请转回基本操作方式",
				check:false,
				memo:""
			},
			{
				text: "确认信号设备状态：",
				check:false,
				memo:""
			},
			{
				text: "①CTC系统设备正常;",
				check:false,
				memo:""
			},
			{
				text: "②非常站控模式下车站联锁控制台没有正在执行的按钮操作。 ",
				check:false,
				memo:""
			},
			{
				text: "③信号设备:恢复常态；未恢复常态，报告列车调度员（转为车站操作除外）。",
				check:false,
				memo:""
			},
			{
				text: "确认“非常站控（操作方式转换）”按钮操作，转回基本操作方式",
				check:false,
				memo:""
			},
			{
				text: "确认登记《CTC控制模式转换登记簿》",
				check:false,
				memo:""
			},
			{
				text: "向站段指挥中心报告",
				check:false,
				memo:""
			},
			{
				text: "确认收回CTC作业提示牌（根据情况）",
				check:false,
				memo:""
			},
			{
				text: "确认揭示“间休”状态牌（根据情况）",
				check:false,
				memo:""
			},
		]
	},
	mutations: {},
	actions: {}
}
