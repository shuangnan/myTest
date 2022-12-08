export default {
	namespaced: true,
	state: {
		msgConnectFlag: false, //消息连接状态
		msgContent: "", //页面消息
		commandCentreMsg: "", //客运一体化指挥中心消息
		// 动车一体化消息---车务轮廓计划
		msgDCYTH_outlinePlan: {
			key: "",
			value: ""
		},
		mapGuiDaoCheMsg:"",//工务轨道车消息

	},
	mutations: {
		//更改消息连接状态
		changeMsgConnectFlag(state, flag) {
			state.msgConnectFlag = flag;
			// window.console.log("消息连接状态", state.msgConnectFlag);
			//方法调用 this.$store.commit("msg/changeMsgConnectFlag",true); 同步操作
			//值调用 this.$store.state.msg.msgFlag
		},
		//更改客运综控页面消息内容
		changeMsgContent(state, content) {
			state.msgContent = content;
		},
		//更改客运一体化指挥中心消息
		changecommandCentreMsg(state, content) {
			state.commandCentreMsg = content;
		},
		acceptMessageDCYTH(state, content) {
			const newData = {
				key: Math.random(),
				value: content
			};
			state.msgDCYTH_outlinePlan = newData;
		},
		//更改地图工务轨道车页面消息内容
		changeMapGuiDaoCheMsg(state, content) {
			state.mapGuiDaoCheMsg = content;
		},
	},
	actions: {
		//更改消息连接状态
		changeMsgConnectFlag(context, flag) {
			context.commit("changeMsgConnectFlag", flag);
			//方法调用 this.$store.dispatch("msg/changeMsgConnectFlag",true); 可以含有异步操作，例如行后台提交数据
			//值调用 this.$store.state.msg.msgFlag
		},
		//更改客运综控页面消息内容
		changeMsgContent(context, content) {
			context.commit("changeMsgContent", content);
		},
		//更改客运一体化指挥中心消息
		changecommandCentreMsg(context, content) {
			context.commit("changecommandCentreMsg", content);
		},
		//更改地图工务轨道车页面消息内容
		changeMapGuiDaoCheMsg(context, content) {
			debugger
			context.commit("changeMapGuiDaoCheMsg", content);
		},
	}
}
